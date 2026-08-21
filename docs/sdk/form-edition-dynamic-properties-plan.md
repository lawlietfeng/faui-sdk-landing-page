# Form Edition 动态属性统一与兼容改造计划

> 状态：实现完成，待用户审阅 diff（未执行提交、推送或发布）。
>
> 本文是本次改造的执行基线。任何实现、文档、测试或校验规则都应以本文为准；如需改变已确认的语义，应先更新本文并重新确认。

## 1. 目标

统一 FAUI SDK Form Edition 的动态属性规则，使运行时、TypeScript 类型、组件契约、文档和 Agent 生成规则保持一致。

重点解决“类型或文档看似支持，但运行时没有按数据变化”的问题。SDK 发布后，Agent 可读取静态契约生成并严格校验 JSON。

## 2. 范围与非目标

### 本期范围

- Form Edition 的普通 `visible`、`condition`、`skeleton`、`popconfirm.disabled`。
- Repeater 内相对路径绑定的订阅正确性。
- Form Edition 静态组件契约与全局 JSON 结构契约。
- Form Edition 组件文档、README、LLM 提示词、迁移说明、示例和校验脚本。

### 本期不做

- 不扩展 Full Edition。
- 不统一或调整 `modal`、`drawer`、`tooltip`、`popover` 的 `open` 运行时、事件顺序、回写逻辑或 TypeScript 类型。
- 不新增 `on_after_change`，不改变 `on_change` 覆盖自动回写的现有运行时行为。
- 不在 SDK 运行时增加未知属性拒绝、契约校验或警告。
- 不调整 SDK 版本号、发布节奏或发布操作。
- 不主动启动项目、浏览器交互或执行构建验证。

## 3. 兼容原则

1. 已明确可用的旧 JSON 行为保持不变。
2. `{ "path": "..." }` 已在类型或文档中声明支持、但此前未正确生效的场景，按修复处理。
3. 运行时继续宽容；严格限制仅供 Agent 或外部校验器使用。
4. 有语义冲突的旧属性保留兼容别名并标记弃用，不直接删除。
5. TypeScript 只补齐已承诺能力，不收紧现有公开联合类型。
6. 只有文档、契约和运行时均明确支持的属性，Agent 才能生成。

## 4. 统一动态值规范

### 4.1 基本规则

| 属性类别 | 允许值 | 说明 |
| --- | --- | --- |
| 普通 `visible` | `boolean`、纯表达式、`{ path }` | 除 Skeleton 外，表示组件整体是否渲染。 |
| 布尔控制属性，例如 `disabled` | `boolean`、纯表达式、`{ path }` | 仅限契约明确声明支持的属性。 |
| `condition.when` | `boolean`、纯表达式、`{ path }` | 按真假值选择分支。 |
| `condition.match` | 静态标量、纯表达式、`{ path }` | 静态值限 `string`、`number`、`boolean`、`null`。 |
| 数据值，例如 `value`、`checked`、`data` | `{ path }` | 仅限契约明确声明的组件和属性。 |
| Skeleton `loading` | `boolean`、纯表达式、`{ path }` | 控制默认 Skeleton 的加载状态。 |

纯表达式示例：

```json
"${$root.allDay}"
"${!$root.allDay}"
"${$root.status === 'approved'}"
"${$current.enabled}"
```

文本类属性可使用插值，例如：

```json
"您好，${$root.name}"
```

布尔控制属性、`when`、`match` 不允许插值文本，只允许纯表达式。

### 4.2 路径规则

默认使用根数据模型路径：

```json
{ "path": "/form/name" }
```

仅在 Repeater 子树中允许相对路径：

```json
{ "path": "./name" }
```

严格模式要求：

- 路径绑定对象只能包含 `path`。
- 根路径必须以 `/` 开头；相对路径必须以 `./` 开头。
- 路径必须指向具体字段或集合，禁止 `/`、`./`。
- `./` 只能用于 Repeater 子树中允许路径绑定的属性。
- 不支持 `{ "not": ... }`。
- JSON Pointer 不能写进表达式。
- 本期不把 JSON Pointer 转义能力作为 Agent 生成规范；Agent 不生成字段名含 `/` 或 `~` 的路径。

复杂对象或数组属性若声明支持表达式，可将整个属性设为表达式，也可在内部字符串字段中使用插值；`{ path }` 只能作为该属性的完整值，不能嵌入数组或对象内部。

### 4.3 稳定表达式上下文

Agent 只生成以下上下文：

- 组件属性：`$root`、`$current`、`$parent`。
- 表单控件 `on_change` 动作：额外允许 `$value`。
- 常规 JavaScript 运算符、比较、三元表达式和字面量。

Agent 不生成裸根字段名、`${value}`、`${fileList}` 或未被契约声明的内部辅助函数。

## 5. 运行时改造

### 5.1 内部动态值 Hook

新增内部通用 Hook，用于解析静态值、表达式和值绑定：

1. `{ path }` 使用数据订阅读取值。
2. 表达式沿用现有 `useExpression` 机制。
3. 其他静态值原样返回。
4. 不做统一类型强制转换。

布尔消费点自行保留原有语义：

- `visible`、`when` 按真假值处理。
- `disabled` 保持 `undefined`、`null` 时不覆盖底层控件默认值的行为。

该 Hook 仅供 SDK 内部使用，**不从 `@faui/react` 导出**。

### 5.2 普通 `visible`

涉及：

- `src/SchemaRenderer.tsx`
- `src/components/Text.tsx`

调整：

- `ComponentRenderer` 用通用动态值 Hook 解析普通 `visible`。
- `Text` 判断紧邻必填字段是否可见时使用同一解析逻辑。

结果：原先会被当作 truthy 对象的 `visible: { "path": "/allDay" }` 改为真实随数据变化显隐。`true`、`false` 和表达式行为不变。

### 5.3 Condition

涉及：

- `src/components/Condition.tsx`
- `src/types/components/condition.ts`

规则：

- 判断模式：`when` 和 `then` 必填；`else`、`default` 最多一个。
- 匹配模式：`match` 和 `cases` 必填；`default` 可选。
- 新 JSON 不可混用两种模式；运行时仍保留当前优先级，兼容旧 JSON。
- `cases` 的键是匹配结果的字符串表示，例如 `true`、`0`、`approved`、`null`。
- `when` 使用布尔动态值解析；`match` 使用通用动态值解析。

### 5.4 Skeleton

涉及：

- `src/components/Skeleton.tsx`
- `src/types/components/skeleton.ts`
- `src/SchemaRenderer.tsx`

规则：

- 新增规范属性 `loading`，支持布尔值、纯表达式和值绑定。
- 旧 `visible` 保留为 loading 的弃用别名；同时出现时 `loading` 优先。
- Skeleton 不使用普通 `visible` 的整体显隐语义；整体显隐由外层 `box.visible` 控制。
- 未设置 `loading` 或旧 `visible` 时，默认 `loading: true`。
- 设置 `skeletonType` 为 `button`、`avatar`、`input`、`image`、`node` 时，严格契约不允许 `children`、`loading` 或旧 `visible`。
- 历史业务 JSON 未使用 Skeleton，因此接受旧 `skeleton.visible: false` 从“整体不渲染”转为“loading 为 false、显示真实 children”的语义切换；新增示例使用规范 `loading`。

### 5.5 disabled

- 已使用 `useBooleanControlValue` 的 Form 表单控件保持当前实现。
- 仅补齐 `popconfirm.disabled`，使其支持布尔值、纯表达式和值绑定。
- `typography.disabled` 不扩展路径绑定；契约只声明它当前支持的静态布尔值和表达式能力。
- 每个组件的 `disabled` 支持范围以组件契约为准，不推断为全局能力。

### 5.6 Repeater 相对路径订阅

涉及 `RendererContextScope.subscribeData`。

`./name` 当前能读取和回写，但订阅路径未转换为实际根路径。实现时应将其解析为当前项路径，例如 `/items/0/name`，确保 `liveData` 等外部更新能够正确刷新 Repeater 子树。

## 6. 绑定与事件兼容

### 6.1 值绑定规范名

| 组件 | 新 JSON 规范 | 兼容别名 | 同时存在时 |
| --- | --- | --- | --- |
| `checkbox`、`switch` | `checked: { path }` | `value: { path }` | `checked` 优先 |
| 其他受控表单控件 | `value: { path }` | 无 | 不适用 |

`checkbox` 和 `switch` 的 `value.path` 保留运行时兼容，契约和文档标记弃用，Agent 不生成。

### 6.2 on_change

本期保持：

```ts
if (config.on_change) {
  // 执行自定义动作
} else if (path) {
  // 自动回写 dataModel
}
```

- 配置 `on_change` 后，默认自动回写仍会被覆盖。
- 本期不新增 `on_after_change`。
- 文档与契约只推荐 `${$value}`。
- 未显式设置 action 的 `value` 时，SDK 自动注入当前值；这是默认动作值，不是表达式变量。
- 严格校验暂时对“值绑定与 `on_change` 同时存在”给出警告，不阻断。未来有回写后副作用事件时再升级为错误。

## 7. 静态契约设计

### 7.1 发布位置

新增纯静态模块：

```text
src/formComponentContracts.ts
```

通过 `@faui/react/manifest` 导出：

```ts
formComponentContractVersion
formComponentContracts
formSchemaContract
```

- `formComponentContractVersion` 初始值为 `1`，仅在契约数据结构或字段语义不兼容时递增。
- 不改变现有 manifest 结构，因此不递增 `manifestVersion`。
- 模块不得导入 React、Renderer 或组件运行时依赖。

### 7.2 组件契约

每个 `FormComponentRegistry` 注册名都有独立契约；即使多个注册名共用文档，也按实际运行时属性分别描述。契约通过 `documentationSlug` 指向共享文档，例如 `grid`、`row`、`col` 都指向 `grid`。

每个最终契约包含完整基础属性和组件专属属性：

- `id`、`component` 必填。
- `name`、`domId`、`style`、`className`、`animation`、`visible`、`on_mount` 等基础属性。
- 属性静态 JSON Schema 子集、标题、说明、默认值、绑定规则、弃用信息。
- `allowedProps`、`childrenMode`、事件、数据模型绑定类型、属性依赖关系。

属性能力采用固定枚举，不用自然语言作为校验依据：

```ts
{
  schema: { type: 'boolean' },
  bindings: {
    accepts: ['expression', 'path'],
    expressionMode: 'pure',
    pathScope: 'root-or-repeater-relative',
  },
}
```

`dataModelBinding` 使用结构化初始值类型。例如普通输入为 `['string', 'null']`；Checkbox 根据是否提供 `options` 区分 `boolean` 与 `array`。

### 7.3 children 模式

使用固定枚举：

- `none`
- `component-ids`
- `template-component-ids`
- `branch-component-ids`
- `button-trigger`
- `trigger-component-ids`

其中：

- Repeater 使用 `template-component-ids`。
- Condition 使用 `branch-component-ids`，禁止 `children`。
- Upload 使用 `button-trigger`，最多一个 `button` 子组件。
- Tooltip、Popover、Popconfirm 使用 `trigger-component-ids`。

### 7.4 全局 Form JSON 契约

`formSchemaContract` 记录：

- `ACTIVITY_SNAPSHOT → content → components / dataModel` 结构。
- 组件扁平数组、唯一 ID、固定根组件 ID `root`。
- 所有子组件和分支引用必须存在。
- Form Edition 仅允许 `formComponentContracts` 中的注册名。
- 引用图必须为单根树：除 `root` 外每个组件 ID 恰好有一个父引用，禁止循环。
- Repeater 模板组件归属于该 Repeater，但会在每条数据上重复渲染。
- 可回写绑定、布尔控制路径绑定都必须在 `dataModel` 中初始化，且类型符合对应组件契约。
- 表单必填标签规则：内置 `text` 与字段同父、直接相邻、标签在前、不手写 `*`、不得复用标签 ID。

### 7.5 延后统一的浮层 open

浮层仍纳入 Form 契约和自动生成文档属性表，但只承诺当前最小稳定能力：

| 组件 | 本期契约中的 `open` |
| --- | --- |
| `modal`、`drawer`、`popover` | `boolean | { path }` |
| `tooltip` | `boolean | "${表达式}" | { path }` |

不把 Modal、Drawer、Popover 运行时偶然可解析的表达式写入契约，也不调整其类型或事件语义。后续统一 `open` 时单独处理。

## 8. 文档与示例

### 8.1 自动属性表

每篇 Form Edition 组件文档保留手写的用途、示例、注意事项和 FAQ；属性表使用固定区块自动生成：

```md
<!-- contract-props:start -->
<!-- contract-props:end -->
```

生成内容包括完整属性表、绑定方式、事件、children 规则、数据模型类型、依赖和弃用提示。

新增命令：

```bash
npm run docs:sync-contracts
```

该命令只重写标记区块。测试以只读方式检查文档区块与契约一致，不在 lint、typecheck 或 test 中自动改文件。

### 8.2 需要同步的文档

- 全部 Form Edition 组件文档。
- 新增 Form 动态绑定规范。
- 新增兼容与迁移说明。
- `docs/faui-llm-prompt.md`：只允许契约声明的组件、属性、绑定和表达式；只推荐 `${$value}`。
- 根目录 `README.md`：修正与 Form Edition `visible`、Condition、绑定和回写有关的旧说明，并链接新规范。
- `docs/development.md`：补充契约、文档同步与验证要求。

Full Edition 独有组件文档不纳入本期修改。

### 8.3 示例

新增：

```text
examples/schemas/16-form-dynamic-binding-demo.json
```

以“全天”为固定用例覆盖：

- `checked.path`
- `visible.path`
- `visible: "${!$root.allDay}"`
- `condition.when.path`
- `skeleton.loading.path`
- Repeater 内 `./` 绑定

不主动运行 Example；由用户按需人工验证。

## 9. 校验脚本

现有 `scripts/validate-schema.cjs` 含手写组件清单、Full Edition 组件和旧规则，不能作为未来 Form 严格校验的事实来源。

已改造为基于 Form 静态契约校验：

```bash
node scripts/validate-schema.cjs --mode=form-strict schema.json
```

规则：

- 默认模式保持兼容，避免中断已有 Full Edition 或旧 JSON 流程。
- `--mode=form-strict` 对 Agent 生成 JSON 执行 Form 契约和全局结构契约。
- `on_change` 与值绑定同时出现暂时只警告。
- SDK 运行时不依赖此脚本。

## 10. 测试计划

### 单元与回归测试

- 普通 `visible`：布尔、表达式、路径、反向表达式；包括动画包装路径。
- Text 紧邻必填字段标签：字段 `visible.path` 切换时星号同步变化。
- Condition：`when`、`match`、路径、分支切换、`null` 和各模式依赖。
- Skeleton：`loading` 的布尔、表达式、路径；旧 `visible` loading 别名与优先级；`skeletonType` 限制。
- Popconfirm：`disabled.path`。
- Repeater：`./` 路径读取、回写和外部数据更新订阅。
- `on_change`：旧覆盖自动回写的行为不变，并验证 `${$value}` 上下文。
- 组件契约：覆盖全部 Form Registry 名称、属性唯一性、静态 JSON 可序列化、文档 slug 和基础属性完整性。
- 文档：生成区块与契约完全一致。
- 全局契约与校验脚本：根组件、ID 唯一性、引用、循环、children 模式、路径作用域、初始数据类型、弃用别名和 `on_change` 警告。

### 默认验证

```bash
npm run lint
npm run typecheck
npm run test
```

不执行 build、浏览器自动化、截图、视觉 diff、Playwright 或 Example 运行。

## 11. 实施顺序

1. 建立静态 Form 组件契约和全局 Form JSON 契约，并扩展 manifest 导出。
2. 实现内部动态值 Hook；修复普通 `visible`、Text、Condition 和 Repeater 相对路径订阅。
3. 实现 Skeleton `loading` 与 `visible` 弃用别名；补齐 Popconfirm `disabled`。
4. 补齐相关 TypeScript 类型，但不收紧既有公开类型。
5. 补充运行时、契约和回归测试。
6. 编写文档区块生成脚本，更新 Form 文档、README、LLM 提示词、迁移说明和示例。
7. 将 `validate-schema.cjs` 改造为契约驱动的兼容/严格双模式校验器。
8. 执行默认验证，提供完整 diff 供用户确认。

以上步骤已完成；SDK 版本、提交、推送和发布仍由维护者单独控制。

未经用户明确确认，不执行 `git add`、`git commit`、`git push` 或发布。

## 12. 验收标准

- Form Edition 的运行时、类型、静态契约和文档对已承诺动态能力一致。
- Agent 能只依赖 `@faui/react/manifest` 的契约生成有效 Form JSON。
- 旧 JSON 不因 SDK 运行时升级报错；已声明但未正确生效的路径绑定按预期修复。
- 所有 Form Registry 组件都有机器可读契约和自动同步的属性表。
- Strict 校验可发现未知属性、无效引用、错误路径作用域、非法 children、条件模式混用和未初始化的绑定字段。
- 默认 lint、typecheck、test 通过。

## 13. 用户人工验证

实现完成后，建议人工打开新增示例，重点确认：

1. 勾选“全天”后，`visible.path`、反向表达式和 `condition.when.path` 均真实切换。
2. Skeleton `loading.path` 在加载与真实内容之间切换。
3. Repeater 中编辑当前项字段后，目标项正确回写；宿主推入外部数据后，子项同步刷新。
