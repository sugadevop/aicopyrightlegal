// Sitemap index that combines static + dynamic sitemaps
export async function onRequest(context) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://aicopyrightlegal.com/sitemap-0.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://aicopyrightlegal.com/sitemap-dynamic.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
