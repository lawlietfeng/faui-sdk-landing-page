# text 组件

`text` 是最基础的文本展示组件，用于在页面上渲染一段文字，支持静态文案和基于全局状态的动态插值表达式。

## 适用场景

- **页面标题/段落**：展示纯文本标题、说明文案。
- **数据展示**：将 `dataModel` 中的动态数据（如用户名、状态描述、金额等）直接渲染到页面上。
- **条件提示**：结合 `visible` 属性实现条件性提示文案。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | - | 文本内容，支持 `${}` 插值表达式 |
| `style` | `object` | - | 自定义 CSS 样式（如字号、颜色、粗细等） |

### content（文本与插值）

`content` 支持普通的静态字符串，更重要的是它支持使用 `${}` 语法读取 `dataModel` 中的动态数据或执行 JavaScript 表达式。

**1. 静态文本**
```json
{
  "id": "page-title",
  "component": "text",
  "content": "基本信息设置"
}
```

**2. 动态插值**
使用 `${}` 可以访问全局的 `dataModel`（默认上下文为全局变量）。
```json
{
  "id": "welcome-text",
  "component": "text",
  "content": "欢迎回来，${userInfo.nickname}！您当前的积分为 ${userInfo.score}。"
}
```

**3. 三元表达式**
可以利用插值执行简单的逻辑判断：
```json
{
  "id": "status-text",
  "component": "text",
  "content": "当前状态：${isActive ? '已激活' : '未激活'}"
}
```

### 上下文变量 `$root` 与 `$current`

当 `text` 组件单独存在时，`${name}` 等同于 `${$root.name}`。
当 `text` 组件被嵌套在 `list` 或 `table` 等具有**局部作用域**的列表组件中时，你可以使用：
- `$current`：访问当前循环项的数据。
- `$root`：访问最外层全局的 `dataModel` 数据。

```json
{
  "id": "list-item-text",
  "component": "text",
  "content": "商品：${$current.productName}，全场折扣：${$root.globalDiscount}"
}
```

### style（文本排版）

`text` 组件底层渲染为原生的 `<span>` 元素。你可以通过 `style` 属性自由控制其文字排版。

```json
{
  "id": "price-text",
  "component": "text",
  "content": "¥ ${price.toFixed(2)}",
  "style": {
    "fontSize": "24px",
    "fontWeight": "bold",
    "color": "#f5222d",
    "display": "block",
    "marginTop": "12px"
  }
}
```

## 完整示例

结合条件展示与样式的组合应用：

```json
[
  {
    "id": "balance-box",
    "component": "box",
    "layout": "horizontal",
    "spacing": 8,
    "align": "baseline",
    "children": ["balance-label", "balance-value", "balance-warning"]
  },
  {
    "id": "balance-label",
    "component": "text",
    "content": "账户余额："
  },
  {
    "id": "balance-value",
    "component": "text",
    "content": "¥ ${balance}",
    "style": {
      "fontSize": "20px",
      "fontWeight": 600,
      "color": "${balance < 100 ? '#cf1322' : '#389e0d'}"
    }
  },
  {
    "id": "balance-warning",
    "component": "text",
    "content": "（余额不足，请尽快充值）",
    "visible": "${balance < 100}",
    "style": {
      "color": "#cf1322",
      "fontSize": "12px"
    }
  }
]
```

## 新手常见问题

**Q: `${name}` 没有被替换，页面上原样输出了 `${name}`？**
- 请检查 `${}` 的语法是否正确，以及 `name` 是否在 `dataModel` 中存在。如果变量不存在，它可能会渲染为 `undefined`，或者在某些复杂表达式出错时导致整个字符串不被解析。

**Q: 为什么我设置了 `marginTop` 但没有生效？**
- `text` 组件底层是 `<span>`，这是一个行内元素（inline）。行内元素不支持垂直方向的 margin/padding。你可以通过 `style: { "display": "block" }` 或 `display: "inline-block"` 将其转换为块级元素。

**Q: 如果我想在文本里显示真实的美元符号 `$` 怎么办？**
- 如果字符串中有不打算作为表达式解析的 `$`, 可以在 `${}` 之外直接写 `$`。例如 `"总计：$ ${amount}"`。只有紧跟 `{` 的 `${` 才会被当做表达式的起点。