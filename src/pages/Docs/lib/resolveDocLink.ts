import type { DocRoute } from './processDocs';

const SDK_GITHUB_BASE = 'https://github.com/lawlietfeng/faui-sdk/blob/master/';

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

function encodeGithubPath(path: string): string {
  return path.split('/').map((part) => encodeURIComponent(part)).join('/');
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

  if (route.source === 'sdk' && /^(examples|src|tests)\//.test(path)) {
    return `${SDK_GITHUB_BASE}${encodeGithubPath(path)}${suffix}`;
  }

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
