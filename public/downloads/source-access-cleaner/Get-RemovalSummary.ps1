<#
.SYNOPSIS
    SailPoint Identity Security Cloud (ISC) - User Access Remediation & Form UI Generator.
    Designed for Windows Server node (Execute PowerShell Script) and Workflow automation.

.DESCRIPTION
    Parameterized for target Source Name or ID passed by the SailPoint ISC Workflow.
    Filters target source access for identities matching the specified Lifecycle State (LCS) ID(s).
    Supports 4 Remediation Modes:
      1. Preview Only Mode (Default: Audit / Dry-Run Mode, shows all affected access, no changes made)
      2. Remove Entitlements & Disable Account (Full Access Cleanup for users needing disable OR entitlement removal)
      3. Remove Entitlements (Entitlements Only: shows users who need entitlements removed, accounts retained)
      4. Disable Accounts (Accounts Only: shows users who need account disabled, entitlements retained)

    Generates:
      1. formTableHtml: Form-ready HTML table string.
      2. remediationMap: Account-to-entitlements mapping tailored for downstream revocation/disablement automation.
      3. metrics: Summary counts of affected identities, accounts, and entitlements filtered by mode and LCS.
      4. reportRows: Array of flat access records for audit reporting.

.PARAMETER SourceName
    Target Source Name or ID in SailPoint ISC (passed by the Workflow).

.PARAMETER ActionMode
    The remediation action mode selected from the interactive Form dropdown:
      - "Preview Only Mode" (Default)
      - "Remove Entitlements & Disable Account"
      - "Remove Entitlements"
      - "Disable Accounts"

.PARAMETER LifecycleStateId
    Lifecycle State ID(s) to evaluate (single string, array of strings, or bracketed string).
    Defaults to resolving the 'terminated' lifecycle state if none provided.

.PARAMETER SummaryEmail
    Send summary email with attached CSV report (boolean).

.PARAMETER EmailToSendTo
    Recipient email address for the summary report.

.OUTPUTS
    Clean JSON string written to stdout containing:
    { appName, sourceId, actionMode, normalizedMode, lifecycleStates, lifecycleStateIds, generatedAt, metrics, formTableHtml, remediationMap, reportRows, emailStatus }.
#>

param (
    [Parameter(Mandatory = $true, HelpMessage = "Target Source Name or ID in SailPoint ISC")]
    [string]$SourceName,

    [Parameter(Mandatory = $false, HelpMessage = "Remediation Action Option")]
    [string]$ActionMode = "Preview Only Mode",

    [Parameter(Mandatory = $false, HelpMessage = "Lifecycle State ID(s) - string or array of strings")]
    [string[]]$LifecycleStateId,

    [Parameter(Mandatory = $false, HelpMessage = "Send summary email with attached CSV report")]
    $SummaryEmail = $false,

    [Parameter(Mandatory = $false, HelpMessage = "Recipient email address for the summary report")]
    [string]$EmailToSendTo
)

# ==============================================================================
# CONFIGURATION & CREDENTIALS
# ==============================================================================
# --- SailPoint ISC Tenant Configuration ---
$Tenant                 = "YOUR_TENANT"
$ClientId               = "YOUR_CLIENT_ID"
$ClientSecret           = "YOUR_CLIENT_SECRET"
$BaseUrl                = "https://$Tenant.api.identitynow.com"

# --- SMTP Relay Email Configuration ---
$SmtpServer             = "smtp.yourcompany.com"
$SmtpPort               = 587
$FromEmail              = "sailpoint-notifications@yourcompany.com"
$SmtpUsername           = "YOUR_SMTP_USERNAME"
$SmtpPassword           = "YOUR_SMTP_PASSWORD"

# --- Directory Paths & File Locations ---
$BaseScriptDir          = "C:\SailPoint\Scripts\source-access-cleaner"
$ScriptDirectory        = if ($PSScriptRoot) { $PSScriptRoot } elseif ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { $BaseScriptDir }
$LogFile                = Join-Path -Path $ScriptDirectory -ChildPath "logs.txt"
$ExportDirectory        = if (Test-Path "$BaseScriptDir\temp-reports") { "$BaseScriptDir\temp-reports" } else { Join-Path $ScriptDirectory "temp-reports" }

# --- Runtime & API Execution Settings ---
$SilentGatewayMode      = $true             # Set to $true in Windows Server node Workflows to suppress host console logs
$SearchPageLimit        = 250               # Max items per Search API request (ISC max is 250)
# ==============================================================================

# Ensure TLS 1.2
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

# --- Logger Functions ---
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ForegroundColor = "White"
    )
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $LogLine   = "[$Timestamp] [$Level] $Message"

    if ($LogFile) {
        try {
            Add-Content -Path $LogFile -Value $LogLine -ErrorAction SilentlyContinue
        } catch {}
    }

    if (-not $SilentGatewayMode) {
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

# --- Resolve Action Mode (Default: Preview Only Mode) ---
$NormalizedMode    = "PreviewOnly"
$DisplayActionMode = "Preview Only Mode"

if (-not [string]::IsNullOrWhiteSpace($ActionMode)) {
    switch ($ActionMode.Trim()) {
        "Preview Only Mode" {
            $NormalizedMode    = "PreviewOnly"
            $DisplayActionMode = "Preview Only Mode"
            break
        }
        "Remove Entitlements & Disable Account" {
            $NormalizedMode    = "RemoveBoth"
            $DisplayActionMode = "Remove Entitlements & Disable Account"
            break
        }
        "Remove Entitlements" {
            $NormalizedMode    = "RemoveEntitlementsOnly"
            $DisplayActionMode = "Remove Entitlements"
            break
        }
        "Disable Accounts" {
            $NormalizedMode    = "DisableAccountsOnly"
            $DisplayActionMode = "Disable Accounts"
            break
        }
        default {
            if ($ActionMode -match 'preview') {
                $NormalizedMode    = "PreviewOnly"
                $DisplayActionMode = "Preview Only Mode"
            } elseif ($ActionMode -match 'entitlement.*disable|disable.*entitlement') {
                $NormalizedMode    = "RemoveBoth"
                $DisplayActionMode = "Remove Entitlements & Disable Account"
            } elseif ($ActionMode -match 'entitlement') {
                $NormalizedMode    = "RemoveEntitlementsOnly"
                $DisplayActionMode = "Remove Entitlements"
            } elseif ($ActionMode -match 'disable') {
                $NormalizedMode    = "DisableAccountsOnly"
                $DisplayActionMode = "Disable Accounts"
            } else {
                $NormalizedMode    = "PreviewOnly"
                $DisplayActionMode = "Preview Only Mode"
            }
        }
    }
}

# --- Parse and Normalize LifecycleStateId Input ---
$TargetLcsIdList = [System.Collections.Generic.List[string]]::new()

if ($null -ne $LifecycleStateId) {
    foreach ($val in $LifecycleStateId) {
        if ($null -eq $val -or [string]::IsNullOrWhiteSpace($val.ToString())) {
            continue
        }
        $valStr = $val.ToString().Trim()

        $parsedAsJson = $false
        if ($valStr.StartsWith("[") -and $valStr.EndsWith("]")) {
            try {
                $json = $valStr | ConvertFrom-Json
                if ($json -is [System.Collections.IEnumerable] -and -not ($json -is [string])) {
                    foreach ($j in $json) {
                        if ($null -ne $j -and -not [string]::IsNullOrWhiteSpace($j.ToString())) {
                            $cleanJ = $j.ToString().Trim().Trim('"', "'")
                            if (-not [string]::IsNullOrWhiteSpace($cleanJ)) {
                                $TargetLcsIdList.Add($cleanJ)
                                $parsedAsJson = $true
                            }
                        }
                    }
                }
            } catch {}
        }

        if (-not $parsedAsJson) {
            $unbracketed = $valStr.Trim([char[]]@('[', ']')).Trim()
            $tokens = $unbracketed -split '[\s,]+'
            foreach ($tok in $tokens) {
                $clean = $tok.Trim().Trim('"', "'")
                if (-not [string]::IsNullOrWhiteSpace($clean)) {
                    $TargetLcsIdList.Add($clean)
                }
            }
        }
    }
}

Write-Log "--- Get-RemovalSummary Script Execution Started ---"
Write-Log "Input Parameters: SourceName='$SourceName', ActionMode='$DisplayActionMode', TargetLcsIds='$($TargetLcsIdList -join ',')', SummaryEmail=$SummaryEmail, EmailToSendTo='$EmailToSendTo'"

# ------------------------------------------------------------------------------
# 1. Authenticate with SailPoint ISC
# ------------------------------------------------------------------------------
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
# 2. Resolve Lifecycle State ID(s) to Names & Technical Names
# ------------------------------------------------------------------------------
$ResolvedLcsTechnicalNames = [System.Collections.Generic.List[string]]::new()
$ResolvedLcsDisplayNames   = [System.Collections.Generic.List[string]]::new()
$ResolvedLcsMetadata       = [System.Collections.Generic.List[PSCustomObject]]::new()

try {
    $Profiles = Invoke-RestMethod -Method Get -Uri "$BaseUrl/identity-profiles/v1?limit=250" -Headers $Headers
    foreach ($p in $Profiles) {
        try {
            $states = Invoke-RestMethod -Method Get -Uri "$BaseUrl/identity-profiles/v1/$($p.id)/lifecycle-states" -Headers $Headers
            foreach ($s in $states) {
                $isMatched = $false
                if ($TargetLcsIdList.Count -gt 0) {
                    if ($TargetLcsIdList -contains $s.id -or $TargetLcsIdList -contains $s.technicalName -or $TargetLcsIdList -contains $s.name) {
                        $isMatched = $true
                    }
                }

                if ($isMatched) {
                    $techName = if ($s.technicalName) { $s.technicalName } else { $s.name }
                    $dispName = if ($s.name) { $s.name } else { $s.technicalName }

                    if (-not $ResolvedLcsTechnicalNames.Contains($techName)) {
                        $ResolvedLcsTechnicalNames.Add($techName)
                    }
                    if (-not $ResolvedLcsDisplayNames.Contains($dispName)) {
                        $ResolvedLcsDisplayNames.Add($dispName)
                    }
                    $ResolvedLcsMetadata.Add([PSCustomObject]@{
                        Id            = $s.id
                        Name          = $dispName
                        TechnicalName = $techName
                        ProfileName   = $p.name
                    })
                }
            }
        } catch {}
    }
} catch {}

# Fallback to 'terminated' if no LCS ID passed or matched
if ($ResolvedLcsTechnicalNames.Count -eq 0) {
    $ResolvedLcsTechnicalNames.Add("terminated")
    $ResolvedLcsDisplayNames.Add("Terminated")
}

$LcsDisplayLabel = ($ResolvedLcsDisplayNames -join ", ")
Log-Host "Resolved LCS: $LcsDisplayLabel (Technical: $($ResolvedLcsTechnicalNames -join ', '))" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# 3. Helper Functions
# ------------------------------------------------------------------------------
function Get-ManagerDisplayName {
    param (
        $MgrRef,
        [string]$MgrFullNameAttr
    )

    if ($MgrRef) {
        if ($MgrRef.displayName) { return $MgrRef.displayName }
        if ($MgrRef.name) { return $MgrRef.name }
    }
    if ($MgrFullNameAttr -and $MgrFullNameAttr -ne "NULL") {
        return $MgrFullNameAttr
    }
    return ""
}

function Build-FormTableHtml {
    param (
        [string]$TargetAppName,
        [int]$TotalUsers,
        [int]$TotalEntitlements,
        [int]$EnabledAccountsCount,
        [int]$DisabledAccountsCount,
        [System.Collections.Generic.List[PSCustomObject]]$AccountSummaries,
        [string]$DisplayActionMode = "Preview Only Mode",
        [string]$NormalizedMode = "PreviewOnly",
        [string]$LcsLabel = "Terminated"
    )

    $Html = [System.Text.StringBuilder]::new()
    $isSourceClean = ($AccountSummaries.Count -eq 0)
    $isClipped = ($AccountSummaries.Count -gt 100)
    $displayedSummaries = if ($isClipped) { @($AccountSummaries | Select-Object -First 100) } else { $AccountSummaries }

    # Header Bar Badge based on Clean Status & Mode
    $HeaderBadgeHtml = if ($isSourceClean) {
        "<span style='display: inline-block; background: #059669; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;'>Compliant</span>"
    } else {
        switch ($NormalizedMode) {
            "PreviewOnly" {
                "<span style='display: inline-block; background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;'>Preview Only Mode</span>"
            }
            "RemoveBoth" {
                "<span style='display: inline-block; background: #b91c1c; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;'>Action Required</span>"
            }
            "RemoveEntitlementsOnly" {
                "<span style='display: inline-block; background: #d97706; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;'>Remove Entitlements</span>"
            }
            "DisableAccountsOnly" {
                "<span style='display: inline-block; background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;'>Disable Accounts</span>"
            }
        }
    }

    # Notice Banner for Clipped Display (when users exceed 100)
    $ClippedNoticeBannerHtml = if ($isClipped) {
        @"
    <div style='background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; color: #92400e; line-height: 1.5;'>
      <strong style='color: #b45309; font-size: 13px;'>Display Limit Reached:</strong> Showing the first 100 users (out of <strong>$TotalUsers</strong> total). As we cannot display that many users in the form, please enable the <strong>Summary Email</strong> toggle to get the full user list before executing.
    </div>
"@
    } else {
        ""
    }

    # Notice Banner based on Clean Status & Mode
    $NoticeBannerHtml = if ($isSourceClean) {
        @"
    <div style='background: #ecfdf5; border: 1px solid #a7f3d0; border-left: 4px solid #059669; border-radius: 6px; padding: 14px 18px; margin-bottom: 18px; font-size: 13px; color: #065f46; line-height: 1.5;'>
      <strong style='font-size: 14px; display: block; margin-bottom: 4px; color: #047857;'>Source Is Clean &bull; No Action Required</strong>
      No accounts or access require remediation for users in <strong>$LcsLabel</strong> state on <strong>$TargetAppName</strong> for the selected mode (<strong>$DisplayActionMode</strong>). All evaluated accounts are already compliant.
    </div>
"@
    } else {
        switch ($NormalizedMode) {
            "PreviewOnly" {
                @"
    <div style='background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #0284c7; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; color: #1e40af; line-height: 1.5;'>
      <strong>Preview Only Mode:</strong> You are currently in <strong>Preview Mode</strong>. No access changes (no accounts will be disabled and no entitlements will be removed) will occur for users in <strong>$LcsLabel</strong> state on <strong>$TargetAppName</strong>. This summary is for audit and review purposes only.
    </div>
"@
            }
            "RemoveBoth" {
                @"
    <div style='background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; color: #1e40af; line-height: 1.5;'>
      <strong>Notice:</strong> If you confirm this selection, all access (accounts disabled and entitlements removed) will occur for users in <strong>$LcsLabel</strong> state on <strong>$TargetAppName</strong>.
    </div>
"@
            }
            "RemoveEntitlementsOnly" {
                @"
    <div style='background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; color: #92400e; line-height: 1.5;'>
      <strong>Notice:</strong> Entitlement removals only. All entitlements matching <strong>$TargetAppName</strong> will be removed. Accounts will <strong>remain active</strong>.
    </div>
"@
            }
            "DisableAccountsOnly" {
                @"
    <div style='background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; color: #991b1b; line-height: 1.5;'>
      <strong>Notice:</strong> Account disablements only. Accounts will be disabled, and existing entitlements will <strong>remain assigned</strong>.
    </div>
"@
            }
        }
    }

    $entitlementsCardLabel = switch ($NormalizedMode) {
        "PreviewOnly"         { "Entitlements Evaluated" }
        "DisableAccountsOnly" { "Entitlements (Retained)" }
        default               { "Entitlements to Revoke" }
    }

    $activeAccountsCardLabel = switch ($NormalizedMode) {
        "PreviewOnly"            { "Active Accounts (Evaluated)" }
        "RemoveEntitlementsOnly" { "Active Accounts (Retained)" }
        default                  { "Active Accounts (Needs Disable)" }
    }

    $entitlementsTableColHeader = switch ($NormalizedMode) {
        "PreviewOnly"         { "Entitlements (Preview)" }
        "DisableAccountsOnly" { "Entitlements (Retained)" }
        default               { "Entitlements to Revoke" }
    }

    # Metric Cards HTML
    $MetricCardsHtml = if ($isSourceClean) {
        @"
    <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='width: 100%; border-collapse: separate; margin-bottom: 18px; table-layout: fixed;'>
      <tr>
        <td width='25%' valign='top' style='width: 25%; padding: 0 6px 0 0;'>
          <div style='background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px;'>Affected Identities</div>
            <div style='font-size: 20px; font-weight: 700; color: #64748b; margin-top: 4px;'>0</div>
          </div>
        </td>
        <td width='25%' valign='top' style='width: 25%; padding: 0 6px;'>
          <div style='background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px;'>$entitlementsCardLabel</div>
            <div style='font-size: 20px; font-weight: 700; color: #64748b; margin-top: 4px;'>0</div>
          </div>
        </td>
        <td width='25%' valign='top' style='width: 25%; padding: 0 6px;'>
          <div style='background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px;'>$activeAccountsCardLabel</div>
            <div style='font-size: 20px; font-weight: 700; color: #64748b; margin-top: 4px;'>0</div>
          </div>
        </td>
        <td width='25%' valign='top' style='width: 25%; padding: 0 0 0 6px;'>
          <div style='background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.3px;'>Compliance Status</div>
            <div style='font-size: 20px; font-weight: 700; color: #059669; margin-top: 4px;'>100% Clean</div>
          </div>
        </td>
      </tr>
    </table>
"@
    } else {
        @"
    <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='width: 100%; border-collapse: separate; margin-bottom: 18px; table-layout: fixed;'>
      <tr>
        <td width='25%' valign='top' style='width: 25%; padding: 0 6px 0 0;'>
          <div style='background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px;'>Affected Identities</div>
            <div style='font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px;'>$TotalUsers</div>
          </div>
        </td>
        <td width='25%' valign='top' style='width: 25%; padding: 0 6px;'>
          <div style='background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px;'>$entitlementsCardLabel</div>
            <div style='font-size: 20px; font-weight: 700; color: $(if ($NormalizedMode -eq "DisableAccountsOnly") { '#64748b' } else { '#0369a1' }); margin-top: 4px;'>$TotalEntitlements</div>
          </div>
        </td>
        <td width='25%' valign='top' style='width: 25%; padding: 0 6px;'>
          <div style='background: $(if ($EnabledAccountsCount -gt 0 -and $NormalizedMode -ne "RemoveEntitlementsOnly") { '#fef2f2' } else { '#f8fafc' }); border: 1px solid $(if ($EnabledAccountsCount -gt 0 -and $NormalizedMode -ne "RemoveEntitlementsOnly") { '#fecaca' } else { '#e2e8f0' }); padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: $(if ($EnabledAccountsCount -gt 0 -and $NormalizedMode -ne "RemoveEntitlementsOnly") { '#991b1b' } else { '#64748b' }); text-transform: uppercase; letter-spacing: 0.3px;'>$activeAccountsCardLabel</div>
            <div style='font-size: 20px; font-weight: 700; color: $(if ($EnabledAccountsCount -gt 0 -and $NormalizedMode -ne "RemoveEntitlementsOnly") { '#b91c1c' } else { '#0f172a' }); margin-top: 4px;'>$EnabledAccountsCount</div>
          </div>
        </td>
        <td width='25%' valign='top' style='width: 25%; padding: 0 0 0 6px;'>
          <div style='background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; border-radius: 6px; text-align: center;'>
            <div style='font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px;'>Already Disabled</div>
            <div style='font-size: 20px; font-weight: 700; color: #475569; margin-top: 4px;'>$DisabledAccountsCount</div>
          </div>
        </td>
      </tr>
    </table>
"@
    }

    # Container Card
    [void]$Html.Append(@"
<div style='background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); width: 100%; max-width: 100%; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow: hidden; margin: 10px 0;'>
  <!-- Header Bar -->
  <div style='background: #0f172a; color: #ffffff; padding: 14px 18px;'>
    <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='width: 100%; border-collapse: collapse;'>
      <tr>
        <td align='left' valign='middle' style='vertical-align: middle; padding-right: 14px;'>
          <div style='font-size: 15px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #ffffff; margin-bottom: 3px;'>User Access Remediation</div>
          <div style='font-size: 12px; color: #94a3b8; line-height: 1.4;'>Application: <strong>$TargetAppName</strong> &bull; State: <strong>$LcsLabel</strong> &bull; Mode: <strong>$DisplayActionMode</strong></div>
        </td>
        <td align='right' valign='middle' style='vertical-align: middle; text-align: right; white-space: nowrap; width: 1%;'>
          $HeaderBadgeHtml
        </td>
      </tr>
    </table>
  </div>

  <div style='padding: 18px;'>
    $ClippedNoticeBannerHtml
    $NoticeBannerHtml
    $MetricCardsHtml
"@)

    if ($isSourceClean) {
        [void]$Html.Append(@"
  </div>
</div>
"@)
    } else {
        [void]$Html.Append(@"
    <!-- Data Table with Responsive Horizontal Scroll -->
    <div style='overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 6px;'>
      <table style='width: 100%; min-width: 660px; border-collapse: collapse; font-size: 12px;'>
        <thead>
          <tr style='background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;'>
            <th style='padding: 8px 10px; font-weight: 700; color: #334155; white-space: nowrap;'>Identity (Username)</th>
            <th style='padding: 8px 10px; font-weight: 700; color: #334155; white-space: nowrap;'>Account Name</th>
            <th style='padding: 8px 10px; font-weight: 700; color: #334155; text-align: center; white-space: nowrap;'>Account State</th>
            <th style='padding: 8px 10px; font-weight: 700; color: #334155; min-width: 180px;'>$entitlementsTableColHeader</th>
            <th style='padding: 8px 10px; font-weight: 700; color: #334155; white-space: nowrap;'>Manager</th>
          </tr>
        </thead>
        <tbody>
"@)

        $rowIndex = 0
        foreach ($acc in $displayedSummaries) {
            $rowBg = if ($rowIndex % 2 -eq 0) { "#ffffff" } else { "#f8fafc" }
            $idDisplay = "$($acc.DisplayName) ($($acc.Username))"

            $accountStateBadge = if ($NormalizedMode -eq "RemoveEntitlementsOnly") {
                if ($acc.IsDisabled) {
                    "<span style='display: inline-block; white-space: nowrap; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;'>Disabled (No Change)</span>"
                } else {
                    "<span style='display: inline-block; white-space: nowrap; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;'>Active (Retained)</span>"
                }
            } elseif ($NormalizedMode -eq "PreviewOnly") {
                if ($acc.IsDisabled) {
                    "<span style='display: inline-block; white-space: nowrap; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;'>Disabled</span>"
                } else {
                    "<span style='display: inline-block; white-space: nowrap; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;'>Active (Needs Disable)</span>"
                }
            } else {
                if ($acc.IsDisabled) {
                    "<span style='display: inline-block; white-space: nowrap; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;'>Already Disabled</span>"
                } else {
                    "<span style='display: inline-block; white-space: nowrap; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;'>Active (Needs Disable)</span>"
                }
            }

            $entHtml = ""
            if ($NormalizedMode -eq "DisableAccountsOnly") {
                $entHtml = "<span style='color: #64748b; font-style: italic; font-size: 11px;'>Retained (Accounts Only mode)</span>"
            } elseif ($null -eq $acc.EntitlementNames -or $acc.EntitlementNames.Count -eq 0) {
                $entHtml = "<span style='color: #94a3b8; font-style: italic; font-size: 11px;'>No entitlements</span>"
            } else {
                foreach ($entName in $acc.EntitlementNames) {
                    $entHtml += "<div style='margin: 3px 0;'><span style='display: inline-block; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: monospace; white-space: nowrap;'>$entName</span></div>"
                }
            }

            $mgrDisplay = if ($acc.ManagerName) { $acc.ManagerName } else { "<span style='color: #94a3b8; font-style: italic;'>Unassigned</span>" }

            [void]$Html.Append(@"
          <tr style='background: $rowBg; border-bottom: 1px solid #e2e8f0;'>
            <td style='padding: 8px 10px; font-weight: 600; color: #0f172a; white-space: nowrap; vertical-align: top;'>$idDisplay</td>
            <td style='padding: 8px 10px; font-family: monospace; font-size: 11px; color: #334155; word-break: break-word; vertical-align: top;'>$($acc.AccountName)</td>
            <td style='padding: 8px 10px; text-align: center; white-space: nowrap; vertical-align: top;'>$accountStateBadge</td>
            <td style='padding: 8px 10px; vertical-align: top;'>$entHtml</td>
            <td style='padding: 8px 10px; color: #475569; white-space: nowrap; vertical-align: top;'>$mgrDisplay</td>
          </tr>
"@)
            $rowIndex++
        }

        if ($isClipped) {
            $remainingUsers = $AccountSummaries.Count - 100
            [void]$Html.Append(@"
          <tr style='background: #f1f5f9; border-top: 2px solid #cbd5e1;'>
            <td colspan='5' style='padding: 12px 16px; text-align: center; color: #64748b; font-size: 12px; font-weight: 600;'>
              Showing first 100 users only ($remainingUsers additional users omitted from form display &bull; Enable the Summary Email toggle to receive the full list)
            </td>
          </tr>
"@)
        }

        [void]$Html.Append(@"
        </tbody>
      </table>
    </div>
  </div>
</div>
"@)
    }

    return $Html.ToString()
}

# ------------------------------------------------------------------------------
# 4. Resolve Target Source in ISC (Supports Name or ID)
# ------------------------------------------------------------------------------
Log-Host "Resolving target source '$SourceName'..." -ForegroundColor Cyan

$ResolvedSourceId   = $null
$ResolvedSourceName = $null

try {
    $DirectSource = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1/$SourceName" -Headers $Headers
    if ($DirectSource -and $DirectSource.id) {
        $ResolvedSourceId   = $DirectSource.id
        $ResolvedSourceName = $DirectSource.name
    }
}
catch {}

if (-not $ResolvedSourceId) {
    try {
        $AllSources = Invoke-RestMethod -Method Get -Uri "$BaseUrl/sources/v1?limit=250" -Headers $Headers
        $MatchedSource = $AllSources | Where-Object { $_.name -eq $SourceName -or $_.id -eq $SourceName } | Select-Object -First 1
        if ($MatchedSource) {
            $ResolvedSourceId   = $MatchedSource.id
            $ResolvedSourceName = $MatchedSource.name
        }
    }
    catch {
        $errMsg = "Failed to query sources: $($_.Exception.Message)"
        Write-Log -Message $errMsg -Level "ERROR"
        $ErrJson = @{ error = $errMsg } | ConvertTo-Json
        Write-Output $ErrJson
        exit 1
    }
}

if (-not $ResolvedSourceId) {
    $errMsg = "Source '$SourceName' could not be found in SailPoint ISC."
    Write-Log -Message $errMsg -Level "ERROR"
    $ErrJson = @{ error = $errMsg } | ConvertTo-Json
    Write-Output $ErrJson
    exit 1
}

$SourceName = $ResolvedSourceName
Log-Host " Target Source resolved: '$SourceName' (ID: $ResolvedSourceId)" -ForegroundColor Green

# Output Structure
$OverallResponse = [ordered]@{
    appName               = $SourceName
    sourceId              = $ResolvedSourceId
    actionMode            = $DisplayActionMode
    normalizedMode        = $NormalizedMode
    lifecycleStates       = $LcsDisplayLabel
    lifecycleStateIds     = $TargetLcsIdList.ToArray()
    generatedAt           = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    metrics               = @{}
    formTableHtml         = ""
    remediationMap        = @()
    reportRows            = @()
    emailStatus           = "NotRequested"
}

# ------------------------------------------------------------------------------
# 5. Extract Identities & Entitlements via Search API
# ------------------------------------------------------------------------------
Log-Host "Querying identities in LCS [$LcsDisplayLabel] with access to '$SourceName'..." -ForegroundColor Cyan

$IdentityCount   = 0
$AccessRowCount  = 0
$SearchAfterId   = $null

$FlatReportRows   = [System.Collections.Generic.List[PSCustomObject]]::new()
$RemediationDict  = [ordered]@{}
$AccountSummaries = [System.Collections.Generic.List[PSCustomObject]]::new()

# Construct LCS search filter
$lcsSearchPart = if ($ResolvedLcsTechnicalNames.Count -eq 1) {
    "attributes.cloudLifecycleState:`"$($ResolvedLcsTechnicalNames[0])`""
} else {
    $orParts = $ResolvedLcsTechnicalNames | ForEach-Object { "attributes.cloudLifecycleState:`"$_`"" }
    "($($orParts -join ' OR '))"
}

$FinalSearchQuery = "(@accounts(source.id:`"$ResolvedSourceId`") OR access.source.id:`"$ResolvedSourceId`") AND $lcsSearchPart"

while ($true) {
    $SearchPayload = [ordered]@{
        indices       = @("identities")
        query         = @{
            query = $FinalSearchQuery
        }
        includeNested = $true
        sort          = @("id")
    }

    if ($null -ne $SearchAfterId) {
        $SearchPayload["searchAfter"] = @($SearchAfterId)
    }

    $JsonPayload = $SearchPayload | ConvertTo-Json -Depth 10

    try {
        $SearchUri = "$BaseUrl/search/v1?limit=$SearchPageLimit"
        $Members = Invoke-RestMethod -Method Post -Uri $SearchUri -Headers $Headers -Body $JsonPayload
    }
    catch {
        Log-Host "Search query failed for $($SourceName): $($_.Exception.Message)" -ForegroundColor Red
        break
    }

    if ($null -eq $Members -or $Members.Count -eq 0) {
        break
    }

    # Batch-verify live account disabled status from /accounts/v1 to avoid Search index delay
    $pageAccountIds = [System.Collections.Generic.List[string]]::new()
    foreach ($u in $Members) {
        $mAccs = @($u.accounts | Where-Object { $_.source.id -eq $ResolvedSourceId -or $_.source.name -eq $SourceName })
        if ($mAccs.Count -gt 0 -and $mAccs[0].id) {
            $pageAccountIds.Add($mAccs[0].id)
        }
    }

    $LiveAccountMap = @{}
    if ($pageAccountIds.Count -gt 0) {
        for ($chunkIdx = 0; $chunkIdx -lt $pageAccountIds.Count; $chunkIdx += 50) {
            $chunk = $pageAccountIds.GetRange($chunkIdx, [Math]::Min(50, $pageAccountIds.Count - $chunkIdx))
            $filterStr = 'id in ("' + ($chunk -join '","') + '")'
            $accQueryUri = "$BaseUrl/accounts/v1?filters=" + [System.Uri]::EscapeDataString($filterStr) + "&limit=50"
            try {
                $liveAccounts = Invoke-RestMethod -Method Get -Uri $accQueryUri -Headers $Headers
                foreach ($la in $liveAccounts) {
                    $LiveAccountMap[$la.id] = [PSCustomObject]@{
                        disabled        = [bool]$la.disabled
                        hasEntitlements = if ($null -ne $la.hasEntitlements) { [bool]$la.hasEntitlements } else { $true }
                    }
                }
            } catch {
                Log-Host "Warning: Live account status verification failed ($($_.Exception.Message)). Falling back to Search index." -ForegroundColor Yellow
            }
        }
    }

    foreach ($User in $Members) {
        if (-not ($ResolvedLcsTechnicalNames -contains $User.attributes.cloudLifecycleState)) {
            continue
        }

        # Resolve Manager Display Name
        $mgrFullNameAttr = if ($User.attributes.managerFullName) { $User.attributes.managerFullName } else { "" }
        $mgrDisplayName  = Get-ManagerDisplayName -MgrRef $User.manager -MgrFullNameAttr $mgrFullNameAttr

        # Resolve Correlated Account on target source
        $matchedAccounts = @($User.accounts | Where-Object { $_.source.id -eq $ResolvedSourceId -or $_.source.name -eq $SourceName })
        $targetAccount = if ($matchedAccounts.Count -gt 0) { $matchedAccounts[0] } else { $null }

        $accountId        = if ($targetAccount -and $targetAccount.id) { $targetAccount.id } else { "" }
        $accountName      = if ($targetAccount -and $targetAccount.name) { $targetAccount.name } else { $User.name }
        $isAccountDisabled = if ($accountId -and $LiveAccountMap.ContainsKey($accountId)) {
            $LiveAccountMap[$accountId].disabled
        } elseif ($targetAccount -and $null -ne $targetAccount.disabled) {
            [bool]$targetAccount.disabled
        } else {
            $false
        }

        # Resolve Standard Identity Attributes
        $idDisplayName = if ($User.displayName) { $User.displayName } elseif ($User.attributes.displayName) { $User.attributes.displayName } else { $User.name }
        $idUsername    = if ($User.attributes.uid -and $User.attributes.uid -ne "NULL") { $User.attributes.uid } elseif ($User.name) { $User.name } else { "" }
        $idEmail       = if ($User.email) { $User.email } elseif ($User.attributes.email -and $User.attributes.email -ne "NULL") { $User.attributes.email } else { "" }

        # Filter Entitlements strictly belonging to this target source
        $TargetAccess = @($User.access | Where-Object {
            ($_.source.id -eq $ResolvedSourceId -or $_.source.name -eq $SourceName) -and
            $_.type -eq "ENTITLEMENT"
        })

        $userEntNames   = [System.Collections.Generic.List[string]]::new()
        $userEntObjects = [System.Collections.Generic.List[PSCustomObject]]::new()

        foreach ($accItem in $TargetAccess) {
            $entObj = [PSCustomObject]@{
                id        = $accItem.id
                name      = $accItem.name
                value     = $accItem.value
                attribute = $accItem.attribute
            }
            $userEntObjects.Add($entObj)
            $userEntNames.Add($accItem.name)
        }

        # Level 1 Entitlement Verification: If live account authoritatively has no entitlements in ISC, override Search lag
        if ($accountId -and $LiveAccountMap.ContainsKey($accountId) -and -not $LiveAccountMap[$accountId].hasEntitlements) {
            $userEntObjects.Clear()
            $userEntNames.Clear()
        }

        # Exclude accounts that require no remediation under the selected action mode
        # 1. In RemoveEntitlementsOnly mode, skip if no entitlements exist to revoke
        if ($NormalizedMode -eq "RemoveEntitlementsOnly" -and $userEntObjects.Count -eq 0) {
            continue
        }

        # 2. In DisableAccountsOnly mode, skip if account is already disabled
        if ($NormalizedMode -eq "DisableAccountsOnly" -and $isAccountDisabled) {
            continue
        }

        # 3. In RemoveBoth or PreviewOnly mode, skip accounts that are ALREADY disabled AND have NO entitlements to revoke
        if (($NormalizedMode -eq "RemoveBoth" -or $NormalizedMode -eq "PreviewOnly") -and $isAccountDisabled -and $userEntObjects.Count -eq 0) {
            continue
        }

        # 4. Safeguard: If target account was not found and no entitlements exist, skip
        if (-not $targetAccount -and $userEntObjects.Count -eq 0) {
            continue
        }

        $IdentityCount++

        # Configure action-specific properties for Remediation Map
        $needsDisabling = switch ($NormalizedMode) {
            "RemoveBoth"             { (-not $isAccountDisabled) }
            "RemoveEntitlementsOnly" { $false }
            "DisableAccountsOnly"    { $true }
            "PreviewOnly"            { $false }
        }

        $entitlementsForRemediation = switch ($NormalizedMode) {
            "DisableAccountsOnly"    { @() }
            "PreviewOnly"            { @() }
            default                  { $userEntObjects.ToArray() }
        }

        $entitlementCountForRemediation = switch ($NormalizedMode) {
            "DisableAccountsOnly"    { 0 }
            "PreviewOnly"            { 0 }
            default                  { $userEntObjects.Count }
        }

        # Build Remediation Map Entry (Grouped by accountId)
        $mapLookupKey = if ($accountId) { $accountId } else { $accountName }
        $RemediationDict[$mapLookupKey] = [PSCustomObject]@{
            accountId           = $accountId
            accountName         = $accountName
            identityId          = $User.id
            identityUsername    = $idUsername
            identityDisplayName = $idDisplayName
            identityEmail       = $idEmail
            lifecycleState      = $User.attributes.cloudLifecycleState
            isAccountDisabled   = $isAccountDisabled
            needsDisabling      = $needsDisabling
            entitlementCount    = $entitlementCountForRemediation
            entitlements        = $entitlementsForRemediation
            actionMode          = $DisplayActionMode
            previewNeedsDisabling = (-not $isAccountDisabled)
            previewEntitlements   = $userEntObjects.ToArray()
        }

        # Summary for HTML table & Email CSV rendering
        $AccountSummaries.Add([PSCustomObject]@{
            Username         = $idUsername
            DisplayName      = $idDisplayName
            Email            = $idEmail
            AccountName      = $accountName
            IsDisabled       = $isAccountDisabled
            EntitlementNames = $userEntNames.ToArray()
            ManagerName      = $mgrDisplayName
        })

        # Flat rows for audit reporting
        if ($NormalizedMode -eq "DisableAccountsOnly") {
            $FlatReportRows.Add([PSCustomObject]@{
                "App Name"              = $SourceName
                "Identity Display Name" = $idDisplayName
                "Identity Username"     = $idUsername
                "Identity Email"        = $idEmail
                "Account Name"          = $accountName
                "Account Disabled"      = $isAccountDisabled.ToString()
                "Lifecycle State"       = $User.attributes.cloudLifecycleState
                "Entitlements"          = "N/A (Disable Accounts Only Mode)"
                "Manager Name"          = $mgrDisplayName
                "Action Mode"           = $DisplayActionMode
            })
            $AccessRowCount++
        } else {
            if ($userEntObjects.Count -eq 0 -and ($NormalizedMode -eq "RemoveBoth" -or $NormalizedMode -eq "PreviewOnly")) {
                $FlatReportRows.Add([PSCustomObject]@{
                    "App Name"              = $SourceName
                    "Identity Display Name" = $idDisplayName
                    "Identity Username"     = $idUsername
                    "Identity Email"        = $idEmail
                    "Account Name"          = $accountName
                    "Account Disabled"      = $isAccountDisabled.ToString()
                    "Lifecycle State"       = $User.attributes.cloudLifecycleState
                    "Entitlements"          = if ($NormalizedMode -eq "PreviewOnly") { "None (Account Disablement Preview)" } else { "None (Account Disablement Only)" }
                    "Manager Name"          = $mgrDisplayName
                    "Action Mode"           = $DisplayActionMode
                })
                $AccessRowCount++
            } else {
                foreach ($ent in $userEntObjects) {
                    $FlatReportRows.Add([PSCustomObject]@{
                        "App Name"              = $SourceName
                        "Identity Display Name" = $idDisplayName
                        "Identity Username"     = $idUsername
                        "Identity Email"        = $idEmail
                        "Account Name"          = $accountName
                        "Account Disabled"      = $isAccountDisabled.ToString()
                        "Lifecycle State"       = $User.attributes.cloudLifecycleState
                        "Entitlements"          = $ent.name
                        "Manager Name"          = $mgrDisplayName
                        "Action Mode"           = $DisplayActionMode
                    })
                    $AccessRowCount++
                }
            }
        }
    }

    $SearchAfterId = $Members[-1].id

    Log-Host "  -> Processed $IdentityCount identities ($AccessRowCount entitlement/account rows so far)..." -ForegroundColor Gray

    if ($Members.Count -lt $SearchPageLimit) {
        break
    }
}

Log-Host " Completed extraction: $IdentityCount identities, $($AccountSummaries.Count) accounts, $AccessRowCount access rows." -ForegroundColor Green

# Calculate Totals & Summary Metrics
$totalEntitlementsCount = ($AccountSummaries | ForEach-Object { $_.EntitlementNames.Count } | Measure-Object -Sum).Sum
if ($null -eq $totalEntitlementsCount) { $totalEntitlementsCount = 0 }

$enabledAccounts = @($AccountSummaries | Where-Object { -not $_.IsDisabled }).Count
$disabledAccounts = @($AccountSummaries | Where-Object { $_.IsDisabled }).Count

$effectiveEntitlementsToRevoke = switch ($NormalizedMode) {
    "PreviewOnly"            { 0 }
    "DisableAccountsOnly"    { 0 }
    default                  { [int]$totalEntitlementsCount }
}

$effectiveAccountsToDisable = switch ($NormalizedMode) {
    "PreviewOnly"            { 0 }
    "RemoveEntitlementsOnly" { 0 }
    default                  { [int]$enabledAccounts }
}

# Calculate Clean Status & Clipping Flags
$isClean       = ($effectiveEntitlementsToRevoke -eq 0 -and $effectiveAccountsToDisable -eq 0)
$isSourceClean = ($AccountSummaries.Count -eq 0)
$isClipped     = ($AccountSummaries.Count -gt 100)

$OverallResponse.metrics = [ordered]@{
    actionMode                      = $DisplayActionMode
    normalizedMode                  = $NormalizedMode
    lifecycleStates                 = $LcsDisplayLabel
    isClean                         = $isSourceClean
    status                          = if ($isSourceClean) { "Clean" } else { "RemediationRequired" }
    totalIdentities                 = $IdentityCount
    totalAccounts                   = $AccountSummaries.Count
    totalEntitlementsEvaluated      = [int]$totalEntitlementsCount
    totalEntitlementsToRevoke       = [int]$effectiveEntitlementsToRevoke
    enabledAccountsEvaluated        = [int]$enabledAccounts
    enabledAccountsNeedingDisabling = [int]$effectiveAccountsToDisable
    alreadyDisabledAccounts         = [int]$disabledAccounts
    isClipped                       = $isClipped
    displayedUsers                  = if ($isClipped) { 100 } else { $AccountSummaries.Count }
}

# Always output all evaluated records to remediationMap and reportRows
$OverallResponse.reportRows     = $FlatReportRows.ToArray()
$OverallResponse.remediationMap = @($RemediationDict.Values)

# In Preview Only mode, display the evaluated counts on the UI cards
$cardEntitlements = if ($NormalizedMode -eq "PreviewOnly") { [int]$totalEntitlementsCount } else { [int]$effectiveEntitlementsToRevoke }
$cardEnabledAccs  = if ($NormalizedMode -eq "PreviewOnly") { [int]$enabledAccounts } else { [int]$effectiveAccountsToDisable }

# Build HTML Form Widget
$OverallResponse.formTableHtml = Build-FormTableHtml `
    -TargetAppName $SourceName `
    -TotalUsers $IdentityCount `
    -TotalEntitlements $cardEntitlements `
    -EnabledAccountsCount $cardEnabledAccs `
    -DisabledAccountsCount $disabledAccounts `
    -AccountSummaries $AccountSummaries `
    -DisplayActionMode $DisplayActionMode `
    -NormalizedMode $NormalizedMode `
    -LcsLabel $LcsDisplayLabel

# ------------------------------------------------------------------------------
# 6. Send Summary Email with CSV Report (If Requested)
# ------------------------------------------------------------------------------
$OverallResponse.emailStatus = "NotRequested"

$SendSummaryEmail = $false
if ($null -ne $SummaryEmail) {
    if ($SummaryEmail -is [bool]) {
        $SendSummaryEmail = $SummaryEmail
    } else {
        $SummaryEmailStr = $SummaryEmail.ToString().Trim().ToLowerInvariant()
        if ($SummaryEmailStr -in @("true", "1", "yes")) {
            $SendSummaryEmail = $true
        }
    }
}

if ($SendSummaryEmail) {
    Log-Host "=== Summary Email Generation Requested ===" -ForegroundColor Cyan
    if ([string]::IsNullOrWhiteSpace($EmailToSendTo)) {
        $msg = "SummaryEmail parameter was set to true, but EmailToSendTo was empty or not specified."
        Log-Host " [WARN] $msg" -ForegroundColor Yellow
        $OverallResponse.emailStatus = "Skipped: Missing EmailToSendTo"
    } else {
        try {
            $RecipientList = @(($EmailToSendTo -split '[,;]') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })
            if ($RecipientList.Count -eq 0) {
                throw "No valid recipient email address found in '$EmailToSendTo'."
            }

            Log-Host " Recipient(s): $($RecipientList -join ', ')" -ForegroundColor Gray

            # Prepare CSV Summary rows matching the HTML table
            $SummaryRows = [System.Collections.Generic.List[PSCustomObject]]::new()
            if ($AccountSummaries.Count -gt 0) {
                foreach ($acc in $AccountSummaries) {
                    $stateText = if ($NormalizedMode -eq "RemoveEntitlementsOnly") {
                        if ($acc.IsDisabled) { "Disabled (No Change)" } else { "Active (Retained)" }
                    } elseif ($NormalizedMode -eq "PreviewOnly") {
                        if ($acc.IsDisabled) { "Disabled" } else { "Active (Preview)" }
                    } else {
                        if ($acc.IsDisabled) { "Already Disabled" } else { "Active (Needs Disable)" }
                    }

                    $entList = if ($NormalizedMode -eq "DisableAccountsOnly") {
                        "Retained (No Entitlements Removed)"
                    } elseif (-not $acc.EntitlementNames -or $acc.EntitlementNames.Count -eq 0) {
                        "None"
                    } else {
                        $acc.EntitlementNames -join "; "
                    }

                    $mgrText = if ($acc.ManagerName) { $acc.ManagerName } else { "Unassigned" }

                    $SummaryRows.Add([PSCustomObject]@{
                        "Target Application"    = $SourceName
                        "Identity"              = "$($acc.DisplayName) ($($acc.Username))"
                        "Identity Username"     = $acc.Username
                        "Identity Display Name" = $acc.DisplayName
                        "Identity Email"        = $acc.Email
                        "Account Name"          = $acc.AccountName
                        "Account State"         = $stateText
                        "Entitlements"          = $entList
                        "Entitlement Count"     = if ($acc.EntitlementNames) { $acc.EntitlementNames.Count } else { 0 }
                        "Manager"               = $mgrText
                        "Action Mode"           = $DisplayActionMode
                        "Lifecycle State(s)"    = $LcsDisplayLabel
                        "Generated At"          = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                    })
                }
            } else {
                $SummaryRows.Add([PSCustomObject]@{
                    "Target Application"    = $SourceName
                    "Identity"              = "N/A"
                    "Identity Username"     = "N/A"
                    "Identity Display Name" = "N/A"
                    "Identity Email"        = "N/A"
                    "Account Name"          = "N/A"
                    "Account State"         = "Clean (No Accounts or Entitlements to Remediate)"
                    "Entitlements"          = "None"
                    "Entitlement Count"     = 0
                    "Manager"               = "N/A"
                    "Action Mode"           = $DisplayActionMode
                    "Lifecycle State(s)"    = $LcsDisplayLabel
                    "Generated At"          = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                })
            }

            # Export CSV report to temp-reports directory
            $TempExportDir = $ExportDirectory
            if (-not (Test-Path $TempExportDir)) {
                try {
                    New-Item -ItemType Directory -Path $TempExportDir -Force | Out-Null
                } catch {
                    $TempExportDir = [System.IO.Path]::GetTempPath()
                }
            }

            $SafeSourceName = ($SourceName -replace '[\\/:*?"<>|]', '_').Trim()
            $TimestampStr   = Get-Date -Format 'yyyyMMdd_HHmmss'
            $EmailCsvPath   = Join-Path $TempExportDir "${SafeSourceName}_Remediation_Summary_${TimestampStr}.csv"

            $SummaryRows | Export-Csv -Path $EmailCsvPath -NoTypeInformation -Encoding utf8
            Log-Host " CSV Summary Report generated: $EmailCsvPath" -ForegroundColor Gray

            # SMTP Relay Credentials (from top configuration)
            $SecPassword  = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
            $SmtpCreds    = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)

            # Email Subject
            $SubjectPrefix = if ($AccountSummaries.Count -eq 0) {
                "[Clean]"
            } elseif ($NormalizedMode -eq "PreviewOnly") {
                "[Preview]"
            } else {
                "[Remediation Summary]"
            }
            $Subject = "$SubjectPrefix User Access Summary - $SourceName ($LcsDisplayLabel)"

            # Email HTML Body wrapper
            $EmailHtmlBody = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 20px 24px; color: #ffffff;">
      <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #ffffff;">SailPoint ISC Access Remediation Summary</h2>
      <p style="margin: 0; font-size: 13px; color: #bfdbfe;">Summary report for application <strong>$([System.Web.HttpUtility]::HtmlEncode($SourceName))</strong> in lifecycle state(s) <strong>$([System.Web.HttpUtility]::HtmlEncode($LcsDisplayLabel))</strong>.</p>
    </div>
    <div style="padding: 24px;">
      $($OverallResponse.formTableHtml)
      <div style="margin-top: 20px; padding: 12px 16px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #64748b;">
        <strong>Report Information:</strong><br/>
        Application: $([System.Web.HttpUtility]::HtmlEncode($SourceName))<br/>
        Target Lifecycle State(s): $([System.Web.HttpUtility]::HtmlEncode($LcsDisplayLabel))<br/>
        Remediation Action: $([System.Web.HttpUtility]::HtmlEncode($DisplayActionMode))<br/>
        Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')<br/>
        <em>An Excel-compatible CSV report has been attached to this email.</em>
      </div>
    </div>
  </div>
</body>
</html>
"@

            $MailParams = @{
                To             = $RecipientList
                From           = $FromEmail
                Subject        = $Subject
                Body           = $EmailHtmlBody
                BodyAsHtml     = $true
                SmtpServer     = $SmtpServer
                Port           = $SmtpPort
                UseSsl         = $true
                Credential     = $SmtpCreds
                Attachments    = $EmailCsvPath
                WarningAction  = "SilentlyContinue"
            }

            Send-MailMessage @MailParams
            Log-Host " Summary email successfully sent to $($RecipientList -join ', ')!" -ForegroundColor Green
            $OverallResponse.emailStatus = "Sent to: $($RecipientList -join ', ')"
        }
        catch {
            $err = $_.Exception.Message
            Log-Host " [ERROR] Failed to send summary email: $err" -ForegroundColor Red
            $OverallResponse.emailStatus = "Error: $err"
        }
    }
}

# ------------------------------------------------------------------------------
# 7. Write Final Clean JSON to Output Stream for Windows Server node / Workflow
# ------------------------------------------------------------------------------
Write-Log "--- Get-RemovalSummary Script Execution Completed (Status: $($OverallResponse.metrics.status), Identities: $IdentityCount, Accounts: $($AccountSummaries.Count), AccessRows: $AccessRowCount) ---"
$FinalJson = $OverallResponse | ConvertTo-Json -Depth 10
Write-Output $FinalJson


