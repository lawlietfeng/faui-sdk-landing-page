# pagination 组件

`pagination` 组件用于采用分页的形式分隔长列表数据，每次只加载一个页面。它通常与 `table` 或 `list` 等数据展示组件结合使用，以避免一次性加载过多数据导致页面卡顿。

## 适用场景

- **长列表分割**：将大量数据切分为多页进行展示。
- **数据按需加载**：配合后端接口，根据页码和每页条数请求局部数据。
- **结合表格渲染**：作为 `table` 或 `list` 组件的底部翻页控件。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `current` | `ValueBinding` | - | 当前页数，**必须**通过 `path` 绑定全局状态 |
| `pageSize` | `ValueBinding` | - | 每页条数，**必须**通过 `path` 绑定全局状态 |
| `total` | `number \| string` | `0` | 数据总条数，支持插值表达式 |
| `align` | `'start' \| 'center' \| 'end' \| string` | `'start'` | 分页组件的水平对齐方式 |
| `showTotal` | `string` | - | 用于显示数据总量的字符串模板，支持懒求值插值 |
| `showSizeChanger` | `boolean \| string` | `false` | 是否展示 `pageSize` 切换器 |
| `showQuickJumper` | `boolean \| string` | `false` | 是否可以快速跳转至某页 |
| `disabled` | `boolean \| string` | `false` | 禁用整个分页器 |
| `hideOnSinglePage` | `boolean \| string` | `false` | 只有一页时是否隐藏分页器 |
| `simple` | `boolean \| string` | `false` | 是否显示为简单分页风格 |
| `size` | `'default' \| 'small' \| string` | `'default'` | 分页器的尺寸 |

### current & pageSize（双向绑定参数）

`current` 和 `pageSize` 是分页器的核心双向绑定属性。当用户切换页码或改变每页条数时，引擎会自动触发 `update_data` 将最新的值写回对应的 `path` 路径下。

```json
{
  "component": "pagination",
  "id": "pagination-basic",
  "current": { "path": "/page/current" },
  "pageSize": { "path": "/page/pageSize" },
  "total": 500
}
```

### total（数据总数）

数据总条数，通常通过表达式绑定到某个全局变量或接口返回的总条数字段上。

```json
{
  "component": "pagination",
  "id": "pagination-total",
  "current": { "path": "/page/current" },
  "pageSize": { "path": "/page/pageSize" },
  "total": "${$root.tableDataTotal}"
}
```

### align（对齐方式）

控制分页组件在其父容器中的水平对齐方式。

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `start` | 居左对齐 | 默认状态，适合跟随左对齐内容的布局 |
| `center` | 居中对齐 | 适合卡片底部或独立一行的居中布局 |
| `end` | 居右对齐 | 常见于表格底部右下角的对齐 |

```json
{
  "component": "pagination",
  "id": "pagination-align",
  "current": { "path": "/page/current" },
  "pageSize": { "path": "/page/pageSize" },
  "total": 50,
  "align": "end"
}
```

### showTotal（显示总量模板）

提供一个包含局部变量的插值模板字符串，用于在分页器左侧显示总数和当前范围。该属性会进行**懒求值**计算，内部会注入局部变量 `total` 和 `range`（数组，`range[0]` 为当前页起始序号，`range[1]` 为结束序号）。

```json
{
  "component": "pagination",
  "id": "pagination-show-total",
  "current": { "path": "/page/current" },
  "pageSize": { "path": "/page/pageSize" },
  "total": 85,
  "showTotal": "共 ${total} 条数据，当前显示 ${range[0]}-${range[1]} 条"
}
```

### on_change（分页改变事件）

除了自动将 `current` 和 `pageSize` 回写到 `path` 外，你还可以配置 `on_change` 动作，以便在分页发生改变时执行额外的逻辑（如重新发起 HTTP 请求获取新数据）。触发时，`payload` 中会合并最新的 `current` 和 `pageSize`。

```json
{
  "component": "pagination",
  "id": "pagination-on-change",
  "current": { "path": "/page/current" },
  "pageSize": { "path": "/page/pageSize" },
  "total": 100,
  "on_change": {
    "action": "http_proxy",
    "payload": {
      "http_config": {
        "url": "/api/getList",
        "method": "GET"
      }
    }
  }
}
```

## 完整示例

这是一个组合了多种功能的分页器配置：

```json
{
  "component": "pagination",
  "id": "pagination-complex",
  "current": { "path": "/page/current" },
  "pageSize": { "path": "/page/pageSize" },
  "total": "${$root.totalCount}",
  "align": "end",
  "showSizeChanger": true,
  "showQuickJumper": true,
  "showTotal": "总计 ${total} 条记录",
  "on_change": {
    "action": "http_proxy",
    "payload": {
      "http_config": {
        "url": "/api/fetchData",
        "method": "POST"
      }
    }
  }
}
```

## 新手常见问题

**Q: 为什么我的 `showTotal` 报错 `ReferenceError: total is not defined`？**
- 检查你是否在其他组件外部通过 `useExpression` 直接解析了包含 `${total}` 的字符串。在 `pagination` 组件中，`showTotal` 是一个特殊的模板字符串，由组件内部在回调时进行**懒求值**并注入 `total` 和 `range` 变量。请直接将其配置为如 `"共 ${total} 条"` 的字符串，不要在全局或其他不支持这些局部变量的地方求值。

**Q: 点击下一页，页码为什么没有变化？**
- `pagination` 依赖于 `current` 和 `pageSize` 绑定的全局状态。请确保你配置了正确的 `current.path` 和 `pageSize.path`。当点击分页时，引擎会自动执行回写动作，如果没有绑定路径，状态不会更新，组件也就不会重新渲染到新页码。

**Q: 为什么同时配置了 `current.path` 和 `on_change`，`on_change` 里的请求拿到的还是旧的页码？**
- 引擎会优先自动回写最新的 `current` 和 `pageSize`，并且在触发 `on_change` 时，会将最新的 `current` 和 `pageSize` 注入到动作的 `payload` 中。你可以直接在 `on_change` 的后续逻辑中通过 `${$root.page.current}` 读取，或直接使用注入的 `payload.current`。
