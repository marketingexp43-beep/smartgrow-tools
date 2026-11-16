import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type IntentBucket = 'all' | 'informational' | 'commercial' | 'comparison' | 'transactional';

interface KeywordIdea {
  phrase: string;
  intent: Exclude<IntentBucket, 'all'>;
  wordCount: number;
  suggestedPage: string;
}

const INTENT_LABELS: Record<Exclude<IntentBucket, 'all'>, string> = {
  informational: 'Informational',
  commercial: 'Commercial',
  comparison: 'Comparison',
  transactional: 'Transactional',
};

export function KeywordGenerator() {
  const [seed, setSeed] = useState('email marketing');
  const [qualifier, setQualifier] = useState('small business');
  const [intentFilter, setIntentFilter] = useState<IntentBucket>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);

  const generatedKeywords = useMemo<KeywordIdea[]>(() => {
    const cleanSeed = seed.trim().toLowerCase() || 'digital marketing';
    const cleanQualifier = qualifier.trim().toLowerCase();

    const templates: { phrase: string; intent: Exclude<IntentBucket, 'all'>; suggestedPage: string }[] = [
      // Informational
      { phrase: `how to start ${cleanSeed}`, intent: 'informational', suggestedPage: 'How-To Guide' },
      { phrase: `what is ${cleanSeed}`, intent: 'informational', suggestedPage: 'Glossary / Pillar' },
      { phrase: `${cleanSeed} guide for beginners`, intent: 'informational', suggestedPage: 'Beginner Tutorial' },
      { phrase: `${cleanSeed} best practices`, intent: 'informational', suggestedPage: 'Editorial Guide' },
      { phrase: `${cleanSeed} strategy checklist`, intent: 'informational', suggestedPage: 'Checklist Post' },
      { phrase: `${cleanSeed} examples that work`, intent: 'informational', suggestedPage: 'Case Examples' },
      { phrase: `common ${cleanSeed} mistakes`, intent: 'informational', suggestedPage: 'Troubleshooting Post' },
      { phrase: `how to measure ${cleanSeed} roi`, intent: 'informational', suggestedPage: 'Analytics Guide' },
      { phrase: `${cleanSeed} workflow step by step`, intent: 'informational', suggestedPage: 'Playbook' },
      { phrase: `why ${cleanSeed} matters`, intent: 'informational', suggestedPage: 'Introductory Article' },

      // Commercial
      { phrase: `best ${cleanSeed} tools`, intent: 'commercial', suggestedPage: 'Category Roundup' },
      { phrase: `top ${cleanSeed} platforms`, intent: 'commercial', suggestedPage: 'Roundup Guide' },
      { phrase: `${cleanSeed} software features`, intent: 'commercial', suggestedPage: 'Feature Overview' },
      { phrase: `affordable ${cleanSeed} solutions`, intent: 'commercial', suggestedPage: 'Budget Guide' },
      { phrase: `free ${cleanSeed} tools online`, intent: 'commercial', suggestedPage: 'Free Tools Hub' },
      { phrase: `${cleanSeed} automation options`, intent: 'commercial', suggestedPage: 'Solution Page' },
      { phrase: `recommended ${cleanSeed} apps`, intent: 'commercial', suggestedPage: 'Curated List' },
      { phrase: `${cleanSeed} benchmarks and metrics`, intent: 'commercial', suggestedPage: 'Research Page' },

      // Comparison
      { phrase: `${cleanSeed} vs paid ads`, intent: 'comparison', suggestedPage: 'Comparison Post' },
      { phrase: `${cleanSeed} tool alternatives`, intent: 'comparison', suggestedPage: 'Alternatives Page' },
      { phrase: `${cleanSeed} pros and cons`, intent: 'comparison', suggestedPage: 'Evaluation Guide' },
      { phrase: `${cleanSeed} software reviews`, intent: 'comparison', suggestedPage: 'Review Breakdown' },
      { phrase: `in house vs agency ${cleanSeed}`, intent: 'comparison', suggestedPage: 'Decision Guide' },
      { phrase: `free vs paid ${cleanSeed} platforms`, intent: 'comparison', suggestedPage: 'Tier Comparison' },

      // Transactional
      { phrase: `${cleanSeed} pricing`, intent: 'transactional', suggestedPage: 'Pricing Page' },
      { phrase: `${cleanSeed} calculator`, intent: 'transactional', suggestedPage: 'Interactive Tool' },
      { phrase: `${cleanSeed} template download`, intent: 'transactional', suggestedPage: 'Resource Page' },
      { phrase: `hire ${cleanSeed} consultant`, intent: 'transactional', suggestedPage: 'Service Page' },
      { phrase: `${cleanSeed} audit service`, intent: 'transactional', suggestedPage: 'Landing Page' },
      { phrase: `${cleanSeed} agency packages`, intent: 'transactional', suggestedPage: 'Offer Page' },
    ];

    if (cleanQualifier) {
      templates.push(
        { phrase: `${cleanSeed} for ${cleanQualifier}`, intent: 'commercial', suggestedPage: 'Audience Landing Page' },
        { phrase: `best ${cleanSeed} for ${cleanQualifier}`, intent: 'commercial', suggestedPage: 'Buyer Guide' },
        { phrase: `${cleanSeed} tips for ${cleanQualifier}`, intent: 'informational', suggestedPage: 'Audience Guide' },
        { phrase: `affordable ${cleanSeed} for ${cleanQualifier}`, intent: 'transactional', suggestedPage: 'Pricing / Offer Page' },
        { phrase: `${cleanSeed} checklist for ${cleanQualifier}`, intent: 'informational', suggestedPage: 'Checklist Resource' },
        { phrase: `${cleanSeed} agencies for ${cleanQualifier}`, intent: 'transactional', suggestedPage: 'Service Directory' }
      );
    }

    return templates.map((item) => ({
      ...item,
      wordCount: item.phrase.split(/\s+/).filter(Boolean).length,
    }));
  }, [seed, qualifier]);

  const filteredKeywords = useMemo(() => {
    return generatedKeywords.filter((item) => {
      const matchesIntent = intentFilter === 'all' || item.intent === intentFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        item.phrase.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.suggestedPage.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesIntent && matchesSearch;
    });
  }, [generatedKeywords, intentFilter, searchQuery]);

  const togglePhrase = (phrase: string) => {
    setSelectedPhrases((prev) =>
      prev.includes(phrase) ? prev.filter((p) => p !== phrase) : [...prev, phrase]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredSet = filteredKeywords.map((k) => k.phrase);
    const allSelected = filteredSet.every((p) => selectedPhrases.includes(p));
    if (allSelected) {
      setSelectedPhrases((prev) => prev.filter((p) => !filteredSet.includes(p)));
    } else {
      setSelectedPhrases((prev) => Array.from(new Set([...prev, ...filteredSet])));
    }
  };

  const handleExportCsv = () => {
    const rows = (selectedPhrases.length > 0
      ? generatedKeywords.filter((k) => selectedPhrases.includes(k.phrase))
      : filteredKeywords
    ).map((k) => `"${k.phrase.replace(/"/g, '""')}","${INTENT_LABELS[k.intent]}","${k.wordCount}","${k.suggestedPage}"`);

    const csv = ['"Keyword","Search Intent","Word Count","Suggested Page Format"', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(seed.trim() || 'keywords').replace(/\s+/g, '-').toLowerCase()}-ideas.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyPayload =
    selectedPhrases.length > 0
      ? selectedPhrases.join('\n')
      : filteredKeywords.map((k) => k.phrase).join('\n');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label htmlFor="kw-seed" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Seed Topic or Core Keyword
            </label>
            <input
              id="kw-seed"
              type="text"
              value={seed}
              onChange={(e) => {
                setSeed(e.target.value);
                setSelectedPhrases([]);
              }}
              placeholder="e.g., content marketing"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label htmlFor="kw-qualifier" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Audience, Industry, or Location (Optional)
            </label>
            <input
              id="kw-qualifier"
              type="text"
              value={qualifier}
              onChange={(e) => {
                setQualifier(e.target.value);
                setSelectedPhrases([]);
              }}
              placeholder="e.g., ecommerce, b2b, austin"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <CopyButton
              text={copyPayload}
              label={selectedPhrases.length > 0 ? `Copy (${selectedPhrases.length})` : 'Copy List'}
              variant="primary"
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 min-h-[36px] whitespace-nowrap transition-colors"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                ['all', `All (${generatedKeywords.length})`],
                ['informational', 'Informational'],
                ['commercial', 'Commercial'],
                ['comparison', 'Comparison'],
                ['transactional', 'Transactional'],
              ] as [IntentBucket, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setIntentFilter(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  intentFilter === key
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter generated keywords..."
              aria-label="Filter generated keywords"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 pl-6 pr-3 w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all visible keywords"
                    checked={
                      filteredKeywords.length > 0 &&
                      filteredKeywords.every((k) => selectedPhrases.includes(k.phrase))
                    }
                    onChange={toggleSelectAllFiltered}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                </th>
                <th className="py-3 px-3">Keyword Idea</th>
                <th className="py-3 px-3">Search Intent</th>
                <th className="py-3 px-3">Suggested Page Format</th>
                <th className="py-3 pl-3 pr-6 text-right">Words</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-6 text-center text-sm text-slate-500">
                    No generated keywords match your current filter. Try clearing the filter input.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((item) => {
                  const checked = selectedPhrases.includes(item.phrase);
                  return (
                    <tr
                      key={item.phrase}
                      className={`transition-colors ${
                        checked ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3 pl-6 pr-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePhrase(item.phrase)}
                          aria-label={`Select ${item.phrase}`}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">{item.phrase}</td>
                      <td className="py-3 px-3 text-xs font-medium text-slate-700">
                        {INTENT_LABELS[item.intent]}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600">{item.suggestedPage}</td>
                      <td className="py-3 pl-3 pr-6 text-right font-mono text-xs text-slate-600 tabular-nums">
                        {item.wordCount}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
