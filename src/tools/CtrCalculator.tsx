import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type CtrMode = 'ctr' | 'clicks' | 'impressions';

function parseNum(val: string): number {
  const n = parseFloat(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function CtrCalculator() {
  const [mode, setMode] = useState<CtrMode>('ctr');
  const [impressions, setImpressions] = useState('25000');
  const [clicks, setClicks] = useState('875');
  const [targetCtr, setTargetCtr] = useState('3.5');
  const [cvrPct, setCvrPct] = useState('3.0');

  const results = useMemo(() => {
    const impVal = parseNum(impressions);
    const clickVal = parseNum(clicks);
    const ctrVal = parseNum(targetCtr);
    const cvr = parseNum(cvrPct);

    let effectiveImpressions = impVal;
    let effectiveClicks = clickVal;
    let effectiveCtr = ctrVal;

    if (mode === 'ctr') {
      effectiveCtr = impVal > 0 ? (clickVal / impVal) * 100 : 0;
    } else if (mode === 'clicks') {
      effectiveClicks = impVal * (ctrVal / 100);
    } else {
      effectiveImpressions = ctrVal > 0 ? (clickVal / ctrVal) * 100 : 0;
    }

    const baseConversions = effectiveClicks * (cvr / 100);
    const liftHalfPctClicks = effectiveImpressions * ((effectiveCtr + 0.5) / 100);
    const liftOnePctClicks = effectiveImpressions * ((effectiveCtr + 1.0) / 100);

    return {
      effectiveImpressions,
      effectiveClicks,
      effectiveCtr,
      baseConversions,
      liftHalfExtraClicks: Math.max(0, liftHalfPctClicks - effectiveClicks),
      liftHalfConversions: liftHalfPctClicks * (cvr / 100),
      liftOneExtraClicks: Math.max(0, liftOnePctClicks - effectiveClicks),
      liftOneConversions: liftOnePctClicks * (cvr / 100),
    };
  }, [mode, impressions, clicks, targetCtr, cvrPct]);

  const summaryText = `CTR Calculation Summary
- Impressions: ${Math.round(results.effectiveImpressions).toLocaleString()}
- Clicks: ${Math.round(results.effectiveClicks).toLocaleString()}
- Click-Through Rate (CTR): ${results.effectiveCtr.toFixed(2)}%
- Estimated Conversions (${parseNum(cvrPct)}% CVR): ${results.baseConversions.toFixed(1)}`;

  const handleReset = () => {
    setMode('ctr');
    setImpressions('25000');
    setClicks('875');
    setTargetCtr('3.5');
    setCvrPct('3.0');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">CTR Parameters</h2>
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
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Solve For</span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                ['ctr', 'CTR (%)'],
                ['clicks', 'Expected Clicks'],
                ['impressions', 'Impressions'],
              ] as [CtrMode, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  mode === key
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mode !== 'impressions' && (
            <div>
              <label htmlFor="ctr-imp" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Impressions
              </label>
              <input
                id="ctr-imp"
                type="number"
                min="0"
                step="1"
                value={impressions}
                onChange={(e) => setImpressions(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}

          {mode !== 'clicks' && (
            <div>
              <label htmlFor="ctr-clicks" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Clicks
              </label>
              <input
                id="ctr-clicks"
                type="number"
                min="0"
                step="1"
                value={clicks}
                onChange={(e) => setClicks(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}

          {mode !== 'ctr' && (
            <div>
              <label htmlFor="ctr-target" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target CTR (%)
              </label>
              <input
                id="ctr-target"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={targetCtr}
                onChange={(e) => setTargetCtr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label htmlFor="ctr-cvr" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Landing Page Conversion Rate (%)
            </label>
            <input
              id="ctr-cvr"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={cvrPct}
              onChange={(e) => setCvrPct(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1.5">
          <div className="font-semibold text-slate-800">Channel Reference Context</div>
          <p className="leading-relaxed">
            Typical click-through rates vary widely by placement: brand search queries often exceed 5%, while broad display placements commonly range between 0.3% and 1.2%.
          </p>
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-bold text-slate-900">CTR Output</h2>
            <CopyButton text={summaryText} label="Copy Summary" variant="primary" />
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-5">
            <div className="text-xs font-medium text-slate-500">
              {mode === 'ctr'
                ? 'Click-Through Rate (CTR)'
                : mode === 'clicks'
                  ? 'Expected Clicks'
                  : 'Required Impressions'}
            </div>
            <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold text-blue-700 tabular-nums">
              {mode === 'ctr'
                ? `${results.effectiveCtr.toFixed(2)}%`
                : mode === 'clicks'
                  ? Math.round(results.effectiveClicks).toLocaleString()
                  : Math.round(results.effectiveImpressions).toLocaleString()}
            </div>
            <div className="mt-2 text-xs font-mono text-slate-500">
              {mode === 'ctr' && 'Formula: (Total Clicks ÷ Total Impressions) × 100'}
              {mode === 'clicks' && 'Formula: Impressions × (Target CTR ÷ 100)'}
              {mode === 'impressions' && 'Formula: (Total Clicks ÷ Target CTR) × 100'}
            </div>
          </div>

          <h3 className="text-xs font-semibold text-slate-800 mb-3">
            CTR Improvement Lift Simulator (Same Impressions)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-medium">Scenario</th>
                  <th className="py-2.5 px-3 text-right font-medium">CTR</th>
                  <th className="py-2.5 px-3 text-right font-medium">Extra Clicks</th>
                  <th className="py-2.5 px-3 text-right font-medium">Est. Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Current Baseline</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                    {results.effectiveCtr.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500">
                    0
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 font-medium">
                    {results.baseConversions.toFixed(1)}
                  </td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="py-2.5 px-3 font-medium text-blue-800">+0.5% CTR Lift</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-blue-800">
                    {(results.effectiveCtr + 0.5).toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700">
                    +{Math.round(results.liftHalfExtraClicks).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 font-medium">
                    {results.liftHalfConversions.toFixed(1)}
                  </td>
                </tr>
                <tr className="bg-purple-50/30">
                  <td className="py-2.5 px-3 font-medium text-purple-800">+1.0% CTR Lift</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-purple-800">
                    {(results.effectiveCtr + 1.0).toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700">
                    +{Math.round(results.liftOneExtraClicks).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 font-medium">
                    {results.liftOneConversions.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
