import React from 'react';

const Founder = () => {
  return (
    <section className="py-32 px-6 relative z-10 w-full" id="founder">
      <div className="max-w-6xl mx-auto glass-card rounded-[3rem] p-8 md:p-16 relative overflow-hidden animate-fade-in-up">
        {/* Colorful Glow Background Accents */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] -translate-y-1/2 -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Avatar Profile */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1.5 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black overflow-hidden relative">
                <img 
                  src="/images/profile.jpg" 
                  alt="Tyler - Founder" 
                  className="w-full h-full object-cover relative z-10" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent z-20 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Copy */}
          <div className="lg:col-span-7">
            <span className="text-blue-400 font-bold tracking-[0.25em] uppercase text-xs mb-3 inline-block">
              Meet the Founder
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter mb-2">
              Tyler
            </h2>
            <p className="text-purple-400 font-bold tracking-widest uppercase text-xs md:text-sm mb-8">
              SailPoint Expert Ambassador
            </p>
            
            {/* Custom Quote Highlights block */}
            <div className="border-l-4 border-blue-500 pl-6 my-8 py-1 bg-white/3 rounded-r-2xl border-white/5 pr-4">
              <p className="text-white font-medium text-lg md:text-xl italic leading-relaxed">
                "When you hire IdentityEXE, you aren't handed off to junior developers—you get an architect who understands the platform parameter-by-parameter."
              </p>
            </div>

            <div className="space-y-6 text-slate-300 leading-relaxed text-base md:text-lg font-light">
              <p>
                As a recognized SailPoint Expert Ambassador, my mission is to deliver uncompromised identity ecosystems that actually work. 
              </p>
              <p>
                After spending years fixing broken deployments created by massive consulting firms, I founded <strong className="text-white font-medium">IdentityEXE</strong> to provide direct-to-client expertise. 
              </p>
            </div>
            
            {/* Call to action to insights */}
            <div className="mt-10 pt-4">
              <a 
                href="/blog" 
                className="inline-flex items-center gap-4 text-white font-bold hover:text-blue-400 transition-colors uppercase tracking-widest text-xs group"
              >
                Read my Engineering Insights 
                <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all">
                  <svg 
                    className="w-4 h-4 text-white group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
