'use client';

import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'py-3 bg-slate-950/85 backdrop-blur-md border-white/10 shadow-lg' 
          : 'py-5 bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex flex-col items-start justify-center gap-0.5 no-underline group">
          <h2 className="font-display font-black tracking-tighter text-2xl md:text-3xl leading-none">
            <span className="logo-identity">Identity</span>
            <span className="logo-exe">EXE</span>
          </h2>
          <p className="text-slate-400 font-bold tracking-[0.25em] uppercase text-[0.65rem] leading-none">
            SailPoint Consulting
          </p>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="/blog" 
            className="text-slate-200 font-bold hover:text-blue-400 transition-colors uppercase tracking-widest text-xs"
          >
            Blog
          </a>
          <a 
            href="/contact" 
            className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-3 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.45)] border border-white/10 hover:shadow-[0_0_25px_rgba(37,99,235,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 btn-shimmer"
          >
            Talk to an Expert
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-blue-400 focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[60px] bg-slate-950/95 border-b border-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-60 opacity-100 py-6' : 'max-h-0 opacity-0 overflow-hidden py-0'
        }`}
      >
        <div className="flex flex-col items-center gap-6 px-6">
          <a 
            href="/blog" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-white font-bold hover:text-blue-400 transition-colors uppercase tracking-widest text-sm w-full text-center py-2"
          >
            Blog
          </a>
          <a 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-6 py-4 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-white/10 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] active:scale-95 transition-all duration-300 btn-shimmer"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
