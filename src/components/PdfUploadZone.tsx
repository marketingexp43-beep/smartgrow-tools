import { ChangeEvent, DragEvent, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileUp,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { formatFileSize } from '../utils/pdfCore';

interface PdfUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  label?: string;
  helperText?: string;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function PdfUploadZone({
  accept = '.pdf,application/pdf',
  multiple = false,
  label = 'Choose PDF file',
  helperText = 'Drag and drop your file here, or click to browse from your device.',
  onFilesSelected,
  disabled = false,
  compact = false,
}: PdfUploadZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    onFilesSelected(multiple ? files : [files[0]]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`rounded-xl border-2 border-dashed transition-colors ${
        compact ? 'p-5' : 'p-8 sm:p-10'
      } text-center ${
        disabled
          ? 'border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed'
          : isDragging
            ? 'border-blue-600 bg-blue-50/60'
            : 'border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/20'
      }`}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />

      <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mb-3.5">
        <FileUp className="w-6 h-6" aria-hidden="true" />
      </div>

      <label
        htmlFor={inputId}
        className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors ${
          disabled ? 'pointer-events-none opacity-60' : 'cursor-pointer'
        }`}
      >
        {label}
      </label>

      <p className="mt-3 text-sm text-slate-600">{helperText}</p>

      <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
        <span>Processed locally in your browser. Files are never uploaded to any server.</span>
      </p>
    </div>
  );
}

interface PdfProgressBarProps {
  progress: number | null;
  statusText?: string;
}

export function PdfProgressBar({ progress, statusText }: PdfProgressBarProps) {
  if (progress === null) return null;
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-2"
    >
      <div className="flex items-center justify-between gap-3 text-xs font-medium text-blue-900">
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" aria-hidden="true" />
          <span>{statusText || 'Processing document in browser...'}</span>
        </span>
        <span className="font-mono tabular-nums">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-2 rounded-full bg-blue-100 overflow-hidden"
      >
        <div
          className="h-full bg-blue-600 transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface PdfErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

export function PdfErrorBanner({ message, onDismiss }: PdfErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50/70 p-4 flex items-start justify-between gap-3 text-sm text-red-900"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-semibold text-red-700 hover:underline shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

interface PdfResultCardProps {
  title: string;
  details: string;
  downloadLabel: string;
  onDownload: () => void;
  onReset?: () => void;
}

export function PdfResultCard({
  title,
  details,
  downloadLabel,
  onDownload,
  onReset,
}: PdfResultCardProps) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-600">{details}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>{downloadLabel}</span>
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Start Over</span>
          </button>
        )}
      </div>
    </div>
  );
}

interface PdfFileInfoBarProps {
  file: File;
  pageCount?: number | null;
  extraText?: string;
  onClear: () => void;
}

export function PdfFileInfoBar({ file, pageCount, extraText, onClear }: PdfFileInfoBarProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">{file.name}</div>
        <div className="mt-0.5 text-xs text-slate-500 font-mono tabular-nums flex flex-wrap items-center gap-x-2">
          <span>{formatFileSize(file.size)}</span>
          {typeof pageCount === 'number' && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </span>
            </>
          )}
          {extraText && (
            <>
              <span aria-hidden="true">·</span>
              <span>{extraText}</span>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Change File</span>
      </button>
    </div>
  );
}
