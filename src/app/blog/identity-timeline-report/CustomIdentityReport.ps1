<#
.SYNOPSIS
    Generates a comprehensive chronological report of all events, account activities, access requests, and work items for a given Identity ID in SailPoint ISC.
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$IdentityId,

    [Parameter(Mandatory = $true)]
    [string]$Tenant,

    [Parameter(Mandatory = $false)]
    [string[]]$Categories = @(
        'Identity Lifecycle',
        'Audit Event',
        'Account Activity',
        'Access Request',
        'Manual Work Item'
    ),

    [Parameter(Mandatory = $false)]
    [string]$RecipientEmail
)

# --- PARAMETER NORMALIZATION ---
# Handle cases where Categories is passed as a JSON array string or a comma-separated string
if ($Categories.Count -eq 1) {
    if ($Categories[0] -match '^\s*\[.*\]\s*$') {
        try {
            $Categories = ConvertFrom-Json $Categories[0]
        } catch {
            Write-Host "Warning: Failed to parse Categories parameter as JSON. Using original string."
        }
    } elseif ($Categories[0] -match ',') {
        $Categories = $Categories[0] -split ',' | ForEach-Object { $_.Trim() }
    }
}
# -------------------------------

# --- CONFIGURATION VARIABLES ---
# Replace these values with your SailPoint Personal Access Client Credentials
$ClientId     = "CLIENTIDHERE"
$ClientSecret = "CLIENTSECRETHERE"

$CurrentTime  = Get-Date -Format "yyyyMMdd_HHmmss"
$OutFile      = ".\Identity_Timeline_$($IdentityId)_$CurrentTime.csv" # Customize export path as needed
# -------------------------------

$BaseUrl = "https://$Tenant.api.identitynow-demo.com"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# --- 1. Authenticate and Get OAuth Token ---
Write-Host "Authenticating to $Tenant..."
$AuthBody = @{
    grant_type    = "client_credentials"
    client_id     = $ClientId
    client_secret = $ClientSecret
}
$TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body $AuthBody
$Headers = @{
    "Authorization" = "Bearer $($TokenResponse.access_token)"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

$TimelineEvents = @()
$IdentityName = "" 

# --- 2. Identity Lifecycle Category (Day 0) ---
if ($Categories -contains 'Identity Lifecycle') {
    Write-Host "Fetching Core Identity Details..."

    $IdSearchPayload = @{
        indices = @("identities")
        query = @{ query = "id:`"$IdentityId`"" }
    }
    $IdentityResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/v3/search" -Headers $Headers -Body ($IdSearchPayload | ConvertTo-Json -Depth 10)

    if ($IdentityResponse -and $IdentityResponse.Count -gt 0) {
        $IdData = $IdentityResponse[0]
        $IdentityName = $IdData.name 
        
        $AuthSource = if ($IdData.source.name) { $IdData.source.name } else { "Unknown" }
        $Lcs = if ($IdData.attributes.cloudLifecycleState) { $IdData.attributes.cloudLifecycleState } else { "None" }

        $TimelineEvents += [PSCustomObject]@{
            Timestamp         = [datetime]$IdData.created
            Category          = "Identity Lifecycle"
            Action            = "Identity Created (Day 0)"
            Status            = "Complete"
            TargetObject      = $IdentityName 
            Actor             = "System"
            TargetSource      = "ISC Core"
            ExactChanges      = "Authoritative Source: $AuthSource"
            AdditionalContext = "Initial State: $Lcs"
            TrackingId        = $IdData.id 
        }
    }
} else {
    # If Identity Lifecycle is skipped, we still need the string alias to accurately query admin events below
    $IdSearchPayload = @{ indices = @("identities"); query = @{ query = "id:`"$IdentityId`"" } }
    $IdentityResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/v3/search" -Headers $Headers -Body ($IdSearchPayload | ConvertTo-Json -Depth 10)
    if ($IdentityResponse) { $IdentityName = $IdentityResponse[0].name }
}

# --- 3. Search API Categories (Audit Events & Account Activities) ---
$RunAudit = $Categories -contains 'Audit Event'
$RunActivity = $Categories -contains 'Account Activity'

if ($RunAudit -or $RunActivity) {
    Write-Host "Querying Search API (Paginated)..."
    
    # Dynamically build the indices search target based on the category parameter selection
    $TargetIndices = @()
    if ($RunAudit) { $TargetIndices += "events" }
    if ($RunActivity) { $TargetIndices += "accountactivities" }

    $SearchPayload = @{
        indices = $TargetIndices
        query = @{
            query = "(target.id:`"$IdentityId`" OR actor.id:`"$IdentityId`" OR recipient.id:`"$IdentityId`" OR actor.name:`"$IdentityName`") AND NOT name:`"*Personal Access Token*`" AND NOT name:`"*Authenticate*`""
        }
        sort = @("-created") 
    }

    $Offset = 0
    $Limit = 1000 

    while ($true) {
        Write-Host "  -> Fetching search records $Offset to $($Offset + $Limit)..."
        $SearchUri = "$BaseUrl/v3/search?limit=$Limit&offset=$Offset"
        $SearchResponse = Invoke-RestMethod -Method Post -Uri $SearchUri -Headers $Headers -Body ($SearchPayload | ConvertTo-Json -Depth 10)
        
        if ($null -eq $SearchResponse -or $SearchResponse.Count -eq 0) { break }

        foreach ($Item in $SearchResponse) {
            if ($Item._type -eq "event" -and $RunAudit) {
                
                if ($Item.action -eq "IdentityCreated") { continue }
                $TargetObj = if ($Item.target.name) { $Item.target.name } else { "N/A" }

                # Extract and flatten all "Additional Event Attributes" dynamically
                $ExtendedAttrList = @()
                if ($Item.attributes) {
                    foreach ($Key in $Item.attributes.psobject.Properties.Name) {
                        # Ignore standard duplicate tracking properties if they creep into attributes
                        if ($Key -in @('id', 'name', 'action', 'status')) { continue }
                        
                        $Val = $Item.attributes.$Key
                        if ($null -ne $Val) {
                            # Convert sub-objects/arrays to flat JSON strings so they don't break Excel/CSV formatting
                            if ($Val -is [System.Management.Automation.PSCustomObject] -or $Val -is [array]) {
                                $Val = $Val | ConvertTo-Json -Compress
                            }
                            $ExtendedAttrList += "$Key : $Val"
                        }
                    }
                }
                $FlattenedAttributes = if ($ExtendedAttrList.Count -gt 0) { $ExtendedAttrList -join ' | ' } else { "N/A" }

                $TimelineEvents += [PSCustomObject]@{
                    Timestamp         = [datetime]$Item.created
                    Category          = "Audit Event"
                    Action            = $Item.name 
                    Status            = $Item.status
                    TargetObject      = $TargetObj
                    Actor             = $Item.actor.name
                    TargetSource      = "N/A (System Event)"
                    ExactChanges      = $FlattenedAttributes # Expanded with Additional Event Attributes
                    AdditionalContext = "Technical Name: $($Item.technicalName)"
                    TrackingId        = $Item.id 
                }
            }
            elseif ($Item._type -eq "accountactivity" -and $RunActivity) {
                
                $SourceName = if ([string]::IsNullOrWhiteSpace($Item.sources)) { "N/A (No Downstream App Reached)" } else { $Item.sources -join ', ' }

                $ProvisioningDetails = @()
                if ($Item.accountRequests) {
                    foreach ($AcctReq in $Item.accountRequests) {
                        $AppTarget = if ($AcctReq.source.name) { "[App: $($AcctReq.source.name)]" } else { "[App: ISC Internal]" }
                        $Op = if ([string]::IsNullOrWhiteSpace($AcctReq.accountOperation)) { "Update/Sync" } else { $AcctReq.accountOperation }
                        $ProvisioningDetails += "$AppTarget Op: $Op"
                        
                        if ($AcctReq.attributeRequests) {
                            foreach ($AttrReq in $AcctReq.attributeRequests) {
                                $Val = if ($AttrReq.value -is [array]) { $AttrReq.value -join ', ' } else { $AttrReq.value }
                                $ProvisioningDetails += " -> $($AttrReq.operation) '$($AttrReq.name)': $Val"
                            }
                        }
                    }
                }
                $ExactChangesStr = if ($ProvisioningDetails.Count -gt 0) { $ProvisioningDetails -join ' | ' } else { "No explicit attribute changes logged" }

                $ContextStr = @()
                if ($Item.errors) { $ContextStr += "ERRORS: $($Item.errors -join ' ; ')" }
                if ($Item.warnings) { $ContextStr += "WARNINGS: $($Item.warnings -join ' ; ')" }
                $FinalContext = if ($ContextStr.Count -gt 0) { $ContextStr -join ' | ' } else { "Clean Execution" }

                $TimelineEvents += [PSCustomObject]@{
                    Timestamp         = [datetime]$Item.created
                    Category          = "Account Activity (Provisioning)"
                    Action            = $Item.action 
                    Status            = $Item.status
                    TargetObject      = $Item.recipient.name
                    Actor             = $Item.requester.name
                    TargetSource      = $SourceName
                    ExactChanges      = $ExactChangesStr
                    AdditionalContext = $FinalContext
                    TrackingId        = $Item.id 
                }
            }
        }

        if ($SearchResponse.Count -lt $Limit) { break }
        $Offset += $Limit
    }
}

# --- 4. Access Request Category ---
if ($Categories -contains 'Access Request') {
    Write-Host "Querying Access Request Status API (Paginated)..." -ForegroundColor Cyan
    $ReqOffset = 0
    $ReqLimit = 250 

    while ($true) {
        Write-Host "  -> Fetching access requests $ReqOffset to $($ReqOffset + $ReqLimit)..."
        $AccessRequestsUri = "$BaseUrl/v3/access-request-status?requested-for=$IdentityId&sorters=-created&limit=$ReqLimit&offset=$ReqOffset"
        $AccessRequestsResponse = Invoke-RestMethod -Method Get -Uri $AccessRequestsUri -Headers $Headers

        if ($null -eq $AccessRequestsResponse -or $AccessRequestsResponse.Count -eq 0) { break }

        foreach ($Req in $AccessRequestsResponse) {
            $RequestedItemsStr = if ($Req.name -and $Req.type) { "$($Req.type): $($Req.name)" } else { "Unknown Item" }

            $ExtractedComments = @()
            if ($Req.requesterComment) {
                foreach ($CommentObj in $Req.requesterComment) {
                    if ($CommentObj.comment) { $ExtractedComments += $CommentObj.comment }
                }
            }
            $ReqComment = if ($ExtractedComments.Count -gt 0) { "Comment: '$($ExtractedComments -join '; ')'" } else { "No Comment" }
            $PhaseProgression = if ($Req.accessRequestPhases) { $($Req.accessRequestPhases.state -join ' -> ') } else { "Unknown" }

            $TimelineEvents += [PSCustomObject]@{
                Timestamp         = [datetime]$Req.created
                Category          = "Access Request (Governance)"
                Action            = "Submit Access Request"
                Status            = $Req.state
                TargetObject      = $Req.requestedFor.name 
                Actor             = $Req.requester.name
                TargetSource      = "N/A (Evaluated in ISC)"
                ExactChanges      = $RequestedItemsStr
                AdditionalContext = "Phases: $PhaseProgression | $ReqComment"
                TrackingId        = $Req.accessRequestId 
            }
        }

        if ($AccessRequestsResponse.Count -lt $ReqLimit) { break }
        $ReqOffset += $ReqLimit
    }
}

# --- 5. Manual Work Item Category ---
if ($Categories -contains 'Manual Work Item') {
    Write-Host "Querying Manual Work Items (Paginated)..." -ForegroundColor Cyan
    $WorkItemLimit = 250 

    # Pass 1: Work Items Assigned to the User (Owner)
    $WorkItemOffset = 0
    while ($true) {
        Write-Host "  -> Fetching assigned work items $WorkItemOffset to $($WorkItemOffset + $WorkItemLimit)..."
        $WorkItemsUri = "$BaseUrl/v3/work-items?ownerId=$IdentityId&sorters=-created&limit=$WorkItemLimit&offset=$WorkItemOffset"
        $WorkItemsResponse = Invoke-RestMethod -Method Get -Uri $WorkItemsUri -Headers $Headers

        if ($null -eq $WorkItemsResponse -or $WorkItemsResponse.Count -eq 0) { break }

        foreach ($WI in $WorkItemsResponse) {
            $TimelineEvents += [PSCustomObject]@{
                Timestamp         = [datetime]$WI.created
                Category          = "Manual Work Item"
                Action            = "Assigned: $($WI.type)"
                Status            = $WI.state
                TargetObject      = if ($WI.target.name) { $WI.target.name } else { "Unknown Target" }
                Actor             = if ($WI.owner.name) { $WI.owner.name } else { "System" }
                TargetSource      = "ISC Governance"
                ExactChanges      = "Description: $($WI.description)"
                AdditionalContext = "Completion Date: $($WI.completed)"
                TrackingId        = $WI.id 
            }
        }

        if ($WorkItemsResponse.Count -lt $WorkItemLimit) { break }
        $WorkItemOffset += $WorkItemLimit
    }

    # Pass 2: Work Items Requested by the User (Requester)
    $ReqWorkItemOffset = 0
    while ($true) {
        Write-Host "  -> Fetching requested work items $ReqWorkItemOffset to $($ReqWorkItemOffset + $WorkItemLimit)..."
        $ReqWorkItemsUri = "$BaseUrl/v3/work-items?requesterId=$IdentityId&sorters=-created&limit=$WorkItemLimit&offset=$ReqWorkItemOffset"
        $ReqWorkItemsResponse = Invoke-RestMethod -Method Get -Uri $ReqWorkItemsUri -Headers $Headers

        if ($null -eq $ReqWorkItemsResponse -or $ReqWorkItemsResponse.Count -eq 0) { break }

        foreach ($WI in $ReqWorkItemsResponse) {
            $Exists = $TimelineEvents | Where-Object { $_.TrackingId -eq $WI.id -and $_.Category -eq "Manual Work Item" }
            if (-not $Exists) {
                $TimelineEvents += [PSCustomObject]@{
                    Timestamp         = [datetime]$WI.created
                    Category          = "Manual Work Item"
                    Action            = "Requested: $($WI.type)"
                    Status            = $WI.state
                    TargetObject      = if ($WI.target.name) { $WI.target.name } else { "Unknown Target" }
                    Actor             = if ($WI.owner.name) { $WI.owner.name } else { "System" }
                    TargetSource      = "ISC Governance"
                    ExactChanges      = "Description: $($WI.description)"
                    AdditionalContext = "Completion Date: $($WI.completed)"
                    TrackingId        = $WI.id 
                }
            }
        }

        if ($ReqWorkItemsResponse.Count -lt $WorkItemLimit) { break }
        $ReqWorkItemOffset += $WorkItemLimit
    }
}

# --- 6. Sort and Export ---
Write-Host "Normalizing and exporting data..."

if ($TimelineEvents.Count -eq 0) {
    Write-Host "No events found for selected criteria."
    exit
}

# Sort chronologically (Descending = newest events at the top)
$SortedTimeline = $TimelineEvents | Sort-Object Timestamp -Descending

# Ensure the target directory exists
$ParentDir = Split-Path -Parent $OutFile
if ($ParentDir -and -not (Test-Path -Path $ParentDir)) {
    New-Item -ItemType Directory -Path $ParentDir -Force | Out-Null
}

$SortedTimeline | Export-Csv -Path $OutFile -NoTypeInformation
Write-Host "Success! Exported $($SortedTimeline.Count) comprehensive timeline records to $OutFile"

# --- 7. Send Email ---
if ($RecipientEmail) {
    Write-Host "Sending report via email to $RecipientEmail..."

    # SMTP Configuration (Customize to match your environment)
    $SmtpServer = "SMTPSERVERHERE"        # e.g., smtp.yourcompany.com
    $SmtpPort   = 587                      # Typical SMTP port (587 or 25)
    $FromEmail  = "SENDEREMAILHERE"        # e.g., noreply@yourdomain.com
    $Subject    = "Identity Timeline Report - $IdentityId ($Tenant)"
    
    # Credentials Setup
    $SmtpUsername    = "SMTPUSERNAMEHERE"
    $SmtpPassword    = "SMTPPASSWORDHERE"
    $SecPassword     = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
    $SmtpCredentials = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)

    $CategoriesString = $Categories -join ', '

    $Body = @"
<html>
<body>
    <p>Hello,</p>
    <p>The SailPoint Identity Timeline Report has been generated successfully.</p>
    <p><b>Details:</b></p>
    <ul>
        <li><b>Identity ID:</b> $IdentityId</li>
        <li><b>Tenant:</b> $Tenant</li>
        <li><b>Categories:</b> $CategoriesString</li>
        <li><b>Record Count:</b> $($SortedTimeline.Count)</li>
        <li><b>Generated At:</b> $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</li>
    </ul>
    <p>The report has been attached to this email as a CSV file.</p>
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
        UseSsl      = $true             # Set to $true if SSL/TLS is required by SMTP host
        Credential  = $SmtpCredentials
    }

    try {
        if ($SmtpPassword -eq "SMTPPASSWORDHERE") {
            Write-Host "SMTP credentials placeholder detected. Skipping actual email transmission."
            Write-Host "Please update `$SmtpUsername` and `$SmtpPassword` in the script to enable sending."
        } else {
            # Note: Send-MailMessage is obsolete in newer PowerShell Core versions,
            # but remains fully supported and recommended for Windows PowerShell 5.1.
            Send-MailMessage @MailParams
            Write-Host "Email sent successfully to $RecipientEmail."
        }
    }
    catch {
        Write-Warning "Failed to send email to $RecipientEmail. Error: $_"
    }
}
