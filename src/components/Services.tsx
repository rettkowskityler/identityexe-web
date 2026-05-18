import React from 'react';

const Services = () => {
  const services = [
    {
      title: "IIQ to ISC Migrations",
      description: "De-risking complex moves to the cloud. We map out your existing IdentityIQ implementation and seamlessly transition it to Identity Security Cloud.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m14 15-2-2-2 2"/><path d="M12 13v8"/></svg>
      )
    },
    {
      title: "Custom Integrations",
      description: "Building bespoke Web Service connectors and custom workflows to automatically govern any application, anywhere in your ecosystem.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m21 16-5.16-5.16a2 2 0 0 0-2.83 0l-5.17 5.17"/><path d="M12 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="M15.5 15.5 19 19"/></svg>
      )
    },
    {
      title: "Architecture & Health",
      description: "Rescuing failing deployments, optimizing performance, and ensuring your identity ecosystem follows true Zero Trust principles.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
      )
    }
  ];

  return (
    <section className="py-24 px-6 relative z-10 w-full" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center animate-fade-in-up">
          <p className="font-bold tracking-widest uppercase text-sm mb-4 text-purple-500">Core Capabilities</p>
          <h2 className="font-black text-white tracking-tighter text-4xl md:text-5xl">What We Do Best</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <div key={i} className="glass-card p-10 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
               <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                 {svc.icon}
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">{svc.title}</h3>
               <p className="text-slate-400 leading-relaxed text-lg font-light">{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
