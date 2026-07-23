#!/usr/bin/env node
// 将 ../faui-sdk/docs 完整镜像到 docs/sdk，或检查镜像是否与上游一致。
//
//   npm run sync-docs         写入镜像
//   npm run sync-docs:check   只检查，任意 missing / drift / extra 均失败
//   node scripts/sync-docs.mjs --json

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SDK_ROOT = join(__dirname, '..', '..', 'faui-sdk');
const UPSTREAM_DOCS = join(SDK_ROOT, 'docs');
const MIRROR_DOCS = join(__dirname, '..', 'docs', 'sdk');

const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const JSON_MODE = args.has('--json');
const WRITE = !CHECK || args.has('--write');

function walk(root) {
  const files = new Map();

  function visit(directory) {
    for (const name of readdirSync(directory).sort((left, right) => left.localeCompare(right))) {
      const filePath = join(directory, name);
      const fileInfo = statSync(filePath);
      if (fileInfo.isDirectory()) {
        visit(filePath);
      } else if (name.endsWith('.md')) {
        files.set(relative(root, filePath), filePath);
      }
    }
  }

  visit(root);
  return files;
}

function getSdkCommit() {
  try {
    return execFileSync('git', ['-C', SDK_ROOT, 'rev-parse', '--short', 'HEAD'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

function removeEmptyDirectories(directory) {
  for (const name of readdirSync(directory)) {
    const filePath = join(directory, name);
    if (statSync(filePath).isDirectory()) {
      removeEmptyDirectories(filePath);
      if (readdirSync(filePath).length === 0) {
        rmSync(filePath, { recursive: true, force: true });
      }
    }
  }
}

if (!existsSync(UPSTREAM_DOCS) || !statSync(UPSTREAM_DOCS).isDirectory()) {
  throw new Error(`Local FAUI SDK docs are unavailable: ${UPSTREAM_DOCS}`);
}

if (WRITE) {
  mkdirSync(MIRROR_DOCS, { recursive: true });
  const upstreamBeforeWrite = walk(UPSTREAM_DOCS);
  const mirrorBeforeWrite = walk(MIRROR_DOCS);

  for (const [docPath, sourcePath] of upstreamBeforeWrite) {
    const targetPath = join(MIRROR_DOCS, docPath);
    mkdirSync(dirname(targetPath), { recursive: true });
    copyFileSync(sourcePath, targetPath);
  }

  for (const docPath of mirrorBeforeWrite.keys()) {
    if (!upstreamBeforeWrite.has(docPath)) {
      rmSync(join(MIRROR_DOCS, docPath), { force: true });
    }
  }

  removeEmptyDirectories(MIRROR_DOCS);
}

const upstream = walk(UPSTREAM_DOCS);
const mirror = existsSync(MIRROR_DOCS) ? walk(MIRROR_DOCS) : new Map();
const missing = [];
const drift = [];
const extra = [];

for (const [docPath, sourcePath] of upstream) {
  const mirrorPath = mirror.get(docPath);
  if (!mirrorPath) {
    missing.push(docPath);
  } else if (readFileSync(sourcePath, 'utf8') !== readFileSync(mirrorPath, 'utf8')) {
    drift.push(docPath);
  }
}

for (const docPath of mirror.keys()) {
  if (!upstream.has(docPath)) {
    extra.push(docPath);
  }
}

const report = {
  mode: WRITE ? 'write' : 'check',
  sdkCommit: getSdkCommit(),
  upstream: UPSTREAM_DOCS,
  mirror: MIRROR_DOCS,
  upstreamCount: upstream.size,
  mirrorCount: mirror.size,
  missing: missing.sort(),
  drift: drift.sort(),
  extra: extra.sort(),
};

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`[sync-docs] mode: ${report.mode}`);
  console.log(`[sync-docs] sdk commit: ${report.sdkCommit}`);
  console.log(`[sync-docs] upstream: ${report.upstream}`);
  console.log(`[sync-docs] mirror: ${report.mirror}`);
  console.log(`[sync-docs] files: upstream=${report.upstreamCount}, mirror=${report.mirrorCount}`);

  for (const [kind, paths] of Object.entries({ missing, drift, extra })) {
    if (paths.length > 0) {
      console.log(`[sync-docs] ${kind} (${paths.length}):`);
      for (const docPath of paths) {
        console.log(`  - ${docPath}`);
      }
    }
  }

  if (missing.length === 0 && drift.length === 0 && extra.length === 0) {
    console.log('[sync-docs] mirror is in sync.');
  }
}

if (CHECK && (missing.length > 0 || drift.length > 0 || extra.length > 0)) {
  process.exitCode = 1;
}
