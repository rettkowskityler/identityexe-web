import React from 'react';

const ProblemSolution = () => {
  return (
    <section className="py-32 px-6 relative z-10 w-full bg-black/50 border-y border-white/5" id="why-us">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center animate-fade-in-up">
          <p className="font-bold tracking-widest uppercase text-sm mb-4 text-blue-500">The IdentityEXE Difference</p>
          <h2 className="font-black text-white tracking-tighter text-4xl md:text-5xl max-w-3xl mx-auto">Stop Settling for Bloated Deployments</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* The Old Way */}
          <div className="p-10 md:p-12 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-8 flex items-center gap-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              The Big Consulting Way
            </h3>
            <ul className="space-y-6 text-slate-300 text-lg">
              <li className="flex items-start gap-4">
                <span className="text-red-500 mt-1 font-bold">✗</span>
                <p><strong className="text-white">Slow Timelines:</strong> Projects drag on for years due to massive overhead and bureaucracy.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 mt-1 font-bold">✗</span>
                <p><strong className="text-white">Bait and Switch:</strong> You are sold by senior architects, but the work is done by junior staff.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 mt-1 font-bold">✗</span>
                <p><strong className="text-white">Bloated Budgets:</strong> Paying for unneeded project managers and massive agency margins.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 mt-1 font-bold">✗</span>
                <p><strong className="text-white">Fragile Code:</strong> Poorly designed custom rules that break during the next upgrade.</p>
              </li>
            </ul>
          </div>

          {/* The IdentityEXE Way */}
          <div className="p-10 md:p-12 rounded-[2.5rem] border border-blue-500/30 bg-blue-500/10 relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.1)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] -z-10 rounded-full"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-blue-400 mb-8 flex items-center gap-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              The IdentityEXE Way
            </h3>
            <ul className="space-y-6 text-slate-200 text-lg">
              <li className="flex items-start gap-4">
                <span className="text-blue-400 mt-1 font-bold">✓</span>
                <p><strong className="text-white">Rapid Time-to-Value:</strong> Lean, expert-driven sprints that deliver results in weeks, not years.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-blue-400 mt-1 font-bold">✓</span>
                <p><strong className="text-white">Direct Expert Access:</strong> You work directly with a recognized SailPoint Expert Ambassador.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-blue-400 mt-1 font-bold">✓</span>
                <p><strong className="text-white">Transparent Pricing:</strong> Clear, scoped deliverables without the agency bloat.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-blue-400 mt-1 font-bold">✓</span>
                <p><strong className="text-white">Elegant Architecture:</strong> Parameter-by-parameter performance tuning for enterprise scale.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
