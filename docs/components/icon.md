# icon 图标组件

`icon` 组件用于渲染基于 SVG 的矢量图标。FAUI 引擎全量内置了 `@ant-design/icons` 图标库，你可以直接通过名称调用其中的任意图标。

## 适用场景

- **文字辅助**：放在按钮文字、菜单项、标题旁边，增强视觉辨识度。
- **状态指示**：通过不同的图标（如成功、警告、错误）和颜色表示当前状态。
- **加载提示**：开启 `spin` 属性作为轻量级的 Loading 指示器。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `string` | - | 图标的官方组件名称，如 `HomeOutlined`、`SettingFilled` |
| `value` | `ValueBinding` | - | 通过双向绑定动态控制要显示的图标名称 |
| `spin` | `boolean` | `false` | 是否开启一直旋转的动画效果 |
| `rotate` | `number` | - | 静态图标的旋转角度（单位：度） |

### icon（图标名称）

指定要渲染的图标。必须与 Ant Design 官方图标库中的驼峰命名完全一致。你可以前往 [Ant Design Icons](https://ant.design/components/icon-cn) 官网查找需要的图标名称。

```json
{
  "id": "icon-setting",
  "component": "icon",
  "icon": "SettingOutlined"
}
```

### value（动态图标绑定）

除了写死静态的 `icon` 之外，你可以通过 `value.path` 绑定全局数据状态。这在根据数据状态动态切换图标（如播放/暂停，展开/收起）时非常有用。

> **优先级机制**：如果同时配置了 `value.path` 且该路径下有值，引擎会优先渲染绑定路径中的图标名；如果没有值，则回退渲染静态 `icon` 属性。

```json
{
  "id": "icon-dynamic",
  "component": "icon",
  "icon": "QuestionCircleOutlined",
  "value": {
    "path": "/status/currentIconName"
  }
}
```

### spin & rotate（动画与旋转）

`spin` 可以让图标拥有加载中的旋转效果（常用于 `SyncOutlined` 或 `LoadingOutlined`）；`rotate` 可以对静态图标进行角度调整。

```json
{
  "id": "icon-loading",
  "component": "icon",
  "icon": "SyncOutlined",
  "spin": true
}
```

## 样式控制 (style)

`icon` 本质上是一个字体图标，因此你可以直接使用常规的文本 CSS 属性（如 `color` 和 `fontSize`）来控制它的颜色和大小。

```json
{
  "id": "icon-colored",
  "component": "icon",
  "icon": "CheckCircleFilled",
  "style": {
    "color": "#52c41a",
    "fontSize": "24px",
    "marginRight": "8px"
  }
}
```

## 完整示例

以下示例展示了不同形态和样式的图标组合：

```json
[
  {
    "id": "icon-container",
    "component": "flex",
    "gap": 16,
    "align": "center",
    "children": [
      "icon-basic",
      "icon-large-red",
      "icon-spinning",
      "icon-rotated"
    ]
  },
  {
    "id": "icon-basic",
    "component": "icon",
    "icon": "HomeOutlined"
  },
  {
    "id": "icon-large-red",
    "component": "icon",
    "icon": "HeartFilled",
    "style": {
      "color": "#ff4d4f",
      "fontSize": "32px"
    }
  },
  {
    "id": "icon-spinning",
    "component": "icon",
    "icon": "LoadingOutlined",
    "style": {
      "color": "#1890ff"
    },
    "spin": true
  },
  {
    "id": "icon-rotated",
    "component": "icon",
    "icon": "ArrowUpOutlined",
    "rotate": 45
  }
]
```

## 新手常见问题

**Q: 为什么我在官网复制了 `<HomeOutlined />`，填到 JSON 里却报错了？**
- 在 JSON 配置文件中，你只能填写纯字符串名称 `"HomeOutlined"`，不能带有 JSX/HTML 标签的尖括号（`<`、`>`）和斜杠（`/`）。

**Q: 为什么我填了名字，页面上却没有显示图标，控制台还报 `Icon xxx not found`？**
- 检查名称拼写是否完全正确，严格区分大小写（必须是大驼峰）。
- 检查是否遗漏了后缀。Ant Design 的图标通常带有 `Outlined`（线框）、`Filled`（实底）或 `TwoTone`（双色）后缀。例如，不存在叫 `Home` 的图标，正确的名字是 `HomeOutlined` 或 `HomeFilled`。

**Q: 图标组件支持点击事件 `on_tap` 吗？**
- `icon` 组件本身是一个纯展示组件，并未封装 `on_tap`。如果你需要一个可点击的图标，建议将 `icon` 放入 `button` 组件（设置 `type: "text"` 或不设置文本）中，利用 `button` 的 `on_tap` 来处理点击事件。