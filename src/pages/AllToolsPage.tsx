import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CATEGORIES, CategoryId, TOOLS } from '../data/tools';
import { SeoHead, SITE_URL } from '../components/SeoHead';

export function AllToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryId>('all');

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const catMatch = selectedCategory === 'all' || tool.categoryId === selectedCategory;
      const textMatch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return catMatch && textMatch;
    });
  }, [query, selectedCategory]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const origin = SITE_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All SmartGrow Tools',
    url: `${origin}/tools`,
    description:
      'Browse all 10 free browser-based SmartGrow Tools across SEO metadata, keyword ideation, social copy, content counters, and marketing calculators.',
  };

  return (
    <>
      <SeoHead
        title="All SEO & Marketing Tools Directory | SmartGrow Tools"
        description="Browse all 10 free browser-based SmartGrow Tools across SEO metadata, keyword ideation, social media copy, content counters, and marketing calculators."
        path="/tools"
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            All SmartGrow Tools
          </h1>
          <p className="mt-2.5 text-base text-slate-600 max-w-2xl">
            Every generator, counter, and calculator in one searchable directory.
          </p>

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
                placeholder="Search by tool name or keyword..."
                aria-label="Filter tools directory"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
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
                  aria-pressed={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.navLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {filteredTools.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-10 text-center">
              <p className="text-sm text-slate-600 mb-4">
                No tools matched "{query}". Clear the search box to view all 10 tools.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleQueryChange('');
                  setSelectedCategory('all');
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
                    <div className="text-xs font-medium text-purple-700 mb-2">
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
        </div>
      </section>
    </>
  );
}
