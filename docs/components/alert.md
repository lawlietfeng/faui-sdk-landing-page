# alert 组件

`alert` 组件用于向用户显示警告或重要的提示信息。

## 适用场景

- **页面顶部重要通知**：系统维护、版本升级等全局通告。
- **操作反馈提示**：表单提交成功、失败，或者操作过程中的警告信息。
- **页面内联提示**：在表单、列表上方提示用户当前状态或注意事项。

## 核心属性

### 属性总览

| 属性名        | 类型                                                                 | 默认值 | 说明                               |
| ------------- | -------------------------------------------------------------------- | ------ | ---------------------------------- |
| `title`       | `string` (支持表达式)                                                | -      | 警告提示的主标题。                   |
| `content`     | `string` (支持表达式)                                                | -      | 同 `title`，主提示内容的别名。       |
| `description` | `string` (支持表达式)                                                | -      | 辅助性说明文字，显示在标题下方。     |
| `status`      | `'success' \| 'info' \| 'warning' \| 'error' \| 'active' \| 'exception' \| 'normal'` | `'info'` | 警告提示的样式状态类型。             |
| `showIcon`    | `boolean`                                                            | `true` | 是否显示与 `status` 对应的辅助图标。 |

---

### title / content（主提示内容）

字符串类型，支持表达式。Alert 的主要提示标题。这两个属性互为别名，推荐使用 `title`。如果两者都配置，优先展示 `title` 或 `content` 的求值结果。

```json
{
  "id": "info-alert",
  "component": "alert",
  "title": "这是一条普通的提示信息",
  "status": "info"
}
```

### description（辅助性说明文字）

字符串类型，支持表达式。警告提示的辅助性文字介绍，用于详细说明。

```json
{
  "id": "detail-alert",
  "component": "alert",
  "title": "操作失败",
  "description": "由于网络原因，数据提交失败，请检查您的网络连接并稍后重试。",
  "status": "error"
}
```

### status（状态类型）

字符串类型。指定警告提示的样式类型。不同的状态会对应不同的颜色和默认图标。

| 值 | 效果 | 典型用途 |
|---|------|---------|
| `info`（默认） | 蓝色样式 | 一般性的信息提示或通告 |
| `success` | 绿色样式 | 操作成功或完成的反馈 |
| `warning` | 黄色样式 | 潜在风险或需要注意的警告 |
| `error` | 红色样式 | 错误、失败或危险操作提示 |

```json
{
  "id": "warning-alert",
  "component": "alert",
  "title": "系统维护通知",
  "status": "warning"
}
```

### showIcon（是否显示图标）

布尔值。是否显示状态对应的默认辅助图标。默认为 `true`。

```json
{
  "id": "no-icon-alert",
  "component": "alert",
  "title": "纯文本提示",
  "status": "success",
  "showIcon": false
}
```

## 完整示例

以下示例展示了一个包含成功和警告提示的列表。

```json
[
  {
    "id": "success-alert",
    "component": "alert",
    "title": "保存成功",
    "description": "您的修改已成功保存至服务器，可以在列表中查看最新数据。",
    "status": "success",
    "showIcon": true,
    "style": {
      "marginBottom": "16px"
    }
  },
  {
    "id": "warning-alert",
    "component": "alert",
    "title": "系统维护通知",
    "description": "系统将于今晚 24:00 进行停机维护，预计持续 2 小时，请提前保存工作。",
    "status": "warning",
    "showIcon": true
  }
]
```

## 新手常见问题

**Q: 提示图标没有显示？**
- 检查 `showIcon` 属性是否被显式设置为了 `false`。如果不传，默认为 `true`。
- 确认是否未设置 `status`（虽然默认是 `info`，但也请确认没有传入非法值）。

**Q: 如何让 Alert 占满整行？**
- `alert` 默认是块级元素（block），会自动占满父容器的宽度。如果需要调整，可以通过 `style` 属性设置 `width`。

**Q: title 和 content 有什么区别？**
- 在 FAUI 的底层实现中，它们被映射为同一个属性（Ant Design 的 `message`），你可以任意选择其中一个来传递主提示信息。推荐使用 `title` 以保持语义明确。
