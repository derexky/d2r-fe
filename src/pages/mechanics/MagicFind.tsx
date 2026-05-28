import { useState } from 'react';

const MF_TABLE = [
  [50,   50,  46,  45,  41],
  [100, 100,  85,  83,  71],
  [150, 150, 120, 115,  93],
  [200, 200, 150, 142, 111],
  [250, 250, 176, 166, 125],
  [300, 300, 200, 187, 136],
  [350, 350, 221, 205, 145],
  [400, 400, 240, 222, 153],
  [450, 450, 257, 236, 160],
  [500, 500, 272, 250, 166],
  [550, 550, 286, 261, 171],
  [600, 600, 300, 272, 176],
  [650, 650, 312, 282, 180],
  [700, 700, 323, 291, 184],
  [750, 750, 333, 300, 187],
  [800, 800, 342, 307, 190],
  [850, 850, 351, 314, 193],
  [900, 900, 360, 321, 195],
  [950, 950, 367, 327, 197],
  [1000, 1000, 375, 333, 200],
  [1050, 1050, 381, 338, 201],
  [1087, 1087, 386, 342, 203],
];

export default function MagicFind() {
  const [mf, setMf] = useState('');

  const mfVal = parseInt(mf) || 0;
  const effRare   = mfVal > 0 ? Math.floor(mfVal * 600 / (mfVal + 600)) : null;
  const effSet    = mfVal > 0 ? Math.floor(mfVal * 500 / (mfVal + 500)) : null;
  const effUnique = mfVal > 0 ? Math.floor(mfVal * 250 / (mfVal + 250)) : null;

  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#cc66ff' }}>
        Magic Find 說明
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        MF（更佳的取得魔法物品機率）對不同品質物品有不同的有效值計算方式。
        魔法物品為線性，稀有/套裝/獨特物品有遞減效果。
      </p>

      <div className="mb-6 p-4 border max-w-md" style={{ borderColor: '#333' }}>
        <h2 className="text-sm font-bold mb-3 text-gray-300">計算有效 MF</h2>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400 text-sm">MF：</span>
          <input
            type="number"
            value={mf}
            onChange={(e) => setMf(e.target.value)}
            className="w-24 px-2 py-1 text-sm bg-transparent border text-white"
            style={{ borderColor: '#444' }}
            placeholder="輸入MF"
            min={0}
          />
          <span className="text-gray-500 text-sm">%</span>
        </div>
        {mfVal > 0 && (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#6784ed' }}>魔法物品</span>
              <span className="text-white">+{mfVal}%</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#ffff00' }}>稀有物品</span>
              <span className="text-white">+{effRare}%</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#00c400' }}>套裝物品</span>
              <span className="text-white">+{effSet}%</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#808000' }}>獨特物品</span>
              <span className="text-white">+{effUnique}%</span>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-sm font-bold mb-2 text-gray-300">MF 對照表</h2>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th className="py-2 px-3 text-left font-normal" style={{ color: '#00ffff' }}>MF 值</th>
              <th className="py-2 px-3 text-center font-normal" style={{ color: '#6784ed' }}>魔法</th>
              <th className="py-2 px-3 text-center font-normal" style={{ color: '#ffff00' }}>稀有</th>
              <th className="py-2 px-3 text-center font-normal" style={{ color: '#00c400' }}>套裝</th>
              <th className="py-2 px-3 text-center font-normal" style={{ color: '#808000' }}>獨特</th>
            </tr>
          </thead>
          <tbody>
            {MF_TABLE.map(([mfv, magic, rare, set, unique], i) => (
              <tr
                key={mfv}
                style={{ backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent', borderBottom: '1px solid #1a1a1a' }}
              >
                <td className="py-1 px-3" style={{ color: '#00ffff' }}>{mfv}</td>
                <td className="py-1 px-3 text-center" style={{ color: '#6784ed' }}>{magic}</td>
                <td className="py-1 px-3 text-center" style={{ color: '#ffff00' }}>{rare}</td>
                <td className="py-1 px-3 text-center" style={{ color: '#00c400' }}>{set}</td>
                <td className="py-1 px-3 text-center" style={{ color: '#808000' }}>{unique}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        公式：稀有 = MF×600÷(MF+600)　套裝 = MF×500÷(MF+500)　獨特 = MF×250÷(MF+250)
      </p>
    </div>
  );
}
