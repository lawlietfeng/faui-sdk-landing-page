# treeselect 组件

树型选择控件，类似于 `select`，但其下拉菜单的内容是一个树形结构（`tree`）。适用于组织架构选择、省市区分类选择、复杂权限树选择等具有明显层级关系的场景。

## 适用场景

- **组织架构选择**：选择公司 → 部门 → 小组。
- **商品分类选择**：选择大类 → 中类 → 小类。
- **单选层级数据**：当层级数据只需要最终单选一个节点时，`treeselect` 的体验远优于带复选框的普通 `tree` 组件。

## 与 cascader 的区别

| 特性 | treeselect | cascader (级联选择) |
|------|------------|----------|
| 选择交互 | 下拉树形菜单，可纵览整体层级 | 逐级横向展开浮层 |
| 多选支持 | 完美支持 (`multiple: true`) | 通常仅用于单选路径 |
| 视觉焦点 | 强调父子节点的包含关系 | 强调用户选择的“路径” |

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | **必填**，双向绑定的数据路径。单选时写回字符串，多选时写回字符串数组 |
| `options` | `Array \| string` | `[]` | **必填**，树形结构的数据源，支持插值表达式动态获取全局数据 |
| `multiple` | `boolean \| string` | `false` | 是否支持多选（此时节点前方会出现复选框），支持表达式 |
| `placeholder` | `string` | - | 选择框的默认提示文字，支持表达式 |
| `disabled` | `boolean \| string` | `false` | 是否禁用整个树选择器，支持表达式 |

### options（树形数据源）

通过 `children` 字段嵌套定义树形结构。每个节点至少包含 `label`（显示文字）和 `value`（实际绑定的值）。
建议将庞大的树形数据放在全局 `dataModel` 中，并通过 `useExpression` 语法（如 `"${/api/deptTree}"`）动态引入。

```json
{
  "id": "department_treeselect",
  "type": "element",
  "config": {
    "component": "treeselect",
    "options": [
      {
        "value": "headquarters",
        "label": "总部",
        "children": [
          { "value": "hr", "label": "人力资源部" },
          { "value": "finance", "label": "财务部" }
        ]
      },
      {
        "value": "rd",
        "label": "研发中心",
        "children": [
          { "value": "frontend", "label": "前端组" },
          { "value": "backend", "label": "后端组" }
        ]
      }
    ],
    "value": { "path": "/selectedDept" }
  }
}
```

### multiple（多选模式）

当配置 `multiple: true` 时，下拉树的节点会自带复选框。此时，`value.path` 绑定的值会自动变为字符串数组。

```json
{
  "id": "category_treeselect",
  "type": "element",
  "config": {
    "component": "treeselect",
    "multiple": true,
    "placeholder": "请选择多个商品分类",
    "options": "${/productCategories}",
    "value": { "path": "/selectedCategoryIds" }
  }
}
```

## 数据绑定与回写 (value.path & on_change)

组件内置了完善的 fallback 回写机制：

1. **自动回写**：只要配置了 `value.path`，组件选中节点后会自动执行 `update_data` 将值写回全局状态，并触发所在表单的校验。单选模式下写入的是单个 `value`（字符串），多选模式下写入的是 `value` 数组。
2. **自定义回调**：如果你配置了 `on_change`，引擎会优先执行你定义的动作流。此时，**你必须在动作流中自行配置 `update_data`** 以保证状态同步。在 `on_change` 动作流中，你可以通过 `${$value}` 获取最新的选中值。如果 on_change 中未设置 `value` 字段，组件会自动注入当前值；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。

```json
{
  "id": "form_treeselect",
  "type": "element",
  "config": {
    "component": "treeselect",
    "field": "departments",
    "multiple": true,
    "options": "${/allDepts}",
    "value": { "path": "/form/departments" },
    "rules": [
      { "required": true, "message": "请至少选择一个部门" }
    ]
  }
}
```

## 完整示例

包含动态数据源、多选模式以及表单校验的完整场景：

```json
[
  {
    "id": "permission_form",
    "type": "element",
    "config": {
      "component": "form",
      "submitButtonId": "submit_btn",
      "children": ["role_name", "permission_treeselect", "submit_btn"]
    }
  },
  {
    "id": "role_name",
    "type": "element",
    "config": {
      "component": "input",
      "placeholder": "请输入角色名称",
      "value": { "path": "/roleName" },
      "rules": [{ "required": true, "message": "请输入姓名" }]
    }
  },
  {
    "id": "permission_treeselect",
    "type": "element",
    "config": {
      "component": "treeselect",
      "placeholder": "请选择角色包含的权限范围",
      "multiple": true,
      "value": { "path": "/permissions" },
      "options": [
        {
          "value": "user_manage",
          "label": "用户管理",
          "children": [
            { "value": "user_view", "label": "查看用户" },
            { "value": "user_edit", "label": "编辑用户" }
          ]
        },
        {
          "value": "system_manage",
          "label": "系统设置",
          "children": [
            { "value": "sys_config", "label": "系统配置" },
            { "value": "sys_log", "label": "系统日志" }
          ]
        }
      ],
      "rules": [{ "required": true, "message": "请至少分配一个权限" }]
    }
  },
  {
    "id": "submit_btn",
    "type": "element",
    "config": {
      "component": "button",
      "label": "保存角色",
      "on_tap": [
        { 
          "action": "http_proxy", 
          "payload": { 
            "http_config": { "method": "POST", "path": "/api/role" } 
          } 
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 为什么我开启了 `multiple: true`，但是选中的数据格式不对？**
- 单选时 `${value}` 是字符串（如 `"hr"`）。
- 多选时 `${value}` 是数组（如 `["hr", "finance"]`）。在初始化 `dataModel` 或者处理后端请求时，请注意这个类型的差异。

**Q: 多选模式下，勾选父节点会自动勾选所有子节点吗？**
- 是的，Ant Design 的 TreeSelect 在多选（`treeCheckable`）模式下，父子节点的勾选状态是联动的。勾选父节点等同于全选其下的所有子节点。如果你需要切断这种联动（类似 Tree 组件的 `checkStrictly`），目前 FAUI 的 `treeselect` 暂未开放该底层属性。

**Q: 可以单独禁用树形菜单中的某个节点吗？**
- 可以。在 `options` 的节点数据中，给对应的节点对象添加 `disabled: true` 属性，该节点就会呈现灰色且无法被选中。

**Q: 树的数据结构太深，渲染会卡顿吗？**
- 如果树节点数量超过 1000 个，可能会存在性能瓶颈。建议优化数据结构，或者改用其他带分页或异步加载的交互方案。目前 `treeselect` 暂未封装异步加载子节点的配置。