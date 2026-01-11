// app/components/TravelComponents.tsx
import React from 'react';
import { Train, Info, Utensils, Navigation2, MapPin, X } from 'lucide-react';

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
            <Navigation2 size={16} /> 啟動接續導覽 (從 {spot.prevSpotName} 出發)
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