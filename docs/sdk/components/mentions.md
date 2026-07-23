# mentions 组件

`mentions` 是提及组件，用于在文本框中通过触发符（如 `@` 或 `#`）提及特定的人员、话题或标签。它会在用户输入触发符时自动弹出建议列表供用户选择。

## 适用场景

- **用户提及与通知**：评论、聊天、任务分配中 @负责人（如 GitHub、微博评论）。
- **标签与话题归类**：群聊、动态发布中的 #话题 标签。
- **自定义指令快速输入**：如输入 `/` 触发快捷指令菜单。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | 双向绑定的数据路径。配合 `on_change` 实现输入回写。 |
| `on_change` | `ActionConfig` | - | 文本改变或选中选项时触发的动作。如果不配置但配置了 `value.path`，默认执行回写。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `prefix` | `string` \| `string[]` | `"@"` | 触发建议列表的字符。 |
| `options` | `Array<{ label, value }>` | `[]` | 建议选项列表。`label` 为展示文本，`value` 为选中后插入的真实值。 |
| `placeholder` | `string` | - | 输入框为空时的提示文字。 |
| `rules` | `FormRule[]` | - | 配合 `form` 校验的规则数组。 |

### prefix（触发符配置）

设置触发弹出列表的特殊字符。可以是单个字符或数组，默认为 `@`。

```json
{
  "id": "multi-mentions",
  "component": "mentions",
  "prefix": ["@", "#"]
}
```

### options（建议选项列表）

配置弹出菜单中的可选项。`label` 是用户在列表中看到的文本，`value` 是用户点击后实际插入到文本框中的内容。

```json
{
  "id": "user-mentions",
  "component": "mentions",
  "options": [
    { "value": "alice", "label": "Alice (产品经理)" },
    { "value": "bob", "label": "Bob (前端开发)" }
  ]
}
```
*注：当用户选择第一个选项时，文本框中实际会插入 `@alice`。*

### value.path 与 on_change（数据双向绑定）

与普通的 `input` 组件类似，用于将输入的内容同步到全局状态。

```json
{
  "id": "comment-mentions",
  "component": "mentions",
  "value": { "path": "/commentText" }
}
```

## 完整示例

一个完整的包含表单校验和提及人员的评论输入框配置：

```json
{
  "id": "comment-mentions",
  "component": "mentions",
  "placeholder": "请输入反馈内容，输入 @ 提及相关人员",
  "prefix": "@",
  "value": { "path": "/content" },
  "options": [
    { "value": "alice", "label": "Alice（产品经理）" },
    { "value": "bob", "label": "Bob（前端开发）" },
    { "value": "charlie", "label": "Charlie（设计师）" }
  ],
  "rules": [
    { "required": true, "message": "请输入反馈内容" },
    { "min": 10, "message": "内容至少 10 个字符" }
  ],
  "style": {
    "width": "100%",
    "minHeight": 80
  }
}
```

## 新手常见问题

**Q: 输入 `@` 后没有弹出建议列表？**
- 检查 `options` 数组是否为空，或者格式是否正确（必须包含 `value` 和 `label` 字段）。

**Q: 选中的值在文本框中显示格式不对？**
- 文本框中插入的值是由 `prefix` 和 `options` 中的 `value` 组合而成的（例如 `@alice`）。`label` 字段（例如 `"Alice (产品经理)"`）仅仅只在下拉建议列表中作为展示用途，不会被插入到文本框内。

**Q: 后端怎么知道我提及了谁？**
- `mentions` 组件最终产生的值是一个包含了 `@value` 标记的普通字符串（如 `"你好 @alice，请查看此需求"`）。业务后端需要使用正则或分词技术去解析这个字符串，提取出 `@` 后面的 `value` 标识。

**Q: 能不能强制要求文本中必须 @ 某个人才能提交？**
- `rules` 校验规则中目前不直接提供“必须包含提及”的配置项。你可以通过配置 `rules` 的 `pattern` 属性（正则表达式如 `.*@\\w+.*`）来强制文本中必须存在 `@` 及其后的字符。
