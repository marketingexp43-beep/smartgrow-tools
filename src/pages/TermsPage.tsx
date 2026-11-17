import { Link } from 'react-router-dom';
import { SeoHead, SITE_URL } from '../components/SeoHead';

export function TermsPage() {
  const origin = SITE_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms & Conditions | SmartGrow Tools',
    url: `${origin}/terms-and-conditions`,
    description:
      'Review the Terms and Conditions for using SmartGrow Tools free SEO, social media, content writing, and marketing calculator utilities.',
  };

  return (
    <>
      <SeoHead
        title="Terms & Conditions of Use | SmartGrow Tools"
        description="Review the Terms and Conditions for using SmartGrow Tools free SEO, social media, content writing, and marketing calculator utilities."
        path="/terms-and-conditions"
        structuredData={structuredData}
      />

      <article className="bg-white">
        <header className="border-b border-slate-200 bg-slate-50/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
            <div className="text-xs font-semibold text-blue-700 mb-2">Legal</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Terms &amp; Conditions
            </h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: November 2026</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-12 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using SmartGrow Tools, you agree to these Terms &amp; Conditions. All utilities and educational guides are provided free of charge for personal, educational, and commercial marketing planning workflows.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              2. Informational &amp; Planning Use
            </h2>
            <p>
              Character limits, pixel-width estimates, keyword suggestions, and CPC/CTR calculations are provided for planning and editorial guidance. Search engines and social media platforms periodically update their display thresholds and ranking algorithms; always verify final outputs within the destination platform before publishing or launching paid campaigns.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              3. Acceptable Use
            </h2>
            <p>
              You agree not to attempt to disrupt the availability of this website, scrape content automatically at abusive rates, or misrepresent SmartGrow Tools as an official product of Google, Meta, YouTube, LinkedIn, or any other third-party platform mentioned in our character-limit references.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              4. Disclaimer of Warranties
            </h2>
            <p>
              SmartGrow Tools is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. We make no guarantee regarding specific search rankings, ad performance, or revenue outcomes resulting from the use of any tool or article.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              5. Intellectual Property and Copyright
            </h2>
            <p>
              The SmartGrow Tools name, site design, interface layouts, tool implementations, and original educational articles are protected by applicable copyright and intellectual property laws. You may use the outputs you generate with our tools—such as meta titles, descriptions, keyword lists, hashtags, bios, and calculation summaries—freely for your own personal or commercial projects. However, you may not copy, republish, or redistribute our website source code, editorial articles, or brand identity as your own product without prior permission.
            </p>
            <p className="mt-3">
              Third-party platform names mentioned for reference (such as Google, Instagram, YouTube, X, or LinkedIn) belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              6. Third-Party Links and Google AdSense Advertising
            </h2>
            <p>
              SmartGrow Tools may include links to external websites or reference resources for further reading. We do not control the content, availability, or policies of external websites and are not responsible for them.
            </p>
            <p className="mt-3">
              To support free access to our tools, this website may display third-party advertisements served through Google AdSense or approved advertising partners. Advertisements are provided by external networks, and any interaction you have with an advertiser—including visiting an advertised link or purchasing a third-party product or service—is solely between you and that advertiser. For details on how advertising cookies and preferences work, please review our{' '}
              <Link to="/privacy-policy" className="text-blue-700 font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, SmartGrow Tools and its maintainers shall not be liable for any indirect, incidental, consequential, or business-interruption damages—including lost traffic, lost revenue, campaign spend discrepancies, or data loss—arising out of or related to your use of, or inability to use, the tools, calculators, or educational content on this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              8. Changes to Terms
            </h2>
            <p>
              We may revise these Terms &amp; Conditions from time to time as we add new tools, update existing utilities, or adjust how the website operates. Any updates will be published on this page with a revised &ldquo;Last updated&rdquo; date. Continuing to use SmartGrow Tools after changes are posted indicates your acceptance of the updated terms.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-200 space-y-2">
            <h2 className="font-display text-lg font-bold text-slate-900">
              9. Contact Information
            </h2>
            <p className="text-sm text-slate-600">
              If you have questions about these Terms &amp; Conditions, please email us at{' '}
              <a href="mailto:hello@smartgrowtools.com" className="text-blue-700 font-medium hover:underline">
                hello@smartgrowtools.com
              </a>{' '}
              or send a message through our{' '}
              <Link to="/contact" className="text-blue-700 font-medium hover:underline">
                Contact Us
              </Link>{' '}
              page.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
