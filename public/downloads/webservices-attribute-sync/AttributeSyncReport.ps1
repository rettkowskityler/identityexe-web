<#
.SYNOPSIS
    Generates an Attribute Sync Crystal Ball Report comparing Source Account attributes 
    to authoritative Identity attributes based on the source's attribute-sync-config.

.DESCRIPTION
    1. Authenticates to SailPoint ISC.
    2. Reads the source's attribute-sync-config to find mapped and enabled attributes.
    3. Fetches accounts belonging to the source and correlated identities via Search.
    4. Compares live account attributes against authoritative identity attributes.
    5. Outputs structured report objects to the PowerShell pipeline and/or exports to CSV.

.EXAMPLE
    # Generate report and export to CSV:
    .\AttributeSyncReport.ps1 -SourceId "2c91808568c529c60168cca69f000000" -OutFile ".\AttributeSyncReport.csv"

.EXAMPLE
    # Pipe directly to the sync invocation tool:
    .\AttributeSyncReport.ps1 -SourceId "2c91808568c529c60168cca69f000000" -PassThru | .\Invoke-AttributeSync.ps1 -LifecycleFilter ActiveOnly
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $true, ValueFromPipeline = $true, HelpMessage = "The SailPoint Source ID")]
    [string]$SourceId,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint Tenant Name (or set env:SAILPOINT_TENANT)")]
    [string]$Tenant = $env:SAILPOINT_TENANT,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint API Client ID (or set env:SAILPOINT_CLIENT_ID)")]
    [string]$ClientId = $env:SAILPOINT_CLIENT_ID,

    [Parameter(Mandatory = $false, HelpMessage = "SailPoint API Client Secret (or set env:SAILPOINT_CLIENT_SECRET)")]
    [string]$ClientSecret = $env:SAILPOINT_CLIENT_SECRET,

    [Parameter(Mandatory = $false, HelpMessage = "Path to credentials file")]
    [string]$CredFile = ".\credentials.txt",

    [Parameter(Mandatory = $false, HelpMessage = "CSV Output file path")]
    [string]$OutFile,

    [Parameter(Mandatory = $false, HelpMessage = "Output report objects directly to the pipeline")]
    [switch]$PassThru = $true,

    [Parameter(Mandatory = $false, HelpMessage = "Recipient email address for automated reports")]
    [string]$RecipientEmail
)

# Ensure TLS 1.2
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

# Helper Write Functions
function Write-Step { param([string]$Message) Write-Host "`n[STEP] $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Info { param([string]$Message) Write-Host "  -> $Message" -ForegroundColor Gray }
function Write-WarnMsg { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Fail { param([string]$Message) Write-Host "[FAILED] $Message" -ForegroundColor Red }

# Clean SourceId if prefixed
$SourceId = $SourceId -replace '(?i)^sources/', ''

# 1. Load Credentials & Authenticate
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

# 2. Retrieve Source & Attribute Sync Configuration
Write-Step "Reading Source and Attribute Sync Configuration for source '$SourceId'..."
try {
    $sourceObj = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1/$SourceId" -Headers $Headers
    $SourceName = $sourceObj.name
    Write-Info "Source Name: $SourceName"
} catch {
    Write-WarnMsg "Could not fetch source name, using Source ID."
    $SourceName = $SourceId
}

try {
    $syncConfig = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1/$SourceId/attribute-sync-config" -Headers $Headers
    $configuredAttrs = $syncConfig.attributes
    if (-not $configuredAttrs -or $configuredAttrs.Count -eq 0) {
        Write-WarnMsg "No attributes configured in attribute-sync-config for source '$SourceName'."
        exit 0
    }
    Write-Success "Found $($configuredAttrs.Count) configured attribute mappings."
} catch {
    Write-Fail "Failed to retrieve attribute-sync-config: $_"
    exit 1
}

# 3. Gather Accounts for Source
Write-Step "Fetching accounts for source '$SourceName'..."
$allAccounts = @()
$offset = 0
$limit = 250
$filter = [uri]::EscapeDataString("sourceId eq `"$SourceId`"")

while ($true) {
    $acctUri = "$BaseUrl/accounts/v1?filters=$filter&offset=$offset&limit=$limit"
    $acctsBatch = Invoke-RestMethod -Method Get -Uri $acctUri -Headers $Headers
    if (-not $acctsBatch -or $acctsBatch.Count -eq 0) { break }
    $allAccounts += $acctsBatch
    if ($acctsBatch.Count -lt $limit) { break }
    $offset += $limit
}

Write-Success "Retrieved $($allAccounts.Count) accounts from source."

if ($allAccounts.Count -eq 0) {
    Write-WarnMsg "No accounts found on this source to evaluate."
    exit 0
}

# 4. Gather Linked Identities via Search
Write-Step "Fetching linked identities via Search..."
$allIdentities = @()
$searchOffset = 0
$searchLimit = 250

while ($true) {
    $searchPayload = @{
        indices           = @("identities")
        query             = @{ query = "@accounts(source.id:`"$SourceId`")" }
        queryResultFilter = @{
            includes = @("id", "name", "displayName", "identityState", "attributes")
        }
    }
    $searchUri = "$BaseUrl/search/v1?offset=$searchOffset&limit=$searchLimit"
    $idBatch = Invoke-RestMethod -Method Post -Uri $searchUri -Headers $Headers -Body ($searchPayload | ConvertTo-Json -Depth 5)
    if (-not $idBatch -or $idBatch.Count -eq 0) { break }
    $allIdentities += $idBatch
    if ($idBatch.Count -lt $searchLimit) { break }
    $searchOffset += $searchLimit
}

Write-Success "Retrieved $($allIdentities.Count) linked identities from Search."

# Build fast Identity lookup dictionary
$identityMap = @{}
foreach ($ident in $allIdentities) {
    $identityMap[$ident.id] = $ident
}

# 5. Evaluate Attribute Differences
Write-Step "Evaluating sync state across $($allAccounts.Count) accounts..."
$reportRows = @()

foreach ($account in $allAccounts) {
    $linkedId = $null
    if ($account.identityId -and $identityMap.ContainsKey($account.identityId)) {
        $linkedId = $identityMap[$account.identityId]
    }

    $identityName = if ($linkedId) { $linkedId.displayName } else { "Uncorrelated" }
    $identityId = if ($linkedId) { $linkedId.id } else { $null }

    # Resolve Lifecycle State (LCS)
    $lcs = "unknown"
    if ($linkedId) {
        if ($linkedId.attributes.cloudLifecycleState) {
            $lcs = [string]$linkedId.attributes.cloudLifecycleState
        } elseif ($linkedId.identityState) {
            $lcs = [string]$linkedId.identityState
        }
    }

    foreach ($mapping in $configuredAttrs) {
        $idAttrName = $mapping.name
        $acctAttrName = $mapping.target
        $isEnabled = [bool]$mapping.enabled

        $acctVal = $account.attributes.$acctAttrName
        $idVal = if ($linkedId -and $linkedId.attributes) { $linkedId.attributes.$idAttrName } else { $null }

        $acctValStr = if ($acctVal -is [array]) { $acctVal -join ', ' } else { [string]$acctVal }
        $idValStr = if ($idVal -is [array]) { $idVal -join ', ' } else { [string]$idVal }

        # Check equality
        $inSync = ($acctValStr -eq $idValStr)

        $reportRows += [PSCustomObject]@{
            SourceId           = $SourceId
            SourceName         = $SourceName
            IdentityId         = $identityId
            IdentityName       = $identityName
            LifecycleState     = $lcs
            AccountId          = $account.id
            AccountName        = $account.name
            NativeIdentity     = $account.nativeIdentity
            IdentityAttribute  = $idAttrName
            AccountAttribute   = $acctAttrName
            SyncEnabled        = $isEnabled
            AuthoritativeValue = $idValStr
            CurrentAccountVal  = $acctValStr
            InSync             = $inSync
        }
    }
}

# Summary counts
$totalChecked = $reportRows.Count
$totalOutOfSync = ($reportRows | Where-Object { -not $_.InSync -and $_.SyncEnabled }).Count
Write-Success "Attribute evaluation complete! Total attributes checked: $totalChecked. Out of sync (Enabled): $totalOutOfSync"

# 6. Export to CSV if specified or default
if (-not $OutFile) {
    $safeName = $SourceName -replace '[^a-zA-Z0-9]', '_'
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $OutFile = ".\AttributeSyncReport_${safeName}_${timestamp}.csv"
}

$reportRows | Export-Csv -Path $OutFile -NoTypeInformation
Write-Info "Report saved to: $OutFile"

# 7. Pipeline Output
if ($PassThru) {
    Write-Output $reportRows
}
