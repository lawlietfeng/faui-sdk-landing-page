# faui-sdk-landing-page

FAUI SDK 的文档与演示站。站点覆盖 Form Edition、Full Edition、Actions、组件文档、Agent Demo 和 JSON Debug。

在线预览：https://lawlietfeng.github.io/faui-sdk-landing-page/

## 页面

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 首页 | `/` | SDK 能力与入口说明 |
| 在线文档 | `/docs` | SDK 镜像文档与站点指南 |
| Agent Demo | `/agent-demo` | 通过 `faui-agent` 生成并以 Full Edition 预览 Schema |
| JSON Debug | `/json-debug` | 按 Form / Full Edition 校验和预览 `Activity[]` |

## SDK 制品来源

本站通过 `@faui/react` 使用云效制品仓库中的 SDK。项目根目录的 `.npmrc` 将 `@faui` scope 指向云效仓库，其他依赖仍使用 npm 官方源。

```text
@faui/react       -> 云效制品仓库
其他 npm 包        -> https://registry.npmjs.org/
```

## 本地运行

```bash
npm install
npm run dev
```

## 文档维护

- `docs/sdk/` 是 `../faui-sdk/docs/` 的完整镜像，不在此目录手工改写 SDK 文档。
- `docs/site/` 存放本站补充内容：HTTP 请求与后端中转、组件与 Action 生命周期。

```bash
npm run sync-docs
npm run sync-docs:check
npm run check-doc-links
```

## 验证

```bash
npm run sync-docs:check
npm run check-doc-links
npm run lint
npm run build
```

## 项目结构

```text
src/
├── components/             # 站点公共组件
├── pages/
│   ├── AgentDemo/          # Full Edition Agent 预览
│   ├── Docs/               # 文档导航、搜索和 Markdown 展示
│   ├── Home/               # 首页
│   └── JsonDebug/          # Form / Full Activity 调试
docs/
├── sdk/                    # faui-sdk/docs 镜像
└── site/                   # 站点补充指南
scripts/                    # 文档同步与链接检查
```

## 相关项目

- [faui-sdk](https://github.com/lawlietfeng/faui-sdk)：React 与 Ant Design 的 JSON Schema UI 渲染 SDK。
- `@faui/react`：云效制品仓库中的 FAUI React SDK。
- `@lawlietfeng/faui-agent`：Agent Demo 使用的工具调用协议实现。

## License

[Apache-2.0](./LICENSE)
