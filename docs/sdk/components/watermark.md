# watermark 组件

水印组件，用于为页面或某个特定的区块提供文字或图片水印。通常用于保护版权、标识数据来源或提示保密信息。

## 适用场景

- **内部系统防泄密**：在管理后台全局铺满当前登录员工的工号或姓名。
- **敏感数据保护**：在显示财务报表、用户隐私数据等区块加上“机密”字样。
- **版权声明**：在图片展示区或文章阅读区加上公司的 Logo 或版权声明。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string \| string[]` | - | 水印文字内容。传入数组时表示多行水印。支持插值表达式 |
| `value.path` | `string` | - | 动态绑定全局数据作为水印内容，优先级高于 `content` |
| `image` | `string` | - | 图片水印的 URL，支持插值表达式。当同时提供 `content` 和 `image` 时，优先显示 `content` |
| `font` | `object \| string` | - | 文字水印的字体样式配置，支持插值表达式 |
| `gap` | `[number, number] \| string` | `[100, 100]` | 水印之间的水平和垂直间距，支持插值表达式 |
| `offset` | `[number, number] \| string` | `[gap[0]/2, gap[1]/2]` | 水印距离容器左上角的初始偏移量，支持插值表达式 |
| `rotate` | `number \| string` | `-22` | 水印绘制时旋转的角度，支持插值表达式 |
| `zIndex` | `number \| string` | `9` | 水印元素的 CSS z-index 值，支持插值表达式 |

### content 与动态绑定 (文字水印)

你可以直接使用 `content` 配置静态文字，也可以使用 `${}` 语法将当前登录用户信息注入到水印中。多行文字可以通过数组实现。

```json
[
  {
    "id": "global_watermark",
    "type": "element",
    "config": {
      "component": "watermark",
      "content": ["FAUI 内部系统", "工号: ${/currentUser/empId}"],
      "children": ["page_content_box"]
    }
  }
]
```

如果水印内容是完全由后端接口决定的，你也可以直接绑定 `value.path`。
> **注意**：水印组件为纯展示型组件，不会响应用户的输入操作，因此不需要配置 `on_change`。

### image (图片水印)

如果你希望使用公司的 Logo 作为水印，可以配置 `image`。图片水印的尺寸可以通过 `width` / `height` 或 `imageWidth` / `imageHeight` 控制。

```json
{
  "id": "image_watermark",
  "type": "element",
  "config": {
    "component": "watermark",
    "image": "https://example.com/company-logo-gray.png",
    "width": 120,
    "height": 40,
    "opacity": 0.2,
    "children": ["secret_data_table"]
  }
}
```

### font (字体样式)

用于精细控制文字水印的样式。`font` 对象支持以下属性：
- `color`: 字体颜色（如 `'rgba(0,0,0,.15)'`）
- `fontSize`: 字体大小
- `fontWeight`: 字重（如 `'normal'`, `'bold'`, `400`）
- `fontStyle`: 字体样式（如 `'normal'`, `'italic'`）
- `fontFamily`: 字体家族

```json
{
  "id": "styled_watermark",
  "type": "element",
  "config": {
    "component": "watermark",
    "content": "绝密资料",
    "font": {
      "color": "rgba(255, 0, 0, 0.1)",
      "fontSize": 24,
      "fontWeight": "bold"
    },
    "rotate": -45,
    "children": ["content_box"]
  }
}
```

## 完整示例

一个包裹了普通区块的动态多行防泄密水印：

```json
[
  {
    "id": "secure_area",
    "type": "element",
    "config": {
      "component": "watermark",
      "content": [
        "内部机密，严禁外传",
        "${/user/name} - ${/user/department}"
      ],
      "gap": [120, 80],
      "font": {
        "color": "rgba(0, 0, 0, 0.08)",
        "fontSize": 14
      },
      "children": ["secure_card"]
    }
  },
  {
    "id": "secure_card",
    "type": "element",
    "config": {
      "component": "card",
      "title": "2023 Q3 财务报表",
      "children": ["table_data"]
    }
  }
]
```

## 新手常见问题

**Q: 为什么配置了图片水印但是显示的是文字？**
- 根据 Ant Design 的底层逻辑，当 `content` 和 `image` 同时存在时，`content`（文字水印）的优先级更高。如果想显示图片水印，请确保不要配置 `content` 或者将其置空。

**Q: 水印怎么才能覆盖整个页面，而不是只在一小块区域？**
- 水印组件（`watermark`）本质上是一个容器组件。它只会铺满它自己的大小。如果你希望水印覆盖整个页面，请确保将 `watermark` 作为整个页面的最外层根节点（`id: "root"`），并保证它的高度能撑满整个视口（例如给它加上 `style: { "minHeight": "100vh" }`）。

**Q: 用户能通过浏览器开发者工具删掉水印吗？**
- 底层的 Ant Design Watermark 组件使用了 `MutationObserver` 来监听 DOM 变化。如果用户尝试通过开发者工具删除水印 DOM 节点或修改其样式（如 `display: none`），组件会自动重新生成水印。这提供了一定程度的基础防篡改保护。

**Q: 水印文字太密了，怎么调整？**
- 调整 `gap` 属性。`gap` 是一个包含两个数字的数组 `[水平间距, 垂直间距]`。增大这两个数值，水印就会变得稀疏。例如：`gap: [200, 150]`。