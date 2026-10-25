import type { Metadata } from 'next';

export const SITE_URL = 'https://identityexe.com';

export interface BlogPostSeoEntry {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  category: string;
  keywords: string[];
  ogImage?: string;
}

export const BLOG_POSTS_SEO: BlogPostSeoEntry[] = [
  {
    slug: 'ui-plugin-report-center',
    title: 'Modular Custom Reporting in ISC: The Report Center UI Plugin',
    description:
      'A repeatable architectural methodology designed by IdentityEXE to embed a modular .report.ts reporting engine, dynamic schema discovery, multi-source account exports, unified certification campaign line-items, and unlimited identity directory reporting directly inside the SailPoint ISC browser UI.',
    datePublished: '2026-10-25',
    category: 'Architecture',
    keywords: [
      'SailPoint UI Plugin',
      'SailPoint Custom Reports',
      'SailPoint Report Center',
      'Multi-Source Accounts Report SailPoint ISC',
      'Certification Campaign Status Export SailPoint',
      'Unlimited Identity Export searchAfter SailPoint',
      'SailPoint UI Plugin SDK',
      'SailPoint Identity Security Cloud',
    ],
    ogImage: '/images/blog/ui-plugin-report-center/opengraph-image.png',
  },
  {
    slug: 'ui-plugin-isc-debug-mode',
    title: 'Bringing the IIQ Debug Page to ISC: The Administrator Console UI Plugin',
    description:
      'A repeatable architectural methodology designed by IdentityEXE to unify 19 ISC object categories, Transform and Connector Rule studios, source diagnostics, SP-Config packaging, and pre-commit RFC 6902 diff reviews inside the SailPoint ISC browser UI.',
    datePublished: '2026-10-17',
    category: 'Architecture',
    keywords: [
      'SailPoint UI Plugin',
      'SailPoint ISC Debug Page',
      'IdentityIQ Debug Page in ISC',
      'SailPoint Administrator Console',
      'SailPoint Transform Studio',
      'SailPoint Connector Rule Studio',
      'SP-Config',
      'SailPoint Identity Security Cloud',
    ],
    ogImage: '/images/blog/ui-plugin-isc-debug-mode/opengraph-image.png',
  },
  {
    slug: 'ui-plugin-role-refresher',
    title: 'UI Plugin Role Refresher in Identity Security Cloud',
    description:
      'A repeatable architectural methodology designed by IdentityEXE to simulate complex role criteria trees client-side, preview live membership deltas, catch deprovisioning risks, and dispatch targeted identity recalculations via the SailPoint UI Plugin SDK.',
    datePublished: '2026-10-11',
    category: 'Architecture',
    keywords: [
      'SailPoint Role Refresher',
      'SailPoint UI Plugin SDK',
      'Role Criteria Simulator',
      'Single Role Refresh SailPoint ISC',
      'SailPoint Identity Security Cloud Roles',
      'Apply Changes Role SailPoint',
    ],
    ogImage: '/images/blog/ui-plugin-role-refresher/opengraph-image.png',
  },
  {
    slug: 'comprehensive-source-reporting',
    title: 'Comprehensive SailPoint Source Health Reporting & Automated Incident Alerting',
    description:
      'A repeatable architectural methodology designed by IdentityEXE to continuously audit tenant-wide source health across eight core operations, detect silent aggregation and provisioning failures, and dispatch automated ITSM incident alerts.',
    datePublished: '2026-10-03',
    category: 'Architecture',
    keywords: [
      'SailPoint Source Health Reporting',
      'SailPoint Aggregation Failure Alerting',
      'SailPoint Provisioning Monitoring',
      'SailPoint ISC Workflows',
      'SailPoint PowerShell SDK',
      'Identity Security Cloud Monitoring',
    ],
    ogImage: '/images/blog/comprehensive-source-reporting/opengraph-image.png',
  },
  {
    slug: 'webservices-attribute-sync',
    title: 'SailPoint Web Services Attribute Sync: Enterprise Architectural Framework',
    description:
      'A repeatable architectural methodology designed by IdentityEXE to master Web Services attribute synchronization in SailPoint ISC, overcoming partial update limitations, PUT data loss, and retry locks.',
    datePublished: '2026-09-27',
    category: 'Architecture',
    keywords: [
      'SailPoint Web Services Attribute Sync',
      'SailPoint Update Account PUT Overwrite',
      'SailPoint Attribute Sync Retry Lock',
      'Web Services Connector SailPoint ISC',
      'Update Provisioning Policy SailPoint',
      'Before Operation Rule SailPoint',
    ],
    ogImage: '/images/blog/webservices-attribute-sync/opengraph-image.png',
  },
  {
    slug: 'source-access-cleaner',
    title: 'Automating Source Access Cleanup in SailPoint Identity Security Cloud',
    description:
      'A repeatable architectural methodology designed by IdentityEXE to safely audit, preview, and remediate lingering access on newly onboarded sources, overcoming native lifecycle state deprovisioning limitations.',
    datePublished: '2026-09-20',
    category: 'Architecture',
    keywords: [
      'SailPoint Source Access Cleanup',
      'Terminated User Access Remediation SailPoint',
      'Lifecycle State Deprovisioning SailPoint ISC',
      'SailPoint Workflows Access Revocation',
      'Onboarded Source Cleanup SailPoint',
    ],
    ogImage: '/images/blog/source-access-cleaner/opengraph-image.png',
  },
  {
    slug: 'app-onboarding-transient-values',
    title: 'Optimizing SailPoint Web Services: The Transient Values Pattern',
    description:
      'A repeatable architectural methodology leveraging in-memory transientValues in After-Operation rules to eliminate the N+1 REST API request explosion and slash aggregation runtimes by over 90%.',
    datePublished: '2026-09-13',
    category: 'Architecture',
    keywords: [
      'SailPoint Web Services Connector',
      'transientValues SailPoint',
      'Web Services After Operation Rule',
      'SailPoint N+1 Endpoint Chaining',
      'Optimize Aggregation Performance SailPoint ISC',
    ],
    ogImage: '/images/blog/app-onboarding-transient-values/opengraph-image.png',
  },
  {
    slug: 'lcs-revoke-sources',
    title: 'Automating Per-Source Access Revocation in SailPoint ISC',
    description:
      'A repeatable architectural methodology utilizing SailPoint Workflows to intelligently filter and selectively revoke access only on specific sources during lifecycle state changes.',
    datePublished: '2026-09-06',
    category: 'Architecture',
    keywords: [
      'SailPoint Per-Source Access Revocation',
      'Lifecycle State Access Revocation SailPoint',
      'Selective Entitlement Removal SailPoint ISC',
      'SailPoint Workflows Provisioning',
    ],
  },
  {
    slug: 'ui-ccg-logs',
    title: 'Bringing Virtual Appliance CCG Logs Directly into SailPoint ISC',
    description:
      'Unite Windows Tasks and SailPoint Workflows to consolidate cluster Virtual Appliance CCG logs directly into Identity Security Cloud.',
    datePublished: '2026-08-20',
    category: 'Architecture',
    keywords: [
      'SailPoint CCG Logs',
      'Virtual Appliance Logs SailPoint ISC',
      'View CCG Logs in UI SailPoint',
      'SailPoint Connector Troubleshooting',
      'ccg.log SailPoint',
    ],
  },
  {
    slug: 'workflow-scope-analyzer',
    title: 'Automating Least Privilege: The Workflow Scope Analyzer Blueprint',
    description:
      'A repeatable architectural methodology designed to dynamically calculate and enforce precise HTTP endpoint scopes for SailPoint workflows.',
    datePublished: '2026-08-15',
    category: 'Architecture',
    keywords: [
      'SailPoint Workflow PAT Scopes',
      'Least Privilege Personal Access Token SailPoint',
      'SailPoint HTTP Action OAuth Scopes',
      'Workflow Scope Analyzer',
    ],
  },
  {
    slug: 'source-offboarding',
    title: 'Automating Source Offboarding in SailPoint Identity Security Cloud',
    description:
      'A repeatable architectural methodology utilizing a self-serve automated toolkit through SailPoint Workflows and Privileged Task Management to provide fail-safe source deletion.',
    datePublished: '2026-08-15',
    category: 'Architecture',
    keywords: [
      'SailPoint Source Offboarding',
      'Delete Source Dependencies SailPoint ISC',
      'Automated Source Removal SailPoint',
      'SailPoint Privileged Task Automation',
    ],
  },
  {
    slug: 'aggregation-exporter-importer',
    title: 'Automating Aggregation Schedules: Exporter & Importer for SailPoint ISC',
    description:
      'A comprehensive, self-serve toolkit utilizing SailPoint Workflows and PAG to give administrators granular, push-button control over their aggregation schedules tenant-wide.',
    datePublished: '2026-08-09',
    category: 'Architecture',
    keywords: [
      'SailPoint Aggregation Schedules',
      'Export Import Aggregation Schedule SailPoint ISC',
      'Bulk Disable Aggregations SailPoint',
      'SailPoint CRON Schedule Management',
    ],
  },
  {
    slug: 'certification-email-frequency',
    title: 'Architecting Dynamic Certification Email Frequencies in SailPoint',
    description:
      'A repeatable architectural methodology designed to give you complete control over escalation timing and notification routing, stopping manager approval fatigue in its tracks.',
    datePublished: '2026-08-01',
    category: 'Architecture',
    keywords: [
      'SailPoint Certification Reminder Emails',
      'Custom Certification Email Frequency SailPoint ISC',
      'Access Review Notification Workflows SailPoint',
    ],
  },
  {
    slug: 'admin-helper-form',
    title: 'Admin Helper Form: Centralized Command Center for SailPoint ISC',
    description:
      'Architectural methodology unifying interactive ISC forms with backend workflows and parallelized scripts for centralized administrative operations.',
    datePublished: '2026-07-25',
    category: 'Architecture',
    keywords: [
      'SailPoint Interactive Forms',
      'SailPoint Admin Helper Form',
      'Reset Source Accounts SailPoint ISC',
      'Centralized Operations SailPoint Workflows',
    ],
  },
  {
    slug: 'transform-timezone-management',
    title: 'Managing Timezone Transforms & Daylight Savings in SailPoint ISC',
    description:
      'A repeatable architectural blueprint to dynamically handle daylight savings offsets in SailPoint Identity Security Cloud using scheduled workflows.',
    datePublished: '2026-07-17',
    category: 'Architecture',
    keywords: [
      'SailPoint Timezone Transform',
      'Daylight Savings Transform SailPoint ISC',
      'ISO8601 Date Math Transform SailPoint',
      'Automated Lookup Table Update SailPoint',
    ],
  },
  {
    slug: 'delegated-role-management',
    title: 'Delegated Role Management in SailPoint Identity Security Cloud',
    description:
      'A modular implementation framework designed to empower business owners to securely manage their assigned roles without administrative bottlenecks.',
    datePublished: '2026-07-12',
    category: 'Architecture',
    keywords: [
      'Delegated Role Management SailPoint ISC',
      'Self-Service Role Entitlement Management SailPoint',
      'Role Owner Forms SailPoint Workflows',
    ],
  },
  {
    slug: 'paginated-role-refresher',
    title: 'Paginated Role Refresher in SailPoint Identity Security Cloud',
    description:
      'A modular implementation framework to intelligently refresh single roles without triggering global tenant updates.',
    datePublished: '2026-07-05',
    category: 'Architecture',
    keywords: [
      'Refresh Single Role SailPoint ISC',
      'Paginated Identity Refresh SailPoint Workflows',
      'Avoid Global Apply Changes SailPoint',
    ],
  },
  {
    slug: 'custom-reports-workflow-pagination',
    title: 'Custom Reports with Workflow Pagination in SailPoint ISC',
    description:
      'A modular architectural framework for building native paginated custom reports within Identity Security Cloud workflows.',
    datePublished: '2026-06-25',
    category: 'Architecture',
    keywords: [
      'SailPoint Workflow Pagination',
      'Recursive Loop Workflows SailPoint ISC',
      'Custom CSV Email Reports SailPoint',
      'Disabled Accounts with Access Report SailPoint',
    ],
  },
  {
    slug: 'dynamic-retry-workflows',
    title: 'Dynamic Retry Workflows in SailPoint Identity Security Cloud',
    description:
      'An architectural implementation framework to gracefully retry HTTP POSTs and PowerShell scripts to handle downstream dependency delays.',
    datePublished: '2026-06-20',
    category: 'Architecture',
    keywords: [
      'SailPoint Workflow Retry Pattern',
      'Retry HTTP Action SailPoint ISC',
      'PowerShell Error Handling SailPoint Workflows',
    ],
  },
  {
    slug: 'certification-escalation-workflow',
    title: 'Self-Service Certification Escalation Workflow in SailPoint ISC',
    description:
      'A custom workflows and interactive forms solution to automate overdue certification campaign escalations to reviewers\' managers.',
    datePublished: '2026-06-15',
    category: 'Architecture',
    keywords: [
      'SailPoint Certification Escalation',
      'Reassign Overdue Access Reviews SailPoint ISC',
      'Manager Certification Escalation Workflow SailPoint',
    ],
  },
  {
    slug: 'form-ui-customization',
    title: 'SailPoint Form UI Customization: Styling Beyond Default Layouts',
    description:
      'An ultimate guide to SailPoint ISC Form UI customization using custom HTML elements, advanced inline CSS layout structures, and dynamic serial loops.',
    datePublished: '2026-06-10',
    category: 'Architecture',
    keywords: [
      'SailPoint Form UI Customization',
      'Custom HTML CSS SailPoint Forms',
      'Dynamic Form Descriptions SailPoint ISC',
    ],
  },
  {
    slug: 'maintenance-mode-isc',
    title: 'Bringing IdentityIQ Maintenance Mode to SailPoint ISC',
    description:
      'A custom workflow forms solution to gracefully handle SailPoint source downtime using the Maintenance Guard pattern.',
    datePublished: '2026-05-28',
    category: 'Architecture',
    keywords: [
      'SailPoint ISC Maintenance Mode',
      'IdentityIQ Maintenance Mode in ISC',
      'Pause Provisioning Source Downtime SailPoint',
    ],
  },
  {
    slug: 'recursive-governance',
    title: 'Implementing Recursive Governance: Managing SailPoint PATs',
    description:
      'Learn how to govern SailPoint ISC Personal Access Tokens (PATs) using a custom Web Services Connector to regain visibility and control.',
    datePublished: '2026-05-20',
    category: 'Architecture',
    keywords: [
      'Govern SailPoint Personal Access Tokens',
      'Recursive Governance SailPoint ISC',
      'PAT Certification Web Services Connector SailPoint',
    ],
  },
  {
    slug: 'delegated-governance-groups',
    title: 'Self-Service Governance Group Management in SailPoint ISC',
    description:
      'Securely delegate governance group administration to group owners using a multi-form pipeline workaround in SailPoint ISC.',
    datePublished: '2026-05-15',
    category: 'Architecture',
    keywords: [
      'SailPoint Governance Group Management',
      'Delegate Workgroup Administration SailPoint ISC',
      'Self-Service Governance Groups SailPoint Forms',
    ],
  },
  {
    slug: 'identity-timeline-report',
    title: 'Building a Custom Identity Timeline Report in SailPoint ISC',
    description:
      'Consolidate identity lifecycle events, audit trails, provisioning activities, access requests, and manual work items into a single chronological timeline.',
    datePublished: '2026-05-10',
    category: 'Architecture',
    keywords: [
      'SailPoint Identity Audit Timeline Report',
      'Chronological Identity Events SailPoint ISC',
      'Custom Identity History Report SailPoint',
    ],
  },
];

export function getBlogPostSeo(slug: string): BlogPostSeoEntry | undefined {
  return BLOG_POSTS_SEO.find((p) => p.slug === slug);
}

export function getBlogPostJsonLd(slug: string) {
  const post = getBlogPostSeo(slug);
  if (!post) return null;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.ogImage
    ? `${SITE_URL}${post.ogImage}`
    : `${SITE_URL}/blog/${post.slug}/opengraph-image`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      headline: post.title,
      description: post.description,
      image: [imageUrl],
      datePublished: `${post.datePublished}T08:00:00+00:00`,
      dateModified: `${post.datePublished}T08:00:00+00:00`,
      articleSection: post.category,
      keywords: post.keywords.join(', '),
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: 'Tyler',
        jobTitle: 'Founder & SailPoint Expert Ambassador',
        url: SITE_URL,
        sameAs: ['https://www.linkedin.com/company/identityexe/'],
      },
      publisher: {
        '@type': 'Organization',
        name: 'IdentityEXE',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.svg`,
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${SITE_URL}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: url,
        },
      ],
    },
  ];
}

export function getRootJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE_URL}/#organization`,
      name: 'IdentityEXE',
      legalName: 'IdentityEXE LLC',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      email: 'tyler@identityexe.com',
      description:
        'Premier SailPoint Identity Security Cloud implementation and architecture consultancy specializing in complex workflows, forms, UI plugins, Web Services connectors, and IdentityIQ to ISC migrations.',
      sameAs: ['https://www.linkedin.com/company/identityexe/'],
      founder: {
        '@type': 'Person',
        '@id': `${SITE_URL}/#founder`,
        name: 'Tyler',
        jobTitle: 'Founder & SailPoint Expert Ambassador',
        url: SITE_URL,
      },
      knowsAbout: [
        'SailPoint Identity Security Cloud',
        'SailPoint IdentityIQ',
        'IIQ to ISC Migrations',
        'SailPoint Workflows & Forms',
        'SailPoint UI Plugins',
        'Web Services Connectors',
        'Identity Governance and Administration',
        'Zero Trust Architecture',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'IdentityEXE',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      inLanguage: 'en-US',
    },
  ];
}

export function getBlogCollectionJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/blog#collection`,
      url: `${SITE_URL}/blog`,
      name: 'SailPoint Engineering Insights & Architecture Blueprints | IdentityEXE',
      description:
        'Deep architectural breakdowns, custom workflow templates, and Identity Security Cloud implementations written by a SailPoint Expert Ambassador.',
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: BLOG_POSTS_SEO.length,
        itemListElement: BLOG_POSTS_SEO.map((post, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${SITE_URL}/blog/${post.slug}`,
          name: post.title,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${SITE_URL}/blog`,
        },
      ],
    },
  ];
}

export function getWorkflowScopeAnalyzerJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Workflow Scope Analyzer',
      url: `${SITE_URL}/tools/workflow-scope-analyzer`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      description:
        'Free client-side SailPoint ISC developer utility: upload your workflow JSON to instantly calculate the exact least-privilege Personal Access Token (PAT) HTTP API scopes required.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${SITE_URL}/tools`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Workflow Scope Analyzer',
          item: `${SITE_URL}/tools/workflow-scope-analyzer`,
        },
      ],
    },
  ];
}
