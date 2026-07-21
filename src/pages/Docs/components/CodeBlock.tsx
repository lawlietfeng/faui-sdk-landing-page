import { useState } from 'react';
import type { HTMLAttributes } from 'react';
import { Button } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../../components/useTheme';

// ghcolors 在 @types/react-syntax-highlighter 下被推断成
// `CSSProperties | { [key: string]: CSSProperties }` 联合。运行时它就是 prism 主题字典,
// 但 TS 在严格模式下不肯把联合窄化进 SyntaxHighlighter.style 期望的字典形态,
// 只能 `as any` 跳过。问题在上游 @types,不在我们代码。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ghcolorsStyle = ghcolors as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vscDarkPlusStyle = vscDarkPlus as any;

export interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
  node?: unknown;
}

// react-markdown 把 markdown 的 code 节点(行内和块级)都路由到这里。
// 块级带 `language-xxx` className 时套上 SyntaxHighlighter,顺手提供复制按钮。
export function CodeBlock(props: CodeBlockProps) {
  // 把 react-markdown 注入的 node 字段从 rest 中剔除,避免泄漏到 DOM
  const { inline, className, children, node, ...rest } = props;
  void node;
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeContent = String(children).replace(/\n$/, '');
  const isJson = match && match[1].toLowerCase() === 'json';
  const isDark = theme === 'dark';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!inline && match) {
    let formattedContent = codeContent;
    if (isJson) {
      try {
        formattedContent = JSON.stringify(JSON.parse(codeContent), null, 2);
      } catch {
        // keep original
      }
    }

    return (
      <div className="relative my-6">
        <Button
          type="text"
          size="small"
          icon={copied ? <CheckOutlined className="text-green-500" /> : <CopyOutlined className="dark:text-gray-400" />}
          onClick={handleCopy}
          className="!absolute !top-3 !right-3 z-10 bg-white dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-600 shadow-sm"
        />
        <SyntaxHighlighter
          style={isDark ? vscDarkPlusStyle : ghcolorsStyle}
          language={match[1]}
          PreTag="div"
          customStyle={{
            borderRadius: '8px',
            padding: '16px',
            paddingTop: '36px',
            margin: 0,
            fontSize: '14px',
            lineHeight: 1.65,
            backgroundColor: isDark ? '#111827' : 'var(--tw-prose-pre-bg, #f6f8fa)',
            border: isDark
              ? '1px solid #334155'
              : '1px solid var(--tw-prose-pre-border, #d0d7de)',
          }}
          {...rest}
        >
          {formattedContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400" {...rest}>
      {children}
    </code>
  );
}
