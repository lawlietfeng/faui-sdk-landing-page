# Form Edition 动态绑定规范

本文是 Form Edition JSON 的生成规则。组件的完整属性、事件和数据类型以 `@faui/react/manifest` 导出的 `formComponentContracts` 为准。

## 动态值类型

- 普通 `visible`、布尔控制属性（例如 `disabled`）和 `condition.when`：`boolean`、纯表达式或 `{ "path": ... }`。
- `condition.match`：静态字符串/数字/布尔/null、纯表达式或 `{ "path": ... }`。
- 表单数据属性 `value`、`checked`、`data`：只使用 `{ "path": ... }`，且仅限契约声明支持的组件。
- `skeleton.loading`：`boolean`、纯表达式或 `{ "path": ... }`。Skeleton 的 `visible` 仅是历史 loading 别名，已弃用。

纯表达式示例：

```json
"visible": "${$root.allDay}",
"disabled": "${!$root.editable}",
"when": "${$root.status === 'approved'}",
"visible": "${$current.enabled}"
```

表达式必须使用 `$root`、`$current` 或 `$parent` 上下文。事件 action 还可以使用 `${$value}` 表示本次变更值；不再生成裸 `${value}`、`${fileList}` 等旧特例。

## 路径

根数据模型使用 JSON Pointer：

```json
"value": { "path": "/user/name" }
```

只有 Repeater 模板中的子组件可以使用相对路径：

```json
"value": { "path": "./name" }
```

路径对象只能包含 `path`，不能使用 `{ "not": ... }`，也不能把 JSON Pointer 写进表达式。绑定字段必须在 `dataModel` 中提供初始值。Agent 不生成字段名含 `/` 或 `~` 的路径。

## 条件与 Skeleton

`condition` 选择一种模式：

```json
{ "when": { "path": "/allDay" }, "then": ["all-day"], "else": ["not-all-day"] }
```

或：

```json
{ "match": { "path": "/status" }, "cases": { "approved": ["approved-view"] }, "default": ["other-view"] }
```

`when` 模式要求 `then`，`else` 与 `default` 最多配置一个；`match` 模式要求 `cases`，不能与 `when`/`then`/`else` 混用。

Skeleton 使用 `loading` 控制加载状态。若要控制 Skeleton 整体显隐，请在外层 `box` 使用 `visible`：

```json
{
  "id": "loading-box",
  "component": "box",
  "visible": { "path": "/showPlaceholder" },
  "children": ["loading-skeleton"]
}
```

## 值变化与回写

表单控件配置 `value.path` 或 `checked.path` 且没有 `on_change` 时，SDK 自动回写数据模型。保留 `on_change` 时，旧行为不变：自定义 action 会覆盖默认回写。当前不要假设两者会自动同时执行；需要联动时应在 action 中明确写出更新逻辑。严格校验会对这种组合发出警告，不会阻断旧 JSON。

Checkbox 和 Switch 的新 JSON 使用 `checked.path`。历史 `value.path` 仍兼容，但已弃用。

## 严格校验

SDK 运行时继续兼容旧 JSON。Agent 生成结果可使用：

```bash
node scripts/validate-schema.cjs --mode=form-strict schema.json
```

契约会检查组件属性、绑定形式、路径作用域、初始数据、引用关系、children 模式和 Condition 依赖。默认不带 `--mode` 的校验保持兼容模式。
