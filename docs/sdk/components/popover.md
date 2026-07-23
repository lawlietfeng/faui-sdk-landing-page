# popover 组件

`popover`（气泡卡片）组件用于点击或鼠标移入元素时，弹出一个气泡式的卡片浮层。它与 `tooltip` 类似，但提供了更广阔的空间来承载复杂的卡片内容。

## 适用场景

- **补充说明**：为按钮或图标提供带有标题和较长描述文本的说明。
- **轻量级承载**：作为轻量的容器，容纳简单的内容展示，而无需打开完整的弹窗。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | - | 卡片标题，支持插值表达式 |
| `content` | `string` | - | 卡片正文内容，支持插值表达式 |
| `placement` | `string` | `'top'` | 气泡框相对于触发元素的弹出位置 |
| `trigger` | `string \| string[]` | `'hover'` | 触发行为，支持插值表达式 |
| `open` | `boolean \| ValueBinding` | - | 是否受控显示气泡卡片，支持双向绑定 |
| `arrow` | `boolean \| string` | `true` | 是否显示指向触发元素的箭头 |
| `children` | `string[]` | - | 必须配置子节点（通常为 `button` 或 `icon` 等），作为触发卡片的锚点 |

### title & content（标题与内容）

定义气泡卡片的文本信息。

```json
{
  "component": "popover",
  "id": "popover-info",
  "title": "版本更新提示",
  "content": "当前使用的是 V2.0 版本，已修复之前的所有已知问题。",
  "children": ["info-icon"]
}
```

### placement（弹出位置）

控制气泡框弹出的方向。支持 12 个方位，如 `top`、`left`、`right`、`bottom`，以及带侧边的 `topLeft`、`bottomRight` 等。

```json
{
  "component": "popover",
  "id": "popover-placement",
  "title": "左侧提示",
  "content": "我将会在目标元素的左侧显示",
  "placement": "left",
  "children": ["target-btn"]
}
```

### trigger（触发行为）

控制卡片的触发方式，默认为鼠标悬停（`hover`）。支持设置为 `click`（点击）或 `focus`（聚焦）。

```json
{
  "component": "popover",
  "id": "popover-trigger",
  "title": "点击触发",
  "content": "只有点击按钮时才会显示此卡片",
  "trigger": "click",
  "children": ["click-btn"]
}
```

## 数据绑定与受控机制

### open（显隐状态受控）

你可以将 `open` 属性绑定到全局状态，实现气泡卡片的受控显示。

1. **自动回写**：当用户通过 `trigger` 行为（如点击外部关闭）改变卡片的显隐状态时，引擎会自动执行 `update_data`，将最新状态写回 `open.path` 指定的路径。
2. **自定义回调**：如果配置了 `on_open_change`，在状态改变时会额外触发该动作序列。

```json
{
  "component": "popover",
  "id": "popover-controlled",
  "title": "受控卡片",
  "content": "我的显隐状态被全局变量控制",
  "open": {
    "path": "/ui/showPopover"
  },
  "on_open_change": [
    {
      "action": "console_log",
      "payload": {
        "content": "Popover 状态已改变"
      }
    }
  ],
  "children": ["toggle-btn"]
}
```

## 完整示例

这是一个包含了多方位弹出与点击触发的组合示例：

```json
{
  "component": "popover",
  "id": "popover-complex",
  "title": "用户 ${$root.currentUser.name} 详情",
  "content": "角色：管理员\n上次登录：2023-10-01",
  "trigger": "click",
  "placement": "bottomRight",
  "arrow": false,
  "children": ["avatar-component"]
}
```

## 新手常见问题

**Q: 为什么我配置了 `popover`，但是页面上没有内容显示，或者悬停没有反应？**
- `popover` 必须配置 `children` 作为触发的锚点。请检查你的 `children` 数组是否包含了有效的组件 ID。如果 `children` 对应的组件不存在，或者为空，卡片将无法挂载触发事件。

**Q: 气泡卡片的宽度太窄或太宽，怎么调整？**
- 目前 `title` 和 `content` 主要是纯文本。如果你需要修改气泡框的内部样式，可以通过外层全局 CSS 或者通过在内容中适当添加换行（取决于渲染器的实现）来调整。

**Q: 我把纯文本组件放在 `children` 里，为什么移入不触发气泡？**
- 引擎已经自动在子组件外部包裹了 `<span style="display: inline-block;">` 以确保事件能够正常绑定。但如果子组件本身被设置了 `pointer-events: none` 或者是被禁用的表单控件（如 `disabled: true` 的按钮），鼠标事件依然会被忽略，从而导致卡片无法触发。对于被禁用的组件，建议在其外部再包一层普通的 `box` 或 `text` 作为触发器。
