'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Blog', href: '/blog', active: pathname?.startsWith('/blog') },
    { label: 'Tools', href: '/tools', active: pathname?.startsWith('/tools') },
  ];

  const isContactActive = pathname?.startsWith('/contact');

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'py-3.5 bg-[#02081b]/90 backdrop-blur-xl border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.45)]'
          : 'py-5 bg-transparent border-transparent'
      }`}
    >
      <div className="w-full px-7 sm:px-11 md:px-16 lg:px-24 xl:px-28 flex items-center justify-between">
        <a href="/" className="flex items-center justify-center no-underline group">
          <img
            src="/logo.svg"
            alt="IdentityEXE Logo"
            className="h-8 md:h-10 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(84,199,231,0.5)] group-hover:brightness-110"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-1.5 text-xs font-bold uppercase tracking-[0.22em] transition-colors duration-300 group ${
                link.active ? 'text-brand-accent' : 'text-slate-200 hover:text-white'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] bg-brand-accent transition-all duration-300 ${
                  link.active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </a>
          ))}

          {/* Subtle Architectural Divider */}
          <span className="h-4 w-[1px] bg-white/15" aria-hidden="true" />

          {/* Seamless Architectural Contact Link (Non-Redundant & Cohesive Across All Pages) */}
          <a
            href="/contact"
            className={`group relative inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 ${
              isContactActive
                ? 'text-brand-accent py-1.5'
                : isHome && !scrolled
                ? 'text-white/90 hover:text-brand-accent py-1.5'
                : 'text-white hover:text-brand-accent px-4 py-2 rounded-lg bg-white/[0.03] hover:bg-brand-accent/[0.08] border border-white/10 hover:border-brand-accent/45'
            }`}
          >
            <span>Contact</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 ${
                isContactActive ? 'text-brand-accent' : 'text-brand-accent/80 group-hover:text-brand-accent'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            {(isContactActive || (isHome && !scrolled)) && (
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] bg-brand-accent transition-all duration-300 ${
                  isContactActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            )}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden text-white hover:text-brand-accent focus:outline-none p-2 z-50 cursor-pointer pointer-events-auto touch-manipulation"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className={`md:hidden absolute inset-x-0 top-full bg-[#02081b]/95 border-b border-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0 !border-transparent'
        }`}
      >
        <div className="flex flex-col items-center gap-5 px-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-bold uppercase tracking-[0.22em] text-sm w-full text-center py-2 transition-colors ${
                link.active ? 'text-brand-accent' : 'text-white hover:text-brand-accent'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="w-16 h-[1px] bg-white/10 my-1" />
          <a
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 text-brand-accent font-bold uppercase tracking-[0.22em] text-sm py-2"
          >
            <span>Contact</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
