import { useMemo, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type VideoFormat = 'tutorial' | 'listicle' | 'comparison' | 'mistakes' | 'casestudy';

function toHeadlineCase(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function YouTubeTitleGenerator() {
  const [topic, setTopic] = useState('Local SEO for Small Businesses');
  const [audience, setAudience] = useState('Beginners');
  const [timeframe, setTimeframe] = useState('in 20 Minutes');
  const [format, setFormat] = useState<VideoFormat>('tutorial');
  const [channelName, setChannelName] = useState('SmartGrow Channel');
  const [selectedTitle, setSelectedTitle] = useState(
    'Local SEO for Small Businesses: Step-by-Step Setup in 20 Minutes'
  );

  const titles = useMemo(() => {
    const cleanTopic = toHeadlineCase(topic || 'Your Video Topic');
    const cleanAudience = audience.trim() || 'Creators';
    const cleanTime = timeframe.trim();

    const pool: Record<VideoFormat, string[]> = {
      tutorial: [
        `${cleanTopic}: Step-by-Step Setup ${cleanTime}`.trim(),
        `How to Do ${cleanTopic} (Complete Walkthrough)`,
        `${cleanTopic} Explained Clearly for ${cleanAudience}`,
        `Learn ${cleanTopic} From Scratch ${cleanTime}`.trim(),
        `The Practical Guide to ${cleanTopic}`,
        `${cleanTopic} Workflow: Everything You Need to Know`,
      ],
      listicle: [
        `7 ${cleanTopic} Strategies That Actually Make Sense`,
        `5 Essential ${cleanTopic} Habits for ${cleanAudience}`,
        `Top ${cleanTopic} Tools I Recommend Using`,
        `${cleanTopic}: 6 Practical Checks Before You Publish`,
        `4 Simple Ways to Improve ${cleanTopic}`,
        `Best ${cleanTopic} Tips for ${cleanAudience}`,
      ],
      comparison: [
        `${cleanTopic} Compared: Which Option Should You Pick?`,
        `Free vs Paid ${cleanTopic}: Honest Breakdown`,
        `Before You Choose ${cleanTopic}, Watch This Breakdown`,
        `${cleanTopic} Pros and Cons for ${cleanAudience}`,
        `Testing Different ${cleanTopic} Approaches Side by Side`,
        `Is ${cleanTopic} Worth It for ${cleanAudience}?`,
      ],
      mistakes: [
        `5 ${cleanTopic} Mistakes That Hurt Your Results`,
        `Why Most ${cleanAudience} Struggle With ${cleanTopic}`,
        `Stop Doing This With ${cleanTopic} (Fix It Instead)`,
        `Common ${cleanTopic} Errors and How to Fix Them`,
        `What I Would Change About ${cleanTopic} Today`,
        `${cleanTopic} Myths vs What Actually Works`,
      ],
      casestudy: [
        `How We Approached ${cleanTopic} (Full Breakdown)`,
        `Behind the Scenes of Our ${cleanTopic} Process`,
        `Real ${cleanTopic} Audit: What Changed & Why`,
        `Building a ${cleanTopic} System Step by Step`,
        `${cleanTopic} Review After Applying Key Changes`,
        `A Practical Look at ${cleanTopic} in Action`,
      ],
    };

    return Array.from(new Set(pool[format].map((t) => t.replace(/\s+/g, ' ').trim())));
  }, [topic, audience, timeframe, format]);

  const len = selectedTitle.length;
  const mobileSafe = selectedTitle.slice(0, 60);
  const mobileCut = selectedTitle.slice(60);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">Video Inputs</h2>
          <button
            type="button"
            onClick={() => {
              setTopic('Local SEO for Small Businesses');
              setAudience('Beginners');
              setTimeframe('in 20 Minutes');
              setFormat('tutorial');
              setChannelName('SmartGrow Channel');
              setSelectedTitle('Local SEO for Small Businesses: Step-by-Step Setup in 20 Minutes');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div>
          <label htmlFor="yt-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Video Topic or Search Keyword
          </label>
          <input
            id="yt-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="yt-audience" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Audience
            </label>
            <input
              id="yt-audience"
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="yt-time" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Timeframe / Hook (Optional)
            </label>
            <input
              id="yt-time"
              type="text"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="yt-format" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Video Format
          </label>
          <select
            id="yt-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as VideoFormat)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-purple-600 focus:outline-none"
          >
            <option value="tutorial">Step-by-Step Tutorial</option>
            <option value="listicle">List / Tips Breakdown</option>
            <option value="comparison">Comparison / Review</option>
            <option value="mistakes">Mistakes & Fixes</option>
            <option value="casestudy">Process / Case Breakdown</option>
          </select>
        </div>

        <div>
          <label htmlFor="yt-channel" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Channel Name (for Preview)
          </label>
          <input
            id="yt-channel"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-base font-bold text-slate-900">
              YouTube Feed Truncation Preview
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
              <span className={len > 100 ? 'text-rose-700 font-semibold' : 'text-slate-600'}>
                {len} / 100 max
              </span>
              <span className="text-slate-300" aria-hidden="true">
                |
              </span>
              <span
                className={`font-sans font-semibold ${
                  len <= 60 ? 'text-emerald-700' : len <= 100 ? 'text-amber-700' : 'text-rose-700'
                }`}
              >
                {len <= 60
                  ? 'Fits without mobile truncation'
                  : len <= 100
                    ? 'Truncates around 60 chars on mobile'
                    : 'Exceeds 100-char limit'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row gap-4 items-start mb-4">
            <div className="w-full sm:w-44 aspect-video rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white shrink-0 relative">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" aria-hidden="true" />
              </div>
              <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                12:40
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-snug break-words">
                <span>{mobileSafe}</span>
                {mobileCut && (
                  <span className="text-slate-600 underline decoration-amber-500 decoration-dashed underline-offset-4">
                    {mobileCut}
                  </span>
                )}
              </div>
              <div className="mt-1.5 text-xs text-slate-500">
                {channelName || 'Your Channel'} · Search Preview
              </div>
              {mobileCut && (
                <p className="mt-2 text-xs text-amber-800">
                  Underlined words after character 60 may be hidden on narrow mobile feeds.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="yt-edit" className="block text-xs font-semibold text-slate-700">
              Edit Selected Title
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="yt-edit"
                type="text"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
              />
              <CopyButton text={selectedTitle} label="Copy Title" variant="primary" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">
              Generated Title Options
            </h2>
            <span className="text-xs text-slate-500">Click to test truncation</span>
          </div>

          <ul className="divide-y divide-slate-200">
            {titles.map((item) => (
              <li
                key={item}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setSelectedTitle(item)}
                  className="text-left flex-1 min-w-0 group"
                >
                  <div className="text-sm font-medium text-slate-900 group-hover:text-purple-700 transition-colors">
                    {item}
                  </div>
                  <div className="mt-1 text-xs font-mono tabular-nums text-slate-500">
                    {item.length} chars{' '}
                    <span className="font-sans">
                      · {item.length <= 60 ? 'Mobile safe' : 'May truncate on mobile'}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedTitle(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 transition-colors"
                  >
                    Preview
                  </button>
                  <CopyButton text={item} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
