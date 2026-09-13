import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

import v1SourceConfig from './sourceconfig_transient_values_v1.json';
import v2SourceConfig from './sourceconfig_parent_chaining_v2.json';

export const metadata: Metadata = {
  title: "Optimizing SailPoint Web Services: The Transient Values Pattern",
  description: "Eliminate the N+1 REST API aggregation explosion in SailPoint Identity Security Cloud by leveraging in-memory transientValues to slash aggregation runtimes by over 90%.",
  alternates: {
    canonical: 'https://identityexe.com/blog/app-onboarding-transient-values',
  },
  openGraph: {
    title: "Optimizing SailPoint Web Services: The Transient Values Pattern | IdentityEXE",
    description: "Eliminate the N+1 REST API aggregation explosion in SailPoint Identity Security Cloud by leveraging in-memory transientValues to slash aggregation runtimes by over 90%.",
    url: 'https://identityexe.com/blog/app-onboarding-transient-values',
    type: 'article',
    siteName: 'IdentityEXE',
    images: [
      {
        url: '/images/blog/app-onboarding-transient-values/opengraph-image.png',
        width: 1200,
        height: 1200,
        alt: 'SailPoint Web Services Connector Optimization - IdentityEXE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Optimizing SailPoint Web Services: The Transient Values Pattern | IdentityEXE",
    description: "Eliminate the N+1 REST API aggregation explosion in SailPoint Identity Security Cloud by leveraging in-memory transientValues to slash aggregation runtimes by over 90%.",
    images: ['/images/blog/app-onboarding-transient-values/opengraph-image.png'],
  },
};

export default function AppOnboardingTransientValuesPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'endpoint-chaining-trap', label: 'The N+1 Chaining Trap' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'empirical-benchmarks', label: 'Empirical Lab Benchmarks' },
    { id: 'connector-framework', label: 'Implementation Framework' },
    { id: 'rule-architecture', label: 'After-Operation Rule Deep Dive' },
    { id: 'production-hardening', label: 'Production Hardening & Gotchas' },
    { id: 'downloads', label: 'Code & Blueprint Downloads' },
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
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-brand-accent transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-brand-accent transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Web Services Optimization</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>September 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Optimizing SailPoint Web Services Connectors: <br />
                <span className="text-brand-blue text-2xl md:text-3xl">The Transient Values Pattern</span>
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
              
              {/* Executive Hook & Business Context */}
              <h3 id="executive-summary" className="text-2xl text-white !mt-0 mb-4">Executive Summary</h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                In enterprise Identity Security Cloud (ISC) and IdentityIQ deployments, onboarding target SaaS applications via the Web Services Connector frequently encounters a severe architectural mismatch: modern REST APIs decouple user identity records from permission assignments across disparate endpoints. Specifically, querying the user endpoint (<code className="text-xs">GET /users</code>) returns basic identity profiles (name, email, department, status) while omitting permission assignments entirely; meanwhile, a separate entitlement endpoint (<code className="text-xs">GET /permissions</code>) hosts inverted membership arrays where permissions list their assigned user IDs. Out of the box, SailPoint attempts to bridge this gap through Parent-Child Endpoint Chaining by executing the parent user query and sequentially firing a secondary child HTTP request for every individual identity returned.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                While parent-child chaining appears functional in low-volume developer sandboxes with 50 test accounts, pushing this design to enterprise scale triggers a catastrophic <strong className="text-white">N+1 HTTP request explosion</strong>. In production, an onboarding population of 10,000 users generates over 10,100 sequential network round-trips. This flood immediately triggers aggressive HTTP 429 rate-limiting from SaaS API gateways, exhausts Virtual Appliance (VA) worker threads, and extends aggregation runtimes from minutes into hours. When aggregations fail midway, critical identity reconciliations freeze. The downstream operational fallout is immediate: failed compliance audits from incomplete access footprints, multi-month deployment lag across enterprise app onboarding pipelines, severe manager approval fatigue caused by duplicate or delayed access certifications, and lingering security vulnerabilities when modified or revoked privileges fail to synchronize.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed">
                To solve this systemic bottleneck permanently, we do not rely on fragile band-aids or custom batch scripts. We engineered the <strong className="text-white">Transient Values Pattern</strong>, a repeatable architectural methodology designed by IdentityEXE. By taking advantage of SailPoint&apos;s connector runtime memory context (<code className="text-xs">transientValues</code>) inside a modular After-Operation Rule, our implementation framework lazy-loads and inverts the permissions catalog on Page 1 into an in-memory hash map, bypassing child network requests entirely for all subsequent pages. This architectural framework reduces total API traffic by over 99%, compressing 22-minute aggregation cycles into 67 seconds while maintaining 100% compliance with native SailPoint schemas.
              </p>

              {/* The Problem: N+1 Endpoint Chaining Trap */}
              <h3 id="endpoint-chaining-trap" className="text-2xl text-white mt-12 mb-4">The N+1 Endpoint Chaining Trap</h3>
              <p className="text-slate-300 mb-4">
                Consider a standard enterprise target REST API where identities and permissions are segregated:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0d1117] rounded-xl p-4 border border-white/10">
                  <div className="text-xs font-mono text-emerald-400 mb-2 font-bold">1. User Endpoint: GET /users</div>
                  <pre className="text-xs text-slate-300 m-0"><code>{`[
  {
    "id": "1001",
    "firstName": "Alex",
    "lastName": "Rivera",
    "email": "alex.rivera@example.com",
    "department": "Engineering",
    "active": true
  },
  {
    "id": "1002",
    "firstName": "Jordan",
    "lastName": "Lee",
    "email": "jordan.lee@example.com",
    "department": "Information Security",
    "active": true
  }
]`}</code></pre>
                </div>
                <div className="bg-[#0d1117] rounded-xl p-4 border border-white/10">
                  <div className="text-xs font-mono text-cyan-400 mb-2 font-bold">2. Entitlement Endpoint: GET /permissions</div>
                  <pre className="text-xs text-slate-300 m-0"><code>{`[
  {
    "id": "PERM_SECURITY_ADMIN",
    "displayName": "Security Admin",
    "members": ["1001", "1042", "2088"]
  },
  {
    "id": "PERM_AUDIT_READONLY",
    "displayName": "Compliance Auditor",
    "members": ["1001", "1002", "3055"]
  }
]`}</code></pre>
                </div>
              </div>

              <p className="text-slate-300 mb-4">
                Notice the schema mismatch: the user records contain zero permissions, while the permissions endpoint holds the assigned member lists.
              </p>

              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 mb-8">
                <h4 className="text-xl text-white mb-3">How Standard Parent-Child Chaining Fails</h4>
                <p className="text-slate-300 mb-4">
                  When teams configure the Web Services Connector using SailPoint&apos;s standard parent-child chaining pattern:
                </p>
                <ol className="list-decimal pl-5 text-slate-300 space-y-2 mb-4">
                  <li>SailPoint queries the parent <code className="text-xs">/users</code> endpoint for a page of accounts.</li>
                  <li>For <em>every single user</em> returned in that payload, the connector fires a distinct child request (e.g., <code className="text-xs">GET /users/$response.id$/permissions</code>).</li>
                </ol>
                <p className="text-slate-300 mb-0">
                  Mathematically, for <span className="font-mono text-brand-accent">N</span> users with pagination size <span className="font-mono text-brand-accent">K</span>, total requests scale linearly as <span className="font-mono text-white">(N / K + 1) + N ∈ O(N)</span>:
                </p>
                <ul className="list-disc pl-5 text-slate-300 space-y-1 mt-3">
                  <li><strong className="text-white">100 users:</strong> 102 network calls</li>
                  <li><strong className="text-white">1,000 users:</strong> 1,012 network calls</li>
                  <li><strong className="text-white">10,000 users:</strong> 10,102 network calls</li>
                </ul>
              </div>

              {/* The Blueprint */}
              <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: The Transient Values Pattern</h3>
              <p className="text-slate-300 mb-6">
                When we architect this solution for our enterprise clients, we utilize SailPoint&apos;s in-memory execution context known as <code className="text-brand-accent">transientValues</code>. Instead of making thousands of repetitive child requests, our core engineering methodology structures the data layer to fetch and invert the entire permissions dataset <strong className="text-white">exactly once</strong> during Account Aggregation.
              </p>

              {/* Architecture Diagram */}
              <div className="my-8">
                <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                  <img 
                    src="/images/blog/app-onboarding-transient-values/transient_values_architecture.png" 
                    alt="Transient Values Inversion Pattern Architecture Diagram" 
                    className="max-w-full h-auto object-contain"
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                  Figure 1: Architectural lifecycle comparison: Lazy-load & In-memory Inversion (Page 1) vs. Cache-hit Instantaneous Injection (Pages 2..N).
                </p>
              </div>

              <p className="text-slate-300 mb-4">
                This modular framework ensures that your ISC deployment avoids redundant network round-trips through a strict three-phase operational cycle:
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-lg font-bold text-brand-accent mb-2">Phase 1: Page 1 Lazy Load & In-Memory Inversion (Cache Miss)</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-0">
                    When the first page of 100 users arrives, the After-Operation Rule inspects <code className="text-xs">application.getAttributeValue(&quot;transientValues&quot;)</code>. Finding it empty, it executes <strong className="text-white">one single GET request</strong> to <code className="text-xs">/permissions</code> via SailPoint&apos;s internal <code className="text-xs">restClient</code>. It iterates through the permissions and inverts the list into a member lookup map: <code className="text-xs">userId -&gt; List&lt;permissionId&gt;</code>. This inverted index is saved directly into <code className="text-xs">transientValues</code>, and the first 100 users are immediately enriched in memory.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-lg font-bold text-cyan-400 mb-2">Phase 2: Pages 2 through End (Cache Hit: Zero Network Requests)</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-0">
                    For all subsequent user pages, the rule checks <code className="text-xs">transientValues</code> and finds the precomputed map already resident in memory. The rule performs <strong className="text-white">zero network calls</strong>. Each user is looked up in <span className="font-mono text-white">O(1)</span> time and enriched before passing the payload back to the connector engine.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-lg font-bold text-emerald-400 mb-2">Phase 3: Standard SailPoint Pipeline Processing</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-0">
                    Because permissions are injected into the account map before the SailPoint connector parser parses the response, account schemas, group schemas, access profiles, and certification campaigns remain 100% native. No custom transforms, dirty identity attributes, or downstream hacks are required.
                  </p>
                </div>
              </div>

              {/* Lab Benchmarks */}
              <h3 id="empirical-benchmarks" className="text-2xl text-white mt-12 mb-4">Empirical Lab Benchmarks: 100 vs. 1,000 vs. 10,000 Users</h3>
              <p className="text-slate-300 mb-6">
                To empirically validate the pattern under realistic conditions, we executed identical aggregation runs comparing <strong className="text-white">V1 (Transient Values)</strong> against <strong className="text-white">V2 (Standard Parent-Child Chaining)</strong>. Tests were configured with 150 enterprise permissions and a simulated 100ms cloud network round-trip time (RTT).
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse border border-white/10 text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 text-white font-bold border-b border-white/10">
                      <th className="p-3">User Count</th>
                      <th className="p-3">Benchmark Metric</th>
                      <th className="p-3 text-brand-accent">V1 (Transient Values)</th>
                      <th className="p-3 text-red-400">V2 (Parent-Child Chaining)</th>
                      <th className="p-3 text-emerald-400">Performance Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">100 Users</td>
                      <td className="p-3">HTTP Requests<br />Duration</td>
                      <td className="p-3 font-mono text-brand-accent font-bold">3 calls<br />6 seconds</td>
                      <td className="p-3 font-mono text-red-400">102 calls<br />17 seconds</td>
                      <td className="p-3 font-bold text-emerald-400">~3x Faster</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">1,000 Users</td>
                      <td className="p-3">HTTP Requests<br />Duration</td>
                      <td className="p-3 font-mono text-brand-accent font-bold">12 calls<br />21 seconds</td>
                      <td className="p-3 font-mono text-red-400">1,012 calls<br />1 min 56 sec</td>
                      <td className="p-3 font-bold text-emerald-400">&gt; 5.5x Faster</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">10,000 Users</td>
                      <td className="p-3">HTTP Requests<br />Duration</td>
                      <td className="p-3 font-mono text-brand-accent font-bold">102 calls<br />1 min 7 sec</td>
                      <td className="p-3 font-mono text-red-400">10,102 calls<br />22 minutes</td>
                      <td className="p-3 font-bold text-emerald-400">&gt; 20x Faster</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-brand-blue/10 border-l-4 border-brand-blue p-4 rounded-r-xl mb-8">
                <h5 className="text-white font-bold mb-1">Why 10,000 Users with Transient Values Finishes Faster than 1,000 Users with Chaining</h5>
                <p className="text-slate-300 text-sm mb-0">
                  For 1,000 users, standard chaining generates <strong className="text-white">1,012 sequential web calls</strong> across WAN connections, consuming almost 2 minutes. For 10,000 users, Transient Values requires only <strong className="text-white">102 total web calls</strong>. Because Transient Values executes ten times fewer network round-trips for a ten-fold larger population, 10,000 accounts aggregate in nearly half the time required for 1,000 accounts under the standard design.
                </p>
              </div>

              {/* Task Details Proof */}
              <h4 className="text-xl text-white mt-8 mb-4">Production Audit Evidence: SailPoint Task Detail Comparisons</h4>

              {/* 100 Users */}
              <div className="mb-8">
                <h5 className="text-base font-bold text-slate-200 mb-3">100 Users: 6 seconds (V1) vs. 17 seconds (V2)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-brand-accent/30 text-center">
                    <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block mb-2">V1: Transient Values (6 Seconds)</span>
                    <img 
                      src="/images/blog/app-onboarding-transient-values/v1_100_users_aggregation.png" 
                      alt="100 Users Aggregation V1" 
                      className="rounded-lg shadow-md mx-auto"
                    />
                  </div>
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-white/10 text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">V2: Parent-Child Chaining (17 Seconds)</span>
                    <img 
                      src="/images/blog/app-onboarding-transient-values/v2_100_users_aggregation.png" 
                      alt="100 Users Aggregation V2" 
                      className="rounded-lg shadow-md mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* 1,000 Users */}
              <div className="mb-8">
                <h5 className="text-base font-bold text-slate-200 mb-3">1,000 Users: 21 seconds (V1) vs. 1 min 56 sec (V2)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-brand-accent/30 text-center">
                    <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block mb-2">V1: Transient Values (21 Seconds)</span>
                    <img 
                      src="/images/blog/app-onboarding-transient-values/v1_1k_users_aggregation.png" 
                      alt="1,000 Users Aggregation V1" 
                      className="rounded-lg shadow-md mx-auto"
                    />
                  </div>
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-white/10 text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">V2: Parent-Child Chaining (1 min 56 sec)</span>
                    <img 
                      src="/images/blog/app-onboarding-transient-values/v2_1k_users_aggregation.png" 
                      alt="1,000 Users Aggregation V2" 
                      className="rounded-lg shadow-md mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* 10,000 Users */}
              <div className="mb-8">
                <h5 className="text-base font-bold text-slate-200 mb-3">10,000 Users: 1 min 7 sec (V1) vs. 22 minutes (V2)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-brand-accent/30 text-center">
                    <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block mb-2">V1: Transient Values (1 min 7 sec)</span>
                    <img 
                      src="/images/blog/app-onboarding-transient-values/v1_10k_users_aggregation.png" 
                      alt="10,000 Users Aggregation V1" 
                      className="rounded-lg shadow-md mx-auto"
                    />
                  </div>
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-white/10 text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">V2: Parent-Child Chaining (22 Minutes)</span>
                    <img 
                      src="/images/blog/app-onboarding-transient-values/v2_10k_users_aggregation.png" 
                      alt="10,000 Users Aggregation V2" 
                      className="rounded-lg shadow-md mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Connector Framework */}
              <h3 id="connector-framework" className="text-2xl text-white mt-12 mb-4">Implementation Framework: Connector Configuration</h3>
              <p className="text-slate-300 mb-6">
                Our core engineering methodology structures the connector configuration to eliminate unnecessary endpoint definitions. In <strong className="text-white">V1 (Transient Values)</strong>, only a single endpoint is declared for Account Aggregation, binding the custom After-Operation Rule directly to the response pipeline.
              </p>

              <h4 className="text-lg text-brand-accent font-bold mb-2">V1: Clean Single-Endpoint Declaration</h4>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-sm text-slate-300 m-0"><code>{`{
  "contextUrl": "/users",
  "httpMethodType": "GET",
  "pagingSize": 100,
  "uniqueNameForEndPoint": "Account Aggregation",
  "operationType": "Account Aggregation",
  "afterRule": "Transient Values After Aggregation Rule",
  "resMappingObj": {
    "id": "id",
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "email",
    "department": "department",
    "title": "title",
    "active": "active",
    "permissions": "permissions"
  }
}`}</code></pre>
              </div>

              <p className="text-slate-300 text-sm mb-6">
                Notice that <code className="text-xs">&quot;permissions&quot;: &quot;permissions&quot;</code> is mapped directly on the <code className="text-xs">/users</code> response mapping, even though the raw HTTP payload lacks this property. The After-Operation Rule injects it before SailPoint evaluates the map.
              </p>

              <h4 className="text-lg text-red-400 font-bold mb-2">V2: The Anti-Pattern (Child Endpoint Chaining)</h4>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-sm text-slate-300 m-0"><code>{`{
  "contextUrl": "/users/$response.id$/permissions",
  "httpMethodType": "GET",
  "uniqueNameForEndPoint": "Account Aggregation - Permissions",
  "operationType": "Account Aggregation",
  "parentEndpointName": "Account Aggregation",
  "resMappingObj": {
    "permissions": "id"
  }
}`}</code></pre>
              </div>

              {/* Rule Architecture */}
              <h3 id="rule-architecture" className="text-2xl text-white mt-12 mb-4">After-Operation Rule Deep Dive</h3>
              <p className="text-slate-300 mb-6">
                The After-Operation Rule acts as the core engine for this pattern. Below is the step-by-step breakdown of how the rule lazily loads permissions on Page 1 and provides <span className="font-mono text-white">O(1)</span> lookups across subsequent pages.
              </p>

              <h4 className="text-xl text-white mt-6 mb-3">1. Retrieve Runtime Memory Context</h4>
              <p className="text-slate-300 mb-4">
                The rule checks <code className="text-xs">application.getAttributeValue(&quot;transientValues&quot;)</code> for the existence of our cached map:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-sm text-slate-300 m-0"><code>{`if (processedResponseObject != null && processedResponseObject instanceof List) {
    List usersList = (List) processedResponseObject;

    // 1. Retrieve transientValues from connector execution context
    Map transientValues = (Map) application.getAttributeValue("transientValues");
    Map userPermMap = null;

    if (transientValues != null && transientValues.containsKey("userPermMap")) {
        userPermMap = (Map) transientValues.get("userPermMap");
    }`}</code></pre>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">2. Single GET Request & In-Memory Inversion (Page 1 Only)</h4>
              <p className="text-slate-300 mb-4">
                If the map is null, the rule queries <code className="text-xs">/permissions</code> once, inheriting headers and bearer authentication from the active context:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-sm text-slate-300 m-0"><code>{`    // 2. Query /permissions ONCE if cache miss
    if (userPermMap == null) {
        userPermMap = new HashMap();
        String targetUrl = requestEndPoint.getBaseUrl() + "/permissions";

        Map headers = new HashMap();
        if (requestEndPoint.getHeader() != null) {
            headers.putAll(requestEndPoint.getHeader());
        }
        headers.put("Content-Type", "application/json");

        List allowedStatuses = new ArrayList();
        allowedStatuses.add("200");

        String permsJson = restClient.executeGet(targetUrl, headers, allowedStatuses);`}</code></pre>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">3. Map Inversion & Caching</h4>
              <p className="text-slate-300 mb-4">
                The permissions list is parsed and inverted: each member ID is assigned a list of permission identifiers:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-sm text-slate-300 m-0"><code>{`        List permsList = null;
        try {
            permsList = (List) new com.google.gson.Gson().fromJson(permsJson, ArrayList.class);
        } catch (Throwable t) {
            permsList = (List) sailpoint.integration.JsonUtil.parse(permsJson);
        }

        if (permsList != null) {
            for (Object permObj : permsList) {
                if (permObj instanceof Map) {
                    Map perm = (Map) permObj;
                    String permId = (String) perm.get("id");
                    List members = (List) perm.get("members");

                    if (members != null) {
                        for (Object memberIdObj : members) {
                            String memberId = String.valueOf(memberIdObj);
                            List userPerms = (List) userPermMap.get(memberId);
                            if (userPerms == null) {
                                userPerms = new ArrayList();
                                userPermMap.put(memberId, userPerms);
                            }
                            userPerms.add(permId);
                        }
                    }
                }
            }
        }

        // Cache inverted map for Pages 2..N
        if (transientValues == null) {
            transientValues = new HashMap();
        }
        transientValues.put("userPermMap", userPermMap);
        application.setAttribute("transientValues", transientValues);
    }`}</code></pre>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">4. In-Memory User Enrichment</h4>
              <p className="text-slate-300 mb-4">
                With the map cached, current page identities are resolved instantly:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-sm text-slate-300 m-0"><code>{`    // 4. Enrich users in-memory
    for (Object userObj : usersList) {
        if (userObj instanceof Map) {
            Map userMap = (Map) userObj;
            String userId = String.valueOf(userMap.get("id"));

            List assignedPerms = (List) userPermMap.get(userId);
            if (assignedPerms != null) {
                userMap.put("permissions", assignedPerms);
            } else {
                userMap.put("permissions", new ArrayList());
            }
        }
    }
}

return processedResponseObject;`}</code></pre>
              </div>

              {/* Production Hardening & Gotchas */}
              <h3 id="production-hardening" className="text-2xl text-white mt-12 mb-4">Production Hardening & Scripting Gotchas</h3>
              <p className="text-slate-300 mb-6">
                When deploying this pattern into enterprise ISC tenants, several critical runtime nuances must be addressed to ensure complete stability:
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10">
                  <h4 className="text-white font-bold text-base mb-2">1. BeanShell Generics Parsing Limitations</h4>
                  <p className="text-slate-300 text-sm mb-0">
                    SailPoint After-Operation Rules execute within a BeanShell interpreter. BeanShell frequently fails when parsing generic definitions containing commas (such as <code className="text-xs">Map&lt;String, List&lt;String&gt;&gt;</code> or parameterized <code className="text-xs">TypeToken</code>). Always utilize raw types (<code className="text-xs">Map</code>, <code className="text-xs">List</code>, <code className="text-xs">HashMap</code>, <code className="text-xs">ArrayList</code>) to prevent runtime syntax errors during aggregation startup.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10">
                  <h4 className="text-white font-bold text-base mb-2">2. Resilient JSON Parsing Strategy</h4>
                  <p className="text-slate-300 text-sm mb-0">
                    Never depend on static utility classes that may vary across patch levels. Implement a dual-parser structure utilizing <code className="text-xs">new com.google.gson.Gson().fromJson()</code> enclosed in a <code className="text-xs">try-catch</code> block with an immediate fallback to <code className="text-xs">sailpoint.integration.JsonUtil.parse()</code>.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10">
                  <h4 className="text-white font-bold text-base mb-2">3. Internal WebServicesClient Execution</h4>
                  <p className="text-slate-300 text-sm mb-0">
                    Do not attempt to instantiate external HTTP clients. Leverage the pre-injected <code className="text-xs">restClient</code> variable directly via <code className="text-xs">restClient.executeGet(targetUrl, headers, allowedStatuses)</code>. Extract existing authorization headers from <code className="text-xs">requestEndPoint.getHeader()</code> to guarantee OAuth bearer tokens and custom gateway headers are inherited without re-authenticating.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10">
                  <h4 className="text-white font-bold text-base mb-2">4. Paging Termination Alignment</h4>
                  <p className="text-slate-300 text-sm mb-0">
                    Ensure connector paging configurations account for zero-record payloads. When target APIs return an empty array <code className="text-xs">[]</code> at the end of a dataset, configuring <code className="text-xs">TERMINATE_IF $RECORDS_COUNT$ &lt; $limit$</code> cleanly stops pagination without risking runaway loops.
                  </p>
                </div>
              </div>

              {/* Downloads & Resources */}
              <h3 id="downloads" className="text-2xl text-white mt-12 mb-4">Code & Blueprint Downloads</h3>
              <p className="text-slate-300 mb-6">
                All production blueprints, connector JSON exports, and the After-Operation Java Rule are available for direct download below:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(v1SourceConfig, null, 2))}`}
                  download="sourceconfig_transient_values_v1.json"
                  className="bg-[#0d1117] hover:bg-white/5 border border-brand-accent/30 hover:border-brand-accent p-5 rounded-xl transition-all flex flex-col justify-between group no-underline"
                >
                  <div>
                    <div className="text-brand-accent font-bold text-sm mb-1 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      V1 Source Config (JSON)
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Optimized Transient Values connector setup.</p>
                  </div>
                  <span className="text-xs text-brand-light font-bold">Download V1 Config (13.3 KB)</span>
                </a>

                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(v2SourceConfig, null, 2))}`}
                  download="sourceconfig_parent_chaining_v2.json"
                  className="bg-[#0d1117] hover:bg-white/5 border border-white/10 hover:border-white/20 p-5 rounded-xl transition-all flex flex-col justify-between group no-underline"
                >
                  <div>
                    <div className="text-slate-300 font-bold text-sm mb-1 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      V2 Source Config (JSON)
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Baseline Parent-Child chaining reference.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">Download V2 Config (14.1 KB)</span>
                </a>

                <a 
                  href="/downloads/app-onboarding-transient-values/transient_values_after_aggregation_rule.java"
                  download
                  className="bg-[#0d1117] hover:bg-white/5 border border-purple-500/30 hover:border-purple-500 p-5 rounded-xl transition-all flex flex-col justify-between group no-underline"
                >
                  <div>
                    <div className="text-purple-400 font-bold text-sm mb-1 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      After-Operation Rule (Java)
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Complete production-hardened rule script.</p>
                  </div>
                  <span className="text-xs text-purple-300 font-bold">Download Rule (4.2 KB)</span>
                </a>
              </div>

              {/* Conclusion & High-Converting CTA */}
              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Relying on out-of-the-box parent-child endpoint chaining for decoupled REST APIs creates a dangerous architectural scalability bottleneck. As identity populations expand into the thousands, the resulting N+1 request cascade degrades system performance, triggers API rate limits, and compromises compliance audit integrity. By implementing the Transient Values Pattern, enterprises eliminate over 99% of network overhead, transform multi-hour aggregation lag into sub-minute runs, and ensure robust, enterprise-grade identity governance.
                </p>

                {/* Conversion CTA Box */}
                <div className="mt-12 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-brand-blue/20 via-slate-900/90 to-brand-accent/20 border border-brand-blue/30 text-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors duration-500"></div>
                  <h4 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10">
                    Stop Guessing with Identity Governance Rollouts
                  </h4>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10 text-base md:text-lg leading-relaxed">
                    A stalled identity governance rollout burns capital and stalls organizational momentum. If your team is hitting configuration walls or struggling with complex Web Services connector and REST API integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-block bg-brand-accent hover:bg-white text-white hover:text-brand-accent font-black py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(255,107,0,0.5)] relative z-10 uppercase tracking-wider text-sm no-underline"
                  >
                    Book Your SailPoint Architecture Review
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
