# inputnumber 组件

`inputnumber` 是数字输入框组件，用于输入数字值，支持步进调节（加减按钮），适用于年龄、数量、金额等数值输入场景。

## 适用场景

- **表单数据录入**：年龄、身高、体重等基本数值。
- **电商与交易**：商品数量、价格、折扣比例等。
- **范围限制**：需要限制用户只能在特定范围或精度内输入的场景。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（inputnumber）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `min` |  | 静态值 |  |  |
| `max` |  | 静态值 |  |  |
| `step` |  | 静态值 |  |  |
| `precision` |  | 静态值 |  |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
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
- 事件：`on_change`
- dataModel 绑定：`value`（number | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

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
