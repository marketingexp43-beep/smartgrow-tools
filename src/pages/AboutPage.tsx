import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SeoHead, SITE_URL } from '../components/SeoHead';
import { SafeImage } from '../components/SafeImage';

export function AboutPage() {
  const origin = SITE_URL;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About SmartGrow Tools',
      url: `${origin}/about`,
      description:
        'Learn how SmartGrow Tools builds fast, free, privacy-respecting SEO, content writing, social media, and marketing calculation utilities.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'About Us', item: `${origin}/about` },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title="About SmartGrow Tools – Free SEO & Marketing Utilities"
        description="Learn how SmartGrow Tools builds fast, free, privacy-respecting SEO, content writing, social media, and marketing calculation utilities."
        path="/about"
        structuredData={structuredData}
      />

      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-blue-700 mb-2">About SmartGrow Tools</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Focused Marketing Utilities Built for Everyday Clarity
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              SmartGrow Tools is a free collection of browser-based SEO generators, social copy builders, editorial counters, and paid media calculators designed for writers, creators, and small marketing teams.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6 text-base text-slate-700 leading-relaxed">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                Why We Built SmartGrow Tools
              </h2>
              <p>
                Routine tasks like checking whether a title tag fits in search results, testing how a YouTube headline truncates on mobile, or calculating break-even CPC should take seconds—not a paid subscription or complex account onboarding.
              </p>
              <p className="mt-3">
                We created SmartGrow Tools so anyone publishing content or managing campaigns can open a clean, focused page, run their check locally, and copy the result immediately.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                How Our Tools Work
              </h2>
              <p>
                Every generator, text analyzer, and calculator on this site runs directly in your browser using client-side JavaScript. There are no external AI API gates, no hidden paywalls, and no server-side logging of the text drafts or campaign figures you type into the interface.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                What Comes Next
              </h2>
              <p>
                We pair each utility with plain-language educational guides so you understand the practical reasoning behind character thresholds, search intent buckets, and acquisition math.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span>Explore All Tools</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <SafeImage
                src="/src/assets/images/hero_marketing_workspace_1794855472737.webp"
                alt="Minimalist digital marketing workspace desk"
                fallbackLabel="SmartGrow Tools"
                width={1000}
                height={747}
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
