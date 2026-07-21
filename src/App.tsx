import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalLayout from './components/GlobalLayout';
import 'antd/dist/reset.css';

const Home = lazy(() => import('./pages/Home'));
const Docs = lazy(() => import('./pages/Docs'));
const AgentDemo = lazy(() => import('./pages/AgentDemo'));
const JsonDebug = lazy(() => import('./pages/JsonDebug'));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/docs/*" element={<Docs />} />
          <Route path="/agent-demo" element={<AgentDemo />} />
          <Route path="/json-debug" element={<JsonDebug />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
