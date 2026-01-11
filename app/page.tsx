"use client";

import React, { useState, useMemo } from 'react';
import { 
  MapPin, Utensils, Info, ShoppingBag, ChevronDown, X, Plane, Calendar, 
  Map as MapIcon, Book, Train, Navigation2, Wallet, Plus, CheckCircle2, 
  RefreshCw, ListChecks, Menu, PlusCircle, Camera, History, Landmark
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

export default function LuxuryTravelGuide() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary'); // diary, wallet, currency, guide, prep
  const [jpyInput, setJpyInput] = useState<string>("1000");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const exchangeRate = 0.21; 

  // --- 行程資料擴充 (參考大阪周遊卡細分化) ---
  const [itineraryData, setItineraryData] = useState([
    {
      day: 1, date: "04.11", area: "神戶入境・難波初探",
      image: "/images/day1.jpg", 
      guideStory: "「歡迎來到關西。今日我們避開了關西機場的混亂，從海上機場 UKB 入境。當高速船劃過大海，大阪的霓虹正為您點亮。」",
      spots: [
        { 
          time: "10:30", title: "神戶機場 (UKB) 抵達", tag: "交通",
          details: "【位置】神戶港人工島。這座海上機場是日本工程美學的縮影。【亮點】3樓展望台。在此處可以與星宇航空合影，並遠眺明石海峽大橋，那裡是神戶通往世界的門戶。",
          access: "搭乘 Port Liner 至三宮，轉乘阪神難波線直達大阪難波。",
          food: "機場神戶牛咖哩麵包", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/dir/%3Fapi%3D1%26origin%3DKobe%2BAirport%26destination%3DShinsaibashi-suji%2BShopping%2BStreet", price: "¥1,100"
        },
        { 
          time: "16:00", title: "心齋橋筋 / 難波散策", tag: "購物",
          details: "【歷史】江戶時代起便是『天下的廚房』。【故事】走過戎橋，請留意那巨大的固力果跑跑人，他象徵著大阪戰後的復興與繁榮。這裡有日本最長之一的商店街，是美妝與時尚的一級戰區。",
          access: "難波站步行 5 分鐘。",
          food: "【明治軒】紅酒醬蛋包飯", shopping: "@cosme、大國藥妝", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/search/%3Fapi%3D1%26query%3DShinsaibashi-suji%2BShopping%2BStreet", price: "¥15,000"
        }
      ]
    },
    {
      day: 2, date: "04.12", area: "京都東山・千年櫻語",
      image: "/images/day2.jpg",
      guideStory: "「今日我們穿越時空回到江戶與平安。京都的櫻花雖已近尾聲，但石板路上的落櫻會帶給我們另一種靜謐的感動。」",
      spots: [
        { 
          time: "09:30", title: "清水寺・世界文化遺產", tag: "文化",
          details: "【歷史】建於778年，全木造結構未用一根釘子。【亮點】懸空的清水舞台。在此處俯瞰京都，感受那種『從清水舞台跳下去』的堅定勇氣。音羽瀑布的清泉分別代表健康、戀愛與長壽，請擇一品嚐。",
          access: "淀屋橋轉京阪電車至清水五條。",
          food: "【藤菜美】醬油丸子", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera", price: "¥500"
        },
        { 
          time: "14:00", title: "二寧坂・產寧坂散步", tag: "散策",
          details: "【特色】保留完整的石板路與古建築，是京都美學的靈魂。傳說在此處跌倒會有霉運，但也象徵著我們要『更加謹慎地面對美好生活』。",
          mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/dir/%3Fapi%3D1%26origin%3DShinsaibashi%26destination%3DKiyomizu-dera", price: "¥0"
        }
      ]
    },
    {
      day: 3, date: "04.13", area: "環球影城・夢幻全日",
      image: "/images/day3.jpg",
      guideStory: "「今日放開矜持，您就是馬力歐，是哈利波特。在這座夢幻島上，每個人都有擁有魔法的權利。」",
      spots: [
        { time: "08:30", title: "USJ 全日冒險", tag: "樂園", details: "超級任天堂世界必衝。下午5點後的哈利波特區燈光漸起，魔幻感十足。", access: "JR 櫻島線直達。", mapUrl: "https://www.google.com/maps/search/?api=1&query=USJ", price: "¥25,000" }
      ]
    },
    {
      day: 4, date: "04.14", area: "奈良鹿鳴・古城歷史",
      image: "/images/day4.jpg",
      guideStory: "「奈良的鹿是神的使者。在東大寺大佛的注視下，我們能感受人的渺小與共生。」",
      spots: [
        { 
          time: "10:00", title: "奈良公園・東大寺", tag: "自然",
          details: "【歷史】大佛殿是世界最大木造建築。【故事】1200隻鹿在此悠閒生活。請買份鹿仙貝，優雅地與牠們共舞，感受自然界的純粹。",
          access: "近鐵奈良線特急直達。",
          food: "志津香釜飯", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nara+Park", price: "¥4,000"
        }
      ]
    },
    {
      day: 5, date: "04.15", area: "大阪周遊卡 A：歷史迴廊",
      image: "/images/day5.jpg",
      guideStory: "「今日我們啟動『大阪周遊卡』。不再是單點看大阪城，而是要從水路、園區與地標全方位解鎖這座英傑之城。」",
      spots: [
        { 
          time: "09:30", title: "大阪城御座船 (周遊卡免費)", tag: "體驗",
          details: "【特色】仿豐臣秀吉『鳳凰丸』打造的黃金船。【亮點】從護城河低角度仰望天守閣，那是昔日大將軍才能擁有的視角。這是大阪城拍照最美的角度之一。",
          access: "JR 大阪城公園站。", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/search/%3Fapi%3D1%26query%3DKiyomizu-dera", price: "¥0 (周遊卡)"
        },
        { 
          time: "11:00", title: "大阪城天守閣", tag: "史蹟",
          details: "【歷史】見證豐臣與德川家的興亡。天守閣內的歷史博物館詳細記錄了戰國故事。登上頂樓展望台，大阪市景盡收眼底。",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Castle", price: "¥0 (周遊卡)"
        },
        { 
          time: "13:30", title: "大阪歷史博物館", tag: "知性",
          details: "【地點】位於大阪城對面。10樓可以俯瞰大阪城全景。透過等比例模型，看見大阪從古代難波宮到現代的變遷。",
          mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/dir/%3Fapi%3D1%26origin%3DKyoto%2BStation%26destination%3DUniversal%2BStudios%2BJapan", price: "¥0 (周遊卡)"
        },
        { 
          time: "15:30", title: "大阪生活今昔館", tag: "懷舊",
          details: "【故事】重現江戶時期的大阪街道。您可以換上和服，走在虛擬的天色變化下，體驗古日本的一天。",
          access: "地下鐵天神橋筋六丁目站。", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/search/%3Fapi%3D1%26query%3DUniversal%2BStudios%2BJapan", price: "¥0 (周遊卡)"
        }
      ]
    },
    {
      day: 6, date: "04.16", area: "大阪周遊卡 B：未來都會",
      image: "/images/day6.jpg",
      guideStory: "「從海港到雲端，今日我們要挑戰大阪的最高視野。在藍天大廈看夕陽墜入大廈間，是旅程最浪漫的時分。」",
      spots: [
        { 
          time: "11:00", title: "天保山大摩天輪", tag: "景觀",
          details: "【位置】大阪港區。曾是世界最大摩天輪。15分鐘的航程可以看見明石海峽大橋。推薦搭乘底部透明的車廂（須排隊）。",
          access: "地下鐵大阪港站。", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/dir/%3Fapi%3D1%26origin%3DOsaka%2BStation%26destination%3DNara%2BPark", price: "¥0 (周遊卡)"
        },
        { 
          time: "14:00", title: "聖瑪麗亞號・帆船型遊船", tag: "體驗",
          details: "【故事】仿哥倫布發現新大陸的帆船放大兩倍製成。航行在大阪灣，感受大航海時代的壯闊美感。",
          mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/search/%3Fapi%3D1%26query%3DNara%2BPark", price: "¥0 (周遊卡)"
        },
        { 
          time: "17:30", title: "梅田藍天大廈空中庭園", tag: "浪漫",
          details: "【亮點】圓形頂部露天展望台。15:00 前周遊卡免費。夜晚點燈後地板會散發星光，與遠方的都會霓虹交織成一幅未來主義的畫作。",
          access: "梅田站步行 10 分鐘。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Umeda+Sky+Building", price: "¥2,000 (15時後八折)"
        }
      ]
    },
    {
      day: 7, date: "04.17", area: "新世界・昭和魂",
      image: "/images/day7.jpg",
      guideStory: "「今日我們來到大阪最具煙火氣息的地方。在通天閣下喝一杯清酒，那是大阪老靈魂的滋味。」",
      spots: [
        { 
          time: "11:00", title: "通天閣 / TOWER SLIDER", tag: "刺激",
          details: "【歷史】大阪戰後復興的象徵。新增的 60 公尺溜滑梯僅需 10 秒就能滑到底，是勇者的挑戰。別忘了摸摸比利肯 (Billiken) 的腳尖，他會帶來好運。",
          access: "地下鐵惠美須町站。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Tsutenkaku", price: "¥1,200 (一般展望)"
        }
      ]
    },
    {
      day: 8, date: "04.18", area: "歸途・滿載而歸",
      image: "/images/day8.jpg",
      guideStory: "「櫻花會落，但回憶會長存。在臨空城的摩天輪前告別關西，我們下個櫻花季再見。」",
      spots: [
        { 
          time: "10:00", title: "臨空城 Outlet (Rinku)", tag: "購物",
          details: "【位置】關西機場對面。這是離境前最後的補貨站。大海、摩天輪與名牌精品，是完美的最後拼圖。",
          access: "JR 關空快速直達。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Rinku+Outlet", price: "¥50,000"
        },
        { time: "11:30", title: "KIX 關西機場 / CI 157", tag: "賦歸", details: "帶上伴手禮與心情，我們回台北了。", mapUrl: "https://www.google.com/search?q=https://www.google.com/maps/dir/%3Fapi%3D1%26origin%3DNamba%2BStation%26destination%3DKansai%2BInternational%2BAirport", price: "¥0" }
      ]
    }
  ]);

  const prepList = [
    { title: "行政準備", items: ["護照 (效期6個月)", "Visit Japan Web 登錄", "機票/飯店確認單 (電子+紙本)", "日幣現金 & 雙幣信用卡"] },
    { title: "美學與日常", items: ["薄外套 (4月溫差大)", "分裝保養品 (日本乾燥)", "舒適步行的運動鞋 (每日2萬步)", "櫻花口罩 & 隨身面紙"] },
    { title: "數位工具", items: ["日本 eSIM (5G 高速)", "行動電源 10000mAh", "Google Maps 收藏景點", "Suica/ICOCA 交通卡"] }
  ];

  // --- 邏輯功能處理 ---
  const currentDayData = itineraryData.find(d => d.day === activeDay) || itineraryData[0];
  
  const totalExpense = useMemo(() => {
    let sum = 0;
    itineraryData.forEach(day => day.spots.forEach(s => {
      const p = s.price?.replace(/[^\d]/g, '');
      if(p) sum += parseInt(p);
    }));
    return sum;
  }, [itineraryData]);

  const addNewSpot = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSpot = {
      time: formData.get('time') as string,
      title: formData.get('title') as string,
      tag: "Custom",
      details: formData.get('details') as string,
      access: "手動規劃",
      mapUrl: `http://googleusercontent.com/maps.google.com/search?q=${formData.get('title')}`,
      price: `¥${formData.get('price') || 0}`
    };
    setItineraryData(prev => prev.map(day => 
      day.day === activeDay ? { ...day, spots: [...day.spots, newSpot] } : day
    ));
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* 動態落櫻效果 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute animate-petal-fall"
            style={{ left: `${Math.random() * 100}%`, top: `-5%`, animationDelay: `${i * 1.8}s`, opacity: 0.4 }}>
            <div className="w-3 h-4 bg-pink-200 rounded-full rotate-[15deg] shadow-sm"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* --- 行程日記分頁 --- */}
        {activeTab === 'diary' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="p-8 pb-4 text-center sticky top-0 bg-[#F7F3F2]/80 backdrop-blur-md z-40 border-b border-pink-50">
              <div className="flex justify-between items-center mb-6">
                <Plane size={18} style={{ color: colors.accent }} />
                <h1 className="text-xl font-light tracking-[0.4em] uppercase">2026 OSAKA</h1>
                <button onClick={() => setIsAddModalOpen(true)}><PlusCircle size={22} style={{ color: colors.accent }} /></button>
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

            <main className="px-6 mt-6">
              <div className="relative h-52 rounded-[3.5rem] overflow-hidden mb-8 shadow-2xl">
                <img src={currentDayData.image} className="w-full h-full object-cover grayscale-[0.2]" alt="Scenery" 
                     onError={(e: any) => e.target.src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-[10px] tracking-[0.2em] opacity-70 italic">{currentDayData.date} / DAY {currentDayData.day}</span>
                  <h2 className="text-2xl font-light tracking-widest mt-1">{currentDayData.area}</h2>
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
                  <div key={i} className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 transition-all active:scale-[0.98]" onClick={() => setSelectedSpot(spot)}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                         <span className="text-[10px] font-mono tracking-tighter opacity-60">{spot.time}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">{spot.tag}</span>
                    </div>
                    <h3 className="text-lg font-normal mb-2 leading-tight">{spot.title}</h3>
                    <div className="flex items-center gap-2 mt-4 text-[9px] opacity-40 uppercase tracking-[0.1em]">
                       <Train size={12} /> <span>{spot.access?.slice(0, 20)}...</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300 mx-2"></div>
                       <span>{spot.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        )}

        {/* --- 匯率工具小分頁 --- */}
        {activeTab === 'currency' && (
          <div className="p-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Currency</h2>
            <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-pink-50">
               <div className="flex flex-col gap-10">
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 block mb-4 ml-4">Japanese Yen (JPY)</label>
                    <div className="flex items-center bg-slate-50 p-6 rounded-[2rem] border border-transparent group-focus-within:border-pink-200">
                      <span className="text-xl font-light mr-4 opacity-40">¥</span>
                      <input type="number" value={jpyInput} onChange={(e) => setJpyInput(e.target.value)} className="bg-transparent text-2xl font-light outline-none w-full" />
                    </div>
                  </div>
                  <div className="flex justify-center"><RefreshCw size={24} className="text-pink-300 rotate-90" /></div>
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-30 block mb-4 ml-4">Taiwan Dollar (TWD)</label>
                    <div className="flex items-center bg-pink-50/30 p-6 rounded-[2rem] border border-pink-100">
                      <span className="text-xl font-light mr-4 opacity-40">$</span>
                      <div className="text-2xl font-light">{(Number(jpyInput) * exchangeRate).toFixed(0)}</div>
                    </div>
                  </div>
               </div>
               <p className="text-[10px] text-center mt-12 opacity-30 tracking-widest italic font-light">Estimated Rate: 0.21</p>
            </div>
          </div>
        )}

        {/* --- 行程路徑 Guide --- */}
        {activeTab === 'guide' && (
          <div className="p-10 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Roadmap</h2>
             <div className="bg-white rounded-[4rem] p-12 shadow-2xl relative border border-pink-50 min-h-[60vh]">
                <div className="absolute left-[38px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-pink-200 via-pink-100 to-transparent"></div>
                <div className="space-y-12 relative">
                   {itineraryData.map(d => (
                     <div key={d.day} className="flex gap-6 items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-pink-100 bg-white z-10 flex items-center justify-center text-[9px] font-bold text-pink-300">
                          {d.day}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.1em] opacity-30 mb-1">{d.date}</p>
                          <p className="text-xs font-light tracking-widest">{d.area.split('：')[0]}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="mt-16 w-full py-5 bg-slate-900 text-white rounded-full text-[10px] tracking-[0.3em] uppercase shadow-lg">Open Google Maps</button>
             </div>
          </div>
        )}

        {/* --- 帳本 Wallet --- */}
        {activeTab === 'wallet' && (
          <div className="p-10 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Statistics</h2>
             <div className="bg-white rounded-[4rem] p-12 shadow-2xl text-center border border-pink-50">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Total Estimated Budget</span>
                <div className="text-5xl font-light my-4 tracking-tighter" style={{ color: colors.accent }}>¥{totalExpense.toLocaleString()}</div>
                <div className="h-[1px] w-12 bg-pink-50 mx-auto my-6"></div>
                <p className="text-xs font-light opacity-30 italic leading-loose">
                  包含門票、交通預估及基本購物。<br/>不含大項機票費用。
                </p>
             </div>
          </div>
        )}

        {/* --- 準備 Prep --- */}
        {activeTab === 'prep' && (
          <div className="p-10 animate-in fade-in duration-500">
             <h2 className="text-2xl font-light tracking-[0.4em] text-center mb-10 uppercase">Checklist</h2>
             <div className="space-y-8">
                {prepList.map((sec, i) => (
                  <div key={i} className="bg-white/60 p-8 rounded-[3.5rem] border border-white">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3" style={{ color: colors.accent }}>
                      <CheckCircle2 size={16}/>{sec.title}
                    </h4>
                    <div className="grid gap-5">
                      {sec.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-xs font-light opacity-70">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-100"></div>
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

      {/* --- 全域通用組件：景點詳情 Modal --- */}
      {selectedSpot && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[4.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom duration-600 overflow-y-auto max-h-[94vh]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 italic">Discovery / {selectedSpot.tag}</span>
                <h2 className="text-2xl font-light mt-2 leading-tight">{selectedSpot.title}</h2>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-50 rounded-full text-slate-300"><X size={22} /></button>
            </div>
            <div className="space-y-12 pb-10">
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 text-pink-300 flex items-center gap-2"><History size={16}/>故事與導覽</h4>
                <p className="text-sm font-light leading-loose text-slate-500 text-justify">{selectedSpot.details}</p>
              </section>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-pink-50/30 p-6 rounded-[2.5rem]">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] mb-3 text-pink-300"><Utensils size={14} className="inline mr-2"/>味蕾</h4>
                  <p className="text-xs font-light italic text-slate-600">「{selectedSpot.food || "隨意散策"}」</p>
                </div>
                <div className="bg-slate-50/80 p-6 rounded-[2.5rem]">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] mb-3 text-slate-400"><Navigation2 size={14} className="inline mr-2"/>位置</h4>
                  <p className="text-[10px] font-light text-slate-500">{selectedSpot.access}</p>
                </div>
              </div>
              <button onClick={() => window.open(selectedSpot.mapUrl, '_blank')} 
                className="w-full py-5 rounded-full bg-slate-900 text-white text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-xl">
                <Navigation2 size={16} /> 啟動衛星導覽
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 新增行程彈窗 --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
          <form onSubmit={addNewSpot} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light tracking-widest">新增 D{activeDay} 行程</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)}><X size={20}/></button>
            </div>
            <div className="space-y-4">
               <input name="time" placeholder="時間 (例如 12:00)" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs" required />
               <input name="title" placeholder="景點名稱" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs" required />
               <textarea name="details" placeholder="景點故事 (可參考導遊風格)" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs h-32" required />
               <input name="price" placeholder="預估預算 (JPY)" type="number" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs" />
            </div>
            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-full text-xs tracking-widest uppercase shadow-lg">確認加入</button>
          </form>
        </div>
      )}

      {/* --- 底部全局導航列 --- */}
      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-[50]">
        {[
          { id: 'diary', icon: Book, label: 'Diary' },
          { id: 'currency', icon: RefreshCw, label: 'Exch.' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
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