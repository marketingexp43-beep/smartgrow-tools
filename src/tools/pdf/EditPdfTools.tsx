import { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { PDFDocument, StandardFonts, degrees } from 'pdf-lib';
import {
  PdfErrorBanner,
  PdfFileInfoBar,
  PdfProgressBar,
  PdfResultCard,
  PdfUploadZone,
} from '../../components/PdfUploadZone';
import {
  downloadUint8Array,
  formatFileSize,
  getPdfMetadata,
  hexToPdfRgb,
  imageFileToPngBytes,
  parsePageRanges,
  readFileAsUint8Array,
  renderPdfPageToCanvas,
  safeBaseName,
} from '../../utils/pdfCore';

const WIN_ANSI_REGEX = /^[\x20-\x7E\xA0-\xFF\n\r\t]*$/;

async function renderUnicodeTextPng(
  text: string,
  fontSize: number,
  colorHex: string,
  fontKey: 'Helvetica' | 'TimesRoman' | 'Courier'
): Promise<{ pngBytes: Uint8Array; widthPt: number; heightPt: number }> {
  const scale = 3;
  const cssFont =
    fontKey === 'TimesRoman'
      ? 'Georgia, "Times New Roman", serif'
      : fontKey === 'Courier'
        ? '"JetBrains Mono", "Courier New", monospace'
        : '"DM Sans", Arial, sans-serif';
  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d')!;
  mCtx.font = `600 ${fontSize}px ${cssFont}`;
  const metrics = mCtx.measureText(text);
  const widthPt = Math.max(12, Math.ceil(metrics.width) + 6);
  const heightPt = Math.max(14, Math.ceil(fontSize * 1.35));

  const c = document.createElement('canvas');
  c.width = Math.round(widthPt * scale);
  c.height = Math.round(heightPt * scale);
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = colorHex;
  ctx.font = `600 ${fontSize}px ${cssFont}`;
  ctx.textBaseline = 'top';
  ctx.fillText(text, 2, fontSize * 0.15);

  const blob = await new Promise<Blob>((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error('Text PNG render failed'))), 'image/png');
  });
  return {
    pngBytes: new Uint8Array(await blob.arrayBuffer()),
    widthPt,
    heightPt,
  };
}

// Shared helper to render a single page preview dataURL safely
function usePdfPagePreview(bytes: Uint8Array | null, pageNum: number, scale = 1.3) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number }>({ width: 595, height: 842 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!bytes) {
      setPreviewUrl(null);
      return;
    }
    setLoading(true);
    renderPdfPageToCanvas(bytes, pageNum, scale)
      .then((canvas) => {
        if (cancelled) return;
        setDims({ width: canvas.width, height: canvas.height });
        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.88));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bytes, pageNum, scale]);

  return { previewUrl, dims, loading };
}

function PageNavigator({
  currentPage,
  pageCount,
  onChange,
}: {
  currentPage: number;
  pageCount: number;
  onChange: (next: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
      >
        <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <span className="font-mono tabular-nums text-slate-700 px-1">
        Page {currentPage} / {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage >= pageCount}
        aria-label="Next page"
        className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
      >
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

// ============================================================================
// 16. Add Text to PDF
// ============================================================================
interface TextAnnotation {
  id: string;
  page: number; // 1-based
  text: string;
  xPct: number; // 0..1 from left
  yPct: number; // 0..1 from top
  fontSize: number;
  fontFamily: 'Helvetica' | 'TimesRoman' | 'Courier';
  color: string;
  opacity: number;
}

export function AddTextToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [draftText, setDraftText] = useState('Approved · SmartGrow');
  const [fontFamily, setFontFamily] = useState<'Helvetica' | 'TimesRoman' | 'Courier'>('Helvetica');
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('#0f172a');
  const [opacity, setOpacity] = useState(1);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);

  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const { previewUrl, loading: previewLoading } = usePdfPagePreview(bytes, currentPage, 1.35);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    setAnnotations([]);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
      setCurrentPage(1);
    } catch {
      setError('Could not load this PDF. If encrypted, unlock it first.');
    }
  };

  const handlePreviewClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!draftText.trim()) {
      setError('Enter text in the text box before clicking on the PDF preview.');
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(0.02, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const yPct = Math.max(0.02, Math.min(0.95, (e.clientY - rect.top) / rect.height));
    setError(null);
    setResultBytes(null);
    setAnnotations((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        page: currentPage,
        text: draftText,
        xPct,
        yPct,
        fontSize,
        fontFamily,
        color,
        opacity,
      },
    ]);
  };

  const handleApply = async () => {
    if (!bytes || annotations.length === 0) return;
    setError(null);
    setProgress(35);
    try {
      const doc = await PDFDocument.load(bytes);
      const fontMap = {
        Helvetica: await doc.embedFont(StandardFonts.Helvetica),
        TimesRoman: await doc.embedFont(StandardFonts.TimesRoman),
        Courier: await doc.embedFont(StandardFonts.Courier),
      };
      const pages = doc.getPages();

      for (const item of annotations) {
        const page = pages[item.page - 1];
        if (!page) continue;
        const box = page.getCropBox();
        const x = box.x + item.xPct * box.width;
        const y = box.y + box.height - item.yPct * box.height - item.fontSize * 0.7;

        if (WIN_ANSI_REGEX.test(item.text)) {
          page.drawText(item.text, {
            x: Math.max(box.x, x),
            y: Math.max(box.y, y),
            size: item.fontSize,
            font: fontMap[item.fontFamily],
            color: hexToPdfRgb(item.color),
            opacity: item.opacity,
          });
        } else {
          const rendered = await renderUnicodeTextPng(
            item.text,
            item.fontSize,
            item.color,
            item.fontFamily
          );
          const embeddedPng = await doc.embedPng(rendered.pngBytes);
          page.drawImage(embeddedPng, {
            x: Math.max(box.x, x),
            y: Math.max(box.y, y - rendered.heightPt * 0.15),
            width: rendered.widthPt,
            height: rendered.heightPt,
            opacity: item.opacity,
          });
        }
      }

      const out = await doc.save();
      setResultBytes(out);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Failed to embed text into PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Add Text"
          helperText="Drop a PDF to click-to-place custom text boxes across any page."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pageCount}
            onClear={() => {
              setFile(null);
              setBytes(null);
              setAnnotations([]);
              setResultBytes(null);
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Text to Place (click preview canvas to stamp)
                </label>
                <input
                  type="text"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Type text to stamp onto PDF..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Font Style
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) =>
                      setFontFamily(e.target.value as 'Helvetica' | 'TimesRoman' | 'Courier')
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Helvetica">Sans (Helvetica)</option>
                    <option value="TimesRoman">Serif (Times)</option>
                    <option value="Courier">Monospace (Courier)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Font Size ({fontSize} pt)
                  </label>
                  <input
                    type="number"
                    min={6}
                    max={72}
                    value={fontSize}
                    onChange={(e) => setFontSize(Math.max(6, Math.min(72, Number(e.target.value) || 12)))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-9 h-9 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{color}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Opacity ({Math.round(opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min={0.2}
                    max={1}
                    step={0.05}
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2.5"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Placed Text Items ({annotations.length})</span>
                  {annotations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAnnotations([]);
                        setResultBytes(null);
                      }}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {annotations.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Click anywhere on the PDF page preview on the right to place your first text item.
                  </p>
                ) : (
                  <ul className="max-h-44 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {annotations.map((ann) => (
                      <li
                        key={ann.id}
                        className="px-3 py-2 flex items-center justify-between gap-2 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => setCurrentPage(ann.page)}
                          className="text-left min-w-0 flex-1"
                        >
                          <div className="font-semibold text-slate-900 truncate">{ann.text}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Page {ann.page} · {ann.fontSize}pt
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnnotations((prev) => prev.filter((a) => a.id !== ann.id));
                            setResultBytes(null);
                          }}
                          aria-label="Delete text item"
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={handleApply}
                disabled={annotations.length === 0 || progress !== null}
                className="w-full px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Apply Text &amp; Download PDF
              </button>
            </div>

            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">
                  Click anywhere on page {currentPage} to stamp "{draftText || '...'}"
                </span>
                <PageNavigator
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onChange={setCurrentPage}
                />
              </div>

              <div className="flex justify-center overflow-auto">
                {previewLoading || !previewUrl ? (
                  <div className="w-full h-96 flex items-center justify-center text-xs text-slate-500">
                    Rendering page preview...
                  </div>
                ) : (
                  <div
                    onClick={handlePreviewClick}
                    className="relative inline-block cursor-crosshair border border-slate-300 bg-white shadow-sm select-none"
                  >
                    <img
                      src={previewUrl}
                      alt={`Page ${currentPage} preview`}
                      className="max-w-full max-h-[540px] block pointer-events-none"
                    />
                    {annotations
                      .filter((a) => a.page === currentPage)
                      .map((ann) => (
                        <div
                          key={ann.id}
                          style={{
                            left: `${ann.xPct * 100}%`,
                            top: `${ann.yPct * 100}%`,
                            color: ann.color,
                            opacity: ann.opacity,
                            fontSize: `${Math.max(10, ann.fontSize * 0.9)}px`,
                          }}
                          className="absolute pointer-events-none whitespace-nowrap font-semibold bg-blue-50/40 border border-dashed border-blue-500 px-1 rounded-xs"
                        >
                          {ann.text}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText="Embedding text annotations into PDF..." />

          {resultBytes && (
            <PdfResultCard
              title="Text Annotations Embedded"
              details={`${annotations.length} text ${annotations.length === 1 ? 'item' : 'items'} added · Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download Edited PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-annotated.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 17. Add Images to PDF
// ============================================================================
export function AddImagesToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [xPct, setXPct] = useState(0.68);
  const [yPct, setYPct] = useState(0.12);
  const [widthPct, setWidthPct] = useState(22);
  const [opacity, setOpacity] = useState(1);
  const [applyAllPages, setApplyAllPages] = useState(false);

  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const { previewUrl } = usePdfPagePreview(bytes, currentPage, 1.35);

  const handlePdfFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
      setCurrentPage(1);
    } catch {
      setError('Could not load this PDF.');
    }
  };

  const handleImagePick = (picked: File | null) => {
    if (!picked) return;
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgFile(picked);
    setImgUrl(URL.createObjectURL(picked));
    setResultBytes(null);
    setError(null);
  };

  const handlePreviewClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setXPct(Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width)));
    setYPct(Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height)));
    setResultBytes(null);
  };

  const handleApply = async () => {
    if (!bytes || !imgFile) return;
    setError(null);
    setProgress(35);
    try {
      const doc = await PDFDocument.load(bytes);
      const rawImg = await readFileAsUint8Array(imgFile);
      let embedded;
      try {
        if (rawImg.length >= 3 && rawImg[0] === 0xff && rawImg[1] === 0xd8) {
          embedded = await doc.embedJpg(rawImg);
        } else if (rawImg.length >= 4 && rawImg[0] === 0x89 && rawImg[1] === 0x50) {
          embedded = await doc.embedPng(rawImg);
        } else {
          const pngBytes = await imageFileToPngBytes(imgFile);
          embedded = await doc.embedPng(pngBytes);
        }
      } catch {
        const pngBytes = await imageFileToPngBytes(imgFile);
        embedded = await doc.embedPng(pngBytes);
      }

      const pages = doc.getPages();
      const targetPages = applyAllPages
        ? pages
        : [pages[currentPage - 1]].filter(Boolean);

      for (const page of targetPages) {
        const box = page.getCropBox();
        const drawW = (widthPct / 100) * box.width;
        const drawH = drawW * (embedded.height / Math.max(1, embedded.width));
        const centerX = box.x + xPct * box.width;
        const centerY = box.y + box.height - yPct * box.height;
        page.drawImage(embedded, {
          x: Math.max(box.x, Math.min(box.x + box.width - drawW, centerX - drawW / 2)),
          y: Math.max(box.y, Math.min(box.y + box.height - drawH, centerY - drawH / 2)),
          width: drawW,
          height: drawH,
          opacity,
        });
      }

      const out = await doc.save();
      setResultBytes(out);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Failed to embed image into PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF File"
          helperText="Upload a PDF first, then pick your PNG or JPG logo/image and click where to place it."
          onFilesSelected={handlePdfFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pageCount}
            onClear={() => {
              setFile(null);
              setBytes(null);
              setResultBytes(null);
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Overlay Image (PNG or JPG)
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 cursor-pointer text-xs font-semibold text-blue-700">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>{imgFile ? imgFile.name : 'Choose PNG / JPG Image'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                    onChange={(e) => handleImagePick(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Image Width ({widthPct}% of page width)
                </label>
                <input
                  type="range"
                  min={5}
                  max={85}
                  value={widthPct}
                  onChange={(e) => {
                    setWidthPct(Number(e.target.value));
                    setResultBytes(null);
                  }}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min={0.15}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(Number(e.target.value));
                    setResultBytes(null);
                  }}
                  className="w-full accent-blue-600"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyAllPages}
                  onChange={(e) => {
                    setApplyAllPages(e.target.checked);
                    setResultBytes(null);
                  }}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Apply image to all {pageCount} pages</span>
              </label>

              <button
                type="button"
                onClick={handleApply}
                disabled={!imgFile || progress !== null}
                className="w-full px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Embed Image &amp; Download PDF
              </button>
            </div>

            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">
                  Click preview canvas to position image center
                </span>
                <PageNavigator
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onChange={setCurrentPage}
                />
              </div>

              <div className="flex justify-center overflow-auto">
                {previewUrl && (
                  <div
                    onClick={handlePreviewClick}
                    className="relative inline-block cursor-crosshair border border-slate-300 bg-white shadow-sm select-none"
                  >
                    <img
                      src={previewUrl}
                      alt={`Page ${currentPage}`}
                      className="max-w-full max-h-[540px] block pointer-events-none"
                    />
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt="Placed overlay preview"
                        style={{
                          left: `${xPct * 100}%`,
                          top: `${yPct * 100}%`,
                          width: `${widthPct}%`,
                          opacity,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className="absolute pointer-events-none border border-dashed border-blue-600"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText="Embedding image into PDF..." />

          {resultBytes && (
            <PdfResultCard
              title="Image Embedded in PDF"
              details={`Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-with-image.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 18. Add Watermark
// ============================================================================
export function AddWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const [watermarkMode, setWatermarkMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(44);
  const [color, setColor] = useState('#334155');
  const [opacity, setOpacity] = useState(0.22);
  const [layout, setLayout] = useState<'diagonal' | 'horizontal' | 'tiled'>('diagonal');
  const [targetScope, setTargetScope] = useState<'all' | 'first' | 'custom'>('all');
  const [customRange, setCustomRange] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoScalePct, setLogoScalePct] = useState(32);

  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
    } catch {
      setError('Could not load this PDF.');
    }
  };

  const handleApply = async () => {
    if (!bytes) return;
    if (watermarkMode === 'text' && !text.trim()) {
      setError('Enter watermark text first.');
      return;
    }
    if (watermarkMode === 'image' && !logoFile) {
      setError('Select a PNG or JPG logo for image watermark mode.');
      return;
    }

    setError(null);
    setProgress(30);
    try {
      const doc = await PDFDocument.load(bytes);
      const allPages = doc.getPages();
      let indices: number[];
      if (targetScope === 'first') {
        indices = [0];
      } else if (targetScope === 'custom') {
        indices = parsePageRanges(customRange, allPages.length);
        if (indices.length === 0) {
          setProgress(null);
          setError(`Enter valid page numbers between 1 and ${allPages.length}.`);
          return;
        }
      } else {
        indices = allPages.map((_, i) => i);
      }

      if (watermarkMode === 'text') {
        const label = text.trim();
        if (WIN_ANSI_REGEX.test(label)) {
          const font = await doc.embedFont(StandardFonts.HelveticaBold);
          const rgbColor = hexToPdfRgb(color);
          const textWidth = font.widthOfTextAtSize(label, fontSize);

          for (const idx of indices) {
            const page = allPages[idx];
            const { width, height } = page.getSize();
            if (layout === 'horizontal') {
              page.drawText(label, {
                x: (width - textWidth) / 2,
                y: height / 2 - fontSize / 2,
                size: fontSize,
                font,
                color: rgbColor,
                opacity,
              });
            } else if (layout === 'diagonal') {
              const rad = (45 * Math.PI) / 180;
              page.drawText(label, {
                x: width / 2 - (textWidth / 2) * Math.cos(rad) + (fontSize / 2) * Math.sin(rad),
                y: height / 2 - (textWidth / 2) * Math.sin(rad) - (fontSize / 2) * Math.cos(rad),
                size: fontSize,
                font,
                color: rgbColor,
                opacity,
                rotate: degrees(45),
              });
            } else {
              const tileSize = Math.max(14, Math.min(28, fontSize * 0.55));
              const tileW = font.widthOfTextAtSize(label, tileSize);
              const stepX = Math.max(150, tileW + 70);
              const stepY = 140;
              for (let y = 60; y < height - 20; y += stepY) {
                for (let x = 40; x < width - 20; x += stepX) {
                  page.drawText(label, {
                    x,
                    y,
                    size: tileSize,
                    font,
                    color: rgbColor,
                    opacity,
                    rotate: degrees(35),
                  });
                }
              }
            }
          }
        } else {
          const rendered = await renderUnicodeTextPng(label, fontSize, color, 'Helvetica');
          const embeddedLabel = await doc.embedPng(rendered.pngBytes);
          for (const idx of indices) {
            const page = allPages[idx];
            const { width, height } = page.getSize();
            page.drawImage(embeddedLabel, {
              x: Math.max(10, (width - rendered.widthPt) / 2),
              y: Math.max(10, (height - rendered.heightPt) / 2),
              width: Math.min(width - 20, rendered.widthPt),
              height: rendered.heightPt,
              opacity,
            });
          }
        }
      } else if (logoFile) {
        const raw = await readFileAsUint8Array(logoFile);
        let embedded;
        try {
          if (raw.length >= 3 && raw[0] === 0xff && raw[1] === 0xd8) {
            embedded = await doc.embedJpg(raw);
          } else if (raw.length >= 4 && raw[0] === 0x89 && raw[1] === 0x50) {
            embedded = await doc.embedPng(raw);
          } else {
            const png = await imageFileToPngBytes(logoFile);
            embedded = await doc.embedPng(png);
          }
        } catch {
          const png = await imageFileToPngBytes(logoFile);
          embedded = await doc.embedPng(png);
        }

        for (const idx of indices) {
          const page = allPages[idx];
          const { width, height } = page.getSize();
          const drawW = (logoScalePct / 100) * width;
          const drawH = drawW * (embedded.height / Math.max(1, embedded.width));
          page.drawImage(embedded, {
            x: (width - drawW) / 2,
            y: (height - drawH) / 2,
            width: drawW,
            height: drawH,
            opacity,
          });
        }
      }

      const out = await doc.save();
      setResultBytes(out);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Failed to apply watermark.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Watermark"
          helperText="Stamp text watermarks or transparent PNG logos across PDF pages locally."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pageCount}
            onClear={() => {
              setFile(null);
              setBytes(null);
              setResultBytes(null);
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                aria-pressed={watermarkMode === 'text'}
                onClick={() => {
                  setWatermarkMode('text');
                  setResultBytes(null);
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold ${
                  watermarkMode === 'text' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Text Watermark
              </button>
              <button
                type="button"
                aria-pressed={watermarkMode === 'image'}
                onClick={() => {
                  setWatermarkMode('image');
                  setResultBytes(null);
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold ${
                  watermarkMode === 'image' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Image Watermark
              </button>
            </div>

            {watermarkMode === 'text' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setResultBytes(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Layout
                  </label>
                  <select
                    value={layout}
                    onChange={(e) =>
                      setLayout(e.target.value as 'diagonal' | 'horizontal' | 'tiled')
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="diagonal">Center Diagonal (-45°)</option>
                    <option value="horizontal">Center Horizontal</option>
                    <option value="tiled">Tiled Pattern Grid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Font Size ({fontSize} pt)
                  </label>
                  <input
                    type="range"
                    min={16}
                    max={84}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2.5"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Watermark Logo (PNG or JPG)
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      setLogoFile(e.target.files?.[0] || null);
                      setResultBytes(null);
                    }}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Logo Width ({logoScalePct}% of page width)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={logoScalePct}
                    onChange={(e) => setLogoScalePct(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2.5"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              {watermarkMode === 'text' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-9 h-9 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{color}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min={0.08}
                  max={0.85}
                  step={0.02}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Apply to Pages
                </label>
                <select
                  value={targetScope}
                  onChange={(e) =>
                    setTargetScope(e.target.value as 'all' | 'first' | 'custom')
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="all">All Pages ({pageCount})</option>
                  <option value="first">First Page Only</option>
                  <option value="custom">Custom Page Range</option>
                </select>
              </div>
            </div>

            {targetScope === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Page Numbers / Ranges (e.g. 1-3, 5)
                </label>
                <input
                  type="text"
                  value={customRange}
                  onChange={(e) => setCustomRange(e.target.value)}
                  placeholder={`e.g. 1-${Math.min(3, pageCount)}`}
                  className="w-full sm:w-72 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApply}
                disabled={progress !== null}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Apply Watermark &amp; Download
              </button>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText="Stamping watermark across pages..." />

          {resultBytes && (
            <PdfResultCard
              title="Watermark Applied"
              details={`Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download Watermarked PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-watermarked.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 19. Sign PDF
// ============================================================================
export function SignPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [sigMode, setSigMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [inkColor, setInkColor] = useState('#0f172a');
  const [typedName, setTypedName] = useState('Jordan Lee');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [hasDrawnStroke, setHasDrawnStroke] = useState(false);

  const [xPct, setXPct] = useState(0.68);
  const [yPct, setYPct] = useState(0.8);
  const [sigWidthPct, setSigWidthPct] = useState(24);
  const [applyAllPages, setApplyAllPages] = useState(false);

  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const { previewUrl } = usePdfPagePreview(bytes, currentPage, 1.35);

  const exportDrawnPad = () => {
    const c = drawCanvasRef.current;
    if (!c) return;
    setSignatureDataUrl(c.toDataURL('image/png'));
  };

  const clearDrawnPad = () => {
    const c = drawCanvasRef.current;
    if (c) {
      const ctx = c.getContext('2d');
      ctx?.clearRect(0, 0, c.width, c.height);
    }
    setHasDrawnStroke(false);
    if (sigMode === 'draw') setSignatureDataUrl(null);
    setResultBytes(null);
  };

  // Generate transparent PNG signature when typing (auto-scales long names cleanly)
  useEffect(() => {
    if (sigMode !== 'type') return;
    if (!typedName.trim()) {
      setSignatureDataUrl(null);
      return;
    }
    const c = document.createElement('canvas');
    c.width = 520;
    c.height = 150;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = inkColor;
    let size = 54;
    ctx.font = `italic ${size}px "Brush Script MT", "Segoe Script", "Apple Chancery", Georgia, serif`;
    while (ctx.measureText(typedName.trim()).width > c.width - 32 && size > 20) {
      size -= 2;
      ctx.font = `italic ${size}px "Brush Script MT", "Segoe Script", "Apple Chancery", Georgia, serif`;
    }
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(typedName.trim(), c.width / 2, c.height / 2);
    setSignatureDataUrl(c.toDataURL('image/png'));
  }, [sigMode, typedName, inkColor]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = drawCanvasRef.current;
    if (!c) return;
    c.setPointerCapture(e.pointerId);
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const c = drawCanvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.stroke();
    setHasDrawnStroke(true);
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    exportDrawnPad();
    setResultBytes(null);
  };

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
      setCurrentPage(1);
    } catch {
      setError('Could not load this PDF.');
    }
  };

  const handleUploadSignature = async (picked: File | null) => {
    if (!picked) return;
    try {
      const pngBytes = await imageFileToPngBytes(picked);
      const copy = new Uint8Array(pngBytes.byteLength);
      copy.set(pngBytes);
      const blob = new Blob([copy], { type: 'image/png' });
      const reader = new FileReader();
      reader.onload = () => setSignatureDataUrl(String(reader.result));
      reader.readAsDataURL(blob);
      setResultBytes(null);
    } catch {
      setError('Could not load uploaded signature image.');
    }
  };

  const handleSignPdf = async () => {
    if (!bytes || !signatureDataUrl) return;
    setError(null);
    setProgress(40);
    try {
      const doc = await PDFDocument.load(bytes);
      const res = await fetch(signatureDataUrl);
      const pngBytes = new Uint8Array(await res.arrayBuffer());
      const embeddedSig = await doc.embedPng(pngBytes);

      const pages = doc.getPages();
      const targets = applyAllPages ? pages : [pages[currentPage - 1]].filter(Boolean);

      for (const page of targets) {
        const box = page.getCropBox();
        const drawW = (sigWidthPct / 100) * box.width;
        const drawH = drawW * (embeddedSig.height / Math.max(1, embeddedSig.width));
        const cx = box.x + xPct * box.width;
        const cy = box.y + box.height - yPct * box.height;
        page.drawImage(embeddedSig, {
          x: Math.max(box.x, Math.min(box.x + box.width - drawW, cx - drawW / 2)),
          y: Math.max(box.y, Math.min(box.y + box.height - drawH, cy - drawH / 2)),
          width: drawW,
          height: drawH,
        });
      }

      const out = await doc.save();
      setResultBytes(out);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Failed to embed signature.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Sign"
          helperText="Upload a PDF, draw/type/upload your signature, and click anywhere on the page to sign locally."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pageCount}
            onClear={() => {
              setFile(null);
              setBytes(null);
              setResultBytes(null);
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {(['draw', 'type', 'upload'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={sigMode === m}
                    onClick={() => {
                      setSigMode(m);
                      setResultBytes(null);
                      if (m === 'draw') {
                        if (hasDrawnStroke) {
                          setTimeout(exportDrawnPad, 0);
                        } else {
                          setSignatureDataUrl(null);
                        }
                      }
                      if (m === 'upload') setSignatureDataUrl(null);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize ${
                      sigMode === m ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {sigMode !== 'upload' && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-700">Ink Color:</span>
                  {[
                    { label: 'Black', value: '#0f172a' },
                    { label: 'Navy Blue', value: '#1e3a8a' },
                    { label: 'Royal Blue', value: '#1d4ed8' },
                  ].map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setInkColor(c.value)}
                      className={`px-2.5 py-1 rounded border text-xs ${
                        inkColor === c.value
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {sigMode === 'draw' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Draw signature inside the box</span>
                    <button
                      type="button"
                      onClick={clearDrawnPad}
                      className="text-blue-700 hover:underline font-medium"
                    >
                      Clear Pad
                    </button>
                  </div>
                  <canvas
                    ref={drawCanvasRef}
                    width={460}
                    height={160}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="w-full h-36 rounded-lg border border-slate-300 bg-slate-50/70 touch-none cursor-crosshair"
                  />
                </div>
              )}

              {sigMode === 'type' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Type Your Full Name
                  </label>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Enter signature name..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {signatureDataUrl && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2 flex justify-center">
                      <img src={signatureDataUrl} alt="Typed signature preview" className="h-14 object-contain" />
                    </div>
                  )}
                </div>
              )}

              {sigMode === 'upload' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Upload Signature Image (PNG/JPG)
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                    onChange={(e) => handleUploadSignature(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Signature Width ({sigWidthPct}% of page width)
                </label>
                <input
                  type="range"
                  min={8}
                  max={55}
                  value={sigWidthPct}
                  onChange={(e) => setSigWidthPct(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyAllPages}
                  onChange={(e) => setApplyAllPages(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Place signature on all {pageCount} pages</span>
              </label>

              <button
                type="button"
                onClick={handleSignPdf}
                disabled={!signatureDataUrl || progress !== null}
                className="w-full px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Sign &amp; Download PDF
              </button>
            </div>

            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">
                  Click anywhere on page {currentPage} to position your signature
                </span>
                <PageNavigator
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onChange={setCurrentPage}
                />
              </div>

              <div className="flex justify-center overflow-auto">
                {previewUrl && (
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setXPct(Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width)));
                      setYPct(Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height)));
                      setResultBytes(null);
                    }}
                    className="relative inline-block cursor-crosshair border border-slate-300 bg-white shadow-sm select-none"
                  >
                    <img
                      src={previewUrl}
                      alt={`Page ${currentPage}`}
                      className="max-w-full max-h-[540px] block pointer-events-none"
                    />
                    {signatureDataUrl && (
                      <img
                        src={signatureDataUrl}
                        alt="Signature placement preview"
                        style={{
                          left: `${xPct * 100}%`,
                          top: `${yPct * 100}%`,
                          width: `${sigWidthPct}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className="absolute pointer-events-none border border-dashed border-blue-600"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText="Applying signature onto PDF..." />

          {resultBytes && (
            <PdfResultCard
              title="Signed PDF Ready"
              details={`Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download Signed PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-signed.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 20. Crop PDF
// ============================================================================
export function CropPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [topPct, setTopPct] = useState(5);
  const [rightPct, setRightPct] = useState(5);
  const [bottomPct, setBottomPct] = useState(5);
  const [leftPct, setLeftPct] = useState(5);
  const [scope, setScope] = useState<'all' | 'current'>('all');

  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const { previewUrl } = usePdfPagePreview(bytes, currentPage, 1.35);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
      setCurrentPage(1);
    } catch {
      setError('Could not load this PDF.');
    }
  };

  const applyUniform = (pct: number) => {
    setTopPct(pct);
    setRightPct(pct);
    setBottomPct(pct);
    setLeftPct(pct);
    setResultBytes(null);
  };

  const handleCrop = async () => {
    if (!bytes) return;
    if (leftPct + rightPct >= 92 || topPct + bottomPct >= 92) {
      setError('Crop margins cannot overlap or exceed 92% of the page dimension.');
      return;
    }

    setError(null);
    setProgress(40);
    try {
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();
      const targets = scope === 'all' ? pages : [pages[currentPage - 1]].filter(Boolean);

      for (const page of targets) {
        const box = page.getCropBox();
        const angle = ((page.getRotation().angle % 360) + 360) % 360;
        let t = topPct;
        let r = rightPct;
        let b = bottomPct;
        let l = leftPct;
        if (angle === 90) {
          t = leftPct;
          r = topPct;
          b = rightPct;
          l = bottomPct;
        } else if (angle === 180) {
          t = bottomPct;
          r = leftPct;
          b = topPct;
          l = rightPct;
        } else if (angle === 270) {
          t = rightPct;
          r = bottomPct;
          b = leftPct;
          l = topPct;
        }
        const newX = box.x + (l / 100) * box.width;
        const newY = box.y + (b / 100) * box.height;
        const newW = box.width * (1 - (l + r) / 100);
        const newH = box.height * (1 - (t + b) / 100);
        page.setCropBox(newX, newY, newW, newH);
        page.setMediaBox(newX, newY, newW, newH);
      }

      const out = await doc.save();
      setResultBytes(out);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Failed to crop PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Crop"
          helperText="Trim outer white margins visually across one or all pages without re-encoding text."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pageCount}
            onClear={() => {
              setFile(null);
              setBytes(null);
              setResultBytes(null);
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Quick Uniform Margin Presets
                </div>
                <div className="flex flex-wrap gap-2">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyUniform(pct)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-semibold text-slate-700 font-mono"
                    >
                      {pct}% all sides
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Top Trim', value: topPct, setter: setTopPct, max: 45 },
                { label: 'Bottom Trim', value: bottomPct, setter: setBottomPct, max: 45 },
                { label: 'Left Trim', value: leftPct, setter: setLeftPct, max: 45 },
                { label: 'Right Trim', value: rightPct, setter: setRightPct, max: 45 },
              ].map((ctrl) => (
                <div key={ctrl.label}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{ctrl.label}</span>
                    <span className="font-mono tabular-nums">{ctrl.value}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={ctrl.max}
                    value={ctrl.value}
                    onChange={(e) => {
                      ctrl.setter(Number(e.target.value));
                      setResultBytes(null);
                    }}
                    className="w-full accent-blue-600"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Apply Crop To
                </label>
                <select
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value as 'all' | 'current');
                    setResultBytes(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="all">All Pages ({pageCount})</option>
                  <option value="current">Current Page Only (Page {currentPage})</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleCrop}
                disabled={progress !== null}
                className="w-full px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Crop &amp; Download PDF
              </button>
            </div>

            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600">
                  Darkened borders will be trimmed from output
                </span>
                <PageNavigator
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onChange={setCurrentPage}
                />
              </div>

              <div className="flex justify-center overflow-auto">
                {previewUrl && (
                  <div className="relative inline-block border border-slate-300 bg-white shadow-sm overflow-hidden">
                    <img
                      src={previewUrl}
                      alt={`Page ${currentPage} crop preview`}
                      className="max-w-full max-h-[540px] block"
                    />
                    {/* Shaded outer regions */}
                    <div
                      style={{ height: `${topPct}%` }}
                      className="absolute top-0 left-0 right-0 bg-slate-900/45 pointer-events-none"
                    />
                    <div
                      style={{ height: `${bottomPct}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-slate-900/45 pointer-events-none"
                    />
                    <div
                      style={{ top: `${topPct}%`, bottom: `${bottomPct}%`, width: `${leftPct}%` }}
                      className="absolute left-0 bg-slate-900/45 pointer-events-none"
                    />
                    <div
                      style={{ top: `${topPct}%`, bottom: `${bottomPct}%`, width: `${rightPct}%` }}
                      className="absolute right-0 bg-slate-900/45 pointer-events-none"
                    />
                    {/* Active crop outline */}
                    <div
                      style={{
                        top: `${topPct}%`,
                        right: `${rightPct}%`,
                        bottom: `${bottomPct}%`,
                        left: `${leftPct}%`,
                      }}
                      className="absolute border-2 border-blue-600 pointer-events-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText="Updating PDF CropBox boundaries..." />

          {resultBytes && (
            <PdfResultCard
              title="PDF Cropped Cleanly"
              details={`Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download Cropped PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-cropped.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
