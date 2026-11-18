import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
  className?: string;
}

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  variant = 'secondary',
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const baseStyle =
    'inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[36px] px-3.5 py-2 disabled:opacity-40';

  const variantStyle =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : variant === 'subtle'
        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300';

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!text}
        className={`${baseStyle} ${variantStyle} ${className}`}
        aria-label={copied ? copiedLabel : label}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span className={variant === 'primary' ? 'text-white' : 'text-emerald-700'}>
              {copiedLabel}
            </span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${copiedLabel} to clipboard` : ''}
      </span>
    </>
  );
}
