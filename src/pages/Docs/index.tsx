import { useMemo, useState } from 'react';
import { Menu, Input, Button } from 'antd';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { componentCategories } from './componentCategories';
import { processDocs, DEFAULT_GUIDE_SLUG } from './lib/processDocs';
import { buildMenuItems } from './lib/buildMenuItems';
import { DocViewer } from './components/DocViewer';

// 文档不存在时的兜底页。只在 Docs 子树里被路由消费,放这里足够,不必单独抽文件。
function DocNotFound({ fallbackPath }: { fallbackPath: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const requested = location.pathname.replace('/docs', '') || '/';

  return (
    <div className="max-w-[860px] mx-auto py-20 px-6 text-center">
      <div className="text-[80px] leading-none font-extrabold text-gray-200 dark:text-gray-700 select-none">
        404
      </div>
      <h1 className="text-[24px] font-bold mt-4 mb-3 text-gray-900 dark:text-white">
        文档不存在
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        没有找到 <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-pink-600 dark:text-pink-400">/docs{requested}</code> 这份文档。
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">
        没找到的文档就是没写,写了的文档就能找到,所以找不到的多半就是没写的。
      </p>
      <Button
        type="primary"
        shape="round"
        onClick={() => navigate(`/docs${fallbackPath}`)}
        style={{ backgroundColor: '#0066cc', borderColor: '#0066cc' }}
      >
        返回文档首页
      </Button>
    </div>
  );
}

export default function Docs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { guideItems, componentDocs, routes } = useMemo(() => processDocs(), []);

  const menuItems = useMemo(
    () => buildMenuItems(guideItems, componentDocs, searchQuery),
    [guideItems, componentDocs, searchQuery],
  );

  const defaultPath =
    guideItems.find((g) => g.key === `/${DEFAULT_GUIDE_SLUG}`)?.key
    ?? guideItems[0]?.key
    ?? '';
  const currentPath = location.pathname.replace('/docs', '');
  const selectedKeys = [currentPath === '' || currentPath === '/' ? defaultPath : currentPath];

  const defaultOpenKeys = componentCategories.map((c) => c.key);

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#121212] overflow-hidden pt-16">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto bg-white dark:bg-[#121212] flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <Input
            placeholder="搜索组件..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg"
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          className="flex-1 border-r-0 py-2 !bg-transparent dark:!text-gray-300"
          items={menuItems}
          onClick={({ key }) => navigate(`/docs${key}`)}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-[#121212]">
        <div className="min-h-[280px]">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<DocViewer content={route.content} />}
              />
            ))}
            <Route path="/" element={<Navigate to={`/docs${defaultPath}`} replace />} />
            <Route path="*" element={<DocNotFound fallbackPath={defaultPath} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
