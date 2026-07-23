# select 组件

`select` 是下拉选择框组件，适用于从多个选项中选择一个的场景，如选择类型、状态、部门等。

## 适用场景

- 申请类型选择（普通/紧急）
- 部门、岗位选择
- 状态筛选
- 国家/城市选择
- 任何枚举型字段的输入

## 核心属性

### options（选项列表）

`options` 是一个数组，每个元素包含 `label`（显示文本）和 `value`（实际值）：

```json
{
  "id": "type-select",
  "component": "select",
  "options": [
    { "label": "普通申请", "value": "normal" },
    { "label": "紧急申请", "value": "urgent" },
    { "label": "加急申请", "value": "express" }
  ]
}
```

- `label`：用户看到的选项文字
- `value`：选中后实际保存到数据模型的值（可以是字符串、数字等）

### placeholder（占位提示）

```json
{
  "id": "type-select",
  "component": "select",
  "placeholder": "请选择申请类型",
  "options": [...]
}
```

### value.path（数据绑定）

将选中值绑定到 `dataModel`：

```json
{
  "id": "type-select",
  "component": "select",
  "value": { "path": "/requestType" }
}
```

### on_change（值变化事件）

当用户选择新值时触发。组件会自动将新值注入到 action 上下文中的 `$value` 变量，可在表达式中通过 `${$value}` 引用。

**基础用法** — 不设 `value` 字段时，组件自动将选中值作为 action 的 value：

```json
{
  "id": "type-select",
  "component": "select",
  "value": { "path": "/requestType" },
  "on_change": { "action": "update_data", "path": "/requestType" }
}
```

**自定义 value 表达式** — 设置 `value` 字段时，组件保留你的表达式，不会覆盖：

```json
{
  "id": "type-select",
  "component": "select",
  "value": { "path": "/requestType" },
  "on_change": {
    "action": "update_data",
    "path": "/form/selectedType",
    "value": "prefix_${$value}"
  }
}
```

> `$value` 始终等于组件的原始新值，无论 on_change 中是否设置了自定义 `value`。

### rules（校验规则）

常用 `required` 校验是否已选择：

```json
{
  "id": "type-select",
  "component": "select",
  "rules": [{ "required": true, "message": "请选择申请类型" }]
}
```

## 完整示例

### 基础选择框

```json
{
  "id": "type-select",
  "component": "select",
  "placeholder": "请选择申请类型",
  "value": { "path": "/requestType" },
  "options": [
    { "label": "普通申请", "value": "normal" },
    { "label": "紧急申请", "value": "urgent" }
  ],
  "rules": [{ "required": true, "message": "请选择申请类型" }],
  "on_change": { "action": "update_data", "path": "/requestType", "value": "${value}" }
}
```

### 部门选择

```json
{
  "id": "department-select",
  "component": "select",
  "placeholder": "请选择所属部门",
  "value": { "path": "/department" },
  "options": [
    { "label": "研发部", "value": "RD" },
    { "label": "产品部", "value": "PM" },
    { "label": "设计部", "value": "DESIGN" },
    { "label": "市场部", "value": "MARKET" }
  ],
  "rules": [{ "required": true, "message": "请选择部门" }],
  "on_change": { "action": "update_data", "path": "/department", "value": "${value}" }
}
```

### 带初始值

在 `dataModel` 中设置初始选中值：

```json
{
  "dataModel": {
    "requestType": "normal"
  }
}
```

这样页面加载时，`select` 会自动选中 `value: "normal"` 的选项。

### 在表单中使用

```json
[
  {
    "id": "request-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": ["title-input", "type-select", "submit-btn"]
  },
  {
    "id": "title-input",
    "component": "input",
    "placeholder": "请输入标题",
    "value": { "path": "/title" },
    "rules": [{ "required": true, "message": "请输入标题" }],
    "on_change": { "action": "update_data", "path": "/title", "value": "${value}" }
  },
  {
    "id": "type-select",
    "component": "select",
    "placeholder": "请选择类型",
    "value": { "path": "/type" },
    "options": [
      { "label": "咨询", "value": "consult" },
      { "label": "投诉", "value": "complaint" },
      { "label": "建议", "value": "suggestion" }
    ],
    "rules": [{ "required": true, "message": "请选择类型" }],
    "on_change": { "action": "update_data", "path": "/type", "value": "${value}" }
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "提交",
    "on_tap": [
      { "action": "http_proxy", "payload": { "http_config": { "method": "POST", "path": "/api/request" } } }
    ]
  }
]
```

## 与 radio 的选择

| 场景 | 推荐组件 |
|------|---------|
| 选项数量 1-3 个 | `radio`（选项直接可见，无需点击） |
| 选项数量 4 个以上 | `select`（节省空间） |
| 选项需要滚动查找 | `select` |
| 选项需要图标/样式区分 | `select` |

## 新手常见问题

**Q: 选中的值不是预期的？**
- 检查 `options` 中每个选项的 `value` 是否正确。
- `value.path` 绑定的字段名是否与 `on_change` 中的 `path` 一致。

**Q: placeholder 不显示？**
- 如果 `dataModel` 中 `value.path` 对应的字段已有值，placeholder 不会显示（显示已选中的值）。
- `select` 是受控组件，需要 `value` 和 `on_change` 同时配置。

**Q: 想支持多选？**
- 目前 `select` 组件仅支持单选。
- 多选场景可以考虑使用 Checkbox 组件组合实现。

**Q: options 可以从接口获取吗？**
- 目前 `options` 需要在 schema 中静态配置。
- 如果需要动态 options，可以在传入 `Renderer` 前对 schema 进行预处理，用代码动态填充 `options` 数组。

**Q: 选中的值是数字类型怎么办？**
- 确保 `options` 中的 `value` 类型一致。
- 如果后端返回的数字类型，确保 `dataModel` 中字段类型一致。

**Q: 如何设置下拉框宽度？**
- 默认宽度 100%，使用 `style: { "width": "200px" }` 覆盖。
