# tooltip 组件

简单的文字提示气泡框，当鼠标悬停、点击或聚焦在目标元素上时，在其附近显示一段说明性的文字。

## 适用场景

- **名词解释**：对于专业术语或图标按钮提供辅助性的文字说明。
- **状态说明**：提示当前元素不可用的原因或进一步的操作指引。
- **空间受限**：当页面空间不足以显示完整的文本时，使用 Tooltip 提供完整信息的悬浮查看。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（tooltip）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `title` |  | `expression` | 组件显示的文本内容。 |  |
| `placement` |  | 静态值 |  |  |
| `trigger` |  | 静态值 |  |  |
| `open` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `on_open_change` |  | 静态值 |  |  |
| `arrow` |  | 静态值 |  |  |
| `color` |  | 静态值 |  |  |
| `children` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 控制组件是否渲染。 |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`trigger-component-ids`
- 事件：`on_open_change`
- dataModel 绑定：无
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

### placement（弹出位置）

支持 12 个方位的弹出位置配置，支持表达式：

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `'top'`, `'bottom'`, `'left'`, `'right'` | 在目标元素的正上方/下方/左方/右方居中弹出 | 最常用的基础定位 |
| `'topLeft'`, `'topRight'`, `'bottomLeft'` 等 | 在目标元素的对应方位，并与边缘对齐 | 适合目标元素较宽或较高时的边缘对齐排版 |

```json
{
  "id": "tooltip_placement",
  "type": "element",
  "config": {
    "component": "tooltip",
    "title": "位于右侧的提示文字",
    "placement": "right",
    "children": ["target_button"]
  }
}
```

### trigger（触发行为）

控制用户通过何种交互来显示提示框，支持表达式：

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `'hover'` | 鼠标悬停时显示，移开时隐藏 | 默认行为，适合桌面端的辅助说明 |
| `'click'` | 点击时显示，再次点击或点击空白处隐藏 | 适合移动端或需要较长驻留时间阅读的说明 |
| `'focus'` | 元素获得焦点时显示，失去焦点时隐藏 | 适合输入框的输入提示 |

```json
{
  "id": "tooltip_trigger",
  "type": "element",
  "config": {
    "component": "tooltip",
    "title": "点击才能看到我",
    "trigger": "click",
    "children": ["target_button"]
  }
}
```

### color（自定义颜色）

可以通过配置 `color` 改变气泡框的背景颜色，支持预设的主题色（如 `blue`, `red`, `green`, `orange` 等）或者十六进制色值（如 `#f50`）。

```json
{
  "id": "tooltip_color",
  "type": "element",
  "config": {
    "component": "tooltip",
    "title": "这是一条警告提示",
    "color": "red",
    "children": ["target_button"]
  }
}
```

## 受控与双向绑定 (open & on_open_change)

你可以通过 `open` 属性将气泡框的显示状态绑定到全局数据中，引擎提供了完善的 fallback 回写机制。

1. **自动回写**：只要配置了 `open: { "path": "/isOpen" }`，当气泡显示/隐藏时，引擎会自动执行 `update_data` 将布尔值写回该路径。
2. **自定义动作**：如果你配置了 `on_open_change`，引擎将执行你的自定义动作流。在动作流中，你可以通过 `${$value}` 获取最新的布尔状态。

```json
{
  "id": "controlled_tooltip",
  "type": "element",
  "config": {
    "component": "tooltip",
    "title": "受控的气泡框",
    "open": {
      "path": "/tooltipState"
    },
    "children": ["target_button"]
  }
}
```

## 完整示例

一个完整的包含插值表达式、自定义颜色和点击触发的 Tooltip 配置：

```json
[
  {
    "id": "tooltip_demo",
    "type": "element",
    "config": {
      "component": "tooltip",
      "title": "${/userName}，欢迎回来！",
      "placement": "bottomRight",
      "trigger": "click",
      "color": "blue",
      "children": ["user_avatar"]
    }
  },
  {
    "id": "user_avatar",
    "type": "element",
    "config": {
      "component": "avatar",
      "text": "${/userName}"
    }
  }
]
```

## 新手常见问题

**Q: 为什么 Tooltip 没有弹出来？**
- 检查 `title` 属性是否为空。如果 `title` 为空或 undefined，Tooltip 默认不会显示。
- 检查被包裹的子组件（`children` 中的组件）是否是禁用的状态（如 `disabled: true` 的按钮）。如果子元素被禁用，它将无法响应 `hover` 或 `click` 事件，导致 Tooltip 无法触发。

**Q: 如何让禁用的按钮也能触发 Tooltip？**
- 引擎已经自动在 Tooltip 的 `children` 外部包裹了一层 `<span style="display: inline-block;">`。通常情况下，这足以让被禁用的按钮也能触发 Tooltip。如果仍然无法触发，建议将被禁用的按钮放入一个普通的 `box` 容器中，并将该 `box` 作为 Tooltip 的 `children`。

**Q: Tooltip 的内容支持渲染复杂的组件结构吗？**
- 不支持。`tooltip` 的 `title` 属性仅支持纯文本（可使用 `${}` 插值）。如果你需要在气泡框内渲染按钮、表格等复杂的组件结构，请改用 `popover`（气泡卡片）组件。