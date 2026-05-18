'use client';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      details: formData.get('details'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      setIsSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again or email tyler@identityexe.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black mb-4">Inquiry Received</h2>
              <p className="text-slate-400 text-lg max-w-md">Thank you for reaching out. Tyler will review your architecture needs and get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="name" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" id="name" name="name" required disabled={isSubmitting} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium disabled:opacity-50" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
                  <input type="email" id="email" name="email" required disabled={isSubmitting} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium disabled:opacity-50" placeholder="john@company.com" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="company" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Company</label>
                <input type="text" id="company" name="company" disabled={isSubmitting} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium disabled:opacity-50" placeholder="Acme Corp" />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="details" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Project Details</label>
                <textarea id="details" name="details" required disabled={isSubmitting} rows={5} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-y disabled:opacity-50" placeholder="Briefly describe your current Identity Security posture or project needs..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-6 flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] uppercase tracking-widest w-full disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed" style={{ 
                  backgroundColor: '#2563eb', 
                  color: '#ffffff', 
                  padding: '1.25rem', 
                  borderRadius: '9999px', 
                  fontWeight: '900', 
                  fontSize: '1rem',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 30px rgba(37,99,235,0.4)',
                }}>
                {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                {!isSubmitting && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </button>
            </form>
          )}
          
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
