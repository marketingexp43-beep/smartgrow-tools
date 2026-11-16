/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SeoHead } from './components/SeoHead';

const CategoryPage = lazy(() =>
  import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage }))
);
const AllToolsPage = lazy(() =>
  import('./pages/AllToolsPage').then((m) => ({ default: m.AllToolsPage }))
);
const ToolDetailPage = lazy(() =>
  import('./pages/ToolDetailPage').then((m) => ({ default: m.ToolDetailPage }))
);
const ArticlesPage = lazy(() =>
  import('./pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage }))
);
const ArticleDetailPage = lazy(() =>
  import('./pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);

function PageLoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="h-8 w-64 rounded-lg bg-slate-100 animate-pulse" />
      <div className="h-4 w-96 max-w-full rounded-md bg-slate-100 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="h-44 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
        <div className="h-44 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
        <div className="h-44 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found | SmartGrow Tools"
        description="The page you requested could not be found on SmartGrow Tools."
        robots="noindex, follow"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-3 text-slate-600">
          The URL you visited does not exist. Return to the homepage or browse all 10 tools.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/tools"
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            All Tools
          </Link>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoadingSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/seo-tools" element={<CategoryPage categoryId="seo-tools" />} />
            <Route
              path="/social-media-tools"
              element={<CategoryPage categoryId="social-media-tools" />}
            />
            <Route
              path="/content-writing-tools"
              element={<CategoryPage categoryId="content-writing-tools" />}
            />
            <Route
              path="/marketing-calculators"
              element={<CategoryPage categoryId="marketing-calculators" />}
            />
            <Route path="/tools" element={<AllToolsPage />} />
            <Route path="/tools/:slug" element={<ToolDetailPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
