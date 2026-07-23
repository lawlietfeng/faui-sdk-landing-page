# segmented 组件

`segmented`（分段控制器）组件用于展示多个选项并允许用户选择其中单项。它通常用于视图切换、日历维度切换（日/周/月）或轻量级的类别筛选。相比于 `radio`，它具有更现代的背景滑块动画效果，视觉上更强调整体连贯性。

## 适用场景

- **视图/模式切换**：如切换列表视图与卡片视图、切换深色与浅色模式。
- **时间维度筛选**：如“按日”、“按周”、“按月”的数据筛选。
- **轻量级分类切换**：代替选项卡（`tabs`）用于局部的类别过滤。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `ValueBinding` | - | 双向绑定的数据路径，用于回显和写入当前选中的值 |
| `options` | `Array \| string` | - | 分段控制器选项数据，支持插值表达式 |
| `block` | `boolean \| string` | `false` | 是否将宽度调整为父元素宽度的 100%，支持插值表达式 |
| `disabled` | `boolean \| string` | `false` | 是否禁用整个分段控制器，支持插值表达式 |
| `size` | `'large' \| 'middle' \| 'small' \| string` | `'middle'` | 控件大小，支持插值表达式 |
| `on_change` | `ActionConfig` | - | 选中项变化时的自定义回调动作。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `rules` | `FormRule[]` | - | 表单校验规则 |

### options（选项列表）

选项可以是一个简单的字符串/数字数组，也可以是包含 `label`、`value` 等属性的对象数组。

**简单数组模式**（`value` 与 `label` 相同）：
```json
{
  "component": "segmented",
  "id": "segment-simple",
  "options": ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]
}
```

**对象配置模式**：
```json
{
  "component": "segmented",
  "id": "segment-objects",
  "options": [
    { "label": "列表视图", "value": "list" },
    { "label": "看板视图", "value": "kanban" },
    { "label": "地图视图", "value": "map", "disabled": true }
  ]
}
```

也可以通过插值表达式动态获取：
```json
{
  "component": "segmented",
  "id": "segment-dynamic",
  "options": "${$root.availableViews}"
}
```

### value & 双向绑定机制

`segmented` 是一个受控表单组件。配置 `value.path` 即可实现双向绑定。

**自动回写**：当用户切换分段时，若未显式配置 `on_change` 动作，引擎会自动兜底执行 `update_data`，将最新的值写回 `value.path`。

```json
{
  "component": "segmented",
  "id": "segment-binding",
  "value": {
    "path": "/report/period"
  },
  "options": ["日", "周", "月"]
}
```

### block & size（外观控制）

你可以控制组件是否撑满父容器，以及整体的大小。

```json
{
  "component": "segmented",
  "id": "segment-appearance",
  "block": true,
  "size": "large",
  "options": ["全部", "进行中", "已完成"],
  "value": {
    "path": "/task/filter"
  }
}
```

## 完整示例

这是一个带有表单校验规则以及动态禁用控制的完整示例：

```json
{
  "component": "segmented",
  "id": "segment-complex",
  "disabled": "${$root.app.isLocked}",
  "options": [
    { "label": "List", "value": "list" },
    { "label": "Kanban", "value": "kanban" }
  ],
  "value": {
    "path": "/view/mode"
  },
  "rules": [
    {
      "required": true,
      "message": "请选择一种视图模式"
    }
  ],
  "on_change": [
    {
      "action": "update_data",
      "path": "/view/mode",
      "value": "${value}"
    },
    {
      "action": "console_log",
      "payload": {
        "content": "用户切换了视图模式为：${value}"
      }
    }
  ]
}
```

## 新手常见问题

**Q: `segmented` 和 `radio` 有什么区别，我该怎么选？**
- 视觉和交互差异：`segmented` 有一个滑块平移的动画，整体感更强，更像一个“开关”或“切换器”；`radio` 是传统的圆形单选按钮。
- 使用场景：如果选项代表了**不同维度的数据视图**（如日历按周/月查看），或者代表页面的**顶层模式**，首选 `segmented`。如果选项是表单中的一个**具体数据录入项**（如选择性别、支付方式），首选 `radio`。

**Q: 为什么我在 `options` 的对象里配置了 `icon`，但是不显示图标？**
- 当前 FAUI 基础封装对于 `icon` 的支持需要看运行环境是否集成了图标解析能力（如依赖特定的 ReactNode 转换器）。如果直接配置字符串无法渲染出图标，建议仅使用 `label`，或确认引擎版本是否已全面支持动态图标解析。

**Q: 宽度为什么不跟着内容变化？**
- 如果你发现选项文字被挤压或者有大量留白，可以尝试开启 `block: true` 让它等分撑满父容器，或者检查父容器的 `width` 设置。
