import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

export default function RecursiveGovernancePost() {
  const tocItems = [
    { id: 'problem-invisible-access', label: "The Problem: 'Invisible' Access" },
    { id: 'architecture-recursive-governance', label: 'The Architecture: Recursive Governance' },
    { id: 'implementation-deep-dive', label: 'Implementation Deep Dive' },
    { id: 'closing-loop-certifications', label: 'Closing the Loop: The Certification Campaign' },
    { id: 'code-design-choices', label: 'Code & Design Choices' },
    { id: 'how-it-works-benefits', label: 'How It Works & Key Benefits' },
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
              <a href="/" className="hover:text-blue-400 transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-blue-400 transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">PAT Governance</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-blue-400">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>May 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Implementing Recursive Governance <br />
              <span className="text-blue-500 text-2xl md:text-3xl">(How to govern SailPoint ISC PATs using a Web Services Connector)</span>
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden p-[2px]">
                <img src="/images/profile.jpg" alt="Tyler" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <p className="text-white">Tyler</p>
                <p>IdentityEXE Founder</p>
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:text-blue-300 prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
            
            <h3 id="problem-invisible-access" className="text-2xl text-white mt-8 mb-4">The Problem: "Invisible" Access</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">The Rise of PATs:</strong> Personal Access Tokens (PATs) are very common in SailPoint ISC implementations due to almost all ISC API endpoints requiring a PAT to execute the call.</li>
              <li><strong className="text-white">The Governance Gap:</strong> Most organizations certify User-to-Group memberships but lose visibility once a user generates a long-lived PAT.</li>
              <li><strong className="text-white">The Risk:</strong> A PAT often carries the full permissions of the user who created it, effectively acting as a "ghost" credential that bypasses standard SSO/MFA after creation.</li>
            </ul>

            <h3 id="architecture-recursive-governance" className="text-2xl text-white mt-12 mb-4">The Architecture: Recursive Governance</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">The "Why":</strong> Why build a custom connector? Because treating PATs as "Entitlements" in a separate Source allows them to be pulled into the standard Identity Cube and gain crucial visibility.</li>
              <li><strong className="text-white">Connector Choice:</strong> By using a Web Services connector, we can automate the aggregation, removal, and reviews of PATs without manual effort.</li>
              <li><strong className="text-white">Endpoint Configuration:</strong> <a href="https://developer.sailpoint.com/docs/api/v2025/list-personal-access-tokens/" target="_blank" rel="noopener noreferrer">List Personal Access tokens</a>
                <ul className="list-circle pl-5 mt-2 space-y-2">
                  <li>Base URL: <code>https://{'{'}tenant{'}'}.api.identitynow.com</code></li>
                  <li>Authentication: OAuth2 (Client Credentials).
                    <ul className="list-square pl-5 mt-1">
                      <li className="font-mono text-sm"><span className="text-purple-400 mr-2">POST</span> <code>https://{'{'}tenant{'}'}.api.identitynow.com/oauth/token</code></li>
                    </ul>
                  </li>
                  <li>API Endpoints:
                    <ul className="list-square pl-5 mt-1">
                      <li className="font-mono text-sm"><span className="text-green-400 mr-2">GET</span> <code>/v2025/personal-access-tokens</code></li>
                      <li className="font-mono text-sm"><span className="text-red-400 mr-2">DELETE</span> <code>/v2025/personal-access-tokens/{'{'}id{'}'}</code></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <h3 id="implementation-deep-dive" className="text-2xl text-white mt-12 mb-4">Implementation Deep Dive</h3>
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-8">
              <h4 className="text-xl text-white mb-3">Schema Design: What attributes are we mapping and from where?</h4>
              
              <h5 className="text-lg text-blue-400 mt-4 mb-2">Account - <code>/v2025/personal-access-tokens</code></h5>
              <ul className="list-disc pl-5 text-slate-300 space-y-1 mb-4">
                <li><code>identityname</code> ↔ <code>Owner.Name</code></li>
                <li><code>identityid</code> ↔ <code>Owner.id</code></li>
                <li><code>PATids</code> ↔ <code>id</code></li>
              </ul>

              <h5 className="text-lg text-blue-400 mt-4 mb-2">Group - <code>/v2025/personal-access-tokens</code></h5>
              <ul className="list-disc pl-5 text-slate-300 space-y-1">
                <li><code>id</code> ↔ <code>id</code></li>
                <li><code>scope</code> ↔ <code>scope</code></li>
                <li><code>created</code> ↔ <code>created</code></li>
                <li><code>lastUsed</code> ↔ <code>lastUsed</code></li>
                <li><code>managed</code> ↔ <code>managed</code></li>
                <li><code>accessTokenValiditySeconds</code> ↔ <code>accessTokenValiditySeconds</code></li>
                <li><code>expirationDate</code> ↔ <code>expirationDate</code></li>
                <li><code>userAwareTokenNeverExpires</code> ↔ <code>userAwareTokenNeverExpires</code></li>
                <li><code>name</code> ↔ <code>name</code></li>
                <li><code>ownertype</code> ↔ <code>Owner.Type</code></li>
                <li><code>ownerid</code> ↔ <code>Owner.id</code></li>
                <li><code>ownername</code> ↔ <code>Owner.name</code></li>
                <li><code>description</code> ↔ Custom Mapping from Rule</li>
              </ul>
            </div>

            <p className="text-slate-300">
              <strong className="text-white">The "Virtual" Entitlement:</strong> Although PATs don't grant "access", we can represent them as entitlements so we can perform governance on the tokens themselves. This is accomplished by querying the same <code>/v2025/personal-access-tokens</code> endpoint for both account and group aggregations.
            </p>

            <div className="my-10 flex justify-center bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden p-4">
              <img 
                src="/images/blog/recursive-governance/virtual_entitlement.png" 
                alt="Virtual Entitlement representation in SailPoint ISC"
                className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <p className="text-slate-300">
              <strong className="text-white">Source JSON Changes:</strong> Since this connector is custom and serves a very specific purpose, I've removed many of the standard features that web services connectors typically have so we don't accidentally call them and throw errors in the tenant. You'll see in the source JSON below that the <code>features</code> flag only contains <code>PROVISIONING</code>, which is all this connector needs to be able to pull in and revoke PATs.
            </p>

            <h3 id="closing-loop-certifications" className="text-2xl text-white mt-12 mb-4">Closing the Loop: The Certification Campaign</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Visibility:</strong> Since we can now store these PATs as entitlements on a user's identity cube, this opens the door for us to run certification campaigns on the PATs.</li>
              <li><strong className="text-white">The Review Process:</strong> Managers can now see <em>exactly</em> how many active tokens their developers have and when they were last used.</li>
            </ul>

            <div className="my-10 flex justify-center bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden p-4">
              <img 
                src="/images/blog/recursive-governance/certification_campaign.png" 
                alt="Certification Campaign Manager Review"
                className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Remediation:</strong> Using the "Revoke" action in the certification campaign triggers the API call that revokes the token in ISC.</li>
            </ul>

            <div className="my-10 flex justify-center bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden p-4">
              <img 
                src="/images/blog/recursive-governance/remediation_action.png" 
                alt="Remediation Revoke Action"
                className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <h3 id="code-design-choices" className="text-2xl text-white mt-12 mb-4">Code & Design Choices</h3>

            {/* AFTER ACCOUNT AGGREGATION RULE CARD */}
            <h4 className="text-xl text-blue-400 mt-8 mb-3">After Account Aggregation Rule</h4>
            <p className="text-slate-300 mb-4">
              The After Account Aggregation rule is what allows us to save back an account object for a user even though we receive multiple entries of PATs in the GET <code>/v2025/personal-access-tokens</code> call. The rule scans for the first occurrence of a user, aggregates all PAT IDs assigned to them, and saves that single consolidated row back to <code>processedResponseObject</code>.
            </p>

            <div className="glass-card border border-white/10 rounded-2xl p-6 mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-0.5">after-account-aggregation-rule.java</h4>
                    <p className="text-slate-400 text-xs font-light">BeanShell After Aggregation Rule (3.5 KB)</p>
                  </div>
                </div>
                <a 
                  href="/downloads/recursive-governance/after-account-aggregation-rule.java" 
                  download="after-account-aggregation-rule.java"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Rule
                </a>
              </div>
              
              <details className="group border-t border-white/5 pt-4">
                <summary className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-colors cursor-pointer list-none flex items-center gap-2 select-none">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Show Code Preview
                </summary>
                <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-4 border border-white/10 max-h-[350px] overflow-y-auto">
<pre className="text-sm text-blue-300 m-0"><code>{`import connector.common.Util;
import java.util.*;
import java.net.*;
import java.io.*;
import org.json.*;

String logPrefix = "Personal Access Token Management - After Aggregation Rule";

// ── CONFIG ────────────────────────────────────────────────────────────────────
String baseUrl     = application.getAttributeValue("genericWebServiceBaseUrl");
Map    headerMap   = requestEndPoint.getHeader();
String accessToken = (headerMap == null) ? null : (String) headerMap.get("Authorization");

if (Util.isNullOrEmpty(accessToken)) throw new Exception("Authorization header is missing");

// ── MAIN ──────────────────────────────────────────────────────────────────────
if (!(processedResponseObject instanceof List)) return processedResponseObject;

List accounts = (List) processedResponseObject;
log.error(logPrefix + "processedResponseObject rows: " + accounts.size());

// ── STEP 1: collect all PATids per identityid from processedResponseObject ───
// identityid -> List of PATids
Map patsByIdentity = new LinkedHashMap();
// identityid -> first row index (the row we'll keep)
Map firstRowIndex = new HashMap();

for (int i = 0; i < accounts.size(); i++) {
    Object rowObj = accounts.get(i);
    if (!(rowObj instanceof Map)) continue;
    Map row = (Map) rowObj;

    Object identityIdObj = row.get("identityid");
    if (identityIdObj == null) continue;
    String identityId = String.valueOf(identityIdObj).trim();
    if (Util.isNullOrEmpty(identityId)) continue;

    if (!patsByIdentity.containsKey(identityId)) {
        patsByIdentity.put(identityId, new ArrayList());
        firstRowIndex.put(identityId, i);
    }

    Object patIdObj = row.get("PATid");
    if (patIdObj instanceof List) {
        ((List) patsByIdentity.get(identityId)).addAll((List) patIdObj);
    } else if (patIdObj != null) {
        String patId = String.valueOf(patIdObj).trim();
        if (Util.isNotNullOrEmpty(patId)) {
            ((List) patsByIdentity.get(identityId)).add(patId);
        }
    }
}

log.error(logPrefix + "Unique identities found: " + patsByIdentity.size());

// ── STEP 2: update the first row for each identity with full PATid list,
//            mark duplicate rows for removal ────────────────────────────────
Set indicesToRemove = new HashSet();

for (Object identityId : patsByIdentity.keySet()) {
    int keepIdx = (Integer) firstRowIndex.get(identityId);
    Map keepRow = (Map) accounts.get(keepIdx);
    keepRow.put("PATid", patsByIdentity.get(identityId));
    log.error(logPrefix + "identityId " + identityId + " -> PATids: " + patsByIdentity.get(identityId));

    // Mark all other rows with this identityid for removal
    for (int i = 0; i < accounts.size(); i++) {
        if (i == keepIdx) continue;
        Object rowObj = accounts.get(i);
        if (!(rowObj instanceof Map)) continue;
        Object rowIdentityId = ((Map) rowObj).get("identityid");
        if (rowIdentityId != null && identityId.equals(String.valueOf(rowIdentityId).trim())) {
            indicesToRemove.add(i);
        }
    }
}

// ── STEP 3: remove duplicate rows (iterate in reverse to preserve indices) ───
List indicesToRemoveList = new ArrayList(indicesToRemove);
Collections.sort(indicesToRemoveList, Collections.reverseOrder());
for (Object idx : indicesToRemoveList) {
    accounts.remove((int)(Integer) idx);
}

log.error(logPrefix + "Final row count after consolidation: " + accounts.size());

return processedResponseObject;`}</code></pre>
                </div>
              </details>
            </div>

            {/* AFTER GROUP AGGREGATION RULE CARD */}
            <h4 className="text-xl text-blue-400 mt-8 mb-3">After Group Aggregation Rule</h4>
            <p className="text-slate-300 mb-4">
              The After Group Aggregation rule is purely for populating the description attribute of each entitlement. Since we want the reviewer to be able to view all the details up front in the certification campaign, I used this rule to group all the relevant attributes about each PAT and separate them by pipe characters (<code>|</code>) so the reviewer has full context as to what they are reviewing. Here is an example description field for a PAT:
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-4 border border-white/10">
              <pre className="text-sm text-slate-300 m-0"><code>Name: AI Agent | Owner: IdentityEXE | Scopes: iai:access-request-recommender:read, iai:decisions:manage | Created: 2026-05-17T18:45:50.565Z | Last Used: N/A | Expiration Date: N/A | Managed: false | Access Token Validity: 43200 | User Aware Token Never Expires: N/A</code></pre>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl p-6 mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-0.5">after-group-aggregation-rule.java</h4>
                    <p className="text-slate-400 text-xs font-light">BeanShell Group Aggregation Description Rule (2.5 KB)</p>
                  </div>
                </div>
                <a 
                  href="/downloads/recursive-governance/after-group-aggregation-rule.java" 
                  download="after-group-aggregation-rule.java"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Rule
                </a>
              </div>
              
              <details className="group border-t border-white/5 pt-4">
                <summary className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-colors cursor-pointer list-none flex items-center gap-2 select-none">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Show Code Preview
                </summary>
                <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-4 border border-white/10 max-h-[350px] overflow-y-auto">
<pre className="text-sm text-blue-300 m-0"><code>{`import connector.common.Util;
import java.util.*;

String logPrefix = "Personal Access Token Management - After Group Aggregation Rule";

if (!(processedResponseObject instanceof List)) return processedResponseObject;

List groups = (List) processedResponseObject;

for (Object groupObj : groups) {
    if (!(groupObj instanceof Map)) continue;
    Map group = (Map) groupObj;

    // 1. Handle Scopes (Multi-valued to Pipe/Comma Delimited)
    String scopesStr = "None";
    Object scopeObj = group.get("scope");
    if (scopeObj instanceof List) {
        scopesStr = Util.listToCsv((List) scopeObj);
    } else if (scopeObj != null) {
        scopesStr = String.valueOf(scopeObj);
    }

    // 2. Data Extraction with N/A fallbacks
    String name      = group.get("name") != null ? String.valueOf(group.get("name")) : "N/A";
    String owner     = group.get("ownername") != null ? String.valueOf(group.get("ownername")) : "N/A";
    String created   = group.get("created") != null ? String.valueOf(group.get("created")) : "N/A";
    String lastUsed  = group.get("lastUsed") != null ? String.valueOf(group.get("lastUsed")) : "N/A";
    String expDate   = group.get("expirationDate") != null ? String.valueOf(group.get("expirationDate")) : "N/A";
    String managed   = group.get("managed") != null ? String.valueOf(group.get("managed")) : "N/A";
    String validity  = group.get("accessTokenValiditySeconds") != null ? String.valueOf(group.get("accessTokenValiditySeconds")) : "N/A";
    String neverExp  = group.get("userAwareTokenNeverExpires") != null ? String.valueOf(group.get("userAwareTokenNeverExpires")) : "N/A";

    // 3. Formatted Description String
    StringBuilder sb = new StringBuilder();
    sb.append("Name: ").append(name).append(" | ");
    sb.append("Owner: ").append(owner).append(" | ");
    sb.append("Scopes: ").append(scopesStr).append(" | ");
    sb.append("Created: ").append(created).append(" | ");
    sb.append("Last Used: ").append(lastUsed).append(" | ");
    sb.append("Expiration Date: ").append(expDate).append(" | ");
    sb.append("Managed: ").append(managed).append(" | ");
    sb.append("Access Token Validity: ").append(validity).append(" | ");
    sb.append("User Aware Token Never Expires: ").append(neverExp);

    group.put("description", sb.toString());
}
return processedResponseObject;`}</code></pre>
                </div>
              </details>
            </div>

            {/* ACCOUNT SCHEMA CARD */}
            <h4 className="text-xl text-blue-400 mt-8 mb-3">Account Schema</h4>
            <p className="text-slate-300 mb-4">
              The Account Schema defines the correlation attributes for linking Consolidating Personal Access Token references back to the User Profile.
            </p>

            <div className="glass-card border border-white/10 rounded-2xl p-6 mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-0.5">account-schema.json</h4>
                    <p className="text-slate-400 text-xs font-light">SailPoint Connector Account Schema Export (1.2 KB)</p>
                  </div>
                </div>
                <a 
                  href="/downloads/recursive-governance/account-schema.json" 
                  download="account-schema.json"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </a>
              </div>
              
              <details className="group border-t border-white/5 pt-4">
                <summary className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-colors cursor-pointer list-none flex items-center gap-2 select-none">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Show Code Preview
                </summary>
                <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-4 border border-white/10 max-h-[350px] overflow-y-auto">
<pre className="text-sm text-slate-300 m-0"><code>{`{
    "nativeObjectType": "user",
    "identityAttribute": "identityid",
    "displayAttribute": "identityname",
    "hierarchyAttribute": null,
    "includePermissions": false,
    "features": [],
    "configuration": {},
    "attributes": [
        {
            "name": "identityid",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "identityid",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "identityname",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "identityname",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "PATid",
            "nativeName": null,
            "type": "STRING",
            "schema": {
                "type": "CONNECTOR_SCHEMA",
                "id": "GROUPSCHEMAIDHERE",
                "name": "group"
            },
            "description": "PATid",
            "isMulti": true,
            "isEntitlement": true,
            "isGroup": true
        }
    ],
    "name": "account"
}`}</code></pre>
                </div>
              </details>
            </div>

            {/* GROUP SCHEMA CARD */}
            <h4 className="text-xl text-blue-400 mt-8 mb-3">Group Schema</h4>
            <p className="text-slate-300 mb-4">
              The Group Schema captures the details of the Personal Access Tokens, modeling them as entitlements in SailPoint ISC.
            </p>

            <div className="glass-card border border-white/10 rounded-2xl p-6 mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-0.5">group-schema.json</h4>
                    <p className="text-slate-400 text-xs font-light">SailPoint Connector Group Schema Export (2.8 KB)</p>
                  </div>
                </div>
                <a 
                  href="/downloads/recursive-governance/group-schema.json" 
                  download="group-schema.json"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </a>
              </div>
              
              <details className="group border-t border-white/5 pt-4">
                <summary className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-colors cursor-pointer list-none flex items-center gap-2 select-none">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Show Code Preview
                </summary>
                <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-4 border border-white/10 max-h-[350px] overflow-y-auto">
<pre className="text-sm text-slate-300 m-0"><code>{`{
    "nativeObjectType": "group",
    "identityAttribute": "id",
    "displayAttribute": "name",
    "hierarchyAttribute": null,
    "includePermissions": false,
    "features": [],
    "configuration": {},
    "attributes": [
        {
            "name": "id",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "id",
            "isMulti": true,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "scope",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "scope",
            "isMulti": true,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "created",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "created",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "lastUsed",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "lastUsed",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "managed",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "managed",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "accessTokenValiditySeconds",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "accessTokenValiditySeconds",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "expirationDate",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "expirationDate",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "userAwareTokenNeverExpires",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "userAwareTokenNeverExpires",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "name",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "name",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "ownertype",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "ownertype",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "ownerid",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "ownerid",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "ownername",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "ownername",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "description",
            "nativeName": null,
            "type": "STRING",
            "schema": null,
            "description": "description",
            "isMulti": false,
            "isEntitlement": false,
            "isGroup": false
        }
    ],
    "name": "group"
}`}</code></pre>
                </div>
              </details>
            </div>

            {/* SOURCE CONFIGURATION CARD */}
            <h4 className="text-xl text-blue-400 mt-8 mb-3">Source Configuration</h4>
            <p className="text-slate-300 mb-4">
              The complete JSON structure for importing the Web Services source into your SailPoint ISC tenant. 
            </p>

            <div className="glass-card border border-white/10 rounded-2xl p-6 mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-0.5">source-configuration.json</h4>
                    <p className="text-slate-400 text-xs font-light">Web Services Source Import JSON File (8.5 KB)</p>
                  </div>
                </div>
                <a 
                  href="/downloads/recursive-governance/source-configuration.json" 
                  download="source-configuration.json"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </a>
              </div>
              
              <details className="group border-t border-white/5 pt-4">
                <summary className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-colors cursor-pointer list-none flex items-center gap-2 select-none">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Show Code Preview
                </summary>
                <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-4 border border-white/10 max-h-[350px] overflow-y-auto">
<pre className="text-sm text-slate-300 m-0"><code>{`{
    "description": "Personal Access Token Management",
    "owner": {
        "type": "IDENTITY",
        "id": "",
        "name": ""
    },
    "cluster": {
        "type": "CLUSTER",
        "id": "",
        "name": ""
    },
    "accountCorrelationConfig": {
        "type": "ACCOUNT_CORRELATION_CONFIG",
        "id": "",
        "name": ""
    },
    "accountCorrelationRule": null,
    "managerCorrelationMapping": null,
    "managerCorrelationRule": null,
    "beforeProvisioningRule": null,
    "schemas": [
        {
            "configuration": {},
            "type": "CONNECTOR_SCHEMA",
            "id": "",
            "name": "account"
        },
        {
            "configuration": {},
            "type": "CONNECTOR_SCHEMA",
            "id": "",
            "name": "group"
        }
    ],
    "passwordPolicies": null,
    "features": [
        "PROVISIONING"
    ],
    "type": "Web Services",
    "connector": "web-services-angularsc",
    "connectorClass": "sailpoint.connector.webservices.WebServicesConnector",
    "connectorAttributes": {
        "healthCheckTimeout": 30,
        "clientCertificate": null,
        "deltaAggregationEnabled": false,
        "accesstoken": null,
        "throwProvBeforeRuleException": true,
        "connectionType": "direct",
        "client_id": "",
        "numPartitionThreads": null,
        "enableProvisioningFeature": true,
        "password": null,
        "client_secret": "",
        "clientKeySpec": null,
        "saml_headers_to_exclude": null,
        "sourceConnected": true,
        "saml_headers": null,
        "private_key": null,
        "version": "v2",
        "labels": [
            "standard"
        ],
        "slpt-source-diagnostics": "{\\"connector\\":\\"web-services-angularsc\\",\\"status\\":\\"SOURCE_STATE_HEALTHY\\",\\"healthy\\":true,\\"healthcheckDisabled\\":false,\\"healthcheckCount\\":37,\\"lastHealthcheck\\":1778971885692,\\"statusChanged\\":1778885233950}",
        "formPath": null,
        "refresh_token": null,
        "cloudCacheUpdate": 1778971885059,
        "saml_request_body": null,
        "authenticationMethod": "OAuth2Login",
        "httpCookieSpecsStandard": "true",
        "connectorName": "Web Services",
        "enableStatus": null,
        "since": "2026-05-15T22:47:13.950Z",
        "status": "SOURCE_STATE_HEALTHY",
        "supportsDeltaAgg": "true",
        "lastAggregationDate_group": "2026-05-16T22:45:53Z",
        "resourceOwnerUsername": null,
        "oAuthJwtHeader": null,
        "enableHasMore": false,
        "isGetObjectRequiredForPTA": true,
        "timeoutInSeconds": "60",
        "genericWebServiceBaseUrl": "",
        "resourceOwnerPassword": null,
        "connectionParameters": [
            {
                "httpMethodType": "GET",
                "pagingInitialOffset": 0,
                "sequenceNumberForEndpoint": "1",
                "uniqueNameForEndPoint": "Test Connection",
                "rootPath": null,
                "body": {
                    "jsonBody": null,
                    "bodyFormat": "raw"
                },
                "paginationSteps": null,
                "responseCode": null,
                "resMappingObj": null,
                "contextUrl": "/v2025/personal-access-tokens",
                "pagingSize": 50,
                "curlEnabled": false,
                "header": {
                    "Authorization": "Bearer $application.accesstoken$"
                },
                "operationType": "Test Connection",
                "xpathNamespaces": null,
                "parentEndpointName": null
            },
            {
                "httpMethodType": "GET",
                "pagingInitialOffset": 0,
                "sequenceNumberForEndpoint": "2",
                "uniqueNameForEndPoint": "Account Aggregation",
                "afterRule": "Personal Access Token Management - After Aggregation Rule",
                "rootPath": "[*]",
                "body": {
                    "jsonBody": null,
                    "bodyFormat": "raw"
                },
                "paginationSteps": null,
                "responseCode": [
                    "2**"
                ],
                "resMappingObj": {
                    "identityname": "owner.name",
                    "identityid": "owner.id",
                    "PATid": "id"
                },
                "contextUrl": "/v2025/personal-access-tokens",
                "pagingSize": 50,
                "curlEnabled": false,
                "header": {
                    "Authorization": "$application.accesstoken$"
                },
                "operationType": "Account Aggregation",
                "xpathNamespaces": null,
                "parentEndpointName": null
            },
            {
                "httpMethodType": "GET",
                "pagingInitialOffset": 0,
                "sequenceNumberForEndpoint": "3",
                "uniqueNameForEndPoint": "Get Object",
                "afterRule": "Personal Access Token Management - After Aggregation Rule",
                "rootPath": "[*]",
                "body": {
                    "jsonBody": null,
                    "bodyFormat": "raw"
                },
                "paginationSteps": null,
                "responseCode": [
                    "2**"
                ],
                "resMappingObj": {
                    "identityname": "owner.name",
                    "identityid": "owner.id",
                    "PATid": "id"
                },
                "contextUrl": "/v2025/personal-access-tokens?owner-id=$getobject.nativeIdentity$",
                "pagingSize": 50,
                "curlEnabled": false,
                "header": {
                    "Authorization": "$application.accesstoken$"
                },
                "operationType": "Get Object",
                "xpathNamespaces": null,
                "parentEndpointName": null
            },
            {
                "httpMethodType": "GET",
                "pagingInitialOffset": 0,
                "sequenceNumberForEndpoint": "4",
                "uniqueNameForEndPoint": "Group Aggregation",
                "afterRule": "Personal Access Token Management - After Group Aggregation Rule",
                "rootPath": "[*]",
                "body": {
                    "jsonBody": null,
                    "bodyFormat": "raw"
                },
                "paginationSteps": null,
                "responseCode": [
                    "2**"
                ],
                "resMappingObj": {
                    "lastUsed": "lastUsed",
                    "created": "created",
                    "managed": "managed",
                    "ownername": "owner.name",
                    "ownertype": "owner.type",
                    "accessTokenValiditySeconds": "accessTokenValiditySeconds",
                    "scope": "scope",
                    "name": "name",
                    "id": "id",
                    "ownerid": "owner.id",
                    "userAwareTokenNeverExpires": "userAwareTokenNeverExpires",
                    "expirationDate": "expirationDate"
                },
                "contextUrl": "/v2025/personal-access-tokens",
                "pagingSize": 50,
                "curlEnabled": false,
                "header": {
                    "Authorization": "Bearer $application.accesstoken$"
                },
                "operationType": "Group Aggregation",
                "xpathNamespaces": null,
                "parentEndpointName": null
            },
            {
                "httpMethodType": "DELETE",
                "pagingInitialOffset": 0,
                "sequenceNumberForEndpoint": "5",
                "uniqueNameForEndPoint": "Remove Entitlement",
                "rootPath": null,
                "body": {
                    "jsonBody": null,
                    "bodyFormat": "raw"
                },
                "paginationSteps": null,
                "responseCode": [
                    "2**"
                ],
                "resMappingObj": null,
                "contextUrl": "/v2025/personal-access-tokens/$plan.PATid$",
                "pagingSize": 50,
                "curlEnabled": false,
                "header": {
                    "Authorization": "$application.accesstoken$"
                },
                "operationType": "Remove Entitlement",
                "xpathNamespaces": null,
                "parentEndpointName": null
            }
        ],
        "lockStatus": null,
        "oauth_request_parameters": null,
        "grant_type": "CLIENT_CREDENTIALS",
        "partitionAggregationEnabled": false,
        "deleteStatus": null,
        "hasFullAggregationCompleted": true,
        "deltaAggregation": null,
        "token_url": " ",
        "possibleHttpErrors": {
            "errorMessages": null,
            "errorCodes": null
        },
        "oauth_body_attrs_to_exclude": null,
        "throwProvAfterRuleException": true,
        "lastAggregationDate_account": "2026-05-16T22:51:24Z",
        "deleteThresholdPercentage": 10,
        "fixedPlanMultivaluedAttribute": "true",
        "oauth_headers": null,
        "templateApplication": "Web Services Template",
        "oauth_token_info": "",
        "encrypted": "accesstoken,refresh_token,oauth_token_info,client_secret,private_key,private_key_password,clientCertificate,clientKeySpec,resourceOwnerPassword,custom_auth_token_info",
        "healthy": true,
        "private_key_password": null,
        "cloudDisplayName": "Personal Access Token Management",
        "oAuthJwtPayload": null,
        "oauth_headers_to_exclude": null,
        "saml_assertion_url": null,
        "beforeProvisioningRule": null,
        "username": null
    },
    "deleteThreshold": 10,
    "authoritative": false,
    "healthy": true,
    "status": "SOURCE_STATE_HEALTHY",
    "since": "2026-05-15T22:47:13.950Z",
    "connectorId": "web-services-angularsc",
    "connectorName": "Web Services",
    "connectionType": "direct",
    "connectorImplementationId": "web-services-angularsc",
    "managementWorkgroup": null,
    "credentialProviderEnabled": false,
    "category": null,
    "accountsFile": null,
    "entitlementFiles": null,
    "meta": null,
    "id": "",
    "name": "Personal Access Token Management",
    "created": "2026-05-15T17:44:57.412Z",
    "modified": "2026-05-16T22:51:25.702Z"
}`}</code></pre>
                </div>
              </details>
            </div>

            <h3 id="how-it-works-benefits" className="text-2xl text-white mt-12 mb-4">How It Works & Key Benefits</h3>
            <p className="text-slate-300 mb-6">
              Now that the source configuration and rules are in place, let's look at how the entire solution functions end-to-end:
            </p>

            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-8">
              <h4 className="text-xl text-blue-400 mb-4 font-bold">End-to-End Flow:</h4>
              <ol className="list-decimal pl-5 text-slate-300 space-y-4 mb-6">
                <li>
                  <strong className="text-white">Aggregation:</strong> The Web Services source runs a group aggregation and calls the <code>/v2025/personal-access-tokens</code> endpoint. The After Group Aggregation rule processes each token as an entitlement (Group) and sets its detailed metadata (owner, scopes, expiration, created, last used) as the entitlement description. Next, during account aggregation, the same endpoint is called. The After Account Aggregation rule consolidates multiple tokens per user into a single account record with a multi-valued <code>PATid</code> attribute listing all of the user's active token IDs.
                </li>
                <li>
                  <strong className="text-white">Access Certification:</strong> Administrators schedule a certification campaign targeting this Web Services source. Because the tokens are modeled as entitlements, they appear on each user's cube. Managers can view each token under the developer's name, seeing its full metadata (scopes, last used date, etc.) directly in the certification UI.
                </li>
                <li>
                  <strong className="text-white">Revocation Remediation:</strong> If a manager decides a token is no longer needed (e.g., it is inactive or has excessive scopes), they mark it for revocation. When the certification is submitted, the provisioning engine executes a <code>Remove Entitlement</code> action, sending a DELETE request to <code>/v2025/personal-access-tokens/{'}'}id{'{'}</code> for the selected PAT ID. This instantly revokes the token in SailPoint ISC.
                </li>
              </ol>

              <h4 className="text-xl text-blue-400 mb-4 font-bold">Key Benefits:</h4>
              <ul className="list-disc pl-5 text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Unified Visibility:</strong> Brings previously "invisible" API credentials under the standard governance umbrella, making them visible to security teams and managers in the standard Identity Cube.
                </li>
                <li>
                  <strong className="text-white">Automated Lifecycle Control:</strong> Enables instant, automated remediation. When a manager revokes a PAT entitlement, the token is physically deleted via API without any manual admin tickets or delay.
                </li>
                <li>
                  <strong className="text-white">Context-Rich Certification:</strong> Reviewers aren't just looking at random token IDs. Thanks to the format of the description generated by the custom group rule, they see scope permissions and usage dates directly in the UI.
                </li>
                <li>
                  <strong className="text-white">Zero Extra Infrastructure:</strong> The solution uses standard Web Services connector attributes and SailPoint Rules, requiring no external databases, servers, or custom integrations.
                </li>
              </ul>
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 id="conclusion" className="text-2xl text-white mb-4">Conclusion</h3>
              <ul className="space-y-4 text-slate-300 mb-8 list-none pl-0 leading-relaxed font-light">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold shrink-0">Summary:</span>
                  <span>Recursive governance provides an elegant, out-of-the-box workaround to a common security gap in SailPoint ISC. By treating Personal Access Tokens as certifiable entitlements on a loopback source, organizations can secure their API footprint and enforce manager-led lifecycle controls.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold shrink-0">Call to Action:</span>
                  <span>If you have any questions, suggestions, or extensions to this Web Services approach, feel free to comment below. Let's collaborate on making SailPoint governance even more robust!</span>
                </li>
              </ul>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-950/40 to-purple-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Need help configuring PAT governance?</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    Setting up custom Web Services connectors, consolidation rules, and certification campaigns in SailPoint requires careful execution. Connect with me directly to get this configured for your tenant.
                  </p>
                </div>
                <a 
                  href="/contact" 
                  className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                >
                  Talk to an Expert
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
