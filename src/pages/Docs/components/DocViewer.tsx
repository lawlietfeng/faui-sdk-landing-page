import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface DocViewerProps {
  content: string;
}

export function DocViewer({ content }: DocViewerProps) {
  return (
    <div className="max-w-[860px] mx-auto py-10 px-6 text-gray-900 dark:text-gray-100 text-base leading-relaxed">
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
          a: (props) => <a className="text-[#1677ff] hover:underline" {...props} />,
          table: (props) => <table className="w-full mb-6 border-collapse" {...props} />,
          th: (props) => <th className="p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left font-semibold text-gray-900 dark:text-gray-200" {...props} />,
          td: (props) => <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300" {...props} />,
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
