# typography 组件

提供基础的文本排版能力，包含标题 (`title`)、段落 (`paragraph`)、文本 (`text`) 和链接 (`link`)。它可以统一全站的文字规范，并内置了复制、省略、状态色等丰富的排版功能。

## 适用场景

- **标题与段落**：页面的大标题、模块标题或大段说明文字。
- **状态文本**：展示成功、警告、失败等带有语义色彩的文本。
- **功能文本**：需要单行省略（`ellipsis`）或一键复制（`copyable`）的文本（如订单号、长链接）。

## 核心属性

| 属性名          | 类型                            | 默认值      | 说明                                                                   |
| ------------ | ----------------------------- | -------- | -------------------------------------------------------------------- |
| `variant`    | `string`                      | `'text'` | 排版变体，可选 `'text' \| 'title' \| 'paragraph' \| 'link'`                 |
| `content`    | `string`                      | -        | 静态文本内容，支持插值表达式。如果有 `children` 或 `items` 则优先渲染子节点                     |
| `value.path` | `string`                      | -        | 绑定全局数据的路径，优先级高于 `content`                                            |
| `textType`   | `string`                      | -        | 文本的主题状态，可选 `'secondary' \| 'success' \| 'warning' \| 'danger'`，支持表达式 |
| `level`      | `number \| string`            | -        | 仅当 `variant="title"` 时生效，指定标题级别 (1-5)，支持表达式                          |
| `copyable`   | `boolean \| object \| string` | `false`  | 是否开启一键复制功能，支持表达式                                                     |
| `ellipsis`   | `boolean \| object \| string` | `false`  | 自动溢出省略，支持表达式                                                         |
| `href`       | `string`                      | -        | 仅当 `variant="link"` 时生效，跳转的链接地址，支持表达式                                |
| `target`     | `string`                      | -        | 仅当 `variant="link"` 时生效，链接打开方式，如 `"_blank"`，支持表达式                    |

### variant 与 level（排版类型）

决定了文本的基本 HTML 标签和字号大小。

| variant       | 渲染标签         | 适用场景                            |
| ------------- | ------------ | ------------------------------- |
| `'title'`     | `h1` \~ `h5` | 页面大标题或区块标题。需配合 `level` (1-5) 使用 |
| `'paragraph'` | `div`        | 大段文章或段落描述，自带底部 margin           |
| `'text'`      | `span`       | 行内文字，不会换行（默认值）                  |
| `'link'`      | `a`          | 超链接，需配合 `href` 属性使用             |

```json
[
  {
    "id": "page_title",
    "type": "element",
    "config": {
      "component": "typography",
      "variant": "title",
      "level": 2,
      "content": "系统设置"
    }
  },
  {
    "id": "page_desc",
    "type": "element",
    "config": {
      "component": "typography",
      "variant": "paragraph",
      "content": "在此处您可以修改系统的全局配置信息。"
    }
  }
]
```

### 文本装饰样式

支持多种行内的文本装饰效果，均支持布尔值或插值表达式。

| 属性名         | 效果                | 示例场景                |
| ----------- | ----------------- | ------------------- |
| `strong`    | **加粗**            | 强调关键数据              |
| `italic`    | *斜体*              | 引用或备注               |
| `underline` | <u>下划线</u>        | 强调或模仿链接             |
| `delete`    | ~~删除线~~           | 原价、已废弃选项            |
| `mark`      | <mark>高亮背景</mark> | 搜索结果高亮              |
| `code`      | `代码块`             | 变量名或代码片段            |
| `keyboard`  | 键盘按键样式            | 快捷键提示（如 `Ctrl + C`） |
| `disabled`  | 置灰禁用              | 不可点击或失效的状态          |

```json
{
  "id": "decorated_text",
  "type": "element",
  "config": {
    "component": "typography",
    "content": "这是一段非常重要的被删除的代码",
    "strong": true,
    "delete": true,
    "code": true
  }
}
```

### copyable 与 ellipsis（复制与省略）

这是 Typography 组件相比普通 `text` 组件最核心的增强能力。

```json
[
  {
    "id": "copyable_order",
    "type": "element",
    "config": {
      "component": "typography",
      "content": "订单号：2023080112345678",
      "copyable": true
    }
  },
  {
    "id": "ellipsis_text",
    "type": "element",
    "config": {
      "component": "typography",
      "style": { "width": "200px" },
      "content": "这是一段非常长的文本，当它的宽度超过容器时，会自动显示省略号。",
      "ellipsis": {
        "tooltip": "这是一段非常长的文本，当它的宽度超过容器时，会自动显示省略号。"
      }
    }
  }
]
```

## 动态数据与表达式 (content & value.path)

Typography 属于纯展示型组件，**不需要配置** **`on_change`**，也不支持用户的输入回写。但它支持两种方式动态展示全局数据：

1. **插值表达式 (`content`)**：推荐方式。可以与其他静态文字自由组合。
2. **数据绑定 (`value.path`)**：直接绑定到一个状态路径，优先级高于 `content`。

```json
{
  "id": "welcome_text",
  "type": "element",
  "config": {
    "component": "typography",
    "content": "你好，${/currentUser/name}！您的账户余额为 ${/currentUser/balance} 元。"
  }
}
```

## 嵌套机制 (children & items)

如果你需要在一段文本中混合不同的样式（例如：一段普通文字中间夹着一个蓝色的链接），你有两种方式：

### 1. 使用 children 嵌套其他组件

你可以将 `typography` 作为容器，内部包含多个独立的 `typography` 或其他行内组件。

```json
{
  "id": "mixed_paragraph",
  "type": "element",
  "config": {
    "component": "typography",
    "variant": "paragraph",
    "children": ["normal_text", "link_text"]
  }
}
```

### 2. 使用 items 数组快速配置 (简写方式)

为了简化配置，`typography` 提供了一个 `items` 数组属性，你可以直接在里面配置子 `typography` 节点的属性，引擎会自动为你渲染。

```json
{
  "id": "mixed_paragraph_by_items",
  "type": "element",
  "config": {
    "component": "typography",
    "variant": "paragraph",
    "items": [
      { "content": "点击 " },
      { "variant": "link", "href": "https://example.com", "content": "这里", "target": "_blank" },
      { "content": " 查看详细说明。" }
    ]
  }
}
```

## 完整示例

一个包含状态文本、标题、链接和一键复制功能的卡片信息展示：

```json
[
  {
    "id": "info_card",
    "type": "element",
    "config": {
      "component": "card",
      "title": "API 密钥信息",
      "children": ["api_title", "api_key_box", "api_help"]
    }
  },
  {
    "id": "api_title",
    "type": "element",
    "config": {
      "component": "typography",
      "variant": "title",
      "level": 4,
      "content": "您的 Secret Key"
    }
  },
  {
    "id": "api_key_box",
    "type": "element",
    "config": {
      "component": "typography",
      "variant": "paragraph",
      "content": "your_api_key_placeholder_here",
      "copyable": true,
      "code": true,
      "textType": "danger"
    }
  },
  {
    "id": "api_help",
    "type": "element",
    "config": {
      "component": "typography",
      "variant": "paragraph",
      "textType": "secondary",
      "items": [
        { "content": "请妥善保管您的密钥，切勿泄露。了解更多请阅读" },
        { "variant": "link", "content": "安全指南", "href": "/security" }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 为什么我设置了** **`ellipsis: true`，但是文字没有出现省略号？**

- 单行省略（`ellipsis: true`）必须在容器有明确宽度限制的情况下才会生效。如果 Typography 所在的父容器是弹性布局（Flex）且允许无限拉伸，文字会一直撑开而不会省略。请尝试给 Typography 加上 `style: { "width": "200px" }` 或设置父容器 `overflow: hidden`。

**Q:** **`typography`** **和** **`text`** **组件有什么区别？**

- FAUI 中原有的 `text` 组件是一个非常基础的文本节点，仅支持显示文字。

- `typography` 是更高级的排版组件，它内置了多种 HTML 语义标签（`h1-h5`, `div`, `a`），并自带了状态颜色（`textType`）、复制、省略、代码高亮等丰富的 UI 增强功能。在构建标准页面时，强烈建议优先使用 `typography`。

**Q:** **`items`** **数组里的每一项需要写** **`component: "typography"`** **吗？**

- 不需要。引擎内部会自动将 `items` 数组中的对象当作 `typography` 的配置来解析，你只需要关注 `variant`、`content` 等具体属性即可。

