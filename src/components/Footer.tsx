import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-black/40 pt-16 pb-8 px-6 mt-32 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-4">Identity<span className="text-blue-500">EXE</span></h2>
          <p className="text-slate-400 max-w-sm">
            Top-echelon SailPoint consulting for forward-thinking enterprises. Identity Security, Mastered.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Expertise</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>SailPoint Identity Security Cloud</li>
            <li>SailPoint IdentityIQ</li>
            <li>Access Modeling</li>
            <li>Zero Trust Frameworks</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Connect</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            <li>hello@identityexe.com</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} IdentityEXE LLC. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built parameter-by-parameter for performance.</p>
      </div>
    </footer>
  );
};

export default Footer;
