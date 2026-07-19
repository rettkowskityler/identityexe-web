import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-32 px-6 text-center overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px] -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[150px] -z-10 animate-float-slow"></div>

      <div className="animate-fade-in-up max-w-5xl mx-auto flex flex-col items-center">


        {/* Hero Title */}
        <h1 className="font-display font-black tracking-tighter mb-14 text-[clamp(2.4rem,8vw,7rem)] leading-[1]">
          <span className="block text-white">SailPoint Implementation</span>
          <span className="block gradient-text pb-4">Mastered</span>
        </h1>

        {/* Primary Interactive CTA */}
        <a 
          href="/contact" 
          className="group inline-flex items-center gap-3 bg-brand-blue hover:bg-brand-accent text-white px-7 py-3.5 md:px-10 md:py-5 rounded-full font-black text-sm md:text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(81,132,196,0.4)] border border-white/10 hover:shadow-[0_0_40px_rgba(84,199,231,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 btn-shimmer"
        >
          Get Started
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
        href="#founder" 
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
