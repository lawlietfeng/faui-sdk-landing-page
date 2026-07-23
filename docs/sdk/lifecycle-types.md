# FAUI 生命周期类型与增量更新 (Delta) 小白指南

FAUI 渲染器不仅仅支持静态渲染，它还可以处理来自后端或 AI Agent 发送的状态流（例如一个 JSON 数组，包含了一系列的状态变更记录）。这部分文档将为您详细讲解 FAUI 支持的生命周期类型，尤其是如何使用 `ACTIVITY_DELTA` 来局部更新您的数据模型或 UI，从而实现极佳的性能表现。

---

## 1. 核心生命周期类型简介

FAUI `Renderer` 接收一个 `Activity[]` 数组。引擎会自动按照数组顺序执行生命周期操作。目前主要支持以下两种：

### 1.1 `ACTIVITY_SNAPSHOT` (快照)
这是**最基础也是必不可少**的类型。它定义了页面初始化时的完整 UI 结构 (`components`) 和数据模型 (`dataModel`)。

```json
{
  "type": "ACTIVITY_SNAPSHOT",
  "content": {
    "dataModel": { "username": "FAUI" },
    "components": [
      { "id": "root", "component": "box", "children": ["title"] },
      { "id": "title", "component": "text", "content": "你好，${username}！" }
    ]
  }
}
```
**注意：** 如果传给 `Renderer` 的数组中没有找到 `ACTIVITY_SNAPSHOT`，引擎会直接白屏并报错。

### 1.2 `ACTIVITY_DELTA` (增量补丁)
当页面渲染完成后，如果后端需要更新某个局部数据（比如把 `username` 改成 "FAUI V2"），**千万不要**重新把整个几十KB的 `ACTIVITY_SNAPSHOT` 下发一遍。
你可以下发一个轻量级的 `ACTIVITY_DELTA`，通过 `patch` 数组，告诉 FAUI：“去把某个路径下的值改掉”。引擎会直接在内存里“打补丁”，这速度快得惊人！

```json
{
  "type": "ACTIVITY_DELTA",
  "patch": [
    { "op": "replace", "path": "/dataModel/username", "value": "FAUI V2" }
  ]
}
```

---

## 2. 玩转 `ACTIVITY_DELTA` 的 6 大神级操作符 (Patch Op)

`ACTIVITY_DELTA` 中的 `patch` 数组完全遵循业界标准的 [RFC 6902 JSON Patch](http://jsonpatch.com/) 规范。
对于第一次接触 JSON Patch 的小伙伴，不要怕，我们用最通俗易懂的例子带你玩转 6 个核心操作符 (`op`)。

> **核心路径规则**：FAUI 的补丁是对 `content`（即 `{ components, dataModel }`）进行操作的。所以所有的 `path` 必须以 `/dataModel` 或 `/components` 开头。

### ① `replace`：替换现有的值 (最常用)
**场景**：你想修改某个已存在的属性值，或者更新数组里的某个特定元素。

```json
{
  "op": "replace",
  "path": "/dataModel/username",
  "value": "新名字"
}
```
* **效果**：`dataModel.username` 被改成了 "新名字"。

### ② `add`：添加新属性 或 插入数组元素
**场景 A：给对象添加原本不存在的属性**
```json
{
  "op": "add",
  "path": "/dataModel/age",
  "value": 18
}
```

**场景 B：往数组里追加元素 (✨ 重点：`/-` 语法)**
如果你想往一个列表中（例如表格数据 `employees`）添加一条新记录，请在路径最后写 `/-`，这代表**在数组末尾追加**。
```json
{
  "op": "add",
  "path": "/dataModel/employees/-",
  "value": { "id": 3, "name": "小明" }
}
```

**场景 C：在数组特定位置插入元素**
```json
{
  "op": "add",
  "path": "/dataModel/employees/1",
  "value": { "id": 4, "name": "插队的小红" }
}
```
* **效果**：小红会被插入到数组的 index 1 位置，原本在这个位置及以后的元素都会自动往后挪。

### ③ `remove`：删除属性或数组元素
**场景**：你想删掉一个字段，或者把数组里的某条数据干掉。
```json
{
  "op": "remove",
  "path": "/dataModel/age"
}
```
* **注意**：如果路径指向一个数组索引（如 `/dataModel/employees/0`），则会删掉数组第一项，后面元素会自动前移。

### ④ `move`：搬家 (重命名或移动位置)
**场景**：你想把数据从一个路径移动到另一个路径，或者在数组内调整元素顺序。
```json
{
  "op": "move",
  "from": "/dataModel/oldLocation",
  "path": "/dataModel/newLocation"
}
```
* **效果**：`oldLocation` 这个字段消失了，它的值被完整移动到了 `newLocation`。
* **必填**：必须同时提供 `from`（源路径）和 `path`（目标路径）。

### ⑤ `copy`：复制克隆
**场景**：你想把某个数据原封不动地复制一份到另一个地方。
```json
{
  "op": "copy",
  "from": "/dataModel/employees/0/name",
  "path": "/dataModel/starEmployeeName"
}
```
* **效果**：提取了第一个员工的名字，并把它赋值给了一个新的全局变量 `starEmployeeName`。源数据保持不变。

### ⑥ `test`：原子校验锁 (进阶安全玩法)
**场景**：你担心在打补丁的时候，数据已经被其他人改过了。你想加一个“校验锁”：只有当目标路径的值**严格等于**你预期的值时，这整个 patch 数组才允许继续执行下去；否则抛出异常，所有操作撤销。
```json
{
  "type": "ACTIVITY_DELTA",
  "patch": [
    {
      "op": "test",
      "path": "/dataModel/department",
      "value": "技术部"
    },
    {
      "op": "replace",
      "path": "/dataModel/department",
      "value": "研发中心"
    }
  ]
}
```
* **效果**：如果当前 `department` 恰好是 "技术部"，则执行下一条 replace 把它改成 "研发中心"。如果当前值已经是别的了，整个打补丁过程会中止并报错。

---

## 3. ACTIVITY_DELTA 防坑指南 (必读)

在使用 JSON Patch 和 `ACTIVITY_DELTA` 进行动态更新时，有一些 FAUI 特有的底层机制需要特别注意，否则很容易踩坑：

### 3.1 变量丢失导致的 `ReferenceError`
**【现象】**：当你用 `remove` 或 `move` 操作把 `dataModel` 里的某个字段删掉后，如果页面上有组件的 `content` 依然绑定着这个字段（如 `"${officeLocation}"`），整个 React 页面会崩溃并报错：`ReferenceError: officeLocation is not defined`。
**【原因】**：FAUI 的表达式引擎在求值时，只会把当前 `dataModel` 里**存在**的顶级字段注入到局部变量中。如果字段被删除了，JS 引擎就找不到这个变量。
**【防坑方案】**：在编写 Schema 时，对于可能被动态删除的字段，必须使用安全的条件回退语法：
```json
// ❌ 危险写法：如果 officeLocation 被 remove，页面会崩溃
"content": "${officeLocation}"

// ✅ 安全写法：使用 typeof 进行保护
"content": "${typeof officeLocation !== 'undefined' ? officeLocation : '未知地点'}"
```

### 3.2 JSON Patch 里的表达式“不会被评估”
**【现象】**：你想通过 `add` 操作动态添加一段文本，里面包含了表达式。结果页面上原样显示了 `"明星员工是：${starEmployeeName}"` 这个字符串，而没有被替换成真实的名字。
**【原因】**：FAUI 处理 `ACTIVITY_DELTA` 的过程是**纯粹的 JSON 结构合并**，它不会在打补丁的那一瞬间去执行表达式解析。表达式必须被挂载到 React 组件（如 Text 的 `content` 属性）上，由组件的渲染生命周期去触发评估。
**【防坑方案】**：
- 如果你要动态插入一段包含表达式的文本，**不要直接修改 dataModel** 然后指望它被解析。
- **正确的做法**是：用 `add` 操作直接把一个新的 `text` 组件对象插入到 `components` 数组或某个容器的 `children` 树中。当新的 `text` 组件被 React 渲染时，它的 `content` 属性自然会触发表达式评估。

### 3.3 React Child 格式报错
**【现象】**：报错 `Objects are not valid as a React child (found: object with keys {path})`。
**【原因】**：在修改或添加展示类组件（如 `text` 的 `content`、`card` 的 `title`）时，错误地使用了双向绑定对象 `{ "path": "/xxx" }`。
**【防坑方案】**：
- **表单输入类组件**（`input`, `select` 等）的 `value` 或 `data` 属性：**必须**用 `{ "path": "/xxx" }` 格式。
- **展示类组件**（`text`, `title`, `label` 等）的内容属性：**必须**用表达式插值格式 `"${xxx}"`。

---

## 4. 为什么选择 Delta 增量更新？

1. **极致的性能**：FAUI 底层引入了极速的 `fast-json-patch` 库。打几十个补丁的耗时不到 `0.1ms`。
2. **避免闪烁与重置**：如果你每次都全量下发 `ACTIVITY_SNAPSHOT`，输入框里用户刚打的字可能会因为 React 重渲染而被强行清空。使用 `ACTIVITY_DELTA`，React 会在底层精准触发最小范围的重绘，用户的交互状态（如焦点、滚动条、临时输入）得到完美保留！

> **动手试试吧**：你可以打开本地的 `faui` 演示项目，选择 `13-Delta与Patch全操作演示.json`，亲眼看看这 6 种操作符是如何在瞬间组合叠加，并让 UI 实时响应的！