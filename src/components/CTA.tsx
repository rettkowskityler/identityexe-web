import React from 'react';

const CTA = () => {
  return (
    <section className="py-40 px-6 relative z-10 w-full flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20 -z-10"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/30 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <h2 className="font-black text-white tracking-tighter mb-8" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: '1.05' }}>
          Ready to master your <br/><span className="gradient-text">identity security?</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
          Stop fighting your deployment. Let's build a secure, compliant, and automated ecosystem that scales with your enterprise.
        </p>
        <a href="/contact" style={{
            display: 'inline-block',
            backgroundColor: '#ffffff', 
            color: '#0f172a', 
            padding: '1.5rem 3.5rem', 
            borderRadius: '9999px', 
            fontWeight: '900', 
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            boxShadow: '0 0 50px rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease'
        }} className="hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] active:scale-95">
          Schedule an Architecture Review
        </a>
      </div>
    </section>
  );
};

export default CTA;
