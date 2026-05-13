import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 glass-panel px-6 py-5 transition-all duration-300" style={{ width: '100%', left: 0 }}>
      <div className="mx-auto flex items-center" style={{ width: '100%', maxWidth: '80rem', justifyContent: 'space-between' }}>
        <a href="/" className="flex flex-col items-start justify-center gap-1" style={{ textDecoration: 'none' }}>
          <h2 className="font-black tracking-tighter text-white" style={{ fontSize: '2rem', lineHeight: '1' }}>Identity<span className="text-blue-500">EXE</span></h2>
          <p className="text-slate-400 font-bold tracking-[0.2em] uppercase" style={{ fontSize: '0.75rem' }}>SailPoint Consulting</p>
        </a>
        
        <div className="flex items-center gap-6">
          <a href="/blog" className="text-white font-bold hover:text-blue-400 transition-colors uppercase tracking-widest text-sm">
            Blog
          </a>
          <a href="/contact" style={{ 
            backgroundColor: '#2563eb', 
            color: '#ffffff', 
          padding: '0.75rem 2rem', 
          borderRadius: '9999px', 
          fontWeight: '900', 
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          userSelect: 'none',
          boxShadow: '0 0 15px rgba(37,99,235,0.4)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          Talk to an Expert
        </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
