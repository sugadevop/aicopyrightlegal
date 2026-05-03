// Dynamic sitemap for blog articles and cases (from D1)
// Supplements the static sitemap-0.xml from Astro

const API_BASE = 'https://api.aicopyrightlegal.com';

export async function onRequest(context) {
  let articles = [];
  let cases = [];

  try {
    const [articlesRes, casesRes] = await Promise.all([
      fetch(`${API_BASE}/api/articles/published`),
      fetch(`${API_BASE}/api/cases/public`),
    ]);
    articles = (await articlesRes.json()).articles || [];
    cases = (await casesRes.json()).cases || [];
  } catch (e) {
    // Fallback to empty
  }

  const urls = [];

  // Blog articles
  for (const article of articles) {
    urls.push({
      loc: `https://aicopyrightlegal.com/blog/${article.slug}`,
      lastmod: article.updated_at || article.published_at || article.created_at,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // Case detail pages
  for (const c of cases) {
    if (c.slug) {
      urls.push({
        loc: `https://aicopyrightlegal.com/cases/${c.slug}`,
        lastmod: c.last_update || c.updated_at || c.created_at,
        changefreq: 'weekly',
        priority: '0.7',
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod.substring(0, 10)}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
