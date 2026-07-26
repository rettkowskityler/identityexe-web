<#
.SYNOPSIS
    Generates a report comparing Source Account Attributes to Identity Attributes based on the Attribute Sync Configuration.
.DESCRIPTION
    Uses parallel Runspace Pools for extracting Accounts and Identities simultaneously with exponential backoff handling 429 rate limits.
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$SourceId,

    [Parameter(Mandatory = $true)]
    [string]$RecipientEmail
)

# --- CONFIGURATION VARIABLES ---
$MaxConcurrency = 20
$Tenant = "ENTERYOURTENANTNAMEHERE"
$ClientId = "ENTERYOURCLIENTIDHERE"
$ClientSecret = "ENTERYOURCLIENTSECRETHERE"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$CurrentTime = Get-Date -Format "yyyyMMdd_HHmmss"

$BaseUrl = "https://$Tenant.api.identitynow.com"

# Clean SourceId if user passed 'sources/id'
$SourceId = $SourceId -replace '(?i)^sources/', ''

# --- 1. Authenticate and Get OAuth Token ---
Write-Host "Authenticating to $Tenant..." -ForegroundColor Cyan
$AuthBody = @{
    grant_type    = "client_credentials"
    client_id     = $ClientId
    client_secret = $ClientSecret
}
$TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body $AuthBody
$Headers = @{
    "Authorization"            = "Bearer $($TokenResponse.access_token)"
    "Content-Type"             = "application/json"
    "Accept"                   = "application/json"
    "X-SailPoint-Experimental" = "true"
}
$Token = $TokenResponse.access_token

# --- 1.5. Retrieve Source Details ---
Write-Host "Retrieving Source Details..." -ForegroundColor Cyan
$SourceInfoUri = "$BaseUrl/sources/v1/$SourceId"
$SourceName = $SourceId
try {
    $SourceInfo = Invoke-RestMethod -Method Get -Uri $SourceInfoUri -Headers $Headers
    $SourceName = $SourceInfo.name
} catch {
    Write-Warning "Could not fetch source name, falling back to ID."
}

$SafeSourceName = $SourceName -replace '[^a-zA-Z0-9]', '_'
$OutFile = "C:\Scripts\Script Exports\AttributeSyncReport_$($SafeSourceName)_$CurrentTime.csv"

# Make sure directory exists
$OutDir = Split-Path $OutFile
if ($OutDir -and -not (Test-Path -Path $OutDir)) {
    New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
}

# --- 2. Retrieve Attribute Sync Configuration ---
Write-Host "Retrieving Attribute Sync Configuration for source $SourceId..." -ForegroundColor Cyan
$SyncConfigUri = "$BaseUrl/sources/v1/$SourceId/attribute-sync-config"
try {
    $SyncConfigResponse = Invoke-RestMethod -Method Get -Uri $SyncConfigUri -Headers $Headers
}
catch {
    Write-Warning "Could not find Attribute Sync Config. Ensure source has it enabled or exists."
    throw $_
}

if (-not $SyncConfigResponse.attributes) {
    Write-Host "No attributes configured for sync on this source." -ForegroundColor Yellow
    exit
}

$ConfiguredAttributes = $SyncConfigResponse.attributes
Write-Host "Found $($ConfiguredAttributes.Count) mapped attributes in sync config." -ForegroundColor Green

# --- 3. Parallel Worker Block Definition ---
$WorkerScriptBlock = {
    param ($Task)

    $Headers = @{
        "Authorization"            = "Bearer $($Task.Token)"
        "Content-Type"             = "application/json"
        "Accept"                   = "application/json"
        "X-SailPoint-Experimental" = "true"
    }

    $RetryCount = 0
    $MaxRetries = 5
    $Success = $false
    $ResponseData = $null

    while ($RetryCount -lt $MaxRetries -and -not $Success) {
        try {
            if ($Task.Method -eq 'POST') {
                $ResponseData = Invoke-RestMethod -Method Post -Uri $Task.Uri -Headers $Headers -Body $Task.Body -TimeoutSec 60
            }
            else {
                $ResponseData = Invoke-RestMethod -Method Get -Uri $Task.Uri -Headers $Headers -TimeoutSec 60
            }
            $Success = $true
        }
        catch {
            $StatusCode = $null
            if ($_.Exception.Response) {
                $StatusCode = $_.Exception.Response.StatusCode
            }
            
            if ($StatusCode -eq 429) {
                $WaitMs = [math]::Pow(2, $RetryCount) * 1000 + (Get-Random -Minimum 100 -Maximum 500)
                Start-Sleep -Milliseconds $WaitMs
                $RetryCount++
            }
            else {
                return [PSCustomObject]@{
                    Success = $false
                    Type    = $Task.Type
                    Offset  = $Task.Offset
                    Data    = $null
                    Error   = $_.Exception.Message
                }
            }
        }
    }

    if (-not $Success) {
        return [PSCustomObject]@{
            Success = $false
            Type    = $Task.Type
            Offset  = $Task.Offset
            Data    = $null
            Error   = "Max retries reached due to 429"
        }
    }

    return [PSCustomObject]@{
        Success = $true
        Type    = $Task.Type
        Offset  = $Task.Offset
        Data    = $ResponseData
        Error   = $null
    }
}

# --- 4. Get Accounts and Identities Details ---
Write-Host "Fetching total accounts count..." -ForegroundColor Cyan
$FilterStr = [uri]::EscapeDataString("sourceId eq `"$SourceId`"")
$CountUri = "$BaseUrl/accounts/v1?filters=$FilterStr&count=true&limit=1"
$CountResponse = Invoke-WebRequest -Method Get -Uri $CountUri -Headers $Headers -UseBasicParsing
$xTotalCountHeader = $CountResponse.Headers["X-Total-Count"]
$TotalAccountsCount = if ($xTotalCountHeader -is [array]) { [int]$xTotalCountHeader[0] } else { [int]$xTotalCountHeader }
Write-Host "Total Accounts in source: $TotalAccountsCount"

$AccountLimit = 250
$SearchLimit = 250

$Tasks = @()

# Account Tasks
for ($i = 0; $i -lt $TotalAccountsCount; $i += $AccountLimit) {
    $Tasks += [PSCustomObject]@{
        Type   = "Account"
        Uri    = "$BaseUrl/accounts/v1?filters=$FilterStr&offset=$i&limit=$AccountLimit"
        Method = "GET"
        Body   = $null
        Offset = $i
        Token  = $Token
    }
}

# Identity (Search) Tasks
Write-Host "Fetching total identities count via Search..." -ForegroundColor Cyan
$SearchCountPayload = @{
    indices = @("identities")
    query   = @{ query = "@accounts(source.id:`"$SourceId`")" }
}
$SearchCountUri = "$BaseUrl/search/v1?count=true&limit=1"
$SearchCountResponse = Invoke-WebRequest -Method Post -Uri $SearchCountUri -Headers $Headers -Body ($SearchCountPayload | ConvertTo-Json -Depth 10) -UseBasicParsing
$xTotalIdentitiesCountHeader = $SearchCountResponse.Headers["X-Total-Count"]
$TotalIdentitiesCount = if ($xTotalIdentitiesCountHeader -is [array]) { [int]$xTotalIdentitiesCountHeader[0] } else { [int]$xTotalIdentitiesCountHeader }
Write-Host "Total Identities associated with source: $TotalIdentitiesCount"

for ($i = 0; $i -lt $TotalIdentitiesCount; $i += $SearchLimit) {
    $SearchPayload = @{
        indices           = @("identities")
        query             = @{ query = "@accounts(source.id:`"$SourceId`")" }
        queryResultFilter = @{
            includes = @("id", "name", "attributes", "identityState")
        }
    }
    $Tasks += [PSCustomObject]@{
        Type   = "Identity"
        Uri    = "$BaseUrl/search/v1?offset=$i&limit=$SearchLimit"
        Method = "POST"
        Body   = ($SearchPayload | ConvertTo-Json -Depth 10)
        Offset = $i
        Token  = $Token
    }
}

# --- 5. Execute Runspace Pool ---
Write-Host "Starting Runspace Pool with $MaxConcurrency threads..." -ForegroundColor Cyan
$Pool = [runspacefactory]::CreateRunspacePool(1, $MaxConcurrency)
$Pool.Open()
$Jobs = @()

foreach ($Task in $Tasks) {
    $PowerShell = [powershell]::Create().AddScript($WorkerScriptBlock).AddArgument($Task)
    $PowerShell.RunspacePool = $Pool
    $Jobs += [PSCustomObject]@{
        PowerShell = $PowerShell
        Handle     = $PowerShell.BeginInvoke()
        Task       = $Task
    }
}

Write-Host "Waiting for $($Jobs.Count) tasks to complete..."
$Completed = 0
while ($Completed -lt $Jobs.Count) {
    $Completed = ($Jobs | Where-Object { $_.Handle.IsCompleted }).Count
    Write-Progress -Activity "Fetching Data" -Status "$Completed / $($Jobs.Count) complete" -PercentComplete (($Completed / $Jobs.Count) * 100)
    Start-Sleep -Milliseconds 250
}
Write-Progress -Activity "Fetching Data" -Completed

$AllAccounts = @()
$AllIdentities = @()

foreach ($Job in $Jobs) {
    $Result = $Job.PowerShell.EndInvoke($Job.Handle)
    $Job.PowerShell.Dispose()

    if ($Result.Success) {
        if ($Result.Type -eq "Account") {
            $AllAccounts += $Result.Data
        }
        elseif ($Result.Type -eq "Identity") {
            $AllIdentities += $Result.Data
        }
    }
    else {
        Write-Warning "Failed task: $($Result.Type) at offset $($Result.Offset). Error: $($Result.Error)"
    }
}

$Pool.Close()
$Pool.Dispose()

Write-Host "Successfully gathered $($AllAccounts.Count) Accounts and $($AllIdentities.Count) Identities." -ForegroundColor Green

# --- 6. Correlation & Report Generation ---
Write-Host "Correlating data and evaluating attribute sync state..." -ForegroundColor Cyan

# Create a lookup table for identities by Identity ID
$IdentityMap = @{}
foreach ($Id in $AllIdentities) {
    $IdentityMap[$Id.id] = $Id
}

$ReportRows = @()

foreach ($Account in $AllAccounts) {
    $LinkedIdentity = $IdentityMap[$Account.identityId]
    $IdentityName = if ($LinkedIdentity) { $LinkedIdentity.name } else { "Uncorrelated" }
    $IdentityState = if ($LinkedIdentity.identityState) { 
        $LinkedIdentity.identityState 
    }
    elseif ($LinkedIdentity.attributes.identityState) { 
        $LinkedIdentity.attributes.identityState 
    }
    else { 
        "N/A" 
    }
    
    foreach ($AttrConfig in $ConfiguredAttributes) {
        $IdAttrName = $AttrConfig.name
        $AcctAttrName = $AttrConfig.target
        $IsEnabled = $AttrConfig.enabled

        $AcctValue = $Account.attributes.$AcctAttrName
        
        $IdValue = $null
        if ($LinkedIdentity -and $LinkedIdentity.attributes) {
            $IdValue = $LinkedIdentity.attributes.$IdAttrName
        }

        # Handle formatting for array comparison and string representation
        $AcctValStr = if ($AcctValue -is [array]) { $AcctValue -join ', ' } else { [string]$AcctValue }
        $IdValStr = if ($IdValue -is [array]) { $IdValue -join ', ' } else { [string]$IdValue }

        # For comparison, null and empty string might be equivalent
        $IsMatch = ($AcctValStr -eq $IdValStr)

        $ReportRows += [PSCustomObject]@{
            "Identity Name"     = $IdentityName
            "Identity State"    = $IdentityState
            "Account Name"      = $Account.name
            "Account NativeID"  = $Account.nativeIdentity
            "Config: ID Attr"   = $IdAttrName
            "Config: Acct Attr" = $AcctAttrName
            "Sync Enabled"      = $IsEnabled
            "Identity Value"    = $IdValStr
            "Account Value"     = $AcctValStr
            "In Sync?"          = $IsMatch
        }
    }
}

Write-Host "Exporting to $OutFile..." -ForegroundColor Cyan
$ReportRows | Export-Csv -Path $OutFile -NoTypeInformation
Write-Host "Export Complete!" -ForegroundColor Green

# --- 7. Emailing Report ---
if ($RecipientEmail) {
    Write-Host "Sending report via email to $RecipientEmail..." -ForegroundColor Cyan

    $SmtpServer = "smtp.gmail.com"
    $SmtpPort = 587
    $FromEmail = "ENTERYOUREMAILHERE"
    $Subject = "Attribute Sync Report Crystal Ball - Source $SourceName ($Tenant)"
    
    $SmtpUsername = "ENTERYOUREMAILHERE"
    $SmtpPassword = "ENTERYOURPASSWORDHERE"
    $SecPassword = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
    $SmtpCredentials = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)
    
    $TotalChecked = $ReportRows.Count
    $TotalOutOfSync = ($ReportRows | Where-Object { -not $_."In Sync?" -and $_."Sync Enabled" }).Count

    $Body = @"
<html>
<body>
    <p>Hello,</p>
    <p>The SailPoint Attribute Sync Crystal Ball Report for source <b>$SourceName</b> has been generated.</p>
    <p><b>Details:</b></p>
    <ul>
        <li><b>Tenant:</b> $Tenant</li>
        <li><b>Accounts Processed:</b> $($AllAccounts.Count)</li>
        <li><b>Total Attribute Checks:</b> $TotalChecked</li>
        <li><b>Out-Of-Sync Attributes (Enabled only):</b> $TotalOutOfSync</li>
        <li><b>Generated At:</b> $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</li>
    </ul>
    <p>The comprehensive report has been attached to this email.</p>
    <br/>
    <p><i>This is an automated message. Please do not reply.</i></p>
</body>
</html>
"@

    $MailParams = @{
        To          = $RecipientEmail
        From        = $FromEmail
        Subject     = $Subject
        Body        = $Body
        BodyAsHtml  = $true
        SmtpServer  = $SmtpServer
        Port        = $SmtpPort
        Attachments = $OutFile
        UseSsl      = $true
        Credential  = $SmtpCredentials
    }

    try {
        Send-MailMessage @MailParams
        Write-Host "Email sent successfully to $RecipientEmail." -ForegroundColor Green
    }
    catch {
        Write-Warning "Failed to send email to $RecipientEmail. Error: $_"
    }
}

