// Fetch content from Workers API at build time
const API_BASE = 'https://api.aicopyrightlegal.com';

export async function getPublishedArticles() {
  try {
    const res = await fetch(`${API_BASE}/api/articles/published`);
    const data = await res.json();
    return data.articles || [];
  } catch (e) {
    console.warn('Failed to fetch articles from API, using fallback:', e.message);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/articles/slug/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.article || null;
  } catch (e) {
    console.warn(`Failed to fetch article ${slug}:`, e.message);
    return null;
  }
}

export async function getPublicCases() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/public`);
    const data = await res.json();
    return data.cases || [];
  } catch (e) {
    console.warn('Failed to fetch cases from API:', e.message);
    return [];
  }
}
