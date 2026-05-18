import React from 'react';

const Founder = () => {
  return (
    <section className="py-32 px-6 relative z-10 w-full" id="founder">
      <div className="max-w-6xl mx-auto glass-card rounded-[3rem] p-10 md:p-16 relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] -translate-y-1/2 -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1.5 shadow-[0_0_60px_rgba(168,85,247,0.3)]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black overflow-hidden relative">
                <img src="/images/profile.jpg" alt="Tyler - Founder" className="w-full h-full object-cover relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent z-20 pointer-events-none"></div>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-3">Tyler</h2>
            <p className="text-blue-400 font-bold tracking-widest uppercase text-sm md:text-base mb-8">Founder & SailPoint Expert Ambassador</p>
            <div className="space-y-6 text-slate-300 leading-relaxed text-lg md:text-xl font-light">
              <p>
                As a recognized SailPoint Expert Ambassador, my mission is to deliver uncompromised identity ecosystems that actually work. 
              </p>
              <p>
                After spending years fixing broken deployments created by massive consulting firms, I founded <strong className="text-white font-medium">IdentityEXE</strong> to provide direct-to-client expertise. 
              </p>
              <p>
                When you hire IdentityEXE, you aren't handed off to junior developers—you get an architect who understands the platform parameter-by-parameter.
              </p>
            </div>
            <div className="mt-10">
              <a href="/blog" className="inline-flex items-center gap-3 text-white font-bold hover:text-blue-400 transition-colors uppercase tracking-widest text-sm group">
                Read my Engineering Insights 
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <span className="transition-transform group-hover:translate-x-1">→</span>
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
