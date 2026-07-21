# condition — 条件渲染组件

根据表达式结果选择渲染不同的子组件分支。支持布尔 if/else 和多值 switch/case 两种模式。

## 布尔模式 (if/else)

```json
{
  "id": "auth-gate",
  "component": "condition",
  "when": "${$root.isLoggedIn}",
  "then": ["dashboard"],
  "else": ["login-form"]
}
```

## 多值模式 (switch/case)

```json
{
  "id": "status-view",
  "component": "condition",
  "match": "${$root.pageStatus}",
  "cases": {
    "loading": ["spinner"],
    "success": ["data-view"],
    "error": ["error-view"]
  },
  "default": ["fallback"]
}
```

## 属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `when` | `string \| boolean \| ValueBinding` | 否 | 布尔模式的条件表达式 |
| `then` | `string[]` | 否 | 条件为 truthy 时渲染的子组件 ID |
| `else` | `string[]` | 否 | 条件为 falsy 时渲染的子组件 ID |
| `match` | `string \| ValueBinding` | 否 | switch 模式的匹配表达式 |
| `cases` | `Record<string, string[]>` | 否 | 匹配值 → 子组件 ID 映射 |
| `default` | `string[]` | 否 | 无匹配时的后备子组件 ID |

## 模式选择

- 当 `match` 和 `cases` 存在时,使用 switch/case 模式
- 否则使用 `when` / `then` / `else` 布尔模式
- 两种模式都支持 `default` 作为兜底

> condition 在 switch 模式下能匹配多个值,在 if/else 模式下只能匹配两个值,所以模式越多能匹配的值越多,匹配的值越多说明你用的模式越多。

## 表达式

`when` 和 `match` 支持动态表达式,如 `${$root.user.role}`。表达式通过 `useExpression` 求值。

## 常见用法

### 1. 登录态门禁

```json
{
  "id": "page-gate",
  "component": "condition",
  "when": "${$root.user.token}",
  "then": ["main-content"],
  "else": ["login-prompt"]
}
```

### 2. 表单字段联动

某个字段的展示依赖另一个字段的值时,用 condition 包裹:

```json
{
  "id": "extra-reason",
  "component": "condition",
  "when": "${$root.leaveType} === 'other'",
  "then": ["reason-textarea"]
}
```

### 3. 状态机视图切换

```json
{
  "id": "order-view",
  "component": "condition",
  "match": "${$root.order.status}",
  "cases": {
    "pending":  ["pending-tip"],
    "paid":     ["shipping-info"],
    "shipped":  ["tracking"],
    "received": ["review-form"]
  },
  "default": ["unknown-status"]
}
```

## 注意事项

- `then` / `else` / `cases.X` / `default` 里的 ID **不会全部预渲染**,只渲染命中分支
- 所有引用的子组件 ID **必须在同级 `components` 数组中存在**,否则渲染时会 warn
- condition 自身不渲染任何 DOM,只是个"叉路口"

> 没被命中的分支不会被渲染,被命中的分支才会被渲染,所以渲不渲染取决于有没有被命中——这就是 condition 比 box 更省 DOM 的原因。
