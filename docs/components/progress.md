# progress 组件

`progress`（进度条）组件用于展示操作或任务的当前进度。它可以给用户提供明确的进度反馈，缓解等待焦虑。

## 适用场景

- **任务进度展示**：如文件上传、下载或数据导出时的进度反馈。
- **完成度提示**：如表单填写完成度、用户资料完善度。
- **资源使用率**：如存储空间、系统内存等资源占比展示。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `percent` | `number \| string` | `0` | 进度条当前的百分比（`0` 到 `100`），支持插值表达式 |
| `status` | `string` | - | 进度条的状态，支持插值表达式 |
| `size` | `string` | `'default'` | 进度条的尺寸，支持插值表达式 |

### percent（百分比）

控制进度条的填充比例。通常通过插值表达式绑定到某个表示进度的全局变量。

```json
{
  "component": "progress",
  "id": "progress-percent",
  "percent": "${$root.uploadTask.progress}"
}
```

### status（状态颜色与动画）

通过改变状态，可以改变进度条的颜色和表现形式。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `success` | 绿色 | 任务已顺利完成 |
| `exception` / `error` | 红色 | 任务执行失败或遇到异常（两者效果相同） |
| `active` | 蓝色流动动画 | 任务正在进行中，需要提示流动效果 |
| `normal` | 蓝色 | 普通状态 |

```json
{
  "component": "progress",
  "id": "progress-status",
  "percent": 80,
  "status": "error"
}
```

### size（尺寸）

设置进度条的粗细。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `default` | 默认粗细 | 大多数常规场景 |
| `small` | 较细 | 空间有限的列表行内或卡片角落 |

```json
{
  "component": "progress",
  "id": "progress-size",
  "percent": 45,
  "size": "small"
}
```

## 完整示例

这是一个组合了多种状态并在同一个容器下展示不同进度的示例片段：

```json
[
  {
    "component": "progress",
    "id": "progress-1",
    "percent": 30,
    "size": "default"
  },
  {
    "component": "progress",
    "id": "progress-2",
    "percent": "${$root.currentProgress}",
    "status": "active"
  },
  {
    "component": "progress",
    "id": "progress-3",
    "percent": 100,
    "status": "success",
    "size": "small"
  }
]
```

## 新手常见问题

**Q: 为什么我的进度条没有流动的动画效果？**
- 只有当 `status` 设置为 `active` 时，进度条的蓝色填充部分才会有不断流动的动画效果。如果你的进度条一直停着不动，请检查 `status` 属性的值。

**Q: 我可以设置 `percent` 超过 100 吗？**
- UI 层面上，进度条最多只会填满（即 100%）。即使底层数据超过了 100，视觉上也只会展示到 100%。

**Q: 怎么改变进度条的具体颜色？比如改成紫色？**
- 基础组件封装仅透出了系统预设的状态语义（`success`, `error` 等），这些状态对应了当前主题中的规范颜色。如果必须使用特殊的业务色，可以通过在 `style` 中覆盖相关 CSS 变量来实现，但不推荐破坏设计规范的一致性。
