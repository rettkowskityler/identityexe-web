[CmdletBinding()]
param (
    [Parameter(Mandatory=$true, HelpMessage="IP addresses or hostnames of the Virtual Appliances")]
    [string[]]$VaHosts
)

$CredentialPath = Join-Path -Path $PSScriptRoot -ChildPath "Credentials\va_creds.xml"

# Ensure the directory exists
$Dir = Split-Path $CredentialPath
if (-not (Test-Path $Dir)) {
    New-Item -ItemType Directory -Force -Path $Dir | Out-Null
}

$plinkPath = Join-Path $PSScriptRoot "plink.exe"
if (-not (Test-Path $plinkPath)) {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Write-Host "Downloading ultra-stable PuTTY plink.exe (800KB) to bypass Windows cryptography bugs..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://the.earth.li/~sgtatham/putty/latest/w64/plink.exe" -OutFile $plinkPath
    Write-Host "Download complete!" -ForegroundColor Green
}

Write-Host "`nPlease enter the password for the 'sailpoint' user on the VA." -ForegroundColor Cyan
Write-Host "This will be encrypted via Windows DPAPI and saved to $CredentialPath" -ForegroundColor Yellow

$Cred = Get-Credential -UserName "sailpoint" -Message "Enter VA Password"
$Cred | Export-Clixml -Path $CredentialPath

Write-Host "`nCaching VA Host Keys..." -ForegroundColor Cyan
$plainPassword = $Cred.GetNetworkCredential().Password

foreach ($hostIp in $VaHosts) {
    Write-Host "Caching key for $hostIp..." -ForegroundColor DarkGray
    # Echo 'y' to automatically accept and cache the host key if it's the first time connecting
    cmd.exe /c "echo y | `"$plinkPath`" -ssh sailpoint@$hostIp -pw `"$plainPassword`" `"exit`"" | Out-Null
}

Write-Host "`nSuccess! Credentials encrypted and Host Keys cached!" -ForegroundColor Green
Write-Host "You can now run Send-CCGLogsToWorkflow.ps1!" -ForegroundColor Green
