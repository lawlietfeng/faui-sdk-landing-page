# HTTP 请求与后端中转

`http_proxy` 只负责把 Schema 中的请求配置交给 `Renderer` 的 `httpRequest`。真正发请求的是你在 React 项目中实现的 `httpRequest`。

请求链路：`on_tap` -> `http_proxy` -> `httpRequest` -> 接口。

## 1. 请求配置

在组件事件中配置 `http_proxy`。`path` 会成为 `httpRequest` 收到的 `config.url`，`http_body` 会成为 `config.body`。

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": {
      "method": "POST",
      "path": "/api/orders",
      "headers": { "Content-Type": "application/json" }
    },
    "http_body": {
      "productId": { "path": "/productId" },
      "quantity": { "path": "/quantity" }
    }
  }
}
```

`http_body` 中的 `{ "path": "/xxx" }` 会从 `dataModel` 读取值；`${...}` 表达式也会先计算再发送。

## 2. 通用的 `httpRequest`

把下面的函数传给 `Renderer` 或 `SchemaRenderer`。非 2xx 响应会抛出错误，因此 Schema 中的 `on_error` 可以继续处理失败状态。

```tsx
import { Renderer } from '@lawlietfeng/faui';
import type { HttpRequestConfig } from '@lawlietfeng/faui';

const httpRequest = async (config: HttpRequestConfig) => {
  const response = await fetch(config.url, {
    method: config.method,
    headers: config.headers,
    body: config.body === undefined ? undefined : JSON.stringify(config.body),
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.message === 'string' ? data.message : `请求失败：${response.status}`,
    );
  }

  return data;
};

export default function App() {
  return <Renderer schema={schema} httpRequest={httpRequest} />;
}
```

如果接口不是 JSON 响应，请按接口实际格式改为 `response.text()`、`response.blob()` 等。

## 3. 方式一：浏览器直接请求接口

适合公开接口，或接口已为浏览器配置 CORS 的场景。Schema 的 `path` 写完整接口地址：

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": {
      "method": "POST",
      "path": "https://api.example.com/v1/orders",
      "headers": { "Content-Type": "application/json" }
    },
    "http_body": {
      "productId": { "path": "/productId" },
      "quantity": { "path": "/quantity" }
    }
  }
}
```

注意：

- 目标接口必须允许当前站点跨域访问；使用 Cookie 时还需要服务端允许凭据跨域。
- 不要把 API Key、上游服务的固定 Token 写进 Schema 或前端代码，用户可以看到它们。
- 使用用户登录态时，优先由服务端通过 Cookie 或会话校验，而不是把长期密钥放到请求头。

## 4. 方式二：由自己的后端固定 proxy 接口代执行

适合你希望 Schema 的 `path` 仍然填写完整外部接口地址，但请求不由浏览器直接发出，而是统一交给自己的后端代理执行的场景。

这种方式的链路是：

`http_proxy` -> `httpRequest` -> `/api/faui/proxy` -> 外部接口。

Schema 中的 `path` 写外部接口地址：

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": {
      "method": "POST",
      "path": "https://partner.example.com/v1/orders",
      "headers": { "Content-Type": "application/json" }
    },
    "http_body": {
      "productId": { "path": "/productId" },
      "quantity": { "path": "/quantity" }
    }
  }
}
```

前端的 `httpRequest` 固定请求自己的后端 proxy，不直接请求 `config.url`：

```tsx
import type { HttpRequestConfig } from '@lawlietfeng/faui';

const httpRequest = async (config: HttpRequestConfig) => {
  const response = await fetch('/api/faui/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.message === 'string' ? data.message : `请求失败：${response.status}`,
    );
  }

  return data;
};
```

后端 proxy 接收 `url`、`method`、`headers`、`body` 后代为请求外部接口：

```ts
import express from 'express';

const app = express();
app.use(express.json());

const ALLOWED_ORIGINS = new Set(['https://partner.example.com']);

app.post('/api/faui/proxy', async (req, res) => {
  const { method = 'GET', url, headers = {}, body } = req.body ?? {};
  const target = new URL(url);

  if (!ALLOWED_ORIGINS.has(target.origin)) {
    return res.status(400).json({ message: '不允许请求该目标地址' });
  }

  const upstreamResponse = await fetch(target, {
    method,
    headers: {
      'Content-Type': headers['Content-Type'] ?? 'application/json',
      Authorization: `Bearer ${process.env.PARTNER_API_TOKEN}`,
    },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  });

  const data = await upstreamResponse.json().catch(() => null);
  res.status(upstreamResponse.status).json(data);
});
```

这种方式比固定业务接口更灵活，但风险也更高。后端必须限制可请求的域名、路径、方法和请求头；不要允许前端提交任意 `url` 后直接转发，否则会带来 SSRF 和越权风险。上游 API Key 或固定 Token 仍然应由后端注入，不要写进 Schema。

## 5. 方式三：由自己的后端固定业务接口中转

适合接口密钥需要保密、上游没有 CORS，或需要在服务端统一鉴权、审计和转换数据的场景。

Schema 只请求你自己的固定地址，不传上游地址：

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": {
      "method": "POST",
      "path": "/api/faui/orders",
      "headers": { "Content-Type": "application/json" }
    },
    "http_body": {
      "productId": { "path": "/productId" },
      "quantity": { "path": "/quantity" }
    }
  }
}
```

前端可使用第 2 节的通用 `httpRequest`，因为 `/api/faui/orders` 就是当前站点的后端接口。后端再把请求转给固定的上游地址。以下是 Express 示例：

```ts
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/faui/orders', async (req, res) => {
  // 在这里校验当前用户、限制字段和做业务校验。
  const upstreamResponse = await fetch('https://partner.example.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PARTNER_API_TOKEN}`,
    },
    body: JSON.stringify({
      product_id: req.body.productId,
      quantity: req.body.quantity,
    }),
  });

  const data = await upstreamResponse.json().catch(() => null);
  res.status(upstreamResponse.status).json(data);
});
```

固定中转接口只处理约定的业务，不要让前端提交任意 `url` 再由服务端转发，否则会带来 SSRF 和越权风险。

## 6. 处理成功和失败

`httpRequest` 返回的数据会作为 `$result` 传给 `on_success`；抛出的错误信息会作为 `$error` 传给 `on_error`。

```json
{
  "action": "http_proxy",
  "payload": {
    "http_config": { "method": "POST", "path": "/api/faui/orders" },
    "http_body": { "productId": { "path": "/productId" } }
  },
  "on_success": {
    "action": "message",
    "payload": { "type": "success", "content": "下单成功" }
  },
  "on_error": {
    "action": "message",
    "payload": { "type": "error", "content": "${$error}" }
  }
}
```

## 7. 选择建议

| 场景 | 推荐方式 |
|---|---|
| 公开接口，已正确配置 CORS | 浏览器直接请求 |
| Schema 要保留完整外部地址，但请求由后端代执行 | 后端固定 proxy 接口代执行 |
| 上游需要 API Key 或固定 Token | 后端固定接口中转 |
| 上游不支持浏览器跨域 | 后端固定接口中转 |
| 需要鉴权、限流、审计或字段转换 | 后端固定接口中转 |
