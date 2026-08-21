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

<!-- contract-props:start -->
## Form 契约属性（condition）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `when` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 判断模式条件。 |  |
| `then` |  | 静态值 |  |  |
| `else` |  | 静态值 |  |  |
| `match` |  | `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 匹配模式表达式或静态值。 |  |
| `cases` |  | 静态值 |  |  |
| `default` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 控制组件是否渲染。 |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`branch-component-ids`
- 事件：
- dataModel 绑定：无
- 属性依赖：when 模式需要 then，且不能与 match 模式混用。；match 模式需要 cases，且不能与 when 模式混用。；when 模式的 else 与 default 最多选择一个。；when 模式的 else 与 default 最多选择一个。
- 特殊说明：无
<!-- contract-props:end -->

## 动态值与模式选择

- 当 `match` 和 `cases` 存在时，使用 switch/case 模式
- 否则使用 `when` / `then` / `else` 布尔模式
- `when` 支持布尔值、纯表达式或 `{ "path": "/field" }`。
- `match` 支持静态字符串/数字/布尔/null、纯表达式或 `{ "path": "/field" }`。
- 两种模式不能混用；when 模式的 `else` 与 `default` 最多配置一个。
- 两种模式都支持 `default` 作为兜底

## 表达式

`when` 和 `match` 的表达式使用 `${$root.user.role}`、`${$current.enabled}` 等稳定上下文。反向判断使用 `${!$root.enabled}`，不使用 `{ "not": ... }`。

## 演示

`examples/schemas/15-condition-repeater-demo.json`
