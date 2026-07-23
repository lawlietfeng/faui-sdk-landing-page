import { ComponentRegistry as FormComponentRegistry } from '@lawlietfeng/faui-sdk';
import { ComponentRegistry as FullComponentRegistry } from '@lawlietfeng/faui-sdk/full';
import {
  componentCategories,
  componentRegistryNamesByDocSlug,
  documentedComponentSlugs,
} from '../componentCategories';

const markdownModules = import.meta.glob('../../../../docs/{sdk,site}/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const QUICK_START = [
  ['sdk/README', '文档首页'],
  ['sdk/npm-usage', 'SDK 使用指南'],
  ['sdk/form-guide', 'Form 表单指南'],
  ['sdk/external-submit', '外部校验与提交'],
  ['sdk/lifecycle-types', 'Activity 与 JSON Patch'],
  ['sdk/animation', 'Animation'],
] as const;

const ACTIONS = [
  ['sdk/actions/README', 'Actions 总览'],
  ['sdk/actions/update_data', 'update_data'],
  ['sdk/actions/http_proxy', 'http_proxy'],
  ['sdk/actions/message', 'message'],
  ['sdk/actions/notification', 'notification'],
  ['sdk/actions/copy', 'copy'],
  ['sdk/actions/mcp_tool_call', 'mcp_tool_call'],
  ['sdk/actions/send_prompt', 'send_prompt'],
  ['sdk/actions/input_prompt', 'input_prompt'],
] as const;

const ADVANCED = [
  ['sdk/development', '开发者指南'],
  ['sdk/component-doc-standard', '组件文档规范'],
  ['sdk/faui-llm-prompt', 'LLM Prompt'],
] as const;

const SITE_GUIDES = [
  ['site/http-request', 'HTTP 请求与后端中转'],
  ['site/lifecycle', '组件与 Action 生命周期'],
] as const;

export type ComponentAvailability = 'form-full' | 'full';

export interface DocRoute {
  path: string;
  documentPath: string;
  source: 'sdk' | 'site';
  content: string;
  label: string;
  title: string;
  availability?: ComponentAvailability;
}

export interface DocNavigationItem {
  path: string;
  label: string;
  availability?: ComponentAvailability;
}

export interface DocNavigationSection {
  key: string;
  label: string;
  items?: DocNavigationItem[];
  categories?: Array<{
    key: string;
    label: string;
    items: DocNavigationItem[];
  }>;
}

export interface DocumentationModel {
  routes: DocRoute[];
  navigation: DocNavigationSection[];
}

export const DEFAULT_DOC_PATH = '/sdk/README';

function getTitle(content: string, fallback: string): string {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading?.replaceAll('`', '') || fallback;
}

function getAvailability(componentSlug: string): ComponentAvailability {
  const registryNames = componentRegistryNamesByDocSlug[componentSlug] ?? [componentSlug];
  const existsInForm = registryNames.every((name) => name in FormComponentRegistry);
  const existsInFull = registryNames.every((name) => name in FullComponentRegistry);

  if (!existsInFull) {
    throw new Error(`SDK component document "${componentSlug}" has no matching Full Edition registry entry.`);
  }

  return existsInForm ? 'form-full' : 'full';
}

function createItem(routes: Map<string, DocRoute>, key: string, label: string): DocNavigationItem {
  const route = routes.get(key);
  if (!route) {
    throw new Error(`Missing configured documentation route: ${key}`);
  }

  route.label = label;
  return { path: route.path, label, availability: route.availability };
}

export function processDocs(): DocumentationModel {
  const routesByKey = new Map<string, DocRoute>();

  for (const [modulePath, moduleContent] of Object.entries(markdownModules)) {
    const match = modulePath.match(/docs\/(sdk|site)\/(.+)\.md$/);
    if (!match) {
      continue;
    }

    const [, source, documentPath] = match;
    const key = `${source}/${documentPath}`;
    const componentMatch = source === 'sdk' ? documentPath.match(/^components\/([^/]+)$/) : null;
    const componentSlug = componentMatch?.[1];
    const availability = componentSlug ? getAvailability(componentSlug) : undefined;
    const fallbackLabel = componentSlug ?? documentPath.split('/').at(-1) ?? key;
    const content = moduleContent as string;

    routesByKey.set(key, {
      path: `/${key}`,
      documentPath,
      source: source as 'sdk' | 'site',
      content,
      label: fallbackLabel,
      title: getTitle(content, fallbackLabel),
      availability,
    });
  }

  const componentDocumentKeys = [...documentedComponentSlugs]
    .map((slug) => `sdk/components/${slug}`)
    .sort((left, right) => left.localeCompare(right));
  const configuredDocumentKeys = new Set([
    ...QUICK_START.map(([key]) => key),
    ...ACTIONS.map(([key]) => key),
    ...ADVANCED.map(([key]) => key),
    ...SITE_GUIDES.map(([key]) => key),
    ...componentDocumentKeys,
  ]);
  const missingConfigured = [...configuredDocumentKeys].filter((key) => !routesByKey.has(key));
  const unlistedDocuments = [...routesByKey.keys()].filter((key) => !configuredDocumentKeys.has(key));

  if (missingConfigured.length > 0 || unlistedDocuments.length > 0) {
    throw new Error(
      `Documentation navigation is incomplete. Missing: ${missingConfigured.join(', ') || 'none'}; `
      + `unlisted: ${unlistedDocuments.join(', ') || 'none'}.`,
    );
  }

  const componentNavigationCategories = componentCategories.map((category) => ({
    key: category.key,
    label: category.label,
    items: category.children.map((slug) => createItem(routesByKey, `sdk/components/${slug}`, slug)),
  }));

  const navigation: DocNavigationSection[] = [
    {
      key: 'quick-start',
      label: '快速开始',
      items: QUICK_START.map(([key, label]) => createItem(routesByKey, key, label)),
    },
    {
      key: 'actions',
      label: 'Actions',
      items: ACTIONS.map(([key, label]) => createItem(routesByKey, key, label)),
    },
    {
      key: 'components',
      label: '组件',
      categories: componentNavigationCategories,
    },
    {
      key: 'advanced',
      label: '进阶',
      items: ADVANCED.map(([key, label]) => createItem(routesByKey, key, label)),
    },
    {
      key: 'site-guides',
      label: '站点指南',
      items: SITE_GUIDES.map(([key, label]) => createItem(routesByKey, key, label)),
    },
  ];

  const routes = [...routesByKey.values()].sort((left, right) => left.path.localeCompare(right.path));
  return { routes, navigation };
}
