import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  DatabaseOutlined,
  GithubOutlined,
  LayoutOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const coreFeatures = [
  {
    icon: <AppstoreOutlined className="text-2xl text-gray-900 dark:text-white" />,
    title: 'Form 与 Full 双入口',
    desc: 'Form Edition 提供表单与轻量交互组件；Full Edition 在此基础上提供页面布局、数据展示、图表等完整注册表。',
  },
  {
    icon: <DatabaseOutlined className="text-2xl text-gray-900 dark:text-white" />,
    title: 'Activity Snapshot / Delta',
    desc: '使用 ACTIVITY_SNAPSHOT 描述完整页面，使用 ACTIVITY_DELTA 的 JSON Patch 增量更新数据或组件结构。',
  },
  {
    icon: <ThunderboltOutlined className="text-2xl text-gray-900 dark:text-white" />,
    title: 'Action 与外部提交',
    desc: '内置 update_data、http_proxy、message、notification 等 Action，并支持宿主控制外部校验与提交。',
  },
];

const capabilities = [
  {
    icon: <LayoutOutlined />,
    title: '响应式栅格与页面布局',
    desc: '通过 row、col、layout 等组件描述自适应页面结构。',
  },
  {
    icon: <BarChartOutlined />,
    title: 'ECharts 数据可视化',
    desc: 'Full Edition 提供 chart 组件，用 JSON 配置图表展示。',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: '组件级 Error Boundary',
    desc: '单个组件渲染异常时保留页面其余区域，并显示对应错误。',
  },
  {
    icon: <RobotOutlined />,
    title: '面向 Schema 与 Agent',
    desc: '组件、Action 和数据模型均以可校验的 JSON Schema 组织，便于生成与调试。',
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'Animation',
    desc: '基于 framer-motion 提供组件显隐、条件分支和列表变化的过渡动画。',
  },
  {
    icon: <BookOutlined />,
    title: '完整组件文档',
    desc: '站点同步本地 SDK 的指南、Action、组件与开发文档。',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative w-full h-full bg-[var(--bg-color)]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-auto relative px-6 md:px-12 lg:px-24 pt-16">
        <div className="absolute -top-[200px] left-[10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[20%] -right-[10%] w-[800px] h-[800px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] pointer-events-none z-0" />

        <section className="max-w-[1200px] mx-auto pt-[140px] pb-[100px] text-center flex flex-col items-center gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md mb-4">
            <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide">JSON Schema UI Renderer SDK</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold m-0 leading-[1.1] tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
            FAUI
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-[800px] leading-relaxed m-0 font-light mt-2">
            FAUI 是基于 React 与 Ant Design 的 JSON Schema UI 渲染 SDK，提供 Form Edition 和 Full Edition，支持表单、页面布局、数据展示、Action、动画、图表和增量更新。
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/agent-demo')}
              className="group relative flex items-center justify-center gap-2 h-14 px-8 text-base font-semibold rounded-full bg-black dark:bg-white !text-white dark:!text-black shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 outline-none border-none cursor-pointer"
            >
              <RobotOutlined className="text-lg transition-transform group-hover:scale-110" />
              体验 Agent
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="group relative flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-full bg-white/50 dark:bg-black/50 !text-gray-700 dark:!text-gray-200 border border-black/10 dark:border-white/10 backdrop-blur-md hover:bg-gray-50 dark:hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300 outline-none cursor-pointer"
            >
              <BookOutlined className="text-lg transition-transform group-hover:scale-110" />
              阅读开发文档
            </button>
            <a
              href="https://github.com/lawlietfeng/faui-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-full bg-white/50 dark:bg-black/50 !text-gray-700 dark:!text-gray-200 border border-black/10 dark:border-white/10 backdrop-blur-md hover:bg-gray-50 dark:hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300 no-underline"
            >
              <GithubOutlined className="text-lg transition-transform group-hover:scale-110" />
              SDK GitHub
            </a>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto py-16 pb-[120px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {feature.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">{feature.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed m-0 font-light text-base">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto py-16 pb-[120px] relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">从 Schema 到可交互 UI</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-[680px] mx-auto font-light leading-relaxed">
              使用本地 SDK 文档、JSON 调试页和 Agent Demo，核对组件配置、数据模型与渲染结果。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="group p-8 rounded-[2rem] bg-gray-50/50 dark:bg-[#111] border border-black/5 dark:border-white/5 transition-colors hover:bg-gray-100/50 dark:hover:bg-[#151515]"
              >
                <div className="text-2xl text-gray-700 dark:text-gray-200 mb-6">{capability.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">{capability.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-light m-0">{capability.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center bg-transparent text-gray-400 dark:text-gray-600 py-10 border-t border-black/5 dark:border-white/5 text-sm shrink-0 relative z-10 font-light">
        <p className="m-0">© {new Date().toISOString().slice(0, 4)} FAUI SDK 文档与演示站</p>
      </footer>
    </div>
  );
}
