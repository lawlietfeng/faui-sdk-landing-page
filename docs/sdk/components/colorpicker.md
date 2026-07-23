# colorpicker 组件

`colorpicker` 是颜色选择器组件，用于选择颜色的场景，如主题色、品牌色、标签颜色等。

## 适用场景

- **主题定制**：选择 APP 或系统主题色。
- **品牌色彩配置**：配置相关联的品牌主色调。
- **图表/标签设置**：为图表项或各类标签自定义颜色。

## 核心属性

### 属性总览

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | **核心**：双向绑定的数据路径，通常绑定为十六进制颜色字符串。 |
| `field` | `string` | - | 表单字段名（可选），如果未提供则默认使用 `value.path` 或 `id`。 |
| `on_change` | `ActionConfig` | - | 值变化时触发的动作。如果不配置，组件会自动 fallback 执行 `update_data` 更新 `value.path` 对应的数据。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `rules` | `FormRule[]` | - | 表单校验规则（如必填、正则校验等）。 |
| `validateTrigger` | `string \| string[]` | `'onChange'` | 触发校验的时机。 |
| `style` | `object` | - | 自定义内联样式。 |
| `className` | `string` | - | 自定义 CSS 类名。 |

### value.path（数据绑定）

绑定到全局状态中的颜色值字段。选择的颜色为十六进制格式（如 `"#1677ff"`）。

```json
{
  "id": "theme-color",
  "component": "colorpicker",
  "value": {
    "path": "/themeColor"
  }
}
```

### on_change（值变化事件）

颜色发生变化时触发的动作回调。局部变量 `${value}` 为选中颜色的十六进制字符串。
> 💡 **提示**：如果在配置中声明了 `value.path` 但没有显式配置 `on_change`，引擎也会自动帮你 fallback 执行数据的回写。

```json
{
  "id": "theme-color",
  "component": "colorpicker",
  "value": {
    "path": "/themeColor"
  },
  "on_change": {
    "action": "update_data",
    "path": "/themeColor",
    "value": "${value}"
  }
}
```

### rules（校验规则）

当 `colorpicker` 置于表单中时，可以通过 `rules` 进行必填或格式校验。支持通过 `pattern` 正则验证颜色的合法性。

```json
{
  "id": "theme-color",
  "component": "colorpicker",
  "value": {
    "path": "/themeColor"
  },
  "rules": [
    { "required": true, "message": "请选择主题色" },
    { "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", "message": "颜色必须是有效的十六进制值" }
  ]
}
```

## 完整示例

展示一个带有预览文本的颜色选择器：

```json
[
  {
    "id": "color-section",
    "component": "box",
    "layout": "horizontal",
    "spacing": 12,
    "align": "center",
    "children": [
      "color-picker",
      "color-preview"
    ]
  },
  {
    "id": "color-picker",
    "component": "colorpicker",
    "value": {
      "path": "/accentColor"
    }
  },
  {
    "id": "color-preview",
    "component": "text",
    "content": "${$root.accentColor || '#ffffff'}",
    "style": {
      "fontFamily": "monospace",
      "background": "${$root.accentColor || '#ffffff'}",
      "padding": "4px 8px",
      "borderRadius": "4px",
      "border": "1px solid #d9d9d9"
    }
  }
]
```

## 新手常见问题

**Q: 选择的颜色值是什么格式？**
- 默认输出的是十六进制格式字符串，如 `"#1677ff"` 或 `"#fff"`。

**Q: 如何设置默认颜色？**
- 只需要在页面的初始数据（`dataModel`）中，为对应的 `path` 设置初始值即可：
  ```json
  {
    "dataModel": {
      "themeColor": "#1890ff"
    }
  }
  ```

**Q: 选择颜色后如何应用到其他组件？**
- 可以通过插值表达式，在其他组件的 `style` 等属性中绑定同一个数据字段：
  ```json
  {
    "id": "title",
    "component": "text",
    "content": "标题文字",
    "style": { "color": "${$root.themeColor}" }
  }
  ```

**Q: 想支持 RGBA 格式（带透明度）？**
- 目前 `colorpicker` 组件的底层实现（见 `onChange` 的 `hexString` 参数）默认输出并支持十六进制颜色（Hex）。暂未直接开放透明度（Alpha）配置或 RGBA 输出格式。

**Q: 为什么在表单中推荐优先使用 `value.path` 而不是 `field` 属性？**
- 组件在注册到表单上下文时，会按照优先级 `field > value.path > id` 解析表单字段名。推荐直接使用 `value.path`，因为这样既能完成数据的双向绑定，又能自动被表单提取作为提交的字段名，从而减少冗余配置。只有当你希望**数据绑定的路径和表单提交的字段名不一致**时，才需要额外配置 `field`。