# list 组件

`list` 是列表渲染组件，用于遍历数组数据并根据模板循环渲染子组件。适用于商品列表、待办事项、卡片式数据展示等需要重复渲染相同结构的场景。

## 适用场景

- **数据流展示**：新闻列表、商品列表、动态消息。
- **循环表单与待办**：待办事项（Todo List）、多行表单录入。
- **卡片网格**：配合 `flex` 或 `grid` 渲染一组结构相同的卡片。

## 核心概念：数据上下文与相对路径

`list` 组件在渲染每一项时，会为当前项创建一个**独立的子数据上下文**：
- **`$current`**：代表当前正在遍历的这一行的数据对象。
- **`$parent`**：代表根级 `dataModel` 对象。
- **相对路径 (`./`)**：在列表项内部，数据绑定路径支持以 `./` 开头（如 `./title`），它会自动映射到当前遍历项的具体位置（如 `/todos/0/title`）。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data.path` | `string` | - | 必须指向 `dataModel` 中的一个**数组**字段，用于驱动列表渲染。 |
| `children` | `string[]` | `[]` | 列表项的模板组件 ID。数组中的每个元素都会被当作模板，对 `data.path` 中的每一项数据进行循环渲染。 |

### data.path 与 children（列表渲染）

假设有如下全局数据：
```json
{
  "users": [
    { "name": "Alice", "age": 25 },
    { "name": "Bob", "age": 30 }
  ]
}
```

配置 `list` 组件进行遍历渲染：
```json
[
  {
    "id": "user-list",
    "component": "list",
    "data": { "path": "/users" },
    "children": ["user-item-text"]
  },
  {
    "id": "user-item-text",
    "component": "text",
    "content": "姓名：${$current.name}，年龄：${$current.age}"
  }
]
```

### 列表项内的数据双向绑定（推荐使用相对路径）

对于列表项内部的交互组件（如 `input`、`checkbox` 等），强烈推荐使用相对路径 `./` 进行数据绑定与回写。这样能保证当前行组件只更新当前行的数据，不会影响其他项。

```json
{
  "id": "todo-checkbox",
  "component": "checkbox",
  "checked": { "path": "./done" },
  "on_change": {
    "action": "update_data",
    "path": "./done"
  }
}
```

## 完整示例

一个完整的待办事项列表（包含展示、状态切换和条件样式）：

```json
[
  {
    "id": "todo-list",
    "component": "list",
    "data": { "path": "/todos" },
    "children": ["todo-row"]
  },
  {
    "id": "todo-row",
    "component": "flex",
    "align": "center",
    "style": { "padding": "8px 0", "borderBottom": "1px solid #eee" },
    "children": ["todo-checkbox", "todo-title"]
  },
  {
    "id": "todo-checkbox",
    "component": "checkbox",
    "checked": { "path": "./done" },
    "style": { "marginRight": "12px" }
  },
  {
    "id": "todo-title",
    "component": "text",
    "content": "${$current.title}",
    "style": {
      "color": "${$current.done ? '#9ca3af' : '#1f2937'}",
      "textDecoration": "${$current.done ? 'line-through' : 'none'}"
    }
  }
]
```

## list vs table 的选择

| 场景 | 推荐组件 |
| --- | --- |
| 自定义卡片样式、流式布局、简单的单列循环 | `list` |
| 需要严格对齐的表头与列、分页、排序功能 | `table` |

## 新手常见问题

**Q: 页面上什么都没渲染出来？**
- 检查绑定的 `data.path` 对应的数据是否确实是一个**数组**。如果数据是 `undefined` 或对象，`list` 不会渲染任何内容。

**Q: 在子组件里访问不到 `$current`？**
- `$current` 只能在 `list` 的 `children` 模板树内部的表达式中使用。如果在 `list` 组件本身的属性中配置，它是无法解析的。

**Q: 修改了列表里某一项的 input，结果所有的行都跟着变了？**
- 请检查输入框的 `value.path` 是否写成了绝对路径（如 `/title`）。在 `list` 内部必须使用相对路径 `./title`，才能让组件准确识别并更新当前行的数据。

**Q: 列表为空时怎么显示暂无数据？**
- `list` 自身不包含 Empty 状态。建议在同级放置一个 `empty` 组件，并通过 `visible` 属性判断数组长度来控制显隐（例如 `"visible": "${!/todos || /todos.length === 0}"`）。
