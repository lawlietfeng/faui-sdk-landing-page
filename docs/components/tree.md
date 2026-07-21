# tree 组件

树形控件，用于清晰地展现具有层级关系的数据结构，如文件夹结构、组织架构、分类目录等。它支持单选、多选（复选框）、展开折叠等丰富的交互。

## 适用场景

- **目录导航**：展示文件系统、文档目录或复杂的侧边栏导航。
- **组织架构**：选择公司部门、团队或员工。
- **权限分配**：在角色管理中，以树形结构分配菜单权限或操作权限。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `treeData` | `TreeDataNode[] \| string` | `[]` | **必填**，树形结构的数据源，支持插值表达式 |
| `checkable` | `boolean \| string` | `false` | 节点前是否显示复选框，支持表达式 |
| `selectable` | `boolean \| string` | `true` | 节点标题是否可点击选中，支持表达式 |
| `multiple` | `boolean \| string` | `false` | 是否支持选中多个节点（按住 Ctrl/Cmd 键），支持表达式 |
| `showLine` | `boolean \| string \| object` | `false` | 是否展示连接各节点的层级线，支持表达式 |
| `showIcon` | `boolean \| string` | `false` | 是否展示节点图标，支持表达式 |
| `defaultExpandAll`| `boolean \| string` | `false` | 是否默认展开所有节点，支持表达式 |
| `checkStrictly` | `boolean \| string` | `false` | 开启复选框时，父子节点的选中状态是否**不再**自动联动，支持表达式 |

### treeData（树节点数据源）

树形控件的核心数据，通常是一个嵌套的对象数组。每个节点对象（`TreeDataNode`）包含：
- `title`：节点的显示文本。
- `key`：节点的唯一标识符。
- `children`：子节点数组。
- `disabled`：禁用该节点。
- `disableCheckbox`：仅禁用该节点的复选框。
- `selectable`：设置该节点是否可被选中。
- `isLeaf`：标记是否为叶子节点（即使没有 children 也不会显示展开箭头）。

**最佳实践**：由于树形数据通常较庞大且由后端返回，建议始终使用插值表达式将其绑定到全局变量，而不是在 JSON 中硬编码。

```json
{
  "id": "org_tree",
  "type": "element",
  "config": {
    "component": "tree",
    "treeData": "${/api/organizationTree}"
  }
}
```

### checkable 与 checkStrictly（复选与联动）

开启 `checkable` 后，节点前方会出现复选框。
默认情况下，选中父节点会自动选中所有子节点，选中所有子节点也会自动勾选父节点。如果不需要这种联动，可以开启 `checkStrictly`。

```json
{
  "id": "permission_tree",
  "type": "element",
  "config": {
    "component": "tree",
    "checkable": true,
    "checkStrictly": true,
    "treeData": "${/api/menuPermissions}"
  }
}
```

## 三重双向绑定机制

由于树形控件交互复杂，引擎为其拆分了三个独立的双向绑定路径。**这三个属性互不干扰**，你可以根据业务需求选择性地绑定它们。

| 绑定属性 | 类型 | 绑定的数据类型 | 对应交互 |
| --- | --- | --- | --- |
| `checkedKeys` | `ValueBinding` | `string[]` | 勾选复选框 (`checkable`) 时触发 |
| `selectedKeys` | `ValueBinding` | `string[]` | 点击节点文字 (`selectable`) 时触发 |
| `expandedKeys` | `ValueBinding` | `string[]` | 点击展开/折叠箭头时触发 |

**自动回写 Fallback**：
只要配置了对应的 `path`（如 `checkedKeys: { path: "/myChecked" }`），当用户操作时，引擎会自动执行 `update_data` 将最新的 keys 数组写回该路径。

**自定义动作拦截**：
如果你配置了对应的事件动作（`on_check`, `on_select`, `on_expand`），则会**覆盖**默认的回写行为。你必须在动作流中自行配置 `update_data` 以保证状态同步。此时可以通过 `${value}` 获取最新的 keys 数组，同时引擎会在 `payload.info` 中注入原生的事件详情。

### 1. 勾选绑定 (checkedKeys)

常用于权限分配场景，获取用户打钩的所有节点 ID。

```json
{
  "id": "role_auth_tree",
  "type": "element",
  "config": {
    "component": "tree",
    "checkable": true,
    "treeData": "${/authTreeData}",
    "checkedKeys": {
      "path": "/form/checkedAuthIds"
    }
  }
}
```

### 2. 选中与展开绑定 (selectedKeys & expandedKeys)

常用于文件目录导航场景，记录用户当前点击了哪个文件，以及展开了哪些文件夹。

```json
{
  "id": "file_explorer_tree",
  "type": "element",
  "config": {
    "component": "tree",
    "showLine": true,
    "treeData": "${/fileSystemData}",
    "selectedKeys": {
      "path": "/currentFileId"
    },
    "expandedKeys": {
      "path": "/openedFolderIds"
    }
  }
}
```

## 完整示例

一个带有复选框、默认展开全部，并在勾选时触发额外验证请求的树形控件：

```json
[
  {
    "id": "dept_tree",
    "type": "element",
    "config": {
      "component": "tree",
      "checkable": true,
      "defaultExpandAll": true,
      "treeData": "${/departmentData}",
      "checkedKeys": {
        "path": "/selectedDeptIds"
      },
      "on_check": {
        "action": "update_data",
        "payload": {
          "path": "/selectedDeptIds",
          "value": "${value}"
        }
      }
    }
  }
]
```

## 新手常见问题

**Q: 为什么我开启了 `checkStrictly`，绑定的 `checkedKeys` 数据格式变了？**
- 当 `checkStrictly` 为 `false`（默认）时，`${value}` 只是一个单纯的字符串数组 `["key1", "key2"]`。
- 当 `checkStrictly` 为 `true` 时，底层 Ant Design 会将选中的值变为一个对象：`{ checked: ["key1"], halfChecked: ["key2"] }`。你在处理后端提交时需要注意提取 `checked` 数组。

**Q: 我只想要单选，怎么配置？**
- 树形控件默认的节点点击（`selectedKeys`）就是单选的（除非开启 `multiple: true`）。如果是指复选框（`checkable`）单选，原生 Tree 不支持复选框单选逻辑。对于单选层级数据，强烈建议使用 `treeselect`（树选择）或 `cascader`（级联选择）组件。

**Q: 如何在节点后面添加操作按钮（如“新增”、“删除”）？**
- FAUI 的 `tree` 组件目前主要是数据驱动的纯展示与选择组件，暂未开放 `titleRender` 等复杂的自定义渲染函数插槽。如果必须实现树节点的复杂操作，建议在选中节点（`selectedKeys`）后，在树组件旁边的详情面板中展示对应的操作按钮。