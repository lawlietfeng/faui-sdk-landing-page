# timeline 组件

用于垂直展示带有时间顺序的信息或步骤，支持静态配置、动态数据绑定以及复杂的子组件嵌套。

## 适用场景

- **历史记录**：展示操作日志、审批流转历史等按时间排序的事件。
- **进度追踪**：展示任务的当前状态以及过往的变更记录。
- **信息流**：在紧凑的空间内展示一系列有先后顺序的动态信息。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `TimelineItemType[]` | - | 静态配置的时间轴节点数组，每个节点支持 `color`、`label`、`content` 和 `position` |
| `data` | `ValueBinding` | - | 动态绑定数据源，绑定到全局状态的 `TimelineItemType[]` 数据，优先于 `items` |
| `mode` | `string` | `'left'` | 时间轴和内容的相对位置，支持表达式 |
| `pending` | `boolean \| string` | `false` | 是否显示幽灵节点（表示正在进行中），或直接配置幽灵节点的内容 |
| `reverse` | `boolean` | `false` | 是否倒序排列时间轴节点，支持表达式 |
| `children` | `string[]` | `[]` | 嵌套的子组件 ID 列表，用于渲染包含复杂组件的时间轴节点 |

### items（节点配置）

配置时间轴的各个节点。每个节点对象包含以下属性：
- `content`：节点的主要内容。
- `label`：节点的标签（通常展示时间）。
- `color`：圆圈颜色，支持 `blue`, `red`, `green`, `gray` 或具体的色值。
- `position`：自定义节点位置（仅在 `mode="alternate"` 时生效），可选 `'left'` 或 `'right'`。

```json
{
  "id": "static_timeline",
  "type": "element",
  "config": {
    "component": "timeline",
    "items": [
      {
        "content": "创建服务现场",
        "label": "2015-09-01",
        "color": "green"
      },
      {
        "content": "初步排查网络异常",
        "label": "2015-09-02",
        "color": "blue"
      },
      {
        "content": "网络异常处理完毕",
        "label": "2015-09-03",
        "color": "red"
      }
    ]
  }
}
```

### mode（展示模式）

控制时间轴节点的排列方式，支持表达式。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `'left'` | 内容在右，时间轴在左 | 默认模式，适合常规时间轴展示 |
| `'right'` | 内容在左，时间轴在右 | 适合内容对齐在左侧边缘的排版 |
| `'alternate'` | 内容交替排列在时间轴两侧 | 适合展示步骤较多且空间充足的信息流 |

```json
{
  "id": "timeline_mode",
  "type": "element",
  "config": {
    "component": "timeline",
    "mode": "alternate",
    "items": [
      { "content": "步骤一", "label": "10:00" },
      { "content": "步骤二", "label": "11:00" }
    ]
  }
}
```

### pending（幽灵节点）

当设置幽灵节点时，会在时间轴末尾添加一个虚线样式的节点，通常用于表示某个任务正在进行中或有未完成的步骤。

```json
{
  "id": "timeline_pending",
  "type": "element",
  "config": {
    "component": "timeline",
    "pending": "正在记录...",
    "items": [
      { "content": "步骤一已完成", "color": "green" },
      { "content": "步骤二已完成", "color": "green" }
    ]
  }
}
```

### reverse（倒序排列）

将节点按相反的顺序渲染，通常用于让最新的记录显示在最上方。

```json
{
  "id": "timeline_reverse",
  "type": "element",
  "config": {
    "component": "timeline",
    "reverse": true,
    "items": [
      { "content": "较早的记录" },
      { "content": "较新的记录" }
    ]
  }
}
```

## 数据源绑定机制 (data)

通过 `data.path` 可以将时间轴的节点绑定到全局 `dataModel`。绑定的数据格式必须为 `TimelineItemType[]`。如果同时配置了 `data.path` 和静态 `items`，引擎将优先渲染 `data.path` 绑定的动态数据。

```json
{
  "id": "dynamic_timeline",
  "type": "element",
  "config": {
    "component": "timeline",
    "data": {
      "path": "/logs"
    }
  }
}
```

## 嵌套子组件机制 (children)

如果时间轴的节点中需要包含其他组件（如按钮、卡片、图片等），可以不配置 `items`，而是使用 `children`。
此时引擎会将 `children` 中的每个组件作为一个节点：
- 组件的 `color` 属性将映射为圆圈的颜色。
- 组件的 `title` 属性将映射为节点的 `label`（如时间）。
- 组件本身的渲染结果作为节点的 `content`。

```json
{
  "id": "complex_timeline",
  "type": "element",
  "config": {
    "component": "timeline",
    "children": ["timeline_card_1", "timeline_card_2"]
  }
}
```

## 完整示例

结合动态数据、交替布局和表达式渲染的完整时间轴：

```json
[
  {
    "id": "root_box",
    "type": "element",
    "config": {
      "component": "box",
      "children": ["timeline_view"]
    }
  },
  {
    "id": "timeline_view",
    "type": "element",
    "config": {
      "component": "timeline",
      "mode": "alternate",
      "reverse": true,
      "pending": "等待最新更新...",
      "items": [
        {
          "content": "初始化项目",
          "label": "2023-01-01",
          "color": "green"
        },
        {
          "content": "发布 V1.0 版本",
          "label": "2023-06-01",
          "color": "blue"
        },
        {
          "content": "修复已知缺陷",
          "label": "2023-06-15",
          "color": "red"
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 为什么配置了 `items` 但是没有显示任何节点？**
- 检查是否同时配置了 `data.path`，如果 `data.path` 指向的全局数据为空数组或未初始化，它将覆盖静态的 `items` 配置。
- 检查 `items` 数组的格式，确保每个对象至少包含 `content` 属性。

**Q: 如何在节点内部放置按钮或者图片？**
- 静态的 `items` 配置仅支持纯文本（通过插值也可以支持部分变量）。如果需要渲染复杂的组件结构，请放弃配置 `items`，改为使用 `children` 数组。将目标组件（如 `card`、`button`）的 ID 放入 `children`，并在子组件的 `title` 属性中配置节点的时间标签。

**Q: 为什么 `mode="alternate"` 时，节点的左右位置没有生效？**
- 交替模式下，组件会自动计算节点位于左侧还是右侧。如果需要手动干预，可以在 `items` 的配置中为具体节点添加 `position: "left"` 或 `position: "right"`。注意：`position` 配置仅在 `mode="alternate"` 时才会生效。