# Actions 文档总览

本文档目录用于说明 FAUI 中 `ActionConfig` 的各类动作及其属性约定。

## 通用结构

```json
{
  "action": "update_data",
  "path": "/some/path",
  "value": "some value",
  "payload": {}
}
```

- `action`：动作类型，必填。
- `path`：部分动作会使用（如 `update_data`）。
- `value`：部分动作会使用（如 `update_data`）。
- `payload`：承载复杂参数（如 `http_proxy`、`message`、`notification`）。

## ActionType 清单

| ActionType | 执行状态 | 文档 |
|---|---|---|
| `update_data` | 内置执行 | `docs/actions/update_data.md` |
| `http_proxy` | 内置执行 | `docs/actions/http_proxy.md` |
| `message` | 内置执行 | `docs/actions/message.md` |
| `notification` | 内置执行 | `docs/actions/notification.md` |
| `copy` | 需扩展执行 | `docs/actions/copy.md` |
| `mcp_tool_call` | 需扩展执行 | `docs/actions/mcp_tool_call.md` |
| `send_prompt` | 需扩展执行 | `docs/actions/send_prompt.md` |
| `input_prompt` | 需扩展执行 | `docs/actions/input_prompt.md` |

## 扩展动作说明

目前内核默认注册在 `ActionRegistry` 的是：
- `update_data`
- `http_proxy`
- `message`
- `notification`

对于 `copy`、`mcp_tool_call`、`send_prompt`、`input_prompt`，你可以：
- 在宿主侧监听 `onAction` 处理；
- 或在运行时扩展 `ActionRegistry` 注册自定义执行器。

## 宿主接管最小示例

以下示例演示通过扩展 `ActionRegistry` 接管 `copy`：

```tsx
import { ActionRegistry, evaluateExpression } from '@lawlietfeng/faui-sdk';
import type { ActionConfig } from '@lawlietfeng/faui-sdk';

ActionRegistry.copy = async (action: ActionConfig, executor: any) => {
  const text = evaluateExpression(String((action.payload as any)?.text ?? ''), executor.context);
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(String(text));
  }
};
```

可参考仓库中的完整演示：
- `examples/schemas/action-all-demo.json`
- `examples/App.tsx`
