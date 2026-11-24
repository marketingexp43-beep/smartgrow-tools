import * as pdfjsLib from 'pdfjs-dist';
import { rgb } from 'pdf-lib';

let workerConfigured = false;

export function ensurePdfWorker() {
  if (workerConfigured) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  workerConfigured = true;
}

export interface PdfThumbnail {
  pageNumber: number; // 1-based
  dataUrl: string;
  width: number;
  height: number;
}

export interface ExtractedPageText {
  pageNumber: number;
  text: string;
  lines: { text: string; fontSize: number; isHeadingCandidate: boolean }[];
}

export async function readFileAsUint8Array(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`;
}

export function safeBaseName(filename: string): string {
  const cleaned = filename.replace(/\.[^/.]+$/, '').trim();
  return cleaned || 'document';
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadUint8Array(
  bytes: Uint8Array,
  filename: string,
  mime = 'application/pdf'
) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  downloadBlob(new Blob([copy], { type: mime }), filename);
}

/**
 * Parses comma-separated 1-based page numbers / ranges (e.g. "1-3, 5, 7-9")
 * into unique sorted 0-based indices.
 */
export function parsePageRanges(input: string, maxPages: number): number[] {
  const indices = new Set<number>();
  const tokens = input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Math.max(1, Math.min(maxPages, parseInt(rangeMatch[1], 10)));
      const end = Math.max(1, Math.min(maxPages, parseInt(rangeMatch[2], 10)));
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let p = lo; p <= hi; p += 1) {
        indices.add(p - 1);
      }
      continue;
    }

    const singleMatch = token.match(/^(\d+)$/);
    if (singleMatch) {
      const num = parseInt(singleMatch[1], 10);
      if (num >= 1 && num <= maxPages) {
        indices.add(num - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Parses comma-separated ranges into separate groups of 0-based indices (for Split PDF).
 */
export function parseSplitGroups(input: string, maxPages: number): number[][] {
  const groups: number[][] = [];
  const tokens = input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Math.max(1, Math.min(maxPages, parseInt(rangeMatch[1], 10)));
      const end = Math.max(1, Math.min(maxPages, parseInt(rangeMatch[2], 10)));
      const step = start <= end ? 1 : -1;
      const group: number[] = [];
      for (let p = start; step > 0 ? p <= end : p >= end; p += step) {
        group.push(p - 1);
      }
      if (group.length > 0) groups.push(group);
      continue;
    }
    const singleMatch = token.match(/^(\d+)$/);
    if (singleMatch) {
      const p = parseInt(singleMatch[1], 10);
      if (p >= 1 && p <= maxPages) {
        groups.push([p - 1]);
      }
    }
  }

  return groups;
}

export async function openPdfJsDocument(bytes: Uint8Array, password?: string) {
  ensurePdfWorker();
  const dataCopy = new Uint8Array(bytes.byteLength);
  dataCopy.set(bytes);
  const task = pdfjsLib.getDocument({
    data: dataCopy,
    password: password || undefined,
  });
  return task.promise;
}

export async function getPdfMetadata(
  bytes: Uint8Array,
  password?: string
): Promise<{ pageCount: number; widthPt: number; heightPt: number }> {
  const doc = await openPdfJsDocument(bytes, password);
  try {
    const firstPage = await doc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    return {
      pageCount: doc.numPages,
      widthPt: viewport.width,
      heightPt: viewport.height,
    };
  } finally {
    await doc.cleanup();
  }
}

export async function renderPdfPageToCanvas(
  bytes: Uint8Array,
  pageNumber1Based: number,
  scale = 1.5,
  options?: { transparentBackground?: boolean; password?: string }
): Promise<HTMLCanvasElement> {
  const doc = await openPdfJsDocument(bytes, options?.password);
  try {
    const page = await doc.getPage(pageNumber1Based);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to initialize canvas rendering context.');

    if (!options?.transparentBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({
      canvas,
      canvasContext: ctx,
      viewport,
      background: options?.transparentBackground ? 'rgba(0,0,0,0)' : '#ffffff',
    }).promise;

    return canvas;
  } finally {
    await doc.cleanup();
  }
}

export async function renderPdfThumbnails(
  bytes: Uint8Array,
  targetWidth = 220,
  onProgress?: (done: number, total: number) => void,
  password?: string
): Promise<PdfThumbnail[]> {
  const doc = await openPdfJsDocument(bytes, password);
  const thumbs: PdfThumbnail[] = [];
  try {
    const total = doc.numPages;
    for (let i = 1; i <= total; i += 1) {
      const page = await doc.getPage(i);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(1.5, Math.max(0.25, targetWidth / Math.max(1, baseViewport.width)));
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        }).promise;
      }
      thumbs.push({
        pageNumber: i,
        dataUrl: canvas.toDataURL('image/jpeg', 0.8),
        width: canvas.width,
        height: canvas.height,
      });
      onProgress?.(i, total);
    }
    return thumbs;
  } finally {
    await doc.cleanup();
  }
}

export async function extractPdfTextPages(
  bytes: Uint8Array,
  onProgress?: (done: number, total: number) => void,
  password?: string
): Promise<ExtractedPageText[]> {
  const doc = await openPdfJsDocument(bytes, password);
  const pages: ExtractedPageText[] = [];
  try {
    const total = doc.numPages;
    for (let p = 1; p <= total; p += 1) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();

      interface PositionedItem {
        str: string;
        x: number;
        y: number;
        height: number;
      }

      const items: PositionedItem[] = [];
      for (const raw of content.items) {
        if ('str' in raw && raw.str.trim().length > 0) {
          const transform = raw.transform || [1, 0, 0, 1, 0, 0];
          const fontSize = Math.max(
            6,
            Math.hypot(transform[0] || 0, transform[1] || 0) || raw.height || 11
          );
          items.push({
            str: raw.str,
            x: transform[4] ?? 0,
            y: transform[5] ?? 0,
            height: fontSize,
          });
        }
      }

      // Group items into visual lines by Y coordinate
      items.sort((a, b) => {
        if (Math.abs(b.y - a.y) > 3) return b.y - a.y;
        return a.x - b.x;
      });

      const lineGroups: PositionedItem[][] = [];
      for (const item of items) {
        const lastGroup = lineGroups[lineGroups.length - 1];
        if (!lastGroup) {
          lineGroups.push([item]);
        } else {
          const refY = lastGroup[0].y;
          const tolerance = Math.max(3, lastGroup[0].height * 0.45);
          if (Math.abs(item.y - refY) <= tolerance) {
            lastGroup.push(item);
          } else {
            lineGroups.push([item]);
          }
        }
      }

      const allSizes = items.map((i) => i.height).sort((a, b) => a - b);
      const medianSize = allSizes.length > 0 ? allSizes[Math.floor(allSizes.length / 2)] : 11;

      const lines = lineGroups
        .map((group) => {
          group.sort((a, b) => a.x - b.x);
          const joined = group
            .map((g) => g.str.trim())
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          const avgSize =
            group.reduce((acc, g) => acc + g.height, 0) / Math.max(1, group.length);
          const isHeadingCandidate =
            joined.length > 0 &&
            joined.length <= 95 &&
            avgSize >= medianSize * 1.22;
          return {
            text: joined,
            fontSize: avgSize,
            isHeadingCandidate,
          };
        })
        .filter((l) => l.text.length > 0);

      pages.push({
        pageNumber: p,
        text: lines.map((l) => l.text).join('\n'),
        lines,
      });
      onProgress?.(p, total);
    }
    return pages;
  } finally {
    await doc.cleanup();
  }
}

export function hexToPdfRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return rgb(0.1, 0.1, 0.1);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

/**
 * Normalizes any browser-decodable image (JPG, PNG, etc.) to PNG bytes via Canvas.
 */
export async function imageFileToPngBytes(file: File): Promise<Uint8Array> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Invalid or unsupported image file.'));
    el.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || 1;
  canvas.height = img.naturalHeight || 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable.');
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Image conversion failed.'))), 'image/png');
  });
  return new Uint8Array(await blob.arrayBuffer());
}
