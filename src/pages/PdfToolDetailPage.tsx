import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPdfToolBySlug } from '../data/pdfTools';
import { PdfToolPageShell } from '../components/PdfToolPageShell';
import { SeoHead } from '../components/SeoHead';

// Category 1: Organize PDF (7)
const MergePdfTool = lazy(() =>
  import('../tools/pdf/OrganizePdfTools').then((m) => ({ default: m.MergePdfTool }))
);
const SplitPdfTool = lazy(() =>
  import('../tools/pdf/OrganizePdfTools').then((m) => ({ default: m.SplitPdfTool }))
);
const OrganizePdfPagesTool = lazy(() =>
  import('../tools/pdf/OrganizePdfTools').then((m) => ({ default: m.OrganizePdfPagesTool }))
);
const SelectPagesPdfTool = lazy(() =>
  import('../tools/pdf/OrganizePdfTools').then((m) => ({ default: m.SelectPagesPdfTool }))
);
const RotatePdfTool = lazy(() =>
  import('../tools/pdf/OrganizePdfTools').then((m) => ({ default: m.RotatePdfTool }))
);
const AddPageNumbersTool = lazy(() =>
  import('../tools/pdf/OrganizePdfTools').then((m) => ({ default: m.AddPageNumbersTool }))
);

// Category 2: Optimize PDF (2)
const CompressPdfTool = lazy(() =>
  import('../tools/pdf/OptimizePdfTools').then((m) => ({ default: m.CompressPdfTool }))
);
const RepairPdfTool = lazy(() =>
  import('../tools/pdf/OptimizePdfTools').then((m) => ({ default: m.RepairPdfTool }))
);

// Category 3: Convert PDF (6)
const PdfToImageTool = lazy(() =>
  import('../tools/pdf/ConvertPdfTools').then((m) => ({ default: m.PdfToImageTool }))
);
const ImageToPdfTool = lazy(() =>
  import('../tools/pdf/ConvertPdfTools').then((m) => ({ default: m.ImageToPdfTool }))
);
const PdfToWordTool = lazy(() =>
  import('../tools/pdf/ConvertPdfTools').then((m) => ({ default: m.PdfToWordTool }))
);
const WordToPdfTool = lazy(() =>
  import('../tools/pdf/ConvertPdfTools').then((m) => ({ default: m.WordToPdfTool }))
);

// Category 4: Edit PDF (5)
const AddTextToPdfTool = lazy(() =>
  import('../tools/pdf/EditPdfTools').then((m) => ({ default: m.AddTextToPdfTool }))
);
const AddImagesToPdfTool = lazy(() =>
  import('../tools/pdf/EditPdfTools').then((m) => ({ default: m.AddImagesToPdfTool }))
);
const AddWatermarkTool = lazy(() =>
  import('../tools/pdf/EditPdfTools').then((m) => ({ default: m.AddWatermarkTool }))
);
const SignPdfTool = lazy(() =>
  import('../tools/pdf/EditPdfTools').then((m) => ({ default: m.SignPdfTool }))
);
const CropPdfTool = lazy(() =>
  import('../tools/pdf/EditPdfTools').then((m) => ({ default: m.CropPdfTool }))
);

// Category 5 & 6: PDF Security & Intelligence (5)
const ProtectPdfTool = lazy(() =>
  import('../tools/pdf/SecurityAndIntelligencePdfTools').then((m) => ({
    default: m.ProtectPdfTool,
  }))
);
const UnlockPdfTool = lazy(() =>
  import('../tools/pdf/SecurityAndIntelligencePdfTools').then((m) => ({
    default: m.UnlockPdfTool,
  }))
);
const OcrPdfTool = lazy(() =>
  import('../tools/pdf/SecurityAndIntelligencePdfTools').then((m) => ({
    default: m.OcrPdfTool,
  }))
);
const ExtractTextPdfTool = lazy(() =>
  import('../tools/pdf/SecurityAndIntelligencePdfTools').then((m) => ({
    default: m.ExtractTextPdfTool,
  }))
);
const TranslatePdfTool = lazy(() =>
  import('../tools/pdf/SecurityAndIntelligencePdfTools').then((m) => ({
    default: m.TranslatePdfTool,
  }))
);

function PdfWorkspaceSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading PDF tool workspace"
      className="h-64 rounded-xl border border-slate-200 bg-slate-50 animate-pulse"
    />
  );
}

export function PdfToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getPdfToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <>
        <SeoHead
          title="PDF Tool Not Found | SmartGrow Tools"
          description="The requested PDF tool could not be found. Browse all 25 SmartGrow PDF utilities."
          robots="noindex, follow"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900">PDF Tool Not Found</h1>
          <p className="mt-3 text-slate-600">
            The PDF tool URL you visited does not exist. Explore all 25 browser-based PDF tools below.
          </p>
          <div className="mt-6">
            <Link
              to="/pdf-tools"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All PDF Tools
            </Link>
          </div>
        </div>
      </>
    );
  }

  const renderTool = () => {
    switch (tool.slug) {
      case 'merge-pdf':
        return <MergePdfTool />;
      case 'split-pdf':
        return <SplitPdfTool />;
      case 'organize-pdf-pages':
        return <OrganizePdfPagesTool />;
      case 'delete-pdf-pages':
        return <SelectPagesPdfTool mode="delete" />;
      case 'extract-pdf-pages':
        return <SelectPagesPdfTool mode="extract" />;
      case 'rotate-pdf':
        return <RotatePdfTool />;
      case 'add-pdf-page-numbers':
        return <AddPageNumbersTool />;
      case 'compress-pdf':
        return <CompressPdfTool />;
      case 'repair-pdf':
        return <RepairPdfTool />;
      case 'pdf-to-jpg':
        return <PdfToImageTool mode="jpg" />;
      case 'pdf-to-png':
        return <PdfToImageTool mode="png" />;
      case 'jpg-to-pdf':
        return <ImageToPdfTool mode="jpg" />;
      case 'png-to-pdf':
        return <ImageToPdfTool mode="png" />;
      case 'pdf-to-word':
        return <PdfToWordTool />;
      case 'word-to-pdf':
        return <WordToPdfTool />;
      case 'add-text-to-pdf':
        return <AddTextToPdfTool />;
      case 'add-images-to-pdf':
        return <AddImagesToPdfTool />;
      case 'add-watermark':
        return <AddWatermarkTool />;
      case 'sign-pdf':
        return <SignPdfTool />;
      case 'crop-pdf':
        return <CropPdfTool />;
      case 'protect-pdf':
        return <ProtectPdfTool />;
      case 'unlock-pdf':
        return <UnlockPdfTool />;
      case 'ocr-pdf':
        return <OcrPdfTool />;
      case 'extract-text-from-pdf':
        return <ExtractTextPdfTool />;
      case 'translate-pdf-text':
        return <TranslatePdfTool />;
      default:
        return null;
    }
  };

  return (
    <PdfToolPageShell tool={tool}>
      <Suspense fallback={<PdfWorkspaceSkeleton />}>{renderTool()}</Suspense>
    </PdfToolPageShell>
  );
}
