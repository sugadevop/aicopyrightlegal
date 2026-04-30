// Cloudflare Pages Function — Dynamic blog article rendering
// Handles /blog/[slug] at the edge, no rebuild needed

const API_BASE = 'https://api.aicopyrightlegal.com';

export async function onRequest(context) {
  const slug = context.params.slug;
  
  // Fetch article from D1 via Workers API
  let article;
  try {
    const res = await fetch(`${API_BASE}/api/articles/slug/${slug}`);
    if (!res.ok) return notFound(context);
    const data = await res.json();
    article = data.article;
  } catch (e) {
    return notFound(context);
  }

  if (!article) return notFound(context);

  // Simple markdown to HTML (basic conversion for edge)
  const htmlContent = markdownToHtml(article.content || '');
  const displayDate = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const updatedDate = new Date(article.updated_at || article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const categoryColors = {
    'Court Ruling': 'acl-category--court-ruling',
    'Regulation': 'acl-category--regulation',
    'Settlement': 'acl-category--settlement',
    'Guide': 'acl-category--guide',
  };

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(article.seo_title || article.title)} | AI Copyright Legal</title>
  <meta name="description" content="${escHtml(article.seo_description || article.excerpt || '')}">
  <link rel="canonical" href="https://aicopyrightlegal.com/blog/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escHtml(article.title)}">
  <meta property="og:description" content="${escHtml(article.excerpt || '')}">
  <meta property="og:url" content="https://aicopyrightlegal.com/blog/${slug}">
  <meta property="og:site_name" content="AI Copyright Legal">
  ${article.published_at ? `<meta property="article:published_time" content="${article.published_at}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "publisher": { "@type": "Organization", "name": "AI Copyright Legal" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://aicopyrightlegal.com/blog/${slug}` }
  })}</script>
</head>
<body class="bg-white text-text font-sans antialiased overflow-x-hidden">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
    <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-heading font-bold text-xl text-primary">
        <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="currentColor"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-weight="bold">©</text></svg>
        <span>AI Copyright <span class="text-accent">Legal</span></span>
      </a>
      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
        <a href="/blog" class="hover:text-primary transition-colors">News</a>
        <a href="/cases" class="hover:text-primary transition-colors">Cases</a>
        <a href="/laws" class="hover:text-primary transition-colors">Laws</a>
        <a href="/learn" class="hover:text-primary transition-colors">Learn</a>
        <a href="/tools" class="hover:text-primary transition-colors">Tools</a>
      </div>
    </nav>
  </header>

  <main>
    <article class="acl-article">
      <header class="acl-article-header">
        <div class="acl-container">
          <nav aria-label="Breadcrumb" class="acl-breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span>
            <a href="/blog">Blog</a><span aria-hidden="true">/</span>
            <span aria-current="page">${escHtml(article.title)}</span>
          </nav>
          <div class="acl-meta">
            <span class="acl-category ${categoryColors[article.category] || ''}">${escHtml(article.category || 'News')}</span>
            <time datetime="${article.published_at || ''}">${displayDate}</time>
            ${article.read_time ? `<span class="acl-read-time">${escHtml(article.read_time)} read</span>` : ''}
          </div>
          <h1 class="acl-title">${escHtml(article.title)}</h1>
          ${article.excerpt ? `<p class="acl-excerpt">${escHtml(article.excerpt)}</p>` : ''}
        </div>
      </header>

      ${article.featured_image ? `<figure class="acl-featured-image"><img src="${escHtml(article.featured_image)}" alt="${escHtml(article.title)}" loading="eager"></figure>` : ''}

      <div class="acl-container">
        <div class="acl-content">${htmlContent}</div>
      </div>

      <footer class="acl-container acl-article-footer">
        <div class="acl-disclaimer">
          <p><strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute legal advice.</p>
        </div>
        <div class="acl-nav-footer">
          <a href="/blog">← All Articles</a>
          <span class="acl-updated">Updated ${updatedDate}</span>
        </div>
        <div class="acl-newsletter-cta">
          <h2>Stay Updated on AI Copyright Law</h2>
          <p>Weekly analysis of new rulings, regulations, and practical guidance.</p>
          <form><label for="email-cta" class="sr-only">Email</label><input id="email-cta" type="email" placeholder="your@email.com" required><button type="submit">Subscribe</button></form>
        </div>
      </footer>
    </article>
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
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
}

function notFound(context) {
  return context.env.ASSETS.fetch(new URL('/404.html', context.request.url));
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function markdownToHtml(md) {
  let html = md;
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h2>$1</h2>');
  // Bold & italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Blockquotes
  html = html.replace(/^> (.*$)/gm, '<blockquote><p>$1</p></blockquote>');
  // Unordered lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Paragraphs
  html = html.replace(/^(?!<[hupblo]|<\/|<li|<hr)(.*\S.*)$/gm, '<p>$1</p>');
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}
