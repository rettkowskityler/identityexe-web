'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../../components/Navbar';

type ScopeMap = Record<string, Record<string, Record<string, string[]>>>;

interface ResultItem {
  stepName: string;
  method: string;
  url: string;
  scopes: string[] | null;
  message: string | null;
  type: 'success' | 'warning' | 'error' | 'legacy';
}

export default function WorkflowScopeAnalyzer() {
  const [scopesMap, setScopesMap] = useState<ScopeMap | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [allRequiredScopes, setAllRequiredScopes] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/scopes_map.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load scopes map');
        return res.json();
      })
      .then((data) => {
        setScopesMap(data);
        setIsLoadingMap(false);
      })
      .catch((err) => {
        console.error(err);
        setMapError('Failed to load the scopes mapping file. Please refresh and try again.');
        setIsLoadingMap(false);
      });
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setAnalyzing(true);
    setResults(null);
    setAllRequiredScopes(new Set());
    setCopied(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const workflow = JSON.parse(content);
        analyzeWorkflow(workflow);
      } catch (err) {
        alert('Invalid JSON format. Please ensure your uploaded file is a valid JSON workflow.');
        setAnalyzing(false);
      }
    };
    reader.onerror = () => {
      alert('Error reading file');
      setAnalyzing(false);
    };
    reader.readAsText(file);
  };

  const findScopesForEndpoint = (version: string, method: string, actualPath: string, mapData: ScopeMap) => {
    let specVersion = version;
    if (!mapData[specVersion]) {
      if (version === 'v2024') specVersion = 'v2024';
      else return null;
    }

    const versionMap = mapData[specVersion];
    
    if (versionMap[actualPath] && versionMap[actualPath][method]) {
      return versionMap[actualPath][method];
    }

    for (const specPath of Object.keys(versionMap)) {
      const regexStr = '^' + specPath.replace(/\{[^}]+\}/g, '[^/]+') + '$';
      const regex = new RegExp(regexStr, 'i');
      
      if (regex.test(actualPath)) {
        if (versionMap[specPath][method]) {
          return versionMap[specPath][method];
        }
      }
    }
    
    return null;
  };

  const analyzeWorkflow = (workflow: any) => {
    if (!scopesMap) {
      alert('Scopes map is not loaded. Please wait and try again.');
      setAnalyzing(false);
      return;
    }

    const steps = workflow?.definition?.steps || workflow?.steps || {};
    const extractedResults: ResultItem[] = [];
    const extractedScopes = new Set<string>();

    for (const [stepName, stepData] of Object.entries<any>(steps)) {
      if (stepData.actionId === 'sp:http') {
        const method = stepData.attributes?.method?.toUpperCase() || 'GET';
        let url = stepData.attributes?.url || stepData.attributes?.['url.$'] || '';
        
        if (!url || url.trim() === '') {
          extractedResults.push({
            stepName,
            method,
            url: 'No URL Defined',
            scopes: null,
            message: 'This HTTP request action does not have a URL defined.',
            type: 'error'
          });
          continue;
        }

        // Handle variables
        let urlToParse = url.replace(/\{\{[^}]+\}\}/g, 'placeholder');
        urlToParse = urlToParse.replace(/\$\.[a-zA-Z0-9_\.]+/g, 'placeholder');
        urlToParse = urlToParse.replace(/<[^>]+>/g, 'placeholder');

        let urlObj;
        try {
          const fakeBase = urlToParse.startsWith('http') ? urlToParse : 'https://placeholder.com' + (urlToParse.startsWith('/') ? '' : '/') + urlToParse;
          urlObj = new URL(fakeBase);
        } catch (e) {
          extractedResults.push({
            stepName,
            method,
            url,
            scopes: null,
            message: 'Could not parse URL.',
            type: 'error'
          });
          continue;
        }

        let pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
        if (pathParts.length === 0) {
          extractedResults.push({
            stepName,
            method,
            url,
            scopes: null,
            message: 'Invalid endpoint path.',
            type: 'error'
          });
          continue;
        }

        const prefix = pathParts[0].toLowerCase();
        const publicApiVersions = ['v3', 'beta', 'v2024', 'v2025', 'v2026', 'v2027'];
        
        if (prefix === 'cc') {
          extractedResults.push({
            stepName,
            method,
            url,
            scopes: null,
            message: 'This is a legacy CC API. There is no proper documentation to give an exact scope. Please ensure the PAT has the necessary admin privileges.',
            type: 'legacy'
          });
          continue;
        }

        let apiVersion, endpointPath;
        if (publicApiVersions.includes(prefix)) {
          apiVersion = prefix;
          endpointPath = '/' + pathParts.slice(1).join('/');
        } else {
          apiVersion = 'root';
          endpointPath = '/' + pathParts.join('/');
        }

        endpointPath = endpointPath.split('?')[0];

        const scopes = findScopesForEndpoint(apiVersion, method, endpointPath, scopesMap);
        
        if (scopes && scopes.length > 0) {
          extractedResults.push({
            stepName,
            method,
            url,
            scopes,
            message: null,
            type: 'success'
          });
          scopes.forEach((s: string) => extractedScopes.add(s));
        } else {
          if (apiVersion === 'root') {
            extractedResults.push({
              stepName,
              method,
              url,
              scopes: null,
              message: `Internal or undocumented API detected (path starts with /${prefix}/). There is no proper documentation to give an exact scope. Please ensure the PAT has the necessary privileges.`,
              type: 'legacy'
            });
          } else {
            extractedResults.push({
              stepName,
              method,
              url,
              scopes: null,
              message: 'No explicit scopes found in documentation for this endpoint. It might require sp:scopes:all or no specific scope.',
              type: 'warning'
            });
          }
        }
      }
    }

    setResults(extractedResults);
    setAllRequiredScopes(extractedScopes);
    setAnalyzing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(Array.from(allRequiredScopes), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#02081b] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Workflow <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-accent">Scope Analyzer</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Upload your SailPoint Identity Security Cloud workflow JSON export. We'll analyze the HTTP steps and determine the exact Personal Access Token (PAT) scopes required for execution.
            </p>
          </div>

          {mapError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center mb-8">
              {mapError}
            </div>
          ) : isLoadingMap ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
            </div>
          ) : (
            <div 
              className={`relative group bg-slate-900/40 backdrop-blur-md border rounded-3xl p-10 md:p-16 text-center transition-all duration-300 ${
                dragActive ? 'border-brand-accent bg-brand-blue/5 shadow-[0_0_30px_rgba(84,199,231,0.2)]' : 'border-white/10 hover:border-white/20'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={inputRef} 
                onChange={handleChange} 
                accept=".json" 
                className="hidden" 
              />
              
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">Upload Workflow JSON</h3>
                  <p className="text-slate-400">Drag and drop your exported workflow file here, or click to browse.</p>
                </div>

                <button 
                  onClick={() => inputRef.current?.click()}
                  disabled={analyzing}
                  className="bg-brand-blue hover:bg-brand-accent text-white font-bold py-3 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(81,132,196,0.3)] hover:shadow-[0_0_25px_rgba(84,199,231,0.5)] active:scale-95"
                >
                  {analyzing ? 'Analyzing...' : 'Select File'}
                </button>
                
                <p className="text-xs text-slate-500 mt-4 font-medium uppercase tracking-wider">All processing is strictly client-side. No data is stored.</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="mt-16 space-y-8 animate-fade-in-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-3xl font-bold">Analysis Results</h2>
                  {fileName && (
                    <p className="text-slate-400 mt-2 font-mono text-sm">
                      <span className="font-semibold text-slate-300">File:</span> {fileName}
                    </p>
                  )}
                </div>
                
                {allRequiredScopes.size > 0 && (
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-full transition-colors border border-white/10"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        <span>Copy All Scopes</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {allRequiredScopes.size > 0 && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-brand-accent/30 rounded-2xl p-8 mb-12 shadow-[0_0_30px_rgba(84,199,231,0.05)]">
                  <h3 className="text-xl font-bold mb-4 text-brand-accent">Total Required Scopes</h3>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(allRequiredScopes).map((scope, idx) => (
                      <span key={idx} className="bg-brand-blue/20 text-brand-accent border border-brand-accent/40 px-4 py-2 rounded-lg text-sm font-mono font-medium shadow-[0_0_10px_rgba(84,199,231,0.1)]">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.length === 0 ? (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
                  <p className="text-lg">No HTTP Request (sp:http) actions found in this workflow.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {results.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`rounded-2xl p-6 md:p-8 border backdrop-blur-sm transition-all hover:bg-slate-900/60 ${
                        item.type === 'success' ? 'bg-slate-900/40 border-white/10' :
                        item.type === 'warning' || item.type === 'legacy' ? 'bg-yellow-500/5 border-yellow-500/20' :
                        'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h4 className="text-xl font-bold text-white">{item.stepName}</h4>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider ${
                            item.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                            item.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                            item.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                            item.method === 'PATCH' ? 'bg-orange-500/20 text-orange-400' :
                            item.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {item.method}
                          </span>
                          <span className="text-slate-400 font-mono text-sm break-all">
                            {item.url}
                          </span>
                        </div>
                      </div>

                      {item.scopes && item.scopes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.scopes.map((s, sIdx) => (
                            <span key={sIdx} className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-md text-xs font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.message && (
                        <div className={`mt-4 text-sm flex items-start gap-2 ${
                          item.type === 'warning' || item.type === 'legacy' ? 'text-yellow-400/90' : 'text-red-400/90'
                        }`}>
                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                          <p>{item.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
