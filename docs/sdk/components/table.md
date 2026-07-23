# table 组件

`table` 是用于展示和渲染结构化多行数据的表格组件，内置了列渲染模板、分页配置及状态标签等丰富的定制能力。

## 适用场景

- **数据列表展示**：如商品列表、用户列表、订单记录等。
- **管理系统主视图**：配合分页呈现大量的业务条目，并可以在列中嵌入操作按钮。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `ValueBinding` | - | 绑定到 `dataModel` 中的数组数据路径 |
| `columns` | `TableColumn[]` \| `string` | `[]` | 列定义配置，描述每一列展示什么数据以及如何渲染 |
| `rowKey` | `string` | `"id"` | 表格数据项的唯一键，用于优化 React 渲染性能 |
| `pagination` | `boolean` \| `TablePagination` \| `string` | - | 分页配置。传 `false` 可隐藏分页，传对象可配置 `pageSize` |
| `bordered` | `boolean` \| `string` | `false` | 是否显示表格的外边框和列边框 |
| `tableSize` | `string` | `"middle"` | 表格尺寸，可选 `"small"`、`"middle"`、`"large"` |
| `emptyText` | `string` | - | 当数据为空时显示的提示文案 |

### data.path（数据源绑定）

指定要渲染的数据数组路径：

```json
{
  "id": "user-table",
  "component": "table",
  "data": { "path": "/userList" }
}
```

### columns（列定义）

`columns` 是表格的核心配置，用于定义每一列如何读取数据、如何渲染。

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | 是 | 表头显示的标题文本 |
| `dataIndex` | `string` | 是 | 对应数据源中每行记录的字段名 |
| `width` | `string` \| `number` | 否 | 列的宽度（如 `120` 或 `"20%"`） |
| `align` | `string` | 否 | 文本对齐方式，可选 `"left"`、`"center"`、`"right"` |
| `template` | `string` | 否 | **高级**。使用表达式模板重新组织单元格文本 |
| `renderAs` | `string` | 否 | 渲染类型，可选 `"text"`、`"checkbox"`、`"tag"` |
| `statusColors` | `object` | 否 | 当 `renderAs` 为 `"tag"` 时，映射状态值为颜色 |
| `component` | `string` | 否 | **高级**。指定用来渲染该列的内部子组件 ID |

```json
{
  "id": "simple-table",
  "component": "table",
  "data": { "path": "/employees" },
  "columns": [
    { "title": "姓名", "dataIndex": "name", "width": 150 },
    { "title": "所属部门", "dataIndex": "department", "align": "center" }
  ]
}
```

### 分页与表格样式

通过 `pagination`、`bordered` 和 `tableSize` 调整表格的显示形态。

```json
{
  "id": "styled-table",
  "component": "table",
  "data": { "path": "/records" },
  "pagination": { "pageSize": 20 },
  "bordered": true,
  "tableSize": "small",
  "emptyText": "暂无相关记录"
}
```

## 高级用法：单元格自定义渲染

`table` 提供了强大的单元格渲染能力，主要通过 `template` 和 `renderAs` 实现。

### 1. template 表达式插值

使用 `template` 可以在一个单元格中拼接多个字段，或者进行数据格式化。模板内置了三个上下文变量：
- `$current`：当前行的数据对象
- `$parent`：整个表格绑定的数据数组
- `$root`：全局的 `dataModel`

```json
{
  "title": "员工信息",
  "dataIndex": "info",
  "template": "${$current.name}（${$current.role}）"
}
```
*(假设 `$current` 为 `{"name": "张三", "role": "开发"}`，渲染结果为 `"张三（开发）"`)*

### 2. renderAs 特殊形态渲染

你可以将某一列强制渲染为标签或复选框，而不是纯文本：

**渲染为标签 (tag)**：配合 `statusColors`，根据状态值映射 Ant Design 的标准颜色（如 `green`, `red`, `blue`, `gold`, `orange` 等）。
```json
{
  "title": "订单状态",
  "dataIndex": "status",
  "renderAs": "tag",
  "statusColors": {
    "已完成": "green",
    "待支付": "orange",
    "已取消": "red"
  }
}
```

**渲染为只读复选框 (checkbox)**：
```json
{
  "title": "是否生效",
  "dataIndex": "isActive",
  "renderAs": "checkbox"
}
```

### 3. component 嵌套子组件渲染

如果 `template` 无法满足需求（比如需要在单元格内放一个按钮或复杂布局），可以通过 `component` 指定一个已存在的组件 ID 来渲染该列内容。在这个子组件内部，可以通过插值表达式访问 `$current` 获取当前行数据。

```json
[
  {
    "id": "user-table",
    "component": "table",
    "data": { "path": "/users" },
    "columns": [
      { "title": "用户名", "dataIndex": "name" },
      { "title": "操作", "dataIndex": "action", "component": "action-btn" }
    ]
  },
  {
    "id": "action-btn",
    "component": "button",
    "label": "查看 ${$current.name} 详情",
    "on_tap": [
      {
        "action": "message",
        "payload": { "type": "info", "content": "点击了ID为 ${$current.id} 的记录" }
      }
    ]
  }
]
```

## 完整示例

综合展示数据绑定、模板拼接、状态标签与分页配置的表格：

```json
{
  "id": "comprehensive-table",
  "component": "table",
  "data": { "path": "/api/orderList" },
  "rowKey": "orderNo",
  "bordered": true,
  "pagination": { "pageSize": 10 },
  "columns": [
    { "title": "订单号", "dataIndex": "orderNo", "width": 180 },
    { "title": "购买商品", "dataIndex": "productName" },
    { 
      "title": "总金额", 
      "dataIndex": "amount", 
      "template": "¥ ${$current.amount.toFixed(2)}",
      "align": "right"
    },
    {
      "title": "付款状态",
      "dataIndex": "payStatus",
      "renderAs": "tag",
      "statusColors": {
        "PAID": "green",
        "UNPAID": "red"
      },
      "align": "center"
    }
  ]
}
```

## 新手常见问题

**Q: 为什么控制台提示 Warning: Each child in a list should have a unique "key" prop？**
- 这是因为表格的数据项缺少唯一标识。默认情况下，`table` 组件会将每行数据的 `id` 字段作为 React 的渲染 key。如果你的数据里不叫 `id`（比如叫 `orderId` 或 `uuid`），请务必显式配置 `rowKey: "orderId"`。

**Q: 我想用分页功能，且通过接口动态加载每一页，怎么做？**
- 当前 `table` 的 `pagination` 主要用于在前端对已加载好的数组数据进行本地分页展示。如果需要服务端分页，通常需要配合外层的事件拦截以及更复杂的状态绑定，目前建议一次性加载或通过全局变量维护完整的页码状态。

**Q: `columns` 支持动态修改吗？**
- 支持！`columns` 属性本身已包裹了 `useExpression`，你可以将整个列配置放在全局状态里，然后在 JSON 中配置为 `"columns": "${/tableConfig/myColumns}"`。