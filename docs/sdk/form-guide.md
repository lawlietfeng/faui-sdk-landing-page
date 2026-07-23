# form 表单容器组件

本指南详细说明如何使用 `form` 容器组件与相关的表单字段组件（如输入框、选择器等）。它将带你了解表单的整体架构、双向绑定机制、校验规则，并作为**所有可用表单组件的开发导航字典**。

## 适用场景

- **数据收集**：作为容器包裹一组输入字段，统一收集用户的输入数据。
- **提交前校验**：在用户点击提交按钮时，自动触发所有字段的规则检查。
- **阻断提交**：如果有任何字段校验不通过，将自动显示错误提示，并阻断后续的提交流程（例如阻止发送网络请求）。

## 核心属性

| 属性               | 类型         | 说明                                                  |
| ---------------- | ---------- | --------------------------------------------------- |
| `component`      | `"form"`   | 声明这是一个表单容器。                                         |
| `children`       | `string[]` | 包含表单内所有字段组件和提交按钮的 ID 数组。                            |
| `submitButtonId` | `string`   | 内部提交模式使用。指定触发校验和 `on_tap` 的按钮 ID；外部提交模式可省略。 |

```json
{
  "id": "my-form",
  "component": "form",
  "submitButtonId": "submit-btn",
  "children": ["name-input", "submit-btn"]
}
```

## 外部提交模式

如果提交按钮位于 FAUI schema 外部，可以通过 `Renderer` ref 调用 `validate()` 和 `submit()`。该模式不需要 `submitButtonId`，并且不会执行内部 `http_proxy`。

完整 API 和示例见 [外部校验与提交](./external-submit.md)。

## 核心机制：数据双向绑定与自动回写 (The "Magic")

> 💡 **AI 提效与 Token 节省准则**：
> 在编写或生成 FAUI 表单 JSON 配置时，**请只实现核心骨架和数据绑定**。强烈建议**不要添加任何非必要的 `style` 样式属性**，这不仅能保持配置的纯粹性，还能大幅节省 AI 的输出 Token 和渲染性能。

在最新的 FAUI 架构中，表单字段的数据收集变得前所未有地简单。引擎内置了基于 **JSON Pointer** 的双向绑定兜底机制（Fallback）。

**规则**：只要你为输入组件配置了以 `/` 开头的 `value: { path: "..." }` 或 `checked: { path: "..." }`，引擎就会在用户输入时**自动回写**数据到 `dataModel` 中。

**你不再需要手动配置繁琐的** **`on_change`** **事件！**

### 旧写法 vs 新写法对比

**❌ 冗余的旧写法（现在不再需要）：**

```json
{
  "id": "name-input",
  "component": "input",
  "value": { "path": "/name" },
  "on_change": { "action": "update_data", "path": "/name", "value": "${value}" } // 👈 这一坨现在完全不需要写了！
}
```

**✅ 极简的新写法：**

```json
{
  "id": "name-input",
  "component": "input",
  "value": { "path": "/name" }
}
```

*提示：所有引擎支持的表单组件均已实现此自动回写机制。*

***

## 表单组件大图与导航

为了构建一个完整的表单，你需要将 `form` 容器与各种输入字段组合。以下是 FAUI 支持的所有 **17 种** 表单字段组件的导航与使用指南。

### 1. 文本输入类

用于收集纯文本、数字或长文本。绑定属性均为 `value.path`。

- **`input`**（单行文本）：最常用的输入框，可用于姓名、邮箱、密码等。
- **`textarea`**（多行文本）：用于收集备注、说明等长文本。
- **`inputnumber`**（数字输入）：仅允许输入数字，支持步长和最大/最小值限制。

```json
// input 示例
{
  "id": "email-input",
  "component": "input",
  "placeholder": "请输入邮箱",
  "value": { "path": "/email" },
  "rules": [{ "required": true, "message": "邮箱必填" }]
}
```

### 2. 选择类 (单选/多选)

用于让用户从有限的选项中做出选择。

- **`select`**（下拉选择）：适用于选项较多（超过 5 个）的情况。绑定 `value.path`。
- **`radio`**（单选框）：适用于选项较少（平铺展示）的情况。绑定 `value.path`。
- **`checkbox`**（多选框 / 布尔开关）：可作为单选开关（如“是否同意”），也可结合 `options` 作为多选组。单选时通常绑定 `checked.path` 或 `value.path`。
- **`switch`**（开关）：用于切换开启/关闭状态。绑定 `checked.path` 或 `value.path`。

```json
// select 示例
{
  "id": "role-select",
  "component": "select",
  "placeholder": "请选择角色",
  "value": { "path": "/role" },
  "options": [
    { "label": "管理员", "value": "admin" },
    { "label": "普通用户", "value": "user" }
  ]
}
```

### 3. 层级与复杂选择类

用于处理具有父子关系或复杂交互的数据选择。绑定属性均为 `value.path`。

- **`cascader`**（级联选择）：用于省市区、分类目录等多层级数据，返回值为选中节点的路径数组。
- **`treeselect`**（树形选择）：以下拉树的形式展示结构化数据，支持多选。
- **`transfer`**（穿梭框）：用于在左右两个列表之间移动数据（如分配权限），返回选中项的 `key` 数组。

```json
// cascader 示例
{
  "id": "region-cascader",
  "component": "cascader",
  "value": { "path": "/region" },
  "options": [
    {
      "value": "zhejiang",
      "label": "浙江省",
      "children": [{ "value": "hangzhou", "label": "杭州市" }]
    }
  ]
}
```

### 4. 日期与时间类

用于收集日期或时间数据。绑定属性均为 `value.path`。

- **`datepicker`**（日期选择）：选择具体的年、月、日。
- **`timepicker`**（时间选择）：选择具体的时、分、秒。

### 5. 高级与特殊输入类

用于特定业务场景的高级组件。

- **`upload`**（文件上传）：收集文件或图片，绑定 `value.path`（自动回写为 `fileList` 数组）。
- **`slider`**（滑动条）：通过拖拽选择数值或范围，绑定 `value.path`。
- **`rate`**（评分）：用于收集星级评价，绑定 `value.path`。
- **`colorpicker`**（颜色选择）：用于收集颜色值，绑定 `value.path`。
- **`autocomplete`** **/** **`mentions`**（自动补全与 @提及）：在用户输入时提供联想建议，绑定 `value.path`。

***

## Rules 校验规则全解

在子组件上配置 `rules` 数组，当触发表单提交或输入时，引擎会自动校验这些规则。

### 常用规则属性

| 属性           | 说明                        | 示例                                              |
| ------------ | ------------------------- | ----------------------------------------------- |
| `required`   | 是否必填                      | `{ "required": true, "message": "此项必填" }`       |
| `min`        | 最小值 / 最小字符数               | `{ "min": 2, "message": "至少2个字符" }`             |
| `max`        | 最大值 / 最大字符数               | `{ "max": 100, "message": "最多100个字符" }`         |
| `len`        | 确切的长度或数值                  | `{ "len": 11, "message": "手机号必须为11位" }`         |
| `pattern`    | 正则表达式匹配                   | `{ "pattern": "^\\d+$", "message": "只支持数字" }`   |
| `type`       | 数据类型检查                    | `{ "type": "email", "message": "邮箱格式错误" }`      |
| `enum`       | 枚举值检查                     | `{ "enum": ["A", "B"], "message": "必须是A或B" }`   |
| `whitespace` | 是否拦截纯空格（若设为 false，纯空格会报错） | `{ "whitespace": false, "message": "不能只输入空格" }` |

### 校验触发时机 (`validateTrigger`)

`validateTrigger` 控制字段何时触发校验（可配置在字段组件上）：

| 值                        | 触发时机          |
| ------------------------ | ------------- |
| `"onChange"`（默认）         | 用户输入时实时校验     |
| `"onBlur"`               | 输入框失去焦点时校验    |
| `["onChange", "onBlur"]` | 失去焦点和实时输入时都校验 |

***

## 提交机制与完整示例 (The Climax)

当 `form` 的 `submitButtonId` 指向的按钮被点击时，数据流向如下：

1. `form` 拦截点击事件，对所有带有 `rules` 的子字段执行校验。
2. 若有失败项，展示红色提示并**停止执行**。
3. 若全部通过，放行执行按钮上的 `on_tap` 事件（通常是 `http_proxy`）。
4. `http_proxy` 直接从 `dataModel`（通过 `path`）读取收集好的干净数据发送给后端。

### 终极表单示例

这是一个完全移除了冗余 `on_change` 配置的现代化综合表单示例：

```json
[
  {
    "id": "root",
    "component": "box",
    "layout": "vertical",
    "padding": 16,
    "spacing": 16,
    "children": ["title", "my-form"]
  },
  {
    "id": "title",
    "component": "text",
    "content": "用户入驻表单",
    "style": { "fontSize": "20px", "fontWeight": "bold" }
  },
  {
    "id": "my-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": [
      "name-input",
      "email-input",
      "gender-select",
      "agree-switch",
      "submit-btn"
    ]
  },
  {
    "id": "name-input",
    "component": "input",
    "placeholder": "请输入姓名",
    "value": { "path": "/name" },
    "rules": [{ "required": true, "message": "请输入姓名" }]
  },
  {
    "id": "email-input",
    "component": "input",
    "placeholder": "请输入邮箱",
    "value": { "path": "/email" },
    "rules": [
      { "required": true, "message": "请输入邮箱" },
      { "type": "email", "message": "邮箱格式不正确" }
    ]
  },
  {
    "id": "gender-select",
    "component": "select",
    "placeholder": "请选择性别",
    "value": { "path": "/gender" },
    "options": [
      { "label": "男", "value": "male" },
      { "label": "女", "value": "female" }
    ],
    "rules": [{ "required": true, "message": "请选择性别" }]
  },
  {
    "id": "agree-switch",
    "component": "switch",
    "checkedChildren": "已同意",
    "unCheckedChildren": "未同意",
    "checked": { "path": "/agreed" },
    "rules": [{ "required": true, "message": "请先同意协议" }]
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "提交入驻",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": {
            "method": "POST",
            "path": "/api/users/register"
          },
          "http_body": {
            "name": { "path": "/name" },
            "email": { "path": "/email" },
            "gender": { "path": "/gender" },
            "agreed": { "path": "/agreed" }
          }
        }
      }
    ]
  }
]
```

对应的初始 `dataModel`：

```json
{
  "dataModel": {
    "name": "",
    "email": "",
    "gender": null,
    "agreed": false
  }
}
```

***

## 新手常见问题 (FAQ)

**Q: 提交按钮点击没反应，也不发请求？**

- 内部提交模式下，检查 `form` 的 `submitButtonId` 是否与提交按钮的 `id` 拼写**完全一致**。
- 检查页面上是否有字段校验未通过（红色报错提示可能在页面下方，滚动查看）。表单校验不通过时会直接阻断 `on_tap`。

**Q: 输入框输入了内容，但提交时发现数据是空的？**

- 检查 `value: { path: "..." }` 中的路径是否符合 JSON Pointer 规范，即**必须以** **`/`** **开头**（如 `/username`，不能是 `username`）。
- 如果路径正确，无需再写 `on_change` 动作，引擎会自动双向绑定。

**Q: 校验规则 (rules) 没有生效？**

- `rules` 必须配置在**具体的输入组件**（如 `input`、`select`）上，而不能配置在外层的 `form` 容器上。
- 确保输入组件的 `id` 已经被包含在 `form` 的 `children` 数组中，否则表单无法感知该字段的存在。

**Q: cascader 或 treeselect 的值是数组而不是字符串？**

- 这是正常的预期行为。级联选择和多选树的值表示选中节点的路径或多个选中项的列表。

**Q: inputnumber 组件无法输入任何内容？**

- `inputnumber` 只接受数字。如果初始值渲染为空，请确认 `dataModel` 中对应的字段是 `number` 类型而非 `string`。
