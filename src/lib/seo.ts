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
      'Drop-in .report.ts modules bring multi-source account exports, unified certification campaign line-items, dynamic schema column pickers, and unlimited searchAfter identity reporting straight into the SailPoint ISC browser UI.',
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
      'Reclaim the speed of the classic IdentityIQ Debug page inside ISC with a 19-category object browser, interactive Transform and Connector Rule studios, source diagnostics, and pre-commit RFC 6902 diff reviews.',
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
      'Simulate complex role membership criteria in memory, preview exact gain/loss identity deltas, flag mass-deprovisioning risks, and trigger surgical single-role recalculations without running a global tenant refresh.',
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
      'Catch silent connector failures before users notice by continuously auditing eight core source operations, tracking real-time error rates against a 3% threshold, and auto-dispatching ITSM tickets with HTML health matrices.',
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
      'Prevent full-object PUT overwrites, partial-payload failures, and infinite retry locks in Web Services connectors using five battle-tested synchronization patterns and an automated PowerShell verification suite.',
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
      'Close the day-one onboarding gap by auditing newly connected sources for already-terminated identities, previewing lingering entitlements in an interactive form, and executing rate-limited bulk revocations.',
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
      'Eliminate the N+1 child endpoint bottleneck on Web Services sources by caching and inverting entitlement catalogs inside After-Operation Rule transientValues—cutting 22-minute aggregations down to 67 seconds.',
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
      'Replace blunt all-or-nothing lifecycle deprovisioning with targeted workflow filtering that strips entitlements only from flagged high-risk sources while leaving birthright and alumni accounts intact.',
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
      'Stop SSHing into Virtual Appliances to hunt down connector errors—stream, filter, and inspect cluster-wide ccg.log telemetry directly inside the SailPoint ISC interface on demand.',
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
      'Eliminate over-privileged sp:scopes:all tokens by parsing workflow JSON definitions against SailPoint OpenAPI specs to automatically calculate and apply exact least-privilege OAuth scopes.',
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
      'Decommission legacy connectors without orphaned dependencies by automating pre-flight impact analysis across roles, access profiles, and transforms before executing multi-threaded source deletion.',
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
      'Export, audit, bulk-edit, and restore CRON aggregation schedules across every account and entitlement source in your tenant from a single self-service launcher.',
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
      'Break free from rigid daily reminder spam by orchestrating dynamic, deadline-aware certification notification cadences that escalate urgency only as campaign close dates approach.',
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
      'Replace scattered Postman collections and ad-hoc PowerShell scripts with a single interactive ISC launcher for account resets, health-check toggles, and privileged administrative actions.',
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
      'Prevent off-by-one-hour hire and termination timestamps during Daylight Saving Time transitions with scheduled workflows that dynamically recalculate UTC offsets inside lookup transforms.',
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
      'Let non-admin role owners safely add or remove access profiles and entitlements on their own roles through guardrailed ISC forms—without granting global administrator privileges.',
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
      'Target identity refresh runs to a single modified role using paginated workflow loops and search queries, avoiding the performance hit of a tenant-wide Apply Changes operation.',
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
      'Bypass the 250-item workflow loop limit using recursive self-invoking workflows and state-passing accumulators to build and email multi-page CSV reports natively in ISC.',
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
      'Wrap fragile downstream HTTP calls and PowerShell actions in a reusable retry sub-workflow with configurable backoff intervals, error aggregation, and live status polling.',
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
      'Keep access reviews moving before audit deadlines hit by automatically detecting stalled reviewers and reassigning uncertified line-items up the management chain.',
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
      'Push SailPoint ISC forms past plain-text inputs by injecting sanitized HTML tables, inline CSS status cards, and workflow-generated dynamic summaries into form description fields.',
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
      'Pause aggregations, suppress false-positive failure alerts, and queue provisioning traffic during planned downstream application outages using a toggleable Maintenance Guard pattern.',
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
      'Point SailPoint back at itself with a loopback Web Services connector that aggregates Personal Access Tokens (PATs) and OAuth clients into access reviews and leaver revocation workflows.',
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
      'Work around native permission gaps by chaining interactive ISC forms and workflows so governance group owners can add or remove members without Helpdesk or Admin intervention.',
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
      'Reconstruct any user’s complete forensic history by merging lifecycle state shifts, access requests, provisioning transactions, and certification decisions into one chronological audit report.',
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
