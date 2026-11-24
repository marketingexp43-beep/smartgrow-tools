import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Download, Plus, Trash2 } from 'lucide-react';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { Document, HeadingLevel, Packer, PageBreak, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import {
  PdfErrorBanner,
  PdfFileInfoBar,
  PdfProgressBar,
  PdfResultCard,
  PdfUploadZone,
} from '../../components/PdfUploadZone';
import {
  ExtractedPageText,
  downloadBlob,
  downloadUint8Array,
  extractPdfTextPages,
  formatFileSize,
  getPdfMetadata,
  imageFileToPngBytes,
  parsePageRanges,
  readFileAsUint8Array,
  renderPdfPageToCanvas,
  safeBaseName,
} from '../../utils/pdfCore';

// ============================================================================
// 10 & 11. PDF to JPG / PDF to PNG
// ============================================================================
interface RenderedPageItem {
  pageNumber: number;
  filename: string;
  dataUrl: string;
  blob: Blob;
}

export function PdfToImageTool({ mode }: { mode: 'jpg' | 'png' }) {
  const ext = mode === 'jpg' ? 'jpg' : 'png';
  const labelUpper = ext.toUpperCase();

  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState<number>(2);
  const [jpgQuality, setJpgQuality] = useState<number>(90);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [pageRangeInput, setPageRangeInput] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<RenderedPageItem[]>([]);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setItems([]);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
      setPageRangeInput('');
    } catch {
      setError('Could not read this PDF. If it is password-protected, unlock it first.');
    }
  };

  const handleConvert = async () => {
    if (!bytes || !file) return;
    setError(null);
    setItems([]);

    const indices =
      pageRangeInput.trim().length > 0
        ? parsePageRanges(pageRangeInput, pageCount)
        : Array.from({ length: pageCount }, (_, i) => i);

    if (indices.length === 0) {
      setError(`Enter valid page numbers between 1 and ${pageCount}, or leave blank for all pages.`);
      return;
    }

    const base = safeBaseName(file.name);
    const mime = mode === 'jpg' ? 'image/jpeg' : 'image/png';
    const rendered: RenderedPageItem[] = [];

    try {
      for (let i = 0; i < indices.length; i += 1) {
        const pageNum = indices[i] + 1;
        setStatusText(`Rendering page ${pageNum} (${i + 1} of ${indices.length})...`);
        setProgress(((i + 0.5) / indices.length) * 100);

        const canvas = await renderPdfPageToCanvas(bytes, pageNum, scale, {
          transparentBackground: mode === 'png' && transparentBg,
        });

        const qualityArg = mode === 'jpg' ? jpgQuality / 100 : undefined;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Image export failed.'))),
            mime,
            qualityArg
          );
        });
        const dataUrl = canvas.toDataURL(mime, qualityArg);

        rendered.push({
          pageNumber: pageNum,
          filename: `${base}-page-${String(pageNum).padStart(3, '0')}.${ext}`,
          dataUrl,
          blob,
        });
        setProgress(((i + 1) / indices.length) * 100);
      }

      setItems(rendered);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : `Failed to convert PDF pages to ${labelUpper}.`);
    }
  };

  const handleDownloadAllZip = async () => {
    if (items.length === 0 || !file) return;
    const zip = new JSZip();
    for (const item of items) {
      zip.file(item.filename, item.blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${safeBaseName(file.name)}-${ext}-pages.zip`);
  };

  const reset = () => {
    setFile(null);
    setBytes(null);
    setPageCount(0);
    setItems([]);
    setError(null);
    setProgress(null);
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label={`Choose PDF to Convert to ${labelUpper}`}
          helperText="Drop a PDF file here to render high-resolution page images locally."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar file={file} pageCount={pageCount} onClear={reset} />

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Resolution Scale
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value={1}>1x Screen (72 DPI)</option>
                  <option value={2}>2x Sharp (144 DPI)</option>
                  <option value={3}>3x High-Res (216 DPI)</option>
                </select>
              </div>

              {mode === 'jpg' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    JPEG Quality ({jpgQuality}%)
                  </label>
                  <input
                    type="range"
                    min={60}
                    max={100}
                    step={5}
                    value={jpgQuality}
                    onChange={(e) => setJpgQuality(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2"
                  />
                </div>
              ) : (
                <div className="flex items-end pb-1">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={transparentBg}
                      onChange={(e) => setTransparentBg(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>Preserve transparent page background (where uncolored)</span>
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pages (optional, e.g. 1-3, 5)
                </label>
                <input
                  type="text"
                  value={pageRangeInput}
                  onChange={(e) => setPageRangeInput(e.target.value)}
                  placeholder={`All pages (1-${pageCount})`}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleConvert}
                disabled={progress !== null}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Convert to {labelUpper}
              </button>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText={statusText} />

          {items.length > 0 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Converted {items.length} {items.length === 1 ? 'Page' : 'Pages'} to {labelUpper}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Download individual page images below or save every image in a single ZIP archive.
                  </p>
                </div>
                {items.length > 1 ? (
                  <button
                    type="button"
                    onClick={handleDownloadAllZip}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download All ({items.length}) ZIP</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => downloadBlob(items[0].blob, items[0].filename)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download {labelUpper}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.pageNumber}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[3/4] bg-slate-50 border-b border-slate-100 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.dataUrl}
                        alt={`Page ${item.pageNumber}`}
                        className="max-w-full max-h-full object-contain shadow-xs"
                      />
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900">
                          Page {item.pageNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {formatFileSize(item.blob.size)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadBlob(item.blob, item.filename)}
                        aria-label={`Download page ${item.pageNumber} as ${labelUpper}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-blue-700"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{labelUpper}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 12 & 13. JPG to PDF / PNG to PDF
// ============================================================================
interface QueuedImage {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export function ImageToPdfTool({ mode }: { mode: 'jpg' | 'png' }) {
  const labelUpper = mode.toUpperCase();
  const acceptStr = mode === 'jpg' ? 'image/jpeg,.jpg,.jpeg' : 'image/png,.png';

  const [images, setImages] = useState<QueuedImage[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [marginPt, setMarginPt] = useState<number>(18);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const loadImageDimensions = (file: File): Promise<{ url: string; width: number; height: number }> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ url, width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`"${file.name}" could not be decoded as an image.`));
      };
      img.src = url;
    });

  const handleAddFiles = async (files: File[]) => {
    setError(null);
    setResultBytes(null);
    const added: QueuedImage[] = [];
    for (const file of files) {
      try {
        const meta = await loadImageDimensions(file);
        added.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: meta.url,
          width: meta.width,
          height: meta.height,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unsupported image file.');
      }
    }
    setImages((prev) => [...prev, ...added]);
  };

  const moveImage = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    setResultBytes(null);
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const removeImage = (id: string) => {
    setResultBytes(null);
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setResultBytes(null);
    setError(null);
    setProgress(null);
  };

  const isJpegHeader = (bytes: Uint8Array) =>
    bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPngHeader = (bytes: Uint8Array) =>
    bytes.length >= 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;

  const handleCreatePdf = async () => {
    if (images.length === 0) return;
    setError(null);
    setResultBytes(null);
    setProgress(10);

    try {
      const doc = await PDFDocument.create();

      for (let i = 0; i < images.length; i += 1) {
        const item = images[i];
        setProgress(10 + ((i + 1) / images.length) * 80);
        const raw = await readFileAsUint8Array(item.file);

        let embedded;
        try {
          if (isJpegHeader(raw)) {
            embedded = await doc.embedJpg(raw);
          } else if (isPngHeader(raw)) {
            embedded = await doc.embedPng(raw);
          } else {
            const pngBytes = await imageFileToPngBytes(item.file);
            embedded = await doc.embedPng(pngBytes);
          }
        } catch {
          const pngBytes = await imageFileToPngBytes(item.file);
          embedded = await doc.embedPng(pngBytes);
        }

        const imgW = embedded.width;
        const imgH = embedded.height;

        if (pageSize === 'fit') {
          const pageW = imgW + marginPt * 2;
          const pageH = imgH + marginPt * 2;
          const page = doc.addPage([pageW, pageH]);
          page.drawImage(embedded, {
            x: marginPt,
            y: marginPt,
            width: imgW,
            height: imgH,
          });
        } else {
          const baseW = pageSize === 'a4' ? 595.28 : 612;
          const baseH = pageSize === 'a4' ? 841.89 : 792;
          const useLandscape =
            orientation === 'landscape' || (orientation === 'auto' && imgW > imgH);
          const pageW = useLandscape ? baseH : baseW;
          const pageH = useLandscape ? baseW : baseH;
          const page = doc.addPage([pageW, pageH]);

          const availW = Math.max(20, pageW - marginPt * 2);
          const availH = Math.max(20, pageH - marginPt * 2);
          const scaleFactor = Math.min(availW / imgW, availH / imgH);
          const drawW = imgW * scaleFactor;
          const drawH = imgH * scaleFactor;

          page.drawImage(embedded, {
            x: (pageW - drawW) / 2,
            y: (pageH - drawH) / 2,
            width: drawW,
            height: drawH,
          });
        }
      }

      const saved = await doc.save();
      setResultBytes(saved);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : `Failed to build PDF from ${labelUpper} images.`);
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {images.length === 0 ? (
        <PdfUploadZone
          accept={acceptStr}
          multiple
          label={`Choose ${labelUpper} Images`}
          helperText={`Select or drop one or more ${labelUpper} files to combine into a PDF.`}
          onFilesSelected={handleAddFiles}
        />
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
            <div className="px-4 py-3 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700">
                {images.length} {images.length === 1 ? 'image' : 'images'} queued
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Add More</span>
                  <input
                    type="file"
                    accept={acceptStr}
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleAddFiles(Array.from(e.target.files));
                      e.target.value = '';
                    }}
                    className="sr-only"
                  />
                </label>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-slate-500 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
            </div>

            {images.map((item, idx) => (
              <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-semibold text-slate-400 w-5 tabular-nums">
                    {idx + 1}.
                  </span>
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-11 h-11 rounded-lg border border-slate-200 object-cover bg-slate-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {item.file.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {item.width}×{item.height}px · {formatFileSize(item.file.size)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    aria-label={`Move ${item.file.name} up`}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === images.length - 1}
                    aria-label={`Move ${item.file.name} down`}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-700 hover:border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as 'fit' | 'a4' | 'letter')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Orientation
                </label>
                <select
                  value={orientation}
                  disabled={pageSize === 'fit'}
                  onChange={(e) =>
                    setOrientation(e.target.value as 'auto' | 'portrait' | 'landscape')
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-600 focus:outline-none"
                >
                  <option value="auto">Auto (match each image)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Page Margin
                </label>
                <select
                  value={marginPt}
                  onChange={(e) => setMarginPt(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value={0}>No Margin (0 pt)</option>
                  <option value={18}>Small Margin (18 pt)</option>
                  <option value={36}>Standard Margin (36 pt)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCreatePdf}
                disabled={progress !== null}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Create PDF ({images.length} {images.length === 1 ? 'Page' : 'Pages'})
              </button>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText={`Embedding ${labelUpper} images into PDF...`} />

          {resultBytes && (
            <PdfResultCard
              title="PDF Document Created"
              details={`${images.length} image ${images.length === 1 ? 'page' : 'pages'} · Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(images[0].file.name)}-images.pdf`)
              }
              onReset={clearAll}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 14. PDF to Word (DOCX)
// ============================================================================
export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ExtractedPageText[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setFile(picked);
    setPages([]);
    setDocxBlob(null);
    setError(null);
    setProgress(5);

    try {
      const data = await readFileAsUint8Array(picked);
      const extracted = await extractPdfTextPages(data, (done, total) => {
        setProgress((done / Math.max(1, total)) * 80);
      });
      setPages(extracted);

      const children: Paragraph[] = [];
      extracted.forEach((page, pIdx) => {
        if (pIdx > 0) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
        if (page.lines.length === 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `[Page ${page.pageNumber}: No selectable text found]`, italics: true })],
            })
          );
          return;
        }
        page.lines.forEach((line) => {
          children.push(
            new Paragraph({
              heading: line.isHeadingCandidate ? HeadingLevel.HEADING_2 : undefined,
              spacing: { after: line.isHeadingCandidate ? 140 : 90 },
              children: [
                new TextRun({
                  text: line.text,
                  bold: line.isHeadingCandidate,
                }),
              ],
            })
          );
        });
      });

      setProgress(90);
      const doc = new Document({
        sections: [{ children }],
      });
      const blob = await Packer.toBlob(doc);
      setDocxBlob(blob);
      setProgress(null);
    } catch {
      setProgress(null);
      setError('Could not read selectable text from this PDF. If it is password-locked, unlock it first.');
    }
  };

  const totalWords = pages.reduce(
    (sum, p) => sum + (p.text.trim() ? p.text.trim().split(/\s+/).length : 0),
    0
  );

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Convert to Word (.docx)"
          helperText="Extracts headings and text paragraphs locally into a real editable Microsoft Word (.docx) document."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pages.length || undefined}
            extraText={pages.length > 0 ? `${totalWords.toLocaleString()} words extracted` : undefined}
            onClear={() => {
              setFile(null);
              setPages([]);
              setDocxBlob(null);
              setError(null);
              setProgress(null);
            }}
          />

          <PdfProgressBar progress={progress} statusText="Extracting structured text and generating DOCX..." />

          {pages.length > 0 && totalWords === 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900">
              This PDF contains <strong>0 selectable characters</strong>, which usually means it is a flat scanned image PDF.{' '}
              <Link to="/pdf-tools/ocr-pdf" className="font-semibold text-blue-700 underline">
                Open OCR PDF
              </Link>{' '}
              to recognize text from scanned pages first.
            </div>
          )}

          {docxBlob && (
            <PdfResultCard
              title="Editable Word Document (.docx) Ready"
              details={`${pages.length} ${pages.length === 1 ? 'page' : 'pages'} · ${totalWords.toLocaleString()} words · Size ${formatFileSize(docxBlob.size)}`}
              downloadLabel="Download DOCX"
              onDownload={() => downloadBlob(docxBlob, `${safeBaseName(file.name)}.docx`)}
            />
          )}

          {pages.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-700">
                Extracted Structure Preview
              </div>
              <div className="max-h-80 overflow-y-auto p-5 space-y-5 text-sm text-slate-700">
                {pages.map((page) => (
                  <div key={page.pageNumber} className="space-y-2 pb-4 border-b border-slate-100 last:border-b-0">
                    <div className="font-mono text-[11px] font-semibold text-blue-700">
                      Page {page.pageNumber}
                    </div>
                    {page.lines.length === 0 ? (
                      <p className="text-xs italic text-slate-400">No selectable text on this page.</p>
                    ) : (
                      page.lines.slice(0, 25).map((line, i) =>
                        line.isHeadingCandidate ? (
                          <h4 key={i} className="font-display font-bold text-slate-900 text-base">
                            {line.text}
                          </h4>
                        ) : (
                          <p key={i} className="leading-relaxed">
                            {line.text}
                          </p>
                        )
                      )
                    )}
                    {page.lines.length > 25 && (
                      <p className="text-xs text-slate-400">
                        + {page.lines.length - 25} more lines included in downloaded .docx
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 15. Word to PDF
// ============================================================================
interface ParsedDocBlock {
  kind: 'heading' | 'paragraph' | 'list-item' | 'quote' | 'table-row' | 'image';
  level?: number;
  text: string;
  src?: string;
}

function parseHtmlToBlocks(html: string): ParsedDocBlock[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: ParsedDocBlock[] = [];

  const pushImagesInside = (node: Element) => {
    node.querySelectorAll('img').forEach((imgEl) => {
      const src = imgEl.getAttribute('src');
      if (src && src.startsWith('data:image/')) {
        blocks.push({ kind: 'image', text: imgEl.getAttribute('alt') || 'Embedded image', src });
      }
    });
  };

  const walk = (node: Element) => {
    const tag = node.tagName.toLowerCase();
    if (tag === 'img') {
      const src = node.getAttribute('src');
      if (src && src.startsWith('data:image/')) {
        blocks.push({ kind: 'image', text: node.getAttribute('alt') || 'Embedded image', src });
      }
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) blocks.push({ kind: 'heading', level: Number(tag[1]), text });
      return;
    }
    if (tag === 'p') {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) blocks.push({ kind: 'paragraph', text });
      pushImagesInside(node);
      return;
    }
    if (tag === 'blockquote') {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) blocks.push({ kind: 'quote', text });
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      const isOrdered = tag === 'ol';
      const items = Array.from(node.children).filter((c) => c.tagName.toLowerCase() === 'li');
      items.forEach((li, idx) => {
        const text = (li.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) {
          blocks.push({
            kind: 'list-item',
            text: `${isOrdered ? `${idx + 1}.` : '•'} ${text}`,
          });
        }
      });
      return;
    }
    if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr'));
      rows.forEach((tr) => {
        const cells = Array.from(tr.querySelectorAll('th,td'))
          .map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim())
          .filter(Boolean);
        if (cells.length > 0) {
          blocks.push({ kind: 'table-row', text: cells.join('   |   ') });
        }
      });
      return;
    }
    Array.from(node.children).forEach(walk);
  };

  Array.from(doc.body.children).forEach(walk);
  if (blocks.length === 0 && doc.body.textContent?.trim()) {
    blocks.push({ kind: 'paragraph', text: doc.body.textContent.trim() });
  }
  return blocks;
}

export function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<ParsedDocBlock[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [generatedPages, setGeneratedPages] = useState(0);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    setBlocks([]);
    setWarnings([]);

    if (/\.doc$/i.test(picked.name) && !/\.docx$/i.test(picked.name)) {
      setError(
        'Legacy binary .doc files are not supported natively in browsers. Please save the document as .docx in Word, LibreOffice, or Google Docs and upload the .docx file.'
      );
      return;
    }

    try {
      setProgress(25);
      const arrayBuffer = await picked.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const parsedBlocks = parseHtmlToBlocks(result.value);
      setFile(picked);
      setBlocks(parsedBlocks);
      setWarnings(
        result.messages
          .filter((m) => m.type === 'warning')
          .slice(0, 3)
          .map((m) => m.message)
      );
      setProgress(null);
    } catch {
      setProgress(null);
      setError('Could not parse this .docx file. Make sure it is a valid, unencrypted Word .docx document.');
    }
  };

  const handleConvert = async () => {
    if (!file || blocks.length === 0) return;
    setError(null);
    setResultBytes(null);
    setProgress(15);

    try {
      const pageW = paperSize === 'a4' ? 595.28 : 612;
      const pageH = paperSize === 'a4' ? 841.89 : 792;
      const scale = 2; // 144 DPI crisp rendering supporting full Unicode system fonts
      const marginX = 52;
      const marginY = 56;
      const contentW = pageW - marginX * 2;

      const pages: HTMLCanvasElement[] = [];

      const createCanvasPage = () => {
        const c = document.createElement('canvas');
        c.width = Math.round(pageW * scale);
        c.height = Math.round(pageH * scale);
        const ctx = c.getContext('2d')!;
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageW, pageH);
        ctx.textBaseline = 'top';
        return { canvas: c, ctx };
      };

      let current = createCanvasPage();
      pages.push(current.canvas);
      let cursorY = marginY;

      const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
        const words = text.split(/\s+/);
        const lines: string[] = [];
        let line = '';
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxW && line) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        return lines;
      };

      for (const block of blocks) {
        if (block.kind === 'image' && block.src) {
          try {
            const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
              const el = new Image();
              el.onload = () => resolve(el);
              el.onerror = () => reject(new Error('Image load error'));
              el.src = block.src!;
            });
            const ratio = Math.min(1, contentW / Math.max(1, imgEl.naturalWidth));
            const drawW = imgEl.naturalWidth * ratio;
            const drawH = Math.min(pageH - marginY * 2, imgEl.naturalHeight * ratio);
            if (cursorY + drawH > pageH - marginY) {
              current = createCanvasPage();
              pages.push(current.canvas);
              cursorY = marginY;
            }
            current.ctx.drawImage(imgEl, marginX, cursorY, drawW, drawH);
            cursorY += drawH + 10;
          } catch {
            // Skip unreadable image gracefully
          }
          continue;
        }

        const isHeading = block.kind === 'heading';
        const fontSize =
          block.kind === 'heading'
            ? block.level === 1
              ? 18
              : block.level === 2
                ? 15
                : 13
            : block.kind === 'table-row'
              ? 10.5
              : 11.5;
        const lineHeight = fontSize * 1.48;
        const indentX = block.kind === 'list-item' || block.kind === 'quote' ? 14 : 0;

        current.ctx.font = `${isHeading ? '700' : '400'} ${fontSize}px "Plus Jakarta Sans", "DM Sans", Arial, sans-serif`;
        const wrapped = wrapText(current.ctx, block.text, contentW - indentX);
        const blockSpaceAfter = isHeading ? 8 : 7;

        for (let i = 0; i < wrapped.length; i += 1) {
          if (cursorY + lineHeight > pageH - marginY) {
            current = createCanvasPage();
            pages.push(current.canvas);
            cursorY = marginY;
            current.ctx.font = `${isHeading ? '700' : '400'} ${fontSize}px "Plus Jakarta Sans", "DM Sans", Arial, sans-serif`;
          }

          if (block.kind === 'quote') {
            current.ctx.fillStyle = '#cbd5e1';
            current.ctx.fillRect(marginX + 3, cursorY + 2, 2.5, lineHeight - 4);
          }

          current.ctx.fillStyle =
            block.kind === 'heading'
              ? '#0f172a'
              : block.kind === 'quote'
                ? '#475569'
                : '#1e293b';
          current.ctx.fillText(wrapped[i], marginX + indentX, cursorY);
          cursorY += lineHeight;
        }

        if (block.kind === 'table-row') {
          current.ctx.fillStyle = '#e2e8f0';
          current.ctx.fillRect(marginX, cursorY + 1, contentW, 0.75);
        }

        cursorY += blockSpaceAfter;
      }

      setProgress(65);
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < pages.length; i += 1) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          pages[i].toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas page export failed.'))), 'image/png');
        });
        const pngBytes = new Uint8Array(await blob.arrayBuffer());
        const embedded = await pdfDoc.embedPng(pngBytes);
        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(embedded, { x: 0, y: 0, width: pageW, height: pageH });
        setProgress(65 + ((i + 1) / pages.length) * 30);
      }

      const outBytes = await pdfDoc.save();
      setGeneratedPages(pages.length);
      setResultBytes(outBytes);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Failed to convert Word document to PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          label="Choose Word (.docx) File"
          helperText="Drop a modern Microsoft Word (.docx) file here to convert cleanly into a PDF."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            extraText={`${blocks.length} content blocks parsed`}
            onClear={() => {
              setFile(null);
              setBlocks([]);
              setResultBytes(null);
              setError(null);
            }}
          />

          {warnings.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
              Parser notes: {warnings.join(' · ')}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                PDF Paper Size
              </label>
              <select
                value={paperSize}
                onChange={(e) => {
                  setPaperSize(e.target.value as 'a4' | 'letter');
                  setResultBytes(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleConvert}
              disabled={blocks.length === 0 || progress !== null}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              Convert Word to PDF
            </button>
          </div>

          <PdfProgressBar progress={progress} statusText="Paginating DOCX content onto PDF sheets..." />

          {resultBytes && (
            <PdfResultCard
              title="PDF Document Ready"
              details={`${generatedPages} ${generatedPages === 1 ? 'page' : 'pages'} (${paperSize.toUpperCase()}) · Size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download PDF"
              onDownload={() => downloadUint8Array(resultBytes, `${safeBaseName(file.name)}.pdf`)}
            />
          )}

          {blocks.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-700">
                Parsed Document Preview
              </div>
              <div className="max-h-72 overflow-y-auto p-5 space-y-2.5 text-sm text-slate-700">
                {blocks.slice(0, 30).map((b, i) => (
                  <div
                    key={i}
                    className={
                      b.kind === 'heading'
                        ? 'font-display font-bold text-slate-900 text-base pt-1'
                        : b.kind === 'quote'
                          ? 'pl-3 border-l-2 border-slate-300 text-slate-600'
                          : 'leading-relaxed'
                    }
                  >
                    {b.text}
                  </div>
                ))}
                {blocks.length > 30 && (
                  <p className="text-xs text-slate-400">
                    + {blocks.length - 30} more blocks included in generated PDF
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
