import type { MenuProps } from 'antd';
import type {
  DocNavigationItem,
  DocumentationModel,
} from './processDocs';

function formatLabel(item: DocNavigationItem): string {
  return item.availability === 'full' ? `${item.label} · Full` : item.label;
}

function toMenuItem(item: DocNavigationItem) {
  return { key: item.path, label: formatLabel(item) };
}

export function buildMenuItems(
  documentation: DocumentationModel,
  searchQuery: string,
): NonNullable<MenuProps['items']> {
  const query = searchQuery.trim().toLocaleLowerCase();

  if (query) {
    const matchingRoutes = documentation.routes.filter((route) => {
      const searchText = `${route.label}\n${route.title}\n${route.content}`.toLocaleLowerCase();
      return searchText.includes(query);
    });

    return [{
      key: 'search-results',
      type: 'group',
      label: `搜索结果 (${matchingRoutes.length})`,
      children: matchingRoutes.map((route) => ({
        key: route.path,
        label: route.availability === 'full' ? `${route.label} · Full` : route.label,
      })),
    }];
  }

  return documentation.navigation.map((section) => {
    if (section.categories) {
      return {
        key: section.key,
        label: section.label,
        children: section.categories.map((category) => ({
          key: category.key,
          label: category.label,
          children: category.items.map(toMenuItem),
        })),
      };
    }

    return {
      key: section.key,
      type: 'group',
      label: section.label,
      children: section.items?.map(toMenuItem),
    };
  });
}
