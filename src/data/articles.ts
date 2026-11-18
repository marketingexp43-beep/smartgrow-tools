export interface ArticleExample {
  label: string;
  copy: string;
  note: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  steps?: string[];
  examples?: ArticleExample[];
}

export interface ArticleDefinition {
  slug: string;
  path: string;
  title: string;
  category: string;
  publishedDate: string;
  isoDate: string;
  readTime: string;
  author: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  coverImage?: string;
  coverAlt?: string;
  relatedToolSlugs: string[];
  sections: ArticleSection[];
  faqs?: ArticleFaq[];
}

export const ARTICLES: ArticleDefinition[] = [
  {
    slug: 'how-to-write-seo-meta-titles-and-descriptions',
    path: '/articles/how-to-write-seo-meta-titles-and-descriptions',
    title: 'How to Write SEO Meta Titles and Meta Descriptions That Earn Clicks',
    category: 'On-Page SEO',
    publishedDate: 'November 2026',
    isoDate: '2026-11-18',
    readTime: '9 min read',
    author: 'SmartGrow Editorial Team',
    excerpt:
      'A practical, step-by-step guide to writing clear title tags and meta descriptions with real-world examples, common pitfalls, a pre-publish checklist, and answers on how Google handles snippets.',
    seoTitle: 'Write Better SEO Meta Titles & Snippets | SmartGrow Tools',
    seoDescription:
      'Learn practical guidelines for writing clear SEO meta titles and descriptions, managing Google SERP truncation, and matching search intent.',
    coverImage: '/src/assets/images/article_seo_metadata_1794855473412.webp',
    coverAlt: 'Editorial desk with notebook and tablet displaying clean typography layout',
    relatedToolSlugs: ['meta-title-generator', 'meta-description-generator', 'character-counter'],
    sections: [
      {
        heading: 'What Title Tags and Meta Descriptions Do in Search Results',
        paragraphs: [
          'When your page appears in Google Search, two HTML elements form the foundation of your search listing: the <title> element (commonly called the meta title or title tag) and the <meta name="description"> tag. Together, they work like a storefront sign and window summary—telling both search engines and human readers what the page covers before anyone clicks.',
          'Title tags are a direct on-page relevance signal that help search systems understand a page’s primary topic, and they also appear in browser tabs and link previews when shared. Meta descriptions are not a direct ranking factor in Google Search, yet they play an essential role in user experience: a specific, accurate summary helps the right visitors recognize that your page answers their question, earning more qualified clicks and reducing immediate bounces.',
          'Writing effective metadata is rarely about clever wordplay or stuffing extra keywords. Instead, it is about giving a busy searcher immediate clarity on three points: the exact topic of the page, who or what situation it helps, and what they will be able to do once they land on it.',
        ],
      },
      {
        heading: 'Length Recommendations, Pixel Width, and Mobile vs. Desktop Display',
        paragraphs: [
          'Google does not enforce a fixed character limit or official length rule for title tags or meta descriptions—longer tags are still crawled and indexed. Ranges such as 50 to 60 characters for title tags and 120 to 160 characters for meta descriptions are simply general editorial recommendations based on how much text typically fits before visual truncation.',
          'Search engines clip snippets by horizontal pixel width inside fixed display containers rather than by an exact character count. Wide uppercase letters such as W, M, and G take up noticeably more space than narrow characters like i, l, or t, so an ALL CAPS title may cut off closer to 48 characters while a clean mixed-case title can often display 60 characters or slightly more on desktop.',
          'Mobile search results introduce different wrapping behavior: titles frequently wrap onto two lines while descriptions often truncate around 120 characters, though exact cutoffs vary by screen size and query. Front-loading your core topic in the title and placing the primary takeaway early in the description helps ensure key context stays visible across devices. You can preview how your copy wraps using the SmartGrow Meta Title Generator, Meta Description Generator, and Character Counter.',
        ],
      },
      {
        heading: '6 Real-World Title Tag Examples (And Why They Work)',
        paragraphs: [
          'Strong title tags match the format of the page and the intent of the searcher. Below are six realistic title tag patterns across common website types, each sized around standard desktop and mobile display recommendations:',
        ],
        examples: [
          {
            label: 'Free Utility / Tool Page (52 chars)',
            copy: 'CPC Calculator & Ad Budget Planner | SmartGrow Tools',
            note: 'Leads with the exact utility name, adds a clear secondary capability (& Ad Budget Planner), and appends a concise brand suffix after a clean pipe separator.',
          },
          {
            label: 'Educational How-To Guide (49 chars)',
            copy: 'How to Calibrate an Espresso Grinder Step by Step',
            note: 'Mirrors the natural phrasing people type into search and signals a structured walkthrough without hollow hype words.',
          },
          {
            label: 'E-Commerce Category Page (53 chars)',
            copy: 'Ergonomic Mesh Office Chairs – Free Shipping | WorkCo',
            note: 'Combines the specific product category with a concrete buyer benefit (Free Shipping) while leaving room for the store name.',
          },
          {
            label: 'Software Comparison Page (56 chars)',
            copy: 'Static Site Hosts Compared: Cloudflare Pages vs. Netlify',
            note: 'Matches commercial comparison intent directly, naming both options upfront so evaluators know the exact scope before clicking.',
          },
          {
            label: 'Local Service Landing Page (54 chars)',
            copy: 'Emergency Roof Repair in Austin, TX | LoneStar Roofing',
            note: 'Pairs the core service and city/state modifier at the start—critical for local intent—followed by the business name.',
          },
          {
            label: 'Downloadable Template / Resource (52 chars)',
            copy: 'Monthly Content Calendar Template (Free Sheet + CSV)',
            note: 'Clarifies the exact file format inside parentheses so searchers immediately see it is a ready-to-use asset rather than a generic essay.',
          },
        ],
      },
      {
        heading: '6 Real-World Meta Description Examples',
        paragraphs: [
          'While your title tag earns the initial glance, your meta description closes the decision by confirming relevance and setting accurate expectations. Each example below stays between 130 and 155 characters and fronts the key benefit within the first 120 characters:',
        ],
        examples: [
          {
            label: 'Browser-Based Tool Page (146 chars)',
            copy: 'Calculate Cost Per Click, required ad budget, and projected ROAS in seconds. Free browser-based CPC calculator with clear formulas and no sign-up.',
            note: 'States exactly what the user can compute, highlights speed and zero registration friction, and avoids generic filler.',
          },
          {
            label: 'Educational Tutorial (152 chars)',
            copy: 'Learn how to dial in grind size, dose weight, and extraction time for balanced espresso at home. Includes troubleshooting tips for sour or bitter shots.',
            note: 'Lists the concrete variables covered in the guide and names specific problems the reader wants to solve.',
          },
          {
            label: 'E-Commerce Collection (148 chars)',
            copy: 'Shop breathable ergonomic mesh chairs built for all-day desk support. Compare lumbar adjustments, seat depth specs, and warranty terms online today.',
            note: 'Helps shoppers compare specific product attributes (lumbar support, seat depth, warranty) instead of relying on empty adjectives.',
          },
          {
            label: 'Comparison Guide (152 chars)',
            copy: 'Compare build speed, bandwidth limits, custom domains, and pricing tiers between Cloudflare Pages and Netlify to pick the right static hosting platform.',
            note: 'Spells out the exact evaluation criteria covered in the article, reassuring the searcher that it is an objective breakdown.',
          },
          {
            label: 'Local Service Page (145 chars)',
            copy: 'Licensed roof leak inspection, storm tarp protection, and shingle repair across Austin. Request a same-day estimate with upfront pricing details.',
            note: 'Specifies exact services, service area, and next step without making unverifiable claims.',
          },
          {
            label: 'Template / Checklist Page (151 chars)',
            copy: 'Organize blog topics, publish dates, target keywords, and social promos in one editable content calendar. Available as an instant spreadsheet download.',
            note: 'Describes the columns inside the template and clarifies how the visitor accesses it immediately.',
          },
        ],
      },
      {
        heading: 'Step-by-Step Process for Writing SEO Metadata',
        paragraphs: [
          'Following a consistent sequence keeps metadata consistent across blog posts, product pages, and landing pages without turning every publish cycle into guesswork:',
        ],
        steps: [
          'Confirm the page’s single primary topic and search intent: Decide whether the visitor wants to learn (informational), compare options (commercial), or use a tool/buy (transactional), and identify the natural phrase that best describes that page.',
          'Align your visible H1 heading and title tag: Ensure your title tag reflects the same core promise as the main headline on the page so visitors never feel misled and search engines do not feel forced to rewrite a mismatched title.',
          'Draft a front-loaded title (roughly 50–60 characters recommended): Put the primary subject in the first 35 to 40 characters, add one helpful qualifier (such as year, format, or key feature), and optionally append your brand name using a single pipe (|) or hyphen (-).',
          'Write a specific meta description (around 120–155 characters as a guideline): Expand on what the title promised—mention concrete details, steps, specifications, or interactive features—while placing the core takeaway early so it remains clear even on narrower mobile displays.',
          'Preview snippet wrapping and check uniqueness: Test both strings inside the Meta Title Generator and Meta Description Generator to spot potential pixel-width cutoffs and confirm that no other page on your site uses an identical title or description.',
          'Review live performance periodically: After indexing, inspect Google Search Console to see which queries generate high impressions with low click-through rates, and refine unclear titles or descriptions where the snippet fails to match real searcher phrasing.',
        ],
      },
      {
        heading: 'Why Google Sometimes Rewrites or Truncates Search Snippets',
        paragraphs: [
          'Even carefully crafted tags are suggestions rather than rigid commands. Google’s automated systems routinely adjust both title links and search snippets depending on the page’s full HTML and the specific query a person typed.',
          'Truncation happens simply when a title or description exceeds the available pixel width for the user’s screen size, resulting in an ellipsis (...) that hides trailing words. Rewriting occurs when Google determines that another piece of text—such as your visible <h1> heading, prominent subheadings, anchor text from internal links, or a relevant body paragraph—represents the page or matches the user’s query more accurately than the static tag.',
          'Common triggers for Google rewriting a title tag include excessively long titles, repetitive boilerplate text across hundreds of pages, obvious keyword stuffing, or title tags that stay vague while an on-page heading describes the subject clearly. For meta descriptions, Google often pulls a two-sentence passage directly from the page body whenever a long-tail query matches a specific subheading or FAQ answer inside your content. Writing clean, honest metadata that mirrors your page structure minimizes unnecessary rewrites while keeping snippets useful even when Google adapts them.',
        ],
      },
      {
        heading: 'Common SEO Metadata Mistakes to Avoid',
        paragraphs: [
          'Most metadata issues come from rushed templates or trying too hard to game keywords rather than helping a reader scan the results page:',
        ],
        bullets: [
          'Duplicate titles and descriptions across multiple pages: Using identical CMS templates on category pages, pagination URLs, or service pages makes it harder for both search engines and users to tell pages apart.',
          'Keyword stuffing and repetitive variations: Repeating "Best SEO Tools | Free SEO Tool | Top SEO Generator" wastes scarce pixel space, looks spammy to readers, and frequently triggers automated title rewrites.',
          'Generic placeholder titles: Leaving default titles such as "Home", "Blog", "Products", or "Untitled Page" sacrifices your clearest opportunity to communicate relevance.',
          'Clickbait promises that the page fails to deliver: Using exaggerated claims ("#1 Guaranteed Secret") might briefly draw curiosity, but visitors leave immediately when the page does not match expectations.',
          'Ignoring mobile truncation: Burying the most important benefit or call to action at character 150 means most mobile searchers will never read it.',
          'Missing descriptions on core landing pages: While Google can auto-generate snippets from page copy, relying solely on automated extraction often pulls navigation fragments, dates, or awkward partial sentences.',
        ],
      },
      {
        heading: 'Pre-Publish SEO Metadata Checklist',
        paragraphs: [
          'Run through this quick verification checklist before publishing or updating any important page on your site:',
        ],
        bullets: [
          'Title tag generally stays around 45 to 60 characters (roughly 580px desktop width) with the main topic placed early so truncation does not hide it.',
          'Title tag is unique across the entire website and matches the intent and wording of the page’s visible H1 heading.',
          'Separators are kept clean and minimal (one pipe | or hyphen - before the brand name, avoiding cluttered symbol chains).',
          'Meta description follows the general 120 to 155 character guideline, with the central value proposition easy to grasp within the opening 120 characters.',
          'Description summarizes real page contents honestly, includes a natural call to action where helpful, and contains no duplicate boilerplate.',
          'Copy reads naturally out loud with zero forced keyword repetition, ALL CAPS shouting, or unsupported marketing claims.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the recommended length for an SEO meta title and meta description?',
        answer:
          'Google has no fixed character limit or official rule—longer titles and descriptions are still read and indexed, and display widths vary by device and query. As a practical recommendation, keeping titles around 50 to 60 characters (roughly 580 pixels on desktop) and meta descriptions around 120 to 155 characters helps keep your full message readable before visual truncation.',
      },
      {
        question: 'Do meta descriptions directly affect Google search rankings?',
        answer:
          'No. Google has confirmed that the meta description tag is not a direct ranking signal in its search algorithms. However, a clear, relevant description helps searchers understand what your page offers before clicking, which supports stronger click-through rates from the impressions you already earn.',
      },
      {
        question: 'Why does Google sometimes rewrite my title tag or meta description?',
        answer:
          'Google rewrites title links when a tag is overly long, stuffed with repeated keywords, outdated, or inconsistent with the main visible H1 heading on the page. It frequently swaps meta descriptions dynamically when a specific search query matches a body paragraph or FAQ answer on your page better than the static summary.',
      },
      {
        question: 'Should I include my brand name in every title tag?',
        answer:
          'Adding your brand name at the end of key landing pages, tool pages, and guides builds recognition, provided it fits comfortably without making the title overly long. If a detailed article title already needs around 55 to 60 characters to explain the topic clearly, prioritize clarity over forcing a brand suffix.',
      },
      {
        question: 'How should I write metadata for large sites with many similar pages?',
        answer:
          'Use structured, attribute-driven templates rather than identical static text. Include the unique entity name, category, specification, or location on each page so every URL produces a distinct title and description, and craft custom copy manually for your highest-traffic landing pages.',
      },
    ],
  },
  {
    slug: 'keyword-research-mapping-search-intent',
    path: '/articles/keyword-research-mapping-search-intent',
    title: 'Keyword Research Fundamentals: Mapping Search Intent Without Guesswork',
    category: 'Keyword Strategy',
    publishedDate: 'November 2026',
    isoDate: '2026-11-16',
    readTime: '6 min read',
    author: 'SmartGrow Editorial Team',
    excerpt:
      'How to classify informational, commercial, comparison, and transactional modifiers so every page serves one clear user goal.',
    seoTitle: 'Keyword Research & Search Intent Guide | SmartGrow Tools',
    seoDescription:
      'Understand the four primary search intent categories and learn how to group long-tail keyword modifiers into a clean site architecture.',
    coverImage: '/src/assets/images/article_keyword_strategy_1794855472182.webp',
    coverAlt: 'Minimalist white desk with index cards and cobalt blue and purple glass blocks',
    relatedToolSlugs: ['keyword-generator', 'word-counter', 'meta-title-generator'],
    sections: [
      {
        heading: 'Start With Intent Before Volume',
        paragraphs: [
          'A high search volume number means little if the visitor wants a quick definition while your page is trying to sell enterprise software. Before drafting content, classify the modifier attached to the seed keyword.',
          'Most search queries fall into four practical buckets: informational learning, commercial research, direct comparison, and transactional action.',
        ],
      },
      {
        heading: 'The Four Practical Intent Buckets',
        paragraphs: [
          'Organizing your keyword list by intent prevents keyword cannibalization—where two pages on your own site compete for the exact same query.',
        ],
        bullets: [
          'Informational ("how to", "what is", "checklist"): Best served by tutorials, definitions, and structured guides.',
          'Commercial Investigation ("best", "top", "examples"): Best served by curated roundups, methodology breakdowns, and category pages.',
          'Comparison ("vs", "alternatives", "review"): Best served by transparent side-by-side tables evaluating trade-offs.',
          'Transactional ("calculator", "template", "pricing", "tool"): Best served by interactive utilities, product pages, or downloadable assets.',
        ],
      },
      {
        heading: 'Validating Seed Modifiers',
        paragraphs: [
          'Once you generate a structured list of long-tail variations, inspect the top search results manually for your highest-priority terms. Look at what page formats already appear—if every result is an interactive calculator rather than a blog post, build the tool.',
        ],
      },
    ],
  },
  {
    slug: 'understanding-cpc-ctr-and-conversion-economics',
    path: '/articles/understanding-cpc-ctr-and-conversion-economics',
    title: 'Understanding CPC, CTR, and Downstream Conversion Economics',
    category: 'Paid Media',
    publishedDate: 'November 2026',
    isoDate: '2026-11-16',
    readTime: '5 min read',
    author: 'SmartGrow Editorial Team',
    excerpt:
      'Why optimizing click-through rate and cost per click in isolation can mislead ad accounts—and how to connect clicks to CPA and ROAS.',
    seoTitle: 'CPC, CTR & Campaign Economics Guide | SmartGrow Tools',
    seoDescription:
      'Learn how Cost Per Click, Click-Through Rate, Cost Per Acquisition, and ROAS interact across paid search and social campaigns.',
    coverImage: '/src/assets/images/article_paid_metrics_1794855473535.webp',
    coverAlt: 'Modern workspace monitor displaying ascending column metrics in blue and purple',
    relatedToolSlugs: ['cpc-calculator', 'ctr-calculator'],
    sections: [
      {
        heading: 'Connecting Top-of-Funnel Clicks to Revenue',
        paragraphs: [
          'Click-Through Rate (CTR) measures how effectively your ad creative or search listing earns attention from people who saw it. Cost Per Click (CPC) measures how much of your budget each visit consumes.',
          'Neither metric tells you whether a campaign is sustainable on its own. A low CPC brings little value if visitors leave immediately without converting.',
        ],
      },
      {
        heading: 'The Core Formulas Every Marketer Needs',
        paragraphs: [
          'Keeping the math transparent helps you diagnose bottlenecks quickly when campaign performance shifts.',
        ],
        bullets: [
          'CTR (%) = (Clicks ÷ Impressions) × 100',
          'CPC = Total Ad Spend ÷ Total Clicks',
          'CPA (Cost Per Acquisition) = CPC ÷ Conversion Rate (as a decimal)',
          'ROAS = Attributed Revenue ÷ Total Ad Spend',
        ],
      },
      {
        heading: 'When Higher CTR Lowers Acquisition Cost',
        paragraphs: [
          'In auction-based ad platforms, stronger ad relevance and higher CTR often correlate with better quality scores, which can reduce effective CPC over time. Just ensure your ad headline accurately reflects the landing page offer so conversion rates hold steady.',
        ],
      },
    ],
  },
  {
    slug: 'social-profile-and-video-title-optimization',
    path: '/articles/social-profile-and-video-title-optimization',
    title: 'Optimizing Social Profiles, Hashtags, and Video Titles for Discovery',
    category: 'Social Media',
    publishedDate: 'November 2026',
    isoDate: '2026-11-16',
    readTime: '4 min read',
    author: 'SmartGrow Editorial Team',
    excerpt:
      'How mobile truncation limits shape Instagram bios, YouTube video titles, and cross-platform hashtag selection.',
    seoTitle: 'Social Bios, Hashtags & Video Titles | SmartGrow Tools',
    seoDescription:
      'Practical guidelines for formatting 150-character Instagram bios, CamelCase hashtags, and mobile-safe YouTube video titles.',
    relatedToolSlugs: ['instagram-bio-generator', 'hashtag-generator', 'youtube-title-generator'],
    sections: [
      {
        heading: 'Designing for Narrow Mobile Viewports',
        paragraphs: [
          'Most social discovery happens on phones where vertical space is scarce. Instagram caps bios at 150 characters, and YouTube home feeds routinely clip video titles past 60 characters.',
          'Editing your copy inside a character-aware preview before publishing eliminates awkward cut-offs and hidden calls to action.',
        ],
      },
      {
        heading: 'Readable Hashtags and Profile Clarity',
        paragraphs: [
          'Modern social algorithms rely heavily on on-screen text, spoken audio transcripts, and caption phrasing rather than giant blocks of generic hashtags. Treat hashtags as secondary topic labels.',
        ],
        bullets: [
          'Format multi-word hashtags in CamelCase (#DigitalMarketing) for both readability and screen-reader accessibility.',
          'State what you publish and who it is for in the first line of your Instagram bio.',
          'Lead YouTube titles with the concrete outcome or subject before adding parenthetical context.',
        ],
      },
    ],
  },
  {
    slug: 'content-readability-and-keyword-balance',
    path: '/articles/content-readability-and-keyword-balance',
    title: 'Content Structure, Readability, and Natural Keyword Density',
    category: 'Content Writing',
    publishedDate: 'November 2026',
    isoDate: '2026-11-16',
    readTime: '5 min read',
    author: 'SmartGrow Editorial Team',
    excerpt:
      'Practical editing habits for keeping long-form articles scannable, avoiding keyword repetition, and checking reading ease.',
    seoTitle: 'Content Readability & Keyword Density | SmartGrow Tools',
    seoDescription:
      'Improve editorial clarity and organic engagement with practical tips on sentence length, Flesch reading ease, and balanced keyword density.',
    relatedToolSlugs: ['word-counter', 'character-counter', 'keyword-generator'],
    sections: [
      {
        heading: 'Write for Scanners First, Deep Readers Second',
        paragraphs: [
          'Online readers evaluate page layout before committing to a full read. Clear subheadings, concise paragraphs, and concrete bullet lists make dense explanations approachable without dumbing down the subject.',
        ],
      },
      {
        heading: 'Using Keyword Density as an Editing Check',
        paragraphs: [
          'There is no magic keyword density percentage required to rank. Instead, inspecting top word and two-word phrase frequencies serves as an editorial sanity check.',
          'If your primary phrase barely appears in a 1,200-word article, your subheadings may be off-topic. Conversely, if a single phrase repeats unnaturally in every paragraph, swapping in synonyms makes the prose far smoother to read.',
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ArticleDefinition | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
