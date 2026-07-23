# steps 组件

`steps` 是一个功能丰富的步骤条组件，常用于引导用户按照流程完成任务（如多步表单、向导页面等）。
与简易的 [`stepindicator`](./stepindicator.md) 不同，`steps` 支持双向绑定交互、副标题、详细描述等高级特性。

## 适用场景

- **多步表单向导**：引导用户分步骤填写长表单，支持点击步骤条快速跳转。
- **复杂流程展示**：需要展示带有详细说明（`description`）或副标题（`subTitle`）的业务流转过程。
- **页面导航**：作为顶部的页签式导航使用（配置 `type: "navigation"`）。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `StepItem[]` \| `string` | - | 步骤条的数据项，定义各个步骤的内容 |
| `current` | `ValueBinding` | - | 绑定当前步骤的索引（从 `0` 开始） |
| `direction` | `string` | `"horizontal"` | 步骤条排列方向，可选 `"horizontal"` 或 `"vertical"` |
| `type` | `string` | `"default"` | 步骤条类型，可选 `"default"`、`"navigation"`、`"inline"` |
| `status` | `string` | - | 强制指定当前步骤的状态，可选 `"wait"`、`"process"`、`"finish"`、`"error"` |
| `on_change` | `ActionConfig` | - | 用户点击切换步骤时触发的事件。自定义时可通过 `${$value}` 引用最新值，组件会保留你设置的自定义 `value` 表达式不覆盖。 |

### items（步骤配置）

用于定义步骤条的具体内容。支持传入静态数组，或通过插值表达式动态获取。
数组中每个 `StepItem` 的属性如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 步骤标题 |
| `subTitle` | `string` | 步骤副标题（在标题右侧显示） |
| `description` | `string` | 步骤的详细描述（在标题下方显示） |
| `status` | `string` | 指定该步骤的特定状态（覆盖默认推导状态），可选 `wait`、`process`、`finish`、`error` |
| `icon` | `string` | 自定义步骤图标 |
| `disabled` | `boolean` | 是否禁用该步骤（禁用后无法点击跳转） |

```json
{
  "id": "signup-steps",
  "component": "steps",
  "items": [
    { "title": "注册账号", "description": "输入手机号和密码" },
    { "title": "实名认证", "subTitle": "需上传身份证", "description": "预计审核 1 个工作日" },
    { "title": "完成", "disabled": true }
  ]
}
```

### current 与双向绑定交互

`current` 属性通过 `path` 绑定全局状态模型，用于控制当前激活的步骤索引。
由于 `steps` 组件支持用户点击步骤条进行跳转，引擎内置了**自动回写机制**：
- 如果用户点击了某个步骤，且组件绑定了 `current.path`，但未配置 `on_change` 事件，引擎会自动触发 `update_data` 将新的索引写回 `path`。
- 引擎底层会自动将绑定的值安全转换为数字类型（`number`），避免渲染崩溃。

```json
{
  "id": "form-steps",
  "component": "steps",
  "current": { "path": "/currentStepIndex" },
  "items": [
    { "title": "第一步" },
    { "title": "第二步" },
    { "title": "第三步" }
  ]
}
```

### type（步骤条类型）

控制步骤条的整体视觉风格。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `"default"` | 默认样式 | 常用的步骤条样式 |
| `"navigation"` | 导航样式 | 类似 Tab 页签，常用于页面顶部的步骤切换导航 |
| `"inline"` | 内联样式 | 更加紧凑的展示形式 |

```json
{
  "id": "nav-steps",
  "component": "steps",
  "type": "navigation",
  "current": { "path": "/navIndex" },
  "items": [
    { "title": "基本信息" },
    { "title": "高级配置" }
  ]
}
```

### 更多外观配置

- `labelPlacement` (`string`)：指定标签放置位置，默认水平放图标右侧，可选 `"vertical"` 放图标下方。
- `progressDot` (`boolean` \| `string`)：设置为 `true` 可开启点状步骤条。
- `size` (`string`)：步骤条大小，可选 `"small"` 或 `"default"`。

## 完整示例

展示一个带有动态状态控制、点状样式，并且可以点击切换的完整步骤条：

```json
{
  "id": "full-steps-demo",
  "component": "steps",
  "progressDot": true,
  "size": "small",
  "current": { "path": "/flow/activeIndex" },
  "status": "${/flow/hasError ? 'error' : 'process'}",
  "items": [
    { "title": "登录", "description": "验证身份信息" },
    { "title": "支付", "description": "选择支付方式" },
    { "title": "发货", "description": "等待物流揽收" },
    { "title": "完成" }
  ]
}
```

## 新手常见问题

**Q: 为什么我配置了 `items`，但点击步骤条没有反应？**
- 必须配置 `current.path` 绑定一个全局状态变量，组件才能知道将点击的新索引回写到哪里。如果没有绑定路径，组件就是只读的。

**Q: `steps` 和 `stepindicator` 有什么区别？**
- `stepindicator` 是轻量级、纯展示用的组件，不支持点击交互，也没有 `description` 等复杂属性。
- `steps` 是全功能组件，支持双向绑定、丰富的图文排版、多种视觉风格（如 `navigation`），适合用于向导表单等强交互场景。

**Q: 步骤 3 报错了，如何让整个步骤条的当前状态显示为红色错误？**
- 可以通过插值表达式动态控制 `status` 属性：`"status": "${/isStep3Error ? 'error' : 'process'}"`。

**Q: 如何动态生成 `items` 列表？**
- 可以将整个 `items` 属性绑定为一个表达式，指向全局状态中拼装好的数组。例如 `"items": "${/dynamicSteps}"`。