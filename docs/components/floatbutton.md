# float_button 悬浮按钮组件

`float_button` 组件用于在页面固定位置（通常是右下角）提供全局的悬浮操作按钮。它支持基础悬浮按钮、展开式悬浮按钮组以及回到顶部功能。

## 适用场景

- **全局操作**：提供全局性的快捷操作，如“联系客服”、“发布内容”、“切换主题”。
- **回到顶部**：长页面中，提供快速滚动回页面顶部的捷径。
- **操作收纳**：当页面全局操作过多时，使用按钮组（`group`）将其收纳，点击或悬停时展开。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `string` | `default` | 悬浮按钮的变体，可选 `default`、`group`、`back-top` |
| `icon` | `string` | - | 按钮图标的名称（如 `QuestionCircleOutlined`），必须是 `@ant-design/icons` 中存在的图标名 |
| `description` | `string` | - | 按钮下方的描述文字，支持表达式求值 |
| `tooltip` | `string` | - | 鼠标悬浮时的提示文字，支持表达式求值 |
| `type` | `string` | `default` | 按钮类型，可选 `default`、`primary` |
| `shape` | `string` | `circle` | 按钮形状，可选 `circle`（圆形）、`square`（方形） |
| `badge` | `object` | - | 徽标数配置，如 `{"count": 5}` 或 `{"dot": true}` |
| `on_tap` | `ActionConfig[]` | - | 按钮点击时触发的动作 |

### variant（按钮变体）

控制悬浮按钮的整体形态与核心功能。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `default` | 渲染为一个普通的单个悬浮按钮 | 联系客服、发布文章 |
| `group` | 渲染为一个按钮组容器，点击/悬停可展开子按钮 | 全局设置菜单、多项快捷操作 |
| `back-top` | 渲染为回到顶部按钮 | 长列表页、文档页 |

```json
{
  "id": "fb-default",
  "component": "float_button",
  "variant": "default",
  "icon": "CustomerServiceOutlined",
  "type": "primary",
  "tooltip": "联系客服"
}
```

### icon（内置图标）

与普通组件通过子节点传入 `icon` 不同，`float_button` 的 `icon` 属性直接接收一个字符串。该字符串必须是 `@ant-design/icons` 库中真实的图标组件名称（例如 `SettingOutlined`、`PlusOutlined`）。

```json
{
  "id": "fb-icon",
  "component": "float_button",
  "icon": "PlusOutlined",
  "shape": "circle"
}
```

## Group 专有属性 (悬浮按钮组)

当 `variant` 配置为 `group` 时，该组件作为按钮组容器，需配置以下属性：

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `trigger` | `string` | `hover` | 展开菜单的触发方式，可选 `click` 或 `hover` |
| `items` | `object[]` | `[]` | 按钮组内的子按钮配置数组 |
| `open` | `boolean \| ValueBinding` | - | 控制按钮组是否展开，支持双向绑定 |
| `on_open_change` | `ActionConfig[]` | - | 展开状态变化时的回调，执行动作时会注入 `payload.open` |

### items（子按钮配置）

配置展开后的子按钮列表。数组中每个对象支持 `icon`、`description`、`tooltip`、`type`、`shape`、`badge`、`on_tap` 等基础属性。

```json
{
  "id": "fb-group",
  "component": "float_button",
  "variant": "group",
  "trigger": "click",
  "icon": "SettingOutlined",
  "tooltip": "页面设置",
  "items": [
    {
      "icon": "BulbOutlined",
      "tooltip": "切换主题",
      "on_tap": [
        {
          "action": "message",
          "payload": { "type": "success", "content": "主题已切换" }
        }
      ]
    },
    {
      "icon": "SyncOutlined",
      "tooltip": "刷新数据"
    }
  ]
}
```

## BackTop 专有属性 (回到顶部)

当 `variant` 配置为 `back-top` 时，组件提供回到页面顶部的功能：

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visibilityHeight` | `number` | `400` | 页面向下滚动多少像素后才显示此按钮 |

```json
{
  "id": "fb-backtop",
  "component": "float_button",
  "variant": "back-top",
  "icon": "ArrowUpOutlined",
  "tooltip": "回到顶部",
  "visibilityHeight": 200
}
```

## 完整示例

以下示例展示了如何在页面的右下角同时放置一个“联系客服”的按钮组和一个“回到顶部”按钮，并通过 `style` 控制它们的位置避免重叠。

```json
[
  {
    "id": "global-back-top",
    "component": "float_button",
    "variant": "back-top",
    "icon": "VerticalAlignTopOutlined",
    "tooltip": "回到顶部"
  },
  {
    "id": "global-service-group",
    "component": "float_button",
    "variant": "group",
    "trigger": "hover",
    "type": "primary",
    "icon": "CustomerServiceOutlined",
    "style": {
      "right": 94
    },
    "items": [
      {
        "icon": "MessageOutlined",
        "tooltip": "在线咨询",
        "on_tap": [
          {
            "action": "message",
            "payload": { "type": "info", "content": "正在连接人工客服..." }
          }
        ]
      },
      {
        "icon": "PhoneOutlined",
        "tooltip": "电话回拨"
      }
    ]
  }
]
```

## 新手常见问题

**Q: 为什么我配置了 `icon: "my-icon-id"` 却没有显示图标，控制台还报警告？**
- `float_button` 组件的 `icon` 属性机制比较特殊。它**不接受**你在其他地方定义的组件 ID，而是直接接收 Ant Design Icons 的原始组件名字符串（如 `SettingOutlined`）。引擎内部会自动从 `@ant-design/icons` 库中导入并渲染。

**Q: 为什么我点击 `group` 变体的悬浮按钮，它的 `on_tap` 动作没有触发？**
- 当 `variant: "group"` 时，主按钮的作用是展开或收起子按钮列表（由 `trigger` 属性控制）。此时主按钮本身的 `on_tap` 事件会被忽略。你需要把点击逻辑配置在 `items` 数组中各个子按钮的 `on_tap` 里。

**Q: 如何控制悬浮按钮在屏幕上的具体位置？**
- 默认情况下，按钮会固定在屏幕右下角（`right: 24px`, `bottom: 24px`）。如果页面上有多个独立的悬浮按钮，它们会重叠。你可以通过配置顶层的 `style` 属性来修改位置，例如设置 `{"style": {"right": 94}}` 将按钮向左平移。