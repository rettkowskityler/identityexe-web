Write-Host "Downloading SailPoint API Specifications directly from GitHub..." -ForegroundColor Cyan

$TargetDir = "$PSScriptRoot\api-specs\idn"
if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$BaseUrl = "https://raw.githubusercontent.com/sailpoint-oss/api-specs/main/idn"
$FilesToDownload = @(
    "sailpoint-api.v3.yaml",
    "sailpoint-api.beta.yaml",
    "sailpoint-api.v2024.yaml",
    "sailpoint-api.v2025.yaml",
    "sailpoint-api.v2026.yaml",
    "sailpoint-api.yaml"
)

# Enforce TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

foreach ($File in $FilesToDownload) {
    $Url = "$BaseUrl/$File"
    $OutPath = Join-Path -Path $TargetDir -ChildPath $File
    Write-Host "Downloading $File..."
    try {
        Invoke-WebRequest -Uri $Url -OutFile $OutPath -UseBasicParsing
    } catch {
        Write-Warning "Failed to download $File. It may not exist yet on the remote repo."
    }
}

# 2. Run the generator script
Set-Location -Path "$PSScriptRoot"
Write-Host "
Regenerating scopes_map.json directly..." -ForegroundColor Cyan
node generate-scopes.js

Write-Host "
Update Complete! The scopes_map.json file has been updated and outputted directly to your folder." -ForegroundColor Green
