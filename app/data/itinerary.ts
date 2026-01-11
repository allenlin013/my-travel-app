// app/data/itinerary.ts

export const PAYERS = ["YenLin", "CC", "Fu", "Wen", "Dad", "Sister"];

export interface Expense {
  id: string;
  item: string;
  amount: number;
  currency: 'JPY' | 'TWD';
  payer: string;
}

export interface Spot {
  id: string;
  time: string;
  title: string;
  tag: string;
  details: string;
  access: string;
  mapUrl: string;
  prevSpotName: string;
  expenses: Expense[];
  food?: string;      
  shopping?: string;  
}

export interface ItineraryDay {
  day: number;
  date: string;
  area: string;
  image: string;
  weather: {
    icon: string;
    temp: string;
    desc: string;
  };
  guideStory: string;
  spots: Spot[];
}

export const colors = {
  bg: "#F7F3F2",        
  card: "#FFFFFF",
  accent: "#D4A5A5",    // 莫蘭迪櫻花粉
  text: "#5D5D5A",      
  sub: "#9E9494",       
  highlight: "#E3C8C8",
  currencyBg: "#E8E2E0"
};

export const defaultExchangeRate = 0.215;

// 固定支出 (機票/住宿)
export const initialFixedExpenses: Expense[] = [
  { id: 'f1', item: '星宇航空機票 (TPE-UKB/KIX-TPE)', amount: 12000, currency: 'TWD', payer: 'YenLin' },
  { id: 'f2', item: '大阪難波大和ROYNET飯店 (7晚)', amount: 120000, currency: 'JPY', payer: 'Dad' },
  { id: 'f3', item: '日本 eSIM 網卡 (8天吃到飽)', amount: 600, currency: 'TWD', payer: 'Sister' }
];

export const itineraryData: ItineraryDay[] = [
  {
    day: 1, date: "04.11", area: "海之啟程：神戶灣與大阪燈火",
    image: "/images/day1.jpg",
    weather: { icon: "Sunny", temp: "16°C - 22°C", desc: "晴時多雲" },
    guideStory: "「歡迎來到關西。今日我們從精緻的海上機場 UKB 入境，搭乘高速船劃過大阪灣，這是最優雅的登場方式。」",
    spots: [
      { 
        id: 'd1-s1',
        time: "10:30", title: "神戶機場 (UKB)", tag: "交通",
        details: "【歷史背景】這座填海而成的機場體現了日本精密的工程美學。3樓的展望台可看見明石海峽大橋。",
        access: "起始點：神戶機場",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=神戶機場",
        prevSpotName: "起始點",
        expenses: [
          { id: 'e1', item: '高速船票', amount: 500, currency: 'JPY', payer: 'Dad' },
          { id: 'e2', item: '電車費', amount: 600, currency: 'JPY', payer: 'Dad' }
        ]
      },
      { 
        id: 'd1-s2',
        time: "15:00", title: "心齋橋筋商店街", tag: "生活",
        details: "【故事】自江戶時期就是大阪的物資動脈。抬頭看巨大的廣告看板，那種喧囂與美學的衝突，就是大阪的靈魂。",
        access: "難波站出口步行 5 分鐘。",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=心齋橋筋商店街",
        prevSpotName: "神戶機場",
        food: "【明治軒】蛋包飯",
        shopping: "@cosme、大國藥妝",
        expenses: [
          { id: 'e3', item: '明治軒午餐', amount: 4000, currency: 'JPY', payer: 'Dad' },
          { id: 'e4', item: '藥妝採購', amount: 11000, currency: 'JPY', payer: 'Sister' }
        ]
      }
    ]
  },
  {
    day: 2, date: "04.12", area: "古都靈魂：清水寺與花見小路",
    image: "/images/day2.jpg",
    weather: { icon: "Cloudy", temp: "14°C - 20°C", desc: "多雲轉晴" },
    guideStory: "「今日我們要在二寧坂的石板路上尋找落櫻的蹤跡。清水舞台的木頭香氣，會讓您忘記都市的塵囂。」",
    spots: [
      { 
        id: 'd2-s1',
        time: "09:30", title: "清水寺", tag: "史蹟",
        details: "【歷史】建於778年，全木造結構不見一根釘子。春末時分，滿山翠綠襯托著櫻色，是極致的莫蘭迪配色。",
        access: "淀屋橋搭乘京阪電車特急至清水五條。",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=清水寺",
        prevSpotName: "大阪飯店",
        food: "【藤菜美】醬油丸子",
        expenses: [
          { id: 'e5', item: '拜觀料', amount: 500, currency: 'JPY', payer: 'Dad' }
        ]
      },
      { 
        id: 'd2-s2',
        time: "15:00", title: "花見小路", tag: "文化",
        details: "【故事】藝伎出沒的迷宮。千本格子的木窗後，隱藏著京都最尊貴的茶屋文化。",
        access: "清水寺步行 15 分鐘。",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=花見小路",
        prevSpotName: "清水寺",
        food: "【鍵善良房】葛切粉",
        expenses: [
          { id: 'e6', item: '葛切粉下午茶', amount: 3000, currency: 'JPY', payer: 'YenLin' }
        ]
      }
    ]
  },
  {
    day: 3, date: "04.13", area: "奇幻冒險：USJ 全日狂歡",
    image: "/images/day3.jpg",
    weather: { icon: "Sunny", temp: "18°C - 24°C", desc: "陽光普照" },
    guideStory: "「放開平日的緊繃，今日我們都是孩子。」",
    spots: [
      { 
        id: 'd3-s1',
        time: "08:30", title: "日本環球影城", tag: "樂園", 
        details: "超級任天堂世界必衝。下午5點後哈利波特區燈光漸起，魔幻感十足。", 
        access: "JR 櫻島線直達。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=日本環球影城",
        prevSpotName: "大阪飯店",
        expenses: [
          { id: 'e7', item: '門票+快速通關', amount: 25000, currency: 'JPY', payer: 'CC. Fu' }
        ]
      }
    ]
  },
  {
    day: 4, date: "04.14", area: "奈良鹿鳴：東大寺之森",
    image: "/images/day4.jpg",
    weather: { icon: "Rain", temp: "15°C - 19°C", desc: "午後陣雨" },
    guideStory: "「奈良的鹿是神的使者。在東大寺大佛前感受共生。」",
    spots: [
      { 
        id: 'd4-s1',
        time: "10:00", title: "奈良公園", tag: "自然", 
        details: "1,200隻鹿在櫻花樹下漫步。請買份鹿仙貝，優雅地與牠們共舞。", 
        access: "近鐵奈良線特急直達。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=奈良公園",
        prevSpotName: "大阪飯店",
        expenses: [
          { id: 'e8', item: '鹿仙貝', amount: 500, currency: 'JPY', payer: 'Wen' },
          { id: 'e9', item: '釜飯午餐', amount: 4000, currency: 'JPY', payer: 'Dad' }
        ]
      }
    ]
  },
  {
    day: 5, date: "04.15", area: "英雄史詩：大阪城天守",
    image: "/images/day5.jpg",
    weather: { icon: "Sunny", temp: "17°C - 23°C", desc: "晴朗舒適" },
    guideStory: "「天守閣見證戰國興衰。今日這裡不談戰爭，只談春櫻。」",
    spots: [
      { 
        id: 'd5-s1',
        time: "10:30", title: "大阪城天守閣", tag: "史蹟", 
        details: "金色的脊樑與莫蘭迪綠的瓦片相映成趣。推薦西之丸庭園。", 
        access: "JR 環狀線至大阪城公園站。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=大阪城天守閣",
        prevSpotName: "大阪飯店",
        expenses: [
          { id: 'e10', item: '天守閣門票', amount: 600, currency: 'JPY', payer: 'YenLin' },
          { id: 'e11', item: '御座船', amount: 1400, currency: 'JPY', payer: 'YenLin' }
        ]
      }
    ]
  },
  {
    day: 6, date: "04.16", area: "都會美學：梅田藍天大廈",
    image: "/images/day6.jpg",
    weather: { icon: "Cloudy", temp: "16°C - 21°C", desc: "陰天" },
    guideStory: "「梅田是大阪的未來感中心。站在雲端看夕陽。」",
    spots: [
      { 
        id: 'd6-s1',
        time: "11:00", title: "梅田藍天大廈", tag: "現代", 
        details: "兩座塔樓在空中相連，形成壯闊的環型展望台。", 
        access: "大阪站步行10分鐘。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=梅田藍天大廈",
        prevSpotName: "大阪飯店",
        expenses: [
          { id: 'e12', item: '展望台門票', amount: 1500, currency: 'JPY', payer: 'CC. Fu' },
          { id: 'e13', item: '瀧見小路晚餐', amount: 1500, currency: 'JPY', payer: 'CC. Fu' }
        ]
      }
    ]
  },
  {
    day: 7, date: "04.17", area: "昭和魂：通天閣新世界",
    image: "/images/day7.jpg",
    weather: { icon: "Sunny", temp: "19°C - 25°C", desc: "晴朗炎熱" },
    guideStory: "「在新世界喝一杯清酒，感受大阪老靈魂的滋味。」",
    spots: [
      { 
        id: 'd7-s1',
        time: "10:30", title: "通天閣", tag: "懷舊", 
        details: "二戰後重建的鐵塔，象徵大阪的精神復興。", 
        access: "地下鐵惠美須町站。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=通天閣",
        prevSpotName: "大阪飯店",
        expenses: [
          { id: 'e14', item: '溜滑梯體驗', amount: 1000, currency: 'JPY', payer: 'Wen' },
          { id: 'e15', item: '炸串', amount: 200, currency: 'JPY', payer: 'Dad' }
        ]
      }
    ]
  },
  {
    day: 8, date: "04.18", area: "歸途：臨空城採買",
    image: "/images/day8.jpg",
    weather: { icon: "Sunny", temp: "18°C - 24°C", desc: "適合飛行" },
    guideStory: "「滿載而歸。期待下一次的櫻花再見。」",
    spots: [
      { 
        id: 'd8-s1',
        time: "10:00", title: "臨空城 Outlet", tag: "購物", 
        details: "離日前最後補貨的最佳處。就在大海旁邊。", 
        access: "JR 關空快速至臨空城。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=臨空城Outlet",
        prevSpotName: "大阪飯店",
        expenses: [
          { id: 'e16', item: '最後採購', amount: 50000, currency: 'JPY', payer: 'Sister' }
        ]
      },
      { 
        id: 'd8-s2',
        time: "13:10", title: "關西國際機場", tag: "飛行", 
        details: "華航 CI 157 返家。建議提早2.5小時到場。", 
        access: "臨空城搭電車 1 站即達。", 
        mapUrl: "https://www.google.com/maps/search/?api=1&query=關西國際機場",
        prevSpotName: "臨空城Outlet",
        expenses: []
      }
    ]
  }
];

export const prepList = [
  { title: "行政證件", items: ["護照 (效期6個月以上)", "Visit Japan Web 登錄", "機票/飯店確認單", "日幣現金 & 雙幣卡"] },
  { title: "美學與日常", items: ["薄長袖 & 風衣 (4月溫差大)", "保濕美妝品 (日本乾燥)", "舒適步行的運動鞋", "櫻花口罩"] },
  { title: "數位科技", items: ["日本 eSIM 卡 (4G/5G)", "行動電源", "Google Maps 收藏夾"] }
];