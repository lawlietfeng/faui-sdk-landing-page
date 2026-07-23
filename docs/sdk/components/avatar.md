# avatar 组件

`avatar` 组件用来代表用户或事物，支持显示图片、系统图标或文本字符。

## 适用场景

- **用户信息展示**：在导航栏右上角或个人中心显示用户头像。
- **列表与卡片**：在联系人列表、评论区卡片中作为视觉焦点标识身份。
- **状态占位**：当用户没有上传真实头像时，使用名字首字母或默认图标占位。

## 核心属性

### 属性总览

| 属性名  | 类型                                           | 默认值      | 说明                                     |
| ------- | ---------------------------------------------- | ----------- | ---------------------------------------- |
| `src`   | `string`                                       | -           | 图片资源的 URL 地址。                    |
| `icon`  | `string`                                       | -           | 备用系统图标名称（当 src 缺失或加载失败）。|
| `alt`   | `string`                                       | -           | 图片加载失败时的替代文本。               |
| `shape` | `'circle' \| 'square' \| 'round' \| 'default'` | `'circle'`  | 头像形状。                               |
| `size`  | `string \| number`                             | `'default'` | 头像的尺寸大小。                         |

---

### src（图片资源地址）

字符串类型。直接指定图片的 URL 地址。

```json
{
  "id": "user-avatar",
  "component": "avatar",
  "src": "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
}
```

### content（文字头像）

字符串类型，支持表达式。当没有提供 `src` 或图片加载失败时，显示的文本内容（通常是用户名字首字母）。

```json
{
  "id": "text-avatar",
  "component": "avatar",
  "content": "Tom",
  "style": { "backgroundColor": "#f56a00" }
}
```

### icon（预置图标）

字符串类型。指定使用系统预置的图标。目前仅支持 `"user"`，会渲染出一个默认的用户轮廓图标。

```json
{
  "id": "icon-avatar",
  "component": "avatar",
  "icon": "user",
  "style": { "backgroundColor": "#87d068" }
}
```

### data.path（动态绑定）

通过 `data.path` 从 `dataModel` 中动态读取数据：
- 如果读取到的字符串以 `http` 开头，它将被作为图片 URL（等同于动态的 `src`）。
- 如果不是 `http` 开头，它将被作为文字头像显示（等同于动态的 `content`）。

```json
{
  "id": "dynamic-avatar",
  "component": "avatar",
  "data": { "path": "/userInfo/avatarUrl" }
}
```

### shape（头像形状）

字符串枚举。控制头像的形状。

| 值 | 效果 | 典型用途 |
|---|------|---------|
| `circle`（默认） | 圆形 | 个人用户头像 |
| `square` | 正方形 | 团队、企业或应用图标 |

```json
{
  "id": "square-avatar",
  "component": "avatar",
  "shape": "square",
  "src": "https://example.com/team-logo.png"
}
```

### size（头像大小）

数值或字符串类型。设置头像的大小。
- **字符串**：可选 `"large"`, `"small"`, `"default"`。
- **数值**：直接指定像素大小，如 `64`。

```json
{
  "id": "large-avatar",
  "component": "avatar",
  "size": 64,
  "icon": "user"
}
```

## 完整示例

以下示例展示了在一个盒子容器中并排显示四种不同形式的头像：图片、图标、静态文字和动态绑定。

```json
[
  {
    "id": "avatar-container",
    "component": "space",
    "children": ["avatar-pic", "avatar-icon", "avatar-text", "avatar-dynamic"]
  },
  {
    "id": "avatar-pic",
    "component": "avatar",
    "size": "large",
    "src": "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
  },
  {
    "id": "avatar-icon",
    "component": "avatar",
    "shape": "square",
    "icon": "user",
    "style": { "backgroundColor": "#87d068" }
  },
  {
    "id": "avatar-text",
    "component": "avatar",
    "content": "U",
    "style": { "backgroundColor": "#f56a00" }
  },
  {
    "id": "avatar-dynamic",
    "component": "avatar",
    "data": { "path": "/dynamicUserName" },
    "style": { "backgroundColor": "#1677ff" }
  }
]
```

## 新手常见问题

**Q: 为什么我传了 src 还有 content，只显示图片？**
- 组件有渲染优先级：动态数据（如果是 http 开头） > 静态 `src` > 动态数据（非 http 开头） > 静态 `content`。如果图片资源有效，将优先展示图片。

**Q: 文字头像的背景颜色怎么修改？**
- 默认的背景色是浅灰色。你可以通过 `style` 属性传入 `backgroundColor` 来修改，例如 `{"style": {"backgroundColor": "#f56a00"}}`。

**Q: 文字太长溢出了怎么办？**
- Ant Design 底层会自动对文字进行缩放，但建议文字头像（`content`）最好保持在 1-2 个字符（如名字的首字母），以获得最佳的视觉体验。

**Q: 可以使用自定义的 icon 吗？**
- 目前 `avatar` 的 `icon` 属性在 FAUI 引擎中仅硬编码支持了 `"user"` 字符串。如果有更复杂的图标需求，建议使用 `src` 传入自定义图标的 URL 或者是切图。
