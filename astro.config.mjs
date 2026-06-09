// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://aicopyrightlegal.com',
  output: 'static',
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    // Old bare-path articles → new /blog/ articles (11 URLs that were 404)
    '/ai-copyright-compliance-guide': '/blog/ai-copyright-compliance-guide',
    '/sora-2-voice-cloning-copyright-issues': '/blog/sora-2-voice-cloning-copyright-issues',
    '/can-you-copyright-ai-generated-content': '/blog/can-you-copyright-ai-generated-content',
    '/protect-content-from-ai-scraping': '/blog/protect-content-from-ai-scraping',
    '/ai-training-fair-use-law-2026': '/blog/ai-training-fair-use-law-2026',
    '/ai-art-copyright-2026-guide': '/blog/ai-art-copyright-2026-guide',
    '/copyright-office-part-3': '/blog/copyright-office-part-3',
    '/anthropic-settlement-authors': '/blog/anthropic-settlement-authors',
    '/supreme-court-denies-ai-copyright-challenge': '/blog/supreme-court-denies-ai-copyright-challenge',
    '/oscars-ban-ai-generated-performances-2027': '/blog/oscars-ban-ai-generated-performances-2027',
    '/publishers-sue-meta-copyright-ai': '/blog/publishers-sue-meta-copyright-ai',
    // Non-existent tool/law pages → closest relevant page
    '/newsletter': '/blog',
    '/tools/copyright-eligibility-checker': '/tools/ai-copyright-checker',
    '/tools/generation-liability': '/tools/ai-copyright-checker',
    '/tools/opt-out-guide': '/tools/robots-txt-ai-blocker',
    '/laws/usco-ai-guidance-2023': '/laws/united-states',
    // Deleted duplicate articles → canonical versions (June 9, 2026 cleanup)
    '/blog/sora-2-voice-cloning-copyright-issues-new': '/blog/sora-2-voice-cloning-copyright-issues',
    '/blog/ai-copyright-compliance-business-2026': '/blog/ai-copyright-compliance-guide',
    '/blog/ai-art-copyright-2026-guide': '/blog/can-you-copyright-ai-generated-content',
  },
});
