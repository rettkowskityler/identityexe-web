param (
    [Parameter(Mandatory = $true)][string]$SourceId,
    [Alias("Preview")]
    [string]$PreviewArg = "false"
)

# Safely parse the PTA form string into a true boolean
$Preview = ($PreviewArg.Trim().ToLower() -eq "true")
# We have to do this since we can't call Write-Log before it's defined. We'll log it right after Logger definition.
# --- Hardcoded Configuration ---
$TenantName = "{tenant}"
$ClientId = "{clientId}"
$ClientSecret = "{clientSecret}"

$EmailAddress = "admin@yourdomain.com"
$SmtpServer = "smtp.gmail.com"
$SmtpPort = 587
$SmtpUsername = "admin@yourdomain.com"
$SmtpPassword = "{smtp_password}"

$BackupDir = "C:\Scripts\Source Exports" # Change this to your preferred export folder (e.g., "D:\powershell\ISC\temp")

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# --- Logger ---
$LogFile = Join-Path -Path $PSScriptRoot -ChildPath "logs.txt"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $LogLine = "[$Timestamp] [$Level] $Message"
    if ($Level -eq "ERROR" -or $Level -eq "WARN") {
        Write-Warning $LogLine
    }
    else {
        Write-Host $LogLine
    }
    Add-Content -Path $LogFile -Value $LogLine
}

# --- Initialization & Auth ---
Write-Log "Initializing Offboard-Source script for SourceId: $SourceId"
Write-Log "Preview Parameter Received: '$PreviewArg' -> Evaluated as: $Preview"
$BaseUrl = "https://$TenantName.api.identitynow.com"

try {
    $tokenRequest = Invoke-RestMethod -Method Post -uri "$BaseUrl/oauth/token?grant_type=client_credentials&client_id=$ClientId&client_secret=$ClientSecret"
    $headertoken = $tokenRequest.access_token
    $GlobalHeaders = @{
        "Content-Type"             = "application/json"
        "Accept"                   = "application/json"
        "Authorization"            = "Bearer $headertoken"
        "X-SailPoint-Experimental" = "true"
    }
    Write-Log "Authentication successful."
}
catch {
    Write-Log -Level "ERROR" "Failed to authenticate: $_"
    throw "Failed to authenticate: $_"
}

# Helper to invoke REST API
function Invoke-IscApi {
    param (
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Body = $null,
        [string]$ContentType = "application/json"
    )
    
    $localHeaders = $GlobalHeaders.Clone()
    $localHeaders["Content-Type"] = $ContentType

    $params = @{
        Uri     = "$BaseUrl$Uri"
        Method  = $Method
        Headers = $localHeaders
    }
    if ($Body) { $params.Body = $Body }
    
    try {
        return Invoke-RestMethod @params
    }
    catch {
        throw $_
    }
}

# --- Parallel Pagination Helper ---
function Get-IscPaginatedDataParallel {
    param([string]$Endpoint, [string]$Filters)

    $FullUrl = "$BaseUrl$Endpoint"
    if ($Filters) {
        $FullUrl += "?filters=$Filters&count=true&limit=1"
    }
    else {
        $FullUrl += "?count=true&limit=1"
    }

    # Get total count
    try {
        # Using Invoke-WebRequest for backward compatibility with PS 5.1 (no -ResponseHeadersVariable needed)
        $countResponse = Invoke-WebRequest -Uri $FullUrl -Method GET -Headers $GlobalHeaders -UseBasicParsing
        $headerValue = $countResponse.Headers["X-Total-Count"]
        if ($headerValue -is [array]) { $headerValue = $headerValue[0] }
        $totalCount = [int]$headerValue
    }
    catch {
        Write-Log -Level "ERROR" "Failed to get total count for $Endpoint : $_"
        throw $_
    }

    if ($totalCount -eq 0) { return @() }

    $limit = 250
    $pages = [math]::Ceiling($totalCount / $limit)
    Write-Log "Fetching $totalCount items in $pages pages from $Endpoint ..."

    $RunspacePool = [runspacefactory]::CreateRunspacePool(1, 10)
    $RunspacePool.Open()
    $Jobs = @()

    for ($i = 0; $i -lt $pages; $i++) {
        $offset = $i * $limit
        $pageUrl = "$BaseUrl$Endpoint"
        $pageUrl += if ($Filters) { "?filters=$Filters&limit=$limit&offset=$offset" } else { "?limit=$limit&offset=$offset" }

        $ScriptBlock = {
            param($url, $headers)
            try {
                $res = Invoke-RestMethod -Uri $url -Method GET -Headers $headers
                return $res
            }
            catch {
                throw $_
            }
        }

        $PowerShell = [powershell]::Create().AddScript($ScriptBlock).AddArgument($pageUrl).AddArgument($GlobalHeaders)
        $PowerShell.RunspacePool = $RunspacePool
        
        $Jobs += [PSCustomObject]@{
            Pipe   = $PowerShell
            Status = $PowerShell.BeginInvoke()
        }
    }

    $results = @()
    foreach ($Job in $Jobs) {
        $Job.Status.AsyncWaitHandle.WaitOne() | Out-Null
        $data = $Job.Pipe.EndInvoke($Job.Status)
        if ($Job.Pipe.HadErrors) {
            Write-Log -Level "ERROR" "Parallel fetch error: $($Job.Pipe.Streams.Error[0])"
            throw $Job.Pipe.Streams.Error[0]
        }
        $results += $data
        $Job.Pipe.Dispose()
    }
    
    $RunspacePool.Close()
    $RunspacePool.Dispose()
    
    return $results
}

# --- 1. Pre-Flight Dependency Checks ---
Write-Log "--- Starting Pre-Flight Dependency Checks ---"

$sourceDetails = Invoke-IscApi -Uri "/sources/v1/$SourceId"
$sourceName = $sourceDetails.name

# Check Identity Profiles
$idProfiles = Invoke-IscApi -Uri "/identity-profiles/v1"
$sourceIsReferenced = $false
foreach ($profile in $idProfiles) {
    if ($profile.authoritativeSource.id -eq $SourceId) {
        Write-Log -Level "WARN" "Source is used as authoritativeSource in Identity Profile: $($profile.name)"
        $sourceIsReferenced = $true
    }
    else {
        # Check mapping logic for attribute references
        $profileJson = $profile | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue
        if ($profileJson -match $SourceId -or $profileJson -match [regex]::Escape($sourceName)) {
            Write-Log -Level "WARN" "Source is mapped as an attribute in Identity Profile: $($profile.name)"
            $sourceIsReferenced = $true
        }
    }
}

# Check Transforms
$transforms = Invoke-IscApi -Uri "/transforms/v1"

foreach ($transform in $transforms) {
    $transformJson = $transform | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue
    if ($transformJson -match $SourceId -or $transformJson -match [regex]::Escape($sourceName)) {
        Write-Log -Level "WARN" "Source ID or Name found in Transform: $($transform.name)"
        $sourceIsReferenced = $true
    }
}

if ($sourceIsReferenced) {
    Write-Log -Level "ERROR" "Source is referenced by Identity Profiles or Transforms. Aborting script to prevent breaking changes."
    throw "Source is referenced by Identity Profiles or Transforms. Aborting script to prevent breaking changes."
}
Write-Log "Pre-Flight Checks Passed."

# --- 2. Export Phase ---
Write-Log "--- Starting Export Phase ---"
$ExportDir = "C:\Scripts\Source Exports\Export_$SourceId"
if (-not (Test-Path $ExportDir)) { New-Item -ItemType Directory -Path $ExportDir | Out-Null }

try {
    # Source Details
    $sourceDetails = Invoke-IscApi -Uri "/sources/v1/$SourceId"
    $sourceName = $sourceDetails.name
    $sourceDetails | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue | Set-Content -Path (Join-Path $ExportDir "source.json")
    Write-Log "Exported Source JSON"

    # Schemas
    $schemas = Invoke-IscApi -Uri "/sources/v1/$SourceId/schemas"
    $schemas | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue | Set-Content -Path (Join-Path $ExportDir "schemas.json")
    Write-Log "Exported Schemas JSON"

    # Attribute Sync Config
    try {
        $attrSync = Invoke-IscApi -Uri "/sources/v1/$SourceId/attribute-sync-config"
        $attrSync | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue | Set-Content -Path (Join-Path $ExportDir "attribute_sync_config.json")
        Write-Log "Exported Attribute Sync Config JSON"
    }
    catch {
        Write-Log -Level "WARN" "No Attribute Sync Config found or error retrieving it."
    }

    # Accounts
    Write-Log "Exporting Accounts (Multithreaded)..."
    $accounts = Get-IscPaginatedDataParallel -Endpoint "/accounts/v1" -Filters "sourceId eq `"$SourceId`""
    $accounts | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue | Set-Content -Path (Join-Path $ExportDir "accounts.json")
    Write-Log "Exported $($accounts.Count) Accounts"

    # Entitlements
    Write-Log "Exporting Entitlements (Multithreaded)..."
    $entitlements = Get-IscPaginatedDataParallel -Endpoint "/entitlements/v1" -Filters "source.id eq `"$SourceId`""
    $entitlements | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue | Set-Content -Path (Join-Path $ExportDir "entitlements.json")
    Write-Log "Exported $($entitlements.Count) Entitlements"

    # Access Profiles
    Write-Log "Exporting Access Profiles..."
    $accessProfiles = Invoke-IscApi -Uri "/access-profiles/v1?filters=source.id eq `"$SourceId`""
    
    $apDir = Join-Path $ExportDir "AccessProfiles"
    if (-not (Test-Path $apDir)) { New-Item -ItemType Directory -Path $apDir | Out-Null }

    foreach ($ap in $accessProfiles) {
        $apFileName = "AccessProfile_$($ap.id).json"
        $ap | ConvertTo-Json -Depth 100 -WarningAction SilentlyContinue | Set-Content -Path (Join-Path $apDir $apFileName)
    }
    Write-Log "Exported $($accessProfiles.Count) Access Profiles to individual JSON files."

}
catch {
    Write-Log -Level "ERROR" "Failed during export phase: $_"
    throw "Failed during export phase: $_"
}

# --- 3. Zip and Email Phase ---
Write-Log "--- Starting Zip and Email Phase ---"
$ZipPath = Join-Path $BackupDir "Backup_$SourceId.zip"
try {
    if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
    Compress-Archive -Path "$ExportDir\*" -DestinationPath $ZipPath -Force
    Write-Log "Compressed backup to $ZipPath"

    $SecPassword = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
    $SmtpCredentials = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)

    $accountCount = if ($accounts) { $accounts.Count } else { 0 }
    $entitlementCount = if ($entitlements) { $entitlements.Count } else { 0 }
    $apCount = if ($accessProfiles) { $accessProfiles.Count } else { 0 }

    if ($Preview) {
        $Subject = "[PREVIEW] SailPoint Source Offboard Backup - $sourceName"
        $Body = @"
This is a PREVIEW of the offboarding process for Source: $sourceName ($SourceId).
NO RESOURCES WERE DELETED.

The attached zip file contains the full export of the source configuration, which includes:
- Accounts: $accountCount
- Entitlements: $entitlementCount
- Access Profiles: $apCount

If this looks correct, you can submit the offboarding form again with the 'Turn On Preview Mode' toggle disabled to fully delete this source and its dependencies.
"@
    }
    else {
        $Subject = "SailPoint Source Offboard Backup - $sourceName"
        $Body = @"
Attached is the automated backup for Source: $sourceName ($SourceId) prior to deletion.

The attached zip file contains the full export of the source configuration, which includes:
- Accounts: $accountCount
- Entitlements: $entitlementCount
- Access Profiles: $apCount

This source and all its associated data have been permanently offboarded.
"@
    }

    $MailParams = @{
        To          = $EmailAddress
        From        = $SmtpUsername
        Subject     = $Subject
        Body        = $Body
        SmtpServer  = $SmtpServer
        Port        = $SmtpPort
        UseSsl      = $true
        Credential  = $SmtpCredentials
        Attachments = $ZipPath
    }
    
    Send-MailMessage @MailParams
    Write-Log "Successfully sent backup email to $EmailAddress"

}
catch {
    Write-Log -Level "ERROR" "Failed to zip or send email: $_"
    throw "Failed to zip or send email: $_"
}

# --- 4. Reset Source Accounts Phase ---
Write-Log "--- Starting Reset Source Accounts Phase ---"
$BulkRemoveUrl = "$BaseUrl/sources/v1/$SourceId/remove-accounts"
Write-Log "Attempting bulk removal on source $SourceId..."
$bulkRemovalComplete = $false
$pollCount = 0
$maxPolls = 60 # 60 * 15 seconds = 15 minutes max wait time

while (-not $bulkRemovalComplete -and $pollCount -lt $maxPolls) {
    try {
        if ($Preview) {
            Write-Log "[PREVIEW] Would have executed POST to $BulkRemoveUrl"
            $bulkRemovalComplete = $true
        }
        else {
            Invoke-RestMethod -Uri $BulkRemoveUrl -Method POST -Headers $GlobalHeaders | Out-Null
            Write-Log "Bulk removal completed with no blocking accounts."
            $bulkRemovalComplete = $true
        }
    }
    catch {
        $statusCode = $null
        if ($_.Exception.Response) { 
            $statusCode = [int]$_.Exception.Response.StatusCode 
        }
        
        if ($statusCode -eq 400) {
            Write-Log -Level "WARN" "Bulk removal failed with 400 Bad Request. Analyzing server message..."
            
            $errorJsonStr = ""
            if ($null -ne $_.ErrorDetails) {
                $errorJsonStr = $_.ErrorDetails.Message
            }
            elseif ($null -ne $_.Exception.Response) {
                $errorStream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorStream)
                $errorJsonStr = $reader.ReadToEnd()
            }
            
            $errorJson = $errorJsonStr | ConvertFrom-Json
            $messageText = $errorJson.messages[0].text
            Write-Log "Server Message: $messageText"
            
            if ($messageText -match "Identity Tasks are in progress") {
                $pollCount++
                Write-Log -Level "INFO" "Identity Tasks are still in progress. Waiting 15 seconds before retrying (Attempt $pollCount / $maxPolls)..."
                Start-Sleep -Seconds 15
                continue
            }
            
            # Not a task in progress, check for Source Owners bug
            Write-Log -Level "WARN" "Checking for the 'Source Owners' bug..."
            $matches = [regex]::Matches($messageText, '\b[a-fA-F0-9]{32}\b')
            $badAccountIds = @($matches | ForEach-Object { $_.Value })
            
            if ($badAccountIds.Count -gt 0) {
                Write-Log "Extracted $($badAccountIds.Count) problematic account IDs that need surgical removal."
                
                $completedCount = 0
                foreach ($accountId in $badAccountIds) {
                    $url = "$BaseUrl/accounts/v1/$accountId/remove"
                    $retryCount = 0
                    $success = $false
                    
                    while (-not $success -and $retryCount -lt 5) {
                        try {
                            Invoke-RestMethod -Uri $url -Method POST -Headers $GlobalHeaders | Out-Null
                            #Write-Log "[TEST MODE] Would have executed POST to $url"
                            $success = $true
                            $completedCount++
                            Write-Log "[$completedCount / $($badAccountIds.Count)] Successfully removed blocking account ID: $accountId"
                        }
                        catch {
                            $subStatusCode = $null
                            if ($_.Exception.Response) { $subStatusCode = [int]$_.Exception.Response.StatusCode }
                            
                            if ($subStatusCode -eq 429) {
                                $retryCount++
                                Write-Log -Level "WARN" "Rate limit hit for $accountId. Retrying in 2 seconds..."
                                Start-Sleep -Seconds 2
                            }
                            else {
                                Write-Log -Level "WARN" "Failed to remove $accountId : $_"
                                break
                            }
                        }
                    }
                    if (-not $success) { Write-Log -Level "WARN" "Failed to remove $accountId after 5 retries." }
                }
                Write-Log "Surgical removal complete."
                
                Write-Log "Attempting the bulk removal endpoint again now that the blockers are cleared..."
                Start-Sleep -Seconds 3
                # We will let the while loop continue and it will retry the bulk removal at the top
            }
            else {
                Write-Log -Level "ERROR" "Could not parse account IDs from the error message. Exiting."
                throw "Could not parse account IDs from the error message."
            }
        }
        else {
            Write-Log -Level "ERROR" "An unexpected error occurred during bulk removal: $_"
            throw "An unexpected error occurred during bulk removal: $_"
        }
    }
}
if (-not $bulkRemovalComplete) {
    Write-Log -Level "ERROR" "Bulk removal failed to complete after maximum retries. Exiting."
    throw "Bulk removal failed to complete after maximum retries."
}

# --- 5. Dependency Removal Phase ---
Write-Log "--- Starting Dependency Removal Phase ---"

# Remove Source from Service Desk Integrations (SDIM)
try {
    $sdims = Invoke-IscApi -Uri "/service-desk-integrations/v1"
    if ($sdims) {
        foreach ($sdim in $sdims) {
            $hasSource = $false
            $sourceIndex = -1
            $newRefs = @()
            
            if ($sdim.provisioningConfig -and $sdim.provisioningConfig.managedResourceRefs) {
                $oldRefs = @($sdim.provisioningConfig.managedResourceRefs)
                for ($i = 0; $i -lt $oldRefs.Count; $i++) {
                    if ($oldRefs[$i].id -eq $SourceId -and $oldRefs[$i].type -eq "SOURCE") {
                        $hasSource = $true
                        $sourceIndex = $i
                    }
                    else {
                        $newRefs += $oldRefs[$i]
                    }
                }
            }
            if ($hasSource) {
                Write-Log "Found Source referenced in SDIM at index $sourceIndex $($sdim.name). Removing reference..."
                $sdim.provisioningConfig | Add-Member -MemberType NoteProperty -Name "managedResourceRefs" -Value $newRefs -Force
                
                # Cleanup parallel array attributes to prevent validation mismatches (e.g. catalogItem, assignmentGroup)
                if ($sdim.attributes) {
                    function Remove-SdimSourceMap {
                        param ($Object, $TargetSourceId)
                        if ($null -eq $Object) { return }

                        if ($Object -is [System.Management.Automation.PSCustomObject] -or $Object -is [System.Collections.IDictionary]) {
                            
                            # If this object contains a key that perfectly matches our Source ID, delete the key!
                            if ($Object.PSObject.Properties.Match($TargetSourceId).Count -gt 0) {
                                $Object.PSObject.Properties.Remove($TargetSourceId)
                                Write-Log "Removed Source ID mapping from an SDIM attribute dictionary."
                            }

                            # Recursively search all child objects (e.g., drilling down into serviceRequest.provision.catalogItem)
                            # (We cast to array to avoid collection modified exceptions)
                            foreach ($prop in @($Object.PSObject.Properties)) {
                                $val = $prop.Value
                                if ($val -is [System.Management.Automation.PSCustomObject] -or $val -is [System.Collections.IDictionary]) {
                                    Remove-SdimSourceMap -Object $val -TargetSourceId $TargetSourceId
                                }
                            }
                        }
                    }

                    Remove-SdimSourceMap -Object $sdim.attributes -TargetSourceId $SourceId
                }

                $body = $sdim | ConvertTo-Json -Depth 100
                if ($Preview) {
                    Write-Log "[PREVIEW] Would have removed Source from SDIM: $($sdim.name)"
                }
                else {
                    Invoke-IscApi -Uri "/service-desk-integrations/v1/$($sdim.id)" -Method PUT -Body $body | Out-Null
                    Write-Log "Successfully removed Source from SDIM: $($sdim.name)"
                }
            }
        }
    }
}
catch {
    Write-Log -Level "ERROR" "Failed to remove Source from SDIMs: $_"
    throw "Failed to remove Source from SDIMs: $_"
}

# Delete Apps
try {
    $allApps = Invoke-IscApi -Uri "/source-apps/v1"
    $apps = $allApps | Where-Object { $_.source.id -eq $SourceId -or $_.sourceId -eq $SourceId }
    if ($apps) {
        Write-Log "Found $($apps.Count) dependent Apps. Deleting..."
        foreach ($app in $apps) {
            if ($Preview) {
                Write-Log "[PREVIEW] Would have deleted App: $($app.name)"
            }
            else {
                Invoke-IscApi -Uri "/source-apps/v1/$($app.id)" -Method DELETE
                Write-Log "Deleted App: $($app.name)"
            }
        }
    }
}
catch {
    Write-Log -Level "ERROR" "Failed to delete dependent Apps: $_"
    throw "Failed to delete dependent Apps: $_"
}

# Disable and Delete Access Profiles
try {
    if ($accessProfiles) {
        Write-Log "Found $($accessProfiles.Count) dependent Access Profiles. Disabling and Deleting..."
        foreach ($ap in $accessProfiles) {
            if ($Preview) {
                Write-Log "[PREVIEW] Would have disabled and deleted Access Profile: $($ap.name)"
            }
            else {
                # Disable
                $patchBody = '[{"op": "replace", "path": "/enabled", "value": false}]'
                Invoke-IscApi -Uri "/access-profiles/v1/$($ap.id)" -Method PATCH -Body $patchBody -ContentType "application/json-patch+json" | Out-Null
                
                # Delete
                Invoke-IscApi -Uri "/access-profiles/v1/$($ap.id)" -Method DELETE
                Write-Log "Deleted Access Profile: $($ap.name)"
            }
        }
    }
}
catch {
    Write-Log -Level "ERROR" "Failed to delete dependent Access Profiles: $_"
    throw "Failed to delete dependent Access Profiles: $_"
}

# --- 6. Source Deletion Phase ---
Write-Log "--- Starting Source Deletion Phase ---"
try {
    if ($Preview) {
        Write-Log "[PREVIEW] Would have deleted Source $sourceName ($SourceId)"
        Write-Log "Preview complete. Check $ExportDir for export files. Run without -Preview to fully offboard."
    }
    else {
        # Give the backend a few seconds to register dependency removals and account wipes
        Write-Log "Waiting 10 seconds for backend to sync before final source deletion..."
        Start-Sleep -Seconds 10

        Invoke-IscApi -Uri "/sources/v1/$SourceId" -Method DELETE
        Write-Log "SUCCESS! Source $sourceName ($SourceId) has been successfully deleted."
    }
}
catch {
    Write-Log -Level "ERROR" "Failed to delete Source: $_"
    throw "Failed to delete Source: $_"
}

Write-Log "--- Script Complete ---"

