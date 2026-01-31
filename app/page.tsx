"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plane, Wallet, RefreshCw, Map as MapIcon, Book, ListChecks, Sun, Cloud, CloudRain, Check, PlusCircle, FileText, Save, Bot } from 'lucide-react';
import { colors, itineraryData as initialItinerary, prepList, defaultExchangeRate, initialFixedExpenses, ItineraryDay, Expense, PAYERS, Spot } from './data/itinerary';
import { SpotCard, DetailModal, DailyRouteMap, AddSpotModal, ExpenseChart, TravelConnector } from './components/TravelComponents';
import AIChat from './components/AIChat';

// Firebase imports
import { db } from './firebase'; 
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const formatVal = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);

export default function UltimateOsakaApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary');
  
  const [walletTab, setWalletTab] = useState<'total'|'fixed'|number>('total');
  const [editingFixedExpense, setEditingFixedExpense] = useState<Expense | null>(null);
  const [editingChecklistNoteId, setEditingChecklistNoteId] = useState<string | null>(null);
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(initialItinerary);
  const [fixedExpenses, setFixedExpenses] = useState<Expense[]>(initialFixedExpenses);
  const [checklistStatus, setChecklistStatus] = useState<Record<string, string[]>>({});
  const [checklistNotes, setChecklistNotes] = useState<Record<string, string>>({});
  
  const [exchangeRate, setExchangeRate] = useState(defaultExchangeRate);
  const [jpyInput, setJpyInput] = useState<string>("1000");

  useEffect(() => {
    const tripDocRef = doc(db, "trips", "osaka2026");
    const unsubscribe = onSnapshot(tripDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.itinerary) setItinerary(data.itinerary);
        if (data.fixedExpenses) setFixedExpenses(data.fixedExpenses);
        if (data.checklistStatus) setChecklistStatus(data.checklistStatus);
        if (data.checklistNotes) setChecklistNotes(data.checklistNotes);
      } else {
        setDoc(tripDocRef, {
          itinerary: initialItinerary,
          fixedExpenses: initialFixedExpenses,
          checklistStatus: {},
          checklistNotes: {}
        });
      }
    }, (error) => console.error("Firebase Sync Error:", error));
    return () => unsubscribe();
  }, []);

  const saveToCloud = async (newData: Partial<{ itinerary: ItineraryDay[], fixedExpenses: Expense[], checklistStatus: any, checklistNotes: any }>) => {
    try {
      const tripDocRef = doc(db, "trips", "osaka2026");
      await updateDoc(tripDocRef, newData);
    } catch (e) { console.error("Save to cloud failed:", e); }
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
        const data = await res.json();
        if (data?.rates?.TWD) setExchangeRate(data.rates.TWD);
      } catch (e) { console.error("Rate fetch failed"); }
    };
    fetchRate();
  }, []);

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];

  // 計算行程衝突 (時間合理性驗證)
  const calculateScheduleConflicts = (daySpots: Spot[]) => {
    const warnings: Record<string, string> = {};
    for (let i = 0; i < daySpots.length - 1; i++) {
        const current = daySpots[i];
        const next = daySpots[i+1];
        
        // 取得交通時間 (若無設定，預設為 0 分鐘)
        const travelTime = current.travelToNext?.duration || 0;
        const stayTime = current.stayDuration || 60; // 預設停留 60 分鐘

        // 解析時間 HH:MM -> 分鐘數
        const [cH, cM] = current.time.split(':').map(Number);
        const currentStart = cH * 60 + cM;
        
        const [nH, nM] = next.time.split(':').map(Number);
        const nextStart = nH * 60 + nM;

        const currentEnd = currentStart + stayTime;
        const arrivalAtNext = currentEnd + travelTime;

        if (arrivalAtNext > nextStart) {
            const delay = arrivalAtNext - nextStart;
            warnings[current.id] = `時間不足！抵達下一站會遲到 ${delay} 分鐘`;
        }
    }
    return warnings;
  };

  const scheduleWarnings = useMemo(() => calculateScheduleConflicts(currentDayData.spots), [currentDayData]);

  const allExpensesList = useMemo(() => {
    let list: Array<Expense & { source: string, sortKey: number }> = [];
    fixedExpenses.forEach(e => list.push({ ...e, source: '固定支出', sortKey: 0 }));
    itinerary.forEach(day => {
      day.spots.forEach(spot => {
        spot.expenses.forEach(exp => {
          list.push({ ...exp, source: `D${day.day} - ${spot.title}`, sortKey: day.day });
        });
      });
    });
    return list;
  }, [itinerary, fixedExpenses]);

  const dayBudget = useMemo(() => {
    let jpy = 0, twd = 0;
    currentDayData.spots.forEach(spot => {
      spot.expenses.forEach(exp => {
        if (exp.currency === 'JPY') jpy += exp.amount; else twd += exp.amount;
      });
    });
    return { jpy, twd };
  }, [currentDayData]);

  const stats = useMemo(() => {
    let totalJpy = 0, totalTwd = 0;
    const payerStats: Record<string, { jpy: number, twd: number }> = {};
    PAYERS.forEach(p => payerStats[p] = { jpy: 0, twd: 0 });

    allExpensesList.forEach(e => {
      if (e.currency === 'JPY') {
        totalJpy += e.amount;
        if(payerStats[e.payer]) payerStats[e.payer].jpy += e.amount;
      } else {
        totalTwd += e.amount;
        if(payerStats[e.payer]) payerStats[e.payer].twd += e.amount;
      }
    });
    return { totalJpy, totalTwd, payerStats };
  }, [allExpensesList]);

  const filteredExpenses = useMemo(() => {
    if (walletTab === 'total') return allExpensesList; 
    if (walletTab === 'fixed') return allExpensesList.filter(e => e.sortKey === 0);
    return allExpensesList.filter(e => e.sortKey === walletTab);
  }, [walletTab, allExpensesList]);


  // --- Handlers ---

  const handleUpdateExpenses = (spotId: string, newExpenses: Expense[]) => {
    const newItinerary = itinerary.map(day => ({
      ...day,
      spots: day.spots.map(spot => spot.id === spotId ? { ...spot, expenses: newExpenses } : spot)
    }));
    setItinerary(newItinerary);
    setSelectedSpot((prev: any) => prev ? { ...prev, expenses: newExpenses } : null);
    saveToCloud({ itinerary: newItinerary });
  };

  const handleUpdateSpotDetails = (spotId: string, newDetails: any) => {
    const newItinerary = itinerary.map(day => ({
      ...day,
      spots: day.spots.map(spot => spot.id === spotId ? { ...spot, ...newDetails } : spot)
    }));
    setItinerary(newItinerary);
    setSelectedSpot((prev: any) => prev ? { ...prev, ...newDetails } : null);
    saveToCloud({ itinerary: newItinerary });
  };

  // 更新交通資訊
  const handleUpdateTravelInfo = (spotId: string, travelInfo: { duration: number, mode: 'transit'|'walking' }) => {
    const newItinerary = itinerary.map(day => ({
      ...day,
      spots: day.spots.map(spot => spot.id === spotId ? { ...spot, travelToNext: travelInfo } : spot)
    }));
    setItinerary(newItinerary);
    saveToCloud({ itinerary: newItinerary });
  };

  const handleUpdateFixed = (expense: Expense) => {
    const newFixed = fixedExpenses.map(e => e.id === expense.id ? expense : e);
    setFixedExpenses(newFixed);
    setEditingFixedExpense(null);
    saveToCloud({ fixedExpenses: newFixed });
  };

  const toggleCheck = (itemId: string, payer: string) => {
    const currentChecks = checklistStatus[itemId] || [];
    let newChecks;
    if (currentChecks.includes(payer)) newChecks = currentChecks.filter(p => p !== payer);
    else newChecks = [...currentChecks, payer];
    
    const newStatus = { ...checklistStatus, [itemId]: newChecks };
    setChecklistStatus(newStatus);
    saveToCloud({ checklistStatus: newStatus });
  };

  const handleUpdateChecklistNote = (itemId: string, note: string) => {
    const newNotes = { ...checklistNotes, [itemId]: note };
    setChecklistNotes(newNotes);
    saveToCloud({ checklistNotes: newNotes });
  };

  const handleAddSpot = (newSpot: Spot) => {
    const newItinerary = itinerary.map(day => {
      if (day.day === activeDay) {
        let updatedSpots = [...day.spots, newSpot].sort((a, b) => a.time.localeCompare(b.time));
        return { ...day, spots: updatedSpots };
      }
      return day;
    });
    setItinerary(newItinerary);
    setIsAddSpotOpen(false);
    saveToCloud({ itinerary: newItinerary });
  };

  const handleDeleteSpot = (spotId: string) => {
    if(!confirm("確定要刪除此行程嗎？(所有人的畫面都會同步刪除)")) return;
    const newItinerary = itinerary.map(day => ({
      ...day,
      spots: day.spots.filter(s => s.id !== spotId)
    }));
    setItinerary(newItinerary);
    setSelectedSpot(null);
    saveToCloud({ itinerary: newItinerary });
  };

  const handleNavigation = (mode: 'route' | 'spot') => {
    if (!selectedSpot) return;
    
    if (mode === 'spot') {
      const query = selectedSpot.address || selectedSpot.title;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    } else {
      const currentDaySpots = currentDayData.spots;
      const currentIndex = currentDaySpots.findIndex(s => s.id === selectedSpot.id);
      
      let origin = selectedSpot.prevSpotName;
      if (currentIndex > 0) {
        const prevSpot = currentDaySpots[currentIndex - 1];
        origin = prevSpot.address || prevSpot.title;
      }
      
      const destination = selectedSpot.address || selectedSpot.title;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=transit`;
      window.open(url, '_blank');
    }
  };

  const getWeatherIcon = (iconName: string) => {
    switch(iconName) {
      case 'Sunny': return <Sun size={14} className="text-yellow-500"/>;
      case 'Cloudy': return <Cloud size={14} className="text-slate-400"/>;
      case 'Rain': return <CloudRain size={14} className="text-blue-400"/>;
      default: return <Sun size={14}/>;
    }
  };

  const pageAnim = "animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out fill-mode-forwards";

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
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-mono opacity-40">1 JPY ≈ {exchangeRate.toFixed(3)} TWD</div>
              <button onClick={() => setIsAddSpotOpen(true)} className="text-pink-400 hover:scale-110 transition-transform">
                <PlusCircle size={24} />
              </button>
            </div>
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

        <div key={activeTab} className={pageAnim}>
          
          {activeTab === 'diary' && (
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
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 bg-black/20 p-2 rounded-xl backdrop-blur-md">
                         {getWeatherIcon(currentDayData.weather.icon)}
                         <span className="text-xs font-bold">{currentDayData.weather.temp}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex flex-col items-end">
                         <span className="text-[8px] font-light opacity-80 uppercase tracking-wider">Day Est.</span>
                         <span className="text-sm font-bold font-mono">
                           NT${formatVal(dayBudget.twd + (dayBudget.jpy * exchangeRate))}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-0">
                {currentDayData.spots.map((spot, i) => (
                  <React.Fragment key={spot.id}>
                    <div className="mb-8">
                      <SpotCard spot={spot} colors={colors} onClick={setSelectedSpot} exchangeRate={exchangeRate} />
                    </div>
                    {/* 交通連接器：只要不是最後一個景點，就顯示連接器 */}
                    {i < currentDayData.spots.length - 1 && (
                      <TravelConnector 
                        fromSpot={spot} 
                        toSpot={currentDayData.spots[i+1]}
                        onUpdateTravel={handleUpdateTravelInfo}
                        warning={scheduleWarnings[spot.id]}
                      />
                    )}
                  </React.Fragment>
                ))}
                
                <div 
                  className="border-2 border-dashed border-pink-200 rounded-[3rem] p-6 text-center opacity-50 cursor-pointer hover:opacity-100 hover:bg-pink-50 transition-all mt-4"
                  onClick={() => setIsAddSpotOpen(true)}
                >
                  <p className="text-xs text-pink-300 tracking-widest uppercase">+ Add New Spot</p>
                </div>
              </div>
            </main>
          )}

          {activeTab === 'guide' && (
            <div className="p-10">
              <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Route</h2>
              <DailyRouteMap dayData={currentDayData} colors={colors} />
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="p-6 pb-32">
               <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-6 uppercase">Wallet</h2>
               <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
                 {['total', 'fixed', 1, 2, 3, 4, 5, 6, 7, 8].map(t => (
                   <button key={t} onClick={() => setWalletTab(t as any)}
                     className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider whitespace-nowrap transition-all border ${walletTab === t ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>
                     {t === 'total' ? '總覽' : t === 'fixed' ? '固定' : `D${t}`}
                   </button>
                 ))}
               </div>

               {walletTab === 'total' && (
                 <div className="space-y-6">
                   <ExpenseChart payerStats={stats.payerStats} exchangeRate={exchangeRate} />

                   <div className="grid grid-cols-2 gap-4">
                     {PAYERS.map(p => {
                       const pTotal = stats.payerStats[p].twd + (stats.payerStats[p].jpy * exchangeRate);
                       return (
                         <div key={p} className="bg-white/60 p-4 rounded-2xl border border-white">
                           <div className="text-xs font-bold text-slate-700 mb-2">{p}</div>
                           <div className="text-lg font-light text-slate-600">
                             <span className="text-[10px] mr-1">NT$</span>{formatVal(pTotal)}
                           </div>
                           <div className="text-[9px] text-slate-400 mt-1">
                             ¥{formatVal(stats.payerStats[p].jpy)} + ${formatVal(stats.payerStats[p].twd)}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}

               {walletTab !== 'total' && (
                 <div className="space-y-3">
                   {filteredExpenses.map((item, idx) => {
                     const itemTotalTWD = item.currency === 'TWD' ? item.amount : item.amount * exchangeRate;
                     return (
                       <div key={idx} 
                         className="bg-white/60 p-4 rounded-[1.5rem] flex justify-between items-center border border-white active:scale-95 transition-transform"
                         onClick={() => { if (item.sortKey === 0) setEditingFixedExpense(item); }}
                       >
                          <div className="flex flex-col gap-1 w-2/3">
                             <span className="text-[10px] opacity-40 uppercase tracking-wider">{item.source}</span>
                             <span className="text-xs font-medium text-slate-700 truncate">{item.item}</span>
                             <div className="flex gap-2 mt-1">
                               <span className={`text-[9px] px-2 py-0.5 rounded-full ${item.payer === 'YenLin' ? 'bg-blue-50 text-blue-400' : 'bg-orange-50 text-orange-400'}`}>
                                 {item.payer}
                               </span>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-bold text-slate-600">
                               NT$ {formatVal(itemTotalTWD)}
                             </div>
                             <div className="text-[9px] text-slate-400">
                               {item.currency === 'JPY' ? `¥${formatVal(item.amount)}` : `(TWD)`}
                             </div>
                          </div>
                       </div>
                     );
                   })}
                   {filteredExpenses.length === 0 && <div className="text-center opacity-30 text-xs py-10">尚無支出</div>}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'currency' && (
            <div className="p-10">
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

          {activeTab === 'prep' && (
            <div className="p-6 pb-32">
              <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-8 uppercase">Checklist</h2>
              <div className="space-y-6">
                {prepList.map((sec, secIdx) => (
                  <div key={secIdx} className="bg-white p-6 rounded-[2.5rem] shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest pl-2 border-l-2 border-pink-200">{sec.title}</h3>
                    <div className="space-y-4">
                      {sec.items.map((item, itemIdx) => {
                        const itemId = `${secIdx}-${itemIdx}`;
                        const isEditing = editingChecklistNoteId === itemId;
                        const note = checklistNotes[itemId];

                        return (
                          <div key={itemId} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm text-slate-700 ml-1">{item}</p>
                              <button 
                                onClick={() => setEditingChecklistNoteId(isEditing ? null : itemId)}
                                className={`p-1 rounded-full ${note ? 'text-pink-400' : 'text-slate-300'}`}
                              >
                                <FileText size={14}/>
                              </button>
                            </div>
                            
                            {(isEditing || note) && (
                              <div className="mb-3 ml-1">
                                {isEditing ? (
                                  <div className="flex gap-2">
                                    <input 
                                      className="w-full bg-slate-50 p-2 rounded-xl text-xs outline-none"
                                      placeholder="輸入備註... (Enter 儲存)"
                                      value={note || ''}
                                      onChange={(e) => handleUpdateChecklistNote(itemId, e.target.value)}
                                      onKeyDown={(e) => { if(e.key === 'Enter') setEditingChecklistNoteId(null) }}
                                      autoFocus
                                    />
                                    <button onClick={() => setEditingChecklistNoteId(null)} className="text-slate-400">
                                      <Check size={14}/>
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-slate-400 italic bg-slate-50 p-2 rounded-lg">{note}</p>
                                )}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {PAYERS.map(p => {
                                const isChecked = checklistStatus[itemId]?.includes(p);
                                const initial = p.charAt(0);
                                return (
                                  <button
                                    key={p}
                                    onClick={() => toggleCheck(itemId, p)}
                                    className={`w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                                      isChecked 
                                        ? 'bg-slate-800 text-white shadow-md scale-105' 
                                        : 'bg-slate-50 text-slate-300'
                                    }`}
                                  >
                                    {isChecked ? <Check size={12}/> : initial}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="p-6 pb-32">
              <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-8 uppercase">AI Guide</h2>
              <AIChat itineraryData={itinerary} colors={colors} />
            </div>
          )}
        </div>
      </div>

      {selectedSpot && (
        <DetailModal 
          spot={selectedSpot} 
          colors={colors} 
          onClose={() => setSelectedSpot(null)} 
          onNav={handleNavigation} 
          onUpdateExpenses={handleUpdateExpenses}
          onUpdateDetails={handleUpdateSpotDetails}
          onUpdateGeneral={handleUpdateSpotDetails}
          onDeleteSpot={handleDeleteSpot}
          exchangeRate={exchangeRate}
        />
      )}

      {isAddSpotOpen && (
        <AddSpotModal 
          onClose={() => setIsAddSpotOpen(false)} 
          onSave={handleAddSpot} 
          lastSpot={currentDayData.spots[currentDayData.spots.length - 1]}
        />
      )}

      {editingFixedExpense && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
             <h3 className="text-lg font-light mb-4">編輯固定支出</h3>
             <input className="w-full bg-slate-50 p-3 rounded-xl mb-3 text-sm" value={editingFixedExpense.item} onChange={e=>setEditingFixedExpense({...editingFixedExpense, item: e.target.value})} />
             <div className="flex gap-2 mb-3">
               <input type="number" className="w-full bg-slate-50 p-3 rounded-xl text-sm" value={editingFixedExpense.amount} onChange={e=>setEditingFixedExpense({...editingFixedExpense, amount: Number(e.target.value)})} />
               <select className="bg-slate-50 p-3 rounded-xl text-sm" value={editingFixedExpense.currency} onChange={e=>setEditingFixedExpense({...editingFixedExpense, currency: e.target.value as any})}>
                 <option value="TWD">TWD</option>
                 <option value="JPY">JPY</option>
               </select>
             </div>
             <div className="flex flex-wrap gap-2 mb-6">
                {PAYERS.map(p => (
                  <button key={p} onClick={()=>setEditingFixedExpense({...editingFixedExpense, payer: p})}
                    className={`text-xs px-3 py-1 rounded-full border ${editingFixedExpense.payer === p ? 'bg-slate-800 text-white' : 'bg-white'}`}>
                    {p}
                  </button>
                ))}
             </div>
             <div className="flex gap-3">
               <button onClick={()=>setEditingFixedExpense(null)} className="flex-1 py-3 border rounded-xl text-xs">取消</button>
               <button onClick={()=>handleUpdateFixed(editingFixedExpense)} className="flex-1 py-3 bg-pink-300 text-white rounded-xl text-xs">儲存</button>
             </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-[50]">
        {[
          { id: 'diary', icon: Book, label: 'Diary' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
          { id: 'currency', icon: RefreshCw, label: 'Exch.' },
          { id: 'guide', icon: MapIcon, label: 'Guide' },
          { id: 'prep', icon: ListChecks, label: 'Prep' },
          { id: 'chat', icon: Bot, label: 'AI' }
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