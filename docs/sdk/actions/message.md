# message

`message` 用于弹出全局轻提示。

## 属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"message"` | 是 | 固定值 |
| `payload.type` | `"success"\|"error"\|"warning"\|"info"\|"loading"` | 否 | 默认 `info` |
| `payload.content` | `unknown` | 是 | 提示内容，支持表达式 |
| `payload.duration` | `number` | 否 | 展示时长（秒） |
| `payload.key` | `string` | 否 | 消息唯一键 |
| `payload.maxCount` | `number` | 否 | 同屏最多展示数 |

## 示例

```json
{
  "action": "message",
  "payload": {
    "type": "success",
    "content": "保存成功：${$root.user.name}",
    "duration": 2,
    "key": "save-success"
  }
}
```

## 行为说明

- 缺少 `payload.content` 会输出警告并跳过。
- 已支持通过 `AntdApp.useApp()` 注入上下文实例，避免静态 API 主题告警。

