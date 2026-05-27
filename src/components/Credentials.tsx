import React from 'react';

const Credentials = () => {
  const credentials = [
    {
      title: "SailPoint Expert Ambassador",
      value: "Elite",
      description: "Recognized among the top global tier of technical SailPoint experts.",
      color: "#3b82f6",
      icon: (
        <svg className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Ambassador Crest/Crown Shield */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    },
    {
      title: "Identity Security Cloud",
      value: "Certified",
      description: "ISC Certified Developer & Engineer with deep multi-tenant deployment architecture experience.",
      color: "#a855f7",
      icon: (
        <svg className="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Cloud Security Shield */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      title: "IdentityIQ",
      value: "Certified",
      description: "IIQ Certified Developer & Engineer specializing in complex, custom enterprise integrations.",
      color: "#10b981",
      icon: (
        <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Intel / Network Core Gear */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.827m11.379-8.158l1.15-.827M8.14 21.27l.707-1.03m6.13-8.98l.707-1.03M12 3v1.5m0 15V21m-3.077-8.457l-.513-1.41m5.13 14.095l-.513-1.41M17.785 5.106l-.827 1.15m-8.158 11.379l-.827 1.15m-3.535-3.535l1.03-.707m8.98-6.13l1.03-.707" />
        </svg>
      )
    },
    {
      title: "Enterprise Deployments",
      value: "Proven",
      description: "Direct-to-client track record of securing millions of identities across Fortune 500 environments.",
      color: "#94a3b8",
      icon: (
        <svg className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Globe & Network Nodes */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      )
    }
  ];

  const integrations = [
    { name: 'Active Directory', icon: 'AD' },
    { name: 'Microsoft Entra ID', icon: 'Entra' },
    { name: 'Okta', icon: 'Okta' },
    { name: 'ServiceNow', icon: 'ServiceNow' },
    { name: 'Workday', icon: 'Workday' }
  ];

  return (
    <section className="py-32 px-6 relative z-10 w-full flex flex-col items-center" id="credentials">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center justify-center w-full text-center animate-fade-in-up">
          <p className="font-bold tracking-widest uppercase text-sm mb-4 text-blue-500">Unmatched Technical Pedigree</p>
          <h2 className="font-display font-black text-white tracking-tighter text-4xl md:text-6xl">Our Credentials</h2>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {credentials.map((cred, i) => (
            <div 
              key={i} 
              className="p-10 md:p-12 rounded-[2.5rem] transition-all duration-300 group flex flex-col justify-between items-center text-center min-h-[340px] relative overflow-hidden shadow-2xl hover:scale-[1.01] hover:border-white/10" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
               {/* Ambient Glow */}
               <div 
                 className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[90px] transition-all duration-500 opacity-10 group-hover:opacity-20" 
                 style={{ backgroundColor: cred.color }}
               ></div>
               
               {/* Badge Icon Ring */}
               <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-inner">
                 {cred.icon}
               </div>

               {/* Title and Description */}
               <div className="relative z-10 flex flex-col items-center flex-grow">
                 <h3 className="font-display font-black text-white uppercase tracking-tight mb-4 text-2xl md:text-3xl leading-tight">
                   {cred.title}
                 </h3>
                 <p className="text-slate-400 leading-relaxed text-base font-light max-w-md">
                   {cred.description}
                 </p>
               </div>
               
               {/* Status Badge */}
               <div className="mt-8 relative z-10">
                 <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                   <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: cred.color }}></div>
                   <span className="font-bold tracking-widest uppercase text-xs" style={{ color: cred.color }}>
                     {cred.value}
                   </span>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* Integration Expertise Sub-section */}
        <div className="mt-32 pt-16 border-t border-white/5">
          <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-center text-xs mb-10">
            Ecosystem Integration Expertise
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-40 hover:opacity-60 transition-opacity">
            {integrations.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-400 group">
                {/* Visual Minimalist Logotypes */}
                {item.name === 'Active Directory' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                )}
                {item.name === 'Microsoft Entra ID' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
                {item.name === 'Okta' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
                {item.name === 'ServiceNow' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                )}
                {item.name === 'Workday' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v18M3 12h18M12 3l5 5M12 21l-5-5" />
                  </svg>
                )}
                <span className="font-bold text-sm uppercase tracking-wider">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credentials;
