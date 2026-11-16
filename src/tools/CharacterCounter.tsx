import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

interface PlatformLimit {
  name: string;
  limit: number;
  note: string;
}

const PLATFORM_LIMITS: PlatformLimit[] = [
  { name: 'Google Meta Title', limit: 60, note: 'Recommended SEO title length' },
  { name: 'Instagram Bio', limit: 150, note: 'Strict profile bio cap' },
  { name: 'Google Meta Description', limit: 160, note: 'Desktop SERP snippet range' },
  { name: 'SMS Standard Segment', limit: 160, note: 'GSM-7 single message limit' },
  { name: 'YouTube Video Title', limit: 100, note: 'Max field length (60 mobile safe)' },
  { name: 'X (Twitter) Post', limit: 280, note: 'Standard post length' },
  { name: 'Instagram Caption', limit: 2200, note: 'Full caption cap' },
  { name: 'LinkedIn Post', limit: 3000, note: 'Standard feed post cap' },
];

function toTitleCase(input: string): string {
  return input.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function toSentenceCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

export function CharacterCounter() {
  const [text, setText] = useState(
    'Write clearer headlines, social captions, and search snippets without guessing platform character caps.'
  );

  const metrics = useMemo(() => {
    const characters = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const bytes = new TextEncoder().encode(text).length;

    return { characters, noSpaces, words, lines, bytes };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Characters', value: metrics.characters.toLocaleString() },
          { label: 'Without Spaces', value: metrics.noSpaces.toLocaleString() },
          { label: 'Words', value: metrics.words.toLocaleString() },
          { label: 'Lines', value: metrics.lines.toLocaleString() },
          { label: 'UTF-8 Bytes', value: metrics.bytes.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3.5">
            <div className="text-xs font-medium text-slate-500">{item.label}</div>
            <div className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700">Text & Case Utilities</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setText((t) => toSentenceCase(t))}
                disabled={!text}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Sentence case
              </button>
              <button
                type="button"
                onClick={() => setText((t) => toTitleCase(t))}
                disabled={!text}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={() => setText((t) => t.toUpperCase())}
                disabled={!text}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                UPPER
              </button>
              <button
                type="button"
                onClick={() => setText((t) => t.toLowerCase())}
                disabled={!text}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                lower
              </button>
              <button
                type="button"
                onClick={() => setText((t) => t.replace(/[ \t]+/g, ' ').trim())}
                disabled={!text}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Trim Spaces
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={11}
            placeholder="Type or paste copy to check platform character limits..."
            aria-label="Text input for character count"
            className="w-full p-5 text-sm sm:text-base text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-none resize-y min-h-[260px]"
          />

          <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setText('')}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-xs font-medium text-slate-700 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>
            <CopyButton text={text} label="Copy Text" variant="primary" />
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-display text-sm font-bold text-slate-900">
              Platform Length Limits
            </h2>
          </div>

          <ul className="divide-y divide-slate-100">
            {PLATFORM_LIMITS.map((platform) => {
              const count = metrics.characters;
              const pct = Math.min(100, Math.round((count / platform.limit) * 100));
              const diff = platform.limit - count;
              const isOver = diff < 0;
              const isNear = !isOver && pct >= 85;

              const statusText = isOver
                ? `${Math.abs(diff)} over`
                : isNear
                  ? `${diff} left (Near)`
                  : `${diff} left`;

              return (
                <li key={platform.name} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{platform.name}</span>
                    <span
                      className={`font-mono tabular-nums font-medium ${
                        isOver
                          ? 'text-rose-700'
                          : isNear
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                      }`}
                    >
                      {count} / {platform.limit} · {statusText}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        isOver ? 'bg-rose-600' : isNear ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
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
