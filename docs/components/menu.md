# menu 组件

`menu` 是导航菜单组件，为页面和功能提供导航的菜单列表。支持水平、垂直、内联三种模式，支持多级子菜单和分组，常配合 `layout` 中的 `sider` 或 `header` 使用。

## 适用场景

- **侧边导航**：后台管理系统的左侧主菜单。
- **顶部导航**：官网、企业门户的顶部栏栏目切换。
- **内联菜单**：分类筛选或设置页面的左侧标签切换。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `MenuItemConfig[]` | `[]` | 菜单项配置列表。 |
| `mode` | `'vertical' \| 'horizontal' \| 'inline'` | `'inline'` | 菜单的布局模式。`inline` 为内联，`horizontal` 为水平（常用于顶栏）。 |
| `theme` | `'light' \| 'dark'` | `'light'` | 菜单的主题颜色。 |
| `selectedKeys.path` | `string` | - | 绑定的选中状态路径，对应的值必须是 `string[]`（如 `["menu-1"]`）。 |
| `openKeys.path` | `string` | - | 绑定的展开状态路径（针对 SubMenu），对应的值必须是 `string[]`。 |
| `on_select` | `ActionConfig` | - | 菜单项被选中时触发的动作。 |
| `on_open_change` | `ActionConfig` | - | SubMenu 展开/关闭时触发的动作。 |

### items（菜单项配置）

菜单的核心数据结构。`items` 数组已支持表达式插值，其子项 `label`、`icon` 等均可动态解析。

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | **必填**，菜单项的唯一标志，用于 `selectedKeys` 匹配。 |
| `label` | `string` | 菜单项的标题文字，支持 `${...}` 表达式。 |
| `icon` | `string` | 菜单图标，需传入 `@ant-design/icons` 的大驼峰组件名（如 `"UserOutlined"`）。 |
| `type` | `'group' \| 'divider' \| 'submenu'` | 节点类型。不传则为普通菜单项。 |
| `children` | `MenuItemConfig[]` | 子菜单项配置，用于构建多级菜单。 |

```json
{
  "id": "app-menu",
  "component": "menu",
  "items": [
    { "key": "home", "label": "首页", "icon": "HomeOutlined" },
    {
      "key": "settings",
      "label": "系统设置",
      "icon": "SettingOutlined",
      "children": [
        { "key": "profile", "label": "个人资料" },
        { "key": "security", "label": "安全设置" }
      ]
    }
  ]
}
```

### selectedKeys 与 openKeys（数据受控绑定）

`menu` 是一个强受控组件：
1. **选中状态**：配置 `selectedKeys.path` 绑定一个字符串数组。当用户点击菜单项时，如果没有配置 `on_select` 动作，引擎会自动触发 fallback 机制，将新选中的 key 回写到该路径。
2. **展开状态**：配置 `openKeys.path` 绑定一个字符串数组。当用户展开或收起父菜单时，会自动将新展开的 keys 回写到该路径。

```json
{
  "id": "app-menu",
  "component": "menu",
  "selectedKeys": {
    "path": "/currentMenu"
  },
  "openKeys": {
    "path": "/expandedMenus"
  }
}
```

### on_select 与 on_click（交互事件）

当菜单被点击/选中时，可触发路由跳转或页面切换：

```json
{
  "id": "app-menu",
  "component": "menu",
  "selectedKeys": { "path": "/activeKey" },
  "on_select": {
    "action": "update_data",
    "path": "/activeKey",
    "value": "${value}"
  }
}
```
*提示：在 `on_select` 和 `on_click` 的 Action payload 中，组件会自动注入 `key`（当前点击的项）和 `keyPath`（从子到父的 key 数组）。*

## 完整示例

一个带有数据绑定、主题设置和图标的完整左侧侧边菜单：

```json
[
  {
    "type": "ACTIVITY_SNAPSHOT",
    "content": {
      "dataModel": {
        "activeMenus": ["user-list"],
        "openedMenus": ["user-manage"]
      },
      "components": [
        {
          "id": "sidebar-menu",
          "component": "menu",
          "mode": "inline",
          "theme": "dark",
          "selectedKeys": { "path": "/activeMenus" },
          "openKeys": { "path": "/openedMenus" },
          "items": [
            { "key": "dashboard", "label": "仪表盘", "icon": "DashboardOutlined" },
            {
              "key": "user-manage",
              "label": "用户管理",
              "icon": "UserOutlined",
              "children": [
                { "key": "user-list", "label": "用户列表" },
                { "key": "role-list", "label": "角色列表" }
              ]
            }
          ]
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 菜单点击后为什么没有高亮（选中状态不变）？**
- 检查是否配置了 `selectedKeys.path`。`menu` 是受控组件，必须在全局状态中维护一个数组（例如 `["dashboard"]`）来记录选中项。如果不绑定 `path`，菜单点击后不会自动维持高亮状态。

**Q: 绑定的 `selectedKeys` 为什么要是数组？我只能单选啊。**
- Ant Design 的底层设计决定了 `selectedKeys` 和 `openKeys` 必须是数组格式（因为存在 `multiple` 多选模式的可能）。即使是单选，你也必须在 dataModel 中将其初始化为数组，例如 `["home"]` 而不是 `"home"`。

**Q: 图标不显示，控制台报警告？**
- 检查 `icon` 字段的字符串拼写是否正确。必须是 `@ant-design/icons` 库中严格区分大小写的组件名称（例如 `"SettingOutlined"`，不能写成 `"setting"`）。

**Q: 怎样在菜单渲染前根据权限过滤掉某些项？**
- 可以在外层使用表达式包裹整个 `items` 数组，或者给 `items` 中的特定对象增加属性，配合全局的权限配置进行动态过滤。由于 `items` 被 `useExpression` 解析，它支持复杂的 JS 数组运算逻辑。
