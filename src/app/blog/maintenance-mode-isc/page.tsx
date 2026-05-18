import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import formData from './Form-MaintenanceMode_final.json';
import workflowData from './Workflow-MaintenanceMode_final.json';

export default function MaintenanceModePost() {
  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 min-h-screen">
        <article className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">
          
          <header className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-blue-400">
              <span>Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>May 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Bringing IIQ Maintenance Mode to ISC <br />
              <span className="text-blue-500 text-2xl md:text-3xl">(Custom Workflow Forms Solution)</span>
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
            
            <h3 className="text-2xl text-white mt-8 mb-4">Introduction</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Why:</strong> During a recent IIQ to ISC migration, a key requirement was to replicate IIQ's Maintenance Mode functionality. Currently, ISC does not offer an OOTB equivalent, and there is no immediate roadmap for its implementation. If you need to ensure sources stop "pinging" or interacting with destination applications during a window, this solution is for you.</li>
              <li><strong className="text-white">Problem:</strong> Currently there is no way to ensure that an ISC source doesn't attempt to ping the end system in the UI because of the health check functionality. The only way possible is using a combination of API calls to change the configuration of the source.</li>
              <li><strong className="text-white">Goal:</strong> A solution that matches IIQ's maintenance mode checkbox as close as possible in ISC.</li>
            </ul>

            <h3 className="text-2xl text-white mt-12 mb-4">Solution Overview</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Tech Stack:</strong> 1 Form + 1 Workflow + 1 PowerShell Reporting Script.</li>
              <li><strong className="text-white">High Level Flow:</strong> Through an interactive form and custom workflow approach, I've created a launcher where any source can be toggled from Maintenance Mode On/Off. This solution also includes a PowerShell script that reports on the status of all sources with Maintenance Mode currently enabled.</li>
            </ul>

            <h3 className="text-2xl text-white mt-12 mb-4">User Interface</h3>
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-8">
              <h4 className="text-xl text-white mb-3">Input Fields</h4>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-6">
                <li>Enable / Disable - Drop Down Field</li>
                <li>Source Selector - Predefined Sources Drop Down Field</li>
                <li>Reason - Text Field</li>
              </ul>
              <h4 className="text-xl text-white mb-3">User Experience</h4>
              <p className="text-slate-300">
                Since there's currently no option to add customized fields into the source UI, I thought the next best was an interactive form. Also, there's lots of options for customizing this form to your exact orgs needs if you need additional fields.
              </p>
            </div>

            <div className="my-10">
              <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden">
                <img 
                  src="/maintenance-mode-form.png" 
                  alt="Interactive source selector with Enable/Disable dropdown"
                  className="max-w-full h-auto object-contain shadow-2xl"
                />
              </div>
              <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4 flex items-center justify-between">
                <span className="text-slate-300 font-bold text-sm">Form Definition Code:</span>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formData, null, 2))}`}
                  download="Form-MaintenanceMode_final.json"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Form-MaintenanceMode_final.json
                </a>
              </div>
            </div>

            <h3 className="text-2xl text-white mt-12 mb-4">Back End</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Trigger:</strong> This solution utilizes an <code>interactive Trigger</code> so we can use the interactive forms options in the next step of the workflow.</li>
              <li><strong className="text-white">Interactive Form:</strong> You'll select the form in the section above in this Action step so the user can see and fill out the form in the launcher.</li>
              <li><strong className="text-white">Enable or Disable:</strong> In the 5th step of the workflow, it branches into two different options (Enable or Disable) and this is controlled by using a compare strings operator which checks the option they selected in the form. Based on that selection, the workflow will do different API calls.</li>
              <li><strong className="text-white">After API Calls:</strong> Once all the API calls are completed to update the selected source, an interactive message & email are sent to the user using the launcher as well as an email configured in the <code>Send Email</code> step. This will notify the user that it was completed successfully as well as provide an audit email that shows what was selected in the form.</li>
            </ul>

            <div className="my-8 bg-[#0d1117] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <span className="text-slate-300 font-bold text-sm">Workflow Code:</span>
              <a 
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowData, null, 2))}`}
                download="Workflow-MaintenanceMode_final.json"
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Workflow-MaintenanceMode_final.json
              </a>
            </div>

            <h3 className="text-2xl text-white mt-12 mb-4">API Calls</h3>
            
            <h4 className="text-xl text-blue-400 mt-6 mb-3">Enable Maintenance Mode</h4>
            <ul className="space-y-2 text-slate-300 mb-4 list-none pl-0">
              <li className="font-mono text-sm break-all"><span className="text-green-400 mr-2">GET</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}</li>
              <li className="font-mono text-sm break-all"><span className="text-green-400 mr-2">GET</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}/schedules/GROUP_AGGREGATION</li>
              <li className="font-mono text-sm break-all"><span className="text-green-400 mr-2">GET</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}/schedules/ACCOUNT_AGGREGATION</li>
              <li className="font-mono text-sm break-all"><span className="text-red-400 mr-2">DELETE</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}/schedules/GROUP_AGGREGATION</li>
              <li className="font-mono text-sm break-all"><span className="text-red-400 mr-2">DELETE</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}/schedules/ACCOUNT_AGGREGATION</li>
              <li className="font-mono text-sm break-all"><span className="text-yellow-400 mr-2">PATCH</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}</li>
            </ul>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`[
  { "op": "add", "path": "/connectorAttributes/enableProvisioningFeature", "value": false },
  { "op": "add", "path": "/connectorAttributes/disable_health_check", "value": true },
  { "op": "replace", "path": "/features", "value": [] },
  { "op": "add", "path": "/connectorAttributes/groupaggregationschedule", "value": "{{$.hTTPRequest1.body.cronExpression}}" },
  { "op": "add", "path": "/connectorAttributes/accountaggregationschedule", "value": "{{$.hTTPRequest2.body.cronExpression}}" },
  { "op": "add", "path": "/connectorAttributes/maintenancemode", "value": true }
]`}</code></pre>
            </div>

            <h4 className="text-xl text-blue-400 mt-6 mb-3">Disable Maintenance Mode</h4>
            <ul className="space-y-2 text-slate-300 mb-4 list-none pl-0">
              <li className="font-mono text-sm break-all"><span className="text-green-400 mr-2">GET</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}</li>
              <li className="font-mono text-sm break-all"><span className="text-yellow-400 mr-2">PATCH</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}</li>
              <li className="font-mono text-sm break-all"><span className="text-purple-400 mr-2">POST</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}/schedules</li>
              <li className="font-mono text-sm break-all"><span className="text-purple-400 mr-2">POST</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}/schedules</li>
              <li className="font-mono text-sm break-all"><span className="text-yellow-400 mr-2">PATCH</span> /v2024/sources/{'{'}{'{'}$.interactiveForm.formData.sources{'}'}{'}'}</li>
            </ul>
            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
<pre className="text-sm text-slate-300 m-0"><code>{`[
  { "op": "add", "path": "/connectorAttributes/enableProvisioningFeature", "value": true },
  { "op": "add", "path": "/connectorAttributes/disable_health_check", "value": false },
  { "op": "add", "path": "/connectorAttributes/maintenancemode", "value": false }
]`}</code></pre>
            </div>

            <h3 className="text-2xl text-white mt-12 mb-4">Monitoring & Audit</h3>
            <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
              <li><strong className="text-white">Purpose:</strong> A script to quickly audit which sources are currently in Maintenance Mode.</li>
              <li><strong className="text-white">Functionality:</strong> The script queries the <code>/sources</code> endpoint to grab all the sources in the tenant with the connectorAttribute <code>maintenancemode == true</code>. It exports a list of all the sources that contain that flag and puts them into a CSV file with the current date & time.</li>
              <li><strong className="text-white">Why it’s necessary:</strong> Preventing "zombie" sources that were put in maintenance and forgotten. Also, if Audit ever questions why a source didn't do something automatically during a period of time, you can look at the maintenance mode reports to determine if the source was in maintenance mode during that time.</li>
            </ul>

            <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-10 border border-white/10">
<pre className="text-sm text-blue-300 m-0"><code>{`$clientId     = "ENTERYOURCLIENTIDHERE"
$clientSecret = "ENTERYOURCLIENTSECRETHERE"
$tenantName   = "ENTERYOURTENANTNAMEHERE"
$baseUrl      = "https://$tenantName.api.identitynow.com"
$exportPath   = "ISC_MaintenanceMode_Sources_$(Get-Date -Format 'MM-dd-yyyy').csv"

$tokenBody = @{
    grant_type    = "client_credentials"
    client_id     = $clientId
    client_secret = $clientSecret
}

try {
    $tokenResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/oauth/token" -Body $tokenBody
    $accessToken = $tokenResponse.access_token
} catch {
    Write-Error "Failed to authenticate with SailPoint ISC: $($_.Exception.Message)"
    exit
}

$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type"  = "application/json"
}

$allSources = @()
$limit = 250
$offset = 0
$totalCount = 0

do {
    $uri = "$baseUrl/v3/sources?limit=$limit&offset=$offset&count=true"
    $response = Invoke-WebRequest -Method Get -Uri $uri -Headers $headers
    
    if ($offset -eq 0) {
        $totalCount = [int]$response.Headers["X-Total-Count"]
    }
    
    $sources = $response.Content | ConvertFrom-Json
    $allSources += $sources
    $offset += $limit
    
} while ($offset -lt $totalCount)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$results = $allSources | ForEach-Object {
    $mMode = $_.connectorAttributes.maintenancemode
  
    if ($mMode -eq "true" -or $mMode -eq $true) {
        [PSCustomObject]@{
            SourceName      = $_.name
            SourceId        = $_.id
            ConnectorType   = $_.type
            MaintenanceMode = $true
            ExportedAt      = $timestamp
        }
    }
}

if ($results) {
    $results | Export-Csv -Path $exportPath -NoTypeInformation
    Write-Host "Success! Found $($results.Count) sources in maintenance mode. Exported to: $exportPath"
} else {
    Write-Host "No sources found with maintenancemode set to true."
}`}</code></pre>
            </div>

            <h3 className="text-2xl text-white mt-12 mb-4">Considerations & Best Practices</h3>
            <ul className="space-y-3 text-slate-300 mb-8 list-disc pl-5">
              <li><strong className="text-white">Permissioning:</strong> The launcher should only be granted to admins in ISC as this will basically give you access to disable provisioning/aggregations/health checks completely for a source.</li>
              <li><strong className="text-white">Error Handling:</strong> Many of the HTTP Request steps in the workflow will log as failures and thus show in your execution logs as a failure for you to investigate. If you're seeing any weird behavior, the easiest way to check if it performed the execution successfully is by viewing the source configuration in VSCode and looking if the proper connectorAttributes were set.</li>
              <li><strong className="text-white">PAT Needed to Run:</strong> When setting the PAT client ID and secret for all of the HTTP Requests, ensure your service account that holds this PAT has ORG_ADMIN. You should only need the scopes necessary to update source configurations on your PAT: <code>idn:sources:manage</code> & <code>idn:sources:read</code></li>
            </ul>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mt-12">
              <h3 className="text-2xl text-white mb-3 mt-0">Conclusion</h3>
              <p className="text-slate-300 mb-4">
                <strong>Summary:</strong> This is a good workaround if your org requires maintenance mode functionality in ISC and previously relied on it in IIQ or another system.
              </p>
              <p className="text-slate-300 m-0">
                <strong>Call to Action:</strong> If you have any questions or concerns on the approach, feel free to reach out. I'm happy to help extend the functionality of this workaround!
              </p>
            </div>

          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
