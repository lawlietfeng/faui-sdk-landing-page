# skeleton 组件

`skeleton`（骨架屏）组件用于在页面内容加载过程中，提供一个低感知、视觉连贯的占位骨架，以缓解用户的等待焦虑。

## 适用场景

- **网络请求等待**：在通过接口拉取长列表、详情数据、或者图片前，先展示对应的骨架图。
- **特定元素占位**：可以渲染为按钮、头像、输入框等特定的形状骨架。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（skeleton）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `loading` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  | `true` |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | （已弃用：loading） |  |
| `active` |  | 静态值 |  |  |
| `avatar` |  | 静态值 |  |  |
| `paragraph` |  | 静态值 |  |  |
| `round` |  | 静态值 |  |  |
| `title` |  | 静态值 |  |  |
| `skeletonType` |  | 静态值 |  |  |
| `shape` |  | 静态值 |  |  |
| `block` |  | 静态值 |  |  |
| `size` |  | 静态值 |  |  |
| `children` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`component-ids`
- 事件：
- dataModel 绑定：无
- 属性依赖：独立骨架形态不渲染 children，不能配置 loading。
- 特殊说明：无
<!-- contract-props:end -->

### loading（加载状态控制）

`loading` 控制是否处于加载状态。
1. **当 `loading` 为 `true`（或绑定的值为真）时**：显示骨架屏的灰色占位图，隐藏内部包裹的真实 `children`。
2. **当 `loading` 为 `false`（或绑定的值为假）时**：骨架屏占位图消失，组件会直接渲染并显示内部真实的 `children` 内容。

通常我们会将它绑定到全局的请求状态标识上：

```json
{
  "component": "skeleton",
  "id": "user-info-skeleton",
  "loading": {
    "path": "/api/loading"
  },
  "active": true,
  "children": ["user-avatar", "user-name", "user-desc"]
}
```

历史 `visible` 在 Skeleton 中仍兼容为 loading 别名，但已弃用。若要控制 Skeleton 整体显隐，请在外层 `box` 使用 `visible`，不要把 Skeleton 的 `visible` 当作普通组件显隐。

### active（动画效果）

开启 `active: true` 会让骨架屏拥有呼吸/流动的动画效果，这能让用户感知到页面没有卡死，正在努力加载中。

```json
{
  "component": "skeleton",
  "id": "skeleton-active",
  "active": true,
  "loading": true
}
```

## 高级用法：特定形状的骨架屏

如果不需要默认的“标题+段落”组合骨架，你可以通过配置 `skeletonType` 属性，渲染为单独的头像、按钮、输入框或图片骨架。此时，`size`、`shape` 等属性将会生效。

| skeletonType | 额外支持的属性 | 典型场景 |
| --- | --- | --- |
| `button` | `size` (`large`, `small`, `default`), `shape` (`circle`, `round`, `default`), `block` | 等待按钮状态初始化 |
| `avatar` | `size`, `shape` (`circle`, `square`) | 用户头像图片加载前 |
| `input` | `size` | 输入框表单渲染前 |
| `image` | - | 封面大图加载前 |

```json
{
  "component": "skeleton",
  "id": "skeleton-avatar",
  "skeletonType": "avatar",
  "shape": "circle",
  "size": "large",
  "active": true
}
```

```json
{
  "component": "skeleton",
  "id": "skeleton-button",
  "skeletonType": "button",
  "block": true,
  "active": true
}
```

## 完整示例

这是一个复杂的综合型骨架配置，展示了如何自定义段落行数和包含头像：

```json
{
  "component": "skeleton",
  "id": "skeleton-complex",
  "loading": {
    "path": "/page/isFetching"
  },
  "active": true,
  "avatar": {
    "shape": "square",
    "size": "large"
  },
  "paragraph": {
    "rows": 4,
    "width": ["100%", "100%", "80%", "60%"]
  },
  "round": true,
  "children": ["real-content-box"]
}
```

## 新手常见问题

**Q: 为什么我配置了 `skeleton`，但页面上不仅显示了骨架屏，还把里面真实的组件也显示出来了？**
- 请确认 `loading` 为 `true` 时由 Skeleton 接管真实 `children`。如果需要控制整个 Skeleton 的显隐，请把它放在外层 `box` 中并设置外层的 `visible`。

**Q: 骨架屏的行数怎么调整？**
- 如果是普通的综合骨架，可以将 `paragraph` 配置为一个对象，指定 `rows` 属性，如 `"paragraph": { "rows": 6 }`。

**Q: 怎么把骨架屏的颜色改深一点？**
- 基础骨架组件无法直接配置颜色属性。如果你需要修改占位图的深浅，需要通过在 `style` 中或者外部类名覆盖对应的 CSS 变量（如 Ant Design 的 `@skeleton-color` 等）。
