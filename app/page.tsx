"use client";

import React, { useState } from 'react';
import { MapPin, Utensils, Info, ShoppingBag, ChevronDown, X, Plane, Calendar, Map as MapIcon, Book } from 'lucide-react';

const colors = {
  bg: "#F2EFE9",        
  card: "#FFFFFF",
  accent: "#A7B49E",    
  text: "#5D5D5A",      
  sub: "#9A9A92",       
  highlight: "#D8C4B6",
  plane: "#B8C5D6"      // 莫蘭迪藍 (用於交通)
};

export default function OsakaTravelApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary'); // 'diary' or 'guide'

  const itineraryData = [
    {
      day: 1,
      date: "04.11 (Sat)",
      area: "神戶 / 難波",
      spots: [
        { time: "10:30", title: "抵達神戶機場 (UKB)", desc: "搭乘星宇航空 JX 834 抵達。", details: "抵達後建議搭乘『神戶高速船』前往關西地區，體驗海上風景。", mapUrl: "https://www.google.com/maps/search/神戶機場", tag: "Transport" },
        { time: "14:00", title: "心齋橋筋商店街", desc: "飯店 Check-in 後的首站購物。", details: "美容藥妝一級戰區，包含大國藥妝、松本清等。這裡建築風格極具特色。", mapUrl: "https://www.google.com/maps/search/心齋橋筋", food: "本家章魚燒", shopping: "大國藥妝、Disney Store", tag: "Shopping" }
      ]
    },
    {
      day: 2,
      date: "04.12 (Sun)",
      area: "京都古都區",
      spots: [
        { time: "10:00", title: "清水寺", desc: "世界文化遺產，櫻花季後的綠意也很美。", details: "沿著二寧坂、產寧坂漫步，風景非常適合拍美學穿搭照。", mapUrl: "https://www.google.com/maps/search/清水寺", food: "藤菜美醬油丸子", tag: "Culture" },
        { time: "15:00", title: "祇園・花見小路", desc: "感受京都傳統藝伎氛圍。", details: "此處街道保存完整，適合尋找精緻的京都抹茶甜點。", mapUrl: "https://www.google.com/maps/search/祇園花見小路", food: "辻利抹茶", tag: "Walking" }
      ]
    },
    {
      day: 3,
      date: "04.13 (Mon)",
      area: "環球影城區",
      spots: [
        { time: "08:30", title: "日本環球影城 (USJ)", desc: "全日奇幻冒險。", details: "優先前往任天堂世界與哈利波特園區。櫻花限定商品可能還有剩餘。", mapUrl: "https://www.google.com/maps/search/日本環球影城", food: "奇諾比奧咖啡店", shopping: "馬力歐周邊", tag: "Park" }
      ]
    },
    {
      day: 4,
      date: "04.14 (Tue)",
      area: "奈良公園區",
      spots: [
        { time: "10:00", title: "奈良公園 / 東大寺", desc: "與神鹿互動。", details: "奈良的鹿非常熱情，東大寺大佛殿壯觀非凡。", mapUrl: "https://www.google.com/maps/search/奈良公園", food: "志津香釜飯", tag: "Nature" }
      ]
    },
    {
      day: 5,
      date: "04.15 (Wed)",
      area: "大阪城歷史區",
      spots: [
        { time: "10:30", title: "大阪城公園", desc: "登上天守閣俯瞰大阪。", details: "護城河兩岸綠意盎然，是莫蘭迪色調拍照的絕佳背景。", mapUrl: "https://www.google.com/maps/search/大阪城天守閣", food: "大阪城內抹茶冰淇淋", tag: "History" }
      ]
    }
    // ... 其餘天數可以此類推擴充
  ];

  const currentDayData = itineraryData.find(d => d.day === activeDay);

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* 頂部導航 */}
      <header className="p-8 pb-4 text-center sticky top-0 bg-[#F2EFE9]/90 backdrop-blur-md z-40">
        <div className="flex justify-between items-center mb-4 px-2">
          <Plane size={18} style={{ color: colors.plane }} />
          <h1 className="text-2xl font-light tracking-[0.2em]">OSAKA</h1>
          <Calendar size={18} style={{ color: colors.accent }} />
        </div>
        <div className="h-[1px] w-8 bg-slate-300 mx-auto mb-4"></div>
        
        {/* 天數滑動條 */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {itineraryData.map((item) => (
            <button
              key={item.day}
              onClick={() => setActiveDay(item.day)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-[10px] tracking-widest transition-all duration-300 ${
                activeDay === item.day ? "shadow-md" : "opacity-40 grayscale"
              }`}
              style={{ 
                backgroundColor: activeDay === item.day ? colors.accent : "white",
                color: activeDay === item.day ? "white" : colors.text
              }}
            >
              DAY {item.day}
            </button>
          ))}
        </div>
      </header>

      {/* 頁面內容切換 */}
      {activeTab === 'diary' ? (
        <div className="px-6 mt-4">
          <div className="mb-8 flex items-end gap-2 px-2">
            <span className="text-3xl font-light italic" style={{ color: colors.accent }}>{currentDayData?.date.split(' ')[0]}</span>
            <span className="text-[10px] mb-1 tracking-widest opacity-60">{currentDayData?.area}</span>
          </div>

          <div className="space-y-6">
            {currentDayData?.spots.map((spot, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100/50" onClick={() => setSelectedSpot(spot)}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.sub }}>{spot.time}</span>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-50">{spot.tag}</span>
                </div>
                <h3 className="text-lg font-normal mb-2 tracking-tight">{spot.title}</h3>
                <p className="text-xs font-light leading-relaxed opacity-70">{spot.desc}</p>
                <div className="mt-6 flex gap-4">
                   <div className="w-8 h-[1px] bg-slate-200 self-center"></div>
                   <span className="text-[10px] tracking-[0.2em] opacity-40 uppercase">Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] opacity-40">
           <MapIcon size={48} className="mb-4" />
           <p className="text-xs tracking-widest">地圖探索功能開發中...</p>
        </div>
      )}

      {/* 景點細節彈窗 (Modal) */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-light tracking-tight">{selectedSpot.title}</h2>
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-50 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6 mb-10 overflow-y-auto max-h-[50vh] pr-2">
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: colors.accent }}>About</h4>
                <p className="text-sm font-light leading-relaxed">{selectedSpot.details}</p>
              </section>
              {selectedSpot.food && (
                <section className="bg-[#FAF9F6] p-5 rounded-[2rem]">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: colors.highlight }}>Selection</h4>
                  <p className="text-sm font-light">{selectedSpot.food}</p>
                </section>
              )}
            </div>
            <button 
              onClick={() => window.open(selectedSpot.mapUrl, '_blank')}
              className="w-full py-5 rounded-full text-white text-[10px] tracking-[0.3em] font-light shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              GOOGLE MAPS 導航
            </button>
          </div>
        </div>
      )}

      {/* 底部導航欄 - 增加真實互動 */}
      <footer className="fixed bottom-0 w-full bg-[#F2EFE9]/80 backdrop-blur-lg border-t border-white/20 p-8 flex justify-around items-center z-40">
        <button 
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'guide' ? "scale-110" : "opacity-30"}`}
        >
          <MapIcon size={22} style={{ color: colors.text }} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Guide</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('diary')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'diary' ? "scale-110" : "opacity-30"}`}
        >
          <Book size={22} style={{ color: colors.accent }} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Diary</span>
        </button>
      </footer>
    </div>
  );
}