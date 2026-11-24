import { Link } from 'react-router-dom';
import { SeoHead, SITE_URL } from '../components/SeoHead';

export function PrivacyPolicyPage() {
  const origin = SITE_URL;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy | SmartGrow Tools',
      url: `${origin}/privacy-policy`,
      description:
        'Read the SmartGrow Tools Privacy Policy covering browser-local processing, Google Analytics 4, Google AdSense cookies, and user privacy rights.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${origin}/privacy-policy` },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title="Privacy Policy & Cookie Disclosures | SmartGrow Tools"
        description="Read the SmartGrow Tools Privacy Policy covering browser-local processing, Google Analytics 4, Google AdSense cookies, and user privacy rights."
        path="/privacy-policy"
        structuredData={structuredData}
      />

      <article className="bg-white">
        <header className="border-b border-slate-200 bg-slate-50/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
            <div className="text-xs font-semibold text-blue-700 mb-2">Legal</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: November 2026</p>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              This Privacy Policy explains how SmartGrow Tools handles information when you use our browser-based SEO, social media, content writing, marketing calculator, and PDF document utilities, as well as how analytics and advertising services such as Google Analytics and Google AdSense operate on this website.
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-12 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              1. Local Browser Processing
            </h2>
            <p>
              SmartGrow Tools is designed so that all text inputs, meta tag drafts, keyword lists, character counts, paid media calculations, and PDF files (including documents, images, signatures, passwords, and OCR scans) are processed directly inside your web browser. We do not upload, transmit, or store the files or content you enter into our marketing generators, counters, calculators, or PDF tools on external servers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              2. Account &amp; Payment Information
            </h2>
            <p>
              SmartGrow Tools does not require user accounts, subscriptions, or billing information. We do not collect payment card numbers, passwords, or personal account credentials.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              3. Contact Inquiries
            </h2>
            <p>
              If you choose to reach out via email at{' '}
              <a href="mailto:hello@smartgrowtools.com" className="text-blue-700 hover:underline">
                hello@smartgrowtools.com
              </a>{' '}
              or submit an inquiry through our{' '}
              <Link to="/contact" className="text-blue-700 hover:underline">
                Contact Us
              </Link>{' '}
              page, your name, email address, and message are used solely to respond to your question or feedback.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              4. Standard Hosting Logs &amp; Third-Party Links
            </h2>
            <p>
              Like standard web servers, our hosting infrastructure may record basic technical request metadata (such as IP address, browser type, referring page, and requested URL path) for security, diagnostics, and uptime maintenance. Our educational articles may reference external standards or documentation; we are not responsible for the privacy practices of external websites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              5. Google Analytics (GA4)
            </h2>
            <p>
              SmartGrow Tools uses Google Analytics 4 (GA4), a web analytics service provided by Google, to understand aggregated site traffic and improve tool performance and educational content. When you visit pages on our site, Google Analytics collects standard usage telemetry such as page views, navigation paths, referral sources, browser and device type, and approximate geographic region using first-party cookies and similar browser identifiers.
            </p>
            <p className="mt-3">
              Google Analytics does not read, collect, or store the text, keywords, titles, descriptions, hashtags, or metrics you enter into our browser-based generators, counters, or calculators. You can learn more about how Google processes analytics data in{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Google&apos;s Privacy &amp; Terms for Partner Sites
              </a>{' '}
              or opt out across websites using the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              6. Google AdSense &amp; Google Advertising Technology
            </h2>
            <p>
              To keep our utilities free to use, SmartGrow Tools may display advertisements served by Google AdSense and Google-certified advertising partners. Google acts as a third-party vendor and uses advertising cookies and similar technologies (such as web beacons or device identifiers) to serve, measure, and improve ads shown on this website.
            </p>
            <p className="mt-3">
              Google&apos;s use of advertising cookies enables Google and its partners to serve ads to visitors based on their visits to SmartGrow Tools and/or other websites across the internet. You can review how Google uses information from sites or apps that use its services in{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Google&apos;s Privacy &amp; Terms for Partner Sites
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Google Advertising Technologies
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              7. Third-Party Advertising Cookies
            </h2>
            <p>
              Third-party ad servers, ad networks, or measurement providers participating in advertising delivery may place or read cookies, JavaScript tags, or web beacons in your browser when advertisements are displayed. These technologies automatically receive standard technical signals such as your IP address, browser user agent, and viewport dimensions to measure ad performance, prevent invalid traffic, and support ad delivery.
            </p>
            <p className="mt-3">
              SmartGrow Tools does not have direct access to or control over the cookies set by third-party advertising networks, and this Privacy Policy does not govern how third-party advertisers process data under their own policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              8. Personalized and Non-Personalized Ads
            </h2>
            <p>
              Depending on your region, consent choices, and browser settings, advertisements served through Google AdSense may be either personalized or non-personalized:
            </p>
            <ul className="mt-3 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Personalized Ads:</strong> Selected using cookies and prior browsing activity across participating websites to show advertisements more relevant to your inferred interests, provided such personalization is permitted by applicable law and your consent settings.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Non-Personalized Ads:</strong> Delivered using contextual information—such as the topic of the page you are viewing, current search terms, and coarse general location (such as city or region)—rather than past behavioral profiling. Even when non-personalized ads are served, cookies or local identifiers may still be used for frequency capping, aggregated ad reporting, and fraud prevention.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              9. How to Manage Cookie, Analytics &amp; Ad Preferences
            </h2>
            <p>
              You have several options to control analytics measurement, cookies, and advertising personalization:
            </p>
            <ul className="mt-3 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Google Ad Controls:</strong> You can manage or opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://myadcenter.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Google My Ad Center
                  </a>{' '}
                  (or{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Google Ads Settings
                  </a>
                  ).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Industry Opt-Out Tools:</strong> You can opt out of interest-based advertising from participating third-party vendors via the{' '}
                  <a
                    href="https://optout.networkadvertising.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Network Advertising Initiative (NAI)
                  </a>
                  , the{' '}
                  <a
                    href="https://optout.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Digital Advertising Alliance (DAA)
                  </a>
                  , or, for visitors in Europe,{' '}
                  <a
                    href="https://www.youronlinechoices.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Your Online Choices (EDAA)
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Google Analytics Opt-Out:</strong> You can prevent Google Analytics from collecting usage data in your browser by installing the{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Browser Cookie Settings:</strong> Most web browsers allow you to block third-party cookies, clear existing cookies, or configure site-by-site permissions in their privacy settings. Blocking cookies will not prevent SmartGrow Tools&apos; client-side generators, counters, or calculators from functioning.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              10. Applicable Privacy Rights
            </h2>
            <p>
              Depending on where you live—including under the European Union / UK General Data Protection Regulation (GDPR / UK GDPR), the California Consumer Privacy Act as amended by the California Privacy Rights Act (CCPA/CPRA), and other applicable regional privacy laws—you may have rights regarding personal information processed in connection with your visit:
            </p>
            <ul className="mt-3 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Access, Correction, and Deletion:</strong> Because our tools do not require registration and process inputs locally in your browser, we generally do not hold personal data about visitors unless you have contacted us directly by email. If you have sent us an inquiry, you may request access to, correction of, or deletion of that correspondence at any time.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">Consent &amp; Objection (EEA / UK / Switzerland):</strong> Where analytics, advertising, or non-essential cookies rely on your consent, you have the right to withhold or withdraw consent without affecting access to our core browser tools, as well as the right to object to certain processing or lodge a complaint with a relevant data protection supervisory authority.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-2.5" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-slate-900">California &amp; U.S. State Privacy Rights:</strong> SmartGrow Tools does not sell personal information in exchange for money. However, third-party advertising cookies used for personalized ads may be considered &ldquo;sharing&rdquo; for cross-context behavioral advertising under certain state laws. You can opt out using the ad and cookie preference controls listed in Section 9.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2.5">
              11. Children&apos;s Privacy &amp; Policy Updates
            </h2>
            <p>
              SmartGrow Tools is intended for general professional and educational audiences and is not directed to children under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children.
            </p>
            <p className="mt-3">
              We may update this Privacy Policy from time to time to reflect changes in our tools, analytics or advertising partners, or legal obligations. Any updates will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-200 space-y-2">
            <h2 className="font-display text-lg font-bold text-slate-900">
              12. Contact Details
            </h2>
            <p className="text-sm text-slate-600">
              If you have questions about this Privacy Policy, cookie disclosures, or a privacy rights request, please email us at{' '}
              <a href="mailto:hello@smartgrowtools.com" className="text-blue-700 font-medium hover:underline">
                hello@smartgrowtools.com
              </a>{' '}
              or reach out through our{' '}
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
