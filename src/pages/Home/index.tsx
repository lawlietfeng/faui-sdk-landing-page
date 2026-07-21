import { useNavigate } from 'react-router-dom';
import { RobotOutlined, BookOutlined, GithubOutlined, FormOutlined, SafetyCertificateOutlined, AppstoreOutlined } from '@ant-design/icons';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative w-full h-full bg-[var(--bg-color)]">
      {/* Immersive Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <main className="flex-auto relative px-6 md:px-12 lg:px-24 pt-16">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-[200px] left-[10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[20%] -right-[10%] w-[800px] h-[800px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto pt-[140px] pb-[100px] text-center flex flex-col items-center gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md mb-4">
            <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide">FAUI 2.0 is now available</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold m-0 leading-[1.1] tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
            Fantasy Agent UI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-[720px] leading-relaxed m-0 font-light mt-2">
            基于自然语言，一键生成企业级表单。从请假申请到复杂的数据采集，AI 帮你搞定。
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
              href="https://github.com/lawlietfeng/faui-landing-page"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-full bg-white/50 dark:bg-black/50 !text-gray-700 dark:!text-gray-200 border border-black/10 dark:border-white/10 backdrop-blur-md hover:bg-gray-50 dark:hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300 no-underline"
            >
              <GithubOutlined className="text-lg transition-transform group-hover:scale-110" />
              GitHub
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-[1200px] mx-auto py-16 pb-[120px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FormOutlined className="text-2xl text-gray-900 dark:text-white" />,
                title: 'AI 表单生成',
                desc: '描述你的需求，自动生成带校验、数据绑定的完整表单。从登录注册到复杂申请表，一句话搞定。'
              },
              {
                icon: <SafetyCertificateOutlined className="text-2xl text-gray-900 dark:text-white" />,
                title: '内置校验体系',
                desc: '必填、类型、正则、长度等校验规则开箱即用。自动阻断不合规提交，确保数据质量。'
              },
              {
                icon: <AppstoreOutlined className="text-2xl text-gray-900 dark:text-white" />,
                title: '22+ 表单组件',
                desc: '输入框、选择器、级联、穿梭框、上传……覆盖所有数据采集场景，每个组件都经过企业级打磨。'
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group relative p-8 rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed m-0 font-light text-base">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Details Section */}
        <section className="max-w-[1200px] mx-auto py-16 pb-[120px] relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">为什么选择 FAUI 表单？</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-[600px] mx-auto font-light leading-relaxed">
              告别手写表单的繁琐。用 AI 描述需求，FAUI 帮你生成、校验、提交，一步到位。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: '01',
                title: '表单开箱即用',
                desc: '无需手写校验逻辑、数据绑定代码。FAUI 提供了完整的表单体系 —— 从输入到校验到提交，一条 JSON 搞定。'
              },
              {
                num: '02',
                title: 'AI 原生表单引擎',
                desc: '为 LLM 生成而设计。高度结构化的 JSON Schema 让大模型可以精准生成复杂表单，一次成功率极高。'
              },
              {
                num: '03',
                title: '自动数据双向绑定',
                desc: '内置 Fallback 回写机制，配置 value path 即自动实现双向绑定。无需手动 onChange，减少 80% 的样板代码。'
              },
              {
                num: '04',
                title: '企业级校验能力',
                desc: '必填、正则、长度、自定义规则全覆盖。校验不通过自动阻断提交，确保每一条数据的合规性。'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="group p-10 rounded-[2.5rem] bg-gray-50/50 dark:bg-[#111] border border-black/5 dark:border-white/5 transition-colors hover:bg-gray-100/50 dark:hover:bg-[#151515]"
              >
                <div className="text-sm font-bold text-gray-300 dark:text-gray-600 mb-6 tracking-widest">{item.num}</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-light m-0">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center bg-transparent text-gray-400 dark:text-gray-600 py-10 border-t border-black/5 dark:border-white/5 text-sm shrink-0 relative z-10 font-light">
        <p className="m-0">© {new Date().toISOString().slice(0, 4)} FAUI 团队. 追求像素级的完美与清晰的视觉层级.</p>
      </footer>
    </div>
  );
}
