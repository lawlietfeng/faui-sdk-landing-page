#!/usr/bin/env node
// 检查同步后的文档是否已明确决定进入导航，还是仅保留为隐藏文档。
// 新文档不会静默进入或消失：脚本会给出建议并要求补充 docs/doc-navigation.json。

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LANDING_ROOT = join(__dirname, '..');
const DOC_ROOTS = [
  { source: 'sdk', root: join(LANDING_ROOT, 'docs', 'sdk') },
  { source: 'site', root: join(LANDING_ROOT, 'docs', 'site') },
];
const POLICY_PATH = join(LANDING_ROOT, 'docs', 'doc-navigation.json');

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

function getDocumentKey(filePath, source, root) {
  return `${source}/${relative(root, filePath).replaceAll('\\', '/').replace(/\.md$/, '')}`;
}

function suggest(key) {
  if (key.startsWith('sdk/components/')) {
    return 'should-list';
  }
  if (key.startsWith('sdk/actions/')) {
    return 'should-hide';
  }
  if (/(^|[-/])(plan|plans|design)([-/]|$)/i.test(key)) {
    return 'should-hide';
  }
  if (/(guide|guides|migration|bindings|reference)/i.test(key)) {
    return 'should-list';
  }
  return 'needs-decision';
}

const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
const listed = new Map(policy.listed.map((item) => [item.key, item]));
const hidden = new Set(policy.hidden);
const componentKeys = new Set([
  ...policy.componentCategories.flatMap((category) => category.children),
  ...policy.fullComponentSlugs,
].map((slug) => `sdk/components/${slug}`));
const files = DOC_ROOTS.flatMap(({ source, root }) => (
  existsSync(root) ? walk(root).map((filePath) => ({
    key: getDocumentKey(filePath, source, root),
    filePath,
  })) : []
));
const fileKeys = new Set(files.map(({ key }) => key));
const knownListed = new Set([...listed.keys(), ...componentKeys]);
const suggestions = {
  'should-list': [],
  'should-hide': [],
  'needs-decision': [],
};
const errors = [];

const listedKeys = policy.listed.map((item) => item.key);
const duplicateListedKeys = listedKeys.filter((key, index) => listedKeys.indexOf(key) !== index);
const duplicateHiddenKeys = policy.hidden.filter((key, index) => policy.hidden.indexOf(key) !== index);
const overlappingKeys = listedKeys.filter((key) => hidden.has(key));
for (const key of new Set(duplicateListedKeys)) {
  errors.push(`configured listed document is duplicated: ${key}`);
}
for (const key of new Set(duplicateHiddenKeys)) {
  errors.push(`configured hidden document is duplicated: ${key}`);
}
for (const key of new Set(overlappingKeys)) {
  errors.push(`document is both listed and hidden: ${key}`);
}
for (const item of policy.listed) {
  if (!['guides-and-reference', 'actions'].includes(item.section)) {
    errors.push(`configured listed document has an invalid section: ${item.key}`);
  }
}

for (const key of listed.keys()) {
  if (!fileKeys.has(key)) {
    errors.push(`configured listed document is missing: ${key}`);
  }
}

for (const key of hidden) {
  if (!fileKeys.has(key)) {
    errors.push(`configured hidden document is missing: ${key}`);
  }
}

for (const { key } of files) {
  if (knownListed.has(key) || hidden.has(key)) {
    continue;
  }

  suggestions[suggest(key)].push(key);
  errors.push(`document has no navigation decision: ${key}`);
}

for (const key of componentKeys) {
  if (!fileKeys.has(key)) {
    errors.push(`configured component document is missing: ${key}`);
  }
}

console.log('[check-doc-navigation] navigation review:');
for (const [kind, label] of [
  ['should-list', '建议进入列表'],
  ['should-hide', '建议不进入列表'],
  ['needs-decision', '需要人工确认'],
]) {
  const paths = suggestions[kind].sort();
  if (paths.length === 0) {
    continue;
  }
  console.log(`  ${label}:`);
  for (const path of paths) {
    console.log(`    - ${path}`);
  }
}

if (errors.length > 0) {
  console.error('[check-doc-navigation] found documentation without a complete navigation decision.');
  console.error('[check-doc-navigation] add each new key to docs/doc-navigation.json.');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('[check-doc-navigation] every document is listed or explicitly hidden.');
}
