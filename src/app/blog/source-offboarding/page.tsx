import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formSourceOffboardingData from './Form-Source-Offboarding.json';
import formConfirmSelectionData from './Form-Confirm-Source-Selection.json';
import workflowData from './Workflow-SourceOffboarding.json';

export default function SourceOffboardingPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'technical-deep-dive', label: 'Technical Deep Dive' },
    { id: 'implementation-framework', label: 'Implementation Framework' },
    { id: 'conclusion', label: 'Conclusion' }
  ];

  return (
    <>
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 sticky top-32 hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
          
          <article className="lg:col-span-3 min-w-0 w-full overflow-hidden glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 animate-fade-in-up">
            
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-brand-accent transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-brand-accent transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Source Offboarding</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>August 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Automating Source Offboarding in Identity Security Cloud <br />
                <span className="text-brand-blue text-2xl md:text-3xl">(Architectural Implementation Framework)</span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden p-[2px]">
                  <img src="/images/profile.jpg" alt="Tyler" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="text-white">Tyler</p>
                  <p>IdentityEXE Founder</p>
                </div>
              </div>
            </header>

            <div className="prose prose-invert break-words w-full overflow-x-hidden prose-pre:max-w-[85vw] sm:prose-pre:max-w-full prose-pre:overflow-x-auto prose-img:max-w-full prose-img:h-auto prose-base md:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-accent hover:prose-a:text-brand-light prose-code:text-brand-light prose-code:bg-brand-blue/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
              
              <h3 id="executive-summary" className="text-2xl text-white !mt-0 mb-4">Executive Summary</h3>
              <p className="text-slate-300 mb-4">
                Safely offboarding and deleting a Source in SailPoint Identity Security Cloud is one of the most tedious and potentially dangerous administrative tasks. Native platform constraints prevent source deletion until all downstream dependencies, such as Access Profiles, Apps, Service Desk Integrations, and Identity Profiles, are systematically dismantled, creating massive operational friction.
              </p>
              <p className="text-slate-300 mb-4">
                Leaving this architectural limitation unsolved forces administrators into hours of manual clicking, leading directly to a higher risk of catastrophic breaking changes. If a source tied to critical identity generation is accidentally wiped without careful validation, organizations face failed compliance audits, severe deployment lag, security vulnerabilities due to orphaned access, and devastating provisioning failures caused by "ghost" accounts triggering unexpected manager approval fatigue.
              </p>
              <p className="text-slate-300 mb-8">
                IdentityEXE designed a repeatable architectural methodology to orchestrate this entire offboarding sequence securely. Rather than relying on simple scripts, this modular framework utilizes a self-serve automated toolkit through SailPoint Workflows and Privileged Task Automation (PTA) to provide fail-safe, multi-threaded source deletion while comprehensively analyzing downstream dependencies.
              </p>

              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Tech Stack:</strong> 2 Forms + 1 Workflow + 1 Privileged Task Automation (PTA) Script.</li>
                <li><strong className="text-white">High-Level Flow:</strong> The solution revolves around an interactive Workflow Form that allows administrators to select a source and optionally run it in a dry-run state.
                  <ul className="list-circle pl-5 mt-2 space-y-2">
                    <li><strong className="text-white">Preview Mode:</strong> A fail-safe toggle that executes all archival and dependency checks, sending the backup zip to the admin, but merely logging what downstream dependencies would be dismantled without actually destroying data.</li>
                    <li><strong className="text-white">Live Deletion:</strong> Forcefully wipes the source data, tears down all related access profiles, apps, and SDIM integrations, and ultimately deletes the source object from the tenant.</li>
                  </ul>
                </li>
              </ul>
              
              <div className="bg-[#0d1117] border border-orange-500/30 border-l-4 border-l-orange-500 rounded-r-xl p-4 mb-8">
                <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Security Requirements
                </h4>
                <p className="text-sm text-slate-300 mb-0">
                  Before implementing this solution, ensure your environment has a functional Privileged Access Gateway (PAG) connected to your tenant with permission to run local scripts, an active SMTP server configured for outbound emails with zip attachments, and a SailPoint Personal Access Token (PAT) with ORG_ADMIN access. The provided PowerShell template contains placeholder variables; <strong>you must encrypt these credentials</strong> using a secure storage mechanism before deploying into production.
                </p>
              </div>

              <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: User Interface</h3>
              <p className="text-slate-300 mb-4">
                When we architect this solution for our enterprise clients, we utilize a highly governed launcher experience. The admin initiates the workflow via a launcher, selects the source from a dynamic dropdown, reviews the automated sequence overview, and chooses whether to run a preview or perform the live deletion.
              </p>

              <div className="my-8">
                <strong className="text-white block mb-4 text-lg">Preview Mode Execution:</strong>
                <div className="flex flex-col gap-6 items-center">
                  <div className="w-full max-w-4xl flex justify-center overflow-hidden rounded-xl">
                    <img src="/images/SourceOffbording_Form_Execution_Preview_1.png" alt="Form Preview 1" className="w-full h-auto object-contain" />
                  </div>
                  <div className="w-full max-w-4xl flex justify-center overflow-hidden rounded-xl">
                    <img src="/images/SourceOffbording_Form_Execution_Preview_2.png" alt="Form Preview 2" className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              <div className="my-8">
                <strong className="text-white block mb-4 text-lg">Full Deletion Execution:</strong>
                <div className="flex flex-col gap-6 items-center">
                  <div className="w-full max-w-4xl flex justify-center overflow-hidden rounded-xl">
                    <img src="/images/SourceOffbording_Form_Execution_FullDeletion_1.png" alt="Form Full Deletion 1" className="w-full h-auto object-contain" />
                  </div>
                  <div className="w-full max-w-4xl flex justify-center overflow-hidden rounded-xl">
                    <img src="/images/SourceOffbording_Form_Execution_FullDeletion_2.png" alt="Form Full Deletion 2" className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              <h3 id="technical-deep-dive" className="text-2xl text-white mt-12 mb-4">Technical Deep Dive: The PowerShell Engine</h3>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the data layer to handle the complexities of SailPoint's backend APIs effortlessly. The script (<code>Offboard-Source.ps1</code>) executed via PTA contains several advanced mechanisms.
              </p>

              <h4 className="text-xl text-white mt-8 mb-3">Multithreaded Data Fetching</h4>
              <p className="text-slate-300 mb-4">
                Iterating through tens of thousands of accounts and entitlements sequentially is agonizingly slow. This modular framework ensures that your ISC deployment avoids massive wait times by utilizing a custom <code>Get-IscPaginatedDataParallel</code> function that batches parallel <code>Invoke-RestMethod</code> calls using PowerShell Runspace Pools, drastically reducing backup generation time.
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-8 overflow-x-auto text-sm"><code className="language-powershell">{`$RunspacePool = [runspacefactory]::CreateRunspacePool(1, 10)
$RunspacePool.Open()
$Jobs = @()

for ($i = 0; $i -lt $pages; $i++) {
    $offset = $i * $limit
    $pageUrl = "$BaseUrl$Endpoint?limit=$limit&offset=$offset"

    $ScriptBlock = {
        param($url, $headers)
        return Invoke-RestMethod -Uri $url -Method GET -Headers $headers
    }

    $PowerShell = [powershell]::Create().AddScript($ScriptBlock).AddArgument($pageUrl).AddArgument($GlobalHeaders)
    $PowerShell.RunspacePool = $RunspacePool
    
    $Jobs += [PSCustomObject]@{
        Pipe   = $PowerShell
        Status = $PowerShell.BeginInvoke()
    }
}`}</code></pre>

              <h4 className="text-xl text-white mt-8 mb-3">Intelligent Account Wiping & Bug Prevention</h4>
              <p className="text-slate-300 mb-4">
                Why do we meticulously wipe accounts before deleting the source? It's to prevent a known ISC bug where deleted sources leave behind "ghost" accounts. If unsevered, these accounts suddenly reappear during Lifecycle State (LCS) events, throwing hard-to-diagnose provisioning failures. Our polling loop accounts for Identity Tasks and surgical ID removals before retrying bulk wipes.
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-8 overflow-x-auto text-sm"><code className="language-powershell">{`if ($statusCode -eq 400) {
    if ($messageText -match "Identity Tasks are in progress") {
        Write-Log "Tasks active. Polling in 15 seconds..."
        Start-Sleep -Seconds 15
        continue
    }
    
    # Parse the server message to extract account IDs blocking deletion
    $matches = [regex]::Matches($messageText, '\\b[a-fA-F0-9]{32}\\b')
    $badAccountIds = @($matches | ForEach-Object { $_.Value })
    
    foreach ($accountId in $badAccountIds) {
        $url = "$BaseUrl/accounts/v1/$accountId/remove"
        # Surgical removal with rate limit (429) retries
        Invoke-RestMethod -Uri $url -Method POST -Headers $GlobalHeaders
    }
}`}</code></pre>

              <h4 className="text-xl text-white mt-8 mb-3">Deep Service Desk (SDIM) Cleansing</h4>
              <p className="text-slate-300 mb-4">
                To fully destroy a source, it must be untethered from SDIM systems. The script recursively searches the SDIM configuration JSON to find and cleanly remove the source ID mappings from parallel array attributes (like <code>catalogItem</code> or <code>assignmentGroup</code>) to prevent validation mismatches.
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-8 overflow-x-auto text-sm"><code className="language-powershell">{`function Remove-SdimSourceMap {
    param ($Object, $TargetSourceId)
    if ($Object -is [System.Management.Automation.PSCustomObject] -or $Object -is [System.Collections.IDictionary]) {
        # If this object contains a key that perfectly matches our Source ID, delete the key
        if ($Object.PSObject.Properties.Match($TargetSourceId).Count -gt 0) {
            $Object.PSObject.Properties.Remove($TargetSourceId)
        }
        # Recursively search all child objects (e.g., serviceRequest.provision.catalogItem)
        foreach ($prop in @($Object.PSObject.Properties)) {
            Remove-SdimSourceMap -Object $prop.Value -TargetSourceId $TargetSourceId
        }
    }
}`}</code></pre>

              <div className="my-10">
                <h4 className="text-xl text-white mb-4">Automated Archival Emails</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-300 font-bold text-sm block mb-2">Preview Output:</span>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/SourceOffbording_EmailExample_Preview.png" alt="Preview Email" className="w-full h-auto" />
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-300 font-bold text-sm block mb-2">Deletion Output:</span>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/SourceOffbording_EmailExample_FullDeletion.png" alt="Full Deletion Email" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </div>

              <h3 id="implementation-framework" className="text-2xl text-white mt-12 mb-4">Implementation Framework</h3>
              <p className="text-slate-300 mb-8">
                Below are the workflow diagrams and implementation files for deployment into your environment. You will need a configured PAG instance and valid SMTP credentials.
              </p>
              
              <h4 className="text-xl text-white mt-10 mb-4">1. Main Workflow</h4>
              <div className="my-6">
                <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                  <img src="/images/SourceOffboarding20260815.png" alt="Main Workflow" className="max-w-full h-auto object-contain shadow-2xl" />
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowData, null, 2))}`}
                    download="Workflow-SourceOffboarding.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Manager Workflow
                  </a>
                </div>
              </div>

              <h4 className="text-xl text-white mt-10 mb-4">2. Forms and Scripts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Form-Source-Offboarding.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formSourceOffboardingData, null, 2))}`}
                    download="Form-Source-Offboarding.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Form-Confirm-Source-Selection.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formConfirmSelectionData, null, 2))}`}
                    download="Form-Confirm-Source-Selection.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between md:col-span-2">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Offboard-Source.ps1</span>
                  <a 
                    href="/scripts/Offboard-Source.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  By utilizing this architectural solution, organizations can confidently decommission stale systems, generate compliant backup archives, and save countless hours of manual effort—all while ensuring zero catastrophic breaking changes to identity generation.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex source-offboarding integrations, stop guessing.
                    </p>
                  </div>
                  <a 
                    href="/contact" 
                    className="group inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-accent text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(81,132,196,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                  >
                    Book Your SailPoint Architecture Review
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
