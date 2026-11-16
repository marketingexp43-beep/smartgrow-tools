import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

type SocialPlatform = 'instagram' | 'tiktok' | 'linkedin' | 'youtube' | 'x';
type StrategyMode = 'balanced' | 'niche' | 'broad';

const PLATFORM_GUIDANCE: Record<SocialPlatform, { label: string; recommendedCount: string }> = {
  instagram: { label: 'Instagram', recommendedCount: '5–12 focused tags' },
  tiktok: { label: 'TikTok', recommendedCount: '4–8 topical tags' },
  linkedin: { label: 'LinkedIn', recommendedCount: '3–5 professional tags' },
  youtube: { label: 'YouTube', recommendedCount: '3–5 descriptive tags' },
  x: { label: 'X (Twitter)', recommendedCount: '1–3 concise tags' },
};

function toCamelHashtag(words: string[]): string {
  const cleaned = words
    .join(' ')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (cleaned.length === 0) return '';
  return (
    '#' +
    cleaned
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
  );
}

export function HashtagGenerator() {
  const [topic, setTopic] = useState('sustainable coffee roasting');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [strategy, setStrategy] = useState<StrategyMode>('balanced');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const groups = useMemo(() => {
    const rawWords = topic
      .replace(/[^a-zA-Z0-9,\s]/g, ' ')
      .split(/[\s,]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 1);

    const words = rawWords.length > 0 ? rawWords : ['Digital', 'Marketing'];
    const baseCamel = toCamelHashtag(words);
    const primary = words[0];
    const secondary = words[1] || words[0];
    const combinedTail = words.length > 1 ? toCamelHashtag(words.slice(0, 2)) : baseCamel;

    const broadPool = [
      toCamelHashtag([primary]),
      secondary !== primary ? toCamelHashtag([secondary]) : '',
      baseCamel,
      toCamelHashtag([primary, 'Life']),
      toCamelHashtag([primary, 'Community']),
      toCamelHashtag([primary, 'Daily']),
      platform === 'linkedin'
        ? '#IndustryInsights'
        : platform === 'youtube'
          ? '#HowToGuide'
          : '#BehindTheScenes',
    ].filter(Boolean);

    const nichePool = [
      combinedTail,
      toCamelHashtag([primary, 'Tips']),
      toCamelHashtag([primary, 'Guide']),
      toCamelHashtag([primary, 'Craft']),
      toCamelHashtag(['Learn', primary]),
      toCamelHashtag([secondary, 'Lovers']),
      toCamelHashtag([primary, 'Routine']),
      toCamelHashtag(['Modern', primary]),
    ].filter(Boolean);

    const communityPool = [
      toCamelHashtag([primary, 'Creators']),
      toCamelHashtag(['SmallBatch', primary]),
      toCamelHashtag([primary, 'Process']),
      toCamelHashtag(['Ask', primary]),
      platform === 'linkedin'
        ? '#ProfessionalGrowth'
        : platform === 'tiktok'
          ? '#LearnOnTikTok'
          : '#MakerStory',
      toCamelHashtag([primary, 'Notes']),
      toCamelHashtag(['Everyday', secondary]),
    ].filter(Boolean);

    const unique = (arr: string[]) => Array.from(new Set(arr));

    return {
      broad: unique(broadPool),
      niche: unique(nichePool),
      community: unique(communityPool),
    };
  }, [topic, platform]);

  const visibleGroups = useMemo(() => {
    if (strategy === 'niche') {
      return [
        { title: 'Niche Topic Tags', tags: groups.niche },
        { title: 'Community & Format Tags', tags: groups.community },
      ];
    }
    if (strategy === 'broad') {
      return [
        { title: 'Broad Discovery Tags', tags: groups.broad },
        { title: 'Niche Topic Tags', tags: groups.niche.slice(0, 4) },
      ];
    }
    return [
      { title: 'Broad Discovery Tags', tags: groups.broad },
      { title: 'Niche Topic Tags', tags: groups.niche },
      { title: 'Community & Format Tags', tags: groups.community },
    ];
  }, [groups, strategy]);

  const allVisibleTags = useMemo(
    () => Array.from(new Set(visibleGroups.flatMap((g) => g.tags))),
    [visibleGroups]
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeOutput = selectedTags.length > 0 ? selectedTags.join(' ') : allVisibleTags.join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-display text-base font-bold text-slate-900">Topic & Channel</h2>
          <button
            type="button"
            onClick={() => {
              setTopic('sustainable coffee roasting');
              setPlatform('instagram');
              setStrategy('balanced');
              setSelectedTags([]);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div>
          <label htmlFor="ht-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Post Topic or Keywords
          </label>
          <input
            id="ht-topic"
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setSelectedTags([]);
            }}
            placeholder="e.g., minimalist home office"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ht-platform" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Platform
          </label>
          <select
            id="ht-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-purple-600 focus:outline-none"
          >
            {Object.entries(PLATFORM_GUIDANCE).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label} ({item.recommendedCount})
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Hashtag Mix</span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                ['balanced', 'Balanced'],
                ['niche', 'Niche Focus'],
                ['broad', 'Broad Reach'],
              ] as [StrategyMode, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStrategy(key)}
                className={`py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  strategy === key
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-semibold text-slate-800">
              {selectedTags.length > 0
                ? `Selected Tags (${selectedTags.length})`
                : `All Visible Tags (${allVisibleTags.length})`}
            </span>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="text-purple-700 hover:underline font-medium"
              >
                Clear selection
              </button>
            )}
          </div>

          <textarea
            readOnly
            rows={4}
            value={activeOutput}
            aria-label="Generated hashtags output"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Recommended: {PLATFORM_GUIDANCE[platform].recommendedCount}
            </span>
            <CopyButton
              text={activeOutput}
              label={selectedTags.length > 0 ? 'Copy Selected' : 'Copy All'}
              variant="primary"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.title} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-slate-900">{group.title}</h2>
              <CopyButton text={group.tags.join(' ')} label="Copy Group" />
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Click hashtags to add or remove them from your custom selection.
            </p>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
