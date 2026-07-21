import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from './useTheme';

export default function GlobalLayout() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/docs')) return 'docs';
    if (path.startsWith('/agent-demo')) return 'agent-demo';
    if (path.startsWith('/json-debug')) return 'json-debug';
    return null;
  };

  const activeKey = getActiveKey();

  const navItems = [
    { key: 'home', label: '首页', path: '/' },
    { key: 'docs', label: '在线文档', path: '/docs' },
    { key: 'agent-demo', label: 'Agent', path: '/agent-demo' },
    { key: 'json-debug', label: 'JSON 调试', path: '/json-debug' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <header className="fixed top-0 left-0 w-full h-14 z-[1000] flex items-center justify-between px-6 md:px-12 bg-white/50 dark:bg-black/50 backdrop-blur-2xl saturate-150 border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center mr-3 shadow-sm transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white dark:text-black">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="!m-0 font-extrabold text-xl tracking-tight text-gray-900 dark:text-white leading-none">FAUI</h1>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 tracking-wider uppercase">Fantasy Agent UI</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex gap-1 p-1 rounded-full bg-gray-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5">
            {navItems.map((item) => {
              const isActive = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 bg-transparent border-none outline-none cursor-pointer rounded-full ${
                    isActive 
                      ? 'text-gray-900 dark:text-white bg-white dark:bg-white/10 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100/80 dark:bg-white/10 border border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 cursor-pointer overflow-hidden outline-none"
            aria-label="Toggle theme"
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
              <SunOutlined className="text-lg" />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
              <MoonOutlined className="text-lg" />
            </div>
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
