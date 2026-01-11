"use client";

import React, { useState, useMemo } from 'react';
import { 
  MapPin, Utensils, Info, ShoppingBag, ChevronDown, X, Plane, Calendar, 
  Map as MapIcon, Book, Train, Navigation2, Wallet, Plus, CheckCircle2, 
  RefreshCw, ListChecks, Menu
} from 'lucide-react';

const colors = {
  bg: "#F7F3F2",        
  card: "#FFFFFF",
  accent: "#D4A5A5",    // 莫蘭迪櫻花粉
  text: "#5D5D5A",      
  sub: "#9E9494",       
  highlight: "#E3C8C8",
  currencyBg: "#E8E2E0"
};

export default function UltimateOsakaApp() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary'); 
  const [jpyInput, setJpyInput] = useState<string>("1000");
  const exchangeRate = 0.21;

  const itineraryData = [
    {
      day: 1, date: "04.11", area: "海之啟程：神戶灣與大阪燈火",
      image: "/images/day1.jpg",
      guideStory: "「歡迎來到關西。今日我們從海上機場 UKB 入境，搭乘高速船劃過大阪灣，這是最優雅的登場方式。」",
      spots: [
        { 
          time: "10:30", title: "神戶機場 (UKB)", tag: "交通",
          details: "【位置】神戶港人工島。這座海上機場是日本精密的工程美學。【故事】2006年啟用至今，是神戶人的驕傲。3樓的展望台可看見明石海峽大橋。",
          access: "起始點：神戶機場",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=神戶機場",
          prevSpotName: "起始點", // 第一站沒有前一站
          price: "¥1,100"
        },
        { 
          time: "15:00", title: "心齋橋筋商店街", tag: "生活",
          details: "【故事】自江戶時期就是大阪的物資動脈。抬頭看巨大的廣告看板，那種喧囂與美學的衝突，就是大阪的靈魂。",
          access: "難波站出口步行 5 分鐘。",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=心齋橋筋商店街",
          prevSpotName: "神戶機場",
          food: "【明治軒】蛋包飯",
          shopping: "@cosme、大國藥妝",
          price: "¥15,000"
        }
      ]
    },
    {
      day: 2, date: "04.12", area: "古都靈魂：清水寺與花見小路",
      image: "/images/day2.jpg",
      guideStory: "「今日我們要在二寧坂的石板路上尋找落櫻的蹤跡。清水舞台的木頭香氣，會讓您忘記都市的塵囂。」",
      spots: [
        { 
          time: "09:30", title: "清水寺", tag: "史蹟",
          details: "【歷史】建於778年，全木造結構不見一根釘子。春末時分，滿山翠綠襯托著櫻色，是極致的莫蘭迪配色。",
          access: "淀屋橋搭乘京阪電車特急至清水五條。",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=清水寺",
          prevSpotName: "大阪飯店",
          food: "【藤菜美】醬油丸子",
          price: "¥500"
        },
        { 
          time: "15:00", title: "花見小路", tag: "文化",
          details: "【故事】藝伎出沒的迷宮。千本格子的木窗後，隱藏著京都最尊貴的茶屋文化。",
          access: "清水寺步行 15 分鐘。",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=花見小路",
          prevSpotName: "清水寺",
          food: "【鍵善良房】葛切粉",
          price: "¥3,000"
        }
      ]
    },
    {
      day: 3, date: "04.13", area: "奇幻冒險：USJ 全日狂歡",
      image: "/images/day3.jpg",
      guideStory: "「放開平日的緊繃，今日我們都是孩子。在任天堂世界裡，您就是馬力歐。」",
      spots: [
        { 
          time: "08:30", title: "日本環球影城", tag: "樂園", 
          details: "超級任天堂世界必衝。下午5點後哈利波特區燈光漸起，魔幻感十足。", 
          access: "JR 櫻島線直達。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=日本環球影城",
          prevSpotName: "大阪飯店",
          price: "¥25,000" 
        }
      ]
    },
    {
      day: 4, date: "04.14", area: "奈良鹿鳴：東大寺與春日大社",
      image: "/images/day4.jpg",
      guideStory: "「奈良的鹿是神的使者。在東大寺大佛的注視下，我們感受人的渺小與共生。」",
      spots: [
        { 
          time: "10:00", title: "奈良公園", tag: "自然", 
          details: "1,200隻鹿在櫻花樹下漫步。請買份鹿仙貝，優雅地與牠們共舞。", 
          access: "近鐵奈良線特急直達。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=奈良公園",
          prevSpotName: "大阪飯店",
          price: "¥4,500" 
        }
      ]
    },
    {
      day: 5, date: "04.15", area: "英雄史詩：大阪城與櫻之園",
      image: "/images/day5.jpg",
      guideStory: "「大阪城的天守閣見證了戰國梟雄的起落。今日這裡不談戰爭，只談春櫻下的寧靜。」",
      spots: [
        { 
          time: "10:30", title: "大阪城天守閣", tag: "史蹟", 
          details: "豐臣秀吉所築，德川家康重建。金色的脊樑與莫蘭迪綠的瓦片相映成趣。", 
          access: "JR 環狀線至大阪城公園站。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=大阪城天守閣",
          prevSpotName: "大阪飯店",
          price: "¥2,000" 
        }
      ]
    },
    {
      day: 6, date: "04.16", area: "幾何都會：梅田展望與美妝購物",
      image: "/images/day6.jpg",
      guideStory: "「梅田是大阪的未來感中心。站在藍天大廈看夕陽墜入大廈間，那種現代感的美學令人屏息。」",
      spots: [
        { 
          time: "11:00", title: "梅田藍天大廈", tag: "現代", 
          details: "獲選世界20大建築。兩座塔樓在空中相連，形成壯闊的環型展望台。", 
          access: "大阪站步行10分鐘。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=梅田藍天大廈",
          prevSpotName: "大阪飯店",
          price: "¥3,000" 
        }
      ]
    },
    {
      day: 7, date: "04.17", area: "昭和情懷：通天閣與下町風味",
      image: "/images/day7.jpg",
      guideStory: "「新世界保留了大阪最真實的性格——粗獷、熱情且富有色彩。」",
      spots: [
        { 
          time: "10:30", title: "通天閣", tag: "懷舊", 
          details: "二戰後重建的鐵塔，象徵大阪的精神復興。周圍炸串店林立，是最地道的大阪味。", 
          access: "地下鐵惠美須町站。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=通天閣",
          prevSpotName: "大阪飯店",
          price: "¥1,200" 
        }
      ]
    },
    {
      day: 8, date: "04.18", area: "賦歸前奏：臨空城與空港時光",
      image: "/images/day8.jpg",
      guideStory: "「帶著滿滿的回憶與戰利品告別關西。期待下一次的櫻花再見。」",
      spots: [
        { 
          time: "10:00", title: "臨空城 Outlet", tag: "購物", 
          details: "200家國際品牌，是離日前最後補貨的最佳處。就在大海旁邊。", 
          access: "JR 關空快速至臨空城。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=臨空城Outlet",
          prevSpotName: "大阪飯店",
          price: "¥50,000" 
        },
        { 
          time: "13:10", title: "關西國際機場", tag: "賦歸", 
          details: "建議提前2.5小時到場。免稅區最近剛整修完畢，非常好逛。", 
          access: "臨空城搭電車 1 站即達。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=關西國際機場",
          prevSpotName: "臨空城Outlet",
          price: "¥0" 
        }
      ]
    }
  ];

  const prepList = [
    { title: "行政證件", items: ["護照 (效期6個月以上)", "Visit Japan Web 登錄", "機票/飯店確認單", "日幣現金 & 雙幣卡"] },
    { title: "美學與日常", items: ["薄長袖 & 風衣 (4月溫差大)", "保濕美妝品 (日本乾燥)", "舒適步行的運動鞋", "櫻花口罩"] },
    { title: "數位科技", items: ["日本 eSIM 卡 (4G/5G)", "行動電源", "Google Maps 收藏夾"] }
  ];

  const currentDayData = itineraryData.find(d => d.day === activeDay) || itineraryData[0];

  // 導航函數
  const openNavigation = (mode: 'route' | 'spot') => {
    if (!selectedSpot) return;
    
    if (mode === 'spot') {
      // 模式 1: 基於目前位置導航到該景點
      window.open(selectedSpot.mapUrl, '_blank');
    } else {
      // 模式 2: 從上一站導航到這一站
      const origin = encodeURIComponent(selectedSpot.prevSpotName);
      const destination = encodeURIComponent(selectedSpot.title);
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* 櫻花花瓣效果 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute animate-petal-fall"
            style={{ 
              left: `${Math.random() * 100}%`, top: `-5%`,
              animationDelay: `${i * 1.5}s`, opacity: 0.5
            }}>
            <div className="w-3 h-4 bg-pink-200 rounded-full rotate-[15deg] shadow-sm"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {activeTab === 'diary' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="p-8 pb-4 text-center sticky top-0 bg-[#F7F3F2]/80 backdrop-blur-md z-40">
              <div className="flex justify-between items-center mb-6 px-2">
                <Plane size={18} style={{ color: colors.accent }} />
                <h1 className="text-xl font-light tracking-[0.4em] uppercase">Kyoto Osaka</h1>
                <Menu size={18} className="opacity-30" />
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
              <div className="relative h-52 rounded-[3.5rem] overflow-hidden mb-8 shadow-2xl group">
                <img src={currentDayData.image} className="w-full h-full object-cover grayscale-[0.2]" alt="Day scenery" 
                     onError={(e: any) => e.target.src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">{currentDayData.date} / {currentDayData.day}</span>
                  <h2 className="text-2xl font-light tracking-widest mt-1">{currentDayData.area}</h2>
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
                  <div key={i} className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 transition-all active:scale-[0.98]" onClick={() => setSelectedSpot(spot)}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.accent }}>{spot.time}</span>
                      <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">{spot.tag}</span>
                    </div>
                    <h3 className="text-lg font-normal mb-2">{spot.title}</h3>
                    <div className="flex items-center gap-2 mt-4 text-[9px] opacity-40 uppercase tracking-[0.1em]">
                       <Train size={12} /> <span>{spot.access.slice(0, 20)}...</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300 mx-2"></div>
                       <span>{spot.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        )}

        {/* 錢包與預算 */}
        {activeTab === 'wallet' && (
          <div className="p-10 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Wallet</h2>
             <div className="bg-white rounded-[4rem] p-10 shadow-2xl text-center border border-pink-50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100/30 rounded-full blur-2xl"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Total Estimated Budget</span>
                <div className="text-5xl font-light my-4 tracking-tighter" style={{ color: colors.accent }}>¥185,000</div>
             </div>
          </div>
        )}

        {/* 匯率換算 */}
        {activeTab === 'currency' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Currency</h2>
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

        {/* 行前清單 */}
        {activeTab === 'prep' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Checklist</h2>
            <div className="space-y-8">
              {prepList.map((sec, i) => (
                <div key={i} className="bg-white/60 p-8 rounded-[3.5rem] border border-white">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2" style={{ color: colors.accent }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>{sec.title}
                  </h4>
                  <div className="grid gap-4">
                    {sec.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm font-light opacity-70">
                        <CheckCircle2 size={16} className="text-pink-100" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 路線地圖 */}
        {activeTab === 'guide' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Guide Map</h2>
            <div className="bg-white rounded-[4rem] p-10 shadow-2xl h-[65vh] flex flex-col items-center justify-between relative overflow-hidden border border-pink-50">
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i13!2i6868!3i3528!2m3!1e0!2sm!3i600000000!3m8!2szh-TW!3sTW!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!5f2')] bg-cover"></div>
               <div className="z-10 text-center">
                 <MapIcon size={40} className="mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold">8-Day Itinerary Path</p>
               </div>
               <div className="z-10 w-full px-6 space-y-4 relative">
                  <div className="absolute left-[34px] top-6 bottom-6 w-[1px] bg-pink-100"></div>
                  {[1,2,3,4,5,6,7,8].map(d => (
                    <div key={d} className="flex items-center gap-4">
                       <div className="w-6 h-6 rounded-full border border-pink-200 bg-white flex items-center justify-center text-[8px] z-10 font-bold text-pink-300">{d}</div>
                       <div className="text-[9px] uppercase tracking-widest opacity-30">{itineraryData[d-1].area.slice(0, 10)}...</div>
                    </div>
                  ))}
               </div>
               <button onClick={() => window.open('https://www.google.com/maps/dir/Kobe+Airport/Shinsaibashi-suji/Kiyomizu-dera/Universal+Studios+Japan/Nara+Park/Osaka+Castle/Tsutenkaku/Rinku+Premium+Outlets/Kansai+International+Airport', '_blank')} 
                 className="z-10 w-full py-5 bg-slate-900 text-white rounded-full text-[10px] tracking-[0.3em] uppercase active:scale-95 transition-all shadow-lg">
                 Launch Full Route Map
               </button>
            </div>
          </div>
        )}
      </div>

      {/* 景點細節彈窗 (Modal) */}
      {selectedSpot && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[4.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom duration-600 overflow-y-auto max-h-[94vh]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Discovery / {selectedSpot.tag}</span>
                <h2 className="text-2xl font-light mt-2 leading-tight">{selectedSpot.title}</h2>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-50 rounded-full text-slate-300">
                <X size={22} />
              </button>
            </div>
            
            <div className="space-y-12">
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3" style={{ color: colors.accent }}>
                  <Info size={16}/>故事與導覽
                </h4>
                <p className="text-sm font-light leading-loose text-slate-500 text-justify">{selectedSpot.details}</p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-pink-50/40 p-6 rounded-[2.5rem]">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.accent }}>
                    <Utensils size={14}/>味蕾建議
                  </h4>
                  <p className="text-xs font-light leading-relaxed text-slate-600 italic">「{selectedSpot.food || "隨意散策"}」</p>
                </div>
                <div className="bg-slate-50/80 p-6 rounded-[2.5rem]">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: colors.sub }}>
                    <Train size={14}/>交通策略
                  </h4>
                  <p className="text-[10px] font-light leading-relaxed text-slate-500">{selectedSpot.access}</p>
                </div>
              </div>

              {/* 雙模式導航按鈕 */}
              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={() => openNavigation('route')} 
                  className="w-full py-5 rounded-full bg-slate-900 text-white text-[10px] tracking-[0.3em] uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Navigation2 size={16} /> 啟動接續導航 (從前站出發)
                </button>
                <button 
                  onClick={() => openNavigation('spot')} 
                  className="w-full py-5 rounded-full border border-slate-100 text-[10px] tracking-[0.3em] uppercase active:scale-95 transition-all text-slate-400"
                >
                  查看地點定位 (基於目前位置)
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
        .animate-petal-fall {
          animation: petal-fall 15s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}