# layout 组件

`layout` 及其配套的 `header`、`sider`、`content`、`footer` 组件，用于协助进行页面级的整体骨架布局，构建经典的“上中下”或“左右侧边栏”结构的网页。

## 适用场景

- **管理后台页面**：左侧菜单栏，顶部导航栏，中间内容区。
- **页面整体骨架**：快速搭建全屏的圣杯布局、双飞翼布局。

## 组件关系与类型

布局系统包含以下 5 种 `component` 类型，它们可以相互嵌套：

1. `layout`：布局容器，可嵌套其他四个组件或其自身。
2. `header`：顶部布局容器。
3. `sider`：侧边栏容器（支持展开/收起）。
4. `content`：主内容区域容器。
5. `footer`：底部布局容器。

## 核心属性

### 1. layout（主容器）

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `children` | `string[]` | `[]` | 子组件的 ID 数组，通常放置 `header`, `sider`, `content`, `footer` 或子 `layout`。 |
| `hasSider` | `boolean` | - | 标明子元素里是否包含 `sider`。如果未设置，组件会自动推断。若出现渲染闪烁可手动设为 `true`。 |

```json
{
  "id": "root-layout",
  "component": "layout",
  "hasSider": true,
  "style": { "height": "100vh" },
  "children": ["app-sider", "right-layout"]
}
```

### 2. sider（侧边栏）

侧边栏除了作为容器，还支持宽度设置和动态展开/收起。

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `width` | `number` \| `string` | `200` | 展开时的宽度。 |
| `collapsible` | `boolean` | `false` | 是否开启折叠功能。 |
| `collapsedWidth` | `number` | `80` | 收起时的宽度，设为 `0` 会出现特殊的触发器。 |
| `theme` | `string` | `"dark"` | 侧边栏主题颜色，可选 `"light"` 或 `"dark"`。支持表达式。 |
| `reverseArrow` | `boolean` | `false` | 翻转折叠提示箭头的方向（侧边栏在右侧时使用）。 |
| `value.path` | `string` | - | 双向绑定的数据路径，用于受控其展开/收起状态（`boolean`）。 |

**Sider 折叠状态数据绑定：**
配置 `value.path` 绑定一个布尔值状态，配合 `collapsible: true`。点击侧边栏的折叠按钮时，会自动 fallback 将布尔值回写到该路径。

```json
{
  "id": "app-sider",
  "component": "sider",
  "collapsible": true,
  "width": 250,
  "theme": "light",
  "value": {
    "path": "/layout/menuCollapsed"
  },
  "children": ["app-menu"]
}
```

### 3. header / content / footer

这三个组件主要作为纯粹的内容容器，通常只需配置 `children` 和基础的 `style` 或 `className` 即可。它们会自动应用规范的高度、内边距和背景色等布局属性。

```json
{
  "id": "app-header",
  "component": "header",
  "style": {
    "background": "#ffffff",
    "padding": "0 24px"
  },
  "children": ["user-avatar"]
}
```

## 完整示例

一个标准的管理后台布局：左侧带折叠功能的暗色菜单，右侧包含顶栏、白底内容区和底栏：

```json
[
  {
    "id": "root-layout",
    "component": "layout",
    "style": { "height": "100vh" },
    "children": ["app-sider", "main-layout"]
  },
  {
    "id": "app-sider",
    "component": "sider",
    "collapsible": true,
    "theme": "dark",
    "value": { "path": "/isCollapsed" },
    "children": ["logo-image"]
  },
  {
    "id": "main-layout",
    "component": "layout",
    "children": ["app-header", "app-content", "app-footer"]
  },
  {
    "id": "app-header",
    "component": "header",
    "style": { "background": "#fff" },
    "children": ["user-info-text"]
  },
  {
    "id": "app-content",
    "component": "content",
    "style": { "margin": "24px", "background": "#fff", "padding": "24px" },
    "children": ["page-body-box"]
  },
  {
    "id": "app-footer",
    "component": "footer",
    "style": { "textAlign": "center" },
    "children": ["copyright-text"]
  }
]
```

## 新手常见问题

**Q: 布局撑不满全屏，底部留有大片空白？**
- 默认情况下，最外层的 `layout` 容器高度由内部内容撑开。如需全屏，请为最外层的 `layout` 配置 `style: { "height": "100vh" }`。

**Q: 点击 sider 侧边栏的折叠按钮没有反应？**
- 请检查是否配置了 `value.path`。`collapsible: true` 只是开启了折叠功能，必须配合绑定一个布尔类型的数据状态才能正常记忆和响应折叠状态。

**Q: 子组件（如 header）里的插值或 style 表达式为什么不生效？**
- 检查你是否在 JSON 里把表达式写错了格式。`layout` 及附属容器组件对于自身的 `style`、`theme` 均已开启表达式解析。如果子组件插值不生效，请查阅对应子组件的文档。
