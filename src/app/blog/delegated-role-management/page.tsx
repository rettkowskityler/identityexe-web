import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import roleManagementData from './RoleManagement_cleansed.json';
import addEntitlementData from './AddEntitlementFromRole_cleansed.json';
import removeEntitlementData from './RemoveEntitlementFromRole_cleansed.json';
import roleSelectorFormData from './RoleSelectorForm_cleansed.json';
import roleManagementFormData from './RoleManagementForm_cleansed.json';
import Mermaid from '../../../components/Mermaid';

export default function DelegatedRoleManagementPost() {
  const tocItems = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'identityexe-blueprint', label: 'The IdentityEXE Blueprint' },
    { id: 'ui-execution-forms', label: 'User Interface (Forms)' },
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
              <span className="text-slate-400">Delegated Role Management</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-brand-accent">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              <span>July 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Delegated Role Management in Identity Security Cloud <br />
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
              Out-of-the-box, SailPoint Identity Security Cloud (ISC) requires an administrator to modify role configurations, such as adding or removing entitlements, updating descriptions, or changing owners. This monolithic approach restricts business units from autonomously managing their own access models and forces the core IAM team to act as a bottleneck for routine administrative changes.
            </p>
            <p className="text-slate-300 mb-4">
              Leaving this architectural limitation unsolved has severe commercial and operational impacts. When role owners lack self-service capabilities, organizations experience massive deployment lag and a dramatic increase in operational overhead. Furthermore, relying on a centralized IAM team for every configuration change introduces manager approval fatigue and potential security vulnerabilities, as inappropriate access often lingers while support tickets sit in queue.
            </p>
            <p className="text-slate-300 mb-8">
              To eliminate this bottleneck, IdentityEXE has developed a repeatable architectural methodology for delegated role management. This is not just a script—it is a modular implementation framework designed to empower business owners to manage their assigned roles directly and securely through an interactive launcher, fundamentally shifting the administrative burden away from the core identity team.
            </p>

            <h3 id="identityexe-blueprint" className="text-2xl text-white mt-12 mb-4">The IdentityEXE Blueprint</h3>
            <p className="text-slate-300 mb-6">
              When we architect this solution for our enterprise clients, we utilize two interactive forms and three workflows. This modular framework ensures that your ISC deployment avoids administrative bottlenecks.
            </p>
            <p className="text-slate-300 mb-6">
              Our core engineering methodology structures the data layer to handle the following API calls (all utilizing <code>PATCH /roles/v1/&#123;roleid&#125;</code>):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex flex-col h-full">
                <span className="text-white font-bold mb-2 text-sm">Modify Name</span>
                <pre className="text-xs text-brand-light bg-brand-blue/10 p-3 rounded-lg overflow-x-auto m-0 flex-grow border border-brand-blue/20">
                  <code>{`[\n  {\n    "op": "replace",\n    "path": "/name",\n    "value": "{{newName}}"\n  }\n]`}</code>
                </pre>
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex flex-col h-full">
                <span className="text-white font-bold mb-2 text-sm">Modify Description</span>
                <pre className="text-xs text-brand-light bg-brand-blue/10 p-3 rounded-lg overflow-x-auto m-0 flex-grow border border-brand-blue/20">
                  <code>{`[\n  {\n    "op": "replace",\n    "path": "/description",\n    "value": "{{newDescription}}"\n  }\n]`}</code>
                </pre>
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex flex-col h-full">
                <span className="text-white font-bold mb-2 text-sm">Modify Requestable Status</span>
                <pre className="text-xs text-brand-light bg-brand-blue/10 p-3 rounded-lg overflow-x-auto m-0 flex-grow border border-brand-blue/20">
                  <code>{`[\n  {\n    "op": "replace",\n    "path": "/requestable",\n    "value": {{true/false}}\n  }\n]`}</code>
                </pre>
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex flex-col h-full">
                <span className="text-white font-bold mb-2 text-sm">Change Primary Owner</span>
                <pre className="text-xs text-brand-light bg-brand-blue/10 p-3 rounded-lg overflow-x-auto m-0 flex-grow border border-brand-blue/20">
                  <code>{`[\n  {\n    "op": "replace",\n    "path": "/owner",\n    "value": {\n      "type": "IDENTITY",\n      "id": "{{newOwnerId}}"\n    }\n  }\n]`}</code>
                </pre>
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex flex-col h-full">
                <span className="text-white font-bold mb-2 text-sm">Add Entitlement</span>
                <pre className="text-xs text-brand-light bg-brand-blue/10 p-3 rounded-lg overflow-x-auto m-0 flex-grow border border-brand-blue/20">
                  <code>{`[\n  {\n    "op": "add",\n    "path": "/entitlements/-",\n    "value": {\n      "id": "{{entitlementId}}",\n      "type": "ENTITLEMENT"\n    }\n  }\n]`}</code>
                </pre>
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 flex flex-col h-full">
                <span className="text-white font-bold mb-2 text-sm">Remove Entitlement</span>
                <pre className="text-xs text-brand-light bg-brand-blue/10 p-3 rounded-lg overflow-x-auto m-0 flex-grow border border-brand-blue/20">
                  <code>{`[\n  {\n    "op": "remove",\n    "path": "/entitlements/{{index}}"\n  }\n]`}</code>
                </pre>
              </div>
            </div>

            <div className="bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
              <h4 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Important Security Warning
              </h4>
              <p className="text-amber-200/80 text-sm m-0">
                This form currently includes no approval schema. Users who are granted access to this launcher should be chosen very carefully. While the form restricts users to modifying only the roles they own, they can still potentially add highly privileged entitlements or remove access for many users if the form is used improperly. Please ensure appropriate governance and auditing are in place before deploying.
              </p>
            </div>

            <h3 id="ui-execution-forms" className="text-2xl text-white mt-12 mb-4">User Interface (Forms)</h3>
            <p className="text-slate-300 mb-6">
              The user experience is split into two distinct forms to ensure clarity and provide dynamic context.
            </p>

            <h4 className="text-xl text-white mt-10 mb-4">1. Role Selector Form</h4>
            <p className="text-slate-300 mb-4">
              The first step is selecting the role to manage.
            </p>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Implementation Detail:</strong> This form utilizes an advanced search and form input filter on the owner UID to display only the roles available to the current user. In the main role management workflow, we use <code>trigger.launchedby.id</code> to retrieve this ID and pass it to the form.</li>
            </ul>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/Sample_Execution_Select_Role_Form.png" 
                  alt="Select Role Form"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(roleSelectorFormData, null, 2))}`}
                  download="RoleSelectorForm_cleansed.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Role Selector Form.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">2. Role Management Form</h4>
            <p className="text-slate-300 mb-4">
              Once a role is selected, the second form displays the role's current state and available actions.
            </p>
            
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/Sample_Execution_Modify_Role_Form.png" 
                  alt="Modify Role Form"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(roleManagementFormData, null, 2))}`}
                  download="RoleManagementForm_cleansed.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Role Management Form.json
                </a>
              </div>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Dynamic Summary:</strong> We use a form input to pull a summary from a <code>roles/v1/</code> HTTP call, displaying all relevant details to the user. A "Define Variable" step maps this data and sets the relevant CSS/HTML tags for a clean display.</li>
              <li><strong className="text-white">Conditional Fields:</strong> The form employs heavy conditional logic. When the user selects an action from the "Select Field to Modify" dropdown, the form dynamically adjusts which input fields are visible.</li>
              <li><strong className="text-white">Smart Entitlement Selection:</strong> For the "Remove Entitlement" action, the form uses the entitlements field from the <code>roles/v1/</code> API call as an input. This ensures the user can only select entitlements that are actually assigned to the role, preventing errors.</li>
            </ul>

            <h3 id="implementation-frameworks" className="text-2xl text-white mt-12 mb-4">Implementation Frameworks (Back End)</h3>
            <p className="text-slate-300 mb-8">
              The backend consists of three workflows to handle the logic. The primary workflow manages standard modifications, while two external trigger workflows handle the complexities of adding and removing entitlements.
            </p>

            <h4 className="text-xl text-white mt-10 mb-4">1. Main Role Management Workflow</h4>
            <p className="text-slate-300 mb-4">
              This workflow handles the initial form interactions and standard role updates.
            </p>
            
            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/RoleManagement20260712.png" 
                  alt="Role Management Workflow Diagram"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(roleManagementData, null, 2))}`}
                  download="RoleManagement_cleansed.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Role Management Workflow.json
                </a>
              </div>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Conditional Logic Web:</strong> The workflow uses a web of "Define Comparison" calls to route the execution based on the chosen action.</li>
              <li><strong className="text-white">Handling Arrays vs. Strings:</strong> A key challenge is that adding or removing entitlements can involve a single item (output as a string) or multiple items (output as an array). Passing this directly into a JSON body can break the API call if it expects one format over the other. To resolve this, the workflow branches to handle single and multiple selections distinctly.</li>
            </ul>

            <h4 className="text-xl text-white mt-10 mb-4">2. Add Entitlement Workflow</h4>
            <p className="text-slate-300 mb-4">
              Adding an entitlement is relatively straightforward using a PATCH call, but there is a specific nuance when adding multiple entitlements at once.
            </p>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Wait Time Workaround:</strong> When sending multiple ADD patch requests simultaneously, they can potentially overwrite each other, causing some entitlements to be missed. Standard parallel loops do not work reliably for this scenario. To fix this, a <code>waittime</code> variable (e.g., 5 seconds) is added between iterations in the serial loop to ensure each patch is processed successfully.</li>
            </ul>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/AddEntitlementFromRole20260712.png" 
                  alt="Add Entitlement Workflow"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(addEntitlementData, null, 2))}`}
                  download="AddEntitlementFromRole_cleansed.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Add Entitlement Workflow.json
                </a>
              </div>
            </div>

            <h4 className="text-xl text-white mt-10 mb-4">3. Remove Entitlement Workflow</h4>
            <p className="text-slate-300 mb-4">
              Removing entitlements is the most complex part of this solution due to the mechanics of JSON Patch.
            </p>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Index Shifting Challenge:</strong> JSON Patch only allows removals by index. If you remove one entitlement, the index shifts for all subsequent entitlements. To handle this safely, we perform only <strong>one removal per execution</strong>. We pull the role details fresh every run to ensure we are targeting the correct index.</li>
              <li><strong className="text-white">Dynamic Re-looping:</strong> The workflow has two paths depending on if it receives a string (single item) or an array (multiple items) in the <code>entitlementstoremove</code> trigger. The single path signifies the last entitlement, allowing the workflow to exit. The array path processes the first item, and then makes an HTTP call to re-trigger the workflow with the remaining array items.</li>
            </ul>
            
            <div className="bg-[#0d1117] p-6 rounded-xl border border-white/10 mb-6">
              <Mermaid chart={`flowchart TD
    Start([Workflow Trigger]) --> InputCheck{"entitlementstoremove\\ntype?"}
    
    InputCheck -- "Array (Multiple Items)" --> ExtractFirst["Extract 1st Item"]
    ExtractFirst --> SliceArray["Store Remaining Items\\nin nextlist"]
    SliceArray --> FindIndex["GET Role -> Find Index of 1st Item"]
    FindIndex --> RemoveEntitlement["PATCH: Remove Entitlement by Index"]
    RemoveEntitlement --> RecallWorkflow["POST: Re-Trigger Workflow\\nwith nextlist"]
    RecallWorkflow --> EndMultiple([End Current Execution])

    InputCheck -- "String (Single Item)" --> FindIndexSingle["GET Role -> Find Index of Item"]
    FindIndexSingle --> RemoveSingle["PATCH: Remove Entitlement by Index"]
    RemoveSingle --> EndSingle([End Current Execution])

    RecallWorkflow -.-> |"New Trigger Event\\n(until all removed)"| Start`} />
            </div>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Counter Initialization Bug:</strong> Inside the loops, there is a specific quirk with the set counter variable. If you do not initialize the counter inside the "Define Variable" step when referencing it, it will not output properly in the REMOVE patch call.</li>
            </ul>

            <div className="my-6">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/images/RemoveEntitlementFromRole20260712.png" 
                  alt="Remove Entitlement Workflow"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Download Implementation Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,\${encodeURIComponent(JSON.stringify(removeEntitlementData, null, 2))}`}
                  download="RemoveEntitlementFromRole_cleansed.json"
                  className="bg-brand-blue hover:bg-brand-accent text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Remove Entitlement Workflow.json
                </a>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
              <p className="text-slate-300 mb-8 leading-relaxed font-light">
                This modular architecture provides a streamlined, secure approach to delegated role management, eliminating reliance on native, centralized configuration limitations. By implementing this IdentityEXE framework, enterprises empower their role owners and accelerate identity lifecycle operations.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-deep-slate to-brand-blue/20 p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">A stalled identity governance rollout burns capital and stalls organizational momentum.</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    If your team is hitting configuration walls or struggling with complex delegated-role-management integrations, stop guessing.
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
