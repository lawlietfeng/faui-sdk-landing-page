# tour 组件

漫游导览组件，用于在新功能上线或新手引导时，分步骤引导用户了解产品的各项功能。

## 适用场景

- **新用户引导**：当用户首次进入复杂系统时，一步步引导其熟悉核心功能位置。
- **新功能发布**：在系统界面中突出展示并介绍新上线的特性。
- **复杂表单指引**：在包含大量专业字段的页面中，为用户提供渐进式的填表指导。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `steps` | `TourStepConfig[] \| string` | `[]` | **必填**，导览的各个步骤配置数组，支持插值表达式 |
| `open` | `boolean \| string \| ValueBinding` | `false` | 控制导览是否弹出，支持表达式和双向绑定回写 |
| `current` | `ValueBinding` | - | 绑定当前处于第几步（从 `0` 开始），必须通过 `path` 绑定 |
| `type` | `string` | `'default'` | 导览卡片的样式类型，可选 `'default'` 或 `'primary'`，支持表达式 |
| `placement` | `string` | `'bottom'` | 全局弹层位置（当 `steps` 未指定时生效），支持表达式 |
| `mask` | `boolean \| object \| string` | `true` | 是否启用遮罩，或配置遮罩样式，支持表达式 |
| `arrow` | `boolean \| object \| string` | `true` | 是否显示指向目标元素的箭头，支持表达式 |
| `zIndex` | `number \| string` | `1001` | 弹层的 z-index 优先级，支持表达式 |

### steps（步骤配置）

配置导览的每一步内容与指向的目标。

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 该步骤的标题 |
| `description` | `string` | 该步骤的详细描述文字 |
| `target` | `string` | **关键**，目标元素的 CSS 选择器（如 `"#my-button"` 或 `".my-class"`） |
| `placement` | `string` | 该步骤特定的气泡弹出位置 |
| `cover` | `string` | 封面的图片 URL，如果有则会在导览卡片顶部渲染为图片 |

**注意**：`target` 必须填写页面中实际存在的 CSS 选择器。如果目标是 FAUI 渲染的组件，可以通过给组件配置特定的 `className` 或将其包裹在一个带有唯一 `id` 的 `box` 中，供选择器定位。

```json
{
  "id": "tour_demo",
  "type": "element",
  "config": {
    "component": "tour",
    "open": { "path": "/tour/open" },
    "current": { "path": "/tour/current" },
    "steps": [
      {
        "title": "创建项目",
        "description": "点击这里可以快速创建一个新项目。",
        "target": "#create-btn",
        "placement": "bottom"
      },
      {
        "title": "项目列表",
        "description": "您创建的所有项目都会在这里展示。",
        "target": ".project-list-container",
        "placement": "right"
      }
    ]
  }
}
```

### type 与 mask（样式控制）

通过 `type: "primary"` 可以让导览卡片呈现品牌色的背景，更加醒目。`mask` 则用于控制背景遮罩，突出当前步骤的目标元素。

```json
{
  "id": "tour_style",
  "type": "element",
  "config": {
    "component": "tour",
    "open": true,
    "type": "primary",
    "mask": {
      "color": "rgba(0, 0, 0, 0.6)"
    },
    "steps": [
      {
        "title": "高亮步骤",
        "description": "通过遮罩和 primary 样式，让引导更聚焦。",
        "target": "#highlight-area"
      }
    ]
  }
}
```

## 受控与双向绑定 (open & current)

`tour` 组件的交互完全依赖于全局状态的驱动。引擎内置了双向绑定和 fallback 机制：

1. **显隐控制 (`open`)**：当用户点击导览卡片上的“关闭”按钮或遮罩层时，引擎会自动执行 `update_data`，将 `open.path` 绑定的路径值设为 `false`。
2. **步骤切换 (`current`)**：当用户点击“上一步”或“下一步”时，引擎会自动执行 `update_data`，更新 `current.path` 绑定的步数索引（如 `0`, `1`, `2`）。

如果你需要拦截这些默认行为或追加其他逻辑，可以显式配置 `on_close` 和 `on_change`：
- 配置 `on_close` 后，默认的关闭回写会被覆盖，你必须在动作流中自行配置 `update_data`。
- 配置 `on_change` 后，默认的步数回写会被覆盖，你必须在动作流中自行配置 `update_data`。可通过 `${$value}` 引用当前步数索引。如果 on_change 中未设置 `value` 字段，组件会自动注入当前值；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。

```json
{
  "id": "tour_with_callbacks",
  "type": "element",
  "config": {
    "component": "tour",
    "open": { "path": "/tour/open" },
    "current": { "path": "/tour/current" },
    "steps": [
      { "title": "第一步", "target": "#step1" },
      { "title": "第二步", "target": "#step2" }
    ],
    "on_close": {
      "action": "update_data",
      "payload": { "path": "/tour/open", "value": false }
    }
  }
}
```

## 完整示例

结合按钮触发、遮罩、多个步骤与双向绑定的完整新手引导：

```json
[
  {
    "id": "root_container",
    "type": "element",
    "config": {
      "component": "box",
      "children": ["start_btn", "feature_area_1", "feature_area_2", "system_tour"]
    }
  },
  {
    "id": "start_btn",
    "type": "element",
    "config": {
      "component": "button",
      "label": "开始新手引导",
      "on_tap": [
        { "action": "update_data", "payload": { "path": "/tour/open", "value": true } },
        { "action": "update_data", "payload": { "path": "/tour/current", "value": 0 } }
      ]
    }
  },
  {
    "id": "feature_area_1",
    "type": "element",
    "config": {
      "component": "box",
      "className": "tour-target-1",
      "children": []
    }
  },
  {
    "id": "feature_area_2",
    "type": "element",
    "config": {
      "component": "box",
      "className": "tour-target-2",
      "children": []
    }
  },
  {
    "id": "system_tour",
    "type": "element",
    "config": {
      "component": "tour",
      "open": { "path": "/tour/open" },
      "current": { "path": "/tour/current" },
      "steps": [
        {
          "title": "功能一",
          "description": "这是系统的核心功能区域。",
          "target": ".tour-target-1"
        },
        {
          "title": "功能二",
          "description": "在这里可以查看您的所有数据报表。",
          "target": ".tour-target-2"
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 为什么导览卡片弹出来了，但是没有指向任何元素，而是显示在页面正中间？**
- 检查 `steps` 中对应步骤的 `target` 选择器是否正确。
- 检查目标元素是否在 DOM 中真实存在并且可见。如果目标元素被隐藏（如 `display: none`）或者尚未渲染，导览卡片将退化并显示在屏幕中央。

**Q: 导览组件能跨页面引导吗？**
- 不能直接跨页面。`tour` 组件的 `target` 是基于当前页面的 DOM 查询的。如果点击“下一步”会导致页面跳转或路由切换，你需要将目标页面的导览步骤拆分为另一个独立的 `tour` 配置，并在路由跳转后重新触发新的导览。

**Q: 点击“下一步”或者“关闭”没有反应？**
- 检查是否正确配置了 `open.path` 和 `current.path`。`tour` 组件是受控的，引擎需要知道把状态写回到哪里。如果路径配置错误或不存在，组件将无法更新自身的步数和显隐状态。