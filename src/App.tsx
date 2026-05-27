import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import UniqueIndex from './pages/items/UniqueIndex';
import UniqueList from './pages/items/UniqueList';
import SetIndex from './pages/items/SetIndex';
import SetDetail from './pages/items/SetDetail';
import ClassItems from './pages/items/ClassItems';
import RunewordList from './pages/runewords/RunewordList';
import BuildIndex from './pages/builds/BuildIndex';
import BuildDetail from './pages/builds/BuildDetail';
import IasIndex from './pages/ias/IasIndex';
import IasCalculator from './pages/ias/IasCalculator';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="items/unique" element={<UniqueIndex />} />
          <Route path="items/unique/:category" element={<UniqueList />} />
          <Route path="items/sets" element={<SetIndex />} />
          <Route path="items/sets/:id" element={<SetDetail />} />
          <Route path="items/class" element={<Navigate to="/items/class/barbarian" replace />} />
          <Route path="items/class/:class" element={<ClassItems />} />
          <Route path="runewords" element={<RunewordList />} />
          <Route path="runewords/:slot" element={<RunewordList />} />
          <Route path="builds" element={<BuildIndex />} />
          <Route path="builds/:class" element={<BuildIndex />} />
          <Route path="builds/:class/:id" element={<BuildDetail />} />
          <Route path="ias" element={<IasIndex />} />
          <Route path="ias/:merc" element={<IasCalculator />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
