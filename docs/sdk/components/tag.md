# tag 组件

`tag` 是一个标签组件，用于对事物进行标记、分类或展示特定状态。

## 适用场景

- **状态展示**：在表格或详情页中，展示记录的当前状态（如“已发货”、“审批中”、“异常”）。
- **属性标记**：为商品或用户打上不同的分类属性标签（如“VIP”、“新品”）。
- **关键词列举**：展示搜索关键词或文章标签。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | - | 标签内显示的文本内容，支持插值表达式 |
| `label` | `string` | - | 功能同 `content`，推荐优先使用 `content` |
| `color` | `string` | - | 标签的颜色。支持预设语义色或十六进制色值 |
| `bordered` | `boolean` \| `string` | `true` | 是否展示边框 |

### content（标签内容）

设置标签展示的文字内容，支持通过 `useExpression` 动态求值。

```json
{
  "id": "role-tag",
  "component": "tag",
  "content": "${/user/roleName}"
}
```

### color（标签颜色）

颜色是 `tag` 组件最常用的属性。支持两种赋值方式：

1. **Ant Design 预设语义色/基础色**：
   - 语义：`success`, `processing`, `error`, `warning`, `default`
   - 基础：`magenta`, `red`, `volcano`, `orange`, `gold`, `lime`, `green`, `cyan`, `blue`, `geekblue`, `purple`
2. **自定义十六进制色值**：如 `#f50`, `#87d068`, `#108ee9`

```json
{
  "id": "status-tag",
  "component": "tag",
  "color": "processing",
  "content": "处理中"
}
```

### bordered（无边框风格）

默认情况下标签自带细边框，在页面中出现大量标签时，可以通过设置 `bordered: false` 使用纯底色风格，减轻视觉负担。

```json
{
  "id": "borderless-tag",
  "component": "tag",
  "bordered": false,
  "color": "blue",
  "content": "无边框标签"
}
```

## 完整示例

展示一组不同颜色和风格的标签：

```json
{
  "id": "tag-container",
  "component": "space",
  "size": "middle",
  "children": ["tag-success", "tag-error", "tag-custom", "tag-borderless"]
},
{
  "id": "tag-success",
  "component": "tag",
  "color": "success",
  "content": "已完成"
},
{
  "id": "tag-error",
  "component": "tag",
  "color": "error",
  "content": "审核拒绝"
},
{
  "id": "tag-custom",
  "component": "tag",
  "color": "#87d068",
  "content": "自定义颜色"
},
{
  "id": "tag-borderless",
  "component": "tag",
  "color": "magenta",
  "bordered": false,
  "content": "纯底色标签"
}
```

## 在表格中使用

`tag` 组件经常在 `table` 组件中作为单元格渲染方式被使用。
此时无需显式声明 `tag` 组件，只需在 `columns` 中配置 `renderAs: "tag"` 即可：

```json
{
  "title": "订单状态",
  "dataIndex": "status",
  "renderAs": "tag",
  "statusColors": {
    "已完成": "green",
    "待处理": "orange",
    "已取消": "red"
  }
}
```

## 新手常见问题

**Q: 标签的颜色不支持我的输入？**
- 请检查拼写。`color` 支持 Ant Design 的预设颜色（如 `success`, `blue` 等）和符合 CSS 规范的色值（如 `#ff0000`）。如果输入了不支持的字符串，将回退为默认的灰色。

**Q: `content` 和 `label` 应该用哪个？**
- 两者在底层逻辑中效果完全相同（`content || label`）。为了保持整个 FAUI 的文档和编码规范统一，强烈建议优先使用 `content` 来表示组件的展示内容。

**Q: 标签可以点击吗？**
- `tag` 组件目前主要用于只读展示。如果你需要一个可交互、带反馈的组件，请考虑使用 `button`（配置为特定样式）或 `checkbox`。