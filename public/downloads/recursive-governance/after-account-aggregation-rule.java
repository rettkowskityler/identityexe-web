import connector.common.Util;
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

return processedResponseObject;
