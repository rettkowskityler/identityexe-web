import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formData from './Form-AggregationScheduleManager.json';
import workflowData from './Workflow-AggregationScheduleManager.json';

export default function AggregationExporterImporterPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'implementation-frameworks', label: 'Implementation Frameworks' },
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
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-brand-accent transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-brand-accent transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Automating Aggregation Schedules</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>August 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Automating Aggregation Schedules: A Complete Exporter & Importer <br />
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
                Managing, backing up, and manipulating aggregation schedules at scale in SailPoint Identity Security Cloud introduces significant operational friction. The platform's native functionality lacks a centralized mechanism to rapidly "pause" all aggregations for maintenance windows or effortlessly export and import schedules across environments, leaving administrators reliant on ad-hoc API scripts or manual UI updates.
              </p>
              <p className="text-slate-300 mb-4">
                Failing to resolve this architectural limitation directly impacts enterprise velocity and compliance. Uncoordinated maintenance windows can result in aggregation collisions, while the inability to instantly restore expected states creates severe deployment lag, introduces security vulnerabilities by delaying access revocation, and triggers massive manager approval fatigue when data syncs fail. 
              </p>
              <p className="text-slate-300 mb-8">
                IdentityEXE designed a repeatable architectural methodology to eliminate these constraints natively. Rather than deploying isolated scripts, this solution integrates a comprehensive, self-serve Toolkit utilizing SailPoint Workflows and PAG (Privileged Access Gateway) to give administrators granular, push-button control over their aggregation schedules tenant-wide.
              </p>

              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
              <p className="text-slate-300 mb-4">
                This modular framework integrates three core components: 1 Interactive Form, 1 SailPoint Workflow, and 2 parallel-processed PowerShell Reporting Scripts executed via PAG.
              </p>
              <p className="text-slate-300 mb-4">
                The solution centers around a Workflow Form that allows administrators to select from several powerful Actions:
              </p>
              <ul className="space-y-6 text-slate-300 mb-8">
                <li>
                  <strong className="text-white block mb-1">1. Export Operations</strong>
                  Scans all sources in the tenant in parallel, captures their Account and Group aggregation schedules, and writes them to a local CSV file on the PAG server (<code>C:\Scripts\Aggregation Exports</code>). Additionally, the CSV file is automatically emailed to the administrator who triggered the launcher.
                  <div className="my-6">
                    <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/Screenshot_Export_Form_Execution.png" alt="Export Form Execution" className="max-w-full h-auto object-contain shadow-2xl" />
                    </div>
                  </div>
                  <div className="my-6">
                    <p className="text-slate-300 mb-2 font-medium">Email Output Example:</p>
                    <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/Screenshot_Export_Email.png" alt="Export Email" className="max-w-full h-auto object-contain shadow-2xl" />
                    </div>
                  </div>
                </li>
                <li>
                  <strong className="text-white block mb-1">2. Import Operations</strong>
                  Reads a previously exported CSV file and restores the schedules back into SailPoint. 
                  <br /><br />
                  <strong>How it captures options:</strong> When the Workflow triggers, it first runs <code>Get-AggregationScheduleFiles.ps1</code> via PAG. This script scans the local directory for all <code>.csv</code> files and returns them as a JSON array of label/value pairs. This array is seamlessly mapped into the <code>inputForForm_array_importoptions</code> attribute of the Interactive Form, providing the user with a dynamic dropdown of all available export files.
                  <br /><br />
                  <strong>How updates are executed:</strong> Once a file is selected, the <code>Manage-AggregationSchedules.ps1</code> script is launched with the chosen filename. It imports the selected CSV, iterates through each row, and uses the API endpoint <code>/sources/v1/:id/schedules</code> to systematically <code>DELETE</code> any existing schedule and <code>POST</code> the restored CRON expressions back to each source.
                  <div className="my-6">
                    <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/Screenshot_Import_Form_Execution.png" alt="Import Form Execution" className="max-w-full h-auto object-contain shadow-2xl" />
                    </div>
                  </div>
                </li>
                <li>
                  <strong className="text-white block mb-1">3. Back Up And Remove All (Maintenance Mode)</strong>
                  A highly useful feature for maintenance windows. This action reads current schedules, securely backs them up directly into the Source object's <code>connectorAttributes</code>, and then deletes the active schedules, effectively "pausing" all aggregations tenant-wide.
                  <br /><br />
                  <strong>How the backup works:</strong> The script executes a <code>PATCH</code> request to the <code>/sources/v1/:id</code> endpoint to inject custom keys directly into the source's configuration. It saves the current CRON strings into two new variables: <code>BackUpAccountAggregationCRON</code> and <code>BackUpGroupAggregationCRON</code>. By utilizing <code>connectorAttributes</code>, the data stays safely attached to the source itself within SailPoint, preventing the need to manage external backup files during a maintenance window.
                  <div className="my-6">
                    <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/Screenshot_BackUpAndRemoveAll_Form_Execution.png" alt="Backup and Remove Form" className="max-w-full h-auto object-contain shadow-2xl" />
                    </div>
                  </div>
                </li>
                <li>
                  <strong className="text-white block mb-1">4. Restore All</strong>
                  Reads the backed-up CRON strings from the Source objects and re-activates all schedules, returning the tenant to normal operation.
                  <br /><br />
                  <strong>How the restore works:</strong> The script queries all sources and checks their <code>connectorAttributes</code>. If a source does not have these backup variables, the script safely skips it. If it finds them, it issues a <code>POST</code> request to recreate the schedule, followed by a final <code>PATCH</code> request (<code>op: "remove"</code>) to clean up the backup variables from the source configuration so no stale data is left behind.
                  <div className="my-6">
                    <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <img src="/images/Screenshot_RestoreAll_Form_Execution.png" alt="Restore All Form" className="max-w-full h-auto object-contain shadow-2xl" />
                    </div>
                  </div>
                </li>
              </ul>

              <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: Architectural Highlights</h3>
              <p className="text-slate-300 mb-4">
                When we architect this solution for our enterprise clients, we prioritize resilience, high performance, and strict API adherence:
              </p>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">High Performance (Parallel Processing):</strong> Iterating through hundreds of sources sequentially via REST APIs is incredibly slow. Our core engineering methodology utilizes PowerShell Runspace Pools (multi-threading) in the main script to process 10-15 sources concurrently, drastically reducing execution time from minutes to seconds.</li>
                <li><strong className="text-white">API Adherence:</strong> The scripts strictly adhere to SailPoint's newest API structures, specifically utilizing the <code>sources/v1</code> endpoint for patching source attributes, and the <code>sources/v1/:id/schedules</code> endpoint.</li>
                <li><strong className="text-white">Complete Audit Trail:</strong> The framework implements a comprehensive, timestamped logging structure. Every action, parameter, and API exception is logged to a <code>logs.txt</code> file in the script directory, providing perfect visibility for troubleshooting PAG executions.</li>
                <li><strong className="text-white">Error Handling & Resiliency:</strong> This modular framework ensures that your ISC deployment avoids rigid failure loops. Utilizing comprehensive <code>try...catch</code> blocks around all API calls, if an individual source fails to export or restore, the script logs a warning and gracefully continues processing the remaining sources rather than halting. A custom <code>Throw-Error</code> function is used to forcefully stop the script and alert the workflow only if a critical failure occurs, such as an authentication issue or a missing CSV file.</li>
              </ul>

              <h3 id="implementation-frameworks" className="text-2xl text-white mt-12 mb-4">Implementation Frameworks</h3>
              <p className="text-slate-300 mb-8">
                Below are the workflow diagrams and implementation files for deployment into your environment. You will need a configured PAG instance, valid SMTP credentials, and API Credentials with <code>idn:sources:manage</code> and <code>idn:sources:read</code> scopes.
              </p>

              <h4 className="text-xl text-white mt-10 mb-4">1. Toolkit Interactive Form</h4>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between mb-8">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formData, null, 2))}`}
                  download="Form-AggregationScheduleManager.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Manager Form
                </a>
              </div>

              <h4 className="text-xl text-white mt-10 mb-4">2. Main Workflow</h4>
              <div className="my-6">
                <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                  <img src="/images/AggregationScheduleManager20260809.png" alt="Main Workflow" className="max-w-full h-auto object-contain shadow-2xl" />
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowData, null, 2))}`}
                    download="Workflow-AggregationScheduleManager.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Manager Workflow
                  </a>
                </div>
              </div>
              
              <h4 className="text-xl text-white mt-10 mb-4">3. PowerShell Scripts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Get-AggregationScheduleFiles.ps1</span>
                  <a 
                    href="/scripts/Get-AggregationScheduleFiles.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Manage-AggregationSchedules.ps1</span>
                  <a 
                    href="/scripts/Manage-AggregationSchedules.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  By implementing this complete exporter and importer architecture, organizations can confidently execute bulk updates, perform safe maintenance pauses, and maintain strict version control of their aggregation schedules without writing a single line of ad-hoc API code. The operational agility gained ensures your environment remains pristine during disaster recovery and scheduled downtimes.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex aggregation-exporter-importer integrations, stop guessing.
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
