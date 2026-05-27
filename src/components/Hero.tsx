import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-32 px-6 text-center overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] -z-10 animate-float-slow"></div>

      <div className="animate-fade-in-up max-w-5xl mx-auto flex flex-col items-center">
        {/* Upper Expertise Tagline Badge */}
        <span className="px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 inline-block shadow-sm">
          SailPoint Architecture & Solutions
        </span>

        {/* Hero Title */}
        <h1 className="font-display font-black tracking-tighter mb-8 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.9]">
          <span className="block text-white">Identity.</span>
          <span className="block gradient-text pb-4">Mastered.</span>
        </h1>

        {/* Hero Subheadline */}
        <p className="text-xl md:text-2xl lg:text-3xl text-slate-400 mb-14 max-w-3xl leading-relaxed font-light mt-4">
          Uncompromised <strong className="text-white font-semibold">SailPoint Identity Security Cloud</strong> and <strong className="text-white font-semibold">IdentityIQ</strong> architecture built for the modern enterprise.
        </p>

        {/* Primary Interactive CTA */}
        <a 
          href="/contact" 
          className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-white/10 hover:shadow-[0_0_40px_rgba(37,99,235,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 btn-shimmer"
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
      
      {/* Scroll Down Bounce Indicator */}
      <a 
        href="#credentials" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40 hover:opacity-100 transition-opacity animate-bounce cursor-pointer p-4 group" 
        aria-label="Scroll down"
      >
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-slate-400 group-hover:text-blue-400 transition-colors"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
