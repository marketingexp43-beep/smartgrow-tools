import { useMemo, useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type PageFormat = 'guide' | 'listicle' | 'comparison' | 'product' | 'service' | 'checklist';
type ToneStyle = 'clear' | 'action' | 'authoritative';

const FORMAT_LABELS: Record<PageFormat, string> = {
  guide: 'How-To Guide',
  listicle: 'Curated List',
  comparison: 'Comparison / Review',
  product: 'Product / Tool Page',
  service: 'Service Landing Page',
  checklist: 'Checklist / Template',
};

function estimateTitlePixelWidth(text: string): number {
  let width = 0;
  for (const ch of text) {
    if ('WM@'.includes(ch)) width += 14;
    else if ('ABCDEFGHKNOPQRSTUVXYZmw'.includes(ch)) width += 10.5;
    else if ('ilIjtfr1|!.,:\'" '.includes(ch)) width += 4.5;
    else width += 8.2;
  }
  return Math.round(width);
}

function getTitleStatus(chars: number, pixels: number) {
  if (chars === 0) return { label: 'Empty', tone: 'text-slate-600' };
  if (chars < 30) return { label: 'Too Short — Add Context', tone: 'text-amber-700' };
  if (chars <= 60 && pixels <= 580) return { label: 'Optimal Length', tone: 'text-emerald-700' };
  return { label: 'May Truncate in SERP', tone: 'text-rose-700' };
}

function toTitleCase(input: string): string {
  const minor = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);
  return input
    .trim()
    .split(/\s+/)
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx > 0 && minor.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function MetaTitleGenerator() {
  const [keyword, setKeyword] = useState('Email Marketing Software');
  const [brand, setBrand] = useState('SmartGrow');
  const [separator, setSeparator] = useState<'|' | '-' | '—' | ':'>('|');
  const [format, setFormat] = useState<PageFormat>('guide');
  const [tone, setTone] = useState<ToneStyle>('clear');
  const [includeYear, setIncludeYear] = useState(true);
  const [variantSeed, setVariantSeed] = useState(0);
  const [previewTitle, setPreviewTitle] = useState(
    'Email Marketing Software: Practical Setup Guide (2026) | SmartGrow'
  );
  const [previewUrl, setPreviewUrl] = useState('https://example.com/email-marketing-software');

  const variations = useMemo(() => {
    const cleanKw = toTitleCase(keyword || 'Your Target Keyword');
    const cleanBrand = brand.trim();
    const year = includeYear ? ` (${new Date().getFullYear()})` : '';
    const yearTag = includeYear ? ` in ${new Date().getFullYear()}` : '';
    const suffix = cleanBrand ? ` ${separator} ${cleanBrand}` : '';

    const templatesByFormat: Record<PageFormat, string[]> = {
      guide: [
        `${cleanKw}: Complete Practical Guide${year}${suffix}`,
        `How to Choose ${cleanKw}${yearTag}${suffix}`,
        `${cleanKw} Explained: Steps, Examples & Tips${suffix}`,
        `A Beginner-to-Pro Guide to ${cleanKw}${suffix}`,
        `${cleanKw} Best Practices for Better Results${year}${suffix}`,
        `Mastering ${cleanKw}: Strategy & Setup${suffix}`,
      ],
      listicle: [
        `Best ${cleanKw} Options Compared${year}${suffix}`,
        `Top ${cleanKw} Picks for Growing Teams${suffix}`,
        `${cleanKw}: Key Features & Standout Choices${year}${suffix}`,
        `10 Practical ${cleanKw} Strategies Worth Testing${suffix}`,
        `Essential ${cleanKw} Tools & Workflows${year}${suffix}`,
        `Curated ${cleanKw} Solutions for Small Businesses${suffix}`,
      ],
      comparison: [
        `${cleanKw} Comparison: Features, Pricing & Fit${year}${suffix}`,
        `Comparing Top ${cleanKw} Platforms Side by Side${suffix}`,
        `Which ${cleanKw} Fits Your Workflow? Honest Breakdown${suffix}`,
        `${cleanKw} Pros, Cons & Real Trade-Offs${year}${suffix}`,
        `How to Evaluate ${cleanKw} Before You Commit${suffix}`,
        `${cleanKw} Alternatives & Buyer Checklist${year}${suffix}`,
      ],
      product: [
        `${cleanKw} — Fast, Simple & Built for Teams${suffix}`,
        `Free ${cleanKw} Online: Instant Results${suffix}`,
        `${cleanKw} Built for Modern Workflows${suffix}`,
        `Try ${cleanKw} Without Complex Setup${suffix}`,
        `${cleanKw}: Features, Workflow & Live Preview${suffix}`,
        `All-in-One ${cleanKw} for Everyday Use${suffix}`,
      ],
      service: [
        `${cleanKw} Services for Measurable Growth${suffix}`,
        `Dedicated ${cleanKw} Support & Strategy${suffix}`,
        `Reliable ${cleanKw} Tailored to Your Goals${suffix}`,
        `Partner With ${cleanKw} Specialists${suffix}`,
        `Custom ${cleanKw} Consulting & Audits${suffix}`,
        `${cleanKw} Solutions: Scope, Process & FAQ${suffix}`,
      ],
      checklist: [
        `${cleanKw} Checklist: Step-by-Step Review${year}${suffix}`,
        `The Complete ${cleanKw} Audit Template${suffix}`,
        `Printable ${cleanKw} Workflow & Readiness List${suffix}`,
        `Pre-Launch ${cleanKw} Checklist for Teams${year}${suffix}`,
        `${cleanKw} Framework: Free Editable Outline${suffix}`,
        `Essential ${cleanKw} Steps You Should Not Skip${suffix}`,
      ],
    };

    const toneAddons: Record<ToneStyle, string[]> = {
      clear: [
        `${cleanKw}: Overview & Key Takeaways${suffix}`,
        `Practical ${cleanKw} Reference Guide${year}${suffix}`,
      ],
      action: [
        `Start Using ${cleanKw} Effectively Today${suffix}`,
        `Improve Results With ${cleanKw}${yearTag}${suffix}`,
      ],
      authoritative: [
        `${cleanKw}: Standards, Benchmarks & Strategy${suffix}`,
        `The Definitive ${cleanKw} Field Manual${year}${suffix}`,
      ],
    };

    const pool = [...templatesByFormat[format], ...toneAddons[tone]];
    const rotated = pool.map((_, idx) => pool[(idx + variantSeed) % pool.length]);
    return Array.from(new Set(rotated));
  }, [keyword, brand, separator, format, tone, includeYear, variantSeed]);

  const activeTitle = previewTitle;
  const charCount = activeTitle.length;
  const pixelWidth = estimateTitlePixelWidth(activeTitle);
  const status = getTitleStatus(charCount, pixelWidth);
  const progressPct = Math.min(100, Math.round((charCount / 65) * 100));

  const handleReset = () => {
    setKeyword('Email Marketing Software');
    setBrand('SmartGrow');
    setSeparator('|');
    setFormat('guide');
    setTone('clear');
    setIncludeYear(true);
    setVariantSeed(0);
    setPreviewTitle('Email Marketing Software: Practical Setup Guide (2026) | SmartGrow');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">Title Parameters</h2>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div>
          <label htmlFor="mt-keyword" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Keyword or Topic
          </label>
          <input
            id="mt-keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., B2B Content Marketing"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="mt-brand" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Brand Name (Optional)
            </label>
            <input
              id="mt-brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g., Acme"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="mt-sep" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Separator
            </label>
            <select
              id="mt-sep"
              value={separator}
              onChange={(e) => setSeparator(e.target.value as '|' | '-' | '—' | ':')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="|">| (Pipe)</option>
              <option value="-">- (Hyphen)</option>
              <option value="—">— (Em Dash)</option>
              <option value=":">: (Colon)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="mt-format" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Page Format
          </label>
          <select
            id="mt-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as PageFormat)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
          >
            {Object.entries(FORMAT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Editorial Tone</span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {(['clear', 'action', 'authoritative'] as ToneStyle[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTone(option)}
                className={`py-2 px-2 rounded-md text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  tone === option
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-700 pt-1">
          <input
            type="checkbox"
            checked={includeYear}
            onChange={(e) => setIncludeYear(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span>Include current year ({new Date().getFullYear()}) in select titles</span>
        </label>

        <button
          type="button"
          onClick={() => {
            setVariantSeed((s) => s + 1);
            if (variations[1]) setPreviewTitle(variations[1]);
          }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 transition-colors"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Shuffle Title Order</span>
        </button>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-base font-bold text-slate-900">
              Live Google SERP Preview
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
              <span className="text-slate-600">{charCount} / 60 chars</span>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <span className="text-slate-600">~{pixelWidth} / 580 px</span>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <span className={`font-sans font-semibold ${status.tone}`}>{status.label}</span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div
              className={`h-full transition-all duration-200 ${
                charCount >= 30 && charCount <= 60 && pixelWidth <= 580
                  ? 'bg-emerald-600'
                  : charCount > 60 || pixelWidth > 580
                    ? 'bg-rose-600'
                    : 'bg-amber-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 mb-5">
            <div className="text-xs text-slate-600 truncate mb-1">{previewUrl}</div>
            <div
              className="text-lg sm:text-xl font-normal text-[#1a0dab] leading-snug break-words"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {activeTitle || 'Your page title preview appears here'}
            </div>
            <div
              className="mt-1 text-xs sm:text-sm text-[#4d5156] leading-relaxed"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Preview how your headline sits above the search snippet before publishing to your CMS.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="mt-live-edit" className="block text-xs font-medium text-slate-600 mb-1">
                Customize Selected Title
              </label>
              <input
                id="mt-live-edit"
                type="text"
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="mt-url-edit" className="block text-xs font-medium text-slate-600 mb-1">
                Preview URL
              </label>
              <input
                id="mt-url-edit"
                type="text"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <CopyButton text={previewTitle} label="Copy Selected Title" variant="primary" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">
              Generated Title Ideas
            </h2>
            <span className="text-xs text-slate-500">Click any option to preview</span>
          </div>

          <ul className="divide-y divide-slate-200">
            {variations.map((item) => {
              const len = item.length;
              const px = estimateTitlePixelWidth(item);
              const itemStatus = getTitleStatus(len, px);
              const isSelected = previewTitle === item;

              return (
                <li
                  key={item}
                  className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPreviewTitle(item)}
                    className="text-left flex-1 min-w-0 group"
                  >
                    <div className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                      <span>{len} chars</span>
                      <span aria-hidden="true">·</span>
                      <span>~{px}px</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-sans font-medium ${itemStatus.tone}`}>
                        {itemStatus.label}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewTitle(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors whitespace-nowrap"
                    >
                      Preview
                    </button>
                    <CopyButton text={item} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
