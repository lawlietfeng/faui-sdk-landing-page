/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import { Renderer } from '@lawlietfeng/faui';
import type { ActivitySnapshot, HttpRequestConfig } from '@lawlietfeng/faui';
import { FauiAgent, TOOL_SYSTEM_PROMPT } from '@lawlietfeng/faui-agent';
import type { PageSchema } from '@lawlietfeng/faui-agent';
import { Input, Button, Tabs, message, Collapse, Select } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  schema?: PageSchema | null;
  createdAt: number;
  updatedAt: number;
}

interface AgentConfig {
  apiKey: string;
  provider: string;
  model: string;
  baseUrl: string;
}

interface ProviderMeta {
  value: string;
  label: string;
  defaultModel: string;
  defaultBaseUrl?: string;
  hint?: string;
}

const DEFAULT_PROVIDER = 'anthropic';

const SUPPORTED_PROVIDERS: ProviderMeta[] = [
  {
    value: 'anthropic',
    label: 'Anthropic',
    defaultModel: 'claude-sonnet-4-20250514',
    defaultBaseUrl: 'https://api.anthropic.com',
  },
  {
    value: 'openai',
    label: 'OpenAI',
    defaultModel: 'gpt-4.1',
    defaultBaseUrl: 'https://api.openai.com/v1',
  },
  {
    value: 'openai-compatible',
    label: 'OpenAI Compatible',
    defaultModel: 'gpt-4.1-mini',
    hint: '适用于 Ollama、vLLM、LM Studio 或自建网关，通常需要同时填写 Base URL。',
  },
  {
    value: 'google',
    label: 'Google',
    defaultModel: 'gemini-2.0-flash',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
  {
    value: 'xai',
    label: 'xAI',
    defaultModel: 'grok-2-latest',
    defaultBaseUrl: 'https://api.x.ai/v1',
  },
  {
    value: 'groq',
    label: 'Groq',
    defaultModel: 'llama-3.3-70b-versatile',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
  },
  {
    value: 'mistral',
    label: 'Mistral',
    defaultModel: 'codestral-latest',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
  },
  {
    value: 'openrouter',
    label: 'OpenRouter',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
  },
  {
    value: 'azure-openai-responses',
    label: 'Azure OpenAI (Responses)',
    defaultModel: 'gpt-4.1',
    hint: '通常需要填写 Azure endpoint / deployment，对应的 Model 往往是你自己的 deployment 名称。',
  },
  {
    value: 'amazon-bedrock',
    label: 'Amazon Bedrock',
    defaultModel: 'anthropic.claude-3-5-haiku-20241022-v1:0',
    defaultBaseUrl: 'https://bedrock-runtime.us-east-1.amazonaws.com',
    hint: '通常依赖 AWS 环境凭证或角色，不一定使用普通 API Key。',
  },
  {
    value: 'google-vertex',
    label: 'Google Vertex',
    defaultModel: 'gemini-2.0-flash',
    defaultBaseUrl: 'https://{location}-aiplatform.googleapis.com',
    hint: '通常依赖 Google ADC / Vertex 凭证，Base URL 里的 {location} 需要替换成你的区域。',
  },
  {
    value: 'google-gemini-cli',
    label: 'Google Gemini CLI',
    defaultModel: 'gemini-2.5-flash',
    defaultBaseUrl: 'https://cloudcode-pa.googleapis.com',
    hint: '通常依赖 OAuth 登录，不是普通 API Key。',
  },
  {
    value: 'google-antigravity',
    label: 'Google Antigravity',
    defaultModel: 'gemini-3-flash',
    defaultBaseUrl: 'https://daily-cloudcode-pa.sandbox.googleapis.com',
    hint: '通常依赖 OAuth 登录，不是普通 API Key。',
  },
  {
    value: 'openai-codex',
    label: 'OpenAI Codex',
    defaultModel: 'gpt-5.2-codex',
    defaultBaseUrl: 'https://chatgpt.com/backend-api',
    hint: '通常依赖 OpenAI / ChatGPT OAuth 会话，而不是标准 API Key。',
  },
  {
    value: 'github-copilot',
    label: 'GitHub Copilot',
    defaultModel: 'claude-sonnet-4',
    defaultBaseUrl: 'https://api.individual.githubcopilot.com',
    hint: '通常依赖 GitHub Copilot OAuth，会话型认证多于 API Key。',
  },
  {
    value: 'cerebras',
    label: 'Cerebras',
    defaultModel: 'gpt-oss-120b',
    defaultBaseUrl: 'https://api.cerebras.ai/v1',
  },
  {
    value: 'huggingface',
    label: 'Hugging Face',
    defaultModel: 'Qwen/Qwen3-Coder-480B-A35B-Instruct',
    defaultBaseUrl: 'https://router.huggingface.co/v1',
  },
  {
    value: 'kimi-coding',
    label: 'Kimi Coding',
    defaultModel: 'k2p5',
    defaultBaseUrl: 'https://api.kimi.com/coding',
  },
  {
    value: 'minimax',
    label: 'MiniMax',
    defaultModel: 'MiniMax-M2',
    defaultBaseUrl: 'https://api.minimax.io/anthropic',
  },
  {
    value: 'minimax-cn',
    label: 'MiniMax CN',
    defaultModel: 'MiniMax-M2',
    defaultBaseUrl: 'https://api.minimaxi.com/anthropic',
  },
  {
    value: 'opencode',
    label: 'OpenCode',
    defaultModel: 'claude-sonnet-4-5',
    defaultBaseUrl: 'https://opencode.ai/zen/v1',
  },
  {
    value: 'vercel-ai-gateway',
    label: 'Vercel AI Gateway',
    defaultModel: 'alibaba/qwen-3-14b',
    defaultBaseUrl: 'https://ai-gateway.vercel.sh',
  },
  {
    value: 'zai',
    label: 'ZAI',
    defaultModel: 'glm-4.5',
    defaultBaseUrl: 'https://api.z.ai/api/coding/paas/v4',
  },
];

const PROVIDER_META_MAP = Object.fromEntries(
  SUPPORTED_PROVIDERS.map((item) => [item.value, item]),
) as Record<string, ProviderMeta>;

const httpRequest = async (config: HttpRequestConfig) => {
  const response = await axios({
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.body,
  });
  return response.data;
};

const MemoizedRenderer = memo(({ schema }: { schema: ActivitySnapshot[] }) => {
  return <Renderer schema={schema} httpRequest={httpRequest} />;
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.schema) === JSON.stringify(nextProps.schema);
});

export default function AgentDemo() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('faui-agent-conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    const saved = localStorage.getItem('faui-agent-current-conversation');
    return saved || null;
  });

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = useMemo(() => currentConversation?.messages || [], [currentConversation?.messages]);

  useEffect(() => {
    if (currentConversation?.schema) {
      const snapshot: ActivitySnapshot[] = [{
        type: 'ACTIVITY_SNAPSHOT',
        content: {
          components: currentConversation.schema.components as any,
          dataModel: currentConversation.schema.dataModel ?? {},
        },
      }];
      setCurrentSchema(snapshot);
      setCurrentPageSchema(currentConversation.schema);
    } else {
      setCurrentSchema([]);
      setCurrentPageSchema(null);
    }
  }, [currentConversationId, currentConversation?.schema]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSchema, setCurrentSchema] = useState<ActivitySnapshot[]>([]);
  const [currentPageSchema, setCurrentPageSchema] = useState<PageSchema | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationsRef = useRef(conversations);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);
  const agentRef = useRef<{ agent: FauiAgent; configKey: string } | null>(null);

  const [config, setConfig] = useState<AgentConfig>(() => {
    const saved = localStorage.getItem('faui-agent-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      apiKey: '',
      provider: DEFAULT_PROVIDER,
      model: PROVIDER_META_MAP[DEFAULT_PROVIDER].defaultModel,
      baseUrl: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('faui-agent-config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('faui-agent-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('faui-agent-current-conversation', currentConversationId);
    } else {
      localStorage.removeItem('faui-agent-current-conversation');
    }
  }, [currentConversationId]);

  const currentProviderMeta = PROVIDER_META_MAP[config.provider];
  const providerOptions = currentProviderMeta
    ? SUPPORTED_PROVIDERS
    : [{ value: config.provider, label: `${config.provider} (Current)` }, ...SUPPORTED_PROVIDERS];
  const apiKeyPlaceholder = currentProviderMeta?.hint?.includes('OAuth')
    ? '该 Provider 往往依赖 OAuth / 环境凭证'
    : config.provider === 'openai-compatible'
      ? '可留空或填写你的网关/API Key'
      : 'sk-...';

  const handleProviderChange = useCallback((nextProvider: string) => {
    setConfig((prev) => {
      const nextMeta = PROVIDER_META_MAP[nextProvider];
      const prevMeta = PROVIDER_META_MAP[prev.provider];
      const shouldClearBaseUrl = !prev.baseUrl
        || prev.provider === 'openai-compatible'
        || prev.baseUrl === prevMeta?.defaultBaseUrl;

      return {
        ...prev,
        provider: nextProvider,
        model: nextMeta?.defaultModel || prev.model,
        baseUrl: shouldClearBaseUrl ? '' : prev.baseUrl,
      };
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    setCurrentSchema([]);
    setCurrentPageSchema(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setCurrentSchema([]);
      setCurrentPageSchema(null);
    }
  }, [currentConversationId]);

  const updateConversationMessages = useCallback((id: string, messages: ChatMessage[], schema?: PageSchema | null) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        const firstUserMsg = messages.find(m => m.role === 'user');
        return {
          ...c,
          messages,
          ...(schema !== undefined ? { schema } : {}),
          title: firstUserMsg ? firstUserMsg.content.slice(0, 30) : '新对话',
          updatedAt: Date.now(),
        };
      }
      return c;
    }));
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (!config.apiKey) {
      message.error('请先配置 API Key');
      return;
    }

    // 如果没有当前对话，创建一个
    let convId = currentConversationId;
    if (!convId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: inputValue.slice(0, 30),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
      convId = newConv.id;
    }

    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    const userPrompt = inputValue;

    // 更新消息列表（用 ref 读最新状态，避免闭包过期）
    const currentMessages = conversationsRef.current.find(c => c.id === convId)?.messages || [];
    const updatedMessages = [...currentMessages, userMessage];
    updateConversationMessages(convId, updatedMessages);

    setInputValue('');
    setLoading(true);

    console.group(`[faui-agent] 生成请求 - ${new Date().toLocaleTimeString()}`);
    console.log('用户输入:', userPrompt);
    console.log('当前配置:', { provider: config.provider, model: config.model });
    console.log('历史消息数:', currentMessages.length);

    try {
      const configKey = JSON.stringify({ provider: config.provider, model: config.model, apiKey: config.apiKey, baseUrl: config.baseUrl });
      if (!agentRef.current || agentRef.current.configKey !== configKey) {
        agentRef.current = {
          agent: new FauiAgent({
            provider: config.provider as any,
            model: config.model,
            apiKey: config.apiKey,
            baseUrl: config.baseUrl || undefined,
            useTools: true,
            systemPrompt: TOOL_SYSTEM_PROMPT,
          }),
          configKey,
        };
      }
      const agent = agentRef.current.agent;

      // Track the latest status message index so we can update it in-place
      let statusIdx: number | null = null;

      const updateStatus = (content: string) => {
        const conv = conversationsRef.current.find(c => c.id === convId);
        if (!conv) return;
        const msgs = conv.messages;
        if (statusIdx !== null && statusIdx < msgs.length && msgs[statusIdx].role === 'system') {
          const updated = [...msgs];
          updated[statusIdx] = { ...updated[statusIdx], content };
          updateConversationMessages(convId!, updated);
        } else {
          statusIdx = msgs.length;
          updateConversationMessages(convId!, [...msgs, { role: 'system', content }]);
        }
      };

      let assistantText = '';
      let assistantIdx: number | null = null;

      // 构建历史对话（只传 user/assistant，不传 system）
      const history = currentMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      for await (const event of agent.generatePageStream(userPrompt, { history, currentSchema: currentPageSchema ?? undefined })) {
        const conv = conversationsRef.current.find(c => c.id === convId);
        if (!conv) break;

        if (event.type === 'status') {
          console.log('状态更新:', event.message);
          updateStatus(event.message);
        } else if (event.type === 'generating') {
          // no-op
        } else if (event.type === 'text_delta') {
          assistantText += event.delta;
          const msgs = [...conv.messages];
          if (assistantIdx !== null && assistantIdx < msgs.length) {
            msgs[assistantIdx] = { role: 'assistant', content: assistantText };
          } else {
            assistantIdx = msgs.length;
            msgs.push({ role: 'assistant', content: assistantText });
          }
          updateConversationMessages(convId!, msgs);
        } else if (event.type === 'tool_use') {
          updateStatus(`🔧 ${event.name}`);
        } else if (event.type === 'schema_updated') {
          const snapshot: ActivitySnapshot[] = [{
            type: 'ACTIVITY_SNAPSHOT',
            content: {
              components: event.schema.components as any,
              dataModel: event.schema.dataModel ?? {},
            },
          }];
          setCurrentSchema(snapshot);
          setCurrentPageSchema(event.schema);
          updateConversationMessages(convId!, conv.messages, event.schema);
        } else if (event.type === 'done') {
          const { schema, turns } = event.result;
          const componentCount = schema.components.length;

          console.log('生成完成 - 轮次:', turns, '组件数:', componentCount);

          if (componentCount > 0) {
            const snapshot: ActivitySnapshot[] = [{
              type: 'ACTIVITY_SNAPSHOT',
              content: {
                components: schema.components as any,
                dataModel: schema.dataModel ?? {},
              },
            }];
            setCurrentSchema(snapshot);
            setCurrentPageSchema(schema);
          }

          const finalMessages = [...conv.messages];
          if (statusIdx !== null && statusIdx < finalMessages.length) {
            finalMessages[statusIdx] = { role: 'system', content: `✅ 生成完成 — ${componentCount} 个组件，${turns} 轮对话` };
          } else {
            finalMessages.push({ role: 'system', content: `✅ 生成完成 — ${componentCount} 个组件，${turns} 轮对话` });
          }
          updateConversationMessages(convId!, finalMessages, componentCount > 0 ? schema : null);
          message.success('页面生成成功！');
        } else if (event.type === 'error') {
          console.error('生成错误:', event.message);
          updateConversationMessages(convId!, [...conv.messages, { role: 'system', content: `❌ 错误：${event.message}` }]);
          message.error(event.message);
        }
      }
      console.groupEnd();
    } catch (error: any) {
      console.error('生成异常:', error);
      console.groupEnd();
      message.error(error.message || '生成失败');
      const conv = conversationsRef.current.find(c => c.id === convId);
      if (conv) {
        updateConversationMessages(convId!, [...conv.messages, { role: 'system', content: `❌ 错误：${error.message || '未知错误'}` }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (currentPageSchema) {
      navigator.clipboard.writeText(JSON.stringify(currentPageSchema, null, 2));
      message.success('已复制到剪贴板');
    }
  };

  const configPanel = (
    <Collapse
      ghost
      defaultActiveKey={config.apiKey ? [] : ['config']}
      items={[{
        key: 'config',
        label: (
          <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <SettingOutlined /> 模型配置
          </span>
        ),
        children: (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">API Key</label>
              <Input.Password
                size="small"
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder={apiKeyPlaceholder}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Provider</label>
              <Select
                size="small"
                className="w-full"
                showSearch
                optionFilterProp="label"
                value={config.provider}
                onChange={handleProviderChange}
                options={providerOptions.map(({ value, label }) => ({ value, label }))}
              />
              {currentProviderMeta?.hint && (
                <div className="mt-1 text-[11px] leading-5 text-amber-600 dark:text-amber-400">
                  {currentProviderMeta.hint}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Model</label>
              <Input
                size="small"
                value={config.model}
                onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                placeholder={currentProviderMeta?.defaultModel || '请输入模型 ID'}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Base URL (可选)</label>
              <Input
                size="small"
                value={config.baseUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                placeholder={currentProviderMeta?.defaultBaseUrl || 'https://api.example.com'}
              />
            </div>
          </div>
        ),
      }]}
    />
  );

  return (
    <div className="flex h-full pt-14">
      {/* 左侧对话区 */}
      <div className="w-[38%] min-w-[360px] flex flex-col border-r border-gray-200 dark:border-gray-700">
        {/* 配置面板 */}
        <div className="px-4 pt-3 pb-1 border-b border-gray-100 dark:border-gray-800">
          {configPanel}
        </div>

        {/* 对话列表 */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">对话列表</span>
            <Button size="small" onClick={createNewConversation}>新建对话</Button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-xs ${
                  currentConversationId === conv.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setCurrentConversationId(conv.id)}
              >
                <span className="flex-1 truncate">{conv.title}</span>
                <Button
                  size="small"
                  type="text"
                  danger
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                  className="!p-0 !h-auto !min-w-0"
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <RobotOutlined className="text-4xl mb-3" />
              <p className="text-sm">输入描述，AI 将为你生成 faui 页面</p>
              <p className="text-xs mt-1 text-gray-300 dark:text-gray-600">例如：生成一个 hero 区块，包含标题和两个按钮</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区 */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-[#fafafa] dark:bg-[#0a0a0a]">
          <div className="relative flex flex-col bg-white dark:bg-[#111] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm focus-within:shadow-md focus-within:border-black/20 dark:focus-within:border-white/20 transition-all duration-300 overflow-hidden">
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="描述你想要的页面..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              variant="borderless"
              disabled={loading}
              className="!bg-transparent !px-4 !pt-3 !pb-10 !text-sm dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 !shadow-none resize-none"
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline-block mr-2 font-light">
                ↵ 发送, ⇧↵ 换行
              </span>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || !config.apiKey || loading}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black disabled:bg-black/5 disabled:text-black/25 dark:disabled:bg-white/5 dark:disabled:text-white/25 disabled:cursor-not-allowed hover:scale-105 transition-transform outline-none border-none cursor-pointer shadow-sm disabled:shadow-none [&_svg]:!text-white dark:[&_svg]:!text-black [&:disabled_svg]:!text-black/25 dark:[&:disabled_svg]:!text-white/25"
              >
                <SendOutlined className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧预览区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          className="h-full [&_.ant-tabs-content-holder]:flex-1 [&_.ant-tabs-content-holder]:overflow-hidden [&_.ant-tabs-content]:h-full [&_.ant-tabs-tabpane]:h-full"
          tabBarStyle={{ margin: 0, paddingLeft: 16, paddingRight: 16 }}
          items={[
            {
              key: 'preview',
              label: 'UI 预览',
              children: (
                <div className="h-full overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {currentSchema.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 min-h-[200px]">
                      <MemoizedRenderer schema={currentSchema} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                      生成完成后将在此处预览
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'json',
              label: (
                <span className="flex items-center gap-1">
                  JSON Schema
                  {currentPageSchema && (
                    <CopyOutlined
                      className="text-xs hover:text-blue-500 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleCopyJson(); }}
                    />
                  )}
                </span>
              ),
              children: (
                <div className="h-full overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {currentPageSchema ? (
                    <pre className="text-xs font-mono bg-white dark:bg-gray-800 rounded-lg p-4 overflow-auto whitespace-pre-wrap break-words">
                      {JSON.stringify(currentPageSchema, null, 2)}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                      生成完成后将在此处显示 JSON
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

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
          {message.content}
        </span>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-br-sm bg-black dark:bg-white text-white dark:text-black text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <UserOutlined className="text-xs text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2">
      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
        <RobotOutlined className="text-xs text-gray-600 dark:text-gray-300" />
      </div>
      <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-bl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm whitespace-pre-wrap break-words">
        {message.content}
      </div>
    </div>
  );
}
