'use client';

import React, { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  label: string;
}

interface TOCProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      // Find the first entry that is intersecting
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0.1,
    });

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="glass-panel p-6 rounded-2xl border border-white/10 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto w-full">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-white/5">
        Table of Contents
      </h4>
      <ul className="space-y-3">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className="text-sm">
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block transition-all duration-300 relative pl-4 border-l-2 py-0.5 hover:text-white ${
                  isActive
                    ? 'text-blue-400 border-blue-500 font-semibold'
                    : 'text-slate-400 border-transparent hover:border-slate-600'
                }`}
                style={{ textDecoration: 'none' }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
