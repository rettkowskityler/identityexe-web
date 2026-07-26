param (
    [Parameter(Mandatory=$true)]
    [string]$SourceId
)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$TenantName = "ENTERYOURTENANTNAMEHERE"
$client_id = "ENTERYOURCLIENTIDHERE"
$client_secret = "ENTERYOURCLIENTSECRETHERE" 

$TenantUrl = "https://$TenantName.api.identitynow.com"
$tokenRequest = Invoke-RestMethod -Method Post -uri "$TenantUrl/oauth/token?grant_type=client_credentials&client_id=$client_id&client_secret=$client_secret"
$headertoken = $tokenRequest.access_token
$headers = @{
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
    "Authorization" = "Bearer $headertoken"
}
# The bulk remove endpoint you mentioned
$BulkRemoveUrl = "https://$TenantName.api.identitynow.com/sources/v1/$SourceId/remove-accounts"
Write-Host "Attempting bulk removal on source $SourceId..."
try {
    # 1. Try the bulk removal
    Invoke-RestMethod -Uri $BulkRemoveUrl -Method POST -Headers $headers | Out-Null
    Write-Host "SUCCESS! Bulk removal completed with no blocking accounts."
    exit
}
catch {
    $statusCode = $null
    if ($_.Exception.Response) { 
        $statusCode = [int]$_.Exception.Response.StatusCode 
    }
    
    if ($statusCode -eq 400) {
        Write-Warning "Bulk removal failed with 400 Bad Request. Checking for the 'Source Owners' bug..."
        
        # Safely extract the JSON payload
        $errorJsonStr = ""
        if ($null -ne $_.ErrorDetails) {
            $errorJsonStr = $_.ErrorDetails.Message
        } elseif ($null -ne $_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorJsonStr = $reader.ReadToEnd()
        }
        
        $errorJson = $errorJsonStr | ConvertFrom-Json
        $messageText = $errorJson.messages[0].text
        Write-Host "Server Message: $messageText"
        
        # 2. Foolproof Regex to extract any 32-character Hex string (SailPoint IDs)
        $matches = [regex]::Matches($messageText, '\b[a-fA-F0-9]{32}\b')
        $badAccountIds = @($matches | ForEach-Object { $_.Value })
        
        if ($badAccountIds.Count -gt 0) {
            Write-Host "Extracted $($badAccountIds.Count) problematic account IDs that need surgical removal."
        } else {
            Write-Error "Could not parse account IDs from the error message. Exiting."
            exit
        }
    } else {
        Write-Error "An unexpected error occurred during bulk removal: $_"
        exit
    }
}
# 3. Sequentially destroy just the problematic accounts
if ($badAccountIds.Count -gt 0) {
    Write-Host "Starting sequential surgical removal of the $($badAccountIds.Count) blocking accounts..."
    $completedCount = 0
    foreach ($accountId in $badAccountIds) {
        $url = "https://$TenantName.api.identitynow.com/v2024/accounts/$accountId/remove"
        
        $retryCount = 0
        $success = $false
        
        while (-not $success -and $retryCount -lt 5) {
            try {
                Invoke-RestMethod -Uri $url -Method POST -Headers $headers | Out-Null
                $success = $true
                $completedCount++
                Write-Host "[$completedCount / $($badAccountIds.Count)] Successfully removed blocking account ID: $accountId"
            }
            catch {
                $statusCode = $null
                if ($_.Exception.Response) { $statusCode = [int]$_.Exception.Response.StatusCode }
                
                if ($statusCode -eq 429) {
                    $retryCount++
                    Write-Warning "Rate limit hit for $accountId. Retrying in 2 seconds..."
                    Start-Sleep -Seconds 2
                } else {
                    Write-Warning "Failed to remove $accountId : $_"
                    break
                }
            }
        }
        
        if (-not $success) {
            Write-Warning "Failed to remove $accountId after 5 retries."
        }
    }
    Write-Host "Surgical removal complete."
    
    # 4. Try the bulk removal one more time to finish the job
    Write-Host "Attempting the bulk removal endpoint again now that the blockers are cleared..."
    Start-Sleep -Seconds 3 # Give SailPoint's backend a few seconds to process the deletes
    
    try {
        Invoke-RestMethod -Uri $BulkRemoveUrl -Method POST -Headers $headers | Out-Null
        Write-Host "SUCCESS! The bulk removal has been successfully submitted for the remaining accounts."
    } catch {
        $errorJsonStr = ""
        if ($null -ne $_.ErrorDetails) {
            $errorJsonStr = $_.ErrorDetails.Message
        } elseif ($null -ne $_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorJsonStr = $reader.ReadToEnd()
        }
        Write-Error "Bulk removal failed on the second attempt. Server responded: $errorJsonStr"
    }
}
