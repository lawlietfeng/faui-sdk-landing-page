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

<!-- contract-props:start -->
## Form 契约属性（repeater）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `data` |  | `path`, 路径：`root` |  |  |
| `direction` |  | 静态值 |  |  |
| `gap` |  | 静态值 |  |  |
| `emptyContent` |  | `expression` | 组件显示的文本内容。 |  |
| `keyField` |  | 静态值 |  |  |
| `children` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 控制组件是否渲染。 |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`template-component-ids`
- 事件：
- dataModel 绑定：`data`（array）
- 属性依赖：无
- 特殊说明：data.path 使用根路径；模板子组件的可回写绑定可使用 ./field。
<!-- contract-props:end -->

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
