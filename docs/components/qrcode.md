# qrcode 组件

`qrcode`（二维码）组件用于在页面中渲染和展示二维码。它支持自定义中心图标、颜色以及纠错级别等属性。

## 适用场景

- **信息分享**：生成包含当前页面链接或特定内容的二维码供用户扫码。
- **动态凭证**：结合全局状态生成具有时效性的动态二维码凭证。

## 数据绑定与展示机制

`qrcode` 组件的数据来源分为两层优先级（动态数据 > 静态数据）：
1. **动态数据绑定**：优先读取 `value.path` 绑定的全局状态。
2. **静态数据回退**：如果 `value.path` 没有绑定或者全局状态中为 `undefined`，则读取静态配置的 `content` 属性。
3. 如果两者都为空，引擎默认会渲染一个指向 Ant Design 官网的兜底二维码以防止渲染崩溃。

所有的展示内容（无论是静态 `content` 还是绑定的状态值）都会在内部经过 `useExpression` 插值解析后才生成最终的二维码。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `ValueBinding` | - | 动态数据绑定路径，优先读取 |
| `content` | `string` | - | 静态文本内容，当 `value` 未绑定时作为后备内容使用 |
| `icon` | `string` | - | 二维码中心展示的 Logo 图片地址，支持插值表达式 |
| `iconSize` | `number \| string` | `40` | 二维码中心 Logo 的宽度与高度，支持插值表达式 |
| `errorLevel` | `'L' \| 'M' \| 'Q' \| 'H' \| string` | `'M'` | 二维码的容错级别，支持插值表达式 |
| `color` | `string` | `'#000'` | 二维码的颜色，支持插值表达式 |
| `bordered` | `boolean \| string` | `true` | 是否有边框，支持插值表达式 |

### content / value（二维码内容）

通过静态文本或数据绑定设置二维码包含的信息。

```json
{
  "component": "qrcode",
  "id": "qrcode-static",
  "content": "https://example.com/share?id=${$root.userId}"
}
```

```json
{
  "component": "qrcode",
  "id": "qrcode-dynamic",
  "value": {
    "path": "/ticket/qrCodeString"
  }
}
```

### icon & iconSize（中心图标）

在二维码正中央渲染一个小图标或 Logo，增加品牌辨识度。

```json
{
  "component": "qrcode",
  "id": "qrcode-icon",
  "content": "https://example.com",
  "icon": "https://example.com/logo.png",
  "iconSize": 50
}
```

### errorLevel（容错级别）

控制二维码的容错率。容错率越高，二维码中心被遮挡（比如加上 `icon`）后依然能被扫码识别的概率越大，但二维码的图案也会越密集。

| 值 | 容错率 | 典型用途 |
| --- | --- | --- |
| `L` | 7% | 纯二维码，无图标遮挡 |
| `M` | 15% | 默认值，常规使用 |
| `Q` | 25% | 较高容错，有较小的图标遮挡 |
| `H` | 30% | 最高容错，二维码中心有较大的 Logo |

```json
{
  "component": "qrcode",
  "id": "qrcode-error-level",
  "content": "https://example.com",
  "icon": "https://example.com/large-logo.png",
  "errorLevel": "H"
}
```

### color & bordered（颜色与边框）

定制二维码的颜色和外边框。

```json
{
  "component": "qrcode",
  "id": "qrcode-style",
  "content": "https://example.com",
  "color": "#1677ff",
  "bordered": false
}
```

## 完整示例

这是一个组合了动态数据绑定、中心 Logo、自定义颜色以及高容错级别的完整二维码配置：

```json
{
  "component": "qrcode",
  "id": "qrcode-complex",
  "value": {
    "path": "/share/url"
  },
  "content": "https://fallback.example.com",
  "icon": "${$root.appConfig.logoUrl}",
  "errorLevel": "H",
  "color": "#52c41a",
  "bordered": true,
  "style": {
    "padding": "16px",
    "backgroundColor": "#f6ffed"
  }
}
```

## 新手常见问题

**Q: 为什么我配置了 `icon`，但是用手机扫码扫不出来了？**
- 当你在二维码中间加上了 `icon` 时，实际上是遮挡了一部分二维码数据。如果 `icon` 面积过大（如通过 `iconSize` 设置得很大），导致遮挡超出了当前容错级别所能恢复的极限，就会无法扫描。此时，请尝试将 `errorLevel` 提升为 `H`，或者适当减小 `iconSize`。

**Q: 我的二维码颜色改成了浅黄色，为什么扫码器识别不了？**
- 二维码的识别依赖于前景（图案）和背景之间的对比度。如果将 `color`（前景色）设置得太浅，或者背景色也较暗，扫码器可能会因为对比度不足而无法识别。建议尽量使用深色作为 `color`。

**Q: 页面刚加载时，全局变量 `/ticket/qrCodeString` 还没拿到数据，为什么二维码显示的是 Ant Design 的官网？**
- 引擎内部的兜底逻辑设定：为了防止因 `value` 不是合法字符串而导致 React 渲染崩溃，当绑定的数据为 `undefined` 且没有配置静态 `content` 时，会默认回退渲染 `https://ant.design/`。建议在获取数据之前，通过父容器（如 `box`）的 `visible` 属性隐藏二维码，或者配置一个明确的 `content` 兜底。
