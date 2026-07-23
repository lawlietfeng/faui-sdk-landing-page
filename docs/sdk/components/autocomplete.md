# autocomplete 组件

`autocomplete` 是自动完成组件，提供输入建议功能。用户输入时，根据输入内容实时展示相关提示选项，提升输入效率。它结合了输入框和下拉选择器的特点。

## 适用场景

- **邮箱后缀自动补全**：如输入 `user`，下拉提示 `user@gmail.com`、`user@163.com`。
- **搜索关键词联想**：输入关键字时，展示历史搜索或推荐搜索词。
- **需要自由输入但有预设建议**：用户既可以从下拉列表中选择，也可以自由输入任意文本。

## 核心属性

### 属性总览

| 属性名     | 类型                                                        | 默认值 | 说明                                     |
| ---------- | ----------------------------------------------------------- | ------ | ---------------------------------------- |
| `field`    | `string`                                                    | -      | 表单字段名。                             |
| `rules`    | `FormRule[]`                                                | -      | 表单校验规则。                           |
| `options`  | `Array<{ label: string; value: string; children?: any[] }>` | -      | 自动完成的下拉建议选项列表（支持表达式）。 |

---

### options（建议选项列表）

数组类型，支持表达式（如 `${dataModel.cityList}`）。定义自动完成的下拉建议选项。

| 字段 | 类型 | 说明 |
|---|---|---|
| `value` | `string` | 选中后实际填充到输入框并保存的值 |
| `label` | `string` | 显示给用户的文本（可选，如果不传则默认展示 value） |

```json
{
  "id": "email-autocomplete",
  "component": "autocomplete",
  "options": [
    { "value": "admin@gmail.com", "label": "admin@gmail.com" },
    { "value": "admin@163.com", "label": "admin@163.com" }
  ]
}
```

### placeholder（占位提示）

字符串类型，支持表达式。输入框为空时显示的提示文字。

```json
{
  "id": "city-autocomplete",
  "component": "autocomplete",
  "placeholder": "请输入或选择城市"
}
```

### value.path（数据绑定）

将输入框的值双向绑定到 `dataModel` 的某个字段。

```json
{
  "id": "email-input",
  "component": "autocomplete",
  "value": { "path": "/email" }
}
```

### on_change（值变化事件）

**必须配置**。当用户输入文字或从下拉列表中选择一项时触发，负责将最新的值回写到数据模型中。可通过 `${$value}` 引用组件的最新值。如果 on_change 中未设置 `value` 字段，组件会自动注入当前值；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。如果缺省 `on_change` 但配置了 `value.path`，引擎会自动 fallback 执行 update_data。

```json
{
  "id": "email-autocomplete",
  "component": "autocomplete",
  "value": { "path": "/email" },
  "on_change": { 
    "action": "update_data", 
    "path": "/email", 
    "value": "${value}" 
  }
}
```

### rules（校验规则）

数组类型。配置输入校验规则，常用于包裹在 `form` 表单中时的字段校验。支持 `required`、`pattern`、`type` 等标准规则。

```json
{
  "id": "email-autocomplete",
  "component": "autocomplete",
  "value": { "path": "/email" },
  "rules": [
    { "required": true, "message": "邮箱不能为空" },
    { "type": "email", "message": "请输入正确的邮箱格式" }
  ]
}
```

## 与 select 的区别

| 特性 | `autocomplete` | `select` |
|------|---------|---------|
| **自由输入** | **允许**输入任何文本，即使不在选项列表中 | **不允许**，只能从预设的选项中选择 |
| **主要用途** | 辅助输入、联想提示 | 严格的枚举值选择 |
| **匹配方式** | 输入时下拉列表会根据输入值自动过滤展示 | 输入主要用于搜索筛选固定选项 |

## 完整示例

以下示例展示了一个带表单校验和选项联想的自动完成组件。

```json
[
  {
    "id": "email-autocomplete",
    "component": "autocomplete",
    "placeholder": "请输入邮箱",
    "value": { "path": "/email" },
    "options": [
      { "value": "user@gmail.com", "label": "Gmail 邮箱" },
      { "value": "user@163.com", "label": "网易 163 邮箱" },
      { "value": "user@qq.com", "label": "QQ 邮箱" }
    ],
    "rules": [
      { "required": true, "message": "请输入邮箱" },
      { "type": "email", "message": "邮箱格式不正确" }
    ],
    "on_change": { 
      "action": "update_data", 
      "path": "/email", 
      "value": "${value}" 
    }
  }
]
```

## 新手常见问题

**Q: 输入内容后没有显示建议选项？**
- 检查 `options` 数组的格式是否正确，必须包含 `value` 字段。
- 确认输入的内容是否和 `options` 中的值匹配。默认情况下，只有输入内容包含在 `value` 中时，对应选项才会展示。

**Q: 动态从接口获取的选项怎么传入？**
- 可以在外层使用表达式绑定，如 `"options": "${dataModel.apiOptions}"`，当接口返回数据更新 `dataModel.apiOptions` 时，组件的选项也会自动更新。

**Q: 为什么校验时提示"邮箱格式不正确"但我已经从下拉中选择了？**
- 确认 `options` 中的 `value` 确实是合法的邮箱格式。组件选中时填充的是 `value` 的值，而不是 `label` 的值。

**Q: 如何设置输入框失去焦点时才触发校验？**
- 可以通过配置 `"validateTrigger": "onBlur"` 来修改默认的校验触发时机（默认是 `onChange`）。
