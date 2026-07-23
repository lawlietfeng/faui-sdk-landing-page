#!/usr/bin/env node
// 检查镜像和站点文档中的本地 Markdown、SDK 源码、测试与示例链接。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LANDING_ROOT = join(__dirname, '..');
const SDK_ROOT = join(LANDING_ROOT, '..', 'faui-sdk');
const DOC_ROOTS = [
  { source: 'sdk', root: join(LANDING_ROOT, 'docs', 'sdk'), targetRoot: join(SDK_ROOT, 'docs') },
  { source: 'site', root: join(LANDING_ROOT, 'docs', 'site'), targetRoot: join(LANDING_ROOT, 'docs', 'site') },
];

function walk(root) {
  const files = [];

  function visit(directory) {
    for (const name of readdirSync(directory).sort((left, right) => left.localeCompare(right))) {
      const filePath = join(directory, name);
      if (statSync(filePath).isDirectory()) {
        visit(filePath);
      } else if (name.endsWith('.md')) {
        files.push(filePath);
      }
    }
  }

  visit(root);
  return files;
}

function extractLinks(content) {
  const links = [];
  const pattern = /(?<!!)\[[^\]]*]\(([^)]+)\)/g;

  for (const match of content.matchAll(pattern)) {
    const rawTarget = match[1].trim();
    const target = rawTarget.startsWith('<')
      ? rawTarget.slice(1, rawTarget.indexOf('>'))
      : rawTarget.split(/\s+/)[0];
    links.push(target);
  }

  return links;
}

function isIgnored(href) {
  return !href || href.startsWith('#') || /^(https?:|mailto:|tel:)/i.test(href);
}

const errors = [];

for (const docRoot of DOC_ROOTS) {
  if (!existsSync(docRoot.root)) {
    errors.push(`Missing documentation directory: ${docRoot.root}`);
    continue;
  }

  for (const filePath of walk(docRoot.root)) {
    const content = readFileSync(filePath, 'utf8');
    for (const href of extractLinks(content)) {
      if (isIgnored(href)) {
        continue;
      }

      const [rawPath] = href.split(/[?#]/, 1);
      if (rawPath.startsWith('/docs/')) {
        const route = rawPath.slice('/docs/'.length);
        const legacyRoutes = {
          'http-request': 'site/http-request',
          lifecycle: 'site/lifecycle',
          'lifecycle-types': 'sdk/lifecycle-types',
          'npm-usage': 'sdk/npm-usage',
          'form-guide': 'sdk/form-guide',
        };
        const normalizedRoute = legacyRoutes[route] ?? route;
        const [source, ...pathParts] = normalizedRoute.split('/');
        const targetRoot = DOC_ROOTS.find((item) => item.source === source)?.root;
        const target = targetRoot && join(targetRoot, `${pathParts.join('/')}.md`);
        if (!target || !existsSync(target)) {
          errors.push(`${relative(LANDING_ROOT, filePath)} -> ${href}`);
        }
        continue;
      }

      if (rawPath.startsWith('/')) {
        continue;
      }

      let target;
      try {
        target = resolve(dirname(docRoot.targetRoot === docRoot.root ? filePath : join(docRoot.targetRoot, relative(docRoot.root, filePath))), decodeURIComponent(rawPath));
      } catch {
        errors.push(`${relative(LANDING_ROOT, filePath)} -> ${href} (invalid URL encoding)`);
        continue;
      }

      if (!existsSync(target)) {
        errors.push(`${relative(LANDING_ROOT, filePath)} -> ${href}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`[check-doc-links] ${errors.length} invalid local link(s):`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('[check-doc-links] all local documentation links are valid.');
}
