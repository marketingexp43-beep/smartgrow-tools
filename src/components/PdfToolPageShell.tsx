import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Info } from 'lucide-react';
import {
  PDF_CATEGORIES,
  PdfToolDefinition,
  getPdfToolsByCategory,
} from '../data/pdfTools';
import { SeoHead, SITE_URL } from './SeoHead';

interface PdfToolPageShellProps {
  tool: PdfToolDefinition;
  children: ReactNode;
}

export function PdfToolPageShell({ tool, children }: PdfToolPageShellProps) {
  const category = PDF_CATEGORIES.find((c) => c.id === tool.categoryId);
  const siblingTools = getPdfToolsByCategory(tool.categoryId).filter((t) => t.id !== tool.id);

  const origin = SITE_URL;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      url: `${origin}${tool.path}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      description: tool.seoDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'PDF Tools',
          item: `${origin}/pdf-tools`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: `${origin}${tool.path}`,
        },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        path={tool.path}
        structuredData={structuredData}
      />

      <div className="bg-white">
        <div className="border-b border-slate-200 bg-slate-50/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
              <Link to="/" className="hover:text-blue-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <Link to="/pdf-tools" className="hover:text-blue-700 transition-colors">
                PDF Tools
              </Link>
              {category && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <Link
                    to={`/pdf-tools?category=${category.id}`}
                    className="hover:text-blue-700 transition-colors"
                  >
                    {category.name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-slate-800 font-medium">{tool.name}</span>
            </nav>

            <div className="max-w-2xl">
              <div className="text-xs font-medium text-blue-700 mb-2">
                <span>{tool.categoryName}</span>
                <span aria-hidden="true" className="mx-2 text-slate-300">
                  ·
                </span>
                <span className="text-slate-500">Browser-Local PDF Utility</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                {tool.name}
              </h1>
              <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>
          </div>
        </div>

        <section aria-label={`${tool.name} Workspace`} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
          {children}

          {tool.limitationNote && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-semibold text-slate-900">Browser Capability Note: </span>
                <span>{tool.limitationNote}</span>
              </div>
            </div>
          )}
        </section>

        <section className="border-t border-slate-200 bg-slate-50/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                How to Use {tool.name}
              </h2>
              <ol className="list-none pl-0 space-y-3 text-sm text-slate-600 leading-relaxed [counter-reset:pdf-step]">
                {tool.howItWorks.map((step) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 [counter-increment:pdf-step] before:content-[counter(pdf-step)] before:font-mono before:text-xs before:font-semibold before:text-blue-700 before:bg-blue-50 before:border before:border-blue-100 before:rounded-md before:w-6 before:h-6 before:flex before:items-center before:justify-center before:shrink-0 before:mt-0.5 before:tabular-nums"
                  >
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                Practical Best Practices
              </h2>
              <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                {tool.bestPractices.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-2" aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-5">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {tool.faqs.map((faq) => (
                  <div key={faq.question} className="py-4">
                    <h3 className="text-sm font-semibold text-slate-900">{faq.question}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-5">
                More {tool.categoryName} Tools
              </h2>
              <div className="space-y-3">
                {siblingTools.map((sibling) => (
                  <Link
                    key={sibling.id}
                    to={sibling.path}
                    className="group block p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/20 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {sibling.name}
                      </h3>
                      <ArrowRight
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {sibling.shortDescription}
                    </p>
                  </Link>
                ))}
                <Link
                  to="/pdf-tools"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 pt-2"
                >
                  <span>Browse all 25 PDF tools</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
