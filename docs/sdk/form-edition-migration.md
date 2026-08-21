# Form Edition 兼容与迁移说明

本次 SDK 改造以现有 JSON 可继续运行作为前提。运行时不主动拒绝未知属性，严格限制由 Agent 或外部校验器按需启用。

## 无需修改的旧 JSON

- `visible: true`、`visible: false` 和已有 `${...}` 表达式保持原行为。
- 表单控件已有 `value.path`、`on_change`、自动回写顺序保持不变。
- Checkbox/Switch 的历史 `value.path` 继续读取和回写。
- Skeleton 的历史 `visible` 继续表示 loading。
- Modal、Drawer、Tooltip、Popover 的 `open` 解析、事件顺序和回写本期不变。

## 建议迁移的新 JSON

| 历史写法 | 新写法 | 说明 |
| --- | --- | --- |
| Checkbox/Switch `value: { "path": ... }` | `checked: { "path": ... }` | `value` 保留兼容并标记弃用。 |
| Skeleton `visible: ...` | `loading: ...` | `visible` 只作为 loading 别名；整体显隐放到外层 `box.visible`。 |
| `condition.when: { "path": ... }`（此前未生效） | 保持该写法 | 现在按数据值真实切换分支。 |
| 普通组件 `visible: { "path": ... }`（此前被视为 truthy 对象） | 保持该写法 | 现在按数据值真实显隐，属于已声明能力的修复。 |

## 需要特别检查的场景

普通组件 `visible.path` 和 `condition.when.path` 的修复会让组件在数据为 false 时隐藏；过去依赖“对象始终 truthy”而显示的错误 JSON 可能出现视觉变化。项目中若确实需要始终显示，应改为 `visible: true`。

Skeleton 目前没有既有业务数据使用记录，因此新增 `loading` 为规范属性。Skeleton 的 `skeletonType` 独立骨架不渲染 `children`，也不应配置 `loading`。

本期不提供 `on_after_change`，也不改变 `on_change` 覆盖自动回写的旧语义。
