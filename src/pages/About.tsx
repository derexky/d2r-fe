export default function About() {
  return (
    <div className="max-w-2xl prose prose-invert text-sm leading-relaxed">
      <h1 className="text-xl font-bold mb-4" style={{ color: '#808000' }}>
        關於易牙居
      </h1>
      <p className="text-gray-300 mb-3">
        易牙居是一個專為《暗黑破壞神 II：再生》（Diablo II: Resurrected）玩家建立的中文資料庫。
      </p>
      <p className="text-gray-300 mb-3">
        網站收錄了獨特裝備、套裝裝備、符文字、職業攻略及傭兵攻速計算等完整資料，提供玩家查詢與參考。
      </p>
      <p className="text-gray-400 text-xs mt-8">
        © 易牙居 · 資料來源自遊戲內容，僅供參考。
      </p>
    </div>
  );
}
