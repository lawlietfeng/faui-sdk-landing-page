# tabs 组件

`tabs` 标签页组件，用于在一个页面内或者容器内平级地切换不同的内容区域。

## 适用场景

- **模块分类展示**：在同一页面内展示多个相互独立的分类内容（如"基本信息"、"高级设置"）。
- **空间复用**：当页面内容过多，需要通过标签页将内容分组，以节省屏幕空间。
- **多任务并行**：以卡片形式打开多个独立的任务（类似于浏览器标签页）。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `activeKey` | `string` \| `ValueBinding` | - | **必填**。当前激活的标签页 key，必须使用 `path` 进行双向绑定 |
| `items` | `TabItemConfig[]` \| `string` | `[]` | 标签页配置列表，定义每个标签的标题与内容 |
| `defaultActiveKey` | `string` | - | 默认激活的标签页 key（非受控模式下使用，一般推荐用受控模式） |
| `type` | `string` | `"line"` | 页签的基本样式，可选 `"line"`、`"card"`、`"editable-card"` |
| `tabPosition` | `string` | `"top"` | 页签位置，可选 `"top"`、`"right"`、`"bottom"`、`"left"` |
| `size` | `string` | `"middle"` | 大小，可选 `"large"`、`"middle"`、`"small"` |
| `centered` | `boolean` | `false` | 标签是否居中显示 |
| `destroyOnHidden` | `boolean` | `false` | 隐藏时是否销毁 DOM 结构（避免不可见组件占用内存） |
| `on_change` | `ActionConfig` | - | 用户点击切换标签页时触发的动作。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |

### activeKey（双向绑定规范）

`tabs` 是高频状态更新组件，**必须**使用 `activeKey: { path: "xxx" }` 与 `dataModel` 进行双向绑定，以避免组件触发全局重渲染或导致状态丢失。

**正确示例**（通过路径与 `dataModel` 建立按需更新关系）：
```json
{
  "id": "main-tabs",
  "component": "tabs",
  "activeKey": { "path": "/currentTabKey" },
  "items": [
    { "key": "tab1", "label": "选项卡一", "children": [] }
  ]
}
```
*当用户点击切换 Tab 时，组件将自动调用 `update_data`，将新的 `key`（如 `"tab1"`）更新至全局状态 `/currentTabKey`。*

### items（标签页配置）

定义所有的标签页，支持传入静态数组或通过表达式动态获取。
数组中每个元素的属性如下：

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `key` | `string` | 是 | 标签的唯一标识，对应 `activeKey` |
| `label` | `string` | 是 | 标签页上显示的文字，支持插值表达式 |
| `children` | `string[]` | 否 | 该标签页内容区域要渲染的**子组件 ID 列表** |
| `disabled` | `boolean` | 否 | 是否禁用该标签 |
| `closable` | `boolean` | 否 | 是否可关闭（仅在 `type="editable-card"` 时有效） |
| `forceRender` | `boolean` | 否 | 隐藏时是否强制渲染 DOM 结构 |

```json
{
  "id": "setting-tabs",
  "component": "tabs",
  "activeKey": { "path": "/settingsTab" },
  "items": [
    {
      "key": "basic",
      "label": "基础设置",
      "children": ["basic-form"]
    },
    {
      "key": "advanced",
      "label": "高级设置",
      "children": ["advanced-form"]
    }
  ]
}
```

### type 与 tabPosition（样式与布局）

控制页签的外观和停靠位置。

```json
{
  "id": "card-tabs",
  "component": "tabs",
  "type": "card",
  "tabPosition": "left",
  "activeKey": { "path": "/cardTab" },
  "items": [
    { "key": "1", "label": "卡片一" },
    { "key": "2", "label": "卡片二" }
  ]
}
```

## 完整示例

展示一个带有动态标题、双向绑定和不同内容区域的标准 Tabs：

```json
[
  {
    "id": "user-center-tabs",
    "component": "tabs",
    "activeKey": { "path": "/userCenter/activeTab" },
    "centered": true,
    "size": "large",
    "items": [
      {
        "key": "profile",
        "label": "个人资料",
        "children": ["profile-box"]
      },
      {
        "key": "orders",
        "label": "我的订单 (${/orderCount})",
        "children": ["orders-table"]
      },
      {
        "key": "security",
        "label": "安全设置",
        "disabled": "${!/isVerified}",
        "children": ["security-box"]
      }
    ]
  },
  {
    "id": "profile-box",
    "component": "text",
    "content": "这里是个人资料内容..."
  },
  {
    "id": "orders-table",
    "component": "text",
    "content": "这里是订单列表内容..."
  },
  {
    "id": "security-box",
    "component": "text",
    "content": "这里是安全设置内容..."
  }
]
```

## 新手常见问题

**Q: 为什么我点击切换 Tab，内容没有切换？**
- 最常见的原因是没有为 `activeKey` 绑定 `path`。必须配置 `"activeKey": { "path": "/someKey" }`，否则引擎不知道将点击的新 key 写回到哪里，组件变成了只读状态。

**Q: 标签页的 `label` 支持动态改变吗？**
- 支持！`items[].label` 已经包裹了 `useExpression`。你可以配置类似 `"label": "消息 (${/msgCount})"`，当 `/msgCount` 变化时标题会自动更新。

**Q: `destroyOnHidden` 和 `forceRender` 有什么区别？**
- 默认情况下，未激活的 Tab 内容是不可见的，但其 DOM 可能已经被渲染。
- 如果包含很重的数据或图表，建议开启 `destroyOnHidden: true`，这样切走时会销毁 DOM 释放内存。
- 相反，如果希望切走时仍然保留（比如保持里面 iframe 的加载状态），可以对该 item 设置 `forceRender: true`。

**Q: 为什么我配置了 `on_change` 后，数据不自动更新了？**
- 如果你**只**配置了 `on_change`，你需要自己在 Action 中把值写回 `path`。如果既想触发自定义事件，又想让组件自动更新，请**同时**配置 `activeKey.path`，组件内部会优先更新 path，再执行你的 `on_change` 动作。