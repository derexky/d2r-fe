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
import WeaponSpeed from './pages/ias/WeaponSpeed';
import About from './pages/About';
import RuneList from './pages/runes/RuneList';
import GemList from './pages/gems/GemList';
import CubeRecipes from './pages/cube/CubeRecipes';
import JewelList from './pages/items/JewelList';
import CraftedItems from './pages/items/CraftedItems';
import ShrineList from './pages/shrines/ShrineList';
import MagicFind from './pages/mechanics/MagicFind';
import DiabloClone from './pages/mechanics/DiabloClone';
import KingsList from './pages/mechanics/KingsList';
import Breakpoints from './pages/mechanics/Breakpoints';
import AreaLevels from './pages/mechanics/AreaLevels';
import Formulas from './pages/mechanics/Formulas';
import SuperBoss from './pages/mechanics/SuperBoss';
import AffixList from './pages/magic/AffixList';
import CharmAffixes from './pages/magic/CharmAffixes';
import RareNames from './pages/magic/RareNames';

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
          <Route path="items/jewels" element={<JewelList />} />
          <Route path="items/crafted" element={<CraftedItems />} />
          <Route path="runes" element={<RuneList />} />
          <Route path="gems" element={<GemList />} />
          <Route path="cube" element={<CubeRecipes />} />
          <Route path="shrines" element={<ShrineList />} />
          <Route path="magic-find" element={<MagicFind />} />
          <Route path="diablo-clone" element={<DiabloClone />} />
          <Route path="kings" element={<KingsList />} />
          <Route path="breakpoints" element={<Breakpoints />} />
          <Route path="area-levels" element={<AreaLevels />} />
          <Route path="formulas" element={<Formulas />} />
          <Route path="super-boss" element={<SuperBoss />} />
          <Route path="magic/affixes" element={<AffixList />} />
          <Route path="magic/charm-affixes" element={<CharmAffixes />} />
          <Route path="magic/rare-names" element={<RareNames />} />
          <Route path="runewords" element={<RunewordList />} />
          <Route path="runewords/:slot" element={<RunewordList />} />
          <Route path="builds" element={<BuildIndex />} />
          <Route path="builds/:class" element={<BuildIndex />} />
          <Route path="builds/:class/:id" element={<BuildDetail />} />
          <Route path="ias" element={<IasIndex />} />
          <Route path="ias/weapons" element={<WeaponSpeed />} />
          <Route path="ias/:merc" element={<IasCalculator />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
