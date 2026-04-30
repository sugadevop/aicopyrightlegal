// Cloudflare Pages Function — Dynamic case detail page
// Handles /cases/[slug] at the edge

const API_BASE = 'https://api.aicopyrightlegal.com';

export async function onRequest(context) {
  const slug = context.params.slug;

  // Fetch case from D1 via direct API
  let caseData;
  try {
    // Use the Workers API - add a public endpoint for cases by slug
    const res = await fetch(`${API_BASE}/api/cases/public`);
    if (!res.ok) return notFound(context);
    const data = await res.json();
    caseData = (data.cases || []).find(c => c.slug === slug);
  } catch (e) {
    return notFound(context);
  }

  if (!caseData || !caseData.detail_content) return notFound(context);

  const htmlContent = markdownToHtml(caseData.detail_content);
  const displayDate = caseData.last_update ? new Date(caseData.last_update).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

  const statusColors = {
    active: { bg: '#ecfdf5', color: '#047857', label: 'Active' },
    closed: { bg: '#f1f5f9', color: '#475569', label: 'Closed' },
    settlement: { bg: '#fffbeb', color: '#b45309', label: 'Settlement' },
    decided: { bg: '#eff6ff', color: '#1d4ed8', label: 'Decided' },
    partial: { bg: '#f5f3ff', color: '#7c3aed', label: 'Partial Ruling' },
  };
  const statusStyle = statusColors[caseData.status] || statusColors.active;

  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(caseData.name)} — AI Copyright Case Tracker | AI Copyright Legal</title>
  <meta name="description" content="${escHtml(caseData.summary || '')}. Track this AI copyright case: parties, timeline, legal issues, and current status.">
  <link rel="canonical" href="https://aicopyrightlegal.com/cases/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escHtml(caseData.name)} — AI Copyright Case">
  <meta property="og:description" content="${escHtml(caseData.summary || '')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-D84Y8W74XV"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-D84Y8W74XV");</script>
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
    <article class="acl-article">
      <header class="acl-article-header">
        <div class="acl-container">
          <nav aria-label="Breadcrumb" class="acl-breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span>
            <a href="/cases">Cases</a><span aria-hidden="true">/</span>
            <span aria-current="page">${escHtml(caseData.name)}</span>
          </nav>

          <!-- Case Status Badge -->
          <div class="acl-meta">
            <span style="background:${statusStyle.bg};color:${statusStyle.color};padding:0.2rem 0.6rem;border-radius:3px;font-weight:600;font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.03em;">
              ${escHtml(caseData.status_label || caseData.status)}
            </span>
            <span>Filed ${escHtml(caseData.filed || 'N/A')}</span>
            <span class="acl-read-time">Updated ${displayDate}</span>
          </div>

          <h1 class="acl-title">${escHtml(caseData.name)}</h1>
          <p class="acl-excerpt">${escHtml(caseData.summary || '')}</p>
        </div>
      </header>

      <!-- Case Info Box -->
      <div class="acl-container" style="margin-bottom:2rem;">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:1.25rem;font-family:'Inter',sans-serif;font-size:0.875rem;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
            <div><strong style="color:#374151;">Parties:</strong><br><span style="color:#6b7280;">${escHtml(caseData.parties || '')}</span></div>
            <div><strong style="color:#374151;">Court:</strong><br><span style="color:#6b7280;">${escHtml(caseData.court || 'N/A')}</span></div>
            <div><strong style="color:#374151;">Claims:</strong><br><span style="color:#6b7280;">${escHtml((caseData.claims || '').substring(0, 100))}${(caseData.claims || '').length > 100 ? '...' : ''}</span></div>
            <div><strong style="color:#374151;">Damages:</strong><br><span style="color:#6b7280;">${escHtml(caseData.damages || 'N/A')}</span></div>
          </div>
        </div>
      </div>

      <!-- Detail Content -->
      <div class="acl-container">
        <div class="acl-content">${htmlContent}</div>
      </div>

      <footer class="acl-container acl-article-footer">
        <div class="acl-disclaimer">
          <p><strong>Disclaimer:</strong> This case summary is for informational purposes only. It may not reflect the most recent developments. Consult official court records for authoritative information.</p>
        </div>
        <div class="acl-nav-footer">
          <a href="/cases">← All Cases</a>
          <span class="acl-updated">Updated ${displayDate}</span>
        </div>
        <div class="acl-newsletter-cta">
          <h2>Get Case Updates</h2>
          <p>We'll notify you when major rulings drop in this case.</p>
          <form><label for="email-cta" class="sr-only">Email</label><input id="email-cta" type="email" placeholder="your@email.com" required><button type="submit">Notify Me</button></form>
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
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^> (.*$)/gm, '<blockquote><p>$1</p></blockquote>');
  // Tables
  html = html.replace(/\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(Boolean);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(Boolean));
    let table = '<table><thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    rows.forEach(row => { table += '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>'; });
    table += '</tbody></table>';
    return table;
  });
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^(?!<[hupblo]|<\/|<li|<hr|<table|<thead|<tbody|<tr)(.*\S.*)$/gm, '<p>$1</p>');
  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}
