import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { SeoHead } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';

export function ArticlesPage() {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [query, setQuery] = useState('');

  const topics = useMemo(
    () => ['All', ...Array.from(new Set(ARTICLES.map((a) => a.category)))],
    []
  );

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((article) => {
      const topicMatch = selectedTopic === 'All' || article.category === selectedTopic;
      const queryMatch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return topicMatch && queryMatch;
    });
  }, [selectedTopic, query]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartgrowtools.com';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SEO & Digital Marketing Articles',
    url: `${origin}/articles`,
    description:
      'Read practical, beginner-friendly articles on SEO metadata, search intent, keyword density, social discovery, and paid campaign metrics.',
  };

  return (
    <>
      <SeoHead
        title="SEO & Digital Marketing Guides | SmartGrow Tools"
        description="Read practical, beginner-friendly articles on SEO metadata, search intent, keyword density, social discovery, and paid campaign metrics."
        path="/articles"
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-purple-700 mb-2">
              Educational Resources
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              SEO &amp; Digital Marketing Articles
            </h1>
            <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
              Clear, practical guides written to help you apply every SmartGrow tool effectively across search, content, and paid media.
            </p>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={selectedTopic === topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedTopic === topic
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search educational articles"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {filteredArticles.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
              No articles matched your search. Try selecting "All" or clearing the search box.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={article.path}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors flex flex-col"
                >
                  {article.coverImage && (
                    <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200 overflow-hidden">
                      <SafeImage
                        src={article.coverImage}
                        alt={article.coverAlt || article.title}
                        fallbackLabel={article.category}
                        width={1000}
                        height={747}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-500 mb-2">
                        <span className="font-medium text-blue-700">{article.category}</span>
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        <span>{article.publishedDate}</span>
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {article.title}
                      </h2>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                      <span>Read full guide</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
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
