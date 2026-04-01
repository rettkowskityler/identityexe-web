import React from 'react';

const Credentials = () => {
  const credentials = [
    {
      title: "SailPoint Expert Ambassador",
      value: "Elite",
      description: "Recognized among the top global tier of technical SailPoint experts.",
      color: "#3b82f6" 
    },
    {
      title: "Identity Security Cloud",
      value: "Certified",
      description: "ISC Certified Developer & Engineer with deep multi-tenant deployment architecture experience.",
      color: "#a855f7"
    },
    {
      title: "IdentityIQ",
      value: "Certified",
      description: "IIQ Certified Developer & Engineer specializing in complex, custom enterprise integrations.",
      color: "#10b981"
    },
    {
      title: "Enterprise Deployments",
      value: "Proven",
      description: "Direct-to-client track record of securing millions of identities across Fortune 500 environments.",
      color: "#94a3b8"
    }
  ];

  return (
    <section className="py-24 px-6 relative z-10 w-full flex flex-col items-center" id="credentials">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-20 animate-fade-in-up flex flex-col items-center justify-center w-full" style={{ textAlign: 'center' }}>
          <p className="font-bold tracking-widest uppercase text-sm mb-4" style={{ color: '#3b82f6' }}>Unmatched Technical Pedigree</p>
          <h2 className="font-black text-white tracking-tighter" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '1.1' }}>Our Credentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {credentials.map((cred, i) => (
            <div key={i} className="p-12 rounded-[2.5rem] transition-all duration-300 group flex flex-col justify-between items-center text-center min-h-[300px] relative overflow-hidden shadow-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
               {/* Accent glow on hover */}
               <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] transition-all duration-500`} style={{ backgroundColor: cred.color, opacity: 0.15 }}></div>
               
               <div className="relative z-10 flex flex-col items-center">
                 <h3 className="font-black text-white uppercase tracking-tighter mb-6 leading-tight max-w-[90%]" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '1.2' }}>{cred.title}</h3>
                 <p className="text-xl leading-relaxed max-w-md font-light" style={{ color: '#94a3b8' }}>{cred.description}</p>
               </div>
               
               <div className="mt-12 relative z-10">
                 <div className="inline-flex items-center justify-center gap-3">
                   <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: cred.color }}></div>
                   <span className="font-bold tracking-wider uppercase text-sm" style={{ color: cred.color }}>{cred.value}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
