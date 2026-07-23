# affix 组件

`affix` 组件用于将页面元素钉在可视范围。当页面滚动到一定位置时，原本随页面滚动的元素会固定在屏幕上。

## 适用场景

- **页面导航菜单**：长页面滚动时，保持侧边栏导航始终可见。
- **操作按钮组**：长表单底部的“保存”、“提交”按钮悬浮在屏幕底部。
- **重要提示信息**：需要始终展示在用户视野内的公告或提示。

## 核心属性

### 属性总览

| 属性名            | 类型                            | 默认值 | 说明                                                         |
| ----------------- | ------------------------------- | ------ | ------------------------------------------------------------ |
| `offsetTop`       | `number`                        | -      | 距离窗口顶部达到指定偏移量后触发固定状态。                     |
| `offsetBottom`    | `number`                        | -      | 距离窗口底部达到指定偏移量后触发固定状态。                     |
| `targetSelector`  | `string`                        | -      | 监听滚动事件的元素选择器（如 `#container`）。不填则监听 window。 |
| `on_change`       | `Action`                        | -      | 固钉状态改变时触发的回调，自动注入 `${payload.affixed}`。      |

---

### offsetTop（距离窗口顶部偏移量）

数值类型，单位为像素（px）。控制当元素距离滚动容器顶部达到指定偏移量后触发固定状态。

```json
{
  "id": "affix-top",
  "component": "affix",
  "offsetTop": 10,
  "children": ["nav-menu"]
}
```

### offsetBottom（距离窗口底部偏移量）

数值类型，单位为像素（px）。控制当元素距离滚动容器底部达到指定偏移量后触发固定状态。

```json
{
  "id": "affix-bottom",
  "component": "affix",
  "offsetBottom": 20,
  "children": ["submit-button"]
}
```

### targetSelector（滚动容器选择器）

字符串类型，支持表达式。设置 Affix 需要监听其滚动事件的元素的 CSS 选择器（如 `#scroll-container` 或 `.my-layout`）。默认监听整个 Window 的滚动。

```json
{
  "id": "affix-in-box",
  "component": "affix",
  "targetSelector": ".my-scroll-box",
  "offsetTop": 0,
  "children": ["action-btn"]
}
```

### on_change（固钉状态改变事件）

当固钉状态发生改变时触发的动作。动作的 `payload` 中会自动注入 `affixed`（布尔值），表示当前是否处于固定状态。

```json
{
  "id": "affix-top",
  "component": "affix",
  "offsetTop": 10,
  "on_change": [
    {
      "action": "update_data",
      "path": "/isAffixed",
      "value": "${payload.affixed}"
    }
  ],
  "children": ["nav-menu"]
}
```

## children（子组件）

`children` 是一个字符串数组，包含需要被固定的组件的 `id`。

```json
{
  "id": "affix-container",
  "component": "affix",
  "offsetTop": 0,
  "children": ["header-box", "search-input"]
}
```

## 完整示例

以下示例展示了如何在一个带有滚动条的容器内部固定一个按钮。

```json
[
  {
    "id": "scrollable-container",
    "component": "box",
    "className": "my-scroll-box",
    "style": {
      "height": "200px",
      "overflowY": "scroll",
      "border": "1px solid #ccc"
    },
    "children": ["affix-wrapper", "long-content"]
  },
  {
    "id": "affix-wrapper",
    "component": "affix",
    "targetSelector": ".my-scroll-box",
    "offsetTop": 0,
    "children": ["fixed-btn"]
  },
  {
    "id": "fixed-btn",
    "component": "button",
    "label": "我是固定按钮"
  },
  {
    "id": "long-content",
    "component": "box",
    "style": {
      "height": "800px",
      "background": "linear-gradient(#f5f5f5, #ddd)"
    },
    "children": []
  }
]
```

## 新手常见问题

**Q: 为什么设置了 targetSelector 却没有生效？**
- 请检查 `targetSelector` 对应的 DOM 节点是否确实产生了滚动条（例如是否设置了 `overflow: scroll` 或 `overflow: auto` 以及明确的高度）。
- 确保传入的选择器能正确匹配到目标容器，例如使用了正确的 `.class` 或 `#id`。

**Q: 固钉元素被其他元素遮挡了怎么办？**
- 这通常是 `z-index` 层级问题。可以通过 `style` 属性为 `affix` 组件或其包裹的子组件增加更高的 `z-index`，例如 `{ "zIndex": 999 }`。

**Q: 为什么内容宽度在固定后变了？**
- 脱离文档流后，元素的宽度可能会根据其内容重新计算。可以在子组件的 `style` 中明确指定 `width` 来保持宽度一致。
