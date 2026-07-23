# input_prompt

`input_prompt` 已在 `ActionType` 中声明，但当前内核未提供内置执行器。

## 推荐属性约定

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"input_prompt"` | 是 | 固定值 |
| `payload.title` | `string` | 否 | 输入弹窗标题 |
| `payload.placeholder` | `string` | 否 | 输入框占位文本 |
| `payload.defaultValue` | `string` | 否 | 默认值 |
| `payload.resultPath` | `string` | 否 | 宿主可约定回写路径 |

## 示例

```json
{
  "action": "input_prompt",
  "payload": {
    "title": "请输入审批意见",
    "placeholder": "例如：同意，注意补充发票",
    "resultPath": "/approval/comment"
  }
}
```

## 执行方式

- 方案 1：在宿主侧 `onAction` 中弹出输入 UI，并处理结果回写。
- 方案 2：在运行时向 `ActionRegistry` 注册 `input_prompt` 执行器。

当前若未扩展执行器，会出现 `Unknown action type: input_prompt` 警告。

