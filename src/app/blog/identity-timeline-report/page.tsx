import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formData from './Form-SelectIdentity_final.json';
import workflowData from './Workflow-IdentityReport_final.json';

const psScriptCode = `<#
.SYNOPSIS
    Generates a comprehensive chronological report of all events, account activities, access requests, and work items for a given Identity ID in SailPoint ISC.
#>

param (
    [Parameter(Mandatory = $true)]
    [string]$IdentityId,

    [Parameter(Mandatory = $true)]
    [string]$Tenant,

    [Parameter(Mandatory = $false)]
    [string[]]$Categories = @(
        'Identity Lifecycle',
        'Audit Event',
        'Account Activity',
        'Access Request',
        'Manual Work Item'
    ),

    [Parameter(Mandatory = $false)]
    [string]$RecipientEmail
)

# --- PARAMETER NORMALIZATION ---
# Handle cases where Categories is passed as a JSON array string or a comma-separated string
if ($Categories.Count -eq 1) {
    if ($Categories[0] -match '^\\s*\\[.*\\]\\s*$') {
        try {
            $Categories = ConvertFrom-Json $Categories[0]
        } catch {
            Write-Host "Warning: Failed to parse Categories parameter as JSON. Using original string."
        }
    } elseif ($Categories[0] -match ',') {
        $Categories = $Categories[0] -split ',' | ForEach-Object { $_.Trim() }
    }
}
# -------------------------------

# --- CONFIGURATION VARIABLES ---
# Replace these values with your SailPoint Personal Access Client Credentials
$ClientId     = "CLIENTIDHERE"
$ClientSecret = "CLIENTSECRETHERE"

$CurrentTime  = Get-Date -Format "yyyyMMdd_HHmmss"
$OutFile      = ".\\Identity_Timeline_$($IdentityId)_$CurrentTime.csv" # Customize export path as needed
# -------------------------------

$BaseUrl = "https://$Tenant.api.identitynow-demo.com"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# --- 1. Authenticate and Get OAuth Token ---
Write-Host "Authenticating to $Tenant..."
$AuthBody = @{
    grant_type    = "client_credentials"
    client_id     = $ClientId
    client_secret = $ClientSecret
}
$TokenResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/oauth/token" -Body $AuthBody
$Headers = @{
    "Authorization" = "Bearer $($TokenResponse.access_token)"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

$TimelineEvents = @()
$IdentityName = "" 

# --- 2. Identity Lifecycle Category (Day 0) ---
if ($Categories -contains 'Identity Lifecycle') {
    Write-Host "Fetching Core Identity Details..."

    $IdSearchPayload = @{
        indices = @("identities")
        query = @{ query = "id:\\"$IdentityId\\"" }
    }
    $IdentityResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/v3/search" -Headers $Headers -Body ($IdSearchPayload | ConvertTo-Json -Depth 10)

    if ($IdentityResponse -and $IdentityResponse.Count -gt 0) {
        $IdData = $IdentityResponse[0]
        $IdentityName = $IdData.name 
        
        $AuthSource = if ($IdData.source.name) { $IdData.source.name } else { "Unknown" }
        $Lcs = if ($IdData.attributes.cloudLifecycleState) { $IdData.attributes.cloudLifecycleState } else { "None" }

        $TimelineEvents += [PSCustomObject]@{
            Timestamp         = [datetime]$IdData.created
            Category          = "Identity Lifecycle"
            Action            = "Identity Created (Day 0)"
            Status            = "Complete"
            TargetObject      = $IdentityName 
            Actor             = "System"
            TargetSource      = "ISC Core"
            ExactChanges      = "Authoritative Source: $AuthSource"
            AdditionalContext = "Initial State: $Lcs"
            TrackingId        = $IdData.id 
        }
    }
} else {
    # If Identity Lifecycle is skipped, we still need the string alias to accurately query admin events below
    $IdSearchPayload = @{ indices = @("identities"); query = @{ query = "id:\\"$IdentityId\\"" } }
    $IdentityResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/v3/search" -Headers $Headers -Body ($IdSearchPayload | ConvertTo-Json -Depth 10)
    if ($IdentityResponse) { $IdentityName = $IdentityResponse[0].name }
}

# --- 3. Search API Categories (Audit Events & Account Activities) ---
$RunAudit = $Categories -contains 'Audit Event'
$RunActivity = $Categories -contains 'Account Activity'

if ($RunAudit -or $RunActivity) {
    Write-Host "Querying Search API (Paginated)..."
    
    # Dynamically build the indices search target based on the category parameter selection
    $TargetIndices = @()
    if ($RunAudit) { $TargetIndices += "events" }
    if ($RunActivity) { $TargetIndices += "accountactivities" }

    $SearchPayload = @{
        indices = $TargetIndices
        query = @{
            query = "(target.id:\\"$IdentityId\\" OR actor.id:\\"$IdentityId\\" OR recipient.id:\\"$IdentityId\\" OR actor.name:\\"$IdentityName\\") AND NOT name:\\"*Personal Access Token*\\" AND NOT name:\\"*Authenticate*\\""
        }
        sort = @("-created") 
    }

    $Offset = 0
    $Limit = 1000 

    while ($true) {
        Write-Host "  -> Fetching search records $Offset to $($Offset + $Limit)..."
        $SearchUri = "$BaseUrl/v3/search?limit=$Limit&offset=$Offset"
        $SearchResponse = Invoke-RestMethod -Method Post -Uri $SearchUri -Headers $Headers -Body ($SearchPayload | ConvertTo-Json -Depth 10)
        
        if ($null -eq $SearchResponse -or $SearchResponse.Count -eq 0) { break }

        foreach ($Item in $SearchResponse) {
            if ($Item._type -eq "event" -and $RunAudit) {
                
                if ($Item.action -eq "IdentityCreated") { continue }
                $TargetObj = if ($Item.target.name) { $Item.target.name } else { "N/A" }

                # Extract and flatten all "Additional Event Attributes" dynamically
                $ExtendedAttrList = @()
                if ($Item.attributes) {
                    foreach ($Key in $Item.attributes.psobject.Properties.Name) {
                        # Ignore standard duplicate tracking properties if they creep into attributes
                        if ($Key -in @('id', 'name', 'action', 'status')) { continue }
                        
                        $Val = $Item.attributes.$Key
                        if ($null -ne $Val) {
                            # Convert sub-objects/arrays to flat JSON strings so they don't break Excel/CSV formatting
                            if ($Val -is [System.Management.Automation.PSCustomObject] -or $Val -is [array]) {
                                $Val = $Val | ConvertTo-Json -Compress
                            }
                            $ExtendedAttrList += "$Key : $Val"
                        }
                    }
                }
                $FlattenedAttributes = if ($ExtendedAttrList.Count -gt 0) { $ExtendedAttrList -join ' | ' } else { "N/A" }

                $TimelineEvents += [PSCustomObject]@{
                    Timestamp         = [datetime]$Item.created
                    Category          = "Audit Event"
                    Action            = $Item.name 
                    Status            = $Item.status
                    TargetObject      = $TargetObj
                    Actor             = $Item.actor.name
                    TargetSource      = "N/A (System Event)"
                    ExactChanges      = $FlattenedAttributes # Expanded with Additional Event Attributes
                    AdditionalContext = "Technical Name: $($Item.technicalName)"
                    TrackingId        = $Item.id 
                }
            }
            elseif ($Item._type -eq "accountactivity" -and $RunActivity) {
                
                $SourceName = if ([string]::IsNullOrWhiteSpace($Item.sources)) { "N/A (No Downstream App Reached)" } else { $Item.sources -join ', ' }

                $ProvisioningDetails = @()
                if ($Item.accountRequests) {
                    foreach ($AcctReq in $Item.accountRequests) {
                        $AppTarget = if ($AcctReq.source.name) { "[App: $($AcctReq.source.name)]" } else { "[App: ISC Internal]" }
                        $Op = if ([string]::IsNullOrWhiteSpace($AcctReq.accountOperation)) { "Update/Sync" } else { $AcctReq.accountOperation }
                        $ProvisioningDetails += "$AppTarget Op: $Op"
                        
                        if ($AcctReq.attributeRequests) {
                            foreach ($AttrReq in $AcctReq.attributeRequests) {
                                $Val = if ($AttrReq.value -is [array]) { $AttrReq.value -join ', ' } else { $AttrReq.value }
                                $ProvisioningDetails += " -> $($AttrReq.operation) '$($AttrReq.name)': $Val"
                            }
                        }
                    }
                }
                $ExactChangesStr = if ($ProvisioningDetails.Count -gt 0) { $ProvisioningDetails -join ' | ' } else { "No explicit attribute changes logged" }

                $ContextStr = @()
                if ($Item.errors) { $ContextStr += "ERRORS: $($Item.errors -join ' ; ')" }
                if ($Item.warnings) { $ContextStr += "WARNINGS: $($Item.warnings -join ' ; ')" }
                $FinalContext = if ($ContextStr.Count -gt 0) { $ContextStr -join ' | ' } else { "Clean Execution" }

                $TimelineEvents += [PSCustomObject]@{
                    Timestamp         = [datetime]$Item.created
                    Category          = "Account Activity (Provisioning)"
                    Action            = $Item.action 
                    Status            = $Item.status
                    TargetObject      = $Item.recipient.name
                    Actor             = $Item.requester.name
                    TargetSource      = $SourceName
                    ExactChanges      = $ExactChangesStr
                    AdditionalContext = $FinalContext
                    TrackingId        = $Item.id 
                }
            }
        }

        if ($SearchResponse.Count -lt $Limit) { break }
        $Offset += $Limit
    }
}

# --- 4. Access Request Category ---
if ($Categories -contains 'Access Request') {
    Write-Host "Querying Access Request Status API (Paginated)..." -ForegroundColor Cyan
    $ReqOffset = 0
    $ReqLimit = 250 

    while ($true) {
        Write-Host "  -> Fetching access requests $ReqOffset to $($ReqOffset + $ReqLimit)..."
        $AccessRequestsUri = "$BaseUrl/v3/access-request-status?requested-for=$IdentityId&sorters=-created&limit=$ReqLimit&offset=$ReqOffset"
        $AccessRequestsResponse = Invoke-RestMethod -Method Get -Uri $AccessRequestsUri -Headers $Headers

        if ($null -eq $AccessRequestsResponse -or $AccessRequestsResponse.Count -eq 0) { break }

        foreach ($Req in $AccessRequestsResponse) {
            $RequestedItemsStr = if ($Req.name -and $Req.type) { "$($Req.type): $($Req.name)" } else { "Unknown Item" }

            $ExtractedComments = @()
            if ($Req.requesterComment) {
                foreach ($CommentObj in $Req.requesterComment) {
                    if ($CommentObj.comment) { $ExtractedComments += $CommentObj.comment }
                }
            }
            $ReqComment = if ($ExtractedComments.Count -gt 0) { "Comment: '$($ExtractedComments -join '; ')'" } else { "No Comment" }
            $PhaseProgression = if ($Req.accessRequestPhases) { $($Req.accessRequestPhases.state -join ' -> ') } else { "Unknown" }

            $TimelineEvents += [PSCustomObject]@{
                Timestamp         = [datetime]$Req.created
                Category          = "Access Request (Governance)"
                Action            = "Submit Access Request"
                Status            = $Req.state
                TargetObject      = $Req.requestedFor.name 
                Actor             = $Req.requester.name
                TargetSource      = "N/A (Evaluated in ISC)"
                ExactChanges      = $RequestedItemsStr
                AdditionalContext = "Phases: $PhaseProgression | $ReqComment"
                TrackingId        = $Req.accessRequestId 
            }
        }

        if ($AccessRequestsResponse.Count -lt $ReqLimit) { break }
        $ReqOffset += $ReqLimit
    }
}

# --- 5. Manual Work Item Category ---
if ($Categories -contains 'Manual Work Item') {
    Write-Host "Querying Manual Work Items (Paginated)..." -ForegroundColor Cyan
    $WorkItemLimit = 250 

    # Pass 1: Work Items Assigned to the User (Owner)
    $WorkItemOffset = 0
    while ($true) {
        Write-Host "  -> Fetching assigned work items $WorkItemOffset to $($WorkItemOffset + $WorkItemLimit)..."
        $WorkItemsUri = "$BaseUrl/v3/work-items?ownerId=$IdentityId&sorters=-created&limit=$WorkItemLimit&offset=$WorkItemOffset"
        $WorkItemsResponse = Invoke-RestMethod -Method Get -Uri $WorkItemsUri -Headers $Headers

        if ($null -eq $WorkItemsResponse -or $WorkItemsResponse.Count -eq 0) { break }

        foreach ($WI in $WorkItemsResponse) {
            $TimelineEvents += [PSCustomObject]@{
                Timestamp         = [datetime]$WI.created
                Category          = "Manual Work Item"
                Action            = "Assigned: $($WI.type)"
                Status            = $WI.state
                TargetObject      = if ($WI.target.name) { $WI.target.name } else { "Unknown Target" }
                Actor             = if ($WI.owner.name) { $WI.owner.name } else { "System" }
                TargetSource      = "ISC Governance"
                ExactChanges      = "Description: $($WI.description)"
                AdditionalContext = "Completion Date: $($WI.completed)"
                TrackingId        = $WI.id 
            }
        }

        if ($WorkItemsResponse.Count -lt $WorkItemLimit) { break }
        $WorkItemOffset += $WorkItemLimit
    }

    # Pass 2: Work Items Requested by the User (Requester)
    $ReqWorkItemOffset = 0
    while ($true) {
        Write-Host "  -> Fetching requested work items $ReqWorkItemOffset to $($ReqWorkItemOffset + $WorkItemLimit)..."
        $ReqWorkItemsUri = "$BaseUrl/v3/work-items?requesterId=$IdentityId&sorters=-created&limit=$WorkItemLimit&offset=$ReqWorkItemOffset"
        $ReqWorkItemsResponse = Invoke-RestMethod -Method Get -Uri $ReqWorkItemsUri -Headers $Headers

        if ($null -eq $ReqWorkItemsResponse -or $ReqWorkItemsResponse.Count -eq 0) { break }

        foreach ($WI in $ReqWorkItemsResponse) {
            $Exists = $TimelineEvents | Where-Object { $_.TrackingId -eq $WI.id -and $_.Category -eq "Manual Work Item" }
            if (-not $Exists) {
                $TimelineEvents += [PSCustomObject]@{
                    Timestamp         = [datetime]$WI.created
                    Category          = "Manual Work Item"
                    Action            = "Requested: $($WI.type)"
                    Status            = $WI.state
                    TargetObject      = if ($WI.target.name) { $WI.target.name } else { "Unknown Target" }
                    Actor             = if ($WI.owner.name) { $WI.owner.name } else { "System" }
                    TargetSource      = "ISC Governance"
                    ExactChanges      = "Description: $($WI.description)"
                    AdditionalContext = "Completion Date: $($WI.completed)"
                    TrackingId        = $WI.id 
                }
            }
        }

        if ($ReqWorkItemsResponse.Count -lt $WorkItemLimit) { break }
        $ReqWorkItemOffset += $WorkItemLimit
    }
}

# --- 6. Sort and Export ---
Write-Host "Normalizing and exporting data..."

if ($TimelineEvents.Count -eq 0) {
    Write-Host "No events found for selected criteria."
    exit
}

# Sort chronologically (Descending = newest events at the top)
$SortedTimeline = $TimelineEvents | Sort-Object Timestamp -Descending

# Ensure the target directory exists
$ParentDir = Split-Path -Parent $OutFile
if ($ParentDir -and -not (Test-Path -Path $ParentDir)) {
    New-Item -ItemType Directory -Path $ParentDir -Force | Out-Null
}

$SortedTimeline | Export-Csv -Path $OutFile -NoTypeInformation
Write-Host "Success! Exported $($SortedTimeline.Count) comprehensive timeline records to $OutFile"

# --- 7. Send Email ---
if ($RecipientEmail) {
    Write-Host "Sending report via email to $RecipientEmail..."

    # SMTP Configuration (Customize to match your environment)
    $SmtpServer = "SMTPSERVERHERE"        # e.g., smtp.yourcompany.com
    $SmtpPort   = 587                      # Typical SMTP port (587 or 25)
    $FromEmail  = "SENDEREMAILHERE"        # e.g., noreply@yourdomain.com
    $Subject    = "Identity Timeline Report - $IdentityId ($Tenant)"
    
    # Credentials Setup
    $SmtpUsername    = "SMTPUSERNAMEHERE"
    $SmtpPassword    = "SMTPPASSWORDHERE"
    $SecPassword     = ConvertTo-SecureString $SmtpPassword -AsPlainText -Force
    $SmtpCredentials = New-Object System.Management.Automation.PSCredential ($SmtpUsername, $SecPassword)

    $CategoriesString = $Categories -join ', '

    $Body = @"
<html>
<body>
    <p>Hello,</p>
    <p>The SailPoint Identity Timeline Report has been generated successfully.</p>
    <p><b>Details:</b></p>
    <ul>
        <li><b>Identity ID:</b> $IdentityId</li>
        <li><b>Tenant:</b> $Tenant</li>
        <li><b>Categories:</b> $CategoriesString</li>
        <li><b>Record Count:</b> $($SortedTimeline.Count)</li>
        <li><b>Generated At:</b> $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</li>
    </ul>
    <p>The report has been attached to this email as a CSV file.</p>
    <br/>
    <p><i>This is an automated message. Please do not reply.</i></p>
</body>
</html>
"@

    $MailParams = @{
        To          = $RecipientEmail
        From        = $FromEmail
        Subject     = $Subject
        Body        = $Body
        BodyAsHtml  = $true
        SmtpServer  = $SmtpServer
        Port        = $SmtpPort
        Attachments = $OutFile
        UseSsl      = $true             # Set to $true if SSL/TLS is required by SMTP host
        Credential  = $SmtpCredentials
    }

    try {
        if ($SmtpPassword -eq "SMTPPASSWORDHERE") {
            Write-Host "SMTP credentials placeholder detected. Skipping actual email transmission."
            Write-Host "Please update \\\`$SmtpUsername\\\` and \\\`$SmtpPassword\\\` in the script to enable sending."
        } else {
            # Note: Send-MailMessage is obsolete in newer PowerShell Core versions,
            # but remains fully supported and recommended for Windows PowerShell 5.1.
            Send-MailMessage @MailParams
            Write-Host "Email sent successfully to $RecipientEmail."
        }
    }
    catch {
        Write-Warning "Failed to send email to $RecipientEmail. Error: $_"
    }
}
`;

export default function IdentityTimelineReportPost() {
  const tocItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'dependencies-requirements', label: 'Dependencies & Infrastructure' },
    { id: 'user-interface-form', label: 'User Interface (Interactive Form)' },
    { id: 'back-end-workflow', label: 'Back End (Workflow)' },
    { id: 'powershell-script', label: 'PowerShell Script' },
    { id: 'execution-demo', label: 'Execution & Output Demo' },
    { id: 'considerations-best-practices', label: 'Considerations & Best Practices' },
    { id: 'conclusion', label: 'Conclusion' }
  ];

  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 sticky top-32 hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
          
          <article className="lg:col-span-3 glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-blue-400 transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-blue-400 transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Identity Timeline</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-amber-400">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>May 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Building a Custom Identity Timeline Report in ISC <br />
                <span className="text-amber-500 text-2xl md:text-3xl">(Unified lifecycle, audit events, access requests, and work items in a single view)</span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden p-[2px]">
                  <img src="/images/profile.jpg" alt="Tyler" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="text-white">Tyler</p>
                  <p>IdentityEXE Founder</p>
                </div>
              </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:text-blue-300 prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
              
              <h3 id="introduction" className="text-2xl text-white mt-8 mb-4">Introduction</h3>
              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Why:</strong> During audits, governance reviews, or troubleshooting security events, administrators frequently need a single, chronological timeline of everything that has occurred for a specific identity in Identity Security Cloud (ISC). Reconstructing this path manually requires querying multiple disjointed areas of the UI and APIs—such as search history, access request logs, provisioning tasks, and manual work items.</li>
                <li><strong className="text-white">Problem:</strong> There is no out-of-the-box UI report in ISC that combines core identity lifecycle states, audit events, account provisioning activity, access requests, and manual work items into a single, unified chronological timeline.</li>
                <li><strong className="text-white">Goal:</strong> Create a self-service utility for administrators to select any identity, filter by event categories, and receive a comprehensive, sorted timeline report directly in their email.</li>
              </ul>

              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
              <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
                <li><strong className="text-white">Tech Stack:</strong> 1 Form + 1 Workflow + 1 Privileged Task Automation (PAG/PTA) Gateway + 1 PowerShell Reporting Script.</li>
                <li><strong className="text-white">High-Level Flow:</strong>
                  <ol className="space-y-2 mt-2 list-decimal pl-5 text-slate-300">
                    <li>An administrator launches an <strong>Interactive Trigger</strong> workflow from the launchpad.</li>
                    <li>An <strong>Interactive Form</strong> displays, allowing them to select the target identity and the desired event categories to include.</li>
                    <li>The workflow retrieves the requester's email and passes the selections to a secure <strong>Windows Server</strong> on-premises.</li>
                    <li>Execution is brokered securely using SailPoint's <strong>PAG (Privileged Account Gateway) / PTA (Privileged Task Automation)</strong> connector.</li>
                    <li>The PowerShell script executes on the server, authenticates to ISC via a Personal Access Token (PAT), retrieves and consolidates the event history, exports it to a CSV file, and emails the file to the requester.</li>
                    <li>The administrator receives a confirmation notification directly in their launcher interface.</li>
                  </ol>
                </li>
              </ul>

              <h3 id="dependencies-requirements" className="text-2xl text-white mt-12 mb-4">Dependencies & Infrastructure Requirements</h3>
              <p className="text-slate-300 mb-6">
                Before setting up this solution, ensure you have the following components in place:
              </p>
              <ol className="space-y-3 text-slate-300 mb-8 list-decimal pl-5">
                <li><strong className="text-white">PAG / PTA Virtual Appliance:</strong> A deployed and configured SailPoint Privileged Account Gateway / Privileged Task Automation VA to bridge cloud workflows to on-premises scripting environments securely.</li>
                <li><strong className="text-white">Target Windows Server:</strong> A server configured with a PAG agent where your PowerShell script will be stored and executed (e.g. at <code>C:\\Scripts\\CustomIdentityReport.ps1</code>).</li>
                <li><strong className="text-white">SMTP Server:</strong> An active SMTP server (such as Purelymail, Office 365, or a local SMTP relay) allowing outbound mail to send the CSV reports.</li>
                <li><strong className="text-white">SailPoint PAT (Personal Access Token):</strong> A service account PAT with scopes to query search, access requests, and work items (<code>idn:sources:read</code> / <code>idn:sources:manage</code> or equivalent query permissions).</li>
              </ol>

              <h3 id="user-interface-form" className="text-2xl text-white mt-12 mb-4">User Interface (Interactive Form)</h3>
              <p className="text-slate-300 mb-4">
                We use an interactive form in ISC to capture administrator inputs.
              </p>
              <ul className="space-y-2 text-slate-300 mb-6 list-disc pl-5">
                <li><strong className="text-white">Identity Selector:</strong> A dropdown utilizing the internal <code>IDENTITY</code> data source to search and select the target identity.</li>
                <li><strong className="text-white">Report Type (Categories):</strong> A static multi-select list letting the administrator filter the report categories:
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li><code>Identity Lifecycle</code></li>
                    <li><code>Audit Event</code></li>
                    <li><code>Account Activity</code></li>
                    <li><code>Access Request</code></li>
                    <li><code>Manual Work Item</code></li>
                  </ul>
                </li>
              </ul>

              <p className="text-slate-300 mb-4">
                Below is a preview of the interactive form where administrators select the identity and the event categories to include.
              </p>
              
              <div className="my-10 flex flex-col items-center gap-6">
                {/* Launchpad Preview */}
                <div className="w-full max-w-2xl animate-none">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/identity-timeline-report/identity-timeline-launchpad.png" 
                      alt="Identity Report option in the Launcher Interface"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">1. Workflow Launcher Interface</span>
                  </div>
                </div>

                {/* Form Input Preview */}
                <div className="w-full max-w-2xl animate-none">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/identity-timeline-report/identity-timeline-form.png" 
                      alt="Interactive Form selection fields mockup"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">2. Interactive Form Selection Fields</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-blue-400 mt-8 mb-4">Form Definition Code</h4>
              <p className="text-slate-300 mb-4">
                Here is the form JSON payload configuration representing the form layout above:
              </p>
              
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-auto max-h-[400px] mb-8 border border-white/10">
                <pre className="text-sm text-blue-300 m-0"><code>{JSON.stringify(formData, null, 2)}</code></pre>
              </div>

              <h3 id="back-end-workflow" className="text-2xl text-white mt-12 mb-4">Back End (Workflow)</h3>
              <p className="text-slate-300 mb-6">
                The backend automation is built in ISC Workflows.
              </p>
              <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
                <li><strong className="text-white">Trigger (Interactive Form):</strong> Initiates when the launcher starts the process and captures form inputs.</li>
                <li><strong className="text-white">Get Identity:</strong> Resolves details of the user running the launcher to capture their email address.</li>
                <li><strong className="text-white">Define Variable:</strong> Sets context parameters, such as the ISC tenant name.</li>
                <li><strong className="text-white">Windows Server Action (PAG/PTA):</strong> Passes arguments to execution on your Windows server:
                  <ul className="list-circle pl-5 mt-2 space-y-1 animate-none">
                    <li><code>-IdentityId</code>: The selected identity's ID.</li>
                    <li><code>-Tenant</code>: The defined tenant name.</li>
                    <li><code>-Categories</code>: The JSON representation of report categories chosen in the form.</li>
                    <li><code>-RecipientEmail</code>: The requester's email address.</li>
                  </ul>
                </li>
                <li><strong className="text-white">Interactive Message:</strong> Re-engages the user in the browser to notify them of successful execution.</li>
              </ul>

              <h4 className="text-xl text-blue-400 mt-8 mb-4">Workflow Definition Code</h4>
              <p className="text-slate-300 mb-4">
                The JSON schema workflow below handles state parameters and forwards inputs to the PAG Windows Server action:
              </p>

              <div className="bg-[#0d1117] rounded-lg p-4 overflow-auto max-h-[400px] mb-8 border border-white/10">
                <pre className="text-sm text-blue-300 m-0"><code>{JSON.stringify(workflowData, null, 2)}</code></pre>
              </div>

              <h3 id="powershell-script" className="text-2xl text-white mt-12 mb-4">PowerShell Script</h3>
              <p className="text-slate-300 mb-6">
                The PowerShell script executes locally on the target Windows Server. It handles parameter normalization (including JSON string array formatting), authenticates to ISC, aggregates the events chronologically, formats the output, and emails the resulting CSV file back to the requester.
              </p>

              <div className="bg-[#0d1117] rounded-lg p-4 overflow-auto max-h-[400px] mb-10 border border-white/10">
                <pre className="text-sm text-blue-300 m-0"><code>{psScriptCode}</code></pre>
              </div>

              <h3 id="execution-demo" className="text-2xl text-white mt-12 mb-4">Execution & Output Demo</h3>
              <ul className="space-y-6 text-slate-300 mb-8 list-none pl-0">
                <li>
                  <strong className="text-white block mb-2">1. SailPoint Workflow Execution</strong>
                  <p className="mb-4">Below is a preview showing what a successful execution looks like in the SailPoint Workflow execution UI. You will see the trigger from the Interactive Form, resolving the identity data, calling the Windows Server PAG agent successfully, and sending the final confirmation message.</p>
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden max-w-2xl w-full p-4">
                      <img 
                        src="/images/blog/identity-timeline-report/identity-timeline-workflow.png" 
                        alt="Workflow Execution History UI in SailPoint ISC"
                        className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                      />
                    </div>
                    <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between max-w-2xl w-full">
                      <span className="text-slate-300 font-bold text-sm">Successful Workflow History</span>
                    </div>
                  </div>
                </li>
                <li>
                  <strong className="text-white block mb-2">2. Email Notification</strong>
                  <p className="mb-4">The requester receives an automated HTML email from the configured SMTP server detailing the requested report parameters and containing the generated timeline CSV report attachment.</p>
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden max-w-2xl w-full p-4">
                      <img 
                        src="/images/blog/identity-timeline-report/identity-timeline-email.png" 
                        alt="SMTP Generated Email Notification containing timeline metrics"
                        className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                      />
                    </div>
                    <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between max-w-2xl w-full">
                      <span className="text-slate-300 font-bold text-sm">HTML Email Output</span>
                    </div>
                  </div>
                </li>
              </ul>

              <h3 id="considerations-best-practices" className="text-2xl text-white mt-12 mb-4">Considerations & Best Practices</h3>
              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Permissions & Security:</strong> Running administrative scripts on local target servers via PAG/PTA must be carefully restricted. Ensure the workflow interactive launcher is only shared with authorized IAM administrators in ISC.</li>
                <li><strong className="text-white">SMTP Settings:</strong> Make sure the target Windows Server hosting the script has network firewall access to communicate with your SMTP server (e.g. on port 587 or 25).</li>
                <li><strong className="text-white">Workflows API Limits & Timeouts:</strong> If an identity has a massive amount of historical search records, the script handles page limits automatically using native PowerShell loops, keeping each query structured and compliant with API rate limits.</li>
              </ul>

              <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                By combining interactive forms, custom workflows, and secure Windows Server script execution via SailPoint PAG/PTA, you can provide administrators with a powerful, self-service chronological timeline utility for identity audit and troubleshooting.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                If you have comments, suggestions, or ideas for extending this script (e.g., adding certification history or role changes), feel free to post below!
              </p>

              {/* Downloads Grid */}
              <h3 className="text-2xl text-white mt-12 mb-6">Configuration Snippets & Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Form Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">1. Identity Selector (Form)</h4>
                    <p className="text-xs text-slate-400 mb-6">Interactive selection form capturing target identity and target event categories.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formData, null, 2))}`}
                    download="Form-SelectIdentity_final.json"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Form-SelectIdentity.json
                  </a>
                </div>

                {/* Workflow Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">2. Identity Report (Workflow)</h4>
                    <p className="text-xs text-slate-400 mb-6">Orchestration engine calling PAG task agent on the local Windows scripting environment.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowData, null, 2))}`}
                    download="Workflow-IdentityReport_final.json"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Workflow-IdentityReport.json
                  </a>
                </div>

                {/* Script Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">3. Aggregation Script (PowerShell)</h4>
                    <p className="text-xs text-slate-400 mb-6">PowerShell engine aggregating search history and emailing output CSV reports.</p>
                  </div>
                  <a 
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(psScriptCode)}`}
                    download="CustomIdentityReport.ps1"
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    CustomIdentityReport.ps1
                  </a>
                </div>
              </div>

              {/* Consultation / Talk to an Expert Block */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-950/40 to-purple-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl mt-12">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Need a custom reporting or governance dashboard?</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    Whether you are developing complex multi-source aggregations, automating task gateways, or deploying customized alert dashboards, custom expert support helps you deploy safely.
                  </p>
                </div>
                <a 
                  href="/contact" 
                  className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                >
                  Talk to an Expert
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
