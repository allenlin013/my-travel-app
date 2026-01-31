// app/components/TravelComponents.tsx
import React, { useState, useMemo } from 'react';
// 引入所有需要的交通圖示
import { Train, Info, Utensils, Navigation2, MapPin, X, ExternalLink, Save, Wallet, Plus, Trash2, Map, Tag, Clock, DollarSign, PieChart, Edit3, Sparkles, AlertTriangle, TrainFront, Footprints, RotateCw, Plane, Ship, Bike, CarFront, PlusCircle } from 'lucide-react';
import { PAYERS, Expense, Spot, TravelInfo } from '../data/itinerary';

const formatNum = (amount: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);

// 時間格式驗證 (HH:MM)
const isValidTime = (time: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

// 根據模式回傳對應圖示
const getTravelIcon = (mode: string, size = 14, className = "") => {
  switch(mode) {
    case 'walking': return <Footprints size={size} className={className} />;
    case 'driving': return <CarFront size={size} className={className} />;
    case 'cycling': return <Bike size={size} className={className} />;
    case 'flight': return <Plane size={size} className={className} />;
    case 'ferry': return <Ship size={size} className={className} />;
    case 'transit': 
    default: return <TrainFront size={size} className={className} />;
  }
};

// --- 0. Travel Connector (手動交通連接器) ---
export const TravelConnector = ({ fromSpot, toSpot, onUpdateTravel, warning }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(fromSpot.travelToNext?.duration || 0);
  const [mode, setMode] = useState<TravelInfo['mode']>(fromSpot.travelToNext?.mode || 'transit');

  const handleSave = () => {
    onUpdateTravel(fromSpot.id, { duration: Number(duration), mode });
    setIsEditing(false);
  };

  // 如果正在編輯，顯示編輯視窗
  if (isEditing) {
    return (
      <div className="relative flex justify-center py-6 -my-4 z-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200 -translate-x-1/2"></div>
        <div className="relative z-10 bg-white shadow-xl p-4 rounded-2xl border border-pink-100 flex flex-col gap-3 w-64 animate-in fade-in zoom-in-95 duration-200">
           <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
             <span>設定交通方式</span>
             <button onClick={()=>setIsEditing(false)}><X size={14}/></button>
           </div>
           
           {/* 時間輸入 */}
           <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl">
             <Clock size={14} className="text-slate-400"/>
             <input 
               type="number" 
               value={duration} 
               onChange={e=>setDuration(Number(e.target.value))} 
               className="flex-1 bg-transparent text-center text-sm font-bold outline-none" 
               placeholder="分鐘"
             />
             <span className="text-xs font-mono text-slate-400">min</span>
           </div>

           {/* 交通工具選擇面板 (6種) */}
           <div className="grid grid-cols-6 gap-1">
             {[
               { id: 'transit', icon: <TrainFront size={14}/>, label: '鐵路', color: 'text-blue-500' },
               { id: 'walking', icon: <Footprints size={14}/>, label: '步行', color: 'text-green-500' },
               { id: 'driving', icon: <CarFront size={14}/>, label: '開車', color: 'text-slate-600' },
               { id: 'cycling', icon: <Bike size={14}/>, label: '單車', color: 'text-orange-500' },
               { id: 'ferry', icon: <Ship size={14}/>, label: '船運', color: 'text-blue-700' },
               { id: 'flight', icon: <Plane size={14}/>, label: '飛行', color: 'text-sky-400' },
             ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={()=>setMode(opt.id as any)} 
                  title={opt.label}
                  className={`py-2 rounded-lg flex justify-center items-center transition-all ${mode === opt.id ? `bg-slate-100 shadow-inner ${opt.color}` : 'text-slate-300 hover:bg-slate-50'}`}
                >
                  {opt.icon}
                </button>
             ))}
           </div>
           
           <button onClick={handleSave} className="bg-slate-900 text-white text-[10px] py-3 rounded-xl mt-1 tracking-widest uppercase hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200">
             確認儲存
           </button>
        </div>
      </div>
    );
  }

  // 顯示模式 (圖示 + 時間)
  return (
    <div className="relative flex justify-center py-6 -my-4 z-0 group">
      {/* 虛線連接線 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-300 -translate-x-1/2"></div>
      
      {/* 警告氣泡 (時間衝突時顯示) */}
      {warning && (
        <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-48 bg-red-50 border border-red-100 p-2 rounded-xl shadow-sm z-20 flex items-start gap-2 animate-in slide-in-from-left-2 fade-in">
           <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5"/>
           <p className="text-[10px] text-red-600 leading-tight">{warning}</p>
        </div>
      )}

      {/* 如果有設定過資料，顯示圖示與時間 */}
      {fromSpot.travelToNext ? (
        <button 
          onClick={() => setIsEditing(true)}
          className={`relative z-10 flex flex-col items-center gap-1 bg-white px-4 py-2 rounded-full border shadow-sm transition-all hover:scale-110 active:scale-95 ${warning ? 'border-red-300 bg-red-50' : 'border-slate-100 hover:border-pink-200'}`}
        >
          <div className={`${
            fromSpot.travelToNext.mode === 'walking' ? 'text-green-400' : 
            fromSpot.travelToNext.mode === 'cycling' ? 'text-orange-400' : 
            fromSpot.travelToNext.mode === 'driving' ? 'text-slate-600' :
            fromSpot.travelToNext.mode === 'flight' ? 'text-sky-400' :
            fromSpot.travelToNext.mode === 'ferry' ? 'text-blue-600' :
            'text-blue-400'
          }`}>
            {getTravelIcon(fromSpot.travelToNext.mode, 16)}
          </div>
          <span className={`text-[10px] font-mono font-bold ${warning ? 'text-red-500' : 'text-slate-500'}`}>
            {fromSpot.travelToNext.duration} min
          </span>
        </button>
      ) : (
        /* 如果沒有資料，顯示一個小的 "+" 按鈕讓使用者點擊新增 */
        <button 
          onClick={() => setIsEditing(true)}
          className="relative z-10 bg-white p-2 rounded-full border border-slate-200 text-slate-300 shadow-sm hover:text-pink-400 hover:border-pink-200 hover:scale-110 transition-all active:scale-95"
          title="新增交通時間"
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  );
};

// --- 1. 景點卡片 (保持不變) ---
export const SpotCard = ({ spot, onClick, colors, exchangeRate }: any) => {
  const totalJPY = spot.expenses
    .filter((e: Expense) => e.currency === 'JPY')
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);
    
  const totalTWD = spot.expenses
    .filter((e: Expense) => e.currency === 'TWD')
    .reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const approxTWD = totalTWD + (totalJPY * exchangeRate);

  return (
    <div 
      className="relative z-10 bg-white rounded-[2.5rem] p-6 shadow-sm border border-pink-50 transition-all active:scale-[0.98]" 
      onClick={() => onClick(spot)}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[12px] font-mono font-bold tracking-tighter" style={{ color: colors.accent }}>
          {spot.time}
        </span>
        <div className="flex gap-2">
           <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-pink-50 text-pink-400 rounded-full">{spot.tag}</span>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-normal leading-tight text-slate-800">{spot.title}</h3>
        <p className="text-xs font-light text-slate-500 mt-2 line-clamp-2 leading-relaxed opacity-80 pr-2">
          {spot.details}
        </p>
      </div>
      
      <div className="flex justify-end mt-3">
        <div className="flex flex-col items-end bg-slate-50 px-4 py-2 rounded-2xl">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-slate-400">NT$</span>
            <span className="text-lg font-bold text-slate-700 font-mono">{formatNum(approxTWD)}</span>
          </div>
          {totalJPY > 0 && (
            <div className="text-[9px] text-slate-300 font-mono">
              ( ¥{formatNum(totalJPY)} )
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 2. 每日路線圖 (保持不變) ---
export const DailyRouteMap = ({ dayData, colors }: any) => {
  if (!dayData || !dayData.spots || dayData.spots.length === 0) return null;

  const generateRouteUrl = () => {
    const spots = dayData.spots;
    const origin = encodeURIComponent(spots[0].address || spots[0].title);
    const destination = encodeURIComponent(spots[spots.length - 1].address || spots[spots.length - 1].title);
    let waypoints = "";
    if (spots.length > 2) {
      const intermediate = spots.slice(1, -1).map((s: any) => encodeURIComponent(s.address || s.title));
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

// --- 3. 詳情彈窗 (保持不變) ---
export const DetailModal = ({ spot, onClose, onNav, onUpdateExpenses, onUpdateDetails, onDeleteSpot, colors, exchangeRate, onUpdateGeneral }: any) => {
  const [time, setTime] = useState(spot.time);
  const [title, setTitle] = useState(spot.title);
  const [address, setAddress] = useState(spot.address || '');
  const [stayDuration, setStayDuration] = useState(spot.stayDuration || 60);
  const [expenses, setExpenses] = useState<Expense[]>(spot.expenses);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [details, setDetails] = useState(spot.details);

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

  const handleSaveExpenses = () => {
    onUpdateExpenses(spot.id, expenses);
  };

  const handleSaveDetails = () => {
    onUpdateDetails(spot.id, details);
    setIsEditingDetails(false);
  };

  const handleSaveGeneral = () => {
    if (!isValidTime(time)) {
      alert("時間格式錯誤！請使用 HH:MM 格式 (00:00 - 23:59)。");
      return;
    }
    if (onUpdateGeneral) {
        onUpdateGeneral(spot.id, {
            time: time,
            title: title,
            address: address,
            stayDuration: Number(stayDuration)
        });
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-t-[4.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-8">
          <div className="w-full pr-4">
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Details</span>
            <h2 className="text-2xl font-light mt-1 leading-tight">{spot.title}</h2>
            {spot.address && (
              <p className="text-xs text-slate-400 mt-2 flex items-start gap-1">
                <MapPin size={12} className="mt-0.5 flex-shrink-0"/> 
                {spot.address}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-full text-slate-300 flex-shrink-0"><X size={22} /></button>
        </div>

        <div className="space-y-8">
          
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: colors.accent }}>
                <Info size={14}/>基本資訊
              </h4>
                            
              {!isEditingGeneral ? (
                <button onClick={() => setIsEditingGeneral(true)} className="text-slate-300 hover:text-slate-500">
                  <Edit3 size={14}/>
                </button>
              ): (
                <button onClick={()=>{handleSaveGeneral();setIsEditingGeneral(false)}} className="text-[10px] bg-slate-800 text-white px-3 py-1 rounded-full">
                  完成
                </button>
              )}
            </div>
            
            {isEditingGeneral && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-1/3 bg-slate-50 p-4 rounded-2xl text-sm outline-none text-slate-600"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="時間 (HH:MM)"
                  />
                  <input
                    type="number"
                    className="w-2/3 bg-slate-50 p-4 rounded-2xl text-sm outline-none text-slate-600"
                    value={stayDuration}
                    onChange={(e) => setStayDuration(e.target.value)}
                    placeholder="停留分鐘"
                  />
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-sm outline-none text-slate-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="地點名稱"
                />
                <input
                  type="text"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-sm outline-none text-slate-600"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="地址"
                />
              </div>
            )}
            {!isEditingGeneral && (
               <div className="flex gap-4 text-xs text-slate-500 pl-1">
                 <span className="flex items-center gap-1"><Clock size={12}/> {spot.time}</span>
                 <span className="flex items-center gap-1"><Clock size={12}/> 預計停留 {spot.stayDuration || 60} 分鐘</span>
               </div>
            )}
          </section>

          <section>
             <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: colors.accent }}>
                <Info size={14}/> 介紹 / 備註
              </h4>

              {!isEditingDetails ? (
                <button onClick={() => setIsEditingDetails(true)} className="text-slate-300 hover:text-slate-500">
                  <Edit3 size={14}/>
                </button>
              ) : (
                <button onClick={handleSaveDetails} className="text-[10px] bg-slate-800 text-white px-3 py-1 rounded-full">
                  完成
                </button>
              )}
            </div>
            
            {isEditingDetails ? (
              <textarea 
                className="w-full bg-slate-50 p-4 rounded-2xl text-sm leading-loose outline-none text-slate-600 resize-none h-32"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            ) : (
              <p className="text-sm font-light leading-loose text-slate-500 text-justify whitespace-pre-wrap">
                {spot.details}
              </p>
            )}
          </section>

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
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex overflow-x-auto gap-1 pb-1 no-scrollbar max-w-[70%]">
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
                    <span className="text-[10px] text-slate-400 font-mono">
                      ≈ NT${formatNum(exp.currency === 'TWD' ? exp.amount : exp.amount * exchangeRate)}
                    </span>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-center text-[10px] opacity-30 py-4">暫無支出紀錄</p>}
            </div>
            
            <button onClick={handleSaveExpenses} className="w-full mt-4 py-3 bg-pink-300 text-white rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
              <Save size={14}/> 儲存支出變更
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onNav('route')} 
              className="w-full py-4 rounded-full bg-slate-900 text-white text-[10px] tracking-[0.3em] uppercase shadow-xl flex items-center justify-center gap-3"
            >
              <Navigation2 size={14} /> 啟動接續導覽 (從上一站)
            </button>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => onNav('spot')} 
                className="col-span-2 py-4 rounded-full border border-slate-100 text-[10px] tracking-[0.3em] uppercase text-slate-400"
              >
                查看地點定位
              </button>
              <button 
                onClick={() => onDeleteSpot(spot.id)} 
                className="col-span-1 py-4 rounded-full bg-red-50 text-red-300 text-[10px] flex items-center justify-center"
              >
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. 新增行程 Modal (移除 Google Check 按鈕) ---
export const AddSpotModal = ({ onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    address: '',
    tag: 'Shopping',
    details: '',
    stayDuration: 60,
    cost: 0,
    currency: 'JPY',
    payer: PAYERS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    if (!isValidTime(formData.time)) {
        alert("時間格式錯誤 (例如 10:66)，請修正為 HH:MM 格式 (00:00 - 23:59)");
        return;
    }

    const query = formData.address || formData.title;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    
    const newSpot: Spot = {
      id: Date.now().toString(),
      time: formData.time || "12:00",
      title: formData.title,
      address: formData.address, 
      tag: formData.tag,
      details: formData.details || "手動新增的行程",
      stayDuration: Number(formData.stayDuration) || 60,
      access: "自訂行程",
      mapUrl: mapUrl,
      prevSpotName: "上一個景點",
      expenses: formData.cost > 0 ? [{
        id: Date.now().toString() + '_exp',
        item: '預估費用',
        amount: Number(formData.cost),
        currency: formData.currency as 'JPY' | 'TWD',
        payer: formData.payer
      }] : []
    };

    onSave(newSpot);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-light tracking-wide">新增行程</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 pl-2"><Clock size={10} className="inline mr-1"/>時間</label>
              <input 
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-sm" 
                placeholder="10:00" 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 pl-2"><Tag size={10} className="inline mr-1"/>標籤</label>
              <select 
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-sm appearance-none"
                value={formData.tag}
                onChange={e => setFormData({...formData, tag: e.target.value})}
              >
                <option value="Shopping">Shopping</option>
                <option value="Food">Food</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Relax">Relax</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] uppercase tracking-wider text-slate-400 pl-2"><Clock size={10} className="inline mr-1"/>預計停留 (分鐘)</label>
             <input 
                type="number"
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-sm" 
                placeholder="60" 
                value={formData.stayDuration}
                onChange={e => setFormData({...formData, stayDuration: Number(e.target.value)})}
              />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 pl-2"><Map size={10} className="inline mr-1"/>地點名稱</label>
            <input 
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-sm font-medium" 
              placeholder="例如: 一蘭拉麵 道頓堀店" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 pl-2"><MapPin size={10} className="inline mr-1"/>地址 (定位用)</label>
            <input 
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-sm font-medium" 
              placeholder="例如: 大阪市中央區道頓堀1-4-16" 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 pl-2"><Info size={10} className="inline mr-1"/>備註</label>
            <textarea 
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-sm h-24 resize-none" 
              placeholder="輸入備註或介紹..." 
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-slate-400"><DollarSign size={10} className="inline mr-1"/>預估花費</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="flex-1 bg-white p-3 rounded-xl text-sm outline-none" 
                placeholder="0"
                value={formData.cost || ''}
                onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
              />
              <select 
                className="w-20 bg-white p-3 rounded-xl text-sm outline-none"
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                <option value="JPY">JPY</option>
                <option value="TWD">TWD</option>
              </select>
            </div>
            <div className="flex overflow-x-auto gap-2 no-scrollbar">
              {PAYERS.map(p => (
                <button 
                  key={p} 
                  type="button"
                  onClick={() => setFormData({...formData, payer: p})}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-colors ${formData.payer === p ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs tracking-widest uppercase shadow-lg active:scale-95 transition-all">
            確認新增
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 5. 莫蘭迪配色圓環圖表 (補回) ---
export const ExpenseChart = ({ payerStats, exchangeRate }: any) => {
  const colors: Record<string, string> = {
    "YenLin": "#D4A5A5", 
    "CC": "#8E9EAB",     
    "Fu": "#A7B49E",     
    "Wen": "#D4C5A8",    
    "Dad": "#8D9399",    
    "Sister": "#C5B49E"  
  };

  const data = PAYERS.map(p => {
    const stats = payerStats[p] || { jpy: 0, twd: 0 };
    const totalTWD = stats.twd + (stats.jpy * exchangeRate);
    return { name: p, value: totalTWD, color: colors[p] || "#CBD5E1" };
  }).filter(d => d.value > 0);

  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  const gradientString = useMemo(() => {
    if (totalValue === 0) return "conic-gradient(#f1f5f9 0% 100%)";
    let currentDeg = 0;
    const segments = data.map(d => {
      const start = currentDeg;
      const deg = (d.value / totalValue) * 360;
      currentDeg += deg;
      return `${d.color} ${start}deg ${currentDeg}deg`;
    });
    return `conic-gradient(${segments.join(', ')})`;
  }, [data, totalValue]);

  if (totalValue === 0) return null;

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-pink-50 mb-6">
      <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-40 text-center mb-6">Expense Distribution</h3>
      
      <div className="flex items-center justify-center gap-8">
        <div className="relative w-40 h-40 rounded-full shadow-inner" style={{ background: gradientString }}>
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
             <span className="text-[10px] text-slate-400">Total</span>
             <span className="text-xs font-bold text-slate-700">NT${formatNum(totalValue)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600">{d.name}</span>
                <span className="text-[9px] text-slate-400">{((d.value / totalValue) * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};