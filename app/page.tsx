"use client";

import React, { useState, useMemo } from 'react';
import { 
  MapPin, Utensils, Info, ShoppingBag, ChevronDown, X, Plane, Calendar, 
  Map as MapIcon, Book, Train, Navigation2, Wallet, Plus, CheckCircle2, 
  RefreshCw, ListChecks, Sun, CloudRain, Thermometer
} from 'lucide-react';

const colors = {
  bg: "#F7F3F2",        
  card: "#FFFFFF",
  accent: "#D4A5A5",    // 莫蘭迪櫻花粉
  text: "#5D5D5A",      
  sub: "#9E9494",       
  highlight: "#E3C8C8",
};

// 格式化數字 (加逗號)
const formatNum = (num: number) => new Intl.NumberFormat('en-US').format(num);

export default function UltimatePremiumApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary'); 
  const [jpyInput, setJpyInput] = useState<string>("10000");
  
  // 實時匯率參考 (2026/01 參考值)
  const exchangeRate = 0.2001; 

  const [itineraryData] = useState([
    {
      day: 1, date: "04.11 (Sat)", area: "神戶・心齋橋", weather: "Sunny", temp: "11°C - 20°C",
      spots: [
        { time: "10:30", title: "神戶機場 (UKB)", tag: "Arrival", prevSpot: "起始點", details: "搭乘星宇航空 JX 834 抵達。海上機場景致優美，建議至展望台俯瞰大阪灣。", access: "神戶機場入境", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/search/%3Fapi%3D1%26query%3DRinku%2BPremium%2BOutlets", price: 1100 },
        { time: "15:30", title: "心齋橋筋商店街", tag: "Shopping", prevSpot: "神戶機場", details: "大阪購物核心，包含各式藥妝與潮流百貨。夜晚道頓堀跑跑人燈板必拍。", access: "搭乘高速船或利木津巴士至難波", mapUrl: "https://maps.google.com/?cid=12921712387673618451&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ7", food: "明治軒蛋包飯", price: 15000 }
      ]
    },
    {
      day: 2, date: "04.12 (Sun)", area: "京都古都", weather: "Partly Cloudy", temp: "9°C - 19°C",
      spots: [
        { time: "09:30", title: "清水寺", tag: "Culture", prevSpot: "難波飯店", details: "世界文化遺產，全木造舞台蔚為壯觀。櫻花季後半段仍有晚櫻盛開。", access: "京阪本線至清水五條", mapUrl: "https://maps.google.com/?cid=12921712387673618451&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ8", price: 500 },
        { time: "15:00", title: "花見小路", tag: "Walking", prevSpot: "清水寺", details: "藝伎出沒的古老街區，適合身著和服漫步，感受千年古都氣息。", access: "步行 15 分鐘", mapUrl: "https://maps.google.com/?cid=12921712387673618451&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ9", food: "辻利抹茶", price: 2500 }
      ]
    },
    { day: 3, date: "04.13 (Mon)", area: "日本環球影城", weather: "Sunny", temp: "10°C - 21°C", spots: [{ time: "08:30", title: "USJ", tag: "Fun", prevSpot: "難波飯店", details: "任天堂世界必衝。建議提早1小時排隊。", access: "JR 櫻島線直達", mapUrl: "https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ0", price: 28000 }] },
    { day: 4, date: "04.14 (Tue)", area: "奈良公園", weather: "Shower", temp: "9°C - 18°C", spots: [{ time: "10:00", title: "奈良公園", tag: "Nature", prevSpot: "難波飯店", details: "與神鹿互動。東大寺大佛氣勢震撼。", access: "近鐵奈良線直達", mapUrl: "https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ1", price: 4000 }] },
    { day: 5, date: "04.15 (Wed)", area: "大阪城", weather: "Sunny", temp: "11°C - 22°C", spots: [{ time: "10:30", title: "大阪城天守閣", tag: "History", prevSpot: "難波飯店", details: "大阪周遊卡必去景點，登上閣頂俯瞰整座公園。", access: "JR 環狀線大阪城公園站", mapUrl: "https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ2", price: 2000 }] },
    { day: 6, date: "04.16 (Thu)", area: "梅田區", weather: "Sunny", temp: "12°C - 23°C", spots: [{ time: "14:00", title: "梅田藍天大廈", tag: "Modern", prevSpot: "難波飯店", details: "空中庭園展望台，俯瞰大阪摩天大樓群。", access: "梅田站步行", mapUrl: "https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ3", price: 3000 }] },
    { day: 7, date: "04.17 (Fri)", area: "新世界", weather: "Partly Cloudy", temp: "13°C - 21°C", spots: [{ time: "11:00", title: "通天閣", tag: "Retro", prevSpot: "難波飯店", details: "大阪懷舊靈魂地標，溜滑梯非常刺激。", access: "惠美須町站", mapUrl: "https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ4", price: 1500 }] },
    { day: 8, date: "04.18 (Sat)", area: "歸途", weather: "Sunny", temp: "14°C - 24°C", spots: [{ time: "10:00", title: "臨空城 Outlet", tag: "Shop", prevSpot: "難波飯店", details: "回程前最後大採購。", access: "JR 關空快速", mapUrl: "https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ5", price: 50000 }] }
  ]);

  // 預算項目定義
  const budgetItems = [
    { item: "星宇航空機票", jpy: 0, twd: 12000, category: "交通" },
    { item: "大阪飯店 (7晚預估)", jpy: 85000, twd: 0, category: "住宿" },
    { item: "USJ 門票與快速通關", jpy: 28000, twd: 0, category: "娛樂" },
    { item: "交通卡 ICOCA 加值", jpy: 10000, twd: 0, category: "交通" },
    { item: "每日餐飲預算", jpy: 50000, twd: 0, category: "美食" },
  ];

  const currentDayData = itineraryData.find(d => d.day === activeDay) || itineraryData[0];

  // 導航函數
  const openNavigation = (mode: 'route' | 'spot') => {
    if (!selectedSpot) return;
    if (mode === 'spot') {
      window.open(selectedSpot.mapUrl, '_blank');
    } else {
      const origin = encodeURIComponent(selectedSpot.prevSpot);
      const destination = encodeURIComponent(selectedSpot.title);
      window.open(`https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ6{origin}&destination=${destination}&travelmode=transit`, '_blank');
    }
  };

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* 櫻花背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute animate-petal-fall"
            style={{ left: `${Math.random() * 100}%`, top: `-5%`, animationDelay: `${i * 2}s`, opacity: 0.4 }}>
            <div className="w-3 h-4 bg-pink-200 rounded-full rotate-[15deg]"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {activeTab === 'diary' && (
          <div className="animate-in fade-in duration-700">
            <header className="p-8 pb-4 sticky top-0 bg-[#F7F3F2]/80 backdrop-blur-md z-40">
              <div className="flex justify-between items-center mb-6 px-2">
                <Plane size={18} style={{ color: colors.accent }} />
                <h1 className="text-xl font-light tracking-[0.4em] uppercase italic">Osaka 2026</h1>
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-pink-100">
                   <Thermometer size={14} className="text-pink-300" />
                   <span className="text-[10px] font-bold">{currentDayData.temp}</span>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {itineraryData.map(d => (
                  <button key={d.day} onClick={() => setActiveDay(d.day)}
                    className={`flex-shrink-0 px-5 py-2 rounded-2xl text-[10px] tracking-widest transition-all ${activeDay === d.day ? "shadow-md scale-105" : "opacity-30"}`}
                    style={{ backgroundColor: activeDay === d.day ? colors.accent : "white", color: activeDay === d.day ? "white" : colors.text }}>
                    D{d.day}
                  </button>
                ))}
              </div>
            </header>

            <main className="px-6">
              <div className="bg-white/60 p-5 rounded-[2.5rem] mb-8 border border-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    {currentDayData.weather === "Sunny" ? <Sun className="text-yellow-500" /> : <CloudRain className="text-blue-400" />}
                    <div>
                       <p className="text-[10px] uppercase tracking-widest opacity-40">Today's Weather</p>
                       <p className="text-xs font-bold">{currentDayData.weather} in {currentDayData.area.split('・')[0]}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] opacity-40">{currentDayData.date}</p>
                    <p className="text-[10px] font-bold" style={{ color: colors.accent }}>#SakuraSeason</p>
                 </div>
              </div>

              <div className="space-y-6">
                {currentDayData.spots.map((spot, i) => (
                  <div key={i} className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 active:scale-[0.98] transition-all" onClick={() => setSelectedSpot(spot)}>
                    <div className="flex justify-between mb-4">
                      <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.accent }}>{spot.time}</span>
                      <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">{spot.tag}</span>
                    </div>
                    <h3 className="text-lg font-normal mb-2 tracking-tight">{spot.title}</h3>
                    <div className="flex items-center gap-2 mt-4 text-[9px] opacity-40 uppercase">
                       <Navigation2 size={12} /> <span>From: {spot.prevSpot}</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300 mx-2"></div>
                       <span>¥{formatNum(spot.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        )}

        {/* 預算統計頁面 (精細項目) */}
        {activeTab === 'wallet' && (
          <div className="p-8 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light text-center tracking-[0.4em] mb-10">BUDGET</h2>
             <div className="space-y-4">
                {budgetItems.map((bi, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 flex justify-between items-center">
                     <div>
                        <p className="text-sm font-normal">{bi.item}</p>
                        <p className="text-[9px] opacity-40 uppercase tracking-widest">{bi.category}</p>
                     </div>
                     <div className="text-right">
                        {bi.jpy > 0 && <p className="text-xs font-mono font-bold" style={{ color: colors.accent }}>¥{formatNum(bi.jpy)}</p>}
                        {bi.twd > 0 && <p className="text-xs font-mono font-bold text-slate-400">NT${formatNum(bi.twd)}</p>}
                        {bi.jpy > 0 && <p className="text-[9px] opacity-30 mt-1">≈ NT${formatNum(Math.round(bi.jpy * exchangeRate))}</p>}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* 匯率與千分位 */}
        {activeTab === 'currency' && (
          <div className="p-10 animate-in fade-in">
            <h2 className="text-2xl font-light text-center tracking-[0.4em] mb-10 uppercase">Exchange</h2>
            <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-pink-50">
               <div className="space-y-8">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] opacity-30 mb-4 block">Japanese Yen (JPY)</label>
                    <div className="flex items-center bg-slate-50 p-6 rounded-[2rem] border border-pink-100">
                      <span className="text-xl font-light mr-4 opacity-40">¥</span>
                      <input 
                        type="text" 
                        value={formatNum(Number(jpyInput.replace(/,/g, '')))} 
                        onChange={(e) => setJpyInput(e.target.value.replace(/,/g, ''))}
                        className="bg-transparent text-2xl font-mono font-light outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center text-pink-300"><RefreshCw size={24} className="rotate-90" /></div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] opacity-30 mb-4 block">Taiwan Dollar (TWD)</label>
                    <div className="bg-pink-50/30 p-6 rounded-[2rem] border border-pink-100">
                      <p className="text-2xl font-mono font-light text-pink-400">
                        NT$ {formatNum(Math.round(Number(jpyInput.replace(/,/g, '')) * exchangeRate))}
                      </p>
                    </div>
                  </div>
               </div>
               <p className="text-[9px] text-center mt-12 opacity-30 tracking-[0.2em] italic italic">Real-time Rate: 1 JPY ≈ {exchangeRate} TWD</p>
            </div>
          </div>
        )}

        {/* 分日路線圖 (Guide) */}
        {activeTab === 'guide' && (
          <div className="p-8 animate-in fade-in">
            <h2 className="text-2xl font-light text-center tracking-[0.4em] mb-10">D{activeDay} MAP</h2>
            <div className="bg-white rounded-[4rem] p-12 shadow-2xl relative border border-pink-50 min-h-[60vh] flex flex-col justify-between">
               <div className="absolute left-[38px] top-16 bottom-16 w-0.5 bg-pink-100"></div>
               <div className="space-y-16 relative">
                  {currentDayData.spots.map((s, idx) => (
                    <div key={idx} className="flex gap-6 items-center group">
                       <div className="w-8 h-8 rounded-full bg-white border-2 border-pink-200 z-10 flex items-center justify-center text-[10px] font-bold text-pink-300 group-hover:scale-125 transition-transform">
                         {idx + 1}
                       </div>
                       <div>
                          <p className="text-[10px] uppercase opacity-40 tracking-widest">{s.time}</p>
                          <p className="text-xs font-bold tracking-widest">{s.title}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button onClick={() => window.open(`https://maps.google.com/?cid=11882778332375880135&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ7{currentDayData.spots.map(s => s.title).join('/')}`, '_blank')} 
                 className="mt-12 w-full py-5 bg-slate-900 text-white rounded-full text-[10px] tracking-[0.3em] uppercase active:scale-95 transition-all shadow-lg">
                 Open Daily Route Map
               </button>
            </div>
          </div>
        )}

        {activeTab === 'prep' && (
          <div className="p-10 animate-in fade-in">
            <h2 className="text-2xl font-light text-center tracking-[0.4em] mb-10 uppercase">Checklist</h2>
            <div className="space-y-8">
              {prepList.map((sec, i) => (
                <div key={i} className="bg-white/60 p-8 rounded-[3.5rem] border border-white">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2" style={{ color: colors.accent }}>
                    <CheckCircle2 size={16}/>{sec.title}
                  </h4>
                  <div className="grid gap-4">
                    {sec.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm font-light opacity-70">
                        <div className="w-1 h-1 rounded-full bg-pink-200"></div>{item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 景點詳情 Modal (雙模式導覽) */}
      {selectedSpot && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[4.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom duration-600 overflow-y-auto max-h-[94vh]">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Heritage Discovery</span>
                <h2 className="text-2xl font-light mt-2 leading-tight">{selectedSpot.title}</h2>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-50 rounded-full text-slate-300"><X size={22} /></button>
            </div>
            
            <div className="space-y-10 pb-10">
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 text-pink-300 flex items-center gap-2"><Info size={16}/>故事與導覽</h4>
                <p className="text-sm font-light leading-loose text-slate-500 text-justify">{selectedSpot.details}</p>
              </section>

              {selectedSpot.food && (
                <section className="bg-pink-50/40 p-7 rounded-[2.5rem]">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-pink-400"><Utensils size={14}/>味蕾建議</h4>
                  <p className="text-sm font-light leading-relaxed text-slate-600 italic">「{selectedSpot.food}」</p>
                </section>
              )}

              <div className="flex flex-col gap-4 pt-6">
                <button onClick={() => openNavigation('route')} 
                  className="w-full py-5 rounded-full bg-slate-900 text-white text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                  <Navigation2 size={16} /> 啟動接續導覽 (從 {selectedSpot.prevSpot})
                </button>
                <button onClick={() => openNavigation('spot')} 
                  className="w-full py-5 rounded-full border border-slate-100 text-[10px] tracking-[0.3em] uppercase text-slate-400 active:scale-95 transition-all">
                  地點定位 (基於目前位置)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部選單 */}
      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-[50]">
        {[
          { id: 'diary', icon: Book, label: 'Diary' },
          { id: 'wallet', icon: Wallet, label: 'Budget' },
          { id: 'currency', icon: RefreshCw, label: 'Exch.' },
          { id: 'guide', icon: MapIcon, label: 'Map' },
          { id: 'prep', icon: ListChecks, label: 'Prep' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 transition-all ${activeTab === tab.id ? "scale-110 opacity-100" : "opacity-20"}`}>
            <tab.icon size={20} style={{ color: activeTab === tab.id ? colors.accent : 'inherit' }} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold">{tab.label}</span>
          </button>
        ))}
      </footer>

      <style jsx global>{`
        @keyframes petal-fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(100px) rotate(360deg); }
        }
        .animate-petal-fall { animation: petal-fall 15s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}