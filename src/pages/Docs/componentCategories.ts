export interface ComponentCategory {
  key: string;
  label: string;
  children: string[];
}

// 分类只负责站点导航。组件可用范围始终由本地 SDK 的注册表计算。
export const componentCategories: ComponentCategory[] = [
  {
    key: 'layout-navigation',
    label: '布局与导航',
    children: [
      'affix', 'anchor', 'box', 'divider', 'dropdown', 'flex', 'floatbutton',
      'grid', 'layout', 'menu', 'space', 'tabs',
    ],
  },
  {
    key: 'data-display',
    label: '数据展示',
    children: [
      'avatar', 'badge', 'calendar', 'card', 'carousel', 'collapse',
      'descriptions', 'empty', 'icon', 'image', 'list', 'pagination',
      'progress', 'qrcode', 'skeleton', 'statistic', 'stepindicator', 'steps',
      'table', 'tag', 'text', 'timeline', 'tree', 'typography', 'watermark',
    ],
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
    children: ['alert', 'drawer', 'modal', 'popconfirm', 'popover', 'spin', 'tooltip', 'tour'],
  },
  {
    key: 'logic-control-flow',
    label: '逻辑与控制流',
    children: ['condition', 'repeater'],
  },
  {
    key: 'data-visualization',
    label: '数据可视化',
    children: ['chart'],
  },
];

export const componentRegistryNamesByDocSlug: Record<string, string[]> = {
  grid: ['grid', 'row', 'col'],
  layout: ['layout', 'header', 'sider', 'content', 'footer'],
  floatbutton: ['float_button'],
};

export const documentedComponentSlugs = new Set(
  componentCategories.flatMap((category) => category.children),
);
