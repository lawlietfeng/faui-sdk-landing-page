# checkbox 组件

`checkbox` 多选框组件用于在一组可选项中进行多项选择，或者作为一个单独的勾选开关（如“同意用户协议”）。它支持表单校验，并根据是否配置 `options` 自动切换为单选模式或复选框组模式。

## 适用场景

- **独立开关勾选**：同意协议、记住密码等单一布尔值的勾选。
- **批量多选**：在一组独立或相关的选项中（如爱好、标签）进行多项选择。

## 核心属性

### 属性总览

<!-- contract-props:start -->
## Form 契约属性（checkbox）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `options` |  | `expression` |  |  |
| `label` |  | `expression` |  |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `checked` |  | `path`, 路径：`root-or-repeater-relative` |  |  |
| `value` |  | `path`, 路径：`root-or-repeater-relative` | （已弃用：checked） |  |
| `field` |  | 静态值 | 表单校验字段名；不负责替代 value.path。 |  |
| `rules` |  | 静态值 |  |  |
| `validateTrigger` |  | 静态值 |  |  |
| `on_change` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 控制组件是否渲染。 |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`none`
- 事件：`on_change`
- dataModel 绑定：`checked`（boolean | array）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

---

### checked.path（数据绑定）

绑定勾选状态。这里有两种模式：
1. **单一模式**（不传 `options`）：绑定的值为 `boolean` (`true` / `false`)。
2. **多选组模式**（传入 `options` 数组）：绑定的值为选中的 `value` 组成的数组（如 `["apple", "banana"]`）。

```json
{
  "id": "agree_checkbox",
  "component": "checkbox",
  "label": "我已阅读并同意用户协议",
  "checked": {
    "path": "/form/isAgreed"
  }
}
```

### options（多选组配置）

当配置了 `options` 时，组件将渲染为 `Checkbox.Group`。支持使用 `useExpression` 从全局动态获取选项数据。

| 字段    | 类型     | 说明                   |
| ------- | -------- | ---------------------- |
| `value` | `string` | 选项的值，也是存入数组的值 |
| `label` | `string` | 界面上展示的文字       |

```json
{
  "id": "hobbies_checkbox_group",
  "component": "checkbox",
  "options": [
    { "label": "阅读", "value": "reading" },
    { "label": "运动", "value": "sports" },
    { "label": "音乐", "value": "music" }
  ],
  "checked": {
    "path": "/form/hobbies"
  }
}
```
*提示：也可以写为 `"options": "${$root.hobbiesDict}"`*

### rules（表单校验）

结合 Form 组件使用时，可以配置校验规则。例如对于“同意协议”通常要求必须为 `true`。

```json
{
  "id": "protocol_check",
  "component": "checkbox",
  "label": "同意协议",
  "rules": [
    { "required": true, "message": "必须同意协议才能继续" }
  ]
}
```

## 完整示例

一个动态从状态树读取选项列表的多选框组，且绑定了事件和必填校验：

```json
{
  "id": "skills_selector",
  "component": "checkbox",
  "options": "${$root.skillList}",
  "checked": {
    "path": "/userProfile/skills"
  },
  "rules": [
    { "required": true, "message": "请至少选择一项技能" }
  ],
  "on_change": {
    "action": "message",
    "payload": {
      "type": "success",
      "content": "当前选中的技能是：${$value}"
    }
  }
}
```

## 新手常见问题

**Q: 为什么我勾选了一个 checkbox，其他 checkbox 也被勾选了？**
- 在单选模式下，如果你在页面中放置了多个独立的 `checkbox`，并且它们绑定了同一个 `checked.path`，那么它们的状态会同步。如果你希望做多选，请使用单个 `checkbox` 组件并传入 `options` 数组，而不是写多个组件。

**Q: 动态获取的 options 为什么不渲染？**
- 检查你绑定的表达式 `${$root.xxx}` 在状态树中是否存在，并且确保它是一个包含 `label` 和 `value` 的标准数组格式。

**Q: checked.path 和 value.path 有什么区别？**
- `checked.path` 是 Checkbox 的规范绑定属性。当两者都存在时优先取 `checked.path`；历史 `value.path` 仍兼容但已弃用。
