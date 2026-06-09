const fs = require('fs');
const path = require('path');

const contentPath = path.join(process.env.HOME, 'projects/aicopyrightlegal/research/_temp_article_draft.md');
const content = fs.readFileSync(contentPath, 'utf8');

const sql = `INSERT INTO articles (title, slug, excerpt, content, category, status, seo_title, seo_description, tags, read_time, featured_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const payload = {
  sql: sql,
  params: [
    "How to Protect Your Content From AI Scraping in 2026 (Technical & Legal Guide)",
    "protect-content-from-ai-scraping-2026",
    "A comprehensive guide on how to protect your website content from being scraped by AI bots in 2026, covering technical methods and legal considerations.",
    content,
    "Guides",
    "draft",
    "How to Protect Content From AI Scraping (2026 Guide)",
    "Learn how to block AI scrapers from stealing your content in 2026. Discover technical methods like robots.txt and WAFs, plus crucial legal Terms of Service updates.",
    "protect content from ai scraping, how to block ai scrapers, prevent ai training on my website, ai scraping vs web scraping legal",
    "8 min",
    ""
  ]
};

const outputPath = path.join(process.env.HOME, 'projects/aicopyrightlegal/research/_temp_article_d1.json');
fs.writeFileSync(outputPath, JSON.stringify(payload));
