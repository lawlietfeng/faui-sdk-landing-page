# FAUI 开发者指南 (Developer Guide)

欢迎来到 FAUI！本指南面向 FAUI 的核心框架开发者和二次组件贡献者。FAUI (Flexible Antd UI) 是一个基于 Ant Design 的高性能 JSON Schema 渲染引擎，旨在通过纯 JSON 配置驱动的方式快速构建响应式动态 UI 界面。

本指南不仅讲解了架构原理，还提供了标准的**开发范式与避坑规范**，只要严格遵从以下规则，即可自然规避绝大多数开发错误，确保组件能与其他系统完美融合。

---

## 1. 核心架构与模块解析

在参与开发之前，你需要了解 FAUI 的四个核心子系统：

### 1.1 渲染引擎 (Renderer System)
FAUI 提供了**双入口架构**，以满足不同业务层级的需求：
- **纯净版入口 (`src/SchemaRenderer.tsx`)**：核心的纯 UI 渲染引擎。它直接接收完整的 JSON Schema（`components` 和 `dataModel`），初始化上下文，并通过 `<ComponentRenderer />` 递归渲染整个组件树。适合业务方自行管理状态机的场景。
- **生命周期入口 (`src/Renderer.tsx`)**：状态机与生命周期分发层。它接收一个状态流数组（如 AI Agent 的回复流），内部自动拦截并提取 `type: 'ACTIVITY_SNAPSHOT'` 作为基础状态，如果后续有 `type: 'ACTIVITY_DELTA'`，它会使用 `fast-json-patch` 库在深拷贝的基础数据上逐个执行 JSON Patch（打补丁），并将最终形态透传给底层的 `SchemaRenderer`。这是为了向后兼容现有业务，也为未来扩展更多生命周期（如 `AGENT_REPLY`）打下基础。
- **递归渲染**：无论是哪种入口，最终引擎都会通过 `<ComponentRenderer />` 遍历组件树。对于任何容器组件，其子节点 `children` 或子属性必须通过引擎递归渲染，而非硬编码处理。

### 1.2 数据模型 (DataModel & Pub-Sub)
- **状态管理**：采用 `useSyncExternalStore` 构建了一个微型的发布-订阅系统。
- **细粒度更新**：组件通过 `useDataSelector(path)` 精准订阅全局数据的嵌套路径，从而实现局部重渲染。

### 1.3 动作系统 (Action System)
- **副作用中心**：在 `src/actions/index.ts` 注册了所有的副作用动作（如 `update_data`）。
- **触发**：组件在交互事件中调用 `useAction().execute(...)` 触发 JSON 配置中的动作序列。
- **动作文档**：各 Action 的属性约定与示例见 `docs/actions/README.md`。

### 1.4 表达式解析 (Expression Engine)
- **动态插值**：允许在字符串属性中使用 `${expression}` 语法。
- **沙盒求值**：底层通过沙盒执行环境对表达式求值，并自动注入 `$root`（全局数据）和相关局部上下文。

### 1.5 组件文档编写规范
- **标准化输出**：在编写或更新组件文档时，必须遵循统一的书写规范。
- **参考指南**：请参阅 [组件文档书写规范 (docs/component-doc-standard.md)](./component-doc-standard.md) 了解详细的结构与排版要求。

---

## 2. 核心开发规范与防呆注意事项 (必读)

为了避免开发中常见的性能缺陷或运行崩溃，在进行组件开发或编写 JSON Schema 时，**必须严格遵守**以下规范：

### 2.1 数据绑定与状态回写 (Data Binding & State)

- **【路径规范 (JSON Pointer)】**：
  配置 `path` 绑定全局状态时，**强制使用斜杠 `/` 分割**的 JSON Pointer 格式（如 `"/user/name"`）。严禁使用点号 `"."`，否则底层解析会失败导致状态不更新。
- **【受控组件的 Fallback 机制与 update_data 参数规范】**：
  凡是允许用户输入的受控组件，在触发 `onChange` 时，必须实现**状态自动回写机制**。如果用户未配置 `on_change` 自定义动作，但配置了绑定的 `path`，组件内部必须兜底执行 `update_data` 动作。
  **注意参数结构**：使用 `handleAction` 或 `action.execute` 时，`path` 和 `value` 必须位于动作对象的**顶层**，即 `{ action: 'update_data', path: '...', value: '...' }`。**严禁**将它们包裹在 `payload` 对象中（如 `{ action: 'update_data', payload: { path, value } }` 是错误的），否则引擎会抛出 `[warn] update_data action requires path` 警告并中断执行。
- **【数据类型包容性】**：
  对于支持模式切换（如单选/多选）的组件，组件内部的状态类型声明应具备包容性（如 `any` 或联合类型），并在向底层 UI 组件传递数据时做好安全保护（例如数组模式时强制 fallback 为 `[]`），避免由于类型方法缺失导致渲染崩溃。

### 2.2 表达式与动态插值 (Expressions)

- **【全面拦截原则】**：
  只要组件属性有可能接收从 JSON 传递过来的字符串配置（包含 `title`、`label`、`options` 等，甚至包括容器组件的 `style` 与 `theme`），**必须且只能**通过 `useExpression()` 解析后再渲染。漏包会导致表达式字符串被原样显示，甚至响应式样式失效。
- **【整体解析原则 (针对数组)】**：
  当组件需要遍历一个配置数组（如 `items`、`columns` 等）时，**必须在外层对整个数组整体调用** `useExpression(config.items)`，然后再进行 `.map`。如果只在循环内部对子项属性包裹，会导致数组结构本身不响应动态变化。
- **【回调渲染的懒求值原则】**：
  对于需要在**渲染回调或事件中**注入局部变量（如分页的 `total` 或表格的 `record`）才求值的模板属性，**严禁在组件顶层提前使用 `useExpression`**。必须保留原始字符串配置，在回调函数内部手动调用 `evaluateExpression(rawString, { ...localVars })`，否则会引发 `ReferenceError`。
- **【作用域引用前缀】**：
  在编写 JSON 的插值表达式时，若要访问全局数据模型，**必须带上 `$root.` 前缀**（例如 `${$root.user.name}`），否则会找不到变量。同时，底层已自动过滤非法键名，请确保数据命名符合标准 JS 标识符。

### 2.3 组件渲染与事件 (Rendering & Events)

- **【列表与表格的嵌套组件渲染 (List/Table Nested Components)】**：
  在 `Table` 的列配置 (`columns`) 或 `List` 的列表项中需要渲染复杂的独立交互组件（如按钮、气泡卡片、开关等）时，**必须在配置中使用 `component` 字段**来指定要渲染的子组件 ID。
  - **严禁**使用 `template` 字段传递组件 ID，`template` 仅用于纯文本插值求值。
  - 任何被 `component` 字段指定的子组件，渲染器底层都必须且会自动通过 `<RendererContextScope $current={record} $parent={dataSource}>` 进行包裹。这样，被嵌套的独立组件内部就能安全地通过 `${$current.xxx}` 访问到当前行/项的数据，实现上下文穿透。
- **【事件动作数组化 (`on_tap`)】**：
  组件的点击触发动作固定命名为 `on_tap`（并非 `on_click`）。且 `on_tap` 的值**必须是一个数组**。即使只有一个动作，也必须包裹在数组内：`[ { "action": "xxx" } ]`。
- **【子节点显式遍历】**：
  如果组件定义了特定的子节点配置数组（如 `Typography` 的 `items` 数组），必须在 render 函数内部显式遍历并使用 `<ComponentRenderer />` 递归渲染它们，绝不能遗漏。

### 2.4 JSON Schema 编写规范 (Schema Definition)

- **【根节点包裹原则】**：
  在手工编写 `.json` 演示用例时，JSON 的最外层**必须是一个数组 `[]`**（即使只有一个页面也要包裹）。
- **【入口节点 ID】**：
  在 `components` 数组中，作为页面最外层入口容器的组件，其 `id` **必须命名为 `"root"`**。不遵守上述两条将导致引擎抛出 `schema.find is not a function` 等致命解析错误。
- **【组件别名精确匹配】**：
  编写 JSON 时，`component` 字段的值必须与组件文档中声明的名称严格一致（注意大小写与缩写），否则会导致 `Unknown component type` 报错。

### 2.5 TypeScript 与类型安全 (Type Safety)

- **【类型隔离】**：
  每个新组件都必须在 `src/types/components/` 下创建专属的接口文件，并在全局的 `Component` 联合类型中注册。**绝对禁止**将组件私有属性污染到全局的 `BaseComponentConfig` 中。
- **【严格类型推导】**：
  开发组件代码时，必须使用泛型 `React.FC<ComponentProps<'your_component'>>` 获得严格的属性提示，杜绝类型安全隐患。

---

## 3. 常见问题 (FAQ)

**Q: TypeScript 报 `TS2339: Property 'xxx' does not exist on type 'Component'` 怎么办？**  
A: 说明你正在组件里访问一个未在当前组件 Config 中声明的属性。请检查你是否在 `React.FC<ComponentProps<'your_component'>>` 泛型中指定了正确的字符串字面量。

**Q: 为什么我修改了 dataModel，但是界面没有更新？**  
A: 请检查你是否使用了 `useDataSelector(path)` 来订阅该字段。如果只是读取了字面量而没有使用 Hook，组件是不会响应状态变化的。

**Q: 为什么我在 JSON 里写了 `${user.name}`，但是界面上直接显示了字符串 `${user.name}`？**  
A: 你的组件在消费这个属性时忘记套用 `useExpression()` 钩子了。请在渲染前执行 `const dynamicProp = useExpression(config.prop);`。
