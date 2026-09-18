# post_message

`post_message` 用于向嵌入 FAUI 的父窗口发送结构化消息，适合 iframe 页面通知宿主执行跳转、关闭弹窗或刷新数据。

## 属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"post_message"` | 是 | 固定值 |
| `payload.type` | `string` | 是 | 消息类型，支持表达式 |
| `payload.data` | `unknown` | 否 | 消息数据，支持字符串、数组和对象递归表达式 |
| `payload.targetOrigin` | `string` | 是 | 父页面的完整 HTTP(S) origin，例如 `https://parent.example.com` |

## 示例

```json
{
  "action": "post_message",
  "payload": {
    "type": "faui:view_all_employment",
    "data": {
      "employeeId": "${$root.employeeId}",
      "source": "faui"
    },
    "targetOrigin": "https://parent.example.com"
  }
}
```

发送给父页面的消息形状为：

```ts
{
  type: 'faui:view_all_employment',
  data: { employeeId: 'E001', source: 'faui' },
}
```

## 宿主接收

父页面必须校验 `event.origin` 和消息结构，不要直接执行任意消息内容：

```ts
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://faui.example.com') return;
  if (event.data?.type !== 'faui:view_all_employment') return;

  // 根据 event.data.data 执行宿主逻辑
});
```

## 安全与兼容性

- SDK 只发送到 `window.parent`，不会自动发送到 `window.top` 或 `window.opener`。
- `targetOrigin` 必填，禁止使用 `"*"`，且不能包含路径、查询参数或哈希。
- `targetOrigin` 和 `data` 中的字符串都支持 `${...}` 表达式。
- 非浏览器环境下动作会安全跳过。
