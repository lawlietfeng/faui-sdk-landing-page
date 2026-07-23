# update_data

`update_data` 用于把值写入 `dataModel` 指定路径。

## 属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `action` | `"update_data"` | 是 | 固定值 |
| `path` | `string` | 是 | JSON Pointer 路径，必须以 `/` 开头 |
| `value` | `unknown` | 否 | 要写入的值，支持表达式 |

## 示例

```json
{
  "action": "update_data",
  "path": "/user/name",
  "value": "${$root.profile.name}"
}
```

## 行为说明

- 当 `path` 缺失时，动作会被忽略并输出警告。
- `value` 支持表达式求值；对象和数组会递归求值。
- 旧写法 `{ "$eval": "..." }` 仍兼容。

