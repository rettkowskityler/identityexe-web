import { MetadataRoute } from 'next';
import { BLOG_POSTS_SEO, SITE_URL } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPostDate = new Date(BLOG_POSTS_SEO[0].datePublished);

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS_SEO.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.datePublished),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date('2026-08-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/workflow-scope-analyzer`,
      lastModified: new Date('2026-08-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date('2026-05-10'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
