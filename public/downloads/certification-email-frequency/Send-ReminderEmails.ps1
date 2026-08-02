param (
    [Parameter(Mandatory = $false)]
    [string]$selectAllActiveCampaigns,

    [Parameter(Mandatory = $false)]
    [string]$campaigns
)

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $LogLine = "[$Timestamp] [$Level] $Message"
    if ($Level -eq "ERROR" -or $Level -eq "WARN") {
        Write-Warning $LogLine
    } else {
        Write-Host $LogLine
    }
    $LogPath = Join-Path $PSScriptRoot "logs.txt"
    Add-Content -Path $LogPath -Value $LogLine
}

function Throw-Error {
    param([string]$Message)
    Write-Log -Message $Message -Level "ERROR"
    throw $Message
}

Write-Log -Message "--- Send-ReminderEmails Script Execution Started ---"
Write-Log -Message "Input selectAllActiveCampaigns: '$selectAllActiveCampaigns'"
Write-Log -Message "Input campaigns: '$campaigns'"

if ([string]::IsNullOrWhiteSpace($selectAllActiveCampaigns)) {
    Throw-Error "Missing required input: selectAllActiveCampaigns cannot be empty."
}

# Convert string booleans to actual booleans (using -eq 'true' for safety)
$isSelectAll = ($selectAllActiveCampaigns -eq 'true')

# Parse campaigns input
$campaignList = @()
if (-not [string]::IsNullOrWhiteSpace($campaigns)) {
    # Remove brackets, quotes, and split by comma or space
    $cleanCampaigns = $campaigns -replace '[\[\]"]', ''
    $campaignList = $cleanCampaigns -split '[, ]+' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
}

if ([string]::IsNullOrWhiteSpace($campaigns) -and -not $isSelectAll) {
    Throw-Error "Missing required input: campaigns must be provided when selectAllActiveCampaigns is false."
}

if ($campaigns -match '\{\{') {
    Throw-Error "The campaigns input contains unresolved workflow variables ({{...}}). Please check your Workflow configuration to ensure suppliedInlineExpression is used for script arguments."
}

# --- CONFIGURATION VARIABLES ---
$Tenant = "ENTERYOURTENANTNAMEHERE"
$ClientId = "ENTERYOURCLIENTIDHERE"
$ClientSecret = "ENTERYOURCLIENTSECRETHERE"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$BaseUrl = "https://$Tenant.api.identitynow.com"
$UiUrl = "https://$Tenant.identitynow.com"

# SMTP Settings
$SmtpServer = "smtp.gmail.com"
$SmtpPort = 587
$FromEmail = "YOUR-EMAIL@DOMAIN.COM"
$SmtpUsername = "YOUR-EMAIL@DOMAIN.COM"
$SmtpPassword = "YOUR-SMTP-PASSWORD"

# --- AUTHENTICATE ---
$AuthBody = @{
    grant_type    = "client_credentials"
    client_id     = $ClientId
    client_secret = $ClientSecret
}
    try {
        $TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body $AuthBody
    } catch {
        Throw-Error "Failed to authenticate with SailPoint API: $($_.Exception.Message)"
    }
    
    $Headers = @{
    "Authorization" = "Bearer $($TokenResponse.access_token)"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

# --- GET ACTIVE CAMPAIGNS ---
$TargetCampaigns = @()

if ($isSelectAll) {
    # Fetch all active campaigns
    $CampaignUri = "$BaseUrl/campaigns/v1?filters=status eq `"ACTIVE`""
    try {
        $TargetCampaigns = Invoke-RestMethod -Method Get -Uri $CampaignUri -Headers $Headers
    } catch {
        Throw-Error "Failed to fetch all active campaigns: $($_.Exception.Message)"
    }
}
else {
    # Fetch specific campaigns, but only process if they are active
    foreach ($campId in $campaignList) {
        if ([string]::IsNullOrWhiteSpace($campId)) { continue }
        try {
            $CampaignUri = "$BaseUrl/campaigns/v1/$campId"
            $camp = Invoke-RestMethod -Method Get -Uri $CampaignUri -Headers $Headers
            if ($camp.status -eq "ACTIVE") {
                $TargetCampaigns += $camp
            }
        }
        catch {
            Write-Log -Level "WARN" -Message "Failed to fetch campaign $campId or it is not active."
        }
    }
}

if ($TargetCampaigns.Count -eq 0) {
    Write-Log -Message "No active campaigns found to process."
    exit
}

# --- AGGREGATE PENDING CERTIFICATIONS BY REVIEWER ---
# Structure: Key = ReviewerId, Value = Array of Custom Certification Objects
$ReviewerMap = @{}

foreach ($camp in $TargetCampaigns) {
    $CampId = $camp.id
    $CampName = $camp.name
    
    # Fetch all certifications for this campaign
    $CertUri = "$BaseUrl/certifications/v1?filters=campaign.id eq `"$CampId`""
    $Certs = Invoke-RestMethod -Method Get -Uri $CertUri -Headers $Headers
    
    foreach ($cert in $Certs) {
        $decisionsTotal = if ($null -ne $cert.decisionsTotal) { $cert.decisionsTotal } else { 0 }
        
        # Only process if not completed, not signed off, and has items to review
        if ($cert.completed -eq $false -and $cert.phase -ne 'SIGNED_OFF' -and $decisionsTotal -gt 0) {
            
            # Identify reviewer
            $reviewerId = $cert.reviewer.id
            $reviewerName = $cert.reviewer.name
            $reviewerEmail = $cert.reviewer.email
            
            # Determine Status
            $decisionsMade = if ($null -ne $cert.decisionsMade) { $cert.decisionsMade } else { 0 }
            
            $status = "Decisions Pending ($decisionsMade / $decisionsTotal)"
            if ($decisionsMade -gt 0 -and $decisionsMade -ge $decisionsTotal) {
                $status = "Pending Sign Off"
            }
            elseif ($decisionsMade -eq 0) {
                $status = "Not Started"
            }
            
            # Try to grab due date
            $dueDate = "N/A"
            if ($cert.due) {
                $dueDate = [datetime]::Parse($cert.due).ToString("yyyy-MM-dd")
            }
            elseif ($camp.deadline) {
                $dueDate = [datetime]::Parse($camp.deadline).ToString("yyyy-MM-dd")
            }

            $startDate = "N/A"
            if ($camp.created) {
                $startDate = [datetime]::Parse($camp.created).ToString("yyyy-MM-dd")
            }
            
            $certLink = "$UiUrl/ui/d/certifications-review/certification/$($cert.id)"
            
            $CustomCert = [PSCustomObject]@{
                ReviewerId    = $reviewerId
                ReviewerName  = $reviewerName
                ReviewerEmail = $reviewerEmail
                CampaignName  = $CampName
                Status        = $status
                DueDate       = $dueDate
                StartDate     = $startDate
                TotalUsers    = $decisionsTotal
                Link          = $certLink
            }
            
            if (-not $ReviewerMap.ContainsKey($reviewerId)) {
                $ReviewerMap[$reviewerId] = @()
            }
            $ReviewerMap[$reviewerId] += $CustomCert
        }
    }
}

# --- SEND CONSOLIDATED EMAILS ---
$SecPassword = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
$SmtpCredentials = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)

foreach ($reviewerId in $ReviewerMap.Keys) {
    $reviewerCerts = $ReviewerMap[$reviewerId]
    
    # Try to ensure we have an email address
    $recipientEmail = $reviewerCerts[0].ReviewerEmail
    $recipientName = $reviewerCerts[0].ReviewerName
    
    if ([string]::IsNullOrWhiteSpace($recipientEmail)) {
        # Fallback: query identity for email
        try {
            $IdentityUri = "$BaseUrl/identities/v1/$reviewerId"
            $identity = Invoke-RestMethod -Method Get -Uri $IdentityUri -Headers $Headers
            $recipientEmail = $identity.attributes.email
        }
        catch {
            Write-Log -Level "WARN" -Message "Could not fetch email for reviewer $reviewerName ($reviewerId)"
        }
    }
    
    if ([string]::IsNullOrWhiteSpace($recipientEmail)) {
        Write-Log -Level "WARN" -Message "Skipping reviewer $reviewerName ($reviewerId) - No email address found."
        continue
    }

    $Subject = "Action Required: Pending SailPoint Certifications Reminder"
    
    # Build HTML Body
    $TemplatePath = Join-Path $PSScriptRoot "Email-Template.html"
    if (-not (Test-Path $TemplatePath)) {
        Write-Log -Level "WARN" -Message "Email-Template.html not found at $TemplatePath"
        continue
    }
    
    $HtmlBody = Get-Content -Path $TemplatePath -Raw
    
    $TableRows = ""
    foreach ($cert in $reviewerCerts) {
        $TableRows += @"
            <tr>
                <td>$($cert.CampaignName)</td>
                <td><strong>$($cert.Status)</strong></td>
                <td>$($cert.StartDate)</td>
                <td>$($cert.DueDate)</td>
                <td>$($cert.TotalUsers)</td>
                <td><a href="$($cert.Link)" class="button">Go To Campaign</a></td>
            </tr>
"@
    }
    
    $HtmlBody = $HtmlBody.Replace("{{RecipientName}}", $recipientName).Replace("{{TableRows}}", $TableRows)



    $MailParams = @{
        To         = $recipientEmail
        From       = $FromEmail
        Subject    = $Subject
        Body       = $HtmlBody
        BodyAsHtml = $true
        SmtpServer = $SmtpServer
        Port       = $SmtpPort
        UseSsl     = $true
        Credential = $SmtpCredentials
    }
    
    try {
        Send-MailMessage @MailParams
        Write-Log -Message "Consolidated reminder email sent successfully to $recipientEmail ($recipientName)."
    }
    catch {
        Write-Log -Level "WARN" -Message "Failed to send email to $recipientEmail ($recipientName). Error: $_"
    }
}
