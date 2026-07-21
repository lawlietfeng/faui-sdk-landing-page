# Form 表单完整指南

本指南面向 faui 新手，详细说明如何使用 `form` 组件与 `rules` 校验，帮助你快速掌握表单开发的完整流程。

## 什么是 Form

`form` 是 faui 中的**表单容器组件**。当你需要收集用户输入并提交时，使用 `form` 可以自动实现：

- **统一管理**：把页面上的输入字段集中管理
- **提交前校验**：用户点击提交按钮时，自动检查所有字段是否符合规则
- **错误提示**：不符合规则的字段下方显示提示信息
- **阻断提交**：校验不通过时，不会执行提交动作

## 快速开始

### 第一步：创建表单容器

```json
{
  "id": "my-form",
  "component": "form",
  "submitButtonId": "submit-btn",
  "children": ["name-input", "submit-btn"]
}
```

关键点：
- `component: "form"` 声明这是一个表单
- `submitButtonId: "submit-btn"` 指定提交按钮的 ID
- `children` 包含表单内的所有字段和提交按钮

### 第二步：添加输入字段

```json
{
  "id": "name-input",
  "component": "input",
  "placeholder": "请输入姓名",
  "value": { "path": "/name" },
  "rules": [{ "required": true, "message": "请输入姓名" }],
  "on_change": { "action": "update_data", "path": "/name", "value": "${value}" }
}
```

关键点：
- `value: { "path": "/name" }` 绑定到数据模型
- `rules` 定义校验规则
- `on_change` 必须配置，用于将输入保存到数据模型

### 第三步：添加提交按钮

```json
{
  "id": "submit-btn",
  "component": "button",
  "label": "提交",
  "on_tap": [
    { "action": "http_proxy", "payload": { "http_config": { "method": "POST", "path": "/api/submit" } } }
  ]
}
```

### 第四步：在 dataModel 中定义初始值

```json
{
  "dataModel": {
    "name": ""
  }
}
```

## 完整示例

下面是一个包含姓名、邮箱、申请类型的完整表单示例：

```json
[
  {
    "id": "root",
    "component": "box",
    "layout": "vertical",
    "padding": 16,
    "spacing": 12,
    "children": ["title", "my-form"]
  },
  {
    "id": "title",
    "component": "text",
    "content": "申请表单",
    "style": { "fontSize": "20px", "fontWeight": "bold" }
  },
  {
    "id": "my-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": ["name-input", "email-input", "type-select", "submit-btn"]
  },
  {
    "id": "name-input",
    "component": "input",
    "placeholder": "请输入姓名",
    "value": { "path": "/name" },
    "rules": [
      { "required": true, "message": "请输入姓名" },
      { "min": 2, "message": "姓名至少 2 个字符" }
    ],
    "on_change": { "action": "update_data", "path": "/name", "value": "${value}" }
  },
  {
    "id": "email-input",
    "component": "input",
    "placeholder": "请输入邮箱",
    "value": { "path": "/email" },
    "rules": [
      { "required": true, "message": "请输入邮箱" },
      { "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", "message": "邮箱格式不正确" }
    ],
    "on_change": { "action": "update_data", "path": "/email", "value": "${value}" }
  },
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
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "提交",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": {
            "method": "POST",
            "path": "/api/form/submit",
            "headers": { "Content-Type": "application/json" }
          },
          "http_body": {
            "name": { "path": "/name" },
            "email": { "path": "/email" },
            "requestType": { "path": "/requestType" }
          }
        }
      }
    ]
  }
]
```

对应的 dataModel：

```json
{
  "dataModel": {
    "name": "",
    "email": "",
    "requestType": ""
  }
}
```

## 表单组件的数据流

理解表单的关键是理解数据是如何流动的：

```
┌─────────────────────────────────────────────────────────┐
│                      dataModel                          │
│  { name: "", email: "", requestType: "" }             │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ value: { path: "/name" }
                          │
┌─────────────────────────────────────────────────────────┐
│                    input 组件                           │
│  placeholder: "请输入姓名"                              │
│  rules: [{ required: true }]                          │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ 用户输入
                          │
┌─────────────────────────────────────────────────────────┐
│                     用户界面                            │
│  ┌──────────────────────────────────┐                  │
│  │ 请输入姓名                        │ ← placeholder   │
│  └──────────────────────────────────┘                  │
│                          │                             │
│                          ▼ 点击提交按钮                 │
│  ┌──────────────────────────────────┐                  │
│  │ 提交                              │                  │
│  └──────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

当用户点击提交按钮时：

1. `form` 容器拦截点击事件
2. 对 `children` 中的所有字段执行校验
3. 如果全部通过，执行 `submit-btn` 的 `on_tap` 动作
4. 如果有字段失败，显示错误提示，阻断提交

## rules 校验规则详解

### 常用规则

| 规则 | 说明 | 示例 |
|------|------|------|
| `required: true` | 必填项，不能为空 | `{ "required": true, "message": "此项必填" }` |
| `min` | 最小值/最小字符数 | `{ "min": 2, "message": "至少2个字符" }` |
| `max` | 最大值/最大字符数 | `{ "max": 100, "message": "最多100个字符" }` |
| `pattern` | 正则表达式格式 | `{ "pattern": "^\\d+$", "message": "只支持数字" }` |
| `enum` | 枚举值列表 | `{ "enum": ["A", "B"], "message": "值无效" }` |

### 规则组合示例

```json
{
  "rules": [
    { "required": true, "message": "请输入邮箱" },
    { "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", "message": "邮箱格式不正确" }
  ]
}
```

```json
{
  "rules": [
    { "required": true, "message": "请输入密码" },
    { "min": 6, "message": "密码至少 6 位" },
    { "max": 20, "message": "密码最多 20 位" }
  ]
}
```

## validateTrigger 校验触发时机

`validateTrigger` 控制字段何时触发校验：

| 值 | 触发时机 |
|---|---------|
| `"onChange"`（默认） | 用户输入时实时校验 |
| `"onBlur"` | 输入框失去焦点时校验 |
| `["onChange", "onBlur"]` | 同时支持两种方式 |

```json
{
  "id": "email-input",
  "component": "input",
  "value": { "path": "/email" },
  "validateTrigger": ["onChange", "onBlur"],
  "rules": [
    { "required": true, "message": "请输入邮箱" },
    { "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", "message": "邮箱格式不正确" }
  ],
  "on_change": { "action": "update_data", "path": "/email", "value": "${value}" }
}
```

## 常用表单字段组件

### 基础输入组件

| 组件 | 适用场景 | 关键配置 |
|------|---------|---------|
| `input` | 单行文本：姓名、邮箱、手机号 | `placeholder`、`rules`、`on_change` |
| `textarea` | 多行文本：备注、说明 | `rows`、`max` 规则 |
| `inputnumber` | 数字输入：年龄、数量、金额 | `min`、`max`、`step`、`precision` |

### 选择类组件

| 组件 | 适用场景 | 关键配置 |
|------|---------|---------|
| `select` | 下拉选择：类型、状态 | `options`、`placeholder` |
| `radio` | 单选：同意/拒绝、少量选项 | `options` |
| `checkbox` | 布尔开关：是否同意、是否加急 | `checked`、`required` |
| `switch` | 开关切换：启用/禁用、开启/关闭 | `checkedChildren`、`unCheckedChildren` |
| `cascader` | 级联选择：省市区、部门层级 | `options`（嵌套结构） |
| `treeselect` | 树形选择：组织架构、分类树 | `options`（嵌套结构）、`multiple` |
| `transfer` | 穿梭选择：角色分配、权限配置 | `options` |

### 日期时间组件

| 组件 | 适用场景 | 关键配置 |
|------|---------|---------|
| `datepicker` | 日期选择 | `picker`（date/month/year）、`format`、`showTime` |
| `timepicker` | 时间选择 | `format`、`minuteStep` |

### 特殊功能组件

| 组件 | 适用场景 | 关键配置 |
|------|---------|---------|
| `slider` | 滑动选择：价格范围、音量调节 | `min`、`max`、`step`、`range` |
| `rate` | 星级评分：满意度、服务评价 | `count`、`allowHalf` |
| `upload` | 文件上传：附件、凭证、图片 | `multiple`、`maxCount`、`accept` |
| `autocomplete` | 输入建议：邮箱后缀、搜索联想 | `options`、`placeholder` |
| `colorpicker` | 颜色选择：主题色、品牌色 | `value.path` |
| `mentions` | @提及：评论中@用户、#话题 | `prefix`、`options` |

## 完整表单示例（多组件组合）

下面是一个包含多种组件的完整表单示例：

```json
[
  {
    "id": "root",
    "component": "box",
    "layout": "vertical",
    "padding": 16,
    "spacing": 16,
    "children": ["title", "profile-form"]
  },
  {
    "id": "title",
    "component": "text",
    "content": "用户资料表单",
    "style": { "fontSize": "20px", "fontWeight": "bold" }
  },
  {
    "id": "profile-form",
    "component": "form",
    "submitButtonId": "submit-btn",
    "children": [
      "name-input",
      "age-input",
      "gender-select",
      "region-cascader",
      "avatar-upload",
      "agree-switch",
      "submit-btn"
    ]
  },
  {
    "id": "name-input",
    "component": "input",
    "placeholder": "请输入姓名",
    "value": { "path": "/name" },
    "rules": [{ "required": true, "message": "请输入姓名" }],
    "on_change": { "action": "update_data", "path": "/name", "value": "${value}" }
  },
  {
    "id": "age-input",
    "component": "inputnumber",
    "placeholder": "请输入年龄",
    "min": 1,
    "max": 150,
    "step": 1,
    "value": { "path": "/age" },
    "rules": [
      { "required": true, "message": "请输入年龄" },
      { "min": 18, "message": "必须年满 18 岁" }
    ],
    "on_change": { "action": "update_data", "path": "/age", "value": "${value}" }
  },
  {
    "id": "gender-select",
    "component": "select",
    "placeholder": "请选择性别",
    "value": { "path": "/gender" },
    "options": [
      { "label": "男", "value": "male" },
      { "label": "女", "value": "female" },
      { "label": "保密", "value": "secret" }
    ],
    "rules": [{ "required": true, "message": "请选择性别" }],
    "on_change": { "action": "update_data", "path": "/gender", "value": "${value}" }
  },
  {
    "id": "region-cascader",
    "component": "cascader",
    "placeholder": "请选择所在地区",
    "value": { "path": "/region" },
    "options": [
      {
        "value": "zhejiang",
        "label": "浙江省",
        "children": [
          { "value": "hangzhou", "label": "杭州市" },
          { "value": "ningbo", "label": "宁波市" }
        ]
      },
      {
        "value": "beijing",
        "label": "北京市",
        "children": [
          { "value": "chaoyang", "label": "朝阳区" },
          { "value": "haidian", "label": "海淀区" }
        ]
      }
    ],
    "rules": [{ "required": true, "message": "请选择所在地区" }],
    "on_change": { "action": "update_data", "path": "/region", "value": "${value}" }
  },
  {
    "id": "avatar-upload",
    "component": "upload",
    "accept": "image/*",
    "multiple": false,
    "value": { "path": "/avatar" },
    "on_change": { "action": "update_data", "path": "/avatar", "value": "${fileList}" }
  },
  {
    "id": "agree-switch",
    "component": "switch",
    "checkedChildren": "我已同意协议",
    "unCheckedChildren": "未同意协议",
    "checked": { "path": "/agreed" },
    "rules": [{ "required": true, "message": "请先同意协议" }],
    "on_change": { "action": "update_data", "path": "/agreed", "value": "${value}" }
  },
  {
    "id": "submit-btn",
    "component": "button",
    "label": "提交",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": { "method": "POST", "path": "/api/profile" },
          "http_body": {
            "name": { "path": "/name" },
            "age": { "path": "/age" },
            "gender": { "path": "/gender" },
            "region": { "path": "/region" },
            "agreed": { "path": "/agreed" }
          }
        }
      }
    ]
  }
]
```

## 常见问题排查

### 问题 1：提交按钮点击没反应

**可能原因**：
1. `form.submitButtonId` 与按钮 `id` 不一致
2. 有字段校验失败（查看字段下方是否有红色提示）

**解决方法**：
- 确认 `"submitButtonId": "submit-btn"` 与按钮的 `"id": "submit-btn"` 完全一致

### 问题 2：字段校验没有生效

**可能原因**：
- `rules` 写在 `form` 上而不是字段上
- 字段不在 `form` 的 `children` 中

**解决方法**：
- 确认 `rules` 写在具体字段组件（如 `input`）上
- 确认字段 ID 在 `form.children` 数组中

### 问题 3：输入内容不保存

**可能原因**：
- 没有配置 `on_change`

**解决方法**：
```json
{
  "on_change": { "action": "update_data", "path": "/name", "value": "${value}" }
}
```
- 注意 `value` 必须是 `"${value}"`（带 `${}` 语法）

### 问题 4：提示文案不显示

**可能原因**：
- `rules` 中没有配置 `message`

**解决方法**：
```json
{ "required": true, "message": "这里显示的提示文案" }
```

### 问题 5：cascader/treeselect 的值是数组而不是单个值

**说明**：这是正常行为。级联选择和树选择的值表示选中节点的路径或多选的值列表。

### 问题 6：inputnumber 输入的不是数字

**说明**：`inputnumber` 组件只接受数字输入，非数字字符无法输入。如果初始值不显示，确认 `dataModel` 中对应字段是 number 类型而非 string 类型。

## 调试步骤建议

1. **最小化测试**：先只配 `required: true`，不加其他规则
2. **单字段测试**：逐个字段添加规则，确保每个都正常
3. **提交测试**：所有字段规则添加完毕后，测试提交流程
4. **接口对接**：最后接入 `http_proxy` 提交到真实接口

## 参考示例文件

可以直接参考以下文件进行开发：

- `examples/schemas/form-rules-demo.json` - Form + Rules 完整示例

## 进阶用法

### 动态表单（根据条件显示/隐藏字段）

使用 `visible` 属性控制字段是否显示：

```json
{
  "id": "reason-input",
  "component": "textarea",
  "visible": "${leaveType} === 'other'",
  "placeholder": "请输入原因"
}
```

当 `leaveType !== 'other'` 时，整个字段不会渲染。

### 多步骤表单

配合 `segmented` 或普通按钮实现多步骤表单：

```
步骤 1：填写信息 → 步骤 2：上传材料 → 步骤 3：提交
```

每个步骤可以用 `visible` 控制当前步骤的字段显示。

### 表单布局优化

使用 `box` 组件进行表单分组和布局：

```json
{
  "id": "form-section",
  "component": "box",
  "layout": "vertical",
  "spacing": 12,
  "children": ["section-title", "name-input", "email-input"]
},
{
  "id": "section-title",
  "component": "text",
  "content": "基本信息",
  "style": { "fontWeight": "bold", "fontSize": "16px" }
}
```
