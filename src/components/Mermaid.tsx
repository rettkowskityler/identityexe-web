'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  useEffect(() => {
    if (!mermaidLoaded) return;
    
    const renderChart = async () => {
      if (ref.current && (window as any).mermaid) {
        (window as any).mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
        });
        try {
          const id = 'mermaid-chart-' + Math.random().toString(36).substring(2, 11);
          const { svg } = await (window as any).mermaid.render(id, chart);
          ref.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering failed', error);
        }
      }
    };
    renderChart();
  }, [chart, mermaidLoaded]);

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js" 
        strategy="afterInteractive"
        onLoad={() => setMermaidLoaded(true)}
      />
      <div ref={ref} className="flex justify-center w-full my-6 overflow-x-auto" />
    </>
  );
}
