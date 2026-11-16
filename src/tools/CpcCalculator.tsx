import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type SolveMode = 'cpc' | 'clicks' | 'budget';

function parseNum(val: string): number {
  const n = parseFloat(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function CpcCalculator() {
  const [mode, setMode] = useState<SolveMode>('cpc');
  const [adSpend, setAdSpend] = useState('1500');
  const [clicks, setClicks] = useState('625');
  const [targetCpc, setTargetCpc] = useState('2.40');
  const [convRate, setConvRate] = useState('4.0');
  const [orderValue, setOrderValue] = useState('140');

  const results = useMemo(() => {
    const spendVal = parseNum(adSpend);
    const clicksVal = parseNum(clicks);
    const cpcVal = parseNum(targetCpc);
    const crPct = parseNum(convRate);
    const aovVal = parseNum(orderValue);

    let effectiveSpend = spendVal;
    let effectiveClicks = clicksVal;
    let effectiveCpc = cpcVal;

    if (mode === 'cpc') {
      effectiveCpc = clicksVal > 0 ? spendVal / clicksVal : 0;
    } else if (mode === 'clicks') {
      effectiveClicks = cpcVal > 0 ? spendVal / cpcVal : 0;
    } else {
      effectiveSpend = clicksVal * cpcVal;
    }

    const conversions = effectiveClicks * (crPct / 100);
    const cpa = conversions > 0 ? effectiveSpend / conversions : 0;
    const revenue = conversions * aovVal;
    const roas = effectiveSpend > 0 ? revenue / effectiveSpend : 0;
    const netReturn = revenue - effectiveSpend;

    return {
      effectiveSpend,
      effectiveClicks,
      effectiveCpc,
      conversions,
      cpa,
      revenue,
      roas,
      netReturn,
    };
  }, [mode, adSpend, clicks, targetCpc, convRate, orderValue]);

  const summaryText = `CPC Campaign Summary
- Ad Spend: $${results.effectiveSpend.toFixed(2)}
- Total Clicks: ${Math.round(results.effectiveClicks).toLocaleString()}
- Cost Per Click (CPC): $${results.effectiveCpc.toFixed(2)}
- Est. Conversions (${parseNum(convRate)}% CVR): ${results.conversions.toFixed(1)}
- Cost Per Acquisition (CPA): $${results.cpa.toFixed(2)}
- Projected Revenue: $${results.revenue.toFixed(2)}
- Projected ROAS: ${results.roas.toFixed(2)}x`;

  const applyPreset = (preset: 'search' | 'b2b') => {
    setMode('cpc');
    if (preset === 'search') {
      setAdSpend('1500');
      setClicks('625');
      setTargetCpc('2.40');
      setConvRate('4.0');
      setOrderValue('140');
    } else {
      setAdSpend('4000');
      setClicks('800');
      setTargetCpc('5.00');
      setConvRate('3.5');
      setOrderValue('450');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">Campaign Inputs</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('search')}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              Ecommerce Example
            </button>
            <button
              type="button"
              onClick={() => applyPreset('b2b')}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              B2B Example
            </button>
            <button
              type="button"
              onClick={() => applyPreset('search')}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 ml-1"
              aria-label="Reset calculator"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Solve For</span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                ['cpc', 'Cost Per Click'],
                ['clicks', 'Max Clicks'],
                ['budget', 'Required Budget'],
              ] as [SolveMode, string][]
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
          {mode !== 'budget' && (
            <div>
              <label htmlFor="cpc-spend" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Ad Spend ($)
              </label>
              <input
                id="cpc-spend"
                type="number"
                min="0"
                step="any"
                value={adSpend}
                onChange={(e) => setAdSpend(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}

          {mode !== 'clicks' && (
            <div>
              <label htmlFor="cpc-clicks" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Clicks
              </label>
              <input
                id="cpc-clicks"
                type="number"
                min="0"
                step="1"
                value={clicks}
                onChange={(e) => setClicks(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}

          {mode !== 'cpc' && (
            <div>
              <label htmlFor="cpc-target" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target / Average CPC ($)
              </label>
              <input
                id="cpc-target"
                type="number"
                min="0"
                step="0.01"
                value={targetCpc}
                onChange={(e) => setTargetCpc(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold text-slate-800 mb-3">
            Downstream Conversion & ROAS Simulator (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpc-cvr" className="block text-xs font-medium text-slate-600 mb-1.5">
                Landing Page Conversion Rate (%)
              </label>
              <input
                id="cpc-cvr"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={convRate}
                onChange={(e) => setConvRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="cpc-aov" className="block text-xs font-medium text-slate-600 mb-1.5">
                Average Order / Lead Value ($)
              </label>
              <input
                id="cpc-aov"
                type="number"
                min="0"
                step="any"
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-bold text-slate-900">Calculated Results</h2>
            <CopyButton text={summaryText} label="Copy Summary" variant="primary" />
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-5">
            <div className="text-xs font-medium text-slate-500">
              {mode === 'cpc'
                ? 'Cost Per Click (CPC)'
                : mode === 'clicks'
                  ? 'Estimated Total Clicks'
                  : 'Required Ad Budget'}
            </div>
            <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold text-purple-700 tabular-nums">
              {mode === 'cpc'
                ? `$${results.effectiveCpc.toFixed(2)}`
                : mode === 'clicks'
                  ? Math.round(results.effectiveClicks).toLocaleString()
                  : `$${results.effectiveSpend.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
            </div>
            <div className="mt-2 text-xs font-mono text-slate-500">
              {mode === 'cpc' && 'Formula: Total Ad Spend ÷ Total Clicks'}
              {mode === 'clicks' && 'Formula: Total Ad Spend ÷ Target CPC'}
              {mode === 'budget' && 'Formula: Desired Clicks × Target CPC'}
            </div>
          </div>

          <dl className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Total Ad Spend</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                ${results.effectiveSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Total Clicks</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {Math.round(results.effectiveClicks).toLocaleString()}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Estimated Conversions</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {results.conversions.toFixed(1)}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Cost Per Acquisition (CPA)</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                {results.cpa > 0 ? `$${results.cpa.toFixed(2)}` : '—'}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Projected Revenue</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                ${results.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Return on Ad Spend (ROAS)</dt>
              <dd className="font-mono font-semibold text-blue-700 tabular-nums">
                {results.roas.toFixed(2)}x
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-slate-600">Net Return (Revenue − Spend)</dt>
              <dd
                className={`font-mono font-semibold tabular-nums ${
                  results.netReturn >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {results.netReturn >= 0 ? '+' : '-'}$
                {Math.abs(results.netReturn).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
