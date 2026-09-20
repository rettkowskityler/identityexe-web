import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import workflowData from './SourceAccessCleaner.json';
import formSourceSelectorData from './Form-SourceSelector.json';
import formConfirmSelectionData from './Form-ConfirmSourceSelection.json';

export const metadata: Metadata = {
  title: "Automating Source Access Cleanup in SailPoint Identity Security Cloud | IdentityEXE",
  description: "A repeatable architectural methodology designed by IdentityEXE to safely audit, preview, and remediate lingering access on newly onboarded sources, overcoming native lifecycle state deprovisioning limitations.",
  alternates: {
    canonical: 'https://identityexe.com/blog/source-access-cleaner',
  },
  openGraph: {
    title: "Automating Source Access Cleanup in SailPoint Identity Security Cloud | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to safely audit, preview, and remediate lingering access on newly onboarded sources, overcoming native lifecycle state deprovisioning limitations.",
    url: 'https://identityexe.com/blog/source-access-cleaner',
    type: 'article',
    siteName: 'IdentityEXE',
    images: [
      {
        url: '/images/blog/source-access-cleaner/opengraph-image.png',
        width: 1200,
        height: 1200,
        alt: 'SailPoint Source Access Cleaner Architecture - IdentityEXE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Automating Source Access Cleanup in SailPoint Identity Security Cloud | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to safely audit, preview, and remediate lingering access on newly onboarded sources, overcoming native lifecycle state deprovisioning limitations.",
    images: ['/images/blog/source-access-cleaner/opengraph-image.png'],
  },
};

export default function SourceAccessCleanerPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint: Interactive UI' },
    { id: 'workflow-orchestration', label: 'Workflow Orchestration & Routing' },
    { id: 'engineering-methodology', label: 'API Architecture & PowerShell Engine' },
    { id: 'audit-trail-reporting', label: 'Audit Trail, Notifications & Reporting' },
    { id: 'production-hardening', label: 'Considerations & Best Practices' },
    { id: 'implementation-framework', label: 'Downloads & Implementation Code' },
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
              <span className="text-slate-400">Source Access Cleaner</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>September 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Automating Source Access Cleanup in Identity Security Cloud <br />
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
              
              {/* Executive Summary */}
              <h3 id="executive-summary" className="text-2xl text-white !mt-0 mb-4">Executive Summary</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                When onboarding legacy applications and directories into SailPoint Identity Security Cloud (ISC), enterprise sources arrive laden with accounts and entitlements belonging to users who separated months or years prior. A standard architectural limitation of ISC is that native Lifecycle State (LCS) deprovisioning triggers exclusively on real-time state transitions—such as an identity moving from Active to Terminated. ISC does not perform recurring, retroactive evaluations across accounts whose corresponding identity records were already placed into a Terminated or Inactive state prior to application aggregation.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Leaving this architectural gap unaddressed exposes the enterprise to immediate commercial and operational liabilities. Organizations fail SOX, SOC 2, and ISO 27001 compliance audits when auditor samples surface active credentials assigned to departed employees on newly onboarded systems. Deployment velocity grinds to a halt as identity engineering teams burn weeks on error-prone CSV reconciliations, while downstream access certifications trigger severe manager approval fatigue over phantom accounts. Crucially, dormant privileged entitlements remain unmonitored, expanding the lateral attack surface.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                IdentityEXE designed a repeatable architectural methodology to solve this baseline gap: the <strong className="text-white">Source Access Cleaner</strong> framework. Rather than forcing administrators to rely on unverified, one-off PowerShell scripts, this modular engineering framework unifies SailPoint Interactive Workflows, dynamic ISC Forms, and a resilient, rate-limited PowerShell execution engine on a Windows Server host. It delivers an interactive preview widget directly inside SailPoint, dispatches an audit-ready CSV report, and safely executes granular remediations to establish a clean security baseline before day-to-day Joiner-Mover-Leaver automation takes over.
              </p>

              {/* Solution Overview */}
              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5">
                <li><strong className="text-white">Tech Stack:</strong> 1 Interactive Workflow + 2 Interactive Forms + 3 PowerShell Scripts (WinRM / Windows Server execution host).</li>
                <li><strong className="text-white">High-Level Flow:</strong> Launched on demand directly from the SailPoint Launchpad, the workflow dynamically queries all active Lifecycle States across your tenant's Identity Profiles. The operator selects the target application source, target lifecycle state(s), and desired remediation posture. The engine calculates affected identities via modern ISC APIs, displays an interactive HTML preview table directly inside a confirmation Form, and executes surgical removals upon administrator approval.</li>
                <li><strong className="text-white">Four Modular Remediation Modes:</strong>
                  <ul className="list-circle pl-5 mt-2 space-y-2">
                    <li><strong className="text-white">Preview Only Mode:</strong> Safely audits and presents all affected accounts and permissions without executing changes. Ideal for compliance spot checks, application owner alignment, and pre-deployment reviews.</li>
                    <li><strong className="text-white">Remove Entitlements and Disable Accounts:</strong> Complete access baseline remediation. Submits access request revocations for all assigned permissions and suspends active application accounts.</li>
                    <li><strong className="text-white">Remove Entitlements Only:</strong> Strips away assigned permissions and entitlements while keeping the underlying application account active.</li>
                    <li><strong className="text-white">Disable Accounts Only:</strong> Suspends the target application account while preserving existing entitlement assignments for audit hold or forensic requirements.</li>
                  </ul>
                </li>
              </ul>

              <div className="bg-[#0d1117] border border-brand-blue/30 border-l-4 border-l-brand-blue rounded-r-xl p-5 mb-8">
                <h4 className="text-brand-blue font-bold mb-2 flex items-center gap-2 text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Architecture Requirement & Secrets Governance
                </h4>
                <p className="text-sm text-slate-300 mb-0 leading-relaxed font-light">
                  When we architect this solution for our enterprise clients, the execution engine runs on a dedicated Windows Server host via the Privileged Access Gateway (PAG) or Windows Server workflow action. <strong>Never hardcode plain text secrets</strong> into workflow definitions or script arguments. Store client credentials within your enterprise secrets vault (CyberArk, Azure Key Vault, or AWS Secrets Manager) and retrieve them at execution runtime.
                </p>
              </div>

              {/* IdentityEXE Blueprint */}
              <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: Interactive UI & Decision Gates</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                When we architect this solution for our enterprise clients, we utilize a two-stage guided interface within SailPoint Forms. This ensures complete operator visibility and prevents unauthorized or blind remediations against production identity repositories.
              </p>

              <h4 className="text-xl text-white mt-8 mb-4">Stage 1: Scope Selection (Form 1 - Source Selector)</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Initiated directly from the Launchpad, the primary form presents dynamic operational parameters. Rather than relying on hardcoded profile values, the form's multi-select dropdown is dynamically populated with every active Lifecycle State across all tenant Identity Profiles:
              </p>
              <ul className="space-y-2 text-slate-300 mb-6 list-disc pl-5 font-light">
                <li><strong className="text-white">Select Source:</strong> The target connected application to audit and baseline.</li>
                <li><strong className="text-white">Select Clean Up Options:</strong> Dropdown configuring the remediation posture (Preview, Full Removal, Entitlements Only, Disable Accounts Only).</li>
                <li><strong className="text-white">Select Lifecycle States:</strong> Dynamic multi-select pre-populated with tenant states (e.g., Terminated, Inactive, Extended Leave).</li>
                <li><strong className="text-white">Send Summary Via Email:</strong> Boolean toggle to dispatch an executive HTML summary and Excel-ready CSV report.</li>
              </ul>

              <div className="my-8 space-y-6">
                <div>
                  <strong className="text-white block mb-2 text-sm font-semibold">1. Full Removal Mode Selection:</strong>
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                    <img src="/images/blog/source-access-cleaner/Execution_Screenshot_FullRemoval_1.png" alt="Form Selection - Full Removal" className="w-full h-auto object-contain" />
                  </div>
                  <span className="text-xs text-slate-400 block mt-2 text-center">Configuring full remediation: Revoking entitlements and disabling accounts for Terminated identities.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">2. Entitlement Removal Only:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                      <img src="/images/blog/source-access-cleaner/Execution_Screenshot_RemoveEntitlements_1.png" alt="Form Selection - Remove Entitlements" className="w-full h-auto object-contain" />
                    </div>
                    <span className="text-xs text-slate-400 block mt-2 text-center">Targeting entitlement revocation while preserving underlying accounts.</span>
                  </div>
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">3. Account Disablement Only:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                      <img src="/images/blog/source-access-cleaner/Execution_Screenshot_DisableAccounts_1.png" alt="Form Selection - Disable Accounts" className="w-full h-auto object-contain" />
                    </div>
                    <span className="text-xs text-slate-400 block mt-2 text-center">Suspending application accounts while retaining permission assignments.</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-white mt-10 mb-4">Stage 2: Interactive Review & Confirmation (Form 2 - Confirm Source Selection)</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Our core engineering methodology structures the data layer to compile an interactive HTML preview table passed directly into Form 2 via the <code className="text-brand-light">formTableHtml</code> attribute. Administrators review high-level metric cards (Affected Identities, Entitlements to Revoke, Accounts Needing Disablement, and Already Disabled Accounts) alongside an identity-by-identity audit roster before approving execution.
              </p>

              <div className="my-8 space-y-6">
                <div>
                  <strong className="text-white block mb-2 text-sm font-semibold">Full Removal Review Widget:</strong>
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                    <img src="/images/blog/source-access-cleaner/Execution_Screenshot_FullRemoval_2.png" alt="Review Widget - Full Removal" className="w-full h-auto object-contain" />
                  </div>
                  <span className="text-xs text-slate-400 block mt-2 text-center">Summary cards isolate users, entitlements, and accounts requiring disablement with an explicit confirmation toggle.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">Remove Entitlements Review:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                      <img src="/images/blog/source-access-cleaner/Execution_Screenshot_RemoveEntitlements_2.png" alt="Review Widget - Remove Entitlements" className="w-full h-auto object-contain" />
                    </div>
                    <span className="text-xs text-slate-400 block mt-2 text-center">Entitlements marked for revocation; active accounts flagged as Retained.</span>
                  </div>
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">Disable Accounts Review:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                      <img src="/images/blog/source-access-cleaner/Execution_Screenshot_DisableAccounts_2.png" alt="Review Widget - Disable Accounts" className="w-full h-auto object-contain" />
                    </div>
                    <span className="text-xs text-slate-400 block mt-2 text-center">Accounts needing disablement isolated while group memberships remain intact.</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-white mt-10 mb-4">Fail-Safe Exits & Zero-Impact Safeguards</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                This modular framework ensures that your ISC deployment avoids unintended modifications by enforcing three deterministic safety exits:
              </p>
              <ul className="space-y-4 text-slate-300 mb-6 list-disc pl-5 font-light">
                <li>
                  <strong className="text-white">Preview Mode Safe Exit:</strong> If the operator selects Preview Only Mode, the workflow bypasses all write actions, renders the interactive preview widget inside an informational message, and safely terminates.
                  <div className="mt-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                    <img src="/images/blog/source-access-cleaner/Execution_Screenshot_PreviewMode.png" alt="Preview Mode Summary Message" className="w-full h-auto" />
                  </div>
                </li>
                <li>
                  <strong className="text-white">Clean Source Bypass:</strong> If the audit engine determines that the target source contains zero stale accounts or entitlements for the target lifecycle states, the workflow displays a verified "Compliant" badge and exits immediately, preventing wasteful approval cycles.
                  <div className="mt-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                    <img src="/images/blog/source-access-cleaner/Execution_Screenshot_CleanSource.png" alt="Clean Source Compliant Message" className="w-full h-auto" />
                  </div>
                </li>
                <li>
                  <strong className="text-white">Operator Denial Safeguard:</strong> If the administrator toggles the "Approve Or Deny" switch to false during confirmation, the workflow aborts execution instantly with zero modifications applied to the target application.
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                      <img src="/images/blog/source-access-cleaner/Execution_Screenshot_Denied_1.png" alt="Operator Denying Remediation" className="w-full h-auto" />
                    </div>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                      <img src="/images/blog/source-access-cleaner/Execution_Screenshot_Denied_2.png" alt="Safe Exit Notification" className="w-full h-auto" />
                    </div>
                  </div>
                </li>
              </ul>

              {/* Workflow Orchestration */}
              <h3 id="workflow-orchestration" className="text-2xl text-white mt-12 mb-4">Workflow Orchestration & Script Routing</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                The SailPoint Workflow acts as the central control plane, bridging user interaction via SailPoint Forms with backend PowerShell automation executing on the Windows Server host.
              </p>

              <div className="my-8">
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl p-2">
                  <img src="/images/blog/source-access-cleaner/SourceAccessCleaner20260919.png" alt="Source Access Cleaner Workflow Canvas Mapping" className="w-full h-auto object-contain" />
                </div>
                <span className="text-xs text-slate-400 block mt-2 text-center">Complete visual canvas mapping of the Source Access Cleaner workflow logic and node routing.</span>
              </div>

              <h4 className="text-xl text-white mt-8 mb-4">Four Sequential Operational Phases:</h4>
              <ol className="space-y-6 text-slate-300 mb-8 list-decimal pl-5 font-light">
                <li>
                  <strong className="text-white">Phase 1: Pre-Form Initialization & Dynamic Discovery (<code className="text-brand-light">Get-LifecycleStates.ps1</code>)</strong>
                  <p className="mt-1">Triggered directly from the Launchpad, the workflow initializes session variables and executes <code className="text-brand-light">Get-LifecycleStates.ps1</code> via the Windows Server action. The script queries <code className="text-brand-light">/identity-profiles/v1</code> and each profile's <code className="text-brand-light">/lifecycle-states</code> endpoint, returning a structured JSON array (<code className="text-brand-light">LCSName</code>, <code className="text-brand-light">IDPName</code>, <code className="text-brand-light">LCSID</code>). This array is mapped into Form 1, eliminating static configurations.</p>
                </li>
                <li>
                  <strong className="text-white">Phase 2: Scope Collection & Audit Calculation (<code className="text-brand-light">Get-RemovalSummary.ps1</code>)</strong>
                  <p className="mt-1">Capturing the administrator's selections (<code className="text-brand-light">SourceName</code>, <code className="text-brand-light">LifecycleStateId</code>, <code className="text-brand-light">ActionMode</code>, <code className="text-brand-light">SummaryEmail</code>), the workflow triggers <code className="text-brand-light">Get-RemovalSummary.ps1</code>. The script runs an Elasticsearch query against <code className="text-brand-light">/search/v1</code>, cross-references live account objects via <code className="text-brand-light">/accounts/v1</code> to eliminate search indexing delay, generates the responsive HTML widget, builds the machine-readable <code className="text-brand-light">remediationMap</code>, and optionally sends the summary email with the CSV attachment.</p>
                </li>
                <li>
                  <strong className="text-white">Phase 3: Decision Routing & Safety Gates</strong>
                  <p className="mt-1">The workflow inspects <code className="text-brand-light">$.windowsServer.result.data.metrics.status</code>. If the source is clean, it routes directly to the Clean Source notification. If Preview Mode was selected, it displays the preview widget without requesting confirmation. For active remediation modes, it embeds <code className="text-brand-light">formTableHtml</code> into Form 2 alongside the <code className="text-brand-light">approveOrDeny</code> toggle. If denied, it exits cleanly.</p>
                </li>
                <li>
                  <strong className="text-white">Phase 4: Remediation Execution Engine (<code className="text-brand-light">Invoke-AccessRemediation.ps1</code>)</strong>
                  <p className="mt-1">Upon confirmation, the workflow passes <code className="text-brand-light">$.windowsServer.result.data.remediationMap.JSON()</code> into <code className="text-brand-light">Invoke-AccessRemediation.ps1</code>. The execution engine submits native access revocations via <code className="text-brand-light">POST /access-requests/v1</code> (<code className="text-brand-light">REVOKE_ACCESS</code>) and account suspensions via <code className="text-brand-light">POST /accounts/v1/&#123;id&#125;/disable</code>, displaying a real-time completion status.</p>
                </li>
              </ol>

              {/* Engineering Methodology */}
              <h3 id="engineering-methodology" className="text-2xl text-white mt-12 mb-4">Technical Deep Dive: The PowerShell & API Engine</h3>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                Our core engineering methodology structures the data layer to interface with SailPoint ISC's modern <code className="text-brand-light">/v1</code> endpoints with strict idempotency and zero search-index race conditions.
              </p>

              <div className="overflow-x-auto my-6 border border-white/10 rounded-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                    <tr>
                      <th className="p-3 border-b border-white/10">Endpoint</th>
                      <th className="p-3 border-b border-white/10">Method</th>
                      <th className="p-3 border-b border-white/10">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    <tr>
                      <td className="p-3 text-brand-light">/oauth/token</td>
                      <td className="p-3 text-emerald-400 font-bold">POST</td>
                      <td className="p-3 font-sans">Authenticate via OAuth2 Client Credentials</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/identity-profiles/v1</td>
                      <td className="p-3 text-blue-400 font-bold">GET</td>
                      <td className="p-3 font-sans">List all active Identity Profiles across tenant</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/identity-profiles/v1/&#123;id&#125;/lifecycle-states</td>
                      <td className="p-3 text-blue-400 font-bold">GET</td>
                      <td className="p-3 font-sans">Retrieve dynamic Lifecycle States for Form 1 dropdown</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/sources/v1 &amp; /sources/v1/&#123;id&#125;</td>
                      <td className="p-3 text-blue-400 font-bold">GET</td>
                      <td className="p-3 font-sans">Resolve source name, UUID, and connector configurations</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/search/v1</td>
                      <td className="p-3 text-emerald-400 font-bold">POST</td>
                      <td className="p-3 font-sans">Elasticsearch query filtering target source and LCS users</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/accounts/v1 &amp; /accounts/v1/&#123;id&#125;</td>
                      <td className="p-3 text-blue-400 font-bold">GET</td>
                      <td className="p-3 font-sans">Real-time validation of account status (<code className="text-brand-light">disabled</code>, <code className="text-brand-light">hasEntitlements</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/accounts/v1/&#123;id&#125;/disable</td>
                      <td className="p-3 text-emerald-400 font-bold">POST</td>
                      <td className="p-3 font-sans">Native account disablement</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-brand-light">/access-requests/v1</td>
                      <td className="p-3 text-emerald-400 font-bold">POST</td>
                      <td className="p-3 font-sans">Standard access revocation (<code className="text-brand-light">REVOKE_ACCESS</code>)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">1. Dynamic Lifecycle State Discovery (<code className="text-brand-light">Get-LifecycleStates.ps1</code>)</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Hardcoding lifecycle states like "terminated" into static forms creates failure points when organizations introduce customized states (such as "pre-hire", "leave-of-absence", or "contractor-expired"). The initialization script dynamically resolves all states:
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-6 overflow-x-auto text-sm"><code className="language-powershell">{`# Query lifecycle states across all Identity Profiles
$LcsResults = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($profile in $ProfilesList) {
    $LcsUri = "$BaseUrl/identity-profiles/v1/$($profile.id)/lifecycle-states"
    $States = Invoke-RestMethod -Method Get -Uri $LcsUri -Headers $Headers

    foreach ($state in $States) {
        $lcsNameValue = if ($state.technicalName) { $state.technicalName } else { $state.name }
        $LcsResults.Add([ordered]@{
            "LCSName" = $lcsNameValue
            "IDPName" = $profile.name
            "LCSID"   = $state.id
        })
    }
}`}</code></pre>

              <h4 className="text-xl text-white mt-8 mb-3">2. Search Index Latency Mitigation (<code className="text-brand-light">Get-RemovalSummary.ps1</code>)</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                SailPoint's Elasticsearch index (<code className="text-brand-light">/search/v1</code>) is near-real-time, but pending background aggregations or identity refresh tasks introduce indexing latency. To prevent attempting to disable accounts that are already disabled or revoking entitlements that no longer exist, our script executes a real-time batch lookup against the authoritative <code className="text-brand-light">/accounts/v1</code> endpoint:
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-6 overflow-x-auto text-sm"><code className="language-powershell">{`# Resilient search query across accounts and access
$FinalSearchQuery = "(@accounts(source.id:\`"$ResolvedSourceId\`") OR access.source.id:\`"$ResolvedSourceId\`") AND $lcsSearchPart"

# Live account verification to prevent search index race conditions
$filterStr = 'id in ("' + ($pageAccountIds -join '","') + '")'
$accQueryUri = "$BaseUrl/accounts/v1?filters=" + [System.Uri]::EscapeDataString($filterStr) + "&limit=50"
$liveAccounts = Invoke-RestMethod -Method Get -Uri $accQueryUri -Headers $Headers

foreach ($la in $liveAccounts) {
    $LiveAccountMap[$la.id] = [PSCustomObject]@{
        disabled        = [bool]$la.disabled
        hasEntitlements = if ($null -ne $la.hasEntitlements) { [bool]$la.hasEntitlements } else { $true }
    }
}`}</code></pre>

              <h4 className="text-xl text-white mt-8 mb-3">3. Standard Governance Revocation Engine (<code className="text-brand-light">Invoke-AccessRemediation.ps1</code>)</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                This modular framework ensures that your ISC deployment avoids unmonitored back-channel deletions. By utilizing the official <code className="text-brand-light">/access-requests/v1</code> endpoint with <code className="text-brand-light">REVOKE_ACCESS</code>, every removal creates a standard governance line item routed through native provisioning pipelines:
              </p>
<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-6 shadow-2xl my-6 overflow-x-auto text-sm"><code className="language-powershell">{`# 1. Submit Entitlement Revocation via Native Access Requests API
$revokePayload = [ordered]@{
    requestedFor   = @($identityId)
    requestType    = "REVOKE_ACCESS"
    requestedItems = @(
        [ordered]@{
            type    = "ENTITLEMENT"
            id      = $entitlementId
            comment = "Automated user access remediation - source access cleanup"
        }
    )
}
$reqResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/access-requests/v1" -Headers $Headers -Body ($revokePayload | ConvertTo-Json -Depth 5)

# 2. Submit Native Account Disablement via Accounts API
$disResponse = Invoke-RestMethod -Method Post -Uri "$BaseUrl/accounts/v1/$accountId/disable" -Headers $Headers -Body "{}"`}</code></pre>

              {/* Audit Trail & Reporting */}
              <h3 id="audit-trail-reporting" className="text-2xl text-white mt-12 mb-4">Governance Audit Trail, Notifications & Reporting</h3>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                In regulated enterprise environments, remediating access without forensic proof is unacceptable. The framework generates a closed-loop audit trail across CSV exports, SMTP executive summaries, and native ISC activity tracking.
              </p>

              <h4 className="text-xl text-white mt-8 mb-4">1. Excel-Ready CSV Audit Roster</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                When the email summary toggle is active, <code className="text-brand-light">Get-RemovalSummary.ps1</code> compiles an audit CSV capturing the pre-remediation state of every affected identity:
              </p>

              <div className="overflow-x-auto my-6 border border-white/10 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 text-white font-bold uppercase">
                    <tr>
                      <th className="p-3 border-b border-white/10">Target App</th>
                      <th className="p-3 border-b border-white/10">Identity</th>
                      <th className="p-3 border-b border-white/10">Account State</th>
                      <th className="p-3 border-b border-white/10">Entitlements</th>
                      <th className="p-3 border-b border-white/10">Action Mode</th>
                      <th className="p-3 border-b border-white/10">LCS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-3">Corporate HR Directory</td>
                      <td className="p-3 font-semibold text-white">Eric Wright (1042)</td>
                      <td className="p-3 text-red-400">Active (Needs Disable)</td>
                      <td className="p-3">Financial Reporting; Administrator</td>
                      <td className="p-3">Full Removal</td>
                      <td className="p-3">Terminated</td>
                    </tr>
                    <tr>
                      <td className="p-3">Corporate HR Directory</td>
                      <td className="p-3 font-semibold text-white">Brandon Young (1133)</td>
                      <td className="p-3 text-red-400">Active (Needs Disable)</td>
                      <td className="p-3">HR Portal Access</td>
                      <td className="p-3">Full Removal</td>
                      <td className="p-3">Terminated</td>
                    </tr>
                  </tbody>
                </table>
              </div>

<pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 shadow-xl mb-8 overflow-x-auto text-xs"><code className="language-csv">{`"Target Application","Identity","Identity Username","Identity Display Name","Identity Email","Account Name","Account State","Entitlements","Entitlement Count","Manager","Action Mode","Lifecycle State(s)","Generated At"
"Corporate HR Directory","Eric Wright (1042)","1042","Eric Wright","eric.wright@example.com","eric.wright@example.com","Active (Needs Disable)","Financial Reporting; Administrator","2","Daniel Jackson","Remove Entitlements & Disable Account","Terminated","2026-09-19 12:44:34"
"Corporate HR Directory","Brandon Young (1133)","1133","Brandon Young","brandon.young@example.com","brandon.young@example.com","Active (Needs Disable)","HR Portal Access","1","Stephanie Baker","Remove Entitlements & Disable Account","Terminated","2026-09-19 12:44:34"`}</code></pre>

              <h4 className="text-xl text-white mt-8 mb-4">2. Executive Summary Email Notifications</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Delivered directly via SMTP, formatted executive emails keep compliance stakeholders informed with visual metrics and direct attachments:
              </p>

              <div className="my-8 space-y-6">
                <div>
                  <strong className="text-white block mb-2 text-sm font-semibold">Full Removal Email with Attached CSV:</strong>
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                    <img src="/images/blog/source-access-cleaner/Email_Screenshot_FullRemoval.png" alt="Email Notification - Full Removal" className="w-full h-auto" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">Remove Entitlements Email:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                      <img src="/images/blog/source-access-cleaner/Email_Screenshot_RemoveEntitlements.png" alt="Email Notification - Remove Entitlements" className="w-full h-auto" />
                    </div>
                  </div>
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">Disable Accounts Email:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                      <img src="/images/blog/source-access-cleaner/Email_Screenshot_DisableAccounts.png" alt="Email Notification - Disable Accounts" className="w-full h-auto" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">Preview Mode Email:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                      <img src="/images/blog/source-access-cleaner/Email_Screenshot_PreviewMode.png" alt="Email Notification - Preview Mode" className="w-full h-auto" />
                    </div>
                  </div>
                  <div>
                    <strong className="text-white block mb-2 text-sm font-semibold">Clean Source Compliance Email:</strong>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                      <img src="/images/blog/source-access-cleaner/Email_Screenshot_CleanSource.png" alt="Email Notification - Clean Source" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-white mt-8 mb-4">3. Native Tracking in ISC Activities</h4>
              <p className="text-slate-300 mb-4 leading-relaxed font-light">
                Because access revocations route through the native <code className="text-brand-light">/access-requests/v1</code> engine, administrators can monitor request fulfillment in real time inside the standard SailPoint ISC UI under <strong className="text-white">Search &gt; Activities</strong>:
              </p>

              <div className="my-6">
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                  <img src="/images/blog/source-access-cleaner/Activities_Screenshot_FullRemoval.png" alt="ISC Activities Tracking" className="w-full h-auto" />
                </div>
                <span className="text-xs text-slate-400 block mt-2 text-center">Tracking automated access revocation requests within the SailPoint ISC Activities view.</span>
              </div>

              {/* Considerations & Best Practices */}
              <h3 id="production-hardening" className="text-2xl text-white mt-12 mb-4">Considerations & Best Practices</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-5 font-light">
                <li><strong className="text-white">Post-Onboarding Baseline SOP:</strong> Embed this workflow as a mandatory standard operating procedure (SOP) on your enterprise application onboarding checklist. Running Source Access Cleaner immediately after initial account aggregation establishes a verified, clean baseline before enabling event-driven LCS rules.</li>
                <li><strong className="text-white">Windows Server &amp; Gateway Security:</strong> Ensure the execution host has outbound HTTPS connectivity to your tenant's API gateway (<code className="text-brand-light">https://&#123;tenant&#125;.api.identitynow.com</code>). Protect API client credentials using enterprise secrets management.</li>
                <li><strong className="text-white">API Rate Limiting &amp; Backoff:</strong> <code className="text-brand-light">Invoke-AccessRemediation.ps1</code> includes a configurable <code className="text-brand-light">$RateLimitDelaySeconds</code> parameter (defaulting to 1 second) between consecutive calls to keep enterprise deployments well within SailPoint tenant API thresholds.</li>
                <li><strong className="text-white">UI Table Clipping Safeguard:</strong> To prevent browser timeouts during large directory reconciliations, the interactive HTML table clips display rendering at the first 100 users, displaying an advisory directing the administrator to the attached CSV report for the complete roster.</li>
                <li><strong className="text-white">Required API Scopes:</strong> The Personal Access Token (PAT) or OAuth client requires the following least-privilege scopes:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-xs">
                    <span className="bg-white/5 p-2 rounded border border-white/5 text-brand-light">idn:identity-profile:read</span>
                    <span className="bg-white/5 p-2 rounded border border-white/5 text-brand-light">idn:sources:read</span>
                    <span className="bg-white/5 p-2 rounded border border-white/5 text-brand-light">idn:search:read</span>
                    <span className="bg-white/5 p-2 rounded border border-white/5 text-brand-light">idn:accounts:read</span>
                    <span className="bg-white/5 p-2 rounded border border-white/5 text-brand-light">idn:accounts:manage</span>
                    <span className="bg-white/5 p-2 rounded border border-white/5 text-brand-light">idn:access-request:create</span>
                  </div>
                </li>
              </ul>

              {/* Implementation Framework Downloads */}
              <h3 id="implementation-framework" className="text-2xl text-white mt-12 mb-4">Downloads & Implementation Code</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                All production workflow definitions, interactive form schemas, PowerShell scripts, and audit templates are available for direct implementation:
              </p>

              <h4 className="text-xl text-white mt-8 mb-4">1. Main Workflow Definition</h4>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between mb-6">
                <span className="text-slate-300 font-bold text-sm">SourceAccessCleaner.json</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowData, null, 2))}`}
                  download="SourceAccessCleaner.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Workflow
                </a>
              </div>

              <h4 className="text-xl text-white mt-8 mb-4">2. Interactive Form Blueprints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Form-SourceSelector.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formSourceSelectorData, null, 2))}`}
                    download="Form-SourceSelector.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Form-ConfirmSourceSelection.json</span>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formConfirmSelectionData, null, 2))}`}
                    download="Form-ConfirmSourceSelection.json"
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </a>
                </div>
              </div>

              <h4 className="text-xl text-white mt-8 mb-4">3. Execution Scripts & Audit Template</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Get-LifecycleStates.ps1</span>
                  <a 
                    href="/downloads/source-access-cleaner/Get-LifecycleStates.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Get-RemovalSummary.ps1</span>
                  <a 
                    href="/downloads/source-access-cleaner/Get-RemovalSummary.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Invoke-AccessRemediation.ps1</span>
                  <a 
                    href="/downloads/source-access-cleaner/Invoke-AccessRemediation.ps1"
                    download
                    className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Script
                  </a>
                </div>
                <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-sm truncate pr-4">Sample_Remediation_Summary.csv</span>
                  <a 
                    href="/downloads/source-access-cleaner/Sample_Remediation_Summary.csv"
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
                  Onboarding connected applications into SailPoint Identity Security Cloud without baselining existing accounts leaves a dangerous governance blind spot. By implementing this architectural methodology, identity teams bridge the native lifecycle gap, enforce zero-trust least privilege across newly connected systems, and eliminate the audit findings that plague enterprise rollouts.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex source-access-cleaner integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
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
