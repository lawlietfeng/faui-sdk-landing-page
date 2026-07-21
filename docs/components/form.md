# form 表单组件

`form` 是表单的顶层容器组件，它在底层通过 React Context 拦截并管理内部所有输入控件（如 Input、Select、Checkbox 等）的校验状态和提交逻辑。

## 适用场景

- **数据录入**：包含多个输入项的用户注册、订单填写、配置修改页面。
- **校验拦截**：在用户点击提交按钮发送网络请求之前，强制进行前置校验（如必填项检查、格式校验），阻断无效数据的提交。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `submitButtonId` | `string` | - | **必填**。指定触发当前表单校验的提交按钮的组件 ID |
| `children` | `string[]` | `[]` | 表单内的所有字段组件和提交按钮的 ID 数组 |
| `layout` | `string` | `horizontal` | 表单项布局方式，可选 `horizontal`（水平，左标签右输入）或 `vertical`（垂直，上标签下输入） |

> **注意**：`form` 本身不直接包含具体的数据源属性，它是通过子组件的 `value`（双向绑定）和 `rules` 来协同工作的。

### submitButtonId（提交按钮关联）

`form` 组件的核心机制之一。你必须指定一个按钮组件的 `id` 作为 `submitButtonId`。当用户点击该按钮时，`form` 组件会拦截该按钮原有的 `on_tap` 动作，转而先对所有 `children` 中的表单控件执行校验。
只有所有校验全部通过，`form` 才会放行，让该按钮的 `on_tap` 动作序列继续执行。

```json
{
  "id": "login-form",
  "component": "form",
  "submitButtonId": "btn-login",
  "children": ["input-username", "input-password", "btn-login"]
}
```

## 工作机制与校验流程

### 1. 拦截与执行流程

```text
用户点击提交按钮 (submitButtonId)
       │
       ▼
┌─────────────────┐
│ form 拦截该点击事件 │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ 遍历 children   │
│ 执行所有元素的 rules │
└─────────────────┘
       │
       ├── 有任意字段校验失败 ──→ 在失败字段下方显示错误提示，并【阻断】提交动作
       │
       ▼
┌─────────────────┐
│ 全部校验通过    │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ 正常执行提交按钮的 │
│ on_tap 动作序列    │
└─────────────────┘
```

### 2. 字段组件的校验配置 (Rules)

表单的校验规则并不是写在 `form` 容器上的，而是**写在具体的输入控件上**（如 `input` 组件的 `rules` 属性）。

常见的 Rule 规则如下：

| 规则字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `required` | `boolean` | 是否必填 | `{ "required": true }` |
| `message` | `string` | 校验失败时展示给用户的提示文案 | `{ "message": "邮箱不能为空" }` |
| `pattern` | `string` | 正则表达式匹配 | `{ "pattern": "^\\d{11}$", "message": "必须为11位数字" }` |
| `min` / `max` | `number` | 字符串的最小/最大长度，或数字的边界 | `{ "min": 6, "max": 20 }` |

## 完整示例

这是一个标准的登录表单示例，包含了水平布局、双向数据绑定、必填项校验和正则校验。只有当用户名和密码格式都正确时，才会触发 `http_proxy` 动作进行登录。

```json
[
  {
    "id": "login-form",
    "component": "form",
    "submitButtonId": "btn-login",
    "layout": "vertical",
    "children": [
      "input-username",
      "input-password",
      "btn-login"
    ]
  },
  {
    "id": "input-username",
    "component": "input",
    "label": "用户名",
    "placeholder": "请输入手机号或邮箱",
    "value": { "path": "/login/username" },
    "rules": [
      { "required": true, "message": "用户名不能为空" }
    ]
  },
  {
    "id": "input-password",
    "component": "input",
    "label": "密码",
    "placeholder": "请输入密码（至少6位）",
    "type": "password",
    "value": { "path": "/login/password" },
    "rules": [
      { "required": true, "message": "密码不能为空" },
      { "min": 6, "message": "密码长度不能少于6位" }
    ]
  },
  {
    "id": "btn-login",
    "component": "button",
    "content": "登录",
    "type": "primary",
    "on_tap": [
      {
        "action": "http_proxy",
        "payload": {
          "http_config": {
            "method": "POST",
            "path": "/api/v1/login"
          },
          "http_body": {
            "username": "${/login/username}",
            "password": "${/login/password}"
          }
        }
      },
      {
        "action": "message",
        "payload": {
          "type": "success",
          "content": "登录成功！"
        }
      }
    ]
  }
]
```

## 新手常见问题

**Q: 为什么我点击了提交按钮，但是既没有发请求，也没有报错提示？**
- 最常见的原因是 `submitButtonId` 配置错误。请确保 `form` 组件上的 `submitButtonId` 与你要点击的 `button` 组件的 `id` **完全一致**。如果拼写错误，`form` 无法拦截按钮，校验机制就不会生效。

**Q: 为什么我输入了错误的数据，表单也没有进行校验拦截？**
- 检查 `rules` 是否写在了**输入控件组件**（如 `input`、`select`）上，而不是错误地写在了 `form` 组件上。
- 检查输入控件是否已经被正确添加到了 `form` 的 `children` 数组中。如果控件不在 `children` 树里，`form` 就无法感知并校验它。

**Q: 校验失败时，怎么获取到失败的原因并做弹窗提示？**
- FAUI 引擎内置了表单拦截机制，当校验失败时，引擎会自动在对应的输入框下方渲染出红色字体的 `message` 错误提示，并默默阻断 `on_tap` 执行。开发者不需要手动去获取错误信息弹窗。

**Q: 想在表单外部放置提交按钮可以吗？**
- **强烈不建议**。为了保证 `form` Context 能够正确收集到所有的字段和按钮引用，提交按钮必须作为子节点存在于 `form` 的 `children` 树中（直接子节点或深层嵌套子节点均可）。放在 `form` 外部会导致 `submitButtonId` 关联失效。