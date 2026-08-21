# calendar 组件

calendar 组件用于展示日历面板，允许用户通过点击选择具体的日期，常用于基于日历的任务排期、日期概览等场景。它具备数据双向绑定能力，并且可以作为表单控件参与校验。

## 适用场景

- **日期查看与选择**：提供直观的日历视图供用户点选某一天。
- **任务日程看板**：结合面板展示或选择年月视图。
- **表单数据输入**：作为大型表单中的日期拾取控件。

## 核心属性

### 属性总览

<!-- contract-props:start -->
## Form 契约属性（calendar）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `fullscreen` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `mode` |  | 静态值 |  |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `format` |  | 静态值 |  |  |
| `value` |  | `path`, 路径：`root-or-repeater-relative` |  |  |
| `field` |  | 静态值 | 表单校验字段名；不负责替代 value.path。 |  |
| `rules` |  | 静态值 |  |  |
| `validateTrigger` |  | 静态值 |  |  |
| `on_change` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 控制组件是否渲染。 |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`none`
- 事件：`on_change`, `on_panel_change`
- dataModel 绑定：`value`（string | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

---

### value.path（数据绑定）

将选中的日期值（按 `format` 格式化后的字符串）绑定到全局数据模型中的指定路径。默认行为是在用户点击日期时自动回写。

```json
{
  "id": "my_calendar",
  "component": "calendar",
  "value": {
    "path": "/currentDate"
  }
}
```

### format（日期格式）

控制日期在存储到数据模型时的字符串格式。

| 常用值          | 说明                       | 示例          |
| --------------- | -------------------------- | ------------- |
| `YYYY-MM-DD`    | 仅年月日（默认）           | `2024-05-20`  |
| `YYYY-MM`       | 仅年月（适合年视图）       | `2024-05`     |

```json
{
  "id": "month_calendar",
  "component": "calendar",
  "format": "YYYY-MM",
  "mode": "year",
  "value": {
    "path": "/selectedMonth"
  }
}
```

### fullscreen（全屏模式）

控制日历的展现形态。如果设为 `false`，日历将以小型卡片的紧凑形式展现。支持表达式动态控制。

```json
{
  "id": "mini_calendar",
  "component": "calendar",
  "fullscreen": false,
  "value": {
    "path": "/scheduleDate"
  }
}
```

### mode（面板模式）

设置日历初始展示的是具体到天数的月视图（`month`），还是具体到月份的年视图（`year`）。支持表达式动态控制。

```json
{
  "id": "year_view_calendar",
  "component": "calendar",
  "mode": "year"
}
```

## 特有机制 / 高级用法

### 1. 表单集成与校验
当 `calendar` 组件处于 `form` 组件内部时，它会自动向表单上下文注册。你可以通过 `rules` 属性为其配置表单校验规则（如必填项）。

### 2. 自定义事件响应 (on_change & on_panel_change)

如果你配置了 `on_change` 动作，默认的 `value.path` 回写将被拦截覆盖（除非你的 Action 是 `update_data`）。此时选中的日期字符串会被注入到动作的 `${$value}` 变量中，选择来源会注入到 `${payload.source}`。

当用户通过头部控件切换年月时，会触发 `on_panel_change`。面板的最新模式会注入到 `${payload.mode}` 中。

```json
{
  "id": "event_calendar",
  "component": "calendar",
  "on_change": {
    "action": "http_proxy",
    "payload": {
      "http_config": {
        "method": "GET",
        "path": "/api/events"
      },
      "http_body": {
        "date": "${$value}"
      }
    }
  }
}
```

## 完整示例

一个非全屏的卡片日历，双向绑定到 `/calendarDate`，并且在选择日期时会自动提示用户：

```json
{
  "id": "dashboard_calendar",
  "component": "calendar",
  "fullscreen": false,
  "format": "YYYY-MM-DD",
  "value": {
    "path": "/calendarDate"
  },
  "on_change": {
    "action": "message",
    "payload": {
      "type": "info",
      "content": "你选择了：${$value}"
    }
  },
  "style": {
    "width": 300,
    "border": "1px solid #f0f0f0",
    "borderRadius": 8
  }
}
```

## 新手常见问题

**Q: 为什么我点击了日历上的日期，但外部通过 useDataSelector 拿不到数据？**
- 检查是否正确配置了 `value.path` 且路径以 `/` 开头。
- 如果同时配置了 `on_change`，你需要自行在动作中调用 `update_data` 把数据写回路径，因为自定义的 `on_change` 会覆盖默认的双向绑定逻辑。

**Q: 如何控制日历显示的语言？**
- FAUI 的底层 Ant Design 日历会根据全局配置的 Locale 自动调整（默认通常为中文）。组件级别暂不支持单独配置语言。
