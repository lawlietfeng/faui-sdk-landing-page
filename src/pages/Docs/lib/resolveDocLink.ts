import type { DocRoute } from './processDocs';

const legacyRoutes: Record<string, string> = {
  '/docs/http-request': '/docs/site/http-request',
  '/docs/lifecycle': '/docs/site/lifecycle',
  '/docs/lifecycle-types': '/docs/sdk/lifecycle-types',
  '/docs/npm-usage': '/docs/sdk/npm-usage',
  '/docs/form-guide': '/docs/sdk/form-guide',
};

function isExternalUrl(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export function isSdkSourceLink(href: string, route: DocRoute): boolean {
  if (!href || href.startsWith('#') || isExternalUrl(href) || href.startsWith('/')) {
    return false;
  }

  const resolved = new URL(href, `https://docs.local/${route.source}/${route.documentPath}`);
  const path = decodeURIComponent(resolved.pathname.slice(1));

  return route.source === 'sdk' && /^(examples|src|tests)\//.test(path);
}

export function resolveDocLink(href: string, route: DocRoute): string {
  if (!href || href.startsWith('#') || isExternalUrl(href)) {
    return href;
  }

  if (href.startsWith('/docs/')) {
    return legacyRoutes[href] ?? href;
  }

  if (href.startsWith('/')) {
    return href;
  }

  const resolved = new URL(href, `https://docs.local/${route.source}/${route.documentPath}`);
  const path = decodeURIComponent(resolved.pathname.slice(1));
  const suffix = `${resolved.search}${resolved.hash}`;

  if (path.endsWith('.md')) {
    return `/docs/${path.slice(0, -3)}${suffix}`;
  }

  return href;
}

export function isExternalDocLink(href: string): boolean {
  return isExternalUrl(href);
}

export function isInternalDocLink(href: string): boolean {
  return href === '/docs' || href.startsWith('/docs/');
}
