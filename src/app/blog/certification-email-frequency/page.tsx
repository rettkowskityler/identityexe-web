import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import Mermaid from '../../../components/Mermaid';
import form1Data from './Form-CertificationCampaignFrequencySelector.json';
import workflow1Data from './Workflow-CertificationReminderFrequency.json';

export default function CertificationEmailFrequencyPost() {
  const tocItems = [
    { id: 'business-context', label: 'The Problem: Rigid Reminders & Approval Fatigue' },
    { id: 'identityexe-blueprint', label: 'The IdentityEXE Blueprint: Customizable Cadence' },
    { id: 'user-interface', label: 'Interactive Launcher: The User Interface' },
    { id: 'backend-workflow', label: 'Back End Workflow Architecture' },
    { id: 'pta-scripts', label: 'Privileged Task Management (PTA) Scripts' },
    { id: 'configuration-downloads', label: 'Framework Downloads' },
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
              <span className="text-slate-400">Certification Emails</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>August 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Architecting Dynamic Certification Email Frequencies <br />
                <span className="text-brand-blue text-2xl md:text-3xl">(Stopping Approval Fatigue in Identity Security Cloud)</span>
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
              
              <h3 id="business-context" className="text-2xl text-white mt-8 mb-4">The Problem: Rigid Reminders & Approval Fatigue</h3>
              <p className="text-slate-300 mb-6">
                By default, SailPoint Identity Security Cloud (ISC) sends certification campaign reminders once a week, with no out-of-the-box (OOTB) capability to adjust the frequency or stop them automatically when a campaign is overdue. This rigid architectural limitation creates friction for organizations operating under aggressive compliance deadlines or specialized regulatory requirements.
              </p>
              <p className="text-slate-300 mb-6">
                Leaving this limitation unsolved has severe commercial and operational impacts. Without dynamic reminder cadences, reviewers often ignore weekly digests, leading to a massive deployment lag in campaign completions. This creates manager approval fatigue when they are eventually flooded with manual follow-ups, introduces security vulnerabilities from unreviewed access, and puts the organization at risk of failed compliance audits.
              </p>
              <p className="text-slate-300 mb-8">
                To overcome this, we rely on a repeatable architectural methodology designed by IdentityEXE. By unifying interactive forms, specialized workflows, and Privileged Task Management (PTA), this framework ensures your ISC deployment avoids rigid boundaries, giving you complete control over escalation timing and notification routing.
              </p>

              <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">The IdentityEXE Blueprint: Customizable Cadence</h3>
              <p className="text-slate-300 mb-6">
                When we architect this solution for our enterprise clients, we utilize a unified tech stack: <strong>1 Form + 1 Workflow + 2 PowerShell Scripts + 1 HTML Email Template</strong>.
              </p>
              <p className="text-slate-300 mb-8">
                Our core engineering methodology structures the data layer to allow administrators to select active campaigns dynamically, dictate immediate reminder actions, configure exact time intervals (in days), and safely halt execution based on campaign end dates. The workflow acts as the orchestration engine, calculating the required iterations and pausing through a serial loop while securely invoking PowerShell scripts via the Privileged Access Gateway.
              </p>

              <h3 id="user-interface" className="text-2xl text-white mt-12 mb-4">Interactive Launcher: The User Interface</h3>
              <p className="text-slate-300 mb-4">
                We use an interactive form to act as the launcher for the workflow. This allows administrators to quickly select target campaigns and define frequency parameters without hardcoding anything. The form utilizes dynamic showing/hiding so the campaign selector only appears if you opt not to select all active campaigns.
              </p>

              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-8">
                <li><strong className="text-white">Select All Active Campaigns Or Individual Campaigns:</strong> Toggle Field</li>
                <li><strong className="text-white">Campaign Selector:</strong> Dropdown Field (Only appears if the toggle above is set to false)</li>
                <li><strong className="text-white">Send Reminder Now?:</strong> Toggle Field (Controls whether to send an immediate reminder or wait until the first frequency interval hits)</li>
                <li><strong className="text-white">Stop on End Date?:</strong> Toggle Field (Controls whether notifications should stop if the campaign due date has passed)</li>
                <li><strong className="text-white">Select Time Frequency:</strong> Dropdown Field (1-15 Days)</li>
              </ul>

              <div className="my-10 flex flex-col items-center">
                <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden max-w-md w-full p-4">
                  <img 
                    src="/images/blog/certification-email-frequency/sample_form_run.png" 
                    alt="Interactive form for configuring reminder frequency"
                    className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                  />
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between max-w-md w-full">
                  <span className="text-slate-300 font-bold text-sm">Interactive Launcher UI</span>
                </div>
              </div>

              <h3 id="backend-workflow" className="text-2xl text-white mt-12 mb-4">Back End Workflow Architecture</h3>
              <p className="text-slate-300 mb-6">
                This modular framework ensures that your ISC deployment avoids infinite loop boundaries and formats all duration logic safely. Here is a visual representation of the orchestration:
              </p>

              <div className="bg-[#0d1117] rounded-lg p-6 overflow-x-auto mb-8 border border-white/10">
                <Mermaid chart={`flowchart TD
    A["Interactive Trigger"] --> B["Get Active Campaigns"]
    B --> C["Interactive Form Launcher"]
    C --> D["Set Variables and Format Time"]
    D --> E["Calculate-Iterations.ps1 via PTA"]
    E --> F["Serial Loop: Check Counter vs Iterations"]
    F -->|"True"| G{"Send Reminder Now and First Loop?"}
    F -->|"False"| Z["Workflow Complete"]
    G -->|"Yes"| H["Send-ReminderEmails.ps1 via PTA"]
    G -->|"No"| I["Wait Step Duration"]
    I --> J["Send-ReminderEmails.ps1 via PTA"]
    H --> K["Increment Counter"]
    J --> K
    K --> F`} />
              </div>

              <div className="my-10 flex flex-col items-center">
                <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden max-w-4xl w-full p-4">
                  <img 
                    src="/images/blog/certification-email-frequency/CertificationReminderFrequency20260801.png" 
                    alt="Workflow Architecture Diagram"
                    className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                  />
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between max-w-4xl w-full">
                  <span className="text-slate-300 font-bold text-sm">Identity Security Cloud Workflow Configuration</span>
                </div>
              </div>

              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Trigger & Setup:</strong> The workflow utilizes the <code>Interactive Trigger</code> so the form can be presented to the user. It first queries for active campaigns to populate the form dynamically.</li>
                <li><strong className="text-white">Time Conversion:</strong> The workflow handles duration formatting via a "Define Variable" step with string replacement transforms to convert the dropdown text ("3 Days") into a usable workflow duration format ("3d").</li>
                <li><strong className="text-white">Calculate Iterations:</strong> We execute a PowerShell script via Windows Server PTA integration to calculate how many loop iterations are required. It returns a JSON object with the <code>iterations</code> count.</li>
                <li><strong className="text-white">Serial Loop:</strong> A counter variable is initialized at 0. A "While" Serial Loop runs as long as the counter is less than the iterations. A Choice step evaluates the "Send Reminder Now?" flag, executing the reminder script immediately if true, or pausing via a Wait step if false.</li>
              </ul>

              <h3 id="pta-scripts" className="text-2xl text-white mt-12 mb-4">Privileged Task Management (PTA) Scripts</h3>
              <p className="text-slate-300 mb-6">
                Because there isn't an OOTB action to manually trigger campaign reminders in a workflow, we take complete ownership of the email delivery using PowerShell executed securely via PTA/PAG.
              </p>
              
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li>
                  <strong className="text-white">Calculate-Iterations.ps1:</strong> Connects to the ISC API to determine the furthest deadline among selected campaigns. Since SailPoint workflows have a hard maximum execution time of 30 days, the script natively caps the iteration timeline at 30 days to prevent failures.
                </li>
                <li>
                  <strong className="text-white">Send-ReminderEmails.ps1:</strong> Handles the heavy lifting of user aggregation and notification:
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Queries <code>/certifications/v1</code> for the target campaigns.</li>
                    <li>Filters out completed or signed-off certifications.</li>
                    <li>Groups pending certifications by <code>reviewer.id</code>.</li>
                    <li>Dynamically builds an HTML table string for each reviewer and replaces the placeholders in the HTML template.</li>
                    <li>Sends a single, consolidated SMTP email to each reviewer. A reviewer with three pending campaigns will only receive <strong>one</strong> email containing links to all of them.</li>
                  </ol>
                </li>
              </ul>

              <div className="my-10 flex flex-col items-center">
                <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden max-w-2xl w-full p-4">
                  <img 
                    src="/images/blog/certification-email-frequency/sample_email_reminder.png" 
                    alt="Sample Consolidated Email Reminder"
                    className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                  />
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between max-w-2xl w-full">
                  <span className="text-slate-300 font-bold text-sm">Consolidated HTML Email Output</span>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8 text-slate-300">
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Crucial Security & Configuration Considerations:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Update the SMTP settings inside the <code>Send-ReminderEmails.ps1</code> script with your organization's mail server details. Securely handle SMTP credentials.</li>
                  <li>Workflow executions only last 30 days in ISC. If your campaign exceeds this, you will need to retrigger the workflow.</li>
                  <li>Ensure the Client ID and Secret used in the scripts have the necessary permissions (e.g., ORG_ADMIN or specific Campaign read scopes).</li>
                </ul>
              </div>

              <h3 id="configuration-downloads" className="text-2xl text-white mt-12 mb-4">Framework Downloads</h3>
              <p className="text-slate-300 mb-8">
                Download the configuration files below to import directly into your Identity Security Cloud environment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">1. Form Definition</h4>
                    <p className="text-xs text-slate-400 mb-6">Interactive Launcher UI for administrators.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(form1Data, null, 2))}`}
                    download="Form-CertificationCampaignFrequencySelector.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Form-CertificationCampaignFrequencySelector.json
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">2. Workflow Definition</h4>
                    <p className="text-xs text-slate-400 mb-6">Core orchestration loop and script invocations.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflow1Data, null, 2))}`}
                    download="Workflow-CertificationReminderFrequency.json"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Workflow-CertificationReminderFrequency.json
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">3. Calculate Iterations Script</h4>
                    <p className="text-xs text-slate-400 mb-6">Determines optimal wait time and loop limit.</p>
                  </div>
                  <a 
                    href="/downloads/certification-email-frequency/Calculate-Iterations.ps1"
                    download="Calculate-Iterations.ps1"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Calculate-Iterations.ps1
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">4. Send Reminders Script</h4>
                    <p className="text-xs text-slate-400 mb-6">Aggregates campaigns and sends consolidated emails.</p>
                  </div>
                  <a 
                    href="/downloads/certification-email-frequency/Send-ReminderEmails.ps1"
                    download="Send-ReminderEmails.ps1"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Send-ReminderEmails.ps1
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between md:col-span-2">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">5. HTML Email Template</h4>
                    <p className="text-xs text-slate-400 mb-6">The visual layout for the consolidated email reminders sent to users.</p>
                  </div>
                  <a 
                    href="/downloads/certification-email-frequency/Email-Template.html"
                    download="Email-Template.html"
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto w-full md:w-1/2 mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Email-Template.html
                  </a>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex certification-email-frequency integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
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
