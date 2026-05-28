const SITE_INFO = [
  { label: '成立時間', value: '2004 年 8 月' },
  { label: '原站站長', value: 'IYA_ZERO（易牙零式）' },
  { label: '聯絡信箱', value: 'iya_zero@yahoo.com.tw' },
  { label: '原始版本', value: '暗黑破壞神 II（經典版）1.09–1.13' },
  { label: '現行版本', value: '暗黑破壞神 II：再生（D2R）' },
];

const CONTENT_SECTIONS = [
  { icon: '⚔', title: '裝備資料庫', desc: '獨特裝備、套裝裝備、職業專屬、獨特珠寶、手工製作' },
  { icon: '🔴', title: '符文研究', desc: '符文介紹、符文字配方、寶石效果' },
  { icon: '🧙', title: '職業攻略', desc: '七大職業、數十種配點練法詳解' },
  { icon: '⚡', title: 'IAS 攻速計算', desc: '第 1、2、5 幕傭兵攻速斷點查詢' },
  { icon: '🗺', title: '遊戲機制', desc: '神殿效果、Magic Find、地表暗黑、各幕小王' },
  { icon: '🔶', title: '合成系統', desc: '方塊合成公式、符文升級、裝備升級' },
];

export default function About() {
  return (
    <div className="max-w-2xl text-sm">
      <h1 className="text-xl font-bold mb-4" style={{ color: '#808000' }}>
        關於易牙居
      </h1>

      <p className="text-gray-300 mb-4 leading-relaxed">
        易牙居是台灣最知名的暗黑破壞神 II 繁體中文攻略站，由 IYA_ZERO 於 2004 年建立，
        歷經經典版各版本更新，累積了豐富的裝備、符文、職業及遊戲機制資料。
        本站為其精神延續，資料已更新至《暗黑破壞神 II：再生》（D2R）版本。
      </p>

      <div className="mb-6 border p-3" style={{ borderColor: '#2a2a2a' }}>
        <h2 className="text-xs font-bold text-gray-400 mb-2">基本資訊</h2>
        <dl className="space-y-1">
          {SITE_INFO.map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <dt className="text-gray-500 w-24 flex-shrink-0">{label}</dt>
              <dd className="text-gray-300">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h2 className="text-sm font-bold text-gray-300 mb-3">收錄內容</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        {CONTENT_SECTIONS.map(({ icon, title, desc }) => (
          <div key={title} className="border p-2" style={{ borderColor: '#1a1a1a' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#c0a030' }}>
              {icon} {title}
            </p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-xs leading-relaxed">
        資料來源自遊戲內容及原易牙居站，僅供參考。部分資料可能因版本更新而有所差異。
      </p>
    </div>
  );
}
