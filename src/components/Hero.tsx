import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-32 px-6 text-center overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] -z-10 animate-float-slow"></div>

      <div className="animate-fade-in-up max-w-5xl mx-auto" style={{ animationDelay: '0.1s' }}>
        <h1 className="font-black tracking-tighter mb-8" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', lineHeight: '0.9' }}>
          <span className="block text-white">Identity.</span>
          <span className="block gradient-text pb-4">Mastered.</span>
        </h1>

        <p className="text-xl md:text-3xl text-slate-400 mb-14 leading-relaxed font-light mt-8">
          Uncompromised <strong className="text-white font-medium">SailPoint Identity Security Cloud</strong> and <strong className="text-white font-medium">IdentityIQ</strong> architecture for the modern enterprise.
        </p>

        <a href="/contact" style={{
            display: 'inline-block',
            backgroundColor: '#2563eb', 
            color: '#ffffff', 
            padding: '1.5rem 3.5rem', 
            borderRadius: '9999px', 
            fontWeight: '900', 
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            userSelect: 'none',
            boxShadow: '0 0 30px rgba(37,99,235,0.5)',
            border: '1px solid rgba(255,255,255,0.15)'
        }}>
          Talk to an Expert
        </a>
      </div>
      
      <a href="#credentials" className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-40 hover:opacity-100 transition-opacity animate-bounce cursor-pointer p-4 group" aria-label="Scroll down">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-400">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
