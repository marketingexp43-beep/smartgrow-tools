import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  robots?: string;
  ogType?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  section?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export const SITE_URL = 'https://smartgrow-tools.pages.dev';
const DEFAULT_OG_IMAGE = '/src/assets/images/hero_marketing_workspace_1794855472737.webp';
const DEFAULT_OG_IMAGE_ALT = 'SmartGrow Tools minimalist digital marketing workspace';
const GA_MEASUREMENT_ID = 'G-516BP7Z6RL';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let lastTrackedPath =
  typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '';

function setMetaTag(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMetaTag(selector: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.remove();
  }
}

export function SeoHead({
  title,
  description,
  path,
  robots = 'index, follow',
  ogType = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  publishedTime,
  section,
  structuredData,
}: SeoHeadProps) {
  useEffect(() => {
    document.title = title;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="robots"]', 'name', 'robots', robots);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'SmartGrow Tools');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    if (ogType === 'article' && publishedTime) {
      setMetaTag('meta[property="article:published_time"]', 'property', 'article:published_time', publishedTime);
    } else {
      removeMetaTag('meta[property="article:published_time"]');
    }

    if (ogType === 'article' && section) {
      setMetaTag('meta[property="article:section"]', 'property', 'article:section', section);
    } else {
      removeMetaTag('meta[property="article:section"]');
    }

    const rawPath = path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const normalizedPath = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '');
    const canonicalUrl = `${SITE_URL}${normalizedPath}`;
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAlt);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAlt);

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    if (typeof window !== 'undefined') {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (currentPath !== lastTrackedPath) {
        lastTrackedPath = currentPath;
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'page_view', {
            send_to: GA_MEASUREMENT_ID,
            page_title: title,
            page_location: window.location.href,
            page_path: currentPath,
          });
        }
      }
    }

    const existingScript = document.getElementById('smartgrow-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.id = 'smartgrow-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, path, robots, ogType, image, structuredData]);

  return null;
}
