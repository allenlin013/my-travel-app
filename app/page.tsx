"use client";

import React, { useState } from 'react';
import { MapPin, Utensils, Info, ShoppingBag, ChevronDown, ExternalLink, X } from 'lucide-react';

// 莫蘭迪配色定義
const colors = {
  bg: "#F2EFE9",        // 米灰色
  card: "#FFFFFF",
  accent: "#A7B49E",    // 鼠尾草綠 (莫蘭迪綠)
  text: "#5D5D5A",      // 炭灰色
  sub: "#9A9A92",       // 淺灰褐
  highlight: "#D8C4B6"  // 奶油杏 (美食/導航色)
};

export default function OsakaTravelApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  const itineraryData = [
    { 
      day: 1,
      spots: [
        {
          time: "11:30",
          title: "心齋橋筋商店街",
          desc: "大阪最著名的購物街，藥妝店與流行服飾雲集。",
          details: "這裡有大國藥妝、松本清等，還有知名精品店。建議從難波往北走，一路逛到本町。",
          mapUrl: "https://www.google.com/maps/search/心齋橋筋商店街",
          food: "必吃：本家章魚燒、PABLO起司塔",
          shopping: "推薦：大國藥妝（價格相對便宜）、Disney Store",
          tag: "Shopping"
        },
        {
          time: "18:00",
          title: "道頓堀 (Dotonbori)",
          desc: "大阪美食的心臟，必拍固力果跑跑人霓虹燈。",
          details: "夜晚的道頓堀最美，運河兩旁的餐廳林立。這裡是拍大阪地標照的絕佳地點。",
          mapUrl: "https://www.google.com/maps/search/道頓堀",
          food: "必吃：一蘭拉麵、蟹道樂、金龍拉麵",
          shopping: "推薦：唐吉訶德摩天輪店",
          tag: "Food & Photo"
        }
      ]
    },
    {
      day: 2,
      spots: [
        {
          time: "09:00",
          title: "日本環球影城 (USJ)",
          desc: "超級任天堂世界與哈利波特園區必去。",
          details: "建議提早一小時排隊入場，優先前往馬力歐園區領取整理券。",
          mapUrl: "https://www.google.com/maps/search/日本環球影城",
          food: "園區內：奇諾比奧咖啡店（造型可愛）",
          shopping: "推薦：園區限定爆米花桶、馬力歐帽子",
          tag: "Theme Park"
        }
      ]
    }
  ];

  const currentSpots = itineraryData.find(d => d.day === activeDay)?.spots || [];

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* 頂部 Header */}
      <header className="p-8 pb-4 text-center">
        <h1 className="text-3xl font-light tracking-[0.2em] mb-2">OSAKA</h1>
        <div className="h-[1px] w-12 bg-slate-400 mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-widest" style={{ color: colors.sub }}>Travel Itinerary 2026</p>
      </header>

      {/* 天數切換 - 莫蘭迪圓鈕 */}
      <div className="flex justify-center gap-6 mb-8 overflow-x-auto py-2">
        {[1, 2, 3, 4].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`transition-all duration-300 w-10 h-10 rounded-full text-xs font-light flex items-center justify-center border ${
              activeDay === d ? "scale-110 shadow-md" : "opacity-50"
            }`}
            style={{ 
              backgroundColor: activeDay === d ? colors.accent : "transparent",
              color: activeDay === d ? "#fff" : colors.text,
              borderColor: colors.accent
            }}
          >
            D{d}
          </button>
        ))}
      </div>

      {/* 行程列表 */}
      <div className="px-6 space-y-8">
        {currentSpots.map((spot, index) => (
          <div key={index} className="relative">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-[1px] h-full bg-slate-300 opacity-50"></div>
                <div className="w-2 h-2 rounded-full border border-slate-400 bg-white z-10"></div>
              </div>
              <div className="pb-4 w-full">
                <span className="text-[10px] tracking-widest font-mono italic" style={{ color: colors.sub }}>{spot.time}</span>
                <div 
                  className="mt-2 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => setSelectedSpot(spot)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-normal tracking-tight">{spot.title}</h3>
                    <ChevronDown size={14} style={{ color: colors.sub }} />
                  </div>
                  <p className="text-sm font-light leading-relaxed mb-4" style={{ color: colors.sub }}>
                    {spot.desc}
                  </p>
                  
                  {/* 功能按鈕 */}
                  <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button 
                      onClick={(e) => { e.stopPropagation(); window.open(spot.mapUrl, '_blank'); }}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-wider"
                    >
                      <MapPin size={12} style={{ color: colors.accent }} /> 導航
                    </button>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider opacity-60">
                      <Utensils size={12} /> 美食
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 景點詳細彈窗 (Modal) */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[85vh] animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase italic">Spot Highlight</span>
                <h2 className="text-2xl font-normal mt-1">{selectedSpot.title}</h2>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 mb-8 text-sm font-light leading-relaxed">
              <section>
                <h4 className="font-bold text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: colors.accent }}>
                  <Info size={14} /> 景點介紹
                </h4>
                <p style={{ color: colors.text }}>{selectedSpot.details}</p>
              </section>

              <section className="bg-slate-50 p-4 rounded-2xl">
                <h4 className="font-bold text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: colors.highlight }}>
                  <Utensils size={14} /> 美食推薦
                </h4>
                <p style={{ color: colors.text }}>{selectedSpot.food}</p>
              </section>

              <section className="bg-slate-50 p-4 rounded-2xl">
                <h4 className="font-bold text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: "#D8A7B1" }}>
                  <ShoppingBag size={14} /> 購物清單
                </h4>
                <p style={{ color: colors.text }}>{selectedSpot.shopping}</p>
              </section>
            </div>

            <button 
              onClick={() => window.open(selectedSpot.mapUrl, '_blank')}
              className="w-full py-4 rounded-full text-white text-sm tracking-widest font-light shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: colors.accent }}
            >
              開啟 GOOGLE 地圖導航
            </button>
          </div>
        </div>
      )}

      {/* 底部導航欄 */}
      <footer className="fixed bottom-0 w-full bg-white/70 backdrop-blur-md border-t border-slate-100 p-6 flex justify-around items-center">
        <div className="text-slate-400 flex flex-col items-center gap-1">
          <MapPin size={20} />
          <span className="text-[8px] uppercase tracking-widest">Guide</span>
        </div>
        <div style={{ color: colors.accent }} className="flex flex-col items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-current mb-1"></div>
          <span className="text-[8px] uppercase tracking-widest font-bold">Diary</span>
        </div>
      </footer>
    </div>
  );
}