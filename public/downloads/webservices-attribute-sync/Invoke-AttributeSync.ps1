<#
.SYNOPSIS
    Action tool that bolts onto AttributeSyncReport to selectively remediate out-of-sync identities.

.DESCRIPTION
    Consumes output from AttributeSyncReport.ps1 (via pipeline or CSV file) and triggers attribute synchronization.
    Supports filtering by Lifecycle State (e.g. Active Only vs All), a single-sync safety mode, and WhatIf simulation.

    QUEUE BEHAVIOR EXPLANATION:
    - HighPriority (Default): Calls POST /identities/v1/{id}/synchronize-attributes. 
      In SailPoint ISC, triggering a refresh per Identity bypasses the background bulk batch queue
      and places the task into a dedicated, high-priority interactive queue (SYNCHRONIZE_IDENTITY_ATTRIBUTES).
      This executes within seconds rather than waiting behind large aggregations or long-running workflows.
    - StandardWps: Triggers source-level sync via POST /sources/v1/{id}/synchronize-attributes.
      This routes through the standard WPS background queue, which processes
      in bulk and can take longer during high-tenant-load windows.

.EXAMPLE
    # Direct Pipeline usage (Active LCS only, High Priority):
    .\AttributeSyncReport.ps1 -SourceId "2c91808568c529c60168cca69f000000" -PassThru | .\Invoke-AttributeSync.ps1 -LifecycleFilter ActiveOnly

.EXAMPLE
    # Test a single identity first before batching:
    .\Invoke-AttributeSync.ps1 -CsvPath ".\AttributeSyncReport.csv" -SingleSync -DryRun

.EXAMPLE
    # Sync all lifecycle states including inactive:
    .\Invoke-AttributeSync.ps1 -CsvPath ".\AttributeSyncReport.csv" -LifecycleFilter All
#>

[CmdletBinding()]
param (
    [Parameter(ValueFromPipeline = $true, HelpMessage = "Pipeline input objects from AttributeSyncReport.ps1")]
    [psobject[]]$InputData,

    [Parameter(Mandatory = $false, HelpMessage = "Path to an exported CSV report from AttributeSyncReport.ps1")]
    [string]$CsvPath,

    [Parameter(Mandatory = $false, HelpMessage = "Source ID to generate and sync report on-the-fly")]
    [string]$SourceId,

    [Parameter(Mandatory = $false, HelpMessage = "Filter identities by Lifecycle State (LCS)")]
    [ValidateSet("ActiveOnly", "All", "Custom")]
    [string]$LifecycleFilter = "ActiveOnly",

    [Parameter(Mandatory = $false, HelpMessage = "Custom Lifecycle States to include when LifecycleFilter is 'Custom'")]
    [string[]]$CustomLifecycleStates = @("active"),

    [Parameter(Mandatory = $false, HelpMessage = "Remediate only a single identity (safety check mode)")]
    [switch]$SingleSync,

    [Parameter(Mandatory = $false, HelpMessage = "Queue Priority: HighPriority (Identity-level queue) vs StandardWps (Source-level queue)")]
    [ValidateSet("HighPriority", "StandardWps")]
    [string]$QueuePriority = "HighPriority",

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint Tenant Name (or set env:SAILPOINT_TENANT)")]
    [string]$Tenant = $env:SAILPOINT_TENANT,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint API Client ID (or set env:SAILPOINT_CLIENT_ID)")]
    [string]$ClientId = $env:SAILPOINT_CLIENT_ID,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint API Client Secret (or set env:SAILPOINT_CLIENT_SECRET)")]
    [string]$ClientSecret = $env:SAILPOINT_CLIENT_SECRET,

    [Parameter(Mandatory = $false, HelpMessage = "Path to credentials file")]
    [string]$CredFile = ".\credentials.txt",

    [Parameter(Mandatory = $false, HelpMessage = "Preview the actions without invoking the SailPoint API")]
    [switch]$DryRun
)

begin {
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

    function Write-Step { param([string]$Message) Write-Host "`n[STEP] $Message" -ForegroundColor Cyan }
    function Write-Success { param([string]$Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
    function Write-Info { param([string]$Message) Write-Host "  -> $Message" -ForegroundColor Gray }
    function Write-WarnMsg { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
    function Write-Fail { param([string]$Message) Write-Host "[FAILED] $Message" -ForegroundColor Red }

    $CollectedRows = [System.Collections.Generic.List[psobject]]::new()

    # Load credentials
    if ($CredFile -and (Test-Path $CredFile)) {
        $credLines = Get-Content $CredFile
        foreach ($line in $credLines) {
            if ($line -match '^ClientID:\s*(.+)$' -and -not $ClientId) { $ClientId = $matches[1].Trim() }
            if ($line -match '^ClientSecret:\s*(.+)$' -and -not $ClientSecret) { $ClientSecret = $matches[1].Trim() }
            if ($line -match '^Tenant:\s*(.+)$' -and -not $Tenant) { $Tenant = $matches[1].Trim() }
        }
    }

    if (-not $Tenant) {
        Write-Fail "Missing Tenant. Specify -Tenant, set the SAILPOINT_TENANT environment variable, or define 'Tenant: <name>' in -CredFile."
        exit 1
    }

    if (-not $ClientId -or -not $ClientSecret) {
        Write-Fail "Missing ClientId or ClientSecret. Specify -ClientId and -ClientSecret, set environment variables (SAILPOINT_CLIENT_ID, SAILPOINT_CLIENT_SECRET), or provide -CredFile."
        exit 1
    }

    $BaseDomain = if ($Tenant -match 'demo') { "identitynow-demo.com" } else { "identitynow.com" }
    $BaseUrl = if ($Tenant -match '\.') { "https://$Tenant" } else { "https://$Tenant.api.$BaseDomain" }

    Write-Host "======================================================================" -ForegroundColor Magenta
    Write-Host "         SAILPOINT ISC - ATTRIBUTE SYNC ACTION INVOCATION TOOL         " -ForegroundColor Magenta
    Write-Host "======================================================================" -ForegroundColor Magenta
    Write-Info "Queue Priority Mode : $QueuePriority"
    if ($QueuePriority -eq "HighPriority") {
        Write-Info "Target Queue        : Interactive High-Priority Queue (/identities/v1/:id/synchronize-attributes)"
        Write-Info "Note                : Bypasses standard background WPS queue; actions within seconds."
    } else {
        Write-Info "Target Queue        : Background WPS Batch Queue"
        Write-Info "Note                : Evaluated in bulk across the source; subject to batch queue latency."
    }
    Write-Info "Lifecycle Filter    : $LifecycleFilter"
    Write-Info "Single Sync Only    : $(if ($SingleSync) { 'YES' } else { 'NO (Batch Mode)' })"
    Write-Info "Simulation (DryRun) : $(if ($DryRun) { 'ENABLED (Dry Run)' } else { 'NO (Live Execution)' })"
}

process {
    if ($InputData) {
        foreach ($row in $InputData) {
            $CollectedRows.Add($row)
        }
    }
}

end {
    # If no pipeline input was provided, check CsvPath or SourceId
    if ($CollectedRows.Count -eq 0) {
        if ($CsvPath -and (Test-Path $CsvPath)) {
            Write-Step "Loading report rows from CSV: $CsvPath..."
            $csvRows = Import-Csv -Path $CsvPath
            foreach ($r in $csvRows) {
                $CollectedRows.Add($r)
            }
            Write-Success "Loaded $($CollectedRows.Count) rows from CSV."
        } elseif ($SourceId) {
            Write-Step "Generating sync report for SourceId: $SourceId..."
            $generatedReport = .\AttributeSyncReport.ps1 -SourceId $SourceId -Tenant $Tenant -ClientId $ClientId -ClientSecret $ClientSecret -PassThru
            foreach ($r in $generatedReport) {
                $CollectedRows.Add($r)
            }
        } else {
            Write-Fail "No input data provided! Pipe output from AttributeSyncReport.ps1, specify -CsvPath, or provide -SourceId."
            exit 1
        }
    }

    # Authenticate to ISC
    Write-Step "Authenticating to SailPoint ISC Tenant ($Tenant)..."
    try {
        $TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body @{
            grant_type    = "client_credentials"
            client_id     = $ClientId
            client_secret = $ClientSecret
        }
        $Headers = @{
            "Authorization"            = "Bearer $($TokenResponse.access_token)"
            "Content-Type"             = "application/json"
            "Accept"                   = "application/json"
            "X-SailPoint-Experimental" = "true"
        }
        Write-Success "Authenticated to ISC successfully."
    } catch {
        Write-Fail "Authentication failed: $_"
        exit 1
    }

    # Filter for out-of-sync items where sync is enabled
    $outOfSyncItems = $CollectedRows | Where-Object { 
        ([string]$_.InSync -eq 'False') -and 
        ([string]$_.SyncEnabled -eq 'True') -and
        ($_.IdentityName -ne 'Uncorrelated' -and -not [string]::IsNullOrEmpty($_.IdentityId))
    }

    Write-Info "Total Out-of-Sync enabled candidate attributes: $($outOfSyncItems.Count)"

    if ($outOfSyncItems.Count -eq 0) {
        Write-Success "All evaluated accounts are already in sync! No action required."
        return
    }

    # Apply Lifecycle State Filtering
    $filteredItems = switch ($LifecycleFilter) {
        "ActiveOnly" {
            $outOfSyncItems | Where-Object { 
                $lcs = [string]$_.LifecycleState
                $lcs -eq "active" -or $lcs -eq "Active"
            }
        }
        "All" {
            $outOfSyncItems
        }
        "Custom" {
            $outOfSyncItems | Where-Object {
                $lcs = [string]$_.LifecycleState
                $CustomLifecycleStates -contains $lcs
            }
        }
    }

    Write-Info "Out-of-Sync attributes matching Lifecycle State filter ('$LifecycleFilter'): $($filteredItems.Count)"

    if ($filteredItems.Count -eq 0) {
        Write-WarnMsg "Out-of-sync attributes exist, but none match the current Lifecycle Filter ('$LifecycleFilter')."
        Write-Info "Tip: Use -LifecycleFilter All to include inactive or terminated accounts."
        return
    }

    # Group by Identity (Since sync is triggered per Identity or Source)
    $groupedByIdentity = $filteredItems | Group-Object -Property IdentityId
    Write-Success "Identified $($groupedByIdentity.Count) unique out-of-sync identities to remediate."

    # If SingleSync is requested, slice to only the first identity
    $targetGroups = $groupedByIdentity
    if ($SingleSync) {
        $targetGroups = @($groupedByIdentity[0])
        Write-WarnMsg "[SINGLE-SYNC MODE ENABLED]: Processing ONLY the first out-of-sync identity: $($targetGroups[0].Group[0].IdentityName) ($($targetGroups[0].Name))"
    }

    # Execution Loop
    Write-Step "Actioning Attribute Sync remediation..."
    $successCount = 0
    $failCount = 0

    foreach ($group in $targetGroups) {
        $identId = $group.Name
        $identName = $group.Group[0].IdentityName
        $identLcs = $group.Group[0].LifecycleState
        $desyncedAttrs = ($group.Group | ForEach-Object { "$($_.AccountAttribute) (Current: '$($_.CurrentAccountVal)' -> Desired: '$($_.AuthoritativeValue)')" }) -join "; "

        Write-Host "`n----------------------------------------------------------------------" -ForegroundColor DarkGray
        Write-Info "Target Identity : $identName (ID: $identId)"
        Write-Info "Lifecycle State : $identLcs"
        Write-Info "Desynced Fields : $desyncedAttrs"

        if ($QueuePriority -eq "HighPriority") {
            # POST /identities/v1/:id/synchronize-attributes
            $uri = "$BaseUrl/identities/v1/$identId/synchronize-attributes"
            Write-Info "[HIGH-PRIORITY QUEUE] POST $uri"

            if ($DryRun) {
                Write-Host "  [SIMULATION - DRYRUN] Would enqueue SYNCHRONIZE_IDENTITY_ATTRIBUTES for Identity '$identName'." -ForegroundColor Yellow
                $successCount++
            } else {
                try {
                    $task = Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers
                    Write-Success "Enqueued high-priority sync successfully! Task ID: $($task.id), Status: $($task.status)"
                    $successCount++
                } catch {
                    Write-Fail "Failed to trigger identity sync for '$identName': $_"
                    $failCount++
                }
            }
        } else {
            # Standard WPS Queue via Source Sync
            $srcId = $group.Group[0].SourceId
            $uri = "$BaseUrl/sources/v1/$srcId/synchronize-attributes"
            Write-Info "[STANDARD WPS QUEUE] POST $uri"

            if ($DryRun) {
                Write-Host "  [SIMULATION - DRYRUN] Would enqueue source attribute sync for source '$srcId'." -ForegroundColor Yellow
                $successCount++
                break # Source-level sync triggers for the whole source
            } else {
                try {
                    $task = Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers
                    Write-Success "Enqueued source-level WPS sync successfully! Task ID: $($task.id)"
                    $successCount++
                    Write-Info "Standard source sync covers all accounts on source. Halting per-identity loop."
                    break
                } catch {
                    Write-Fail "Failed to trigger source sync: $_"
                    $failCount++
                    break
                }
            }
        }
    }

    Write-Host "`n======================================================================" -ForegroundColor Magenta
    Write-Host "                       REMEDIATION SUMMARY                            " -ForegroundColor Magenta
    Write-Host "======================================================================" -ForegroundColor Magenta
    Write-Host "Total Target Identities : $($targetGroups.Count)"
    Write-Host "Successfully Enqueued   : $successCount"
    Write-Host "Failures                : $failCount"
    Write-Host "Queue Mode              : $QueuePriority"
    Write-Host "Status                  : " -NoNewline
    if ($failCount -eq 0) {
        Write-Host "COMPLETED SUCCESSFULLY" -ForegroundColor Green
    } else {
        Write-Host "COMPLETED WITH ERRORS" -ForegroundColor Yellow
    }
    Write-Host "======================================================================`n" -ForegroundColor Magenta
}
