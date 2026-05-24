import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

export default function RecursiveGovernancePost() {
  const tocItems = [
    { id: 'problem-invisible-access', label: "1. The Problem: 'Invisible' Access" },
    { id: 'architecture-recursive-governance', label: '2. The Architecture: Recursive Governance' },
    { id: 'implementation-deep-dive', label: '3. Implementation Deep Dive' },
    { id: 'closing-loop-certifications', label: '4. Closing the Loop: The Certification Campaign' },
    { id: 'code-design-choices', label: '5. Code & Design Choices' },
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
            
            <h3 id="problem-invisible-access" className="text-2xl text-white mt-8 mb-4">1. The Problem: "Invisible" Access</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">The Rise of PATs:</strong> Personal Access Tokens (PATs) are very common in SailPoint ISC implementations due to almost all ISC API endpoints requiring a PAT to execute the call.</li>
              <li><strong className="text-white">The Governance Gap:</strong> Most organizations certify User-to-Group memberships but lose visibility once a user generates a long-lived PAT.</li>
              <li><strong className="text-white">The Risk:</strong> A PAT often carries the full permissions of the user who created it, effectively acting as a "ghost" credential that bypasses standard SSO/MFA after creation.</li>
            </ul>

            <h3 id="architecture-recursive-governance" className="text-2xl text-white mt-12 mb-4">2. The Architecture: Recursive Governance</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">The "Why":</strong> Why build a custom connector? Because treating PATs as "Entitlements" in a separate Source allows them to be pulled into the standard Identity Cube and gain crucial visibility.</li>
              <li><strong className="text-white">Connector Choice:</strong> By using a Web Services connector, we can automate the aggregation, removal, and reviews of such PATs without any manual effort.</li>
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

            <h3 id="implementation-deep-dive" className="text-2xl text-white mt-12 mb-4">3. Implementation Deep Dive</h3>
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
              <strong className="text-white">The "Virtual" Entitlement:</strong> Although PATs don't grant "access", we can represent them as entitlements so we can perform governance on the tokens themselves. This is done by using the same endpoint (<code>/v2025/personal-access-tokens</code>) for both account and group aggregation.
            </p>

            <div className="my-10 flex justify-center bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden p-4">
              <img 
                src="/images/blog/recursive-governance/virtual_entitlement.png" 
                alt="Virtual Entitlement representation in SailPoint ISC"
                className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <p className="text-slate-300">
              <strong className="text-white">Source JSON Changes:</strong> Since this connector is custom and serves a very specific purpose, I've removed many of the standard features that web services connectors typically have so we don't accidentally call them and throw errors in the tenant. You'll see in the source JSON below the <code>features</code> flag only contains <code>PROVISIONING</code>, which is all this connector needs to be able to pull in and revoke PATs.
            </p>

            <h3 id="closing-loop-certifications" className="text-2xl text-white mt-12 mb-4">4. Closing the Loop: The Certification Campaign</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Visibility:</strong> Since we can now store these PATs as entitlements on a user's identity cube, that opens up the gates for us to do certifications on the PATs.</li>
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
              <li><strong className="text-white">Remediation:</strong> Using the "Revoke" action in the certification to trigger the API call that revokes the token in ISC.</li>
            </ul>

            <div className="my-10 flex justify-center bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden p-4">
              <img 
                src="/images/blog/recursive-governance/remediation_action.png" 
                alt="Remediation Revoke Action"
                className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <h3 id="code-design-choices" className="text-2xl text-white mt-12 mb-4">5. Code & Design Choices</h3>

            <h4 className="text-xl text-blue-400 mt-8 mb-3">After Account Aggregation Rule</h4>
            <p className="text-slate-300 mb-4">
              The After Account Aggregation rule is what allows us to save back an account object for a user even though we receive multiple entries of PATs in the GET <code>/v2025/personal-access-tokens</code> call. The gist of the rule is that it scans for the first occurrence of a user then will look at all entries to grab the PAT IDs assigned to them then saves that single row to our <code>processedResponseObject</code>.
            </p>

            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
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

            <h4 className="text-xl text-blue-400 mt-8 mb-3">After Group Aggregation Rule</h4>
            <p className="text-slate-300 mb-4">
              The after group aggregation rule is purely for populating the description attribute of each entitlement. Since we want the reviewer to be able to view all the details up front in the certification, I used this rule to specifically group all the relevant attributes about each PAT and separate them by <code>|</code>'s so the reviewer has full context as to what they are reviewing. Here is an example description field for a PAT:
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-4 border border-white/10">
              <pre className="text-sm text-slate-300 m-0"><code>Name: AI Agent | Owner: IdentityEXE | Scopes: iai:access-request-recommender:read, iai:decisions:manage | Created: 2026-05-17T18:45:50.565Z | Last Used: N/A | Expiration Date: N/A | Managed: false | Access Token Validity: 43200 | User Aware Token Never Expires: N/A</code></pre>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
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

            <h4 className="text-xl text-blue-400 mt-8 mb-3">Account Schema</h4>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
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

            <h4 className="text-xl text-blue-400 mt-8 mb-3">Group Schema</h4>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
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
            "type": "STRING",
            "isMulti": true,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "scope",
            "type": "STRING",
            "isMulti": true,
            "isEntitlement": false,
            "isGroup": false
        },
        {
            "name": "created",
            "type": "STRING"
        },
        {
            "name": "lastUsed",
            "type": "STRING"
        },
        {
            "name": "managed",
            "type": "STRING"
        },
        {
            "name": "accessTokenValiditySeconds",
            "type": "STRING"
        },
        {
            "name": "expirationDate",
            "type": "STRING"
        },
        {
            "name": "userAwareTokenNeverExpires",
            "type": "STRING"
        },
        {
            "name": "name",
            "type": "STRING"
        },
        {
            "name": "ownertype",
            "type": "STRING"
        },
        {
            "name": "ownerid",
            "type": "STRING"
        },
        {
            "name": "ownername",
            "type": "STRING"
        },
        {
            "name": "description",
            "type": "STRING"
        }
    ],
    "name": "group"
}`}</code></pre>
            </div>

            <h4 className="text-xl text-blue-400 mt-8 mb-3">Source Configuration</h4>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`{
    "description": "Personal Access Token Management",
    "owner": {
        "type": "IDENTITY",
        "id": "",
        "name": ""
    },
    "features": [
        "PROVISIONING"
    ],
    "type": "Web Services",
    "connector": "web-services-angularsc",
    "connectorAttributes": {
        "connectionType": "direct",
        "authenticationMethod": "OAuth2Login",
        "genericWebServiceBaseUrl": "",
        "connectionParameters": [
            {
                "httpMethodType": "GET",
                "uniqueNameForEndPoint": "Account Aggregation",
                "afterRule": "Personal Access Token Management - After Aggregation Rule",
                "rootPath": "[*]",
                "resMappingObj": {
                    "identityname": "owner.name",
                    "identityid": "owner.id",
                    "PATid": "id"
                },
                "contextUrl": "/v2025/personal-access-tokens",
                "operationType": "Account Aggregation"
            },
            {
                "httpMethodType": "GET",
                "uniqueNameForEndPoint": "Get Object",
                "afterRule": "Personal Access Token Management - After Aggregation Rule",
                "rootPath": "[*]",
                "resMappingObj": {
                    "identityname": "owner.name",
                    "identityid": "owner.id",
                    "PATid": "id"
                },
                "contextUrl": "/v2025/personal-access-tokens?owner-id=$getobject.nativeIdentity$",
                "operationType": "Get Object"
            },
            {
                "httpMethodType": "GET",
                "uniqueNameForEndPoint": "Group Aggregation",
                "afterRule": "Personal Access Token Management - After Group Aggregation Rule",
                "rootPath": "[*]",
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
                "operationType": "Group Aggregation"
            },
            {
                "httpMethodType": "DELETE",
                "uniqueNameForEndPoint": "Remove Entitlement",
                "contextUrl": "/v2025/personal-access-tokens/$plan.PATid$",
                "operationType": "Remove Entitlement"
            }
        ]
    },
    "name": "Personal Access Token Management"
}`}</code></pre>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mt-12">
              <h3 id="conclusion" className="text-2xl text-white mb-3 mt-0">Conclusion</h3>
              <p className="text-slate-300 mb-4">
                <strong>Summary:</strong> By implementing recursive governance, you regain control and visibility over Personal Access Tokens, treating them with the same security rigor as regular entitlements. This ensures that unused or risky PATs can be effectively audited and revoked automatically.
              </p>
              <p className="text-slate-300 m-0">
                <strong>Call to Action:</strong> Connect with us to learn more about advanced governance solutions or if you need assistance configuring this for your SailPoint ISC tenant!
              </p>
            </div>

          </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
