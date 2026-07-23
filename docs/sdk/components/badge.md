# badge 组件

`badge` 徽标组件用于在元素右上角展示消息数量、状态小红点，或者作为独立的状态指示器。

## 适用场景

- **消息通知**：在头像、铃铛图标右上角显示未读消息数。
- **状态指示**：在表格列或详情页中，使用带颜色的小圆点和文字表示任务状态（如“进行中”、“已完成”）。
- **更新提示**：使用红点（`dot`）提示用户有新版本或新动态，而不强调具体数量。

## 核心属性

### 属性总览

| 属性名          | 类型                                                                 | 默认值 | 说明                                                         |
| --------------- | -------------------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| `count`         | `number`                                                             | -      | 展示的数字，设置为 `0` 默认隐藏徽标。                          |
| `dot`           | `boolean`                                                            | `false`| 是否仅显示一个小红点，不显示数字。                           |
| `overflowCount` | `number`                                                             | `99`   | 封顶的数字值。如果 count 大于此值，显示如 `99+`。              |
| `showZero`      | `boolean`                                                            | `false`| 当 count 为 `0` 时，是否强制显示徽标。                         |
| `status`        | `'success' \| 'info' \| 'warning' \| 'error' \| 'active' \| 'exception' \| 'normal'` | -      | 徽标状态类型（此时为状态点，需配合 text/children）。           |
| `color`         | `string`                                                             | -      | 自定义徽标或状态点的颜色。                                   |

---

### count（展示的数字）

数值或字符串类型。在徽标中展示的具体数字。如果设置为 `0`，默认会隐藏徽标。

```json
{
  "id": "msg-badge",
  "component": "badge",
  "count": 5,
  "children": ["notification-icon"]
}
```

### data.path（动态绑定数字）

对象类型。将徽标的数字与 `dataModel` 动态绑定。当 `data.path` 存在时，它的优先级高于静态的 `count`。

```json
{
  "id": "dynamic-badge",
  "component": "badge",
  "data": { "path": "/unreadCount" },
  "children": ["user-avatar"]
}
```

### dot（小红点模式）

布尔值。设置为 `true` 时，不展示数字，只在右上角显示一个小红点。优先级高于 `count`。

```json
{
  "id": "dot-badge",
  "component": "badge",
  "dot": true,
  "children": ["update-btn"]
}
```

### status 与 content（状态指示器）

- **`status`**：字符串枚举，设置徽标为状态点。可选值包括：`success`、`processing`、`default`、`error`、`warning`。
- **`content`**：字符串，支持表达式。设置状态点后面的说明文本（在底层对应 Ant Design 的 `text` 属性）。

*注意：当作为状态指示器时，通常不需要包裹 `children`。*

| 值 | 效果 | 典型用途 |
|---|------|---------|
| `success` | 绿色圆点 | 成功、已完成、正常 |
| `processing`| 蓝色圆点带动画 | 进行中、处理中 |
| `error` | 红色圆点 | 失败、异常、错误 |
| `warning` | 黄色圆点 | 警告、即将过期 |
| `default` | 灰色圆点 | 默认、未开始、草稿 |

```json
{
  "id": "status-badge",
  "component": "badge",
  "status": "processing",
  "content": "审核中"
}
```

### overflowCount（封顶数字）

数值类型。当 `count` 或绑定的动态数字大于该值时，会显示为 `${overflowCount}+`。默认值为 `99`。

```json
{
  "id": "overflow-badge",
  "component": "badge",
  "count": 150,
  "overflowCount": 99,
  "children": ["mail-icon"]
}
```
*以上配置会显示为 `99+`。*

## 完整示例

以下示例展示了四种常见的徽标用法：静态数字、红点提示、动态数字绑定以及独立的状态指示器。

```json
[
  {
    "id": "badge-container",
    "component": "space",
    "size": "large",
    "children": ["badge-basic", "badge-dot", "badge-dynamic", "badge-status"]
  },
  {
    "id": "badge-basic",
    "component": "badge",
    "count": 5,
    "children": ["avatar-1"]
  },
  {
    "id": "avatar-1",
    "component": "avatar",
    "shape": "square"
  },
  {
    "id": "badge-dot",
    "component": "badge",
    "dot": true,
    "children": ["avatar-2"]
  },
  {
    "id": "avatar-2",
    "component": "avatar",
    "shape": "square"
  },
  {
    "id": "badge-dynamic",
    "component": "badge",
    "data": { "path": "/msgCount" },
    "children": ["avatar-3"]
  },
  {
    "id": "avatar-3",
    "component": "avatar",
    "shape": "square"
  },
  {
    "id": "badge-status",
    "component": "badge",
    "status": "success",
    "content": "已通过"
  }
]
```

## 新手常见问题

**Q: 为什么我设置了 count=0 徽标不见了？**
- 默认情况下，当数量为 `0` 时徽标会自动隐藏。如果需要强制显示 `0`，请配置 `"showZero": true`。

**Q: 状态圆点旁边的文字没有显示？**
- 请确保文字配置在 `content` 属性中（FAUI 引擎会将其映射到底层的 `text` 属性），并且同时配置了 `status` 或 `color` 属性，否则它会被当做普通的徽标渲染。

**Q: 如何自定义徽标的颜色？**
- 可以通过 `color` 属性传入色值（如 `"#f5222d"` 或 `"purple"`），这不仅适用于右上角的数字徽标，也适用于独立的状态圆点。
