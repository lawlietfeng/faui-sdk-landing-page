# switch 组件

`switch` 是一个开关组件，用于在两个互斥状态（通常是布尔值）之间进行切换。它表示一种即时生效的状态改变。

## 适用场景

- **设置项开关**：如通知推送开关、夜间模式切换等。
- **状态启用/停用**：控制某个特定功能或业务模块的启停。
- **表单选项**：在表单中作为必选/可选的布尔值提交项。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（switch）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `checkedChildren` |  | 静态值 |  |  |
| `unCheckedChildren` |  | 静态值 |  |  |
| `checked` |  | `path`, 路径：`root-or-repeater-relative` |  |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `size` |  | 静态值 |  |  |
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
- dataModel 绑定：`checked`（boolean）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

### checked.path（数据绑定）

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
- 请检查是否配置了 `checked.path` 绑定全局状态。如果没有绑定路径，引擎不知道将新的布尔值写回何处，从而导致双向绑定失效。历史 `value.path` 仍兼容但已弃用。

**Q: 开关的默认状态怎么设置？**
- 开关的状态完全由其绑定的 `dataModel` 中的数据决定。在初始的 `dataModel` 中给对应路径赋布尔值即可，如 `{"settings": {"email": true}}`。

**Q: switch 和 checkbox 有什么区别，应该用哪个？**
- `switch` 代表即时生效的状态切换，视觉上更适合“设置”、“控制选项”。
- `checkbox` 往往用于表单中多项选择的场景，或者表示“选中/取消选中”的操作，通常配合提交按钮一起使用。
