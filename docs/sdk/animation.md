# Animation System

FAUI 内置了基于 [framer-motion](https://www.framer.com/motion/) 的动画系统，为组件的显隐切换、条件分支跳转、列表增删提供平滑的过渡动画。

## 特性

- **6 种内置预设**：fade / slideUp / slideDown / slideLeft / slideRight / zoom
- **Spring 物理动画**：通过 stiffness / damping / mass 参数实现弹性动效
- **原生 framer-motion Props**：支持直接传入 initial / animate / exit 实现任意自定义动画
- **三大集成点**：visible 显隐、Condition 分支切换、Repeater 列表增删
- **全局 LayoutGroup**：所有布局变化自动平滑过渡
- **渐进增强**：framer-motion 为可选依赖，未安装时所有动画配置被静默忽略，零影响

## 安装

framer-motion 是可选的 peerDependency（与 echarts 同策略）：

```bash
npm install framer-motion
```

未安装时，所有组件正常渲染，动画配置被忽略。

## 使用方式

在任何组件的 JSON 配置中添加 `animation` 字段即可。

### 预设字符串（最简写法）

```json
{
  "id": "content",
  "component": "box",
  "visible": "${$root.show}",
  "animation": "fade"
}
```

### 对象形式（自定义参数）

```json
{
  "id": "panel",
  "component": "card",
  "visible": "${$root.expanded}",
  "animation": {
    "preset": "slideUp",
    "duration": 0.4,
    "delay": 0.1
  }
}
```

### Spring 物理动画

```json
{
  "id": "bouncy",
  "component": "box",
  "visible": "${$root.show}",
  "animation": {
    "preset": "slideUp",
    "spring": {
      "stiffness": 300,
      "damping": 15
    }
  }
}
```

### 原生 framer-motion Props

```json
{
  "id": "custom",
  "component": "box",
  "visible": "${$root.show}",
  "animation": {
    "initial": { "opacity": 0, "scale": 0.8, "rotate": -10 },
    "animate": { "opacity": 1, "scale": 1, "rotate": 0 },
    "exit": { "opacity": 0, "scale": 0.5 },
    "spring": { "stiffness": 200, "damping": 20 }
  }
}
```

## 预设参考

| 预设 | 进入 | 退出 |
|------|------|------|
| `fade` | 透明度 0 → 1 | 透明度 1 → 0 |
| `slideUp` | 从下方 20px 滑入 + 淡入 | 向上 20px 滑出 + 淡出 |
| `slideDown` | 从上方 20px 滑入 + 淡入 | 向下 20px 滑出 + 淡出 |
| `slideLeft` | 从右侧 20px 滑入 + 淡入 | 向左 20px 滑出 + 淡出 |
| `slideRight` | 从左侧 20px 滑入 + 淡入 | 向右 20px 滑出 + 淡出 |
| `zoom` | 从 0.85 缩放 + 淡入 | 缩放到 0.85 + 淡出 |
| `none` | 禁用动画 | — |

默认 transition 为 `{ duration: 0.3 }`。配置 spring 时使用 `{ type: 'spring', ... }`。

## AnimationConfig 完整属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `preset` | `AnimationPreset` | 使用内置预设 |
| `duration` | `number` | 动画时长（秒），默认 0.3 |
| `delay` | `number` | 延迟（秒） |
| `easing` | `string` | CSS easing 函数 |
| `spring` | `{ stiffness, damping, mass }` | Spring 物理参数，有此配置时忽略 duration |
| `layout` | `boolean` | 启用布局动画（位置/尺寸变化平滑过渡） |
| `initial` | `object` | 进入前状态（覆盖 preset） |
| `animate` | `object` | 进入后状态（覆盖 preset） |
| `exit` | `object` | 退出状态（覆盖 preset） |

## 集成点

### 1. 组件 visible 显隐

任何组件配置 `animation` + `visible` 即可获得进出场动画：

```json
{
  "id": "msg",
  "component": "alert",
  "visible": "${$root.showMsg}",
  "animation": "slideUp",
  "content": "This alert slides in and out"
}
```

### 2. Condition 分支切换

在 `condition` 组件上配置 `animation`，分支切换时旧分支先退出，新分支再进入：

```json
{
  "id": "switcher",
  "component": "condition",
  "match": "${$root.tab}",
  "animation": "fade",
  "cases": {
    "home": ["home-view"],
    "about": ["about-view"]
  }
}
```

### 3. Repeater 列表增删

在 `repeater` 组件上配置 `animation` + `keyField`，列表项增删时有进出动画：

```json
{
  "id": "todo-list",
  "component": "repeater",
  "data": { "path": "/todos" },
  "keyField": "id",
  "animation": "fade",
  "children": ["todo-item"]
}
```

`keyField` 指定数据项中作为唯一标识的字段名，让动画系统正确识别哪些项是新增、删除或移动的。

### 4. 全局 LayoutGroup

SchemaRenderer 自动在顶层包裹 framer-motion 的 `LayoutGroup`，使所有带 `layout: true` 的动画在同一坐标系下协同。列表删除后剩余项的位移、条件切换后兄弟组件的重排都会平滑过渡。

## 降级策略

```
framer-motion 已安装？
  ├─ YES → 使用 AnimatePresence + motion.div 渲染动画
  └─ NO  → 走原逻辑（硬切 mount/unmount），零崩溃、零报错

组件有 animation 配置？
  ├─ YES + framer-motion 可用 → 动画生效
  ├─ YES + framer-motion 不可用 → 忽略配置，走原逻辑
  └─ NO → 走原逻辑（零开销）
```

动画包裹层（`motion.div`）自动设置 `width: 100%`（通过 `.faui-motion` CSS class，定义在 `@layer faui` 中），确保在 flex 布局中子组件不会因为包裹层宽度塌缩而拿不到正确尺寸。如需覆盖，可通过组件的 `className` 或 `style` 自定义。

## 演示

交互式动画展板：`examples/schemas/18-animation-demo.json`
