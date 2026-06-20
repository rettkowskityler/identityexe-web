'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  description: string;
  iconBgClass: string;
  iconBorderClass: string;
  iconColorClass: string;
  hoverTitleClass: string;
  readMoreColorClass: string;
  gradientClass: string;
  icon: React.ReactNode;
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts: BlogPost[] = [
    {
      slug: 'dynamic-retry-workflows',
      title: 'Dynamic Retry Workflows in Identity Security Cloud',
      category: 'Architecture',
      date: 'June 2026',
      description: 'An architectural implementation framework to gracefully retry HTTP POSTs and PowerShell scripts to handle downstream dependency delays.',
      iconBgClass: 'bg-indigo-500/10',
      iconBorderClass: 'border-indigo-500/20',
      iconColorClass: 'text-indigo-400',
      hoverTitleClass: 'group-hover:text-indigo-400',
      readMoreColorClass: 'text-indigo-500',
      gradientClass: 'from-indigo-600/20 to-blue-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      )
    },
    {
      slug: 'maintenance-mode-isc',
      title: 'Bringing IIQ Maintenance Mode to ISC',
      category: 'Architecture',
      date: 'May 2026',
      description: 'A custom workflow forms solution to gracefully handle SailPoint source downtime using the Maintenance Guard pattern.',
      iconBgClass: 'bg-blue-500/10',
      iconBorderClass: 'border-blue-500/20',
      iconColorClass: 'text-blue-400',
      hoverTitleClass: 'group-hover:text-blue-400',
      readMoreColorClass: 'text-blue-500',
      gradientClass: 'from-blue-600/20 to-purple-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      )
    },
    {
      slug: 'recursive-governance',
      title: 'Implementing Recursive Governance',
      category: 'Architecture',
      date: 'May 2026',
      description: 'Learn how to govern SailPoint ISC Personal Access Tokens (PATs) using a custom Web Services Connector to regain visibility and control.',
      iconBgClass: 'bg-purple-500/10',
      iconBorderClass: 'border-purple-500/20',
      iconColorClass: 'text-purple-400',
      hoverTitleClass: 'group-hover:text-purple-400',
      readMoreColorClass: 'text-purple-500',
      gradientClass: 'from-purple-600/20 to-blue-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      slug: 'delegated-governance-groups',
      title: 'Self-Service Governance Group Management',
      category: 'Architecture',
      date: 'May 2026',
      description: 'Securely delegate governance group administration to group owners using a multi-form pipeline workaround in SailPoint ISC.',
      iconBgClass: 'bg-emerald-500/10',
      iconBorderClass: 'border-emerald-500/20',
      iconColorClass: 'text-emerald-400',
      hoverTitleClass: 'group-hover:text-emerald-400',
      readMoreColorClass: 'text-emerald-500',
      gradientClass: 'from-emerald-600/20 to-teal-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      slug: 'identity-timeline-report',
      title: 'Building a Custom Identity Timeline Report',
      category: 'Architecture',
      date: 'May 2026',
      description: 'Consolidate identity lifecycle events, audit trails, provisioning activities, access requests, and manual work items into a single chronological timeline.',
      iconBgClass: 'bg-amber-500/10',
      iconBorderClass: 'border-amber-500/20',
      iconColorClass: 'text-amber-400',
      hoverTitleClass: 'group-hover:text-amber-400',
      readMoreColorClass: 'text-amber-500',
      gradientClass: 'from-amber-600/20 to-orange-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      slug: 'certification-escalation-workflow',
      title: 'Self-Service Certification Escalation',
      category: 'Architecture',
      date: 'June 2026',
      description: 'A custom workflows and interactive forms solution to automate overdue certification campaign escalations to reviewers\' managers.',
      iconBgClass: 'bg-rose-500/10',
      iconBorderClass: 'border-rose-500/20',
      iconColorClass: 'text-rose-400',
      hoverTitleClass: 'group-hover:text-rose-400',
      readMoreColorClass: 'text-rose-500',
      gradientClass: 'from-rose-600/20 to-pink-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
          <line x1="12" y1="2" x2="12" y2="10"></line>
          <polyline points="8 6 12 10 16 6"></polyline>
        </svg>
      )
    },
    {
      slug: 'form-ui-customization',
      title: 'Designing Beyond Default: SailPoint Form UI Customization',
      category: 'Architecture',
      date: 'June 2026',
      description: 'An ultimate guide to SailPoint ISC Form UI customization using custom HTML elements, advanced inline CSS layout structures, and dynamic serial loops.',
      iconBgClass: 'bg-cyan-500/10',
      iconBorderClass: 'border-cyan-500/20',
      iconColorClass: 'text-cyan-400',
      hoverTitleClass: 'group-hover:text-cyan-400',
      readMoreColorClass: 'text-cyan-500',
      gradientClass: 'from-cyan-600/20 to-teal-600/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="13" x2="15" y2="13"></line>
          <line x1="9" y1="17" x2="15" y2="17"></line>
        </svg>
      )
    }
  ];

  const filteredPosts = blogPosts
    .filter((post) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4 animate-fade-in-up">
              Insights & <span className="gradient-text">Engineering</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Deep dives into SailPoint architecture, performance optimizations, and uncompromised identity ecosystems.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 max-w-md animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative glass-card rounded-full border border-white/10 px-5 py-3.5 flex items-center gap-3 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search articles by title or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-slate-400 focus:outline-none w-full text-sm font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout of Cards */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <a 
                  key={post.slug}
                  href={`/blog/${post.slug}`} 
                  className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-all duration-300 animate-fade-in-up" 
                  style={{ textDecoration: 'none', animationDelay: `${(idx + 2) * 0.1}s` }}
                >
                  <div className={`rounded-xl ${post.iconBgClass} w-full h-48 flex items-center justify-center border ${post.iconBorderClass} mb-2 overflow-hidden relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradientClass}`} />
                    <div className={post.iconColorClass}>
                      {post.icon}
                    </div>
                  </div>
                  <div className={`flex items-center justify-between text-xs font-bold tracking-widest uppercase ${post.iconColorClass}`}>
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className={`text-2xl font-bold text-white ${post.hoverTitleClass} transition-colors`}>
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm flex-grow">
                    {post.description}
                  </p>
                  <div className={`mt-4 flex items-center ${post.readMoreColorClass} font-bold text-sm`}>
                    Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/10 border border-white/5 rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-slate-400 max-w-sm mx-auto">We couldn't find any blog posts matching "{searchQuery}". Try another search term!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
