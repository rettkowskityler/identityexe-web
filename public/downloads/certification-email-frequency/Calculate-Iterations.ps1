param (
    [Parameter(Mandatory = $false)]
    [string]$selectAllActiveCampaigns,

    [Parameter(Mandatory = $false)]
    [string]$campaigns,

    [Parameter(Mandatory = $false)]
    [string]$stopOnEndDate,

    [Parameter(Mandatory = $false)]
    [string]$timeFrequency
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

Write-Log -Message "--- Calculate-Iterations Script Execution Started ---"
Write-Log -Message "Input selectAllActiveCampaigns: '$selectAllActiveCampaigns'"
Write-Log -Message "Input campaigns: '$campaigns'"
Write-Log -Message "Input stopOnEndDate: '$stopOnEndDate'"
Write-Log -Message "Input timeFrequency: '$timeFrequency'"

if ([string]::IsNullOrWhiteSpace($selectAllActiveCampaigns)) {
    Throw-Error "Missing required input: selectAllActiveCampaigns cannot be empty."
}
if ([string]::IsNullOrWhiteSpace($stopOnEndDate)) {
    Throw-Error "Missing required input: stopOnEndDate cannot be empty."
}
if ([string]::IsNullOrWhiteSpace($timeFrequency)) {
    Throw-Error "Missing required input: timeFrequency cannot be empty."
}

# Convert string booleans to actual booleans (using -eq 'true' for safety)
$isSelectAll = ($selectAllActiveCampaigns -eq 'true')
$isStopOnEndDate = ($stopOnEndDate -eq 'true')

# Parse campaigns input
$campaignList = @()
if (-not [string]::IsNullOrWhiteSpace($campaigns)) {
    # Remove brackets, quotes, and split by comma or space
    $cleanCampaigns = $campaigns -replace '[\[\]"]', ''
    $campaignList = $cleanCampaigns -split '[, ]+' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
}

if (-not $isSelectAll -and $campaignList.Count -eq 0) {
    Throw-Error "Missing required input: campaigns must be provided when selectAllActiveCampaigns is false."
}

# Parse time frequency (e.g., "5 Days" -> 5)
$freqMatch = [regex]::Match($timeFrequency, '\d+')
if (-not $freqMatch.Success) {
    Throw-Error "Invalid timeFrequency format. Expected a number string, e.g., '5 Days'"
}
$frequencyDays = [int]$freqMatch.Value

# Max SP Workflow execution time is 30 days
$maxDays = 30
$daysToIterate = $maxDays

if ($isStopOnEndDate) {
    # --- CONFIGURATION VARIABLES ---
    $Tenant = "ENTERYOURTENANTNAMEHERE"
    $ClientId = "ENTERYOURCLIENTIDHERE"
    $ClientSecret = "ENTERYOURCLIENTSECRETHERE"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $BaseUrl = "https://$Tenant.api.identitynow.com"
    
    # Authenticate
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
        "Authorization"            = "Bearer $($TokenResponse.access_token)"
        "Content-Type"             = "application/json"
        "Accept"                   = "application/json"
    }

    $latestDeadline = $null

    if ($isSelectAll) {
        # Get all active campaigns
        $CampaignUri = "$BaseUrl/campaigns/v1?filters=status eq `"ACTIVE`""
        try {
            $ActiveCampaigns = Invoke-RestMethod -Method Get -Uri $CampaignUri -Headers $Headers
        } catch {
            Throw-Error "Failed to fetch all active campaigns: $($_.Exception.Message)"
        }
        
        foreach ($camp in $ActiveCampaigns) {
            if ($camp.deadline) {
                $deadlineDate = [datetime]::Parse($camp.deadline)
                if ($null -eq $latestDeadline -or $deadlineDate -gt $latestDeadline) {
                    $latestDeadline = $deadlineDate
                }
            }
        }
    } else {
        # Get specified campaigns
        foreach ($campId in $campaignList) {
            if ([string]::IsNullOrWhiteSpace($campId)) { continue }
            $CampaignUri = "$BaseUrl/campaigns/v1/$campId"
            $camp = Invoke-RestMethod -Method Get -Uri $CampaignUri -Headers $Headers
            
            if ($camp.deadline) {
                $deadlineDate = [datetime]::Parse($camp.deadline)
                if ($null -eq $latestDeadline -or $deadlineDate -gt $latestDeadline) {
                    $latestDeadline = $deadlineDate
                }
            }
        }
    }

    if ($null -ne $latestDeadline) {
        $timeSpan = $latestDeadline - (Get-Date)
        $daysUntilEnd = [math]::Ceiling($timeSpan.TotalDays)
        
        if ($daysUntilEnd -lt 0) {
            $daysUntilEnd = 0
        }

        # Cap it to max 30 days so workflow doesn't fail
        if ($daysUntilEnd -lt $maxDays) {
            $daysToIterate = $daysUntilEnd
        }
    }
}

# Calculate iterations: days / frequency
$iterations = [math]::Floor($daysToIterate / $frequencyDays)

# Return JSON for Workflow
$OutputObj = @{
    iterations = $iterations
}
$OutputObj | ConvertTo-Json -Depth 2
