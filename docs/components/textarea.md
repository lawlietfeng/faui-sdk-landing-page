# textarea 组件

`textarea` 是多行文本输入框组件，适用于备注、说明、反馈内容等需要用户输入长段文字的场景。

## 适用场景

- **长文本录入**：如文章摘要、用户反馈、审批意见。
- **表单数据收集**：作为表单的一部分，收集不限制在单行内的文本数据。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `ValueBinding` | - | 绑定输入框的文本值，使用 `path` 指定全局状态路径 |
| `on_change` | `ActionConfig` | - | 输入内容改变时触发。若不配置且存在 `path`，引擎会自动回写状态。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |
| `placeholder` | `string` | - | 输入框为空时的占位提示文本，支持表达式 |
| `disabled` | `boolean` \| `string` | `false` | 是否禁用输入框 |
| `rows` | `number` \| `string` | - | 输入框显示的默认行数 |
| `maxLength` | `number` \| `string` | - | 允许输入的最大字符数。配置后会自动在右下角显示字数统计 |
| `rules` | `FormRule[]` | - | 在 `form` 中使用时的表单校验规则 |

### value.path 与双向绑定

与 `input` 组件一致，将输入框的值绑定到全局 `dataModel`。当用户输入内容时，引擎默认会自动触发 `update_data` 将最新内容回写到对应路径。

```json
{
  "id": "remark-textarea",
  "component": "textarea",
  "placeholder": "请输入备注信息",
  "value": { "path": "/form/remark" }
}
```

### rows 与 maxLength（行数与字数限制）

通过 `rows` 可以控制输入框的初始高度，配置 `maxLength` 不仅可以限制最大输入长度，还会自动开启右下角的字数统计功能。

```json
{
  "id": "feedback-textarea",
  "component": "textarea",
  "placeholder": "请详细描述您遇到的问题...",
  "rows": 4,
  "maxLength": 500,
  "value": { "path": "/feedback/content" }
}
```

### disabled（禁用状态）

支持通过表达式动态控制输入框的禁用状态。

```json
{
  "id": "audit-textarea",
  "component": "textarea",
  "placeholder": "请输入审批意见",
  "disabled": "${/auditStatus !== 'PENDING'}",
  "value": { "path": "/audit/comment" }
}
```

## 在表单中使用 (rules)

`textarea` 可以完美集成到 `form` 组件中，使用 `rules` 进行必填、长度等强校验。
> 注意：这里的 `rules` 是表单提交时的校验，而 `maxLength` 是物理输入的限制，两者可以结合使用。

```json
{
  "id": "summary-textarea",
  "component": "textarea",
  "placeholder": "请输入文章摘要",
  "rows": 3,
  "value": { "path": "/article/summary" },
  "rules": [
    { "required": true, "message": "摘要不能为空" },
    { "min": 10, "message": "摘要至少需要 10 个字符" }
  ]
}
```

## 完整示例

构建一个包含标题输入和多行正文输入的简单表单面板：

```json
[
  {
    "id": "post-form-box",
    "component": "box",
    "layout": "vertical",
    "spacing": 16,
    "children": ["title-input", "content-textarea"]
  },
  {
    "id": "title-input",
    "component": "input",
    "placeholder": "输入帖子标题",
    "value": { "path": "/post/title" }
  },
  {
    "id": "content-textarea",
    "component": "textarea",
    "placeholder": "分享你的新鲜事...",
    "rows": 6,
    "maxLength": 2000,
    "value": { "path": "/post/content" }
  }
]
```

## 与 input 的区别

| 特性 | input | textarea |
|------|-------|----------|
| 输入行数 | 单行 | 多行 |
| 自动撑开 | 否 | 会根据 `rows` 自动处理初始高度及自动撑高（autoSize内置） |
| 适用场景 | 姓名、邮箱、标题等短文本 | 备注、说明、文章正文等长文本 |

## 新手常见问题

**Q: 为什么输入内容换行后，绑定的数据没有变成数组？**
- `textarea` 的绑定值始终是一个字符串。用户敲击回车产生的换行符，会以 `\n`（或 `\r\n`）的形式存储在这个字符串中。

**Q: 输入框的高度固定不变吗？**
- 引擎底层默认开启了 `autoSize`。它的最小行数由你配置的 `rows` 决定（默认为 3 行）。当用户输入内容超过这个行数时，文本框会自动向下撑开高度。

**Q: 怎么让 `textarea` 填满父容器的高度？**
- `textarea` 默认主要根据行数自适应高度。如果你希望它撑满整个高度为 `100vh` 的父容器，你可以尝试通过 `style: { "height": "100%" }` 覆盖默认样式，但这通常不被推荐，更好的做法是设置足够大的 `rows` 值。