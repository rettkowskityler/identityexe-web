import React from 'react';

const Hero = () => {
  const echoOffsets = [
    { offset: 600, opacity: 0.03 },
    { offset: 540, opacity: 0.06 },
    { offset: 480, opacity: 0.10 },
    { offset: 420, opacity: 0.15 },
    { offset: 360, opacity: 0.21 },
    { offset: 300, opacity: 0.29 },
    { offset: 240, opacity: 0.38 },
    { offset: 180, opacity: 0.48 },
    { offset: 120, opacity: 0.60 },
    { offset: 60, opacity: 0.74 },
  ];

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden pt-24 pb-24">
      {/* Full-Bleed Official Brand Guide 'X' Chevron Architecture (Balanced Scale & Shifted Right) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 76%, rgba(0,0,0,0.45) 90%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 76%, rgba(0,0,0,0.45) 90%, rgba(0,0,0,0) 100%)',
        }}
      >
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1920 1080"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hero-cyan-chevron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#54c7e7" />
              <stop offset="100%" stopColor="#46b7db" />
            </linearGradient>

            {/* Top-Right Wing 3D Depth Gradient */}
            <linearGradient id="hero-wing-top" x1="1800" y1="0" x2="1450" y2="430" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5d94d8" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#3c6ca8" stopOpacity="0.72" />
              <stop offset="80%" stopColor="#13294b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#02081b" stopOpacity="0" />
            </linearGradient>

            {/* Bottom-Right Wing 3D Depth Gradient */}
            <linearGradient id="hero-wing-bottom" x1="1800" y1="1080" x2="1450" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4b83c4" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#325d93" stopOpacity="0.68" />
              <stop offset="80%" stopColor="#102442" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#02081b" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="hero-echo-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5184c4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#54c7e7" stopOpacity="1" />
              <stop offset="100%" stopColor="#5184c4" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Reference Canvas Bounds to Lock Aspect Ratio */}
          <rect width="1920" height="1080" fill="none" />

          {/* Cascading Parallel Echo Chevrons Expanding Across the Page */}
          <g stroke="url(#hero-echo-stroke)" strokeWidth="2.25" fill="none">
            {echoOffsets.map(({ offset, opacity }) => (
              <polyline
                key={offset}
                points={`${893.2 - offset},0 ${1264.7 - offset},540 ${893.2 - offset},1080`}
                opacity={opacity}
              />
            ))}
          </g>

          {/* Primary Solid Cyan Brand Chevron (#54c7e7) */}
          <polygon
            points="893.2,0 1134.2,0 1505.7,540 1134.2,1080 893.2,1080 1264.7,540"
            fill="url(#hero-cyan-chevron)"
          />

          {/* Top-Right Shaded Wing of the EXE 'X' (54px Parallel Gap, Shifted Right) */}
          <polygon
            points="1636.3,0 1877.4,0 1532.7,501.0 1412.3,325.6"
            fill="url(#hero-wing-top)"
          />

          {/* Bottom-Right Shaded Wing of the EXE 'X' (54px Parallel Gap, Shifted Right) */}
          <polygon
            points="1412.3,754.4 1532.7,579.0 1877.4,1080 1636.3,1080"
            fill="url(#hero-wing-bottom)"
          />
        </svg>
      </div>

      {/* Three-Line Left-Aligned Lockup with Clean Vertical Separation */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 animate-fade-in-up">
        <div className="max-w-2xl">
          <p className="text-brand-accent font-bold uppercase tracking-[0.35em] text-xs sm:text-sm mb-6">
            SailPoint Consulting
          </p>

          <h1 className="font-display font-black text-white tracking-tight text-[clamp(2.75rem,5.8vw,5.25rem)] leading-[1.16] flex flex-col gap-1.5 sm:gap-2 mb-12">
            <span className="block">Enterprise</span>
            <span className="block">Identity</span>
            <span className="block gradient-text pb-2">Engineering</span>
          </h1>

          {/* Seamless Architectural Chevron CTA to /contact */}
          <a
            href="/contact"
            className="group inline-flex flex-col items-start no-underline cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-5 py-2.5">
              <span className="text-white group-hover:text-brand-accent font-bold text-sm sm:text-base uppercase tracking-[0.28em] transition-colors duration-300">
                Schedule a Call
              </span>

              {/* Cascading Brand Chevrons echoing the full-page vector geometry */}
              <div className="flex items-center -space-x-1.5 transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">
                <svg className="w-5 h-5 text-brand-blue/50 group-hover:text-brand-blue transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <path d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 text-brand-blue/80 group-hover:text-brand-accent transition-colors duration-300 delay-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <path d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 text-brand-accent group-hover:text-brand-light transition-colors duration-300 delay-150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Seamless Architectural Hairline Underline */}
            <div className="w-full h-[2px] bg-white/15 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-20 group-hover:w-full bg-gradient-to-r from-brand-accent via-brand-blue to-transparent transition-all duration-500 ease-out" />
            </div>
          </a>
        </div>
      </div>

      {/* Minimal Scroll Down Indicator to Founder / Blog Section */}
      <a
        href="#founder"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 opacity-40 hover:opacity-100 transition-opacity animate-bounce cursor-pointer p-4 group"
        aria-label="Scroll down"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400 group-hover:text-brand-accent transition-colors"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
