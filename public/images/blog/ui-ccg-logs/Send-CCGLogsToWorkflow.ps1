<#
.SYNOPSIS
Retrieves CCG logs from SailPoint Virtual Appliances via native SSH and pushes them to a SailPoint ISC Workflow External Trigger.

.DESCRIPTION
This script uses standard Windows ssh.exe to connect to one or more SailPoint Virtual Appliances. 
It searches the /home/sailpoint/log/ccg.log using grep filters fetched dynamically from the target SailPoint Workflow's "sp:define-variable" step.
It then formats the output into an easy-to-read array and posts it to the Identity Security Cloud Workflow for easy UI viewing in the Workflow Execution History.

Note: This script requires SSH Key-Based authentication to be configured from your executing machine to the VAs.
Use the included Setup-SshKey.ps1 helper script to configure this.

.EXAMPLE
.\Send-CCGLogsToWorkflow.ps1 -VaHosts "10.0.0.5", "10.0.0.6" -TenantUrl "https://tenant.api.identitynow.com" -WebhookUrl "https://tenant.api.identitynow.com/v2024/workflows/execute/external/1234-5678" -WorkflowId "abcd-1234"
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory=$true, HelpMessage="IP addresses or hostnames of the Virtual Appliances")]
    [string[]]$VaHosts,

    [Parameter(Mandatory=$false, HelpMessage="SSH Username for the VA")]
    [string]$SshUser = "sailpoint",

    [Parameter(Mandatory=$false, HelpMessage="Path to the encrypted credential XML file for SSH authentication")]
    [string]$CredentialPath = "",

    [Parameter(Mandatory=$false, HelpMessage="Number of lines to return from the end of the matching results")]
    [int]$TailLines = 500,

    [Parameter(Mandatory=$true, HelpMessage="SailPoint Tenant URL (e.g., https://tenant.api.identitynow.com)")]
    [string]$TenantUrl,

    [Parameter(Mandatory=$true, HelpMessage="Workflow External Trigger Webhook URL")]
    [string]$WebhookUrl,
    
    [Parameter(Mandatory=$false, HelpMessage="The true UUID of the target Workflow (required for fetching dynamic filters)")]
    [string]$WorkflowId,

    [Parameter(Mandatory=$false, HelpMessage="Path to the encrypted ISC API credentials XML file")]
    [string]$IscCredentialPath = ""
)

if ([string]::IsNullOrEmpty($CredentialPath)) { $CredentialPath = Join-Path $PSScriptRoot "Credentials\va_creds.xml" }
if ([string]::IsNullOrEmpty($IscCredentialPath)) { $IscCredentialPath = Join-Path $PSScriptRoot "Credentials\isc_creds.xml" }

# Enforce TLS 1.2 (Required for SailPoint APIs on fresh PowerShell processes)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Start logging so we can see what the Scheduled Task is doing
$TranscriptPath = Join-Path $PSScriptRoot "task_log.txt"
Start-Transcript -Path $TranscriptPath -Append -Force

$compiledLogs = @()
$IncludeFilters = @()
$ExcludeFilters = @()
$MessageOnly = $false

# Load ISC Credentials
if (-not (Test-Path $IscCredentialPath)) {
    Write-Error "ISC Credential file not found at $IscCredentialPath. Please run Save-IscCredentials.ps1 on this machine first!"
    return
}
try {
    $iscCreds = Import-Clixml -Path $IscCredentialPath
    $WebhookClientId = $iscCreds.WebhookClientId
    $WebhookClientSecret = (New-Object System.Management.Automation.PSCredential("dummy", $iscCreds.WebhookClientSecret)).GetNetworkCredential().Password
    $ApiClientId = $iscCreds.ApiClientId
    $ApiClientSecret = (New-Object System.Management.Automation.PSCredential("dummy", $iscCreds.ApiClientSecret)).GetNetworkCredential().Password
} catch {
    Write-Error "Failed to load or decrypt ISC credentials from $IscCredentialPath. Ensure the XML was created on this exact machine/profile."
    return
}

# --- Workflow Dynamic Configuration ---
if ($ApiClientId -and $ApiClientSecret -and $WorkflowId) {
    Write-Host "Fetching Workflow configuration from ISC..." -ForegroundColor Cyan
    
    $tokenResponse = Invoke-RestMethod -Uri "$TenantUrl/oauth/token" -Method Post -Body @{ grant_type='client_credentials'; client_id=$ApiClientId; client_secret=$ApiClientSecret }
    $headers = @{ 'Authorization' = "Bearer $($tokenResponse.access_token)" }
    
    try {
        $wf = Invoke-RestMethod -Uri "$TenantUrl/workflows/v1/$WorkflowId" -Headers $headers
        
        $stepsObj = $wf.definition.steps
        $stepProperties = $stepsObj.psobject.properties

        foreach ($prop in $stepProperties) {
            $step = $prop.Value
            if ($step.actionId -eq 'sp:define-variable') {
                $includeVar = $step.attributes.variables | Where-Object { $_.name -eq 'include' }
                $excludeVar = $step.attributes.variables | Where-Object { $_.name -eq 'exclude' }

                if ($includeVar) {
                    $includeVals = if ($includeVar.'variableA.$') { $includeVar.'variableA.$' } else { $includeVar.variableA }
                    if ($includeVals) { $IncludeFilters = @($includeVals) }
                }
                if ($excludeVar) {
                    $excludeVals = if ($excludeVar.'variableA.$') { $excludeVar.'variableA.$' } else { $excludeVar.variableA }
                    if ($excludeVals) { $ExcludeFilters = @($excludeVals) }
                }
                
                $messageOnlyVar = $step.attributes.variables | Where-Object { $_.name -match 'messageOnly' }
                if ($messageOnlyVar) {
                    $msgVal = if ($messageOnlyVar.'variableA.$') { $messageOnlyVar.'variableA.$' } else { $messageOnlyVar.variableA }
                    if ($msgVal -match 'true') { $MessageOnly = $true }
                }
                break
            }
        }
        Write-Host "Successfully loaded dynamic filters from workflow! Include: $($IncludeFilters.Count) Exclude: $($ExcludeFilters.Count)" -ForegroundColor Green
    } catch {
        Write-Warning "Could not fetch dynamic workflow config for ID $WorkflowId. Falling back to default script parameters. Error: $_"
    }
} elseif (-not $WorkflowId) {
    Write-Warning "No -WorkflowId provided. Skipping dynamic filter fetch from ISC."
}
# --------------------------------------

$plinkPath = Join-Path $PSScriptRoot "plink.exe"
if (-not (Test-Path $plinkPath)) {
    Write-Warning "plink.exe not found at $plinkPath! Did you run Save-VaCredential.ps1?"
    return
}

# Load VA Credentials
if (-not (Test-Path $CredentialPath)) {
    Write-Error "Credential file not found at $CredentialPath. Please run Save-VaCredential.ps1 first!"
    return
}
$VaCreds = Import-Clixml $CredentialPath
$plainVaPassword = $VaCreds.GetNetworkCredential().Password

foreach ($hostIp in $VaHosts) {
    Write-Host "Connecting to VA: $hostIp..." -ForegroundColor Cyan
    
    # Build dynamic grep command
    $sshCommand = "cat /home/sailpoint/log/ccg.log"
    
    if ($IncludeFilters.Count -gt 0) {
        # Treat multiple includes as an AND condition
        foreach ($filter in $IncludeFilters) {
            $sshCommand += " | grep -i -F '$filter'"
        }
    }
    
    foreach ($filter in $ExcludeFilters) {
        $sshCommand += " | grep -v -i -F '$filter'"
    }
    $sshCommand += " | tail -n $TailLines"
    
    Write-Host "Generated SSH Command: $sshCommand" -ForegroundColor DarkGray
    
    # Execute Native SSH and capture output
    Write-Host "Executing command on $hostIp via PuTTY plink..."
    $logOutput = $null
    try {
        # -batch disables all interactive prompts
        # 2>&1 captures both stdout and stderr
        $sshResult = & $plinkPath -ssh $SshUser@$hostIp -pw $plainVaPassword -batch "$sshCommand" 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Execution failed or returned no matches on $hostIp."
            Write-Warning "Output: $sshResult"
        } else {
            $logOutput = $sshResult
        }
    } catch {
        Write-Warning "Execution critically failed on $($hostIp): $_"
    }

    if ($logOutput) {
        $logOutputArray = @($logOutput)
        [array]::Reverse($logOutputArray)
        
        foreach ($line in $logOutputArray) {
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            
            # Only attempt to parse as JSON if the line actually starts with a curly brace
            if ($line.Trim().StartsWith("{")) {
                try {
                    $jsonObj = $line | ConvertFrom-Json -ErrorAction Stop
                    $ts = if ($jsonObj.'@timestamp') { $jsonObj.'@timestamp' } elseif ($jsonObj.timestamp) { $jsonObj.timestamp } else { "UNKNOWN_TIME" }
                    $lvl = if ($jsonObj.Level) { $jsonObj.Level } elseif ($jsonObj.level) { $jsonObj.level } else { "INFO" }
                    $msg = if ($jsonObj.message) { $jsonObj.message } else { $line }
                    
                    if ($MessageOnly) {
                        $formattedLine = $msg
                    } else {
                        $formattedLine = "[$hostIp] [$ts] [$lvl] $msg"
                    }
                    $compiledLogs += $formattedLine
                } catch {
                    if ($MessageOnly) { $compiledLogs += $line } else { $compiledLogs += "[$hostIp] $line" }
                }
            } else {
                # Standard raw log line
                if ($MessageOnly) { $compiledLogs += $line } else { $compiledLogs += "[$hostIp] $line" }
            }
        }
        Write-Host "Found $($logOutputArray.Count) matching log lines on $hostIp." -ForegroundColor Green
    } else {
        Write-Host "No matching logs found on $hostIp." -ForegroundColor Yellow
    }
}

if ($compiledLogs.Count -eq 0) {
    Write-Warning "No logs were found across any VAs. Exiting without triggering workflow."
    return
}

# Authenticate with ISC
Write-Host "Authenticating with SailPoint ISC..." -ForegroundColor Cyan
$tokenUrl = "$TenantUrl/oauth/token"
$body = @{
    grant_type    = "client_credentials"
    client_id     = $WebhookClientId
    client_secret = $WebhookClientSecret
}

try {
    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body
    $accessToken = $tokenResponse.access_token
} catch {
    Write-Error "Failed to authenticate with SailPoint ISC. $_"
    return
}

# Post to Workflow
Write-Host "Posting logs to Workflow External Trigger..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type"  = "application/json"
}

$payload = @{
    logs = $compiledLogs
} | ConvertTo-Json -Depth 10

try {
    $workflowResponse = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Headers $headers -Body $payload
    Write-Host "Successfully posted logs to workflow! Check the Workflow Executions UI in SailPoint." -ForegroundColor Green
} catch {
    Write-Error "Failed to invoke workflow trigger. $_"
}
