import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import { getBlogPostJsonLd, getBlogPostSeo } from '../../../lib/seo';

export const metadata: Metadata = {
  title: "Modular Custom Reporting in ISC: The Report Center UI Plugin",
  description: "A repeatable architectural methodology designed by IdentityEXE to embed a modular .report.ts reporting engine, dynamic schema discovery, multi-source account exports, unified certification campaign line-items, and unlimited identity directory reporting directly inside the SailPoint ISC browser UI.",
  keywords: getBlogPostSeo('ui-plugin-report-center')?.keywords,
  authors: [{ name: 'Tyler', url: 'https://identityexe.com' }],
  alternates: {
    canonical: 'https://identityexe.com/blog/ui-plugin-report-center',
  },
  openGraph: {
    title: "Modular Custom Reporting in ISC: The Report Center UI Plugin | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to embed a modular .report.ts reporting engine, dynamic schema discovery, multi-source account exports, unified certification campaign line-items, and unlimited identity directory reporting directly inside the SailPoint ISC browser UI.",
    url: 'https://identityexe.com/blog/ui-plugin-report-center',
    type: 'article',
    publishedTime: `${getBlogPostSeo('ui-plugin-report-center')!.datePublished}T08:00:00+00:00`,
    authors: ['Tyler'],
    siteName: 'IdentityEXE',
    images: [
      {
        url: '/images/blog/ui-plugin-report-center/opengraph-image.png',
        width: 1376,
        height: 768,
        alt: 'SailPoint UI Plugin Modular Report Center - IdentityEXE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Modular Custom Reporting in ISC: The Report Center UI Plugin | IdentityEXE",
    description: "A repeatable architectural methodology designed by IdentityEXE to embed a modular .report.ts reporting engine, dynamic schema discovery, multi-source account exports, unified certification campaign line-items, and unlimited identity directory reporting directly inside the SailPoint ISC browser UI.",
    images: ['/images/blog/ui-plugin-report-center/opengraph-image.png'],
  },
};

export default function UIPluginReportCenterPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview & Architectural Flow' },
    { id: 'report-catalog-configuration', label: '1. Report Catalog, Theme Toggle & Filter Config' },
    { id: 'multi-source-accounts-report', label: '2. Report #1: Multi-Source Accounts Report' },
    { id: 'certifications-campaign-export', label: '3. Report #2: Certifications Campaign Status Export' },
    { id: 'identity-directory-report', label: '4. Report #3: Identity Directory & Auth Source Report' },
    { id: 'how-to-studio-generator', label: '5. Template, Build & Upload How-To Studio' },
    { id: 'api-telemetry-inspector', label: '6. Built-In SailPoint V1 API Telemetry & cURL Inspector' },
    { id: 'architecture-code-highlights', label: 'Architecture & Code Highlights' },
    { id: 'production-best-practices', label: 'Operational Guardrails & Best Practices' },
    { id: 'resources-source-code', label: 'Resources & Implementation Artifacts' },
    { id: 'conclusion', label: 'Conclusion & Architecture Review' }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBlogPostJsonLd('ui-plugin-report-center')) }}
      />
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
              <span className="text-slate-400">UI Plugin Report Center</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>October 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Modular Custom Reporting in ISC: The Report Center UI Plugin
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
              <h2 id="executive-summary" className="text-2xl text-white !mt-0 mb-4 font-black tracking-tight">Executive Summary</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Extracting custom, audit-ready reports out of SailPoint Identity Security Cloud (ISC) requires far more manual engineering effort than it should. In the standard ISC UI, reporting is fragmented across isolated search views and rigid single-object exports. You cannot natively generate a single unified CSV of accounts across multiple target sources while dynamically selecting custom connector schema attributes (such as <code>sAMAccountName</code>, <code>userPrincipalName</code>, or <code>department</code>) as columns. You cannot export and merge certification review line-items across dozens of campaigns filtered by status, type, decision state, and date range without clicking into each campaign individually to download separate CSV files. Even pulling a complete identity directory filtered by Authoritative Source with custom Identity Attributes selected on the fly runs straight into the 2,500-row UI export cap or the 10,000-record search offset ceiling—forcing engineers to build and maintain a growing sprawl of external scripts and Excel macros outside the platform every time stakeholders request a new report.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Leaving this reporting gap unsolved creates immediate operational drag and enterprise risk. When senior identity engineers spend days writing one-off PowerShell or Python extraction scripts and manually stitching together CSV files in Excel, core engineering velocity grinds to a halt—creating massive deployment lag across source onboarding and role engineering initiatives. Manual spreadsheet reconciliation and truncated search pagination inevitably produce incomplete evidence packages, triggering failed SOX and SOC 2 compliance audits. Worse yet, lacking unified visibility across multi-source uncorrelated accounts, disabled accounts with lingering entitlements, and stalled certification campaign line-items leaves blind spots where orphaned access persists, introducing severe security vulnerabilities and driving manager approval fatigue when untargeted emergency access reviews are launched to compensate for poor reporting visibility.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-semibold text-white">
                To eliminate external script sprawl, IdentityEXE engineered a repeatable architectural methodology: the <strong>Modular Report Center UI Plugin</strong> (<code>report-center-identityexe</code>) running directly inside the SailPoint ISC browser UI. In this implementation framework, every custom report is encapsulated as a single drop-in <code>.report.ts</code> module inside <code>src/app/reports/</code> that the build pipeline discovers and renders automatically. Complete with dynamic tenant filters, live schema column pickers, KPI summary cards, CSV/JSON/Clipboard TSV exports, an in-app <strong>Template, Build &amp; Upload How-To Studio</strong>, a live <strong>API Telemetry</strong> inspector, and <strong>three universal built-in reports</strong> that work out of the box in any SailPoint ISC tenant, this blueprint transforms ISC into a self-service enterprise reporting workbench.
              </p>

              <div className="my-10 flex flex-col items-center gap-6">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_MainWorkbench.png" 
                  alt="IdentityEXE Report Center Main Workbench" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <hr className="border-white/10 my-10" />

              {/* 2. THE TECHNICAL CORE */}
              <h2 id="solution-overview" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Solution Overview &amp; Architectural Flow</h2>
              
              <div className="bg-[#0d1117] border border-brand-blue/30 border-l-4 border-l-brand-blue rounded-r-xl p-5 mb-8">
                <h4 className="text-brand-blue font-bold mb-2 flex items-center gap-2 text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Enterprise Platform Availability Note
                </h4>
                <p className="text-sm text-slate-300 mb-0 leading-relaxed font-light">
                  The SailPoint UI Plugin framework is not yet generally released to all tenants. Our engineering team provides live architectural demonstrations of the Modular Report Center inside our dedicated sandbox tenant for enterprise teams evaluating in-tenant reporting extensibility.
                </p>
              </div>

              <p className="text-slate-300 mb-6">
                When we architect this solution for our enterprise clients, we utilize the <strong>SailPoint UI Plugin Framework (<code>@sailpoint/ui-plugin-sdk</code>), Angular 21, TypeScript, PrimeNG, and SailPoint <code>/v1</code> REST APIs</strong>.
              </p>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the data layer so the plugin loads as a full-page view inside the ISC Admin portal and supports both Dark Mode and Light Mode. From one unified screen, identity teams can:
              </p>

              <ol className="space-y-4 text-slate-300 mb-8 list-decimal pl-6">
                <li>
                  Run <strong className="text-white">Report #1 (Multi-Source Accounts Report)</strong>: Pick one or more sources in your tenant, automatically load their account schema attributes (<code>GET /sources/v1/&#123;id&#125;/schemas</code>), choose the columns you want, and export a combined accounts report.
                </li>
                <li>
                  Run <strong className="text-white">Report #2 (Certifications Campaign Status Export)</strong>: Filter campaigns by <strong className="text-white">Campaign Status</strong> (<code>ACTIVE</code>, <code>STAGED</code>, <code>COMPLETED</code>, etc.), <strong className="text-white">Start Date / End Date</strong>, <strong className="text-white">Campaign Type</strong>, and <strong className="text-white">Decision State</strong>. The plugin triggers and downloads the official SailPoint Campaign Status Report CSV (<code>GET /reports/v1/&#123;taskResultId&#125;?fileFormat=CSV</code>) and merges all certification line-items into one table.
                </li>
                <li>
                  Run <strong className="text-white">Report #3 (Identity Directory &amp; Auth Source Report)</strong>: Pull all identities in the tenant (using <code>searchAfter</code> cursor pagination so there is no 2,500 or 10,000 row limit), filter by <strong className="text-white">Authoritative Source</strong> and <strong className="text-white">Lifecycle State</strong>, and pick any standard or custom <strong className="text-white">Identity Attributes</strong> (<code>GET /identity-attributes/v1</code>) as columns.
                </li>
                <li>
                  Search, sort, and export any report to <strong className="text-white">CSV</strong>, <strong className="text-white">JSON</strong>, or <strong className="text-white">Clipboard TSV</strong> (to paste straight into Excel), or inspect the raw JSON for any row.
                </li>
                <li>
                  Create new reports using the <strong className="text-white">Template, Build &amp; Upload How-To Studio</strong>: Copy <code>_template.report.ts</code> into <code>src/app/reports/*.report.ts</code> and run <code>npm run build &amp;&amp; sail ui-plugins upload</code>, or use the built-in <strong className="text-white">Interactive <code>.report.ts</code> Generator</strong> to generate and test a new report right in the browser.
                </li>
                <li>
                  View every outbound SailPoint API call in the <strong className="text-white">API Telemetry</strong> tab, complete with response times, JSON payloads, and a <strong className="text-white">Copy cURL</strong> button.
                </li>
              </ol>

              <hr className="border-white/10 my-10" />

              {/* Section 1 */}
              <h2 id="report-catalog-configuration" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">1. The Report Catalog, Theme Toggle &amp; Filter Configuration</h2>
              <p className="text-slate-300 mb-6">
                This modular framework ensures that your ISC deployment avoids hardcoded report screens by driving the entire user interface from self-contained report contracts. When you open the <strong className="text-white">Report Center</strong>, the left sidebar lists all <strong className="text-white">Available Reports</strong> with search and category filters (<code>All</code>, <code>Accounts</code>, <code>Certs</code>, <code>Identities</code>). Each card shows the report name, category, description, a <code>UNIVERSAL</code> badge, and the TypeScript file that powers it (<code>multi-source-accounts.report.ts</code>, <code>certifications-campaign-export.report.ts</code>, <code>identity-directory-export.report.ts</code>).
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_LightModeTheme.png" 
                  alt="Report Center Light Mode Theme and Dynamic Configuration Workbench" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Dark Mode &amp; Light Mode:</strong> The header shows your connected tenant (<code>devrel-ga-25045</code>) and lets you switch seamlessly between <strong className="text-white">Dark Mode</strong> and <strong className="text-white">Light Mode</strong>.
                </li>
                <li>
                  <strong className="text-white">Report Info &amp; Source Code Viewer:</strong> Clicking a report displays its version, file path, and the exact SailPoint <code>/v1</code> API endpoints it consumes. Clicking <strong className="text-white">View <code>.report.ts</code></strong> opens a modal showing the actual TypeScript implementation code for that report.
                </li>
                <li>
                  <strong className="text-white">Filter &amp; Column Configuration Panels:</strong> Opening <strong className="text-white">Filters &amp; Columns</strong> reveals two side-by-side panels: <strong className="text-white">1. Report Filter Options</strong> on the left and <strong className="text-white">2. Included Columns &amp; Attributes</strong> on the right. Both load live metadata from your tenant. For example, selecting <code>Active Directory</code>, <code>Airgap</code>, and <code>Badging</code> above dynamically loads <code>118</code> account and schema attributes that you can check or uncheck as export columns.
                </li>
              </ul>

              {/* Section 2 */}
              <h2 id="multi-source-accounts-report" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">2. Report #1: Multi-Source Accounts Report (<code>multi-source-accounts.report.ts</code>)</h2>
              <p className="text-slate-300 mb-6">
                In the standard ISC UI, you cannot export accounts from multiple sources at the same time while picking custom connector schema attributes (such as <code>id</code>, <code>sAMAccountName</code>, <code>mail</code>, <code>department</code>, or <code>userPrincipalName</code>) as columns. When we architect this solution for our enterprise clients, we utilize dynamic schema inspection to unify multi-connector account data on demand.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_MultiSourceAccounts.png" 
                  alt="Multi-Source Accounts Report Execution and Results" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Multi-Source Picker (<code>GET /sources/v1</code>):</strong> When you select this report, it loads all sources in the tenant and displays whether each one is <code>Authoritative</code> or a target connector (<code>Active Directory - Direct</code>, <code>DelimitedFile</code>, <code>Web Services</code>, <code>JDBC</code>, etc.).
                </li>
                <li>
                  <strong className="text-white">Automatic Schema Attribute Discovery (<code>onFilterChange</code>):</strong> Whenever you check or uncheck sources in <strong className="text-white">Target Sources (Multi-Select)</strong> (such as <code>Badging</code> and <code>ISC Admins</code> above), the report queries <code>GET /sources/v1/&#123;id&#125;/schemas</code> and samples <code>GET /accounts/v1</code>. Every discovered schema attribute is automatically added to <strong className="text-white">2. Included Columns &amp; Attributes</strong> under <code>Source Schema Attributes</code> (<code>Attr: ...</code>) alongside core account fields (<code>Source Name</code>, <code>Account Name</code>, <code>Native Identity</code>, <code>Correlated Identity</code>, <code>Uncorrelated</code>, <code>Disabled</code>, <code>Locked</code>, <code>Has Entitlements</code>).
                </li>
                <li>
                  <strong className="text-white">Summary Cards &amp; Exports:</strong> Clicking <strong className="text-white">Run Report</strong> pulls the accounts across all selected sources, renders real-time KPI summary totals (<code>Total Accounts</code>, <code>Correlated</code>, <code>Uncorrelated</code>, <code>Disabled Accounts</code>), and displays the interactive data grid with <strong className="text-white">Copy TSV</strong>, <strong className="text-white">Export JSON</strong>, <strong className="text-white">Export CSV</strong>, and row-level JSON <strong className="text-white">Inspect</strong> (<code>👁</code>) buttons.
                </li>
              </ul>

              {/* Section 3 */}
              <h2 id="certifications-campaign-export" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">3. Report #2: Certifications Campaign Status Export (<code>certifications-campaign-export.report.ts</code>)</h2>
              <p className="text-slate-300 mb-6">
                When compliance teams or IAM directors need to audit certification progress across multiple campaigns, clicking into each campaign one by one to generate and download its Campaign Status Report CSV wastes hours of engineering time. Our core engineering methodology structures the data layer to filter campaigns in bulk and merge all of their certification line-items in a single execution pass.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_CertificationsConfig.png" 
                  alt="Certifications Campaign Status Export Filter and Column Configuration" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Campaign Status, Date Range &amp; Type Filters:</strong> The report queries <code>GET /campaigns/v1?detail=FULL</code> and displays how many campaigns exist in your tenant for each status (<code>ACTIVE</code>, <code>STAGED</code>, <code>COMPLETED</code>, <code>PENDING</code>, <code>ACTIVATING</code>, <code>COMPLETING</code>, <code>CANCELING</code>, <code>ARCHIVED</code>, <code>ERROR</code>). You can filter by status, <strong className="text-white">Start Date (From)</strong> and <strong className="text-white">End Date (To)</strong> (with quick <code>30d</code>, <code>90d</code>, <code>1yr</code>, and <code>All</code> preset buttons), <strong className="text-white">Campaign Types</strong> (<code>SEARCH</code>, <code>MANAGER</code>, <code>SOURCE_OWNER</code>, <code>ROLE_COMPOSITION</code>, <code>MACHINE_ACCOUNT</code>), and <strong className="text-white">Item Decision State</strong> (<code>All Items</code>, <code>Open / Undecided Only</code>, <code>Approved / Signed-Off Only</code>, <code>Revoked Only</code>).
                </li>
                <li>
                  <strong className="text-white">Campaign Status CSV Column Picker:</strong> The right panel groups all <code>44</code> official Campaign Status Report columns into organized tabs: <code>Campaign Status Report (Core)</code>, <code>Access Review CSV Columns</code>, <code>Role Composition CSV Columns</code>, and <code>Campaign Metadata (Optional)</code>.
                </li>
              </ul>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_CertificationsExport.png" 
                  alt="Certifications Campaign Status Export Line Items and Official CSV Artifacts" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Automatic Report Generation &amp; CSV Parsing:</strong> For every matching campaign that contains certification items (<code>totalCertifications &gt; 0</code>), the plugin inspects <code>GET /campaigns/v1/&#123;id&#125;/reports</code>. If the <code>CAMPAIGN_STATUS_REPORT</code> has not been generated yet, the plugin automatically calls <code>POST /campaigns/v1/&#123;id&#125;/run-report/CAMPAIGN_STATUS_REPORT</code>, polls until completion, and fetches the resulting CSV from <code>GET /reports/v1/&#123;taskResultId&#125;?fileFormat=CSV</code>.
                </li>
                <li>
                  <strong className="text-white">Combined Line-Item Table &amp; Raw CSV Downloads:</strong> The plugin parses all certification line-items (<code>51</code> line-items above from <code>Role Composition Campaign</code>) into one unified, sortable table. It also provides direct one-click download buttons inside the green <strong className="text-white">Official SailPoint Campaign Status CSV Reports</strong> bar (<code>Role_Composition_Campaign_Campaign_Status_Report.csv</code>). Campaigns with <code>0</code> certification items are automatically skipped and listed in an informational banner so your audit table only contains real review items.
                </li>
              </ul>

              {/* Section 4 */}
              <h2 id="identity-directory-report" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">4. Report #3: Identity Directory &amp; Auth Source Report (<code>identity-directory-export.report.ts</code>)</h2>
              <p className="text-slate-300 mb-6">
                Every enterprise tenant structures its authoritative sources (<code>HR</code>, <code>ISC Admins</code>, <code>Non-Employees</code>, <code>Non-Humans</code>, etc.) and custom Identity Attributes (<code>department</code>, <code>jobTitle</code>, <code>costCenter</code>, <code>location</code>, <code>employeeNumber</code>, etc.) differently. This modular framework ensures that your ISC deployment avoids static column exports and search offset limits when extracting identity populations.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_IdentityDirectory.png" 
                  alt="Identity Directory and Authoritative Source Report" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Authoritative Source Filter:</strong> Queries <code>GET /identity-profiles/v1</code> and <code>GET /sources/v1?filters=authoritative eq true</code> so you can filter identities by one or more Authoritative Sources (<code>HR</code>, <code>ISC Admins</code>, <code>Non-Employees</code>, <code>Non-Humans</code>, <code>Team 47-HR Feed</code>). You can simultaneously filter by <strong className="text-white">Lifecycle State</strong>, <strong className="text-white">Identity Population</strong> (<code>All Identities</code>, <code>People Managers Only</code>, <code>Identities with Assigned Roles</code>, <code>Uncorrelated Identities</code>, <code>Inactive Identities</code>), and keyword query.
                </li>
                <li>
                  <strong className="text-white">Dynamic Identity Attribute Picker (<code>GET /identity-attributes/v1</code>):</strong> Loads every standard and custom Identity Attribute configured in your tenant (<code>67</code> total columns above) and organizes them into <code>Core Identity Fields</code>, <code>Access &amp; Governance Metrics</code> (<code>Total Access Items</code>, <code>Assigned Roles</code>, <code>Access Profiles</code>, <code>Entitlements</code>), <code>Custom Identity Attributes</code>, and <code>Standard Identity Attributes</code>.
                </li>
                <li>
                  <strong className="text-white"><code>All Identities (No Limit)</code> Option:</strong> Implements cursor-based <code>searchAfter</code> pagination (<code>sort: [&apos;id&apos;]</code>, <code>searchAfter: [lastId]</code>) against <code>POST /search/v1?count=true</code> (with an automatic fallback to <code>GET /identities/v1</code>). This allows administrators to pull every identity in the tenant (<code>308</code> identities across the selected sources above, with <code>289</code> active and <code>52</code> people managers) without hitting the 2,500 UI export cap or the 10,000 search offset limit.
                </li>
              </ul>

              {/* Section 5 */}
              <h2 id="how-to-studio-generator" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">5. Modular Architecture: Template, Build &amp; Upload How-To Studio</h2>
              <p className="text-slate-300 mb-6">
                The foundational design principle of the IdentityEXE Report Center Blueprint is zero-boilerplate modularity. To add a new permanent report, engineers never have to touch Angular components, HTML templates, or routing tables. Clicking <strong className="text-white">Template &amp; How-To Studio (<code>+ New Report</code>)</strong> in the top navigation bar opens the embedded developer guide and interactive report generator:
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_HowToStudio.png" 
                  alt="Report Template Build and Upload How-To Studio" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">3-Step Build &amp; Upload Guide:</strong> The <strong className="text-white">How-To Guide</strong> tab walks engineers through adding a permanent report to the plugin bundle:
                  <ol className="list-decimal pl-6 mt-2 space-y-2 text-sm text-slate-300">
                    <li><strong className="text-cyan-400">Step 1 (Copy the Starter Template or Generate One):</strong> Copy <code>src/app/reports/_template.report.ts</code> to <code>src/app/reports/&lt;my-custom-audit&gt;.report.ts</code> (files prefixed with <code>_</code> are ignored by the build scanner).</li>
                    <li><strong className="text-cyan-400">Step 2 (Implement the <code>ReportPluginModule</code> Contract):</strong> Export a <code>ReportPluginModule</code> object defining <code>loadMetadata(ctx)</code>, an optional <code>onFilterChange(ctx, filters, meta)</code> hook, and <code>run(ctx, params)</code>.</li>
                    <li><strong className="text-cyan-400">Step 3 (Build &amp; Upload to Your Tenant):</strong> Run <code>npm run build</code> (which executes <code>scripts/discover-reports.mjs</code> to automatically bundle every <code>*.report.ts</code> file in <code>src/app/reports/</code>) and deploy the compiled bundle with <code>sail ui-plugins upload --env &lt;tenant&gt;</code>. You can also run <code>sail ui-plugins link</code> and <code>npm start</code> for live local development.</li>
                  </ol>
                </li>
              </ul>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_InteractiveGenerator.png" 
                  alt="Interactive Report.ts Generator Studio" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Interactive <code>.report.ts</code> Generator:</strong> The <strong className="text-white">Interactive <code>.report.ts</code> Generator</strong> tab includes 5 starter governance presets (<strong className="text-white">Roles Audit</strong>, <strong className="text-white">Access Profiles</strong>, <strong className="text-white">Entitlements</strong>, <strong className="text-white">Workflows</strong>, <strong className="text-white">SOD Policies</strong>). When you specify a Report ID (<code>roles-governance-audit</code>), Display Name (<code>Roles &amp; Governance Audit Report</code>), Category, SailPoint V1 API Endpoint (<code>/roles/v1?limit=250&amp;sorters=name</code>), and Column Mappings, the studio compiles the complete TypeScript <code>.report.ts</code> module on the right in real time.
                </li>
                <li>
                  <strong className="text-white">Test Live or Download:</strong> Click <strong className="text-white">Register &amp; Test Live in Report Center</strong> to execute your newly generated report immediately inside your active browser session, or click <strong className="text-white">Download <code>roles-governance-audit.report.ts</code></strong> to drop the file straight into <code>src/app/reports/</code> for your next production build and upload.
                </li>
              </ul>

              {/* Section 6 */}
              <h2 id="api-telemetry-inspector" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">6. Built-In SailPoint V1 API Telemetry &amp; cURL Inspector</h2>
              <p className="text-slate-300 mb-6">
                When identity architects need to verify the exact REST calls a report is executing behind the scenes or extract an API query for external automation, clicking <strong className="text-white">API Telemetry</strong> in the top toolbar opens the real-time network inspector.
              </p>

              <div className="my-8 flex flex-col items-center gap-4">
                <img loading="lazy" decoding="async" src="/images/blog/ui-plugin-report-center/ReportCenter_ApiTelemetry.png" 
                  alt="SailPoint V1 API Telemetry and cURL Inspector" 
                  className="max-w-full h-auto object-contain shadow-2xl rounded-2xl border border-white/10" 
                />
              </div>

              <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Live API Log &amp; Response Times:</strong> Every outbound <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, and <code>DELETE</code> request dispatched by the plugin is logged in real time (<code>124 entries</code> above). Each entry records the HTTP method, endpoint URL (<code>/search/v1?limit=250&amp;offset=0&amp;count=true</code>, <code>/identity-profiles/v1</code>, <code>/reports/v1/&#123;taskResultId&#125;</code>, <code>/campaigns/v1</code>, <code>/accounts/v1</code>, <code>/sources/v1</code>), HTTP <code>200</code> status badge, and roundtrip execution latency (<code>305ms</code>).
                </li>
                <li>
                  <strong className="text-white">JSON Payload Viewer &amp; <code>Copy cURL</code>:</strong> Selecting any request on the left displays its full JSON response payload on the right, paired with a one-click <strong className="text-white">Copy cURL</strong> button to export the exact <code>curl</code> command into Postman or your terminal.
                </li>
              </ul>

              <hr className="border-white/10 my-10" />

              {/* Architecture & Code Highlights */}
              <h2 id="architecture-code-highlights" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Architecture &amp; Code Highlights</h2>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the data layer around four foundational components inside the IdentityEXE implementation blueprint:
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. UI Plugin Manifest (<code>sp-ui-plugin.json</code>)</h4>
              <p className="text-slate-300 mb-4">
                The plugin is configured via <code>sp-ui-plugin.json</code> and deployed using the SailPoint CLI (<code>sail ui-plugins create</code> and <code>sail ui-plugins upload</code>):
              </p>

              <pre className="mb-6"><code className="language-json">{`{
  "version": 1,
  "manifest": {
    "alias": "report-center-identityexe",
    "name": {
      "en": "Report Center"
    },
    "description": {
      "en": "Modular, extensible Report Center for SailPoint Identity Security Cloud with drop-in report auto-discovery, live column selection, Multi-Source Accounts reporting, Certification Campaign exports, and Identity Directory reporting."
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
    "outDir": "./dist/report-center-identityexe/browser",
    "port": 4200
  }
}`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">2. The Modular Report Contract (<code>src/app/core/report-contract.models.ts</code>)</h4>
              <p className="text-slate-300 mb-4">
                Every <code>.report.ts</code> file in <code>src/app/reports/</code> implements the <code>ReportPluginModule</code> interface. Because each file encapsulates its own filters, dynamic column definitions (<code>loadMetadata</code>), optional filter-change schema discovery hook (<code>onFilterChange</code>), and execution engine (<code>run</code>), the Angular workbench renders any report module automatically:
              </p>

              <pre className="mb-6"><code className="language-typescript">{`export interface ReportPluginModule {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  icon: string;
  version: string;
  author: string;
  tags: string[];
  endpointsUsed: string[];
  fileName?: string;
  sourceCodePreview?: string;

  /**
   * Loads filters and available columns dynamically from the tenant
   * (e.g. fetching sources, identity profiles, identity attributes, etc.).
   */
  loadMetadata(ctx: ReportExecutionContext): Promise<ReportDynamicMetadata>;

  /**
   * Optional hook called when a filter with \`triggersColumnDiscovery: true\` changes
   * (e.g. when the user selects Sources in the Multi-Source Accounts Report).
   */
  onFilterChange?(
    ctx: ReportExecutionContext,
    currentFilters: Record<string, any>,
    currentMetadata: ReportDynamicMetadata
  ): Promise<Partial<ReportDynamicMetadata> | void>;

  /**
   * Runs the report against the tenant and returns rows, summary metrics, and downloadable files.
   */
  run(ctx: ReportExecutionContext, params: ReportRunParams): Promise<ReportExecutionResult>;
}`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">3. Build-Time Report Scanner (<code>scripts/discover-reports.mjs</code>)</h4>
              <p className="text-slate-300 mb-4">
                When you run <code>npm start</code> or <code>npm run build</code>, <code>scripts/discover-reports.mjs</code> scans <code>src/app/reports/*.report.ts</code> (skipping template or registry files that begin with <code>_</code>) and automatically generates <code>src/app/reports/_registry.generated.ts</code>:
              </p>

              <pre className="mb-6"><code className="language-javascript">{`const allFiles = fs.readdirSync(reportsDir);
const reportFiles = allFiles
  .filter((file) => file.endsWith('.report.ts') && !file.startsWith('_'))
  .sort((a, b) => a.localeCompare(b));

const imports = [];
const registryEntries = [];

reportFiles.forEach((file, index) => {
  const importPath = \`./\${file.replace(/\\.ts$/, '')}\`;
  const fullPath = path.join(reportsDir, file);
  const rawSource = fs.readFileSync(fullPath, 'utf8');
  const modVar = \`reportMod_\${index}\`;

  imports.push(\`import * as \${modVar} from '\${importPath}';\`);
  registryEntries.push(
    \`  { ...extractReportModule(\${modVar}, \${JSON.stringify(file)}), fileName: \${JSON.stringify(file)}, sourceCodePreview: \${JSON.stringify(rawSource)} }\`
  );
});`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">4. Unlimited Identity Pagination (<code>identity-directory-export.report.ts</code>)</h4>
              <p className="text-slate-300 mb-4">
                To support pulling <strong className="text-white">All Identities (No Limit)</strong> in enterprise tenants with well over 10,000 identities, the Identity Directory report implements <code>searchAfter</code> cursor pagination sorted deterministically by <code>id</code>:
              </p>

              <pre className="mb-6"><code className="language-typescript">{`let searchAfterCursor: string[] | null = null;
let expectedTotal: number | undefined;

while (rawIdentities.length < maxIdentities) {
  const limit = Math.min(pageSize, maxIdentities - rawIdentities.length);
  const searchPayload: Record<string, any> = {
    indices: ['identities'],
    query: { query: queryString },
    sort: ['id'],
  };
  if (searchAfterCursor) {
    searchPayload['searchAfter'] = searchAfterCursor;
  }

  const searchUrl: string = searchAfterCursor
    ? \`/search/v1?limit=\${limit}&count=true\`
    : \`/search/v1?limit=\${limit}&offset=0&count=true\`;

  const res = await ctx.plugin.postWithResponse<any[]>(searchUrl, searchPayload);
  if (res.totalCount !== undefined && expectedTotal === undefined) {
    expectedTotal = res.totalCount;
  }
  const items: any[] = Array.isArray(res.data) ? res.data : [];
  if (items.length === 0) break;

  rawIdentities.push(...items);
  const lastId: unknown = items[items.length - 1]?.id;
  if (lastId) {
    searchAfterCursor = [String(lastId)];
  }
  if (items.length < limit) break;
}`}</code></pre>

              <hr className="border-white/10 my-10" />

              {/* Tips & Best Practices */}
              <h2 id="production-best-practices" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Operational Guardrails &amp; Production Best Practices</h2>
              <p className="text-slate-300 mb-6">
                When deploying the Modular Report Center UI Plugin across enterprise SailPoint ISC environments, we enforce the following operational practices:
              </p>

              <ul className="space-y-4 text-slate-300 mb-8 list-disc pl-6">
                <li>
                  <strong className="text-white">Prototyping vs. Bundling Reports:</strong> Use the <strong className="text-white">Interactive <code>.report.ts</code> Generator</strong> (<code>Register &amp; Test Live in Report Center</code>) to rapidly prototype and verify a new report inside your browser session. Once validated, download the <code>.report.ts</code> file, place it in <code>src/app/reports/</code>, and run <code>npm run build &amp;&amp; sail ui-plugins upload</code> so the report is permanently version-controlled and available to all administrators in the tenant.
                </li>
                <li>
                  <strong className="text-white">Customizing Your Export Columns:</strong> The CSV, JSON, and Clipboard TSV export actions strictly export the columns checked in <strong className="text-white">2. Included Columns &amp; Attributes</strong> and respect any active keyword search filter in the table toolbar. Uncheck extraneous columns for executive summaries, or select all discovered schema attributes for a comprehensive compliance audit artifact.
                </li>
                <li>
                  <strong className="text-white">Experimental API Headers:</strong> SailPoint endpoints such as <code>GET /identity-attributes/v1</code> and <code>/task-status/v1</code> require the <code>X-SailPoint-Experimental: true</code> HTTP header, which our <code>SailpointPluginService</code> injects automatically under the hood.
                </li>
              </ul>

              <hr className="border-white/10 my-10" />

              {/* Resources & Source Code */}
              <h2 id="resources-source-code" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Resources &amp; Implementation Artifacts</h2>
              <p className="text-slate-300 mb-6">
                All source code, modular report definitions, auto-discovery build scripts, and the UI plugin manifest are available in the official GitHub repository:
              </p>

              <div className="my-8 p-6 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">rettkowskityler / report-center-identityexe</h4>
                  <p className="text-xs text-slate-400">Complete Angular 21 UI, PrimeNG setup, modular ReportPluginModule contract, auto-discovery scanner, Interactive .report.ts Generator, and 3 built-in universal ISC reports.</p>
                </div>
                <a 
                  href="https://github.com/rettkowskityler/report-center-identityexe" 
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
                  <strong className="text-white">Angular 21 UI &amp; PrimeNG Setup:</strong> Complete full-page workbench with Dark/Light Mode support (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">src/app/</code>).
                </li>
                <li>
                  <strong className="text-white">UI Plugin Manifest:</strong> Configured for the full-page slot and tenant API scopes (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">sp-ui-plugin.json</code>).
                </li>
                <li>
                  <strong className="text-white">Modular Report Contract Interface:</strong> TypeScript interfaces governing dynamic filters, column discovery, and report execution (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">src/app/core/report-contract.models.ts</code>).
                </li>
                <li>
                  <strong className="text-white">Build-Time Discovery Scanner &amp; Starter Template:</strong> Zero-config report bundler (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">scripts/discover-reports.mjs</code>) and drop-in template (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">src/app/reports/_template.report.ts</code>).
                </li>
                <li>
                  <strong className="text-white">3 Built-In Universal Reports:</strong> Multi-Source Accounts (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">multi-source-accounts.report.ts</code>), Certifications Campaign Status Export (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">certifications-campaign-export.report.ts</code>), and Identity Directory &amp; Auth Source Export (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">identity-directory-export.report.ts</code>).
                </li>
                <li>
                  <strong className="text-white">Developer Implementation Guide:</strong> Step-by-step documentation for authoring custom report modules (<code className="text-brand-accent bg-brand-blue/20 px-1.5 py-0.5 rounded">HOW_TO_CREATE_A_REPORT.md</code>).
                </li>
              </ul>

              {/* 3. THE CONVERSION BRIDGE */}
              <div className="mt-16 pt-12 border-t border-white/10">
                <h2 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h2>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Maintaining a fragile patchwork of external PowerShell scripts and manual Excel merges every time auditors or business stakeholders request a custom report is not a scalable governance strategy. By combining a drop-in <code>.report.ts</code> module architecture, live connector schema and identity attribute discovery, an in-app interactive report generator, real-time V1 API telemetry, and three universal out-of-the-box reports (Multi-Source Accounts, Certifications Campaign Status Export, and unlimited cursor-paginated Identity Directory Export), the <strong>Modular Report Center UI Plugin</strong> transforms custom reporting inside SailPoint Identity Security Cloud into a repeatable, self-service discipline.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-cyan-900/30 p-8 rounded-3xl border border-cyan-500/20 shadow-2xl mt-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                    <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                      If your team is hitting configuration walls or struggling with complex ui-plugin-report-center integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
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
