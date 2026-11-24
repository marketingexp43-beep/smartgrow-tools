import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
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
  openPdfJsDocument,
  readFileAsUint8Array,
  safeBaseName,
} from '../../utils/pdfCore';

/* 8. COMPRESS PDF */
export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [level, setLevel] = useState<'lossless' | 'balanced' | 'maximum'>('balanced');
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
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

  const handleCompress = async () => {
    if (!bytes || !file) return;
    setError(null);
    setResultBytes(null);
    setProgress(10);

    try {
      if (level === 'lossless') {
        setStatus('Rebuilding PDF with compact object streams...');
        const src = await PDFDocument.load(bytes);
        const clean = await PDFDocument.create();
        const copied = await clean.copyPages(src, src.getPageIndices());
        copied.forEach((p) => clean.addPage(p));
        setProgress(65);
        const saved = await clean.save({ useObjectStreams: true });
        setResultBytes(saved);
        setProgress(100);
      } else {
        const dpiScale = level === 'balanced' ? 1.35 : 1.0;
        const jpegQuality = level === 'balanced' ? 0.72 : 0.5;
        const pdfJsDoc = await openPdfJsDocument(bytes);
        const outDoc = await PDFDocument.create();

        try {
          const total = pdfJsDoc.numPages;
          for (let p = 1; p <= total; p += 1) {
            setStatus(`Optimizing page ${p} of ${total}...`);
            const page = await pdfJsDoc.getPage(p);
            const baseVp = page.getViewport({ scale: 1 });
            const renderVp = page.getViewport({ scale: dpiScale });

            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(renderVp.width));
            canvas.height = Math.max(1, Math.round(renderVp.height));
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas unavailable');

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvas, canvasContext: ctx, viewport: renderVp }).promise;

            const jpgBlob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new Error('Image compression error'))),
                'image/jpeg',
                jpegQuality
              );
            });
            const jpgBytes = new Uint8Array(await jpgBlob.arrayBuffer());
            const embedded = await outDoc.embedJpg(jpgBytes);
            const newPage = outDoc.addPage([baseVp.width, baseVp.height]);
            newPage.drawImage(embedded, {
              x: 0,
              y: 0,
              width: baseVp.width,
              height: baseVp.height,
            });
            setProgress(10 + (p / total) * 82);
          }

          setStatus('Writing compressed PDF...');
          const saved = await outDoc.save({ useObjectStreams: true });
          setResultBytes(saved);
          setProgress(100);
        } finally {
          await pdfJsDoc.cleanup();
        }
      }
    } catch {
      setError('Compression failed. Please verify the PDF is valid and unencrypted.');
    } finally {
      setTimeout(() => {
        setProgress(null);
        setStatus('');
      }, 200);
    }
  };

  const savedPercent =
    file && resultBytes
      ? Math.round(((file.size - resultBytes.byteLength) / Math.max(1, file.size)) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <PdfUploadZone
          label="Select PDF to Compress"
          helperText="Shrink oversized PDFs locally using lossless object packing or image compression."
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
      <PdfProgressBar progress={progress} statusText={status} />

      {file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">Compression Mode</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'lossless' as const,
                  title: 'Lossless Structure',
                  desc: 'Preserves vector text & fonts cleanly. Strips redundant objects.',
                },
                {
                  id: 'balanced' as const,
                  title: 'Balanced Compression',
                  desc: 'Good savings for scanned PDFs (~100 DPI JPEG). Converts text to images.',
                },
                {
                  id: 'maximum' as const,
                  title: 'Maximum Savings',
                  desc: 'Smallest file size for heavy scans (72 DPI JPEG). Lower visual crispness.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={level === opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    level === opt.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-semibold">{opt.title}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={progress !== null}
            onClick={handleCompress}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Compress PDF
          </button>
        </div>
      )}

      {resultBytes && file && (
        <PdfResultCard
          title={
            savedPercent > 0
              ? `Compressed by ${savedPercent}%`
              : 'Optimization Complete'
          }
          details={`Original: ${formatFileSize(file.size)} → New: ${formatFileSize(
            resultBytes.byteLength
          )}${
            savedPercent <= 0
              ? ' (Original was already tightly compressed; try Balanced or Maximum for image-heavy scans)'
              : ''
          }`}
          downloadLabel="Download Compressed PDF"
          onDownload={() =>
            downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-compressed.pdf`)
          }
          onReset={() => setResultBytes(null)}
        />
      )}
    </div>
  );
}

/* 9. REPAIR PDF */
export function RepairPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string[]>([]);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setResultBytes(null);
    setReport([]);
    const f = files[0];
    try {
      const b = await readFileAsUint8Array(f);
      setFile(f);
      setBytes(b);
    } catch {
      setError('Could not read the selected file from disk.');
    }
  };

  const handleRepair = async () => {
    if (!bytes || !file) return;
    setError(null);
    setResultBytes(null);
    setReport([]);
    setProgress(15);
    const logs: string[] = [];

    // Stage 0: Inspect %PDF header offset
    let workingBytes = bytes;
    const headerScanLimit = Math.min(2048, bytes.byteLength);
    let pdfHeaderIndex = -1;
    for (let i = 0; i < headerScanLimit - 4; i += 1) {
      if (
        bytes[i] === 0x25 &&
        bytes[i + 1] === 0x50 &&
        bytes[i + 2] === 0x44 &&
        bytes[i + 3] === 0x46
      ) {
        pdfHeaderIndex = i;
        break;
      }
    }
    if (pdfHeaderIndex > 0) {
      workingBytes = bytes.slice(pdfHeaderIndex);
      logs.push(`Stripped ${pdfHeaderIndex} corrupted leading bytes before %PDF header.`);
    }

    // Stage 1: Tolerant structural parse & page copy via pdf-lib
    try {
      setStatus('Stage 1: Checking PDF structure & rebuilding cross-references...');
      const loaded = await PDFDocument.load(workingBytes, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
      if (loaded.isEncrypted) {
        setError('This PDF is encrypted. Use Unlock PDF with the valid password first.');
        setProgress(null);
        return;
      }
      const rebuilt = await PDFDocument.create();
      const pageIndices = loaded.getPageIndices();
      let copiedCount = 0;
      for (let i = 0; i < pageIndices.length; i += 1) {
        try {
          const [p] = await rebuilt.copyPages(loaded, [pageIndices[i]]);
          rebuilt.addPage(p);
          copiedCount += 1;
        } catch {
          logs.push(`Skipped unreadable object tree on page ${pageIndices[i] + 1}.`);
        }
        setProgress(20 + ((i + 1) / Math.max(1, pageIndices.length)) * 65);
      }

      if (copiedCount > 0) {
        const out = await rebuilt.save({ useObjectStreams: true });
        logs.unshift(
          `Rebuilt cross-reference (xref) table cleanly and recovered ${copiedCount} of ${pageIndices.length} pages.`
        );
        setReport(logs);
        setResultBytes(out);
        setProgress(100);
        setTimeout(() => {
          setProgress(null);
          setStatus('');
        }, 200);
        return;
      }
    } catch {
      logs.push('Direct structural rebuild failed; attempting visual page stream salvage via PDF.js...');
    }

    // Stage 2: Tolerant PDF.js stream salvage fallback
    try {
      setStatus('Stage 2: Salvaging readable pages via tolerant PDF.js parser...');
      setProgress(45);
      const doc = await openPdfJsDocument(workingBytes);
      try {
        const out = await PDFDocument.create();
        let salvaged = 0;
        for (let p = 1; p <= doc.numPages; p += 1) {
          try {
            const page = await doc.getPage(p);
            const vpBase = page.getViewport({ scale: 1 });
            const vpRender = page.getViewport({ scale: 1.8 });
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(vpRender.width));
            canvas.height = Math.max(1, Math.round(vpRender.height));
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              await page.render({ canvas, canvasContext: ctx, viewport: vpRender }).promise;
              const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob error'))), 'image/jpeg', 0.9);
              });
              const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
              const newPage = out.addPage([vpBase.width, vpBase.height]);
              newPage.drawImage(jpg, { x: 0, y: 0, width: vpBase.width, height: vpBase.height });
              salvaged += 1;
            }
          } catch {
            logs.push(`Page ${p} stream was too damaged to render.`);
          }
          setProgress(45 + (p / Math.max(1, doc.numPages)) * 45);
        }

        if (salvaged === 0) {
          throw new Error('Zero recoverable pages');
        }

        const outBytes = await out.save();
        logs.unshift(`Salvaged ${salvaged} of ${doc.numPages} renderable pages into a fresh PDF.`);
        setReport(logs);
        setResultBytes(outBytes);
        setProgress(100);
      } finally {
        await doc.cleanup();
      }
    } catch {
      setError(
        'This file is too severely corrupted or truncated to repair in the browser (no readable PDF catalog or page streams found).'
      );
      setReport(logs);
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
          label="Select Damaged PDF to Repair"
          helperText="Attempt local xref table reconstruction and page recovery without uploading private files."
          onFilesSelected={handleFile}
        />
      ) : (
        <PdfFileInfoBar
          file={file}
          onClear={() => {
            setFile(null);
            setBytes(null);
            setResultBytes(null);
            setReport([]);
          }}
        />
      )}

      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />
      <PdfProgressBar progress={progress} statusText={status} />

      {file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Ready to Attempt Structural Recovery</h2>
            <p className="mt-1 text-xs text-slate-600">
              Runs structural xref table repair first, with visual stream salvage if the header tree is broken.
            </p>
          </div>
          <button
            type="button"
            disabled={progress !== null}
            onClick={handleRepair}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shrink-0 disabled:opacity-50"
          >
            Attempt PDF Repair
          </button>
        </div>
      )}

      {report.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
          <div className="text-xs font-semibold text-slate-800">Recovery Diagnostic Notes</div>
          <ul className="space-y-1 text-xs text-slate-600">
            {report.map((line, i) => (
              <li key={i}>• {line}</li>
            ))}
          </ul>
        </div>
      )}

      {resultBytes && file && (
        <PdfResultCard
          title="PDF Recovered & Rebuilt"
          details={`Output size: ${formatFileSize(resultBytes.byteLength)}`}
          downloadLabel="Download Repaired PDF"
          onDownload={() =>
            downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-repaired.pdf`)
          }
          onReset={() => {
            setResultBytes(null);
            setReport([]);
          }}
        />
      )}
    </div>
  );
}
