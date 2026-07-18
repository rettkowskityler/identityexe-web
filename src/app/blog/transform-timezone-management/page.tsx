import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

import estToUtc from './EST To UTC.json';
import utcToEst from './UTC To EST.json';
import enterDs from './EnterDaylightSavings20260717.json';
import exitDs from './ExitDaylightSavings20260717.json';
import getLocalMidnight from './Employee - Get Current Local Midnight.json';
import cloudLifecycleState from './Employee - CloudLifeCycleState.json';
import hireDate from './Employee - HireDate.json';
import endOfBusinessDay from './Employee - End of Business Day Disablement.json';
import contractorExpWarning from './Employee - Contractor Expiration Warning.json';
import inactive90Days from './Employee - Inactive for 90 Days.json';
import standardizeDate from './Employee - Standardize Date Format to UTC.json';

export default function TransformTimezoneManagementPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'implementation-framework', label: 'Implementation Framework' },
    { id: 'transform-use-cases', label: 'Transform Use Cases' },
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
              <a href="/" className="hover:text-brand-accent transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-brand-accent transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Managing Timezone Transforms</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              <span>July 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Managing Timezone Transforms & Daylight Savings <br />
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

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-accent hover:prose-a:text-brand-light prose-code:text-brand-light prose-code:bg-brand-blue/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
            
            <h3 id="executive-summary" className="text-2xl text-white mt-8 mb-4">Executive Summary</h3>
            <p className="text-slate-300 mb-4">
              If your engineering team manages time-dependent logic in SailPoint Identity Security Cloud (ISC), you likely know the severe architectural limitation of daylight savings time. Hardcoding offsets like <code>+5h</code> in a <code>dateMath</code> transform works perfectly until the time changes. Once daylight savings begins or ends, your local midnight calculations, grace periods, and lifecycle states start triggering an hour early or an hour late, breaking time-dependent logic across your tenant.
            </p>
            <p className="text-slate-300 mb-4">
              When this architectural limitation remains unsolved, the operational impact is immense. If a timezone shift miscalculates a termination date by a single day, it creates a severe security vulnerability. Manager approvals and contractor expiration warnings trigger at the wrong times, causing severe manager approval fatigue and missed SLAs. Ultimately, compliance audits fail because critical offboarding workflows aren't executed exactly at local midnight or the end of the business day.
            </p>
            <p className="text-slate-300 mb-8">
              To resolve this permanently, IdentityEXE engineered a repeatable architectural methodology. This is not just a one-off script, but a dynamic framework utilizing scheduled Workflows to automatically update base timezone Transforms when daylight savings occurs, ensuring all nested date calculations remain accurate year-round.
            </p>

            <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Tech Stack:</strong> 2 Workflows + 2 Base Transforms.</li>
              <li><strong className="text-white">High-Level Flow:</strong> We establish two foundational transforms: <code>EST To UTC</code> and <code>UTC To EST</code>. All other time-based transforms reference these two base transforms instead of hardcoding their own offsets. We then deploy two scheduled Workflows—one for entering daylight savings and one for exiting. These workflows automatically run on the specific Sundays when time changes and use the ISC API to update the <code>dateMath</code> expressions inside our base transforms.</li>
              <li><strong className="text-white">Global Scalability:</strong> <em>Note: This blueprint assumes a single timezone (EST/EDT) for simplicity. If your tenant supports global users, you would incorporate a lookup transform to map the correct offset based on the user's location.</em></li>
            </ul>

            <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: Base Components</h3>
            <p className="text-slate-300 mb-6">
              When we architect this solution for our enterprise clients, we utilize a single source of truth for timezone offsets. First, you need to create the two base transforms that will act as the foundation for your architecture.
            </p>

            <h4 className="text-xl text-white mt-10 mb-4">1. Base Transforms</h4>
            
            <p className="text-slate-300 mb-4"><strong>EST To UTC Transform:</strong></p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`{
  "id": "d9df51b1-5d08-43ac-9e8a-7069e17282b7",
  "name": "EST To UTC",
  "type": "dateMath",
  "attributes": {
    "expression": "+5h"
  },
  "internal": false
}`}</code></pre>
            </div>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(estToUtc, null, 2))}`}
                download="EST To UTC.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                EST To UTC.json
              </a>
            </div>

            <p className="text-slate-300 mb-4"><strong>UTC To EST Transform:</strong></p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`{
  "id": "71f3f59a-8172-4cc4-a08e-b0960c8e7604",
  "name": "UTC To EST",
  "type": "dateMath",
  "attributes": {
    "expression": "-5h"
  },
  "internal": false
}`}</code></pre>
            </div>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(utcToEst, null, 2))}`}
                download="UTC To EST.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                UTC To EST.json
              </a>
            </div>

            <h3 id="implementation-framework" className="text-2xl text-white mt-12 mb-4">Implementation Framework: Automated Workflows</h3>
            <p className="text-slate-300 mb-6">
              Our core engineering methodology structures the data layer to automatically manage the offset shift. We configure the workflows that handle the offset adjustments. The "Enter Daylight Savings" workflow triggers yearly on the second Sunday of March, while the "Exit Daylight Savings" workflow triggers on the first Sunday of November.
            </p>
            <p className="text-slate-300 mb-6">
              Both workflows utilize the <code>sp:http</code> action to send PUT requests to the <code>/transforms/v1/&#123;id&#125;</code> endpoint, updating the <code>dateMath</code> expressions (e.g., changing <code>-5h</code> to <code>-4h</code>). The JSON body payload for the API call looks like this:
            </p>

            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`{
  "name": "EST To UTC",
  "type": "dateMath",
  "attributes": {
    "expression": "+4h"
  }
}`}</code></pre>
            </div>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/EnterDaylightSavings20260717.png" 
                  alt="Enter Daylight Savings Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Workflow Configurations:</span>
                <div className="flex gap-2">
                  <a 
                    href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(enterDs, null, 2))}`}
                    download="EnterDaylightSavings20260717.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Enter DS.json
                  </a>
                  <a 
                    href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(exitDs, null, 2))}`}
                    download="ExitDaylightSavings20260717.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Exit DS.json
                  </a>
                </div>
              </div>
            </div>

            <p className="text-slate-300 mt-8 mb-6">
              If the API calls fail or succeed, the workflow catches the result and sends an alert email to the IAM team. This modular framework ensures that your ISC deployment avoids silent failures and the engineering team is well-aware that the offset adjustments went through smoothly!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <img src="/images/Enter_Daylight_Savings_Email_Success_Screenshot.png" alt="Email Success" className="rounded-lg shadow-xl" />
              <img src="/images/Enter_Daylight_Savings_Email_Failure_Screenshot.png" alt="Email Failure" className="rounded-lg shadow-xl" />
            </div>

            <h3 id="transform-use-cases" className="text-2xl text-white mt-12 mb-4">Transform Use Cases</h3>
            <p className="text-slate-300 mb-6">
              Now that the foundation is set, you can build reliable, timezone-aware transforms. Here are practical examples of how to utilize the base transforms. Notice how each date math expression leverages rounding <code>/d</code> to dynamically interact with midnight.
            </p>

            <div className="bg-brand-accent/10 border-l-4 border-brand-accent p-4 mb-8">
              <p className="text-slate-300 text-sm m-0">
                <strong>Important Note:</strong> In these examples, the <code>accountAttribute</code> fetches are wrapped in a <code>firstValid</code> to handle empty fields and prevent <code>AttributePromotionException</code> errors. They are then wrapped in a <code>dateFormat</code> to standardize the incoming string into <code>ISO8601</code>. The <code>dateMath</code> engine strictly requires ISO8601 formatted strings to perform timezone math successfully!
              </p>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">1. Get Current Local Midnight</h4>
            <p className="text-slate-300 mb-4">
              Standardizes a date so that it evaluates exactly to local midnight rather than shifting by UTC hours. The core of this logic uses the <code>dateMath</code> expression <code>"/d"</code>, which rounds the provided date down to the start of the day (midnight).
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(getLocalMidnight, null, 2))}`}
                download="Employee - Get Current Local Midnight.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">2. Cloud Life Cycle State</h4>
            <p className="text-slate-300 mb-4">
              Compares the user's termination date against the current local date to calculate their lifecycle state. The magic here is using the <code>dateMath</code> expression <code>"now"</code> wrapped with the <code>EST To UTC</code> / <code>UTC To EST</code> logic and rounding down via <code>"/d"</code>. This ensures evening timezone offsets do not trigger terminations a day early.
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(cloudLifecycleState, null, 2))}`}
                download="Employee - CloudLifeCycleState.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">3. HireDate (First Hour of Start Day)</h4>
            <p className="text-slate-300 mb-4">
              Uses local timezone boundaries to reliably calculate the first hour of a user's start day, such as 1:00 AM local time. This is done by appending <code>+1h</code> to the date rounding: <code>"/d+1h"</code>.
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(hireDate, null, 2))}`}
                download="Employee - HireDate.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">4. End of Business Day Disablement</h4>
            <p className="text-slate-300 mb-4">
              Calculates exactly 5:00 PM (17:00) in the local timezone for a given date to enforce grace periods before disabling an account. The <code>dateMath</code> logic dynamically adds 17 hours after rounding: <code>"+17h/d"</code>.
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(endOfBusinessDay, null, 2))}`}
                download="Employee - End of Business Day Disablement.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">5. Contractor Expiration Warning</h4>
            <p className="text-slate-300 mb-4">
              Calculates exactly 8:00 AM local time, 7 days prior to a contractor's end date, ensuring expiration warnings go out at the correct time regardless of the season. This expression is slightly more complex, utilizing <code>"-7d/d+8h"</code> to manipulate the target time precisely.
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(contractorExpWarning, null, 2))}`}
                download="Employee - Contractor Expiration Warning.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">6. Inactive for 90 Days</h4>
            <p className="text-slate-300 mb-4">
              Rounds the user's last login date down to local midnight and subtracts 90 days to establish an exact, timezone-aware threshold for stale account cleanups. We achieve this by simply subtracting 90 days from the rounded date: <code>"-90d/d"</code>.
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(inactive90Days, null, 2))}`}
                download="Employee - Inactive for 90 Days.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">7. Standardize Date Format to UTC</h4>
            <p className="text-slate-300 mb-4">
              Properly ingests localized date strings and shifts them to represent local midnight in UTC format so ISC correctly anchors the date. This requires no custom math expressions, only standardizing the incoming format before it runs through the <code>EST To UTC</code> transform.
            </p>
            <div className="flex gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(standardizeDate, null, 2))}`}
                download="Employee - Standardize Date Format to UTC.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Code
              </a>
            </div>

            <h3 id="considerations-practices" className="text-2xl text-white mt-12 mb-4">Considerations & Best Practices: <code>requiresPeriodicRefresh</code></h3>
            <p className="text-slate-300 mb-4">
              You might notice that the Cloud Life Cycle State example uses the <code>"requiresPeriodicRefresh": true</code> attribute as a boolean. This is a critical parameter when working with time-dependent logic.
            </p>
            
            <p className="text-slate-300 mb-2"><strong>What it does:</strong></p>
            <p className="text-slate-300 mb-4">
              It allows the transform to be checked at the nightly refresh, even if no upstream account data changed. Note that ISC will always perform the daily 8 AM refresh whether this flag is set or not. It is designed for values that can change organically over time.
            </p>

            <p className="text-slate-300 mb-2"><strong>When to use it:</strong></p>
            <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
              <li>Time-dependent logic (e.g., age/tenure bands, grace-period flags, or "isContractEndingIn30Days").</li>
              <li>Calculations using "now" or the current date.</li>
              <li>Any output that should update on a cadence regardless of new source events.</li>
            </ul>

            <p className="text-slate-300 mb-2"><strong>When NOT to use it:</strong></p>
            <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
              <li>Simple mappings like <code>accountAttribute</code>, <code>firstValid</code>, or string manipulation that only change when source attributes change.</li>
              <li>Static defaults and normalization that do not depend on time.</li>
            </ul>

            <p className="text-slate-300 mb-8">
              Be selective when enabling this flag. Turning it on everywhere forces the Identity Refresh process to do extra work for no benefit, which can noticeably increase your refresh duration and queue load.
            </p>

            <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4">Conclusion</h3>
            <p className="text-slate-300 mb-8">
              Handling timezone offsets and daylight savings inside ISC transforms does not have to be a manual headache. By centralizing your offsets into two base transforms and automating their updates via scheduled workflows, you can build a robust date calculation architecture that works flawlessly year-round.
            </p>

            {/* CTA Section */}
            <div className="mt-16 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-accent/20 border border-brand-blue/30 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors duration-500"></div>
              <h4 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10">Stop Guessing with Identity Governance</h4>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10 text-lg">
                A stalled identity governance rollout burns capital and stalls organizational momentum. If your team is hitting configuration walls or struggling with complex transform-timezone-management integrations, stop guessing.
              </p>
              <a href="/contact" className="inline-block bg-brand-accent hover:bg-white text-white hover:text-brand-accent font-black py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(255,107,0,0.5)] relative z-10">
                Book Your SailPoint Architecture Review
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
