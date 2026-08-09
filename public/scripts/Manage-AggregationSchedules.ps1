param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("Export", "Import", "BackupAndRemoveAll", "Back Up And Remove All", "RestoreAll", "Restore All")]
    [string]$Action,
    
    [string]$CsvPath = ".\AggregationSchedules.csv",
    [string]$EmailCsvTo
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

Write-Log -Message "--- Manage-AggregationSchedules Script Execution Started ---"
Write-Log -Message "Input Action: '$Action'"


# Authentication Details
$clientId = "YOUR_CLIENT_ID"
$clientSecret = "YOUR_CLIENT_SECRET"
$tenant = "YOUR_TENANT"
$apiUrl = "https://$tenant.api.identitynow.com"

Write-Log -Message "Authenticating to $tenant..."
$authUrl = "$apiUrl/oauth/token"
$body = @{
    grant_type    = "client_credentials"
    client_id     = $clientId
    client_secret = $clientSecret
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

try {
    $authResponse = Invoke-RestMethod -Uri $authUrl -Method Post -Body $body
    $token = $authResponse.access_token
    $headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
}
catch {
    Throw-Error "Failed to authenticate. Please check client ID, secret, and tenant."
}

# Helper: Fetch All Sources (using /v1/sources as requested)
function Get-AllSources {
    Write-Log -Message "Fetching sources..."
    $limit = 250
    $firstUrl = "$apiUrl/sources/v1?limit=$limit&offset=0&count=true"
    $firstResponse = Invoke-WebRequest -Uri $firstUrl -Headers $headers -Method Get -UseBasicParsing
    $totalCount = [int]$firstResponse.Headers["X-Total-Count"]

    $sources = @()
    $pageSources = $firstResponse.Content | ConvertFrom-Json
    if ($pageSources -isnot [array]) {
        if ($null -ne $pageSources.items) { $pageSources = $pageSources.items }
        elseif ($null -ne $pageSources.value) { $pageSources = $pageSources.value }
    }
    if ($pageSources) { $sources += $pageSources }

    if ($totalCount -gt $limit) {
        $pool = [runspacefactory]::CreateRunspacePool(1, 10)
        $pool.Open()
        $tasks = @()

        for ($offset = $limit; $offset -lt $totalCount; $offset += $limit) {
            $ps = [powershell]::Create().AddScript({
                    param($url, $headers)
                    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
                    $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
                    $page = $res
                    if ($res -isnot [array]) {
                        if ($null -ne $res.items) { $page = $res.items }
                        elseif ($null -ne $res.value) { $page = $res.value }
                    }
                    return $page
                }).AddArgument("$apiUrl/sources/v1?limit=$limit&offset=$offset").AddArgument($headers)
            
            $ps.RunspacePool = $pool
            $tasks += [PSCustomObject]@{ Pipe = $ps; Status = $ps.BeginInvoke() }
        }

        foreach ($task in $tasks) {
            $results = $task.Pipe.EndInvoke($task.Status)
            if ($results) { $sources += $results }
            $task.Pipe.Dispose()
        }
        $pool.Close()
        $pool.Dispose()
    }
    return $sources
}

# Actions
if ($Action -eq "Export") {
    $sources = Get-AllSources
    Write-Log -Message "Fetching schedules in parallel for $($sources.Count) sources..."
    $results = @()

    $pool = [runspacefactory]::CreateRunspacePool(1, 15)
    $pool.Open()
    $tasks = @()

    foreach ($source in $sources) {
        $ps = [powershell]::Create().AddScript({
                param($source, $apiUrl, $headers)
                [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
                $sourceId = $source.id
                $schedulesUrl = "$apiUrl/sources/v1/$sourceId/schedules"
                $outRows = @()
                try {
                    $schedulesRes = Invoke-RestMethod -Uri $schedulesUrl -Headers $headers -Method Get
                    $schedules = $schedulesRes
                    if ($schedulesRes -isnot [array]) {
                        if ($null -ne $schedulesRes.items) { $schedules = $schedulesRes.items }
                        elseif ($null -ne $schedulesRes.value) { $schedules = $schedulesRes.value }
                    }
                
                    if (-not $schedules) {
                        $outRows += [PSCustomObject]@{ "Source ID" = $sourceId; "Name" = $source.name; "Type" = "NOT SET"; "CRON" = "" }
                    }
                    else {
                        foreach ($sched in $schedules) {
                            $outRows += [PSCustomObject]@{ "Source ID" = $sourceId; "Name" = $source.name; "Type" = $sched.type; "CRON" = $sched.cronExpression }
                        }
                    }
                }
                catch { Write-Log -Message "Could not fetch schedules for $($source.name)" -Level "WARN" }
                return $outRows
            }).AddArgument($source).AddArgument($apiUrl).AddArgument($headers)
        
        $ps.RunspacePool = $pool
        $tasks += [PSCustomObject]@{ Pipe = $ps; Status = $ps.BeginInvoke() }
    }

    foreach ($task in $tasks) {
        $taskRes = $task.Pipe.EndInvoke($task.Status)
        if ($taskRes) { $results += $taskRes }
        $task.Pipe.Dispose()
    }
    $pool.Close()
    $pool.Dispose()
    
    $csvDirectory = "C:\Scripts\Aggregation Exports"
    if (-not (Test-Path $csvDirectory)) { New-Item -ItemType Directory -Force -Path $csvDirectory | Out-Null }
    
    $dateStr = (Get-Date).ToString("MMddyyyy_HHmmss")
    $exportPath = Join-Path -Path $csvDirectory -ChildPath "AggregationSchedules_$dateStr.csv"
    $results | Export-Csv -Path $exportPath -NoTypeInformation
    Write-Log -Message "Exported to $exportPath"

    if (-not [string]::IsNullOrWhiteSpace($EmailCsvTo)) {
        Write-Log -Message "Sending email..."
        $SecPassword = ConvertTo-SecureString "YOUR_APP_PASSWORD" -AsPlainText -Force
        $cred = New-Object System.Management.Automation.PSCredential ("YOUR_SENDER_EMAIL@DOMAIN.COM", $SecPassword)
        
        Send-MailMessage -To $EmailCsvTo `
            -From "YOUR_SENDER_EMAIL@DOMAIN.COM" `
            -Subject "Aggregation Schedules Export" `
            -Body "Please find the aggregation schedules attached." `
            -Attachments $exportPath `
            -SmtpServer "smtp.gmail.com" `
            -Port 587 -UseSsl -Credential $cred
        Write-Log -Message "Email sent."
    }
}

if ($Action -eq "Import") {
    $csvDirectory = "C:\Scripts\Aggregation Exports"
    if (-not (Test-Path $csvDirectory)) { New-Item -ItemType Directory -Force -Path $csvDirectory | Out-Null }
    $fullPath = Join-Path $csvDirectory $CsvPath
    if (-not (Test-Path $fullPath)) { Throw-Error "CSV not found."; exit }
    
    $csv = Import-Csv $fullPath
    foreach ($row in $csv) {
        if ([string]::IsNullOrWhiteSpace($row.CRON)) { continue }
        $sourceId = $row."Source ID"
        $type = $row.Type
        if ($type -eq "NOT SET") { continue }
        
        # Delete existing
        $delUrl = "$apiUrl/sources/v1/$sourceId/schedules/$type"
        try { Invoke-RestMethod -Uri $delUrl -Headers $headers -Method Delete | Out-Null } catch {}
        
        $postUrl = "$apiUrl/sources/v1/$sourceId/schedules"
        $body = @{ type = $type; cronExpression = $row.CRON } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri $postUrl -Headers $headers -Method Post -Body $body | Out-Null
            Write-Log -Message "Imported schedule for Source ID $sourceId ($type) -> $($row.CRON)"
        }
        catch { Write-Log -Message "Failed to import schedule for Source ID $sourceId" -Level "WARN" }
    }
}

if ($Action -eq "BackupAndRemoveAll" -or $Action -eq "Back Up And Remove All") {
    $sources = Get-AllSources
    foreach ($source in $sources) {
        $sourceId = $source.id
        $schedulesUrl = "$apiUrl/sources/v1/$sourceId/schedules"
        try {
            $schedulesRes = Invoke-RestMethod -Uri $schedulesUrl -Headers $headers -Method Get
            $schedules = $schedulesRes
            if ($schedulesRes -isnot [array]) {
                if ($null -ne $schedulesRes.items) { $schedules = $schedulesRes.items }
                elseif ($null -ne $schedulesRes.value) { $schedules = $schedulesRes.value }
            }
            
            $acctCron = ""; $grpCron = ""
            if ($schedules) {
                foreach ($sched in $schedules) {
                    if ($sched.type -eq "ACCOUNT_AGGREGATION") { $acctCron = $sched.cronExpression }
                    if ($sched.type -eq "GROUP_AGGREGATION") { $grpCron = $sched.cronExpression }
                }
            }
            
            # Patch Source to store backup
            if ($acctCron -or $grpCron) {
                $patchUrl = "$apiUrl/sources/v1/$sourceId"
                $patchBody = @(
                    @{ op = "add"; path = "/connectorAttributes/BackUpAccountAggregationCRON"; value = $acctCron },
                    @{ op = "add"; path = "/connectorAttributes/BackUpGroupAggregationCRON"; value = $grpCron }
                ) | ConvertTo-Json
                
                # IdentityNow patch headers require application/json-patch+json
                $patchHeaders = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json-patch+json" }
                Invoke-RestMethod -Uri $patchUrl -Headers $patchHeaders -Method Patch -Body $patchBody | Out-Null
                Write-Log -Message "Backed up schedules for $($source.name)"
                
                # Delete the schedules
                if ($acctCron) { Invoke-RestMethod -Uri "$apiUrl/sources/v1/$sourceId/schedules/ACCOUNT_AGGREGATION" -Headers $headers -Method Delete | Out-Null }
                if ($grpCron) { Invoke-RestMethod -Uri "$apiUrl/sources/v1/$sourceId/schedules/GROUP_AGGREGATION" -Headers $headers -Method Delete | Out-Null }
            }
        }
        catch { Write-Log -Message "Error backing up source $($source.name)" -Level "WARN" }
    }
}

if ($Action -eq "RestoreAll" -or $Action -eq "Restore All") {
    $sources = Get-AllSources
    foreach ($source in $sources) {
        $sourceId = $source.id
        $acctCron = $source.connectorAttributes.BackUpAccountAggregationCRON
        $grpCron = $source.connectorAttributes.BackUpGroupAggregationCRON

        if ($acctCron -or $grpCron) {
            # Restore Account Schedule
            if (-not [string]::IsNullOrWhiteSpace($acctCron)) {
                try { Invoke-RestMethod -Uri "$apiUrl/sources/v1/$sourceId/schedules/ACCOUNT_AGGREGATION" -Headers $headers -Method Delete | Out-Null } catch {}
                $body = @{ type = "ACCOUNT_AGGREGATION"; cronExpression = $acctCron } | ConvertTo-Json
                try { Invoke-RestMethod -Uri "$apiUrl/sources/v1/$sourceId/schedules" -Headers $headers -Method Post -Body $body | Out-Null } catch {}
            }
            
            # Restore Group Schedule
            if (-not [string]::IsNullOrWhiteSpace($grpCron)) {
                try { Invoke-RestMethod -Uri "$apiUrl/sources/v1/$sourceId/schedules/GROUP_AGGREGATION" -Headers $headers -Method Delete | Out-Null } catch {}
                $body = @{ type = "GROUP_AGGREGATION"; cronExpression = $grpCron } | ConvertTo-Json
                try { Invoke-RestMethod -Uri "$apiUrl/sources/v1/$sourceId/schedules" -Headers $headers -Method Post -Body $body | Out-Null } catch {}
            }

            # Cleanup backup attributes
            $patchUrl = "$apiUrl/sources/v1/$sourceId"
            $patchBody = @(
                @{ op = "remove"; path = "/connectorAttributes/BackUpAccountAggregationCRON" },
                @{ op = "remove"; path = "/connectorAttributes/BackUpGroupAggregationCRON" }
            ) | ConvertTo-Json
            $patchHeaders = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json-patch+json" }
            try { Invoke-RestMethod -Uri $patchUrl -Headers $patchHeaders -Method Patch -Body $patchBody | Out-Null } catch {}
            
            Write-Log -Message "Restored schedules for $($source.name)"
        }
    }
}
