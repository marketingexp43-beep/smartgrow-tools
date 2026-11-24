import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FileCog,
  FileEdit,
  FileOutput,
  FileText,
  Layers,
  Lock,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { CATEGORIES, CategoryId, TOOLS } from '../data/tools';
import { PDF_CATEGORIES, PDF_TOOLS, PdfCategoryId } from '../data/pdfTools';
import { ARTICLES } from '../data/articles';
import { SeoHead, SITE_URL } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';

const CATEGORY_ICONS: Record<CategoryId, typeof Search> = {
  'seo-tools': TrendingUp,
  'social-media-tools': Share2,
  'content-writing-tools': FileText,
  'marketing-calculators': Calculator,
};

const PDF_CATEGORY_ICONS: Record<PdfCategoryId, typeof Layers> = {
  'organize-pdf': Layers,
  'optimize-pdf': FileCog,
  'convert-pdf': FileOutput,
  'edit-pdf': FileEdit,
  'pdf-security': Lock,
  'pdf-intelligence': Sparkles,
};

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | CategoryId>('all');
  const [activePdfCategory, setActivePdfCategory] = useState<'all' | PdfCategoryId>('all');
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const matchedMarketing = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    ).map((t) => ({
      type: 'Marketing Tool' as const,
      title: t.name,
      subtitle: t.categoryName,
      path: t.path,
    }));

    const matchedPdf = PDF_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    ).map((t) => ({
      type: 'PDF Tool' as const,
      title: t.name,
      subtitle: t.categoryName,
      path: t.path,
    }));

    const matchedArticles = ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    ).map((a) => ({
      type: 'Article' as const,
      title: a.title,
      subtitle: `${a.category} · ${a.readTime}`,
      path: a.path,
    }));

    return [...matchedMarketing, ...matchedPdf, ...matchedArticles].slice(0, 7);
  }, [searchQuery]);

  const visibleTools = useMemo(() => {
    if (activeCategory === 'all') return TOOLS;
    return TOOLS.filter((t) => t.categoryId === activeCategory);
  }, [activeCategory]);

  const visiblePdfTools = useMemo(() => {
    if (activePdfCategory === 'all') return PDF_TOOLS;
    return PDF_TOOLS.filter((t) => t.categoryId === activePdfCategory);
  }, [activePdfCategory]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
    } else if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const origin = SITE_URL;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SmartGrow Tools',
      url: `${origin}/`,
      description:
        'Free browser-based SEO generators, social media utilities, content writing counters, digital marketing calculators, and local PDF document tools.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/tools?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SmartGrow Tools',
      url: `${origin}/`,
      logo: `${origin}/favicon.svg`,
      email: 'hello@smartgrowtools.com',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'SmartGrow SEO, Digital Marketing & PDF Tools',
      itemListElement: [...TOOLS, ...PDF_TOOLS].map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        url: `${origin}${tool.path}`,
      })),
    },
  ];

  return (
    <>
      <SeoHead
        title="SmartGrow Tools – Free SEO, Digital Marketing & PDF Tools"
        description="Free browser-based SEO generators, social media tools, content counters, marketing calculators, and 25 private PDF tools. Fast, local, and ready with no sign-up."
        path="/"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wide text-blue-700 mb-3">
              Free Browser-Based Marketing &amp; PDF Suite
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Practical SEO, Marketing &amp; PDF Tools Without the Bloat
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Generate search-ready metadata, calculate campaign economics, and merge, compress, convert, edit, or OCR PDF documents directly inside your browser.
            </p>

            {/* Working Search Bar */}
            <div className="mt-7 relative max-w-xl">
              <form onSubmit={handleSearchSubmit} role="search" aria-label="Search SmartGrow tools">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setSearchQuery('');
                      }}
                      placeholder="Search tools (e.g., Meta Title, CPC, Merge PDF, Compress, OCR)..."
                      aria-label="Search tools or articles"
                      aria-expanded={searchQuery.trim().length > 0}
                      aria-controls={searchQuery.trim().length > 0 ? 'hero-search-results' : undefined}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Find Tool</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>

              {searchQuery.trim().length > 0 && (
                <div
                  id="hero-search-results"
                  className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden"
                >
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">
                      No matching tools or articles found for "{searchQuery}".{' '}
                      <Link to="/tools" className="text-blue-700 font-medium hover:underline">
                        Browse all tools
                      </Link>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {searchResults.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-blue-50/40 transition-colors"
                          >
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                              <div className="text-xs text-slate-500">
                                {item.type} · {item.subtitle}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
              <span>10 SEO &amp; marketing tools</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>25 local PDF utilities</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>No account, API key, or file uploads</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[260px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <SafeImage
                src="/src/assets/images/hero_marketing_workspace_1794855472737.webp"
                alt="Bright minimalist digital marketing desk with analytics display"
                fallbackLabel="SmartGrow Tools Workspace"
                priority
                width={1000}
                height={747}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section A: SEO & Digital Marketing Tools Overview */}
      <section className="py-14 lg:py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold text-blue-700 mb-1.5">
                A. SEO &amp; Digital Marketing Tools
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Four Dedicated Marketing Suites
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                Jump directly into a category page or launch any marketing utility below.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
            >
              <span>View all tools directory</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              const count = TOOLS.filter((t) => t.categoryId === category.id).length;
              const isPurple = category.accentTone === 'purple';

              return (
                <Link
                  key={category.id}
                  to={category.path}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                        isPurple
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="font-mono tabular-nums">{count} tools</span>
                    <span className="inline-flex items-center gap-1 text-blue-700 group-hover:translate-x-0.5 transition-transform">
                      Open suite
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filterable Marketing Tools Directory */}
      <section className="py-14 lg:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                SEO &amp; Marketing Utilities
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                Every tool runs on its own dedicated page with transparent logic and instant copy controls.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                aria-pressed={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({TOOLS.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.navLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-purple-700 mb-2">
                    {tool.categoryName}
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Launch tool</span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section B: Complete Browser PDF Tools Suite */}
      <section className="py-14 lg:py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold text-purple-700 mb-1.5">
                B. PDF Tools
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                25 Private Browser-Based PDF Tools
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
                Organize, optimize, convert, edit, protect, and extract text from PDFs locally on your device without uploading private documents.
              </p>
            </div>
            <Link
              to="/pdf-tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap"
            >
              <span>Open PDF tools directory</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {PDF_CATEGORIES.map((category) => {
              const Icon = PDF_CATEGORY_ICONS[category.id];
              const count = PDF_TOOLS.filter((t) => t.categoryId === category.id).length;
              const isPurple = category.accentTone === 'purple';

              return (
                <Link
                  key={category.id}
                  to={`/pdf-tools?category=${category.id}`}
                  className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors flex items-start gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isPurple
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {category.name}
                      </h3>
                      <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
                        {count} tools
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="font-display text-lg font-bold text-slate-900">
              All PDF Utilities
            </h3>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                aria-pressed={activePdfCategory === 'all'}
                onClick={() => setActivePdfCategory('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activePdfCategory === 'all'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({PDF_TOOLS.length})
              </button>
              {PDF_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={activePdfCategory === cat.id}
                  onClick={() => setActivePdfCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activePdfCategory === cat.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visiblePdfTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-blue-700 mb-1.5">
                    {tool.categoryName}
                  </div>
                  <h4 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Open PDF tool</span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Principles (Honest, No Fake Claims) */}
      <section className="py-14 lg:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Built Around Three Simple Standards
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Day-to-day marketing checks and document tasks should not sit behind sign-up walls or third-party upload queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-mono text-xs font-semibold text-blue-700 mb-2">01. Local Processing</div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Your Copy &amp; PDFs Stay in Your Browser
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Counters, keyword combiners, calculators, and all PDF utilities run directly in client-side JavaScript without uploading your files or drafts to external servers.
              </p>
            </div>

            <div>
              <div className="font-mono text-xs font-semibold text-purple-700 mb-2">02. Open Access</div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Zero Subscriptions or Usage Caps
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Every generator, calculator, and PDF editor works immediately on load without paid API keys, credit limits, or email gates.
              </p>
            </div>

            <div>
              <div className="font-mono text-xs font-semibold text-blue-700 mb-2">03. Transparent Limits</div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Clear Formulas &amp; Honest Capabilities
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                SERP pixel widths, CPC/CTR math, and client-side PDF format boundaries are explained openly alongside each workspace so you know exactly what to expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Articles Section */}
      <section className="py-14 lg:py-16 bg-slate-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Practical Guides &amp; Articles
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                Clear reference articles explaining the SEO, content, and paid media principles behind each tool.
              </p>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>All articles</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                to={article.path}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-200">
                  <SafeImage
                    src={article.coverImage}
                    alt={article.coverAlt || article.title}
                    fallbackLabel={article.category}
                    width={1000}
                    height={747}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-2">
                      <span className="font-medium text-blue-700">{article.category}</span>
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
