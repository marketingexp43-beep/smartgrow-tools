import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { CATEGORIES, CategoryId, getToolsByCategory } from '../data/tools';
import { ARTICLES } from '../data/articles';
import { SeoHead } from '../components/SeoHead';

interface CategoryPageProps {
  categoryId: CategoryId;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  const tools = getToolsByCategory(categoryId);
  const relatedArticles = ARTICLES.filter((a) =>
    a.relatedToolSlugs.some((slug) => tools.some((t) => t.slug === slug))
  );

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartgrowtools.com';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      url: `${origin}${category.path}`,
      description: category.seoDescription,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: category.name, item: `${origin}${category.path}` },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title={category.seoTitle}
        description={category.seoDescription}
        path={category.path}
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="text-slate-800 font-medium">{category.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-blue-700 mb-2">
              {category.name} · {tools.length} Working Utilities
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {category.headline}
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{category.overview}</p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-6">
            Available {category.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
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

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Open {tool.name}</span>
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

      {relatedArticles.length > 0 && (
        <section className="py-12 border-t border-slate-200 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-6">
              Related Guides for {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={article.path}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="text-xs text-slate-500 mb-2">
                    <span className="font-medium text-blue-700">{article.category}</span>
                    <span aria-hidden="true" className="mx-1.5">
                      ·
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
