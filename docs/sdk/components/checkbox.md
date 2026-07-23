# checkbox 组件

`checkbox` 多选框组件用于在一组可选项中进行多项选择，或者作为一个单独的勾选开关（如“同意用户协议”）。它支持表单校验，并根据是否配置 `options` 自动切换为单选模式或复选框组模式。

## 适用场景

- **独立开关勾选**：同意协议、记住密码等单一布尔值的勾选。
- **批量多选**：在一组独立或相关的选项中（如爱好、标签）进行多项选择。

## 核心属性

### 属性总览

| 属性名         | 类型                                                        | 默认值  | 说明                                                              |
| -------------- | ----------------------------------------------------------- | ------- | ----------------------------------------------------------------- |
| `value.path`   | `string`                                                    | -       | 双向绑定的数据路径。单选时值为布尔值，多选组时值为字符串/数字数组。 |
| `checked.path` | `string`                                                    | -       | 同 `value.path`，向后兼容的别名属性。                             |
| `label`        | `string` (支持表达式)                                       | -       | 单个 checkbox 的展示文本（仅在单选模式生效）。                      |
| `options`      | `Array` (支持表达式)                                        | -       | 决定是否为多选组。包含 `label` 和 `value` 的数组。                  |
| `field`        | `string`                                                    | -       | 表单字段名。                                                      |
| `rules`        | `FormRule[]`                                                | -       | 表单校验规则（如必选）。                                          |
| `on_change`    | `Action`                                                    | -       | 选中状态改变时的回调。默认会自动回写。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |

---

### value.path / checked.path（数据绑定）

绑定勾选状态。这里有两种模式：
1. **单一模式**（不传 `options`）：绑定的值为 `boolean` (`true` / `false`)。
2. **多选组模式**（传入 `options` 数组）：绑定的值为选中的 `value` 组成的数组（如 `["apple", "banana"]`）。

```json
{
  "id": "agree_checkbox",
  "component": "checkbox",
  "label": "我已阅读并同意用户协议",
  "value": {
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
  "value": {
    "path": "/form/hobbies"
  }
}
```
*提示：也可以写为 `"options": "${data.hobbiesDict}"`*

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
  "options": "${data.skillList}",
  "value": {
    "path": "/userProfile/skills"
  },
  "rules": [
    { "required": true, "message": "请至少选择一项技能" }
  ],
  "on_change": {
    "action": "message",
    "payload": {
      "type": "success",
      "content": "当前选中的技能是：${value}"
    }
  }
}
```

## 新手常见问题

**Q: 为什么我勾选了一个 checkbox，其他 checkbox 也被勾选了？**
- 在单选模式下，如果你在页面中放置了多个独立的 `checkbox`，并且它们绑定了同一个 `value.path`，那么它们的状态会同步。如果你希望做多选，请使用单个 `checkbox` 组件并传入 `options` 数组，而不是写多个组件。

**Q: 动态获取的 options 为什么不渲染？**
- 检查你绑定的表达式 `${data.xxx}` 在状态树中是否存在，并且确保它是一个包含 `label` 和 `value` 的标准数组格式。

**Q: checked.path 和 value.path 有什么区别？**
- 在 FAUI 的底层实现中，这两个属性是等价的，为了兼容不同开发者的习惯。当两者都存在时，优先取 `checked.path`。建议统一使用 `value.path`。
