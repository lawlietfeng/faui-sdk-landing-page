# image 组件

`image` 组件用于展示单张图片，支持通过静态地址或数据绑定获取图片源，并可选择开启点击大图预览功能。

## 适用场景

- **静态图片展示**：展示 Logo、封面、插图等固定图片。
- **动态图片渲染**：通过数据绑定展示用户头像、动态封面等。
- **带预览的图片**：需要用户点击放大查看细节的商品图、证明材料等。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | - | 静态图片地址 URL。如果配置了 `data.path` 且有值，该属性会被覆盖。 |
| `data.path` | `string` | - | 图片地址的数据绑定路径，用于动态加载图片。 |
| `alt` | `string` | - | 图片无法加载时显示的替代文本，支持表达式插值。 |
| `preview` | `boolean` | `false` | 是否开启点击图片后预览大图的功能。 |

### data.path / src（图片地址源）

指定图片的 URL 地址。如果是静态图片可直接使用 `src`；如果需要从全局状态动态读取图片地址，请使用 `data.path`，此时它会覆盖 `src`。

```json
{
  "id": "avatar-image",
  "component": "image",
  "src": "https://example.com/default-avatar.png",
  "data": {
    "path": "/userInfo/avatarUrl"
  }
}
```

### preview（是否启用预览）

布尔类型，控制是否支持点击图片后全屏预览大图。

```json
{
  "id": "cover-image",
  "component": "image",
  "src": "https://example.com/cover.jpg",
  "preview": true
}
```

### alt（图片描述）

当图片加载失败时显示的替代文本，同时也利于无障碍访问（a11y）。支持使用表达式 `${...}` 进行插值计算。

```json
{
  "id": "logo-image",
  "component": "image",
  "src": "https://example.com/logo.png",
  "alt": "${/siteName} 的 Logo"
}
```

## 完整示例

结合样式控制宽高和圆角，并开启预览的动态图片展示：

```json
{
  "id": "product-image",
  "component": "image",
  "src": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  "alt": "商品主图",
  "preview": true,
  "style": {
    "width": 200,
    "height": 200,
    "borderRadius": 8,
    "objectFit": "cover"
  }
}
```

## 新手常见问题

**Q: 图片加载失败怎么办？**
- 检查图片 URL 地址是否正确且允许跨域访问。如果加载失败，组件会显示 `alt` 属性配置的替代文本。

**Q: 如何控制图片的大小和裁剪方式？**
- 可以通过 `style` 属性设置 `width` 和 `height`（如 `{"width": 100, "height": 100}`）。如果图片比例和容器不一致，建议在 `style` 中加上 `"objectFit": "cover"` 防止图片拉伸变形。

**Q: 配置了 `src` 为什么不生效？**
- 请检查是否同时配置了 `data.path`。如果全局状态中该路径有对应的值（即使是空字符串），它也会覆盖 `src` 属性。
