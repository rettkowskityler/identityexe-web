import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formSelectIdentityPatData from './Form-Select-Identity-PAT.json';
import formSelectWorkflowIdentityPatData from './Form-Select-Workflow-Identity-PAT.json';
import workflowPatAnalyzerData from './WorkflowPATAnalyzer.json';

export default function WorkflowScopeAnalyzerPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'prerequisites-setup', label: 'Prerequisites & Setup' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'technical-deep-dive', label: 'Technical Deep Dive' },
    { id: 'backend-engine', label: 'The Backend Engine' },
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
              <span className="text-slate-400">Workflow Scope Analyzer</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>August 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Automating Least Privilege: The Workflow Scope Analyzer <br />
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
                Determining the exact least-privileged scopes for complex HTTP requests within SailPoint Workflows is a notoriously tedious endeavor. Administrators are often forced to sift through extensive API documentation to pinpoint the exact endpoints needed for their operations. This architectural friction leads to a dangerous shortcut: assigning the overly permissive <code>sp:scopes:all</code> scope to ensure workflows execute without failure.
              </p>
              <p className="text-slate-300 mb-4">
                Leaving this underlying problem unsolved introduces profound commercial and operational risks. Over-provisioned Personal Access Tokens (PATs) violate the fundamental principle of least privilege, opening the door for severe security vulnerabilities. An improperly scoped token can lead to failed compliance audits, widespread data exposure, and unauthorized actions within your identity ecosystem if a workflow is ever compromised or misconfigured.
              </p>
              <p className="text-slate-300 mb-8">
                IdentityEXE has designed a repeatable architectural methodology to eliminate this vulnerability. By deploying a comprehensive, self-service automated toolkit, we replace the guesswork with precision engineering. This modular framework dynamically analyzes workflows, cross-references all HTTP request endpoints against SailPoint's official OpenAPI specifications, and automatically enforces the precise scopes required—locking down your environment with zero administrative friction.
              </p>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-12 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    Try the Web Tool Instead!
                  </h4>
                  <p className="text-slate-300 mb-4 text-sm max-w-2xl">
                    Don't want to deploy this workflow into your tenant? We've extracted the core logic into a completely free, browser-based tool right here on our site. You can paste your workflow JSON and instantly generate the required scopes without downloading anything.
                  </p>
                  <a href="/tools/workflow-scope-analyzer" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-5 py-2.5 rounded-lg transition-colors text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    Go to the Workflow Scope Analyzer Tool
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>
              </div>

              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">What it is:</strong> A self-service SailPoint Workflow toolkit that analyzes other workflows, cross-references all <code>sp:http</code> request endpoints against SailPoint's official OpenAPI specifications, and dynamically calculates the precise list of scopes needed. It even includes the ability to automatically update the PAT.</li>
                <li><strong className="text-white">Tech Stack:</strong> 1 Native Workflow + 2 Interactive Forms + 2 PowerShell Scripts (via PAG).</li>
                <li><strong className="text-white">The Flow:</strong> Administrators launch a workflow via an Interactive Form, select a target workflow to analyze, and optionally provide a PAT ID. The workflow triggers a backend PowerShell script via the Privileged Action Gateway (PAG), which parses the target workflow's endpoints and resolves the required OAuth scopes using a compiled mapping file.</li>
                <li><strong className="text-white">The Underlying Engine:</strong> To ensure the solution stays up to date, a vital secondary sync script (<code>Update-ScopesMap.ps1</code>) is provided to automatically download the absolute latest OpenAPI YAML specs directly from SailPoint's GitHub repository and generate the underlying mapping file that drives the analyzer.</li>
              </ul>
              
              <h3 id="prerequisites-setup" className="text-2xl text-white mt-12 mb-4">Prerequisites & Setup</h3>
              <p className="text-slate-300 mb-4">
                Before deploying this methodology, there are a few prerequisites you'll need to configure:
              </p>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Privileged Action Gateway (PAG):</strong> You must have a Windows server with the PAG enabled where the PowerShell scripts can execute.</li>
                <li><strong className="text-white">OAuth Client Credentials:</strong> The script requires an OAuth Client ID and Secret with appropriate permissions to query the API and update PATs.</li>
                <li><strong className="text-white">Script Configuration:</strong> Deploy the <code>Update-WorkflowPatScopes.ps1</code> and <code>scopes_map.json</code> files to your PAG host.</li>
              </ul>

              <div className="bg-[#0d1117] border border-orange-500/30 border-l-4 border-l-orange-500 rounded-r-xl p-4 mb-8">
                <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  CAUTION
                </h4>
                <p className="text-sm text-slate-300 mb-0">
                  The provided PowerShell scripts contain placeholder credentials (<code>$ClientId</code>, <code>$ClientSecret</code>, and <code>$TenantName</code>). You MUST update these hardcoded variables with your own organization's credentials before running the scripts.
                </p>
              </div>

              <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: User Interface</h3>
              <p className="text-slate-300 mb-4">
                When we architect this solution for our enterprise clients, we utilize interactive forms that feed native dashboard-like reporting. The process starts with a self-service form where the admin selects the workflow to analyze and toggles automatic PAT updates. Once analysis completes, the script returns a formatted HTML table directly back to the UI as an Interactive Message, detailing every endpoint and its exact required scopes.
              </p>

              <div className="my-8">
                <strong className="text-white block mb-4 text-lg">Analysis Summary (No Update):</strong>
                <div className="flex justify-center overflow-hidden rounded-xl border border-white/10">
                  <img src="/images/FormScreenshot_NoUpdate.png" alt="Form No Update" className="max-w-full h-auto object-contain shadow-2xl" />
                </div>
              </div>

              <div className="my-8">
                <strong className="text-white block mb-4 text-lg">Automated Scope Updating:</strong>
                <div className="flex justify-center overflow-hidden rounded-xl border border-white/10">
                  <img src="/images/FormScreenshot_Update.png" alt="Form Update" className="max-w-full h-auto object-contain shadow-2xl" />
                </div>
              </div>

              <div className="my-8">
                <strong className="text-white block mb-4 text-lg">Zero HTTP Requests Scenario:</strong>
                <div className="flex justify-center overflow-hidden rounded-xl border border-white/10">
                  <img src="/images/FormScreenshot_NoHTTPRequestsFound.png" alt="No HTTP Requests" className="max-w-full h-auto object-contain shadow-2xl" />
                </div>
              </div>
              
              <div className="my-8">
                <strong className="text-white block mb-4 text-lg">Workflow PAT Analyzer Example:</strong>
                <div className="flex justify-center overflow-hidden rounded-xl border border-white/10">
                  <img src="/images/WorkflowPATAnalyzer.png" alt="Workflow PAT Analyzer Example" className="max-w-full h-auto object-contain shadow-2xl" />
                </div>
              </div>

              <h3 id="technical-deep-dive" className="text-2xl text-white mt-12 mb-4">Technical Deep Dive: The Analyzer Engine</h3>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the data layer to intelligently traverse deeply nested workflow definitions and normalize dynamic payload variables seamlessly.
              </p>

              <h4 className="text-xl text-white mt-8 mb-3">Deep Endpoint Resolution</h4>
              <p className="text-slate-300 mb-4">
                The tools parse through nested workflow logic and normalize dynamic placeholders (like <code>{`{tenant}`}</code> or <code>$.interactiveForm.formData</code>) to successfully match raw workflow URLs against the official OpenAPI specifications.
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-8 overflow-x-auto text-sm"><code className="language-powershell">{`if ($StepData.actionId -eq "sp:http") {
    $HasHttpActions = $true
    $Method = if ($StepData.attributes.method) { $StepData.attributes.method.ToUpper() } else { "GET" }
    
    # Normalize the dynamic workflow variables out of the URL
    $Url = $StepData.attributes.url -replace '\\{\\{?[^}]+\\}?\\}', 'placeholder'
    $Url = $Url -replace '<[^>]+>', 'placeholder'
    $Url = $Url -replace '\\$\\.[a-zA-Z0-9_\\.]+', 'placeholder'
}`}</code></pre>

              <h4 className="text-xl text-white mt-8 mb-3">Edge-Case Handling & Custom Form UI</h4>
              <p className="text-slate-300 mb-4">
                This modular framework ensures that your ISC deployment avoids runtime failures by handling workflows with zero HTTP endpoints gracefully. Furthermore, it leverages SailPoint's ability to render raw HTML/CSS inside Interactive Message form blocks, building aesthetic payload summaries directly in PowerShell.
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-8 overflow-x-auto text-sm"><code className="language-powershell">{`$HtmlBuilder = [System.Text.StringBuilder]::new()
$null = $HtmlBuilder.Append("<table style='width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #cfd8dc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); font-family: sans-serif; margin-bottom: 12px;'>")
$null = $HtmlBuilder.Append("<tr><th style='padding: 12px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 13px; color: #1e293b;'>Endpoint</th><th style='padding: 12px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 13px; color: #1e293b;'>Required Scopes</th></tr>")

foreach ($Ep in $EndpointScopes) {
    $ScopesHtml = ""
    foreach ($S in $Ep.Scopes) {
        # Style the scopes to look like pills/tags
        $ScopesHtml += "<span style='background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-right: 4px; display: inline-block; margin-bottom: 4px;'>$S</span>"
    }
    # ... Rest of table row logic ...
}`}</code></pre>

              <h3 id="backend-engine" className="text-2xl text-white mt-12 mb-4">The Backend Engine: Fully Integrated OpenAPI Mapping</h3>
              <p className="text-slate-300 mb-4">
                The underlying engine runs on a custom-generated map (<code>scopes_map.json</code>) compiled directly from SailPoint's GitHub repository. It maps v3, beta, yearly releases (v2024, v2025, v2026), and the newest root microservice definitions.
              </p>
              <p className="text-slate-300 mb-6">
                To guarantee future-proofing, the provided <code>Update-ScopesMap.ps1</code> uses native <code>Invoke-WebRequest</code> commands to reach directly into the <code>sailpoint-oss/api-specs</code> GitHub repository. It downloads the absolute latest OpenAPI YAML specs and instantly regenerates the <code>scopes_map.json</code> locally.
              </p>
              
              <div className="bg-[#0d1117] border border-blue-500/30 border-l-4 border-l-blue-500 rounded-r-xl p-4 mb-8">
                <h4 className="text-blue-500 font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Local Bulk Analysis
                </h4>
                <p className="text-sm text-slate-300 mb-2">
                  The script is built to be flexible. If you want to scan an export of your workflows locally, pass a local file path using the <code>-WorkflowPath</code> and <code>-SkipUpdate</code> parameters:
                </p>
                <code className="text-xs bg-black/50 p-2 rounded block text-brand-light">.\Update-WorkflowPatScopes.ps1 -WorkflowPath "C:\Exports\MyWorkflow.json" -SkipUpdate</code>
              </div>

              <h3 id="implementation-framework" className="text-2xl text-white mt-12 mb-4">Implementation Framework</h3>
              <p className="text-slate-300 mb-8">
                Below are the workflow definitions, forms, and scripts for deployment into your environment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">WorkflowPATAnalyzer.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowPatAnalyzerData, null, 2))}`}
                    download="WorkflowPATAnalyzer.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Form-Select-Identity-PAT.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formSelectIdentityPatData, null, 2))}`}
                    download="Form-Select-Identity-PAT.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Form-Select-Workflow-Identity-PAT.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formSelectWorkflowIdentityPatData, null, 2))}`}
                    download="Form-Select-Workflow-Identity-PAT.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between md:col-span-2">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Update-WorkflowPatScopes.ps1</span>
                  <a 
                    href="/scripts/Update-WorkflowPatScopes.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between md:col-span-2">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Update-ScopesMap.ps1</span>
                  <a 
                    href="/scripts/Update-ScopesMap.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between md:col-span-2">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">scopes_map.json</span>
                  <a 
                    href="/scripts/scopes_map.json"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download JSON Map
                  </a>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Deploying the Workflow Scope Analyzer empowers organizations to firmly enforce least privilege securely across all automated SailPoint processes, removing the security risks associated with over-provisioned access tokens.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex workflow scope integrations, stop guessing.
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
