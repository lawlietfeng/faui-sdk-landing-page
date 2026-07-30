import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import type { DocRoute } from '../lib/processDocs';
import {
  isExternalDocLink,
  isInternalDocLink,
  resolveDocLink,
} from '../lib/resolveDocLink';

interface DocViewerProps {
  route: DocRoute;
}

export function DocViewer({ route }: DocViewerProps) {
  const [documentState, setDocumentState] = useState<{
    path: string;
    content: string | null;
    error: Error | null;
  }>({
    path: route.path,
    content: null,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;

    void route.loadContent().then(
      (content) => {
        if (isCurrent) {
          setDocumentState({ path: route.path, content, error: null });
        }
      },
      (error: unknown) => {
        if (isCurrent) {
          setDocumentState({
            path: route.path,
            content: null,
            error: error instanceof Error ? error : new Error('无法加载文档内容。'),
          });
        }
      },
    );

    return () => {
      isCurrent = false;
    };
  }, [route]);

  if (documentState.path !== route.path || documentState.content === null) {
    const error = documentState.path === route.path ? documentState.error : null;

    return (
      <div className="max-w-[860px] mx-auto py-10 px-6 text-gray-500 dark:text-gray-400">
        {error ? `文档加载失败：${error.message}` : '正在加载文档…'}
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto py-10 px-6 text-gray-900 dark:text-gray-100 text-base leading-relaxed">
      {route.availability && (
        <div className="mb-5 flex items-center gap-2 text-sm">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            {route.availability === 'form-full' ? 'Form / Full Edition' : 'Full Edition'}
          </span>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-[32px] font-extrabold mb-6 text-gray-900 dark:text-white" {...props} />,
          h2: (props) => <h2 className="text-[24px] font-bold mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" {...props} />,
          h3: (props) => <h3 className="text-[20px] font-semibold mt-8 mb-4 text-gray-900 dark:text-white" {...props} />,
          p: (props) => <p className="mb-4 text-gray-700 dark:text-gray-300" {...props} />,
          ul: (props) => <ul className="mb-4 pl-6 list-disc text-gray-700 dark:text-gray-300" {...props} />,
          ol: (props) => <ol className="mb-4 pl-6 list-decimal text-gray-700 dark:text-gray-300" {...props} />,
          li: (props) => <li className="mb-2" {...props} />,
          a: ({ href = '', ...props }) => {
            const resolvedHref = resolveDocLink(href, route);
            const external = isExternalDocLink(resolvedHref);

            if (isInternalDocLink(resolvedHref)) {
              return <Link {...props} className="text-[#1677ff] hover:underline" to={resolvedHref} />;
            }

            return (
              <a
                {...props}
                className="text-[#1677ff] hover:underline"
                href={resolvedHref}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              />
            );
          },
          table: (props) => (
            <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          th: (props) => <th className="p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left font-semibold text-gray-900 dark:text-gray-200" {...props} />,
          td: (props) => <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300" {...props} />,
          code: CodeBlock,
        }}
      >
        {documentState.content}
      </ReactMarkdown>
    </div>
  );
}
