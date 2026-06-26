import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formData from './SelectSourceForReporting_Form_Cleansed.json';
import launcherData from './InteractiveDisabledAccountsWithAccessReport_Cleansed.json';
import workerData from './PaginationWorker_Cleansed.json';

export default function CustomReportsWorkflowPaginationPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'workflow-frameworks', label: 'Implementation Frameworks' },
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
              <span className="text-slate-400">Custom Reports Workflow Pagination</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-blue-400">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>June 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Custom Reports with Workflow Pagination <br />
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
              Organizations mandate custom reports to identify security gaps, such as a comprehensive list of all disabled accounts retaining active access entitlements across all sources. While out-of-the-box methods exist using external PowerShell scripts or PTA, native execution inside Identity Security Cloud (ISC) Workflows is required for operational simplicity and reduced maintenance overhead. However, workflows impose a strict execution time limit and lack native pagination support for HTTP requests. If an API returns more than 250 items, standard workflow architectures fail to process the remaining data.
            </p>
            <p className="text-slate-300 mb-4">
              Leaving this architectural limitation unsolved forces operations teams to rely on fragmented, external solutions. This results in severe operational consequences: failed compliance audits due to incomplete reporting, massive deployment lag when managing external infrastructure, severe manager approval fatigue from disjointed data, and unchecked security vulnerabilities where disabled identities continue to hold high-risk access.
            </p>
            <p className="text-slate-300 mb-8">
              IdentityEXE designed a repeatable architectural methodology to solve this constraint natively. This is not a standalone script, but a modular framework. By using self-calling workflows, state passing, and string manipulation, we bypass standard platform limits and build complex, paginated reports natively within SailPoint ISC Workflows, distributing the output via email without external dependencies.
            </p>

            <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
            <p className="text-slate-300 mb-4">
              We separate this methodology into two connected components:
            </p>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Launcher Workflow:</strong> Starts with an Interactive Trigger and a form. This enables administrators to select individual sources or execute an "All Sources" report. It maps the requisite variables and triggers the worker node.</li>
              <li><strong className="text-white">Pagination Worker Workflow:</strong> Executes the API calls, processes pagination by recursively calling itself, constructs the HTML payload using update variables, and dispatches the final email upon completion.</li>
            </ul>

            <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: Implementation Architecture</h3>
            
            <h4 className="text-xl text-white mt-8 mb-3">Interactive Forms & User Experience</h4>
            <p className="text-slate-300 mb-4">
              The execution begins for the end user via an interactive form. Administrators dynamically select the specific sources to audit or quickly toggle an "All Sources" option. When an admin triggers the workflow, they are presented with a native UI within Identity Security Cloud:
            </p>
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <img src="/images/Form_Execution_Screenshot.png" alt="Form Execution Example" className="max-w-full h-auto object-contain shadow-2xl" />
              </div>
            </div>
            <p className="text-slate-300 mb-8">
              When we architect this solution for our enterprise clients, we utilize string replacement transforms to address formatting issues. Generating a list of multiple sources outputs a standard JSON array (e.g., <code>["id1", "id2"]</code>), but the SailPoint <code>/v3/accounts</code> API requires specific syntax for the <code>in</code> operator (e.g., <code>("id1", "id2")</code>). The workflow transforms brackets to parentheses, formatting the form's output into a valid API query parameter before invoking the worker workflow.
            </p>

            <h4 className="text-xl text-white mt-8 mb-3">Walking Through the Pagination Worker</h4>
            <p className="text-slate-300 mb-4">
              Our core engineering methodology structures the data layer to handle platform limitations through specific, sequential operations within the worker workflow:
            </p>

            <ul className="space-y-6 text-slate-300 mb-8">
              <li>
                <strong className="text-white block mb-1">1. The First API Call & Filtering</strong>
                Fetching every account across a tenant to check access consumes execution time and API limits. The workflow pushes compute load back to the SailPoint backend by appending <code>hasEntitlements eq true</code> directly to the <code>/v3/accounts</code> API filter. This guarantees the workflow only retrieves and processes accounts possessing active access.
              </li>
              <li>
                <strong className="text-white block mb-1">2. The Secondary Entitlements Call</strong>
                To extract actual entitlement names across varied source types (groups, roles, profiles), the workflow uses a serial loop. For each disabled account, it executes a secondary HTTP Request to the <code>/v3/accounts/:id/entitlements</code> endpoint, standardizing the data structure regardless of the underlying source.
              </li>
              <li>
                <strong className="text-white block mb-1">3. Building the Report: HTML String Accumulation</strong>
                Since workflows lack a native HTML table builder, the solution relies on "Update Variable" and string concatenation. During every loop iteration, the workflow dynamically injects account data into raw HTML rows (<code>&lt;tr&gt;...&lt;/tr&gt;</code>) and appends it to a <code>currentsummaryvariable</code>, accumulating data sequentially.
              </li>
              <li>
                <strong className="text-white block mb-1">4. The Recursive Loopback: Bypassing the 250 Limit</strong>
                Because workflows cannot natively loop API calls beyond 250 items, the worker is configured with an External Trigger. A "Define Comparison" step checks if the batch size equals 250. If so, it executes an HTTP POST request back to its own trigger URL. It acts as a state machine: using a math transform to add 250 to the <code>currentoffset</code>, passing that offset and the accumulated HTML table into the next execution via <code>$.trigger</code>.
              </li>
              <li>
                <strong className="text-white block mb-1">5. Fixing the Global State Caching Bug</strong>
                This modular framework ensures that your ISC deployment avoids state inconsistencies. The <code>sp:update-variable</code> updates global state, but the final HTTP request suffers from caching if inline templating (<code>{`{{$.defineVariable.currentsummaryvariable}}`}</code>) is used. The fix inserts a "syncing" Define Variable step using JSONPath (<code>variableA.$: "$.defineVariable.currentsummaryvariable"</code>) right after the serial loop, reading the live global state.
              </li>
              <li>
                <strong className="text-white block mb-1">6. Breaking the Loop and Sending the Email</strong>
                When a batch returns fewer than 250 items, the comparison step breaks the cycle and routes to the "Send Email" step, injecting the <code>currentsummaryvariable</code> to render the HTML table. If no accounts meet the criteria, it routes to a success notification email instead.
              </li>
            </ul>

            <h4 className="text-xl text-white mt-8 mb-3">The Final Result</h4>
            <div className="my-6">
              <p className="text-slate-300 mb-2 font-medium">Email Example with Accounts:</p>
              <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <img src="/images/Email_Example_Output_With_Accounts.png" alt="Email Example Output With Accounts" className="max-w-full h-auto object-contain shadow-2xl" />
              </div>
            </div>
            <div className="my-6">
              <p className="text-slate-300 mb-2 font-medium">Email Example without Accounts (Success):</p>
              <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <img src="/images/Email_Example_Output_Without_Accounts.png" alt="Email Example Output Without Accounts" className="max-w-full h-auto object-contain shadow-2xl" />
              </div>
            </div>

            <h3 id="workflow-frameworks" className="text-2xl text-white mt-12 mb-4">Implementation Frameworks</h3>
            <p className="text-slate-300 mb-8">
              Below are the workflow diagrams and implementation files for deployment into your environment. Update your Client ID, Secret, and Tenant URLs where required.
            </p>

            <h4 className="text-xl text-white mt-10 mb-4">1. Launcher Form</h4>
            <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between mb-8">
              <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
              <a 
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formData, null, 2))}`}
                download="SelectSourceForReporting_Form.json"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Launcher Form
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">2. Launcher Workflow</h4>
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img src="/images/InteractiveDisabledAccountsWithAccessReport20260625.png" alt="Launcher Workflow" className="max-w-full h-auto object-contain shadow-2xl" />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(launcherData, null, 2))}`}
                  download="InteractiveDisabledAccountsWithAccessReport.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Launcher Workflow
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">3. Pagination Worker Workflow</h4>
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img src="/images/PaginationWorker20260625.png" alt="Pagination Worker Workflow" className="max-w-full h-auto object-contain shadow-2xl" />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workerData, null, 2))}`}
                  download="PaginationWorker.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Worker Workflow
                </a>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                By leveraging self-calling workflows, state passing via updated variables, and recursive execution paths, Identity Security Cloud can natively bypass standard execution limits. This framework delivers comprehensive, paginated reporting securely within your existing governance ecosystem without the continuous overhead of maintaining external infrastructure or arbitrary external scripts.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-950/40 to-purple-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    If your team is hitting configuration walls or struggling with complex Custom-Reports-Workflow-Pagination integrations, stop guessing.
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
