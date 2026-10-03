import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

export const metadata: Metadata = {
  title: "Comprehensive SailPoint Source Health Reporting & Automated Incident Alerting | IdentityEXE",
  description: "A repeatable architectural methodology designed by IdentityEXE to continuously audit tenant-wide source health across eight core operations, detect silent aggregation and provisioning failures, and dispatch automated ITSM incident alerts.",
  alternates: {
    canonical: 'https://identityexe.com/blog/comprehensive-source-reporting',
  },
  openGraph: {
    title: "Comprehensive SailPoint Source Health Reporting & Automated Incident Alerting | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to continuously audit tenant-wide source health across eight core operations, detect silent aggregation and provisioning failures, and dispatch automated ITSM incident alerts.",
    url: 'https://identityexe.com/blog/comprehensive-source-reporting',
    type: 'article',
    siteName: 'IdentityEXE',
    images: [
      {
        url: '/images/blog/comprehensive-source-reporting/opengraph-image.png',
        width: 1200,
        height: 1200,
        alt: 'SailPoint Source Health Reporting Architecture - IdentityEXE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Comprehensive SailPoint Source Health Reporting & Automated Incident Alerting | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to continuously audit tenant-wide source health across eight core operations, detect silent aggregation and provisioning failures, and dispatch automated ITSM incident alerts.",
    images: ['/images/blog/comprehensive-source-reporting/opengraph-image.png'],
  },
};

export default function ComprehensiveSourceReportingPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'architecture-flow', label: 'Architecture & High-Level Flow' },
    { id: 'monitored-operations', label: 'Monitored Operations & Capability Detection' },
    { id: 'pagination-architecture', label: 'Data Completeness & Pagination Architecture' },
    { id: 'reporting-ticketing', label: 'Executive Reporting & ITSM Incident Ticketing' },
    { id: 'workflow-pag-canvas', label: 'SailPoint Workflow & PAG Canvas' },
    { id: 'code-highlights', label: 'Key Code Highlights & Implementation Choices' },
    { id: 'best-practices', label: 'Considerations & Production Best Practices' },
    { id: 'implementation-downloads', label: 'Downloads & Implementation Code' },
    { id: 'conclusion', label: 'Conclusion & Architecture Review' }
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
              <span className="text-slate-400">Comprehensive Source Reporting</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>October 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Comprehensive SailPoint Source Health Reporting <br />
                <span className="text-brand-blue text-2xl md:text-3xl">(Automated Incident Alerting & Operational Resilience)</span>
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
              
              {/* Executive Summary */}
              <h3 id="executive-summary" className="text-2xl text-white !mt-0 mb-4">Executive Summary</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                In SailPoint Identity Security Cloud (ISC), seeing a green &quot;Healthy&quot; badge on a connected source in the administrative console creates a dangerous operational illusion. That status indicator reflects nothing more than a successful connectivity ping between the Cloud Connector Gateway (CCG) or SaaS connector and the target managed endpoint. It merely verifies network reachability. The out-of-the-box health check is entirely blind to silent operational failures: scheduled account aggregations failing on unhandled filestream locks or schema parse errors, entitlement aggregations failing to sync newly created security groups, automated account provisioning actions (Create, Modify, Disable, Enable, Delete) aborting due to LDAP schema constraints or expired service account credentials, and attribute synchronization failing to push authoritative changes down to managed applications.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Leaving this architectural blind spot unaddressed inflicts severe commercial and operational damage. When provisioning actions fail silently, day-one onboarding grinds to a halt—leaving high-value employees sitting idle without essential tools and sparking high-priority escalations to already strained service desk teams. Even more dangerous are silent termination failures: when an employee separates and automated disable or delete actions fail under the radar, privileged access remains orphaned and active in downstream systems. During SOX, SOC 2, and ISO 27001 audit cycles, auditors uncover these discrepancies, resulting in catastrophic audit findings and compliance penalties. Meanwhile, IAM engineering teams waste hundreds of unplanned hours hunting through fragmented tenant logs, and IT leadership faces severe manager approval fatigue over phantom and desynchronized accounts.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                IdentityEXE engineered the <strong className="text-white">Tenant Source Health & Operational Resilience Framework</strong>, a repeatable architectural methodology designed to deliver holistic, real-time operational governance across every connected source in SailPoint ISC. Rather than relying on manual audits or isolated scripts, this implementation framework unites scheduled SailPoint Workflows, secure execution through the Privileged Action Gateway (PAG), and a high-performance PowerShell auditing engine. It dynamically interrogates connector capabilities across eight core operations, enforces high-volume pagination safeguards across the Task-Status and Search APIs, calculates real-time operational error percentages, flags any source breaching a 3% failure threshold, and delivers an executive HTML operations matrix alongside automated, targeted ITSM incident dispatch directly into your enterprise service desk.
              </p>

              {/* Solution Overview */}
              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Tech Stack:</strong> 1 Scheduled SailPoint Workflow + 1 PowerShell Automation Engine + 2 Modular HTML Templates + CSV Audit Export.</li>
                <li><strong className="text-white">Execution Plane:</strong> Runs on a scheduled cadence within SailPoint Workflows and executes via the Privileged Action Gateway (PAG) on a secured Windows Server host over WinRM.</li>
                <li><strong className="text-white">High-Level Flow:</strong> The automation authenticates to ISC via OAuth 2.0 client credentials, discovers and caches all tenant sources, dynamically discovers source capabilities, audits recent task statuses and search audit logs across a configurable lookback window (default 24 hours), computes granular error percentages per operation and source, and delivers rich HTML notifications alongside an audit-ready CSV.</li>
                <li><strong className="text-white">ITSM Incident Integration:</strong> In addition to an executive summary email sent to the identity administration distribution list, the engine can be configured to automatically dispatch individual, contextual incident emails directly to service desk queues (e.g., ServiceNow, Jira Service Management, Freshservice) for any source breaching the error threshold.</li>
              </ul>

              <div className="bg-[#0d1117] border border-brand-blue/30 border-l-4 border-l-brand-blue rounded-r-xl p-5 mb-8">
                <h4 className="text-brand-blue font-bold mb-2 flex items-center gap-2 text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Enterprise Architecture Note: The "Silent Failure" Trap
                </h4>
                <p className="text-sm text-slate-300 mb-0 leading-relaxed font-light">
                  When we architect this solution for our enterprise clients, we frequently encounter organizations that have experienced multi-month aggregation blind spots. A connector reported &quot;Healthy&quot; in the UI while its cron aggregation schedule had been failing on a filestream lock every single midnight. By auditing the actual execution records from the Task-Status and Search APIs, this framework guarantees that operational reality matches administrative expectations.
                </p>
              </div>

              {/* Architecture & High-Level Flow */}
              <h3 id="architecture-flow" className="text-2xl text-white mt-12 mb-4">Architecture & High-Level Flow</h3>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                Our core engineering methodology structures the data layer to isolate capability discovery from health auditing, preventing false positive alarms while guaranteeing 100% event capture across high-volume enterprise tenants.
              </p>

              <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 mb-8 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto shadow-2xl">
                <div className="text-brand-accent font-bold mb-4 font-sans text-base">Framework Execution Topology</div>
                <div className="space-y-3 leading-relaxed">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">1</span>
                    <span><strong>Scheduled Workflow Trigger:</strong> Fires on a configurable cron schedule (e.g., daily at 06:00 UTC).</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">2</span>
                    <span><strong>Execute Script via PAG:</strong> Securely transmits parameters to PowerShell engine hosted on Windows Server.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">3</span>
                    <span><strong>OAuth 2.0 Authentication:</strong> Acquires JWT bearer token via Client Credentials grant with least-privilege scopes.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">4</span>
                    <span><strong>Discover & Cache Sources:</strong> Queries <code className="text-brand-light">/sources/v1</code> using offset pagination (batch: 250).</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">5</span>
                    <span><strong>Capability Discovery:</strong> Inspects cron aggregation schedules, connector feature flags, and attribute sync configurations.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">6</span>
                    <span><strong>Health Auditing (Last 24h):</strong> Queries <code className="text-brand-light">/task-status/v1</code> (reverse chronological) and <code className="text-brand-light">/search/v1</code> (cursor-based <code className="text-brand-light">searchAfter</code>).</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">7</span>
                    <span><strong>Dual-Threshold Evaluation:</strong> Evaluates individual operation error rates and combined source error rates against 3.0% threshold.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">8</span>
                    <span><strong>Reporting & ITSM Dispatch:</strong> Generates CSV audit log, sends executive HTML summary email, and dispatches incident tickets.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/20 text-brand-light flex items-center justify-center font-bold shrink-0">9</span>
                    <span><strong>Workflow Telemetry Return:</strong> Emits compressed JSON payload to standard output for downstream workflow decisioning.</span>
                  </div>
                </div>
              </div>

              {/* Monitored Operations & Capability Detection */}
              <h3 id="monitored-operations" className="text-2xl text-white mt-12 mb-4">Monitored Operations & Capability Detection</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                A primary engineering challenge when auditing source health across an entire enterprise tenant is preventing false positives. In complex environments managing hundreds of sources, you cannot simply evaluate every operation against every source. For example, auditing account creation against an authoritative flat-file HR source that does not support provisioning would produce false error alerts.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                This modular framework ensures that your ISC deployment avoids false alarms by evaluating the active capabilities of each source prior to evaluating task or search telemetry:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse text-sm text-slate-300 border border-white/10">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-white font-bold text-xs uppercase tracking-wider">
                      <th className="p-3 border-r border-white/10">Operation</th>
                      <th className="p-3 border-r border-white/10">Capability Verification Method</th>
                      <th className="p-3">Health Evaluation API Surface</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-light">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Account Aggregation</td>
                      <td className="p-3 border-r border-white/10">Validates if cron schedule exists (<code className="text-xs">type == ACCOUNT_AGGREGATION</code> via <code className="text-xs">/sources/:id/schedules</code>)</td>
                      <td className="p-3"><code className="text-xs">/task-status/v1</code> filtered by <code className="text-xs">Cloud Account Aggregation</code></td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Entitlement Aggregation</td>
                      <td className="p-3 border-r border-white/10">Validates if cron schedule exists (<code className="text-xs">type == GROUP_AGGREGATION</code> via <code className="text-xs">/sources/:id/schedules</code>)</td>
                      <td className="p-3"><code className="text-xs">/task-status/v1</code> filtered by <code className="text-xs">Cloud Group Aggregation</code></td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Create Account</td>
                      <td className="p-3 border-r border-white/10">Checks if connector features contain <code className="text-xs">PROVISIONING</code> or <code className="text-xs">CREATE</code> (via <code className="text-xs">/sources/v1</code>)</td>
                      <td className="p-3"><code className="text-xs">/search/v1</code> (<code className="text-xs">accountactivities</code> index: <code className="text-xs">accountRequests.op == &quot;Create&quot;</code>)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Modify Account</td>
                      <td className="p-3 border-r border-white/10">Checks if connector features contain <code className="text-xs">PROVISIONING</code> or <code className="text-xs">UPDATE</code> (via <code className="text-xs">/sources/v1</code>)</td>
                      <td className="p-3"><code className="text-xs">/search/v1</code> (<code className="text-xs">accountactivities</code> index: <code className="text-xs">accountRequests.op == &quot;Modify&quot;</code>, excluding Attribute Sync)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Disable Account</td>
                      <td className="p-3 border-r border-white/10">Checks if connector features contain <code className="text-xs">ENABLE</code>, <code className="text-xs">DISABLE</code>, or <code className="text-xs">PROVISIONING</code></td>
                      <td className="p-3"><code className="text-xs">/search/v1</code> (<code className="text-xs">accountactivities</code> index: <code className="text-xs">accountRequests.op == &quot;Disable&quot;</code>)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Enable Account</td>
                      <td className="p-3 border-r border-white/10">Checks if connector features contain <code className="text-xs">ENABLE</code> or <code className="text-xs">PROVISIONING</code></td>
                      <td className="p-3"><code className="text-xs">/search/v1</code> (<code className="text-xs">accountactivities</code> index: <code className="text-xs">accountRequests.op == &quot;Enable&quot;</code>)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Delete Account</td>
                      <td className="p-3 border-r border-white/10">Checks if connector features contain <code className="text-xs">DELETE</code> or <code className="text-xs">PROVISIONING</code></td>
                      <td className="p-3"><code className="text-xs">/search/v1</code> (<code className="text-xs">accountactivities</code> index: <code className="text-xs">accountRequests.op == &quot;Delete&quot;</code>)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white border-r border-white/10">Attribute Sync</td>
                      <td className="p-3 border-r border-white/10">Queries <code className="text-xs">/sources/:id/attribute-sync-config</code> for enabled synchronized attributes</td>
                      <td className="p-3"><code className="text-xs">/search/v1</code> (<code className="text-xs">accountactivities</code> index: activity <code className="text-xs">action == &quot;Attribute Sync&quot;</code>)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                In the generated executive reports and operations health matrix, each operation is categorized into one of four deterministic states:
              </p>
              <ul className="space-y-2 text-slate-300 mb-8 list-disc pl-5 font-light">
                <li><strong className="text-slate-400">DISABLED:</strong> The source does not support this operation or does not have it configured (e.g., no aggregation schedule exists, or provisioning feature flags are absent).</li>
                <li><strong className="text-slate-300">IDLE:</strong> The capability is active and configured, but zero execution runs occurred during the lookback window.</li>
                <li><strong className="text-emerald-400">OK (X):</strong> The capability is active, with <code className="text-xs">X</code> runs completed and zero failures detected.</li>
                <li><strong className="text-red-400">X/Y (Z%):</strong> Failures were detected during the window, displaying failed runs (<code className="text-xs">X</code>), total runs (<code className="text-xs">Y</code>), and the calculated error percentage (<code className="text-xs">Z%</code>).</li>
              </ul>

              {/* Data Completeness & Pagination Architecture */}
              <h3 id="pagination-architecture" className="text-2xl text-white mt-12 mb-4">Data Completeness & Pagination Architecture</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                In enterprise tenants managing hundreds of sources and tens of thousands of daily provisioning actions, simple API queries fall victim to payload limits, timeouts, or silent data truncation. To guarantee complete visibility, the engine implements three distinct pagination techniques:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-5 shadow-lg">
                  <div className="text-brand-accent text-xs font-bold uppercase tracking-wider mb-2">Endpoint 1</div>
                  <h4 className="text-lg font-bold text-white mb-2">Offset Pagination (/sources/v1)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                    Sources are gathered in batches of 250 records using standard <code className="text-brand-light">limit</code> and <code className="text-brand-light">offset</code> parameters, indexed into in-memory lookup dictionaries for instant access during task processing.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">Deduplication: In-memory ID hash table</div>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-5 shadow-lg">
                  <div className="text-brand-accent text-xs font-bold uppercase tracking-wider mb-2">Endpoint 2</div>
                  <h4 className="text-lg font-bold text-white mb-2">Reverse Chronological (/task-status/v1)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                    Task statuses are gathered using <code className="text-brand-light">sorters=-created</code>. The engine terminates pagination immediately as soon as a task falls outside the lookback window (e.g., 24h), eliminating redundant API calls.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">Deduplication: HashSet[string] boundary guard</div>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-5 shadow-lg">
                  <div className="text-brand-accent text-xs font-bold uppercase tracking-wider mb-2">Endpoint 3</div>
                  <h4 className="text-lg font-bold text-white mb-2">Cursor-Based (/search/v1)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                    Standard offset pagination on Search fails due to Elasticsearch&apos;s hard 10,000 document maximum window. The script uses cursor-based pagination with <code className="text-brand-light">searchAfter</code> sorted by <code className="text-brand-light">[-created, id]</code>.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">Deduplication: Tiebreaker cursor + ID set</div>
                </div>
              </div>

              {/* Executive Reporting & ITSM Incident Ticketing */}
              <h3 id="reporting-ticketing" className="text-2xl text-white mt-12 mb-4">Executive Reporting & ITSM Incident Ticketing</h3>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                The solution produces three distinct outputs tailored for administrators, compliance auditors, and automated service desk queues:
              </p>

              <h4 className="text-xl text-white mt-8 mb-3">1. Executive Summary HTML Email</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                The primary deliverable is an executive-ready HTML email summary delivered to the identity engineering distribution list. It provides an immediate pulse on tenant health with zero administrative friction:
              </p>

              <div className="my-6 bg-[#0d1117] rounded-2xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                <img 
                  src="/images/blog/comprehensive-source-reporting/Screenshot_ALERT_EMAIL.png" 
                  alt="Executive Summary Email Report" 
                  className="w-full h-auto rounded-xl object-contain" 
                />
                <span className="text-xs text-slate-400 block mt-2 text-center py-1">
                  Executive HTML Health Report displaying KPI metrics, breached sources requiring immediate attention, and the full operational health matrix.
                </span>
              </div>

              <ul className="space-y-2 text-slate-300 mb-8 list-disc pl-5 font-light">
                <li><strong className="text-white">Dynamic Header & Status Badge:</strong> Instantly alerts the team whether all tenant operations are compliant or if sources have breached the threshold.</li>
                <li><strong className="text-white">KPI Metrics Bar:</strong> Summarizes total evaluated sources, healthy sources, breached sources, total operational runs, total failures, and the aggregate tenant error rate.</li>
                <li><strong className="text-white">Breached Sources Requiring Attention Table:</strong> Surfaces only the sources exceeding the threshold, listing their specific failing operations, failure counts, and exact error percentages.</li>
                <li><strong className="text-white">Source Operations Health Matrix:</strong> Displays a clean, color-coded grid mapping all tenant sources across every monitored capability.</li>
              </ul>

              <h4 className="text-xl text-white mt-10 mb-3">2. Automated Incident Ticketing (Service Desk / ITSM Integration)</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Discovering failures in an email report is helpful, but automatically routing them to your incident management system is critical for enterprise governance. When the <code className="text-brand-light">-CreateTickets</code> parameter is enabled and a <code className="text-brand-light">-TicketEmailToSendTo</code> address is provided (e.g., ServiceNow, Jira Service Management, or Freshservice inbound mailbox), the engine dispatches individual incident tickets:
              </p>

              <div className="my-6 bg-[#0d1117] rounded-2xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                <img 
                  src="/images/blog/comprehensive-source-reporting/Screenshot_INCIDENT_EMAIL.png" 
                  alt="Automated Incident Ticket Email" 
                  className="w-full h-auto rounded-xl object-contain" 
                />
                <span className="text-xs text-slate-400 block mt-2 text-center py-1">
                  Automated incident ticket email containing source context, connector type, calculated error percentage, and raw task exception traces.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4">
                  <strong className="text-white text-sm block mb-1">Strictly Threshold-Gated</strong>
                  <p className="text-xs text-slate-400 font-light mb-0">Tickets are created exclusively for sources breaching the configured error rate (default 3%). Healthy sources never create noise in service desk queues.</p>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4">
                  <strong className="text-white text-sm block mb-1">One Ticket Per Breached Source</strong>
                  <p className="text-xs text-slate-400 font-light mb-0">Isolates failures so distinct application administration teams can take ownership of specific connector incidents independently.</p>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4">
                  <strong className="text-white text-sm block mb-1">Target System Context</strong>
                  <p className="text-xs text-slate-400 font-light mb-0">Provides Source Name, Source ID, Connector Type, and calculated error rate in a clean, structured table for immediate routing.</p>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4">
                  <strong className="text-white text-sm block mb-1">Detailed Exception Traces</strong>
                  <p className="text-xs text-slate-400 font-light mb-0">Includes raw task error messages and connector exception logs (e.g., file not found, bad credentials, LDAP timeouts) directly in the ticket.</p>
                </div>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">3. Audit-Grade CSV Report</h4>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                Attached directly to the executive email and saved locally on the script host is a timestamped CSV report (<code className="text-brand-light">Source_Health_Report_YYYYMMDD_HHmmss.csv</code>). This file provides compliance teams with an immutable audit log containing every source, operation status, total runs, failure counts, calculated error rates, and last activity timestamps.
              </p>

              {/* SailPoint Workflow & PAG Canvas */}
              <h3 id="workflow-pag-canvas" className="text-2xl text-white mt-12 mb-4">SailPoint Workflow & PAG Canvas</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                The automation is orchestrated natively within SailPoint ISC through a scheduled workflow that invokes the script execution via the Privileged Action Gateway (PAG):
              </p>

              <div className="my-6 bg-[#0d1117] rounded-2xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                <img 
                  src="/images/blog/comprehensive-source-reporting/SourceHealthReporting20261002.png" 
                  alt="SailPoint Workflow Canvas" 
                  className="w-full h-auto rounded-xl object-contain" 
                />
                <span className="text-xs text-slate-400 block mt-2 text-center py-1">
                  Complete visual canvas mapping of the scheduled source health workflow and PAG execution routing.
                </span>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">Workflow Step Walkthrough:</h4>
              <ol className="space-y-3 text-slate-300 mb-8 list-decimal pl-5 font-light">
                <li><strong className="text-white">Scheduled Trigger:</strong> Configured on a recurring cron schedule (e.g., daily at 6:00 AM UTC or hourly during major deployment windows).</li>
                <li>
                  <strong className="text-white">Set Parameters (Define Variable Operator):</strong> Establishes dynamic runtime parameters directly inside the workflow UI so operators avoid editing underlying script files:
                  <ul className="list-circle pl-5 mt-2 space-y-1 text-xs text-slate-400 font-mono">
                    <li>EmailToSendTo: &quot;identity-team@yourcompany.com&quot;</li>
                    <li>ErrorThresholdPercent: &quot;3.0&quot;</li>
                    <li>LookbackHours: &quot;24&quot;</li>
                    <li>ExcludedSources: &quot;Decommissioned App, Sandbox Active Directory&quot;</li>
                    <li>CreateTickets: &quot;true&quot;</li>
                    <li>TicketEmailToSendTo: &quot;servicedesk-incidents@yourcompany.com&quot;</li>
                  </ul>
                </li>
                <li><strong className="text-white">Execute PowerShell Script (PAG Windows Server Action):</strong> Transmits an execution command over secure WinRM to the Windows Server hosting PAG, passing dynamic workflow variables as script parameters.</li>
                <li><strong className="text-white">Error Handling (Catch Path):</strong> If the host server is unreachable or the command times out, the workflow routes gracefully to an <code className="text-xs text-red-400">End Step - Failure</code> node.</li>
                <li><strong className="text-white">Check For Success (Compare Multi-Type Choice Operator):</strong> Inspects the JSON payload emitted by the script to confirm that <code className="text-xs text-brand-light">$.windowsServer.result.data.status == &quot;success&quot;</code>.</li>
                <li><strong className="text-white">Terminal Nodes:</strong> Routes cleanly to <code className="text-xs text-emerald-400">End Step - Success</code> or <code className="text-xs text-red-400">End Step - Failure 1</code> based on execution telemetry.</li>
              </ol>

              <h4 className="text-xl text-white mt-8 mb-3">Workflow Output JSON Payload</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Upon completion, the PowerShell engine emits a compressed JSON payload to standard output, providing downstream workflow nodes with complete operational visibility:
              </p>

              <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-300 mb-6">
                <code>{`{
  "status": "success",
  "tenant": "your-tenant",
  "alertTriggered": true,
  "errorThresholdPercent": 3,
  "lookbackHours": 24,
  "sourcesEvaluated": 15,
  "sourcesExcluded": 1,
  "sourcesBreached": 1,
  "sourcesWithWarnings": 0,
  "healthySources": 13,
  "totalOperationsRuns": 7,
  "totalFailedOperations": 2,
  "tenantErrorRatePercent": 28.57,
  "ticketsDispatched": 1,
  "ticketRecipient": "servicedesk-incidents@yourcompany.com",
  "reportCsvPath": "C:\\\\Scripts\\\\reports\\\\Source_Health_Report_20261002_160320.csv",
  "duration": "00:00:12",
  "generatedAt": "2026-10-02 16:03:22"
}`}</code>
              </pre>

              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                Downstream workflow logic can evaluate <code className="text-brand-light">$.windowsServer.result.data.alertTriggered</code> to trigger secondary incident workflows, dispatch high-urgency Microsoft Teams or Slack alerts, or temporarily pause downstream certification campaigns.
              </p>

              {/* Key Code Highlights */}
              <h3 id="code-highlights" className="text-2xl text-white mt-12 mb-4">Key Code Highlights & Implementation Choices</h3>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                Here is a closer look at core architectural patterns embedded within the IdentityEXE PowerShell engine:
              </p>

              <h4 className="text-xl text-white mt-6 mb-3">1. Cursor-Based Search Pagination with searchAfter</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                To audit account provisioning and attribute synchronization events without risking pagination errors or hitting Elasticsearch offset caps, our core engineering methodology structures the search query with cursor-based <code className="text-brand-light">searchAfter</code> pagination:
              </p>

              <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-300 mb-8">
                <code>{`# Search API cursor pagination loop
$SearchQuery = "created:[now-\${LookbackHours}h TO now]"
$SearchLimit = 250
$LastActivityCreated = $null
$LastActivityId = $null

while ($true) {
    $SearchPayload = [ordered]@{
        indices = @("accountactivities")
        query   = @{ query = $SearchQuery }
        sort    = @("-created", "id")
    }

    if ($LastActivityCreated -and $LastActivityId) {
        $SearchPayload["searchAfter"] = @((Format-IsoUtc $LastActivityCreated), $LastActivityId)
    }

    $SearchUri = "$BaseUrl/search/v1?limit=$SearchLimit"
    $SearchBatch = Invoke-RestMethod -Method Post -Uri $SearchUri -Headers $Headers -Body ($SearchPayload | ConvertTo-Json -Depth 6)

    $activityArray = @($SearchBatch)
    if (-not $activityArray -or $activityArray.Count -eq 0) {
        break
    }

    foreach ($act in $activityArray) {
        # Process account activity and provisioning operations
        Process-AccountActivity -Activity $act
    }

    if ($activityArray.Count -lt $SearchLimit) {
        break
    }

    # Extract tiebreaker sort values from the last item
    $lastItem = $activityArray[-1]
    $LastActivityCreated = $lastItem.created
    $LastActivityId = $lastItem.id
}`}</code>
              </pre>

              <h4 className="text-xl text-white mt-8 mb-3">2. Dual-Threshold Evaluation & Breach Detection</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                A source is flagged as breached if either an individual active capability exceeds the error threshold (e.g., account creations failing at 5%) or the source&apos;s combined error rate across all operations hits the threshold:
              </p>

              <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-300 mb-8">
                <code>{`$isBreached = $false
$breachedOperations = [System.Collections.Generic.List[string]]::new()

foreach ($opKey in $SourceOps.Keys) {
    $opData = $SourceOps[$opKey]
    if (-not $opData.Enabled -or $opData.TotalRuns -eq 0) { continue }
    
    $rate = [math]::Round(($opData.FailedRuns / $opData.TotalRuns) * 100, 2)
    $opData.ErrorRatePercent = $rate
    
    if ($rate -ge $ErrorThresholdPercent) {
        $isBreached = $true
        $breachedOperations.Add("$($opData.DisplayName) ($rate% errors)")
    }
}

# Evaluate combined source error rate
$combinedRate = if ($totalSourceRuns -gt 0) {
    [math]::Round(($totalSourceFailures / $totalSourceRuns) * 100, 2)
} else { 0.0 }

if ($combinedRate -ge $ErrorThresholdPercent -and $totalSourceRuns -gt 0) {
    $isBreached = $true
}`}</code>
              </pre>

              {/* Considerations & Production Best Practices */}
              <h3 id="best-practices" className="text-2xl text-white mt-12 mb-4">Considerations & Production Best Practices</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5 font-light">
                <li>
                  <strong className="text-white">API Client Scopes & Least Privilege:</strong> Ensure the Personal Access Token (PAT) or OAuth 2.0 Client Credentials Grant assigned to the automation is constrained to read-only scopes:
                  <ul className="list-circle pl-5 mt-2 space-y-1 text-xs text-slate-400 font-mono">
                    <li>idn:sources:read (to inspect sources, connector features, schedules, and attribute sync configs)</li>
                    <li>idn:tasks:read (to audit task execution statuses and error traces)</li>
                    <li>idn:search:read (to query provisioning and attribute sync account activities)</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">Managing Excluded Sources:</strong> Sandbox sources, test directories, or applications undergoing maintenance often generate expected failures. Use the <code className="text-brand-light">-ExcludedSources</code> parameter to pass a comma-separated list of source names or IDs. The engine will bypass health checks for these systems while clearly logging them as excluded in the executive summary KPI bar.
                </li>
                <li>
                  <strong className="text-white">Tuning Error Rate Thresholds:</strong> The default baseline of 3.0% provides an optimal threshold for enterprise environments. It tolerates transient network timeouts while immediately flagging systemic aggregation or provisioning failures. Organizations with zero-tolerance SLAs can tune this down to 1.0% or 0.5%.
                </li>
                <li>
                  <strong className="text-white">PAG Host Security & Network Egress:</strong> When placing the script on your Windows execution host, locate it in a protected administrative directory (e.g., <code className="text-xs text-slate-300">C:\Scripts\comprehensive-source-reporting\</code>), enforce TLS 1.2 on all outgoing connections, and verify that the host has network egress to your internal or cloud SMTP relay.
                </li>
              </ul>

              {/* Downloads & Implementation Code */}
              <h3 id="implementation-downloads" className="text-2xl text-white mt-12 mb-4">Downloads & Implementation Code</h3>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                Download the complete IdentityEXE Comprehensive Source Reporting implementation package below:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="text-slate-200 font-bold text-sm block">Workflow-SourceHealthReporting.json</span>
                    <span className="text-xs text-slate-500">SailPoint Workflow definition (5.3 KB)</span>
                  </div>
                  <a 
                    href="/downloads/comprehensive-source-reporting/Workflow-SourceHealthReporting.json"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download JSON
                  </a>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="text-slate-200 font-bold text-sm block">Source-Health-Report.ps1</span>
                    <span className="text-xs text-slate-500">PowerShell Automation Engine (63.4 KB)</span>
                  </div>
                  <a 
                    href="/downloads/comprehensive-source-reporting/Source-Health-Report.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="text-slate-200 font-bold text-sm block">summary-template.html</span>
                    <span className="text-xs text-slate-500">Executive Email HTML Template (4.3 KB)</span>
                  </div>
                  <a 
                    href="/downloads/comprehensive-source-reporting/summary-template.html"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download HTML
                  </a>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="text-slate-200 font-bold text-sm block">incident-template.html</span>
                    <span className="text-xs text-slate-500">ITSM Incident Ticket Template (3.5 KB)</span>
                  </div>
                  <a 
                    href="/downloads/comprehensive-source-reporting/incident-template.html"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download HTML
                  </a>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between md:col-span-2">
                  <div className="pr-4">
                    <span className="text-slate-200 font-bold text-sm block">Source_Health_Report_Sample.csv</span>
                    <span className="text-xs text-slate-500">Sample Audit CSV Report (17.5 KB)</span>
                  </div>
                  <a 
                    href="/downloads/comprehensive-source-reporting/Source_Health_Report_Sample.csv"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download CSV
                  </a>
                </div>
              </div>

              {/* Conclusion & High-Leverage Call to Action */}
              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Relying solely on green &quot;Healthy&quot; connectivity pings leaves critical blind spots in your identity governance posture. By combining SailPoint Workflows, the Privileged Action Gateway, and automated ISC API auditing across eight core operations, enterprise identity teams can proactively track aggregation health, catch failing provisioning events before users or auditors notice, and eliminate the audit findings that plague enterprise rollouts.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex comprehensive-source-reporting integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
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
