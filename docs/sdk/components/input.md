# input 组件

`input` 是单行文本输入框组件，适用于姓名、邮箱、手机号、标题等单行文本输入场景，默认集成了表单数据绑定与校验功能。

## 适用场景

- **用户信息收集**：如用户名、密码、邮箱、手机号、证件号码。
- **简单查询条件**：作为搜索框或筛选条件的输入。
- **表单数据录入**：在 `form` 中配合 `rules` 使用，完成复杂的数据验证。

## 核心属性

<!-- contract-props:start -->
## Form 契约属性（input）

| 属性 | 标题 | 动态绑定 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` |  | 静态值 | 在 schema 中唯一的组件 ID。 |  |
| `component` |  | 静态值 | Form Registry 注册名。 |  |
| `placeholder` |  | `expression` |  |  |
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
- dataModel 绑定：`value`（string | null）
- 属性依赖：无
- 特殊说明：无
<!-- contract-props:end -->

### value.path 与 on_change（数据双向绑定）

将输入框的值绑定到全局状态的某个字段。`value.path` 用于从数据模型中读取初始值。
当用户输入时，如果没有配置 `on_change`，引擎会自动通过 fallback 机制触发 `update_data` 回写对应路径的值；如果需要自定义操作，可配置 `on_change`。

```json
{
  "id": "name-input",
  "component": "input",
  "placeholder": "请输入姓名",
  "value": {
    "path": "/userInfo/name"
  }
}
```

### placeholder（占位提示）

输入框为空时显示的提示文字，支持表达式：

```json
{
  "id": "search-input",
  "component": "input",
  "placeholder": "请输入你想搜索的${/category}..."
}
```

### rules（校验规则）

配合表单组件，限制输入内容的格式、长度和是否必填等。

```json
{
  "id": "email-input",
  "component": "input",
  "placeholder": "请输入邮箱",
  "value": {
    "path": "/email"
  },
  "rules": [
    { "required": true, "message": "邮箱不能为空" },
    { "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", "message": "邮箱格式不正确" }
  ]
}
```

**常见 `rules` 配置：**
- **必填校验**：`{ "required": true, "message": "此项必填" }`
- **最小/最大长度**：`{ "min": 6, "max": 18, "message": "长度应在 6-18 位" }`
- **正则表达式**：`{ "pattern": "^1[3-9]\\d{9}$", "message": "手机号不合法" }`

### validateTrigger（触发校验时机）

控制在什么时候对用户输入进行 `rules` 校验。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"onChange"` | 用户每次输入内容变化时立刻触发校验 | 默认行为，实时提示错误 |
| `"onBlur"` | 输入框失去焦点时触发校验 | 避免用户输入一半时频繁提示错误（如手机号或邮箱校验） |

```json
{
  "id": "phone-input",
  "component": "input",
  "value": {
    "path": "/phone"
  },
  "validateTrigger": ["onChange", "onBlur"]
}
```

## 完整示例

一个完整的带初始值和表单校验的输入框：

```json
{
  "id": "username-input",
  "component": "input",
  "placeholder": "请输入至少3个字符的用户名",
  "value": {
    "path": "/form/username"
  },
  "validateTrigger": "onBlur",
  "rules": [
    {
      "required": true,
      "message": "用户名不能为空"
    },
    {
      "min": 3,
      "message": "用户名至少 3 个字符"
    }
  ],
  "style": {
    "width": "100%",
    "marginBottom": 16
  }
}
```

## 新手常见问题

**Q: 为什么在输入框输入了内容，但点击提交时状态里没有这个值？**
- 检查是否配置了 `value.path`，这是实现数据读写的关键。只要绑定了 `path`，即使不写 `on_change`，引擎也会自动 fallback 进行 `update_data` 记录最新值。

**Q: 配置了 `rules` 校验为什么不生效 / 提示不出现？**
- `rules` 校验功能必须在外层包裹一个 `form` 容器组件才能正常工作。如果只是散落的 `input`，`rules` 将不会进行校验拦截。

**Q: 用户输入时频繁提示报错很烦人，怎么解决？**
- 可以将 `validateTrigger` 修改为 `"onBlur"`，这样只有当用户填完离开输入框时，才会触发校验并显示红色报错提示。

**Q: 初始值不显示？**
- 请确认你绑定的 `value.path` 对应的全局状态确实有值，且类型是字符串。如果是 `null` 或 `undefined`，输入框会显示为空。
