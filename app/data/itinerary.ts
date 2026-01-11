// app/data/itinerary.ts

export const colors = {
    bg: "#F7F3F2",        
    card: "#FFFFFF",
    accent: "#D4A5A5",    // 莫蘭迪櫻花粉
    text: "#5D5D5A",      
    sub: "#9E9494",       
    highlight: "#E3C8C8",
    currencyBg: "#E8E2E0"
  };
  
  export const exchangeRate = 0.21;
  
  export const itineraryData = [
    {
      day: 1, date: "04.11", area: "海之啟程：神戶灣與大阪燈火",
      image: "/images/day1.jpg",
      guideStory: "「歡迎來到關西。今日我們從精緻的海上機場 UKB 入境，搭乘高速船劃過大阪灣，這是最優雅的登場方式。」",
      spots: [
        { 
          time: "10:30", title: "神戶機場 (UKB)", tag: "交通",
          details: "【位置】神戶港人工島。這座海上機場是日本精密的工程美學。2006年啟用至今，是神戶人的驕傲。3樓的展望台可看見明石海峽大橋。",
          access: "起始點：神戶機場",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=神戶機場",
          prevSpotName: "起始點",
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
      guideStory: "「放開平日的緊繃，今日我們都是孩子。」",
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
      day: 4, date: "04.14", area: "奈良鹿鳴：東大寺之森",
      image: "/images/day4.jpg",
      guideStory: "「奈良的鹿是神的使者。在東大寺大佛前感受共生。」",
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
      day: 5, date: "04.15", area: "英雄史詩：大阪城天守",
      image: "/images/day5.jpg",
      guideStory: "「天守閣見證戰國興衰。今日這裡不談戰爭，只談春櫻。」",
      spots: [
        { 
          time: "10:30", title: "大阪城天守閣", tag: "史蹟", 
          details: "金色的脊樑與莫蘭迪綠的瓦片相映成趣。推薦西之丸庭園。", 
          access: "JR 環狀線至大阪城公園站。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=大阪城天守閣",
          prevSpotName: "大阪飯店",
          price: "¥2,000" 
        }
      ]
    },
    {
      day: 6, date: "04.16", area: "都會美學：梅田藍天大廈",
      image: "/images/day6.jpg",
      guideStory: "「梅田是大阪的未來感中心。站在雲端看夕陽。」",
      spots: [
        { 
          time: "11:00", title: "梅田藍天大廈", tag: "現代", 
          details: "兩座塔樓在空中相連，形成壯闊的環型展望台。", 
          access: "大阪站步行10分鐘。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=梅田藍天大廈",
          prevSpotName: "大阪飯店",
          price: "¥3,000" 
        }
      ]
    },
    {
      day: 7, date: "04.17", area: "昭和魂：通天閣新世界",
      image: "/images/day7.jpg",
      guideStory: "「在新世界喝一杯清酒，感受大阪老靈魂的滋味。」",
      spots: [
        { 
          time: "10:30", title: "通天閣", tag: "懷舊", 
          details: "二戰後重建的鐵塔，象徵大阪的精神復興。", 
          access: "地下鐵惠美須町站。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=通天閣",
          prevSpotName: "大阪飯店",
          price: "¥1,200" 
        }
      ]
    },
    {
      day: 8, date: "04.18", area: "歸途：臨空城採買",
      image: "/images/day8.jpg",
      guideStory: "「滿載而歸。期待下一次的櫻花再見。」",
      spots: [
        { 
          time: "10:00", title: "臨空城 Outlet", tag: "購物", 
          details: "離日前最後補貨的最佳處。就在大海旁邊。", 
          access: "JR 關空快速至臨空城。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=臨空城Outlet",
          prevSpotName: "大阪飯店",
          price: "¥50,000" 
        },
        { 
          time: "13:10", title: "關西國際機場", tag: "飛行", 
          details: "華航 CI 157 返家。建議提早2.5小時到場。", 
          access: "臨空城搭電車 1 站即達。", 
          mapUrl: "https://www.google.com/maps/search/?api=1&query=關西國際機場",
          prevSpotName: "臨空城Outlet",
          price: "¥0" 
        }
      ]
    }
  ];
  
  export const prepList = [
    { title: "行政證件", items: ["護照 (效期6個月以上)", "Visit Japan Web 登錄", "機票/飯店確認單", "日幣現金 & 雙幣卡"] },
    { title: "美學與日常", items: ["薄長袖 & 風衣 (4月溫差大)", "保濕美妝品 (日本乾燥)", "舒適步行的運動鞋", "櫻花口罩"] },
    { title: "數位科技", items: ["日本 eSIM 卡 (4G/5G)", "行動電源", "Google Maps 收藏夾"] }
  ];