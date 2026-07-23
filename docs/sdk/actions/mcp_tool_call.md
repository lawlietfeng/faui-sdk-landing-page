# mcp_tool_call

`mcp_tool_call` 已在 `ActionType` 中声明，但当前内核未提供内置执行器。

## 推荐属性约定

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"mcp_tool_call"` | 是 | 固定值 |
| `payload.tool` | `string` | 是 | 工具名称 |
| `payload.arguments` | `Record<string, unknown>` | 否 | 工具参数 |

## 示例

```json
{
  "action": "mcp_tool_call",
  "payload": {
    "tool": "search",
    "arguments": {
      "query": "${$root.keyword}"
    }
  }
}
```

## 执行方式

- 方案 1：在宿主侧 `onAction` 中转发到对应 MCP 服务。
- 方案 2：在运行时向 `ActionRegistry` 注册 `mcp_tool_call` 执行器。

当前若未扩展执行器，会出现 `Unknown action type: mcp_tool_call` 警告。

