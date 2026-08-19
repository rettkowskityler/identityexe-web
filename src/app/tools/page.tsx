import React from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'IdentityEXE Tools',
  description: 'A suite of powerful utilities for identity security professionals.',
};

export default function ToolsLandingPage() {
  const tools = [
    {
      id: 'workflow-scope-analyzer',
      title: 'Workflow Scope Analyzer',
      description: 'Upload your SailPoint ISC workflow JSON to instantly discover the exact HTTP API scopes required for your Personal Access Tokens (PAT).',
      href: '/tools/workflow-scope-analyzer',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      )
    },
    // Add future tools here
  ];

  return (
    <div className="min-h-screen bg-[#02081b] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-accent">Tools</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              A growing suite of free, client-side utilities designed to accelerate your identity security engineering workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link 
                href={tool.href} 
                key={tool.id}
                className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-brand-accent/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(84,199,231,0.15)] hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 group-hover:bg-brand-blue/20 transition-all duration-300">
                    {tool.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-white transition-colors">{tool.title}</h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center text-brand-accent font-bold text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                    <span>Launch Tool</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* "More coming soon" card */}
            <div className="bg-slate-900/20 border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-300">More Tools</h3>
              <p className="text-slate-500 text-sm">New utilities are actively being developed. Check back soon!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
