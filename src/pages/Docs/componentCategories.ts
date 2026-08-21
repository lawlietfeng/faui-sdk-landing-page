import navigationPolicyRaw from '../../../docs/doc-navigation.json?raw';

export interface ComponentCategory {
  key: string;
  label: string;
  children: string[];
}

interface NavigationPolicyComponents {
  componentCategories: ComponentCategory[];
  fullComponentSlugs: string[];
}

const navigationPolicy = JSON.parse(navigationPolicyRaw) as NavigationPolicyComponents;

// 分类只负责站点导航。组件可用范围由 @faui/react/manifest 计算。
export const componentCategories = navigationPolicy.componentCategories;
export const fullComponentSlugs = navigationPolicy.fullComponentSlugs;

export const documentedComponentSlugs = new Set(
  [...componentCategories.flatMap((category) => category.children), ...fullComponentSlugs],
);
