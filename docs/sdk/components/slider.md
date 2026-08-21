# slider 组件

`slider` 是滑动输入条组件，通过拖动滑块来选择数值，适用于价格范围、评分、音量等需要连续值选择的场景。

## 适用场景

- **范围筛选**：如价格区间、时间区间等。
- **连续值调节**：如音量、亮度、缩放比例调节。
- **评分选择**：配合数值显示，提供直观的拖动体验。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（slider）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `min` |  | 静态值 |  |  |
| `max` |  | 静态值 |  |  |
| `step` |  | 静态值 |  |  |
| `range` |  | 静态值 |  |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `value` |  | `path`, 路径：`root-or-repeater-relative` |  |  |
| `field` |  | 静态值 | 表单校验字段名；不负责替代 value.path。 |  |
| `rules` |  | 静态值 |  |  |
| `validateTrigger` |  | 静态值 |  |  |
| `on_change` |  | 静态值 |  |  |
| `name` |  | 静态值 |  |  |
| `domId` |  | 静态值 |  |  |
| `style` |  | 静态值 |  |  |
| `className` |  | 静态值 |  |  |
| `animation` |  | 静态值 |  |  |
| `visible` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 | 控制组件是否渲染。 |  |
| `on_mount` |  | 静态值 | 组件挂载时执行的 Action。 |  |

- 子节点模式：`none`
- 事件：`on_change`
- dataModel 绑定：`value`（number | array | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

### min / max（最小值/最大值）

设置滑动范围的上下限：

```json
{
  "id": "price-slider",
  "component": "slider",
  "min": 0,
  "max": 1000
}
```

### step（步长）

设置每次拖动的最小单位：

```json
{
  "id": "price-slider",
  "component": "slider",
  "min": 0,
  "max": 1000,
  "step": 10
}
```

### range（双滑块模式）

开启双滑块模式后，滑块可选择一段范围，绑定的数据也将变成数组格式 `[min, max]`：

```json
{
  "id": "price-slider",
  "component": "slider",
  "min": 0,
  "max": 1000,
  "range": true,
  "value": {
    "path": "/priceRange"
  }
}
```

### disabled（禁用）

将滑块设为禁用状态，无法拖动：

```json
{
  "id": "disabled-slider",
  "component": "slider",
  "disabled": true,
  "value": {
    "path": "/volume"
  }
}
```

## 完整示例

### 基础单滑块与双向绑定

配合 `text` 组件实时显示当前拖动的值。

```json
[
  {
    "id": "volume-section",
    "component": "box",
    "layout": "horizontal",
    "spacing": 12,
    "align": "center",
    "children": ["volume-slider", "volume-value"]
  },
  {
    "id": "volume-slider",
    "component": "slider",
    "min": 0,
    "max": 100,
    "step": 1,
    "value": {
      "path": "/volume"
    }
  },
  {
    "id": "volume-value",
    "component": "text",
    "content": "当前音量: ${$root.volume ?? 0}"
  }
]
```

### 价格区间筛选（表单场景）

在表单中使用双滑块来筛选区间，并设置必填校验：

```json
[
  {
    "id": "filter-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": ["price-range-slider", "submit-btn"]
  },
  {
    "id": "price-range-slider",
    "component": "slider",
    "min": 0,
    "max": 10000,
    "step": 100,
    "range": true,
    "value": {
      "path": "/priceRange"
    },
    "rules": [
      { "required": true, "message": "请选择价格范围" }
    ]
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "搜索",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": {
            "method": "POST",
            "path": "/api/search",
            "body": { "price": "${$root.priceRange}" }
          }
        }
      }
    ]
  }
]
```

## 新手常见问题

**Q: 单滑块和双滑块（`range: true`）的数据格式有什么区别？**
- 单滑块：数据为数字 (`number`)，例如 `50`。
- 双滑块：数据为包含两个数字的数组 (`[number, number]`)，例如 `[20, 80]`。如果初始未赋值，引擎会默认初始化为 `[0, 0]`。

**Q: 为什么我没有配置 `on_change`，但滑动时数据依然更新了？**
- 只要配置了 `value.path`，组件引擎默认具有 fallback 机制，会自动执行 `{ action: 'update_data', path: '你的path', value: '当前值' }` 实现双向绑定。除非你需要在滑动时额外触发请求（如搜索），否则不需要显式编写 `on_change`。

**Q: 如何设置双滑块的初始值？**
- 在页面的初始 `dataModel` 中为对应路径设置数组，或者由外部请求获取后写入：
```json
{
  "dataModel": {
    "priceRange": [100, 500]
  }
}
```

**Q: 文档里说 Ant Design 有 `marks` 刻度功能，FAUI 的 `slider` 支持吗？**
- **不支持**。FAUI 的 `slider` 目前未透出 `marks` 属性，请勿在配置中臆想添加 `marks`。如果需要离散的几档选择，可以考虑使用 `radio` 或 `segmented`。

**Q: 滑块可以垂直显示吗？**
- 目前 `slider` 组件仅支持默认的水平显示，暂未透出 `vertical` 属性。
