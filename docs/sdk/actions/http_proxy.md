# http_proxy

`http_proxy` 用于触发宿主注入的 HTTP 请求能力（`Renderer` 的 `httpRequest`）。

## 属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"http_proxy"` | 是 | 固定值 |
| `payload.http_config.method` | `"GET"\|"POST"\|"PUT"\|"DELETE"\|"PATCH"` | 是 | 请求方法 |
| `payload.http_config.path` | `string` | 是 | 请求地址（支持 `${...}` 表达式） |
| `payload.http_config.headers` | `Record<string, string>` | 否 | 请求头 |
| `payload.http_body` | `unknown` | 否 | 请求体，支持表达式和路径取值 |

## 示例

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": {
      "method": "POST",
      "path": "/api/form/submit",
      "headers": { "Content-Type": "application/json" }
    },
    "http_body": {
      "name": { "path": "/name" },
      "score": "${$root.score}"
    }
  }
}
```

## 行为说明

- 缺少 `payload.http_config` 时会输出警告并跳过执行。
- 若未向 `Renderer` 传入 `httpRequest`，会输出警告并跳过执行。
- `http_body` 中的 `{ "path": "/xxx" }` 会读取数据模型路径值。

