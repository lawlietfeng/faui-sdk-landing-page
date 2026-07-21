# divider 分割线组件

`divider` 组件用于区隔内容的分割线，通常用于将不同章节的文本段落、表单区块或行内元素进行视觉上的分离。

## 适用场景

- **段落分割**：对不同章节的文本段落进行水平分割。
- **区块分割**：在复杂的表单或详情页中，划分不同的逻辑区块。
- **行内分割**：对行内文字或链接进行垂直分割，例如表格的操作列（编辑 | 删除）。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `string` | `horizontal` | 分割线的方向，可选 `horizontal`（水平）或 `vertical`（垂直） |
| `content` | `string` | - | 仅在水平分割线时有效，可以在分割线中间显示文字，支持表达式求值 |
| `align` | `string` | `center` | 当设置了 `content` 时，指定文字的位置，可选 `start`、`center` 或 `end` |

### direction（方向）

设置分割线的方向。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `horizontal` | 渲染一条水平的满宽分割线 | 页面区块、段落之间的上下分割 |
| `vertical` | 渲染一条垂直的短分割线 | 行内元素（如操作按钮、链接）之间的左右分割 |

```json
{
  "id": "divider-vertical",
  "component": "divider",
  "direction": "vertical"
}
```

### content（标题内容）

仅在水平分割线（`horizontal`）时有效，可以在分割线中间显示文字，起提示或小标题作用。该属性支持 `useExpression` 表达式求值。

```json
{
  "id": "divider-content",
  "component": "divider",
  "content": "以下为详细信息"
}
```

### align（标题位置）

当设置了 `content` 时，可以指定标题文字的对齐位置。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `start` | 文字偏向左侧 | 章节起点的标题引导 |
| `center` | 文字居中 | 居中对称的提示（默认） |
| `end` | 文字偏向右侧 | 尾部说明或备注 |

```json
{
  "id": "divider-align",
  "component": "divider",
  "content": "展开更多",
  "align": "start"
}
```

## 完整示例

### 基础水平与带文字分割线

```json
[
  {
    "id": "text-1",
    "component": "typography",
    "content": "这是第一段内容。"
  },
  {
    "id": "divider-basic",
    "component": "divider"
  },
  {
    "id": "text-2",
    "component": "typography",
    "content": "这是第二段内容。"
  },
  {
    "id": "divider-text",
    "component": "divider",
    "content": "高级选项",
    "align": "center",
    "style": {
      "margin": "24px 0",
      "borderColor": "#1890ff"
    }
  }
]
```

### 垂直分割线应用

垂直分割线通常需要和行内元素（如文本组件）配合使用。

```json
{
  "id": "actions-container",
  "component": "flex",
  "vertical": false,
  "align": "center",
  "gap": 8,
  "children": [
    {
      "id": "action-edit",
      "component": "typography",
      "content": "编辑",
      "style": { "color": "#1890ff", "cursor": "pointer" }
    },
    {
      "id": "divider-v",
      "component": "divider",
      "direction": "vertical"
    },
    {
      "id": "action-delete",
      "component": "typography",
      "content": "删除",
      "style": { "color": "#ff4d4f", "cursor": "pointer" }
    }
  ]
}
```

## 新手常见问题

**Q: 为什么垂直分割线（`direction: "vertical"`）没有显示出来？**
- 垂直分割线需要放在支持行内排列（inline）或 Flex 布局（`vertical: false`）的父容器中。如果外层是默认的块级布局，分割线可能会因为没有高度或独占一行而不可见。

**Q: 分割线上的文字不支持设置在正中间？**
- 默认就是居中（`center`）的。如果发现位置不对，请检查 `align` 属性是否被错误设置成了 `start` 或 `end`。

**Q: 如何改变分割线的颜色或粗细？**
- 可以通过全局的 `style` 属性覆盖。例如设置 `{"style": {"borderColor": "red", "borderWidth": "2px"}}` 来修改水平分割线的颜色和粗细。