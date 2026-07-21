import { memo, useState } from 'react';
import { Renderer } from '@lawlietfeng/faui';
import type { Activity, HttpRequestConfig } from '@lawlietfeng/faui';
import {
  Alert,
  Button,
  Input,
  Tabs,
  Tag,
} from 'antd';
import {
  CodeOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import type { AlertProps } from 'antd';
import {
  validateActivitiesInput,
  type DebugIssue,
  type DebugIssueCategory,
  type DebugResult,
} from './lib/validateActivities';

const JSON_PLACEHOLDER = `[
  {
    "type": "ACTIVITY_SNAPSHOT",
    "content": {
      "components": [
        {
          "id": "root",
          "component": "box",
          "layout": "vertical",
          "children": ["title"]
        },
        {
          "id": "title",
          "component": "text",
          "content": "Hello FAUI"
        }
      ],
      "dataModel": {}
    }
  }
]`;

const CATEGORY_LABELS: Record<DebugIssueCategory, string> = {
  json: 'JSON 语法',
  activity: 'Activity 结构',
  schema: 'Schema 结构',
  registry: '组件支持性',
};

const CATEGORY_COLORS: Record<DebugIssueCategory, string> = {
  json: 'gold',
  activity: 'cyan',
  schema: 'geekblue',
  registry: 'purple',
};

const httpRequest = async (config: HttpRequestConfig) => {
  const response = await axios({
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.body,
  });

  return response.data;
};

const MemoizedRenderer = memo(function MemoizedRenderer({ schema }: { schema: Activity[] }) {
  return <Renderer schema={schema} httpRequest={httpRequest} />;
});

function buildStatus(result: DebugResult | null): {
  type: AlertProps['type'];
  message: string;
  description: string;
} {
  if (!result) {
    return {
      type: 'info',
      message: '尚未执行校验',
      description: '粘贴 Activity[] 数组后，点击“渲染 / 校验”开始调试。',
    };
  }

  const errorCount = result.issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = result.issues.length - errorCount;

  if (errorCount > 0) {
    return {
      type: 'error',
      message: '当前输入不能在本站渲染',
      description: `发现 ${errorCount} 个错误${warningCount > 0 ? `，以及 ${warningCount} 个提示` : ''}。`,
    };
  }

  if (warningCount > 0) {
    return {
      type: 'warning',
      message: '当前输入可以渲染，但有兼容性提示',
      description: `发现 ${warningCount} 个提示。`,
    };
  }

  return {
    type: 'success',
    message: '当前输入可以在本站渲染',
    description: '未发现常见结构问题。',
  };
}

function IssueList({ issues }: { issues: DebugIssue[] }) {
  if (issues.length === 0) {
    return (
      <Alert
        type="success"
        showIcon
        message="未发现常见结构问题"
        description="当前输入通过了 v1 的基础校验，可以在本站继续看渲染效果。"
      />
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <div
          key={`${issue.location}-${issue.message}-${index}`}
          className={`rounded-2xl border p-4 ${
            issue.severity === 'error'
              ? 'border-red-200 bg-red-50/80 dark:border-red-900/40 dark:bg-red-950/30'
              : 'border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/30'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Tag color={issue.severity === 'error' ? 'error' : 'warning'}>
              {issue.severity === 'error' ? '错误' : '提示'}
            </Tag>
            <Tag color={CATEGORY_COLORS[issue.category]}>
              {CATEGORY_LABELS[issue.category]}
            </Tag>
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100 leading-6">
            {issue.message}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
            位置: {issue.location}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JsonDebug() {
  const [rawInput, setRawInput] = useState('');
  const [lastEvaluatedInput, setLastEvaluatedInput] = useState('');
  const [result, setResult] = useState<DebugResult | null>(null);

  const handleEvaluate = () => {
    const nextResult = validateActivitiesInput(rawInput);
    setResult(nextResult);
    setLastEvaluatedInput(rawInput);
  };

  const status = buildStatus(result);
  const isDirty = !!result && rawInput !== lastEvaluatedInput;

  return (
    <div className="flex h-full pt-14">
      <div className="w-[40%] min-w-[360px] flex flex-col border-r border-gray-200 dark:border-gray-700 bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="m-0 text-[26px] font-bold tracking-tight text-gray-900 dark:text-white">
            JSON 调试
          </h2>
          <p className="mt-2 mb-0 text-sm leading-6 text-gray-500 dark:text-gray-400">
            只接受完整的 Activity[] 数组输入。点击按钮后才会重新校验并渲染。
          </p>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <Alert
            type="info"
            showIcon
            message="输入规则"
            description={(
              <div className="text-sm leading-6">
                <div>1. 只支持 Activity[] 数组，不支持直接粘贴 PageSchema 对象。</div>
                <div>2. 至少需要一个 ACTIVITY_SNAPSHOT，ACTIVITY_DELTA 可以和它一起出现。</div>
                <div>3. v1 只做基础校验，重点告诉你能不能在本站渲染，以及常见问题在哪。</div>
              </div>
            )}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden px-6 py-5 gap-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>输入区</span>
            {result && (
              <span>{isDirty ? '输入已变更，尚未重新校验' : '当前结果已同步到本次输入'}</span>
            )}
          </div>

          <div className="flex-1 rounded-[24px] border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm overflow-hidden">
            <Input.TextArea
              value={rawInput}
              onChange={(event) => setRawInput(event.target.value)}
              placeholder={JSON_PLACEHOLDER}
              variant="borderless"
              spellCheck={false}
              className="!h-full !bg-transparent !px-5 !py-4 !font-mono !text-xs !leading-6 text-gray-800 dark:text-gray-100 !shadow-none resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#050505]">
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleEvaluate}
            disabled={!rawInput.trim()}
            className="!h-11 !px-6 !rounded-full"
          >
            渲染 / 校验
          </Button>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-6">
            当前预览只会在你点击按钮后更新，适合对比多份 JSON 输入。
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          className="h-full [&_.ant-tabs-content-holder]:flex-1 [&_.ant-tabs-content-holder]:overflow-hidden [&_.ant-tabs-content]:h-full [&_.ant-tabs-tabpane]:h-full"
          tabBarStyle={{ margin: 0, paddingLeft: 16, paddingRight: 16 }}
          items={[
            {
              key: 'preview',
              label: (
                <span className="flex items-center gap-1">
                  <EyeOutlined />
                  UI 预览
                </span>
              ),
              children: (
                <div className="h-full overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {result ? (
                    <div className="space-y-4">
                      <Alert
                        type={status.type}
                        showIcon
                        message={status.message}
                        description={status.description}
                      />
                      {result.canRender ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 min-h-[200px]">
                          <MemoizedRenderer schema={result.activities} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[240px] text-sm text-gray-500 dark:text-gray-400">
                          本次输入未通过校验，预览已清空。
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                      点击“渲染 / 校验”后在此处查看结果
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'issues',
              label: (
                <span className="flex items-center gap-1">
                  <WarningOutlined />
                  问题列表
                </span>
              ),
              children: (
                <div className="h-full overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {result ? (
                    <div className="space-y-4">
                      <Alert
                        type={status.type}
                        showIcon
                        message={status.message}
                        description={status.description}
                      />
                      <IssueList issues={result.issues} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                      校验完成后，这里会告诉你是结构问题还是 Form 版兼容性问题
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'formatted-json',
              label: (
                <span className="flex items-center gap-1">
                  <CodeOutlined />
                  格式化 JSON
                </span>
              ),
              children: (
                <div className="h-full overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {result?.formattedJson ? (
                    <div className="space-y-4">
                      <Alert
                        type="info"
                        showIcon
                        message="标准化后的输入"
                        description="这里展示本次点击按钮后成功解析出的 JSON，方便你核对实际送入校验流程的内容。"
                      />
                      <pre className="text-xs font-mono bg-white dark:bg-gray-800 rounded-lg p-4 overflow-auto whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100">
                        {result.formattedJson}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                      解析成功后，这里会显示格式化后的 JSON
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
