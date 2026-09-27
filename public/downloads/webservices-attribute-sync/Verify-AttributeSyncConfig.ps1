<#
.SYNOPSIS
    Streamlined End-to-End Attribute Sync Verification Tool for SailPoint ISC.

.DESCRIPTION
    Validates Web Services attribute synchronization in a clean 6-step lifecycle:
    1. Authenticates to SailPoint ISC and loads the source's attribute-sync-config.
    2. Identifies a target correlated account and authoritative Identity attribute value.
    3. Simulates a discrepancy by directly injecting a desynced value into the backend API.
    4. Queues a single account aggregation (POST /accounts/v1/:id/reload) and waits for ISC to detect it.
    5. Dispatches high-priority identity sync (POST /identities/v1/:id/synchronize-attributes).
    6. Polls the backend API until SailPoint's Update Account operation restores the authoritative value.

.EXAMPLE
    .\Verify-AttributeSyncConfig.ps1 -SourceId "2c91808568c529c60168cca69f000000" -NativeIdentity "1001" -AttributeName "title"
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $true, HelpMessage = "The SailPoint Source ID")]
    [string]$SourceId,

    [Parameter(Mandatory = $false, HelpMessage = "The nativeIdentity (account ID on target system) to test")]
    [string]$NativeIdentity = "1001",

    [Parameter(Mandatory = $false, HelpMessage = "Target account attribute to test (e.g. title, department, email)")]
    [string]$AttributeName = "title",

    [Parameter(Mandatory = $false, HelpMessage = "Custom value to inject into backend to simulate desync")]
    [string]$DesyncValue,

    [Parameter(Mandatory = $false, HelpMessage = "Backend API base URL (auto-detected if omitted)")]
    [string]$BackendUrl,

    [Parameter(Mandatory = $false, HelpMessage = "Bearer token for backend API authentication (if required)")]
    [string]$BackendToken,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint Tenant Name (or set env:SAILPOINT_TENANT)")]
    [string]$Tenant = $env:SAILPOINT_TENANT,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint API Client ID (or set env:SAILPOINT_CLIENT_ID)")]
    [string]$ClientId = $env:SAILPOINT_CLIENT_ID,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint API Client Secret (or set env:SAILPOINT_CLIENT_SECRET)")]
    [string]$ClientSecret = $env:SAILPOINT_CLIENT_SECRET,

    [Parameter(Mandatory = $false, HelpMessage = "Path to credentials file")]
    [string]$CredFile = ".\credentials.txt",

    [Parameter(Mandatory = $false, HelpMessage = "Maximum seconds to wait during polling phases")]
    [int]$TimeoutSeconds = 90,

    [Parameter(Mandatory = $false, HelpMessage = "Polling interval in seconds")]
    [int]$PollIntervalSeconds = 3
)

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

function Write-Step { param([string]$Message) Write-Host "`n[STEP] $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Info { param([string]$Message) Write-Host "  -> $Message" -ForegroundColor Gray }
function Write-WarnMsg { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Fail { param([string]$Message) Write-Host "[FAILED] $Message" -ForegroundColor Red }

$SourceId = $SourceId -replace '(?i)^sources/', ''

# 1. Authenticate to ISC
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
Write-Host "         SAILPOINT ISC - ATTRIBUTE SYNC VERIFICATION TOOL              " -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Magenta

Write-Step "Authenticating to SailPoint ISC ($Tenant)..."
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

# 2. Retrieve Source & Sync Configuration
Write-Step "Reading Source Details & Sync Config..."
try {
    $sourceObj = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1/$SourceId" -Headers $Headers
    $SourceName = $sourceObj.name
    Write-Info "Source: $SourceName ($SourceId)"

    if (-not $BackendUrl) {
        $BackendUrl = $sourceObj.connectorAttributes.genericWebServiceBaseUrl
        Write-Info "Auto-detected Backend URL: $BackendUrl"
    }

    $syncConfig = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1/$SourceId/attribute-sync-config" -Headers $Headers
    $targetMapping = $syncConfig.attributes | Where-Object { $_.target -eq $AttributeName -or $_.name -eq $AttributeName } | Select-Object -First 1
    
    if (-not $targetMapping) {
        Write-Fail "Attribute '$AttributeName' is not mapped in attribute-sync-config for '$SourceName'."
        exit 1
    }

    $idAttr = $targetMapping.name
    $acctAttr = $targetMapping.target
    Write-Success "Testing Sync Mapping: Identity '$idAttr' -> Account '$acctAttr' (Enabled: $($targetMapping.enabled))"
} catch {
    Write-Fail "Failed to load source configuration: $_"
    exit 1
}

# 3. Target Account & Authoritative Value
Write-Step "Locating Target Account and Authoritative Identity Value..."
try {
    $acctFilter = [uri]::EscapeDataString("sourceId eq `"$SourceId`" and nativeIdentity eq `"$NativeIdentity`"")
    $acctList = Invoke-RestMethod -Method Get -Uri "$BaseUrl/accounts/v1?filters=$acctFilter" -Headers $Headers
    if (-not $acctList -or $acctList.Count -eq 0) {
        Write-Fail "Account with nativeIdentity '$NativeIdentity' not found on source."
        exit 1
    }
    $targetAccount = $acctList[0]
    $AccountId = $targetAccount.id
    $IdentityId = $targetAccount.identityId

    $searchBody = @{
        query = @{ query = "id:$IdentityId" }
        indices = @("identities")
    } | ConvertTo-Json
    $identityRes = Invoke-RestMethod -Method Post -Uri "$BaseUrl/search/v1" -Headers $Headers -Body $searchBody
    $targetIdentity = $identityRes[0]

    $AuthoritativeValue = $targetIdentity.attributes.$idAttr
    Write-Info "Target User: $($targetIdentity.displayName) (Native ID: $NativeIdentity)"
    Write-Info "Authoritative Identity Value ($idAttr): '$AuthoritativeValue'"
    Write-Info "Current ISC Account Cache ($acctAttr) : '$($targetAccount.attributes.$acctAttr)'"
} catch {
    Write-Fail "Failed to resolve target identity: $_"
    exit 1
}

# 4. Inject Backend Desync
Write-Step "Injecting Desync Directly into Backend API..."
$BackendHeaders = @{
    "Content-Type" = "application/json"
    "Accept"       = "application/json"
}
if ($BackendToken) {
    $BackendHeaders["Authorization"] = "Bearer $BackendToken"
}

if (-not $DesyncValue) {
    $DesyncValue = "Desync_Test_$(Get-Date -Format 'HHmmss')"
}

# Fetch backend user to determine structure
try {
    $backendUser = Invoke-RestMethod -Method Get -Uri "$BackendUrl/users/$NativeIdentity" -Headers $BackendHeaders
    Write-Info "Current Backend Value: '$($backendUser.$acctAttr)'"

    # Merge full object for clean update regardless of PATCH or PUT
    $payload = @{}
    $backendUser.PSObject.Properties | ForEach-Object { $payload[$_.Name] = $_.Value }
    $payload[$acctAttr] = $DesyncValue

    # Update backend user
    $null = Invoke-RestMethod -Method Put -Uri "$BackendUrl/users/$NativeIdentity" -Headers $BackendHeaders -Body ($payload | ConvertTo-Json)
    Write-Success "Backend updated directly. Injected desync value: '$DesyncValue'"
} catch {
    Write-Fail "Failed to inject desync into backend: $_"
    exit 1
}

# 5. Trigger Single Account Aggregation & Poll ISC
Write-Step "Triggering Account Reload in ISC (POST /accounts/v1/$AccountId/reload)..."
try {
    $null = Invoke-RestMethod -Method Post -Uri "$BaseUrl/accounts/v1/$AccountId/reload" -Headers $Headers
    Write-Success "Account reload queued. Polling ISC account cache..."
} catch {
    Write-Fail "Failed to trigger account reload: $_"
    exit 1
}

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$aggregated = $false

while ($sw.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    Start-Sleep -Seconds $PollIntervalSeconds
    try {
        $recheckAcct = Invoke-RestMethod -Method Get -Uri "$BaseUrl/accounts/v1/$AccountId" -Headers $Headers
        if ($recheckAcct.attributes.$acctAttr -eq $DesyncValue) {
            $aggregated = $true
            break
        }
        Write-Info "Waiting for aggregation... ($([int]$sw.Elapsed.TotalSeconds)s)"
    } catch {}
}

if (-not $aggregated) {
    Write-Fail "Timed out waiting for ISC to aggregate desync value '$DesyncValue'."
    exit 1
}
Write-Success "ISC aggregated desync value in $([int]$sw.Elapsed.TotalSeconds)s."

# 6. Trigger Identity Sync & Poll Backend for Restoration
Write-Step "Triggering High-Priority Identity Sync (POST /identities/v1/$IdentityId/synchronize-attributes)..."
try {
    $task = Invoke-RestMethod -Method Post -Uri "$BaseUrl/identities/v1/$IdentityId/synchronize-attributes" -Headers $Headers
    Write-Success "High-priority sync queued (Task ID: $($task.id)). Polling backend for restoration..."
} catch {
    Write-WarnMsg "Identity sync API failed ($_). Waiting for automatic sync..."
}

$swSync = [System.Diagnostics.Stopwatch]::StartNew()
$restored = $false
$finalValue = $null

while ($swSync.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    Start-Sleep -Seconds $PollIntervalSeconds
    try {
        $checkUser = Invoke-RestMethod -Method Get -Uri "$BackendUrl/users/$NativeIdentity" -Headers $BackendHeaders
        $finalValue = $checkUser.$acctAttr
        if ($finalValue -eq $AuthoritativeValue) {
            $restored = $true
            break
        }
        Write-Info "Waiting for attribute sync... ($([int]$swSync.Elapsed.TotalSeconds)s - Backend='$finalValue')"
    } catch {}
}

# 7. Print Final Result
Write-Host "`n======================================================================" -ForegroundColor Magenta
Write-Host "                      VERIFICATION SUMMARY                            " -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "Source Tested       : $SourceName"
Write-Host "User Tested         : $($targetIdentity.displayName) (Native ID: $NativeIdentity)"
Write-Host "Attribute Tested    : Identity '$idAttr' -> Account '$acctAttr'"
Write-Host "Authoritative Value : '$AuthoritativeValue'"
Write-Host "Desync Test Value   : '$DesyncValue'"
Write-Host "Final Backend Value : '$finalValue'"
Write-Host "Result              : " -NoNewline

if ($restored) {
    Write-Host "PASSED - ATTRIBUTE SYNC VERIFIED IN $([int]$swSync.Elapsed.TotalSeconds)s!" -ForegroundColor Green
} else {
    Write-Host "FAILED / TIMED OUT - Backend value was not restored." -ForegroundColor Red
}
Write-Host "======================================================================`n" -ForegroundColor Magenta
