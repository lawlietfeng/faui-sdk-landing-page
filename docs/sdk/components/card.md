# card 组件

card 组件是一个标准的卡片容器，包含标题、内容区域，并自带一定的内边距和边框样式。它通常用于将页面上的信息进行区块化、模块化的视觉隔离。

## 适用场景

- **信息区块展示**：将相关联的表单、数据展示或图表包裹在一个卡片内，使页面结构更清晰。
- **后台管理面板**：常用于仪表盘 (Dashboard) 的各个独立模块。

## 核心属性

### 属性总览

| 属性名     | 类型                             | 默认值       | 说明                               |
| ---------- | -------------------------------- | ------------ | ---------------------------------- |
| `title`    | `string` (支持表达式)            | -            | 卡片的标题。                       |
| `variant`  | `'outlined' \| 'borderless'`     | `'outlined'` | 卡片外观变体（带边框或无边框）。   |
| `size`     | `'default' \| 'small'`           | `'default'`  | 卡片尺寸（主要影响内边距）。       |
| `bordered` | `boolean`                        | `true`       | 是否有边框（已弃用，推荐用 variant）。|
| `children` | `string[]`                       | `[]`         | 卡片内容区包裹的子组件 ID 数组。   |

---

### title（卡片标题）

显示在卡片顶部的标题文字。支持 `useExpression` 表达式，可以动态渲染。如果不配置该属性，卡片将不渲染头部区域。

```json
{
  "id": "info_card",
  "component": "card",
  "title": "基础信息（${data.userName}）",
  "children": ["user_form"]
}
```

### variant（外观变体）

控制卡片是否有外边框。

| 值           | 效果                               | 典型用途               |
| ------------ | ---------------------------------- | ---------------------- |
| `outlined`   | 带有灰色边框（默认）               | 放在纯白背景页面中，用于区分区块 |
| `borderless` | 无边框（纯白底色）                 | 放在灰色背景的页面中，产生浮雕感 |

```json
{
  "id": "dashboard_card",
  "component": "card",
  "title": "统计数据",
  "variant": "borderless",
  "children": ["stat_chart"]
}
```
*提示：早期版本使用 `bordered: false` 实现无边框，目前已向前兼容，但推荐使用 `variant: "borderless"`。*

### size（卡片尺寸）

控制卡片的整体内边距。

| 值        | 效果             | 典型用途                 |
| --------- | ---------------- | ------------------------ |
| `default` | 默认较大的内边距 | 绝大多数常规页面的卡片     |
| `small`   | 较小的内边距     | 空间紧凑或内部需要更大面积的场景 |

```json
{
  "id": "mini_card",
  "component": "card",
  "title": "快捷操作",
  "size": "small",
  "children": ["action_buttons_box"]
}
```

## 完整示例

一个包含动态标题、无边框风格，并且包裹了表单组件的完整卡片配置：

```json
{
  "id": "user_profile_card",
  "component": "card",
  "title": "用户档案 - ${data.user.id}",
  "variant": "borderless",
  "size": "default",
  "style": {
    "boxShadow": "0 2px 8px rgba(0,0,0,0.08)",
    "marginBottom": 16
  },
  "children": [
    "user_avatar",
    "user_detail_form"
  ]
}
```

## 新手常见问题

**Q: 卡片内部的边距太大了，怎么去掉？**
- 首先可以尝试将 `size` 设为 `small`。如果依然无法满足需求，可以通过 `style` 属性强制覆盖，但需要注意，Ant Design 的 Card 组件内部包裹了一个 `.ant-card-body` 容器，直接在配置 `style` 中写 `padding` 可能作用在最外层而无法覆盖内部 `body` 的 padding。对于深度定制，推荐使用 `box` 组件自行构建卡片样式。

**Q: 卡片标题能放按钮或者其他组件吗？**
- 目前 `card` 的 `title` 属性仅支持字符串（含表达式插值）。如果需要在卡片右上角（如原生的 `extra` 属性）放置操作按钮，当前 FAUI 的 schema 暂未原生支持嵌套组件。你可以将卡片标题留空，在 `children` 内部顶部手动用 `box` 模拟一个带左右布局的标题栏。
