$CredentialPath = Join-Path -Path $PSScriptRoot -ChildPath "Credentials\isc_creds.xml"

# Ensure the directory exists
$Dir = Split-Path $CredentialPath
if (-not (Test-Path $Dir)) {
    New-Item -ItemType Directory -Force -Path $Dir | Out-Null
}

Write-Host "This script will securely save your Identity Security Cloud API Credentials." -ForegroundColor Cyan
Write-Host "The credentials will be encrypted using Windows DPAPI and tied to your Windows profile on this machine." -ForegroundColor Yellow
Write-Host "NOTE: You MUST run this script on the Windows Server where the logger script will be executed!" -ForegroundColor Red
Write-Host ""

$webhookClientId = Read-Host "Enter your Webhook Trigger Client ID"
$webhookClientSecretPlain = Read-Host "Enter your Webhook Trigger Client Secret" -AsSecureString

$apiClientId = Read-Host "Enter your Standard API Client ID"
$apiClientSecretPlain = Read-Host "Enter your Standard API Client Secret" -AsSecureString

# Store them in a Hashtable. The secrets are stored as SecureString objects.
$creds = @{
    WebhookClientId     = $webhookClientId
    WebhookClientSecret = $webhookClientSecretPlain
    ApiClientId         = $apiClientId
    ApiClientSecret     = $apiClientSecretPlain
}

$creds | Export-Clixml -Path $CredentialPath

Write-Host ""
Write-Host "Success! The credentials have been encrypted and saved to $CredentialPath" -ForegroundColor Green
