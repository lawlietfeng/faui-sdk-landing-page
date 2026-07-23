# modal 组件

`modal` 是模态对话框组件，用于在当前页面打开一个浮层，承载需要用户集中注意力处理的相关操作，而不离开当前页面。

## 适用场景

- **表单录入**：新建/编辑数据，提交复杂的长表单。
- **信息确认**：删除警告、二次确认、重要操作提示。
- **详情展示**：展示大量文本详情、图表、日志等，无需新开页面。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open.path` | `string` | - | 双向绑定的弹窗显示状态路径，值必须为 `boolean`。 |
| `title` | `string` | - | 弹窗标题文字，支持表达式。 |
| `children` | `string[]` | `[]` | 弹窗内部的内容组件 ID 列表。 |
| `width` | `string` \| `number` | `520` | 弹窗宽度，如 `"80%"` 或 `800`。 |
| `footer` | `boolean` \| `null` | - | 是否显示底部区域。设为 `false` 或 `null` 可隐藏底部的确认/取消按钮。 |
| `on_ok` | `ActionConfig` | - | 点击“确定”按钮的回调动作。 |
| `on_cancel` | `ActionConfig` | - | 点击“取消”按钮、右上角叉或遮罩层的回调动作。 |

### open.path（弹窗显隐控制）

`modal` 的显隐是一个强受控状态。你**必须**绑定一个布尔值路径。当用户点击弹窗默认的“取消”或“确定”按钮时，如果没有配置拦截事件，组件会自动通过 fallback 机制触发 `update_data` 将其设为 `false`，从而关闭弹窗。

```json
{
  "id": "edit-modal",
  "component": "modal",
  "title": "编辑用户信息",
  "open": {
    "path": "/isModalVisible"
  }
}
```

### on_ok / on_cancel（事件拦截与自定义）

默认情况下，点击底部按钮会直接关闭弹窗。如果你需要在点击“确定”时先发送网络请求验证，或者阻止默认的关闭行为，可以配置 `on_ok` 动作序列。

```json
{
  "id": "confirm-modal",
  "component": "modal",
  "title": "确认提交",
  "open": { "path": "/modalOpen" },
  "on_ok": [
    {
      "action": "http_proxy",
      "payload": {
        "http_config": { "method": "POST", "path": "/api/submit" }
      }
    },
    {
      "action": "update_data",
      "path": "/modalOpen",
      "value": false
    }
  ]
}
```
*注：一旦配置了 `on_ok`，系统就不会再帮你自动执行 `value: false` 的关闭动作，你需要自己像上面一样在请求成功后手动通过 `update_data` 关闭它。*

### destroyOnHidden 与 maskClosable

- `destroyOnHidden`：关闭/隐藏时销毁 Modal 里的子元素。如果你的弹窗里有复杂的表单，建议开启此项，确保每次打开表单都是全新的状态。
- `maskClosable`：设为 `false` 可防止用户在填写表单时误点弹窗外的半透明遮罩而导致弹窗关闭和数据丢失。

```json
{
  "id": "form-modal",
  "component": "modal",
  "maskClosable": false,
  "destroyOnHidden": true
}
```

## 完整示例

一个点击按钮打开的、包含表单和自定义底部按钮行为的弹窗组合：

```json
[
  {
    "type": "ACTIVITY_SNAPSHOT",
    "content": {
      "dataModel": {
        "modalVisible": false
      },
      "components": [
        {
          "id": "open-btn",
          "component": "button",
          "label": "新建任务",
          "on_tap": [{ "action": "update_data", "path": "/modalVisible", "value": true }]
        },
        {
          "id": "task-modal",
          "component": "modal",
          "title": "新建任务",
          "width": 600,
          "maskClosable": false,
          "destroyOnHidden": true,
          "open": { "path": "/modalVisible" },
          "children": ["task-form"],
          "on_ok": [
            { "action": "message", "payload": { "type": "success", "content": "任务创建成功" } },
            { "action": "update_data", "path": "/modalVisible", "value": false }
          ]
        },
        {
          "id": "task-form",
          "component": "form",
          "children": ["title-input"]
        },
        {
          "id": "title-input",
          "component": "input",
          "placeholder": "请输入任务标题",
          "value": { "path": "/form/title" }
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 为什么点击“确定”按钮，弹窗没有关闭？**
- 检查你是否在 JSON 中配置了 `on_ok` 事件。如果配置了 `on_ok`，引擎认为你接管了点击事件，自动关闭的 fallback 逻辑就不再执行。你必须在 `on_ok` 的动作列表最后，手动添加一个 `update_data` 动作去把绑定的 `open.path` 设为 `false`。

**Q: 怎么隐藏底部那一排“取消/确定”按钮？我想自己放按钮。**
- 配置 `"footer": false` 即可隐藏底部区域。然后你可以在 `children` 中放入自定义的 `box` 和 `button` 组件来设计自己的底部。

**Q: 第二次打开弹窗时，上次填写的表单数据还在？**
- 可以配置 `"destroyOnHidden": true`，这会在弹窗关闭时彻底销毁内部的 React 节点，重新打开时会重新初始化。如果你希望彻底清空状态，还需要在关闭时把表单绑定的数据源一并清空。

**Q: 弹窗里面的下拉框或者气泡卡片，会被弹窗挡住吗？**
- 不会，Ant Design 底层有良好的层级管理。但如果弹窗本身配置了极高的 `zIndex`，可能会出现层级覆盖的问题，一般不建议手动修改弹窗的 `zIndex`。
