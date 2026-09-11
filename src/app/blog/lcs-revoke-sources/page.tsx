import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

import perSourceWorkflow from './PerSourceLCSAccessRemoval.json';


export const metadata: Metadata = {
  title: "Automating Per-Source Access Revocation in SailPoint ISC",
  description: "A repeatable SailPoint Workflows architectural framework to intelligently filter and selectively revoke access only on specific sources during LCS changes.",
  alternates: {
    canonical: 'https://identityexe.com/blog/lcs-revoke-sources',
  },
  openGraph: {
    title: "Automating Per-Source Access Revocation in SailPoint ISC | IdentityEXE",
    description: "A repeatable SailPoint Workflows architectural framework to intelligently filter and selectively revoke access only on specific sources during LCS changes.",
    url: 'https://identityexe.com/blog/lcs-revoke-sources',
    type: 'article',
    siteName: 'IdentityEXE',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Automating Per-Source Access Revocation in SailPoint ISC | IdentityEXE",
    description: "A repeatable SailPoint Workflows architectural framework to intelligently filter and selectively revoke access only on specific sources during LCS changes.",
  },
};

export default function LcsRevokeSourcesPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'implementation-framework', label: 'Implementation Framework' },
    { id: 'code-and-resources', label: 'Code & Design Resources' },
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
              <span className="text-slate-400">Targeted Access Revocation</span>
            </nav>

            <header className="border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              <span>September 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Automating Per-Source Access Revocation <br />
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
            
            <h3 id="executive-summary" className="text-2xl text-white mt-0 mb-4">Executive Summary</h3>
            <p className="text-slate-300 mb-4">
              A frequent architectural limitation when configuring SailPoint ISC Identity Profiles is managing how access is removed when a user leaves the company. Out of the box, there is only a global "Remove All Access" toggle. When enabled, it blindly revokes all access across every single source in ISC as soon as a lifecycle state change triggers it.
            </p>
            <p className="text-slate-300 mb-4">
              Leaving this aggressive revocation unmanaged creates severe operational chaos. Mass unmanaged revocations can accidentally disable critical accounts, leading to failed compliance audits, massive deployment lag, and severe manager approval fatigue when access must be rapidly reprovisioned. In extreme cases, blind revocations open up security vulnerabilities by breaking downstream dependencies and automated workflows.
            </p>
            <p className="text-slate-300 mb-8">
              To resolve this permanently, we don't just deploy a one-off script. We engineered a repeatable architectural methodology designed by IdentityEXE. This modular framework integrates directly with SailPoint Workflows and custom connector attributes to intelligently filter and selectively revoke access only on specific, flagged sources, ensuring your core deployments remain completely stable.
            </p>

            <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
            <p className="text-slate-300 mb-6">
              When we architect this solution for our enterprise clients, we utilize a custom PowerShell script triggered by SailPoint Workflows. It allows administrators to flag individual sources that should be completely revoked during termination, leaving other unflagged sources completely untouched.
            </p>
            
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <img 
                  src="/images/PerSourceLCSAccessRemoval20260906.png" 
                  alt="Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Dynamic Source Identification:</strong> Uses the <code>/sources/v1</code> API to dynamically identify all sources with a custom connector attribute <code>RevokeAll</code> set to <code>True</code>. Includes pagination to support tenants with over 250 sources.</li>
              <li><strong className="text-white">Targeted Access Revocation:</strong> Automatically submits revocation requests for all revocable Entitlements and Access Profiles belonging to those identified sources.</li>
              <li><strong className="text-white">Workflow Native:</strong> Executed natively via the ISC Workflow "Windows Server" action. Note that this requires utilizing a PAG (Privileged Action Gateway) configured in your environment to execute the script.</li>
              <li><strong className="text-white">Rate Limit Safe:</strong> Safely processes bulk revocations by submitting them individually with unique <code>clientMetadata</code> and a 2-second delay to avoid tripping SailPoint's API rate limits or deduplication logic.</li>
              <li><strong className="text-white">Dynamic Summary Generation:</strong> The script automatically generates a clean HTML summary table of exactly what was removed (or states if nothing was removed) and outputs it as a standard JSON payload. This payload feeds directly into the native SailPoint Workflow "Send Email" step.</li>
              <li><strong className="text-white">Audit & Logging:</strong> Full execution logging is captured on the server via <code>Start-Transcript</code>.</li>
            </ul>

            <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: Per-Source LCS Revocation</h3>
            
            <p className="text-slate-300 mb-6">
              Our core engineering methodology structures the data layer to ensure robust and safe execution. The general flow is as follows:
            </p>

            <ol className="space-y-3 text-slate-300 mb-8 list-decimal pl-5">
              <li><strong className="text-white">Trigger:</strong> An "Identity Lifecycle State Changed" trigger fires in the workflow. A JSONPath filter (<code>$[?(@.newLifecycleState == 'terminated')]</code>) ensures it only triggers on terminations. <em>Note: This filter entirely depends on your environment's LCS options and which states you want to execute removals on.</em></li>
              <li><strong className="text-white">Execution:</strong> The Workflow invokes <code>Revoke-LcsAccess.ps1</code> via WinRM, passing the Identity's UUID as an argument.</li>
              <li><strong className="text-white">Evaluation:</strong> The script pulls the user's access via the Search API and cross-references it against all <code>RevokeAll = True</code> sources.</li>
              <li><strong className="text-white">Action:</strong> The script submits individual Access Requests for each matching Entitlement and Access Profile.</li>
              <li><strong className="text-white">Notification:</strong> The script builds an HTML summary of the actions taken and returns it as a JSON <code>Body</code> property. The workflow passes this <code>Body</code> directly to a "Send Email" step to notify administrators.</li>
            </ol>

            <div className="flex flex-col gap-8 mb-8">
              <img src="/images/Screenshot_SampleExecution.png" alt="Workflow Execution Data" className="rounded-lg shadow-xl w-full" />
              <img src="/images/Screenshot_RemovalExample.png" alt="Removal Example Email" className="rounded-lg shadow-xl w-full" />
            </div>

            <p className="text-slate-300 mb-4">
              This modular framework ensures that your ISC deployment avoids silent failures. Here are examples of the email output when no revocable access is found, or when no sources have the flag enabled:
            </p>
            
            <div className="flex flex-col gap-8 mb-8">
              <img src="/images/Screenshot_NoRevocableAccessFound.png" alt="No Revocable Access Found" className="rounded-lg shadow-xl w-full" />
              <img src="/images/Screenshot_NoSourcesFound.png" alt="No Sources Found" className="rounded-lg shadow-xl w-full" />
            </div>

            <h3 id="implementation-framework" className="text-2xl text-white mt-12 mb-4">Implementation Framework: Core Execution</h3>
            
            <p className="text-slate-300 mb-6">
              The <code>Revoke-LcsAccess.ps1</code> script acts as the core engine for evaluating and removing access. Here is a breakdown of the technical decisions made in the script:
            </p>

            <h4 className="text-xl text-white mt-10 mb-4">1. Source Identification (Pagination & <code>RevokeAll</code> flag)</h4>
            <p className="text-slate-300 mb-4">
              The script iterates through the <code>/sources/v1</code> API using a paginated loop to handle tenants with hundreds of sources. During this loop, it checks every source for a custom connector attribute: <code>RevokeAll</code>. If marked with <code>RevokeAll: True</code>, it acts as the list of sources that are going to have access removed.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`$fullRevokeSourceIds = @()
foreach ($source in $sources) {
    if ($source.connectorAttributes.RevokeAll -eq $true -or $source.connectorAttributes.RevokeAll -eq 'True') {
        $fullRevokeSourceIds += $source.id
    }
}`}</code></pre>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">2. Targeted Access Evaluation via Search API</h4>
            <p className="text-slate-300 mb-4">
              Instead of pulling the user's entire identity cube and iterating through it, the script uses a targeted Search API query. This fetches only the relevant access profiles and entitlements assigned to the identity.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`$searchPayload = @{
    indices = @("identities")
    query = @{
        query = "id:\`"$IdentityId\`" AND @access(type:ENTITLEMENT OR type:ACCESS_PROFILE)"
    }
    includeNested = $true
    queryResultFilter = @{
        includes = @("id", "name", "access")
    }
} | ConvertTo-Json -Depth 10`}</code></pre>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">3. Filtering & Safety Checks</h4>
            <p className="text-slate-300 mb-4">
              For each access item, the script respects ISC's native <code>revocable</code> flag, skipping items that cannot be removed through automated provisioning. It then cross-references the access item's source ID against our generated list. This guarantees we leave unflagged source access completely untouched.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`foreach ($accessItem in $identity.access) {
    if ($accessItem.revocable -ne $false) {
        if ($fullRevokeSourceIds -contains $accessItem.source.id) {
            $itemsToRevoke += @{
                type = $accessItem.type
                id = $accessItem.id
            }
        }
    }
}`}</code></pre>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">4. Rate-Limit Safe Revocation Submissions</h4>
            <p className="text-slate-300 mb-4">
              When the script submits requests, it loops through the filtered items one by one. It uses unique <code>clientMetadata</code> for each request and implements a 2-second delay. This explicit delay prevents the script from tripping SailPoint's API rate limits and avoids potential request deduplication issues.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`foreach ($item in $itemsToRevoke) {
    $accessRequestPayload = @{
        requestedFor = @($identityId)
        requestType = "REVOKE_ACCESS"
        requestedItems = @($item)
        clientMetadata = @{
            itemId = $item.id
            sourceName = "LCS Automated Revocation"
        }
    } | ConvertTo-Json -Depth 10

    Invoke-RestMethod -Uri "$TenantUrl/access-requests/v1" -Headers $headers -Method Post -Body $accessRequestPayload
    Start-Sleep -Seconds 2
}`}</code></pre>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">5. Dynamic HTML Summary & Logging</h4>
            <p className="text-slate-300 mb-4">
              Instead of a plain text message, the script generates a clean HTML table summarizing exactly which access items were revoked. Built-in transcript logging also captures all console output for server auditing.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`$jsonResponse = @{
    Body = $htmlSummary
    status = "success"
} | ConvertTo-Json -Depth 2

Write-Output $jsonResponse`}</code></pre>
            </div>

            <h3 id="code-and-resources" className="text-2xl text-white mt-12 mb-4">Code & Design Resources</h3>
            <p className="text-slate-300 mb-6">
              You can utilize the resources below to deploy this in your environment. Make sure to update the PowerShell script variables to match your tenant configuration. Ensure secure credentials handling via DPAPI or a similar secrets manager.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(perSourceWorkflow, null, 2))}`}
                download="PerSourceLCSAccessRemoval.json"
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Workflow JSON
              </a>
              <a 
                href="/downloads/lcs-revoke-sources/Revoke-LcsAccess.ps1"
                download
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Revocation Script
              </a>
              <a 
                href="/downloads/lcs-revoke-sources/Save-IscCredentials.ps1"
                download
                className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Credential Saver
              </a>
            </div>

            <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4">Conclusion</h3>
            <p className="text-slate-300 mb-8">
              This architectural blueprint provides a targeted, automated approach to access revocation during termination, solving the aggressive global revocation problem. By leveraging custom connector attributes and a workflow-triggered script, organizations gain fine-grained control over which sources should have their access fully revoked.
            </p>

            {/* CTA Section */}
            <div className="mt-16 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-accent/20 border border-brand-blue/30 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors duration-500"></div>
              <h4 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10">Stop Guessing with Identity Governance</h4>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10 text-lg">
                An unoptimized identity governance rollout wastes capital and paralyzes organizational momentum. If your team is hitting configuration walls or struggling to implement reliable, targeted access revocations, stop guessing.
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
