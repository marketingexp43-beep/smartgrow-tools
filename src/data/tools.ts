export type CategoryId =
  | 'seo-tools'
  | 'social-media-tools'
  | 'content-writing-tools'
  | 'marketing-calculators';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  navLabel: string;
  slug: string;
  path: string;
  headline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  accentTone: 'blue' | 'purple';
  overview: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  path: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  howItWorks: string[];
  bestPractices: string[];
  faqs: ToolFaq[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'seo-tools',
    name: 'SEO Tools',
    navLabel: 'SEO Tools',
    slug: 'seo-tools',
    path: '/seo-tools',
    headline: 'On-Page SEO & Keyword Ideation Tools',
    description:
      'Craft click-worthy search snippets, preview SERP character limits, and uncover structured keyword modifiers directly in your browser.',
    seoTitle: 'Free SEO Tools – Meta & Keyword Tools | SmartGrow Tools',
    seoDescription:
      'Use free browser-based SEO tools including our Meta Title Generator, Meta Description Generator, and Keyword Generator with live SERP previews.',
    accentTone: 'blue',
    overview:
      'Strong organic search visibility starts with clear metadata and well-mapped search intent. These tools help writers, site owners, and marketers format page titles, meta descriptions, and structured keyword lists without relying on heavy subscriptions.',
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Tools',
    navLabel: 'Social Media',
    slug: 'social-media-tools',
    path: '/social-media-tools',
    headline: 'Social Profile, Tag & Video Title Builders',
    description:
      'Format concise social bios, group discovery hashtags by reach level, and test YouTube video titles before publishing.',
    seoTitle: 'Free Social Media Tools & Generators | SmartGrow Tools',
    seoDescription:
      'Build concise Instagram bios, generate categorized hashtags, and write high-clarity YouTube titles with live character previews.',
    accentTone: 'purple',
    overview:
      'Social platforms truncate text aggressively on mobile screens. Each social utility below enforces real platform character boundaries and generates structured copy variations ready to customize for your brand voice.',
  },
  {
    id: 'content-writing-tools',
    name: 'Content Writing Tools',
    navLabel: 'Content Tools',
    slug: 'content-writing-tools',
    path: '/content-writing-tools',
    headline: 'Real-Time Editorial Counters & Readability Checks',
    description:
      'Analyze word count, reading time, keyword density, and multi-platform character limits with instant local text processing.',
    seoTitle: 'Content Writing Tools & Counters | SmartGrow Tools',
    seoDescription:
      'Measure word counts, reading time, keyword frequency, and platform character limits instantly with our private browser-based writing tools.',
    accentTone: 'blue',
    overview:
      'Clear writing respects both reader attention and platform constraints. Paste your draft to inspect readability, spot repetitive phrasing via n-gram frequency, normalize text casing, or verify character limits across eight publishing channels at once.',
  },
  {
    id: 'marketing-calculators',
    name: 'Marketing Calculators',
    navLabel: 'Calculators',
    slug: 'marketing-calculators',
    path: '/marketing-calculators',
    headline: 'Paid Media & Funnel Performance Calculators',
    description:
      'Model cost per click, click-through rate, budget pacing, and downstream conversion economics with transparent formulas.',
    seoTitle: 'Marketing Calculators – CPC & CTR | SmartGrow Tools',
    seoDescription:
      'Calculate Cost Per Click (CPC), Click-Through Rate (CTR), required ad budgets, and projected ROAS using clean interactive marketing calculators.',
    accentTone: 'purple',
    overview:
      'Media planning requires quick, reliable math across ad spend, impressions, clicks, and landing page conversion rates. Every calculator displays the underlying formula alongside bidirectional inputs so you can solve for any missing variable.',
  },
];

export const TOOLS: ToolDefinition[] = [
  {
    id: 'meta-title-generator',
    slug: 'meta-title-generator',
    path: '/tools/meta-title-generator',
    name: 'Meta Title Generator',
    categoryId: 'seo-tools',
    categoryName: 'SEO Tools',
    shortDescription:
      'Generate structured SEO page titles with a live Google SERP width and 60-character preview.',
    seoTitle: 'Meta Title Generator & SERP Preview | SmartGrow Tools',
    seoDescription:
      'Generate SEO-friendly meta titles and preview how they appear in Google search results, complete with character count and pixel width checks.',
    keywords: ['meta title', 'title tag', 'serp preview', 'seo title', 'headline'],
    howItWorks: [
      'Enter your primary target keyword, optional brand name, and select the page format that matches your content.',
      'The generator builds eight distinct title tag structures combining front-loaded keywords, clarity modifiers, and clean separators.',
      'Click any generated option to load it into the live Google SERP snippet preview and check both character count and estimated pixel width.',
    ],
    bestPractices: [
      'Place your primary keyword near the beginning of the title tag so readers and crawlers identify the topic immediately.',
      'Aim for 50 to 60 characters (roughly under 580 pixels) to minimize truncation on desktop search results.',
      'Avoid repeating the exact same keyword multiple times; write naturally for the person scanning search results.',
    ],
    faqs: [
      {
        question: 'What is the ideal length for an SEO meta title?',
        answer:
          'Most search engines display between 50 and 60 characters before truncating with an ellipsis, depending on the pixel width of the letters used.',
      },
      {
        question: 'Should I include my brand name in every title tag?',
        answer:
          'Including your brand name at the end after a pipe or hyphen helps build recognition on key landing pages, provided it leaves enough room for the primary topic.',
      },
    ],
  },
  {
    id: 'meta-description-generator',
    slug: 'meta-description-generator',
    path: '/tools/meta-description-generator',
    name: 'Meta Description Generator',
    categoryId: 'seo-tools',
    categoryName: 'SEO Tools',
    shortDescription:
      'Write concise, action-oriented meta descriptions within the 120–160 character sweet spot.',
    seoTitle: 'Meta Description Generator & Tester | SmartGrow Tools',
    seoDescription:
      'Create clear, compelling meta descriptions tailored to search intent and preview them inside a realistic desktop and mobile search snippet.',
    keywords: ['meta description', 'serp snippet', 'search summary', 'seo description'],
    howItWorks: [
      'Provide your primary topic, a concrete value proposition or feature, and optionally your target audience.',
      'Choose the search intent and call-to-action style that best fits the page.',
      'Test any variation in the live snippet editor to verify it sits cleanly between 120 and 160 characters.',
    ],
    bestPractices: [
      'Summarize what the visitor will actually find on the page rather than writing vague promotional slogans.',
      'Keep key information inside the first 120 characters so mobile search users see the core message before truncation.',
      'Include a clear next step such as comparing options, reading a guide, or using a calculator.',
    ],
    faqs: [
      {
        question: 'Do meta descriptions directly affect search rankings?',
        answer:
          'Meta descriptions are not a direct ranking signal, but clear and relevant descriptions help searchers choose your result, which supports stronger click-through rates.',
      },
      {
        question: 'Why does Google sometimes rewrite my meta description?',
        answer:
          'Search engines may pull text directly from the page if a user query matches a specific section better than the static description tag.',
      },
    ],
  },
  {
    id: 'keyword-generator',
    slug: 'keyword-generator',
    path: '/tools/keyword-generator',
    name: 'Keyword Generator',
    categoryId: 'seo-tools',
    categoryName: 'SEO Tools',
    shortDescription:
      'Expand any seed topic into categorized question, commercial, comparison, and long-tail keywords.',
    seoTitle: 'Keyword Generator & Intent Tool | SmartGrow Tools',
    seoDescription:
      'Generate structured SEO keyword ideas grouped by informational, commercial, comparison, and transactional search intent with CSV export.',
    keywords: ['keyword research', 'long-tail keywords', 'search intent', 'keyword modifiers'],
    howItWorks: [
      'Type a seed topic (for example, "email marketing" or "standing desk") and an optional audience or location modifier.',
      'The tool combines your seed phrase with proven search modifiers across four intent categories.',
      'Filter by intent, select the most relevant candidates, and copy them to your clipboard or download a CSV file.',
    ],
    bestPractices: [
      'Group informational question keywords into educational blog posts or FAQ sections rather than product pages.',
      'Target comparison and "best" modifiers on dedicated buyer guides or feature comparison pages.',
      'Pair this idea list with Google Search Console or autocomplete checks to validate real search demand.',
    ],
    faqs: [
      {
        question: 'Does this keyword generator require an API key or paid account?',
        answer:
          'No. It runs entirely in your browser using structured search intent matrices and linguistic modifiers.',
      },
      {
        question: 'How should I organize the exported keyword list?',
        answer:
          'Cluster keywords that share the same user intent onto a single page so you do not create competing pages for nearly identical queries.',
      },
    ],
  },
  {
    id: 'hashtag-generator',
    slug: 'hashtag-generator',
    path: '/tools/hashtag-generator',
    name: 'Hashtag Generator',
    categoryId: 'social-media-tools',
    categoryName: 'Social Media Tools',
    shortDescription:
      'Create organized broad, niche, and community hashtags tailored to your target social platform.',
    seoTitle: 'Hashtag Generator for Social Media | SmartGrow Tools',
    seoDescription:
      'Generate relevant hashtags grouped by broad reach, niche topic, and community tags for Instagram, TikTok, LinkedIn, YouTube, and X.',
    keywords: ['hashtag generator', 'instagram hashtags', 'tiktok tags', 'linkedin hashtags'],
    howItWorks: [
      'Enter your post topic or core keywords separated by spaces or commas, then pick your target social platform.',
      'The generator formats clean, properly cased hashtags organized into Broad Discovery, Niche Topic, and Community & Format buckets.',
      'Click individual hashtags to select or deselect them, then copy your final set in one click.',
    ],
    bestPractices: [
      'Use 3 to 5 tightly focused hashtags on LinkedIn and 1 to 3 on X, while Instagram and TikTok captions generally benefit from 5 to 12 relevant tags.',
      'Mix broad category terms with specific niche descriptors so your post reaches both general feeds and dedicated topic followers.',
      'Use CamelCase for multi-word hashtags (like #ContentStrategy) so screen readers pronounce each word accurately.',
    ],
    faqs: [
      {
        question: 'Why does CamelCase matter in hashtags?',
        answer:
          'Capitalizing the first letter of each word improves legibility for everyone and enables assistive screen readers to read multi-word tags properly.',
      },
      {
        question: 'Should I paste the same block of hashtags on every post?',
        answer:
          'Rotating and tailoring hashtags to the exact topic of each post prevents repetitive metadata and helps platforms classify your content accurately.',
      },
    ],
  },
  {
    id: 'instagram-bio-generator',
    slug: 'instagram-bio-generator',
    path: '/tools/instagram-bio-generator',
    name: 'Instagram Bio Generator',
    categoryId: 'social-media-tools',
    categoryName: 'Social Media Tools',
    shortDescription:
      'Build formatted 150-character Instagram bios with a live mobile profile preview.',
    seoTitle: 'Instagram Bio Generator & Preview | SmartGrow Tools',
    seoDescription:
      'Write clean, well-formatted Instagram bios under 150 characters with a live mobile profile layout preview and instant copy.',
    keywords: ['instagram bio', 'profile bio', 'social bio builder', '150 character limit'],
    howItWorks: [
      'Fill in your display name or handle, your niche or role, what value you share, and your call to action.',
      'Choose a layout style—Clean Minimal, Structured Line-Breaks, Brand & Store, or Creator & Educator.',
      'Preview your chosen variation inside a live Instagram profile header mockup and fine-tune it while watching the 150-character meter.',
    ],
    bestPractices: [
      'State clearly who you help or what you publish in the very first line before visitors decide whether to follow.',
      'Keep the bio strictly under 150 characters so nothing gets rejected when saving your profile.',
      'Reserve your bio link CTA for a specific action, such as reading your latest guide or browsing a catalog.',
    ],
    faqs: [
      {
        question: 'How many characters are allowed in an Instagram bio?',
        answer:
          'Instagram enforces a strict 150-character limit on the bio field, including spaces, line breaks, and punctuation.',
      },
      {
        question: 'Do line breaks count toward the character limit?',
        answer:
          'Yes, each line break character counts toward the 150-character cap, and our live counter factors them in automatically.',
      },
    ],
  },
  {
    id: 'youtube-title-generator',
    slug: 'youtube-title-generator',
    path: '/tools/youtube-title-generator',
    name: 'YouTube Title Generator',
    categoryId: 'social-media-tools',
    categoryName: 'Social Media Tools',
    shortDescription:
      'Generate clear, clickable YouTube video titles with a 60-character mobile truncation preview.',
    seoTitle: 'YouTube Title Generator & Preview | SmartGrow Tools',
    seoDescription:
      'Create engaging YouTube video titles across tutorials, comparisons, and case studies while checking how they look before mobile truncation.',
    keywords: ['youtube title', 'video title generator', 'youtube seo', 'video headline'],
    howItWorks: [
      'Enter your video topic or target search phrase, select the video format, and add an optional audience or timeframe.',
      'Review eight structured title formulas designed for search clarity and viewer curiosity without misleading clickbait.',
      'Click any suggestion to preview it inside a YouTube search and home feed card mockup with a 60-character truncation indicator.',
    ],
    bestPractices: [
      'Front-load the main subject in the first 50 to 60 characters because mobile browse feeds often truncate longer titles.',
      'Ensure the title and thumbnail complement each other rather than repeating the exact same five words.',
      'Match the exact promise made in the title within the first 30 seconds of your video to support audience retention.',
    ],
    faqs: [
      {
        question: 'What is the maximum character limit for YouTube titles?',
        answer:
          'YouTube allows up to 100 characters in a video title, though feed cards commonly truncate around 60 to 70 characters depending on screen width.',
      },
      {
        question: 'Should I put keywords in my YouTube title?',
        answer:
          'Yes. Including the natural phrase viewers search for helps both YouTube discovery systems and human viewers immediately recognize relevance.',
      },
    ],
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    path: '/tools/word-counter',
    name: 'Word Counter',
    categoryId: 'content-writing-tools',
    categoryName: 'Content Writing Tools',
    shortDescription:
      'Count words, sentences, paragraphs, reading time, readability score, and keyword density live.',
    seoTitle: 'Word Counter & Density Analyzer | SmartGrow Tools',
    seoDescription:
      'Analyze word count, characters, reading time, Flesch readability score, and top keyword phrases instantly in your browser.',
    keywords: ['word counter', 'reading time', 'keyword density', 'readability checker'],
    howItWorks: [
      'Type or paste your draft into the editor—all counts update locally in real time without sending text to any server.',
      'Inspect total words, characters (with and without spaces), sentences, paragraphs, reading time, and Flesch Reading Ease estimate.',
      'Check the Keyword Density panel to spot overused words or verify that your primary topic appears naturally.',
    ],
    bestPractices: [
      'Break up paragraphs every 3 to 4 sentences for easier scanning on mobile and desktop screens.',
      'Keep keyword usage natural; if a single non-stop word exceeds 3% density, consider varying your phrasing.',
      'Use the reading time estimate to set expectations at the top of guides and newsletters.',
    ],
    faqs: [
      {
        question: 'Is my text stored or uploaded anywhere when using the Word Counter?',
        answer:
          'No. All text parsing, readability math, and frequency analysis run locally inside your browser tab.',
      },
      {
        question: 'How is reading time calculated?',
        answer:
          'Reading time uses an average adult silent reading speed of 225 words per minute, while speaking time uses 130 words per minute.',
      },
    ],
  },
  {
    id: 'character-counter',
    slug: 'character-counter',
    path: '/tools/character-counter',
    name: 'Character Counter',
    categoryId: 'content-writing-tools',
    categoryName: 'Content Writing Tools',
    shortDescription:
      'Check character counts against 8 social and SEO platform limits plus instant case conversion.',
    seoTitle: 'Character Counter & Limit Checker | SmartGrow Tools',
    seoDescription:
      'Count characters with and without spaces, verify limits for Google SERP, X, Instagram, LinkedIn, and SMS, and convert text case.',
    keywords: ['character counter', 'letter count', 'social media limits', 'case converter'],
    howItWorks: [
      'Paste or type your copy to view exact characters, characters without spaces, words, lines, and UTF-8 byte size.',
      'Track progress bars across eight common publishing limits including Google meta tags, X posts, Instagram bios, LinkedIn posts, and SMS segments.',
      'Use the built-in formatting buttons to switch to Sentence case, Title Case, lowercase, UPPERCASE, or remove extra whitespace.',
    ],
    bestPractices: [
      'Check both character count and line breaks when drafting social posts that truncate behind a "See more" toggle.',
      'Watch byte counts if your copy includes emojis or special characters that expand SMS or database field sizes.',
      'Clean trailing spaces before pasting copy into CMS metadata fields.',
    ],
    faqs: [
      {
        question: 'Why does byte size sometimes exceed the character count?',
        answer:
          'Standard ASCII characters use 1 byte each, while emojis, accented letters, and typographic symbols require 2 to 4 bytes in UTF-8 encoding.',
      },
      {
        question: 'What is the character limit for a standard SMS segment?',
        answer:
          'A standard GSM-7 SMS segment holds up to 160 characters. Messages containing emojis or non-GSM characters drop to 70 characters per segment.',
      },
    ],
  },
  {
    id: 'cpc-calculator',
    slug: 'cpc-calculator',
    path: '/tools/cpc-calculator',
    name: 'CPC Calculator',
    categoryId: 'marketing-calculators',
    categoryName: 'Marketing Calculators',
    shortDescription:
      'Calculate Cost Per Click, ad spend budgets, CPA, and projected ROAS with clear formulas.',
    seoTitle: 'CPC Calculator & ROAS Planner | SmartGrow Tools',
    seoDescription:
      'Calculate Cost Per Click (CPC), required campaign budget, expected clicks, Cost Per Acquisition (CPA), and Return on Ad Spend.',
    keywords: ['cpc calculator', 'cost per click', 'ad budget calculator', 'cpa', 'roas'],
    howItWorks: [
      'Choose what you want to solve for: Cost Per Click (CPC), Maximum Clicks from a budget, or Required Budget for a click goal.',
      'Enter your numbers using the clean numeric inputs or load a realistic campaign scenario to explore the math.',
      'Optionally enter an expected landing page conversion rate and average order value to estimate CPA, conversions, and ROAS.',
    ],
    bestPractices: [
      'Evaluate CPC alongside conversion rate and order value—a higher CPC click can still be more profitable if buyer intent is stronger.',
      'Separate branded search campaigns from non-branded campaigns when comparing historical CPC averages.',
      'Re-check break-even CPC whenever your landing page conversion rate or profit margin changes.',
    ],
    faqs: [
      {
        question: 'What is the formula for Cost Per Click (CPC)?',
        answer: 'CPC equals Total Ad Spend divided by Total Clicks (CPC = Ad Spend / Clicks).',
      },
      {
        question: 'How does CPC relate to Cost Per Acquisition (CPA)?',
        answer:
          'CPA equals your CPC divided by your conversion rate expressed as a decimal. For example, a $2.00 CPC with a 4% (0.04) conversion rate yields a $50.00 CPA.',
      },
    ],
  },
  {
    id: 'ctr-calculator',
    slug: 'ctr-calculator',
    path: '/tools/ctr-calculator',
    name: 'CTR Calculator',
    categoryId: 'marketing-calculators',
    categoryName: 'Marketing Calculators',
    shortDescription:
      'Calculate Click-Through Rate percentage and model how CTR improvements impact traffic and conversions.',
    seoTitle: 'CTR Calculator & Lift Simulator | SmartGrow Tools',
    seoDescription:
      'Compute Click-Through Rate (CTR), required impressions or clicks, and forecast how incremental CTR improvements grow conversions.',
    keywords: ['ctr calculator', 'click-through rate', 'impressions to clicks', 'ad ctr'],
    howItWorks: [
      'Select whether to calculate CTR (%), Required Clicks, or Needed Impressions.',
      'Enter your campaign figures to get an exact percentage rounded cleanly to two decimal places.',
      'Use the Funnel Lift Simulator below to see how improving CTR by +0.5% or +1.0% changes total clicks and conversions at the same impression volume.',
    ],
    bestPractices: [
      'Interpret CTR within channel context—search ads and organic top-3 results naturally earn higher CTR than display banners.',
      'Test clearer headlines and stronger offer alignment before raising bids when CTR trails your campaign baseline.',
      'Always monitor conversion rate alongside CTR so higher click volume actually translates into qualified leads or sales.',
    ],
    faqs: [
      {
        question: 'What is the formula for Click-Through Rate (CTR)?',
        answer: 'CTR (%) equals (Total Clicks / Total Impressions) × 100.',
      },
      {
        question: 'Can a high CTR ever be misleading?',
        answer:
          'Yes. Overly broad or sensational ad copy can inflate CTR while attracting unqualified clicks that bounce without converting.',
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug || c.id === slug);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(categoryId: CategoryId): ToolDefinition[] {
  return TOOLS.filter((t) => t.categoryId === categoryId);
}
