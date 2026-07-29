import { ComponentRegistry as FormComponentRegistry } from '@faui/react';
import { ComponentRegistry as FullComponentRegistry } from '@faui/react/full';
import {
  componentCategories,
  componentRegistryNamesByDocSlug,
  documentedComponentSlugs,
  fullComponentSlugs,
} from '../componentCategories';

const markdownModules = import.meta.glob('../../../../docs/{sdk,site}/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const GUIDES_AND_REFERENCE = [
  ['sdk/development', '开发者指南'],
  ['sdk/npm-usage', 'SDK 使用指南'],
  ['sdk/form-guide', 'Form 表单指南'],
  ['sdk/external-submit', '外部校验与提交'],
  ['site/http-request', 'HTTP 请求与后端中转'],
  ['site/lifecycle', '组件与 Action 生命周期'],
  ['sdk/lifecycle-types', 'Activity 与 JSON Patch'],
  ['sdk/animation', 'Animation'],
  ['sdk/component-doc-standard', '组件文档规范'],
] as const;

const BUILT_IN_ACTIONS = [
  ['sdk/actions/update_data', 'update_data'],
  ['sdk/actions/http_proxy', 'http_proxy'],
  ['sdk/actions/message', 'message'],
  ['sdk/actions/notification', 'notification'],
] as const;

// 这些文档保留为可直接访问的页面，但不进入站点导航或搜索结果。
const HIDDEN_DOCUMENT_KEYS = new Set([
  'sdk/faui-llm-prompt',
  'sdk/actions/README',
  'sdk/actions/copy',
  'sdk/actions/mcp_tool_call',
  'sdk/actions/send_prompt',
  'sdk/actions/input_prompt',
]);

export type ComponentAvailability = 'form-full' | 'full';

export interface DocRoute {
  path: string;
  documentPath: string;
  source: 'sdk' | 'site';
  content: string;
  label: string;
  title: string;
  visible: boolean;
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
  items: DocNavigationItem[];
  collapsible?: boolean;
}

export interface DocumentationModel {
  routes: DocRoute[];
  navigation: DocNavigationSection[];
}

export const DEFAULT_DOC_PATH = '/sdk/development';

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
      visible: !HIDDEN_DOCUMENT_KEYS.has(key),
      availability,
    });
  }

  const componentDocumentKeys = [...documentedComponentSlugs]
    .map((slug) => `sdk/components/${slug}`)
    .sort((left, right) => left.localeCompare(right));
  const expectedDocumentKeys = new Set([
    ...GUIDES_AND_REFERENCE.map(([key]) => key),
    ...BUILT_IN_ACTIONS.map(([key]) => key),
    ...HIDDEN_DOCUMENT_KEYS,
    ...componentDocumentKeys,
  ]);
  const missingConfigured = [...expectedDocumentKeys].filter((key) => !routesByKey.has(key));
  const unlistedDocuments = [...routesByKey.keys()].filter((key) => !expectedDocumentKeys.has(key));

  if (missingConfigured.length > 0 || unlistedDocuments.length > 0) {
    throw new Error(
      `Documentation navigation is incomplete. Missing: ${missingConfigured.join(', ') || 'none'}; `
      + `unlisted: ${unlistedDocuments.join(', ') || 'none'}.`,
    );
  }

  const componentNavigationSections: DocNavigationSection[] = componentCategories.map((category) => ({
    key: category.key,
    label: category.label,
    collapsible: true,
    items: category.children.map((slug) => createItem(routesByKey, `sdk/components/${slug}`, slug)),
  }));
  const fullComponentNavigationSection: DocNavigationSection = {
    key: 'full-components',
    label: 'Full 组件',
    collapsible: true,
    items: fullComponentSlugs.map((slug) => createItem(routesByKey, `sdk/components/${slug}`, slug)),
  };

  const navigation: DocNavigationSection[] = [
    {
      key: 'guides-and-reference',
      label: '指南与参考',
      collapsible: true,
      items: GUIDES_AND_REFERENCE.map(([key, label]) => createItem(routesByKey, key, label)),
    },
    {
      key: 'actions',
      label: 'Actions',
      collapsible: true,
      items: BUILT_IN_ACTIONS.map(([key, label]) => createItem(routesByKey, key, label)),
    },
    ...componentNavigationSections,
    fullComponentNavigationSection,
  ];

  const routes = [...routesByKey.values()].sort((left, right) => left.path.localeCompare(right.path));
  return { routes, navigation };
}
