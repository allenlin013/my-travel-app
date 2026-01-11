// app/components/TravelComponents.tsx
import React from 'react';
import { Train, Info, Utensils, Navigation2, MapPin, X, ExternalLink } from 'lucide-react';

export const SpotCard = ({ spot, onClick, colors }: any) => (
  <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 transition-all active:scale-[0.98]" onClick={() => onClick(spot)}>
    <div className="flex justify-between items-center mb-4">
      <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.accent }}>{spot.time}</span>
      <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">{spot.tag}</span>
    </div>
    <h3 className="text-lg font-normal mb-2 leading-tight">{spot.title}</h3>
    <div className="flex items-center gap-2 mt-4 text-[9px] opacity-40 uppercase tracking-[0.1em]">
      <Train size={12} /> <span>{spot.access?.slice(0, 20)}...</span>
      <div className="w-1 h-1 rounded-full bg-slate-300 mx-2"></div>
      <span>{spot.price}</span>
    </div>
  </div>
);

// 新增：每日路線圖組件
export const DailyRouteMap = ({ dayData, colors }: any) => {
  if (!dayData || !dayData.spots || dayData.spots.length === 0) return null;

  // 生成 Google Maps 多點導航連結
  const generateRouteUrl = () => {
    const spots = dayData.spots;
    const origin = encodeURIComponent(spots[0].title);
    const destination = encodeURIComponent(spots[spots.length - 1].title);
    
    // 如果有超過兩個點，中間的點作為 waypoints
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
        
        <div className="space-y-3 mb-10 px-6">
          {dayData.spots.map((spot: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[8px] font-bold opacity-30 w-4">{idx + 1}</span>
              <div className="h-[1px] flex-1 bg-pink-50"></div>
              <span className="text-[9px] tracking-wider opacity-60">{spot.title}</span>
            </div>
          ))}
        </div>

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

export const DetailModal = ({ spot, onClose, onNav, colors }: any) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md rounded-t-[4.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom duration-600 overflow-y-auto max-h-[94vh]">
      <div className="flex justify-between items-start mb-12">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Discovery / {spot.tag}</span>
          <h2 className="text-2xl font-light mt-2 leading-tight">{spot.title}</h2>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 rounded-full text-slate-300"><X size={22} /></button>
      </div>
      <div className="space-y-12">
        <section>
          <h4 className="text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3" style={{ color: colors.accent }}><Info size={16}/>故事與導覽</h4>
          <p className="text-sm font-light leading-loose text-slate-500 text-justify">{spot.details}</p>
        </section>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-pink-50/40 p-6 rounded-[2.5rem]">
            <h4 className="text-[9px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.accent }}>
              <Utensils size={14}/>味蕾建議
            </h4>
            <p className="text-xs font-light leading-relaxed text-slate-600 italic">「{spot.food || "隨意散策"}」</p>
          </div>
          <div className="bg-slate-50/80 p-6 rounded-[2.5rem]">
            <h4 className="text-[9px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.sub }}>
              <Train size={14}/>交通策略
            </h4>
            <p className="text-[10px] font-light leading-relaxed text-slate-500">{spot.access}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button 
            onClick={() => onNav('route')} 
            className="w-full py-5 rounded-full bg-slate-900 text-white text-[10px] tracking-[0.3em] uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Navigation2 size={16} /> 啟動接續導航 (從 {spot.prevSpotName} 出發)
          </button>
          <button 
            onClick={() => onNav('spot')} 
            className="w-full py-5 rounded-full border border-slate-100 text-[10px] tracking-[0.3em] uppercase active:scale-95 transition-all text-slate-400"
          >
            查看地點定位 (基於目前位置)
          </button>
        </div>
      </div>
    </div>
  </div>
);