# flex 弹性布局组件

`flex` 组件是一个专为一维布局设计的容器组件，它在原生 CSS Flexbox 的基础上进行了高度封装。相较于底层的 `box` 组件，`flex` 提供了更直观的属性来控制子元素的排列方向、间距和对齐方式，是构建大多数表单、工具栏和列表项的首选容器。

## 适用场景

- **水平工具栏**：将一组按钮、搜索框等元素在同一行水平排列，并控制它们之间的间距（`gap`）。
- **垂直表单组**：将一系列表单项从上到下垂直排列。
- **居中对齐**：快速实现子元素在容器内的水平和垂直居中。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `vertical` | `boolean` | `false` | 主轴是否为垂直方向（相当于 `flex-direction: column`） |
| `gap` | `number \| string` | - | 子元素之间的间隙大小 |
| `align` | `string` | - | 交叉轴（副轴）上的对齐方式 |
| `justify` | `string` | - | 主轴上的对齐方式 |
| `wrap` | `boolean \| string` | `false` | 子元素超出容器时是否换行 |
| `flex` | `number \| string` | - | 当作为其他弹性容器的子节点时，自身分配空间的比例 |

### vertical（排列方向）

控制子元素是水平排列还是垂直排列。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `false` | 水平从左到右排列（默认） | 顶部导航栏、操作按钮组 |
| `true` | 垂直从上到下排列 | 侧边栏菜单、垂直表单项 |

```json
{
  "id": "flex-vertical",
  "component": "flex",
  "vertical": true,
  "children": ["title-text", "desc-text"]
}
```

### gap（间隙）

设置子元素之间的间距。
支持直接传入数字（如 `16` 表示 16px）或内置预设的字符串（`small` = 8px, `middle` = 16px, `large` = 24px）。

```json
{
  "id": "flex-gap",
  "component": "flex",
  "gap": 16,
  "children": ["btn-cancel", "btn-submit"]
}
```

### align（交叉轴对齐）

控制子元素在**交叉轴**（如果 `vertical: false`，则交叉轴为垂直方向）上的对齐方式。
常用的值有：`flex-start`（起点对齐）、`center`（居中对齐）、`flex-end`（终点对齐）、`stretch`（拉伸填满）。

```json
{
  "id": "flex-align-center",
  "component": "flex",
  "align": "center",
  "children": ["icon-logo", "text-title"]
}
```

### justify（主轴对齐）

控制子元素在**主轴**（如果 `vertical: false`，则主轴为水平方向）上的分布方式。
常用的值有：`flex-start`（起点对齐）、`center`（居中对齐）、`flex-end`（终点对齐）、`space-between`（两端对齐，项目之间的间隔都相等）、`space-around`（每个项目两侧的间隔相等）。

```json
{
  "id": "flex-justify-between",
  "component": "flex",
  "justify": "space-between",
  "children": ["left-content", "right-actions"]
}
```

### wrap（换行）

当子元素的总宽度/高度超过容器时，是否允许换行。
支持传入布尔值 `true`/`false`，或 CSS 属性值 `'wrap'`/`'nowrap'`。

```json
{
  "id": "flex-wrap",
  "component": "flex",
  "wrap": true,
  "gap": 8,
  "children": ["tag-1", "tag-2", "tag-3", "tag-4", "tag-5"]
}
```

## 完整示例

以下示例展示了一个典型的顶部操作栏布局，左侧是页面标题，右侧是操作按钮组，两者分别靠在容器两端，并且所有元素垂直居中。

```json
[
  {
    "id": "page-header",
    "component": "flex",
    "vertical": false,
    "justify": "space-between",
    "align": "center",
    "style": {
      "padding": "16px 24px",
      "backgroundColor": "#fff",
      "borderBottom": "1px solid #f0f0f0"
    },
    "children": [
      "header-title",
      "header-actions"
    ]
  },
  {
    "id": "header-title",
    "component": "typography",
    "variant": "title",
    "level": 4,
    "content": "用户管理",
    "style": { "margin": 0 }
  },
  {
    "id": "header-actions",
    "component": "flex",
    "gap": 12,
    "children": [
      "btn-import",
      "btn-add"
    ]
  },
  {
    "id": "btn-import",
    "component": "button",
    "content": "批量导入"
  },
  {
    "id": "btn-add",
    "component": "button",
    "content": "新建用户",
    "type": "primary"
  }
]
```

## 新手常见问题

**Q: 为什么我设置了 `justify: "center"`，但是内容并没有居中？**
- `flex` 容器默认的宽度是其内容撑开的宽度。如果父容器没有给 `flex` 分配足够的宽度，`flex` 自身的宽度就等于内容的宽度，此时居中对齐看起来就没有效果。解决办法是给 `flex` 加上 `{"style": {"width": "100%"}}` 或者使其成为另一个 flex 布局中占满剩余空间的子节点。

**Q: `flex` 属性是干什么用的？**
- `flex` 属性（对应 CSS 的 `flex` 简写属性，如 `flex: 1`）通常用在这个 `flex` 组件**本身作为另一个弹性容器的子节点**时，用来指定它占据父容器剩余空间的比例。例如左右两栏布局，左侧宽度固定，右侧设置 `"flex": 1` 即可占满剩余宽度。

**Q: `flex` 和 `box` 组件有什么区别？应该用哪个？**
- `box` 对应原生的 `<div>` 标签，适用于需要完全自定义 CSS 的场景；`flex` 是封装好的弹性布局容器。**推荐优先使用 `flex`**，因为它提供了更直观的 `gap`、`align`、`justify` 等属性，代码可读性更好，能满足 90% 的页面布局需求。