import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formRoleSelectorData from './Form-Role-Selector.json';
import workflowPaginatedData from './Workflow-PaginatedIdentityRefresher.json';
import workflowRoleRefresherData from './Workflow-RoleRefresher.json';

export default function PaginatedRoleRefresherPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'identityexe-blueprint', label: 'IdentityEXE Blueprint' },
    { id: 'ui-execution-forms', label: 'User Interface (Forms)' },
    { id: 'workflow-frameworks', label: 'Implementation Frameworks' },
    { id: 'considerations-practices', label: 'Considerations & Best Practices' },
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
              <span className="text-slate-400">Paginated Role Refresher</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              <span>July 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Paginated Role Refresher in Identity Security Cloud <br />
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
            
            <h3 id="executive-summary" className="text-2xl text-white mt-8 mb-4">Executive Summary</h3>
            <p className="text-slate-300 mb-4">
              In SailPoint Identity Security Cloud (ISC), enterprise engineering teams often encounter a critical architectural limitation: the inability to refresh a single role without triggering an "Apply Changes" for the entire tenant. While a global role refresh might be feasible for smaller organizations, executing this across environments with 100k+ identities consumes significant time and system resources.
            </p>
            <p className="text-slate-300 mb-4">
              When this architectural problem remains unsolved, the commercial and operational impacts are severe. Relying on global tenant refreshes causes massive deployment lag and introduces unmanageable bottlenecks in identity lifecycle operations. Furthermore, manual workarounds or delays in access provisioning can lead to failed compliance audits, severe manager approval fatigue, and unaddressed security vulnerabilities due to prolonged inappropriate access.
            </p>
            <p className="text-slate-300 mb-8">
              To overcome this, IdentityEXE designed a repeatable architectural methodology to streamline role processing. This is not just a script, but a modular implementation framework designed to allow administrators to select an individual role and intelligently refresh only the identities associated with that specific role.
            </p>

            <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Tech Stack:</strong> 1 Custom Form + 2 Workflows (Launcher & Paginated Worker)</li>
              <li><strong className="text-white">High-Level Flow:</strong> Using a custom interactive form, an administrator can select the specific role they wish to refresh. A primary workflow takes this input and sends the role data to a dedicated "Paginated Worker" external trigger workflow. This worker handles the pagination and identity refresh API calls in chunks of 250, avoiding timeouts and efficiently processing the users.</li>
            </ul>

            <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">IdentityEXE Blueprint: What It Can and Cannot Do</h3>
            <p className="text-slate-300 mb-6">
              When we architect this solution for our enterprise clients, it is important to understand the boundaries of this solution. Our core engineering methodology structures the data layer to handle the following:
            </p>

            <h4 className="text-xl text-white mb-3">What It Can Do:</h4>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Entitlement Updates:</strong> Update Entitlement/Access Profile membership when a new item is added to the role membership.</li>
              <li><strong className="text-white">Adding Users:</strong> Update when a user is added to the role via the identity list. It adds the role to their cube along with the assigned Entitlements/APs.</li>
              <li><strong className="text-white">Removing Users:</strong> Update when a user is removed via the identity list. It removes the role and the associated Entitlements/APs.</li>
              <li><strong className="text-white">Criteria Changes:</strong> Update when a membership criteria is removed, causing an identity to fall out of the role. The workflow will remove the user from the role and strip the assigned Entitlements/APs.</li>
            </ul>

            <h4 className="text-xl text-white mb-3">What It Cannot Do:</h4>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Refresh Newly Added Role Membership Criteria:</strong> For this scenario, you still need to use the native "Apply Changes" button.</li>
              <li><strong className="text-white">When Removing Entitlements From Roles:</strong> This modular framework does not automatically remove the access from the user. You must remove them from the membership of the role for the access to be completely removed from the user.</li>
            </ul>

            <h3 id="ui-execution-forms" className="text-2xl text-white mt-12 mb-4">User Interface (Forms)</h3>
            <p className="text-slate-300 mb-6">
              We start with an interactive form. Since we cannot build this directly into the role management UI, the form provides a simple drop-down to pick the role and a toggle for <strong>"Identity List Refresh Needed?"</strong> This option is crucial because roles can have members assigned via criteria or specifically via an identity list, and they require different API approaches to refresh.
            </p>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/UI_Form_Execution.png" 
                  alt="UI Form Execution"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formRoleSelectorData, null, 2))}`}
                  download="Form-Role-Selector.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Form Role Selector.json
                </a>
              </div>
            </div>

            <h3 id="workflow-frameworks" className="text-2xl text-white mt-12 mb-4">Implementation Frameworks</h3>
            <p className="text-slate-300 mb-8">
              This modular framework ensures that your ISC deployment avoids rigid boundaries, relying on two workflows working together.
            </p>

            <h4 className="text-xl text-white mt-10 mb-4">1. The Launcher Workflow (Role Refresher)</h4>
            <p className="text-slate-300 mb-4">
              This workflow uses an <code>Interactive Trigger</code>. When launched, it presents the form to the user. Once submitted, a loop iterates through the selected roles and makes an HTTP request to our secondary worker workflow, passing along the role ID and the user's choice for the identity list refresh.
            </p>
            
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/DIAGRAM_RoleRefresher20260630.png" 
                  alt="Role Refresher Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowRoleRefresherData, null, 2))}`}
                  download="Workflow-RoleRefresher.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Workflow Role Refresher.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">2. The Paginated Worker Workflow</h4>
            <p className="text-slate-300 mb-4">
              This is an <code>External Trigger</code> workflow where the heavy lifting and API calls occur. Based on the form input, it branches into two different paths:
            </p>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li>
                <strong className="text-white">Path A: Standard Assigned Identities (Pagination)</strong><br/>
                If the user selected "No" for the identity list refresh, the workflow uses the <code>/roles/v1/&#123;roleId&#125;/assigned-identities</code> endpoint.<br/>
                - It fetches the assigned identities in chunks of 250.<br/>
                - <strong>JSONPath Conversion:</strong> The API returns an array of objects, but the process endpoint expects a simple array of strings (Identity IDs). We use a custom Define Variable step with the JSONPath expression <code>$.hTTPRequest.body[*].id</code> to cleanly extract just the IDs into a new array.<br/>
                - It then submits this array to the <code>/identities/v1/process</code> API. If exactly 250 identities are returned, the workflow recursively calls itself with the offset increased by 250, paginating through all members.
              </li>
              <li>
                <strong className="text-white">Path B: Identity List Refresh (No Pagination)</strong><br/>
                If the user selected "Yes" for the identity list refresh, the workflow takes a different route because fetching the identity list requires a direct GET to the <code>/roles/v1/&#123;roleId&#125;</code> endpoint.<br/>
                - <strong>The Limitation:</strong> Role objects currently limit the returned identity list membership array to a maximum of 500 users. Because of this, this path <strong>does not</strong> perform recursive pagination.<br/>
                - <strong>The Workaround:</strong> To process up to the 500 maximum, we use Define Variable steps with JSONPath slicing. We grab the first 250 users (<code>$.hTTPRequest4.body.membership.identities[0:250].id</code>) and the last 250 users (<code>$.hTTPRequest4.body.membership.identities[-250:].id</code>). We then execute the <code>/identities/v1/process</code> API calls sequentially for both slices.
              </li>
            </ul>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/DIAGRAM_PaginatedIdentityRefresher20260630.png" 
                  alt="Paginated Worker Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowPaginatedData, null, 2))}`}
                  download="Workflow-PaginatedIdentityRefresher.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Paginated Worker Workflow.json
                </a>
              </div>
            </div>

            <h3 id="considerations-practices" className="text-2xl text-white mt-12 mb-4">Considerations & Best Practices</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Permissions:</strong> Restrict access to this form to administrators who understand the impact of manual identity processing.</li>
              <li><strong className="text-white">API Limits:</strong> The <code>/identities/v1/process</code> endpoint is powerful. Paginating at 250 ensures we stay within acceptable processing limits and timeouts.</li>
              <li><strong className="text-white">Testing:</strong> Always validate the form and workflows in a sandbox or non-production tenant before deploying.</li>
            </ul>

            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                This architecture provides a targeted approach to role refreshing, bypassing the need for global tenant changes. By leveraging our framework, identity teams save massive amounts of operational time and system resources, ensuring agile and resilient lifecycle governance.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    If your team is hitting configuration walls or struggling with complex Paginated-Role-Refresher integrations, stop guessing.
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
