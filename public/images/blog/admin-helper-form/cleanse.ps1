$rawDir = "A:\Tyler\Content\Blogs\admin-helper-form\raw_inputs"
$destDir = "A:\Tyler\Content\Blogs\admin-helper-form"

# Cleanse ResetAccountsBySource.ps1
$content = Get-Content "$rawDir\ResetAccountsBySource.ps1" -Raw
$content = $content -replace '"devrel-ga-\d+"', '"ENTERYOURTENANTNAMEHERE"'
$content = $content -replace 'client_id = "[a-f0-9]+"', 'client_id = "ENTERYOURCLIENTIDHERE"'
$content = $content -replace 'client_secret = "[a-f0-9]+"', 'client_secret = "ENTERYOURCLIENTSECRETHERE"'
$content = $content -replace 'identitynow-demo\.com', 'identitynow.com'
Set-Content "$destDir\ResetAccountsBySource.ps1" $content

# Cleanse AttributeSyncReport.ps1
$content = Get-Content "$rawDir\AttributeSyncReport.ps1" -Raw
$content = $content -replace '"devrel-ga-\d+"', '"ENTERYOURTENANTNAMEHERE"'
$content = $content -replace 'ClientId = "[a-f0-9]+"', 'ClientId = "ENTERYOURCLIENTIDHERE"'
$content = $content -replace 'ClientSecret = "[a-f0-9]+"', 'ClientSecret = "ENTERYOURCLIENTSECRETHERE"'
$content = $content -replace 'identitynow-demo\.com', 'identitynow.com'
$content = $content -replace '"sailpoint@identityexe\.com"', '"ENTERYOUREMAILHERE"'
$content = $content -replace 'SmtpPassword = "[a-z ]+"', 'SmtpPassword = "ENTERYOURPASSWORDHERE"'
Set-Content "$destDir\AttributeSyncReport.ps1" $content

# Cleanse JSON files
$jsonFiles = Get-ChildItem -Path $rawDir -Filter "*.json"
foreach ($file in $jsonFiles) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'devrel-ga-\d+', 'ENTERYOURTENANTNAMEHERE'
    $content = $content -replace 'identitynow-demo\.com', 'identitynow.com'
    $content = $content -replace '"clientId":\s*"[a-f0-9]+"', '"clientId": "ENTERYOURCLIENTIDHERE"'
    $content = $content -replace '"clientSecret":\s*"[a-f0-9]+"', '"clientSecret": "ENTERYOURCLIENTSECRETHERE"'
    $content = $content -replace '"a90bcb9f33b3483fb0cce7dc5aac78ce"', '"ENTERYOURCLIENTIDHERE"'
    $content = $content -replace '"a4bc69fc20792a402abbc100f22a84e3cf137e7ed46ec9bb9d7bb9edecf654ef"', '"ENTERYOURCLIENTSECRETHERE"'
    
    $newName = $file.Name -replace 'devrel-ga-\d+\.identitynow-demo\.com-', ''
    Set-Content "$destDir\$newName" $content
}
