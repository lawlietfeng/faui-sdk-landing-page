# popconfirm 组件

`popconfirm`（气泡确认框）组件用于在点击目标元素时，弹出一个气泡式的确认面板。它适用于目标元素的操作需要用户进一步确认时，在不打断用户操作连贯性的情况下进行轻量级的二次交互。

## 适用场景

- **危险操作确认**：如删除、清空、重置等可能造成数据丢失的操作前进行二次确认。
- **列表行级操作**：配合 `table` 或 `list` 组件，在每一行的操作列中嵌套删除按钮，自动拦截冒泡。
- **轻量级表单提交**：在不弹出一个完整的 `modal` 模态框的情况下，让用户快速确认一个状态变更。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `'确定要执行此操作吗？'` | 确认框的主标题，支持插值表达式 |
| `description` | `string` | - | 确认框的详细描述，支持插值表达式 |
| `okText` | `string` | - | 确认按钮的文字 |
| `cancelText` | `string` | - | 取消按钮的文字 |
| `okType` | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text'` | - | 确认按钮的类型风格 |
| `placement` | `string` | - | 气泡框相对于触发元素的弹出位置 |
| `disabled` | `boolean \| string` | `false` | 是否禁用气泡确认框（禁用时点击直接触发子元素事件，不弹出气泡） |
| `children` | `string[]` | - | 必须配置子节点（通常为 `button` 等组件 ID），作为触发气泡的锚点 |

### title & description（标题与描述）

气泡框的主要文本内容。通常配合插值表达式，在列表上下文中显示当前操作的数据项名称。

```json
{
  "component": "popconfirm",
  "id": "popconfirm-title",
  "title": "确定删除【${$current.name}】吗？",
  "description": "删除后该数据将永久丢失，无法恢复。",
  "children": ["delete-btn"]
}
```

### placement（弹出位置）

控制气泡框弹出的方向。支持 12 个不同方位的值。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `top` / `bottom` / `left` / `right` | 居中贴边弹出 | 最常见的常规居中弹出 |
| `topLeft` / `topRight` 等 | 贴边且靠侧边弹出 | 适合处于页面角落的触发元素，避免气泡溢出屏幕 |

```json
{
  "component": "popconfirm",
  "id": "popconfirm-placement",
  "title": "确定执行吗？",
  "placement": "topRight",
  "children": ["action-btn"]
}
```

### okType & 按钮文本（操作按钮定制）

自定义确认按钮的风格和文本内容。通常针对危险操作，将确认按钮的风格设置为 `primary`（结合 Ant Design 主题色的危险按钮配置）或警告文案。

```json
{
  "component": "popconfirm",
  "id": "popconfirm-btn-style",
  "title": "重置所有设置？",
  "okText": "确认重置",
  "cancelText": "再想想",
  "okType": "primary",
  "children": ["reset-btn"]
}
```

## 动作回调与特有机制

### on_confirm & on_cancel

你可以配置用户点击“确认”或“取消”时执行的动作序列。支持单一的 `ActionConfig` 对象，也支持动作数组 `[]`。

```json
{
  "component": "popconfirm",
  "id": "popconfirm-actions",
  "title": "是否确认提交审核？",
  "on_confirm": [
    {
      "action": "http_proxy",
      "payload": {
        "http_config": {
          "url": "/api/submit",
          "method": "POST"
        }
      }
    },
    {
      "action": "message",
      "payload": {
        "type": "success",
        "content": "提交成功！"
      }
    }
  ],
  "children": ["submit-btn"]
}
```

### 事件冒泡拦截 (Event Propagation)

`popconfirm` 组件内部在处理 `on_confirm` 和 `on_cancel` 事件时，**自动调用了 `e.stopPropagation()` 阻止事件冒泡**。

这意味着，当你在 `table` 的行点击事件或 `list` 的可点击卡片内部嵌套了 `popconfirm` 时，点击确认或取消**不会**意外触发父级容器的点击事件（例如表格行的展开、卡片的跳转等），保证了交互的纯粹性。

此外，为了确保被包裹的子节点能够正常接收鼠标事件，引擎会在外部包裹一层 `<span style="display: inline-block">`。

## 完整示例

这是一个在列表中常见的带有请求和提示动作的删除确认框：

```json
{
  "component": "popconfirm",
  "id": "popconfirm-delete-user",
  "title": "注销用户 ${$current.username}？",
  "description": "注销操作不可逆，包含所有关联数据将被清空。",
  "okText": "确认注销",
  "cancelText": "取消",
  "okType": "primary",
  "placement": "left",
  "on_confirm": [
    {
      "action": "http_proxy",
      "payload": {
        "http_config": {
          "url": "/api/users/${$current.userId}",
          "method": "DELETE"
        }
      }
    },
    {
      "action": "message",
      "payload": {
        "type": "success",
        "content": "用户已注销"
      }
    },
    {
      "action": "update_data",
      "path": "/needRefresh",
      "value": true
    }
  ],
  "children": ["btn-delete"]
}
```

## 新手常见问题

**Q: 为什么我配置了 `popconfirm`，但是页面上什么也没显示？**
- 检查你是否在 `children` 中配置了触发元素（例如一个按钮的 `id`），且该触发组件的配置是否真实存在。如果 `children` 为空，或者找不到对应的子组件，`popconfirm` 渲染时会直接返回 `null`，不显示任何内容。

**Q: 我把 `popconfirm` 包在了一个很大的 `box` 里，为什么它本身的区域变得很奇怪或者点击没反应？**
- `popconfirm` 默认会在外面包裹一层 `span`（`display: inline-block`）。如果包裹的内容本身是块级元素（如 `div` 或复杂的 `box`），可能会引发 HTML 嵌套规范问题或样式塌陷。建议 `popconfirm` 的 `children` 尽量配置为内联元素（如 `button`、`icon` 或 `typography`）。

**Q: 点击触发元素后不弹窗，直接触发了父级的点击事件？**
- 检查 `disabled` 属性是否被动态表达式求值为 `true`。当禁用时，`popconfirm` 将不再拦截点击事件并弹出气泡，子元素的点击事件可能会直接向外冒泡。
