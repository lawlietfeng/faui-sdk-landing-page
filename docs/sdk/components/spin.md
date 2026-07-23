# spin 组件

`spin` 是加载中提示组件，用于在页面或区块进行数据请求或耗时操作时，提供一个旋转的加载动画，缓解用户的等待焦虑。

## 适用场景

- **局部加载遮罩**：包裹在图表、表格或卡片外层，数据加载时阻止用户操作。
- **整页加载**：在页面初始化或路由跳转时提供全局居中的加载提示。
- **按钮/小部件加载**：在小尺寸区域提供行内的等待动画。

## 核心属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| spinning | `boolean \| string` | `true` | 是否处于加载中状态（支持 `useExpression` 插值） |
| tip | `string` | - | 自定义加载描述文案（支持 `useExpression` 插值） |
| size | `string` | `"default"` | 组件大小，可选 `"small" \| "default" \| "large"`（支持 `useExpression` 插值） |
| children | `string[]` | `[]` | 需要被加载遮罩覆盖的子组件 ID 列表 |

### spinning（控制加载状态）

最核心的属性，通常绑定一个全局状态来动态控制加载动画的显示与隐藏。

```json
{
  "id": "loading-spin",
  "component": "spin",
  "spinning": "${$root.isLoading}"
}
```

### tip（自定义描述文案）

在旋转图标下方显示一段提示文字，仅在包裹了子组件或设置了较大高度时建议使用。

```json
{
  "id": "tip-spin",
  "component": "spin",
  "spinning": true,
  "tip": "数据拼命加载中，请稍后..."
}
```

### size（组件大小）

控制加载图标的尺寸。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"small"` | 小号图标 | 按钮内部、紧凑的行内文本旁 |
| `"default"` | 中号图标 | 默认尺寸，适用于一般的卡片或区块 |
| `"large"` | 大号图标 | 全局页面加载、大面积的图表遮罩 |

```json
{
  "id": "large-spin",
  "component": "spin",
  "size": "large"
}
```

### 包裹子组件 (作为遮罩层)

当配置了 `children` 时，`spin` 会自动将这些子组件包裹在一个容器中。当 `spinning` 为 `true` 时，会在子组件上方覆盖一层带有半透明背景的加载遮罩，阻止用户点击其中的内容。

```json
{
  "id": "container-spin",
  "component": "spin",
  "spinning": "${$root.isTableLoading}",
  "tip": "获取最新数据...",
  "children": ["user-table"]
}
```

## 完整示例

### 全局状态控制区块加载

这是一个完整的交互示例：点击按钮后触发加载状态，包裹着文本区块的 `spin` 会显示遮罩。

```json
[
  {
    "id": "page-root",
    "component": "box",
    "children": ["control-btn", "content-spin"]
  },
  {
    "id": "control-btn",
    "component": "button",
    "label": "点击模拟加载 2 秒",
    "on_tap": [
      { "action": "update_data", "path": "/loading", "value": true },
      { "action": "timeout", "payload": { "delay": 2000 } },
      { "action": "update_data", "path": "/loading", "value": false }
    ]
  },
  {
    "id": "content-spin",
    "component": "spin",
    "spinning": "${$root.loading ?? false}",
    "tip": "处理中...",
    "style": { "marginTop": "20px" },
    "children": ["content-box"]
  },
  {
    "id": "content-box",
    "component": "box",
    "style": {
      "padding": "40px",
      "border": "1px solid #d9d9d9",
      "background": "#fafafa"
    },
    "children": ["content-text"]
  },
  {
    "id": "content-text",
    "component": "text",
    "content": "这是一段重要的内容，加载时你无法操作它。"
  }
]
```

## 新手常见问题

**Q: 页面一直处于加载中，无法进行任何操作？**
- 检查 `spinning` 属性是否被写死为 `true`，或者其绑定的表达式变量是否没有被正确重置为 `false`。
- 如果通过请求 Action 来控制加载状态，务必确保在请求的成功回调和**失败回调**中，都执行了关闭加载状态的 `update_data`，否则接口一旦报错就会导致页面永久卡死。

**Q: 为什么作为遮罩层包裹内容时，图标没有垂直居中？**
- `spin` 默认会尝试在内容区域居中。如果你的子内容本身高度为 0，图标可能看起来位置不对。请确保被包裹的组件（如 `box`）撑开了足够的高度。

**Q: 我想自定义加载图标（换成其他 SVG），支持吗？**
- 目前 FAUI 的 `spin` 组件仅支持 Ant Design 默认的旋转圆环图标，暂不支持传入自定义的 `indicator` 节点。

**Q: 为什么我只写了 `tip` 却没有显示文字？**
- 只有当 `spinning` 为 `true` 且组件处于加载状态时，`tip` 文案才会显示。如果你把它当做一个纯展示的静态组件（未包裹子节点），文字可能会因为布局原因被截断，建议结合外层 `box` 或配置 `children` 一起使用。
