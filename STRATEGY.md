# aicopyrightlegal.com — Content Strategy v2 (June 2026)

## Status as of June 9, 2026

| Metric | Value |
|---|---|
| Articles | 54 (cleaned from 57) |
| Hero images | 100% WebP |
| GA property | 535465969 |
| GSC | ✅ Service account (seobot@ailegalcopy) |
| GA4 | ✅ Service account |
| Monitoring | Daily + Weekly cron (opencode primary) |

## Content Strategy

### Velocity
- **Max 3 articles/week** (Mon/Wed/Fri via SEO Writer cron)
- **Max 2 news/week** (Mon/Thu via News Scanner, only if MAJOR)
- Down from 14/week → 5/week theoretical max

### Content Mix (target)
- **50% Guides** — how-to, templates, checklists, compliance frameworks
- **30% Analysis** — deep dives, case law analysis, comparative law
- **20% News** — only major lawsuits, rulings, regulations

### Quality Requirements
- Minimum 2000 words
- At least 3 internal links to existing articles
- Cite specific cases, ruling names, dates
- No duplicates (check D1 before writing)
- WebP hero image (optional if 9Router unavailable)

## Content Clusters (to build)

### Pillar: "AI Copyright Law 2026: The Complete Guide"
Clusters: all 54 articles organized by topic
- Copyright basics (6 articles)
- Fair use & training data (8 articles)  
- Registration & authorship (5 articles)
- Lawsuits & cases (12 articles)
- Industry-specific (music, film, code) (8 articles)
- Compliance & business (5 articles)
- International laws (4 articles)
- Tools & practical guides (6 articles)

## Technical Stack
- Static: Astro v6 → CF Pages
- API: CF Worker → D1 + R2
- Images: R2 bucket (images.aicopyrightlegal.com) → WebP via cwebp
- Domain: aicopyrightlegal.com (CF managed)
- Monitoring: GSC + GA4 via service account (no OAuth refresh needed)

## Cron Jobs
| Job | Schedule | Model |
|---|---|---|
| SEO Writer | Mon/Wed/Fri 6AM WIB | opencode-go/deepseek-v4-pro |
| News Scanner | Mon/Thu 8AM WIB | opencode-go/deepseek-v4-pro |
| Daily Monitor | Daily 8:30AM WIB | opencode-go/deepseek-v4-pro |
| Weekly SEO Report | Monday 10AM WIB | opencode-go/deepseek-v4-pro |
| Editor Sweep | Monday 9AM WIB | opencode-go/deepseek-v4-pro |
| Monthly Report | 1st 12PM WIB | opencode-go/deepseek-v4-pro |

## Key Decisions (June 9, 2026)
1. Deleted 3 duplicate articles (Sora 2, AI Compliance, AI Art)
2. 301 redirects in place via CF Pages _redirects
3. Slowed content velocity 65%
4. Switched all crons to opencode primary (GEPETE fallback)
5. Image generation made optional in writer/scanner
6. SearXNG JSON format enabled for indexing checks
7. Service account replaces OAuth for GSC/GA4 (no 7-day expiry)
