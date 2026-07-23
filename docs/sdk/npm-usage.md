# npm 包使用指南（开箱即用）

本文面向“在你自己的 React 项目里直接使用 faui”的场景，不涉及组件实现细节。

## 1. 安装

推荐一次性安装：

```bash
npm i @lawlietfeng/faui-sdk react react-dom antd dayjs
```

或：

```bash
yarn add faui react react-dom antd dayjs
# 或
pnpm add faui react react-dom antd dayjs
```

## 2. 最小可运行示例

```tsx
import React from 'react';
import { Renderer } from '@lawlietfeng/faui-sdk';
import type { ActivitySnapshot, HttpRequestConfig } from '@lawlietfeng/faui-sdk';

const schema: ActivitySnapshot[] = [
  {
    type: 'ACTIVITY_SNAPSHOT',
    content: {
      components: [
        {
          id: 'root',
          component: 'box',
          layout: 'vertical',
          spacing: 12,
          padding: 16,
          children: ['title', 'name-input', 'submit-btn'],
        },
        {
          id: 'title',
          component: 'text',
          content: '用户信息',
          style: { fontSize: '18px', fontWeight: 'bold' },
        },
        {
          id: 'name-input',
          component: 'input',
          placeholder: '请输入姓名',
          value: { path: '/name' },
          on_change: { action: 'update_data', path: '/name', value: '${value}' },
        },
        {
          id: 'submit-btn',
          component: 'button',
          children: ['submit-text'],
          on_tap: [
            {
              action: 'http_proxy',
              payload: {
                http_config: {
                  method: 'POST',
                  path: '/api/submit',
                  headers: { 'Content-Type': 'application/json' },
                },
                http_body: { name: { path: '/name' } },
              },
            },
          ],
        },
        {
          id: 'submit-text',
          component: 'text',
          content: '提交',
        },
      ],
      dataModel: { name: '' },
    },
  },
];

const httpRequest = async (config: HttpRequestConfig) => {
  const response = await fetch(config.url, {
    method: config.method,
    headers: config.headers,
    body: config.body ? JSON.stringify(config.body) : undefined,
  });
  return response.json();
};

export default function App() {
  return <Renderer schema={schema} httpRequest={httpRequest} />;
}
```

## 3. 你必须满足的 schema 约束

- `schema` 必须是数组
- 至少有一个 `type: 'ACTIVITY_SNAPSHOT'`
- `content.components` 中必须存在 `id: 'root'` 的根组件
- 组件通过 `children: string[]` 关联子组件 `id`

## 4. 可选能力

### 4.1 初始数据覆盖与实时数据更新

```tsx
// initialData 仅在初次渲染时生效，用于初始化数据
<Renderer schema={schema} initialData={{ name: '张三' }} />

// liveData 可用于将外部的实时数据同步到渲染器内部，当 liveData 发生变化时，内部对应路径的数据会自动更新
<Renderer schema={schema} liveData={{ status: 'online' }} />
```

### 4.2 使用外部按钮提交表单

`Renderer` 支持通过 ref 在 schema 外部独立校验和提交：

```tsx
import { useRef } from 'react';
import { Renderer, type RendererHandle } from '@lawlietfeng/faui-sdk';

const rendererRef = useRef<RendererHandle>(null);

<button onClick={() => rendererRef.current?.submit('login-form')}>
  外部提交
</button>
<Renderer
  ref={rendererRef}
  schema={schema}
  onSubmit={async data => saveData(data)}
/>
```

完整的 API、校验、状态、多表单和示例验证说明见 [外部校验与提交](./external-submit.md)。

### 4.3 监听 action 执行

```tsx
<Renderer
  schema={schema}
  onAction={(action, context) => {
    console.log('action', action);
    console.log('context', context);
  }}
/>
```

### 4.4 注入自定义组件

```tsx
import { Renderer } from '@lawlietfeng/faui-sdk';
import type { ComponentProps } from '@lawlietfeng/faui-sdk';

// 也可以直接指定具体的组件类型，获取严格的类型提示：
// const MyBadge: React.FC<ComponentProps<'text'>> = ({ config }) => { ... }
const MyBadge: React.FC<ComponentProps> = ({ config }) => {
  return <div>{String(config.content ?? '')}</div>;
};

<Renderer
  schema={schema}
  customComponents={{
    mybadge: MyBadge,
  }}
/>;
```

## 5. 常见问题

### 页面显示 `Invalid schema: no ACTIVITY_SNAPSHOT found`

你的 `schema` 里没有合法快照对象，检查 `type` 字段。

### 页面显示 `No root component found`

`content.components` 中缺少 `id: 'root'`。

### `http_proxy` 没有生效

`Renderer` 没有传 `httpRequest`，或 `http_config.path` 不是可访问地址。

## 6. 进一步阅读

- Form 规则与提交流程：`docs/form-guide.md`
- 各组件详细说明：`docs/components/*.md`
- Action 详细说明：`docs/actions/README.md`
