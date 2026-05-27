# d2r-fe

易牙居 Diablo II: Resurrected 資料庫前端，使用 React + TypeScript + Vite 建置。

## 技術棧

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios

## 頁面功能

| 路徑 | 功能 |
|------|------|
| `/` | 公告欄 |
| `/items/unique/:category` | 獨特裝備（依類型／品質篩選） |
| `/items/sets/:id` | 成套裝備詳情 |
| `/items/class/:class` | 職業專屬裝備 |
| `/runewords` | 符文字（武器／盔甲／盾牌／頭盔） |
| `/builds/:class/:id` | 職業攻略詳情 |
| `/ias/:merc` | IAS 攻速斷點計算器 |

## 開發

```bash
npm install
npm run dev
```

前端預設透過 Vite proxy 將 `/api` 請求轉發至後端 `http://localhost:3000`，請確認 `d2r-service` 已在本機啟動。

## 建置

```bash
npm run build
```

產出至 `dist/`。
