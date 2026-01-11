"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plane, Calendar, Wallet, RefreshCw, Map as MapIcon, Book, ListChecks, Sun, Cloud, CloudRain } from 'lucide-react';
import { colors, itineraryData as initialItinerary, prepList, defaultExchangeRate, initialFixedExpenses, ItineraryDay, Expense } from './data/itinerary';
import { SpotCard, DetailModal, DailyRouteMap } from './components/TravelComponents';

export default function UltimateOsakaApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary');
  
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(initialItinerary);
  const [fixedExpenses, setFixedExpenses] = useState<Expense[]>(initialFixedExpenses);
  const [exchangeRate, setExchangeRate] = useState(defaultExchangeRate);
  const [jpyInput, setJpyInput] = useState<string>("1000");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
        const data = await res.json();
        if (data && data.rates && data.rates.TWD) setExchangeRate(data.rates.TWD);
      } catch (e) { console.error("Rate fetch failed"); }
    };
    fetchRate();
  }, []);

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];

  // 1. 計算單日預算 (TWD 與 JPY 分開)
  const dayBudget = useMemo(() => {
    let jpy = 0, twd = 0;
    currentDayData.spots.forEach(spot => {
      spot.expenses.forEach(exp => {
        if (exp.currency === 'JPY') jpy += exp.amount;
        else twd += exp.amount;
      });
    });
    return { jpy, twd };
  }, [currentDayData]);

  // 2. 產生詳細支出清單 (包含固定支出 + 所有行程細項)
  const allExpensesList = useMemo(() => {
    let list: Array<Expense & { source: string }> = [];
    
    // 固定支出
    fixedExpenses.forEach(e => list.push({ ...e, source: '固定' }));
    
    // 行程支出
    itinerary.forEach(day => {
      day.spots.forEach(spot => {
        spot.expenses.forEach(exp => {
          list.push({ ...exp, source: `Day ${day.day} - ${spot.title}` });
        });
      });
    });
    return list;
  }, [itinerary, fixedExpenses]);

  // 3. 計算總預算 (TWD 與 JPY 分開)
  const totalBudget = useMemo(() => {
    let jpy = 0, twd = 0;
    allExpensesList.forEach(e => {
      if (e.currency === 'JPY') jpy += e.amount;
      else twd += e.amount;
    });
    return { jpy, twd };
  }, [allExpensesList]);

  const handleUpdateExpenses = (spotId: string, newExpenses: Expense[]) => {
    setItinerary(prev => prev.map(day => ({
      ...day,
      spots: day.spots.map(spot => 
        spot.id === spotId ? { ...spot, expenses: newExpenses } : spot
      )
    })));
    // 如果當前 Modal 開著，也更新它以避免狀態不同步
    setSelectedSpot((prev: any) => prev ? { ...prev, expenses: newExpenses } : null);
  };

  const handleNavigation = (mode: 'route' | 'spot') => {
    if (!selectedSpot) return;
    const url = mode === 'spot' 
      ? selectedSpot.mapUrl 
      : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(selectedSpot.prevSpotName)}&destination=${encodeURIComponent(selectedSpot.title)}&travelmode=transit`;
    window.open(url, '_blank');
  };

  const formatVal = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute animate-petal-fall" style={{ left: `${Math.random()*100}%`, top: `-5%`, animationDelay: `${i*1.5}s`, opacity: 0.4 }}>
            <div className="w-2 h-3 bg-pink-200 rounded-full rotate-[15deg]"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <header className="p-8 pb-4 text-center sticky top-0 bg-[#F7F3F2]/80 backdrop-blur-md z-40">
          <div className="flex justify-between items-center mb-6">
            <Plane size={18} style={{ color: colors.accent }} />
            <h1 className="text-xl font-light tracking-[0.4em] uppercase">Kyoto Osaka</h1>
            <div className="text-[10px] font-mono opacity-40">1 JPY ≈ {exchangeRate.toFixed(3)} TWD</div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {itinerary.map(d => (
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
                <img src={currentDayData.image} className="w-full h-full object-cover" alt="View" onError={(e:any)=>e.target.src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white w-full pr-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase">{currentDayData.date}</span>
                      <h2 className="text-2xl font-light tracking-widest">{currentDayData.area}</h2>
                    </div>
                    {/* 天氣與當日預算 */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 bg-black/20 p-2 rounded-xl backdrop-blur-md">
                         <Sun size={14} className="text-yellow-400"/>
                         <span className="text-xs font-bold">{currentDayData.weather.temp}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex flex-col items-end">
                         <span className="text-[8px] font-light opacity-80 uppercase tracking-wider">Day Est.</span>
                         <span className="text-[10px] font-mono">¥{formatVal(dayBudget.jpy)}</span>
                         <span className="text-[10px] font-mono">NT${formatVal(dayBudget.twd)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 p-6 rounded-[2.5rem] mb-10 border border-white/50 backdrop-blur-sm">
                <p className="text-[11px] leading-loose font-light italic opacity-70">
                  <span className="font-bold mr-2 text-[10px]" style={{ color: colors.accent }}>GUIDE :</span>
                  {currentDayData.guideStory}
                </p>
              </div>

              <div className="space-y-8">
                {currentDayData.spots.map((spot, i) => (
                  <SpotCard key={i} spot={spot} colors={colors} onClick={setSelectedSpot} exchangeRate={exchangeRate} />
                ))}
              </div>
            </main>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Route</h2>
            <DailyRouteMap dayData={currentDayData} colors={colors} />
          </div>
        )}

        {/* Wallet Tab - 詳細清單 */}
        {activeTab === 'wallet' && (
          <div className="p-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-8 uppercase">Expenses</h2>
             
             {/* 總預算卡片 */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl text-center border border-pink-50 mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Total Estimated</span>
                <div className="flex justify-center gap-6 mt-4">
                   <div className="text-right">
                      <div className="text-[10px] text-slate-400">JPY</div>
                      <div className="text-2xl font-light tracking-tighter">¥{formatVal(totalBudget.jpy)}</div>
                   </div>
                   <div className="w-[1px] bg-slate-100"></div>
                   <div className="text-left">
                      <div className="text-[10px] text-slate-400">TWD</div>
                      <div className="text-2xl font-light tracking-tighter">NT${formatVal(totalBudget.twd)}</div>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                   Total ≈ NT${formatVal(totalBudget.twd + (totalBudget.jpy * exchangeRate))}
                </div>
             </div>

             {/* 細項清單 */}
             <div className="space-y-3 pb-24">
               {allExpensesList.map((item, idx) => (
                 <div key={idx} className="bg-white/60 p-4 rounded-[1.5rem] flex justify-between items-center border border-white">
                    <div className="flex flex-col gap-1 w-2/3">
                       <span className="text-[10px] opacity-40 uppercase tracking-wider">{item.source}</span>
                       <span className="text-xs font-medium text-slate-700 truncate">{item.item}</span>
                       <div className="flex gap-2 mt-1">
                         <span className={`text-[9px] px-2 py-0.5 rounded-full ${item.payer === 'Me' ? 'bg-blue-50 text-blue-400' : 'bg-orange-50 text-orange-400'}`}>
                           {item.payer}
                         </span>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-bold text-slate-600">
                         {item.currency === 'TWD' ? 'NT$' : '¥'} {formatVal(item.amount)}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Currency & Prep Tabs (Simplified for length) */}
        {activeTab === 'currency' && (
          <div className="p-10 text-center"><h2 className="text-2xl font-light mb-8">Exchange</h2><p className="opacity-50">1 JPY = {exchangeRate} TWD</p></div>
        )}
        {activeTab === 'prep' && (
          <div className="p-10 text-center"><h2 className="text-2xl font-light mb-8">Checklist</h2><div className="text-left space-y-4">{prepList.map((l,i)=><div key={i} className="bg-white p-6 rounded-3xl"><h3 className="text-xs font-bold mb-2">{l.title}</h3><p className="text-xs opacity-60">{l.items.join(', ')}</p></div>)}</div></div>
        )}
      </div>

      {selectedSpot && (
        <DetailModal 
          spot={selectedSpot} 
          colors={colors} 
          onClose={() => setSelectedSpot(null)} 
          onNav={handleNavigation} 
          onUpdateExpenses={handleUpdateExpenses}
          exchangeRate={exchangeRate}
        />
      )}

      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-[50]">
        {[
          { id: 'diary', icon: Book, label: 'Diary' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
          { id: 'currency', icon: RefreshCw, label: 'Exch.' },
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