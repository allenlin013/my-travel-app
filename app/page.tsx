"use client";

import React, { useState } from 'react';
import { Plane, Calendar, Wallet, RefreshCw, Map as MapIcon, Book, ListChecks } from 'lucide-react';
import { colors, itineraryData, prepList, exchangeRate } from './data/itinerary';
import { SpotCard, DetailModal, DailyRouteMap } from './components/TravelComponents';

export default function UltimateOsakaApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary');
  const [jpyInput, setJpyInput] = useState<string>("1000");

  const currentDayData = itineraryData.find(d => d.day === activeDay) || itineraryData[0];

  const handleNavigation = (mode: 'route' | 'spot') => {
    if (!selectedSpot) return;
    if (mode === 'spot') {
      window.open(selectedSpot.mapUrl, '_blank');
    } else {
      const origin = encodeURIComponent(selectedSpot.prevSpotName);
      const dest = encodeURIComponent(selectedSpot.title);
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=transit`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* 櫻花落下動畫 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute animate-petal-fall"
            style={{ left: `${Math.random() * 100}%`, top: `-5%`, animationDelay: `${i * 1.5}s`, opacity: 0.5 }}>
            <div className="w-3 h-4 bg-pink-200 rounded-full rotate-[15deg] shadow-sm"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header - 保持在頂部，供切換天數 */}
        <header className="p-8 pb-4 text-center sticky top-0 bg-[#F7F3F2]/80 backdrop-blur-md z-40">
          <div className="flex justify-between items-center mb-6">
            <Plane size={18} style={{ color: colors.accent }} />
            <h1 className="text-xl font-light tracking-[0.4em] uppercase">Kyoto Osaka</h1>
            <div className="w-5" />
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

        {activeTab === 'diary' && (
          <div className="animate-in fade-in duration-700">
            <main className="px-6">
              <div className="relative h-52 rounded-[3.5rem] overflow-hidden mb-8 shadow-2xl">
                <img src={currentDayData.image} className="w-full h-full object-cover" alt="Scenery" 
                     onError={(e: any) => e.target.src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-[10px] tracking-[0.2em] uppercase">{currentDayData.date}</span>
                  <h2 className="text-2xl font-light tracking-widest">{currentDayData.area}</h2>
                </div>
              </div>

              <div className="bg-white/40 p-6 rounded-[2.5rem] mb-10 border border-white/50 backdrop-blur-sm">
                <p className="text-[11px] leading-loose font-light italic opacity-70">
                  <span className="font-bold mr-2 text-[10px]" style={{ color: colors.accent }}>STORY :</span>
                  {currentDayData.guideStory}
                </p>
              </div>

              <div className="space-y-8">
                {currentDayData.spots.map((spot, i) => (
                  <SpotCard key={i} spot={spot} colors={colors} onClick={setSelectedSpot} />
                ))}
              </div>
            </main>
          </div>
        )}

        {/* Guide Tab - 現在顯示每日完整路線圖 */}
        {activeTab === 'guide' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Guide Map</h2>
            <DailyRouteMap dayData={currentDayData} colors={colors} />
          </div>
        )}

        {/* Currency Tab */}
        {activeTab === 'currency' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Exchange</h2>
            <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-pink-50">
               <div className="flex flex-col gap-10">
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 block mb-4 ml-4">Japanese Yen (JPY)</label>
                    <div className="flex items-center bg-slate-50 p-6 rounded-[2rem] border border-transparent group-focus-within:border-pink-200 transition-all">
                      <span className="text-xl font-light mr-4 opacity-40">¥</span>
                      <input type="number" value={jpyInput} onChange={(e) => setJpyInput(e.target.value)} className="bg-transparent text-2xl font-light outline-none w-full" />
                    </div>
                  </div>
                  <div className="flex justify-center"><RefreshCw size={20} className="text-pink-300 rotate-90" /></div>
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 block mb-4 ml-4">Taiwan Dollar (TWD)</label>
                    <div className="flex items-center bg-pink-50/30 p-6 rounded-[2rem] border border-pink-100">
                      <span className="text-xl font-light mr-4 opacity-40">$</span>
                      <div className="text-2xl font-light">{(Number(jpyInput) * exchangeRate).toFixed(0)}</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Prep Tab */}
        {activeTab === 'prep' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Checklist</h2>
            <div className="space-y-8">
              {prepList.map((sec, i) => (
                <div key={i} className="bg-white/60 p-8 rounded-[3.5rem] border border-white">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2" style={{ color: colors.accent }}>{sec.title}</h4>
                  <div className="grid gap-4">
                    {sec.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm font-light opacity-70">
                        <ListChecks size={16} className="text-pink-100" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedSpot && (
        <DetailModal spot={selectedSpot} colors={colors} onClose={() => setSelectedSpot(null)} onNav={handleNavigation} />
      )}

      {/* 底部導覽 */}
      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-[50]">
        {[
          { id: 'diary', icon: Book, label: 'Diary' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
          { id: 'currency', icon: RefreshCw, label: 'Exchange' },
          { id: 'guide', icon: MapIcon, label: 'Guide' },
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