// Google News Sitemap — only articles from last 2 days
// Required format for Google News indexing

const API_BASE = 'https://api.aicopyrightlegal.com';

export async function onRequest(context) {
  let articles = [];

  try {
    const res = await fetch(`${API_BASE}/api/articles/published`);
    const data = await res.json();
    articles = data.articles || [];
  } catch (e) {
    // Fallback to empty
  }

  // Only include articles from last 2 days (Google News requirement)
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const recentArticles = articles.filter(a => {
    const pubDate = new Date(a.published_at || a.created_at);
    return pubDate >= twoDaysAgo;
  });

  const urls = recentArticles.map(article => {
    const pubDate = (article.published_at || article.created_at || '').substring(0, 10);
    return `  <url>
    <loc>https://aicopyrightlegal.com/blog/${escXml(article.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>AI Copyright Legal</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escXml(article.title)}</news:title>
    </news:news>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=900',
    },
  });
}

function escXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
