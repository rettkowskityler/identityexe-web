'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Contact() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'form'>('calendar');
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
      productFocus: formData.get('productFocus'),
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
      
      <div className="flex-grow flex items-center justify-center pt-36 pb-20 px-6 relative z-10 w-full">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[130px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Expectation & Trust Builder */}
          <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-in-up">
            <div>
              <span className="px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 inline-block">
                Direct Expert Partnership
              </span>
              <h1 className="font-display font-black text-white tracking-tighter text-4xl md:text-5xl lg:text-6xl leading-tight">
                Let's master your <br/>
                <span className="gradient-text">identity security.</span>
              </h1>
              <p className="text-slate-400 font-light text-lg mt-6 leading-relaxed">
                Connect directly with a recognized SailPoint Expert Ambassador. No sales layers, no delegation to junior staff—just deep, high-impact technical advisory tailored to your enterprise.
              </p>
            </div>

            {/* Process Roadmap */}
            <div className="flex flex-col gap-6 bg-white/2 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md">
              <h3 className="font-bold text-white uppercase text-xs tracking-widest border-b border-white/5 pb-3">
                What to Expect
              </h3>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Select Your Preferred Channel</h4>
                  <p className="text-slate-400 text-xs mt-1 font-light leading-relaxed">
                    Book a direct 30-minute discovery call on my calendar, or send project details via the inquiry form.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">30-Min Architecture Discovery</h4>
                  <p className="text-slate-400 text-xs mt-1 font-light leading-relaxed">
                    We'll review your current deployment, map out key bottlenecks, and align on integration goals.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Targeted Action Proposal</h4>
                  <p className="text-slate-400 text-xs mt-1 font-light leading-relaxed">
                    Get a scoped, high-level proposal with transparent deliverables and timelines to de-risk your deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-xs font-light pl-2">
              Prefer direct email? Reach out at{' '}
              <a href="mailto:tyler@identityexe.com" className="text-blue-400 hover:text-blue-300 font-semibold no-underline">
                tyler@identityexe.com
              </a>
            </div>
          </div>

          {/* Right Column: Tabbed Interactive Form & Calendly Scheduler */}
          <div 
            className="lg:col-span-7 w-full p-6 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden border border-white/5" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.015)' }}
          >
            {/* Tab Navigation header */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-950/60 border border-white/5 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Schedule Direct Call
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`flex-1 text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Send Inquiry Message
              </button>
            </div>

            {/* Tab Content 1: Google Calendar Embed */}
            {activeTab === 'calendar' && (
              <div className="animate-fade-in-up flex flex-col gap-4">
                <div className="bg-white rounded-2xl overflow-hidden border border-white/5 min-h-[620px] relative">
                  <iframe 
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1blvARvOjYrxqlOLwH9R6E3xS9BRbelK6xVHR66JXXUrT_EnVwI1c7cmslxpvrz13LgaGfLlX5?gv=true" 
                    width="100%" 
                    height="620" 
                    frameBorder="0"
                    title="Schedule Call with Tyler"
                    className="w-full h-[620px] bg-white"
                  ></iframe>
                </div>
                <p className="text-slate-500 text-xs text-center font-light mt-2">
                  Calendar scheduling loading securely. Pick any available slot to lock in your call.
                </p>
              </div>
            )}

            {/* Tab Content 2: Custom Contact Form */}
            {activeTab === 'form' && (
              <div className="animate-fade-in-up">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-display font-black mb-4">Inquiry Received</h2>
                    <p className="text-slate-400 text-base max-w-md font-light leading-relaxed">
                      Thank you for reaching out. Tyler will review your SailPoint architecture goals and respond within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          required 
                          disabled={isSubmitting} 
                          className="bg-white/3 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-light disabled:opacity-50" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required 
                          disabled={isSubmitting} 
                          className="bg-white/3 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-light disabled:opacity-50" 
                          placeholder="john@company.com" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="company" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</label>
                        <input 
                          type="text" 
                          id="company" 
                          name="company" 
                          disabled={isSubmitting} 
                          className="bg-white/3 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-light disabled:opacity-50" 
                          placeholder="Acme Corp" 
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label htmlFor="productFocus" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Focus</label>
                        <select 
                          id="productFocus" 
                          name="productFocus" 
                          disabled={isSubmitting}
                          className="bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-light disabled:opacity-50 cursor-pointer"
                        >
                          <option value="ISC">SailPoint Identity Security Cloud (ISC)</option>
                          <option value="IIQ">SailPoint IdentityIQ (IIQ)</option>
                          <option value="Hybrid">Hybrid Deployment</option>
                          <option value="Other">Not Sure / Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="details" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What is your main SailPoint challenge?</label>
                      <textarea 
                        id="details" 
                        name="details" 
                        required 
                        disabled={isSubmitting} 
                        rows={4} 
                        className="bg-white/3 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-light resize-y disabled:opacity-50" 
                        placeholder="Describe your current challenge, project timeline, or system issues..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="mt-4 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] uppercase tracking-widest w-full disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.35)] border border-white/10 btn-shimmer"
                    >
                      {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                      {!isSubmitting && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
