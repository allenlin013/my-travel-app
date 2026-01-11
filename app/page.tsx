"use client";

import React, { useState, useMemo } from 'react';
import { 
  MapPin, Utensils, Info, ShoppingBag, ChevronDown, X, Plane, Calendar, 
  Map as MapIcon, Book, Train, Navigation2, Wallet, Plus, CheckCircle2, Camera, User
} from 'lucide-react';

const colors = {
  bg: "#F7F3F2",        
  card: "#FFFFFF",
  accent: "#D4A5A5",    // 莫蘭迪櫻花粉
  text: "#5D5D5A",      
  sub: "#9E9494",       
  highlight: "#E3C8C8",
  gold: "#C5B49E"
};

export default function PremiumTravelApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary'); // diary, wallet, guide, prep

  // 記帳資料 (預估價格以日幣計)
  const [expenses, setExpenses] = useState([
    { id: 1, item: '星宇航空 JX 834', amount: 18500, payer: 'Me', category: '機票' },
    { id: 2, item: '大阪難波大和ROYNET飯店', amount: 120000, payer: 'Split', category: '住宿' },
    { id: 3, item: 'USJ 門票+快通', amount: 28000, payer: 'Me', category: '娛樂' },
  ]);

  const itineraryData = [
    {
      day: 1, date: "04.11", area: "神戶・大阪啟程",
      image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80",
      guideNote: "各位貴賓，歡迎來到關西。今日我們避開人潮，從精緻的神戶機場入境，搭乘高速船橫跨大阪灣，這是最優雅的登場方式。",
      spots: [
        { 
          time: "10:30", title: "神戶機場 (UKB)", tag: "交通",
          desc: "搭乘星宇航空抵達，展開旅程。",
          details: "【導遊視角】神戶機場位於人工島上，這座機場體現了日本精湛的填海技術。這裡人流較少，入境速度極快。建議到3樓展望台俯瞰大阪灣，深藍的海水配上莫蘭迪粉的春日陽光，非常動人。",
          access: "從 UKB 搭乘『Port Liner』單軌電車至三宮站，再轉乘阪神快速急行直達難波。",
          mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Kobe+Airport",
          routeUrl: "http://googleusercontent.com/maps.google.com/dir/Kobe+Airport/Namba+Station",
          price: "¥1,100 (交通)"
        },
        { 
          time: "15:30", title: "心齋橋筋商店街", tag: "購物",
          desc: "大阪購物的靈魂脈絡。",
          details: "【歷史背景】心齋橋自江戶時代起就是商業重鎮。對於追求美學的您，這裡不只是藥妝，請注意那些藏在二樓的獨立選物店。建築物的外牆裝飾也呈現了昭和與現代的交織美感。",
          access: "難波站步行5分鐘。",
          food: "【明治軒】紅酒醬蛋包飯：1925年創立，是大阪洋食界的活化石。",
          shopping: "大國藥妝旗艦店、Parco 美妝層、Disney Store。",
          mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Shinsaibashi",
          price: "¥10,000 (估計預算)"
        }
      ]
    },
    {
      day: 2, date: "04.12", area: "京都東山：古都韻味",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      guideNote: "今日穿上最輕便的鞋，我們要穿梭在清水的石板路與八坂的燈火間，感受京都那份淡然的奢華。",
      spots: [
        { 
          time: "09:30", title: "清水寺", tag: "文化",
          desc: "清水大舞台，千年古寺建築之美。",
          details: "【文化背景】建於778年，完全未使用釘子支撐，展現了日本建築的力與美。4月此處綠意與殘櫻交織，建議在音羽瀑布祈求健康。這裡的空間氛圍能讓人心靈沉靜，非常符合美容美學的洗鍊感。",
          access: "搭乘京阪本線特急至清水五條。",
          food: "【奧丹清水】豆腐料理：在百年宅邸享受極致的清淡甜味。",
          mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Kiyomizu-dera",
          price: "¥5,000"
        },
        { 
          time: "15:00", title: "花見小路 / 祇園", tag: "人文",
          desc: "藝伎出沒的古老街區。",
          details: "【導遊觀點】請留意街道兩旁的格柵設計，這就是京都著名的『千本格子』。這裡的配色是莫蘭迪色系的鼻祖，灰瓦紅牆，美得含蓄。",
          food: "【辻利】抹茶：體驗最純正的茶道美學。",
          mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Gion",
          price: "¥3,000"
        }
      ]
    },
    {
      day: 3, date: "04.13", area: "環球影城：奇幻全日",
      image: "https://images.unsplash.com/photo-1505991102339-da8da1f9b360?auto=format&fit=crop&w=800&q=80",
      guideNote: "放開平日的矜持，今日我們是馬力歐，是哈利波特，是這座夢幻島的主角。",
      spots: [
        { time: "08:30", title: "日本環球影城", tag: "娛樂", desc: "USJ 全日狂歡。", details: "【亮點】超級任天堂世界必衝。下午5點後的哈利波特園區燈光漸起，魔幻氛圍最濃。", access: "JR 櫻島線直達。", food: "奇諾比奧咖啡店、三根掃帚酒吧。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=USJ", price: "¥25,000" }
      ]
    },
    {
        day: 4, date: "04.14", area: "奈良公園：自然與鹿",
        image: "https://images.unsplash.com/photo-1545439611-66795499252a?auto=format&fit=crop&w=800&q=80",
        guideNote: "奈良的鹿是神的使者。在東大寺的巨大佛像前，我們能感受人的渺小與平靜。",
        spots: [
          { time: "10:00", title: "奈良公園 / 東大寺", tag: "自然", desc: "與小鹿互動，參拜大佛。", details: "東大寺的大佛殿是世界最大木造建築，氣勢恢宏。", access: "近鐵奈良線直達。", food: "志津香釜飯、中谷堂麻糬。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Nara+Park", price: "¥4,000" }
        ]
    },
    {
        day: 5, date: "04.15", area: "大阪城：櫻之城廓",
        image: "https://images.unsplash.com/photo-1528164344705-4754268799af?auto=format&fit=crop&w=800&q=80",
        guideNote: "歷史的硝煙散去，如今大阪城下只有春風。這裡是拍攝『大片』的最佳背景。",
        spots: [
          { time: "10:30", title: "大阪城天守閣", tag: "歷史", desc: "大阪的地標，輝煌的過去。", details: "護城河兩岸的櫻花與青綠色屋頂相襯，配色極佳。", access: "JR 環狀線至大阪城公園。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Osaka+Castle", price: "¥2,000" }
        ]
    },
    {
        day: 6, date: "04.16", area: "梅田：都會美學",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        guideNote: "從古建築切換到現代幾何，梅田的建築美學代表了日本的未來。",
        spots: [
          { time: "11:00", title: "梅田藍天大廈", tag: "現代", desc: "空中庭園展望台。", details: "透明電梯斜向半空，視覺震撼感極強。", access: "大阪站步行10分鐘。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Umeda+Sky+Building", price: "¥3,000" }
        ]
    },
    {
        day: 7, date: "04.17", area: "天王寺：老派大阪",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
        guideNote: "今日我們在通天閣下喝一杯清酒，感受昭和時代那份純粹的熱情。",
        spots: [
          { time: "10:30", title: "四天王寺", tag: "文化", desc: "日本最古老的官方佛寺。", details: "五重塔倒映在水池中，是心靈放空的絕佳處。", access: "天王寺站步行。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Shitennoji", price: "¥1,500" }
        ]
    },
    {
        day: 8, date: "04.18", area: "臨空城：最後採買",
        image: "https://images.unsplash.com/photo-1445013171793-f15b6301648a?auto=format&fit=crop&w=800&q=80",
        guideNote: "滿載而歸。在登機前，我們把最後的期待留給臨空城的夕陽與折扣。",
        spots: [
          { time: "10:00", title: "臨空城 Outlet", tag: "購物", desc: "回程前的瘋狂。", details: "就在關西機場對面，超過200家品牌，名牌包與美妝最後入手機會。", access: "JR 關空快速至臨空城。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Rinku+Premium+Outlets", price: "¥50,000" },
          { time: "13:10", title: "關西國際機場 (KIX)", tag: "飛行", desc: "搭乘華航 CI 157 返家。", details: "【導遊叮嚀】請提早2.5小時到達，KIX 機場很大，免稅店值得留時間逛。", mapUrl: "http://googleusercontent.com/maps.google.com/search?q=Kansai+Airport", price: "¥0" }
        ]
    }
  ];

  const prepList = [
    { title: "證件類", items: "護照、Visit Japan Web QR、eSIM 確認、機票訂單" },
    { title: "美學生活", items: "薄外套(溫差大)、分裝保養品、舒適好走的鞋、櫻花口罩" },
    { title: "數位工具", items: "ICOCA 交通卡、行動電源、Google Maps、此 App" }
  ];

  const currentDayData = itineraryData.find(d => d.day === activeDay) || itineraryData[0];
  const totalExpense = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);

  return (
    <div className="min-h-screen pb-32 overflow-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* 動態櫻花背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute animate-cherry-fall opacity-40 text-pink-300"
            style={{ 
              left: `${Math.random() * 100}%`, top: `-10%`,
              animationDelay: `${i * 3}s`, fontSize: `${12 + Math.random() * 10}px` 
            }}>🌸</div>
        ))}
      </div>

      <div className="relative z-10">
        {activeTab === 'diary' && (
          <div className="animate-in fade-in duration-700">
            <header className="p-8 pb-4 text-center sticky top-0 bg-[#F7F3F2]/80 backdrop-blur-md z-40">
              <div className="flex justify-between items-center mb-6 px-2">
                <Plane size={18} style={{ color: colors.accent }} />
                <h1 className="text-xl font-light tracking-[0.4em] uppercase">Kyoto Osaka</h1>
                <Calendar size={18} style={{ color: colors.accent }} />
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

            <main className="px-6">
              <div className="relative h-56 rounded-[3.5rem] overflow-hidden mb-8 shadow-2xl">
                <img src={currentDayData.image} className="w-full h-full object-cover" alt="View" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-xs font-light italic opacity-80">{currentDayData.date}</span>
                  <h2 className="text-3xl font-light tracking-[0.1em]">{currentDayData.area}</h2>
                </div>
              </div>

              <div className="bg-white/60 p-6 rounded-[2.5rem] mb-10 border border-white/50 backdrop-blur-sm shadow-sm">
                <p className="text-xs leading-relaxed font-light italic opacity-70">
                  <span className="font-bold mr-2" style={{ color: colors.accent }}>GUIDE :</span>
                  「{currentDayData.guideNote}」
                </p>
              </div>

              <div className="space-y-8">
                {currentDayData.spots.map((spot, i) => (
                  <div key={i} className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 active:scale-[0.98] transition-all" onClick={() => setSelectedSpot(spot)}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.accent }}>{spot.time}</span>
                      <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">{spot.tag}</span>
                    </div>
                    <h3 className="text-xl font-normal mb-3">{spot.title}</h3>
                    <p className="text-xs font-light opacity-60 line-clamp-2">{spot.desc}</p>
                    <div className="mt-6 flex items-center gap-3 text-[9px] opacity-40 uppercase tracking-[0.1em]">
                       <Train size={12} /> <span>{spot.access?.slice(0, 15)}...</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                       <span>{spot.price || ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light text-center tracking-[0.3em] mb-10">WALLET</h2>
            <div className="bg-white rounded-[3rem] p-10 shadow-xl mb-10 text-center border border-pink-50 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5" style={{ backgroundColor: colors.accent }}></div>
               <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">8-Day Total Budget</span>
               <div className="text-5xl font-light my-4 tracking-tighter" style={{ color: colors.accent }}>¥{totalExpense.toLocaleString()}</div>
               <p className="text-xs font-light opacity-40 italic mt-4">預計平均每人 ¥{Math.round(totalExpense/2).toLocaleString()}</p>
            </div>
            
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Transaction List</span>
                <Plus size={16} className="text-slate-300" />
              </div>
              {expenses.map(exp => (
                <div key={exp.id} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-sm font-normal">{exp.item}</p>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">{exp.payer} • {exp.category}</p>
                  </div>
                  <span className="text-sm font-mono font-bold" style={{ color: colors.accent }}>¥{exp.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prep' && (
          <div className="p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light text-center tracking-[0.3em] mb-10">CHECKLIST</h2>
            <div className="space-y-6">
              {prepList.map((sec, i) => (
                <div key={i} className="bg-white/60 p-8 rounded-[3rem] border border-white">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: colors.accent }}>{sec.title}</h4>
                  <p className="text-sm font-light leading-relaxed opacity-70">{sec.items}</p>
                </div>
              ))}
              <div className="bg-white p-8 rounded-[3rem] border border-pink-100 flex items-center gap-4">
                <CheckCircle2 size={24} style={{ color: colors.accent }} />
                <span className="text-xs tracking-widest opacity-60 italic uppercase">All preparations ready</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light text-center tracking-[0.3em] mb-10">GUIDE MAP</h2>
            <div className="bg-white rounded-[4rem] p-10 shadow-2xl h-[65vh] flex flex-col items-center justify-center relative overflow-hidden text-center border border-pink-50">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i11!2i1744!3i881!2m3!1e0!2sm!3i407105169!3m8!2szh-TW!3sUS!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f2!213212')] bg-cover"></div>
               <MapIcon size={64} className="mb-6 opacity-20" />
               <p className="text-[11px] tracking-[0.4em] uppercase opacity-40 font-bold mb-10">Route Integration</p>
               <div className="space-y-6 w-full px-4">
                  {[1,2,3,4,5,6,7,8].map(d => (
                    <div key={d} className="flex items-center gap-4">
                       <span className="text-[9px] font-bold opacity-30">D{d}</span>
                       <div className="h-[1px] flex-1 bg-pink-100"></div>
                       <span className="text-[8px] uppercase tracking-widest opacity-30">{itineraryData[d-1].area.slice(0,6)}</span>
                    </div>
                  ))}
               </div>
               <button onClick={() => window.open('https://www.google.com/maps', '_blank')} 
                 className="mt-12 px-10 py-5 bg-slate-900 text-white rounded-full text-[10px] tracking-[0.3em] uppercase active:scale-95 transition-all">
                 Open System Map
               </button>
            </div>
          </div>
        )}
      </div>

      {/* 景點 Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[94vh]">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Spot Heritage</span>
                <h2 className="text-2xl font-light mt-1">{selectedSpot.title}</h2>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-50 rounded-full text-slate-300"><X size={20} /></button>
            </div>
            
            <div className="space-y-10">
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.accent }}><Info size={14}/>導遊細說</h4>
                <p className="text-sm font-light leading-relaxed text-slate-500">{selectedSpot.details}</p>
              </section>

              {selectedSpot.food && (
                <section className="bg-pink-50/40 p-7 rounded-[3rem]">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.accent }}><Utensils size={14}/>味蕾記憶</h4>
                  <p className="text-sm font-light leading-relaxed text-slate-600 italic">「{selectedSpot.food}」</p>
                </section>
              )}

              <section className="bg-slate-50/80 p-7 rounded-[3rem]">
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.sub }}><Navigation2 size={14}/>交通策略</h4>
                <p className="text-[11px] font-light leading-relaxed text-slate-500 opacity-80">{selectedSpot.access}</p>
              </section>

              <div className="grid grid-cols-2 gap-4 pt-6 pb-4">
                <button onClick={() => window.open(selectedSpot.routeUrl, '_blank')} className="flex flex-col items-center justify-center py-6 rounded-[2.5rem] border border-pink-100 text-[9px] tracking-[0.2em] gap-2 active:scale-95 transition-all">
                  <Navigation2 size={18} style={{ color: colors.accent }} />路徑規劃
                </button>
                <button onClick={() => window.open(selectedSpot.mapUrl, '_blank')} className="flex flex-col items-center justify-center py-6 rounded-[2.5rem] border border-slate-100 text-[9px] tracking-[0.2em] gap-2 active:scale-95 transition-all">
                  <MapPin size={18} style={{ color: colors.sub }} />地點定位
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部導航 */}
      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-[50]">
        {[
          { id: 'diary', icon: Book, label: 'Diary' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
          { id: 'guide', icon: MapIcon, label: 'Guide' },
          { id: 'prep', icon: CheckCircle2, label: 'Prep' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 transition-all ${activeTab === tab.id ? "scale-110 opacity-100" : "opacity-20"}`}>
            <tab.icon size={22} style={{ color: activeTab === tab.id ? colors.accent : 'inherit' }} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold">{tab.label}</span>
          </button>
        ))}
      </footer>

      {/* 櫻花落下動畫 CSS */}
      <style jsx global>{`
        @keyframes cherry-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translate(100px, 100vh) rotate(360deg); opacity: 0; }
        }
        .animate-cherry-fall {
          animation: cherry-fall 12s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}