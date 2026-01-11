"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plane, Calendar, Wallet, RefreshCw, Map as MapIcon, Book, ListChecks, Sun, Cloud, CloudRain } from 'lucide-react';
import { colors, itineraryData as initialItinerary, prepList, defaultExchangeRate, initialFixedExpenses, ItineraryDay } from './data/itinerary';
import { SpotCard, DetailModal, DailyRouteMap } from './components/TravelComponents';

export default function UltimateOsakaApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary');
  
  // 狀態管理
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(initialItinerary);
  const [fixedExpenses, setFixedExpenses] = useState(initialFixedExpenses);
  const [exchangeRate, setExchangeRate] = useState(defaultExchangeRate);
  const [jpyInput, setJpyInput] = useState<string>("1000");

  // 1. 實時匯率抓取
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
        const data = await res.json();
        if (data && data.rates && data.rates.TWD) {
          setExchangeRate(data.rates.TWD);
        }
      } catch (e) {
        console.error("Rate fetch failed, using default");
      }
    };
    fetchRate();
  }, []);

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];

  // 2. 計算單日預算 (跟著 d1, d2 變動)
  const dayBudget = useMemo(() => {
    return currentDayData.spots.reduce((acc, spot) => {
      // 統一轉為 TWD 顯示，或者分開顯示。這裡計算總合 TWD 方便顯示
      const costTWD = spot.currency === 'TWD' ? spot.cost : spot.cost * exchangeRate;
      return acc + costTWD;
    }, 0);
  }, [currentDayData, exchangeRate]);

  // 3. 計算總行程預算
  const budgetList = useMemo(() => {
    let list: any[] = [];
    // 加入固定支出
    fixedExpenses.forEach(item => {
      list.push({ title: item.title, cost: item.cost, currency: item.currency, type: '固定', payer: item.payer });
    });
    // 加入行程支出
    itinerary.forEach(day => {
      day.spots.forEach(spot => {
        if (spot.cost > 0) {
          list.push({ title: spot.title, cost: spot.cost, currency: spot.currency || 'JPY', type: `Day ${day.day}`, payer: spot.payer });
        }
      });
    });
    return list;
  }, [itinerary, fixedExpenses]);

  const totalTWD = useMemo(() => {
    return budgetList.reduce((acc, item) => {
      if (item.currency === 'TWD') return acc + item.cost;
      return acc + (item.cost * exchangeRate);
    }, 0);
  }, [budgetList, exchangeRate]);

  // 更新景點費用與付款人
  const handleUpdateSpot = (spotId: string, updates: { cost: number, payer: string }) => {
    setItinerary(prev => prev.map(day => ({
      ...day,
      spots: day.spots.map(spot => 
        spot.id === spotId ? { ...spot, ...updates } : spot
      )
    })));
    setSelectedSpot((prev: any) => prev ? { ...prev, ...updates } : null);
  };

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

  const formatVal = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);

  const getWeatherIcon = (iconName: string) => {
    switch(iconName) {
      case 'Sunny': return <Sun size={14} className="text-yellow-500" />;
      case 'Cloudy': return <Cloud size={14} className="text-slate-400" />;
      case 'Rain': return <CloudRain size={14} className="text-blue-400" />;
      default: return <Sun size={14} />;
    }
  };

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute animate-petal-fall"
            style={{ left: `${Math.random() * 100}%`, top: `-5%`, animationDelay: `${i * 1.5}s`, opacity: 0.5 }}>
            <div className="w-3 h-4 bg-pink-200 rounded-full rotate-[15deg] shadow-sm"></div>
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
                <img src={currentDayData.image} className="w-full h-full object-cover" alt="Scenery" 
                     onError={(e: any) => e.target.src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white w-full pr-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase">{currentDayData.date}</span>
                      <h2 className="text-2xl font-light tracking-widest">{currentDayData.area}</h2>
                    </div>
                    {/* 天氣與每日預算顯示 */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-col items-end bg-black/20 p-2 rounded-xl backdrop-blur-md">
                         <div className="flex items-center gap-1">
                           {getWeatherIcon(currentDayData.weather.icon)}
                           <span className="text-xs font-bold">{currentDayData.weather.temp}</span>
                         </div>
                         <span className="text-[8px] opacity-80">{currentDayData.weather.desc}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                         <span className="text-[9px] font-light">Day Est: </span>
                         <span className="text-xs font-bold">NT${formatVal(dayBudget)}</span>
                      </div>
                    </div>
                  </div>
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
                  <SpotCard key={i} spot={spot} colors={colors} onClick={setSelectedSpot} exchangeRate={exchangeRate} />
                ))}
              </div>
            </main>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Guide Map</h2>
            <DailyRouteMap dayData={currentDayData} colors={colors} />
          </div>
        )}

        {/* Wallet Tab - 預算清單 */}
        {activeTab === 'wallet' && (
          <div className="p-8 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-8 uppercase">Budget & Expense</h2>
             
             {/* 總金額卡片 */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl text-center border border-pink-50 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full blur-3xl -z-10"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Total Estimated (TWD)</span>
                <div className="text-4xl font-light my-2 tracking-tighter text-slate-700">
                   <span className="text-sm align-top opacity-50 mr-1">NT$</span>
                   {formatVal(totalTWD)}
                </div>
                <div className="flex justify-center gap-4 mt-6">
                   <div className="text-center">
                      <div className="text-[10px] opacity-40 uppercase">Day {activeDay}</div>
                      <div className="text-sm font-bold text-pink-400">NT${formatVal(dayBudget)}</div>
                   </div>
                   <div className="w-[1px] bg-slate-100"></div>
                   <div className="text-center">
                      <div className="text-[10px] opacity-40 uppercase">Fixed</div>
                      <div className="text-sm font-bold text-slate-400">NT${formatVal(fixedExpenses.reduce((a, b) => a + (b.currency==='TWD'?b.cost:b.cost*exchangeRate), 0))}</div>
                   </div>
                </div>
             </div>

             {/* 詳細清單 */}
             <div className="space-y-3 pb-20">
               {budgetList.map((item, idx) => (
                 <div key={idx} className="bg-white/60 p-5 rounded-[2rem] flex justify-between items-center border border-white">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-medium text-slate-700">{item.title}</span>
                       <div className="flex gap-2">
                         <span className="text-[9px] uppercase tracking-wider opacity-40 px-2 py-0.5 bg-slate-100 rounded-full w-fit">
                           {item.type}
                         </span>
                         <span className={`text-[9px] uppercase tracking-wider opacity-60 px-2 py-0.5 rounded-full w-fit ${item.payer === 'Me' ? 'bg-blue-50 text-blue-400' : 'bg-orange-50 text-orange-400'}`}>
                           {item.payer}
                         </span>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-bold text-slate-600">
                         {item.currency === 'TWD' ? 'NT$' : '¥'} {formatVal(item.cost)}
                       </div>
                       {item.currency === 'JPY' && (
                         <div className="text-[9px] opacity-40">≈ NT${formatVal(item.cost * exchangeRate)}</div>
                       )}
                    </div>
                 </div>
               ))}
             </div>
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
                      <div className="text-2xl font-light">{formatVal(Number(jpyInput) * exchangeRate)}</div>
                    </div>
                  </div>
               </div>
               <p className="text-[10px] text-center mt-12 opacity-30 tracking-widest font-light italic">
                 Rate: 1 JPY ≈ {exchangeRate.toFixed(4)} TWD
               </p>
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
        <DetailModal 
          spot={selectedSpot} 
          colors={colors} 
          onClose={() => setSelectedSpot(null)} 
          onNav={handleNavigation} 
          onUpdateSpot={handleUpdateSpot}
          exchangeRate={exchangeRate}
        />
      )}

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