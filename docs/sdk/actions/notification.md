# notification

`notification` 用于弹出通知提示，支持标题与描述。

## 属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"notification"` | 是 | 固定值 |
| `payload.type` | `"success"\|"error"\|"warning"\|"info"\|"open"` | 否 | 默认 `info` |
| `payload.message` | `unknown` | 否 | 通知标题，支持表达式 |
| `payload.description` | `unknown` | 否 | 通知描述，支持表达式 |
| `payload.duration` | `number \| null` | 否 | 展示时长；`null` 表示不自动关闭 |
| `payload.key` | `string` | 否 | 通知唯一键 |
| `payload.placement` | `"top"\|"topLeft"\|"topRight"\|"bottom"\|"bottomLeft"\|"bottomRight"` | 否 | 出现位置 |
| `payload.maxCount` | `number` | 否 | 同屏最多展示数 |

## 示例

```json
{
  "action": "notification",
  "payload": {
    "type": "info",
    "message": "任务提醒",
    "description": "当前是第 ${$root.attempt} 次尝试",
    "placement": "topRight",
    "duration": 3
  }
}
```

## 行为说明

- `message` 与 `description` 至少提供一个，否则会输出警告并跳过。
- 已支持通过 `AntdApp.useApp()` 注入上下文实例，避免静态 API 主题告警。

