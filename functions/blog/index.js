// Cloudflare Pages Function — Paginated blog listing
// Handles /blog?page=N with 10 articles per page
// This intercepts BEFORE the static /blog/index.html

const API_BASE = 'https://api.aicopyrightlegal.com';
const PER_PAGE = 10;

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  
  // If page=1 and no query params, serve static file (faster)
  if (page === 1 && !url.searchParams.has('page')) {
    return context.env.ASSETS.fetch(context.request);
  }

  // Fetch all published articles
  let articles = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles/published`);
    const data = await res.json();
    articles = data.articles || [];
  } catch (e) {
    return context.env.ASSETS.fetch(context.request);
  }

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * PER_PAGE;
  const pageArticles = articles.slice(offset, offset + PER_PAGE);

  const categoryColors = {
    'Court Ruling': 'bg-red-50 text-red-700',
    'Regulation': 'bg-purple-50 text-purple-700',
    'Settlement': 'bg-amber-50 text-amber-700',
    'Guide': 'bg-green-50 text-green-700',
  };

  const articlesHtml = pageArticles.map(article => {
    const colorClass = categoryColors[article.category] || 'bg-blue-50 text-blue-700';
    const date = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `
      <article style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;transition:box-shadow 0.2s;">
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <span style="padding:0.125rem 0.5rem;border-radius:4px;font-size:0.75rem;font-weight:600;" class="${colorClass}">${escHtml(article.category)}</span>
            <span style="font-size:0.75rem;color:#6b7280;">${date}</span>
            ${article.read_time ? `<span style="font-size:0.75rem;color:#6b7280;">· ${escHtml(article.read_time)} read</span>` : ''}
          </div>
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:700;color:#1e293b;margin:0.25rem 0;">
            <a href="/blog/${escHtml(article.slug)}" style="color:inherit;text-decoration:none;">${escHtml(article.title)}</a>
          </h2>
          <p style="font-size:0.875rem;color:#64748b;line-height:1.6;margin:0;">${escHtml(article.excerpt || '')}</p>
          <a href="/blog/${escHtml(article.slug)}" style="font-size:0.875rem;font-weight:600;color:#1e40af;text-decoration:none;margin-top:0.5rem;">Read →</a>
        </div>
      </article>
    `;
  }).join('');

  // Pagination controls
  const paginationHtml = totalPages > 1 ? `
    <nav aria-label="Pagination" style="display:flex;justify-content:center;align-items:center;gap:0.5rem;margin-top:2.5rem;font-family:'Inter',sans-serif;">
      ${currentPage > 1 ? `<a href="/blog?page=${currentPage - 1}" style="padding:0.5rem 1rem;border:1px solid #e2e8f0;border-radius:8px;font-size:0.875rem;font-weight:500;color:#1e40af;text-decoration:none;">← Previous</a>` : `<span style="padding:0.5rem 1rem;border:1px solid #f1f5f9;border-radius:8px;font-size:0.875rem;color:#cbd5e1;">← Previous</span>`}
      
      <span style="padding:0.5rem 1rem;font-size:0.875rem;color:#64748b;">
        Page ${currentPage} of ${totalPages}
      </span>
      
      ${currentPage < totalPages ? `<a href="/blog?page=${currentPage + 1}" style="padding:0.5rem 1rem;border:1px solid #e2e8f0;border-radius:8px;font-size:0.875rem;font-weight:500;color:#1e40af;text-decoration:none;">Next →</a>` : `<span style="padding:0.5rem 1rem;border:1px solid #f1f5f9;border-radius:8px;font-size:0.875rem;color:#cbd5e1;">Next →</span>`}
    </nav>
    <p style="text-align:center;font-size:0.75rem;color:#94a3b8;margin-top:0.75rem;">${totalArticles} articles total</p>
  ` : '';

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Copyright News — Page ${currentPage} | AI Copyright Legal</title>
  <meta name="description" content="Latest news, court rulings, and analysis on AI copyright law. Page ${currentPage} of ${totalPages}.">
  <link rel="canonical" href="https://aicopyrightlegal.com/blog${currentPage > 1 ? `?page=${currentPage}` : ''}">
  ${currentPage > 1 ? `<link rel="prev" href="https://aicopyrightlegal.com/blog${currentPage > 2 ? `?page=${currentPage - 1}` : ''}">` : ''}
  ${currentPage < totalPages ? `<link rel="next" href="https://aicopyrightlegal.com/blog?page=${currentPage + 1}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-K56QDLDYYY"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-K56QDLDYYY");</script>
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white text-text font-sans antialiased overflow-x-hidden">
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
    <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-heading font-bold text-xl text-primary">
        <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="currentColor"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-weight="bold">©</text></svg>
        <span>AI Copyright <span class="text-accent">Legal</span></span>
      </a>
      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
        <a href="/blog" class="hover:text-primary">News</a>
        <a href="/cases" class="hover:text-primary">Cases</a>
        <a href="/laws" class="hover:text-primary">Laws</a>
        <a href="/learn" class="hover:text-primary">Learn</a>
        <a href="/tools" class="hover:text-primary">Tools</a>
      </div>
    </nav>
  </header>

  <main>
    <section style="max-width:72rem;margin:0 auto;padding:3rem 1rem;">
      <div style="margin-bottom:2.5rem;">
        <h1 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(1.5rem,4vw,2.25rem);font-weight:800;color:#1e293b;margin:0 0 0.75rem;">AI Copyright News</h1>
        <p style="font-size:1.125rem;color:#64748b;">Latest rulings, regulations, and developments in AI copyright law.</p>
      </div>

      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        ${articlesHtml}
      </div>

      ${paginationHtml}
    </section>
  </main>

  <footer class="bg-surface-dark text-slate-400 mt-20">
    <div class="max-w-6xl mx-auto px-4 py-8 text-sm text-center">
      <p>&copy; ${new Date().getFullYear()} AI Copyright Legal. Not legal advice.</p>
      <div class="flex gap-4 justify-center mt-2 text-slate-500">
        <a href="/privacy" class="hover:text-white">Privacy</a>
        <a href="/terms" class="hover:text-white">Terms</a>
        <a href="/about" class="hover:text-white">About</a>
      </div>
    </div>
  </footer>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
