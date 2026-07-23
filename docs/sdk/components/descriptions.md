# descriptions 组件

`descriptions` 组件用于成组展示多个只读字段，通常用于详情页的数据展示。

## 适用场景

- **实体详情**：展示用户资料、商品详情、订单信息等。
- **系统配置**：展示系统的静态配置参数或运行状态。
- **只读面板**：将零散的只读数据规整为对齐的键值对结构。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `Array<{ label: string, value: string }>` | `[]` | 描述列表的数据项配置，`label` 为标题，`value` 为展示内容 |
| `title` | `string` | - | 描述列表的标题 |
| `column` | `number` | - | 一行包含的描述项数量，不指定时默认根据屏幕宽度自动适配 |
| `bordered` | `boolean` | `false` | 是否展示带边框的描述列表 |

### options（数据项列表）

定义描述列表中的具体数据项。数组中的每一项包含 `label`（描述项标题）和 `value`（描述项内容）。支持通过表达式动态获取全局状态中的数据。

```json
{
  "id": "user-desc",
  "component": "descriptions",
  "options": [
    { "label": "姓名", "value": "张三" },
    { "label": "手机号", "value": "13800138000" },
    { "label": "状态", "value": "正常" }
  ]
}
```

### title（标题）

设置描述列表的顶部标题文字，支持表达式求值。

```json
{
  "id": "order-desc",
  "component": "descriptions",
  "title": "订单详情"
}
```

### column（列数）

指定一行展示多少个数据项。如果没有设置，则由底层组件自动适配（通常桌面端为 3 列）。

```json
{
  "id": "desc-column",
  "component": "descriptions",
  "column": 2,
  "options": [
    { "label": "姓名", "value": "李四" },
    { "label": "年龄", "value": "28" }
  ]
}
```

### bordered（是否展示边框）

布尔值，设置描述列表是否有边框，默认为 `false`。开启边框后，标题和内容会以表格单元格的形式展现，且背景色有区分。

```json
{
  "id": "desc-bordered",
  "component": "descriptions",
  "bordered": true,
  "options": [
    { "label": "产品", "value": "FAUI" },
    { "label": "版本", "value": "v1.0.0" }
  ]
}
```

## 表达式插值与动态数据 (高级用法)

`descriptions` 组件的 `title` 和 `options` 均经过 `useExpression` 解析，因此可以结合全局数据状态动态渲染。你可以将整个 `options` 数组映射为一个变量路径，或者在 `options` 内部使用 `${}` 语法绑定数据。

**注意**：根据规范，遍历包含配置对象的数组时，必须对外层数组整体调用 `useExpression`，而引擎已默认对 `options` 做了整体包裹。因此通过 `"${/user/detail_list}"` 绑定整个数组是合法的。

```json
{
  "id": "dynamic-desc",
  "component": "descriptions",
  "title": "${/user/name} 的个人资料",
  "options": [
    { "label": "注册邮箱", "value": "${/user/email}" },
    { "label": "最近登录", "value": "${/user/lastLoginTime}" }
  ]
}
```

## 完整示例

以下示例展示了一个带边框的、两列布局的商品信息描述列表：

```json
{
  "id": "product-desc-demo",
  "component": "descriptions",
  "title": "商品信息",
  "bordered": true,
  "column": 2,
  "options": [
    { "label": "商品名称", "value": "苹果 MacBook Pro 16英寸" },
    { "label": "发售价", "value": "¥19999.00" },
    { "label": "处理器", "value": "M3 Max" },
    { "label": "内存", "value": "32GB" },
    { "label": "库存状态", "value": "充足" },
    { "label": "发货地", "value": "上海市" }
  ],
  "style": {
    "backgroundColor": "#fff",
    "padding": "24px",
    "borderRadius": "8px"
  }
}
```

## 新手常见问题

**Q: 为什么描述列表的内容被挤压得很难看，或者文字换行错乱？**
- 检查 `column` 属性设置是否过大，或者父容器宽度不足。可以尝试减小 `column` 的值（如设置 `column: 1` 独占一行），或者保持不设置以让组件自动适应。

**Q: `options` 中的 `value` 支持传入子组件（如标签或按钮）吗？**
- 目前 `descriptions` 组件不支持将 `value` 渲染为复杂的 FAUI 组件树。`value` 的内容最终会作为文本或者经过表达式解析后的基础数据类型直接渲染，不能嵌套其他 FAUI 节点配置。

**Q: 可以给某个单独的 `label` 或 `value` 设置颜色样式吗？**
- 暂不支持局部样式控制。目前仅支持通过组件顶层的 `style` 或 `className` 属性统一调整整个 `descriptions` 组件的外观。