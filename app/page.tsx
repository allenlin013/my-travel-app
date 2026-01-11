"use client";

import React, { useState } from 'react';
import { MapPin, Utensils, Info, ShoppingBag, ChevronRight, Calendar } from 'lucide-react';

export default function TravelTemplate() {
  const [activeDay, setActiveDay] = useState(1);

  const days = [1, 2, 3, 4, 5];
  
  const itineraryData = [
    { 
      time: "09:30", 
      title: "淺草寺 (Senso-ji)", 
      desc: "東京都內最古老的寺廟，必拍雷門大燈籠。",
      tags: ["文化", "必去"],
      color: "bg-red-500"
    },
    { 
      time: "12:00", 
      title: "仲見世通商店街", 
      desc: "買人形燒跟特色伴手禮的好地方。",
      tags: ["購物", "美食"],
      color: "bg-orange-500"
    },
    { 
      time: "14:30", 
      title: "晴空塔 (Skytree)", 
      desc: "俯瞰整個東京市區，建議黃昏前到達。",
      tags: ["地標", "景觀"],
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-900">
      {/* 頂部導航 - 磨砂玻璃效果 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 p-5">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tight">東京自由行</h1>
            <p className="text-slate-500 text-xs font-medium mt-1 flex items-center gap-1">
              <Calendar size={12} /> 2026.01.11 - 01.15
            </p>
          </div>
          <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
            5 Days
          </div>
        </div>

        {/* 天數選擇器 */}
        <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
                activeDay === day 
                ? "bg-slate-900 text-white shadow-lg scale-110" 
                : "bg-white text-slate-400 border border-slate-200"
              }`}
            >
              <span className="text-[10px] uppercase font-bold">Day</span>
              <span className="text-lg font-black leading-none">{day}</span>
            </button>
          ))}
        </div>
      </header>

      {/* 行程列表 */}
      <div className="p-5 space-y-8 relative">
        {/* 貫穿全場的時序線 */}
        <div className="absolute left-[27px] top-10 bottom-10 w-0.5 bg-slate-200 z-0"></div>

        {itineraryData.map((item, index) => (
          <div key={index} className="relative z-10 flex gap-4">
            {/* 時序圓點 */}
            <div className={`w-4 h-4 rounded-full mt-1.5 ring-4 ring-slate-50 ${item.color} shrink-0`}></div>
            
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-400 font-mono tracking-tighter italic">
                {item.time}
              </span>
              
              <div className="mt-2 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    {item.title}
                  </h3>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
                
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>

                {/* 標籤 */}
                <div className="flex gap-2 mt-4">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 rounded-md font-bold uppercase tracking-wider">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 互動按鈕群 */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-50">
                  <button className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-slate-50">
                    <MapPin size={18} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-600">導航</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-slate-50">
                    <Utensils size={18} className="text-orange-500" />
                    <span className="text-[10px] font-bold text-slate-600">美食</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-slate-50">
                    <ShoppingBag size={18} className="text-pink-500" />
                    <span className="text-[10px] font-bold text-slate-600">購物</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部功能導航 (iPhone 專屬風格) */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-lg rounded-[2.5rem] p-3 shadow-2xl z-20">
        <div className="flex justify-around items-center">
          <button className="p-3 bg-white/10 rounded-2xl text-white">
            <Calendar size={22} />
          </button>
          <button className="p-3 text-slate-400">
            <MapPin size={22} />
          </button>
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
            <Info size={24} />
          </div>
          <button className="p-3 text-slate-400">
            <Utensils size={22} />
          </button>
          <button className="p-3 text-slate-400">
            <ShoppingBag size={22} />
          </button>
        </div>
      </footer>
    </div>
  );
}