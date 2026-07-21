# space 组件

`space` 是间距组件，用于为一组相邻的子组件设置统一的间距和对齐方式。相比于复杂的 `flex` 或 `box` 布局，`space` 更加轻量，专为统一设置子元素间距而生。

## 适用场景

- **按钮组**：将多个操作按钮按水平或垂直方向排列并保持统一间距。
- **表单项排列**：在同一行内放置多个表单项或展示项。
- **简单列表**：快速垂直排列一系列卡片或文本段落。

## 核心属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| direction | `string` | `"horizontal"` | 间距方向，支持 `"horizontal" \| "vertical"`（支持 `useExpression` 插值） |
| size | `string \| number \| [number, number]` | `"small"` | 间距大小（支持 `useExpression` 插值） |
| align | `string` | - | 交叉轴对齐方式（支持 `useExpression` 插值） |
| wrap | `boolean \| string` | `false` | 是否自动换行，仅在水平方向有效（支持 `useExpression` 插值） |
| split | `string` | - | 设置分隔符，目前仅支持 `"divider"`（支持 `useExpression` 插值） |
| children | `string[]` | `[]` | 子组件 ID 列表 |

### direction（排列方向）

控制子组件是水平排列还是垂直排列。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"horizontal"` | 水平排列 | 按钮组、同一行的多个标签 |
| `"vertical"` | 垂直排列 | 纵向列表、表单项堆叠 |

```json
{
  "id": "action-space",
  "component": "space",
  "direction": "vertical",
  "children": ["btn-1", "btn-2"]
}
```

### size（间距大小）

统一控制子组件之间的间距。可以是内置的枚举值、具体的像素值，或者包含水平和垂直间距的数组。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"small"` | 8px 间距 | 紧凑布局 |
| `"middle"` | 16px 间距 | 常规布局 |
| `"large"` | 24px 间距 | 宽松布局 |
| `number` | 自定义像素值 | 需要精确控制间距的场景，如 `12` |
| `[number, number]` | `[水平间距, 垂直间距]` | 折行时控制行距与列距，如 `[8, 16]` |

```json
{
  "id": "action-space",
  "component": "space",
  "size": "large",
  "children": ["btn-1", "btn-2"]
}
```

### align（对齐方式）

控制子组件在交叉轴（垂直于 `direction` 的方向）上的对齐方式。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"start"` | 顶部/左侧对齐 | 元素高度/宽度不一时向上/向左对齐 |
| `"center"` | 居中对齐 | 水平排列时使内容垂直居中 |
| `"end"` | 底部/右侧对齐 | 元素高度/宽度不一时向下/向右对齐 |
| `"baseline"` | 基线对齐 | 包含文本的元素使文字基线对齐 |

```json
{
  "id": "action-space",
  "component": "space",
  "align": "center",
  "children": ["icon", "text"]
}
```

### wrap（自动换行）

在 `direction="horizontal"` 时，如果容器宽度不足，子组件是否自动换行。

```json
{
  "id": "tags-space",
  "component": "space",
  "wrap": true,
  "size": [8, 16],
  "children": ["tag-1", "tag-2", "tag-3", "tag-4", "tag-5"]
}
```

### split（分隔符）

在子组件之间插入分隔符。目前仅支持配置为 `"divider"`，它会根据 `direction` 自动插入垂直或水平的分割线。

```json
{
  "id": "links-space",
  "component": "space",
  "split": "divider",
  "children": ["link-1", "link-2", "link-3"]
}
```

## 完整示例

### 水平按钮组（带分割线）

```json
[
  {
    "id": "action-bar",
    "component": "space",
    "direction": "horizontal",
    "size": "middle",
    "split": "divider",
    "children": ["btn-edit", "btn-delete", "btn-more"]
  },
  {
    "id": "btn-edit",
    "component": "button",
    "type": "link",
    "label": "编辑"
  },
  {
    "id": "btn-delete",
    "component": "button",
    "type": "link",
    "danger": true,
    "label": "删除"
  },
  {
    "id": "btn-more",
    "component": "button",
    "type": "link",
    "label": "更多"
  }
]
```

### 垂直表单项堆叠

```json
[
  {
    "id": "form-items",
    "component": "space",
    "direction": "vertical",
    "size": 24,
    "children": ["input-name", "input-age"]
  },
  {
    "id": "input-name",
    "component": "input",
    "placeholder": "请输入姓名"
  },
  {
    "id": "input-age",
    "component": "inputnumber",
    "placeholder": "请输入年龄"
  }
]
```

## 新手常见问题

**Q: `space` 和 `flex` / `box` 布局组件有什么区别？我该用哪一个？**
- `space` 主要用于**间距控制**，它会自动为内部的每一个子元素之间加上均匀的间距（Gap），无需为每个子元素单独写 margin，最适合用来排布一组按钮、图标或标签。
- `flex` 和 `box` 更适合做**整体页面布局**，它们支持更多复杂的 CSS 布局属性（如 `justify-content: space-between`、`flex-grow` 等）。如果只是为了让几个按钮有间距，首选 `space`。

**Q: `space` 组件的子元素会填满整个容器宽度吗？**
- 不会。`space` 默认是 `inline-flex` 的行为，宽度由其内容撑开。如果需要子元素占满宽度，可以考虑给 `space` 加上 `style: { "width": "100%" }`，或者改用 `flex` / `box`。

**Q: 为什么我设置了 `wrap: true`，但是没有生效？**
- `wrap` 仅在 `direction="horizontal"`（水平排列）时有意义。
- 确保外层容器的宽度是有限的（例如定宽或 `100%`），如果外层容器允许无限滚动，子元素就不会触发换行。

**Q: 我可以使用除了 `divider` 以外的自定义分隔符吗？**
- 目前 FAUI 的 `space` 仅实现了 `split: "divider"`。如果需要复杂的自定义分隔符，建议改用 `box` 组件，并在 `children` 数组中手动插入你的分隔符组件。
