# collapse 组件

`collapse` 折叠面板组件用于对复杂区域进行分组和隐藏，保持页面的整洁。用户可以点击面板标题来展开或折叠内容区域。

## 适用场景

- **长表单分组**：将一个超长表单按模块（如基础信息、高级配置）进行分组折叠。
- **FAQ 问答列表**：常见问题解答页面。
- **复杂详情页**：收纳不常用或次要的辅助信息区块。

## 核心属性

### 属性总览

| 属性名     | 类型                                                        | 默认值 | 说明                                                         |
| ---------- | ----------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| `options`  | `Array` (支持表达式)                                        | `[]`   | 折叠面板的配置项数组，定义每个面板的标题和内部嵌套组件。     |
| `bordered` | `boolean`                                                   | `true` | 面板是否带有边框。                                           |

---

### options（面板配置项）

这是 Collapse 最核心的属性，它是一个数组，用于定义有几个折叠面板，以及每个面板里装什么。支持 `useExpression` 从全局获取，但通常直接在 JSON 中静态配置。

| 字段       | 类型       | 说明                                                         |
| ---------- | ---------- | ------------------------------------------------------------ |
| `value`    | `string`   | 面板的唯一标识符（即 key）。                                 |
| `label`    | `string`   | 面板在界面上展示的标题文字。                                 |
| `children` | `string[]` | 该面板展开后内部需要渲染的子组件 ID 数组（内部会自动垂直排列）。 |

```json
{
  "id": "settings_collapse",
  "component": "collapse",
  "options": [
    {
      "label": "基础设置",
      "value": "basic",
      "children": ["base_form"]
    },
    {
      "label": "高级设置 (可选)",
      "value": "advanced",
      "children": ["advanced_form"]
    }
  ]
}
```

### bordered（是否带边框）

控制折叠面板整体是否拥有外边框。默认带边框。如果配置为 `false`，面板会呈现无边框的极简风格，适合作为内部嵌套容器使用。

```json
{
  "id": "faq_collapse",
  "component": "collapse",
  "bordered": false,
  "options": [ /* ... */ ]
}
```

## 完整示例

一个无边框风格，包含两个分组表单的折叠面板：

```json
{
  "id": "user_profile_collapse",
  "component": "collapse",
  "bordered": false,
  "style": {
    "backgroundColor": "#fafafa",
    "borderRadius": "8px"
  },
  "options": [
    {
      "label": "个人信息",
      "value": "personal",
      "children": [
        "avatar_uploader",
        "personal_info_form"
      ]
    },
    {
      "label": "工作经历",
      "value": "work",
      "children": [
        "work_experience_table"
      ]
    }
  ]
}
```

## 新手常见问题

**Q: Collapse 组件支持默认展开指定的面板吗？**
- 目前 FAUI 的 schema 暂未暴露底层的 `defaultActiveKey` 或 `activeKey` 属性进行受控绑定。面板默认处于折叠状态，需要用户手动点击展开。如果需要该功能，需提需求在引擎层进行扩展。

**Q: 面板里嵌套的子组件排列方式能改吗？**
- 在底层的渲染逻辑中，每个面板的 `children` 数组默认是被一个具有 `display: flex, flexDirection: column, gap: 8px` 的 `div` 包裹的。这意味着子组件默认是**从上到下垂直排列**的。如果你需要水平排列或更复杂的布局，请在 `children` 数组中嵌套一个自定义的 `box` 组件。
