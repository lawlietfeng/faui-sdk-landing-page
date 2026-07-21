# datepicker 组件

`datepicker` 是日期选择器组件，适用于选择日期、月份、年份或带时间的日期时间场景。

## 适用场景

- **常规日期**：生日、入职日期、入学日期选择。
- **时间区间**：预约时间、开始/结束日期。
- **筛选条件**：业务报表中的按日/月/年筛选条件。

## 核心属性

### 属性总览

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | **核心**：双向绑定的数据路径，绑定的值为格式化后的日期字符串。 |
| `picker` | `'date' \| 'month' \| 'year'` | `'date'` | 选择器类型。 |
| `format` | `string` | - | 日期格式化字符串，如 `YYYY-MM-DD`。默认会根据 `picker` 和 `showTime` 自动适配。 |
| `showTime` | `boolean` | `false` | 是否同时显示时间选择器（仅当 `picker` 为 `date` 时有效）。 |
| `placeholder` | `string` | - | 输入框占位提示文字。 |
| `disabledDate` | `object` | - | 日期禁用规则，支持 `before` 和 `after` 约束。详见下方说明。 |
| `field` | `string` | - | 表单字段名（可选），未提供则默认使用 `value.path` 或 `id`。 |
| `on_change` | `ActionConfig` | - | 值变化时触发的动作。如果不配置，组件会自动 fallback 执行 `update_data` 更新对应数据。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `rules` | `FormRule[]` | - | 表单校验规则（如必填验证等）。 |
| `validateTrigger` | `string \| string[]` | `'onChange'` | 触发校验的时机。 |
| `style` | `object` | - | 自定义内联样式。 |
| `className` | `string` | - | 自定义 CSS 类名。 |

### picker（选择器类型）

决定了面板的交互模式和能选到的日期粒度：

| 值 | 效果 | 适用场景 |
| --- | --- | --- |
| `date` | 选择具体年月日（默认） | 大部分日期场景 |
| `month` | 选择年月 | 统计月份筛选 |
| `year` | 选择年份 | 出生年份、计划年度 |

```json
{
  "id": "birthday-picker",
  "component": "datepicker",
  "picker": "date"
}
```

### format（日期格式）

控制显示和提交到数据模型中的日期格式字符串（基于 dayjs）：

| picker / showTime 配置 | 默认回退格式 | 示例 |
| --- | --- | --- |
| `picker: "date"` | `YYYY-MM-DD` | 2024-03-15 |
| `picker: "month"` | `YYYY-MM` | 2024-03 |
| `picker: "year"` | `YYYY` | 2024 |
| `picker: "date"`, `showTime: true` | `YYYY-MM-DD HH:mm:ss` | 2024-03-15 14:30:00 |

```json
{
  "id": "start-picker",
  "component": "datepicker",
  "picker": "date",
  "format": "YYYY/MM/DD"
}
```

### showTime（是否显示时间）

设置为 `true` 时，日期选择器会同时提供时分秒的选择面板。

```json
{
  "id": "meeting-picker",
  "component": "datepicker",
  "picker": "date",
  "showTime": true,
  "format": "YYYY-MM-DD HH:mm:ss"
}
```

### value.path 与 on_change（数据绑定）

通过 `value.path` 绑定全局状态。当选择日期时，触发 `on_change`（局部变量 `${value}` 为格式化后的字符串）。
> 💡 **提示**：如果只声明 `value.path` 而不写 `on_change`，引擎也会自动执行更新回写。

```json
{
  "id": "start-picker",
  "component": "datepicker",
  "value": {
    "path": "/startDate"
  },
  "on_change": {
    "action": "update_data",
    "path": "/startDate",
    "value": "${value}"
  }
}
```

### disabledDate（日期禁用规则）

用于限制可选日期范围，常用于日期区间约束（如结束日期不能早于开始日期）。

**支持的约束类型：**
- `before`：禁用早于指定日期的所有日期
- `after`：禁用晚于指定日期的所有日期

**示例 1：结束日期不能早于开始日期**
```json
{
  "id": "end-picker",
  "component": "datepicker",
  "value": { "path": "/endDate" },
  "disabledDate": {
    "before": { "path": "/startDate" }
  }
}
```

**示例 2：开始日期不能晚于结束日期**
```json
{
  "id": "start-picker",
  "component": "datepicker",
  "value": { "path": "/startDate" },
  "disabledDate": {
    "after": { "path": "/endDate" }
  }
}
```

**示例 3：同时限制上下界**
```json
{
  "id": "date-picker",
  "component": "datepicker",
  "value": { "path": "/selectedDate" },
  "disabledDate": {
    "before": { "path": "/minDate" },
    "after": { "path": "/maxDate" }
  }
}
```

## 完整示例

### 带日期范围约束的请假表单

```json
[
  {
    "id": "leave-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": [
      "start-picker",
      "end-picker",
      "submit-btn"
    ]
  },
  {
    "id": "start-picker",
    "component": "datepicker",
    "picker": "date",
    "placeholder": "请选择请假开始日期",
    "value": {
      "path": "/startDate"
    },
    "disabledDate": {
      "after": { "path": "/endDate" }
    },
    "rules": [{ "required": true, "message": "开始日期必填" }]
  },
  {
    "id": "end-picker",
    "component": "datepicker",
    "picker": "date",
    "placeholder": "请选择请假结束日期",
    "value": {
      "path": "/endDate"
    },
    "disabledDate": {
      "before": { "path": "/startDate" }
    },
    "rules": [{ "required": true, "message": "结束日期必填" }]
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "提交申请",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": {
            "method": "POST",
            "path": "/api/leave"
          }
        }
      }
    ]
  }
]
```

### 带有时间选择的表单

```json
[
  {
    "id": "meeting-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": [
      "start-picker",
      "end-picker",
      "submit-btn"
    ]
  },
  {
    "id": "start-picker",
    "component": "datepicker",
    "picker": "date",
    "showTime": true,
    "placeholder": "请选择会议开始时间",
    "value": {
      "path": "/meeting/start"
    },
    "rules": [{ "required": true, "message": "开始时间必填" }]
  },
  {
    "id": "end-picker",
    "component": "datepicker",
    "picker": "date",
    "showTime": true,
    "placeholder": "请选择会议结束时间",
    "value": {
      "path": "/meeting/end"
    },
    "rules": [{ "required": true, "message": "结束时间必填" }]
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "创建会议",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": {
            "method": "POST",
            "path": "/api/meeting"
          }
        }
      }
    ]
  }
]
```

## 新手常见问题

**Q: 选择的日期格式不对？**
- 检查 `format` 属性配置是否正确。FAUI 底层使用 `dayjs`，支持的标准格式字符有：`YYYY`（年）、`MM`（月）、`DD`（日）、`HH`（24小时）、`hh`（12小时）、`mm`（分）、`ss`（秒）。

**Q: 日期值传到后端是什么格式？**
- 取决于 `format` 配置的值。例如设置了 `format: "YYYY-MM-DD"`，则 `dataModel` 中存的是 `"2024-03-15"` 这样的字符串。若不设置 `format`，则回退到对应 `picker` 的默认格式。

**Q: 如何限制只能选未来/过去的日期？**
- 使用 `disabledDate` 属性。例如限制只能选未来日期，可以在 `dataModel` 中设置 `minDate` 为当前日期，然后配置 `"disabledDate": { "before": { "path": "/minDate" } }`。

**Q: 日期选择后没有显示在输入框？**
- 检查 `value.path` 绑定的初始值是否为合法的日期字符串，如果绑定的是无效字符串或对象，会导致 `dayjs` 解析失败。同时确认如果显式写了 `on_change`，其回写逻辑是否正确。

**Q: 结束日期早于开始日期时如何约束？**
- 在开始日期组件上配置 `"disabledDate": { "after": { "path": "/endDate" } }`，在结束日期组件上配置 `"disabledDate": { "before": { "path": "/startDate" } }`。这样两个日期选择器会互相约束。