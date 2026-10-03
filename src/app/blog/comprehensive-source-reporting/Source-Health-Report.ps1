<#
.SYNOPSIS
    SailPoint Identity Security Cloud (ISC) - Comprehensive Source Health Reporting & Alerting.
    Analyzes scheduled operations, connector capabilities, task executions, provisioning, and attribute sync
    events across all tenant sources to detect failing events and alert on error thresholds.

.DESCRIPTION
    This script automates tenant-wide source health monitoring in SailPoint ISC:
    1. Authenticates to SailPoint ISC via OAuth 2.0 client credentials.
    2. Caches all tenant sources, extracting connector configurations and feature flags.
    3. Evaluates enabled capabilities per source:
         - Account Aggregation (via /sources/v1/:id/schedules)
         - Entitlement Aggregation (via /sources/v1/:id/schedules)
         - Account Requests: Create Account, Modify Account, Disable Account, Enable Account, Delete Account (via connector features)
         - Attribute Sync (via /sources/v1/:id/attribute-sync-config)
    4. Evaluates execution results and failing events over a lookback window (default: 24 hours):
         - Account Aggregation: Through the task-status API (/task-status/v1)
         - Group / Entitlement Aggregation: Through the task-status API (/task-status/v1)
         - Account Requests (Create, Modify, Disable, Enable, Delete): Through Search API (/search/v1, index: accountactivities)
         - Attribute Sync: Through Search API (/search/v1, index: accountactivities, action: 'Attribute Sync')
    5. Dynamically discovers and evaluates sources appearing in task or search events (including system connectors like IdentityNow).
    6. Analyzes results per source and operation against the error threshold (default: 3.0%).
       Flags a source as BREACHED if either an individual operation or the combined source error rate hits >= 3%.
    7. Generates a comprehensive CSV audit report with full metrics, error counts, and rates.
    8. Generates and dispatches a modern, executive HTML email summary with the CSV report attached.
    9. Emits clean, compressed JSON to standard output for integration with SailPoint Workflows / Privileged Action Gateway (PAG).

.PARAMETER EmailToSendTo
    One or more recipient email addresses (comma or semicolon-separated) for the health summary report.
    Default: "identity-team@yourcompany.com"

.PARAMETER ErrorThresholdPercent
    Error rate threshold percentage to trigger alerts (default: 3.0%).

.PARAMETER LookbackHours
    Time window in hours to analyze task executions and search events (default: 24).

.PARAMETER ExcludedSources
    List of source names or IDs to exclude from health evaluation and threshold alerting.
    Accepts an array of strings or a comma/semicolon-separated string.

.PARAMETER CreateTickets
    Whether to generate and dispatch individual ticket creation emails for breached sources ($true / $false). Default: $false.

.PARAMETER TicketEmailToSendTo
    Destination email address for automated incident/ticket creation (receives one email per breached source).
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $false, HelpMessage = "Recipient email address(es) for health summary report")]
    [string]$EmailToSendTo = "identity-team@yourcompany.com",

    [Parameter(Mandatory = $false, HelpMessage = "Error rate threshold percentage (default: 3.0%)")]
    [string]$ErrorThresholdPercent = "3.0",

    [Parameter(Mandatory = $false, HelpMessage = "Lookback time window in hours to evaluate (default: 24)")]
    [string]$LookbackHours = "24",

    [Parameter(Mandatory = $false, HelpMessage = "List of source names or IDs to exclude from health evaluation")]
    [string]$ExcludedSources = "",

    [Parameter(Mandatory = $false, HelpMessage = "Whether to generate and dispatch individual ticket creation emails for breached sources")]
    [string]$CreateTickets = "false",

    [Parameter(Mandatory = $false, HelpMessage = "Destination email address for automated incident/ticket creation (one email per breached source)")]
    [string]$TicketEmailToSendTo = ""
)

# ==============================================================================
# CONFIGURATION & CREDENTIALS
# ==============================================================================
# --- SailPoint ISC Tenant Configuration ---
$Tenant = "your-tenant"
$BaseDomain = "identitynow.com"
$ClientId = "YOUR_CLIENT_ID"
$ClientSecret = "YOUR_CLIENT_SECRET"

# --- SMTP Relay Email Configuration ---
$SmtpServer = "smtp.yourcompany.com"
$SmtpPort = 587
$FromEmail = "sailpoint-reports@yourcompany.com"
$SmtpUsername = "sailpoint-reports@yourcompany.com"
$SmtpPassword = "YOUR_SMTP_PASSWORD"
# ==============================================================================

# Enforce TLS 1.2
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

# ==============================================================================
# 1. INITIALIZATION & RESOLVE DIRECTORIES
# ==============================================================================
$ScriptDirectory = if ($PSScriptRoot) {
    $PSScriptRoot
}
elseif ($MyInvocation.MyCommand.Path) {
    Split-Path -Parent $MyInvocation.MyCommand.Path
}
else {
    (Get-Location).Path
}

# Resolve Recipient Email (handles empty string passed from PAG workflow input)
if ([string]::IsNullOrWhiteSpace($EmailToSendTo)) {
    $EmailToSendTo = "identity-team@yourcompany.com"
}

# Resolve Ticket Recipient Email (handles empty string passed from PAG workflow input)
if ([string]::IsNullOrWhiteSpace($TicketEmailToSendTo)) {
    $TicketEmailToSendTo = ""
}

# Parse Numeric Parameters safely from string
$parsedThreshold = 3.0
if (-not [double]::TryParse($ErrorThresholdPercent, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$parsedThreshold)) {
    $parsedThreshold = 3.0
}
$ErrorThresholdPercent = $parsedThreshold

$parsedHours = 24
if (-not [int]::TryParse($LookbackHours, [ref]$parsedHours)) {
    $parsedHours = 24
}
$LookbackHours = $parsedHours

# Resolve Boolean CreateTickets safely from string
$ShouldCreateTickets = $false
if (-not [string]::IsNullOrWhiteSpace($CreateTickets)) {
    $strVal = $CreateTickets.Trim().ToLower()
    if ($strVal -in @("true", "`$true", "1", "yes", "y", "enable", "enabled")) {
        $ShouldCreateTickets = $true
    }
}

# Parse Exclusion List into a case-insensitive HashSet
$SourceExclusionSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
if ($ExcludedSources) {
    $rawItems = if ($ExcludedSources -is [System.Collections.IEnumerable] -and $ExcludedSources -isnot [string]) {
        $ExcludedSources
    }
    else {
        @($ExcludedSources)
    }
    foreach ($item in $rawItems) {
        if ($item) {
            foreach ($sub in ($item.ToString() -split '[,;]')) {
                $trimmed = $sub.Trim()
                if ($trimmed) {
                    $SourceExclusionSet.Add($trimmed) | Out-Null
                    $cleanTrimmed = ($trimmed -replace '^\[[^\]]+\]\s*', '').Trim()
                    if ($cleanTrimmed) {
                        $SourceExclusionSet.Add($cleanTrimmed) | Out-Null
                    }
                }
            }
        }
    }
}

function Is-SourceExcluded {
    param(
        [string]$SourceId,
        [string]$SourceName
    )
    if ($SourceId -and $SourceExclusionSet.Contains($SourceId.Trim())) {
        return $true
    }
    if ($SourceName) {
        if ($SourceExclusionSet.Contains($SourceName.Trim())) {
            return $true
        }
        $cleanName = ($SourceName -replace '^\[[^\]]+\]\s*', '').Trim()
        if ($SourceExclusionSet.Contains($cleanName)) {
            return $true
        }
    }
    return $false
}

# Hardcoded Export Directory
$ExportDirectory = Join-Path -Path $ScriptDirectory -ChildPath "reports"
if (-not (Test-Path -Path $ExportDirectory)) {
    try {
        New-Item -ItemType Directory -Path $ExportDirectory -Force -ErrorAction SilentlyContinue | Out-Null
    }
    catch {}
}

# Resolve Log File Path
$LogFile = Join-Path -Path $ScriptDirectory -ChildPath "logs.txt"

# Hardcoded HTML Email Template Paths
$SummaryTemplatePath = Join-Path -Path $ScriptDirectory -ChildPath "templates\summary-template.html"
$IncidentTemplatePath = Join-Path -Path $ScriptDirectory -ChildPath "templates\incident-template.html"

# ==============================================================================
# 2. LOGGING ENGINE
# ==============================================================================
function Write-Log {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        [string]$Level = "INFO"
    )
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $LogLine = "[$Timestamp] [$Level] $Message"

    if ($LogFile) {
        try {
            Add-Content -Path $LogFile -Value $LogLine -ErrorAction SilentlyContinue
        }
        catch {}
    }
}

function Exit-WithJson {
    param(
        [string]$Status = "error",
        [string]$ErrorMessage = "",
        [int]$ExitCode = 1
    )
    $errorResult = [ordered]@{
        status      = $Status
        error       = $ErrorMessage
        tenant      = $Tenant
        generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
    Write-Output ($errorResult | ConvertTo-Json -Depth 5 -Compress)
    exit $ExitCode
}

# Robust JSON Deserializer for responses containing case-differing duplicate keys (e.g. Group.mergeColumns)
try {
    Add-Type -AssemblyName System.Web.Extensions -ErrorAction SilentlyContinue
    $Global:JsonSerializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
    $Global:JsonSerializer.MaxJsonLength = [int]::MaxValue
}
catch {}

function Parse-JsonSafely {
    param([Parameter(Mandatory = $false)]$RawInput)
    if ($null -eq $RawInput) { return $null }
    if ($RawInput -is [string]) {
        if ([string]::IsNullOrWhiteSpace($RawInput)) { return $null }
        try {
            return (ConvertFrom-Json -InputObject $RawInput -AsHashtable -Depth 100)
        }
        catch {}
        try {
            if ($Global:JsonSerializer) {
                return $Global:JsonSerializer.DeserializeObject($RawInput)
            }
        }
        catch {}
        try {
            return ($RawInput | ConvertFrom-Json)
        }
        catch {
            return $null
        }
    }
    return $RawInput
}

function Format-IsoUtc {
    param($InputDate)
    if ($null -eq $InputDate) { return $null }
    if ($InputDate -is [DateTime]) {
        return $InputDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
    try {
        $dt = [DateTime]::Parse($InputDate.ToString())
        return $dt.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
    catch {
        return [string]$InputDate
    }
}

function Log-Host {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ForegroundColor = "White"
    )
    Write-Log -Message $Message -Level $Level

    # Suppress Write-Host when running inside non-interactive / remote host (e.g. PAG)
    if ($Host.Name -eq "ServerRemoteHost" -or -not [Environment]::UserInteractive -or [Console]::IsOutputRedirected) {
        return
    }

    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $ConsoleLine = "[$Timestamp] [$Level] $Message"

    switch ($Level) {
        "ERROR" { Write-Host $ConsoleLine -ForegroundColor Red }
        "WARN" { Write-Host $ConsoleLine -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $ConsoleLine -ForegroundColor Green }
        "DEBUG" { Write-Host $ConsoleLine -ForegroundColor DarkGray }
        default {
            if ($ForegroundColor -and $ForegroundColor -ne "White") {
                Write-Host $ConsoleLine -ForegroundColor $ForegroundColor
            }
            else {
                Write-Host $ConsoleLine
            }
        }
    }
}

Log-Host "==========================================================================" -ForegroundColor Cyan
Log-Host "  SAILPOINT ISC - COMPREHENSIVE SOURCE HEALTH REPORTING & ALERTING" -ForegroundColor Cyan
Log-Host "==========================================================================" -ForegroundColor Cyan
Log-Host "Threshold: $ErrorThresholdPercent% error rate | Lookback Window: Last $LookbackHours Hours" -ForegroundColor Gray
if ($SourceExclusionSet.Count -gt 0) {
    Log-Host "Active source exclusions ($($SourceExclusionSet.Count)): $($SourceExclusionSet -join ', ')" -ForegroundColor Yellow
}
if ($ShouldCreateTickets) {
    $tickDest = if ($TicketEmailToSendTo) { $TicketEmailToSendTo } else { "[NOT CONFIGURED]" }
    Log-Host "Automated incident ticket creation: ENABLED (Recipient: $tickDest)" -ForegroundColor Magenta
}
else {
    Log-Host "Automated incident ticket creation: DISABLED" -ForegroundColor Gray
}

$StartTime = Get-Date

# ==============================================================================
# 3. AUTHENTICATE TO SAILPOINT ISC
# ==============================================================================
if ([string]::IsNullOrWhiteSpace($ClientId) -or [string]::IsNullOrWhiteSpace($ClientSecret)) {
    $errMsg = "Missing SailPoint ISC API Client ID or Client Secret."
    Log-Host $errMsg -Level "ERROR"
    Exit-WithJson -Status "error" -ErrorMessage $errMsg -ExitCode 1
}

$BaseUrl = "https://$Tenant.api.$BaseDomain"
Log-Host "Authenticating to SailPoint ISC ($BaseUrl)..." -ForegroundColor Cyan

$AuthBody = @{
    grant_type    = "client_credentials"
    client_id     = $ClientId
    client_secret = $ClientSecret
}

try {
    $TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body $AuthBody -ErrorAction Stop
    $AccessToken = $TokenResponse.access_token

    $Headers = @{
        "Authorization"            = "Bearer $AccessToken"
        "Content-Type"             = "application/json"
        "Accept"                   = "application/json"
        "X-SailPoint-Experimental" = "true"
    }

    Log-Host "Successfully authenticated to SailPoint ISC." -Level "SUCCESS" -ForegroundColor Green
}
catch {
    $authErr = "Authentication to SailPoint ISC failed: $($_.Exception.Message)"
    if ($_.ErrorDetails) { $authErr += " | Details: $($_.ErrorDetails.Message)" }
    Log-Host $authErr -Level "ERROR"
    Exit-WithJson -Status "error" -ErrorMessage $authErr -ExitCode 1
}

# ==============================================================================
# 4. STANDARD OPERATIONS DEFINITION & HELPERS
# ==============================================================================
$StandardOperations = @(
    "Account Aggregation",
    "Entitlement Aggregation",
    "Create Account",
    "Modify Account",
    "Disable Account",
    "Enable Account",
    "Delete Account",
    "Attribute Sync"
)

function New-OperationMetric {
    param([bool]$Enabled)
    return [PSCustomObject]@{
        Enabled        = $Enabled
        TotalRuns      = 0
        PassedRuns     = 0
        FailedRuns     = 0
        ErrorRate      = 0.0
        Status         = if (-not $Enabled) { "NOT CONFIGURED" } else { "NO ACTIVITY" }
        FailureReasons = [System.Collections.Generic.List[string]]::new()
        LastActivity   = $null
    }
}

function Register-SourceRecord {
    param(
        [Parameter(Mandatory = $true)]
        $SourceObj
    )

    if ($null -eq $SourceObj) {
        return $null
    }

    $rawId = if ($SourceObj.id) { $SourceObj.id } elseif ($SourceObj['id']) { $SourceObj['id'] } else { $null }
    if ([string]::IsNullOrWhiteSpace($rawId)) {
        return $null
    }
    $sId = $rawId.ToString().Trim().ToLower()
    $sName = if ($SourceObj.name) { $SourceObj.name } elseif ($SourceObj['name']) { $SourceObj['name'] } else { "" }
    $sType = if ($SourceObj.type) { $SourceObj.type } elseif ($SourceObj['type']) { $SourceObj['type'] } else { "Unknown" }
    $features = if ($SourceObj.features) { @($SourceObj.features) } elseif ($SourceObj['features']) { @($SourceObj['features']) } else { @() }

    $isExcluded = Is-SourceExcluded -SourceId $sId -SourceName $sName

    if ($isExcluded) {
        $record = [PSCustomObject]@{
            Id                            = $sId
            Name                          = $sName
            Type                          = $sType
            Features                      = $features
            IsExcluded                    = $true
            AccountAggregationEnabled     = $false
            EntitlementAggregationEnabled = $false
            CreateAccountEnabled          = $false
            ModifyAccountEnabled          = $false
            DisableAccountEnabled         = $false
            EnableAccountEnabled          = $false
            DeleteAccountEnabled          = $false
            AttributeSyncEnabled          = $false
            Operations                    = [ordered]@{}
        }

        foreach ($opName in $StandardOperations) {
            $record.Operations[$opName] = [PSCustomObject]@{
                Enabled        = $false
                TotalRuns      = 0
                PassedRuns     = 0
                FailedRuns     = 0
                ErrorRate      = 0.0
                Status         = "EXCLUDED"
                FailureReasons = [System.Collections.Generic.List[string]]::new()
                LastActivity   = $null
            }
        }

        $SourceHealthData[$sId] = $record
        if ($sName) { $SourceLookupByName[$sName.Trim().ToLower()] = $record }
        $SourceLookupById[$sId] = $record
        return $record
    }

    $acctAggEnabled = $false
    $entAggEnabled = $false
    $attrSyncEnabled = $false

    # 1. Fetch Aggregation Schedules
    try {
        $schedulesUrl = "$BaseUrl/sources/v1/$sId/schedules"
        $schedules = Invoke-RestMethod -Method Get -Uri $schedulesUrl -Headers $Headers -ErrorAction SilentlyContinue
        $schedules = Parse-JsonSafely -RawInput $schedules
        if ($schedules) {
            foreach ($sched in @($schedules)) {
                $schedType = if ($sched.type) { $sched.type } elseif ($sched['type']) { $sched['type'] } else { "" }
                if ($schedType -eq "ACCOUNT_AGGREGATION") {
                    $acctAggEnabled = $true
                }
                elseif ($schedType -eq "GROUP_AGGREGATION") {
                    $entAggEnabled = $true
                }
            }
        }
    }
    catch {}

    # 2. Fetch Attribute Sync Configuration
    try {
        $syncConfigUrl = "$BaseUrl/sources/v1/$sId/attribute-sync-config"
        $syncConfig = Invoke-RestMethod -Method Get -Uri $syncConfigUrl -Headers $Headers -ErrorAction SilentlyContinue
        $syncConfig = Parse-JsonSafely -RawInput $syncConfig
        $syncAttrs = if ($syncConfig -and $syncConfig.attributes) { $syncConfig.attributes } elseif ($syncConfig -and $syncConfig['attributes']) { $syncConfig['attributes'] } else { $null }
        if ($syncAttrs) {
            foreach ($attr in @($syncAttrs)) {
                $attrEn = if ($attr.enabled) { $attr.enabled } elseif ($attr['enabled']) { $attr['enabled'] } else { $false }
                if ($attrEn -eq $true -or $attrEn -eq "true") {
                    $attrSyncEnabled = $true
                    break
                }
            }
        }
    }
    catch {}

    $record = [PSCustomObject]@{
        Id                            = $sId
        Name                          = $sName
        Type                          = $sType
        Features                      = $features
        IsExcluded                    = $false
        AccountAggregationEnabled     = $acctAggEnabled
        EntitlementAggregationEnabled = $entAggEnabled
        CreateAccountEnabled          = ($features -contains "PROVISIONING" -or $features -contains "CREATE")
        ModifyAccountEnabled          = ($features -contains "PROVISIONING" -or $features -contains "UPDATE")
        DisableAccountEnabled         = ($features -contains "ENABLE" -or $features -contains "DISABLE" -or $features -contains "PROVISIONING")
        EnableAccountEnabled          = ($features -contains "ENABLE" -or $features -contains "PROVISIONING")
        DeleteAccountEnabled          = ($features -contains "DELETE" -or $features -contains "ENABLE_DELETE" -or $features -contains "PROVISIONING")
        AttributeSyncEnabled          = $attrSyncEnabled
        Operations                    = [ordered]@{}
    }

    $record.Operations["Account Aggregation"] = New-OperationMetric -Enabled $record.AccountAggregationEnabled
    $record.Operations["Entitlement Aggregation"] = New-OperationMetric -Enabled $record.EntitlementAggregationEnabled
    $record.Operations["Create Account"] = New-OperationMetric -Enabled $record.CreateAccountEnabled
    $record.Operations["Modify Account"] = New-OperationMetric -Enabled $record.ModifyAccountEnabled
    $record.Operations["Disable Account"] = New-OperationMetric -Enabled $record.DisableAccountEnabled
    $record.Operations["Enable Account"] = New-OperationMetric -Enabled $record.EnableAccountEnabled
    $record.Operations["Delete Account"] = New-OperationMetric -Enabled $record.DeleteAccountEnabled
    $record.Operations["Attribute Sync"] = New-OperationMetric -Enabled $record.AttributeSyncEnabled

    $SourceHealthData[$sId] = $record
    if ($sName) {
        $SourceLookupByName[$sName.Trim().ToLower()] = $record
    }
    $SourceLookupById[$sId] = $record

    return $record
}

# ==============================================================================
# 5. FETCH AND INITIALIZE ALL TENANT SOURCES
# ==============================================================================
Log-Host "Fetching all sources from tenant..." -ForegroundColor Cyan

$AllSources = [System.Collections.Generic.List[object]]::new()
$SourceLookupById = @{}
$SourceLookupByName = @{}
$SourceHealthData = [ordered]@{}

$SourceOffset = 0
$SourceLimit = 250

while ($true) {
    $SourcesUrl = "$BaseUrl/sources/v1?limit=$SourceLimit&offset=$SourceOffset"
    try {
        $SourceBatch = Invoke-RestMethod -Method Get -Uri $SourcesUrl -Headers $Headers -ErrorAction Stop
        $SourceBatch = Parse-JsonSafely -RawInput $SourceBatch
    }
    catch {
        Log-Host "Failed querying sources at offset $SourceOffset`: $($_.Exception.Message)" -Level "ERROR"
        break
    }

    if ($null -eq $SourceBatch) {
        break
    }

    $batchArray = @($SourceBatch)
    if ($batchArray.Count -eq 0) {
        break
    }

    foreach ($src in $batchArray) {
        if ($src -and ($src.id -or $src['id'])) {
            $AllSources.Add($src)
        }
    }

    if ($batchArray.Count -lt $SourceLimit) {
        break
    }
    $SourceOffset += $batchArray.Count
}

Log-Host "Evaluating capabilities for $($AllSources.Count) tenant sources..." -ForegroundColor Cyan
foreach ($src in $AllSources) {
    [void](Register-SourceRecord -SourceObj $src)
}

Log-Host "Completed capability evaluation for $($SourceHealthData.Count) sources." -Level "SUCCESS" -ForegroundColor Green

# Dynamic source resolver helper
function Resolve-OrFetchSource {
    param(
        [string]$SourceId,
        [string]$SourceName
    )

    if (Is-SourceExcluded -SourceId $SourceId -SourceName $SourceName) {
        return $null
    }

    if ($SourceId) {
        $cleanId = $SourceId.Trim().ToLower()
        if ($SourceLookupById.ContainsKey($cleanId)) {
            return $SourceLookupById[$cleanId]
        }
        # Attempt to dynamically fetch source by ID (e.g. system sources like IdentityNow)
        try {
            $dynSrc = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1/$cleanId" -Headers $Headers -ErrorAction SilentlyContinue
            $dynSrc = Parse-JsonSafely -RawInput $dynSrc
            if ($dynSrc) {
                return (Register-SourceRecord -SourceObj $dynSrc)
            }
        }
        catch {}
    }

    if ($SourceName) {
        $cleanName = ($SourceName -replace '^\[[^\]]+\]\s*', '').Trim().ToLower()
        if ($SourceLookupByName.ContainsKey($cleanName)) {
            return $SourceLookupByName[$cleanName]
        }
    }

    return $null
}

# ==============================================================================
# 6. RETRIEVE TASK STATUS (ACCOUNT & ENTITLEMENT AGGREGATIONS)
# ==============================================================================
$CutoffUtc = (Get-Date).ToUniversalTime().AddHours(-$LookbackHours)
Log-Host "Retrieving task status records since $($CutoffUtc.ToString('yyyy-MM-dd HH:mm:ss')) UTC..." -ForegroundColor Cyan

$TaskOffset = 0
$TaskLimit = 250
$TotalTasksProcessed = 0
$KeepPagingTasks = $true
$ProcessedTaskIds = [System.Collections.Generic.HashSet[string]]::new()

while ($KeepPagingTasks) {
    $TaskUrl = "$BaseUrl/task-status/v1?sorters=-created&limit=$TaskLimit&offset=$TaskOffset"
    try {
        $TaskBatch = Invoke-RestMethod -Method Get -Uri $TaskUrl -Headers $Headers -ErrorAction Stop
        $TaskBatch = Parse-JsonSafely -RawInput $TaskBatch
    }
    catch {
        Log-Host "Error fetching task-status batch at offset $TaskOffset`: $($_.Exception.Message)" -Level "WARN"
        break
    }

    if ($null -eq $TaskBatch) {
        break
    }

    $taskArray = @($TaskBatch)
    if ($taskArray.Count -eq 0) {
        break
    }

    foreach ($task in $taskArray) {
        $taskCreatedStr = $task.created
        $taskCreated = $null
        if ($taskCreatedStr) {
            $taskCreated = [DateTime]::Parse($taskCreatedStr).ToUniversalTime()
        }

        # If task is older than lookback window, stop paging
        if ($taskCreated -and $taskCreated -lt $CutoffUtc) {
            $KeepPagingTasks = $false
            break
        }

        # Deduplicate to prevent re-processing across page boundaries
        if ($task.id -and -not $ProcessedTaskIds.Add($task.id)) {
            continue
        }

        $TotalTasksProcessed++

        $taskDef = if ($task.taskDefinitionSummary) { $task.taskDefinitionSummary.uniqueName } else { "" }
        $isAcctAgg = ($taskDef -eq "Cloud Account Aggregation")
        $isGrpAgg = ($taskDef -eq "Cloud Group Aggregation")

        if (-not ($isAcctAgg -or $isGrpAgg)) {
            continue
        }

        # Resolve associated source ID
        $matchedSource = $null
        if ($task.target -and $task.target.id) {
            $matchedSource = Resolve-OrFetchSource -SourceId $task.target.id
        }

        if (-not $matchedSource -and $task.target -and $task.target.name) {
            $matchedSource = Resolve-OrFetchSource -SourceName $task.target.name
        }

        if (-not $matchedSource -and $task.attributes -and $task.attributes.applications) {
            $appRaw = [string]$task.attributes.applications
            if ($appRaw -match '^([^\[]+)') {
                $matchedSource = Resolve-OrFetchSource -SourceName $matches[1]
            }
        }

        if ($matchedSource) {
            $opKey = if ($isAcctAgg) { "Account Aggregation" } else { "Entitlement Aggregation" }
            $metric = $matchedSource.Operations[$opKey]

            $metric.TotalRuns++
            $metric.LastActivity = $taskCreatedStr

            $statusStr = [string]$task.completionStatus
            if ($statusStr -eq "SUCCESS") {
                $metric.PassedRuns++
            }
            else {
                $metric.FailedRuns++
                $errDetail = "Task $statusStr"
                if ($task.messages -and $task.messages.Count -gt 0) {
                    $errDetail += ": $($task.messages[0].key)"
                }
                if ($metric.FailureReasons.Count -lt 5) {
                    $metric.FailureReasons.Add($errDetail)
                }
            }
        }
    }

    if ($TaskBatch.Count -lt $TaskLimit) {
        break
    }
    $TaskOffset += $TaskBatch.Count
}

Log-Host "Processed $TotalTasksProcessed recent tasks from task-status API." -Level "SUCCESS" -ForegroundColor Green

# ==============================================================================
# 7. RETRIEVE ACCOUNT ACTIVITY & PROVISIONING REQUESTS (SEARCH API)
# ==============================================================================
Log-Host "Querying Search API for Account Activities (accountRequests) in the last $LookbackHours hours..." -ForegroundColor Cyan

$SearchQuery = "created:[now-${LookbackHours}h TO now]"

$SearchLimit = 250
$TotalActivitiesProcessed = 0
$TotalAccountRequestsEvaluated = 0
$ProcessedActivityIds = [System.Collections.Generic.HashSet[string]]::new()
$LastActivityCreated = $null
$LastActivityId = $null

while ($true) {
    $SearchPayload = [ordered]@{
        indices = @("accountactivities")
        query   = @{ query = $SearchQuery }
        sort    = @("-created", "id")
    }

    if ($LastActivityCreated -and $LastActivityId) {
        $SearchPayload["searchAfter"] = @((Format-IsoUtc $LastActivityCreated), $LastActivityId)
    }

    $SearchBodyJson = $SearchPayload | ConvertTo-Json -Depth 6
    $SearchUri = "$BaseUrl/search/v1?limit=$SearchLimit"

    try {
        $SearchBatch = Invoke-RestMethod -Method Post -Uri $SearchUri -Headers $Headers -Body $SearchBodyJson -ErrorAction Stop
        $SearchBatch = Parse-JsonSafely -RawInput $SearchBatch
    }
    catch {
        Log-Host "Failed querying account activities: $($_.Exception.Message)" -Level "WARN"
        break
    }

    if ($null -eq $SearchBatch) {
        break
    }

    $activityArray = @($SearchBatch)
    if ($activityArray.Count -eq 0) {
        break
    }

    foreach ($act in $activityArray) {
        $actId = if ($act.id) { [string]$act.id } elseif ($act['id']) { [string]$act['id'] } else { $null }

        # Deduplicate to prevent re-processing across page boundaries
        if ($actId -and -not $ProcessedActivityIds.Add($actId)) {
            continue
        }

        $TotalActivitiesProcessed++

        $actAction = if ($act.action) { [string]$act.action } elseif ($act['action']) { [string]$act['action'] } else { "" }
        $actCreated = if ($act.created) { [string]$act.created } elseif ($act['created']) { [string]$act['created'] } else { "" }
        $actStatus = if ($act.status) { [string]$act.status } elseif ($act['status']) { [string]$act['status'] } else { "" }

        $acctRequests = if ($act.accountRequests) { $act.accountRequests } elseif ($act['accountRequests']) { $act['accountRequests'] } else { @() }
        if ($null -eq $acctRequests -or @($acctRequests).Count -eq 0) {
            continue
        }

        # Iterate directly over each account request to ensure multi-source isolation
        foreach ($req in @($acctRequests)) {
            $TotalAccountRequestsEvaluated++

            $reqSource = if ($req.source) { $req.source } elseif ($req['source']) { $req['source'] } else { $null }
            $reqSourceId = if ($reqSource) { if ($reqSource.id) { [string]$reqSource.id } elseif ($reqSource['id']) { [string]$reqSource['id'] } else { $null } } else { $null }
            $reqSourceName = if ($reqSource) { if ($reqSource.name) { [string]$reqSource.name } elseif ($reqSource['name']) { [string]$reqSource['name'] } else { $null } } else { $null }

            # Resolve the specific target source for THIS account request
            $matchedSource = $null
            if ($reqSourceId -and $reqSourceId -ne "null") {
                $matchedSource = Resolve-OrFetchSource -SourceId $reqSourceId -SourceName $reqSourceName
            }
            if (-not $matchedSource -and $reqSourceName -and $reqSourceName -ne "null") {
                $matchedSource = Resolve-OrFetchSource -SourceName $reqSourceName
            }

            # If source is dynamic or uncataloged (e.g. IdentityNow system connector, internal apps)
            if (-not $matchedSource -and ($reqSourceId -or $reqSourceName)) {
                if (-not (Is-SourceExcluded -SourceId $reqSourceId -SourceName $reqSourceName)) {
                    $dynObj = [ordered]@{
                        id       = if ($reqSourceId) { $reqSourceId } else { [guid]::NewGuid().ToString() }
                        name     = if ($reqSourceName) { $reqSourceName } else { "Unknown ($reqSourceId)" }
                        type     = if ($reqSource -and $reqSource.type) { [string]$reqSource.type } elseif ($reqSource -and $reqSource['type']) { [string]$reqSource['type'] } else { "Unknown" }
                        features = @("PROVISIONING", "ENABLE")
                    }
                    $matchedSource = Register-SourceRecord -SourceObj $dynObj
                }
            }

            if (-not $matchedSource) {
                continue
            }

            # Determine Operation:
            # 1. Attribute Sync related to the "Action"
            # 2. Create Account under Account Requests
            # 3. Modify Account under Account Requests (when it's not an attribute sync)
            # 4. Disable Account under Account Requests
            # 5. Enable Account under Account Requests
            # 6. Delete Account under Account Requests
            $reqOp = if ($req.op) { [string]$req.op } elseif ($req['op']) { [string]$req['op'] } else { "" }

            $matchedOp = $null
            if ($actAction -eq "Attribute Sync" -or $actAction -like "*Attribute Sync*") {
                $matchedOp = "Attribute Sync"
            }
            elseif ($reqOp -eq "Create" -or $reqOp -like "*Create*") {
                $matchedOp = "Create Account"
            }
            elseif ($reqOp -eq "Modify" -or $reqOp -like "*Modify*") {
                $matchedOp = "Modify Account"
            }
            elseif ($reqOp -eq "Disable" -or $reqOp -like "*Disable*") {
                $matchedOp = "Disable Account"
            }
            elseif ($reqOp -eq "Enable" -or $reqOp -like "*Enable*") {
                $matchedOp = "Enable Account"
            }
            elseif ($reqOp -eq "Delete" -or $reqOp -like "*Delete*") {
                $matchedOp = "Delete Account"
            }

            if (-not $matchedOp -or -not $matchedSource.Operations.Contains($matchedOp)) {
                continue
            }

            $metric = $matchedSource.Operations[$matchedOp]
            $metric.TotalRuns++
            $metric.LastActivity = $actCreated

            # Determine Pass/Fail per Account Request
            $reqResult = if ($req.result) { $req.result } elseif ($req['result']) { $req['result'] } else { $null }
            $resStatus = if ($reqResult) {
                if ($reqResult.status) { [string]$reqResult.status } elseif ($reqResult['status']) { [string]$reqResult['status'] } else { "" }
            }
            else { "" }
            $resErrors = if ($reqResult) {
                if ($reqResult.errors) { @($reqResult.errors) } elseif ($reqResult['errors']) { @($reqResult['errors']) } else { @() }
            }
            else { @() }

            $cleanErrors = @($resErrors | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

            $isFailed = ($resStatus.ToLower() -in @("failed", "failure", "error")) -or ($cleanErrors.Count -gt 0)

            if (-not $isFailed) {
                $metric.PassedRuns++
            }
            else {
                $metric.FailedRuns++
                $errStr = if ($cleanErrors.Count -gt 0) {
                    $cleanErrors -join "; "
                }
                elseif ($resStatus) {
                    "$matchedOp failed ($resStatus)"
                }
                else {
                    "$matchedOp failed"
                }

                if ($metric.FailureReasons.Count -lt 5) {
                    $metric.FailureReasons.Add($errStr)
                }
            }
        }
    }

    if ($activityArray.Count -lt $SearchLimit) {
        break
    }

    $lastItem = $activityArray[-1]
    $LastActivityCreated = if ($lastItem.created) { $lastItem.created } elseif ($lastItem['created']) { $lastItem['created'] } else { $null }
    $LastActivityId = if ($lastItem.id) { [string]$lastItem.id } elseif ($lastItem['id']) { [string]$lastItem['id'] } else { $null }

    if (-not $LastActivityCreated -or -not $LastActivityId) {
        break
    }
}

Log-Host "Processed $TotalActivitiesProcessed account activities ($TotalAccountRequestsEvaluated account requests evaluated) from Search API." -Level "SUCCESS" -ForegroundColor Green

# ==============================================================================
# 8. ANALYZE RESULTS & EVALUATE ERROR THRESHOLDS
# ==============================================================================
Log-Host "Calculating error rates and evaluating threshold ($ErrorThresholdPercent%)..." -ForegroundColor Cyan

$TotalSourcesEvaluated = $SourceHealthData.Count
$TotalExcludedSources = 0
$TotalBreachedSources = 0
$TotalWarningSources = 0
$TotalHealthySources = 0
$TotalOverallOperations = 0
$TotalOverallFailures = 0

$ReportRows = [System.Collections.Generic.List[PSCustomObject]]::new()
$BreachedSourcesList = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($sId in $SourceHealthData.Keys) {
    $srcData = $SourceHealthData[$sId]

    if ($srcData.IsExcluded) {
        $TotalExcludedSources++
        $srcData | Add-Member -NotePropertyName "CombinedTotal" -NotePropertyValue 0 -Force
        $srcData | Add-Member -NotePropertyName "CombinedPassed" -NotePropertyValue 0 -Force
        $srcData | Add-Member -NotePropertyName "CombinedFailed" -NotePropertyValue 0 -Force
        $srcData | Add-Member -NotePropertyName "CombinedErrorRate" -NotePropertyValue 0.0 -Force
        $srcData | Add-Member -NotePropertyName "OverallStatus" -NotePropertyValue "EXCLUDED" -Force

        foreach ($opName in $StandardOperations) {
            $ReportRows.Add([PSCustomObject]@{
                    SourceName       = $srcData.Name
                    SourceId         = $srcData.Id
                    ConnectorType    = $srcData.Type
                    Operation        = $opName
                    Enabled          = "No (Excluded)"
                    TotalRuns        = 0
                    PassedRuns       = 0
                    FailedRuns       = 0
                    ErrorRatePercent = "0%"
                    ThresholdPercent = "$ErrorThresholdPercent%"
                    Status           = "EXCLUDED"
                    FailureDetails   = "Source excluded via configuration"
                    LastActivity     = $null
                })
        }
        continue
    }

    $sourceCombinedTotal = 0
    $sourceCombinedPassed = 0
    $sourceCombinedFailed = 0
    $sourceHasBreach = $false
    $sourceHasWarning = $false
    $breachedOperationNames = [System.Collections.Generic.List[string]]::new()

    foreach ($opName in $StandardOperations) {
        $metric = $srcData.Operations[$opName]

        # Consider an operation active if it is formally enabled or if it had actual executions
        $isEvaluating = $metric.Enabled -or ($metric.TotalRuns -gt 0)

        if ($isEvaluating) {
            $sourceCombinedTotal += $metric.TotalRuns
            $sourceCombinedPassed += $metric.PassedRuns
            $sourceCombinedFailed += $metric.FailedRuns

            $TotalOverallOperations += $metric.TotalRuns
            $TotalOverallFailures += $metric.FailedRuns

            if ($metric.TotalRuns -gt 0) {
                $metric.ErrorRate = [math]::Round(($metric.FailedRuns / $metric.TotalRuns) * 100, 2)

                if ($metric.ErrorRate -ge $ErrorThresholdPercent) {
                    $metric.Status = "CRITICAL"
                    $sourceHasBreach = $true
                    $breachedOperationNames.Add("$opName ($($metric.ErrorRate)% errors)")
                }
                elseif ($metric.FailedRuns -gt 0) {
                    $metric.Status = "WARNING"
                    $sourceHasWarning = $true
                }
                else {
                    $metric.Status = "HEALTHY"
                }
            }
            else {
                $metric.Status = "NO ACTIVITY"
                $metric.ErrorRate = 0.0
            }
        }
        else {
            $metric.Status = "NOT CONFIGURED"
            $metric.ErrorRate = 0.0
        }

        # Add row to CSV report
        $ReportRows.Add([PSCustomObject]@{
                SourceName       = $srcData.Name
                SourceId         = $srcData.Id
                ConnectorType    = $srcData.Type
                Operation        = $opName
                Enabled          = if ($metric.Enabled) { "Yes" } else { "No" }
                TotalRuns        = $metric.TotalRuns
                PassedRuns       = $metric.PassedRuns
                FailedRuns       = $metric.FailedRuns
                ErrorRatePercent = "$($metric.ErrorRate)%"
                ThresholdPercent = "$ErrorThresholdPercent%"
                Status           = $metric.Status
                FailureDetails   = ($metric.FailureReasons -join " | ")
                LastActivity     = $metric.LastActivity
            })
    }

    # Combined Source-level error rate
    $combinedErrorRate = if ($sourceCombinedTotal -gt 0) {
        [math]::Round(($sourceCombinedFailed / $sourceCombinedTotal) * 100, 2)
    }
    else {
        0.0
    }

    if ($combinedErrorRate -ge $ErrorThresholdPercent) {
        $sourceHasBreach = $true
        if (-not ($breachedOperationNames -contains "Combined Operations ($combinedErrorRate% errors)")) {
            $breachedOperationNames.Add("Combined Operations ($combinedErrorRate% errors)")
        }
    }

    # Determine Overall Source Status
    $overallSourceStatus = "HEALTHY"
    if ($sourceHasBreach) {
        $overallSourceStatus = "CRITICAL"
        $TotalBreachedSources++
        $BreachedSourcesList.Add([PSCustomObject]@{
                SourceName        = $srcData.Name
                SourceId          = $srcData.Id
                ConnectorType     = $srcData.Type
                CombinedTotal     = $sourceCombinedTotal
                CombinedFailed    = $sourceCombinedFailed
                CombinedErrorRate = "$combinedErrorRate%"
                BreachedDetails   = ($breachedOperationNames -join ", ")
            })
    }
    elseif ($sourceHasWarning) {
        $overallSourceStatus = "WARNING"
        $TotalWarningSources++
    }
    else {
        $TotalHealthySources++
    }

    # Attach summary stats to source object
    $srcData | Add-Member -NotePropertyName "CombinedTotal" -NotePropertyValue $sourceCombinedTotal -Force
    $srcData | Add-Member -NotePropertyName "CombinedPassed" -NotePropertyValue $sourceCombinedPassed -Force
    $srcData | Add-Member -NotePropertyName "CombinedFailed" -NotePropertyValue $sourceCombinedFailed -Force
    $srcData | Add-Member -NotePropertyName "CombinedErrorRate" -NotePropertyValue $combinedErrorRate -Force
    $srcData | Add-Member -NotePropertyName "OverallStatus" -NotePropertyValue $overallSourceStatus -Force
}

$EndTime = Get-Date
$Duration = ($EndTime - $StartTime).ToString("hh\:mm\:ss")
$OverallTenantErrorRate = if ($TotalOverallOperations -gt 0) {
    [math]::Round(($TotalOverallFailures / $TotalOverallOperations) * 100, 2)
}
else {
    0.0
}

Log-Host "==========================================================================" -ForegroundColor Cyan
Log-Host "  EXECUTION HEALTH SUMMARY" -ForegroundColor Cyan
Log-Host "==========================================================================" -ForegroundColor Cyan
Log-Host "  Sources Evaluated        : $TotalSourcesEvaluated"
if ($TotalExcludedSources -gt 0) {
    Log-Host "  Sources Excluded         : $TotalExcludedSources" -ForegroundColor DarkGray
}
Log-Host "  Sources Breached Threshold: $TotalBreachedSources" -ForegroundColor $(if ($TotalBreachedSources -gt 0) { 'Red' } else { 'Green' })
Log-Host "  Sources with Warnings    : $TotalWarningSources" -ForegroundColor $(if ($TotalWarningSources -gt 0) { 'Yellow' } else { 'White' })
Log-Host "  Fully Healthy Sources    : $TotalHealthySources" -ForegroundColor Green
Log-Host "  Total Operations Runs    : $TotalOverallOperations"
Log-Host "  Total Failed Operations  : $TotalOverallFailures" -ForegroundColor $(if ($TotalOverallFailures -gt 0) { 'Red' } else { 'White' })
Log-Host "  Overall Tenant Error Rate: $OverallTenantErrorRate%" -ForegroundColor $(if ($OverallTenantErrorRate -ge $ErrorThresholdPercent) { 'Red' } else { 'Green' })
Log-Host "  Duration                 : $Duration"
Log-Host "==========================================================================" -ForegroundColor Cyan

# ==============================================================================
# 9. EXPORT CSV AUDIT REPORT
# ==============================================================================
$TimestampStr = (Get-Date).ToString("yyyyMMdd_HHmmss")
$CsvFileName = "Source_Health_Report_${TimestampStr}.csv"
$CsvReportPath = Join-Path -Path $ExportDirectory -ChildPath $CsvFileName

try {
    $ReportRows | Export-Csv -Path $CsvReportPath -NoTypeInformation -Encoding utf8
    Log-Host "CSV Health Report exported to: $CsvReportPath" -Level "SUCCESS" -ForegroundColor Green
}
catch {
    Log-Host "Failed saving CSV report to '$CsvReportPath': $($_.Exception.Message)" -Level "ERROR"
}

# ==============================================================================
# 10. GENERATE HTML EMAIL SUMMARY AND DISPATCH
# ==============================================================================
Log-Host "Preparing and sending executive HTML health report to: $EmailToSendTo..." -ForegroundColor Cyan

function Escape-Html {
    param([string]$InputStr)
    if ([string]::IsNullOrEmpty($InputStr)) { return "" }
    return [System.Web.HttpUtility]::HtmlEncode($InputStr)
}

# Resolve status indicators for email header
if ($TotalBreachedSources -gt 0) {
    $SubjectTag = "[ALERT]"
    $StatusColor = "#dc2626"
    $StatusText = "$TotalBreachedSources Breached"
    $HeaderBorderColor = "#ef4444"
}
else {
    $SubjectTag = "[HEALTHY]"
    $StatusColor = "#16a34a"
    $StatusText = "All Healthy"
    $HeaderBorderColor = "#10b981"
}

# Build Breached Sources Section HTML
$BreachedSectionHtml = ""
if ($BreachedSourcesList.Count -gt 0) {
    $bRows = [System.Text.StringBuilder]::new()
    foreach ($b in $BreachedSourcesList) {
        [void]$bRows.Append(@"
        <tr style="border-bottom: 1px solid #fee2e2; background: #fff5f5; font-size: 12px;">
            <td style="padding: 8px 10px; font-weight: 600; color: #991b1b;">$(Escape-Html $b.SourceName)</td>
            <td style="padding: 8px 10px; color: #64748b; font-family: monospace; font-size: 11px;">$(Escape-Html $b.SourceId)</td>
            <td style="padding: 8px 10px; color: #475569;">$(Escape-Html $b.ConnectorType)</td>
            <td style="padding: 8px 10px; text-align: center; color: #1e293b;">$($b.CombinedTotal)</td>
            <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #dc2626;">$($b.CombinedFailed)</td>
            <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #dc2626; background: #fee2e2;">$($b.CombinedErrorRate)</td>
            <td style="padding: 8px 10px; color: #7f1d1d; font-size: 11px;">$(Escape-Html $b.BreachedDetails)</td>
        </tr>
"@)
    }

    $BreachedSectionHtml = @"
    <div style="margin-bottom: 20px;">
        <div style="font-size: 14px; font-weight: 700; color: #991b1b; margin-bottom: 8px;">Breached Sources Requiring Attention</div>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #fecaca; text-align: left;">
            <thead>
                <tr style="background: #fee2e2; border-bottom: 1px solid #fecaca; font-size: 11px; color: #991b1b; text-transform: uppercase;">
                    <th style="padding: 8px 10px;">Source Name</th>
                    <th style="padding: 8px 10px;">Source ID</th>
                    <th style="padding: 8px 10px;">Connector Type</th>
                    <th style="padding: 8px 10px; text-align: center;">Total</th>
                    <th style="padding: 8px 10px; text-align: center;">Failed</th>
                    <th style="padding: 8px 10px; text-align: center;">Error Rate</th>
                    <th style="padding: 8px 10px;">Breached Operations</th>
                </tr>
            </thead>
            <tbody>
                $($bRows.ToString())
            </tbody>
        </table>
    </div>
"@
}

# Build Detailed Matrix Table HTML (All Sources)
$MatrixTableRows = [System.Text.StringBuilder]::new()
foreach ($sId in $SourceHealthData.Keys) {
    $src = $SourceHealthData[$sId]

    $overallBadgeBg = "#10b981"
    $overallBadgeCol = "#ffffff"
    switch ($src.OverallStatus) {
        "CRITICAL" { $overallBadgeBg = "#ef4444"; $overallBadgeCol = "#ffffff" }
        "WARNING" { $overallBadgeBg = "#f59e0b"; $overallBadgeCol = "#ffffff" }
        "EXCLUDED" { $overallBadgeBg = "#64748b"; $overallBadgeCol = "#ffffff" }
        default { $overallBadgeBg = "#10b981"; $overallBadgeCol = "#ffffff" }
    }

    # Helper function to generate cell badge
    function Get-OpBadge {
        param($Metric)
        if ($Metric.Status -eq "EXCLUDED") {
            return "<span style='display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; background:#f1f5f9; color:#94a3b8;'>EXCLUDED</span>"
        }
        if (-not $Metric.Enabled -and $Metric.TotalRuns -eq 0) {
            return "<span style='display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; background:#f1f5f9; color:#94a3b8;'>DISABLED</span>"
        }
        if ($Metric.TotalRuns -eq 0) {
            return "<span style='display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; background:#e2e8f0; color:#475569;'>IDLE</span>"
        }
        if ($Metric.Status -eq "CRITICAL") {
            return "<span style='display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:700; background:#fee2e2; color:#dc2626;'>$($Metric.FailedRuns)/$($Metric.TotalRuns) ($($Metric.ErrorRate)%)</span>"
        }
        if ($Metric.Status -eq "WARNING") {
            return "<span style='display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:700; background:#fef3c7; color:#b45309;'>$($Metric.FailedRuns)/$($Metric.TotalRuns) ($($Metric.ErrorRate)%)</span>"
        }
        return "<span style='display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:600; background:#dcfce7; color:#166534;'>OK ($($Metric.TotalRuns))</span>"
    }

    [void]$MatrixTableRows.Append(@"
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
        <td style="padding: 8px 10px; font-weight: 600; color: #1e293b;">$(Escape-Html $src.Name)</td>
        <td style="padding: 8px 10px; color: #64748b;">$(Escape-Html $src.Type)</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Account Aggregation'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Entitlement Aggregation'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Create Account'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Modify Account'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Disable Account'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Enable Account'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Delete Account'])</td>
        <td style="padding: 8px 10px; text-align: center;">$(Get-OpBadge -Metric $src.Operations['Attribute Sync'])</td>
        <td style="padding: 8px 10px; text-align: center;">
            <span style="display:inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; background-color: $overallBadgeBg; color: $overallBadgeCol;">
                $($src.OverallStatus)
            </span>
        </td>
    </tr>
"@)
}

# Load Summary HTML Template from file
if (Test-Path -Path $SummaryTemplatePath) {
    $EmailHtmlBody = Get-Content -Path $SummaryTemplatePath -Raw -Encoding utf8
}
else {
    Log-Host "Summary template file not found at '$SummaryTemplatePath'. Check template path." -Level "ERROR"
    Exit-WithJson -Status "error" -ErrorMessage "Summary template file not found at '$SummaryTemplatePath'" -ExitCode 1
}

# Populate summary template placeholders
$excludedNote = if ($TotalExcludedSources -gt 0) { "<span style='color:#64748b;'>($TotalExcludedSources excluded)</span>" } else { "" }
$breachedCol = if ($TotalBreachedSources -gt 0) { "#dc2626" } else { "#64748b" }
$failuresCol = if ($TotalOverallFailures -gt 0) { "#dc2626" } else { "#64748b" }
$tenantRateCol = if ($OverallTenantErrorRate -ge $ErrorThresholdPercent) { "#dc2626" } else { "#16a34a" }
$genTimestamp = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

$summaryReplacements = @{
    "{{HeaderBorderColor}}"      = $HeaderBorderColor
    "{{Tenant}}"                 = (Escape-Html $Tenant)
    "{{StatusColor}}"            = $StatusColor
    "{{StatusText}}"             = $StatusText
    "{{ErrorThresholdPercent}}"  = $ErrorThresholdPercent
    "{{LookbackHours}}"          = $LookbackHours
    "{{TotalSourcesEvaluated}}"  = $TotalSourcesEvaluated
    "{{ExcludedSourcesNote}}"    = $excludedNote
    "{{TotalHealthySources}}"    = $TotalHealthySources
    "{{BreachedCountColor}}"     = $breachedCol
    "{{TotalBreachedSources}}"   = $TotalBreachedSources
    "{{TotalOverallOperations}}" = $TotalOverallOperations
    "{{FailuresColor}}"          = $failuresCol
    "{{TotalOverallFailures}}"   = $TotalOverallFailures
    "{{TenantRateColor}}"        = $tenantRateCol
    "{{OverallTenantErrorRate}}" = $OverallTenantErrorRate
    "{{BreachedSectionHtml}}"    = $BreachedSectionHtml
    "{{MatrixTableRows}}"        = $MatrixTableRows.ToString()
    "{{CsvFileName}}"            = $CsvFileName
    "{{GeneratedTimestamp}}"     = $genTimestamp
}

foreach ($token in $summaryReplacements.Keys) {
    $EmailHtmlBody = $EmailHtmlBody.Replace($token, [string]$summaryReplacements[$token])
}

$Subject = "$SubjectTag SailPoint Source Health Report - $Tenant ($TotalBreachedSources Breached, $TotalOverallFailures Failures)"

$RecipientList = @(($EmailToSendTo -split '[,;]') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })

$SecPassword = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
$SmtpCreds = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)

$MailParams = @{
    To            = $RecipientList
    From          = $FromEmail
    Subject       = $Subject
    Body          = $EmailHtmlBody
    BodyAsHtml    = $true
    SmtpServer    = $SmtpServer
    Port          = $SmtpPort
    UseSsl        = $true
    Credential    = $SmtpCreds
    WarningAction = "SilentlyContinue"
}

if (Test-Path -Path $CsvReportPath) {
    $MailParams["Attachments"] = $CsvReportPath
}

try {
    Send-MailMessage @MailParams
    Log-Host "Summary health email sent successfully to: $($RecipientList -join ', ')" -Level "SUCCESS" -ForegroundColor Green
}
catch {
    Log-Host "Failed to send summary email: $($_.Exception.Message)" -Level "ERROR"
}

# ==============================================================================
# 11. INDIVIDUAL INCIDENT TICKET DISPATCH (ONE EMAIL PER BREACHED SOURCE)
# ==============================================================================
$TotalTicketsDispatched = 0

if ($ShouldCreateTickets) {
    if ([string]::IsNullOrWhiteSpace($TicketEmailToSendTo)) {
        Log-Host "Ticket creation is enabled (-CreateTickets = `$true), but no -TicketEmailToSendTo address was specified. Skipping ticket dispatch." -Level "WARN"
    }
    elseif ($BreachedSourcesList.Count -eq 0) {
        Log-Host "Ticket creation is enabled, but no sources breached the $ErrorThresholdPercent% error threshold. No tickets required." -Level "INFO" -ForegroundColor Gray
    }
    else {
        Log-Host "Preparing individual incident ticket emails for $($BreachedSourcesList.Count) breached source(s) to: $TicketEmailToSendTo..." -ForegroundColor Cyan

        # Load Incident Ticket HTML Template from file
        if (Test-Path -Path $IncidentTemplatePath) {
            $IncidentTemplateRaw = Get-Content -Path $IncidentTemplatePath -Raw -Encoding utf8
        }
        else {
            Log-Host "Incident template file not found at '$IncidentTemplatePath'. Check template path." -Level "ERROR"
            $IncidentTemplateRaw = $null
        }

        $TicketRecipients = @(($TicketEmailToSendTo -split '[,;]') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })

        foreach ($breached in $BreachedSourcesList) {
            if ($null -eq $IncidentTemplateRaw) {
                Log-Host "Skipping ticket dispatch for '$($breached.SourceName)' due to missing incident template file." -Level "WARN"
                continue
            }

            $bSrc = $SourceHealthData[$breached.SourceId]

            # Build operations failure breakdown table for this source
            $ticketOpsRows = [System.Text.StringBuilder]::new()
            foreach ($opName in $StandardOperations) {
                $opMetric = $bSrc.Operations[$opName]
                if ($opMetric.FailedRuns -gt 0 -or $opMetric.Status -eq "CRITICAL") {
                    $errDetailsClean = if ($opMetric.FailureReasons.Count -gt 0) {
                        (Escape-Html ($opMetric.FailureReasons -join " | "))
                    } else {
                        "Operation reported $($opMetric.FailedRuns) failure(s)"
                    }

                    [void]$ticketOpsRows.Append(@"
                    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
                        <td style="padding: 8px 10px; font-weight: 600; color: #0f172a;">$(Escape-Html $opName)</td>
                        <td style="padding: 8px 10px; text-align: center; color: #475569;">$($opMetric.TotalRuns)</td>
                        <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #dc2626;">$($opMetric.FailedRuns)</td>
                        <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #dc2626;">$($opMetric.ErrorRate)%</td>
                        <td style="padding: 8px 10px; font-family: monospace; font-size: 11px; color: #b91c1c; word-break: break-word;">$errDetailsClean</td>
                    </tr>
"@)
                }
            }

            # Subject designed for automated ticketing parsing:
            $TicketSubject = "[INCIDENT] Source Health Alert - $($breached.SourceName) Exceeded Error Rate Threshold ($Tenant)"

            # Populate incident template placeholders
            $ticketReplacements = @{
                "{{Tenant}}"                = (Escape-Html $Tenant)
                "{{LookbackHours}}"         = $LookbackHours
                "{{SourceName}}"            = (Escape-Html $breached.SourceName)
                "{{SourceId}}"              = (Escape-Html $breached.SourceId)
                "{{ConnectorType}}"         = (Escape-Html $breached.ConnectorType)
                "{{CombinedErrorRate}}"     = $breached.CombinedErrorRate
                "{{CombinedFailed}}"        = $breached.CombinedFailed
                "{{CombinedTotal}}"         = $breached.CombinedTotal
                "{{ErrorThresholdPercent}}" = $ErrorThresholdPercent
                "{{TicketOpsRows}}"         = $ticketOpsRows.ToString()
                "{{GeneratedTimestamp}}"    = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
            }

            $TicketHtmlBody = $IncidentTemplateRaw
            foreach ($tKey in $ticketReplacements.Keys) {
                $TicketHtmlBody = $TicketHtmlBody.Replace($tKey, [string]$ticketReplacements[$tKey])
            }

            $TicketMailParams = @{
                To            = $TicketRecipients
                From          = $FromEmail
                Subject       = $TicketSubject
                Body          = $TicketHtmlBody
                BodyAsHtml    = $true
                SmtpServer    = $SmtpServer
                Port          = $SmtpPort
                UseSsl        = $true
                Credential    = $SmtpCreds
                WarningAction = "SilentlyContinue"
            }

            try {
                Send-MailMessage @TicketMailParams
                $TotalTicketsDispatched++
                Log-Host "Dispatched incident ticket for source '$($breached.SourceName)' to: $($TicketRecipients -join ', ')" -Level "SUCCESS" -ForegroundColor Green
            }
            catch {
                Log-Host "Failed dispatching incident ticket for '$($breached.SourceName)': $($_.Exception.Message)" -Level "ERROR"
            }
        }
    }
}

# ==============================================================================
# 12. PRIVILEGED ACTION GATEWAY (PAG) / WORKFLOW OUTPUT
# ==============================================================================
$FinalResult = [ordered]@{
    status                 = "success"
    tenant                 = $Tenant
    alertTriggered         = ($TotalBreachedSources -gt 0)
    errorThresholdPercent  = $ErrorThresholdPercent
    lookbackHours          = $LookbackHours
    sourcesEvaluated       = $TotalSourcesEvaluated
    sourcesExcluded        = $TotalExcludedSources
    sourcesBreached        = $TotalBreachedSources
    sourcesWithWarnings    = $TotalWarningSources
    healthySources         = $TotalHealthySources
    totalOperationsRuns    = $TotalOverallOperations
    totalFailedOperations  = $TotalOverallFailures
    tenantErrorRatePercent = $OverallTenantErrorRate
    ticketsDispatched      = $TotalTicketsDispatched
    ticketRecipient        = if ($ShouldCreateTickets) { $TicketEmailToSendTo } else { "" }
    reportCsvPath          = $CsvReportPath
    duration               = $Duration
    generatedAt            = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

Write-Log -Message "--- Script Execution Complete: Status=Success, Breached=$TotalBreachedSources, Failures=$TotalOverallFailures, Tickets=$TotalTicketsDispatched ---" -Level "INFO"

# Emit pure compressed JSON to standard output so SailPoint Workflow / PAG can parse it
Write-Output ($FinalResult | ConvertTo-Json -Depth 5 -Compress)

