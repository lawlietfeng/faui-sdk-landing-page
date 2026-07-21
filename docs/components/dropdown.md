# dropdown 下拉菜单组件

`dropdown` 组件用于向下弹出的列表。当页面上的操作命令过多时，可以用此组件收纳并折叠操作元素，保持界面的整洁。

## 适用场景

- **操作集合**：在表格的操作列、卡片的右上角等位置收纳“编辑、分享、删除”等多个次要操作。
- **导航菜单**：在顶部导航栏中，悬停或点击头像/名称展示个人中心菜单。
- **更多选项**：代替拥挤的平铺按钮组。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `DropdownMenuItem[]` | `[]` | 菜单项配置列表 |
| `trigger` | `Array<'click' \| 'hover' \| 'contextMenu'>` | `['hover']` | 触发下拉的行为方式 |
| `placement` | `string` | `bottomLeft` | 菜单弹出位置，可选 `bottom`、`bottomLeft`、`topRight` 等 |
| `on_menu_click` | `ActionConfig[]` | - | 点击菜单项的回调，动作执行时会注入所点击项的 `key` |
| `arrow` | `boolean` | `false` | 下拉菜单是否显示指向触发元素的箭头 |
| `disabled` | `boolean` | `false` | 是否禁用触发 |
| `open` | `boolean \| ValueBinding` | - | 菜单是否受控打开，支持双向绑定 |
| `selectedKeys` | `string[] \| ValueBinding` | - | 当前选中的菜单项 key 数组，支持双向绑定 |
| `on_open_change` | `ActionConfig[]` | - | 下拉框显示/隐藏状态改变时的回调，动作执行时会注入 `open` 状态 |

### items（菜单项配置列表）

定义下拉菜单的具体内容。列表中的每个对象支持以下属性：
- `key` (string)：**必填**，该菜单项的唯一标识。
- `label` (string)：**必填**，显示的文字内容，支持表达式（如 `${$current.name}`）。
- `disabled` (boolean)：是否禁用该项。
- `danger` (boolean)：是否为危险操作（通常会标红，如“删除”）。
- `type` (string)：特殊类型。当值为 `divider` 时，渲染一条分割线。
- `icon` (string)：图标组件的 `id`，可在此处渲染外部定义的图标组件。
- `children` (DropdownMenuItem[])：嵌套的子菜单。

```json
{
  "id": "my-dropdown",
  "component": "dropdown",
  "items": [
    { "key": "edit", "label": "编辑" },
    { "key": "share", "label": "分享", "disabled": true },
    { "type": "divider" },
    { "key": "delete", "label": "删除", "danger": true }
  ],
  "children": ["dropdown-trigger-btn"]
}
```

### trigger（触发行为）

设置触发下拉框的行为，可以是一个数组。常用的值为 `click`（点击触发）和 `hover`（悬停触发）。

```json
{
  "id": "click-dropdown",
  "component": "dropdown",
  "trigger": ["click"],
  "items": [{ "key": "1", "label": "选项一" }],
  "children": ["click-trigger-btn"]
}
```

### placement（弹出位置）

指定下拉菜单相对于触发元素弹出的位置。支持的值包括：
`bottomLeft`、`bottom`、`bottomRight`、`topLeft`、`top`、`topRight`。

```json
{
  "id": "placement-dropdown",
  "component": "dropdown",
  "placement": "topRight",
  "items": [{ "key": "1", "label": "上方弹出" }],
  "children": ["placement-trigger-btn"]
}
```

### on_menu_click（点击回调）

当用户点击菜单中的某一项时触发的动作。
**重要机制**：引擎在执行该动作时，会自动向 `payload` 中注入用户点击的 `key`（所选项的唯一标识）。你可以在后续动作中通过 `${key}` 表达式来获取它。

```json
{
  "id": "action-dropdown",
  "component": "dropdown",
  "items": [
    { "key": "agree", "label": "同意" },
    { "key": "reject", "label": "拒绝" }
  ],
  "on_menu_click": [
    {
      "action": "message",
      "payload": {
        "type": "success",
        "content": "你点击了选项：${key}"
      }
    }
  ],
  "children": ["action-trigger-btn"]
}
```

## 完整示例

这是一个包含完整图标映射、危险操作、触发按钮，以及点击事件反馈的完整下拉菜单配置：

```json
[
  {
    "id": "icon-user",
    "component": "icon",
    "icon": "UserOutlined"
  },
  {
    "id": "icon-logout",
    "component": "icon",
    "icon": "LogoutOutlined"
  },
  {
    "id": "trigger-btn",
    "component": "button",
    "content": "个人中心"
  },
  {
    "id": "complex-dropdown",
    "component": "dropdown",
    "trigger": ["click"],
    "arrow": true,
    "placement": "bottom",
    "items": [
      { 
        "key": "profile", 
        "label": "个人资料", 
        "icon": "icon-user" 
      },
      { "type": "divider" },
      { 
        "key": "logout", 
        "label": "退出登录", 
        "danger": true,
        "icon": "icon-logout"
      }
    ],
    "on_menu_click": [
      {
        "action": "message",
        "payload": {
          "type": "info",
          "content": "即将执行操作: ${key}"
        }
      }
    ],
    "children": ["trigger-btn"]
  }
]
```

## 新手常见问题

**Q: 为什么下拉菜单没有显示出来？**
- 检查 `dropdown` 组件的 `children` 数组是否为空。下拉菜单必须包裹在一个触发元素（例如 `button`、`typography` 或 `icon`）上。只有当用户交互了这个子元素时，菜单才会弹出。

**Q: 点击下拉菜单没有反应？怎么知道点击了哪一项？**
- 必须配置 `on_menu_click` 数组动作。在执行时，你可以通过表达式 `${key}` 获取到被点击项在 `items` 中配置的 `key` 值，然后根据这个值去派发请求（如 `http_proxy`）或更新状态。

**Q: 菜单里的 `icon` 可以直接写组件配置吗？**
- 不可以。在 JSON 结构中，为了保持 `items` 结构的扁平与清晰，`icon` 字段只接受一个字符串（即你在别处定义的 `icon` 组件的 `id`）。组件在渲染时会根据这个 ID 从全局组件表（`componentMap`）中查找并渲染出真正的图标。