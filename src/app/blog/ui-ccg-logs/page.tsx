import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';

export default function UICCGLogsPost() {
  const tocItems = [
    { id: 'business-context', label: 'Business Context' },
    { id: 'solution-overview', label: 'Solution Overview' },
    { id: 'dynamic-cloud-filtering', label: 'Dynamic Cloud Filtering' },
    { id: 'implementation-deep-dive', label: 'Implementation Deep Dive' },
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
          
          <article className="lg:col-span-3 min-w-0 w-full overflow-hidden glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-cyan-400 transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-cyan-400 transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">UI CCG Logs</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-purple-400">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>August 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Bringing Virtual Appliance CCG Logs Directly into <br />
                Identity Security Cloud
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden p-[2px]">
                  <img src="/images/profile.jpg" alt="Tyler" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="text-white">Tyler</p>
                  <p>IdentityEXE Founder</p>
                </div>
              </div>
            </header>

            <div className="prose prose-invert break-words w-full overflow-x-hidden prose-pre:max-w-[85vw] sm:prose-pre:max-w-full prose-pre:overflow-x-auto prose-img:max-w-full prose-img:h-auto prose-base md:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-code:text-purple-300 prose-code:bg-purple-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
              
              {/* Business Context */}
              <h3 id="business-context" className="text-2xl text-white mt-0 mb-4 font-black tracking-tight">Business Context</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                When troubleshooting Virtual Appliance (VA) issues, engineers and administrators constantly find themselves needing to manually SSH into the VAs, navigate the file system, and run various <code>grep</code> commands against the <code>ccg.log</code> file. One of the biggest architectural limitations is the need to individually SSH into multiple different VAs in a cluster just to piece together a single execution trail.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Leaving this operational drag unsolved creates massive deployment lag and introduces severe security vulnerabilities. Manual intervention requiring elevated server access and scattered file navigation drastically slows down engineering teams. It stalls organizational momentum, leading to prolonged downtimes and increasing the risk of failed compliance audits as engineers handle unmanaged command line tools in production environments.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-semibold text-white">
                To eliminate this overhead, we utilize a repeatable architectural methodology designed by IdentityEXE. By seamlessly uniting secure Windows tasks with Identity Security Cloud (ISC) Workflows, this implementation framework consolidates your cluster's CCG logs directly into the cloud interface—completely removing the need for direct SSH access.
              </p>

              <hr className="border-white/10 my-10" />

              {/* Solution Overview */}
              <h3 id="solution-overview" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Solution Overview</h3>
              <p className="text-slate-300 mb-6">
                When we architect this solution for our enterprise clients, we utilize a highly secure technical stack comprising <strong>3 PowerShell Scripts, 1 ISC Workflow, and a Windows Scheduled Task</strong>.
              </p>
              <p className="text-slate-300 mb-6">
                <strong>High-Level Flow:</strong> Our core engineering methodology structures the data layer to execute a lightweight PowerShell script on a secure Windows Server via Scheduled Task. This script connects to your Virtual Appliances using SSH, extracts relevant log lines based on dynamic filters configured directly in the ISC Workflow, and pushes those logs back to an ISC Workflow External Trigger. The result is a readable log output directly inside the Workflow Executions UI.
              </p>

              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/ui-ccg-logs/ExampleUILog_FullLogs.png" alt="Example UI Log" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>

              <hr className="border-white/10 my-10" />

              {/* Dynamic Cloud Filtering */}
              <h3 id="dynamic-cloud-filtering" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Dynamic Cloud Filtering</h3>
              <p className="text-slate-300 mb-6">
                This modular framework ensures that your ISC deployment avoids rigid configurations. The script dynamically reads its <code>grep</code> filters from the target SailPoint Workflow's <code>sp:define-variable</code> step, so you never have to touch the Windows Server when adjusting filters.
              </p>
              
              <ul className="space-y-6 text-slate-300 mb-8 list-none pl-0">
                <li>
                  <strong className="text-white"><code>include</code> (List of Strings):</strong> Only return log lines containing these exact strings. Multiple strings act as an AND condition.
                  <div className="my-6">
                    <img src="/images/blog/ui-ccg-logs/FilterScreenshot_Include.png" alt="Filter Include" className="w-full max-w-lg h-auto object-contain border border-white/10 rounded-lg shadow-xl" />
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>exclude</code> (List of Strings):</strong> Strictly ignore any lines containing these strings to filter out noise.
                  <div className="my-6">
                    <img src="/images/blog/ui-ccg-logs/FilterScreenshot_Exclude.png" alt="Filter Exclude" className="w-full max-w-lg h-auto object-contain border border-white/10 rounded-lg shadow-xl" />
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>messageOnly</code> (String):</strong> Setting this to "true" strips out the VA IP, Timestamp, and Level prefixes, returning purely the raw log message to save horizontal space.
                  <div className="my-6">
                    <img src="/images/blog/ui-ccg-logs/FilterScreenshot_messageOnly.png" alt="Filter Message Only" className="w-full max-w-lg h-auto object-contain border border-white/10 rounded-lg shadow-xl" />
                  </div>
                </li>
              </ul>

              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/ui-ccg-logs/ExampleUILog_MessageOnly.png" alt="Message Only View" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>

              <p className="text-slate-300 mb-6">
                Because these logs are posted as a payload directly to an External Trigger, we leverage the built-in <code>WorkflowExecutionStarted</code> JSON Viewer in the UI to display our formatted log lines directly in the event details. 
              </p>
              <p className="text-slate-300 mb-6">
                You can easily find your historical logs using ISC Search with this query: <br/>
                <code>"UI CCG Logger" AND "WorkflowExecutionStarted"</code>
              </p>

              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/ui-ccg-logs/SearchQuery_Results.png" alt="Search Query Results" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>
              <div className="my-10 flex flex-col items-center gap-6">
                <img src="/images/blog/ui-ccg-logs/UICCGLogger20260829.png" alt="Workflow Configuration" className="max-w-full h-auto object-contain shadow-2xl rounded-lg border border-white/10" />
              </div>

              <hr className="border-white/10 my-10" />

              {/* Implementation Deep Dive */}
              <h3 id="implementation-deep-dive" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Implementation Deep Dive</h3>
              <p className="text-slate-300 mb-8">
                The solution relies on a few key components running on a secure Windows Server in your network. This IdentityEXE Blueprint utilizes the following logic:
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. Secure Credential Storage</h4>
              <p className="text-slate-300 mb-4">
                Instead of storing passwords in plain-text, the setup scripts use Windows DPAPI (Data Protection API) to encrypt the credentials, tying the encryption to the executing Windows User profile. We store ISC credentials as a hash of SecureStrings and output them as an XML file:
              </p>
              <pre className="mb-6"><code className="language-powershell">{`$creds = @{
    WebhookClientId     = $webhookClientId
    WebhookClientSecret = $webhookClientSecretPlain
    ApiClientId         = $apiClientId
    ApiClientSecret     = $apiClientSecretPlain
}

$creds | Export-Clixml -Path $CredentialPath`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">2. Stable SSH Connectivity</h4>
              <p className="text-slate-300 mb-4">
                To bypass cryptographic bugs in Microsoft's native Windows OpenSSH implementation against strict ETaM encryption, the setup script automatically uses <code>plink.exe</code> (PuTTY) and caches the SSH Host Keys:
              </p>
              <pre className="mb-6"><code className="language-powershell">{`foreach ($hostIp in $VaHosts) {
    cmd.exe /c "echo y | \`"$plinkPath\`" -ssh sailpoint@$hostIp -pw \`"$plainPassword\`" \`"exit\`"" | Out-Null
}`}</code></pre>

              <h4 className="text-lg font-bold text-white mt-8 mb-3">3. The Core Script Engine</h4>
              <p className="text-slate-300 mb-4">
                The core engine fetches dynamic variables straight from the ISC Workflow by calling the <code>/workflows/v1/:id</code> API, dynamically builds a native Linux <code>grep</code> command, and formats the output directly to the Workflow Webhook URL:
              </p>
              <pre className="mb-6"><code className="language-powershell">{`$sshCommand = "cat /home/sailpoint/log/ccg.log"
    
if ($IncludeFilters.Count -gt 0) {
    foreach ($filter in $IncludeFilters) { $sshCommand += " | grep -i -F '$filter'" }
}
foreach ($filter in $ExcludeFilters) { $sshCommand += " | grep -v -i -F '$filter'" }

$sshCommand += " | tail -n $TailLines"

# Execute Native SSH and capture output
$sshResult = & $plinkPath -ssh $SshUser@$hostIp -pw $plainVaPassword -batch "$sshCommand" 2>&1`}</code></pre>

              <hr className="border-white/10 my-10" />

              {/* Downloads Grid */}
              <h3 className="text-2xl text-white mt-12 mb-6">Configuration Snippets & Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Workflow Configuration</h4>
                    <p className="text-xs text-slate-400 mb-6">The Webhook workflow configuration providing execution visibility.</p>
                  </div>
                  <a 
                    href="/images/blog/ui-ccg-logs/Workflow-UICCGLogger.json"
                    download="Workflow-UICCGLogger.json"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Workflow-UICCGLogger.json
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Save-IscCredentials</h4>
                    <p className="text-xs text-slate-400 mb-6">Credential setup script using Windows DPAPI for ISC Secrets.</p>
                  </div>
                  <a 
                    href="/images/blog/ui-ccg-logs/Save-IscCredentials.ps1"
                    download="Save-IscCredentials.ps1"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Save-IscCredentials.ps1
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Save-VaCredential</h4>
                    <p className="text-xs text-slate-400 mb-6">VA setup script storing VA credentials and caching host keys.</p>
                  </div>
                  <a 
                    href="/images/blog/ui-ccg-logs/Save-VaCredential.ps1"
                    download="Save-VaCredential.ps1"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Save-VaCredential.ps1
                  </a>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Send-CCGLogsToWorkflow</h4>
                    <p className="text-xs text-slate-400 mb-6">The main engine script that parses workflows and executes grep over SSH.</p>
                  </div>
                  <a 
                    href="/images/blog/ui-ccg-logs/Send-CCGLogsToWorkflow.ps1"
                    download="Send-CCGLogsToWorkflow.ps1"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Send-CCGLogsToWorkflow.ps1
                  </a>
                </div>

              </div>

              <hr className="border-white/10 my-10" />

              {/* Conclusion */}
              <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Conclusion</h3>
              <p className="text-slate-300 mb-10 leading-relaxed">
                By combining native Windows encryption, reliable SSH tools, and the extensibility of Identity Security Cloud Workflows, this solution bridges the gap between on-premise Virtual Appliances and the cloud UI.
              </p>

              <div className="mt-16 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-500"></div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">Stop Guessing. Build with Precision.</h3>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  A stalled identity governance rollout burns capital and stalls organizational momentum. If your team is hitting configuration walls or struggling with complex CCG log integrations, stop guessing. Book a targeted SailPoint Architecture Review directly with our engineering team to map out a clear path forward.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20"
                >
                  Book Your SailPoint Architecture Review
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
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
