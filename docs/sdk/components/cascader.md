# cascader 组件

`cascader` 级联选择组件，用于在一组具有层级关系的数据中进行选择（如省市区、公司部门架构等）。它支持数据双向绑定以及表单校验。

## 适用场景

- **省市区选择**：多级地址选择器。
- **组织架构选择**：选择公司 -> 部门 -> 小组。
- **商品分类**：选择大类 -> 中类 -> 小类。

## 核心属性

### 属性总览

<!-- contract-props:start -->
## Form 契约属性（cascader）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `options` |  | `expression` |  |  |
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
- dataModel 绑定：`value`（array | string | number | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

---

### value.path（数据绑定）

双向绑定的路径。级联选择器的值是一个数组，代表从根节点到叶子节点的路径值（例如选中的是浙江-杭州-西湖，那么值就是 `["zhejiang", "hangzhou", "xihu"]`）。

```json
{
  "id": "city-cascader",
  "component": "cascader",
  "value": {
    "path": "/selectedCity"
  }
}
```

### options（数据源）

级联的数据源结构，支持通过 `useExpression` 从全局状态动态获取（如 `${$root.cityTree}`）。如果静态配置，需满足树形结构：

| 字段       | 类型     | 说明                         |
| ---------- | -------- | ---------------------------- |
| `value`    | `string` | 选项的值（必须，且在同级唯一）|
| `label`    | `string` | 选项在界面上展示的文字       |
| `children` | `Array`  | 子级选项数组（结构同上）     |

```json
{
  "id": "static-cascader",
  "component": "cascader",
  "options": [
    {
      "value": "zhejiang",
      "label": "浙江",
      "children": [
        {
          "value": "hangzhou",
          "label": "杭州"
        },
        {
          "value": "ningbo",
          "label": "宁波"
        }
      ]
    }
  ]
}
```

### 表单校验 (rules)

与其它表单控件一样，当 cascader 放在 `form` 内时，可以通过 `rules` 进行校验。

```json
{
  "id": "required-cascader",
  "component": "cascader",
  "field": "address",
  "rules": [
    { "required": true, "message": "请选择地址" }
  ]
}
```

## 特有机制 / 高级用法

### 1. 表单联动与自动回写
在 `on_change` 未配置时，组件只要配置了 `value.path`，就会触发默认的 `update_data` 回写行为。如果你自定义了 `on_change` 动作并希望保持回写，你需要自己显式地调用 `update_data`，此时用户选中的数组可以通过 `${$value}` 注入。如果 on_change 中未设置 `value` 字段，组件会自动注入当前值；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。

## 完整示例

一个从数据模型中读取选项、并且必填的省市区级联选择器：

```json
{
  "id": "area_selector",
  "component": "cascader",
  "placeholder": "请选择省市区",
  "value": {
    "path": "/form/areaCode"
  },
  "options": "${$root.areaTree}",
  "rules": [
    { "required": true, "message": "此项必填" }
  ],
  "on_change": {
    "action": "message",
    "payload": {
      "type": "info",
      "content": "您选中的路径是：${$value}"
    }
  }
}
```

## 新手常见问题

**Q: 为什么我选不中最终的节点，点击没反应？**
- 检查你的 `options` 数组，每个对象都必须有 `value` 和 `label`。如果最底层节点依然包含空的 `children: []`，组件可能会认为它还没加载完子节点。请确保叶子节点不要有 `children` 属性。

**Q: 如何获取选中项的 label 文字？**
- 目前组件的 `onChange` 默认绑定的 `${$value}` 是 `value` 字段组成的数组（如 `["zhejiang", "hangzhou"]`）。如果需要转换成中文名称，建议在外部通过 `evaluateExpression` 结合原数据源进行匹配映射，或者在后续的后端请求中解析。
