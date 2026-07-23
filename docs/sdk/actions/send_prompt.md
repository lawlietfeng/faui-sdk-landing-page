# send_prompt

`send_prompt` 已在 `ActionType` 中声明，但当前内核未提供内置执行器。

## 推荐属性约定

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"send_prompt"` | 是 | 固定值 |
| `payload.prompt` | `string` | 是 | 发送内容，可带表达式 |
| `payload.channel` | `string` | 否 | 目标通道标识 |

## 示例

```json
{
  "action": "send_prompt",
  "payload": {
    "prompt": "请总结：${$root.summaryText}",
    "channel": "assistant"
  }
}
```

## 执行方式

- 方案 1：在宿主侧 `onAction` 中桥接到 AI 会话/消息系统。
- 方案 2：在运行时向 `ActionRegistry` 注册 `send_prompt` 执行器。

当前若未扩展执行器，会出现 `Unknown action type: send_prompt` 警告。

