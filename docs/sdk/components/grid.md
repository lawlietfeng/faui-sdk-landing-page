# grid 栅格布局组件

`row` 和 `col` 组合构成了基于 24 栅格的系统布局。它们通常用于将页面划分为等宽或按比例划分的多个列，适合构建表单、仪表盘卡片或响应式页面框架。

## 适用场景

- **表单布局**：将复杂的表单项划分为 2 列或 3 列显示。
- **信息展示**：在详情页（如 `descriptions` 的替代）将多项数据左右排列。
- **响应式页面**：通过搭配不同的 `span` 值实现网格化页面布局。

## Row (行) 核心属性

`row` 组件是栅格系统的外层容器。

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `gutter` | `number \| [number, number]` | `0` | 栅格间隔。传入数字表示水平间距，传入数组 `[水平间距, 垂直间距]` 表示水平与垂直间距 |
| `align` | `string` | `top` | 垂直对齐方式，可选 `top`、`middle`、`bottom`、`stretch` |
| `justify` | `string` | `start` | 水平排列方式，可选 `start`、`end`、`center`、`space-around`、`space-between` 等 |
| `wrap` | `boolean` | `true` | 当子列总宽度超过 24 时，是否自动换行 |
| `children` | `string[]` | `[]` | 子组件（通常必须为 `col` 组件）的 ID 数组 |

### gutter（间距）

推荐使用预设的像素间距（如 16 或 24）来保持视觉一致性。

```json
{
  "id": "row-gutter",
  "component": "row",
  "gutter": [16, 24],
  "children": ["col-1", "col-2", "col-3"]
}
```

## Col (列) 核心属性

`col` 组件是栅格系统的内层单元，必须放在 `row` 里面。

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `span` | `number` | - | 栅格占位格数（总共 24 格）。例如 12 占一半，8 占三分之一。为 0 时相当于隐藏 |
| `offset` | `number` | `0` | 栅格左侧的间隔格数（空白占位），该间隔内不可有其他栅格 |
| `flex` | `string \| number` | - | 自定义 flex 布局属性，当需要按剩余空间分配时使用（如 `"auto"` 或 `"1 1 200px"`） |
| `push` / `pull` | `number` | `0` | 栅格向右 / 向左移动的格数（改变视觉顺序而不改变 DOM 顺序） |
| `order` | `number` | `0` | 栅格排序顺序，类似 flex 的 order |
| `children` | `string[]` | `[]` | 该列内部的具体内容组件 ID |

### span（占比）

`span` 的总和在一行内为 24。如果超过 24，在 `row` 的 `wrap` 为 `true` 的情况下会自动换到下一行。

```json
{
  "id": "col-half",
  "component": "col",
  "span": 12,
  "children": ["input-name"]
}
```

## 完整示例

这是一个包含两行内容的栅格布局示例。第一行展示了两列均分（`span: 12`），第二行展示了左边列固定宽度占 8 格，右边列有 8 格空隙后占 8 格。

```json
[
  {
    "id": "grid-container",
    "component": "box",
    "children": ["row-1", "row-2"]
  },
  {
    "id": "row-1",
    "component": "row",
    "gutter": 16,
    "style": { "marginBottom": "24px" },
    "children": ["r1-col1", "r1-col2"]
  },
  {
    "id": "r1-col1",
    "component": "col",
    "span": 12,
    "children": ["text-left"]
  },
  {
    "id": "r1-col2",
    "component": "col",
    "span": 12,
    "children": ["text-right"]
  },
  {
    "id": "row-2",
    "component": "row",
    "gutter": 16,
    "children": ["r2-col1", "r2-col2"]
  },
  {
    "id": "r2-col1",
    "component": "col",
    "span": 8,
    "children": ["text-box1"]
  },
  {
    "id": "r2-col2",
    "component": "col",
    "span": 8,
    "offset": 8,
    "children": ["text-box2"]
  },
  {
    "id": "text-left",
    "component": "typography",
    "content": "占据 12/24（左半边）"
  },
  {
    "id": "text-right",
    "component": "typography",
    "content": "占据 12/24（右半边）"
  },
  {
    "id": "text-box1",
    "component": "typography",
    "content": "占据 8/24"
  },
  {
    "id": "text-box2",
    "component": "typography",
    "content": "偏移 8/24，再占 8/24"
  }
]
```

## 响应式断点

FAUI 的栅格系统完整支持 Ant Design 6 大响应式断点，让 AI 生成的页面能自动适配从手机到大屏的所有设备。

### 断点尺寸参考

| 断点 | 屏幕宽度 | 典型设备 |
|------|---------|---------|
| `xs` | <576px | 手机竖屏 |
| `sm` | ≥576px | 手机横屏 |
| `md` | ≥768px | 平板 |
| `lg` | ≥992px | 小桌面 |
| `xl` | ≥1200px | 标准桌面 |
| `xxl` | ≥1600px | 大屏 / 4K |

### Col 响应式属性

每个断点属性支持两种写法：

- **数字**（纯 span）：`"md": 12` — 在 ≥768px 时占 12 格
- **对象**（带 offset 等）：`"md": { "span": 12, "offset": 2 }` — 在 ≥768px 时偏移 2 格后占 12 格

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| `xs` | `number \| { span, offset, order, pull, push }` | <576px 时的栅格配置 |
| `sm` | 同上 | ≥576px 时的栅格配置 |
| `md` | 同上 | ≥768px 时的栅格配置 |
| `lg` | 同上 | ≥992px 时的栅格配置 |
| `xl` | 同上 | ≥1200px 时的栅格配置 |
| `xxl` | 同上 | ≥1600px 时的栅格配置 |

**规则**：小断点的值会被大断点覆盖。例如配置了 `xs: 24, md: 12`，则 <768px 时占 24 格（满宽），≥768px 时占 12 格（半宽）。

### Row 响应式 gutter

`gutter` 除了支持 `number` 和 `[水平, 垂直]` 数组，还支持按断点配置间距：

```json
{
  "id": "row-responsive",
  "component": "row",
  "gutter": { "xs": 8, "sm": 16, "md": 24 },
  "children": ["col-1", "col-2", "col-3"]
}
```

### 响应式完整示例

三列卡片布局：手机单列、平板双列、桌面三列。

```json
[
  {
    "id": "root",
    "component": "box",
    "children": ["responsive-row"]
  },
  {
    "id": "responsive-row",
    "component": "row",
    "gutter": [16, 16],
    "children": ["card-col-1", "card-col-2", "card-col-3"]
  },
  {
    "id": "card-col-1",
    "component": "col",
    "xs": 24,
    "sm": 12,
    "lg": 8,
    "children": ["card-1"]
  },
  {
    "id": "card-col-2",
    "component": "col",
    "xs": 24,
    "sm": 12,
    "lg": 8,
    "children": ["card-2"]
  },
  {
    "id": "card-col-3",
    "component": "col",
    "xs": 24,
    "sm": 12,
    "lg": 8,
    "children": ["card-3"]
  },
  {
    "id": "card-1",
    "component": "card",
    "title": "卡片一",
    "children": ["text-1"]
  },
  {
    "id": "card-2",
    "component": "card",
    "title": "卡片二",
    "children": ["text-2"]
  },
  {
    "id": "card-3",
    "component": "card",
    "title": "卡片三",
    "children": ["text-3"]
  },
  { "id": "text-1", "component": "text", "content": "手机单列 → 平板双列 → 桌面三列" },
  { "id": "text-2", "component": "text", "content": "响应式自动适配" },
  { "id": "text-3", "component": "text", "content": "无需任何 CSS 媒体查询" }
]
```

## 新手常见问题

**Q: 为什么我给 `col` 加上了边框/背景色，但是两个 `col` 之间的 `gutter` 没有出现空白，而是连在一起的？**
- 栅格的 `gutter` 机制是在 `col` 内部使用 `padding` 来实现的。如果你直接给 `col` 加背景色，背景会填满包含 `padding` 在内的整个区域，所以看起来像连在一起。正确的做法是在 `col` 内部再放一个 `box`，给这个 `box` 加背景色。

**Q: `row` 里面可以直接放 `button` 或者 `input` 吗？**
- 严格来说，`row` 的子节点必须是 `col`。如果你直接放 `button`，它可能无法正确响应 `gutter` 的间距控制，甚至引起布局错乱。请务必遵守 `row -> col -> content` 的嵌套结构。

**Q: 既然有了 `flex` 组件，我还要用 `row/col` 栅格吗？**
- `flex` 适合用于内容撑开（一维）的局部对齐，比如几个按钮排成一排。
- `row/col` 适合需要严格划分比例（24 等分）的区域，比如把一个 1000px 宽的区域精确地分成 3:1。两者可以配合使用。

**Q: 如何让页面在手机和电脑上显示不同的列数？**
- 使用 `col` 的响应式断点属性。例如 `"xs": 24, "sm": 12, "lg": 8` 表示手机满宽、平板两列、桌面三列。无需写任何 CSS 媒体查询，栅格系统会自动处理。详见上方「响应式断点」章节。