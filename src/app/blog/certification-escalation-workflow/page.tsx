import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formCampaignSelector from './Form-CertificationCampaignSelector.json';
import formConfirmSelection from './Form-ConfirmCampaignSelection.json';
import workflowSelection from './Workflow-CertificationSelectionForEscalation.json';
import workflowEscalator from './Workflow-CertificationEscalator.json';

export default function CertificationEscalationWorkflowPost() {
  const tocItems = [
    { id: 'problem-certification-crunch', label: 'The Problem: Certification Crunch' },
    { id: 'architecture-escalation-combo', label: 'The Architecture: Two-Phase Combo' },
    { id: 'user-interface-forms', label: 'User Interface: Interactive Forms' },
    { id: 'back-end-workflows', label: 'Back End: Workflow Details' },
    { id: 'api-operations', label: 'API Operations' },
    { id: 'limitations-best-practices', label: 'Platform Limits & Best Practices' },
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
              <span className="text-slate-400">Certification Escalation</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-blue-400">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>June 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Self-Service Certification Escalation <br />
                <span className="text-blue-500 text-2xl md:text-3xl">(A Custom Workflows & Interactive Forms Solution)</span>
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
              
              {/* Introduction/Problem */}
              <h3 id="problem-certification-crunch" className="text-2xl text-white mt-8 mb-4 font-black tracking-tight">The Problem: The End-of-Quarter Certification Crunch</h3>
              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">The Late-Reviewer Dilemma:</strong> At the end of a quarterly or semi-annual access certification cycle, compliance administrators often face a common problem: a handful of non-responsive certifiers who have let their reviews sit past the deadline.</li>
                <li><strong className="text-white">The Manual Overhead:</strong> Standard SailPoint Identity Security Cloud (ISC) campaigns allow notifications and automated reminders, but escalating past-due items to a reviewer's manager typically requires manual intervention. An admin has to track down the certifications, identify the managers, and manually reassign each certification inside the UI.</li>
                <li><strong className="text-white">The Goal:</strong> A Launchpad-driven self-service portal where administrators can view all active campaigns, selectively choose which ones to escalate, review a high-density summary of their choices, and programmatically reassign outstanding certifications to the respective reviewers' managers.</li>
              </ul>

              {/* Architecture */}
              <h3 id="architecture-escalation-combo" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">The Architecture: A Two-Phase Escalation Combo</h3>
              <p className="text-slate-300 mb-6">
                To build an efficient, rate-limit-conscious solution that does not cause workflow execution timeouts, the architecture is split into two distinct workflows and two interactive forms. This keeps execution runs short, structured, and modular.
              </p>

              {/* Visual Flowchart */}
              <div className="my-10 bg-slate-900/40 rounded-2xl border border-white/10 p-6 md:p-8">
                <div className="text-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">Visual Architecture Flow</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  {/* Left Column: Selection Workflow */}
                  <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-xl border border-white/5 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">1</span>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide">Selection & Confirmation (UI)</h4>
                    </div>
                    <div className="text-xs text-slate-400 space-y-3">
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Launchpad Trigger</span>
                        <p className="mt-1">Launched directly from the administrator launcher interface.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Form 1: Campaign Selector</span>
                        <p className="mt-1">Retrieve active campaigns and request choices from admin.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Serial Concatenation</span>
                        <p className="mt-1">Loop selected campaigns to build dynamic HTML summary cards.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Form 2: Confirm Selections</span>
                        <p className="mt-1">Display compiled HTML, prompt for approve/deny choice.</p>
                      </div>
                    </div>
                    {/* Connecting arrow indicator for desktop */}
                    <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 w-4 h-4 text-blue-400 items-center justify-center font-bold">
                      →
                    </div>
                  </div>

                  {/* Right Column: Background Execution */}
                  <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">2</span>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide">Background Escalation (Worker)</h4>
                    </div>
                    <div className="text-xs text-slate-400 space-y-3">
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-bold">HTTP Webhook Trigger</span>
                        <p className="mt-1">Workflow 1 triggers background executions asynchronously.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-bold">Query Certifications</span>
                        <p className="mt-1">Fetch incomplete active certification items for target campaign.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-bold">Resolution Loop</span>
                        <p className="mt-1">Retrieve reviewer details, fetch manager ID dynamically.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-bold">Reassignment API Call</span>
                        <p className="mt-1">Reassign target certifications to the resolved managers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Workflow 1: Certification Selection For Escalation</strong>
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li><strong>Trigger:</strong> Interactive process launched via the Launchpad.</li>
                    <li><strong>Interactive Form 1 (Selector):</strong> Fetches active campaigns and lets the admin select either "All Active Campaigns" or select individual campaigns from a dropdown list.</li>
                    <li><strong>Serial Loop:</strong> Loops through active campaigns to check if they were selected, dynamically building a stylized HTML/CSS high-density summary card block.</li>
                    <li><strong>Interactive Form 2 (Confirmation):</strong> Renders the generated HTML summary inside a description block and prompts the user with an Approve/Deny toggle.</li>
                    <li><strong>Loop & Trigger:</strong> If approved, it loops through the selected campaigns and sends an asynchronous HTTP POST call to run Workflow 2 for each campaign.</li>
                  </ul>
                </li>
                <li><strong className="text-white">Workflow 2: Certification Escalator</strong>
                  <ul className="list-circle pl-5 mt-2 space-y-1">
                    <li><strong>Trigger:</strong> External HTTP trigger receiving the <code>campaignid</code>.</li>
                    <li><strong>Get Certifications:</strong> Fetches all active, incomplete certifications under the target campaign.</li>
                    <li><strong>Serial Loop:</strong> For each certification, it retrieves the reviewer's identity details, resolves their manager's ID, and calls the reassignment API.</li>
                  </ul>
                </li>
              </ul>

              <div className="bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r-xl mb-8">
                <h4 className="text-white font-bold text-base m-0">Design Decision: Why Split Into Two Workflows?</h4>
                <ul className="list-disc pl-5 mt-2 text-sm text-slate-300 space-y-1.5">
                  <li><strong>Licensing Compliance:</strong> Splitting the logic ensures both workflows stay under <strong>20 steps</strong>, which is the maximum step count allowed under the entry-level SailPoint ISC business subscription. Users with higher-tier plans can combine these into a single workflow if preferred.</li>
                  <li><strong>Easier Debugging & Simpler Logic:</strong> Decoupling the interactive frontend selector from the background worker escalator keeps the logic simple, structured, and easy to trace in execution logs.</li>
                  <li><strong>Runtime Optimization:</strong> Reassigning hundreds of certifications takes time. Splitting prevents a single interactive workflow execution from running into maximum execution timeouts.</li>
                  <li><strong>Fault Tolerance:</strong> If a reassignment loop fails, we only have to restart that specific campaign's escalator execution. We avoid repeating the campaign selection UI or risking a partial run failure where only some campaigns get processed, forcing us to restart the entire sequence.</li>
                </ul>
              </div>

              {/* User Interface */}
              <h3 id="user-interface-forms" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">User Interface: Interactive Forms</h3>
              <p className="text-slate-300 mb-6">
                By leveraging ISC Interactive Forms, we can build a clean, guided wizard experience. 
              </p>

              <h4 className="text-xl text-blue-400 mt-8 mb-3">1. Campaign Selector Form</h4>
              <p className="text-slate-300 mb-4">
                The first form asks the user if they want to target all active campaigns or specify a list. A form condition shows the campaign selection dropdown only when the toggle is turned off.
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-6">
                <li><strong className="text-white">Escalate All Active Campaigns? (Toggle):</strong> Defaults to <code>true</code> (Escalate All Campaigns) or <code>false</code> (Escalate Campaigns Below).</li>
                <li><strong className="text-white">Campaign Selector (Dropdown):</strong> Multi-select dropdown populated dynamically by Workflow 1 with the names and IDs of active campaigns.</li>
              </ul>

              {/* Form 1 Image Preview */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/certification-escalation-workflow/campaign-selector.png" 
                      alt="Form 1: Campaign Selector UI"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">1. Campaign Selector Form Layout</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-blue-400 mt-8 mb-3">2. Confirmation Form</h4>
              <p className="text-slate-300 mb-4">
                The second form uses a description block to render a dynamic HTML preview generated during the workflow's execution. This ensures the admin knows exactly which campaigns they are about to escalate before executing.
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-6">
                <li><strong className="text-white">Dynamic Campaign Selections (Description Block):</strong> Displays the formatted HTML summary.</li>
                <li><strong className="text-white">Approve or Deny (Toggle):</strong> Requires the administrator to actively flip to "Approved" and click submit.</li>
              </ul>

              {/* Form 2 Image Preview */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/certification-escalation-workflow/confirm-selection.png" 
                      alt="Form 2: Confirmation UI"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">2. Confirmation Form Layout</span>
                  </div>
                </div>
              </div>

              {/* Back End Workflow Details */}
              <h3 id="back-end-workflows" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Back End: Workflow Details</h3>
              
              <h4 className="text-xl text-blue-400 mt-8 mb-3">Workflow 1: Certification Selection For Escalation</h4>
              <p className="text-slate-300 mb-4">
                This workflow is responsible for querying campaigns, orchestrating the interactive forms, and dynamically compiling the campaign selection summaries depending on whether the administrator selected the "Escalate All Campaigns" toggle in Form 1.
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-6">
                <li><strong className="text-white">Individual Campaign Selections (Card Style):</strong> When specific campaigns are manually selected, a detailed card format featuring a left accent border, structured titles, and deadlines is compiled:
                  <div className="bg-[#0d1117] rounded-lg p-4 mt-2 mb-4 border border-white/10 overflow-x-auto">
                    <pre className="text-xs text-blue-300 m-0"><code>{`<div style='background-color: #1e1e1e; padding: 14px; border-radius: 6px; border: 1px solid #333; border-left: 4px solid #3498db; margin-bottom: 15px;'>
  <span style='font-size: 14px; font-weight: bold; color: #3498db;'>📋 {{$.loop.loopInput.name}}</span>
  <hr style='border: 0; border-top: 1px solid #2d2d2d; margin: 8px 0;'>
  <span style='font-size: 12px; opacity: 0.85;'><strong>🔑 Campaign ID:</strong> <code>{{$.loop.loopInput.id}}</code></span><br>
  <span style='font-size: 12px; opacity: 0.85;'><strong>📅 Target Deadline:</strong> <span style='color: #e67e22; font-family: monospace;'>{{$.loop.loopInput.deadline}}</span></span>
</div>`}</code></pre>
                  </div>
                </li>
                <li><strong className="text-white">All Campaigns Selected (Consolidated View):</strong> When "Escalate All Campaigns" is toggled, looping through every active campaign could result in massive page heights. The workflow builds a high-density list using inline vertical piping and dashed separators:
                  <div className="bg-[#0d1117] rounded-lg p-4 mt-2 mb-4 border border-white/10 overflow-x-auto">
                    <pre className="text-xs text-blue-300 m-0"><code>{`<div style='font-size: 13px; line-height: 1.6; margin-bottom: 5px; border-bottom: 1px dashed #2d2d2d; padding-bottom: 5px;'>
  🔹 <strong style='color: #3498db;'>{{$.loop.loopInput.name}}</strong> &nbsp;<span style='color:#444;'>|</span>&nbsp; <span style='font-size: 11px; opacity: 0.6;'>ID:</span> <code style='font-size: 11px; padding: 0; vertical-align: middle; font-family: monospace;'>{{$.loop.loopInput.id}}</code> &nbsp;<span style='color:#444;'>|</span>&nbsp; <span style='font-size: 11px; color: #e67e22;'>📅 <span style='font-family: monospace;'>{{$.loop.loopInput.deadline}}</span></span>
</div>`}</code></pre>
                  </div>
                </li>
              </ul>

              <h4 className="text-xl text-blue-400 mt-8 mb-3">Workflow 2: Certification Escalator</h4>
              <p className="text-slate-300 mb-6">
                This workflow performs the actual heavy lifting. It executes asynchronously in the background for each escalated campaign, gathering incomplete active certifications, looping through them, looking up each reviewer's manager, and executing the reassignment.
              </p>

              {/* API Operations */}
              <h3 id="api-operations" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">API Operations</h3>
              <p className="text-slate-300 mb-6">
                The workflow relies on three core API calls from SailPoint's v2026 endpoint:
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="bg-slate-900/40 p-5 rounded-xl border border-white/15">
                  <span className="font-mono text-xs uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 font-bold">1. Get All Active Campaigns</span>
                  <p className="font-mono text-sm text-slate-200 mt-3 mb-1">GET /v2026/campaigns?filters=status eq "ACTIVE"</p>
                  <p className="text-xs text-slate-400 mt-1">Retrieves the list of currently active campaigns to populate Form 1.</p>
                </div>

                <div className="bg-slate-900/40 p-5 rounded-xl border border-white/15">
                  <span className="font-mono text-xs uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 font-bold">2. Get Certifications per Campaign</span>
                  <p className="font-mono text-sm text-slate-200 mt-3 mb-1">{"GET /v2026/certifications?filters=campaign.id eq \"{{$.trigger.campaignid}}\" and phase eq \"ACTIVE\" and completed eq false"}</p>
                  <p className="text-xs text-slate-400 mt-1">Takes the campaign ID received from the external HTTP trigger, then queries all active and outstanding certifications under that campaign. The filters for phase and completed ensure we do not reassign users who have already performed and completed their certifications.</p>
                </div>

                <div className="bg-slate-900/40 p-5 rounded-xl border border-white/15">
                  <span className="font-mono text-xs uppercase bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-bold">3. Reassign Certification</span>
                  <p className="font-mono text-sm text-slate-200 mt-3 mb-1">{"POST /v2026/campaigns/{{$.loop.loopInput.campaign.id}}/reassign"}</p>
                  <div className="bg-[#0d1117] rounded-lg p-4 mt-2 border border-white/10 overflow-x-auto">
                    <pre className="text-xs text-blue-300 m-0"><code>{`{
  "certificationIds": [
    "{{$.loop.loopInput.id}}"
  ],
  "reason": "Escalating Certification To Users Manager",
  "reassignTo": {
    "id": "{{$.defineVariable.managerid}}",
    "type": "IDENTITY"
  }
}`}</code></pre>
                  </div>
                </div>
              </div>

              {/* Platform Limitations */}
              <h3 id="limitations-best-practices" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Platform Limitations & Best Practices</h3>
              <p className="text-slate-300 mb-4">
                When deploying this solution, keep the following platform behaviors and limits in mind:
              </p>
              
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">The 250 Pagination Limits and Early Cancellation Checks:</strong> 
                  To maintain platform stability and protect workflows from unexpected behavior, the solution enforces hard limits at two stages, backed by early-exit cancellation checks:
                  <ul className="list-circle pl-5 mt-2 space-y-2">
                    <li><strong>Campaign Limit (Form 1 and All-Campaign Toggle):</strong> The initial API call retrieves a maximum of 250 active campaigns (which is the default API pagination page limit). If the user toggles "Escalate All Active Campaigns", the workflow is designed to safely handle up to 250. If the active campaign response count is exactly 250, we immediately cancel/exit the workflow early (using a decision branch) to prevent unintended or incomplete behavior.</li>
                    <li><strong>Certification Limit (Escalator Workflow):</strong> The second workflow retrieves up to 250 active certifications per campaign. If there are exactly 250 certifications returned, this indicates that the campaign size exceeds our single-page query limit. To avoid partial escalations and out-of-order reassignments, we have a check (<code>Compare Multi Type 2</code> step comparing the body length to <code>250</code>) that terminates the escalator workflow early if the threshold is met.</li>
                  </ul>
                </li>
                <li><strong className="text-white">Why these limits are practical:</strong> In a production setting, having more than 250 concurrent active campaigns is highly improbable. Similarly, because escalations are typically run near the end of a review cycle, only a small fraction of certifications (typically well under 250) remain past due and need escalation in a single campaign.</li>
                <li><strong className="text-white">Launchpad Role Restrictions:</strong> Ensure that access to the "Certification Selection For Escalation" interactive trigger is restricted. Only authorized compliance managers or IAM administrators should be allowed to run the tool.</li>
                <li><strong className="text-white">Manager Integrity:</strong> The escalator workflow checks if a manager ID exists for the reviewer (using a <code>Compare Multi Type</code> step). If a reviewer does not have an assigned manager, the workflow skips that certification, ensuring it doesn't fail or throw API errors.</li>
              </ul>

              {/* Conclusion */}
              <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                Splitting this escalation solution into a selection UI workflow and an asynchronous worker workflow ensures speed, compliance reviews, and high reliability. Interactive forms bring IIQ-like workflow flexibility to the modern Identity Security Cloud platform.
              </p>
              <p className="text-slate-300 mb-12 leading-relaxed font-light">
                If you are looking to deploy this solution or want to implement custom certification escalations in your environment, book a time with me by using the Talk to an Expert button below.
              </p>

              {/* Downloads Grid */}
              <h3 className="text-2xl text-white mt-12 mb-6">Configuration Snippets & Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                
                {/* Form Selector Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">1. Campaign Selector (Form)</h4>
                    <p className="text-xs text-slate-400 mb-6">Interactive selection form capturing target campaign list or escalation toggle parameters.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formCampaignSelector, null, 2))}`}
                    download="Form-CertificationCampaignSelector.json"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Form-CertificationCampaignSelector.json
                  </a>
                </div>

                {/* Form Confirm Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">2. Confirm Selection (Form)</h4>
                    <p className="text-xs text-slate-400 mb-6">Description rendering confirmation panel displaying stylized HTML preview variables.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formConfirmSelection, null, 2))}`}
                    download="Form-ConfirmCampaignSelection.json"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Form-ConfirmCampaignSelection.json
                  </a>
                </div>

                {/* Selection Workflow Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">3. Selection Workflow (Workflow)</h4>
                    <p className="text-xs text-slate-400 mb-6">Orchestrator retrieving active campaigns, displaying selector UI, and triggering backend worker loops.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowSelection, null, 2))}`}
                    download="Workflow-CertificationSelectionForEscalation.json"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Workflow-CertificationSelectionForEscalation.json
                  </a>
                </div>

                {/* Escalator Workflow Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">4. Background Escalator (Workflow)</h4>
                    <p className="text-xs text-slate-400 mb-6">Worker endpoint looping active certifications, resolving reviewer's manager, and reassigning via API.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowEscalator, null, 2))}`}
                    download="Workflow-CertificationEscalator.json"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Workflow-CertificationEscalator.json
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
