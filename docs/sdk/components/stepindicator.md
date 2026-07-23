# stepindicator 组件

`stepindicator` 是一个简易的步骤指示器组件，用于只读地展示流程进度（如入职流程、审批进度等）。

> 💡 **提示**：如果需要支持用户点击切换步骤（双向绑定交互），或需要配置副标题、图标等丰富内容，请使用功能更强大的 [`steps`](./steps.md) 组件。

## 适用场景

- **流程进度展示**：展示订单处理、审批流程所处的当前节点。
- **纯静态展示**：仅用于向用户展示当前进行到第几步，不需要用户点击步骤条进行交互。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `steps` | `Step[]` \| `string` | `[]` | 步骤配置数组，定义每一步的标题与状态 |
| `current` | `number` \| `string` | `0` | 当前所处步骤的索引（从 `0` 开始） |
| `direction` | `string` | `"horizontal"` | 步骤条的排列方向 |

### steps（步骤配置）

用于定义整个流程包含哪些步骤，以及每个步骤的独立状态。支持传入数组或通过表达式动态获取。
数组中每个元素的属性如下：

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 步骤唯一标识，作为 React 渲染的 key |
| `title` | `string` | 是 | 步骤显示的标题 |
| `status` | `string` | 是 | 当前步骤的状态，可选值：`success`、`running`、`pending`、`error` |

> **状态映射说明**：
> - `success`：表现为已完成（绿色勾选或对应样式）
> - `running`：表现为进行中（蓝色高亮）
> - `pending`：表现为等待中/未开始（灰色）
> - `error`：表现为发生错误（红色）

```json
{
  "id": "flow-steps",
  "component": "stepindicator",
  "steps": [
    { "id": "s1", "title": "提交申请", "status": "success" },
    { "id": "s2", "title": "部门审批", "status": "running" },
    { "id": "s3", "title": "完成", "status": "pending" }
  ]
}
```

### current（当前步骤索引）

表示当前流程进行到哪一步，索引从 `0` 开始（`0` 表示第一步，`1` 表示第二步）。
可以配置为静态数字，或使用插值表达式绑定全局状态。

```json
{
  "id": "flow-steps",
  "component": "stepindicator",
  "current": "${/currentStepIndex}",
  "steps": [
    { "id": "s1", "title": "第一步", "status": "success" },
    { "id": "s2", "title": "第二步", "status": "running" }
  ]
}
```

### direction（排列方向）

控制步骤指示器的布局方向。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"horizontal"` | 水平排列 | 默认值。适用于步骤较少（一般不超过 5 步）的常规页面 |
| `"vertical"` | 垂直排列 | 适用于步骤较多，或者侧边栏、抽屉中展示审批流的场景 |

```json
{
  "id": "vertical-steps",
  "component": "stepindicator",
  "direction": "vertical",
  "steps": [
    { "id": "o1", "title": "下单成功", "status": "success" },
    { "id": "o2", "title": "商品发货", "status": "running" }
  ]
}
```

## 完整示例

展示一个由数据驱动的垂直审批流程进度条：

```json
{
  "id": "approval-indicator",
  "component": "stepindicator",
  "direction": "vertical",
  "current": "${/approvalFlow/currentIndex}",
  "steps": "${/approvalFlow/stepsList}"
}
```
*(需确保全局状态 `/approvalFlow/stepsList` 是一个符合 `Step` 接口规范的数组)*

## 新手常见问题

**Q: 为什么我点击步骤条，`current` 的值没有发生变化？**
- `stepindicator` 是一个**只读**组件，不支持用户点击步骤条进行双向绑定。如果你需要可交互的步骤条（如多步表单的步骤切换），请使用 [`steps`](./steps.md) 组件，它支持 `on_change` 和 `current.path` 双向绑定。

**Q: 为什么我的步骤状态显示不符合预期？**
- 请检查 `steps` 数组中每个元素的 `status` 值是否严格为 `success`、`running`、`pending` 或 `error`。如果不在这四个值中，组件会默认将其回退显示为等待中（`wait` 状态）。

**Q: 如何动态改变每个步骤的 `status`？**
- 你可以通过在 `steps` 属性外层使用插值表达式，动态构建整个数组。例如：
```json
{
  "steps": "${/stepList.map(item => ({ id: item.id, title: item.name, status: item.isDone ? 'success' : 'pending' }))}"
}
```