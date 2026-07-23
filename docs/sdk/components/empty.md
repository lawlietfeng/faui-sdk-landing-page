# empty 空状态组件

`empty` 组件用于当目前没有数据时，作为一个被动的状态展示给用户，通常出现在列表、表格或容器内容为空的场景中。

## 适用场景

- **空列表/空表格**：查询结果为空或尚未添加数据时展示。
- **功能引导**：在空状态下提供“立即创建”等操作按钮，引导用户完成首次交互。
- **页面占位**：在模块尚未开放或暂无权限时作为占位符。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | - | 自定义描述文字，支持表达式求值。未配置时将 fallback 读取 `content` 属性 |
| `image` | `string` | `default` | 设置空状态图片的样式，可选内置的 `default`、`simple`，或直接传入图片的 URL 地址 |
| `imageStyle` | `object` | - | 图片的自定义样式对象（例如 `{"height": 60}`） |

### description（描述内容）

设置空状态的说明文字。该属性会经过 `useExpression` 解析，因此可以结合全局数据状态动态渲染。
*提示：如果在配置中省略了 `description`，组件会自动回退读取通用的 `content` 属性作为描述文字。*

```json
{
  "id": "empty-desc",
  "component": "empty",
  "description": "当前暂无订单数据"
}
```

### image（展示图片）

设置显示的图片类型或地址。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `default` | 默认的复杂空状态插画 | 页面级或大容器级的空状态 |
| `simple` | 简单的线框空状态插画 | 局部小面板、表格内部的空状态 |
| `https://...` | 自定义网络图片地址 | 业务定制的个性化空状态 |

```json
{
  "id": "empty-simple",
  "component": "empty",
  "image": "simple",
  "description": "未找到匹配的联系人"
}
```

### imageStyle（图片样式）

用于微调图片的外观，通常用于控制图片的高度或间距。

```json
{
  "id": "empty-custom-style",
  "component": "empty",
  "image": "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg",
  "imageStyle": {
    "height": 120,
    "marginBottom": 16
  },
  "description": "没有相关记录"
}
```

## 高级用法：嵌入操作按钮

空状态经常需要伴随引导操作。你可以通过配置 `children` 数组，将按钮等组件嵌入到空状态描述的下方。

```json
[
  {
    "id": "empty-with-action",
    "component": "empty",
    "image": "default",
    "description": "你还没有创建任何项目",
    "children": ["btn-create-project"]
  },
  {
    "id": "btn-create-project",
    "component": "button",
    "content": "立即创建",
    "type": "primary",
    "on_tap": [
      {
        "action": "message",
        "payload": {
          "type": "success",
          "content": "打开创建弹窗"
        }
      }
    ]
  }
]
```

## 新手常见问题

**Q: 为什么我配置了 `content`，但是没有显示描述文字？**
- `empty` 组件优先读取 `description` 属性，如果没有 `description` 才会回退读取 `content`。请检查是否同时配置了这两个属性且 `description` 被设置为空字符串。

**Q: `image` 属性可以填本地相对路径的图片吗？**
- 建议使用绝对的 `https://` 网络图片 URL。相对路径（如 `./assets/empty.png`）在 FAUI 引擎渲染时可能会因为路径解析或打包机制导致图片加载失败（404）。

**Q: `children` 里面除了放按钮还能放别的吗？**
- 可以放置任意合法的 FAUI 组件（如文本 `typography`、链接等）。但为了视觉美观，通常建议只放置 1-2 个引导性的操作按钮。