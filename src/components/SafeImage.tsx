import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  priority = false,
  width,
  height,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 border border-slate-200 text-slate-600 p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3 text-blue-600 shadow-xs">
          <BarChart3 className="w-6 h-6" aria-hidden="true" />
        </div>
        <span className="text-sm font-medium text-slate-700 text-center">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  const isWebp = src.endsWith('.webp');
  const avifSrc = isWebp ? src.replace(/\.webp$/, '.avif') : undefined;

  const imgEl = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      onError={() => setHasError(true)}
      className={className}
    />
  );

  if (!avifSrc) {
    return imgEl;
  }

  return (
    <picture className="block w-full h-full">
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={src} type="image/webp" />
      {imgEl}
    </picture>
  );
}
