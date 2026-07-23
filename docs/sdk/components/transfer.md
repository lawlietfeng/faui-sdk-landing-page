# transfer 组件

穿梭框组件，用于直观地在两个列表之间移动和分配数据。常用于角色权限分配、多选项筛选或任何需要明确展示“未选”与“已选”状态的复杂多选场景。

## 适用场景

- **权限/角色分配**：将特定权限从“可用权限库”分配给某个用户。
- **员工/人员调度**：在项目团队中添加或移除成员。
- **复杂多选**：当选项较多（如超过 10 项）且需要让用户清晰看到已选列表时，使用 `transfer` 优于 `select` (多选)。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `Array \| string` | `[]` | **必填**，数据源配置数组，支持插值表达式动态获取全局数据 |
| `value.path` | `string` | - | **必填**，双向绑定的数据路径，值将是一个包含所有“已选项” `value` 的字符串数组 |

### options（数据源选项）

`options` 决定了穿梭框左侧（默认状态）的可用数据源。每个选项支持以下属性：
- `label`：展示给用户看的文本。
- `value`：选中后实际提交和绑定的值。
- `disabled`：是否禁用该选项（禁用后无法移动）。
- `description`：补充描述信息（根据底层 Ant Design 渲染器可能不会直接展示，但常用于保留元数据）。

**注意**：`options` 必须通过 `useExpression` 进行整体求值。你可以直接硬编码，也可以通过表达式从后端接口获取。

```json
{
  "id": "role_transfer",
  "type": "element",
  "config": {
    "component": "transfer",
    "options": [
      { "value": "admin", "label": "系统管理员" },
      { "value": "editor", "label": "内容编辑", "disabled": true },
      { "value": "viewer", "label": "访客" }
    ],
    "value": { "path": "/assignedRoles" }
  }
}
```

动态绑定数据源：
```json
{
  "id": "dynamic_transfer",
  "type": "element",
  "config": {
    "component": "transfer",
    "options": "${/api/allRolesList}",
    "value": { "path": "/assignedRoles" }
  }
}
```

## 数据绑定与回写 (value.path & on_change)

穿梭框的核心逻辑是：将 `options` 中的部分项，移动到右侧（即选中的 `targetKeys` 集合）。
这个集合的值必须绑定到全局的 `dataModel` 中。

1. **自动回写**：只要配置了 `value.path`，组件内部会自动 fallback 触发 `update_data`，将右侧列表的字符串数组写回全局状态，并触发所在表单的校验。
2. **自定义回调**：如果你配置了 `on_change`，必须自己在动作流中添加 `update_data` 以保证数据更新。在 `on_change` 中，你可以通过 `${$value}` 获取到最新的、完整的已选项数组。如果 on_change 中未设置 `value` 字段，组件会自动注入当前值；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。

```json
{
  "id": "form_transfer",
  "type": "element",
  "config": {
    "component": "transfer",
    "field": "roles",
    "options": [
      { "value": "1", "label": "选项 1" },
      { "value": "2", "label": "选项 2" }
    ],
    "value": { "path": "/form/roles" },
    "rules": [
      { "required": true, "message": "请至少分配一个权限" },
      { "type": "array", "min": 2, "message": "至少需要分配 2 个权限" }
    ]
  }
}
```

## 完整示例

一个包含动态选项拉取、表单校验以及双向绑定的角色分配场景：

```json
[
  {
    "id": "permission_form",
    "type": "element",
    "config": {
      "component": "form",
      "submitButtonId": "submit_btn",
      "children": ["user_select", "role_transfer", "submit_btn"]
    }
  },
  {
    "id": "user_select",
    "type": "element",
    "config": {
      "component": "select",
      "placeholder": "请选择要分配权限的用户",
      "value": { "path": "/currentUser" },
      "options": [
        { "label": "张三", "value": "U001" },
        { "label": "李四", "value": "U002" }
      ],
      "rules": [{ "required": true, "message": "必须选择用户" }]
    }
  },
  {
    "id": "role_transfer",
    "type": "element",
    "config": {
      "component": "transfer",
      "options": [
        { "value": "admin", "label": "管理员" },
        { "value": "editor", "label": "内容编辑" },
        { "value": "viewer", "label": "仅查看" },
        { "value": "billing", "label": "财务权限" }
      ],
      "value": { "path": "/assignedRoles" },
      "rules": [
        { "required": true, "message": "请分配角色" }
      ]
    }
  },
  {
    "id": "submit_btn",
    "type": "element",
    "config": {
      "component": "button",
      "label": "保存权限",
      "on_tap": [
        { 
          "action": "http_proxy", 
          "payload": { 
            "http_config": { 
              "method": "POST", 
              "path": "/api/assign-roles" 
            } 
          } 
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 穿梭框的初始值怎么设置？**
- 穿梭框的选中状态完全由 `value.path` 绑定的全局变量控制。如果需要在页面加载时右侧就已经有选中的项，只需在初始化的 `dataModel` 中为对应的路径赋值即可。
  ```json
  // dataModel 初始化
  {
    "assignedRoles": ["admin", "editor"]
  }
  ```

**Q: `options` 里的 `value` 可以是数字吗？**
- 引擎底层在处理时会将 `value` 强制转换为字符串（`String(opt.value)`），并且在回写状态时也是写回 `string[]`。建议在配置和后端交互时，统一将 ID 或枚举值视为字符串处理，以避免类型不匹配的边界问题。

**Q: 为什么右侧列表没有显示 `label`？**
- 请检查 `options` 数组的结构是否规范，必须包含 `label` 和 `value` 字段。引擎会将 `label` 映射为选项的显示文本。

**Q: 穿梭框可以支持拖拽排序或者搜索吗？**
- 目前 FAUI 的 `transfer` 实现了最核心的左右移动与表单校验功能。更高级的功能（如内置搜索框 `showSearch` 或自定义渲染函数）暂时未暴露配置。如果业务强依赖搜索，建议在穿梭框上方单独增加一个 `input` 并结合插值表达式过滤 `options` 数组。