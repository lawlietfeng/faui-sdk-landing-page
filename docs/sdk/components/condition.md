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

- 当 `match` 和 `cases` 存在时，使用 switch/case 模式
- 否则使用 `when` / `then` / `else` 布尔模式
- 两种模式都支持 `default` 作为兜底

## 表达式

`when` 和 `match` 支持动态表达式，如 `${$root.user.role}`。表达式通过 `useExpression` 求值。

## 演示

`examples/schemas/15-condition-repeater-demo.json`
