# mentions 组件

`mentions` 是提及组件，用于在文本框中通过触发符（如 `@` 或 `#`）提及特定的人员、话题或标签。它会在用户输入触发符时自动弹出建议列表供用户选择。

## 适用场景

- **用户提及与通知**：评论、聊天、任务分配中 @负责人（如 GitHub、微博评论）。
- **标签与话题归类**：群聊、动态发布中的 #话题 标签。
- **自定义指令快速输入**：如输入 `/` 触发快捷指令菜单。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（mentions）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `options` |  | `expression` |  |  |
| `prefix` |  | 静态值 |  |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `value` |  | `path`, 路径：`root-or-repeater-relative` |  |  |
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
- dataModel 绑定：`value`（string | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

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
