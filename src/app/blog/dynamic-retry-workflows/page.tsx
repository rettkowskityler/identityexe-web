import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import httpPostData from './DynamicRetryWorkflowHTTPPOSTRequest20260620.json';
import ntlmData from './DynamicRetryWorkflowNTLMPowerShellScript20260620.json';
import launchCampaignData from './TestLaunchCertificationCampaign20260620.json';
import testPowerShellData from './TestPowerShellScriptExecution20260620.json';

export default function DynamicRetryWorkflowsPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'json-payload-structures', label: 'JSON Payload Structures' },
    { id: 'workflow-frameworks', label: 'Implementation Frameworks' },
    { id: 'considerations-practices', label: 'Considerations & Best Practices' },
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
              <span className="text-slate-400">Dynamic Retry Workflows</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-blue-400">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>June 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Dynamic Retry Workflows in Identity Security Cloud <br />
              <span className="text-blue-500 text-2xl md:text-3xl">(Architectural Implementation Framework)</span>
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
            
            <h3 id="executive-summary" className="text-2xl text-white mt-8 mb-4">Executive Summary</h3>
            <p className="text-slate-300 mb-4">
              In Identity Security Cloud (ISC), engineering teams often interact with APIs or external scripts that require variable execution time or occasionally fail on the first attempt. Launching a certification campaign and waiting for generation before activating it is a frequent bottleneck. Instead of relying on arbitrary "Wait" commands that congest operations, architectures require a dynamic mechanism to retry, evaluate status, and proceed only when downstream dependencies are ready.
            </p>
            <p className="text-slate-300 mb-4">
              When this architectural limitation remains unsolved, the operational impact scales rapidly. Hardcoded waits result in massive deployment lag, while unverified external workflow calls mask underlying errors, resulting in silent failures. For enterprise environments, this translates directly to failed compliance audits from missed campaigns, severe manager approval fatigue, and unaddressed security vulnerabilities.
            </p>
            <p className="text-slate-300 mb-8">
              To resolve this, IdentityEXE designed a repeatable architectural methodology. This is not a mere script, but a modular framework where an external "Retry Workflow" assumes control over HTTP POSTs or Windows Server PowerShell script executions. It natively handles retries, aggregates error telemetry, and exposes a polling capability for the primary workflow to safely verify status.
            </p>

            <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Tech Stack:</strong> 4 Workflows (2 Core Retry Workflows + 2 Starting Workflows)</li>
              <li><strong className="text-white">High-Level Flow:</strong> Instead of executing a complex POST or PowerShell task right in your main workflow, you hand off the execution to a dedicated Retry Workflow via an HTTP Request using an External trigger. The initial workflow then polls the Retry Workflow to check its status. If the external task succeeds, the polling loop breaks and the original workflow marks as successful. If the retry workflow exhausts its retries and fails, the original workflow is marked as failed. This prevents confusion when debugging.</li>
            </ul>

            <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: Core Concepts</h3>
            <p className="text-slate-300 mb-6">
              When we architect this solution for our enterprise clients, we utilize several key methodologies inside the data layer to ensure fault tolerance:
            </p>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Serial Loops with a Counter Variable:</strong> By using a <code>counter</code> variable that increments (using "Update Variable") and a <code>retrycount</code> variable that is passed in, our core engineering methodology structures the data layer to dynamically set how many retries should happen in your Serial Loop.</li>
              <li><strong className="text-white">Input Validation:</strong> A "Check Input Is Complete" comparison step ensures that the caller passes the correct expected variables before proceeding.</li>
              <li><strong className="text-white">Break Loops:</strong> When the task is successful, a "Break Loop" operator halts the serial loop immediately and allows the workflow to close as successful.</li>
              <li><strong className="text-white">Checking Succeeded Loop Counts:</strong> When you use an "Update Variable" inside a loop, it doesn't always keep the value once you exit the loop. To get around this, we use a comparison check using the Serial Loop's "succeeded" count and compare that against the <code>retrycount</code>. This accurately determines the outcome.</li>
              <li><strong className="text-white">Two Primary Use Cases:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Certification Launch & Poll:</strong> It takes time for a campaign to generate before you can run the <code>/activate</code> API call. The polling solution allows you to continuously try to activate it without hardcoding massive "Wait" actions.</li>
                  <li><strong>PowerShell Execution:</strong> Pass down the parameters for a Windows Server NTLM script execution and retry it safely on the target server.</li>
                </ul>
              </li>
              <li><strong className="text-white">Bypassing the 1-Minute Minimum Wait Time:</strong> The UI makes you believe you can only input wait times in 1-minute increments. However, if you use a variable (e.g., <code>waittime</code>) with the value <code>"20s"</code>, you can bypass that minimum and wait the actual amount of seconds you need. This gets passed to the retry workflow as well.</li>
              <li><strong className="text-white">Modular Retry Workflows:</strong> This modular framework ensures that your ISC deployment avoids rigid configurations. We provided two common use cases, but you can build these for HTTP PATCH/PUT operations or Kerberos-based script executions. Since they are called externally, these retry workflows can be used from a variety of different initial workflows inside your tenant.</li>
              <li><strong className="text-white">Visibility & Debugging:</strong> By polling from the original workflow and returning an execution ID, any failure correctly bubbles up. Successful triggers will not mask failed back-end work.</li>
            </ul>

            <h3 id="json-payload-structures" className="text-2xl text-white mt-12 mb-4">JSON Payload Structures</h3>
            <p className="text-slate-300 mb-6">
              When calling these retry workflows, you must pass the exact expected JSON format. If you do not have the correct structure and naming, the workflow will fail to parameterize into the correct API or PowerShell calls.
            </p>

            <h4 className="text-xl text-white mb-3">HTTP POST Request Payload</h4>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`{
  "retrycount": 5,
  "waittime": "20s",
  "originalworkflow": "Test Launch Certification Campaign",
  "httprequest": {
    "url": "https://your-tenant.api.identitynow.com/v2026/campaigns/{{$.hTTPRequest.body.id}}/activate",
    "body": ""
  }
}`}</code></pre>
            </div>

            <h4 className="text-xl text-white mb-3">NTLM PowerShell Script Payload</h4>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`{
  "retrycount": 5,
  "waittime": "20s",
  "originalworkflow": "Test PowerShell Script Execution",
  "windowsserver": {
    "connectionaddress": "10.0.0.100",
    "scriptpath": "C:\\Scripts\\TestScript.ps1",
    "scriptarguments": {},
    "outputformat": "text",
    "scriptsha512checksum": "",
    "powershellconfigurationname": "Microsoft.PowerShell",
    "scriptexecutiontimeout": 3600
  }
}`}</code></pre>
            </div>

            <p className="text-slate-300 mb-8 italic text-sm border-l-2 border-blue-500 pl-4 py-1">
              <strong>Note on <code>originalworkflow</code>:</strong> The <code>originalworkflow</code> parameter is used strictly for debugging purposes. If your retry workflow is being executed from multiple different parent workflows across your tenant, this parameter makes it immediately evident where the execution originated when you look at the execution logs.
            </p>

            <h3 id="workflow-frameworks" className="text-2xl text-white mt-12 mb-4">Implementation Frameworks</h3>
            <p className="text-slate-300 mb-8">
              Below are the 4 workflow JSON components and their corresponding architectural diagrams to visualize the data flow.
            </p>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-8">
              <p className="text-yellow-200 text-sm m-0 font-medium">
                <strong>Important:</strong> Be sure to update your Client ID, Secrets, and Tenant URLs before deploying these configurations into your environment.
              </p>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">1. Dynamic Retry Workflow - HTTP POST Request</h4>
            <p className="text-slate-300 mb-4">This is the core Retry Workflow for POST requests.</p>
            
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/DynamicRetryWorkflowHTTPPOSTRequest20260620.png" 
                  alt="HTTP POST Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(httpPostData, null, 2))}`}
                  download="DynamicRetryWorkflowHTTPPOSTRequest20260620.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  HTTP POST Request.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">2. Dynamic Retry Workflow - NTLM PowerShell Script</h4>
            <p className="text-slate-300 mb-4">This core Retry Workflow executes a PowerShell script on your Windows Server.</p>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/DynamicRetryWorkflowNTLMPowerShellScript20260620.png" 
                  alt="NTLM PowerShell Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(ntlmData, null, 2))}`}
                  download="DynamicRetryWorkflowNTLMPowerShellScript20260620.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  NTLM PowerShell.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">3. Test - Launch Certification Campaign</h4>
            <p className="text-slate-300 mb-4">The initial testing workflow that creates a campaign and calls the POST Retry Workflow to activate it.</p>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/TestLaunchCertificationCampaign20260620.png" 
                  alt="Launch Certification Campaign Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(launchCampaignData, null, 2))}`}
                  download="TestLaunchCertificationCampaign20260620.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Launch Certification.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">4. Test - PowerShell Script Execution</h4>
            <p className="text-slate-300 mb-4">The initial testing workflow that passes variables down to the NTLM PowerShell Retry Workflow.</p>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/TestPowerShellScriptExecution20260620.png" 
                  alt="Test PowerShell Execution Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(testPowerShellData, null, 2))}`}
                  download="TestPowerShellScriptExecution20260620.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  PowerShell Script.json
                </a>
              </div>
            </div>

            <h3 id="considerations-practices" className="text-2xl text-white mt-12 mb-4">Considerations & Best Practices</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Permissions:</strong> Ensure your service account or PAT used to execute these external workflows has the necessary authorization scopes (like <code>idn:campaigns:manage</code> for campaigns, etc.).</li>
              <li><strong className="text-white">Error Handling:</strong> Many of the HTTP Request steps inside the retry loop will intentionally log as failures until they finally succeed. Use the execution ID and status check in your polling workflow to understand the final result.</li>
              <li><strong className="text-white">Payload Variables:</strong> The variables configured in <code>waittime</code> (such as <code>"20s"</code>) must be strictly formatted if you are trying to bypass the 1-minute limitation.</li>
            </ul>

            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                Using a parent-child workflow model via external triggers establishes a modular retry mechanism within your identity infrastructure. By passing strict payload parameters and polling for an execution ID, engineering teams achieve durable error handling without artificially clustering monolithic workflows.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-950/40 to-purple-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    If your team is hitting configuration walls or struggling with complex Dynamic-Retry-Workflows integrations, stop guessing.
                  </p>
                </div>
                <a 
                  href="/contact" 
                  className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
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
