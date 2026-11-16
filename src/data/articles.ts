export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
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
}

export const ARTICLES: ArticleDefinition[] = [
  {
    slug: 'how-to-write-seo-meta-titles-and-descriptions',
    path: '/articles/how-to-write-seo-meta-titles-and-descriptions',
    title: 'How to Write SEO Meta Titles and Meta Descriptions That Earn Clicks',
    category: 'On-Page SEO',
    publishedDate: 'November 2026',
    isoDate: '2026-11-16',
    readTime: '5 min read',
    author: 'SmartGrow Editorial Team',
    excerpt:
      'Practical rules for structuring title tags and meta descriptions around search intent, pixel width constraints, and clear value propositions.',
    seoTitle: 'Write Better SEO Meta Titles & Snippets | SmartGrow Tools',
    seoDescription:
      'Learn practical guidelines for writing clear SEO meta titles and descriptions, managing Google SERP truncation, and matching search intent.',
    coverImage: '/src/assets/images/article_seo_metadata_1794855473412.webp',
    coverAlt: 'Editorial desk with notebook and tablet displaying clean typography layout',
    relatedToolSlugs: ['meta-title-generator', 'meta-description-generator', 'character-counter'],
    sections: [
      {
        heading: 'Why Search Snippets Still Matter',
        paragraphs: [
          'Your title tag and meta description act as the storefront label for every page you publish. Even when a page ranks well, an unclear or truncated snippet forces searchers to scan past your listing.',
          'Writing effective metadata is rarely about stuffing extra keywords. Instead, it is about confirming to the reader within two seconds that your page answers their exact question.',
        ],
      },
      {
        heading: 'Structuring Title Tags Around Pixel Width',
        paragraphs: [
          'While marketers commonly cite a 50 to 60 character guideline for title tags, search engines actually truncate based on horizontal pixel width (roughly 580px on desktop). Wide capital letters like W and M take up significantly more space than i or l.',
        ],
        bullets: [
          'Front-load your primary topic in the first 35 characters so mobile and desktop snippets always preserve the core subject.',
          'Use a clean single-character separator such as a pipe (|) or hyphen (-) before appending your brand name.',
          'Avoid repeating variations of the same keyword in one title—use the remaining space for specificity, such as the year or format.',
        ],
      },
      {
        heading: 'Writing Actionable Meta Descriptions',
        paragraphs: [
          'Meta descriptions give you 120 to 160 characters to expand on the promise made in your headline. Treat the first 120 characters as essential context and the final 40 characters as supporting detail.',
          'Match the phrasing to the page type. A calculator page benefits from stating what the visitor can compute immediately, whereas a comparison guide should highlight the criteria evaluated.',
        ],
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
