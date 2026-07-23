# chart — 数据可视化组件

基于 Apache ECharts 的声明式图表组件。支持简化模式（快速生成常见图表）和原生模式（完整 ECharts option）。

## 前置依赖

```bash
npm install echarts
```

`echarts` 是 optional peerDependency，未安装时 chart 组件会显示友好提示。

## 简化模式

通过 `chartType` + `xField` + `yField` 快速生成图表：

```json
{
  "id": "revenue-chart",
  "component": "chart",
  "chartType": "line",
  "data": { "path": "/salesData" },
  "xField": "month",
  "yField": "revenue",
  "title": "月度营收",
  "height": 400,
  "smooth": true
}
```

多系列（多条线 / 多柱）：

```json
{
  "id": "multi-line",
  "component": "chart",
  "chartType": "line",
  "data": { "path": "/salesData" },
  "xField": "month",
  "yField": ["revenue", "cost", "profit"],
  "showLegend": true
}
```

按字段分组：

```json
{
  "id": "grouped-bar",
  "component": "chart",
  "chartType": "bar",
  "data": { "path": "/salesData" },
  "xField": "month",
  "yField": "value",
  "seriesField": "category",
  "stacked": true
}
```

## 原生模式

直接传 ECharts option 对象，支持全部 50+ 图表类型：

```json
{
  "id": "custom-chart",
  "component": "chart",
  "option": {
    "tooltip": { "trigger": "axis" },
    "xAxis": { "type": "category", "data": ["Mon", "Tue", "Wed"] },
    "yAxis": { "type": "value" },
    "series": [
      { "name": "销售", "type": "bar", "data": [120, 200, 150] },
      { "name": "利润", "type": "line", "data": [80, 130, 95] }
    ]
  },
  "height": 400
}
```

有 `option` 时用原生模式，否则用简化模式。

## 属性

### 通用属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `height` | `number \| string` | `400` | 图表容器高度 |
| `theme` | `'light' \| 'dark' \| string` | — | ECharts 主题 |
| `loading` | `boolean \| string` | — | 加载状态，支持表达式 |
| `style` | `CSSProperties` | — | 容器自定义样式 |

### 初始化时序

Chart 组件会等待容器获得非零尺寸（`clientWidth > 0 && clientHeight > 0`）后再初始化 ECharts 实例。如果容器在首次渲染时尺寸为 0（例如在动画容器、Condition 分支、Spin 等延迟渲染场景中），组件会通过 ResizeObserver + requestAnimationFrame 自动重试（最多 20 帧 ≈ 330ms），确保容器获得尺寸后立即完成初始化。

> **注意**：在 flex 布局中使用 Chart 时，确保图表的父容器有明确的宽度（如 `"width": "100%"`），否则 ECharts 可能因为拿不到容器宽度而无法渲染。

### 简化模式属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `chartType` | `string` | 图表类型（见下方列表） |
| `data` | `ValueBinding` | 数据源路径 |
| `xField` | `string` | X 轴字段名 |
| `yField` | `string \| string[]` | Y 轴字段名，数组时生成多系列 |
| `seriesField` | `string` | 分组字段 |
| `smooth` | `boolean` | 折线是否平滑 |
| `stacked` | `boolean` | 是否堆叠 |
| `showLegend` | `boolean` | 显示图例 |
| `showTooltip` | `boolean` | 显示 tooltip（默认 true） |

### 原生模式属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `option` | `Record<string, unknown>` | 完整 ECharts option 对象 |

### 支持的 chartType

| chartType | 说明 |
|-----------|------|
| `line` | 折线图 |
| `bar` | 柱状图 |
| `pie` | 饼图 |
| `scatter` | 散点图 |
| `area` | 面积图 |
| `radar` | 雷达图 |
| `gauge` | 仪表盘 |
| `funnel` | 漏斗图 |
| `heatmap` | 热力图 |

## 表达式支持

所有属性支持 `${...}` 动态表达式：

```json
{
  "component": "chart",
  "chartType": "line",
  "data": { "path": "/salesData" },
  "title": "${$root.chartTitle}",
  "loading": "${$root.isLoading}"
}
```

## 演示

`examples/schemas/16-chart-demo.json`
