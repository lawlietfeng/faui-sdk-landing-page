# statistic 组件

`statistic` 是统计数值组件，用于突出展示重要数据或提供倒计时功能。

## 适用场景

- **数据看板**：在数据大屏或后台首页展示核心业务指标（如总用户数、今日营收）。
- **倒计时**：电商秒杀、验证码重发等需要时间倒流的场景。
- **状态数值**：带有正负趋势样式的指标展示。

## 核心属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | `string` | - | 数值的标题（支持 `useExpression` 插值） |
| content | `number \| string` | - | 静态展示的数值（也可使用 `value.path` 动态绑定，支持 `useExpression` 插值） |
| value.path | `string` | - | 绑定的数据源路径（优先于 `content`） |
| precision | `number \| string` | - | 数值精度，即保留几位小数（支持 `useExpression` 插值） |
| prefix | `string \| ReactNode` | - | 设置数值的前缀，如 `¥` 或图标（支持 `useExpression` 插值） |
| suffix | `string \| ReactNode` | - | 设置数值的后缀，如 `%`（支持 `useExpression` 插值） |
| valueStyle | `object \| string` | - | 设置数值部分的样式，如颜色（支持 `useExpression` 插值） |
| isCountdown | `boolean \| string` | `false` | 是否作为倒计时组件使用（支持 `useExpression` 插值） |
| format | `string` | `"HH:mm:ss"` | 倒计时的时间格式（支持 `useExpression` 插值） |
| countUp | `boolean \| number \| string` | `false` | 是否开启数字滚动动画，滚动到可视区域时自动触发。传入数字表示动画持续时间(ms)（支持 `useExpression` 插值） |

### title（标题）与数值（content / value.path）

基础的统计数据展示，标题在上方，数值在下方放大显示。

```json
{
  "id": "active-users",
  "component": "statistic",
  "title": "活跃用户",
  "content": 112893
}
```

`content` 支持表达式插值，可以动态引用数据模型中的值：

```json
{
  "id": "dynamic-stat",
  "component": "statistic",
  "title": "当前得分",
  "content": "${$root.score}"
}
```

### precision（数值精度）

控制小数点后保留的位数。

```json
{
  "id": "account-balance",
  "component": "statistic",
  "title": "账户余额 (CNY)",
  "content": 112893,
  "precision": 2
}
```
*上述配置会显示为 `112,893.00`*

### prefix / suffix（前后缀）与 valueStyle（数值样式）

常用于展示带有趋势颜色或货币单位的数据。

```json
{
  "id": "growth-rate",
  "component": "statistic",
  "title": "月度增长率",
  "content": 11.28,
  "precision": 2,
  "suffix": "%",
  "valueStyle": { "color": "#3f8600" }
}
```

### isCountdown（倒计时模式）

当设置 `isCountdown: true` 时，组件会转变为倒计时模式。此时提供的值（`content` 或 `value.path` 绑定的值）必须是一个**未来的时间戳（毫秒）**。

```json
{
  "id": "sale-countdown",
  "component": "statistic",
  "isCountdown": true,
  "title": "距离秒杀结束还有",
  "content": 1735660800000,
  "format": "HH:mm:ss:SSS"
}
```

### countUp（数字滚动动画）

设置 `countUp` 可以为数值开启从 `0` 滚动到目标值的动画效果。当该组件滚动到可视区域内时，动画会自动触发。
如果传入 `true`，默认持续时间为 `1500` 毫秒。如果传入数字，则代表动画持续时间（单位：毫秒）。

```json
{
  "id": "animated-stat",
  "component": "statistic",
  "title": "总访问量",
  "content": 152034,
  "countUp": 2000
}
```

## 完整示例

### 数据看板片段

结合 `grid` 和 `card` 组件展示一组业务数据。

```json
[
  {
    "id": "dashboard-grid",
    "component": "grid",
    "columns": 2,
    "gutter": 16,
    "children": ["card-1", "card-2"]
  },
  {
    "id": "card-1",
    "component": "card",
    "children": ["stat-sales"]
  },
  {
    "id": "stat-sales",
    "component": "statistic",
    "title": "今日销售额",
    "value": { "path": "/dashboard/todaySales" },
    "precision": 2,
    "prefix": "¥",
    "valueStyle": { "color": "#cf1322" }
  },
  {
    "id": "card-2",
    "component": "card",
    "children": ["stat-users"]
  },
  {
    "id": "stat-users",
    "component": "statistic",
    "title": "新增用户",
    "value": { "path": "/dashboard/newUsers" },
    "suffix": "人",
    "valueStyle": { "color": "#3f8600" }
  }
]
```

## 新手常见问题

**Q: 为什么我的倒计时一直是 00:00:00？**
- 检查你传入的时间戳。倒计时模式要求传入的值必须是**未来的绝对时间戳**（毫秒级，如 `Date.now() + 1000 * 60 * 60 * 24`），而不是剩余的毫秒数。
- 如果传入的时间戳早于当前时间，倒计时就会显示为 0。

**Q: 倒计时支持天数显示吗？**
- 支持，可以通过修改 `format` 属性来实现，例如 `"D 天 H 时 m 分 s 秒"`。

**Q: 统计数值可以添加千分位逗号吗？**
- 默认情况下，只要传入的是 `number` 类型，组件就会自动处理千分位格式（如 `112,893`）。如果你传入的是带有千分位的 `string`，则会原样展示。

**Q: 我可以在 `prefix` 中放图标吗？**
- 在 JSON Schema 配置中，直接放置 React Node 是不可能的。但是你可以使用 `useExpression` 插值，或者如果是简单的符号（如 `↑`, `↓`）可以直接写在字符串中。如果必须展示复杂图标，建议通过组合 `box` + `icon` + `text` 组件来实现。

**Q: content 里的 `${...}` 表达式没有被求值？**
- `content` 已支持 `useExpression` 插值。确保表达式格式正确，如 `"content": "${$root.count}"`。如果同时配置了 `value.path`，绑定值优先于 `content`。
