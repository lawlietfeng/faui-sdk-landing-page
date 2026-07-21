# carousel 组件

`carousel` 走马灯组件用于在一组内容之间进行轮播展示。常用于首页焦点图、产品轮播展示等场景。

## 适用场景

- **首页 Banner**：展示一组核心宣传图片或活动入口。
- **图片/卡片画廊**：在有限的空间内展示多张图片或内容卡片，用户可以通过滑动或点击指示点切换。
- **引导页/教程**：通过轮播展示多个步骤的新手引导。

## 核心属性

### 属性总览

| 属性名           | 类型                                         | 默认值     | 说明                                                         |
| ---------------- | -------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `items`          | `Array` (支持表达式)                         | -          | 走马灯的每一帧内容配置（包含 `key`、`children` 等）。        |
| `current.path`   | `string`                                     | -          | 绑定当前激活帧的索引（双向绑定），支持受控跳转。             |
| `autoplay`       | `boolean` (支持表达式)                       | `false`    | 是否自动切换。                                               |
| `autoplaySpeed`  | `number` (支持表达式)                        | -          | 自动切换的时间间隔（毫秒）。                                 |
| `dotPosition`    | `'top' \| 'bottom' \| 'left' \| 'right'`     | `'bottom'` | 面板指示点的位置。                                           |
| `dots`           | `boolean` (支持表达式)                       | `true`     | 是否显示面板指示点。                                         |
| `effect`         | `'scrollx' \| 'fade'`                        | `'scrollx'`| 动画效果（水平滚动或渐显）。                                 |
| `easing`         | `string` (支持表达式)                        | `'linear'` | 动画效果的缓动函数。                                         |
| `waitForAnimate` | `boolean` (支持表达式)                       | `false`    | 是否在动画进行时阻止用户操作切换。                           |
| `on_change`      | `Action`                                     | -          | 面板切换后的回调。自定义时可通过 `${$value}` 引用当前索引，组件会保留你设置的自定义 `value` 表达式不覆盖。 |

---

### items（轮播项配置）

定义走马灯内部包含的页面。支持表达式（可以使用 `${}` 动态读取数组）。每一个 item 本质上是一个包裹容器，可以通过 `children` 嵌套任意其他组件。

| 字段        | 类型       | 说明                                      |
| ----------- | ---------- | ----------------------------------------- |
| `key`       | `string`   | 唯一标识符（如果不传默认使用索引）。      |
| `style`     | `object`   | 每一帧容器的内联样式。                    |
| `className` | `string`   | 每一帧容器的 CSS 类名。                   |
| `children`  | `string[]` | 该帧内部嵌套的子组件 ID 数组。            |

```json
{
  "id": "home-carousel",
  "component": "carousel",
  "items": [
    {
      "key": "banner1",
      "style": { "height": "160px", "background": "#364d79" },
      "children": ["banner1-image"]
    },
    {
      "key": "banner2",
      "style": { "height": "160px", "background": "#1890ff" },
      "children": ["banner2-text"]
    }
  ]
}
```

### current.path（受控当前索引）

如果你希望通过外部数据控制走马灯跳到某一页，或者获取走马灯当前展示到了哪一页，可以通过 `current.path` 进行双向绑定。其值为数字类型的索引（从 0 开始）。

```json
{
  "id": "controlled-carousel",
  "component": "carousel",
  "current": {
    "path": "/carouselIndex"
  },
  "items": [ /* ... */ ]
}
```

### autoplay & autoplaySpeed（自动轮播）

配置走马灯是否自动播放以及轮播速度（毫秒）。

```json
{
  "id": "auto-carousel",
  "component": "carousel",
  "autoplay": true,
  "autoplaySpeed": 3000,
  "items": [ /* ... */ ]
}
```

### effect（动画效果）

控制面板切换时的动画效果，默认是水平滚动 (`scrollx`)，也可以改为渐隐渐现 (`fade`)。

```json
{
  "id": "fade-carousel",
  "component": "carousel",
  "effect": "fade",
  "items": [ /* ... */ ]
}
```

## 完整示例

一个自动播放、指示点在左侧、绑定了外部状态并包含点击动作的回调的走马灯：

```json
{
  "id": "main-carousel",
  "component": "carousel",
  "autoplay": true,
  "dotPosition": "left",
  "effect": "fade",
  "current": {
    "path": "/activeIndex"
  },
  "on_change": {
    "action": "message",
    "payload": {
      "type": "info",
      "content": "切换到了第 ${value} 张"
    }
  },
  "items": [
    {
      "key": "1",
      "style": { "height": "300px", "background": "#f5f5f5" },
      "children": ["banner_title_1"]
    },
    {
      "key": "2",
      "style": { "height": "300px", "background": "#e6f7ff" },
      "children": ["banner_title_2"]
    }
  ]
}
```

## 新手常见问题

**Q: 为什么配置了 items 但是画面一片空白？**
- 检查 `items` 中是否配置了 `children` 以及引用的组件 ID 是否真实存在。
- 走马灯默认可能没有高度，请尝试给 `items` 里的每个对象设置 `style.height`，或者在子组件中撑开高度。

**Q: 走马灯能绑定 on_change 吗？**
- 可以。在面板切换完毕后会触发 `on_change`。当前展示的索引值会通过 `${value}` 变量注入到后续的 Action 中。
