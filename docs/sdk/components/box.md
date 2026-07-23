# box 组件

box 组件是 FAUI 中最基础、最常用的布局容器，它的行为类似于 HTML 中的 `div`，但内置了基于 Flexbox 的简易布局能力。

## 适用场景

- **页面根容器**：包裹整个页面的所有组件。
- **区块划分**：将页面划分成不同的功能区域（如头部、侧边栏、内容区）。
- **组件排列**：当需要将多个组件按水平或垂直方向排列时（如按钮组、表单项）。

## 核心属性

### 属性总览

| 属性名    | 类型                         | 默认值       | 说明                               |
| --------- | ---------------------------- | ------------ | ---------------------------------- |
| `layout`  | `'vertical' \| 'horizontal'` | `'vertical'` | 内部子组件的排列方向。             |
| `spacing` | `number`                     | `0`          | 子组件之间的间距（即 flex gap）。  |
| `padding` | `number \| string`           | `0`          | 容器的内边距。                     |
| `align`   | `string`                     | -            | 侧轴（交叉轴）对齐方式。           |
| `justify` | `string`                     | -            | 主轴对齐方式。                     |
| `children`| `string[]`                   | `[]`         | 内部包裹的子组件 ID 数组。         |

---

### layout（排列方向）

控制内部子组件是垂直排列还是水平排列。

| 值           | 效果                               | 典型用途               |
| ------------ | ---------------------------------- | ---------------------- |
| `vertical`   | 从上到下垂直排列（默认）           | 表单、列表、页面整体骨架 |
| `horizontal` | 从左到右水平排列                   | 导航栏、工具栏、按钮组 |

```json
{
  "id": "my_box",
  "component": "box",
  "layout": "horizontal",
  "children": ["btn_1", "btn_2"]
}
```

### spacing（间距）

控制内部子组件之间的间距（本质上映射为 CSS 的 `gap` 属性）。

```json
{
  "id": "my_box",
  "component": "box",
  "layout": "horizontal",
  "spacing": 16,
  "children": ["btn_1", "btn_2"]
}
```

### padding（内边距）

控制容器边缘与内部内容之间的距离，支持传入数字或字符串。

```json
{
  "id": "my_box",
  "component": "box",
  "padding": 24,
  "children": ["content_text"]
}
```

### align（侧轴对齐）

控制子组件在交叉轴（与 `layout` 垂直的方向）上的对齐方式。

| 值        | 效果           | 对应 CSS          |
| --------- | -------------- | ----------------- |
| `start`   | 靠上/靠左对齐  | `flex-start`      |
| `center`  | 居中对齐       | `center`          |
| `end`     | 靠下/靠右对齐  | `flex-end`        |
| `stretch` | 拉伸填满       | `stretch`         |

```json
{
  "id": "my_box",
  "component": "box",
  "layout": "horizontal",
  "align": "center",
  "children": ["icon", "text"]
}
```

### justify（主轴对齐）

控制子组件在主轴（与 `layout` 相同的方向）上的对齐方式。

| 值              | 效果             | 对应 CSS          |
| --------------- | ---------------- | ----------------- |
| `start`         | 靠左/靠上对齐    | `flex-start`      |
| `center`        | 居中对齐         | `center`          |
| `end`           | 靠右/靠下对齐    | `flex-end`        |
| `space-between` | 两端对齐         | `space-between`   |
| `space-around`  | 环绕对齐         | `space-around`    |

```json
{
  "id": "my_box",
  "component": "box",
  "layout": "horizontal",
  "justify": "space-between",
  "children": ["left_logo", "right_menu"]
}
```

## 高级用法 / 嵌套规则

`box` 组件最重要的特性就是可以通过 `children` 数组无限嵌套其他组件，甚至是另一个 `box`。在构建复杂页面时，通常会将多个 `box` 进行组合。

**嵌套示意**：
```text
root_box (vertical)
 ├── header_box (horizontal, space-between)
 │    ├── logo_img
 │    └── user_avatar
 └── content_box (vertical, padding: 24)
      ├── title_text
      └── data_table
```

## 完整示例

一个典型的带有内边距、水平排列、两端对齐且有间距的导航栏容器：

```json
{
  "id": "header_container",
  "component": "box",
  "layout": "horizontal",
  "padding": 16,
  "spacing": 24,
  "align": "center",
  "justify": "space-between",
  "style": {
    "backgroundColor": "#ffffff",
    "borderBottom": "1px solid #e8e8e8"
  },
  "children": [
    "logo_image",
    "nav_menu",
    "user_profile_box"
  ]
}
```

## 新手常见问题

**Q: 为什么给 box 设置了 height: "100%" 却没有撑满全屏？**
- 检查其父级容器（或根节点）是否也具有 `height: "100%"` 或 `height: "100vh"`。Flexbox 的百分比高度依赖于父级的高度。

**Q: justify 为 space-between 没有生效？**
- 确保当前 box 的宽度或高度（取决于 layout 方向）大于其内部子组件的总和，否则没有剩余空间用于分配，`space-between` 将无法体现效果。

**Q: 能够对单个子组件设置独立的对齐吗？**
- `box` 组件自身只控制整体的 `align` 和 `justify`。如果需要对某个特定子组件进行独立对齐，请为该子组件的 `style` 配置 `alignSelf`。
