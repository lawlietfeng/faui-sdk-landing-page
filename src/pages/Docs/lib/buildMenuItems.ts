import type { MenuProps } from 'antd';
import type {
  DocNavigationItem,
  DocumentationModel,
} from './processDocs';

function formatLabel(item: DocNavigationItem): string {
  return item.label;
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
      if (!route.visible) {
        return false;
      }

      // 正文按路由懒加载，搜索只匹配导航元数据，避免输入时下载全部 Markdown。
      const searchText = `${route.label}\n${route.title}`.toLocaleLowerCase();
      return searchText.includes(query);
    });

    return [{
      key: 'search-results',
      type: 'group',
      label: `搜索结果 (${matchingRoutes.length})`,
      children: matchingRoutes.map((route) => ({
        key: route.path,
        label: route.label,
      })),
    }];
  }

  return documentation.navigation.map((section) => {
    if (section.collapsible) {
      return {
        key: section.key,
        label: section.label,
        children: section.items.map(toMenuItem),
      };
    }

    return {
      key: section.key,
      type: 'group',
      label: section.label,
      children: section.items.map(toMenuItem),
    };
  });
}
