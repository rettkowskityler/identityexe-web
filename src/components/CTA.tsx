import React from 'react';

const CTA = () => {
  return (
    <section className="py-40 px-6 relative z-10 w-full flex items-center justify-center text-center overflow-hidden">
      {/* Decorative gradient overlay and blur circle */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 -z-10"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Title */}
        <h2 className="font-display font-black text-white tracking-tighter mb-8 text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[1.05]">
          Ready to master your <br/>
          <span className="gradient-text">identity security?</span>
        </h2>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
          Stop fighting your deployment. Let's build a secure, compliant, and automated ecosystem that scales with your enterprise.
        </p>

        {/* Secondary Shimmer CTA Button */}
        <a 
          href="/contact" 
          className="group inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-950 px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.15)] border border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 btn-shimmer"
        >
          Talk to an Expert
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default CTA;
