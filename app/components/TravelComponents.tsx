// app/components/TravelComponents.tsx
import React, { useState } from 'react';
import { Train, Info, Utensils, Navigation2, MapPin, X, ExternalLink, Save, Wallet, Plus, Trash2 } from 'lucide-react';
import { PAYERS, Expense } from '../data/itinerary';

const formatNum = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

export const SpotCard = ({ spot, onClick, colors, exchangeRate }: any) => {
  const totalJPY = spot.expenses
    .filter((e: Expense) => e.currency === 'JPY')
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);
    
  const totalTWD = spot.expenses
    .filter((e: Expense) => e.currency === 'TWD')
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 transition-all active:scale-[0.98]" onClick={() => onClick(spot)}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.accent }}>{spot.time}</span>
        <div className="flex gap-2">
           <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-pink-50 text-pink-400 rounded-full">{spot.tag}</span>
        </div>
      </div>
      <h3 className="text-lg font-normal mb-2 leading-tight">{spot.title}</h3>
      <div className="flex items-center gap-3 mt-4 text-[10px] opacity-60 uppercase tracking-[0.05em] font-mono bg-slate-50 p-3 rounded-2xl w-fit">
        <span className="text-slate-700">¥{formatNum(totalJPY)}</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-700">NT${formatNum(totalTWD)}</span>
      </div>
    </div>
  );
};

export const DailyRouteMap = ({ dayData, colors }: any) => {
  if (!dayData || !dayData.spots || dayData.spots.length === 0) return null;

  const generateRouteUrl = () => {
    const spots = dayData.spots;
    const origin = encodeURIComponent(spots[0].title);
    const destination = encodeURIComponent(spots[spots.length - 1].title);
    let waypoints = "";
    if (spots.length > 2) {
      const intermediate = spots.slice(1, -1).map((s: any) => encodeURIComponent(s.title));
      waypoints = `&waypoints=${intermediate.join('|')}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}&travelmode=transit`;
  };

  return (
    <div className="bg-white rounded-[4rem] p-10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden text-center border border-pink-50 min-h-[40vh]">
      <div className="z-10 w-full">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-pink-50 rounded-full text-pink-300">
            <Navigation2 size={32} />
          </div>
        </div>
        <h3 className="text-lg font-light tracking-widest mb-2">DAY {dayData.day} 完整路線</h3>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8 px-4">
          包含 {dayData.spots.length} 個景點的接續導航
        </p>
        <button 
          onClick={() => window.open(generateRouteUrl(), '_blank')}
          className="w-full py-5 bg-slate-900 text-white rounded-full text-[10px] tracking-[0.3em] uppercase active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <ExternalLink size={14} /> 開啟 Google Maps 導航
        </button>
      </div>
    </div>
  );
};

export const DetailModal = ({ spot, onClose, onNav, onUpdateExpenses, colors, exchangeRate }: any) => {
  const [expenses, setExpenses] = useState<Expense[]>(spot.expenses);

  const handleUpdateItem = (idx: number, field: keyof Expense, value: any) => {
    const newExpenses = [...expenses];
    newExpenses[idx] = { ...newExpenses[idx], [field]: value };
    setExpenses(newExpenses);
  };

  const handleAddItem = () => {
    const newExp: Expense = {
      id: Date.now().toString(),
      item: '新項目',
      amount: 0,
      currency: 'JPY',
      payer: PAYERS[0]
    };
    setExpenses([...expenses, newExp]);
  };

  const handleDeleteItem = (idx: number) => {
    const newExpenses = expenses.filter((_, i) => i !== idx);
    setExpenses(newExpenses);
  };

  const handleSave = () => {
    onUpdateExpenses(spot.id, expenses);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-[4.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Details</span>
            <h2 className="text-2xl font-light mt-1 leading-tight">{spot.title}</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-full text-slate-300"><X size={22} /></button>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 text-slate-500">
                <Wallet size={14}/> 支出細項 (可編輯)
              </h4>
              <button onClick={handleAddItem} className="p-2 bg-white rounded-full text-slate-400 shadow-sm">
                <Plus size={14}/>
              </button>
            </div>
            
            <div className="space-y-3">
              {expenses.map((exp, idx) => (
                <div key={exp.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      value={exp.item}
                      onChange={(e) => handleUpdateItem(idx, 'item', e.target.value)}
                      className="w-full text-sm font-medium outline-none bg-transparent placeholder-slate-300"
                      placeholder="項目名稱"
                    />
                    <button onClick={() => handleDeleteItem(idx)} className="text-red-300"><Trash2 size={14}/></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={exp.currency}
                      onChange={(e) => handleUpdateItem(idx, 'currency', e.target.value as 'JPY' | 'TWD')}
                      className="text-[10px] bg-slate-100 rounded-lg p-1 outline-none text-slate-500"
                    >
                      <option value="JPY">JPY</option>
                      <option value="TWD">TWD</option>
                    </select>
                    <input 
                      type="number"
                      value={exp.amount}
                      onChange={(e) => handleUpdateItem(idx, 'amount', Number(e.target.value))}
                      className="w-full text-lg font-mono outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex overflow-x-auto gap-1 pb-1 no-scrollbar">
                    {PAYERS.map(p => (
                      <button 
                        key={p}
                        onClick={() => handleUpdateItem(idx, 'payer', p)}
                        className={`whitespace-nowrap px-2 py-1 rounded-full text-[9px] border transition-colors ${
                          exp.payer === p 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-center text-[10px] opacity-30 py-4">暫無支出紀錄</p>}
            </div>
            
            <button onClick={handleSave} className="w-full mt-4 py-3 bg-pink-300 text-white rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
              <Save size={14}/> 儲存所有變更
            </button>
          </div>

          <section>
            <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.accent }}><Info size={14}/>景點介紹</h4>
            <p className="text-sm font-light leading-loose text-slate-500 text-justify">{spot.details}</p>
          </section>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onNav('route')} 
              className="w-full py-4 rounded-full bg-slate-900 text-white text-[10px] tracking-[0.3em] uppercase shadow-xl flex items-center justify-center gap-3"
            >
              <Navigation2 size={14} /> 啟動接續導覽
            </button>
            <button 
              onClick={() => onNav('spot')} 
              className="w-full py-4 rounded-full border border-slate-100 text-[10px] tracking-[0.3em] uppercase text-slate-400"
            >
              地點定位
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};