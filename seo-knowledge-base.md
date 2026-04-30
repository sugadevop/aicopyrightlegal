# SEO Knowledge Base — Google Search Central (2026)

## 1. SPAM POLICIES (DO NOT VIOLATE)

Google detects spam through automated systems and human reviews, which can result in manual actions (ranking lower or removal from results).

*   **Cloaking:** Presenting different content to users and search engines (e.g., showing a travel page to search engines but discount drugs to users). Paywalls are not cloaking if Google can see the full content and Flexible Sampling is used.
*   **Doorway abuse:** Creating multiple sites/pages for similar queries that funnel users to a less useful intermediate page.
*   **Expired domain abuse:** Buying expired domains and repurposing them to host low-value content (e.g., casino content on a former school site) to manipulate rankings.
*   **Hacked content:** Code, page, or content injection, or malicious redirects placed due to security vulnerabilities.
*   **Hidden text and links:** Placing content solely for search engines, like white text on a white background or hiding text behind images. (Accordion/tabbed content is fine).
*   **Keyword stuffing:** Unnatural lists or groups of keywords, like repeating phrases unnaturally.
*   **Link spam:** Buying/selling links for ranking, excessive link exchanges, automated link creation, or requiring links in Terms of Service without allowing qualification (nofollow/sponsored).
*   **Machine-generated traffic:** Automated queries to Google, like scraping for rank-checking.
*   **Malicious practices:** Malware, unwanted software, or back button hijacking.
*   **Misleading functionality:** Fake generators or services that trick users.
*   **Scaled content abuse:** Generating many pages (via AI, scraping, or stitching) primarily to manipulate rankings without adding value for users.
*   **Scraping:** Republishing content without adding value or citing the source.
*   **Site reputation abuse:** Publishing third-party content on a host site mainly to capitalize on the host's ranking signals (e.g., a medical site hosting casino ads).
*   **Sneaky redirects:** Maliciously redirecting users to different content than what was shown to search engines.
*   **Thin affiliation:** Publishing affiliate links with product descriptions copied directly from the merchant without added value.

## 2. HELPFUL CONTENT GUIDELINES

Google rewards content that provides a good page experience and is created primarily for people.

*   **Self-Assessment:**
    *   Does it provide original information, reporting, research, or analysis?
    *   Does it provide a substantial, complete description of the topic?
    *   Does it provide insightful analysis beyond the obvious?
    *   If drawing on other sources, does it avoid simply copying and instead provide substantial additional value?
    *   Is the heading/title descriptive and not exaggerated or shocking?
    *   Is it the sort of page you'd bookmark or share?
*   **E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):** Trust is the most important factor. Google gives more weight to E-E-A-T for YMYL (Your Money or Your Life) topics.
*   **Who, How, and Why:**
    *   **Who:** Is it clear who authored the content? (Use bylines).
    *   **How:** How was the content produced? (e.g., sharing testing methodology for product reviews).
    *   **Why:** Was it created primarily to help people? (This is the most important question).
*   **Avoid Search Engine-First Content:** Do not produce lots of content on many topics just to get search traffic, use extensive automation without adding value, or write to a particular word count.

## 3. AI CONTENT GUIDELINES

Google's focus is on the *quality* of content, rather than *how* it is produced.

*   **Appropriate Use:** Using AI to generate helpful, original content is not against guidelines.
*   **Spam Violation:** Using AI to generate content with the *primary purpose of manipulating ranking* is a violation of the spam policies (Scaled content abuse).
*   **Disclosures:** AI or automation disclosures are useful when users might ask "How was this created?".
*   **Authorship:** Giving AI an author byline is not recommended. Make it clear to readers when AI is part of the creation process.

## 4. ON-PAGE SEO FUNDAMENTALS

*   **Title Links:** Provide descriptive and concise text in the `<title>` element. Avoid keyword stuffing and boilerplate text. Brand titles concisely (e.g., adding the site name at the end). Make sure the main title is clear (e.g., using a prominent `<h1>`).
*   **Snippets (Meta Descriptions):** Write unique, descriptive meta descriptions for each page. Include relevant information (e.g., author, price). Avoid long strings of keywords.
*   **Content Organization:** Write naturally, break up long content into paragraphs, and use headings.
*   **Links:** Write good link text (anchor text) that tells users and Google what the linked page is about. Use `nofollow` or `sponsored` attributes for untrusted links or user-generated content.
*   **Images:** Use high-quality images near relevant text. Use descriptive `alt` text. Use standard HTML `<img>` elements (Google doesn't index CSS images). Use supported formats (BMP, GIF, JPEG, PNG, WebP, SVG, AVIF).

## 5. TECHNICAL SEO

*   **Crawling & Indexing:** Google uses crawlers (like Googlebot) to discover URLs and render pages (including executing JavaScript).
*   **Robots.txt:** Use `robots.txt` to manage crawl traffic, not to keep pages out of Google (use `noindex` for that).
*   **Robots Meta Tags:** Use `<meta name="robots" content="noindex">` to block indexing. Other rules include `nofollow`, `nosnippet`, `max-snippet`, `max-image-preview`, and `max-video-preview`. You can use `data-nosnippet` on HTML elements to prevent specific text from being used in snippets.
*   **Canonicalization:** When you have duplicate content, specify the preferred (canonical) URL using:
    *   Redirects (strongest signal)
    *   `rel="canonical"` link element or HTTP header
    *   Sitemaps (weakest signal)
    Google prefers HTTPS over HTTP.
*   **URL Structure:** Use descriptive URLs with readable words, hyphens (`-`) instead of underscores, and lowercase letters. Avoid deep nesting and irrelevant parameters.
*   **Sitemaps:** Useful for large sites, new sites, or sites with rich media. Submit sitemaps to help Google discover pages.

## 6. STRUCTURED DATA

Structured data (schema markup) helps Google understand page content and enables rich results. JSON-LD is the recommended format.

*   **Article (Article, NewsArticle, BlogPosting):** Helps Google understand the article, author, and date. Recommended properties: `author` (Person or Organization, with `name` and `url`), `dateModified`, `datePublished`, `headline`, and `image` (provide multiple high-res images in 16x9, 4x3, and 1x1 ratios).
*   **Breadcrumb (BreadcrumbList):** Indicates the page's position in the site hierarchy. Requires `itemListElement` (an array of `ListItem`s), with each `ListItem` requiring an `item` (URL), `name`, and `position`.
*   **FAQ (FAQPage):** For pages with a list of questions and answers. The site must be well-known, authoritative, and government/health-focused. Do not use for forums where users submit answers. Requires `mainEntity` (an array of `Question`s), with each `Question` having an `acceptedAnswer` (`Answer` with `text`) and `name` (the question).
*   **Site Names (WebSite):** Add to the home page to indicate the site name preference. Requires `name` and `url`. Can include `alternateName`.

## 7. CONTENT QUALITY CHECKLIST

*   [ ] Is the content created primarily for people?
*   [ ] Does it provide substantial, original value beyond what's already on the web?
*   [ ] Is it clear who authored the content (e.g., clear bylines)?
*   [ ] If AI was used, is it disclosed appropriately?
*   [ ] Does the page have a unique, descriptive `<title>`?
*   [ ] Does the page have a relevant meta description summarizing the content?
*   [ ] Is the content well-organized with clear headings (`<h1>`, `<h2>`, etc.)?
*   [ ] Are links descriptive (no "click here")?
*   [ ] Do images have descriptive `alt` text?
*   [ ] Is the URL structure simple and readable?
*   [ ] Is appropriate structured data (e.g., Article, Breadcrumb) implemented?

## 8. PENALTIES & RECOVERY

*   **Manual Actions:** Issued when human reviewers determine a site violates spam policies (e.g., cloaking, link spam, scaled content abuse).
*   **Result:** The site may rank lower or be entirely removed from search results.
*   **Recovery:** Fix the violating practices and file a reconsideration request. Provide evidence that the issues have been resolved.
*   **Algorithmic Drops:** If traffic drops after a core update, it's not necessarily a penalty. Evaluate the content against the Helpful Content Guidelines (E-E-A-T, Who/How/Why). Improving content quality can lead to recovery over time, without waiting for the next major core update.
