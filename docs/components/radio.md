# radio 组件

`radio`（单选框）组件用于在多个互斥的选项中，让用户明确地选择其中一项。当选项较少且希望所有选项同时平铺展示时，它是最佳选择。

## 适用场景

- **互斥选择**：如性别选择（男/女）、状态切换（公开/私密）。
- **少量选项平铺**：选项数量建议在 2~5 个之间。如果选项过多，建议使用 `select`（选择器）组件。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `ValueBinding` | - | 双向绑定的数据路径，用于回显和写入当前选中的值 |
| `options` | `Array \| string` | - | 选项列表，支持通过插值表达式动态获取数组 |
| `on_change` | `ActionConfig` | - | 选中项发生变化时的回调动作。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `rules` | `FormRule[]` | - | 表单校验规则，支持必填等校验 |
| `validateTrigger` | `string \| string[]` | `'onChange'` | 触发校验的时机 |

### options（选项列表）

通过 `options` 定义单选框的每一个选项。你可以直接配置一个包含 `label`（显示文本）和 `value`（实际值）的数组，或者使用插值表达式绑定全局数据。

```json
{
  "component": "radio",
  "id": "radio-static",
  "options": [
    { "label": "苹果", "value": "apple" },
    { "label": "香蕉", "value": "banana" },
    { "label": "橘子", "value": "orange" }
  ]
}
```

```json
{
  "component": "radio",
  "id": "radio-dynamic",
  "options": "${$root.fruitList}"
}
```

### value & 双向绑定机制

`radio` 是一个受控表单组件。当你在 `value.path` 中指定了绑定路径后，组件会自动读取该路径的值作为初始选中状态。

**自动回写**：当用户点击切换选项时，如果没有显式配置 `on_change` 动作，引擎会自动触发 `update_data` 将最新的值回写到 `value.path` 路径下。这是推荐的标准用法。

```json
{
  "component": "radio",
  "id": "radio-binding",
  "value": {
    "path": "/form/fruit"
  },
  "options": [
    { "label": "苹果", "value": "apple" },
    { "label": "香蕉", "value": "banana" }
  ]
}
```

### rules（表单校验）

结合 `form` 组件使用时，可以配置校验规则。比如设置 `required` 确保用户必须选择一项。

```json
{
  "component": "radio",
  "id": "radio-rules",
  "value": {
    "path": "/form/gender"
  },
  "options": [
    { "label": "男", "value": "male" },
    { "label": "女", "value": "female" }
  ],
  "rules": [
    {
      "required": true,
      "message": "请务必选择您的性别"
    }
  ]
}
```

## 高级用法：自定义 on_change 拦截

如果不仅想回写数据，还想在用户切换单选框时立刻发起请求（如按类别筛选列表），你可以显式配置 `on_change` 动作。配置后，引擎**不再自动回写**，而是直接执行你配置的动作（此时最新的值会被注入到 `payload.value` 或可通过动作内的模板读取）。

```json
{
  "component": "radio",
  "id": "radio-onchange",
  "value": {
    "path": "/filter/status"
  },
  "options": [
    { "label": "全部", "value": "all" },
    { "label": "已完成", "value": "done" }
  ],
  "on_change": [
    {
      "action": "update_data",
      "path": "/filter/status",
      "value": "${value}"
    },
    {
      "action": "http_proxy",
      "payload": {
        "http_config": {
          "url": "/api/getList",
          "method": "GET"
        }
      }
    }
  ]
}
```

## 完整示例

这是一个在真实表单中收集用户意见反馈的单选组配置：

```json
{
  "component": "radio",
  "id": "radio-survey",
  "value": {
    "path": "/survey/satisfaction"
  },
  "options": [
    { "label": "非常满意", "value": "5" },
    { "label": "比较满意", "value": "4" },
    { "label": "一般", "value": "3" },
    { "label": "不满意", "value": "2" },
    { "label": "极差", "value": "1" }
  ],
  "rules": [
    {
      "required": true,
      "message": "此题为必答题，请选择您的满意度"
    }
  ]
}
```

## 新手常见问题

**Q: 为什么旧文档里说 `on_change` 必须配置？**
- 那是旧版引擎的遗留认知。现在的 FAUI 引擎已经支持**自动 fallback 回写机制**。只要配置了 `value.path` 且不配置 `on_change`，引擎就会自动执行 `update_data` 回写。旧文档的描述已经过时。

**Q: 我想要单选框横向排列/竖向排列怎么做？**
- 默认情况下，Ant Design 的 Radio.Group 是水平排列的（只要空间足够）。如果需要强制垂直排列，可以通过在 `style` 中配置 `display: flex` 和 `flexDirection: column` 等样式属性，或者调整外层容器的布局。

**Q: 只有“同意”一个选项，能用 `radio` 吗？**
- 只有一个选项（如“同意协议”）并且可以取消选中的场景，**强烈建议使用 `checkbox` 组件**。`radio` 的交互语义是一旦选中就无法点击自身取消选中，必须通过选择其他选项来切换。
