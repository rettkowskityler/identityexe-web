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
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
