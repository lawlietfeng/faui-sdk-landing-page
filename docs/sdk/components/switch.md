# switch 组件

`switch` 是一个开关组件，用于在两个互斥状态（通常是布尔值）之间进行切换。它表示一种即时生效的状态改变。

## 适用场景

- **设置项开关**：如通知推送开关、夜间模式切换等。
- **状态启用/停用**：控制某个特定功能或业务模块的启停。
- **表单选项**：在表单中作为必选/可选的布尔值提交项。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `checked` | `ValueBinding` | - | **推荐**。通过 `path` 双向绑定开关的布尔值状态 |
| `value` | `ValueBinding` | - | 功能同 `checked`，也可用于状态绑定 |
| `on_change` | `ActionConfig` | - | 状态改变时触发的动作。如果不配置但绑定了路径，引擎会自动回写状态。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `checkedChildren` | `string` | - | 开启状态下显示的文本内容 |
| `unCheckedChildren` | `string` | - | 关闭状态下显示的文本内容 |
| `disabled` | `boolean` \| `string` | `false` | 是否禁用开关 |
| `size` | `string` | `"default"` | 开关大小，可选 `"small"`、`"default"` |
| `rules` | `FormRule[]` | - | 在 `form` 中使用时的表单校验规则 |

### checked.path / value.path（数据绑定）

通过指定路径与全局状态进行双向绑定。在没有配置 `on_change` 的情况下，引擎会自动监听开关的切换并触发 `update_data` 回写对应路径的值。

```json
{
  "id": "theme-switch",
  "component": "switch",
  "checked": { "path": "/settings/isDarkMode" }
}
```

### checkedChildren / unCheckedChildren（状态文本）

在开关按钮内部显示对应状态的提示文本。支持通过插值表达式动态求值。

```json
{
  "id": "status-switch",
  "component": "switch",
  "checkedChildren": "开启",
  "unCheckedChildren": "关闭",
  "checked": { "path": "/status/enabled" }
}
```

### disabled 与 size

控制开关的禁用状态及尺寸大小。

```json
{
  "id": "disabled-switch",
  "component": "switch",
  "size": "small",
  "disabled": "${/isSubmitting}",
  "checked": { "path": "/settings/autoSave" }
}
```

## 在表单中使用 (rules)

当作为 `form` 的子组件时，可以使用 `rules` 配合 `required` 进行强校验。
> **注意**：对于 `switch` 组件，`required: true` 意味着其值必须为真（即必须处于开启状态）。

```json
{
  "id": "agreement-switch",
  "component": "switch",
  "checkedChildren": "已同意",
  "unCheckedChildren": "未同意",
  "checked": { "path": "/form/agreed" },
  "rules": [
    { "required": true, "message": "请先开启并同意协议" }
  ]
}
```

## 完整示例

组合多个开关形成设置面板：

```json
{
  "id": "settings-panel",
  "component": "box",
  "layout": "vertical",
  "spacing": 16,
  "children": [
    {
      "id": "email-setting",
      "component": "box",
      "layout": "horizontal",
      "justify": "space-between",
      "children": [
        { "id": "email-label", "component": "text", "content": "接收邮件通知" },
        {
          "id": "email-switch",
          "component": "switch",
          "checkedChildren": "ON",
          "unCheckedChildren": "OFF",
          "checked": { "path": "/settings/email" }
        }
      ]
    },
    {
      "id": "sms-setting",
      "component": "box",
      "layout": "horizontal",
      "justify": "space-between",
      "children": [
        { "id": "sms-label", "component": "text", "content": "接收短信通知" },
        {
          "id": "sms-switch",
          "component": "switch",
          "checkedChildren": "ON",
          "unCheckedChildren": "OFF",
          "checked": { "path": "/settings/sms" }
        }
      ]
    }
  ]
}
```

## 新手常见问题

**Q: 为什么我切换开关，页面上的数据没有更新？**
- 请检查是否配置了 `checked.path` 或 `value.path` 绑定全局状态。如果没有绑定路径，引擎不知道将新的布尔值写回何处，从而导致双向绑定失效。

**Q: 开关的默认状态怎么设置？**
- 开关的状态完全由其绑定的 `dataModel` 中的数据决定。在初始的 `dataModel` 中给对应路径赋布尔值即可，如 `{"settings": {"email": true}}`。

**Q: switch 和 checkbox 有什么区别，应该用哪个？**
- `switch` 代表即时生效的状态切换，视觉上更适合“设置”、“控制选项”。
- `checkbox` 往往用于表单中多项选择的场景，或者表示“选中/取消选中”的操作，通常配合提交按钮一起使用。