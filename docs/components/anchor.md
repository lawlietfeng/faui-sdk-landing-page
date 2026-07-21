# anchor 组件

`anchor` 组件用于展示页面目录，提供点击跳转到页面指定位置的功能，并能根据滚动状态自动高亮当前所在的区域。

## 适用场景

- **长文档目录**：在长篇说明文档侧边栏展示目录结构，方便用户快速定位。
- **页面区块导航**：将长表单或长详情页划分为多个区块，通过顶部或侧边锚点快速切换。
- **滚动高亮**：用户阅读到某个区块时，锚点菜单自动跟随高亮对应的节点。

## 核心属性

### 属性总览

| 属性名           | 类型                                  | 默认值       | 说明                                                         |
| ---------------- | ------------------------------------- | ------------ | ------------------------------------------------------------ |
| `items`          | `AnchorItemConfig[]` (支持表达式)     | -            | 锚点数据项配置，包含 key、href、title 等。                     |
| `offsetTop`      | `number`                              | -            | 固定模式下，距离窗口顶部达到指定偏移量后触发固定。             |
| `direction`      | `'vertical' \| 'horizontal'`          | `'vertical'` | 导航锚点的排列方向。                                         |
| `affix`          | `boolean`                             | `true`       | 是否固定模式。                                               |
| `showInkInFixed` | `boolean`                             | `true`       | 固定模式下是否显示左侧小圆点指示器。                           |
| `replace`        | `boolean`                             | `true`       | 滚动到目标容器时是否展示动画。                               |
| `targetSelector` | `string`                              | -            | 监听滚动事件的元素选择器（如 `.my-scroll-container`）。        |
| `on_click`       | `Action \| Action[]`                  | -            | 点击锚点项触发的回调，注入 `${payload.href}`/`${payload.title}`。|
| `on_change`      | `Action`                              | -            | 监听锚点链接改变的回调，注入 `${payload.currentLink}`。        |

---

### items（锚点数据项）

数组类型，支持表达式（可使用 `${}` 动态获取数组）。定义锚点菜单的结构。每项配置包含 `key`、`href`、`title` 等属性。

```json
{
  "id": "my-anchor",
  "component": "anchor",
  "items": [
    { "key": "part-1", "href": "#part-1", "title": "第一部分" },
    { 
      "key": "part-2", 
      "href": "#part-2", 
      "title": "第二部分",
      "children": [
        { "key": "part-2-1", "href": "#part-2-1", "title": "子章节" }
      ]
    }
  ]
}
```

**AnchorItemConfig 属性说明**：
| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 唯一标识 |
| `href` | `string` | 锚点链接，必须与目标容器的 `domId` 对应，并加上 `#`，如 `#part-1` |
| `title` | `string` | 锚点标题显示的文本 |
| `target` | `string` | 指定跳转目标，如 `_blank`（较少使用） |
| `children` | `array` | 嵌套的子锚点数据 |

### direction（导航锚点方向）

字符串枚举。控制锚点菜单是垂直排列还是水平排列。

| 值 | 效果 | 典型用途 |
|---|------|---------|
| `vertical`（默认） | 垂直排列 | 侧边栏目录 |
| `horizontal` | 水平排列 | 页面顶部导航条 |

```json
{
  "id": "horizontal-anchor",
  "component": "anchor",
  "direction": "horizontal",
  "items": [
    { "key": "a", "href": "#section-a", "title": "A 区块" },
    { "key": "b", "href": "#section-b", "title": "B 区块" }
  ]
}
```

> 💡 **提示**：当 `direction` 为 `horizontal` 时，引擎会自动忽略 `items` 中的 `children` 嵌套，水平模式下不支持多级菜单。

### affix（是否固定模式）

布尔值。设置为 `true`（默认）时，组件表现类似 `affix`，在滚动时始终固定在视口中。

```json
{
  "id": "non-fixed-anchor",
  "component": "anchor",
  "affix": false,
  "items": [
    { "key": "a", "href": "#a", "title": "标题A" }
  ]
}
```

### targetSelector（滚动容器选择器）

字符串类型，支持表达式。设置 Anchor 需要监听其滚动事件的元素的 CSS 选择器（如 `.my-scroll-box`）。如果不传，默认监听整个 Window 窗口的滚动。

```json
{
  "id": "anchor-in-box",
  "component": "anchor",
  "targetSelector": ".my-scroll-box",
  "items": [
    { "key": "1", "href": "#sec-1", "title": "Section 1" }
  ]
}
```

### on_click / on_change（交互事件）

- **`on_click`**：点击锚点项时触发，`payload` 自动注入 `href` (链接) 和 `title` (标题)。
- **`on_change`**：页面滚动导致锚点链接改变时触发，`payload` 自动注入 `currentLink` (当前高亮的链接)。

```json
{
  "id": "event-anchor",
  "component": "anchor",
  "items": [{ "key": "1", "href": "#sec-1", "title": "Section 1" }],
  "on_change": {
    "action": "update_data",
    "path": "/currentAnchor",
    "value": "${payload.currentLink}"
  }
}
```

## 完整示例

以下示例展示了一个水平方向的锚点，点击后跳转到下方的 `box` 容器。

```json
[
  {
    "id": "anchor-nav",
    "component": "anchor",
    "direction": "horizontal",
    "affix": true,
    "items": [
      { "key": "base", "href": "#base-info", "title": "基本信息" },
      { "key": "detail", "href": "#detail-info", "title": "详细信息" }
    ]
  },
  {
    "id": "base-section",
    "component": "box",
    "domId": "base-info",
    "style": { "height": "500px", "padding": "20px", "background": "#f0f2f5" },
    "children": []
  },
  {
    "id": "detail-section",
    "component": "box",
    "domId": "detail-info",
    "style": { "height": "800px", "padding": "20px", "background": "#e6f7ff" },
    "children": []
  }
]
```

## 新手常见问题

**Q: 为什么点击锚点不跳转，或者滚动页面时锚点不高亮？**
- 检查目标容器组件是否正确配置了 `domId`。
- `items` 中的 `href` 必须以 `#` 开头，且内容与目标组件的 `domId` 严格一致（如 `href: "#base-info"` 对应 `domId: "base-info"`）。
- 如果目标容器是在某个带有滚动条的 `box` 内部，而不是页面级滚动，必须配置 `targetSelector` 指向那个滚动的容器。

**Q: 为什么设置了 domId 还是跳转不准？**
- **重要限制**：不支持将 `domId` 直接设置在 `typography`、`text` 等行内组件上。文字组件的高度或行内特性会导致滚动计算失效。
- **解决方案**：必须将 `domId` 设置在包裹文字的外层块级容器（如 `box`、`flex`、`layout`）上。

**Q: 水平模式下为什么子菜单没有渲染出来？**
- Ant Design 及其底层实现不支持在水平方向展示多级嵌套锚点。FAUI 引擎为了防止渲染崩溃，会在 `direction: "horizontal"` 时自动过滤掉所有 `children`。如果需要水平锚点，请保持单层级。
