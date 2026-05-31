import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Blog() {
  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4 animate-fade-in-up">
              Insights & <span className="gradient-text">Engineering</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Deep dives into SailPoint architecture, performance optimizations, and uncompromised identity ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post Card */}
            <a href="/blog/maintenance-mode-isc" className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up" style={{ textDecoration: 'none', animationDelay: '0.2s' }}>
              <div className="rounded-xl bg-blue-500/10 w-full h-48 flex items-center justify-center border border-blue-500/20 mb-2 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                 </svg>
              </div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-blue-400">
                <span>Architecture</span>
                <span>May 2026</span>
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">Bringing IIQ Maintenance Mode to ISC</h2>
              <p className="text-slate-400 text-sm flex-grow">
                A custom workflow forms solution to gracefully handle SailPoint source downtime using the Maintenance Guard pattern.
              </p>
              <div className="mt-4 flex items-center text-blue-500 font-bold text-sm">
                Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>

            {/* Blog Post Card 2 */}
            <a href="/blog/recursive-governance" className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up" style={{ textDecoration: 'none', animationDelay: '0.3s' }}>
              <div className="rounded-xl bg-purple-500/10 w-full h-48 flex items-center justify-center border border-purple-500/20 mb-2 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-purple-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                 </svg>
              </div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-purple-400">
                <span>Architecture</span>
                <span>May 2026</span>
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">Implementing Recursive Governance</h2>
              <p className="text-slate-400 text-sm flex-grow">
                Learn how to govern SailPoint ISC Personal Access Tokens (PATs) using a custom Web Services Connector to regain visibility and control.
              </p>
              <div className="mt-4 flex items-center text-purple-500 font-bold text-sm">
                Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>

            {/* Blog Post Card 3 */}
            <a href="/blog/delegated-governance-groups" className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up" style={{ textDecoration: 'none', animationDelay: '0.4s' }}>
              <div className="rounded-xl bg-emerald-500/10 w-full h-48 flex items-center justify-center border border-emerald-500/20 mb-2 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20" />
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-emerald-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                 </svg>
              </div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-emerald-400">
                <span>Architecture</span>
                <span>May 2026</span>
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">Self-Service Governance Group Management</h2>
              <p className="text-slate-400 text-sm flex-grow">
                Securely delegate governance group administration to group owners using a multi-form pipeline workaround in SailPoint ISC.
              </p>
              <div className="mt-4 flex items-center text-emerald-500 font-bold text-sm">
                Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>

            {/* Blog Post Card 4 */}
            <a href="/blog/identity-timeline-report" className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up" style={{ textDecoration: 'none', animationDelay: '0.5s' }}>
              <div className="rounded-xl bg-amber-500/10 w-full h-48 flex items-center justify-center border border-amber-500/20 mb-2 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20" />
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-amber-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                 </svg>
              </div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-amber-400">
                <span>Architecture</span>
                <span>May 2026</span>
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">Building a Custom Identity Timeline Report</h2>
              <p className="text-slate-400 text-sm flex-grow">
                Consolidate identity lifecycle events, audit trails, provisioning activities, access requests, and manual work items into a single chronological timeline.
              </p>
              <div className="mt-4 flex items-center text-amber-500 font-bold text-sm">
                Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
