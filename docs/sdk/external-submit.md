# 外部校验与提交

外部提交用于由宿主 React 页面控制表单按钮、校验和请求。表单 schema 可以不配置 `submitButtonId` 和内部按钮。

## 提交模式

| 模式 | 触发入口 | 请求入口 | 适用场景 |
| --- | --- | --- | --- |
| 内部提交 | schema 中的按钮 | `button.on_tap`、`http_proxy` | 页面完全由 schema 驱动 |
| 外部提交 | `Renderer` ref | `onSubmit` | 页面工具栏、Modal footer、分步流程、宿主请求管理 |

两种入口相互独立：

- 外部 `submit()` 只执行 `onSubmit`，不执行内部按钮的 `on_tap` 或 `http_proxy`。
- 内部按钮只执行原有 `on_tap`，不执行外部 `onSubmit`。
- 同一个表单同时配置 `onSubmit` 和 `submitButtonId` 时会输出开发警告。

## 最小示例

schema 中只保留表单和字段：

```json
{
  "id": "profile-form",
  "component": "form",
  "children": ["profile-name"]
}
```

```json
{
  "id": "profile-name",
  "component": "input",
  "value": { "path": "/profile/name" },
  "rules": [
    { "required": true, "message": "请输入姓名" }
  ]
}
```

宿主页面通过 ref 操作：

```tsx
import { useRef } from 'react';
import {
  Renderer,
  type RendererHandle,
  type ValidationResult,
} from '@lawlietfeng/faui-sdk';

const rendererRef = useRef<RendererHandle>(null);

export function ProfilePage() {
  const validate = async () => {
    const result = await rendererRef.current?.validate('profile-form');
    console.log(result);
  };

  const submit = async () => {
    const result = await rendererRef.current?.submit('profile-form');
    if (result?.status === 'error') {
      console.error(result.error);
    }
  };

  return (
    <>
      <button onClick={validate}>只校验</button>
      <button onClick={submit}>外部提交</button>
      <Renderer
        ref={rendererRef}
        schema={schema}
        onValidate={async (data, { formId }): Promise<ValidationResult> => ({
          valid: data.profile !== null,
          formId,
          data,
          errors: data.profile !== null ? {} : { 'profile-name': '用户信息无效' },
        })}
        onSubmit={async (data, context) => {
          await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          console.log('submitted form:', context.formId);
        }}
      />
    </>
  );
}
```

`onSubmit` 的第一个参数是提交时的完整数据快照。需要提交的字段必须通过 `value.path`、`checked.path` 等方式绑定到 `dataModel`。

## RendererHandle

```ts
interface RendererHandle {
  validate(formId?: string): Promise<ValidationResult>;

  submit(
    formId?: string,
    options?: { validate?: boolean }
  ): Promise<SubmitResult>;
}
```

页面只有一个表单时可以省略 `formId`。存在多个表单时必须传入目标表单 ID。

## validate()

`validate()` 执行以下流程：

1. 执行字段 `rules` 内置校验。
2. 内置校验通过后执行 `onValidate`。
3. 返回校验结果。

它不会触发 `onSubmit` 或任何网络请求。

```ts
interface ValidationResult {
  valid: boolean;
  formId: string;
  data: DataModel;
  errors: Record<string, string>;
}
```

自定义错误的 key 推荐使用字段组件 ID，这样错误可以显示在对应字段下方。`onValidate` 抛出异常时，本次校验按失败处理。

## submit()

`submit()` 默认先执行完整校验流程，校验通过后调用 `onSubmit`：

```ts
await rendererRef.current?.submit('profile-form');
```

显式跳过内置和自定义校验：

```ts
await rendererRef.current?.submit('profile-form', {
  validate: false,
});
```

```ts
interface SubmitResult {
  success: boolean;
  status:
    | 'submitted'
    | 'validation_failed'
    | 'busy'
    | 'error'
    | 'no_handler';
  formId: string;
  data: DataModel;
  validation?: ValidationResult;
  error?: unknown;
}
```

状态说明：

| status | 说明 |
| --- | --- |
| `submitted` | `onSubmit` 已成功完成 |
| `validation_failed` | 内置校验或 `onValidate` 未通过，未调用 `onSubmit` |
| `busy` | 同一个表单正在提交，当前调用被阻止 |
| `error` | 表单不存在或 `onSubmit` 抛出异常 |
| `no_handler` | 没有提供外部 `onSubmit` |

`onSubmit` 支持异步函数。同一表单提交期间再次调用 `submit()` 会返回 `busy`，不会重复执行请求。`onSubmit` 抛出的异常会放入 `SubmitResult.error`。

## onValidate

`onValidate` 适合业务规则校验，例如确认密码、跨字段关系或远程校验：

```tsx
<Renderer
  onValidate={async (data, { formId }) => ({
    valid: data.password === data.confirmPassword,
    formId,
    data,
    errors: data.password === data.confirmPassword
      ? {}
      : { 'confirm-password': '两次密码不一致' },
  })}
/>
```

只有内置校验通过后才会调用 `onValidate`。`submit(..., { validate: false })` 会同时跳过内置校验和 `onValidate`。

## 多表单

多个表单必须明确指定 ID：

```ts
await rendererRef.current?.validate('profile-form');
await rendererRef.current?.submit('address-form');
```

省略 ID 时，如果当前没有表单或存在多个表单，调用会返回失败结果，不会猜测目标表单。

## 示例验证

运行：

```bash
npm run dev
```

选择 `19-外部提交演示`，可验证：

1. 空表单点击“校验”，显示字段错误且不发送请求。
2. 姓名填写 `blocked`，验证 `onValidate` 自定义错误。
3. 填写合法数据后点击“外部提交”，查看完整提交数据。
4. 连续点击提交，确认不会重复请求。
5. 开启“模拟请求失败”，确认 `SubmitResult.error`。
6. 点击“跳过校验提交”，确认可以显式绕过校验。
7. 切换 Lifecycle 和 Pure 模式，确认两种入口都可使用。

完整 schema：[`examples/schemas/19-外部提交演示.json`](../examples/schemas/19-%E5%A4%96%E9%83%A8%E6%8F%90%E4%BA%A4%E6%BC%94%E7%A4%BA.json)

## 常见问题

### 点击外部提交后执行了两次请求

不要在 `onSubmit` 中再次触发内部按钮。外部提交和内部 `http_proxy` 是两个独立入口。

### onSubmit 中的数据缺少字段

检查对应组件是否配置了正确的 `value.path` 或 `checked.path`，并确保 `dataModel` 包含该字段的初始值。

### validate() 通过但没有提交

`validate()` 只负责校验。需要调用 `submit()` 才会执行 `onSubmit`。

### submit() 返回 no_handler

外部提交必须向 `Renderer` 提供 `onSubmit`。
