export interface ComponentCategory {
  key: string;
  label: string;
  children: string[];
}

// 分类只负责站点导航。组件可用范围由 @faui/react/manifest 计算。
export const componentCategories: ComponentCategory[] = [
  {
    key: 'layout-navigation',
    label: '布局与导航',
    children: ['box', 'divider', 'flex', 'grid', 'layout', 'space'],
  },
  {
    key: 'data-display',
    label: '数据展示',
    children: ['calendar', 'icon', 'progress', 'skeleton', 'tag', 'text', 'typography'],
  },
  {
    key: 'form-data-entry',
    label: '表单与数据录入',
    children: [
      'autocomplete', 'button', 'cascader', 'checkbox', 'colorpicker',
      'datepicker', 'form', 'input', 'inputnumber', 'mentions', 'radio', 'rate',
      'segmented', 'select', 'slider', 'switch', 'textarea', 'timepicker',
      'transfer', 'treeselect', 'upload',
    ],
  },
  {
    key: 'feedback',
    label: '弹层与反馈',
    children: ['alert', 'drawer', 'modal', 'popconfirm', 'popover', 'spin', 'tooltip'],
  },
  {
    key: 'logic-control-flow',
    label: '逻辑与控制流',
    children: ['condition', 'repeater'],
  },
];

export const fullComponentSlugs = [
  'affix', 'anchor', 'avatar', 'badge', 'card', 'carousel', 'chart', 'collapse',
  'descriptions', 'dropdown', 'empty', 'floatbutton', 'image', 'list', 'menu',
  'pagination', 'qrcode', 'statistic', 'stepindicator', 'steps', 'table', 'tabs',
  'timeline', 'tour', 'tree', 'watermark',
];

export const documentedComponentSlugs = new Set(
  [...componentCategories.flatMap((category) => category.children), ...fullComponentSlugs],
);
