import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  FileCog,
  FileEdit,
  FileOutput,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  PDF_CATEGORIES,
  PDF_TOOLS,
  PdfCategoryId,
  getPdfCategoryById,
} from '../data/pdfTools';
import { SeoHead, SITE_URL } from '../components/SeoHead';

const PDF_CATEGORY_ICONS: Record<PdfCategoryId, typeof Layers> = {
  'organize-pdf': Layers,
  'optimize-pdf': FileCog,
  'convert-pdf': FileOutput,
  'edit-pdf': FileEdit,
  'pdf-security': Lock,
  'pdf-intelligence': Sparkles,
};

export function PdfToolsDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const rawCat = searchParams.get('category') || 'all';
  const selectedCategory: 'all' | PdfCategoryId =
    rawCat !== 'all' && getPdfCategoryById(rawCat) ? (rawCat as PdfCategoryId) : 'all';

  const updateParams = (nextQ: string, nextCat: 'all' | PdfCategoryId) => {
    const params: Record<string, string> = {};
    if (nextQ.trim()) params.q = nextQ;
    if (nextCat !== 'all') params.category = nextCat;
    setSearchParams(params, { replace: true });
  };

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PDF_TOOLS.filter((tool) => {
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

  const showGroupedByCategory = !query.trim() && selectedCategory === 'all';
  const origin = SITE_URL;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Free Browser PDF Tools | SmartGrow Tools',
      url: `${origin}/pdf-tools`,
      description:
        'Explore 25 free, private, browser-based PDF tools across Organize, Optimize, Convert, Edit, Security, and PDF Intelligence with zero file uploads.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: PDF_TOOLS.map((tool, index) => ({
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
        { '@type': 'ListItem', position: 2, name: 'PDF Tools', item: `${origin}/pdf-tools` },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title="Free Online PDF Tools – Merge, Split, Compress & Convert | SmartGrow Tools"
        description="25 free browser-based PDF tools to merge, split, compress, convert, edit, sign, crop, encrypt, and OCR PDFs privately without uploading your files."
        path="/pdf-tools"
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="text-xs font-semibold text-purple-700 mb-2">
            25 Local Browser Utilities
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            SmartGrow PDF Tools
          </h1>
          <p className="mt-2.5 text-base text-slate-600 max-w-2xl leading-relaxed">
            Organize, optimize, convert, edit, secure, and extract text from PDF documents directly inside your browser. Zero accounts, zero paywalls, and zero third-party file uploads.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
            <span>
              Your documents stay strictly in local browser memory using open-source JavaScript processing.
            </span>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => updateParams(e.target.value, selectedCategory)}
                placeholder="Search PDF tools (e.g., Merge, Compress, OCR, Sign, DOCX)..."
                aria-label="Search PDF tools"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => updateParams(query, 'all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
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
                  aria-pressed={selectedCategory === cat.id}
                  onClick={() => updateParams(query, cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {filteredTools.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-10 text-center">
              <p className="text-sm text-slate-600 mb-4">
                No PDF tools matched "{query}". Reset filters to browse all 25 PDF utilities.
              </p>
              <button
                type="button"
                onClick={() => updateParams('', 'all')}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Show All 25 PDF Tools
              </button>
            </div>
          ) : showGroupedByCategory ? (
            PDF_CATEGORIES.map((cat) => {
              const Icon = PDF_CATEGORY_ICONS[cat.id];
              const catTools = PDF_TOOLS.filter((t) => t.categoryId === cat.id);
              const isPurple = cat.accentTone === 'purple';

              return (
                <div key={cat.id} className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isPurple
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-slate-900">
                          {cat.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600">{cat.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 tabular-nums shrink-0">
                      {catTools.length} tools
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catTools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={tool.path}
                        className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div
                            className={`text-xs font-medium mb-2 ${
                              isPurple ? 'text-purple-700' : 'text-blue-700'
                            }`}
                          >
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
                          <span>Open tool</span>
                          <ArrowRight
                            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                            aria-hidden="true"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-medium text-slate-500 font-mono tabular-nums">
                Showing {filteredTools.length} of {PDF_TOOLS.length} PDF tools
              </div>
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
            </div>
          )}

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <p className="text-slate-600">
              Looking for SEO metadata generators, keyword ideation, or paid media calculators?
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
            >
              <span>Browse SEO &amp; Marketing Tools</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
