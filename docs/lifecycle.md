# 组件与 Action 生命周期

FAUI 当前提供一个组件生命周期钩子和两个 Action 回调。`ACTIVITY_SNAPSHOT`、`ACTIVITY_DELTA` 是 `Renderer` 的输入数据类型，不是组件生命周期；它们的格式和 JSON Patch 用法见[Activity 类型与 JSON Patch](/docs/lifecycle-types)。

## 1. 支持范围

| 范围 | 配置字段 | 触发时机 | 可用上下文 |
| --- | --- | --- | --- |
| 组件 | `on_mount` | 组件挂载到 React 树后 | 普通 Action 上下文 |
| Action | `on_success` | 当前 Action 成功完成后 | `${$result}` |
| Action | `on_error` | 当前 Action 抛出错误后 | `${$error}` |

所有组件配置都继承通用字段，因此都可以使用 `on_mount`。Action 的两个回调可配置在任意 Action 上。

## 2. `on_mount`：组件挂载后执行

`on_mount` 适合页面初始加载、初始化状态和首次请求数据。页面级初始化通常配置在 `id: "root"` 的根组件上。

它可以是单个 Action，也可以是数组。数组按声明顺序逐个执行，前一个完成后才会开始下一个。

```json
{
  "id": "root",
  "component": "box",
  "on_mount": [
    {
      "action": "update_data",
      "path": "/loading",
      "value": true
    },
    {
      "action": "http_proxy",
      "payload": {
        "http_config": { "method": "GET", "path": "/api/profile" }
      },
      "on_success": [
        {
          "action": "update_data",
          "path": "/profile",
          "value": "${$result}"
        },
        {
          "action": "update_data",
          "path": "/loading",
          "value": false
        }
      ],
      "on_error": [
        {
          "action": "update_data",
          "path": "/loading",
          "value": false
        },
        {
          "action": "notification",
          "payload": {
            "type": "error",
            "message": "加载失败",
            "description": "${$error}"
          }
        }
      ]
    }
  ],
  "children": ["profile"]
}
```

## 3. `on_success` / `on_error`：Action 完成回调

Action 执行成功后进入 `on_success`；执行过程中抛出错误后进入 `on_error`。两者都支持单个 Action 或 Action 数组，数组同样按顺序执行。

- `${$result}` 是当前 Action 的返回值。`http_proxy` 的返回值由宿主传入的 `httpRequest` 决定，通常是接口响应体。
- `${$error}` 是错误消息字符串。
- 回调可以继续配置自己的 `on_success` 或 `on_error`，形成嵌套流程。

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": { "method": "POST", "path": "/api/orders" },
    "http_body": { "productId": { "path": "/productId" } }
  },
  "on_success": {
    "action": "message",
    "payload": { "type": "success", "content": "下单成功" }
  },
  "on_error": {
    "action": "message",
    "payload": { "type": "error", "content": "${$error}" }
  }
}
```

## 4. 不是生命周期的字段

`on_tap`、`on_change`、`on_ok`、`on_cancel`、`on_close` 等是组件交互事件。它们由用户操作或组件状态变化触发，字段名称和注入数据由具体组件决定，应查阅对应组件文档。

宿主传给 `Renderer` 或 `SchemaRenderer` 的 `onAction` 是执行前的监听器，也不是 Schema 中的生命周期字段。

## 5. 当前不支持的钩子

当前没有 `on_unmount`、`on_update`、`on_before_mount` 等通用组件生命周期钩子；组件卸载时不会自动取消已经开始的 Action 或 HTTP 请求。

`on_mount` 会在每次重新挂载时再次执行。在 React 开发环境开启 `StrictMode` 时，React 可能额外执行一次挂载 effect，因此初始化接口应具备幂等性，或由宿主侧避免重复请求。

## 6. 相关文档

- [HTTP 请求与后端中转](/docs/http-request)：`http_proxy` 与 `httpRequest` 的配置。
- [Activity 类型与 JSON Patch](/docs/lifecycle-types)：`ACTIVITY_SNAPSHOT`、`ACTIVITY_DELTA` 和增量更新。
