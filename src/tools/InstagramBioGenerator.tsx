import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type BioStyle = 'minimal' | 'structured' | 'brand' | 'creator';

export function InstagramBioGenerator() {
  const [name, setName] = useState('Maya Lin');
  const [handle, setHandle] = useState('mayalin.studio');
  const [role, setRole] = useState('Product & Brand Designer');
  const [valueProp, setValueProp] = useState('Weekly UI teardown notes & design systems');
  const [detail, setDetail] = useState('Based in Seattle');
  const [cta, setCta] = useState('Free Figma checklist below');
  const [style, setStyle] = useState<BioStyle>('structured');
  const [activeBio, setActiveBio] = useState(
    'Product & Brand Designer\nWeekly UI teardown notes & design systems\nBased in Seattle\nFree Figma checklist below'
  );

  const variations = useMemo(() => {
    const r = role.trim() || 'Digital Creator';
    const v = valueProp.trim() || 'Practical tips & resources';
    const d = detail.trim();
    const c = cta.trim() || 'Explore the latest guide below';

    const clampBio = (raw: string) =>
      raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n');

    const mapByStyle: Record<BioStyle, string[]> = {
      minimal: [
        clampBio(`${r}\n${v}\n${c}`),
        clampBio(`${r}${d ? ` · ${d}` : ''}\n${v}\n${c}`),
        clampBio(`${v}\n${r}\n${c}`),
        clampBio(`${r} helping you with ${v.toLowerCase()}\n${c}`),
      ],
      structured: [
        clampBio(`${r}\n${v}\n${d}\n${c}`),
        clampBio(`${r}\nFocus: ${v}\n${d ? `Location: ${d}\n` : ''}${c}`),
        clampBio(`What I share: ${v}\n${r}${d ? ` | ${d}` : ''}\n${c}`),
        clampBio(`${r}${d ? ` — ${d}` : ''}\n${v}\nLink: ${c}`),
      ],
      brand: [
        clampBio(`${r}\nBuilt for ${v.toLowerCase()}\n${d}\n${c}`),
        clampBio(`${v}\n${r}${d ? ` · ${d}` : ''}\n${c}`),
        clampBio(`Official page | ${r}\n${v}\n${c}`),
        clampBio(`${r}\n${d}\n${v}\n${c}`),
      ],
      creator: [
        clampBio(`${r} | ${d || 'Sharing daily'}\n${v}\n${c}`),
        clampBio(`Sharing ${v.toLowerCase()}\n${r}\n${c}`),
        clampBio(`${r}\nNew guides on ${v.toLowerCase()}\n${c}`),
        clampBio(`${d ? `${d} · ` : ''}${r}\n${v}\n${c}`),
      ],
    };

    return Array.from(new Set(mapByStyle[style]));
  }, [role, valueProp, detail, cta, style]);

  const charCount = activeBio.length;
  const remaining = 150 - charCount;
  const isOver = remaining < 0;

  const handleReset = () => {
    setName('Maya Lin');
    setHandle('mayalin.studio');
    setRole('Product & Brand Designer');
    setValueProp('Weekly UI teardown notes & design systems');
    setDetail('Based in Seattle');
    setCta('Free Figma checklist below');
    setStyle('structured');
    setActiveBio(
      'Product & Brand Designer\nWeekly UI teardown notes & design systems\nBased in Seattle\nFree Figma checklist below'
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">Profile Details</h2>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ig-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Display Name
            </label>
            <input
              id="ig-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="ig-handle" className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              id="ig-handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/\s+/g, '').toLowerCase())}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ig-role" className="block text-xs font-semibold text-slate-700 mb-1">
            Role, Niche, or Brand Category
          </label>
          <input
            id="ig-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ig-value" className="block text-xs font-semibold text-slate-700 mb-1">
            What You Share or Offer
          </label>
          <input
            id="ig-value"
            type="text"
            value={valueProp}
            onChange={(e) => setValueProp(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ig-detail" className="block text-xs font-semibold text-slate-700 mb-1">
            Location or Context (Optional)
          </label>
          <input
            id="ig-detail"
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ig-cta" className="block text-xs font-semibold text-slate-700 mb-1">
            Link Call to Action
          </label>
          <input
            id="ig-cta"
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Layout Format</span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                ['minimal', 'Clean Minimal'],
                ['structured', 'Line Breaks'],
                ['brand', 'Brand & Store'],
                ['creator', 'Creator'],
              ] as [BioStyle, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStyle(key)}
                className={`py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  style === key
                    ? 'bg-white text-purple-700 shadow-xs'
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
              Mobile Profile Preview & Editor
            </h2>
            <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums">
              <span className={isOver ? 'text-rose-700 font-semibold' : 'text-slate-600'}>
                {charCount} / 150 chars
              </span>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <span className={`font-sans font-semibold ${isOver ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isOver ? `${Math.abs(remaining)} over limit` : `${remaining} remaining`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="text-xs font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-200">
                @{handle || 'username'}
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
                  {(name.trim().charAt(0) || 'S').toUpperCase()}
                </div>
                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-900 text-sm">{name || 'Display Name'}</div>
                  <div>Profile Preview</div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed min-h-[72px]">
                {activeBio || 'Select or type a bio to preview how line breaks appear.'}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="ig-editor" className="block text-xs font-semibold text-slate-700">
                Customize Bio Text
              </label>
              <textarea
                id="ig-editor"
                rows={5}
                value={activeBio}
                onChange={(e) => setActiveBio(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none ${
                  isOver
                    ? 'border-rose-400 focus:border-rose-600'
                    : 'border-slate-300 focus:border-purple-600'
                }`}
              />
              <div className="flex justify-end">
                <CopyButton text={activeBio} label="Copy Bio" variant="primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">
              Generated Bio Layouts
            </h2>
            <span className="text-xs text-slate-500">Click any option to preview</span>
          </div>

          <ul className="divide-y divide-slate-200">
            {variations.map((item) => {
              const len = item.length;
              return (
                <li
                  key={item}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveBio(item)}
                    className="text-left flex-1 min-w-0 group"
                  >
                    <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed group-hover:text-purple-700 transition-colors">
                      {item}
                    </p>
                    <div className="mt-1.5 text-xs font-mono tabular-nums text-slate-500">
                      {len} / 150 chars{' '}
                      <span className={`font-sans font-medium ${len <= 150 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        · {len <= 150 ? 'Fits Instagram limit' : 'Exceeds 150 chars'}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveBio(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 transition-colors"
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
