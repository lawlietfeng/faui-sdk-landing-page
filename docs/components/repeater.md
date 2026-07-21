# repeater — 通用数据遍历组件

对数据数组的每一项重复渲染模板子组件。每次迭代自动注入作用域变量。

## 基础用法

```json
{
  "id": "user-cards",
  "component": "repeater",
  "data": { "path": "/users" },
  "children": ["user-row-template"],
  "direction": "horizontal",
  "gap": 16
}
```

## 属性

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `data` | `ValueBinding` | 是 | — | 数据源路径,值应为数组 |
| `children` | `string[]` | 是 | — | 模板子组件 ID,每项重复渲染 |
| `direction` | `'vertical' \| 'horizontal'` | 否 | `'vertical'` | 排列方向 |
| `gap` | `number` | 否 | `0` | 项间距(px) |
| `emptyContent` | `string` | 否 | — | 空数据时的提示文本 |
| `style` | `CSSProperties` | 否 | — | 容器自定义样式 |

## 作用域变量

每次迭代中,模板子组件可访问以下作用域变量:

| 变量 | 含义 |
|------|------|
| `$current` | 当前迭代项 |
| `$parent` | 完整数据数组 |
| `./field` | 相对路径,解析到当前项的字段 |

## 示例 1:简单文本列表

```json
[
  {
    "id": "name-list",
    "component": "repeater",
    "data": { "path": "/names" },
    "direction": "vertical",
    "gap": 8,
    "children": ["name-row"]
  },
  {
    "id": "name-row",
    "component": "text",
    "content": "${$current}"
  }
]
```

dataModel:

```json
{ "names": ["张三", "李四", "王五"] }
```

## 示例 2:输入框 Repeater(动态字段表单)

可以配合 input 实现"动态添加联系方式"这类场景:

```json
[
  {
    "id": "phone-list",
    "component": "repeater",
    "data": { "path": "/phones" },
    "direction": "vertical",
    "gap": 8,
    "children": ["phone-input"]
  },
  {
    "id": "phone-input",
    "component": "input",
    "placeholder": "请输入手机号",
    "value": { "path": "./" },
    "on_change": { "action": "update_data", "path": "./", "value": "${value}" }
  }
]
```

> `path: "./"` 表示当前迭代项自身。如果数组项是 `{phone: "..."}` 这种对象,就用 `./phone`。

## 示例 3:带按钮的列表

可以在每一项里组合多个表单组件:

```json
[
  {
    "id": "contact-list",
    "component": "repeater",
    "data": { "path": "/contacts" },
    "direction": "vertical",
    "gap": 12,
    "children": ["contact-row"]
  },
  {
    "id": "contact-row",
    "component": "box",
    "layout": "horizontal",
    "spacing": 8,
    "children": ["contact-name", "contact-phone"]
  },
  {
    "id": "contact-name",
    "component": "text",
    "content": "${$current.name}"
  },
  {
    "id": "contact-phone",
    "component": "input",
    "value": { "path": "./phone" },
    "placeholder": "请输入手机号",
    "on_change": { "action": "update_data", "path": "./phone", "value": "${value}" }
  }
]
```

## 删除项的正确写法

如果要在每一项里加一个"删除"按钮,**不能用引用比较**(每次迭代都生成新对象,引用永远不等):

```json
{
  "id": "delete-btn",
  "component": "button",
  "label": "删除",
  "on_tap": [
    {
      "action": "update_data",
      "path": "/items",
      "value": "${$root.items.filter(x => x.id !== $current.id)}"
    }
  ]
}
```

要按 **`id` 这类字段值** 比较,而不是直接 `x !== $current`。

## 注意事项

- 数据源必须是数组。对象用 repeater 渲染会报 warn 并跳过
- `children` 是**模板**,不是初始项数组——只列模板组件 ID 一次,faui 会按 data 长度复制
- 模板里的 `id` 在每次迭代实际是同一个,不要用作 React key 之外的稳定标识

> repeater 的 children 是模板,不是数据。模板会被重复使用,数据决定重复几次,所以 children 重复不重复取决于 data 有几个,有几个就重复几次,没几个就不重复。
