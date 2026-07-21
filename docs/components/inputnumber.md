# inputnumber 组件

`inputnumber` 是数字输入框组件，用于输入数字值，支持步进调节（加减按钮），适用于年龄、数量、金额等数值输入场景。

## 适用场景

- **表单数据录入**：年龄、身高、体重等基本数值。
- **电商与交易**：商品数量、价格、折扣比例等。
- **范围限制**：需要限制用户只能在特定范围或精度内输入的场景。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | 双向绑定的数据路径。如果存在，它将作为输入框的受控值。 |
| `on_change` | `ActionConfig` | - | 数值改变时触发的动作。如果不配置但配置了 `value.path`，默认执行回写数据的 fallback 操作。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `min` | `number` | - | 允许输入的最小值。 |
| `max` | `number` | - | 允许输入的最大值。 |
| `step` | `number` | `1` | 每次改变步数，可以为小数。 |
| `placeholder` | `string` | - | 输入框为空时的提示文字，支持表达式插值。 |
| `rules` | `FormRule[]` | - | 配合 `form` 校验的规则数组。 |

### value.path 与 on_change（数据双向绑定）

将数字输入框的值绑定到全局状态的某个字段。在数值变化时，如果没有配置 `on_change`，引擎会自动 fallback 将最新值（类型为 `number` 或 `null`）回写到 `dataModel`。

```json
{
  "id": "age-input",
  "component": "inputnumber",
  "value": {
    "path": "/userInfo/age"
  }
}
```

### min / max / step（范围与步进）

限制输入的数值范围，以及点击加减按钮时每次变化的数值：

```json
{
  "id": "price-input",
  "component": "inputnumber",
  "min": 0,
  "max": 10000,
  "step": 0.5
}
```

### rules（校验规则）

配合表单组件，限制输入内容的合法性。

```json
{
  "id": "quantity-input",
  "component": "inputnumber",
  "value": { "path": "/quantity" },
  "rules": [
    { "required": true, "message": "请输入数量" },
    { "type": "number", "message": "数量必须是数字" },
    { "min": 1, "message": "至少购买 1 件" }
  ]
}
```

## 完整示例

包含数据绑定、表单校验、数值限制和占位提示的完整配置：

```json
{
  "id": "discount-input",
  "component": "inputnumber",
  "placeholder": "请输入折扣（0-100）",
  "min": 0,
  "max": 100,
  "step": 5,
  "value": {
    "path": "/discount"
  },
  "rules": [
    { "required": true, "message": "折扣不能为空" }
  ],
  "style": {
    "width": "100%",
    "marginBottom": 16
  }
}
```

## 新手常见问题

**Q: 输入非数字会被拒绝吗？**
- 是的，`inputnumber` 组件会自动拦截非数字字符（除小数点和负号外）。

**Q: 初始值显示不正确或者无法回写？**
- 请确认 `dataModel` 中对应字段的值是数字类型（number），而不是字符串。例如 `"age": "25"` 可能导致表现异常，应使用 `"age": 25`。

**Q: 为什么提交到后端的数据变成了 null？**
- 如果用户清空了输入框，组件会将其值更新为 `null`（而不是空字符串 `""`），请确保后端能够处理或在发起请求前进行默认值转换。

**Q: 超过 min/max 范围时会发生什么？**
- 到达最小值后，减号按钮会自动禁用；到达最大值后，加号按钮会自动禁用。如果用户手动输入超出范围的值，输入框在失焦后会自动修正为边界值。
