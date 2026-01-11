"use client";

import React, { useState } from 'react';
import { MapPin, Utensils, Info, ShoppingBag, ChevronDown, X, Plane, Calendar, Map as MapIcon, Book, Train, Navigation2, Camera } from 'lucide-react';

const colors = {
  bg: "#F7F3F2",        
  card: "#FFFFFF",
  accent: "#D4A5A5",    
  text: "#5D5D5A",      
  sub: "#9E9494",       
  highlight: "#E3C8C8",
  transport: "#B8C5D6"  
};

export default function OsakaFullItinerary() {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diary');

  const itineraryData = [
    {
      day: 1, date: "04.11 (Sat)", area: "入境 / 心齋橋",
      spots: [
        { time: "10:30", title: "抵達神戶機場 (UKB)", desc: "星宇航空 JX 834 抵達。", details: "抵達後建議先在機場航廈簡單整頓。神戶機場前往大阪非常方便，可以選擇搭乘「神戶高速船」橫跨大阪灣，約30分鐘即可抵達關西機場轉乘，或是搭乘港灣人工島線進入市區。", access: "起始點：神戶機場 UKB", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kobe+Airport", routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Kobe+Airport", tag: "Arrival" },
        { time: "15:00", title: "心齋橋筋 / 飯店進房", desc: "大阪最熱鬧的購物動脈。", details: "此時正值櫻花季尾聲，心齋橋筋雖然沒有櫻花，但各大品牌會有春季限定商品。這裡是藥妝採買的大本營。", access: "搭乘港灣人工島線至「三宮站」，轉乘阪神難波線直達「大阪難波站」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Shinsaibashi-suji+Shopping+Street", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Kobe+Airport&destination=Shinsaibashi-suji+Shopping+Street", food: "【明治軒】蛋包飯：復古洋食風味。\n【道頓堀赤鬼】章魚燒：米其林推薦。", shopping: "【大國藥妝】、【松本清】、【Disney Store】。", tag: "Shopping" }
      ]
    },
    {
      day: 2, date: "04.12 (Sun)", area: "京都東山區",
      spots: [
        { time: "09:30", title: "清水寺", desc: "世界文化遺產，絕美清水舞台。", details: "此處是京都攝影首選。建議從清水道上山，參觀完後沿著二寧坂、產寧坂散步至八坂神社。", access: "從難波搭乘地下鐵至「淀屋橋」，轉乘京阪本線（特急）至「清水五條站」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Shinsaibashi&destination=Kiyomizu-dera", food: "【奧丹清水】豆腐料理：百年老店。\n【藤菜美】醬油丸子。", tag: "Culture" },
        { time: "14:00", title: "祇園 / 花見小路", desc: "藝伎出沒的古老街道。", details: "傳統木造建築與石板路，非常有美容業追求的靜謐美學感。適合安排下午茶休息。", access: "從清水寺徒步約15-20分鐘即可到達。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Gion+Hanamikoji", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Kiyomizu-dera&destination=Gion+Hanamikoji", food: "【辻利】抹茶冰淇淋。\n【鍵善良房】葛切粉。", tag: "Photo" }
      ]
    },
    {
      day: 3, date: "04.13 (Mon)", area: "日本環球影城",
      spots: [
        { time: "08:30", title: "日本環球影城 (USJ)", desc: "全日狂歡，任天堂世界必衝。", details: "建議提早一小時排隊。4月中旬氣溫宜人，適合戶外排隊。必玩：瑪利歐賽車、哈利波特禁忌之旅。", access: "搭乘JR環狀線至「西九條站」，轉乘JR櫻島線至「Universal City」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Namba&destination=Universal+Studios+Japan", food: "【奇諾比奧咖啡店】任天堂園區。\n【三根掃帚】哈利波特園區。", tag: "USJ" }
      ]
    },
    {
      day: 4, date: "04.14 (Tue)", area: "奈良公園區",
      spots: [
        { time: "10:00", title: "奈良公園 / 東大寺", desc: "與神鹿與大佛的約會。", details: "奈良公園櫻花種類繁多，此時可能仍有晚櫻盛開。東大寺的大佛殿是世界最大的木造建築，氣勢磅礴。", access: "從大阪難波站搭乘「近鐵奈良線（快急）」直達奈良站。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Nara+Park", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Namba&destination=Nara+Park", food: "【志津香】釜飯：奈良必吃，建議早點排隊。\n【中谷堂】艾草麻糬。", tag: "Nature" }
      ]
    },
    {
      day: 5, date: "04.15 (Wed)", area: "大阪歷史區",
      spots: [
        { time: "10:30", title: "大阪城公園 / 天守閣", desc: "大阪的地標，輝煌的歷史見證。", details: "大阪城公園是著名的賞櫻勝地，綠意與古城牆的配色非常優雅。可以登上天守閣俯瞰整個大阪市區。", access: "搭乘JR環狀線至「大阪城公園站」或地下鐵「谷町四丁目站」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Castle", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Namba&destination=Osaka+Castle", food: "【JO-TERRACE】商場內有多樣化餐廳。\n【得正】咖哩烏龍麵。", tag: "History" }
      ]
    },
    {
      day: 6, date: "04.16 (Thu)", area: "梅田 / 現代美學",
      spots: [
        { time: "11:00", title: "梅田藍天大廈", desc: "空中庭園，幾何建築之美。", details: "非常有設計感的建築，半開放式的空中展望台可以吹著風看風景，對於喜愛美學設計的人來說是必去之地。", access: "搭乘地下鐵御堂筋線至「梅田站」，步行約10分鐘。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Umeda+Sky+Building", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Osaka+Castle&destination=Umeda+Sky+Building", food: "【滝見小路】地下美食街：昭和懷舊風。\n【きじ】大阪燒：超人氣老店。", tag: "Modern" },
        { time: "16:00", title: "LUCUA / Grand Front", desc: "精品百貨與生活美學採購。", details: "梅田是大阪的高端購物區，這裡的選物店設計感極強，適合尋找美容業相關的精緻禮品。", access: "步行即可抵達。", mapUrl: "https://www.google.com/maps/search/?api=1&query=LUCUA+Osaka", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Umeda+Sky+Building&destination=LUCUA+Osaka", shopping: "【@cosme】美妝大賞店、各大專櫃品牌。", tag: "Shopping" }
      ]
    },
    {
      day: 7, date: "04.17 (Fri)", area: "天王寺 / 慢活",
      spots: [
        { time: "10:30", title: "四天王寺 / 通天閣", desc: "深度感受大阪的下町靈魂。", details: "四天王寺是日本最古老的官寺，氛圍寧靜。通天閣則是大阪的精神象徵，周圍的新世界區域充滿懷舊與熱情。", access: "搭乘地下鐵御堂筋線至「動物園前站」或「天王寺站」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Tsutenkaku", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Namba&destination=Tsutenkaku", food: "【串炸達摩】通天閣元祖串炸。\n【釣船茶屋】可以自己釣魚的餐廳。", tag: "Retro" }
      ]
    },
    {
      day: 8, date: "04.18 (Sat)", area: "關西機場 / 賦歸",
      spots: [
        { time: "09:30", title: "臨空城 Outlet (Rinku)", desc: "最後衝刺，名牌折扣中心。", details: "位於機場對面，適合在登機前進行最後的行李填補。這裡的品牌非常多樣，也有不少日系品牌。", access: "從難波搭乘「南海電鐵」或「JR關空快速」至「臨空城站」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Rinku+Premium+Outlets", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Namba&destination=Rinku+Premium+Outlets", tag: "Final Shopping" },
        { time: "11:30", title: "關西國際機場 (KIX)", desc: "搭乘中華航空 CI 157 帶著回憶返家。", details: "建議提前2小時到達機場辦理報到手續。機場內也有不少美食與伴手禮店可做最後補貨。", access: "搭乘接駁車或一站電車至「關西機場站」。", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport", routeUrl: "https://www.google.com/maps/dir/?api=1&origin=Rinku+Premium+Outlets&destination=Kansai+International+Airport", food: "機場內神座拉麵。", tag: "Flight" }
      ]
    }
  ];

  const currentDayData = itineraryData.find(d => d.day === activeDay);

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <header className="p-8 pb-4 text-center sticky top-0 bg-[#F7F3F2]/90 backdrop-blur-md z-40">
        <div className="flex justify-between items-center mb-4 px-2">
          <Plane size={18} style={{ color: colors.accent }} />
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Kyoto Osaka</h1>
          <Calendar size={18} style={{ color: colors.accent }} />
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {itineraryData.map((item) => (
            <button
              key={item.day}
              onClick={() => setActiveDay(item.day)}
              className={`flex-shrink-0 px-5 py-2 rounded-2xl text-[10px] tracking-widest transition-all duration-500 ${
                activeDay === item.day ? "shadow-md" : "opacity-40"
              }`}
              style={{ 
                backgroundColor: activeDay === item.day ? colors.accent : "white",
                color: activeDay === item.day ? "white" : colors.text,
                border: `1px solid ${colors.highlight}`
              }}
            >
              DAY {item.day}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'diary' ? (
        <div className="px-6 mt-4 animate-in fade-in duration-500">
          <div className="mb-8 flex items-baseline gap-3 px-2">
            <span className="text-4xl font-light italic" style={{ color: colors.accent }}>{currentDayData?.date.split(' ')[0]}</span>
            <span className="text-[10px] tracking-[0.2em] opacity-60 uppercase">{currentDayData?.area}</span>
          </div>

          <div className="space-y-8">
            {currentDayData?.spots.map((spot, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-100/30" onClick={() => setSelectedSpot(spot)}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono tracking-tighter" style={{ color: colors.sub }}>{spot.time}</span>
                  <span className="text-[9px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: colors.bg, color: colors.accent }}>{spot.tag}</span>
                </div>
                <h3 className="text-xl font-normal mb-3 tracking-tight">{spot.title}</h3>
                <p className="text-xs font-light leading-relaxed opacity-70 mb-6 line-clamp-2">{spot.desc}</p>
                <div className="flex items-start gap-2 bg-slate-50/50 p-4 rounded-2xl">
                  <Train size={14} className="mt-0.5 opacity-40" />
                  <p className="text-[10px] leading-relaxed opacity-60">{spot.access}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-10">
           <MapIcon size={48} className="mb-6 opacity-20" />
           <p className="text-xs tracking-[0.2em] font-light leading-loose opacity-40 italic">
             「地圖功能開發中」<br/>未來將整合 Google Maps 實時導航
           </p>
        </div>
      )}

      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[92vh]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40">Discovery</span>
                <h2 className="text-2xl font-light mt-1">{selectedSpot.title}</h2>
              </div>
              <button onClick={() => setSelectedSpot(null)} className="p-3 bg-slate-50 rounded-full text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8 mb-10">
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: colors.accent }}><Info size={14}/>景點細節</h4>
                <p className="text-sm font-light leading-relaxed text-slate-500">{selectedSpot.details}</p>
              </section>

              {selectedSpot.food && (
                <section className="bg-pink-50/30 p-6 rounded-[2.5rem]">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: colors.accent }}><Utensils size={14}/>美食推薦</h4>
                  <div className="text-sm font-light leading-loose text-slate-600 whitespace-pre-line italic">「{selectedSpot.food}」</div>
                </section>
              )}

              {selectedSpot.shopping && (
                <section className="bg-slate-50/50 p-6 rounded-[2.5rem]">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: colors.sub }}><ShoppingBag size={14}/>必買清單</h4>
                  <p className="text-sm font-light text-slate-600 whitespace-pre-line">{selectedSpot.shopping}</p>
                </section>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={() => window.open(selectedSpot.routeUrl, '_blank')} className="flex flex-col items-center justify-center py-5 rounded-[2rem] border border-pink-100 text-[9px] tracking-[0.2em] gap-2 active:scale-95 transition-all">
                  <Navigation2 size={18} style={{ color: colors.accent }} />路徑導航
                </button>
                <button onClick={() => window.open(selectedSpot.mapUrl, '_blank')} className="flex flex-col items-center justify-center py-5 rounded-[2rem] border border-slate-100 text-[9px] tracking-[0.2em] gap-2 active:scale-95 transition-all">
                  <MapPin size={18} style={{ color: colors.sub }} />地點位置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-pink-50 p-8 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('guide')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'guide' ? "scale-110 opacity-100" : "opacity-20"}`}>
          <MapIcon size={22} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Guide</span>
        </button>
        <button onClick={() => setActiveTab('diary')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'diary' ? "scale-110 opacity-100" : "opacity-20"}`}>
          <Book size={22} style={{ color: activeTab === 'diary' ? colors.accent : 'inherit' }} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Diary</span>
        </button>
      </footer>
    </div>
  );
}