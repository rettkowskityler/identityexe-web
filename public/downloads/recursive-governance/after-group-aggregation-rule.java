import connector.common.Util;
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
return processedResponseObject;
