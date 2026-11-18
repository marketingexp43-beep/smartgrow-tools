import { Fragment, ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { getArticleBySlug, ARTICLES } from '../data/articles';
import { TOOLS } from '../data/tools';
import { SeoHead, SITE_URL } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';

const TOOL_LINK_REGEX = new RegExp(
  `(${TOOLS.map((t) => t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'g'
);

function renderTextWithToolLinks(text: string): ReactNode {
  const parts = text.split(TOOL_LINK_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    const matchedTool = TOOLS.find((t) => t.name === part);
    if (!matchedTool) {
      return <Fragment key={index}>{part}</Fragment>;
    }
    return (
      <Link
        key={`${matchedTool.slug}-${index}`}
        to={matchedTool.path}
        className="text-blue-700 font-medium hover:underline"
      >
        {part}
      </Link>
    );
  });
}

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <>
        <SeoHead
          title="Article Not Found | SmartGrow Tools"
          description="The requested article could not be found. Browse all SmartGrow educational guides."
          robots="noindex, follow"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900">Article Not Found</h1>
          <p className="mt-3 text-slate-600">
            This guide does not exist or may have moved. Browse all educational articles below.
          </p>
          <div className="mt-6">
            <Link
              to="/articles"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </>
    );
  }

  const relatedTools = TOOLS.filter((t) => article.relatedToolSlugs.includes(t.slug));
  const moreArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  const origin = SITE_URL;
  const coverAbsolute = article.coverImage
    ? `${origin}${article.coverImage}`
    : `${origin}/src/assets/images/hero_marketing_workspace_1794855472737.webp`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.seoDescription,
      datePublished: article.isoDate,
      dateModified: article.isoDate,
      image: [coverAbsolute],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${origin}${article.path}`,
      },
      author: {
        '@type': 'Organization',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'SmartGrow Tools',
        url: origin,
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/favicon.svg`,
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${origin}/articles` },
        { '@type': 'ListItem', position: 3, name: article.title, item: `${origin}${article.path}` },
      ],
    },
    ...(article.faqs && article.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <SeoHead
        title={article.seoTitle}
        description={article.seoDescription}
        path={article.path}
        ogType="article"
        image={article.coverImage}
        imageAlt={article.coverAlt}
        publishedTime={article.isoDate}
        section={article.category}
        structuredData={structuredData}
      />

      <article className="bg-white">
        <header className="border-b border-slate-200 bg-slate-50/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
              <Link to="/" className="hover:text-blue-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <Link to="/articles" className="hover:text-blue-700 transition-colors">
                Articles
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-slate-800 font-medium truncate">{article.category}</span>
            </nav>

            <div className="text-xs text-slate-500 mb-3">
              <span className="font-semibold text-blue-700">{article.category}</span>
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              <span>{article.publishedDate}</span>
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              <span>{article.readTime}</span>
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              <span>{article.author}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              {article.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 max-w-prose">
            {article.coverImage && (
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 mb-8 bg-slate-50">
                <SafeImage
                  key={article.coverImage}
                  src={article.coverImage}
                  alt={article.coverAlt || article.title}
                  fallbackLabel={article.category}
                  priority
                  width={1000}
                  height={747}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-8">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                    {section.heading}
                  </h2>
                  <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                    {section.paragraphs.map((para) => (
                      <p key={para}>{renderTextWithToolLinks(para)}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-4 space-y-2.5 text-sm sm:text-base text-slate-700">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5"
                            aria-hidden="true"
                          />
                          <span>{renderTextWithToolLinks(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.steps && (
                    <ol className="list-none pl-0 mt-4 space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed [counter-reset:step]">
                      {section.steps.map((step) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 [counter-increment:step] before:content-[counter(step)] before:font-mono before:text-xs before:font-semibold before:text-blue-700 before:bg-blue-50 before:border before:border-blue-100 before:rounded-md before:w-6 before:h-6 before:flex before:items-center before:justify-center before:shrink-0 before:mt-0.5 before:tabular-nums"
                        >
                          <span>{renderTextWithToolLinks(step)}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {section.examples && (
                    <div className="mt-4 space-y-3">
                      {section.examples.map((example) => (
                        <div
                          key={example.label}
                          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                        >
                          <div className="text-xs font-semibold text-purple-700 mb-1.5">
                            {example.label}
                          </div>
                          <p className="text-sm sm:text-base font-medium text-slate-900 leading-snug">
                            {example.copy}
                          </p>
                          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {example.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.table && (
                    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table
                        aria-label={section.table.caption}
                        className="w-full text-left border-collapse text-xs sm:text-sm"
                      >
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700">
                            {section.table.headers.map((header) => (
                              <th key={header} scope="col" className="py-3 px-4 whitespace-nowrap">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                          {section.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-50/60 transition-colors">
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={`${rowIndex}-${cellIndex}`}
                                  className={`py-3 px-4 align-top leading-relaxed ${
                                    cellIndex === 0
                                      ? 'font-medium text-slate-900'
                                      : cellIndex === row.length - 1
                                        ? 'font-mono text-xs text-blue-700 whitespace-nowrap'
                                        : 'text-slate-600'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}

              {article.faqs && article.faqs.length > 0 && (
                <section className="pt-2">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                    Frequently Asked Questions
                  </h2>
                  <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                    {article.faqs.map((faq) => (
                      <div key={faq.question} className="py-4">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                          {faq.question}
                        </h3>
                        <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to all articles</span>
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-6">
              <h2 className="font-display text-base font-bold text-slate-900 mb-3">
                Put This Into Practice
              </h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Open the matching SmartGrow tools referenced in this guide:
              </p>
              <div className="space-y-3">
                {relatedTools.map((tool) => {
                  const allSameCategory =
                    relatedTools.length > 1 &&
                    new Set(relatedTools.map((t) => t.categoryId)).size === 1;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group block bg-white border border-slate-200 rounded-lg p-3.5 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                          {tool.name}
                        </span>
                        <ArrowRight
                          className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                      {!allSameCategory && (
                        <p className="mt-1 text-xs text-slate-500">{tool.categoryName}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="font-display text-base font-bold text-slate-900 mb-3">
                More Guides
              </h2>
              <ul className="divide-y divide-slate-100">
                {moreArticles.map((item) => (
                  <li key={item.slug} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      to={item.path}
                      className="text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors leading-snug block"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.category} · {item.readTime}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
