# timepicker 组件

`timepicker` 是时间选择器组件，用于选择时间点（小时:分钟:秒），适用于会议时间、预约时间、上班打卡时间等场景。

## 适用场景

- **精确时间选择**：会议预定、日程安排、打卡签到。
- **营业/工作时间设置**：设定系统的自动执行时间点或门店的营业时间段。

## 与 datepicker 的区别

| 组件 | 选择内容 | 适用场景 |
|------|---------|---------|
| `datepicker` | 年月日 | 生日、入职日期选择 |
| `timepicker` | 时分秒 | 精确时间点选择 |
| `datepicker` + `showTime: true` | 年月日 + 时分秒 | 需要完整日期和时间的场景 |

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | **必填**，双向绑定的数据路径，选中的时间会以字符串格式写回该路径 |
| `format` | `string` | `"HH:mm:ss"` | 控制显示和提交的时间字符串格式 |
| `placeholder` | `string` | - | 未选择时的占位提示文本，支持表达式 |
| `disabled` | `boolean \| string` | `false` | 是否禁用时间选择器，支持表达式 |
| `hourStep` | `number \| string` | `1` | 小时选项的间隔步长，支持表达式 |
| `minuteStep` | `number \| string` | `1` | 分钟选项的间隔步长，支持表达式 |
| `secondStep` | `number \| string` | `1` | 秒钟选项的间隔步长，支持表达式 |

### format（时间格式）

控制时间选择器展示的格式以及双向绑定保存回 `value.path` 的字符串格式。

| format | 示例 | 说明 |
|--------|------|------|
| `"HH:mm"` | `14:30` | 小时:分钟（24小时制，常用于隐藏秒数） |
| `"HH:mm:ss"` | `14:30:45` | 小时:分钟:秒（默认值） |
| `"hh:mm"` | `02:30` | 小时:分钟（12小时制，通常需配合 `a`） |
| `"hh:mm:ss a"` | `02:30:45 pm` | 12小时制 + am/pm 标识 |

```json
{
  "id": "alarm-time",
  "type": "element",
  "config": {
    "component": "timepicker",
    "placeholder": "选择时间（不含秒）",
    "format": "HH:mm",
    "value": { "path": "/alarmTime" }
  }
}
```

### minuteStep 与 secondStep（间隔步长）

可以通过设置步长来限制用户可以选择的时间点，以减少无效选项。比如会议通常是半点或整点，可以设置 `minuteStep: 30`。

```json
{
  "id": "meeting-time",
  "type": "element",
  "config": {
    "component": "timepicker",
    "placeholder": "请选择会议时间",
    "format": "HH:mm",
    "minuteStep": 15,
    "value": { "path": "/meetingTime" }
  }
}
```

### disabled（禁用状态）

禁用时间选择器，支持表达式，常用于根据表单其他字段状态动态控制。

```json
{
  "id": "schedule-time",
  "type": "element",
  "config": {
    "component": "timepicker",
    "placeholder": "请选择时间",
    "disabled": "${/isAllDay}",
    "value": { "path": "/scheduleTime" }
  }
}
```

## 表单与双向绑定 (value.path & on_change)

引擎提供了完善的 fallback 机制：
1. **自动回写**：只要配置了 `value.path`，组件选中后会自动执行 `update_data` 将时间字符串更新到该路径，并自动触发所在表单的字段校验。
2. **自定义动作**：如果你需要选中时间后立刻调用接口或执行其他逻辑，可显式配置 `on_change`，此时你需要自己在动作流中包含 `update_data` 动作以保证数据正确回写。可通过 `${$value}` 引用组件的最新值。如果 on_change 中未设置 `value` 字段，组件会自动注入当前值；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。

```json
{
  "id": "form_time_picker",
  "type": "element",
  "config": {
    "component": "timepicker",
    "field": "businessTime",
    "placeholder": "营业时间",
    "format": "HH:mm",
    "value": { "path": "/businessTime" },
    "rules": [
      { "required": true, "message": "必须填写营业时间" }
    ]
  }
}
```

## 完整示例

包含开始时间和结束时间的营业范围设置表单：

```json
[
  {
    "id": "business-hours-box",
    "type": "element",
    "config": {
      "component": "box",
      "layout": "horizontal",
      "spacing": 12,
      "children": ["start-time", "to-label", "end-time"]
    }
  },
  {
    "id": "start-time",
    "type": "element",
    "config": {
      "component": "timepicker",
      "placeholder": "开始时间",
      "format": "HH:mm",
      "minuteStep": 30,
      "value": { "path": "/openTime" },
      "rules": [{ "required": true, "message": "请选择开始时间" }]
    }
  },
  {
    "id": "to-label",
    "type": "element",
    "config": {
      "component": "text",
      "content": "至",
      "style": { "marginTop": "4px" }
    }
  },
  {
    "id": "end-time",
    "type": "element",
    "config": {
      "component": "timepicker",
      "placeholder": "结束时间",
      "format": "HH:mm",
      "minuteStep": 30,
      "value": { "path": "/closeTime" },
      "rules": [{ "required": true, "message": "请选择结束时间" }]
    }
  }
]
```

## 新手常见问题

**Q: 为什么我选了时间，全局数据却没有更新？**
- 请检查是否配置了 `value.path`（且以 `/` 开头）。如果没有配置 `on_change`，引擎会通过 `value.path` 自动回写；如果配置了 `on_change`，则必须在 `on_change` 的动作流中手动加入 `update_data` 动作，否则内置的 fallback 会被阻断。

**Q: 为什么选择时间时总是会自动带上秒钟？**
- `timepicker` 的默认 `format` 是 `"HH:mm:ss"`。如果不需要秒，请显式将 `format` 设置为 `"HH:mm"`，此时下拉弹板和输入框中均不会出现秒数选项。

**Q: 如何限制用户只能选择未来时间或者特定工作时段？**
- 目前 FAUI 的 `timepicker` 暂未暴露 `disabledHours` 等复杂的时间禁用属性。建议：
  1. 通过表单的自定义 `rules` (使用正则表达式或联动校验) 在提交时拦截。
  2. 如果必须在交互上限制，可以在 `on_change` 的后续动作链路中检查选中的 `${value}`，如果不符合规则则使用 `update_data` 覆盖回合法值或给出提示。

**Q: 从后端拉取的时间戳，可以直接绑定到 timepicker 吗？**
- 不行。`timepicker` 绑定的值必须是与 `format` 相匹配的**字符串**（如 `"09:30"`）。如果后端返回的是时间戳或完整的 ISO 日期格式，请在网络请求（`http_request`）的数据转换层（如 `transformer`）将其格式化为时间字符串后再写入绑定的路径。