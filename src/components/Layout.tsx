import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { CATEGORIES } from '../data/tools';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  const navItems = [
    ...CATEGORIES.map((c) => ({ label: c.navLabel, to: c.path })),
    { label: 'Articles', to: '/articles' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors"
          >
            SmartGrow Tools
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-blue-700 border-blue-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/tools"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              All Tools
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <nav aria-label="Mobile Navigation" className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <Link
                  to="/tools"
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Browse All 10 Tools
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-slate-50/60 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <Link
                to="/"
                className="font-display text-lg font-bold tracking-tight text-slate-900 inline-block"
              >
                SmartGrow Tools
              </Link>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs">
                Free browser-based SEO generators, social copy utilities, editorial counters, and marketing calculators built for clarity and speed.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Tool Categories</h2>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={category.path}
                      className="hover:text-blue-700 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/tools" className="hover:text-blue-700 transition-colors">
                    All Tools Directory
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Popular Utilities</h2>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <Link
                    to="/tools/meta-title-generator"
                    className="hover:text-blue-700 transition-colors"
                  >
                    Meta Title Generator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools/keyword-generator"
                    className="hover:text-blue-700 transition-colors"
                  >
                    Keyword Generator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools/word-counter"
                    className="hover:text-blue-700 transition-colors"
                  >
                    Word Counter
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools/cpc-calculator"
                    className="hover:text-blue-700 transition-colors"
                  >
                    CPC Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools/ctr-calculator"
                    className="hover:text-blue-700 transition-colors"
                  >
                    CTR Calculator
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Resources & Legal</h2>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <Link to="/articles" className="hover:text-blue-700 transition-colors">
                    Educational Articles
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-blue-700 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-700 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-blue-700 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="hover:text-blue-700 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} SmartGrow Tools. All calculations run locally in your browser.</p>
            <div className="flex items-center gap-5">
              <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">
                Privacy
              </Link>
              <Link to="/terms-and-conditions" className="hover:text-slate-800 transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-slate-800 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
