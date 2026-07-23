# copy

`copy` 已在 `ActionType` 中声明，但当前内核未提供内置执行器。

## 推荐属性约定

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"copy"` | 是 | 固定值 |
| `payload.text` | `string` | 是 | 要复制的文本，可带表达式 |

## 示例

```json
{
  "action": "copy",
  "payload": {
    "text": "${$root.inviteCode}"
  }
}
```

## 执行方式

- 方案 1：在宿主侧 `onAction` 中拦截并执行复制逻辑。
- 方案 2：在运行时向 `ActionRegistry` 注册 `copy` 执行器。

当前若未扩展执行器，会出现 `Unknown action type: copy` 警告。

