[CmdletBinding()]
param (
    [Parameter(Mandatory = $false)]
    [string]$WorkflowId,

    [Parameter(Mandatory = $false)]
    [string]$WorkflowPath,

    [Parameter(Mandatory = $false)]
    [string]$PatId,

    [Parameter(Mandatory = $false)]
    [switch]$SkipUpdate,

    [string]$ScopesMapPath = "$PSScriptRoot\scopes_map.json"
)

# --- Hardcoded Configuration ---
$TenantName = "{tenant}"
$ClientId = ""
$ClientSecret = ""
$TenantUrl = "https://$TenantName.api.identitynow-demo.com"

# Enforce TLS 1.2 for API connections (Resolves PAG secure channel errors)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# 1. Load Scopes Map
if (-not (Test-Path $ScopesMapPath)) {
    Write-Error "Scopes map not found at $ScopesMapPath. Please ensure the scopes_map.json file is deployed alongside this script."
    exit 1
}

$ScopesMap = Get-Content $ScopesMapPath | ConvertFrom-Json
$RequiredScopes = [System.Collections.Generic.HashSet[string]]::new()
$EndpointScopes = @()

# 2. Authenticate (Skip if testing locally)
$Headers = $null
if (-not ($WorkflowPath -and $SkipUpdate)) {
    $TokenUrl = "$TenantUrl/oauth/token"
    $TokenBody = @{
        grant_type    = "client_credentials"
        client_id     = $ClientId
        client_secret = $ClientSecret
    }

    try {
        Write-Host "Authenticating to $TenantUrl..."
        $TokenResponse = Invoke-RestMethod -Uri $TokenUrl -Method Post -Body $TokenBody
        $AccessToken = $TokenResponse.access_token

        $Headers = @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type"  = "application/json"
        }
    }
    catch {
        Write-Error "Failed to authenticate to ISC API: $_"
        exit 1
    }
}

# 3. Fetch Workflow JSON
if ($WorkflowPath) {
    if (-not (Test-Path $WorkflowPath)) {
        Write-Error "WorkflowPath not found: $WorkflowPath"
        exit 1
    }
    Write-Host "Loading Workflow from local file $WorkflowPath..."
    $Workflow = Get-Content $WorkflowPath -Raw | ConvertFrom-Json
}
elseif ($WorkflowId) {
    $WorkflowUrl = "$TenantUrl/beta/workflows/$WorkflowId"
    try {
        Write-Host "Fetching Workflow $WorkflowId..."
        $Workflow = Invoke-RestMethod -Uri $WorkflowUrl -Method Get -Headers $Headers
    }
    catch {
        Write-Error "Failed to fetch workflow: $_"
        exit 1
    }
}
else {
    Write-Error "Either WorkflowId or WorkflowPath must be provided."
    exit 1
}

# 4. Analyze Workflow Steps
$HasHttpActions = $false

$StepsObj = $null
if ($Workflow.definition.steps) {
    $StepsObj = $Workflow.definition.steps
}
elseif ($Workflow.steps) {
    $StepsObj = $Workflow.steps
}

if ($StepsObj) {
    # .steps is a PSObject containing the step keys
    foreach ($StepName in $StepsObj.PSObject.Properties.Name) {
        $StepData = $StepsObj.$StepName
        
        if ($StepData.actionId -eq "sp:http") {
            $HasHttpActions = $true
            $Method = if ($StepData.attributes.method) { $StepData.attributes.method.ToUpper() } else { "GET" }
            $Url = $StepData.attributes.url

            $Url = $StepData.attributes.url -replace '\{\{?[^}]+\}?\}', 'placeholder'
            $Url = $Url -replace '<[^>]+>', 'placeholder'
            $Url = $Url -replace '\$\.[a-zA-Z0-9_\.]+', 'placeholder'

            try {
                $UriObj = [System.Uri]::new($Url)
                $PathParts = $UriObj.LocalPath.Split('/', [System.StringSplitOptions]::RemoveEmptyEntries)
                
                if ($PathParts.Count -eq 0) {
                    Write-Warning "Invalid endpoint path on step '$StepName'."
                    continue
                }

                $Prefix = $PathParts[0].ToLower()
                $PublicApiVersions = @("v1", "v2", "v3", "v4", "v5", "beta", "v2024", "v2025", "v2026", "v2027", "v2028")

                if ($Prefix -eq "cc") {
                    Write-Warning "Legacy CC API detected on step '$StepName' ($Method $Url). There is no proper documentation to give an exact scope. Please ensure the PAT has the necessary admin privileges."
                    continue
                }

                if ($Prefix -in $PublicApiVersions) {
                    $ApiVersion = $Prefix
                    $EndpointPath = "/" + ($PathParts[1..($PathParts.Count - 1)] -join "/")
                }
                else {
                    $ApiVersion = "root"
                    $EndpointPath = "/" + ($PathParts -join "/")
                }

                # Find Scope in Map
                $FoundScope = $false
                $StepScopes = @()
                $WarningMsg = $null
                $SpecVersion = if ($ScopesMap.$ApiVersion) { $ApiVersion } elseif ($ApiVersion -match '^v202\d$') { 'v2024' } else { 'v3' }
                
                $VersionMap = $ScopesMap.$SpecVersion
                
                if ($null -ne $VersionMap) {
                    # Exact Match
                    if ($VersionMap.$EndpointPath -and $VersionMap.$EndpointPath.$Method) {
                        foreach ($Scope in $VersionMap.$EndpointPath.$Method) {
                            $null = $RequiredScopes.Add($Scope)
                            $StepScopes += $Scope
                        }
                        $FoundScope = $true
                    }
                    else {
                        # Regex Match for {id} params
                        foreach ($SpecPath in $VersionMap.PSObject.Properties.Name) {
                            $RegexStr = "^" + ($SpecPath -replace '\{[^}]+\}', '[^/]+') + "$"
                            if ($EndpointPath -match $RegexStr) {
                                if ($VersionMap.$SpecPath.$Method) {
                                    foreach ($Scope in $VersionMap.$SpecPath.$Method) {
                                        $null = $RequiredScopes.Add($Scope)
                                        $StepScopes += $Scope
                                    }
                                    $FoundScope = $true
                                    break
                                }
                            }
                        }
                    }
                }

                if (-not $FoundScope) {
                    if ($ApiVersion -eq "root") {
                        $WarningMsg = "Internal or undocumented API. No scopes found."
                        Write-Warning "Internal or undocumented API detected on step '$StepName' (path starts with /$Prefix/). There is no proper documentation to give an exact scope. Please ensure the PAT has the necessary privileges."
                    }
                    else {
                        $WarningMsg = "No explicit scopes documented."
                        Write-Warning "No explicit scopes found in documentation for endpoint on step '$StepName' ($Method $Url)."
                    }
                }

                $EndpointScopes += [PSCustomObject]@{
                    Method  = $Method
                    Url     = $StepData.attributes.url
                    Scopes  = $StepScopes
                    Warning = $WarningMsg
                }

            }
            catch {
                Write-Warning "Could not parse URL on step '$StepName'. Url: $Url"
            }
        }
    }
}

if (-not $HasHttpActions) {
    Write-Host "No HTTP Request (sp:http) actions found in this workflow."
    
    $HtmlBuilder = [System.Text.StringBuilder]::new()
    $null = $HtmlBuilder.Append("<table style='width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #cfd8dc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); font-family: sans-serif; margin-bottom: 12px;'>")
    $null = $HtmlBuilder.Append("<tr><td style='padding: 16px; text-align: center; color: #64748b; font-size: 13px; font-style: italic;'>No HTTP Request (sp:http) actions found in this workflow. No scopes are required.</td></tr></table>")
    
    $OutputData = @{
        scopes     = @()
        PATsummary = $HtmlBuilder.ToString()
    }
    
    Write-Output ($OutputData | ConvertTo-Json -Depth 10 -Compress)
    exit 0
}

if ($RequiredScopes.Count -eq 0) {
    Write-Host "No specific scopes required (or endpoints had no documented scopes)."
}
else {
    Write-Host "Calculated required scopes: $(($RequiredScopes | Sort-Object) -join ', ')"
}

if ($SkipUpdate -or [string]::IsNullOrWhiteSpace($PatId)) {
    Write-Host "Skipping PAT Update. Returning scopes as JSON output."
    
    $HtmlBuilder = [System.Text.StringBuilder]::new()
    $null = $HtmlBuilder.Append("<table style='width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #cfd8dc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); font-family: sans-serif; margin-bottom: 12px;'>")
    $null = $HtmlBuilder.Append("<tr><th style='padding: 12px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 13px; color: #1e293b;'>Endpoint</th><th style='padding: 12px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 13px; color: #1e293b;'>Required Scopes</th></tr>")
    
    foreach ($Ep in $EndpointScopes) {
        $ScopesHtml = ""
        foreach ($S in $Ep.Scopes) {
            $ScopesHtml += "<span style='background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-right: 4px; display: inline-block; margin-bottom: 4px;'>$S</span>"
        }
        if ([string]::IsNullOrWhiteSpace($ScopesHtml)) {
            $Msg = if ($Ep.Warning) { $Ep.Warning } else { "None found" }
            $ScopesHtml = "<span style='color: #94a3b8; font-size: 11px; font-style: italic;'>$Msg</span>"
        }
        
        $null = $HtmlBuilder.Append("<tr><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155; vertical-align: middle; word-break: break-all;'><code style='font-family: monospace; color: #d63384; font-weight: bold;'>$($Ep.Method)</code> <span style='color: #475569;'>$($Ep.Url)</span></td><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;'>$ScopesHtml</td></tr>")
    }
    $null = $HtmlBuilder.Append("</table>")

    $ScopesJsonStr = ConvertTo-Json -InputObject @($RequiredScopes | Sort-Object) -Compress
    $null = $HtmlBuilder.Append("<br><div style='font-size: 13px; color: #1e293b; font-weight: bold; margin-bottom: 6px;'>Raw Scopes Array</div><pre style='background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #0f172a; white-space: pre-wrap; word-break: break-all;'>$ScopesJsonStr</pre>")
    
    $OutputData = @{
        scopes     = @($RequiredScopes | Sort-Object)
        PATsummary = $HtmlBuilder.ToString()
    }
    
    # Write to standard output so a workflow engine can capture it
    Write-Output ($OutputData | ConvertTo-Json -Depth 10 -Compress)
    exit 0
}

# 5. Update the PAT
$PatUrl = "$TenantUrl/v3/personal-access-tokens/$PatId"
$ScopesArray = [string[]]($RequiredScopes)
$PatchBody = ConvertTo-Json -InputObject @(
    @{
        op    = "replace"
        path  = "/scope"
        value = $ScopesArray
    }
) -Depth 5

try {
    Write-Host "Updating PAT $PatId with new scopes..."
    $Headers."Content-Type" = "application/json-patch+json"
    $PatchResponse = Invoke-RestMethod -Uri $PatUrl -Method Patch -Headers $Headers -Body $PatchBody
    Write-Host "Successfully updated PAT $PatId."
    
    $OwnerName = if ($PatchResponse.owner.name) { $PatchResponse.owner.name } else { "Unknown Identity" }
    $PatName = if ($PatchResponse.name) { $PatchResponse.name } else { "Unknown Name" }
    $ScopeCount = if ($PatchResponse.scope) { $PatchResponse.scope.Count } else { 0 }
    
    $HtmlBuilder = [System.Text.StringBuilder]::new()
    $null = $HtmlBuilder.Append("<table style='width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #cfd8dc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); font-family: sans-serif; margin-bottom: 12px;'>")
    $null = $HtmlBuilder.Append("<tr><th colspan='2' style='padding: 12px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 14px; color: #1e293b;'>PAT Update Summary</th></tr>")
    $null = $HtmlBuilder.Append("<tr><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; width: 30%; font-weight: bold;'>Identity</td><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; font-weight: bold;'>$OwnerName</td></tr>")
    $null = $HtmlBuilder.Append("<tr><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: bold;'>Token Name</td><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;'>$PatName</td></tr>")
    $null = $HtmlBuilder.Append("<tr><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: bold;'>Token ID</td><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;'><code style='color: #d63384; font-family: monospace;'>$PatId</code></td></tr>")
    $null = $HtmlBuilder.Append("<tr><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: bold;'>Total Scopes</td><td style='padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;'><span style='background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;'>$ScopeCount applied</span></td></tr>")
    $null = $HtmlBuilder.Append("</table>")

    $ScopesJsonStr = ConvertTo-Json -InputObject @($RequiredScopes | Sort-Object) -Compress
    $null = $HtmlBuilder.Append("<br><div style='font-size: 13px; color: #1e293b; font-weight: bold; margin-bottom: 6px;'>Applied Scopes Array</div><pre style='background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #0f172a; white-space: pre-wrap; word-break: break-all;'>$ScopesJsonStr</pre>")
    
    $SuccessOutput = @{
        status = "success"
        message = "Successfully updated PAT $PatId"
        scopes = @($RequiredScopes | Sort-Object)
        PATsummary = $HtmlBuilder.ToString()
    }
    Write-Output ($SuccessOutput | ConvertTo-Json -Depth 10 -Compress)
}
catch {
    Write-Error "Failed to update PAT: $_"
    exit 1
}

