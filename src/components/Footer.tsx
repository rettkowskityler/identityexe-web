import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60 pt-16 pb-8 px-6 mt-32 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Block */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <h2 className="text-3xl font-display font-black tracking-tighter text-white">
            Identity<span className="text-blue-500">EXE</span>
          </h2>
          <p className="text-slate-400 max-w-sm font-light text-base leading-relaxed">
            Top-echelon SailPoint consulting for forward-thinking enterprises. Identity Security, Mastered.
          </p>
        </div>

        {/* Expertise Block */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-wide text-sm uppercase">Expertise</h3>
          <ul className="space-y-3 text-slate-400 text-sm font-light">
            <li className="hover:text-white transition-colors">SailPoint Identity Security Cloud</li>
            <li className="hover:text-white transition-colors">SailPoint IdentityIQ</li>
            <li className="hover:text-white transition-colors">Access Modeling</li>
            <li className="hover:text-white transition-colors">Zero Trust Frameworks</li>
          </ul>
        </div>

        {/* Connect Block */}
        <div>
          <h3 className="text-white font-bold mb-4 tracking-wide text-sm uppercase">Connect</h3>
          <ul className="space-y-3 text-slate-400 text-sm font-light">
            <li>
              <a href="#" className="hover:text-blue-400 hover:underline transition-all">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-blue-400 hover:underline transition-all">
                Blog
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400 hover:underline transition-all">
                Contact Us
              </a>
            </li>
            <li>
              <a href="mailto:tyler@identityexe.com" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                tyler@identityexe.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-light">
        <p>&copy; {new Date().getFullYear()} IdentityEXE LLC. All rights reserved.</p>
        <p className="mt-2 md:mt-0 tracking-wider">Built parameter-by-parameter for performance.</p>
      </div>
    </footer>
  );
};

export default Footer;
