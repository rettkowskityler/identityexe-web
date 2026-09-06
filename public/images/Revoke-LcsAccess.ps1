<#
.SYNOPSIS
Revokes access (Entitlements and Access Profiles) for a specific identity, limited to sources configured with the custom attribute RevokeAll = 'True'.

.DESCRIPTION
This script is designed to be triggered natively by a SailPoint Workflow during an LCS (Lifecycle State) change (e.g., when a user is Terminated).
It performs the following logic:
1. Paginates through all SailPoint ISC sources to identify those with the custom 'RevokeAll' connector attribute set to 'True'.
2. Queries the SailPoint Search API for the user's current access.
3. Filters out any non-revocable items and isolates access belonging only to the identified sources.
4. Safely submits individual Access Request revocations for each identified item, handling rate limits and API restrictions.
5. Unconditionally outputs a JSON response containing an HTML table of the results, perfectly formatted for a SailPoint Workflow 'Send Email' step.

.EXAMPLE
.\Revoke-LcsAccess.ps1 -IdentityId "2c91808568c529c60168cca6f90c1313"
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory=$true, HelpMessage="The SailPoint Identity ID (UUID) to revoke access for")]
    [string]$IdentityId,

    [Parameter(Mandatory=$false, HelpMessage="Path to the encrypted ISC API credentials XML file")]
    [string]$IscCredentialPath = "C:\Scripts\Credentials\isc_creds.xml",

    [Parameter(Mandatory=$false, HelpMessage="If 'true', skips the final API call and just prints the requested items.")]
    [string]$TestMode = "false"
)

# Start logging
Start-Transcript -Path (Join-Path $PSScriptRoot "logs.txt") -Append -Force | Out-Null

# -------------------------------------------------------------------------
# Authentication
# -------------------------------------------------------------------------

$TenantUrl = "https://devrel-ga-20578.api.identitynow-demo.com"

if (Test-Path $IscCredentialPath) {
    $iscCreds = Import-Clixml -Path $IscCredentialPath
    $ApiClientId = $iscCreds.ApiClientId
    $ApiClientSecret = (New-Object System.Management.Automation.PSCredential("dummy", $iscCreds.ApiClientSecret)).GetNetworkCredential().Password
} else {
    Write-Error "Credential file not found at $IscCredentialPath."
    exit
}

# Enforce TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Authenticating to $TenantUrl..."
$tokenResponse = Invoke-RestMethod -Uri "$TenantUrl/oauth/token" -Method Post -Body @{ 
    grant_type='client_credentials'; 
    client_id=$ApiClientId; 
    client_secret=$ApiClientSecret 
}
$headers = @{ 
    'Authorization' = "Bearer $($tokenResponse.access_token)" 
    'Content-Type'  = "application/json"
}

# -------------------------------------------------------------------------
# Step 1: Get Sources and Identify 'RevokeLevel: Full'
# -------------------------------------------------------------------------
Write-Host "Fetching sources to determine Revoke Levels..."

$limit = 250
$offset = 0
$sources = @()

do {
    $page = Invoke-RestMethod -Uri "$TenantUrl/sources/v1?limit=$limit&offset=$offset" -Headers $headers -Method Get
    if ($page) {
        $sources += $page
    }
    $offset += $limit
} while ($page.Count -eq $limit)

$fullRevokeSourceIds = @()
$fullRevokeSourceNames = @()
foreach ($source in $sources) {
    if ($source.connectorAttributes.RevokeAll -eq $true -or $source.connectorAttributes.RevokeAll -eq 'True') {
        $fullRevokeSourceIds += $source.id
        $fullRevokeSourceNames += $source.name
        Write-Host "Found Full Revoke Source: $($source.name)" -ForegroundColor Cyan
    }
}

if ($fullRevokeSourceIds.Count -eq 0) {
    Write-Host "No sources found with RevokeAll = 'True'." -ForegroundColor Yellow
}

# -------------------------------------------------------------------------
# Step 2: Search for the Identity and Their Access
# -------------------------------------------------------------------------
Write-Host "Searching for Identity ID: $IdentityId..."

$searchPayload = @{
    indices = @("identities")
    query = @{
        query = "id:`"$IdentityId`" AND @access(type:ENTITLEMENT OR type:ACCESS_PROFILE)"
    }
    includeNested = $true
    queryResultFilter = @{
        includes = @("id", "name", "access")
    }
} | ConvertTo-Json -Depth 10

$searchResults = Invoke-RestMethod -Uri "$TenantUrl/search/v1" -Headers $headers -Method Post -Body $searchPayload

$identityName = $IdentityId
if (-not $searchResults -or $searchResults.Count -eq 0) {
    Write-Host "Identity not found or has no entitlements/access profiles." -ForegroundColor Yellow
    $identity = $null
} else {
    $identity = $searchResults[0]
    $identityName = $identity.name
    Write-Host "Found Identity ID: $($identity.id)"
}

# -------------------------------------------------------------------------
# Step 3: Filter Access for Revocation and Build Summary
# -------------------------------------------------------------------------
$itemsToRevoke = @()
$htmlRows = ""

if ($identity -and $identity.access) {
    foreach ($accessItem in $identity.access) {
        $action = "Skipped"
        $reason = "Not revocable or not a Full Revoke Source"
        
        # We only care about items that ISC considers revocable (or doesn't explicitly mark as false)
        if ($accessItem.revocable -ne $false) {
            
            # Check if this access item belongs to a "Full Revoke" source
            if ($fullRevokeSourceIds -contains $accessItem.source.id) {
                
                $itemsToRevoke += @{
                    type = $accessItem.type
                    id = $accessItem.id
                    comment = "Automated LCS Revocation"
                }
                $action = "Revoked"
                $reason = "Matched LCS Revoke criteria"
                Write-Host "Marked for Revocation: [$($accessItem.type)] $($accessItem.name) (Source: $($accessItem.source.name))" -ForegroundColor Green
                
                $htmlRows += "<tr><td style='padding:8px; border:1px solid #ddd;'>$($accessItem.type)</td><td style='padding:8px; border:1px solid #ddd;'>$($accessItem.name)</td><td style='padding:8px; border:1px solid #ddd;'>$($accessItem.source.name)</td><td style='padding:8px; border:1px solid #ddd;'><strong>$action</strong></td><td style='padding:8px; border:1px solid #ddd;'>$reason</td></tr>"
            }
        }
    }
}

if ($itemsToRevoke.Count -eq 0) {
    Write-Host "No revocable access found belonging to a 'Full Revoke' source. Nothing to do." -ForegroundColor Yellow
} else {
    # -------------------------------------------------------------------------
    # Step 4: Submit Access Request
    # -------------------------------------------------------------------------
    Write-Host "Submitting Revocation Request for $($itemsToRevoke.Count) items..."

    foreach ($item in $itemsToRevoke) {
        $accessRequestPayload = @{
            requestedFor = @($identityId)
            requestType = "REVOKE_ACCESS"
            requestedItems = @($item)
            clientMetadata = @{
                itemId = $item.id
                sourceName = "LCS Automated Revocation"
            }
        } | ConvertTo-Json -Depth 10

        if ($TestMode -eq "true") {
            Write-Host "TestMode is ENABLED. The following payload would be sent to /access-requests/v1 for item $($item.id):" -ForegroundColor Yellow
            Write-Host $accessRequestPayload
        } else {
            try {
                $response = Invoke-RestMethod -Uri "$TenantUrl/access-requests/v1" -Headers $headers -Method Post -Body $accessRequestPayload
                Write-Host "Revocation request for item $($item.id) submitted successfully!" -ForegroundColor Green
            } catch {
                Write-Error "Failed to submit access request for item $($item.id). $_"
            }
            # Sleep to prevent tripping SailPoint API rate limits (10 requests per 10 seconds max)
            Start-Sleep -Seconds 2
        }
    }
}

# -------------------------------------------------------------------------
# Step 5: Output JSON Summary for Workflow
# -------------------------------------------------------------------------

Stop-Transcript | Out-Null

$htmlSummary = "<h2 style='font-family:sans-serif;'>LCS Revocation Summary</h2>"
$htmlSummary += "<p style='font-family:sans-serif;'>The following access was reviewed and revoked for <strong>$identityName</strong>.</p>"

$htmlSummary += "<h3 style='font-family:sans-serif;'>Sources Checked (RevokeAll = True)</h3>"
$htmlSummary += "<ul style='font-family:sans-serif;'>"
foreach ($sourceName in $fullRevokeSourceNames) {
    $htmlSummary += "<li>$sourceName</li>"
}
$htmlSummary += "</ul>"

if ($htmlRows -ne "") {
    $htmlSummary += "<table style='border-collapse: collapse; width: 100%; font-family:sans-serif;'>"
    $htmlSummary += "<tr style='background-color:#f2f2f2;'><th style='padding:8px; border:1px solid #ddd; text-align:left;'>Type</th><th style='padding:8px; border:1px solid #ddd; text-align:left;'>Name</th><th style='padding:8px; border:1px solid #ddd; text-align:left;'>Source</th><th style='padding:8px; border:1px solid #ddd; text-align:left;'>Action Taken</th><th style='padding:8px; border:1px solid #ddd; text-align:left;'>Reason</th></tr>"
    $htmlSummary += $htmlRows
    $htmlSummary += "</table>"
} else {
    $htmlSummary += "<p style='font-family:sans-serif;'><em>No revocable access found belonging to the checked sources.</em></p>"
}

$jsonResponse = @{
    Body = $htmlSummary
    status = "success"
} | ConvertTo-Json -Depth 2

# Write-Output is captured by SailPoint workflows as the response payload
Write-Output $jsonResponse
