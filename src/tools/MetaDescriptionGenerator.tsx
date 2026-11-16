import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type IntentType = 'informational' | 'commercial' | 'tool' | 'service';

function getDescriptionStatus(chars: number) {
  if (chars === 0) return { label: 'Empty', tone: 'text-slate-600' };
  if (chars < 110) return { label: 'Short — Room for Detail', tone: 'text-amber-700' };
  if (chars <= 160) return { label: 'Optimal Length', tone: 'text-emerald-700' };
  return { label: 'Over 160 Chars (May Truncate)', tone: 'text-rose-700' };
}

export function MetaDescriptionGenerator() {
  const [keyword, setKeyword] = useState('CRM Software for Small Teams');
  const [benefit, setBenefit] = useState('organize client pipelines, automate follow-ups, and track deals');
  const [audience, setAudience] = useState('growing service businesses');
  const [cta, setCta] = useState('Compare features and start organizing your pipeline today.');
  const [intent, setIntent] = useState<IntentType>('commercial');
  const [previewDesc, setPreviewDesc] = useState(
    'Looking for CRM Software for Small Teams? Learn how to organize client pipelines, automate follow-ups, and track deals for growing service businesses.'
  );
  const [previewTitle, setPreviewTitle] = useState('CRM Software for Small Teams | Comparison & Setup Guide');

  const descriptions = useMemo(() => {
    const kw = keyword.trim() || 'your topic';
    const ben = benefit.trim() || 'save time and improve day-to-day workflows';
    const aud = audience.trim() || 'teams and creators';
    const action = cta.trim() || 'Explore the full breakdown today.';

    const byIntent: Record<IntentType, string[]> = {
      informational: [
        `Learn how ${kw} works in practice. Discover clear steps to ${ben} designed for ${aud}. ${action}`,
        `A practical guide to ${kw}: explore real workflows to ${ben} without unnecessary complexity. ${action}`,
        `Everything ${aud} need to know about ${kw}. Read proven strategies to ${ben}. ${action}`,
        `Understand ${kw} from start to finish. See clear examples showing how to ${ben}. ${action}`,
        `Explore actionable tips for ${kw} so ${aud} can ${ben} consistently. ${action}`,
        `Step-by-step insights on ${kw} built to help ${aud} ${ben}. ${action}`,
      ],
      commercial: [
        `Looking for ${kw}? Discover how to ${ben} for ${aud}. ${action}`,
        `Evaluate ${kw} options built for ${aud}. See how the right setup helps you ${ben}. ${action}`,
        `Compare key approaches to ${kw} so ${aud} can ${ben} with confidence. ${action}`,
        `Find a better approach to ${kw}. Built for ${aud} ready to ${ben}. ${action}`,
        `See what separates effective ${kw} setups. Help ${aud} ${ben} faster. ${action}`,
        `Choosing ${kw} for ${aud}? Review core capabilities to ${ben}. ${action}`,
      ],
      tool: [
        `Use our free ${kw} utility right in your browser. Instantly ${ben}—built for ${aud}. ${action}`,
        `Fast, no-signup ${kw} workspace designed for ${aud} who want to ${ben}. ${action}`,
        `Run instant calculations and formatting for ${kw}. Ideal for ${aud} looking to ${ben}. ${action}`,
        `Simplify ${kw} with a browser-based tool that helps ${aud} ${ben}. ${action}`,
        `Save manual effort on ${kw}. Built for ${aud} to ${ben} in seconds. ${action}`,
        `Free online ${kw} workflow: quickly ${ben} with clear live previews. ${action}`,
      ],
      service: [
        `Work with specialists in ${kw} to help ${aud} ${ben}. ${action}`,
        `Reliable ${kw} support tailored for ${aud}. Our process helps you ${ben}. ${action}`,
        `Need dependable ${kw} guidance? See how we help ${aud} ${ben}. ${action}`,
        `Structured ${kw} consulting for ${aud} focused on helping you ${ben}. ${action}`,
        `Partner on ${kw} initiatives designed to help ${aud} ${ben}. ${action}`,
        `Transparent ${kw} services built around helping ${aud} ${ben}. ${action}`,
      ],
    };

    return byIntent[intent].map((item) => item.replace(/\s+/g, ' ').trim());
  }, [keyword, benefit, audience, cta, intent]);

  const charCount = previewDesc.length;
  const status = getDescriptionStatus(charCount);
  const progressPct = Math.min(100, Math.round((charCount / 170) * 100));

  const handleReset = () => {
    setKeyword('CRM Software for Small Teams');
    setBenefit('organize client pipelines, automate follow-ups, and track deals');
    setAudience('growing service businesses');
    setCta('Compare features and start organizing your pipeline today.');
    setIntent('commercial');
    setPreviewDesc(
      'Looking for CRM Software for Small Teams? Learn how to organize client pipelines, automate follow-ups, and track deals for growing service businesses.'
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">Snippet Inputs</h2>
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
          <label htmlFor="md-keyword" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Primary Keyword / Page Topic
          </label>
          <input
            id="md-keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., Technical SEO Audit"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="md-benefit" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Core Value / Action Phrase
          </label>
          <input
            id="md-benefit"
            type="text"
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            placeholder="e.g., find crawl errors and speed bottlenecks"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="md-audience" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Audience
          </label>
          <input
            id="md-audience"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., SaaS marketing teams"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="md-cta" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Call to Action Sentence
          </label>
          <input
            id="md-cta"
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g., Read the full checklist."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Page Intent</span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                ['informational', 'Guide / Article'],
                ['commercial', 'Comparison / Page'],
                ['tool', 'Free Tool / App'],
                ['service', 'Service / Agency'],
              ] as [IntentType, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setIntent(value)}
                className={`py-2 px-2.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  intent === value
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-base font-bold text-slate-900">
              Live Search Snippet Tester
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
              <span className="text-slate-600">{charCount} / 160 chars</span>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <span className={`font-sans font-semibold ${status.tone}`}>{status.label}</span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div
              className={`h-full transition-all duration-200 ${
                charCount >= 110 && charCount <= 160
                  ? 'bg-emerald-600'
                  : charCount > 160
                    ? 'bg-rose-600'
                    : 'bg-amber-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 mb-5">
            <div className="text-xs text-slate-600 mb-1">https://example.com/guide</div>
            <div
              className="text-lg text-[#1a0dab] leading-snug mb-1"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {previewTitle}
            </div>
            <div
              className="text-sm text-[#4d5156] leading-relaxed"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {previewDesc.length > 160 ? (
                <>
                  <span>{previewDesc.slice(0, 158)}</span>
                  <span className="bg-rose-100 text-rose-800 px-0.5 rounded-xs">
                    {previewDesc.slice(158)}
                  </span>
                </>
              ) : (
                previewDesc || 'Your meta description preview appears here.'
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="md-preview-title" className="block text-xs font-medium text-slate-600 mb-1">
                Preview Title
              </label>
              <input
                id="md-preview-title"
                type="text"
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="md-live-edit" className="block text-xs font-medium text-slate-600 mb-1">
                Edit Description Directly
              </label>
              <textarea
                id="md-live-edit"
                rows={3}
                value={previewDesc}
                onChange={(e) => setPreviewDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <CopyButton text={previewDesc} label="Copy Description" variant="primary" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">
              Generated Variations
            </h2>
            <span className="text-xs text-slate-500">Click to load into tester</span>
          </div>

          <ul className="divide-y divide-slate-200">
            {descriptions.map((item) => {
              const len = item.length;
              const itemStatus = getDescriptionStatus(len);
              return (
                <li key={item} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <button
                    type="button"
                    onClick={() => setPreviewDesc(item)}
                    className="text-left flex-1 min-w-0 group"
                  >
                    <p className="text-sm text-slate-800 leading-relaxed group-hover:text-blue-700 transition-colors">
                      {item}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                      <span>{len} chars</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-sans font-medium ${itemStatus.tone}`}>
                        {itemStatus.label}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDesc(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      Edit
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
