export interface ComponentCategory {
  key: string;
  label: string;
  children: string[];
}

export const componentCategories: ComponentCategory[] = [
  {
    key: 'control-flow',
    label: '控制流 Control Flow',
    children: ['condition', 'repeater'],
  },
  {
    key: 'layout',
    label: '布局 Layout',
    children: ['box', 'flex', 'grid', 'space', 'divider', 'layout'],
  },
  {
    key: 'data-entry',
    label: '数据录入 Data Entry',
    children: [
      'form', 'input', 'textarea', 'select', 'checkbox', 'radio',
      'datepicker', 'inputnumber', 'slider', 'rate', 'cascader',
      'treeselect', 'timepicker', 'colorpicker', 'transfer',
      'autocomplete', 'mentions', 'switch', 'upload', 'segmented',
    ],
  },
  {
    key: 'helpers',
    label: '辅助 Helpers',
    children: [
      'text', 'button', 'icon', 'typography', 'alert', 'modal',
      'drawer', 'spin', 'tooltip', 'popconfirm', 'tag', 'progress',
      'skeleton', 'popover',
    ],
  },
  {
    key: 'display',
    label: '展示 Display',
    children: ['calendar'],
  },
];

export const DOCUMENTED_FORM_COMPONENTS = new Set(
  componentCategories.flatMap((category) => category.children),
);
