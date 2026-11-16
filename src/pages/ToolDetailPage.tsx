import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getToolBySlug } from '../data/tools';
import { ToolPageShell } from '../components/ToolPageShell';
import { SeoHead } from '../components/SeoHead';

const MetaTitleGenerator = lazy(() =>
  import('../tools/MetaTitleGenerator').then((m) => ({ default: m.MetaTitleGenerator }))
);
const MetaDescriptionGenerator = lazy(() =>
  import('../tools/MetaDescriptionGenerator').then((m) => ({
    default: m.MetaDescriptionGenerator,
  }))
);
const KeywordGenerator = lazy(() =>
  import('../tools/KeywordGenerator').then((m) => ({ default: m.KeywordGenerator }))
);
const HashtagGenerator = lazy(() =>
  import('../tools/HashtagGenerator').then((m) => ({ default: m.HashtagGenerator }))
);
const InstagramBioGenerator = lazy(() =>
  import('../tools/InstagramBioGenerator').then((m) => ({ default: m.InstagramBioGenerator }))
);
const YouTubeTitleGenerator = lazy(() =>
  import('../tools/YouTubeTitleGenerator').then((m) => ({ default: m.YouTubeTitleGenerator }))
);
const WordCounter = lazy(() =>
  import('../tools/WordCounter').then((m) => ({ default: m.WordCounter }))
);
const CharacterCounter = lazy(() =>
  import('../tools/CharacterCounter').then((m) => ({ default: m.CharacterCounter }))
);
const CpcCalculator = lazy(() =>
  import('../tools/CpcCalculator').then((m) => ({ default: m.CpcCalculator }))
);
const CtrCalculator = lazy(() =>
  import('../tools/CtrCalculator').then((m) => ({ default: m.CtrCalculator }))
);

function ToolWorkspaceSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading tool workspace"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-5 h-80 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
      <div className="lg:col-span-7 h-80 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
    </div>
  );
}

export function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <>
        <SeoHead
          title="Tool Not Found | SmartGrow Tools"
          description="The requested marketing tool could not be found. Browse all SmartGrow Tools utilities."
          robots="noindex, follow"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900">Tool Not Found</h1>
          <p className="mt-3 text-slate-600">
            The tool URL you visited does not exist. Explore our full suite of 10 working marketing tools below.
          </p>
          <div className="mt-6">
            <Link
              to="/tools"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      </>
    );
  }

  const renderTool = () => {
    switch (tool.slug) {
      case 'meta-title-generator':
        return <MetaTitleGenerator />;
      case 'meta-description-generator':
        return <MetaDescriptionGenerator />;
      case 'keyword-generator':
        return <KeywordGenerator />;
      case 'hashtag-generator':
        return <HashtagGenerator />;
      case 'instagram-bio-generator':
        return <InstagramBioGenerator />;
      case 'youtube-title-generator':
        return <YouTubeTitleGenerator />;
      case 'word-counter':
        return <WordCounter />;
      case 'character-counter':
        return <CharacterCounter />;
      case 'cpc-calculator':
        return <CpcCalculator />;
      case 'ctr-calculator':
        return <CtrCalculator />;
      default:
        return null;
    }
  };

  return (
    <ToolPageShell tool={tool}>
      <Suspense fallback={<ToolWorkspaceSkeleton />}>{renderTool()}</Suspense>
    </ToolPageShell>
  );
}
