import type { MenuProps } from 'antd';
import { componentCategories } from '../componentCategories';
import type { GuideItem } from './processDocs';

// 把指南列表 + 组件分类 + 搜索词组合成 Ant Design Menu items。
// 搜索词非空时隐藏“使用指南”分组,只在组件分类内做名字过滤。
export function buildMenuItems(
  guideItems: GuideItem[],
  componentDocs: Map<string, string>,
  searchQuery: string,
): NonNullable<MenuProps['items']> {
  const query = searchQuery.toLowerCase().trim();

  const categoryChildren = componentCategories.flatMap((cat) => {
    const items = cat.children
      .filter((name) => componentDocs.has(name))
      .filter((name) => !query || name.includes(query))
      .map((name) => {
        const baseLabel = name.charAt(0).toUpperCase() + name.slice(1);
        return {
          key: componentDocs.get(name)!,
          label: baseLabel,
        };
      });

    if (items.length === 0) return [];

    return [{
      key: cat.key,
      label: cat.label,
      children: items,
    }];
  });

  const menuItems: NonNullable<MenuProps['items']> = [];

  if (!query) {
    menuItems.push({
      key: 'guides',
      label: '使用指南',
      type: 'group',
      children: guideItems.map((g) => ({ key: g.key, label: g.label })),
    });
  }

  menuItems.push(...categoryChildren);

  return menuItems;
}
