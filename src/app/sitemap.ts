import { MetadataRoute } from 'next';

const BASE_URL = 'https://identityexe.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = [
    { slug: 'lcs-revoke-sources', date: '2026-09-06' },
    { slug: 'ui-ccg-logs', date: '2026-08-20' },
    { slug: 'workflow-scope-analyzer', date: '2026-08-15' },
    { slug: 'source-offboarding', date: '2026-08-15' },
    { slug: 'aggregation-exporter-importer', date: '2026-08-09' },
    { slug: 'certification-email-frequency', date: '2026-08-01' },
    { slug: 'admin-helper-form', date: '2026-07-25' },
    { slug: 'transform-timezone-management', date: '2026-07-17' },
    { slug: 'delegated-role-management', date: '2026-07-12' },
    { slug: 'paginated-role-refresher', date: '2026-07-05' },
    { slug: 'custom-reports-workflow-pagination', date: '2026-06-25' },
    { slug: 'dynamic-retry-workflows', date: '2026-06-20' },
    { slug: 'certification-escalation-workflow', date: '2026-06-15' },
    { slug: 'form-ui-customization', date: '2026-06-10' },
    { slug: 'maintenance-mode-isc', date: '2026-05-28' },
    { slug: 'recursive-governance', date: '2026-05-20' },
    { slug: 'delegated-governance-groups', date: '2026-05-15' },
    { slug: 'identity-timeline-report', date: '2026-05-10' },
  ];

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools/workflow-scope-analyzer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
