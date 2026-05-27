# d2rfe 前端開發計劃

## 專案概述

將 `iya-backup` 靜態 HTM 網站轉換為現代 React SPA，透過呼叫 `d2r-service` REST API 取得資料，純頁面結構與靜態內容直接以 React 元件實作。

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Vite + React 18 + TypeScript |
| 路由 | React Router v6 |
| 資料請求 | TanStack Query（React Query）|
| 樣式 | TailwindCSS（暗色主題，黑底金字）|
| HTTP | Axios |
| 靜態資源 | `public/assets/img/`（從 iya-backup 複製）|
| API 來源 | `http://localhost:3001` (d2r-service) |

---

## 目錄結構

```
d2rfe/
├── public/
│   └── assets/
│       └── img/              ← 從 iya-backup/assets/JEPG/ 複製
├── src/
│   ├── api/                  ← Axios 呼叫封裝
│   │   ├── client.ts         ← Axios instance（baseURL: localhost:3001）
│   │   ├── items.ts
│   │   ├── sets.ts
│   │   ├── runewords.ts
│   │   ├── builds.ts
│   │   ├── ias.ts
│   │   ├── crafted.ts
│   │   └── announcements.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx  ← 左側導覽(256px) + 右側 <Outlet>（取代 frameset）
│   │   │   ├── Sidebar.tsx   ← 固定左欄
│   │   │   └── NavTree.tsx   ← 折疊樹狀選單（還原 Left.htm 結構）
│   │   └── ui/
│   │       ├── ItemCard.tsx  ← 金框獨特/綠色套裝/灰色符文組
│   │       ├── StatList.tsx  ← 青色數值/紫色變動 屬性列表
│   │       ├── RunewordRow.tsx
│   │       ├── BuildTable.tsx
│   │       └── LoadingSpinner.tsx
│   ├── pages/
│   │   ├── Home.tsx                    ← 公告欄
│   │   ├── items/
│   │   │   ├── UniqueIndex.tsx         ← 獨特裝備分類索引（取代 Unique.htm）
│   │   │   ├── UniqueList.tsx          ← 列表（?category=axes&tier=normal）
│   │   │   ├── SetIndex.tsx            ← 成套裝備索引（取代 Set0.htm）
│   │   │   ├── SetDetail.tsx           ← 套裝詳細頁
│   │   │   └── ClassItems.tsx          ← 職業專屬（baritem 等）
│   │   ├── runewords/
│   │   │   ├── RunewordIndex.tsx       ← 符文字索引（取代 RWords.htm）
│   │   │   └── RunewordList.tsx        ← 列表（?slot=weapon）
│   │   ├── builds/
│   │   │   ├── BuildIndex.tsx          ← 攻略列表（依職業分類）
│   │   │   └── BuildDetail.tsx         ← 攻略詳細（配點表+裝備+影片）
│   │   ├── ias/
│   │   │   ├── IasIndex.tsx            ← 傭兵選擇（取代 IAS.htm）
│   │   │   └── IasCalculator.tsx       ← 互動計算器
│   │   ├── crafted/
│   │   │   └── CraftedItems.tsx        ← 手工藝品（4 分類標籤）
│   │   └── static/                     ← 純靜態文章頁（HTML→JSX）
│   │       ├── About.tsx               ← IYA.htm / IYA2.htm
│   │       ├── Announcements.tsx       ← right.htm / newright.htm
│   │       ├── Download.tsx            ← download.htm
│   │       ├── People.tsx              ← iyapeople.htm / kings.htm
│   │       └── VersionHistory.tsx      ← 1.11.htm / 1.13.htm
│   ├── App.tsx               ← React Router 路由定義
│   └── main.tsx
├── tailwind.config.ts
└── package.json
```

---

## Phase 0｜專案初始化

- [ ] `npm create vite@latest . -- --template react-ts`
- [ ] 安裝依賴：`react-router-dom @tanstack/react-query axios tailwindcss`
- [ ] 設定 TailwindCSS（暗色主題：黑底 `#000000`、金字 `#808000`）
- [ ] 建立 `src/api/client.ts`（Axios baseURL: `http://localhost:3001`）
- [ ] 建立基本路由骨架（`App.tsx`）
- [ ] 驗證：`npm run dev` 啟動正常

---

## Phase 1｜Layout 元件（AppShell + Sidebar）

取代原本的 frameset 架構。

### AppShell
```tsx
// 左側固定 256px 導覽 + 右側 <Outlet>（React Router）
<div className="flex h-screen bg-black text-white">
  <Sidebar className="w-64 shrink-0" />
  <main className="flex-1 overflow-auto">
    <Outlet />
  </main>
</div>
```

### NavTree（還原 Left.htm 樹狀結構）
```
易牙居
├─ 裝備研究
│  ├─ 裝備查詢 → /items/unique
│  ├─ 獨特裝備 → /items/unique
│  ├─ 成套裝備 → /items/sets
│  ├─ 手工藝品 → /crafted
│  └─ 魔法裝備 → /magic
├─ 符文研究
│  ├─ 符文字   → /runewords
│  └─ 符文列表 → /runewords/weapon ...
├─ 職業攻略
│  ├─ 野蠻人   → /builds/barbarian
│  ├─ 亞馬遜   → /builds/amazon
│  ...
├─ IAS 計算   → /ias
└─ 關於易牙居 → /about
```

- [ ] 實作 `AppShell.tsx`
- [ ] 實作 `NavTree.tsx`（含折疊功能）
- [ ] 設定 `App.tsx` 路由（React Router）

---

## Phase 2｜資料頁面（串接 d2r-service API）

依賴 d2r-service Phase 3 完成後才能整合測試。

### 路由對應

```
/                         → Home（公告欄）
/items/unique             → UniqueIndex
/items/unique/:category   → UniqueList   （?tier=normal|exceptional|elite）
/items/sets               → SetIndex
/items/sets/:id           → SetDetail
/items/class/:class       → ClassItems
/runewords                → RunewordIndex
/runewords/:slot          → RunewordList （weapon|armor|shield|helm）
/builds                   → BuildIndex
/builds/:class/:id        → BuildDetail
/ias                      → IasIndex
/ias/:merc                → IasCalculator
/crafted                  → CraftedItems
```

### 元件顏色系統（還原原始風格）

| 物品類型 | 顏色 |
|----------|------|
| 獨特物品 | `#808000`（金色）|
| 成套裝備 | `#00C400`（綠色）|
| 符文字   | `#C0C0C0`（灰色）|
| 稀有物品 | `#FFFF00`（黃色）|
| 魔法物品 | `#6784ED`（藍紫）|
| 屬性數值 | `#00FFFF`（青色）|
| 變動屬性 | `#FF00FF`（紫色）|

- [ ] 實作 `ItemCard.tsx` + `StatList.tsx`
- [ ] 實作 `UniqueIndex.tsx` + `UniqueList.tsx`
- [ ] 實作 `SetIndex.tsx` + `SetDetail.tsx`
- [ ] 實作 `RunewordIndex.tsx` + `RunewordList.tsx`
- [ ] 實作 `BuildIndex.tsx` + `BuildDetail.tsx`
- [ ] 實作 `IasIndex.tsx` + `IasCalculator.tsx`
- [ ] 實作 `CraftedItems.tsx`

---

## Phase 3｜靜態文章頁（HTML→JSX）

以下頁面無 API，直接將 HTM 內容轉為 JSX：

| 路由 | 來源 HTM |
|------|----------|
| `/about` | IYA.htm, IYA2.htm |
| `/` (Home) | right.htm（公告欄部分靜態） |
| `/announcements` | newright.htm |
| `/download` | download.htm |
| `/people` | iyapeople.htm, kings.htm, people.htm |
| `/version` | 1.11.htm, 1.13.htm, 1.13Q1.htm |

- [ ] 實作 `About.tsx`
- [ ] 實作 `Announcements.tsx`
- [ ] 實作 `Download.tsx`
- [ ] 實作 `People.tsx`
- [ ] 實作 `VersionHistory.tsx`

---

## Phase 4｜靜態資源遷移

```bash
cp -r /Users/derekyang/iya-backup/assets/JEPG/ /Users/derekyang/d2rfe/public/assets/img/
```

- [ ] 複製圖片至 `public/assets/img/`
- [ ] 確認 API 回傳的 `image_path` 格式為 `/assets/img/xxx.gif`

---

## 進度追蹤

| Phase | 狀態 | 備註 |
|-------|------|------|
| 0 初始化 | 待開始 | 等後端 Phase 0 完成後同步進行 |
| 1 Layout | 待開始 | |
| 2 資料頁面 | 待開始 | 依賴後端 Phase 3 |
| 3 靜態頁面 | 待開始 | |
| 4 資源遷移 | 待開始 | |
