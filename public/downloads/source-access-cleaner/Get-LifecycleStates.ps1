<#
.SYNOPSIS
    Queries SailPoint Identity Security Cloud (ISC) Identity Profiles and returns all Lifecycle States (LCS).
    Designed for Windows Server node (Execute PowerShell Script) and Workflow automation.

.OUTPUTS
    Clean JSON array written to stdout in the format:
    [
        {
            "LCSName": "terminated",
            "IDPName": "Employees",
            "LCSID": "..."
        }
    ]
#>

# Suppress console logs for clean Windows Server node / Workflow JSON stdout
$Silent = $true

# ==============================================================================
# CONFIGURATION & CREDENTIALS
# ==============================================================================
$Tenant       = "YOUR_TENANT"
$ClientId     = "YOUR_CLIENT_ID"
$ClientSecret = "YOUR_CLIENT_SECRET"

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$BaseUrl = "https://$Tenant.api.identitynow.com"

# --- Script Directory & File Logger (logs.txt) ---
$ScriptDirectory = if ($PSScriptRoot) {
    $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
    Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
    "C:\SailPoint\Scripts\source-access-cleaner"
}
$LogFile = Join-Path -Path $ScriptDirectory -ChildPath "logs.txt"

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ForegroundColor = "White"
    )
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $LogLine   = "[$Timestamp] [$Level] $Message"

    # Always export to logs.txt in the same directory the script lives in
    if ($LogFile) {
        try {
            Add-Content -Path $LogFile -Value $LogLine -ErrorAction SilentlyContinue
        } catch {}
    }

    # Console display when not suppressed
    if (-not $Silent) {
        if ($Level -eq "ERROR") {
            Write-Host $LogLine -ForegroundColor Red
        } elseif ($Level -eq "WARN") {
            Write-Host $LogLine -ForegroundColor Yellow
        } else {
            if ($ForegroundColor -and $ForegroundColor -ne "White") {
                Write-Host $LogLine -ForegroundColor $ForegroundColor
            } else {
                Write-Host $LogLine
            }
        }
    }
}

function Log-Host {
    param (
        [string]$Message,
        [string]$ForegroundColor = "White",
        [string]$Level = "INFO"
    )
    if ($ForegroundColor -eq "Red" -or $Message -like "*ERROR*" -or $Message -like "*Failed*") {
        $Level = "ERROR"
    } elseif ($ForegroundColor -eq "Yellow" -or $Message -like "*WARN*" -or $Message -like "*Warning*") {
        $Level = "WARN"
    }
    Write-Log -Message $Message -Level $Level -ForegroundColor $ForegroundColor
}

Write-Log "--- Get-LifecycleStates Script Execution Started ---"

Log-Host "Authenticating to $Tenant ($BaseUrl)..." -ForegroundColor Cyan
$AuthBody = @{
    grant_type    = "client_credentials"
    client_id     = $ClientId
    client_secret = $ClientSecret
}

try {
    $TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body $AuthBody
    $AccessToken   = $TokenResponse.access_token
    $Headers       = @{
        "Authorization" = "Bearer $AccessToken"
        "Content-Type"  = "application/json"
        "Accept"        = "application/json"
    }
    Log-Host " Successfully authenticated." -ForegroundColor Green
}
catch {
    $errMsg = "Authentication failed: $($_.Exception.Message)"
    Write-Log -Message $errMsg -Level "ERROR"
    $ErrJson = @{ error = $errMsg } | ConvertTo-Json
    Write-Output $ErrJson
    exit 1
}

# ------------------------------------------------------------------------------
# 1. Fetch Identity Profiles
# ------------------------------------------------------------------------------
Log-Host "Fetching Identity Profiles from ISC..." -ForegroundColor Cyan

$ProfilesList = [System.Collections.Generic.List[PSCustomObject]]::new()
$Offset = 0
$Limit  = 250

while ($true) {
    try {
        $ProfilesUri = "$BaseUrl/identity-profiles/v1?limit=$Limit&offset=$Offset"
        $Batch = Invoke-RestMethod -Method Get -Uri $ProfilesUri -Headers $Headers
    }
    catch {
        $ErrJson = @{ error = "Failed to fetch Identity Profiles: $($_.Exception.Message)" } | ConvertTo-Json
        Write-Output $ErrJson
        exit 1
    }

    if ($null -eq $Batch -or $Batch.Count -eq 0) {
        break
    }

    foreach ($p in $Batch) {
        $ProfilesList.Add($p)
    }

    if ($Batch.Count -lt $Limit) {
        break
    }
    $Offset += $Limit
}

Log-Host " Found $($ProfilesList.Count) Identity Profile(s)." -ForegroundColor Green

# ------------------------------------------------------------------------------
# 2. Extract Lifecycle States for Each Profile
# ------------------------------------------------------------------------------
$LcsResults = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($profile in $ProfilesList) {
    Log-Host " Querying LCS for Profile: '$($profile.name)' (ID: $($profile.id))..." -ForegroundColor Gray
    try {
        $LcsUri = "$BaseUrl/identity-profiles/v1/$($profile.id)/lifecycle-states"
        $States = Invoke-RestMethod -Method Get -Uri $LcsUri -Headers $Headers

        if ($null -ne $States -and $States.Count -gt 0) {
            foreach ($state in $States) {
                $lcsNameValue = if ($state.technicalName) { $state.technicalName } else { $state.name }

                $LcsResults.Add([ordered]@{
                    "LCSName" = $lcsNameValue
                    "IDPName" = $profile.name
                    "LCSID"   = $state.id
                })
            }
        }
    }
    catch {
        Log-Host " Warning: Failed to fetch LCS for profile '$($profile.name)': $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Sort by IDPName, then LCSName
$SortedResults = @($LcsResults | Sort-Object IDPName, LCSName)

Log-Host " Total Lifecycle States resolved: $($SortedResults.Count)" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 3. Output JSON Array (Matching Get-RemovalSummary.ps1 stdout style for Windows Server node / Workflows)
# ------------------------------------------------------------------------------
Write-Log "--- Get-LifecycleStates Script Execution Completed (Total LCS: $($SortedResults.Count)) ---"
$JsonOutput = $SortedResults | ConvertTo-Json -Depth 5
Write-Output $JsonOutput

