import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

// =============================================================================
// SailPoint Web Services Connector: After-Operation Rule (Account Aggregation)
// Pattern: Transient Values Inversion Pattern
// Author: Tyler Rettkowski
// Purpose: Lazy-loads and inverts entitlement memberships on Page 1 into 
//          transientValues, enriching accounts in-memory across all pages.
// =============================================================================

if (processedResponseObject != null && processedResponseObject instanceof List) {
    List usersList = (List) processedResponseObject;

    // 1. Retrieve transientValues from the connector execution context
    Map transientValues = (Map) application.getAttributeValue("transientValues");
    Map userPermMap = null;

    if (transientValues != null && transientValues.containsKey("userPermMap")) {
        userPermMap = (Map) transientValues.get("userPermMap");
    }

    // 2. If not yet cached in memory (Page 1), query /permissions ONCE and invert the map
    if (userPermMap == null) {
        userPermMap = new HashMap();

        // Build target /permissions endpoint URL using connector base URL
        String targetUrl = requestEndPoint.getBaseUrl() + "/permissions";

        // Reuse headers from the active request context (inherits OAuth bearer token)
        Map headers = new HashMap();
        if (requestEndPoint.getHeader() != null) {
            headers.putAll(requestEndPoint.getHeader());
        }
        headers.put("Content-Type", "application/json");

        // Specify allowed HTTP response codes
        List allowedStatuses = new ArrayList();
        allowedStatuses.add("200");

        // Execute GET directly via internal restClient
        String permsJson = restClient.executeGet(targetUrl, headers, allowedStatuses);

        // Parse JSON response array using BeanShell-safe syntax (no generic diamond syntax)
        List permsList = null;
        try {
            permsList = (List) new com.google.gson.Gson().fromJson(permsJson, ArrayList.class);
        } catch (Throwable t) {
            // Fallback for environments where com.google.gson is unavailable
            permsList = (List) sailpoint.integration.JsonUtil.parse(permsJson);
        }

        // Invert permissions: Map each member user ID to their assigned permission IDs
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

        // 3. Cache the precomputed map into transientValues on the application object
        if (transientValues == null) {
            transientValues = new HashMap();
        }
        transientValues.put("userPermMap", userPermMap);
        application.setAttribute("transientValues", transientValues);
    }

    // 4. Enrich the current page of users in memory (O(1) lookup per identity)
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

return processedResponseObject;
