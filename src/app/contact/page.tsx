import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-hidden relative flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-6 relative z-10 w-full">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none"></div>

        <div className="w-full max-w-3xl p-8 md:p-14 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          
          <div className="text-center mb-12">
            <h1 className="font-black text-white tracking-tighter mb-4" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: '1.1' }}>Talk to an Expert</h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">Discuss your SailPoint Identity Security architecture needs directly with IdentityEXE.</p>
          </div>

          <form action="https://formsubmit.co/hello@identityexe.com" method="POST" className="flex flex-col gap-8 w-full">
            {/* FormSubmit Configs */}
            <input type="hidden" name="_subject" value="New IdentityEXE Consultation Inquiry" />
            <input type="hidden" name="_captcha" value="true" />
            <input type="hidden" name="_template" value="table" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="name" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input type="text" id="name" name="name" required className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
                <input type="email" id="email" name="email" required className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" placeholder="john@company.com" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="company" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Company</label>
              <input type="text" id="company" name="company" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" placeholder="Acme Corp" />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="details" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Project Details</label>
              <textarea id="details" name="details" required rows={5} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-y" placeholder="Briefly describe your current Identity Security posture or project needs..."></textarea>
            </div>

            <button type="submit" className="mt-6 flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] uppercase tracking-widest w-full" style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                padding: '1.25rem', 
                borderRadius: '9999px', 
                fontWeight: '900', 
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(37,99,235,0.4)',
              }}>
              Submit Inquiry
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
