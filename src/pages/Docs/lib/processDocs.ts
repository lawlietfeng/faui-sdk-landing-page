import { componentManifest } from '@faui/react/manifest';
import {
  componentCategories,
  documentedComponentSlugs,
  fullComponentSlugs,
} from '../componentCategories';
import navigationPolicyRaw from '../../../../docs/doc-navigation.json?raw';

const markdownModules = import.meta.glob('../../../../docs/{sdk,site}/**/*.md', {
  query: '?raw',
  import: 'default',
});

type MarkdownLoader = () => Promise<string>;

// 每篇 Markdown 都作为独立模块按需加载；缓存可避免重复访问同一篇文档。
const markdownContentCache = new Map<string, Promise<string>>();

interface NavigationPolicyEntry {
  key: string;
  label: string;
  section: 'guides-and-reference' | 'actions';
}

interface NavigationPolicy {
  listed: NavigationPolicyEntry[];
  hidden: string[];
}

const navigationPolicy = JSON.parse(navigationPolicyRaw) as NavigationPolicy;
const GUIDES_AND_REFERENCE = navigationPolicy.listed
  .filter((item) => item.section === 'guides-and-reference')
  .map(({ key, label }) => [key, label] as const);
const BUILT_IN_ACTIONS = navigationPolicy.listed
  .filter((item) => item.section === 'actions')
  .map(({ key, label }) => [key, label] as const);

// 这些文档保留为可直接访问的页面，但不进入站点导航或搜索结果。
const HIDDEN_DOCUMENT_KEYS = new Set(navigationPolicy.hidden);

export type ComponentAvailability = 'form-full' | 'full';

export interface DocRoute {
  path: string;
  documentPath: string;
  source: 'sdk' | 'site';
  loadContent: () => Promise<string>;
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

function createContentLoader(modulePath: string, loader: MarkdownLoader): () => Promise<string> {
  return () => {
    const cached = markdownContentCache.get(modulePath);
    if (cached) {
      return cached;
    }

    const contentPromise = loader();
    markdownContentCache.set(modulePath, contentPromise);
    void contentPromise.catch(() => {
      markdownContentCache.delete(modulePath);
    });
    return contentPromise;
  };
}

function getAvailability(componentSlug: string): ComponentAvailability {
  const component = componentManifest.components.find((item) => item.slug === componentSlug);

  if (!component) {
    throw new Error(`SDK component document "${componentSlug}" has no manifest entry.`);
  }

  return component.availability;
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

  for (const [modulePath, loader] of Object.entries(markdownModules)) {
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

    routesByKey.set(key, {
      path: `/${key}`,
      documentPath,
      source: source as 'sdk' | 'site',
      loadContent: createContentLoader(modulePath, loader as MarkdownLoader),
      label: fallbackLabel,
      title: fallbackLabel,
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
