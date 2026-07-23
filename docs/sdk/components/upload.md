# upload 组件

文件上传组件，用于在表单或页面中让用户选择并上传文件（如图片、文档、压缩包等）。它支持单选/多选、文件类型过滤、数量限制以及多种列表展示样式。

## 适用场景

- **证件与资料上传**：用户注册时的身份证、营业执照或证明材料上传。
- **附件管理**：在流程审批或表单提交中附带合同、简历等文档。
- **图片上传**：商品图片、用户头像或文章封面的上传。

## 核心属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value.path` | `string` | - | **必填**，双向绑定的数据路径，值将是一个包含所有文件信息的 `UploadFile[]` 数组 |
| `accept` | `string` | - | 限制可上传的文件类型（如 `".pdf,image/*"`），支持表达式 |
| `multiple` | `boolean \| string` | `false` | 是否允许在文件选择框中同时选择多个文件，支持表达式 |
| `maxCount` | `number \| string` | - | 限制最多允许上传的文件数量，支持表达式 |
| `listType` | `string` | `'text'` | 上传列表的展示样式，可选 `'text' \| 'picture' \| 'picture-card'`，支持表达式 |
| `showUploadList` | `boolean \| string` | `true` | 是否展示已上传或正在上传的文件列表，支持表达式 |
| `label` | `string` | `'点击上传'` | 默认上传按钮上的文字，支持表达式 |
| `children` | `string[]` | - | 用于替换默认上传按钮的自定义子组件 ID |

### accept（文件类型限制）

通过原生 HTML 的 `accept` 属性限制用户可以选择的文件格式。

| 常用配置 | 效果 |
| --- | --- |
| `"image/*"` | 仅允许选择所有图片格式（JPG, PNG, GIF 等） |
| `".pdf,.doc,.docx"` | 仅允许选择指定的文档格式 |
| `"video/*,audio/*"` | 仅允许选择音视频文件 |

```json
{
  "id": "avatar_upload",
  "type": "element",
  "config": {
    "component": "upload",
    "accept": "image/png, image/jpeg",
    "label": "上传头像",
    "value": { "path": "/user/avatar" }
  }
}
```

### multiple 与 maxCount（多文件与数量限制）

当 `multiple` 为 `true` 时，用户可以在文件选择弹窗中按住 Ctrl/Cmd 一次性选中多个文件。
`maxCount` 则用于严格限制最终文件列表的总数。如果设置了 `maxCount: 1`，新选择的文件会自动替换旧文件。

```json
{
  "id": "gallery_upload",
  "type": "element",
  "config": {
    "component": "upload",
    "multiple": true,
    "maxCount": 5,
    "label": "上传作品集（最多5张）",
    "value": { "path": "/user/gallery" }
  }
}
```

### listType（列表样式）

控制已选择文件的展示形态。

| 值 | 效果 | 适用场景 |
| --- | --- | --- |
| `'text'` | 纯文本列表展示文件名和删除按钮 | 默认样式，适合文档附件 |
| `'picture'` | 列表展示，带文件缩略图 | 适合需要预览的图片或混排文件 |
| `'picture-card'` | 卡片式网格展示（上传按钮本身也会变成卡片） | 适合纯图片的画廊上传体验 |

```json
{
  "id": "card_upload",
  "type": "element",
  "config": {
    "component": "upload",
    "listType": "picture-card",
    "accept": "image/*",
    "value": { "path": "/product/images" }
  }
}
```

## 数据绑定与回写 (value.path & on_change)

组件内置了完善的 fallback 回写机制：

1. **自动回写**：只要配置了 `value.path`，组件在文件状态发生变化（选择、上传中、完成、删除）时，会自动执行 `update_data` 将最新的文件列表数组（`UploadFile[]`）写回全局状态，并触发所在表单的校验。
2. **自定义回调**：如果你配置了 `on_change`，引擎会优先执行你定义的动作流。此时，**你必须在动作流中自行配置 `update_data`** 以保证状态同步。可通过 `${$value}` 引用最新的文件列表。如果 on_change 中未设置 `value` 字段，组件会自动注入当前文件列表；如果设置了自定义 `value` 表达式，组件会保留你的表达式不覆盖。

**特殊插值规则**：在 `upload` 组件的 `on_change` 动作流中，你可以使用 `${fileList}` 来代表当前组件最新的文件列表数组对象。

```json
{
  "id": "form_upload",
  "type": "element",
  "config": {
    "component": "upload",
    "field": "attachments",
    "value": { "path": "/form/attachments" },
    "rules": [
      { "required": true, "message": "必须上传证明材料" }
    ],
    "on_change": {
      "action": "update_data",
      "payload": {
        "path": "/form/attachments",
        "value": "${fileList}"
      }
    }
  }
}
```

## 自定义上传按钮 (children)

如果默认的带图标按钮不能满足需求，你可以通过 `children` 传入自定义的按钮组件。
**注意**：你不需要为自定义按钮绑定 `on_tap` 事件，`upload` 组件会自动劫持点击行为并唤起系统文件选择框。

```json
[
  {
    "id": "custom_upload",
    "type": "element",
    "config": {
      "component": "upload",
      "value": { "path": "/customFiles" },
      "children": ["my_upload_btn"]
    }
  },
  {
    "id": "my_upload_btn",
    "type": "element",
    "config": {
      "component": "button",
      "type": "dashed",
      "label": "点我选择本地文件"
    }
  }
]
```

## 完整示例

一个带有图片类型限制、卡片式预览、数量限制并包裹在表单中的完整上传示例：

```json
[
  {
    "id": "expense_form",
    "type": "element",
    "config": {
      "component": "form",
      "submitButtonId": "submit_btn",
      "children": ["amount_input", "invoice_upload", "submit_btn"]
    }
  },
  {
    "id": "amount_input",
    "type": "element",
    "config": {
      "component": "inputnumber",
      "placeholder": "请输入报销金额",
      "value": { "path": "/amount" },
      "rules": [{ "required": true, "message": "请输入金额" }]
    }
  },
  {
    "id": "invoice_upload",
    "type": "element",
    "config": {
      "component": "upload",
      "multiple": true,
      "maxCount": 3,
      "accept": "image/*",
      "listType": "picture-card",
      "value": { "path": "/invoices" },
      "rules": [{ "required": true, "message": "请上传发票凭证" }]
    }
  },
  {
    "id": "submit_btn",
    "type": "element",
    "config": {
      "component": "button",
      "label": "提交报销单",
      "on_tap": [
        { 
          "action": "http_proxy", 
          "payload": { "http_config": { "method": "POST", "path": "/api/expense" } } 
        }
      ]
    }
  }
]
```

## 新手常见问题

**Q: 为什么上传列表没有显示我选中的文件？**
- 请检查是否配置了 `value.path`（且路径必须以 `/` 开头）。如果没有配置 `value.path`，组件将无法保存选中的文件状态，导致列表为空。
- 检查 `showUploadList` 是否被意外设置为了 `false`。

**Q: 我该如何实现文件真正上传到服务器？**
- FAUI 的 `upload` 组件目前在前端扮演的是“文件选择与暂存器”的角色。双向绑定到全局数据的 `UploadFile[]` 数组中包含了文件的原始 `File` 对象（`file.originFileObj`）。
- 你需要在提交表单时，通过自定义的 `http_proxy` 或业务层的 `transformer`，将这些 File 对象组装成 `FormData` 并发送给后端服务器。

**Q: 如何在组件初始化时显示已经上传好的图片（数据回显）？**
- 你只需要在引擎初始化时的 `dataModel` 中，为对应的路径提供符合 `UploadFile[]` 规范的数组对象即可。至少需要包含 `uid`、`name` 和 `url` 属性。
  ```json
  {
    "invoices": [
      {
        "uid": "-1",
        "name": "invoice_001.png",
        "status": "done",
        "url": "https://example.com/images/invoice_001.png"
      }
    ]
  }
  ```

**Q: `value.path` 和 `on_change` 的 `${fileList}` 是什么格式？**
- 它是 Ant Design 内部维护的文件对象数组。每个元素包含 `uid` (唯一标识)、`name` (文件名)、`status` (上传状态)、`size` (大小) 以及原始文件对象 `originFileObj` 等字段。