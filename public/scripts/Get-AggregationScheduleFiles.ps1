<#
.SYNOPSIS
Helper script to supply dynamic dropdown data for SailPoint Forms.

.DESCRIPTION
Scans the local directory for CSV files.
Returns a JSON object containing a Files array:
{
  "Files": [ {"label": "x", "value": "x"} ]
}
Returns the list of files to populate the dropdown.
#>


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

Write-Log -Message "--- Get-AggregationScheduleFiles Script Execution Started ---"
$filesArray = @()

# --- 1. Fetch Local CSV Files ---
$csvDirectory = "C:\Scripts\Aggregation Exports"
if (-not (Test-Path $csvDirectory)) { New-Item -ItemType Directory -Force -Path $csvDirectory | Out-Null }
$csvFiles = Get-ChildItem -Path $csvDirectory -Filter "*.csv"

foreach ($file in $csvFiles) {
    $filesArray += @{
        "label" = $file.Name
        "value" = $file.Name
    }
}

if ($filesArray.Count -eq 0) {
    $filesArray += @{
        "label" = "No CSV files found"
        "value" = ""
    }
}

# --- 2. Build Output Object and Return JSON ---
$outputObj = @{
    Files = $filesArray
}

$outputObj | ConvertTo-Json -Depth 5
