import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Download, Eye, EyeOff, Lock, Sparkles, Unlock } from 'lucide-react';
import { PDFDocument as CantooPDFDocument } from '@cantoo/pdf-lib';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { createWorker } from 'tesseract.js';
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
  openPdfJsDocument,
  parsePageRanges,
  readFileAsUint8Array,
  renderPdfPageToCanvas,
  safeBaseName,
} from '../../utils/pdfCore';

// ============================================================================
// 21. Protect PDF
// ============================================================================
export function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState<number | undefined>(undefined);

  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [algorithm, setAlgorithm] = useState<'AES-256' | 'AES-128'>('AES-256');
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowModifying, setAllowModifying] = useState(false);

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
      setError('Could not load this PDF. Make sure it is a valid, unencrypted PDF file.');
    }
  };

  const handleEncrypt = async () => {
    if (!bytes) return;
    if (!userPassword.trim()) {
      setError('Enter a document open password.');
      return;
    }
    if (userPassword !== confirmPassword) {
      setError('Passwords do not match. Confirm the exact same password.');
      return;
    }

    setError(null);
    setProgress(45);
    try {
      const doc = await CantooPDFDocument.load(bytes);
      await doc.encrypt({
        userPassword: userPassword.trim(),
        ownerPassword: ownerPassword.trim() || `${userPassword.trim()}_owner`,
        algorithm,
        permissions: {
          printing: allowPrinting ? 'highResolution' : false,
          copying: allowCopying,
          modifying: allowModifying,
          annotating: allowModifying,
          fillingForms: allowModifying,
          contentAccessibility: true,
          documentAssembly: allowModifying,
        },
      });
      const encryptedBytes = await doc.save();
      setResultBytes(encryptedBytes);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : 'Encryption failed for this PDF structure.');
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Password-Protect"
          helperText="Encrypt your PDF locally with AES-256 or AES-128 password protection."
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
              setUserPassword('');
              setConfirmPassword('');
              setOwnerPassword('');
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Document Open Password (required)
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={userPassword}
                    onChange={(e) => {
                      setUserPassword(e.target.value);
                      setResultBytes(null);
                    }}
                    placeholder="Enter strong password..."
                    className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Open Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setResultBytes(null);
                  }}
                  placeholder="Re-enter password..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Owner Permissions Password (optional)
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="Optional separate admin password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Encryption Standard
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value as 'AES-256' | 'AES-128');
                    setResultBytes(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="AES-256">AES-256 (Recommended modern standard)</option>
                  <option value="AES-128">AES-128 (Legacy reader compatibility)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-2.5">
                Reader Permissions (once opened)
              </div>
              <div className="flex flex-wrap gap-5 text-xs text-slate-700">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPrinting}
                    onChange={(e) => setAllowPrinting(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Allow Printing</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCopying}
                    onChange={(e) => setAllowCopying(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Allow Copying Text</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowModifying}
                    onChange={(e) => setAllowModifying(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Allow Editing / Annotating</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEncrypt}
                disabled={!userPassword.trim() || progress !== null}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                <Lock className="w-4 h-4" aria-hidden="true" />
                <span>Encrypt &amp; Download PDF</span>
              </button>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText={`Encrypting PDF using ${algorithm}...`} />

          {resultBytes && (
            <PdfResultCard
              title={`PDF Encrypted (${algorithm})`}
              details={`Password protection enabled · Output size ${formatFileSize(resultBytes.byteLength)}`}
              downloadLabel="Download Protected PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-protected.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 22. Unlock PDF (with user-supplied password)
// ============================================================================
export function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [progress, setProgress] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [unlockNote, setUnlockNote] = useState('');

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setResultBytes(null);
    setUnlockNote('');
    const data = await readFileAsUint8Array(picked);
    setFile(picked);
    setBytes(data);
  };

  const handleUnlock = async () => {
    if (!bytes) return;
    setError(null);
    setResultBytes(null);
    setUnlockNote('');
    setProgress(25);
    setStatusText('Verifying password and decrypting document...');

    // Stage 1: Direct structural decryption via @cantoo/pdf-lib (copying into fresh PDF strips /Encrypt trailer cleanly)
    try {
      const srcDoc = await CantooPDFDocument.load(bytes, { password });
      const cleanDoc = await CantooPDFDocument.create();
      const copied = await cleanDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      copied.forEach((p) => cleanDoc.addPage(p));
      const title = srcDoc.getTitle();
      if (title) cleanDoc.setTitle(title);
      const author = srcDoc.getAuthor();
      if (author) cleanDoc.setAuthor(author);
      const subject = srcDoc.getSubject();
      if (subject) cleanDoc.setSubject(subject);
      const cleanBytes = await cleanDoc.save();
      setResultBytes(cleanBytes);
      setUnlockNote('Decrypted structurally — all fonts, links, and vector elements remain intact with encryption removed.');
      setProgress(null);
      return;
    } catch {
      // Fallback check via PDF.js in case the cipher revision isn't handled by Cantoo load
    }

    try {
      const pdfJsDoc = await openPdfJsDocument(bytes, password);
      const total = pdfJsDoc.numPages;
      const outDoc = await PDFDocument.create();

      for (let p = 1; p <= total; p += 1) {
        setStatusText(`Password verified. Rebuilding page ${p} of ${total}...`);
        setProgress(25 + (p / Math.max(1, total)) * 70);
        const page = await pdfJsDoc.getPage(p);
        const viewport = page.getViewport({ scale: 2 });
        const baseViewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(viewport.width));
        canvas.height = Math.max(1, Math.round(viewport.height));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        }
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Render error'))), 'image/jpeg', 0.92);
        });
        const jpgBytes = new Uint8Array(await blob.arrayBuffer());
        const embedded = await outDoc.embedJpg(jpgBytes);
        const newPage = outDoc.addPage([baseViewport.width, baseViewport.height]);
        newPage.drawImage(embedded, {
          x: 0,
          y: 0,
          width: baseViewport.width,
          height: baseViewport.height,
        });
      }
      await pdfJsDoc.cleanup();

      const out = await outDoc.save();
      setResultBytes(out);
      setUnlockNote(
        'Password verified via PDF.js visual fallback because the original file used a custom or legacy security handler. Pages were rendered at 144 DPI.'
      );
      setProgress(null);
    } catch {
      setProgress(null);
      setError(
        'Incorrect password or unsupported encryption format. Enter the valid authorized password for this PDF.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose Password-Protected PDF"
          helperText="Upload an encrypted PDF you are authorized to access and enter its valid password."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            onClear={() => {
              setFile(null);
              setBytes(null);
              setPassword('');
              setResultBytes(null);
              setError(null);
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Authorized PDF Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the password required to open this PDF..."
                  className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Leave blank only if the PDF has an owner restriction password with no open password.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUnlock}
                disabled={progress !== null}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                <Unlock className="w-4 h-4" aria-hidden="true" />
                <span>Unlock PDF</span>
              </button>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText={statusText} />

          {resultBytes && (
            <PdfResultCard
              title="PDF Unlocked Successfully"
              details={`${unlockNote} Output size ${formatFileSize(resultBytes.byteLength)}.`}
              downloadLabel="Download Unlocked PDF"
              onDownload={() =>
                downloadUint8Array(resultBytes, `${safeBaseName(file.name)}-unlocked.pdf`)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 23. OCR PDF (Browser Tesseract.js + Searchable PDF Layer)
// ============================================================================
const OCR_LANGUAGES = [
  { code: 'eng', label: 'English' },
  { code: 'spa', label: 'Spanish' },
  { code: 'fra', label: 'French' },
  { code: 'deu', label: 'German' },
  { code: 'por', label: 'Portuguese' },
  { code: 'ita', label: 'Italian' },
];

function toWinAnsiSafe(text: string): string {
  // Replace non-WinAnsi chars cleanly so StandardFonts.Helvetica never throws
  return text.replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');
}

export function OcrPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [language, setLanguage] = useState('eng');
  const [pageRangeInput, setPageRangeInput] = useState('');

  const [progress, setProgress] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [searchablePdfBytes, setSearchablePdfBytes] = useState<Uint8Array | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setError(null);
    setOcrText('');
    setSearchablePdfBytes(null);
    try {
      const data = await readFileAsUint8Array(picked);
      const meta = await getPdfMetadata(data);
      setFile(picked);
      setBytes(data);
      setPageCount(meta.pageCount);
      setPageRangeInput('');
    } catch {
      setError('Could not load this PDF.');
    }
  };

  const handleRunOcr = async () => {
    if (!bytes || !file) return;
    setError(null);
    setOcrText('');
    setSearchablePdfBytes(null);

    const indices =
      pageRangeInput.trim().length > 0
        ? parsePageRanges(pageRangeInput, pageCount)
        : Array.from({ length: pageCount }, (_, i) => i);

    if (indices.length === 0) {
      setError(`Enter valid page numbers between 1 and ${pageCount}, or leave blank for all pages.`);
      return;
    }

    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

    try {
      setProgress(5);
      setStatusText(`Loading ${OCR_LANGUAGES.find((l) => l.code === language)?.label || language} OCR model locally...`);

      worker = await createWorker(language);

      const outDoc = await PDFDocument.create();
      const font = await outDoc.embedFont(StandardFonts.Helvetica);
      const textChunks: string[] = [];

      for (let i = 0; i < indices.length; i += 1) {
        const pageNum = indices[i] + 1;
        setStatusText(`Rendering page ${pageNum} (${i + 1} of ${indices.length})...`);
        const canvas = await renderPdfPageToCanvas(bytes, pageNum, 2);

        setStatusText(`Running OCR on page ${pageNum} (${i + 1} of ${indices.length})...`);
        const result = await worker.recognize(canvas, {}, { text: true, blocks: true });
        const pageText = (result.data.text || '').trim();
        textChunks.push(`--- Page ${pageNum} ---\n${pageText || '[No text recognized]'}`);

        // Build searchable PDF page: visual image + invisible text overlay aligned to OCR bboxes
        const imgBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Image capture failed'))), 'image/jpeg', 0.9);
        });
        const imgBytes = new Uint8Array(await imgBlob.arrayBuffer());
        const embeddedImg = await outDoc.embedJpg(imgBytes);

        // Convert canvas pixels back to PDF points (72 DPI / 144 DPI = / 2)
        const pageW = canvas.width / 2;
        const pageH = canvas.height / 2;
        const pdfPage = outDoc.addPage([pageW, pageH]);
        pdfPage.drawImage(embeddedImg, { x: 0, y: 0, width: pageW, height: pageH });

        const blocks = result.data.blocks || [];
        for (const block of blocks) {
          for (const para of block.paragraphs || []) {
            for (const line of para.lines || []) {
              for (const word of line.words || []) {
                const wordStr = toWinAnsiSafe(word.text || '').trim();
                if (!wordStr) continue;
                const { x0, y0, x1, y1 } = word.bbox;
                const boxH = Math.max(6, (y1 - y0) / 2);
                const xPt = Math.max(0, x0 / 2);
                const yPt = Math.max(0, pageH - y1 / 2);
                const boxW = Math.max(4, (x1 - x0) / 2);
                const measured = Math.max(1, font.widthOfTextAtSize(wordStr, boxH));
                const adjustedSize = Math.max(5, Math.min(48, boxH * Math.min(1.2, boxW / measured)));
                pdfPage.drawText(wordStr, {
                  x: xPt,
                  y: yPt,
                  size: adjustedSize,
                  font,
                  opacity: 0,
                });
              }
            }
          }
        }

        setProgress(10 + ((i + 1) / indices.length) * 85);
      }

      const finalBytes = await outDoc.save();
      setOcrText(textChunks.join('\n\n'));
      setSearchablePdfBytes(finalBytes);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(
        err instanceof Error
          ? `OCR processing error: ${err.message}`
          : 'Failed to run browser OCR. Verify internet connection to cache the initial language pack.'
      );
    } finally {
      if (worker) {
        await worker.terminate().catch(() => {});
      }
    }
  };

  const handleCopy = async () => {
    if (!ocrText) return;
    await navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose Scanned PDF for OCR"
          helperText="Recognize text locally via Tesseract.js Web Workers and create a searchable PDF."
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
              setOcrText('');
              setSearchablePdfBytes(null);
              setError(null);
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Document Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                >
                  {OCR_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pages to Process (optional, e.g. 1-5)
                </label>
                <input
                  type="text"
                  value={pageRangeInput}
                  onChange={(e) => setPageRangeInput(e.target.value)}
                  placeholder={`All pages (1-${pageCount})`}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleRunOcr}
                disabled={progress !== null}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Run Browser OCR
              </button>
            </div>
          </div>

          <PdfProgressBar progress={progress} statusText={statusText} />

          {searchablePdfBytes && (
            <PdfResultCard
              title="OCR Complete & Searchable PDF Ready"
              details={`Text recognized locally · Searchable PDF size ${formatFileSize(searchablePdfBytes.byteLength)}`}
              downloadLabel="Download Searchable PDF"
              onDownload={() =>
                downloadUint8Array(searchablePdfBytes, `${safeBaseName(file.name)}-searchable-ocr.pdf`)
              }
            />
          )}

          {ocrText && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  Recognized Text Output
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadBlob(
                        new Blob([ocrText], { type: 'text/plain;charset=utf-8' }),
                        `${safeBaseName(file.name)}-ocr.txt`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-blue-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={ocrText}
                rows={12}
                className="w-full p-4 text-xs sm:text-sm font-mono text-slate-800 bg-white focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 24. Extract Text from PDF
// ============================================================================
export function ExtractTextPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ExtractedPageText[]>([]);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setFile(picked);
    setPages([]);
    setError(null);
    setProgress(10);

    try {
      const data = await readFileAsUint8Array(picked);
      const extracted = await extractPdfTextPages(data, (done, total) => {
        setProgress(10 + (done / Math.max(1, total)) * 88);
      });
      setPages(extracted);
      setProgress(null);
    } catch {
      setProgress(null);
      setError('Could not extract text from this PDF. If password-locked, unlock it first.');
    }
  };

  const formattedPlain = useMemo(() => {
    if (pages.length === 0) return '';
    return pages
      .map((p) =>
        includeHeaders
          ? `=== Page ${p.pageNumber} ===\n${p.text || '[No selectable text on this page]'}`
          : p.text
      )
      .filter(Boolean)
      .join('\n\n');
  }, [pages, includeHeaders]);

  const formattedMarkdown = useMemo(() => {
    if (pages.length === 0) return '';
    return pages
      .map((p) => {
        const body = p.lines
          .map((l) => (l.isHeadingCandidate ? `## ${l.text}` : l.text))
          .join('\n\n');
        return includeHeaders ? `### Page ${p.pageNumber}\n\n${body || '_No text_'}` : body;
      })
      .join('\n\n---\n\n');
  }, [pages, includeHeaders]);

  const totalWords = useMemo(
    () =>
      pages.reduce(
        (sum, p) => sum + (p.text.trim() ? p.text.trim().split(/\s+/).length : 0),
        0
      ),
    [pages]
  );

  const matchingPages = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((p) => p.text.toLowerCase().includes(q));
  }, [pages, searchFilter]);

  const handleCopy = async () => {
    if (!formattedPlain) return;
    await navigator.clipboard.writeText(formattedPlain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      {!file ? (
        <PdfUploadZone
          label="Choose PDF to Extract Text"
          helperText="Extract clean lines and paragraphs page-by-page locally with TXT and Markdown downloads."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pages.length || undefined}
            extraText={
              pages.length > 0
                ? `${totalWords.toLocaleString()} words · ${formattedPlain.length.toLocaleString()} chars`
                : undefined
            }
            onClear={() => {
              setFile(null);
              setPages([]);
              setSearchFilter('');
              setError(null);
            }}
          />

          <PdfProgressBar progress={progress} statusText="Extracting selectable text layers..." />

          {pages.length > 0 && totalWords === 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900">
              No selectable text was found in this PDF—it appears to be a scanned image file. Use{' '}
              <Link to="/pdf-tools/ocr-pdf" className="font-semibold text-blue-700 underline">
                OCR PDF
              </Link>{' '}
              to read text from scanned images.
            </div>
          )}

          {pages.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="search"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter pages by keyword..."
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeHeaders}
                      onChange={(e) => setIncludeHeaders(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>Include page headers</span>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadBlob(
                        new Blob([formattedPlain], { type: 'text/plain;charset=utf-8' }),
                        `${safeBaseName(file.name)}-text.txt`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-blue-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadBlob(
                        new Blob([formattedMarkdown], { type: 'text/markdown;charset=utf-8' }),
                        `${safeBaseName(file.name)}.md`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-purple-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Markdown</span>
                  </button>
                </div>
              </div>

              <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100">
                {matchingPages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No pages contain "{searchFilter}".
                  </div>
                ) : (
                  matchingPages.map((p) => (
                    <div key={p.pageNumber} className="p-5 space-y-2">
                      <div className="text-xs font-mono font-semibold text-blue-700">
                        Page {p.pageNumber}
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                        {p.text || '[No selectable text found on this page]'}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 25. Translate PDF Text (Privacy-first browser-only translation + workbench)
// ============================================================================
interface BrowserTranslatorInstance {
  translate: (text: string) => Promise<string>;
  destroy?: () => void;
}

interface BrowserTranslatorApi {
  availability?: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<string>;
  create: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<BrowserTranslatorInstance>;
}

const TRANSLATE_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hi', label: 'Hindi' },
];

export function TranslatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ExtractedPageText[]>([]);
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [glossaryInput, setGlossaryInput] = useState('');

  const [hasBrowserTranslator, setHasBrowserTranslator] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const win = window as unknown as {
      Translator?: BrowserTranslatorApi;
      translation?: { createTranslator?: BrowserTranslatorApi['create'] };
    };
    setHasBrowserTranslator(Boolean(win.Translator?.create || win.translation?.createTranslator));
  }, []);

  const handleFile = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setFile(picked);
    setPages([]);
    setTranslations({});
    setError(null);
    setProgress(15);
    setStatusText('Extracting text segments locally from PDF...');

    try {
      const data = await readFileAsUint8Array(picked);
      const extracted = await extractPdfTextPages(data, (done, total) => {
        setProgress(15 + (done / Math.max(1, total)) * 80);
      });
      setPages(extracted);
      const initialMap: Record<number, string> = {};
      extracted.forEach((p) => {
        initialMap[p.pageNumber] = '';
      });
      setTranslations(initialMap);
      setProgress(null);
    } catch {
      setProgress(null);
      setError('Could not read text from this PDF.');
    }
  };

  const applyGlossaryRules = (raw: string): string => {
    let updated = raw;
    const lines = glossaryInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    for (const line of lines) {
      const parts = line.split('=>');
      if (parts.length !== 2) continue;
      const from = parts[0].trim();
      const to = parts[1].trim();
      if (!from) continue;
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      updated = updated.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), to);
    }
    return updated;
  };

  const handleAutoTranslate = async () => {
    if (pages.length === 0) return;
    if (sourceLang === targetLang) {
      setError('Choose a different Target Language from the Source Language.');
      return;
    }

    const win = window as unknown as {
      Translator?: BrowserTranslatorApi;
      translation?: { createTranslator?: BrowserTranslatorApi['create'] };
    };
    const factory = win.Translator?.create
      ? win.Translator
      : win.translation?.createTranslator
        ? { create: win.translation.createTranslator }
        : null;

    if (!factory) {
      setError(
        'Your current browser does not provide the local Chromium Translator API. Use the bilingual workspace below or download the prepared .txt/.docx draft to keep documents private.'
      );
      return;
    }

    setError(null);
    setProgress(10);
    setStatusText('Initializing on-device browser translation model...');

    let instance: BrowserTranslatorInstance | null = null;
    try {
      if (win.Translator?.availability) {
        const status = await win.Translator.availability({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
        if (status === 'unavailable') {
          setProgress(null);
          setError(
            `On-device translation from ${sourceLang.toUpperCase()} to ${targetLang.toUpperCase()} is not supported in this browser.`
          );
          return;
        }
      }
      instance = await factory.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      const updated: Record<number, string> = { ...translations };
      for (let i = 0; i < pages.length; i += 1) {
        const page = pages[i];
        setStatusText(`Translating page ${page.pageNumber} of ${pages.length} on-device...`);
        const srcText = page.text.trim();
        if (!srcText) {
          updated[page.pageNumber] = '';
        } else {
          // Translate paragraph by paragraph to stay within model context limits
          const paragraphs = srcText.split(/\n{2,}|\n/).filter((s) => s.trim().length > 0);
          const outParagraphs: string[] = [];
          for (const para of paragraphs) {
            const translated = await instance.translate(para);
            outParagraphs.push(applyGlossaryRules(translated));
          }
          updated[page.pageNumber] = outParagraphs.join('\n');
        }
        setProgress(10 + ((i + 1) / pages.length) * 88);
      }

      setTranslations(updated);
      setProgress(null);
    } catch (err) {
      setProgress(null);
      setError(
        err instanceof Error
          ? `On-device translator could not complete (${err.message}). Your extracted text remains ready in the bilingual editor below.`
          : 'On-device translation is unavailable for this language pair in your current browser.'
      );
    } finally {
      instance?.destroy?.();
    }
  };

  const handleApplyGlossaryOnly = () => {
    setTranslations((prev) => {
      const next: Record<number, string> = {};
      for (const page of pages) {
        const base = (prev[page.pageNumber] || '').trim() ? prev[page.pageNumber] : page.text;
        next[page.pageNumber] = applyGlossaryRules(base);
      }
      return next;
    });
  };

  const buildBilingualText = () =>
    pages
      .map((p) => {
        const tr = (translations[p.pageNumber] || '').trim();
        return `=== Page ${p.pageNumber} ===\n[Source (${sourceLang.toUpperCase()})]\n${p.text || '[No text]'}\n\n[Target (${targetLang.toUpperCase()})]\n${tr || '[Pending translation]'}`;
      })
      .join('\n\n------------------------------\n\n');

  const handleDownloadBilingualDocx = async () => {
    if (!file || pages.length === 0) return;
    const children: Paragraph[] = [];
    for (const p of pages) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: `Page ${p.pageNumber}`, bold: true })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `Source (${sourceLang.toUpperCase()}): `,
              bold: true,
            }),
            new TextRun({ text: p.text || '[No selectable text]' }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: `Translation (${targetLang.toUpperCase()}): `,
              bold: true,
            }),
            new TextRun({
              text: (translations[p.pageNumber] || '').trim() || '[Pending translation]',
            }),
          ],
        })
      );
    }
    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, `${safeBaseName(file.name)}-bilingual-${targetLang}.docx`);
  };

  const handleCopyTranslated = async () => {
    const content = pages
      .map((p) => `--- Page ${p.pageNumber} ---\n${translations[p.pageNumber] || p.text}`)
      .join('\n\n');
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <PdfErrorBanner message={error} onDismiss={() => setError(null)} />

      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="text-slate-900">
            {hasBrowserTranslator
              ? 'On-device browser translation API detected.'
              : 'Browser Capability Status: On-device translation API not detected in this browser.'}
          </strong>{' '}
          {hasBrowserTranslator
            ? 'You can translate extracted PDF pages offline inside your browser without uploading files to external servers.'
            : 'Because SmartGrow never sends your private PDFs to paid external translation APIs, automatic neural translation requires a Chromium browser with the built-in local Translator API enabled. You can still extract every page, apply glossary term replacements, edit translations side-by-side, and export bilingual .txt or .docx drafts locally.'}
        </div>
      </div>

      {!file ? (
        <PdfUploadZone
          label="Choose PDF for Private Translation Workbench"
          helperText="Extracts page text locally for on-device browser translation and bilingual export."
          onFilesSelected={handleFile}
        />
      ) : (
        <div className="space-y-5">
          <PdfFileInfoBar
            file={file}
            pageCount={pages.length || undefined}
            onClear={() => {
              setFile(null);
              setPages([]);
              setTranslations({});
              setError(null);
            }}
          />

          <PdfProgressBar progress={progress} statusText={statusText} />

          {pages.length > 0 && (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Source Language
                    </label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {TRANSLATE_LANGS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Language
                    </label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {TRANSLATE_LANGS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={handleAutoTranslate}
                      disabled={!hasBrowserTranslator || progress !== null}
                      title={
                        hasBrowserTranslator
                          ? 'Translate pages locally in your browser'
                          : 'Requires Chromium built-in local Translator API'
                      }
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-sm font-semibold transition-colors"
                    >
                      {hasBrowserTranslator ? 'Run On-Device Translation' : 'On-Device API Unavailable'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Custom Terminology Glossary (optional, one rule per line: source =&gt; target)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                      rows={2}
                      value={glossaryInput}
                      onChange={(e) => setGlossaryInput(e.target.value)}
                      placeholder={'Invoice => Factura\nSubtotal => Subtotal neto'}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyGlossaryOnly}
                      className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 shrink-0"
                    >
                      Apply Glossary Terms
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Bilingual Side-by-Side Segments ({pages.length} {pages.length === 1 ? 'page' : 'pages'})
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyTranslated}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Target'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadBlob(
                          new Blob([buildBilingualText()], { type: 'text/plain;charset=utf-8' }),
                          `${safeBaseName(file.name)}-bilingual-${targetLang}.txt`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-blue-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Bilingual TXT</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadBilingualDocx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-purple-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Bilingual DOCX</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-200 max-h-[540px] overflow-y-auto">
                  {pages.map((p) => (
                    <div key={p.pageNumber} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] font-mono font-semibold text-slate-500 mb-1.5">
                          Page {p.pageNumber} · Source ({sourceLang.toUpperCase()})
                        </div>
                        <textarea
                          readOnly
                          rows={6}
                          value={p.text || '[No selectable text — run OCR PDF first if scanned]'}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono font-semibold text-blue-700 mb-1.5">
                          Page {p.pageNumber} · Target ({targetLang.toUpperCase()})
                        </div>
                        <textarea
                          rows={6}
                          value={translations[p.pageNumber] || ''}
                          onChange={(e) =>
                            setTranslations((prev) => ({
                              ...prev,
                              [p.pageNumber]: e.target.value,
                            }))
                          }
                          placeholder={
                            hasBrowserTranslator
                              ? 'Click Run On-Device Translation above or type here...'
                              : 'Enter or paste your translation here to export a formatted bilingual DOCX/TXT...'
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
