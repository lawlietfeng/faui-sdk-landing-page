# Activity 类型与 JSON Patch

`Renderer` 接收一个 **Activity 流**。后端或 AI Agent 可以下发完整快照，也可以继续下发轻量补丁；界面会据此更新。这份文档说明两种 Activity 数据类型，以及如何用 JSON Patch 做局部更新。

> `ACTIVITY_SNAPSHOT` 和 `ACTIVITY_DELTA` 是 `Renderer` 的输入数据类型，不是组件生命周期钩子。组件的 `on_mount` 与 Action 的 `on_success` / `on_error` 见[组件与 Action 生命周期](/docs/lifecycle)。

---

## 1. 两种 Activity 数据类型

`Renderer` 接收 `Activity[]` 数组。引擎按数组顺序处理,目前支持两种:

### 1.1 `ACTIVITY_SNAPSHOT`(快照)

**必不可少**。定义页面初始化时的完整 UI 结构(`components`)和数据模型(`dataModel`)。

```json
{
  "type": "ACTIVITY_SNAPSHOT",
  "content": {
    "dataModel": { "username": "FAUI" },
    "components": [
      { "id": "root", "component": "box", "children": ["title"] },
      { "id": "title", "component": "text", "content": "你好,${username}!" }
    ]
  }
}
```

> 如果传给 `Renderer` 的数组中没有 `ACTIVITY_SNAPSHOT`,引擎会渲染出 `Invalid schema: no ACTIVITY_SNAPSHOT found` 提示。

### 1.2 `ACTIVITY_DELTA`(增量补丁)

页面渲染完成后,如果只想改一个字段(例如把 `username` 改成 "FAUI V2"),**不要**重发整个 SNAPSHOT。下发一条 DELTA 即可:

```json
{
  "type": "ACTIVITY_DELTA",
  "patch": [
    { "op": "replace", "path": "/dataModel/username", "value": "FAUI V2" }
  ]
}
```

引擎在内存中应用补丁,React 只重渲染受影响的节点。耗时可忽略不计。

---

## 2. 6 个 patch 操作符 (JSON Patch / RFC 6902)

`patch` 数组遵循业界标准 [RFC 6902](http://jsonpatch.com/)。

> **路径规则**:补丁是对 `content`(即 `{ components, dataModel }`)操作的。所有 `path` 必须以 `/dataModel` 或 `/components` 开头。

### ① `replace` — 替换现有值(最常用)

```json
{ "op": "replace", "path": "/dataModel/username", "value": "新名字" }
```

### ② `add` — 添加属性 / 插入数组元素

**给对象加新属性:**
```json
{ "op": "add", "path": "/dataModel/age", "value": 18 }
```

**数组末尾追加(`/-` 语法):**
```json
{ "op": "add", "path": "/dataModel/employees/-", "value": { "id": 3, "name": "小明" } }
```

**数组指定位置插入:**
```json
{ "op": "add", "path": "/dataModel/employees/1", "value": { "id": 4, "name": "小红" } }
```

### ③ `remove` — 删除属性 / 数组元素

```json
{ "op": "remove", "path": "/dataModel/age" }
```

数组索引同样适用,后续元素自动前移。

### ④ `move` — 重命名或移动

```json
{ "op": "move", "from": "/dataModel/oldLocation", "path": "/dataModel/newLocation" }
```

`from` 和 `path` 都是必填。

### ⑤ `copy` — 复制

```json
{ "op": "copy", "from": "/dataModel/employees/0/name", "path": "/dataModel/starEmployeeName" }
```

源数据不变。

### ⑥ `test` — 原子校验(进阶)

补丁前的"乐观锁":目标值必须严格等于预期,整个补丁数组才继续执行;否则抛错,**已经执行的不会回滚**(JSON Patch 标准不保证 transactional)。

```json
{
  "type": "ACTIVITY_DELTA",
  "patch": [
    { "op": "test", "path": "/dataModel/department", "value": "技术部" },
    { "op": "replace", "path": "/dataModel/department", "value": "研发中心" }
  ]
}
```

---

## 3. JSON Patch 防坑指南(必读)

### 3.1 字段被删 → `ReferenceError`

**现象**:用 `remove` / `move` 删掉 `dataModel.officeLocation`,而某个 text 组件的 `content` 还绑着 `"${officeLocation}"`,页面报 `ReferenceError: officeLocation is not defined`。

**原因**:faui 的表达式引擎只把当前 `dataModel` 中**存在**的顶级字段注入作用域。字段一旦被删,JS 就找不到这个变量。

**防坑**:对可能被动态删除的字段,用条件回退:

```json
// ❌ 危险:officeLocation 被 remove,页面崩
"content": "${officeLocation}"

// ✅ 安全:typeof 保护
"content": "${typeof officeLocation !== 'undefined' ? officeLocation : '未知地点'}"
```

### 3.2 patch 里的表达式不会被求值

**现象**:用 `add` 操作往 dataModel 写入一个字符串 `"明星员工是:${starEmployeeName}"`,页面上**原样**显示了 `${starEmployeeName}`,没有被替换。

**原因**:`ACTIVITY_DELTA` 是**纯 JSON 结构合并**,不在打补丁那一刻执行表达式。表达式必须挂在 React 组件的 prop 上,组件渲染时才触发求值。

**防坑**:动态插入带表达式的文本,**别去写 dataModel**——`add` 一个新的 `text` 组件到 `components` 数组或某容器的 `children` 树中。新 text 被 React 渲染时,它的 `content` 会自然触发表达式求值。

### 3.3 React Child 报错

**现象**:`Objects are not valid as a React child (found: object with keys {path})`。

**原因**:错误地在展示类组件的内容属性上用了双向绑定对象 `{ "path": "/xxx" }`。

**防坑**:
- **表单输入类**(`input` / `select` 等)的 `value` / `data`:**必须**用 `{ "path": "/xxx" }`
- **展示类**(`text.content` / `button.label` / `label` 等)的内容:**必须**用插值 `"${xxx}"`

> 输入框存数据,文本框看数据,所以输入框用 path,文本框用 ${},用混了就报错,不混就不报错。

---

## 4. 为什么使用 Delta?

1. **极快**:底层是 `fast-json-patch`,几十个补丁加在一起也在 1ms 量级
2. **不闪烁、不重置**:全量 SNAPSHOT 重渲会触发 React 卸载/重挂,用户刚打的字、滚动位置、焦点都丢。Delta 只重渲影响到的节点,交互状态完整保留
3. **流量小**:AI 流式生成 UI 时,每次只下发改动那几行,而不是整页 schema

---

## 5. 进一步阅读

- 静态消费 schema:见 npm 使用指南中的 `SchemaRenderer`
- 组件与 Action 回调:见[组件与 Action 生命周期](/docs/lifecycle)
- 各组件具体属性:左侧分类导航
- AI 流式生成 schema:见 `@lawlietfeng/faui-agent` 包文档
