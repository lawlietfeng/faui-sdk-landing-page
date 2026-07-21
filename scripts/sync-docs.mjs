#!/usr/bin/env node
// 对比 ../faui/docs (上游) 与本仓库 docs/ 的差异,输出报告。
// 用途:
//   node scripts/sync-docs.mjs              输出差异报告
//   node scripts/sync-docs.mjs --check      有差异时退出码 1 (CI 用)
//   node scripts/sync-docs.mjs --json       JSON 输出 (脚本消费)
//
// 不会写入文件。同步要么手动 cp,要么走 T13 方案 (faui 包里直接带 docs)。

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LANDING_DOCS = join(__dirname, '..', 'docs');
const UPSTREAM_DOCS = join(__dirname, '..', '..', 'faui', 'docs');

// 上游 faui/docs 里这些文档不该出现在 landing(actions 服务端语义、dev/llm 内部用),
// 缺失它们不算 missing,不阻塞 CI。
const IGNORE_MISSING = [
  /^actions\//,
  /^animation\.md$/,
  /^component-doc-standard\.md$/,
  /^development\.md$/,
  /^faui-llm-prompt\.md$/,
];

// 这些 landing 文档是 site-specific 改写过的。允许它们和上游不同,内容漂移不阻塞 CI。
const IGNORE_DRIFT = [
  /^npm-usage\.md$/,
  /^form-guide\.md$/,
  /^lifecycle-types\.md$/,
  /^components\/chart\.md$/,
  /^components\/condition\.md$/,
  /^components\/repeater\.md$/,
];

const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const JSON_MODE = args.has('--json');

function walk(root) {
  const out = new Map();
  if (!existsSync(root)) return out;
  function rec(dir) {
    for (const name of readdirSync(dir)) {
      const filePath = join(dir, name);
      const st = statSync(filePath);
      if (st.isDirectory()) rec(filePath);
      else if (name.endsWith('.md')) {
        out.set(relative(root, filePath), readFileSync(filePath, 'utf8'));
      }
    }
  }
  rec(root);
  return out;
}

function hash(s) {
  // 简单字符串签名,只用来比较是否完全相同
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h.toString(36);
}

function isIgnoredMissing(path) {
  return IGNORE_MISSING.some((re) => re.test(path));
}

function isIgnoredDrift(path) {
  return IGNORE_DRIFT.some((re) => re.test(path));
}

const upstream = walk(UPSTREAM_DOCS);
const landing = walk(LANDING_DOCS);

const missing = [];        // upstream 有, landing 无, 且不在 ignore 列表
const ignoredMissing = []; // 故意不在 landing 里的(actions/*, dev docs)
const extra = [];          // landing 有, upstream 无
const drift = [];          // 都有但内容不同, 且不在 ignore 列表
const ignoredDrift = [];   // 故意改写过的 site-specific 文档

for (const [path, content] of upstream) {
  if (!landing.has(path)) {
    if (isIgnoredMissing(path)) ignoredMissing.push(path);
    else missing.push(path);
  } else if (hash(content) !== hash(landing.get(path))) {
    const entry = {
      path,
      upstreamBytes: content.length,
      landingBytes: landing.get(path).length,
    };
    if (isIgnoredDrift(path)) ignoredDrift.push(entry);
    else drift.push(entry);
  }
}
for (const path of landing.keys()) {
  if (!upstream.has(path)) extra.push(path);
}

const report = {
  upstream: UPSTREAM_DOCS,
  landing: LANDING_DOCS,
  upstreamCount: upstream.size,
  landingCount: landing.size,
  missing: missing.sort(),
  ignoredMissing: ignoredMissing.sort(),
  extra: extra.sort(),
  drift: drift.sort((a, b) => a.path.localeCompare(b.path)),
  ignoredDrift: ignoredDrift.sort((a, b) => a.path.localeCompare(b.path)),
};

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`[sync-docs] upstream: ${UPSTREAM_DOCS}`);
  console.log(`[sync-docs] landing:  ${LANDING_DOCS}`);
  console.log(`[sync-docs] upstream files: ${upstream.size}`);
  console.log(`[sync-docs] landing files:  ${landing.size}`);
  console.log('');

  if (missing.length) {
    console.log(`Missing in landing (${missing.length}):`);
    for (const p of missing) console.log(`  - ${p}`);
    console.log('');
  }
  if (ignoredMissing.length) {
    console.log(`Ignored missing (intentional, ${ignoredMissing.length}):`);
    for (const p of ignoredMissing) console.log(`  · ${p}`);
    console.log('');
  }
  if (extra.length) {
    console.log(`Extra in landing, not upstream (${extra.length}):`);
    for (const p of extra) console.log(`  + ${p}`);
    console.log('');
  }
  if (drift.length) {
    console.log(`Drifted (different content) (${drift.length}):`);
    for (const d of drift) {
      const diff = d.landingBytes - d.upstreamBytes;
      const sign = diff > 0 ? '+' : '';
      console.log(`  ~ ${d.path}  (landing ${sign}${diff}B vs upstream)`);
    }
    console.log('');
  }
  if (ignoredDrift.length) {
    console.log(`Ignored drift (site-specific authoring, ${ignoredDrift.length}):`);
    for (const d of ignoredDrift) {
      const diff = d.landingBytes - d.upstreamBytes;
      const sign = diff > 0 ? '+' : '';
      console.log(`  · ${d.path}  (landing ${sign}${diff}B vs upstream)`);
    }
    console.log('');
  }
  if (!missing.length && !extra.length && !drift.length) {
    console.log('All docs in sync.');
  }
}

if (CHECK && (missing.length || drift.length)) {
  // 注意:extra / ignoredMissing / ignoredDrift 不阻塞 CI
  process.exit(1);
}
