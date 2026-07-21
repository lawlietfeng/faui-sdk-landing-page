# skeleton 组件

`skeleton`（骨架屏）组件用于在页面内容加载过程中，提供一个低感知、视觉连贯的占位骨架，以缓解用户的等待焦虑。

## 适用场景

- **网络请求等待**：在通过接口拉取长列表、详情数据、或者图片前，先展示对应的骨架图。
- **特定元素占位**：可以渲染为按钮、头像、输入框等特定的形状骨架。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean \| ValueBinding` | `true` | 控制骨架屏的显示状态（通常绑定为 `isLoading` 状态） |
| `active` | `boolean \| string` | `false` | 是否展示骨架屏的闪烁/流动动画 |
| `skeletonType` | `'button' \| 'avatar' \| 'input' \| 'image' \| 'node'` | - | 指定渲染为一个独立的特殊形状骨架 |
| `avatar` | `boolean \| object \| string` | `false` | 默认综合骨架中，是否包含头像占位图 |
| `paragraph` | `boolean \| object \| string` | `true` | 默认综合骨架中，是否包含段落占位图 |
| `title` | `boolean \| object \| string` | `true` | 默认综合骨架中，是否包含标题占位图 |
| `round` | `boolean \| string` | `false` | 段落和标题是否显示为圆角 |

### visible（加载状态控制）

`visible` 属性在 `skeleton` 中有特殊的行为：它实际上控制的是**是否处于加载状态**。
1. **当 `visible` 为 `true`（或绑定的值为真）时**：显示骨架屏的灰色占位图，隐藏内部包裹的真实 `children`。
2. **当 `visible` 为 `false`（或绑定的值为假）时**：骨架屏占位图消失，组件会直接渲染并显示内部真实的 `children` 内容。

通常我们会将它绑定到全局的请求状态标识上：

```json
{
  "component": "skeleton",
  "id": "user-info-skeleton",
  "visible": {
    "path": "/api/loading"
  },
  "active": true,
  "children": ["user-avatar", "user-name", "user-desc"]
}
```

### active（动画效果）

开启 `active: true` 会让骨架屏拥有呼吸/流动的动画效果，这能让用户感知到页面没有卡死，正在努力加载中。

```json
{
  "component": "skeleton",
  "id": "skeleton-active",
  "active": true,
  "visible": true
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
  "visible": {
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
- 在 FAUI 的实现中，`visible` 为 `true` 时，引擎会通知底层 Ant Design 渲染 `loading=true`。如果你不小心把 `visible` 绑定反了，或者通过其他方式强制渲染了 `children`，可能会导致重叠。请检查你的 `visible.path` 是否正确反映了 loading 状态。

**Q: 骨架屏的行数怎么调整？**
- 如果是普通的综合骨架，可以将 `paragraph` 配置为一个对象，指定 `rows` 属性，如 `"paragraph": { "rows": 6 }`。

**Q: 怎么把骨架屏的颜色改深一点？**
- 基础骨架组件无法直接配置颜色属性。如果你需要修改占位图的深浅，需要通过在 `style` 中或者外部类名覆盖对应的 CSS 变量（如 Ant Design 的 `@skeleton-color` 等）。
