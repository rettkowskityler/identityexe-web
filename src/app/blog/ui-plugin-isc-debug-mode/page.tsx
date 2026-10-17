import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

export const metadata: Metadata = {
  title: "Bringing the IIQ Debug Page to ISC: The Administrator Console UI Plugin | IdentityEXE",
  description: "A repeatable architectural methodology designed by IdentityEXE to unify 19 ISC object categories, Transform and Connector Rule studios, source diagnostics, SP-Config packaging, and pre-commit RFC 6902 diff reviews inside the SailPoint ISC browser UI.",
  alternates: {
    canonical: 'https://identityexe.com/blog/ui-plugin-isc-debug-mode',
  },
  openGraph: {
    title: "Bringing the IIQ Debug Page to ISC: The Administrator Console UI Plugin | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to unify 19 ISC object categories, Transform and Connector Rule studios, source diagnostics, SP-Config packaging, and pre-commit RFC 6902 diff reviews inside the SailPoint ISC browser UI.",
    url: 'https://identityexe.com/blog/ui-plugin-isc-debug-mode',
    type: 'article',
    siteName: 'IdentityEXE',
    images: [
      {
        url: '/images/blog/ui-plugin-isc-debug-mode/opengraph-image.png',
        width: 1376,
        height: 768,
        alt: 'SailPoint UI Plugin Administrator Console & ISC Debug Mode - IdentityEXE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bringing the IIQ Debug Page to ISC: The Administrator Console UI Plugin | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to unify 19 ISC object categories, Transform and Connector Rule studios, source diagnostics, SP-Config packaging, and pre-commit RFC 6902 diff reviews inside the SailPoint ISC browser UI.",
    images: ['/images/blog/ui-plugin-isc-debug-mode/opengraph-image.png'],
  },
};

export default function UIPluginISCDebugModePost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview & Architectural Flow' },
    { id: 'vscode-workbench', label: '1. VS Code Workbench & 19-Object Explorer' },
    { id: 'source-operations', label: '2. Source Sub-Objects, Aggregations & Diagnostics' },
    { id: 'transform-studio', label: '3. Transform Studio & Live Identity Preview' },
    { id: 'connector-rule-studio', label: '4. Connector Rule Studio (Unescaped BeanShell)' },
    { id: 'sp-config-packaging', label: '5. Tenant Configuration Packaging (SP-Config)' },
    { id: 'differential-review', label: '6. Pre-Commit GitHub-Style Differential Review' },
    { id: 'api-activity-log', label: '7. Built-In API & Network Activity Log Viewer' },
    { id: 'architecture-code-highlights', label: 'Architecture & Key Code Highlights' },
    { id: 'production-best-practices', label: 'Considerations & Production Best Practices' },
    { id: 'resources-source-code', label: 'Resources & Implementation Artifacts' },
    { id: 'conclusion', label: 'Conclusion & Architecture Review' }
  ];

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 min-h-screen">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] 2xl:grid-cols-[280px_minmax(0,1fr)_280px] gap-8 items-start">
          <aside className="xl:col-start-1 sticky top-32 hidden xl:block">
            <TableOfContents items={tocItems} />
          </aside>

          <article className="xl:col-start-2 max-w-5xl mx-auto min-w-0 w-full overflow-hidden glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-brand-accent transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-brand-accent transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">UI Plugin ISC Debug Mode</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>October 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Bringing the IIQ Debug Page to ISC: The Administrator Console UI Plugin
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

            <div className="prose prose-invert break-words w-full overflow-x-hidden prose-pre:max-w-[85vw] sm:pre:max-w-full prose-pre:overflow-x-auto prose-img:max-w-full prose-img:h-auto prose-base md:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-accent hover:prose-a:text-brand-light prose-code:text-brand-light prose-code:bg-brand-blue/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
              
              {/* 1. THE HOOK & BUSINESS CONTEXT */}
              <h3 id="executive-summary" className="text-2xl text-white !mt-0 mb-4 font-black tracking-tight">Executive Summary</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Every engineer who has administered SailPoint IdentityIQ (IIQ) relies on the built-in <code>/debug</code> page (<code>debug.jsf</code>) to inspect raw backend objects, modify configurations, test rules, and troubleshoot connectors from a single browser tab. In SailPoint Identity Security Cloud (ISC), those underlying object definitions are abstracted behind dozens of disparate REST API endpoints. While external utilities like Postman collections and the SailPoint VS Code Extension provide API access, enterprise administrators are forced to context-switch between the ISC browser UI, Postman, VS Code, and local text editors just to inspect a raw JSON object, evaluate a transform against an identity, edit a JSON-escaped BeanShell connector rule, export tenant configurations, or trigger an unoptimized source aggregation. Worse yet, dispatching raw <code>PUT</code> or <code>PATCH</code> payloads from external API clients lacks native pre-commit validation, making it easy to overwrite production configurations without reviewing a line-by-line diff first.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Leaving this architectural fragmentation unsolved creates immediate operational and commercial risk. A single malformed <code>PUT</code> request or an unverified JSON Patch array against a production Source, Identity Profile, or Role can break downstream provisioning, corrupt identity attributes, or strip birthright access across thousands of users. When identity engineers spend hours manually unescaping BeanShell strings or hunting through disconnected tools to diagnose a connector failure, source onboarding timelines stall and deployment lag compounds. Blind configuration overwrites introduce untracked configuration drift between sandbox and production environments, triggering failed SOX and SOC 2 compliance audits, security vulnerabilities from misconfigured access boundaries, and severe manager approval fatigue when emergency remediation campaigns are launched to clean up broken access states.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-semibold text-white">
                To eliminate this operational bottleneck, IdentityEXE engineered a repeatable architectural methodology: the in-tenant <strong>Administrator Console UI Plugin</strong>. Built natively on the SailPoint UI Plugin Framework, this implementation framework embeds a complete VS Code-style workbench and the operational speed of the classic IIQ Debug page directly inside the ISC browser UI. By unifying a 19-category object explorer, dedicated Transform and Connector Rule development studios, one-click source diagnostics, automated SP-Config packaging, a pre-commit GitHub-style differential review engine, and a live REST API traffic logger into a single sandboxed workspace, enterprise identity teams gain complete configuration governance without ever leaving their tenant.
              </p>

              <div className="my-10 flex flex-col items-center gap-6">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_MainWorkbench.png" 
                  alt="Administrator Console Main Workbench" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <hr className="border-white/10 my-10" />

              {/* 2. THE TECHNICAL CORE */}
              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Solution Overview &amp; Architectural Flow</h3>
              
              <div className="bg-[#0d1117] border border-brand-blue/30 border-l-4 border-l-brand-blue rounded-r-xl p-5 mb-8">
                <h4 className="text-brand-blue font-bold mb-2 flex items-center gap-2 text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Enterprise Platform Availability Note
                </h4>
                <p className="text-sm text-slate-300 mb-0 leading-relaxed font-light">
                  The SailPoint UI Plugin framework is currently rolling out across enterprise tenants. Our engineering team provides live architectural demonstrations of the Administrator Console inside our dedicated sandbox tenant for organizations evaluating in-tenant extensibility.
                </p>
              </div>

              <p className="text-slate-300 mb-6">
                When we architect this solution for our enterprise clients, we utilize the official <strong>SailPoint UI Plugin Framework (<code>@sailpoint/ui-plugin-sdk</code>), Angular 21, TypeScript, PrimeNG, and modern SailPoint <code>/v1</code> REST APIs</strong>.
              </p>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the data layer to load inside a sandboxed <code>full-page</code> iframe within the ISC Admin portal while synchronizing in real time with the administrator&apos;s Light or Dark theme. From a single consolidated workbench, administrators can:
              </p>

              <ol className="space-y-4 text-slate-300 mb-8 list-decimal pl-6">
                <li>
                  Browse, search, create, clone, export, edit, and delete objects across <strong className="text-white">19 ISC object categories</strong>.
                </li>
                <li>
                  Open purpose-built studios for <strong className="text-white">Transforms</strong> (with live identity preview simulation) and <strong className="text-white">Connector Rules</strong> (with unescaped Java/BeanShell editing and server-side validation).
                </li>
                <li>
                  Trigger administrative <strong className="text-white">Source operations</strong> (aggregations, resets, connection health checks, live object peeking, VA cluster pings, and trace debug logging) and inspect nested schemas, provisioning policies, and sync configs.
                </li>
                <li>
                  Package and migrate <strong className="text-white">Tenant Configurations (SP-Config)</strong> across 12 object types with a visual selector and one-click export/import.
                </li>
                <li>
                  Test <strong className="text-white">Workflows</strong>, inspect <strong className="text-white">Identity</strong> access and events, send test <strong className="text-white">Notification Templates</strong>, and track background jobs.
                </li>
                <li>
                  Review every single modification in a <strong className="text-white">GitHub-style side-by-side or unified diff modal</strong> before dispatching <code>PUT</code> or auto-generated RFC 6902 <code>PATCH</code> operations to the tenant.
                </li>
                <li>
                  Inspect all underlying REST API calls in a built-in <strong className="text-white">API &amp; Network Activity Log</strong> with one-click <code>cURL</code> command generation.
                </li>
              </ol>

              <hr className="border-white/10 my-10" />

              {/* Consolidated Walkthrough */}
              <h3 id="vscode-workbench" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">1. The VS Code Workbench &amp; 19-Object Explorer</h3>
              <p className="text-slate-300 mb-6">
                This modular framework ensures that your ISC deployment avoids fragmented tooling by consolidating the entire developer and administrator workflow into one unified workspace. When you launch the Administrator Console from the ISC navigation bar, you are presented with an interactive overview grid and a resizable left Object Explorer sidebar covering 19 core ISC object types: <code>Transforms</code>, <code>Connector Rules</code>, <code>Sources</code>, <code>Roles</code>, <code>Entitlements</code>, <code>Access Profiles</code>, <code>Applications</code>, <code>Workflows</code>, <code>Forms</code>, <code>Identity Profiles</code>, <code>Accounts</code>, <code>Identity Attributes</code>, <code>Search Attributes</code>, <code>Machine Identities</code>, <code>Notification Templates</code>, <code>Service Desk Integrations</code>, <code>Segments</code>, <code>SOD Policies</code>, and <code>Identities</code>.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_MainWorkbench.png" 
                  alt="Administrator Console Main Workbench and 19-Object Explorer" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Live Tenant Counts &amp; Search:</strong> Each category automatically resolves and displays its live tenant object count (<code>X-Total-Count</code> and <code>/search/v1/count</code>) and supports instant search filtering and pagination.
                </li>
                <li>
                  <strong className="text-white">Multi-Tab Editor &amp; Global View/Edit Toggle:</strong> Clicking any object opens it in a workspace tab. A global <strong className="text-white">View / Edit</strong> mode toggle in the top left keeps all open tabs safely read-only until you explicitly switch to Edit mode.
                </li>
                <li>
                  <strong className="text-white">Guided Object Creation, Cloning &amp; Deletion:</strong> Clicking the <code>+</code> button next to any supported category opens a creation modal pre-loaded with valid schema templates (automatically resolving required tenant Sources or Owner Identities under the hood). Existing objects can also be cloned, exported to JSON, or opened directly in the native ISC Admin UI with one click.
                </li>
              </ul>

              <h3 id="source-operations" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">2. Source Associated Objects, Aggregations, Resets &amp; Diagnostics</h3>
              <p className="text-slate-300 mb-6">
                In the standard ISC UI, inspecting a source&apos;s underlying schemas, provisioning policies, or attribute sync configuration requires navigating through several nested screens, and critical operations—such as unoptimized aggregations, source resets, or peeking raw connector objects—require external API calls.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_SourceOperations.png" 
                  alt="Source Associated Objects and Quick Action Bar" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Associated Sub-Objects Tree:</strong> Expanding a Source (such as <code>Active Directory</code> above) in the explorer tree pulls its nested <strong className="text-white">Schemas</strong>, <strong className="text-white">Provisioning Policies</strong>, <strong className="text-white">Attribute Sync Config</strong>, <strong className="text-white">Machine Account Subtypes</strong>, and attached <strong className="text-white">Connector Rules</strong> directly underneath the source node so you can open and edit each sub-object in its own tab.
                </li>
                <li>
                  <strong className="text-white">Source Quick-Action Bar:</strong> When viewing a Source tab, the top toolbar exposes operational dropdown menus backed by a safety confirmation modal and a live background <strong className="text-white">Task Tracker</strong>:
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-sm text-slate-300">
                    <li><strong className="text-cyan-400">Aggregate:</strong> Trigger <em>Aggregate Accounts</em>, <em>Aggregate Accounts (Unoptimized)</em> (<code>disableOptimization=true</code>), or <em>Aggregate Entitlements</em>.</li>
                    <li><strong className="text-rose-400">Reset:</strong> Execute <em>Reset Accounts</em>, <em>Reset Entitlements</em>, or a <em>Full Source Reset</em>.</li>
                    <li><strong className="text-emerald-400">Diagnostics:</strong> Run a live <em>Test Connection</em> health check, <em>Peek Live Objects</em> (inspecting the first 10 raw objects directly from the target endpoint), <em>Ping VA Cluster</em> to verify Virtual Appliance reachability, or <em>Enable Debug Logging</em> to turn on temporary <code>TRACE</code>/<code>DEBUG</code> connector logs on the cluster.</li>
                  </ul>
                </li>
              </ul>

              <h3 id="transform-studio" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">3. Transform Studio &amp; Live Identity Preview Simulator</h3>
              <p className="text-slate-300 mb-6">
                Writing complex nested transforms in raw JSON is notoriously error-prone when you cannot immediately see the output. When we architect this solution for our enterprise clients, we utilize the integrated <strong>Transform Studio</strong> whenever a Transform object is opened in the workspace.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_TransformStudio.png" 
                  alt="Transform Studio and Live Identity Preview" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Live Identity Preview (<code>POST /identity-profiles/v1/identity-preview</code>):</strong> In the screenshot above, the <code>FormatGCPEmail</code> (<code>concat</code>) transform is open on the left while the <strong className="text-white">Transform Test Simulator</strong> is active on the right. By selecting a live tenant identity (<code>Aaron.Nichols</code>) and a target attribute (<code>Work Email (email)</code>), clicking <strong className="text-white">Run Identity Preview</strong> evaluates the transform against the live tenant API and displays the <strong className="text-white">Current Value (Previous)</strong> alongside the <strong className="text-white">Transformed Value (New)</strong> (<code>aaron.nichols@se-gcp.sailpointtechnologies.com</code>).
                </li>
                <li>
                  <strong className="text-white">Offline Sandbox Mode:</strong> Administrators can also toggle from <strong className="text-white">Preview API</strong> to <strong className="text-white">Sandbox</strong> mode to test string manipulations (<code>lower</code>, <code>upper</code>, <code>substring</code>, <code>replace</code>, <code>concat</code>, <code>lookup</code>, <code>firstValid</code>, <code>dateFormat</code>, etc.) against custom mock inputs on the fly.
                </li>
              </ul>

              <h3 id="connector-rule-studio" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">4. Connector Rule Studio (Unescaped BeanShell Editor)</h3>
              <p className="text-slate-300 mb-6">
                Connector Rules in ISC store their Java/BeanShell code inside a JSON-escaped string (<code>sourceCode.script</code>). Editing raw escaped strings with <code>\n</code> and <code>\&quot;</code> characters in Postman is slow and introduces syntax defects. Opening any rule in the plugin launches <strong>Connector Rule Studio</strong>.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_ConnectorRuleStudio.png" 
                  alt="Connector Rule Studio Unescaped BeanShell Editor" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Unescaped Java/BeanShell Editor:</strong> Extracts <code>sourceCode.script</code> into a dedicated code editor (<code>BeanShell / Java Source</code>) with full syntax highlighting while maintaining bidirectional sync with the <strong className="text-white">Full Rule JSON Envelope</strong> sub-tab. Engineers can also download the raw <code>.bsh</code> file or upload an external script file directly into the editor.
                </li>
                <li>
                  <strong className="text-white">Input Signature Variables &amp; Common Snippets:</strong> The right-hand sidebar automatically inspects and lists the rule&apos;s declared input variables (<code>application</code>, <code>requestEndPoint</code>, <code>processedResponseObject</code>, <code>rawResponseObject</code>, <code>restClient</code>, etc.) alongside one-click <strong className="text-white">Common Snippets</strong> (<code>Log Debug</code>, <code>Parse JSON Map</code>, <code>JDBC BuildMap</code>, <code>Try / Catch Wrap</code>, <code>Return Output Map</code>).
                </li>
                <li>
                  <strong className="text-white">Server-Side Script Validation:</strong> Clicking <strong className="text-white">Validate Script</strong> dispatches the script to <code>POST /connector-rules/v1/validate</code> to verify syntax and compilation before saving.
                </li>
              </ul>

              <h3 id="sp-config-packaging" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">5. Tenant Configuration Packaging (SP-Config Export &amp; Import)</h3>
              <p className="text-slate-300 mb-6">
                Promoting configurations between sandbox and production tenants or capturing point-in-time backups before executing major updates typically requires configuring external CLI scripts or Postman jobs. Clicking the cloud icon in the left Activity Bar opens the built-in <strong>Tenant Configuration (SP-Config)</strong> manager.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_SPConfig.png" 
                  alt="Tenant Configuration SP-Config Modal" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Visual Object Type Selector:</strong> Choose any combination of the 12 supported SP-Config object types (<code>Sources</code>, <code>Transforms</code>, <code>Rules</code>, <code>Workflows</code>, <code>Roles</code>, <code>Access Profiles</code>, <code>Forms</code>, <code>Identity Profiles</code>, <code>SOD Policies</code>, <code>Email Templates</code>, <code>Service Desk</code>, and <code>Trigger Subscriptions</code>) using quick <strong className="text-white">Select All</strong> / <strong className="text-white">Deselect All</strong> controls.
                </li>
                <li>
                  <strong className="text-white">One-Click Export &amp; Import:</strong> Clicking <strong className="text-white">Start Export &amp; Download</strong> queues the <code>/sp-config/v1/export</code> job, polls its completion status automatically, and downloads the resulting JSON artifact straight to the local workstation. Administrators can also upload and preview SP-Config JSON bundles via <code>/sp-config/v1/import</code>.
                </li>
              </ul>

              <h3 id="differential-review" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">6. Pre-Commit GitHub-Style Differential Review</h3>
              <p className="text-slate-300 mb-6">
                This modular framework ensures that your ISC deployment avoids accidental configuration overwrites. The plugin never blindly commits an object when you click <strong>Review Diff &amp; Save</strong>.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_DiffReviewModal.png" 
                  alt="Pre-Commit Differential Review Modal" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Unified &amp; Split Diff Views:</strong> An in-memory Longest Common Subsequence (LCS) diff engine compares <strong className="text-white">Current in ISC (Original)</strong> against <strong className="text-white">Staged Changes (New)</strong>, highlighting exact line deletions in red (<code>-</code>), additions in green (<code>+</code>), and word-level token differences. Engineers can switch between <strong className="text-white">Unified</strong> and <strong className="text-white">Split</strong> side-by-side layouts or copy the diff to the clipboard for change-control tickets.
                </li>
                <li>
                  <strong className="text-white">Automatic RFC 6902 JSON Patch Generation:</strong> Once changes are verified and the administrator clicks <strong className="text-white">Confirm &amp; Push to Live Tenant</strong>, the service automatically dispatches either a full <code>PUT</code> payload or compiles the minimal RFC 6902 <code>PATCH</code> operations (<code>add</code>, <code>remove</code>, <code>replace</code>) required by that specific endpoint.
                </li>
              </ul>

              <h3 id="api-activity-log" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">7. Built-In API &amp; Network Activity Log Viewer</h3>
              <p className="text-slate-300 mb-6">
                For identity architects who need to inspect the exact REST calls executing behind the scenes, troubleshoot a <code>400 Bad Request</code> validation error, or export a request into an external automation script, the left Activity Bar includes a live <strong>API &amp; Network Activity</strong> console.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img 
                  src="/images/blog/ui-plugin-isc-debug-mode/AdminConsole_ApiActivityLog.png" 
                  alt="API and Network Activity Log Viewer" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">100% Traffic Interception &amp; Filtering:</strong> Every outbound API request and workspace event is captured in real time, displaying total call counts, <code>2xx OK</code> vs. <code>4xx/5xx</code> error badges, and average roundtrip latency (<code>Avg 483ms</code>). You can filter the stream by HTTP method (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>), status code, or keyword.
                </li>
                <li>
                  <strong className="text-white">Payload Inspector &amp; One-Click <code>Copy cURL</code>:</strong> Selecting any entry inspects its <strong className="text-white">Response Body</strong>, <strong className="text-white">Request Payload</strong>, <strong className="text-white">Headers</strong>, and <strong className="text-white">cURL Snippet</strong>, with one-click <strong className="text-white">Copy cURL</strong> and <strong className="text-white">Copy JSON</strong> buttons in the upper right.
                </li>
              </ul>

              <hr className="border-white/10 my-10" />

              {/* Architecture & Key Code Highlights */}
              <h3 id="architecture-code-highlights" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Architecture &amp; Key Code Highlights</h3>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the data layer around three foundational components inside the IdentityEXE implementation blueprint:
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. UI Plugin Manifest (<code>sp-ui-plugin.json</code>)</h4>
              <p className="text-slate-300 mb-4">
                The plugin is packaged and deployed via the SailPoint CLI (<code>sail ui-plugins upload</code>). It mounts into the <code>full-page</code> slot and communicates with the ISC host frame through <code>@sailpoint/ui-plugin-sdk</code> without exposing static client credentials in the browser:
              </p>

              <pre className="mb-6"><code className="language-json">{`{
  "version": 1,
  "manifest": {
    "alias": "isc-debug-mode-identityexe",
    "name": {
      "en": "Administrator Console"
    },
    "description": {
      "en": "VS Code-style backend object browser, specialized studios, JSON code editor, and differential change engine for SailPoint Identity Security Cloud"
    },
    "apiScopes": [
      "sp:scopes:all"
    ],
    "contentSecurityPolicies": {},
    "permissionPolicy": {},
    "iframeAllow": {},
    "state": "ENABLED",
    "slots": [
      {
        "slotId": "full-page"
      }
    ]
  },
  "build": {
    "outDir": "./dist/isc-debug-mode-identityexe/browser",
    "port": 4200
  }
}`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">2. Automatic RFC 6902 JSON Patch Generation (<code>diff-engine.service.ts</code>)</h4>
              <p className="text-slate-300 mb-4">
                Different ISC endpoints enforce different update semantics: endpoints like <code>/transforms/v1</code> and <code>/connector-rules/v1</code> expect a full <code>PUT</code> replacement, while endpoints like <code>/sources/v1</code>, <code>/roles/v1</code>, and <code>/access-profiles/v1</code> require an RFC 6902 <code>PATCH</code> array. Rather than forcing engineers to hand-write JSON Patch arrays, <code>DiffEngineService</code> recursively walks the baseline JSON tree against the edited JSON tree and compiles the exact patch operations automatically:
              </p>

              <pre className="mb-6"><code className="language-typescript">{`generateJsonPatch(originalObj: Record<string, unknown>, modifiedObj: Record<string, unknown>): JsonPatchOp[] {
  const ops: JsonPatchOp[] = [];

  const walk = (orig: unknown, mod: unknown, path: string) => {
    if (orig === mod) return;

    if (orig === null || orig === undefined || typeof orig !== 'object' ||
        mod === null || mod === undefined || typeof mod !== 'object' ||
        Array.isArray(orig) !== Array.isArray(mod)) {
      ops.push({ op: 'replace', path: path || '/', value: mod });
      return;
    }

    if (Array.isArray(orig) && Array.isArray(mod)) {
      if (JSON.stringify(orig) !== JSON.stringify(mod)) {
        ops.push({ op: 'replace', path, value: mod });
      }
      return;
    }

    const origKeys = Object.keys(orig as Record<string, unknown>);
    const modKeys = Object.keys(mod as Record<string, unknown>);

    for (const k of origKeys) {
      if (!(k in (mod as Record<string, unknown>))) {
        ops.push({ op: 'remove', path: \`\${path}/\${k}\` });
      }
    }

    for (const k of modKeys) {
      const origVal = (orig as Record<string, unknown>)[k];
      const modVal = (mod as Record<string, unknown>)[k];

      if (!(k in (orig as Record<string, unknown>))) {
        ops.push({ op: 'add', path: \`\${path}/\${k}\`, value: modVal });
      } else {
        walk(origVal, modVal, \`\${path}/\${k}\`);
      }
    }
  };

  walk(originalObj, modifiedObj, '');
  return ops;
}`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">3. Live Transform Preview Evaluation (<code>debug-mode-api.service.ts</code>)</h4>
              <p className="text-slate-300 mb-4">
                To evaluate transforms against live identities in Transform Studio, our API orchestration layer wraps the transform reference into an <code>identityAttributeConfig</code> payload and posts it directly to <code>/identity-profiles/v1/identity-preview</code>:
              </p>

              <pre className="mb-6"><code className="language-typescript">{`async previewTransformOnIdentity(
  identityId: string,
  transformName: string,
  attributeName = 'displayName'
): Promise<IdentityPreviewResult> {
  const payload = {
    identityId,
    identityAttributeConfig: {
      enabled: true,
      attributeTransforms: [
        {
          identityAttributeName: attributeName,
          transformDefinition: {
            type: 'reference',
            attributes: { id: transformName },
          },
        },
      ],
    },
  };

  const res = await this.plugin.post<any>('/identity-profiles/v1/identity-preview', payload);
  const previewAttrs = Array.isArray(res?.previewAttributes) ? res.previewAttributes : [];
  const targetAttr = previewAttrs.find((a: any) => a.name === attributeName) || previewAttrs[0];

  return {
    success: !targetAttr?.errorMessages?.length,
    identityName: res?.identity?.name || identityId,
    attributeName: targetAttr?.name || attributeName,
    previousValue: targetAttr ? targetAttr.previousValue : null,
    newValue: targetAttr ? targetAttr.value : null,
    rawResponse: res,
  };
}`}</code></pre>

              <hr className="border-white/10 my-10" />

              {/* Considerations & Production Best Practices */}
              <h3 id="production-best-practices" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Considerations &amp; Production Best Practices</h3>
              <p className="text-slate-300 mb-6">
                When deploying the Administrator Console UI Plugin across enterprise ISC environments, enforce the following operational guardrails:
              </p>

              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Read-Only by Default:</strong> Keep the workspace in <strong className="text-white">View</strong> mode during routine troubleshooting and inspection. Only toggle <strong className="text-white">Edit</strong> mode when you intend to stage and review modifications.
                </li>
                <li>
                  <strong className="text-white">Always Inspect the Pre-Commit Diff:</strong> Before committing changes to shared objects like Sources, Identity Profiles, or Roles, verify the green (<code>+</code>) and red (<code>-</code>) lines in the Pre-Commit Differential Review modal to ensure no unintended attributes were altered.
                </li>
                <li>
                  <strong className="text-white">Take SP-Config Snapshots Before Major Edits:</strong> Use the built-in <strong className="text-white">SP-Config</strong> exporter to download a backup bundle of your target object types before executing bulk configuration updates.
                </li>
                <li>
                  <strong className="text-white">Caution with Source Reset Operations:</strong> Actions under the <strong className="text-white">Reset</strong> menu (Reset Accounts, Reset Entitlements, Full Source Reset) remove aggregated data from the tenant. Always verify the Source Name and Cloud External ID in the confirmation dialog before proceeding.
                </li>
              </ul>

              <hr className="border-white/10 my-10" />

              {/* Resources & Source Code */}
              <h3 id="resources-source-code" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Resources &amp; Implementation Artifacts</h3>
              <p className="text-slate-300 mb-6">
                All source code, specialized studio components, and the UI plugin manifest are available in the official GitHub repository:
              </p>

              <div className="my-8 p-6 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">rettkowskityler / ui-plugin-admin-console-identityexe</h4>
                  <p className="text-xs text-slate-400">Complete Angular 21 project, PrimeNG theme integration, 19-object catalog, Transform &amp; Connector Rule Studios, LCS Diff Engine, and SP-Config manager.</p>
                </div>
                <a 
                  href="https://github.com/rettkowskityler/ui-plugin-admin-console-identityexe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand-blue hover:bg-brand-accent text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  View on GitHub
                </a>
              </div>

              <p className="text-slate-300 mb-4 font-semibold text-white">
                Inside the repository you will find:
              </p>
              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6 text-sm">
                <li>
                  <strong className="text-white">Complete Angular 21 Project:</strong> Full workspace layout and PrimeNG theme synchronization (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">src/app/</code>).
                </li>
                <li>
                  <strong className="text-white">UI Plugin Manifest:</strong> Configured for the full-page slot and scoped tenant permissions (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">sp-ui-plugin.json</code>).
                </li>
                <li>
                  <strong className="text-white">19-Object Catalog &amp; Schema Templates:</strong> Complete object definitions and guided creation templates (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">debug-mode.models.ts</code>).
                </li>
                <li>
                  <strong className="text-white">REST API Orchestration Service:</strong> Modern <code>/v1</code> endpoint integration and fallback routing (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">debug-mode-api.service.ts</code>).
                </li>
                <li>
                  <strong className="text-white">Specialized Studios &amp; Engines:</strong> Transform Studio, Connector Rule Studio, the LCS Diff Engine (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">diff-engine.service.ts</code>), SP-Config manager, and the API Activity Log Viewer.
                </li>
              </ul>

              {/* 3. THE CONVERSION BRIDGE */}
              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Fragmented external tooling and blind API overwrites do not have to be an accepted reality of administering SailPoint Identity Security Cloud. By embedding a VS Code-style 19-object explorer, specialized Transform and Connector Rule studios, real-time source diagnostics, SP-Config packaging, a pre-commit RFC 6902 diff engine, and a live API traffic logger directly inside the ISC browser UI, the Administrator Console UI Plugin restores the unified <code>/debug</code> control plane that enterprise identity teams demand.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-cyan-900/30 p-8 rounded-3xl border border-cyan-500/20 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex ui-plugin-ISC-Debug-Mode integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
                    </p>
                  </div>
                  <a 
                    href="/contact" 
                    className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
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
