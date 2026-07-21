# button 组件

button 组件用于响应用户的点击操作，触发业务逻辑（如提交表单、请求接口、跳转页面等）。

## 适用场景

- **表单提交**：在表单的末尾用于触发校验和数据提交。
- **独立操作**：如新建、删除、导出等独立于表单的业务操作。
- **页面跳转**：作为导航入口，点击后跳转至其他页面。

## 核心属性

### 属性总览

| 属性名     | 类型                         | 默认值      | 说明                                             |
| ---------- | ---------------------------- | ----------- | ------------------------------------------------ |
| `label`    | `string` (支持表达式)        | -           | 按钮文本（推荐）。                               |
| `content`  | `string` (支持表达式)        | -           | 同 `label`，按钮文本的另一种写法。               |
| `type`     | `'primary' \| 'dashed' \| 'link' \| 'text' \| 'default'` | `'default'` | 按钮的视觉类型。                                 |
| `danger`   | `boolean`                    | `false`     | 是否为危险按钮（通常为红色）。                   |
| `ghost`    | `boolean`                    | `false`     | 幽灵属性，使按钮背景透明。                       |
| `shape`    | `'default' \| 'circle' \| 'round'` | `'default'` | 按钮的形状。                                     |
| `size`     | `'large' \| 'middle' \| 'small'` | `'middle'`  | 按钮的尺寸。                                     |
| `block`    | `boolean`                    | `false`     | 将按钮宽度调整为其父宽度的 100%。                |
| `disabled` | `boolean` (支持表达式)       | `false`     | 是否禁用按钮。                                   |
| `on_tap`   | `Action[]`                   | -           | 点击按钮时触发的动作数组。                       |
| `children` | `string[]`                   | -           | 嵌套子组件（仅在未设置 `label/content` 时生效）。|

---

### label / content（按钮文本）

用于配置按钮显示的文字内容，支持通过 `useExpression` 进行表达式求值，实现动态文本。

```json
{
  "id": "submit_btn",
  "component": "button",
  "label": "提交"
}
```
*提示：也可以使用插值表达式如 `"label": "提交 ${data.formName}"`。*

### type（按钮类型）

控制按钮的视觉表现级别，用于区分操作的主次。

| 值        | 效果       | 典型用途               |
| --------- | ---------- | ---------------------- |
| `primary` | 实心主色   | 页面中的主要操作（如：保存、提交） |
| `default` | 描边默认色 | 次要操作（如：取消、重置） |
| `dashed`  | 虚线描边   | 添加类操作（如：添加一行） |
| `text`    | 纯文本     | 弱化操作或表格内的操作列 |
| `link`    | 链接样式   | 导航或外部跳转         |

```json
{
  "id": "primary_btn",
  "component": "button",
  "type": "primary",
  "label": "确认保存"
}
```

### danger（危险操作）

当配置为 `true` 时，按钮会呈现警告色（通常为红色），用于高危操作。

```json
{
  "id": "delete_btn",
  "component": "button",
  "type": "primary",
  "danger": true,
  "label": "删除记录"
}
```

### block（块级按钮）

当配置为 `true` 时，按钮的宽度会撑满其父容器（`100%`），常用于移动端或者侧边栏的底部操作。

```json
{
  "id": "login_btn",
  "component": "button",
  "type": "primary",
  "block": true,
  "label": "登录"
}
```

### disabled（禁用状态）

用于禁用按钮，防止用户点击。支持配置为布尔值或使用表达式根据业务状态动态判断。

```json
{
  "id": "submit_btn",
  "component": "button",
  "type": "primary",
  "disabled": "${!data.isAgreed}",
  "label": "提交"
}
```

### on_tap（点击事件）

这是一个极其重要的属性，当按钮被点击时，会依次执行 `on_tap` 数组中配置的动作（Action）。如果按钮位于表单 (`Form`) 内且是该表单的提交按钮，会在执行 `on_tap` 前自动触发并等待表单的校验规则。

```json
{
  "id": "save_btn",
  "component": "button",
  "label": "保存",
  "type": "primary",
  "on_tap": [
    {
      "action": "http_proxy",
      "payload": {
        "http_config": {
          "method": "POST",
          "path": "/api/saveData"
        }
      }
    }
  ]
}
```

## 特有机制 / 高级用法

### 1. 表单提交自动校验
当 `button` 处于 `form` 组件内部，且被关联为提交按钮时，点击该按钮会优先执行 `form` 的 `validateAll()` 方法。如果校验未通过，后续的 `on_tap` 动作将被拦截执行。

### 2. 嵌套子组件
在绝大多数情况下，使用 `label` 或 `content` 已经足够满足文本展示需求。但如果按钮内部需要极其复杂的结构（例如图标加文字的混合布局），且 **未配置** `label` 和 `content`，则可以通过 `children` 数组嵌套其他组件。

```json
{
  "id": "icon_btn",
  "component": "button",
  "children": ["custom_icon", "custom_text"]
}
```

## 完整示例

一个带有动态文本、红色警告样式、尺寸较大且绑定了请求动作的删除按钮：

```json
{
  "id": "confirm_delete_btn",
  "component": "button",
  "type": "primary",
  "danger": true,
  "size": "large",
  "label": "确认删除 ${data.itemName}",
  "on_tap": [
    {
      "action": "http_proxy",
      "payload": {
        "http_config": {
          "method": "POST",
          "path": "/api/deleteItem"
        }
      }
    },
    {
      "action": "message",
      "payload": {
        "type": "success",
        "content": "删除成功！"
      }
    }
  ]
}
```

## 新手常见问题

**Q: 为什么按钮点击后没有任何反应？**
- 检查是否正确配置了 `on_tap` 属性，并且动作的语法符合 FAUI Action 规范。注意，不能使用原生的 `onClick`，FAUI 中必须使用 `on_tap` 数组。

**Q: 按钮在表单中，但点击后没有触发校验？**
- 确保该按钮的 ID 已经被配置到对应 `form` 的提交按钮列表（或通过隐式关联逻辑被识别为提交按钮）。

**Q: 配置了 children，但是按钮里只显示了 label 的文字？**
- 根据组件逻辑，如果同时配置了 `label`（或 `content`）和 `children`，系统会优先渲染文本，并忽略 `children`。如果需要渲染子组件，请移除 `label` 和 `content` 属性。
