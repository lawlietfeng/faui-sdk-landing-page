# drawer 组件

`drawer` 组件是一个从屏幕边缘滑出的浮层面板，通常用于在不离开当前页面的情况下，展示额外信息、表单输入或操作面板。

## 适用场景

- **信息展示**：展示比弹窗 (`modal`) 更长或更复杂的详情信息。
- **表单录入**：承载步骤较长或项数较多的表单录入任务。
- **配置面板**：作为页面的侧边配置面板，提供全局或局部的设置项。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean \| ValueBinding` | `false` | 抽屉是否可见，强烈推荐使用数据绑定对象（`{"path": "..."}`） |
| `title` | `string` | - | 抽屉标题文字，支持表达式插值 |
| `placement` | `string` | `right` | 抽屉滑出的位置，可选 `top`、`right`、`bottom`、`left` |
| `width` | `number \| string` | `378` | 抽屉宽度，在 `placement` 为 `right` 或 `left` 时生效 |
| `height` | `number \| string` | `378` | 抽屉高度，在 `placement` 为 `top` 或 `bottom` 时生效 |
| `on_close` | `ActionConfig[]` | - | 点击遮罩层或右上角关闭按钮时的回调动作 |
| `mask` | `boolean` | `true` | 是否展示背景遮罩 |
| `maskClosable` | `boolean` | `true` | 点击背景遮罩时是否允许关闭 |
| `destroyOnHidden` | `boolean` | `false` | 隐藏时是否销毁内部子元素（等同于 Ant Design 的 destroyOnClose） |

### open（可见状态绑定）

控制抽屉显示与隐藏的最核心属性。在 FAUI 中，通常使用双向数据绑定（`ValueBinding`）来控制弹窗的开关。当用户点击右上角关闭按钮或遮罩层时，组件内部会自动将该路径下的值回写为 `false`。

```json
{
  "id": "my-drawer",
  "component": "drawer",
  "title": "编辑用户信息",
  "open": {
    "path": "/ui/drawer_open"
  },
  "children": ["form-user-edit"]
}
```

### placement（滑出位置）

控制抽屉从屏幕的哪一边滑出。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `right` | 从右侧滑出 | 大部分信息展示、表单录入（默认） |
| `left` | 从左侧滑出 | 侧边导航菜单、全局目录 |
| `top` | 从顶部滑出 | 顶部筛选条件、消息通知面板 |
| `bottom` | 从底部滑出 | 移动端风格的操作面板或条款说明 |

```json
{
  "id": "drawer-left",
  "component": "drawer",
  "placement": "left",
  "width": 256,
  "open": { "path": "/ui/menu_open" }
}
```

### width / height（尺寸）

根据 `placement` 的不同，只有与之垂直的尺寸属性才会生效：
- 当 `placement` 为 `right` 或 `left` 时，必须使用 `width` 控制抽屉宽度。
- 当 `placement` 为 `top` 或 `bottom` 时，必须使用 `height` 控制抽屉高度。

支持数字（如 `500`）或带单位的字符串（如 `"50vw"`）。

```json
{
  "id": "drawer-bottom",
  "component": "drawer",
  "placement": "bottom",
  "height": "40vh",
  "open": { "path": "/ui/bottom_panel_open" }
}
```

### on_close（关闭回调）

当用户点击遮罩层、按下 ESC 键或点击右上角的关闭 (X) 按钮时触发。
**注意**：即使不配置 `on_close`，只要 `open` 绑定了全局状态路径，组件也会自动将状态置为 `false`。配置 `on_close` 通常用于在关闭时执行额外的业务逻辑（例如重置表单数据）。

```json
{
  "id": "drawer-with-close-action",
  "component": "drawer",
  "open": { "path": "/ui/drawer_open" },
  "on_close": [
    {
      "action": "update_data",
      "path": "/form/user_data",
      "value": {}
    }
  ]
}
```

## 状态绑定与自动关闭机制 (高级用法)

受控抽屉在 FAUI 中有一套标准的闭环机制：

1. **外部打开**：在页面中的某个按钮上，配置 `on_tap` 动作，使用 `update_data` 将 `/ui/drawer_open` 设置为 `true`。
2. **抽屉响应**：`drawer` 组件的 `open` 属性绑定了 `/ui/drawer_open`，接收到 `true` 后渲染展开。
3. **内部关闭**：用户点击了 `drawer` 自带的遮罩层或关闭按钮。`drawer` 组件内部会自动执行 `update_data` 将 `/ui/drawer_open` 写回为 `false`，抽屉自动收起。不需要开发者手动去拦截遮罩点击事件。

## 完整示例

这是一个组合了按钮触发打开、抽屉展示以及内部子组件的完整示例：

```json
[
  {
    "id": "open-drawer-btn",
    "component": "button",
    "content": "打开抽屉",
    "type": "primary",
    "on_tap": [
      {
        "action": "update_data",
        "path": "/ui/drawer_visible",
        "value": true
      }
    ]
  },
  {
    "id": "demo-drawer",
    "component": "drawer",
    "title": "系统设置",
    "placement": "right",
    "width": 400,
    "maskClosable": false,
    "destroyOnHidden": true,
    "open": {
      "path": "/ui/drawer_visible"
    },
    "children": [
      "drawer-content-text"
    ],
    "on_close": [
      {
        "action": "message",
        "payload": {
          "type": "info",
          "content": "抽屉已关闭"
        }
      }
    ]
  },
  {
    "id": "drawer-content-text",
    "component": "typography",
    "content": "这里是抽屉内部的配置项内容。"
  }
]
```

## 新手常见问题

**Q: 抽屉关不掉？点击遮罩或右上角的叉都没反应？**
- 请检查 `open` 属性是否写死了布尔值 `true`。如果写死了静态值，它将永远处于打开状态。正确的做法是使用 `{"path": "/xxx"}` 绑定全局数据状态。

**Q: `extra` 和 `footer` 可以放按钮组件吗？**
- 目前 `drawer` 组件的 `extra`（右上角操作区）和 `footer`（页脚区）仅支持传入字符串文本，并会经过表达式解析。如果需要复杂的按钮组，请将它们作为 `children` 放在抽屉主体内容的最下方或最上方。

**Q: 为什么我设置了 `height` 但是抽屉从右边出来并没有改变高度？**
- 尺寸控制与滑出方向相关。当 `placement` 为 `right` 或 `left` 时，抽屉高度固定为 100%，只能通过 `width` 控制宽度；同理，`top` 或 `bottom` 时只能通过 `height` 控制高度。