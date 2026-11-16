import { useMemo, useState } from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'can', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my',
  'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
  'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'you', 'your', 'yours',
  'yourself', 'yourselves',
]);

const SAMPLE_TEXT = `Search engine optimization starts with answering a clear question in plain language. When readers land on a page, they scan headings, opening paragraphs, and concrete examples before deciding whether to read further.

Strong editorial structure pairs concise sentences with accurate metadata. Reviewing your word count, reading time, and repeated terms before publishing helps keep long-form guides focused and easy to skim across both desktop and mobile screens.`;

function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;
  const trimmed = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const matches = trimmed.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

function getReadabilityLabel(score: number): string {
  if (score >= 80) return 'Easy to Read';
  if (score >= 60) return 'Plain English';
  if (score >= 45) return 'Fairly Technical';
  return 'Academic / Dense';
}

function formatMinutesSeconds(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0 sec';
  const totalSeconds = Math.max(1, Math.round(totalMinutes * 60));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs} sec`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
}

export function WordCounter() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [ngramMode, setNgramMode] = useState<'single' | 'bigram'>('single');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const wordsArray = trimmed ? trimmed.match(/\b[\w'-]+\b/g) || [] : [];
    const wordCount = wordsArray.length;
    const sentencesArray = trimmed
      ? trimmed
          .split(/[.!?]+(?:\s|$)/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const sentenceCount = wordCount === 0 ? 0 : Math.max(1, sentencesArray.length);
    const paragraphCount = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;

    const readingMinutes = wordCount / 225;
    const speakingMinutes = wordCount / 130;

    let totalSyllables = 0;
    const lowerWords: string[] = [];
    for (const w of wordsArray) {
      const normalized = w.toLowerCase().replace(/^'+|'+$/g, '');
      if (normalized) {
        lowerWords.push(normalized);
        totalSyllables += countSyllables(normalized);
      }
    }

    const fleschRaw =
      wordCount > 0 && sentenceCount > 0
        ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount)
        : 0;
    const fleschScore = Math.max(0, Math.min(100, Math.round(fleschRaw)));

    // Single keyword density (excluding stop words)
    const singleCounts = new Map<string, number>();
    for (const w of lowerWords) {
      if (w.length < 3 || STOP_WORDS.has(w)) continue;
      singleCounts.set(w, (singleCounts.get(w) || 0) + 1);
    }

    // Two-word phrase density
    const bigramCounts = new Map<string, number>();
    for (let i = 0; i < lowerWords.length - 1; i++) {
      const a = lowerWords[i];
      const b = lowerWords[i + 1];
      if (STOP_WORDS.has(a) && STOP_WORDS.has(b)) continue;
      if (a.length < 2 || b.length < 2) continue;
      const phrase = `${a} ${b}`;
      bigramCounts.set(phrase, (bigramCounts.get(phrase) || 0) + 1);
    }

    const topSingle = Array.from(singleCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([term, count]) => ({
        term,
        count,
        density: wordCount > 0 ? ((count / wordCount) * 100).toFixed(1) : '0.0',
      }));

    const topBigrams = Array.from(bigramCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([term, count]) => ({
        term,
        count,
        density: wordCount > 1 ? (((count * 2) / wordCount) * 100).toFixed(1) : '0.0',
      }));

    return {
      wordCount,
      characters,
      charactersNoSpaces,
      sentenceCount,
      paragraphCount,
      readingTime: formatMinutesSeconds(readingMinutes),
      speakingTime: formatMinutesSeconds(speakingMinutes),
      fleschScore,
      readabilityLabel: wordCount > 0 ? getReadabilityLabel(fleschScore) : '—',
      topSingle,
      topBigrams,
    };
  }, [text]);

  const handleDownloadTxt = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartgrow-draft.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeDensityRows = ngramMode === 'single' ? stats.topSingle : stats.topBigrams;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.wordCount.toLocaleString() },
          { label: 'Characters', value: stats.characters.toLocaleString() },
          { label: 'No Spaces', value: stats.charactersNoSpaces.toLocaleString() },
          { label: 'Sentences', value: stats.sentenceCount.toLocaleString() },
          { label: 'Paragraphs', value: stats.paragraphCount.toLocaleString() },
          { label: 'Reading Time', value: stats.readingTime },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3.5"
          >
            <div className="text-xs font-medium text-slate-500">{metric.label}</div>
            <div className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-700">
              Text Editor (Processed Locally)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sample Text</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                disabled={!text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Export .txt</span>
              </button>
              <CopyButton text={text} label="Copy Text" />
              <button
                type="button"
                onClick={() => setText('')}
                disabled={!text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-xs font-medium text-slate-700 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            placeholder="Paste or start typing your article, landing page copy, or draft here..."
            aria-label="Text input for word count and density analysis"
            className="w-full p-5 text-sm sm:text-base text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-none resize-y min-h-[320px]"
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-display text-sm font-bold text-slate-900 mb-3">
              Readability & Pacing
            </h2>
            <dl className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Speaking Time</dt>
                <dd className="font-mono font-medium text-slate-900 tabular-nums">
                  {stats.speakingTime}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Flesch Reading Ease</dt>
                <dd className="font-mono font-medium text-slate-900 tabular-nums">
                  {stats.wordCount > 0 ? `${stats.fleschScore} / 100` : '—'}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Style Estimate</dt>
                <dd className="font-medium text-blue-700">{stats.readabilityLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-2">
              <h2 className="font-display text-sm font-bold text-slate-900">Keyword Density</h2>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setNgramMode('single')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    ngramMode === 'single'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1-Word
                </button>
                <button
                  type="button"
                  onClick={() => setNgramMode('bigram')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    ngramMode === 'bigram'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2-Word
                </button>
              </div>
            </div>

            {activeDensityRows.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Enter a few sentences to inspect top repeated keywords and two-word phrases.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pl-5 pr-2 font-medium">Term</th>
                    <th className="py-2.5 px-2 text-right font-medium">Count</th>
                    <th className="py-2.5 pl-2 pr-5 text-right font-medium">Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeDensityRows.map((row) => (
                    <tr key={row.term} className="hover:bg-slate-50/60">
                      <td className="py-2.5 pl-5 pr-2 font-medium text-slate-800">{row.term}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-600 tabular-nums">
                        {row.count}
                      </td>
                      <td className="py-2.5 pl-2 pr-5 text-right font-mono text-blue-700 tabular-nums">
                        {row.density}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
