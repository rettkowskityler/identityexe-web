import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

export default function AdminHelperFormPost() {
  const tocItems = [
    { id: 'business-context', label: 'The Hook & Business Context' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'user-interface', label: 'User Interface' },
    { id: 'workflow-engine', label: 'The Main Workflow Engine' },
    { id: 'actions-backend', label: 'Actions & Back End' },
    { id: 'considerations-best-practices', label: 'Considerations & Best Practices' },
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
          
          <article className="lg:col-span-3 min-w-0 w-full overflow-hidden glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-cyan-400 transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-cyan-400 transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Admin Helper Form</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-cyan-400">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>July 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                The Admin Helper Form: <br />
                <span className="text-cyan-500 text-2xl md:text-3xl">Architecting a Centralized Command Center for Advanced Operations</span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden p-[2px]">
                  <img src="/images/profile.jpg" alt="Tyler" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="text-white">Tyler</p>
                  <p>IdentityEXE Founder</p>
                </div>
              </div>
            </header>

            <div className="prose prose-invert break-words w-full overflow-x-hidden prose-pre:max-w-[85vw] sm:prose-pre:max-w-full prose-pre:overflow-x-auto prose-img:max-w-full prose-img:h-auto prose-base md:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-code:text-cyan-300 prose-code:bg-cyan-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
              
              {/* The Hook & Business Context */}
              <h3 id="business-context" className="text-2xl text-white mt-8 mb-4 font-black tracking-tight">The Hook & Business Context</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Administrators and engineers of SailPoint Identity Security Cloud (ISC) frequently encounter architectural limitations when executing specialized administrative actions, such as bypassing the source owner bug during account resets or surgically disabling health checks. Traditionally, managing these operations requires manual intervention via API tools like Postman or running disparate PowerShell scripts outside of the platform.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Leaving these administrative processes disconnected creates significant operational drag. A fragmented approach leads to massive deployment lag, severe manager approval fatigue, and increased security vulnerabilities as critical lifecycle actions rely on undocumented manual scripts. When governance teams are forced to context-switch across external tools, organizational momentum stalls and compliance audit risks compound.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-semibold text-white">
                To solve this, our engineering team developed the Admin Helper Form framework: a repeatable architectural methodology designed by IdentityEXE. By unifying interactive ISC forms with backend workflows and parallelized scripts, this modular framework ensures that your ISC deployment operates as a seamless, centralized command center for all advanced identity operations.
              </p>

              <hr className="border-white/10 my-10" />

              {/* Solution Overview */}
              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Solution Overview</h3>
              <p className="text-slate-300 mb-6">
                When we architect this solution for our enterprise clients, we utilize a robust technical stack comprising <strong>1 Form + 2 Workflows + 2 PowerShell Scripts</strong>.
              </p>
              <p className="text-slate-300 mb-6">
                <strong>High-Level Flow:</strong> Our core engineering methodology structures the data layer to create a dynamic launcher. An administrator selects an action to perform on a specific source or identity. The form provides an outlook of every item through a detailed description variable. The chosen actions trigger backend workflows that either execute direct API calls or provide outputs for secure PowerShell execution.
              </p>

              {/* User Interface */}
              <h3 id="user-interface" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">User Interface</h3>
              <p className="text-slate-300 mb-4">
                <strong>Input Fields:</strong>
              </p>
              <ul className="space-y-2 text-slate-300 mb-6 list-disc pl-5">
                <li>Action Selector (Dropdown)</li>
                <li>Target Selector (Source or Identity)</li>
              </ul>
              <p className="text-slate-300 mb-6">
                <strong>User Experience:</strong> The form utilizes a detailed description variable to clearly explain what each option does before execution. This modular framework ensures that your ISC deployment avoids executing irreversible changes without proper context.
              </p>

              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/admin-helper-form/Admin_Helper_Form_-_Example_Form_Execution_-_Non_Expanded_Descriptions.png" alt="Admin Helper Form Execution" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>
              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/admin-helper-form/Admin_Helper_Form_-_Example_Form_Execution_-_Expanded_Descriptions_-_1.png" alt="Admin Helper Form Expanded 1" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>
              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/admin-helper-form/Admin_Helper_Form_-_Example_Form_Execution_-_Expanded_Descriptions_-_2.png" alt="Admin Helper Form Expanded 2" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>



              <hr className="border-white/10 my-10" />

              {/* Workflow Engine */}
              <h3 id="workflow-engine" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">The Main Workflow Engine</h3>
              <p className="text-slate-300 mb-6">
                At the core of this IdentityEXE Blueprint is the main workflow that ties everything together. It uses an <strong>Interactive Form Trigger</strong> to display the user interface shown above. Once submitted, the workflow processes selected inputs using a series of <strong>Compare Strings</strong> operators to branch the logic and determine precisely which API call or PowerShell script to execute next.
              </p>



              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/admin-helper-form/AdminHelperForm20260726.png" alt="Admin Helper Form Workflow" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>

              <hr className="border-white/10 my-10" />

              {/* Actions & Back End */}
              <h3 id="actions-backend" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Actions & Back End</h3>
              <p className="text-slate-300 mb-6">
                Here are the actions supported by the IdentityEXE Implementation Framework and what happens under the hood when selected:
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. Unoptimized Account Aggregation</h4>
              <p className="text-slate-300 mb-6">
                Executes a direct API Call to <code>/sources/v1/:id/load-accounts</code> with the body <code>{`{"disableOptimization": true}`}</code>.
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">2. Reset Accounts On Source</h4>
              <p className="text-slate-300 mb-4">
                You might wonder, why not just use the standard API call <code>/sources/v1/:id/remove-accounts</code>? This endpoint has a known quirk where it fails to remove accounts associated with an identity that are source owners (even if they aren't owners of the specific source you are resetting).
              </p>
              <p className="text-slate-300 mb-4">
                When we architect this solution, we deploy a PowerShell script to bypass that bug. It attempts the bulk removal, and if it encounters a <code>400 Bad Request</code>, it parses the error message payload to find the specific blockers.
              </p>
              <p className="text-slate-300 mb-4">
                <strong>Technical Quirks & Error Handling:</strong> When the removal fails due to the source owner bug, the API returns a JSON error structure. The script catches this <code>400</code> status code, extracts <code>$errorJson.messages[0].text</code>, and uses a foolproof Regex <code>\b[a-fA-F0-9]{`{32}`}\b</code> to parse out any 32-character SailPoint Hex IDs trapped inside the error text. Once the <code>$badAccountIds</code> are extracted, the script executes a sequential, surgical removal loop specifically targeting those blocking accounts. It handles <code>429</code> rate limits gracefully by sleeping and retrying up to 5 times. Once the blockers are completely cleared, it invokes the bulk removal endpoint a second time to finish the job for the rest of the source.
              </p>


              <h4 className="text-lg font-bold text-white mt-6 mb-3">3. Reset Entitlements</h4>
              <p className="text-slate-300 mb-6">
                Simple API Call to <code>/entitlements/v1/reset/sources/:id</code>.
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">4. Turn Off Health Check for a Source</h4>
              <p className="text-slate-300 mb-6">
                Simple API Call to PATCH a source, setting <code>disable_health_check</code> to <code>true</code> or <code>false</code>.
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">5. Bulk Enable & Bulk Disable Accounts for Identities</h4>
              <p className="text-slate-300 mb-4">
                These actions call an external workflow named "Enable/Disable User In Bulk" passing the identity ID and the action. This workflow loops through all of the user's accounts and enables or disables them in bulk using the corresponding account enable/disable API endpoints.
              </p>

              
              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/admin-helper-form/EnableDisableUserInBulk20260726.png" alt="Bulk Enable Disable Workflow" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">6. Attribute Sync Report By Source (Crystal Ball)</h4>
              <p className="text-slate-300 mb-4">
                An insightful PowerShell script that looks at the attribute sync config for a selected source. It pulls all accounts and identities for that source, calculates the differences and current lifecycle states, and determines if a sync will occur. It then emails a comprehensive report to the requester.
              </p>
              <p className="text-slate-300 mb-4">
                <strong>Technical Quirks & Performance:</strong> Because retrieving tens of thousands of identities and accounts sequentially takes an extensive amount of time, this script leverages parallel runspaces. It sets up a <code>[runspacefactory]::CreateRunspacePool</code> with 20 concurrent threads to query the <code>/accounts</code> and <code>/search</code> APIs simultaneously using limit/offset pagination blocks.
              </p>
              <p className="text-slate-300 mb-4">
                Inside each background runspace thread, there is native <code>429 Too Many Requests</code> error handling utilizing an exponential backoff formula with jitter: <br />
                <code>$WaitMs = [math]::Pow(2, $RetryCount) * 1000 + (Get-Random -Minimum 100 -Maximum 500)</code>
              </p>
              <p className="text-slate-300 mb-4">
                This prevents a "thundering herd" scenario. After all concurrent requests complete, the script correlates the Accounts with their Linked Identities locally in a Hash Map, cross-references against the source's Attribute Sync Configuration mapping, evaluates if they are in sync, and dynamically generates an output CSV payload before triggering the email alert.
              </p>

              
              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/admin-helper-form/Crystal_Ball_Report_Example_Email_Screenshot.png" alt="Crystal Ball Report Email" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>

              <hr className="border-white/10 my-10" />

              {/* Considerations & Best Practices */}
              <h3 id="considerations-best-practices" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Considerations & Best Practices</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong>Permissioning:</strong> The launcher for this form should be strictly granted to administrators in ISC. The actions performed, such as deleting all accounts on a source or bulk enabling and disabling, are highly privileged.</li>
                <li><strong>Error Handling:</strong> When running the PowerShell scripts, ensure you review the console outputs if any surgical removals fail due to rate limits or other issues.</li>
                <li><strong>PAT Needed to Run:</strong> When setting the PAT client ID and secret for the HTTP Requests within the workflows and the scripts, ensure your service account holds the necessary permissions (e.g., ORG_ADMIN) and proper scopes.</li>
                <li><strong>Credential Security:</strong> The PowerShell scripts provided include placeholders for Client IDs, Client Secrets, and SMTP Passwords. Best practice dictates that these secrets should never be stored in plain text within the script. You should utilize secure storage methods such as Windows Credential Manager, Azure Key Vault, or encrypted XML files to retrieve these credentials safely at runtime.</li>
              </ul>

              <hr className="border-white/10 my-10" />

              {/* Downloads Grid */}
              <h3 className="text-2xl text-white mt-12 mb-6">Configuration Snippets & Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">1. Admin Helper (Form)</h4>
                    <p className="text-xs text-slate-400 mb-6">Interactive selection form providing detailed descriptions and variable inputs.</p>
                  </div>
                  <a 
                    href="/images/blog/admin-helper-form/Form-ISC Admin Helper Form-20260726-201701.json"
                    download="Form-ISC_Admin_Helper_Form-20260726-201701.json"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Form-ISC Admin Helper Form.json
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">2. Main Orchestrator (Workflow)</h4>
                    <p className="text-xs text-slate-400 mb-6">The main workflow engine handling branching logic and execution routes.</p>
                  </div>
                  <a 
                    href="/images/blog/admin-helper-form/AdminHelperForm20260726.json"
                    download="AdminHelperForm20260726.json"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    AdminHelperForm20260726.json
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">3. Enable/Disable Bulk (Workflow)</h4>
                    <p className="text-xs text-slate-400 mb-6">Looping worker process that enables or disables all accounts on an identity.</p>
                  </div>
                  <a 
                    href="/images/blog/admin-helper-form/EnableDisableUserInBulk20260726.json"
                    download="EnableDisableUserInBulk20260726.json"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    EnableDisableUserInBulk.json
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">4. Surgical Removal (PowerShell)</h4>
                    <p className="text-xs text-slate-400 mb-6">Account reset script that bypasses the known source owner bug during bulk removals.</p>
                  </div>
                  <a 
                    href="/images/blog/admin-helper-form/ResetAccountsBySource.ps1"
                    download="ResetAccountsBySource.ps1"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    ResetAccountsBySource.ps1
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between md:col-span-2">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">5. Attribute Sync Report (PowerShell)</h4>
                    <p className="text-xs text-slate-400 mb-6">Concurrent threaded analysis script simulating sync status for thousands of accounts.</p>
                  </div>
                  <a 
                    href="/images/blog/admin-helper-form/AttributeSyncReport.ps1"
                    download="AttributeSyncReport.ps1"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto w-full md:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    AttributeSyncReport.ps1
                  </a>
                </div>

              </div>

              <hr className="border-white/10 my-10" />

              {/* Conclusion and CTA */}
              <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Conclusion</h3>
              <p className="text-slate-300 mb-10 leading-relaxed">
                The Admin Helper Form provides a scalable and interactive way to perform complex, multi-step actions natively inside ISC, eliminating the need to context-switch to external terminals for critical operations. 
              </p>

              <div className="mt-16 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">Ready to Elevate Your Identity Architecture?</h3>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  A stalled identity governance rollout burns capital and stalls organizational momentum. If your team is hitting configuration walls or struggling with complex admin-helper-form integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-cyan-900 font-bold rounded-full hover:bg-cyan-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20"
                >
                  Book Your SailPoint Architecture Review
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
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
