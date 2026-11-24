import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CATEGORIES, CategoryId, TOOLS } from '../data/tools';
import { PDF_TOOLS } from '../data/pdfTools';
import { SeoHead, SITE_URL } from '../components/SeoHead';

export function AllToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pdf' | CategoryId>('all');

  const combinedTools = useMemo(
    () => [
      ...TOOLS.map((t) => ({ ...t, suite: 'marketing' as const })),
      ...PDF_TOOLS.map((t) => ({ ...t, suite: 'pdf' as const })),
    ],
    []
  );

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return combinedTools.filter((tool) => {
      const catMatch =
        selectedFilter === 'all'
          ? true
          : selectedFilter === 'pdf'
            ? tool.suite === 'pdf'
            : tool.categoryId === selectedFilter;
      const textMatch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return catMatch && textMatch;
    });
  }, [combinedTools, query, selectedFilter]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const origin = SITE_URL;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'All SmartGrow Tools',
      url: `${origin}/tools`,
      description:
        'Browse all free browser-based SmartGrow Tools across SEO metadata, keyword ideation, social copy, content counters, marketing calculators, and local PDF tools.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: combinedTools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          url: `${origin}${tool.path}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'All Tools', item: `${origin}/tools` },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title="All SEO, Marketing & PDF Tools Directory | SmartGrow Tools"
        description="Browse all 35 free browser-based SmartGrow Tools across SEO metadata, social copy, content counters, marketing calculators, and local PDF utilities."
        path="/tools"
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                All SmartGrow Tools
              </h1>
              <p className="mt-2.5 text-base text-slate-600 max-w-2xl">
                Every SEO generator, marketing calculator, editorial counter, and PDF utility in one searchable directory.
              </p>
            </div>
            <Link
              to="/pdf-tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap"
            >
              <span>Dedicated PDF Tools Directory</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search all 35 marketing & PDF tools..."
                aria-label="Filter tools directory"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                aria-pressed={selectedFilter === 'all'}
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedFilter === 'all'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({combinedTools.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={selectedFilter === cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedFilter === cat.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.navLabel}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={selectedFilter === 'pdf'}
                onClick={() => setSelectedFilter('pdf')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedFilter === 'pdf'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PDF Tools ({PDF_TOOLS.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {filteredTools.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-10 text-center">
              <p className="text-sm text-slate-600 mb-4">
                No tools matched "{query}". Clear the search box to view all {combinedTools.length} tools.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleQueryChange('');
                  setSelectedFilter('all');
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`text-xs font-medium mb-2 ${
                        tool.suite === 'pdf' ? 'text-blue-700' : 'text-purple-700'
                      }`}
                    >
                      {tool.categoryName}
                    </div>
                    <h2 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                    <span>Open tool</span>
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <p className="text-slate-600">
              Want practical guides on applying these utilities to your search and ad campaigns?
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center gap-1.5 font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap shrink-0"
            >
              <span>Read Educational Articles</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
