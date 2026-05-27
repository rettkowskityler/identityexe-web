import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import form1Data from './Form-Governance_Group_Selector.json';
import form2Data from './Form-Select_Action_and_User.json';
import workflow1Data from './Workflow-Allow_Governance_Group_Owners_To_Manage_Groups.json';
import workflow2Data from './Workflow-Add_Governance_Group_Owners_Automatically_to_Role.json';

export default function DelegatedGovernanceGroupsPost() {
  const tocItems = [
    { id: 'problem-governance-bottleneck', label: 'The Problem: The Governance Group Bottleneck' },
    { id: 'architectural-overview-pipeline', label: 'Architectural Overview: The Two-Form Pipeline Pattern' },
    { id: 'implementation-step-by-step', label: 'Implementation Step-by-Step' },
    { id: 'key-considerations-boundaries', label: 'Key Considerations & Security Boundaries' },
    { id: 'configuration-json-snippets', label: 'Configuration JSON Snippets' },
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
              <span className="text-slate-400">Self-Service Groups</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-blue-400">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>May 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Self-Service Governance Group Management <br />
              <span className="text-blue-500 text-2xl md:text-3xl">(Securely Delegating Administration directly to Owners)</span>
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
            
            <h3 id="problem-governance-bottleneck" className="text-2xl text-white mt-8 mb-4">The Problem: The Governance Group Bottleneck</h3>
            <p className="text-slate-300 mb-6">
              If you manage a SailPoint Identity Security Cloud (ISC) environment, you’re likely familiar with the gap with managing governance groups natively. Idea Portal post <a href="https://ideas.sailpoint.com/ideas/GOV-I-1808" target="_blank" rel="noopener noreferrer">GOV-I-1808</a> goes into this lack of functionality with requests for a way so governance group owners can manage their own groups.
            </p>
            <p className="text-slate-300 mb-6">
              Currently, Governance Group owners lack the self-service capabilities to manage their own group memberships. When team churn occurs, a member is terminated or a new hire joins, the group owner has no native way to update the group. Instead, they are forced to submit a service request to the IT or Identity team. This creates unnecessary administrative overhead, delays access modifications, and turns identity engineers into bottlenecked ticket-takers.
            </p>
            <p className="text-slate-300 mb-8">
              Until a native feature is released, we need a solution. This post outlines a workaround leveraging <strong>ISC Forms</strong>, <strong>Workflows (with Interactive Triggers)</strong>, and the <strong>ISC APIs</strong> to securely delegate group administration directly to the owners.
            </p>

            <p className="text-slate-300 mb-4">
              Here is a look at the final self-service experience we are going to build:
            </p>
            
            <div className="my-10 flex flex-col items-center">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden max-w-md w-full p-4">
                <img 
                  src="/images/blog/delegated-governance-groups/governance-group-form.png" 
                  alt="Self-Service Governance Group management interactive form mockup"
                  className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between max-w-md w-full">
                <span className="text-slate-300 font-bold text-sm">Self-Service UI Mockup</span>
              </div>
            </div>

            <h3 id="architectural-overview-pipeline" className="text-2xl text-white mt-12 mb-4">Architectural Overview: The Two-Form Pipeline Pattern</h3>
            <p className="text-slate-300 mb-6">
              You might wonder: <em>Why not just use one form?</em> The technical challenge lies in dynamic filtering. A single ISC form cannot dynamically fetch and refresh a dropdown box based on a previous selection within the same active session. If an owner selects "Group A", we need to query the API to find the exact current members of "Group A" so the owner doesn't have to guess who to remove.
            </p>
            <p className="text-slate-300 mb-4">
              To solve this, we use a <strong>Multi-Form Pipeline</strong>:
            </p>
            <ol className="space-y-3 text-slate-300 mb-8 list-decimal pl-5">
              <li><strong className="text-white">Form 1 (Selection):</strong> Displays <em>only</em> the Governance Groups owned by the user interacting with the form.</li>
              <li><strong className="text-white">Workflow Intermission:</strong> Executes an API lookup (<code>GET /v2026/workgroups/{"{id}"}/members</code>) for the exact membership of the selected group.</li>
              <li><strong className="text-white">Form 2 (Action):</strong> Pipes that API response into a dynamic dropdown, allowing owners to selectively remove existing members or add new ones.</li>
            </ol>

            <h3 id="implementation-step-by-step" className="text-2xl text-white mt-12 mb-4">Implementation Step-by-Step</h3>

            <h4 className="text-xl text-blue-400 mt-6 mb-3">Phase A: Automated Launcher Access (Workflow 2)</h4>
            <p className="text-slate-300 mb-6">
              Before owners can use our self-service forms, they need access to the Workflow Launcher. We don't want admins manually provisioning this entitlement every time a new group is created or an owner changes.
            </p>
            <p className="text-slate-300 mb-4">
              We resolve this with a daily scheduled cron workflow that keeps roles synchronized:
            </p>
            <ol className="space-y-3 text-slate-300 mb-6 list-decimal pl-5">
              <li>It executes a <code>GET /v2026/workgroups</code> to pull all active governance groups.</li>
              <li>It evaluates the targeted Launcher Role's identity membership.</li>
              <li>It uses a JSON Patch (<code>POST /v2026/roles/{"{roleid}"}</code>) inside a loop to automatically attach group owners to the specific role containing the launcher permission.</li>
            </ol>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8 text-slate-300">
              <p className="font-bold text-white mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                A Quick Caveat on Workflow 2:
              </p>
              <p className="m-0">
                There is a known quirk with SailPoint's native JSON Patch operation for roles. The API allows the same identity to be appended to a role multiple times. While this won't break access, it creates a UI bug where the role's assigned headcount shows artificially high numbers. Because staying 100% native inside Workflows is usually the goal, this is the default solution. However, if that UI discrepancy bothers you, I've included an <strong>optional PowerShell script</strong> at the bottom of this post that handles deduplication before patching. Please see the bug report if you want further details - <a href="https://developer.sailpoint.com/discuss/t/role-identity-list-ui-bug-when-adding-members-from-api/210082" target="_blank" rel="noopener noreferrer">Bug Report</a>.
              </p>
            </div>

            <h4 className="text-xl text-blue-400 mt-12 mb-3">Phase B: Designing the User Interface (The Forms)</h4>
            <p className="text-slate-300 mb-6">
              Our UI relies on two distinct forms passed back and forth by the workflow.
            </p>

            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-8">
              <h5 className="text-lg text-white mb-3 font-bold">Form 1: Governance Group Selector</h5>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-6">
                <li><strong className="text-white">Input:</strong> A <code>governanceGroups</code> array dynamically populated by the main workflow.</li>
                <li><strong className="text-white">Configuration:</strong> A single-select interface pulling data directly from <code>FORM_INPUT</code>.</li>
              </ul>

              <h5 className="text-lg text-white mb-3 font-bold">Form 2: Select Action and User</h5>
              <ul className="list-disc pl-5 text-slate-300 space-y-2">
                <li><strong className="text-white">Inputs:</strong> An <code>action</code> dropdown (<code>ADD</code> or <code>REMOVE</code>).</li>
                <li><strong className="text-white">Dynamic Selectors:</strong>
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li>If <code>ADD</code> is selected, an Identity Picker (capped at 30 items) appears.</li>
                    <li>If <code>REMOVE</code> is selected, a dynamic selector populated by the <code>removeUsers</code> array (passed from the API fetch in the workflow) appears.</li>
                  </ul>
                </li>
                <li><strong className="text-white">Form Conditions:</strong> We use <code>SHOW</code> effects tied to the <code>action</code> dropdown so the user only sees the relevant selection box.</li>
              </ul>
            </div>

            <h4 className="text-xl text-blue-400 mt-12 mb-3">Phase C: Orchestrating the Engine (Workflow 1)</h4>
            <p className="text-slate-300 mb-6">
              This is the core engine, triggered by an Interactive Process Launcher (<code>idn:interactive-process-launched</code>).
            </p>
            <ol className="space-y-3 text-slate-300 mb-8 list-decimal pl-5">
              <li>
                <strong className="text-white">Strict Authorization API Call:</strong> We execute <code>GET /v2026/workgroups</code>. The absolute most critical part of this step is the JSONPath filter applied when passing this data to Form 1:<br />
                <code className="block bg-slate-900/50 p-2 rounded border border-white/5 my-2 text-xs font-mono break-all">$.hTTPRequest.body[?(@.owner.id == '{"{{$.trigger.launchedBy.id}}"}')]</code>
                <em className="text-slate-400">This ensures the owner can ONLY see and manage groups they own, establishing a hard security boundary.</em>
              </li>
              <li><strong className="text-white">Display Form 1:</strong> The user selects their Governance Group.</li>
              <li><strong className="text-white">Fetch Members:</strong> We take the ID from Form 1 and run <code>GET /v2026/workgroups/{"{{$.interactiveForm.formData.governanceGroup}}"}/members</code>.</li>
              <li><strong className="text-white">Display Form 2:</strong> We pass the members into Form 2, allowing the user to select their action and target identities.</li>
              <li>
                <strong className="text-white">Branching Execution:</strong> A <code>Compare Strings</code> step checks the action:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>If ADD:</strong> Loop through the selected users and invoke <code>POST /v2026/workgroups/{"{id}"}/members/bulk-add</code>.</li>
                  <li><strong>If REMOVE:</strong> Loop through the selected users and invoke <code>POST /v2026/workgroups/{"{id}"}/members/bulk-delete</code>.</li>
                </ul>
              </li>
            </ol>

            <h3 id="key-considerations-boundaries" className="text-2xl text-white mt-12 mb-4">Key Considerations & Security Boundaries</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">API Calls:</strong> We deliberately use <code>/v2026/workgroups</code> and <code>/v2026/roles</code> to leverage the bulk modifications and complex role management.</li>
              <li><strong className="text-white">Scalability:</strong> Ensure your form's maximum item limits (e.g., 30 identities for bulk add/remove) align with your workgroup sizes. If you go outside this boundary, the form will not be able to handle it in one submission, and multiple submissions will be required.</li>
              <li><strong className="text-white">Tenant-Specific Variables:</strong> When importing the JSON files below, remember to update the Base URLs &amp; Role IDs (replace <code>TENANT</code> &amp; <code>ROLEID</code> with your tenant URL and Role ID).</li>
            </ul>

            <h3 id="configuration-json-snippets" className="text-2xl text-white mt-12 mb-4">Configuration JSON Snippets</h3>
            <p className="text-slate-300 mb-8">
              You can import these directly into your tenant. <em>Note: Please update the tenant URLs and Role IDs to match your environment.</em>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Card 1 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">1. Governance Group Selector (Form 1)</h4>
                  <p className="text-xs text-slate-400 mb-6">Select form definition to dynamically list owned groups based on launcher.</p>
                </div>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(form1Data, null, 2))}`}
                  download="Form-Governance_Group_Selector.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Form-Governance_Group_Selector.json
                </a>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">2. Select Action and User (Form 2)</h4>
                  <p className="text-xs text-slate-400 mb-6">Action selector (ADD/REMOVE) and dynamic identities picker logic.</p>
                </div>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(form2Data, null, 2))}`}
                  download="Form-Select_Action_and_User.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Form-Select_Action_and_User.json
                </a>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">3. Workflow For Managing Workgroups (Workflow 1)</h4>
                  <p className="text-xs text-slate-400 mb-6">The core engine managing dynamic pipeline state and API patches.</p>
                </div>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflow1Data, null, 2))}`}
                  download="Workflow-Allow_Governance_Group_Owners_To_Manage_Groups.json"
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Workflow-Allow_Governance_Groups.json
                </a>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">4. Workflow For Syncing Role (Workflow 2)</h4>
                  <p className="text-xs text-slate-400 mb-6">Scheduled sync matching workgroup owners to workflow launcher access role.</p>
                </div>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflow2Data, null, 2))}`}
                  download="Workflow-Add_Governance_Group_Owners_Automatically_to_Role.json"
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Workflow-Add_Owners_to_Role.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-blue-400 mt-12 mb-3">5. (OPTIONAL) PowerShell Script For Adding Workgroup Owners To Role</h4>
            <p className="text-slate-300 mb-4">
              As mentioned in Phase A, the native Workflow 2 will successfully manage access, but the SailPoint API's lack of deduplication on JSON patches means a user added 5 times will artificially inflate the role's member count by 5 in the UI.
            </p>
            <p className="text-slate-300 mb-6">
              If keeping your role metrics perfectly clean is a priority, you can bypass Workflow 2 entirely and run this PowerShell script on a schedule instead. It fetches the existing role members first, compares them against the workgroup owners, and only patches in the true net-new identities.
            </p>

            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-10 border border-white/10">
              <pre className="text-sm text-blue-300 m-0"><code>{`$clientId     = "ENTERYOURCLIENTIDHERE"
$clientSecret = "ENTERYOURCLIENTSECRETHERE"
$tenantName   = "ENTERYOURTENANTNAMEHERE"
$baseUrl      = "https://$tenantName.api.identitynow.com"
$targetRoleId = "ENTERYOURROLEIDHERE"

$tokenBody = @{
    grant_type    = "client_credentials"
    client_id     = $clientId
    client_secret = $clientSecret
}

try {
    $tokenResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/oauth/token" -Body $tokenBody
    $accessToken = $tokenResponse.access_token
} catch {
    Write-Error "Failed to authenticate with SailPoint ISC: $($_.Exception.Message)"
    exit
}

$getHeaders = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type"  = "application/json"
}

$patchHeaders = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type"  = "application/json-patch+json"
}

Write-Host "Fetching Workgroups..."
$allWorkgroups = @()
$limit = 250
$offset = 0
$totalCount = 0

do {
    $uri = "$baseUrl/v2026/workgroups?limit=$limit&offset=$offset&count=true"
    $response = Invoke-WebRequest -Method Get -Uri $uri -Headers $getHeaders
    
    if ($offset -eq 0) {
        # Safely handle header arrays (fixes the [int] cast issue)
        $headerValue = $response.Headers["X-Total-Count"]
        $totalCount = [int]($headerValue -join "")
        Write-Host "Total Workgroups found: $totalCount"
    }
    
    $workgroups = $response.Content | ConvertFrom-Json
    $allWorkgroups += $workgroups
    $offset += $limit
    
} while ($offset -lt $totalCount)

# Extract unique owner IDs, filtering out any workgroups that might have a null owner
$workgroupOwnerIds = $allWorkgroups | 
    Where-Object { $null -ne $_.owner -and $null -ne $_.owner.id } | 
    Select-Object -ExpandProperty owner | 
    Select-Object -ExpandProperty id | 
    Select-Object -Unique

Write-Host "Found $($workgroupOwnerIds.Count) unique workgroup owners."

Write-Host "Fetching Target Role ($targetRoleId)..."
try {
    $roleUri = "$baseUrl/v2026/roles/$targetRoleId"
    $roleResponse = Invoke-RestMethod -Method Get -Uri $roleUri -Headers $getHeaders
} catch {
    Write-Error "Failed to fetch Role $targetRoleId $($_.Exception.Message)"
    exit
}

# Extract existing identities to prevent duplicate additions (UI Bug fix)
$existingIdentityIds = @()
if ($null -ne $roleResponse.membership -and $null -ne $roleResponse.membership.identities) {
    $existingIdentityIds = $roleResponse.membership.identities | Select-Object -ExpandProperty id
}

Write-Host "Role currently has $($existingIdentityIds.Count) identities."

# Filter down to only the owners who are NOT already in the role
$ownersToAdd = $workgroupOwnerIds | Where-Object { $_ -notin $existingIdentityIds }

if ($ownersToAdd.Count -gt 0) {
    Write-Host "Adding $($ownersToAdd.Count) new owners to the role..."
    
    $patchBody = @()
    
    # If the role has completely empty membership, initialize it.
    # Otherwise, append to the existing array.
    if ($null -eq $roleResponse.membership -or $null -eq $roleResponse.membership.identities) {
        $identitiesArray = @()
        foreach ($ownerId in $ownersToAdd) {
            $identitiesArray += @{ id = $ownerId; type = "IDENTITY" }
        }
        $patchBody += @{
            op = "add"
            path = "/membership"
            value = @{
                type = "IDENTITY_LIST"
                identities = $identitiesArray
            }
        }
    } else {
        foreach ($ownerId in $ownersToAdd) {
            $patchBody += @{
                op = "add"
                path = "/membership/identities/-"
                value = @{
                    id = $ownerId
                    type = "IDENTITY"
                }
            }
        }
    }
    
    # -InputObject prevents array unrolling for single items
    # We still wrap in a string check just to guarantee [ ] brackets are present for the patch requirement
    $jsonPatchBody = ConvertTo-Json -InputObject @($patchBody) -Depth 5
    if (-not $jsonPatchBody.TrimStart().StartsWith("[")) {
        $jsonPatchBody = "[$jsonPatchBody]"
    }
    
    try {
        $patchResponse = Invoke-RestMethod -Method Patch -Uri $roleUri -Headers $patchHeaders -Body $jsonPatchBody
        Write-Host "Success! Added $($ownersToAdd.Count) identities to Role $targetRoleId."
    } catch {
        Write-Error "Failed to patch Role: $($_.Exception.Message)"
        if ($_.ErrorDetails) {
            Write-Error $_.ErrorDetails.Message
        }
    }
} else {
    Write-Host "No new workgroup owners to add. All owners are already members of the role."
}`}</code></pre>
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                This multi-form pipeline effectively solves an immediate operational gap using standard, native tools—no external middleware required. It empowers governance owners, tightens up access modification timelines, and frees up your identity engineering team from routine ticket management.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                If this is a pain point for your organization, I highly encourage you to cast your vote on <a href="https://ideas.sailpoint.com/ideas/GOV-I-1808" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-medium">GOV-I-1808</a> to help push a native solution to the roadmap. In the meantime, deploy this workflow and take back your time!
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-950/40 to-purple-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Need a custom delegated administration solution?</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    Whether you are building complex multi-form logic, dynamic workgroup aggregations, or customized access request engines, direct advisory can help you deploy quickly and securely.
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

          </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
