# repeater — 通用数据遍历组件

对数据数组的每一项重复渲染模板子组件。每次迭代自动注入作用域变量。

## 基础用法

```json
{
  "id": "user-cards",
  "component": "repeater",
  "data": { "path": "/users" },
  "children": ["user-card-template"],
  "direction": "horizontal",
  "gap": 16
}
```

## 属性

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `data` | `ValueBinding` | 是 | — | 数据源路径，值应为数组 |
| `children` | `string[]` | 是 | — | 模板子组件 ID，每项重复渲染 |
| `direction` | `'vertical' \| 'horizontal'` | 否 | `'vertical'` | 排列方向 |
| `gap` | `number` | 否 | `0` | 项间距（px） |
| `emptyContent` | `string` | 否 | — | 空数据时的提示文本 |
| `style` | `CSSProperties` | 否 | — | 容器自定义样式 |

## 作用域变量

每次迭代中，模板子组件可访问以下作用域变量：

| 变量 | 含义 |
|------|------|
| `$current` | 当前迭代项 |
| `$parent` | 完整数据数组 |
| `./field` | 相对路径，解析到当前项的字段 |

## 示例：卡片列表

```json
[
  {
    "id": "card-list",
    "component": "repeater",
    "data": { "path": "/items" },
    "direction": "horizontal",
    "gap": 16,
    "children": ["item-card"],
    "style": { "flexWrap": "wrap" }
  },
  {
    "id": "item-card",
    "component": "card",
    "title": "${$current.name}",
    "children": ["card-content"]
  },
  {
    "id": "card-content",
    "component": "text",
    "content": "${$current.description}"
  }
]
```

## 演示

`examples/schemas/15-condition-repeater-demo.json`
