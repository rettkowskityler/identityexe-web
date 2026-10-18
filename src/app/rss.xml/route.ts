import { BLOG_POSTS_SEO, SITE_URL } from '../../lib/seo';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const latestDate = new Date(`${BLOG_POSTS_SEO[0].datePublished}T08:00:00Z`).toUTCString();

  const itemsXml = BLOG_POSTS_SEO.map((post) => {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const pubDate = new Date(`${post.datePublished}T08:00:00Z`).toUTCString();
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
      <author>tyler@identityexe.com (Tyler)</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IdentityEXE | SailPoint Engineering Insights &amp; Architecture Blueprints</title>
    <link>${SITE_URL}/blog</link>
    <description>Deep architectural breakdowns, custom workflow templates, and Identity Security Cloud implementations written by a SailPoint Expert Ambassador.</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
