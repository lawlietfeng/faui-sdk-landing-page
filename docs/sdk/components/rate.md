# rate 组件

`rate`（评分）组件用于提供直观的星级评分体验。适用于服务质量评分、产品满意度、技能等级评定等场景。

## 适用场景

- **用户评价**：商品/服务满意度评分、星级评价（如酒店、餐厅、司机评价）。
- **等级展示**：展示某项事物的推荐指数、信誉等级或技能熟练度。
- **表单收集**：作为表单的一部分，收集用户对某一维度的量化评价。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（rate）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `disabled` |  | `boolean`, `expression`, `path`, 路径：`root-or-repeater-relative`, 纯表达式 |  |  |
| `allowHalf` |  | 静态值 |  |  |
| `count` |  | 静态值 |  |  |
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
- dataModel 绑定：`value`（number | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

### count（星星总数）

默认显示 5 颗星星。你可以通过修改 `count` 来支持 10 星制或其他自定义数量的评分。

```json
{
  "component": "rate",
  "id": "rate-count",
  "count": 10
}
```

### allowHalf（半星评分）

设置为 `true` 时，用户可以点击星星的左半边，给出诸如 `2.5`、`3.5` 的分数。

```json
{
  "component": "rate",
  "id": "rate-half",
  "allowHalf": true
}
```

### value & 双向绑定机制

`rate` 也是一个标准的受控表单组件。配置 `value.path` 即可实现双向绑定。

**自动回写**：当用户点击改变评分时，如果没有显式配置 `on_change` 动作，引擎会自动触发 `update_data` 将最新的数值（如 `3` 或 `4.5`）回写到 `value.path` 路径下。

```json
{
  "component": "rate",
  "id": "rate-binding",
  "value": {
    "path": "/form/serviceRating"
  },
  "allowHalf": true
}
```

### rules（表单校验）

配合 `form` 组件时，你可以限制用户的评分范围（如必须大于等于 1 星，不能评 0 星）。

```json
{
  "component": "rate",
  "id": "rate-rules",
  "value": {
    "path": "/form/productRating"
  },
  "rules": [
    {
      "required": true,
      "message": "请务必给出您的评分"
    },
    {
      "min": 1,
      "message": "评分至少为 1 星"
    }
  ]
}
```

## 高级用法：只读展示与动态交互

### 纯展示用途

如果只希望展示已有的评分结果而不允许用户修改，可配置 `disabled: true`，也可使用表达式或数据绑定动态禁用。

### 带提示文字的联动

评分组件本身不直接包含文字提示，但你可以结合插值表达式和 `text` 组件，在评分旁边动态显示诸如“极好”、“一般”、“较差”的文字。

```json
[
  {
    "component": "box",
    "id": "rate-wrapper",
    "layout": "horizontal",
    "align": "center",
    "spacing": 12,
    "children": ["rate-action", "rate-text"]
  },
  {
    "component": "rate",
    "id": "rate-action",
    "value": {
      "path": "/feedback/score"
    }
  },
  {
    "component": "text",
    "id": "rate-text",
    "content": "${$root.feedback.score >= 4 ? '非常满意' : ($root.feedback.score >= 3 ? '一般' : '需要改进')}"
  }
]
```

## 完整示例

这是一个包含半星、校验规则以及动作拦截的完整示例：

```json
{
  "component": "rate",
  "id": "rate-complex",
  "count": 5,
  "allowHalf": true,
  "value": {
    "path": "/survey/driverScore"
  },
  "rules": [
    {
      "required": true,
      "message": "请为司机打分"
    }
  ],
  "on_change": [
    {
      "action": "update_data",
      "path": "/survey/driverScore",
      "value": "${$value}"
    },
    {
      "action": "message",
      "payload": {
        "type": "info",
        "content": "您给出了 ${$value} 星评价"
      }
    }
  ]
}
```

## 新手常见问题

**Q: 旧文档里说 `on_change` 必须配置才能回写？**
- 现已修复。与 `input`、`radio` 等表单组件一样，只要配置了 `value.path` 且未配置 `on_change`，引擎会自动执行 `update_data` 回写。

**Q: 评分的初始值和最小值是什么？**
- 默认初始值取决于 `dataModel` 中对应路径的值。如果未设置或值为 `0`，则不显示任何高亮的星星。
- 默认情况下用户可以通过再次点击已选中的星星来取消评分（将其重置为 `0`）。如果业务要求必须评分，请使用 `rules` 中的 `min: 1` 校验拦截。

**Q: 我可以自定义星星的图标吗？比如用爱心代替星星。**
- 当前 FAUI 基础封装的 `rate` 尚未透出 Ant Design 的 `character` 属性，因此暂不支持直接替换图标形状。可以通过全局 CSS 或等待后续引擎升级支持。
