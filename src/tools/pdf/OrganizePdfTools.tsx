import { useState } from 'react';
import { PDFDocument, StandardFonts, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CopyPlus,
  RotateCcw,
  RotateCw,
  Trash2,
} from 'lucide-react';
import {
  PdfErrorBanner,
  PdfFileInfoBar,
  PdfProgressBar,
  PdfResultCard,
  PdfUploadZone,
} from '../../components/PdfUploadZone';
import {
  PdfThumbnail,
  downloadBlob,
  downloadUint8Array,
  formatFileSize,
  getPdfMetadata,
  hexToPdfRgb,
  parsePageRanges,
  parseSplitGroups,
  readFileAsUint8Array,
  renderPdfThumbnails,
  safeBaseName,
} from '../../utils/pdfCore';

interface QueuedPdf {
  id: string;
  file: File;
  bytes: Uint8Array;
  pageCount: number;
}

/* 1. MERGE PDF */
export function MergePdfTool() {
  const [items, setItems] = useState<QueuedPdf[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultPages, setResultPages] = useState(0);

  const handleFiles = async (files: File[]) => {
    setError(null);
    setResultBytes(null);
    setProgress(10);
    setStatus('Reading PDF files...');
    const added: QueuedPdf[] = [];

    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const bytes = await readFileAsUint8Array(file);
        const doc = await PDFDocument.load(bytes);
        added.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          bytes,
          pageCount: doc.getPageCount(),
        });
        setProgress(10 + ((i + 1) / files.length) * 85);
      }
      setItems((prev) => [...prev, ...added]);
    } catch (err) {
      setError(
        err instanceof Error && err.message.toLowerCase().includes('encrypt')
          ? 'One or more PDFs are password-protected. Please unlock them first with Unlock PDF.'
          : 'Could not read one of the selected PDF files. Please verify it is a valid, unencrypted PDF.'
      );
    } finally {
      setProgress(null);
      setStatus('');
    }
  };

  const moveItem = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed);
    setItems(next);
    setResultBytes(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setResultBytes(null);
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    setError(null);
    setProgress(15);
    setStatus('Combining PDF pages...');

    try {
      const merged = await PDFDocument.create();
      for (let i = 0; i < items.length; i += 1) {
        const src = await PDFDocument.load(items[i].bytes);
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
        setProgress(15 + ((i + 1) / items.length) * 75);
      }
      setStatus('Finalizing merged PDF...');
      const out = await merged.save();
      setResultBytes(out);
      setResultPages(merged.getPageCount());
      setProgress(100);
    } catch {
      setError('Failed to merge the PDF files. Please ensure all files are valid PDFs.');
    } finally {
      setTimeout(() => {
        setProgress(null);
        setStatus('');
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      <PdfUploadZone
        multiple
        label={items.length > 0 ? 'Add More PDFs' : 'Select PDF Files to Merge'}
        helperText="Drop two or more PDFs here, arrange their order, and combine them into one file."
        onFilesSelected={handleFiles}
      />

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText={status} />

      {items.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-800">
              Merge Queue ({items.length} files ·{' '}
              {items.reduce((sum, item) => sum + item.pageCount, 0)} total pages)
            </span>
            <button
              type="button"
              onClick={() => {
                setItems([]);
                setResultBytes(null);
              }}
              className="text-xs font-medium text-slate-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <ul className="divide-y divide-slate-200">
            {items.map((item, idx) => (
              <li
                key={item.id}
                className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-md w-6 h-6 flex items-center justify-center shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {item.file.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} ·{' '}
                      {formatFileSize(item.file.size)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                    aria-label={`Move ${item.file.name} up`}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 1)}
                    aria-label={`Move ${item.file.name} down`}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              disabled={items.length < 2 || progress !== null}
              onClick={handleMerge}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Merge PDF Files
            </button>
          </div>
        </div>
      )}

      {resultBytes && (
        <PdfResultCard
          title="Merged PDF Ready"
          details={`${resultPages} pages · ${formatFileSize(resultBytes.byteLength)}`}
          downloadLabel="Download Merged PDF"
          onDownload={() =>
            downloadUint8Array(resultBytes, `${safeBaseName(items[0]?.file.name || 'merged')}-merged.pdf`)
          }
          onReset={() => {
            setItems([]);
            setResultBytes(null);
          }}
        />
      )}
    </div>
  );
}

/* 2. SPLIT PDF */
export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<'every' | 'chunk' | 'ranges'>('ranges');
  const [chunkSize, setChunkSize] = useState(2);
  const [rangeInput, setRangeInput] = useState('1-2');
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<{ blob: Blob; filename: string; summary: string } | null>(
    null
  );

  const handleFile = async (files: File[]) => {
    setError(null);
    setOutputBlob(null);
    try {
      const f = files[0];
      const b = await readFileAsUint8Array(f);
      const meta = await getPdfMetadata(b);
      setFile(f);
      setBytes(b);
      setPageCount(meta.pageCount);
      setRangeInput(meta.pageCount > 1 ? `1-${Math.ceil(meta.pageCount / 2)}, ${Math.ceil(meta.pageCount / 2) + 1}-${meta.pageCount}` : '1');
    } catch {
      setError('Unable to read this PDF. Please verify it is a valid, unencrypted PDF.');
    }
  };

  const handleSplit = async () => {
    if (!bytes || !file) return;
    setError(null);
    setOutputBlob(null);

    let groups: number[][] = [];
    if (mode === 'every') {
      groups = Array.from({ length: pageCount }, (_, idx) => [idx]);
    } else if (mode === 'chunk') {
      const step = Math.max(1, chunkSize);
      for (let i = 0; i < pageCount; i += step) {
        groups.push(
          Array.from({ length: Math.min(step, pageCount - i) }, (_, k) => i + k)
        );
      }
    } else {
      groups = parseSplitGroups(rangeInput, pageCount);
      if (groups.length === 0) {
        setError(`Enter valid page numbers or ranges between 1 and ${pageCount} (e.g., 1-2, 3-4).`);
        return;
      }
    }

    setProgress(10);
    setStatus('Splitting PDF pages...');
    try {
      const src = await PDFDocument.load(bytes);
      const base = safeBaseName(file.name);

      if (groups.length === 1) {
        const outDoc = await PDFDocument.create();
        const copied = await outDoc.copyPages(src, groups[0]);
        copied.forEach((p) => outDoc.addPage(p));
        const saved = await outDoc.save();
        const copy = new Uint8Array(saved.byteLength);
        copy.set(saved);
        setOutputBlob({
          blob: new Blob([copy], { type: 'application/pdf' }),
          filename: `${base}-split.pdf`,
          summary: `1 PDF generated (${groups[0].length} pages · ${formatFileSize(saved.byteLength)})`,
        });
      } else {
        const zip = new JSZip();
        for (let i = 0; i < groups.length; i += 1) {
          const outDoc = await PDFDocument.create();
          const copied = await outDoc.copyPages(src, groups[i]);
          copied.forEach((p) => outDoc.addPage(p));
          const saved = await outDoc.save();
          const partNum = String(i + 1).padStart(2, '0');
          zip.file(`${base}-part-${partNum}.pdf`, saved);
          setProgress(10 + ((i + 1) / groups.length) * 80);
        }
        setStatus('Packaging ZIP archive...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setOutputBlob({
          blob: zipBlob,
          filename: `${base}-split-files.zip`,
          summary: `${groups.length} PDF files bundled into ZIP (${formatFileSize(zipBlob.size)})`,
        });
      }
      setProgress(100);
    } catch {
      setError('Failed to split this PDF. Ensure the document is unencrypted and undamaged.');
    } finally {
      setTimeout(() => {
        setProgress(null);
        setStatus('');
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <PdfUploadZone
          label="Select PDF File to Split"
          helperText="Drop a multi-page PDF to separate it into individual pages, chunks, or custom ranges."
          onFilesSelected={handleFile}
        />
      ) : (
        <PdfFileInfoBar
          file={file}
          pageCount={pageCount}
          onClear={() => {
            setFile(null);
            setBytes(null);
            setOutputBlob(null);
          }}
        />
      )}

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText={status} />

      {file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">Split Method</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ranges' as const, title: 'Custom Ranges', desc: 'e.g. 1-3, 4-6, 7' },
                { id: 'every' as const, title: 'Every Single Page', desc: `${pageCount} separate PDFs` },
                { id: 'chunk' as const, title: 'Fixed Page Count', desc: 'Split every N pages' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={mode === opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-colors ${
                    mode === opt.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-semibold">{opt.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {mode === 'ranges' && (
            <div>
              <label htmlFor="split-ranges" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Page Ranges (comma-separated, 1 to {pageCount})
              </label>
              <input
                id="split-ranges"
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1-3, 4-6, 7"
                className="w-full max-w-md rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}

          {mode === 'chunk' && (
            <div>
              <label htmlFor="split-chunk" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pages per Output PDF
              </label>
              <input
                id="split-chunk"
                type="number"
                min={1}
                max={Math.max(1, pageCount)}
                value={chunkSize}
                onChange={(e) => setChunkSize(Math.max(1, parseInt(e.target.value || '1', 10)))}
                className="w-32 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}

          <button
            type="button"
            disabled={progress !== null}
            onClick={handleSplit}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Split PDF Now
          </button>
        </div>
      )}

      {outputBlob && (
        <PdfResultCard
          title="Split Complete"
          details={outputBlob.summary}
          downloadLabel={outputBlob.filename.endsWith('.zip') ? 'Download ZIP Archive' : 'Download Split PDF'}
          onDownload={() => downloadBlob(outputBlob.blob, outputBlob.filename)}
          onReset={() => setOutputBlob(null)}
        />
      )}
    </div>
  );
}

/* 3. ORGANIZE PDF PAGES */
interface OrganizedPageItem {
  uid: string;
  sourcePageNumber: number; // 1-based
  extraRotation: number; // 0, 90, 180, 270
  thumbUrl: string;
}

export function OrganizePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<OrganizedPageItem[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setResultBytes(null);
    const f = files[0];
    setProgress(5);
    setStatus('Rendering page thumbnails...');

    try {
      const b = await readFileAsUint8Array(f);
      const thumbs = await renderPdfThumbnails(b, 200, (done, total) => {
        setProgress(5 + (done / Math.max(1, total)) * 90);
        setStatus(`Rendering thumbnail ${done} of ${total}...`);
      });
      setFile(f);
      setBytes(b);
      setPages(
        thumbs.map((t) => ({
          uid: `p-${t.pageNumber}-${Math.random().toString(36).slice(2, 7)}`,
          sourcePageNumber: t.pageNumber,
          extraRotation: 0,
          thumbUrl: t.dataUrl,
        }))
      );
    } catch {
      setError('Could not render PDF pages. Ensure this is a valid, unencrypted PDF.');
    } finally {
      setProgress(null);
      setStatus('');
    }
  };

  const movePage = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= pages.length) return;
    const next = [...pages];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setPages(next);
    setResultBytes(null);
  };

  const rotatePage = (uid: string) => {
    setPages((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, extraRotation: (p.extraRotation + 90) % 360 } : p))
    );
    setResultBytes(null);
  };

  const duplicatePage = (idx: number) => {
    const item = pages[idx];
    const copy: OrganizedPageItem = {
      ...item,
      uid: `dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    const next = [...pages];
    next.splice(idx + 1, 0, copy);
    setPages(next);
    setResultBytes(null);
  };

  const removePage = (uid: string) => {
    if (pages.length <= 1) {
      setError('At least 1 page must remain in the PDF.');
      return;
    }
    setPages((prev) => prev.filter((p) => p.uid !== uid));
    setResultBytes(null);
  };

  const handleSave = async () => {
    if (!bytes || pages.length === 0) return;
    setError(null);
    setProgress(20);
    setStatus('Rebuilding organized PDF...');
    try {
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      for (let i = 0; i < pages.length; i += 1) {
        const item = pages[i];
        const [copied] = await out.copyPages(src, [item.sourcePageNumber - 1]);
        if (item.extraRotation !== 0) {
          const existingAngle = copied.getRotation().angle;
          copied.setRotation(degrees((existingAngle + item.extraRotation) % 360));
        }
        out.addPage(copied);
        setProgress(20 + ((i + 1) / pages.length) * 75);
      }
      const saved = await out.save();
      setResultBytes(saved);
    } catch {
      setError('Failed to save organized PDF.');
    } finally {
      setProgress(null);
      setStatus('');
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <PdfUploadZone
          label="Select PDF to Organize"
          helperText="Drop a PDF to view page thumbnails, reorder sheets, duplicate pages, or rotate pages."
          onFilesSelected={handleFile}
        />
      ) : (
        <PdfFileInfoBar
          file={file}
          pageCount={pages.length}
          extraText="Click arrows or icons on any thumbnail"
          onClear={() => {
            setFile(null);
            setBytes(null);
            setPages([]);
            setResultBytes(null);
          }}
        />
      )}

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText={status} />

      {pages.length > 0 && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-medium text-slate-600">
              Showing {pages.length} output pages in order
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPages((prev) => [...prev].reverse());
                  setResultBytes(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Reverse Order
              </button>
              <button
                type="button"
                disabled={progress !== null}
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Save Organized PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, idx) => (
              <div
                key={page.uid}
                className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                  <span className="font-semibold text-slate-800">#{idx + 1}</span>
                  <span>Orig p.{page.sourcePageNumber}</span>
                </div>

                <div className="aspect-[3/4] rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={page.thumbUrl}
                    alt={`Page ${page.sourcePageNumber}`}
                    style={{ transform: `rotate(${page.extraRotation}deg)` }}
                    className="max-w-full max-h-full object-contain transition-transform"
                  />
                </div>

                <div className="grid grid-cols-5 gap-1 pt-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => movePage(idx, -1)}
                    aria-label="Move page earlier"
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-35 flex items-center justify-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === pages.length - 1}
                    onClick={() => movePage(idx, 1)}
                    aria-label="Move page later"
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-35 flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => rotatePage(page.uid)}
                    aria-label="Rotate page 90 degrees"
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicatePage(idx)}
                    aria-label="Duplicate page"
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <CopyPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePage(page.uid)}
                    aria-label="Delete page"
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resultBytes && file && (
        <PdfResultCard
          title="Organized PDF Ready"
          details={`${pages.length} pages · ${formatFileSize(resultBytes.byteLength)}`}
          downloadLabel="Download Organized PDF"
          onDownload={() => downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-organized.pdf`)}
          onReset={() => setResultBytes(null)}
        />
      )}
    </div>
  );
}

/* 4 & 5. DELETE OR EXTRACT PDF PAGES */
export function SelectPagesPdfTool({ mode }: { mode: 'delete' | 'extract' }) {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [thumbs, setThumbs] = useState<PdfThumbnail[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rangeText, setRangeText] = useState('');
  const [extractSeparateZip, setExtractSeparateZip] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<{ blob: Blob; filename: string; summary: string } | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setOutput(null);
    setSelected(new Set());
    setRangeText('');
    const f = files[0];
    setProgress(5);
    setStatus('Rendering page previews...');

    try {
      const b = await readFileAsUint8Array(f);
      const list = await renderPdfThumbnails(b, 200, (done, total) => {
        setProgress(5 + (done / Math.max(1, total)) * 90);
        setStatus(`Loading page ${done} of ${total}...`);
      });
      setFile(f);
      setBytes(b);
      setThumbs(list);
    } catch {
      setError('Could not read this PDF. Please verify it is valid and unencrypted.');
    } finally {
      setProgress(null);
      setStatus('');
    }
  };

  const togglePage = (pageNum1Based: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum1Based)) next.delete(pageNum1Based);
      else next.add(pageNum1Based);
      return next;
    });
    setOutput(null);
  };

  const applyRangeText = (val: string) => {
    setRangeText(val);
    if (!thumbs.length) return;
    const indices = parsePageRanges(val, thumbs.length);
    setSelected(new Set(indices.map((i) => i + 1)));
    setOutput(null);
  };

  const selectPreset = (type: 'odd' | 'even' | 'none') => {
    if (type === 'none') {
      setSelected(new Set());
      setRangeText('');
      setOutput(null);
      return;
    }
    const next = new Set<number>();
    thumbs.forEach((t) => {
      if (type === 'odd' && t.pageNumber % 2 === 1) next.add(t.pageNumber);
      if (type === 'even' && t.pageNumber % 2 === 0) next.add(t.pageNumber);
    });
    setSelected(next);
    setOutput(null);
  };

  const handleProcess = async () => {
    if (!bytes || !file) return;
    setError(null);
    setOutput(null);

    const total = thumbs.length;
    if (selected.size === 0) {
      setError(
        mode === 'delete'
          ? 'Select at least 1 page to delete.'
          : 'Select at least 1 page to extract.'
      );
      return;
    }

    const targetZeroBased =
      mode === 'delete'
        ? Array.from({ length: total }, (_, i) => i).filter((i) => !selected.has(i + 1))
        : Array.from(selected)
            .sort((a, b) => a - b)
            .map((p) => p - 1);

    if (targetZeroBased.length === 0) {
      setError('You cannot delete every page from the document. At least 1 page must remain.');
      return;
    }

    setProgress(20);
    setStatus(mode === 'delete' ? 'Removing selected pages...' : 'Extracting selected pages...');

    try {
      const src = await PDFDocument.load(bytes);
      const base = safeBaseName(file.name);

      if (mode === 'extract' && extractSeparateZip && targetZeroBased.length > 1) {
        const zip = new JSZip();
        for (let i = 0; i < targetZeroBased.length; i += 1) {
          const out = await PDFDocument.create();
          const [copied] = await out.copyPages(src, [targetZeroBased[i]]);
          out.addPage(copied);
          const saved = await out.save();
          zip.file(`${base}-page-${targetZeroBased[i] + 1}.pdf`, saved);
          setProgress(20 + ((i + 1) / targetZeroBased.length) * 75);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        setOutput({
          blob,
          filename: `${base}-extracted-pages.zip`,
          summary: `${targetZeroBased.length} separate PDF files packaged in ZIP (${formatFileSize(blob.size)})`,
        });
      } else {
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, targetZeroBased);
        copied.forEach((p) => out.addPage(p));
        const saved = await out.save();
        const copy = new Uint8Array(saved.byteLength);
        copy.set(saved);
        setOutput({
          blob: new Blob([copy], { type: 'application/pdf' }),
          filename: `${base}-${mode === 'delete' ? 'trimmed' : 'extracted'}.pdf`,
          summary: `${targetZeroBased.length} pages · ${formatFileSize(saved.byteLength)}`,
        });
      }
      setProgress(100);
    } catch {
      setError('Failed to process PDF pages.');
    } finally {
      setTimeout(() => {
        setProgress(null);
        setStatus('');
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <PdfUploadZone
          label={mode === 'delete' ? 'Select PDF to Delete Pages' : 'Select PDF to Extract Pages'}
          helperText={
            mode === 'delete'
              ? 'Click pages or enter ranges to remove them from your PDF.'
              : 'Click pages or enter ranges to pull them into a new PDF or ZIP.'
          }
          onFilesSelected={handleFile}
        />
      ) : (
        <PdfFileInfoBar
          file={file}
          pageCount={thumbs.length}
          extraText={`${selected.size} selected`}
          onClear={() => {
            setFile(null);
            setBytes(null);
            setThumbs([]);
            setSelected(new Set());
            setOutput(null);
          }}
        />
      )}

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText={status} />

      {thumbs.length > 0 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex-1 max-w-sm">
              <label htmlFor="page-range-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quick Select by Range (e.g. 1-3, 5)
              </label>
              <input
                id="page-range-input"
                type="text"
                value={rangeText}
                onChange={(e) => applyRangeText(e.target.value)}
                placeholder={`e.g. 1-${Math.min(3, thumbs.length)}`}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => selectPreset('odd')}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Odd Pages
              </button>
              <button
                type="button"
                onClick={() => selectPreset('even')}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Even Pages
              </button>
              <button
                type="button"
                onClick={() => selectPreset('none')}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear Selection
              </button>

              {mode === 'extract' && (
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 px-2">
                  <input
                    type="checkbox"
                    checked={extractSeparateZip}
                    onChange={(e) => setExtractSeparateZip(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Separate files (ZIP)</span>
                </label>
              )}

              <button
                type="button"
                onClick={handleProcess}
                disabled={progress !== null}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                {mode === 'delete'
                  ? `Delete ${selected.size} Selected`
                  : `Extract ${selected.size} Selected`}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {thumbs.map((t) => {
              const isSelected = selected.has(t.pageNumber);
              return (
                <button
                  key={t.pageNumber}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => togglePage(t.pageNumber)}
                  className={`group text-left rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? mode === 'delete'
                        ? 'border-red-500 bg-red-50/40'
                        : 'border-blue-600 bg-blue-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-semibold text-slate-800">
                      Page {t.pageNumber}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? mode === 'delete'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" aria-hidden="true" />}
                    </span>
                  </div>
                  <div className="aspect-[3/4] rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-1">
                    <img
                      src={t.dataUrl}
                      alt={`Page ${t.pageNumber}`}
                      className={`max-w-full max-h-full object-contain ${
                        isSelected && mode === 'delete' ? 'opacity-50' : ''
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {output && (
        <PdfResultCard
          title={mode === 'delete' ? 'Pages Deleted Successfully' : 'Pages Extracted Successfully'}
          details={output.summary}
          downloadLabel={output.filename.endsWith('.zip') ? 'Download ZIP Archive' : 'Download PDF'}
          onDownload={() => downloadBlob(output.blob, output.filename)}
          onReset={() => setOutput(null)}
        />
      )}
    </div>
  );
}

/* 6. ROTATE PDF */
export function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [thumbs, setThumbs] = useState<PdfThumbnail[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setResultBytes(null);
    setRotations({});
    const f = files[0];
    setProgress(5);
    setStatus('Rendering page previews...');

    try {
      const b = await readFileAsUint8Array(f);
      const list = await renderPdfThumbnails(b, 200, (done, total) => {
        setProgress(5 + (done / Math.max(1, total)) * 90);
      });
      setFile(f);
      setBytes(b);
      setThumbs(list);
    } catch {
      setError('Unable to read this PDF. Please verify it is a valid, unencrypted PDF.');
    } finally {
      setProgress(null);
      setStatus('');
    }
  };

  const rotateAll = (delta: number) => {
    setRotations((prev) => {
      const next: Record<number, number> = { ...prev };
      thumbs.forEach((t) => {
        next[t.pageNumber] = ((next[t.pageNumber] || 0) + delta + 360) % 360;
      });
      return next;
    });
    setResultBytes(null);
  };

  const rotateSingle = (pageNumber: number, delta: number) => {
    setRotations((prev) => ({
      ...prev,
      [pageNumber]: ((prev[pageNumber] || 0) + delta + 360) % 360,
    }));
    setResultBytes(null);
  };

  const handleSave = async () => {
    if (!bytes) return;
    setError(null);
    setProgress(30);
    setStatus('Applying permanent page rotation...');

    try {
      const doc = await PDFDocument.load(bytes);
      const pdfPages = doc.getPages();
      pdfPages.forEach((p, idx) => {
        const delta = rotations[idx + 1] || 0;
        if (delta !== 0) {
          const current = p.getRotation().angle;
          p.setRotation(degrees((current + delta) % 360));
        }
      });
      const out = await doc.save();
      setResultBytes(out);
      setProgress(100);
    } catch {
      setError('Failed to save rotated PDF.');
    } finally {
      setTimeout(() => {
        setProgress(null);
        setStatus('');
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <PdfUploadZone
          label="Select PDF to Rotate"
          helperText="Rotate individual sideways scans or turn every page at once."
          onFilesSelected={handleFile}
        />
      ) : (
        <PdfFileInfoBar
          file={file}
          pageCount={thumbs.length}
          onClear={() => {
            setFile(null);
            setBytes(null);
            setThumbs([]);
            setRotations({});
            setResultBytes(null);
          }}
        />
      )}

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText={status} />

      {thumbs.length > 0 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => rotateAll(-90)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Rotate All Left 90°</span>
              </button>
              <button
                type="button"
                onClick={() => rotateAll(90)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Rotate All Right 90°</span>
              </button>
              <button
                type="button"
                onClick={() => rotateAll(180)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Flip All 180°
              </button>
              <button
                type="button"
                onClick={() => {
                  setRotations({});
                  setResultBytes(null);
                }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={progress !== null}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Save Rotated PDF
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {thumbs.map((t) => {
              const angle = rotations[t.pageNumber] || 0;
              return (
                <div
                  key={t.pageNumber}
                  className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-slate-800">Page {t.pageNumber}</span>
                    {angle !== 0 && <span className="text-blue-700">+{angle}°</span>}
                  </div>
                  <div className="aspect-[3/4] rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-1">
                    <img
                      src={t.dataUrl}
                      alt={`Page ${t.pageNumber}`}
                      style={{ transform: `rotate(${angle}deg)` }}
                      className="max-w-full max-h-full object-contain transition-transform"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => rotateSingle(t.pageNumber, -90)}
                      aria-label={`Rotate page ${t.pageNumber} left`}
                      className="flex-1 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateSingle(t.pageNumber, 90)}
                      aria-label={`Rotate page ${t.pageNumber} right`}
                      className="flex-1 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center"
                    >
                      <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {resultBytes && file && (
        <PdfResultCard
          title="Rotated PDF Ready"
          details={`${thumbs.length} pages · ${formatFileSize(resultBytes.byteLength)}`}
          downloadLabel="Download Rotated PDF"
          onDownload={() => downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-rotated.pdf`)}
          onReset={() => setResultBytes(null)}
        />
      )}
    </div>
  );
}

/* 7. ADD PDF PAGE NUMBERS */
export function AddPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<
    'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left'
  >('bottom-center');
  const [format, setFormat] = useState<'number' | 'slash' | 'page-of'>('page-of');
  const [startNumber, setStartNumber] = useState(1);
  const [skipFirst, setSkipFirst] = useState(false);
  const [fontSize, setFontSize] = useState(11);
  const [marginPt, setMarginPt] = useState(28);
  const [colorHex, setColorHex] = useState('#334155');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setResultBytes(null);
    try {
      const f = files[0];
      const b = await readFileAsUint8Array(f);
      const meta = await getPdfMetadata(b);
      setFile(f);
      setBytes(b);
      setPageCount(meta.pageCount);
    } catch {
      setError('Could not read this PDF. Please verify it is a valid, unencrypted PDF.');
    }
  };

  const formatLabel = (num: number, totalDisplayed: number) => {
    if (format === 'number') return `${num}`;
    if (format === 'slash') return `${num} / ${totalDisplayed}`;
    return `Page ${num} of ${totalDisplayed}`;
  };

  const handleApply = async () => {
    if (!bytes) return;
    setError(null);
    setProgress(25);
    try {
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const rgbColor = hexToPdfRgb(colorHex);
      const effectiveCount = Math.max(1, pages.length - (skipFirst ? 1 : 0));
      const totalDisplay = startNumber + effectiveCount - 1;

      pages.forEach((page, idx) => {
        if (skipFirst && idx === 0) return;
        const displayNum = startNumber + (skipFirst ? idx - 1 : idx);
        const text = formatLabel(displayNum, totalDisplay);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const box = page.getCropBox();

        let x = box.x + (box.width - textWidth) / 2;
        if (position.endsWith('left')) x = box.x + marginPt;
        if (position.endsWith('right')) x = Math.max(box.x + marginPt, box.x + box.width - textWidth - marginPt);

        const y = position.startsWith('top')
          ? Math.max(box.y + 20, box.y + box.height - marginPt)
          : box.y + marginPt;
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgbColor,
        });
      });

      const out = await doc.save();
      setResultBytes(out);
      setProgress(100);
    } catch {
      setError('Failed to apply page numbers.');
    } finally {
      setTimeout(() => setProgress(null), 200);
    }
  };

  const previewText = formatLabel(startNumber, startNumber + Math.max(0, pageCount - (skipFirst ? 2 : 1)));

  return (
    <div className="space-y-6">
      {!file ? (
        <PdfUploadZone
          label="Select PDF to Number"
          helperText="Add clean vector page numbers to headers or footers across your document."
          onFilesSelected={handleFile}
        />
      ) : (
        <PdfFileInfoBar
          file={file}
          pageCount={pageCount}
          onClear={() => {
            setFile(null);
            setBytes(null);
            setResultBytes(null);
          }}
        />
      )}

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText="Stamping vector page numbers..." />

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pn-pos" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Placement Position
                </label>
                <select
                  id="pn-pos"
                  value={position}
                  onChange={(e) => setPosition(e.target.value as typeof position)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              <div>
                <label htmlFor="pn-fmt" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number Format
                </label>
                <select
                  id="pn-fmt"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof format)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="page-of">Page 1 of N</option>
                  <option value="slash">1 / N</option>
                  <option value="number">1, 2, 3</option>
                </select>
              </div>

              <div>
                <label htmlFor="pn-start" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Starting Number
                </label>
                <input
                  id="pn-start"
                  type="number"
                  min={1}
                  value={startNumber}
                  onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="pn-size" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Font Size ({fontSize}pt) &amp; Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="pn-size"
                    type="range"
                    min={8}
                    max={20}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    aria-label="Page number text color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={skipFirst}
                  onChange={(e) => setSkipFirst(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Skip Page 1 (title/cover sheet)</span>
              </label>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Edge margin:</span>
                <input
                  type="number"
                  min={12}
                  max={72}
                  aria-label="Edge margin in points"
                  value={marginPt}
                  onChange={(e) => setMarginPt(Math.max(12, parseInt(e.target.value || '28', 10)))}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                />
                <span>pt</span>
              </div>
            </div>

            <button
              type="button"
              disabled={progress !== null}
              onClick={handleApply}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              Apply Page Numbers
            </button>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-slate-50/70 p-6">
            <div className="text-xs font-semibold text-slate-600 mb-3">Placement Preview</div>
            <div className="aspect-[3/4] max-w-[240px] mx-auto bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
              <div
                className={`text-xs font-mono ${
                  position.startsWith('top') ? 'opacity-100' : 'opacity-0'
                } ${
                  position.endsWith('center')
                    ? 'text-center'
                    : position.endsWith('right')
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ color: colorHex }}
              >
                {previewText}
              </div>

              <div className="space-y-2 my-auto opacity-30">
                <div className="h-2.5 bg-slate-300 rounded w-3/4" />
                <div className="h-2 bg-slate-200 rounded w-full" />
                <div className="h-2 bg-slate-200 rounded w-5/6" />
                <div className="h-2 bg-slate-200 rounded w-full" />
                <div className="h-2 bg-slate-200 rounded w-2/3" />
              </div>

              <div
                className={`text-xs font-mono ${
                  position.startsWith('bottom') ? 'opacity-100' : 'opacity-0'
                } ${
                  position.endsWith('center')
                    ? 'text-center'
                    : position.endsWith('right')
                      ? 'text-right'
                      : 'text-left'
                }`}
                style={{ color: colorHex }}
              >
                {previewText}
              </div>
            </div>
          </div>
        </div>
      )}

      {resultBytes && file && (
        <PdfResultCard
          title="Page Numbers Added"
          details={`${pageCount} pages · ${formatFileSize(resultBytes.byteLength)}`}
          downloadLabel="Download Numbered PDF"
          onDownload={() => downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-numbered.pdf`)}
          onReset={() => setResultBytes(null)}
        />
      )}
    </div>
  );
}
