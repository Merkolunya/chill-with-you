import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   TRACKS (15) — these are labels; audio is generated
   ═══════════════════════════════════════════════════════ */
const TRACKS = [
  { id:1,name:"Cozy Afternoon",artist:"Lo-Fi Chill",dur:"3:42",key:"C",bpm:72 },
  { id:2,name:"Midnight Study",artist:"Dreamy Beats",dur:"4:15",key:"Am",bpm:80 },
  { id:3,name:"Rainy Window",artist:"Ambient Wave",dur:"3:58",key:"F",bpm:68 },
  { id:4,name:"Sunlit Pages",artist:"Warm Keys",dur:"4:01",key:"G",bpm:85 },
  { id:5,name:"Stargazer",artist:"Night Owl",dur:"5:20",key:"Dm",bpm:65 },
  { id:6,name:"Coffee & Pages",artist:"Cafe Noir",dur:"3:33",key:"Bb",bpm:75 },
  { id:7,name:"Neon Dreams",artist:"City Pulse",dur:"4:48",key:"Em",bpm:90 },
  { id:8,name:"Gentle Stream",artist:"Forest Bath",dur:"6:02",key:"D",bpm:60 },
  { id:9,name:"Pixel Memories",artist:"Retro Chill",dur:"3:15",key:"A",bpm:78 },
  { id:10,name:"Twilight Walk",artist:"Dusk Beats",dur:"4:37",key:"Cm",bpm:70 },
  { id:11,name:"Paper Cranes",artist:"Origami Sound",dur:"3:50",key:"Eb",bpm:73 },
  { id:12,name:"Warm Blanket",artist:"Sunday Mood",dur:"5:10",key:"Ab",bpm:66 },
  { id:13,name:"Lavender Haze",artist:"Dream Soft",dur:"4:22",key:"Fm",bpm:62 },
  { id:14,name:"Rooftop View",artist:"Sky Lounge",dur:"3:44",key:"Gm",bpm:82 },
  { id:15,name:"Last Train Home",artist:"Night Commute",dur:"4:55",key:"Bm",bpm:76 },
];

const AMBIENT = [
  { id:"rain",name:"Rain",icon:"🌧️" },{ id:"fire",name:"Fire",icon:"🔥" },
  { id:"birds",name:"Birds",icon:"🐦" },{ id:"wind",name:"Wind",icon:"🍃" },
  { id:"cricket",name:"Crickets",icon:"🦗" },{ id:"waves",name:"Ocean",icon:"🌊" },
  { id:"cafe",name:"Café",icon:"☕" },{ id:"thunder",name:"Thunder",icon:"⛈️" },
  { id:"train",name:"Train",icon:"🚂" },
];

/* ═══════════════════════════════════════════════════════
   365-DAY STORY SYSTEM
   EN titles, TH content, 5 sections each
   Sections unlock every 25min of focus
   ═══════════════════════════════════════════════════════ */
const STORY_THEMES = [
  // Each theme generates stories with 5 sections
  { titleEN:"Gentle Courage", sections:[
    "วันนี้ขอเล่าเรื่องความกล้าเล็กๆ ให้ฟังนะ... บางทีความกล้าไม่ใช่การทำสิ่งยิ่งใหญ่ แต่คือการลุกขึ้นมาทำสิ่งเล็กๆ ซ้ำแล้วซ้ำเล่า แม้จะเหนื่อย",
    "เคยมีคนบอกว่า 'ความกล้าที่แท้จริงคือการร้องไห้แล้วลุกขึ้นทำต่อ' ไม่ต้องแข็งแกร่งตลอดเวลาก็ได้นะ แค่อย่าหยุดเดิน",
    "ลองนึกถึงต้นไม้เล็กๆ ที่แทรกตัวขึ้นมาจากรอยแตกของคอนกรีต มันไม่ได้แข็งแกร่ง แต่มันไม่ยอมแพ้ เหมือนกับเราทุกคน",
    "ถ้าวันนี้รู้สึกว่าทำได้แค่นิดเดียว... ก็ดีแล้วนะ บางวันแค่ผ่านไปได้ก็ถือว่าเก่งมากแล้ว ให้เครดิตตัวเองบ้าง 💪",
    "คืนนี้ก่อนนอน ลองบอกตัวเองว่า 'วันนี้เราทำดีแล้ว' แล้วพรุ่งนี้ค่อยเริ่มใหม่ด้วยกันนะ ✨",
  ]},
  { titleEN:"Rainy Afternoon", sections:[
    "เสียงฝนตกบนหลังคา... เป็นเสียงที่ทำให้รู้สึกปลอดภัยจังเลย เหมือนโลกกำลังบอกว่า 'พักได้นะ ฉันจะดูแลเอง'",
    "วันฝนตกแบบนี้ เหมาะกับการนั่งมองหยดน้ำไหลตามกระจก แต่ละหยดเหมือนความคิดที่ค่อยๆ ไหลผ่านไป ไม่ต้องไปยึดมันทุกหยด",
    "กลิ่นดินหลังฝนตก คนญี่ปุ่นเรียกว่า 'เปโตริเคอร์' เป็นกลิ่นที่ทำให้รู้สึกว่าทุกอย่างสดใหม่ เหมือนได้เริ่มต้นใหม่",
    "ฝนจะหยุดตกเสมอ เหมือนกับช่วงเวลาที่ยากลำบาก มันจะผ่านไป แล้ววันหนึ่งเราจะมองย้อนกลับมาแล้วยิ้มได้ 🌧️",
    "ก่อนจะนอน ฟังเสียงฝนตกอีกสักพัก แล้วปล่อยให้มันพาเราเข้าสู่ฝันที่ดี... ราตรีสวัสดิ์นะ 💤",
  ]},
  { titleEN:"The Art of Doing Nothing", sections:[
    "วันนี้มาพูดเรื่อง 'การไม่ทำอะไร' กันดีกว่า... ในโลกที่ทุกคนวิ่งแข่งกัน การหยุดพักจริงๆ กลับกลายเป็นเรื่องยากที่สุด",
    "คนเนเธอร์แลนด์มีคำว่า 'Niksen' แปลว่าการนั่งเฉยๆ โดยไม่ต้องมีจุดมุ่งหมาย ไม่ใช่ความขี้เกียจ แต่เป็นศิลปะของการพักผ่อน",
    "ลองวางมือถือ ปิดตาสัก 30 วินาที หายใจเข้าลึกๆ... รู้สึกไหมว่าโลกช้าลง? นั่นแหละคือสิ่งที่ร่างกายเราต้องการ",
    "ไม่ต้องรู้สึกผิดที่พักนะ แบตเตอรี่ที่ไม่ได้ชาร์จก็ใช้งานไม่ได้ เราก็เหมือนกัน ☕",
    "วันนี้ก่อนนอน ลองนั่งเฉยๆ สัก 5 นาที ไม่ต้องคิดอะไร แค่อยู่กับตัวเอง... แค่นี้ก็เพียงพอแล้ว 🌿",
  ]},
  { titleEN:"Starlight Philosophy", sections:[
    "คืนนี้ลองมองดาวกันไหม? แสงดาวที่เราเห็นเดินทางมาหลายล้านปี บางดวงอาจดับไปแล้ว แต่แสงของมันยังอยู่",
    "เหมือนกับสิ่งดีๆ ที่เราทำ ผลของมันอาจจะไปถึงใครสักคนที่เราไม่รู้จัก ในเวลาที่เราไม่คาดคิด",
    "ในจักรวาลที่กว้างใหญ่มหาศาลนี้ การที่เรามีชีวิตอยู่ ณ ตรงนี้ ในเวลานี้ มันเป็นเรื่องมหัศจรรย์มากเลยนะ ✨",
    "ไม่ต้องเปรียบเทียบตัวเองกับใคร ดาวแต่ละดวงก็ส่องสว่างในแบบของมันเอง เราก็เหมือนกัน",
    "คืนนี้ก่อนนอน ส่งพลังดีๆ ไปกับแสงดาว ให้มันพาความสุขไปถึงทุกคนที่เรารัก 🌟",
  ]},
  { titleEN:"Small Joys", sections:[
    "ความสุขเล็กๆ มักซ่อนอยู่ในสิ่งที่เรามองข้ามไป... เช่น กลิ่นกาแฟตอนเช้า ลมเย็นๆ ที่พัดผ่าน หรือรอยยิ้มของคนแปลกหน้า",
    "ลองนับดูว่าวันนี้มีอะไรดีๆ เกิดขึ้นบ้าง แม้แค่เรื่องเล็กน้อย... ได้กินอาหารอร่อย? ได้ยินเพลงที่ชอบ? แค่นี้ก็มีค่าแล้ว",
    "คนญี่ปุ่นมีคำว่า 'อิคิไก' หมายถึงเหตุผลที่ทำให้อยากตื่นขึ้นมาทุกเช้า ไม่จำเป็นต้องเป็นเรื่องยิ่งใหญ่ อาจแค่กาแฟร้านโปรดก็ได้ ☕",
    "ลองถ่ายรูปสิ่งเล็กๆ ที่ทำให้ยิ้มได้วันละรูป แล้วสิ้นเดือนกลับมาดู จะเห็นว่าชีวิตเรามีความสุขมากกว่าที่คิด",
    "วันนี้ขอบคุณตัวเองที่สังเกตเห็นสิ่งเล็กๆ ดีๆ ในชีวิตนะ นั่นคือพลังพิเศษที่ไม่ใช่ทุกคนจะมี 💛",
  ]},
  { titleEN:"Ocean Wisdom", sections:[
    "ทะเลสอนอะไรเราหลายอย่าง... คลื่นที่ซัดเข้าหาฝั่งไม่เคยหยุด เหมือนกับชีวิตที่เดินหน้าต่อไปเสมอ ไม่ว่าอะไรจะเกิดขึ้น",
    "บางวันทะเลสงบ บางวันทะเลปั่นป่วน เหมือนอารมณ์ของเรา ไม่มีใครสงบได้ตลอดเวลา แค่รู้ว่ามันจะผ่านไปก็พอ",
    "ปลาในทะเลไม่เคยกังวลว่าน้ำจะหมด มันแค่ว่ายไปเรื่อยๆ บางทีเราก็ควรเป็นแบบนั้นบ้าง 🐟",
    "เสียงคลื่นมีจังหวะที่สม่ำเสมอ เหมือนหัวใจเต้น เหมือนการหายใจ ธรรมชาติกำลังบอกว่า 'ทุกอย่างมีจังหวะของมัน อย่ารีบ'",
    "คืนนี้ลองจินตนาการว่านั่งอยู่ริมทะเล ฟังเสียงคลื่น แล้วปล่อยให้ทุกความกังวลไหลไปกับน้ำ... 🌊",
  ]},
  { titleEN:"Growing Season", sections:[
    "ทุกอย่างมีฤดูกาลของมัน... ฤดูปลูก ฤดูรอ ฤดูเก็บเกี่ยว ตอนนี้เราอยู่ในฤดูไหนก็ไม่เป็นไร ทุกฤดูมีความสำคัญ",
    "ต้นไม้ไม่เคยรีบโต มันค่อยๆ หยั่งรากลึกลงก่อน แล้วค่อยแผ่กิ่งก้าน ความสำเร็จที่ยั่งยืนก็เหมือนกัน",
    "บางทีเราไม่เห็นการเติบโตของตัวเอง เหมือนดูต้นไม้ทุกวัน แต่ถ้าย้อนกลับไปดูเมื่อปีที่แล้ว จะเห็นว่าเราโตมากเลย 🌱",
    "อย่าเปรียบเทียบ บทที่ 1 ของเรากับ บทที่ 20 ของคนอื่น ทุกคนมีเส้นทางของตัวเอง และทุกเส้นทางก็สวยงามในแบบของมัน",
    "คืนนี้ให้รางวัลตัวเองบ้างนะ ที่ยังคงเติบโตอยู่ ถึงจะช้า ถึงจะเหนื่อย แต่ไม่เคยหยุด... นั่นคือสิ่งที่น่าภูมิใจที่สุด 🌻",
  ]},
  { titleEN:"Mountain Meditation", sections:[
    "ลองจินตนาการว่ายืนอยู่บนยอดเขาสูง... มองลงมาเห็นเมฆลอยอยู่ต่ำกว่า ปัญหาต่างๆ ดูเล็กลงทันที",
    "ภูเขาสูงเกิดจากการยกตัวทีละน้อย เป็นล้านๆ ปี ความพยายามเล็กๆ ของเราวันนี้ก็กำลังสร้างภูเขาเช่นกัน",
    "นักปีนเขาบอกว่า 'อย่ามองยอดเขา ให้มองแค่ก้าวต่อไป' คำแนะนำนี้ใช้ได้กับชีวิตเลยนะ ⛰️",
    "อากาศบนยอดเขาบางเบาแต่สดชื่น เหมือนกับความรู้สึกหลังจากทำอะไรยากๆ สำเร็จ ความภูมิใจที่แท้จริง",
    "คืนนี้หลับตาแล้วจินตนาการว่าอยู่บนยอดเขา หายใจเข้าลึกๆ... รู้สึกเป็นอิสระไหม? เก็บความรู้สึกนี้ไว้นะ 🏔️",
  ]},
  { titleEN:"Music of Life", sections:[
    "ชีวิตเหมือนเพลง... มีจังหวะเร็ว จังหวะช้า มีท่อนที่สนุก และท่อนที่เศร้า แต่ทั้งหมดรวมกันถึงเป็นเพลงที่สมบูรณ์",
    "ไม่มีเพลงไหนที่มีแต่โน้ตสูง การพักก็สำคัญเหมือนตัวโน้ต ความเงียบในเพลงทำให้เสียงมีความหมายมากขึ้น 🎵",
    "ทุกคนมีเพลงประจำตัว จังหวะของเรา ไม่จำเป็นต้องเหมือนใคร บางคนเป็น Lo-Fi ช้าๆ สบายๆ บางคนเป็น Jazz ที่เปลี่ยนแปลงตลอด",
    "เวลาฟังเพลง สมองจะหลั่งสารแห่งความสุข นี่คือเหตุผลว่าทำไมเพลงถึงเยียวยาได้ ลองเปิดเพลงที่ชอบแล้วหลับตาสักพัก",
    "คืนนี้ให้เพลงโปรดเป็นเพื่อนก่อนนอนนะ แล้วฝันดี... พรุ่งนี้เรามาสร้างเพลงบทใหม่ด้วยกัน 🎶",
  ]},
  { titleEN:"Moonlight Letters", sections:[
    "ถ้าเขียนจดหมายถึงตัวเองในอนาคตได้ จะเขียนว่าอะไร? ลองคิดดูนะ... บางทีแค่บอกว่า 'ผ่านมาได้ดีมาก' ก็พอแล้ว",
    "การเขียนเป็นวิธีเยียวยาที่ดีมาก ไม่ต้องเขียนสวย ไม่ต้องเขียนเก่ง แค่เขียนออกมาจากใจ ปล่อยให้ความรู้สึกไหลลงบนกระดาษ",
    "จดหมายจากอดีตคือของขวัญล้ำค่า ลองเขียนบันทึกวันนี้สักหน้า แล้วเปิดอ่านอีกทีปีหน้า จะเซอร์ไพรส์ตัวเองแน่นอน 📝",
    "แสงจันทร์คืนนี้ส่องสว่างพอดี เหมือนกำลังบอกว่า 'แม้ในความมืด ก็ยังมีแสงเสมอ' อย่าลืมสิ่งนี้นะ",
    "คืนนี้ก่อนนอน ลองเขียนสิ่งดีๆ 3 อย่างที่เกิดขึ้นวันนี้ แม้เรื่องเล็กน้อยก็ได้ แล้วจะรู้สึกขอบคุณชีวิตมากขึ้น 🌙",
  ]},
  { titleEN:"Dawn Runner", sections:[
    "ตอนเช้าเป็นช่วงเวลาที่วิเศษ... โลกเงียบสงบ อากาศเย็นสดชื่น เหมือนได้หน้ากระดาษเปล่าใหม่ทุกวัน",
    "ไม่ต้องตื่นตี 5 ก็ได้นะ แค่ตื่นขึ้นมาแล้วใช้ 5 นาทีแรกอยู่กับตัวเอง ก่อนจะเปิดมือถือ แค่นี้วันก็ดีขึ้นเยอะ",
    "แสงแดดยามเช้ามีพลังมากกว่าที่คิด ช่วยปรับนาฬิกาชีวิต ทำให้นอนหลับดีขึ้น มีพลังมากขึ้น ☀️",
    "ลองตั้งเป้าเล็กๆ สำหรับพรุ่งนี้ เป้าที่ทำได้แน่นอน แล้วเช้าขึ้นมาทำมันเป็นอย่างแรก ความรู้สึกสำเร็จตั้งแต่เช้าเปลี่ยนทั้งวัน",
    "คืนนี้พักผ่อนให้เต็มที่นะ เพราะพรุ่งนี้เช้า โลกกำลังรอให้เราไปทักทาย ด้วยพลังเต็มร้อย! 🌅",
  ]},
  { titleEN:"Forest Whispers", sections:[
    "ในป่าลึก ต้นไม้สื่อสารกันผ่านรากใต้ดิน แบ่งปันอาหารและน้ำให้กัน ธรรมชาติสอนเรื่องการช่วยเหลือกันโดยไม่ต้องพูด",
    "เสียงลมพัดผ่านใบไม้ เสียงนกร้อง เสียงลำธาร... ธรรมชาติมี playlist ของตัวเอง และมันฟรี",
    "ต้นไม้ใหญ่ทุกต้นเคยเป็นเมล็ดเล็กๆ มาก่อน ไม่มีใครเริ่มจากจุดสูงสุด ทุกคนเริ่มจากศูนย์ 🌲",
    "การเดินในป่าช่วยลดความเครียดได้จริงๆ นักวิทย์เรียกว่า 'การอาบป่า' แม้แค่จินตนาการก็ช่วยได้",
    "คืนนี้ลองปิดไฟ ปิดจอ ฟังเสียงธรรมชาติสักพัก ให้ตัวเองกลับไปเป็นส่วนหนึ่งของโลกใบนี้ 🍃",
  ]},
  { titleEN:"Kindness Ripple", sections:[
    "ความเมตตาเป็นเหมือนก้อนหินที่โยนลงน้ำ... คลื่นแผ่กว้างออกไปไกลกว่าที่คิด สิ่งดีๆ เล็กน้อยที่เราทำ อาจเปลี่ยนวันของใครสักคน",
    "ลองยิ้มให้คนแปลกหน้า ขอบคุณพนักงานร้านสะดวกซื้อ ส่งข้อความหาเพื่อนเก่า... สิ่งเล็กๆ แต่มีพลังมหาศาล",
    "ความเมตตาต่อตัวเองก็สำคัญนะ หยุดตำหนิตัวเอง หยุดเปรียบเทียบ ลองพูดกับตัวเองอย่างอ่อนโยนบ้าง 💝",
    "งานวิจัยพบว่าคนที่ช่วยเหลือผู้อื่นมีความสุขมากกว่า สมองหลั่งสาร endorphin เหมือนกับตอนออกกำลังกาย",
    "คืนนี้ลองทำสิ่งดีๆ ให้ตัวเองสักอย่าง อาจจะแค่ทำชาร้อนๆ สักแก้ว แล้วนั่งจิบช้าๆ ก็ถือว่าเป็นความเมตตาต่อตัวเองแล้ว ☕",
  ]},
  { titleEN:"Dreamcatcher", sections:[
    "ความฝันเป็นเรื่องน่าทึ่ง... ตอนที่เราหลับ สมองกำลังจัดเรียงความทรงจำ แก้ปัญหา และสร้างสรรค์ไอเดียใหม่ๆ",
    "หลายสิ่งประดิษฐ์ที่ยิ่งใหญ่เกิดจากความฝัน ทั้งโครงสร้างเบนซิน ทำนองเพลง Yesterday ของ Beatles ฝันไม่ใช่แค่ภาพลวง",
    "ลองวาง notebook ไว้ข้างเตียง ตื่นขึ้นมาจดสิ่งที่ฝันทันที บางทีจะพบไอเดียที่สมองซ่อนไว้ให้เรา 💭",
    "การนอนหลับที่ดีเป็นพื้นฐานของทุกอย่าง สุขภาพ ความคิดสร้างสรรค์ อารมณ์ดี ทั้งหมดเริ่มจากการพักผ่อน",
    "คืนนี้ปล่อยให้ตัวเองฝันอย่างเต็มที่ ไม่ว่าจะฝันอะไร มันคือของขวัญจากสมองที่รักเรา... ฝันดีนะ 💤",
  ]},
];

// Generate 365 stories by cycling through themes with variation
function getStoryForDay(dayOfYear) {
  const themeIdx = dayOfYear % STORY_THEMES.length;
  return STORY_THEMES[themeIdx];
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/* ═══════════════════════════════════════════
   ACHIEVEMENTS (16, tiered, Thai)
   ═══════════════════════════════════════════ */
const ACHIEVEMENTS = [
  {id:1,name:"ก้าวแรก",desc:"ทำ Pomodoro ครั้งแรก",icon:"🌱",xpReq:50,tier:"bronze"},
  {id:2,name:"ไฟลุก",desc:"ทำ 5 sessions ในวัน",icon:"🔥",xpReq:150,tier:"bronze"},
  {id:3,name:"นักจัดการ",desc:"เคลียร์ 10 tasks",icon:"✅",xpReq:250,tier:"silver"},
  {id:4,name:"สร้างนิสัย",desc:"ติดตาม habit 7 วัน",icon:"💪",xpReq:400,tier:"silver"},
  {id:5,name:"โฟกัสลึก",desc:"สะสม focus 5 ชม.",icon:"🧠",xpReq:600,tier:"silver"},
  {id:6,name:"คอนิยาย",desc:"อ่านเรื่อง 7 วันติด",icon:"📖",xpReq:300,tier:"silver"},
  {id:7,name:"นกฮูก",desc:"ทำงานหลังเที่ยงคืน",icon:"🦉",xpReq:500,tier:"silver"},
  {id:8,name:"มาราธอน",desc:"ทำงานต่อเนื่อง 3 ชม.",icon:"🏃",xpReq:700,tier:"gold"},
  {id:9,name:"นักสะสม",desc:"เก็บ XP 1,000",icon:"💎",xpReq:1000,tier:"gold"},
  {id:10,name:"เซนมาสเตอร์",desc:"ถึง Level 10",icon:"🧘",xpReq:1500,tier:"gold"},
  {id:11,name:"นักดนตรี",desc:"ฟังเพลงครบทุกเพลง",icon:"🎵",xpReq:800,tier:"gold"},
  {id:12,name:"เพื่อนสนิท",desc:"Bond 100%",icon:"💕",xpReq:1200,tier:"gold"},
  {id:13,name:"เจ้าแห่ง Focus",desc:"สะสม focus 24 ชม.",icon:"👑",xpReq:2000,tier:"platinum"},
  {id:14,name:"ตำนาน",desc:"ถึง Level 20",icon:"🏆",xpReq:3000,tier:"platinum"},
  {id:15,name:"ปรมาจารย์",desc:"ปลดล็อก 12 achievements",icon:"⭐",xpReq:2500,tier:"platinum"},
  {id:16,name:"ไม่หยุดพัก",desc:"สะสม 100 sessions",icon:"🚀",xpReq:5000,tier:"diamond"},
];
const tierColors={bronze:"#cd7f32",silver:"#c0c0c0",gold:"#ffd700",platinum:"#e5e4e2",diamond:"#b9f2ff"};

const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const fmt=s=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

const THEMES={
  dark:{bg:"#111113",card:"#1a1a1e",text:"#e8e4e0"},
  midnight:{bg:"#0a0a1a",card:"#12122a",text:"#e0e0f0"},
  forest:{bg:"#0a1510",card:"#132218",text:"#d0e8d8"},
};

function Card({children,style,bg}){return<div style={{background:bg||"#1a1a1e",borderRadius:24,padding:"22px 24px",...style}}>{children}</div>;}
function Toggle({on,onToggle,accent}){return<div onClick={onToggle} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?(accent||"#c9463d"):"rgba(255,255,255,0.1)",padding:2,transition:"all 0.25s",display:"flex",alignItems:"center",justifyContent:on?"flex-end":"flex-start"}}><div style={{width:20,height:20,borderRadius:10,background:"#fff",transition:"all 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/></div>;}

/* ═══════════════════════════════════════════
   LO-FI AUDIO ENGINE (Web Audio API)
   ═══════════════════════════════════════════ */
function useLofiAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef({});
  const playingRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const startLofi = useCallback((bpm = 72) => {
    if (playingRef.current) return;
    playingRef.current = true;
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);

    // Chord pad
    const chordFreqs = [261.6, 329.6, 392.0]; // C major
    const oscs = chordFreqs.map(f => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(master);
      o.start();
      return { o, g };
    });

    // Gentle noise (vinyl crackle effect)
    const bufSize = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.015;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;
    noise.connect(noiseFilter);
    noiseFilter.connect(master);
    noise.start();

    // Simple beat (kick-like)
    const beatInterval = 60 / bpm;
    const beatTimer = setInterval(() => {
      if (!playingRef.current) return;
      try {
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(150, ctx.currentTime);
        kick.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        kickGain.gain.setValueAtTime(0.08, ctx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        kick.connect(kickGain);
        kickGain.connect(master);
        kick.start(ctx.currentTime);
        kick.stop(ctx.currentTime + 0.2);
      } catch(e) {}
    }, beatInterval * 2000);

    nodesRef.current = { oscs, noise, noiseFilter, master, beatTimer };
  }, [getCtx]);

  const stopLofi = useCallback(() => {
    playingRef.current = false;
    const n = nodesRef.current;
    if (n.beatTimer) clearInterval(n.beatTimer);
    if (n.oscs) n.oscs.forEach(({ o }) => { try { o.stop(); } catch(e) {} });
    if (n.noise) try { n.noise.stop(); } catch(e) {}
    nodesRef.current = {};
  }, []);

  const changeBpm = useCallback((bpm) => {
    if (playingRef.current) {
      stopLofi();
      setTimeout(() => startLofi(bpm), 100);
    }
  }, [startLofi, stopLofi]);

  return { startLofi, stopLofi, changeBpm, isEngineReady: true };
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App(){
  const [nav,setNav]=useState("Home");
  const [mode,setMode]=useState("work");
  const [workMin,setWorkMin]=useState(25);
  const [breakMin,setBreakMin]=useState(5);
  const [time,setTime]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState(0);
  const [rounds,setRounds]=useState(4);
  const timerRef=useRef(null);

  const [todos,setTodos]=useState([{id:1,text:"Design",done:false},{id:2,text:"Web development",done:false},{id:3,text:"Social media content",done:false}]);
  const [newTodo,setNewTodo]=useState("");
  const [showAddTask,setShowAddTask]=useState(false);

  const [habits,setHabits]=useState([{id:1,name:"ดื่มน้ำ",icon:"💧",done:false},{id:2,name:"ยืดเส้น",icon:"🧘",done:false},{id:3,name:"อ่านหนังสือ",icon:"📖",done:false},{id:4,name:"นั่งสมาธิ",icon:"🧠",done:false}]);
  const [newHabit,setNewHabit]=useState("");
  const [showAddHabit,setShowAddHabit]=useState(false);

  const [track,setTrack]=useState(TRACKS[0]);
  const [playing,setPlaying]=useState(false);
  const [shuffleOn,setShuffleOn]=useState(false);
  const [repeatOn,setRepeatOn]=useState(false);
  const [ambients,setAmbients]=useState({});
  const [mProg,setMProg]=useState(0);
  const [showAmb,setShowAmb]=useState(false);
  const [showAllTracks,setShowAllTracks]=useState(false);

  const [xp,setXp]=useState(0);
  const level=Math.floor(xp/150)+1;
  const xpNext=level*150;

  const [storyOpen,setStoryOpen]=useState(false);
  const [lineIdx,setLineIdx]=useState(0);
  const [workLog,setWorkLog]=useState({});
  const [mood,setMood]=useState("idle");
  // Track how many sections unlocked today (based on sessions)
  const sectionsUnlocked = Math.min(sessions + 1, 5); // 1 free + 1 per session

  const [userName,setUserName]=useState("User");
  const [notifSound,setNotifSound]=useState(true);
  const [autoBreak,setAutoBreak]=useState(true);
  const [longBreak,setLongBreak]=useState(15);
  const [dailyGoal,setDailyGoal]=useState(8);
  const [selTheme,setSelTheme]=useState("dark");
  const [selAccent,setSelAccent]=useState("#c9463d");
  const [statsPeriod,setStatsPeriod]=useState("Week");

  const T=THEMES[selTheme]||THEMES.dark;
  const A=selAccent;

  // Audio
  const { startLofi, stopLofi, changeBpm } = useLofiAudio();

  // Today's story
  const dayOfYear = useMemo(()=>getDayOfYear(),[]);
  const todayStory = useMemo(()=>getStoryForDay(dayOfYear),[dayOfYear]);

  // Toggle play with real audio
  const togglePlay = useCallback(() => {
    if (playing) { stopLofi(); setPlaying(false); }
    else { startLofi(track.bpm || 72); setPlaying(true); }
  }, [playing, track, startLofi, stopLofi]);

  // Change track
  const doNextTrack = () => { const i=TRACKS.findIndex(t=>t.id===track.id); const next=TRACKS[(i+1)%TRACKS.length]; setTrack(next); setMProg(0); if(playing) changeBpm(next.bpm||72); };
  const doPrevTrack = () => { const i=TRACKS.findIndex(t=>t.id===track.id); const prev=TRACKS[(i-1+TRACKS.length)%TRACKS.length]; setTrack(prev); setMProg(0); if(playing) changeBpm(prev.bpm||72); };

  // Timer
  useEffect(()=>{
    if(running&&time>0){timerRef.current=setInterval(()=>setTime(t=>t-1),1000);}
    else if(time===0&&running){
      setRunning(false);
      if(mode==="work"){setXp(x=>x+workMin*2);setSessions(s=>s+1);const d=new Date().toISOString().split("T")[0];setWorkLog(l=>({...l,[d]:(l[d]||0)+workMin}));setMood("happy");setMode("break");setTime(breakMin*60);}
      else{setMode("work");setTime(workMin*60);setMood("idle");}
    }
    return()=>clearInterval(timerRef.current);
  },[running,time,mode,workMin,breakMin]);

  // Music progress animation
  useEffect(()=>{if(!playing)return;const iv=setInterval(()=>setMProg(p=>p>=100?0:p+0.3),300);return()=>clearInterval(iv);},[playing]);

  const progress=mode==="work"?1-time/(workMin*60):1-time/(breakMin*60);
  const totalFocusMin=Object.values(workLog).reduce((a,b)=>a+b,0);
  const focusH=Math.floor(totalFocusMin/60),focusM=totalFocusMin%60;
  const now=new Date();
  const calDates=[];for(let i=-2;i<=2;i++){const d=new Date(now);d.setDate(d.getDate()+i);calDates.push(d);}
  const totalSec=mode==="work"?workMin*60:breakMin*60;
  const handAngle=((totalSec-time)/totalSec)*360;
  const addTodo=()=>{if(!newTodo.trim())return;setTodos([...todos,{id:Date.now(),text:newTodo.trim(),done:false}]);setNewTodo("");setShowAddTask(false);};
  const addHabit=()=>{if(!newHabit.trim())return;setHabits([...habits,{id:Date.now(),name:newHabit.trim(),icon:"✨",done:false}]);setNewHabit("");setShowAddHabit(false);};

  // REAL stats (no fake data)
  const todayKey = now.toISOString().split("T")[0];
  const todayFocus = workLog[todayKey] || 0;
  const getStatsData = () => {
    if(statsPeriod==="Day"){
      // Show today's data only
      return sessions > 0 ? [{day:"Today",focus:todayFocus}] : [];
    }
    // For other periods, show from workLog
    const entries = Object.entries(workLog).sort();
    if(entries.length === 0) return [];
    if(statsPeriod==="Week"){
      const last7 = entries.slice(-7);
      return last7.map(([k,v])=>({day:k.slice(5),focus:v}));
    }
    if(statsPeriod==="Month"){
      const last30 = entries.slice(-30);
      return last30.map(([k,v])=>({day:k.slice(5),focus:v}));
    }
    return entries.map(([k,v])=>({day:k.slice(5),focus:v}));
  };
  const statsData=getStatsData();
  const maxFocus=statsData.length>0?Math.max(...statsData.map(d=>d.focus),1):1;
  const periodTotalFocus = statsPeriod==="Day" ? todayFocus : totalFocusMin;
  const periodFocusH=Math.floor(periodTotalFocus/60),periodFocusM=periodTotalFocus%60;
  const completedTasks=todos.filter(t=>t.done).length;

  // Heatmap from real data
  const getHeatReal=(w,d)=>{
    const dateObj=new Date(now);
    dateObj.setDate(dateObj.getDate()-((3-w)*7+(6-d)));
    const dk=dateObj.toISOString().split("T")[0];
    const logged=workLog[dk]||0;
    return logged>0?Math.min(logged/60,1):0;
  };

  const cycleWorkUp=()=>{if(running)return;const v=Math.min(90,workMin+5);setWorkMin(v);if(mode==="work")setTime(v*60);};
  const cycleWorkDown=()=>{if(running)return;const v=Math.max(5,workMin-5);setWorkMin(v);if(mode==="work")setTime(v*60);};
  const cycleBreakUp=()=>{if(running)return;const v=Math.min(30,breakMin+5);setBreakMin(v);if(mode==="break")setTime(v*60);};
  const cycleBreakDown=()=>{if(running)return;const v=Math.max(1,breakMin-1);setBreakMin(v);if(mode==="break")setTime(v*60);};

  const navIcons={Home:"⌂",Statistics:"📊",Profile:"👤",Settings:"⚙"};

  return(
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",width:"100%",minHeight:"100vh",background:T.bg,color:T.text,transition:"background 0.5s,color 0.5s"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}input,button{font-family:inherit}button{cursor:pointer}`}</style>

      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",gap:4,padding:"14px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexWrap:"wrap"}}>
        {["Home","Statistics","Profile","Settings"].map(n=><button key={n} onClick={()=>setNav(n)} style={{padding:"7px 16px",borderRadius:10,background:nav===n?A:"transparent",color:nav===n?"#fff":"rgba(255,255,255,0.45)",border:"none",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}><span>{navIcons[n]}</span>{n}</button>)}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:`${A}20`,border:`1px solid ${A}40`,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:A,display:"flex",alignItems:"center",gap:5}}>⭐ Lv.{level}<span style={{opacity:0.5,fontWeight:400}}>{xp}XP</span></div>
          <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${A},${A}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{userName[0].toUpperCase()}</div>
        </div>
      </nav>

      {/* ═══ HOME ═══ */}
      {nav==="Home"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        {/* Timer */}
        <Card bg={T.card} style={{padding:"24px 28px",display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
          <div style={{position:"absolute",top:18,left:22,background:mode==="work"?`${A}20`:"rgba(52,211,153,0.12)",border:mode==="work"?`1px solid ${A}40`:"1px solid rgba(52,211,153,0.25)",borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:600,color:mode==="work"?A:"#6ee8a0",textTransform:"uppercase"}}>{mode==="work"?"Focus":"Break"}</div>
          <div style={{position:"absolute",top:20,right:22,display:"flex",gap:4}}>{Array.from({length:rounds}).map((_,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<sessions?A:"rgba(255,255,255,0.1)"}}/>)}</div>
          <div style={{position:"relative",width:220,height:220,margin:"18px 0 14px"}}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="104" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
              {Array.from({length:60}).map((_,i)=>{const a=(i/60)*360-90,r1=i%5===0?88:94,r2=100,rad=a*Math.PI/180;return<line key={i} x1={110+r1*Math.cos(rad)} y1={110+r1*Math.sin(rad)} x2={110+r2*Math.cos(rad)} y2={110+r2*Math.sin(rad)} stroke={i%5===0?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.12)"} strokeWidth={i%5===0?2.5:1} strokeLinecap="round"/>})}
              <circle cx="110" cy="110" r="78" fill="none" stroke={`${A}20`} strokeWidth="28"/>
              {progress>0&&<circle cx="110" cy="110" r="78" fill="none" stroke={`${A}60`} strokeWidth="28" strokeDasharray={2*Math.PI*78} strokeDashoffset={2*Math.PI*78*(1-progress)} style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset 1s linear"}}/>}
              <circle cx="110" cy="110" r="64" fill={T.card}/>
              {(()=>{const a=(handAngle-90)*Math.PI/180;return<><line x1="110" y1="110" x2={110+72*Math.cos(a)} y2={110+72*Math.sin(a)} stroke={A} strokeWidth="2.5" strokeLinecap="round"/><circle cx="110" cy="110" r="4.5" fill="#fff"/></>})()}
            </svg>
          </div>
          <div style={{fontSize:44,fontWeight:300,letterSpacing:3,fontVariantNumeric:"tabular-nums",marginBottom:18}}>{fmt(time)}</div>
          <button onClick={()=>{if(!running)setMood("working");setRunning(!running);}} style={{width:"100%",maxWidth:260,padding:"12px 0",borderRadius:13,background:running?`${A}25`:A,border:`1.5px solid ${running?`${A}66`:A}`,color:running?A:"#fff",fontSize:15,fontWeight:600,transition:"all 0.25s"}}>{running?"Pause session":"Start session"}</button>
          <div style={{display:"flex",gap:12,marginTop:14,fontSize:12,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={cycleWorkDown} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{opacity:0.6,minWidth:56,textAlign:"center"}}>Work:{workMin}m</span>
              <button onClick={cycleWorkUp} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={cycleBreakDown} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{opacity:0.6,minWidth:56,textAlign:"center"}}>Break:{breakMin}m</span>
              <button onClick={cycleBreakUp} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <span onClick={()=>!running&&setRounds(r=>r>=8?2:r+1)} style={{cursor:"pointer",opacity:0.5,borderBottom:"1px dashed rgba(255,255,255,0.3)"}}>×{rounds}</span>
          </div>
        </Card>

        {/* Calendar + Story */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card bg={T.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:18,fontWeight:700}}>Calendar</span><div style={{border:`1.5px solid ${A}`,borderRadius:20,padding:"4px 14px",color:A,fontSize:12,fontWeight:600}}>Today</div></div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>{calDates.map((d,i)=>{const isT=d.toDateString()===now.toDateString();return<div key={i} style={{flex:1,textAlign:"center",padding:"7px 0",borderRadius:10,background:isT?`${A}25`:"rgba(255,255,255,0.03)",border:isT?`1.5px solid ${A}66`:"1.5px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:10,opacity:0.4}}>{DAYS[(d.getDay()+6)%7]}</div><div style={{fontSize:18,fontWeight:600}}>{d.getDate()}</div></div>})}</div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,fontSize:13}}>
              <span style={{color:A,fontWeight:700}}>{sessions}</span><span style={{opacity:0.3}}>sessions</span><span style={{fontWeight:600,marginLeft:"auto"}}>{focusH}H {focusM}M</span>
            </div>
          </Card>
          {/* Story — 5 sections, unlock per session */}
          <Card bg={T.card} style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>{todayStory.titleEN}</span><span style={{fontSize:11,opacity:0.4}}>{sectionsUnlocked}/5</span></div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
              {todayStory.sections.map((sec,idx)=>{
                const isUnlocked = idx < sectionsUnlocked;
                return <button key={idx} onClick={()=>{if(isUnlocked){setLineIdx(idx);setStoryOpen(true);}}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:10,background:isUnlocked?`${A}10`:"rgba(255,255,255,0.02)",border:isUnlocked?`1px solid ${A}20`:"1px solid rgba(255,255,255,0.04)",color:T.text,fontSize:12,textAlign:"left",opacity:isUnlocked?1:0.3}}>
                  <span>{isUnlocked?"📖":"🔒"}</span>
                  <span style={{flex:1}}>{isUnlocked ? sec.slice(0,40)+"..." : `ทำ session ที่ ${idx} เพื่อปลดล็อก`}</span>
                </button>;
              })}
            </div>
            <div style={{fontSize:10,opacity:0.3,marginTop:6,textAlign:"center"}}>เรื่องเปลี่ยนทุกวัน · ปลดล็อกด้วยการทำงาน</div>
          </Card>
        </div>

        {/* Music + Tasks */}
        <div style={{display:"flex",gap:14}}>
          <Card bg={T.card} style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Music</span>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>setShowAllTracks(!showAllTracks)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>🎵</button>
                <button onClick={()=>setShowAmb(!showAmb)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>🌿</button>
              </div>
            </div>
            <div style={{fontSize:13,fontWeight:500}}>{track.name}</div>
            <div style={{fontSize:11,opacity:0.4,marginBottom:12}}>{track.artist} · {track.bpm}bpm</div>
            <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.08)",marginBottom:14,overflow:"hidden"}}><div style={{height:"100%",width:`${mProg}%`,background:`linear-gradient(90deg,${A},${A}88)`,transition:"width 0.3s"}}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
              <button onClick={()=>setShuffleOn(!shuffleOn)} style={{background:"none",border:"none",fontSize:14,color:shuffleOn?A:"rgba(255,255,255,0.25)"}}>⇄</button>
              <button onClick={doPrevTrack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏮</button>
              <button onClick={togglePlay} style={{width:36,height:36,borderRadius:"50%",background:A,border:"none",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?"⏸":"▶"}</button>
              <button onClick={doNextTrack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏭</button>
              <button onClick={()=>setRepeatOn(!repeatOn)} style={{background:"none",border:"none",fontSize:14,color:repeatOn?A:"rgba(255,255,255,0.25)"}}>🔁</button>
            </div>
            {playing&&<div style={{textAlign:"center",marginTop:8,fontSize:10,color:A,opacity:0.7}}>♪ กำลังเล่นเสียง Lo-Fi...</div>}
            {showAllTracks&&<div style={{marginTop:12,maxHeight:160,overflowY:"auto"}}>{TRACKS.map(t=><div key={t.id} onClick={()=>{setTrack(t);setMProg(0);if(!playing){startLofi(t.bpm||72);setPlaying(true);}else changeBpm(t.bpm||72);}} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:6,cursor:"pointer",background:track.id===t.id?`${A}15`:"transparent",fontSize:12,marginBottom:2}}><span style={{opacity:track.id===t.id?1:0.4}}>{track.id===t.id&&playing?"▶":"♪"}</span><span style={{flex:1,opacity:track.id===t.id?1:0.7}}>{t.name}</span><span style={{opacity:0.3,fontSize:10}}>{t.bpm}bpm</span></div>)}</div>}
            {showAmb&&<div style={{marginTop:12}}><div style={{fontSize:11,opacity:0.4,marginBottom:6}}>Ambient</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>{AMBIENT.map(a=><button key={a.id} onClick={()=>setAmbients(p=>({...p,[a.id]:!p[a.id]}))} style={{padding:"6px 3px",borderRadius:8,fontSize:11,background:ambients[a.id]?`${A}20`:"rgba(255,255,255,0.03)",border:ambients[a.id]?`1px solid ${A}40`:"1px solid rgba(255,255,255,0.06)",color:T.text,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:14}}>{a.icon}</span>{a.name}</button>)}</div></div>}
          </Card>
          <Card bg={T.card} style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Task</span><button onClick={()=>setShowAddTask(!showAddTask)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddTask&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="New task..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:T.text,outline:"none"}}/><button onClick={addTodo} style={{padding:"7px 10px",borderRadius:8,background:A,border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
              {todos.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",cursor:"pointer"}} onClick={()=>setTodos(todos.map(x=>{if(x.id===t.id){if(!x.done){setXp(v=>v+10);setMood("happy");}return{...x,done:!x.done};}return x;}))}><div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:t.done?`2px solid ${A}`:"2px solid rgba(255,255,255,0.15)",background:t.done?A:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10}}>{t.done&&"✓"}</div><span style={{fontSize:13,textDecoration:t.done?"line-through":"none",opacity:t.done?0.35:0.8,flex:1}}>{t.text}</span><button onClick={e=>{e.stopPropagation();setTodos(todos.filter(x=>x.id!==t.id));}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:11}}>✕</button></div>)}
            </div>
          </Card>
        </div>

        {/* Habits + Progress */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card bg={T.card}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Daily Habits</span><button onClick={()=>setShowAddHabit(!showAddHabit)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddHabit&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newHabit} onChange={e=>setNewHabit(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} placeholder="เพิ่ม habit..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:T.text,outline:"none"}}/><button onClick={addHabit} style={{padding:"7px 10px",borderRadius:8,background:A,border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {habits.map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 10px",borderRadius:10,fontSize:12,background:h.done?`${A}18`:"rgba(255,255,255,0.03)",border:h.done?`1.5px solid ${A}40`:"1.5px solid rgba(255,255,255,0.05)"}}>
                <span style={{cursor:"pointer"}} onClick={()=>setHabits(habits.map(x=>{if(x.id===h.id){if(!x.done)setXp(v=>v+15);return{...x,done:!x.done};}return x;}))}>{h.icon}</span>
                <span style={{flex:1,opacity:h.done?0.5:0.8,cursor:"pointer"}} onClick={()=>setHabits(habits.map(x=>{if(x.id===h.id){if(!x.done)setXp(v=>v+15);return{...x,done:!x.done};}return x;}))}>{h.name}</span>
                {h.done&&<span style={{color:A,fontSize:11}}>✓</span>}
                <button onClick={()=>setHabits(habits.filter(x=>x.id!==h.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:10,padding:2}}>✕</button>
              </div>)}
            </div>
          </Card>
          <Card bg={T.card} style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Progress</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:5}}>{DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,opacity:0.35}}>{d}</div>)}</div>
            {Array.from({length:4}).map((_,w)=><div key={w} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>{Array.from({length:7}).map((_,d)=>{const v=getHeatReal(w,d);return<div key={d} style={{aspectRatio:"1",borderRadius:5,background:v>0?`${A}${Math.round((0.2+v*0.7)*255).toString(16).padStart(2,"0")}`:"rgba(255,255,255,0.04)"}}/>})}</div>)}
            {totalFocusMin===0&&<div style={{textAlign:"center",fontSize:11,opacity:0.3,marginTop:8}}>เริ่ม session แรกเพื่อดู progress!</div>}
          </Card>
        </div>
      </div>}

      {/* ═══ STATISTICS (real data only) ═══ */}
      {nav==="Statistics"&&<div style={{padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{display:"flex",gap:6,marginBottom:20}}>{["Day","Week","Month","All Time"].map(p=><button key={p} onClick={()=>setStatsPeriod(p)} style={{padding:"7px 18px",borderRadius:10,fontSize:12,fontWeight:600,background:statsPeriod===p?A:"rgba(255,255,255,0.04)",border:statsPeriod===p?`1.5px solid ${A}`:"1.5px solid rgba(255,255,255,0.06)",color:statsPeriod===p?"#fff":"rgba(255,255,255,0.45)"}}>{p}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
          {[{l:"Total Focus",v:`${periodFocusH}h ${periodFocusM}m`,i:"⏱"},{l:"Sessions",v:sessions,i:"🔄"},{l:"Tasks Done",v:completedTasks,i:"✅"},{l:"Habits Done",v:habits.filter(h=>h.done).length,i:"🎯"}].map((s,i)=>
            <Card key={i} bg={T.card} style={{textAlign:"center",padding:"18px 14px"}}><div style={{fontSize:26,marginBottom:6}}>{s.i}</div><div style={{fontSize:26,fontWeight:700,marginBottom:3}}>{s.v}</div><div style={{fontSize:12,opacity:0.4}}>{s.l}</div></Card>
          )}
        </div>
        {statsData.length>0?<Card bg={T.card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><span style={{fontSize:16,fontWeight:700}}>Focus Time</span><span style={{fontSize:11,opacity:0.4}}>{statsPeriod}</span></div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160,paddingBottom:24}}>
            <div style={{flex:1,display:"flex",alignItems:"flex-end",gap:Math.max(4,Math.floor(40/statsData.length))}}>
              {statsData.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:0}}>
                <div style={{width:"100%",borderRadius:7,height:`${Math.max(4,(d.focus/maxFocus)*130)}px`,background:`linear-gradient(180deg,${A},${A}44)`,transition:"height 0.5s",position:"relative"}}><div style={{position:"absolute",top:-18,width:"100%",textAlign:"center",fontSize:10,opacity:0.5}}>{d.focus}m</div></div>
                <span style={{fontSize:9,opacity:0.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{d.day}</span>
              </div>)}
            </div>
          </div>
        </Card>:<Card bg={T.card} style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:32,marginBottom:12}}>📊</div><div style={{fontSize:14,opacity:0.4}}>ยังไม่มีข้อมูล — เริ่ม session แรกเลย!</div></Card>}
      </div>}

      {/* ═══ PROFILE ═══ */}
      {nav==="Profile"&&<div style={{padding:"18px 24px 24px",maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <Card bg={T.card} style={{display:"flex",gap:24,alignItems:"center",marginBottom:18,padding:"28px 32px"}}>
          <div style={{width:88,height:88,borderRadius:26,flexShrink:0,background:`linear-gradient(135deg,${A},${A}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,fontWeight:700,color:"#fff",boxShadow:`0 8px 32px ${A}50`}}>{userName[0].toUpperCase()}</div>
          <div style={{flex:1}}><div style={{fontSize:26,fontWeight:700,marginBottom:3}}>{userName}</div><div style={{fontSize:13,opacity:0.4,marginBottom:10}}>Level {level} · {xp} XP</div></div>
        </Card>
        <Card bg={T.card} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>Level Progress</span><span style={{fontSize:13,color:A,fontWeight:600}}>Lv.{level} → {level+1}</span></div><div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:5,width:`${Math.min((xp/xpNext)*100,100)}%`,background:`linear-gradient(90deg,${A},${A}88)`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.5}}><span>{xp} XP</span><span>{xpNext} XP</span></div></Card>
        <Card bg={T.card} style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:16,fontWeight:700}}>Achievements</span><span style={{fontSize:12,opacity:0.4}}>{ACHIEVEMENTS.filter(a=>xp>=a.xpReq).length}/{ACHIEVEMENTS.length}</span></div>
          {["bronze","silver","gold","platinum","diamond"].map(tier=>{
            const items=ACHIEVEMENTS.filter(a=>a.tier===tier);
            if(!items.length)return null;
            return<div key={tier} style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,color:tierColors[tier],marginBottom:8,textTransform:"uppercase",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:tierColors[tier]}}/>{tier}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {items.map(a=>{const e=xp>=a.xpReq;return<div key={a.id} style={{textAlign:"center",padding:"14px 6px",borderRadius:14,background:e?`${A}18`:"rgba(255,255,255,0.02)",border:e?`1.5px solid ${tierColors[tier]}50`:"1.5px solid rgba(255,255,255,0.04)",opacity:e?1:0.3}}>
                  <div style={{fontSize:28,marginBottom:4}}>{a.icon}</div>
                  <div style={{fontSize:11,fontWeight:600,marginBottom:2}}>{a.name}</div>
                  <div style={{fontSize:10,opacity:0.5}}>{a.desc}</div>
                  <div style={{fontSize:9,marginTop:4,color:e?tierColors[tier]:"rgba(255,255,255,0.3)",fontWeight:600}}>{e?"✓ ได้รับแล้ว":a.xpReq+" XP"}</div>
                </div>})}
              </div>
            </div>;
          })}
        </Card>
      </div>}

      {/* ═══ SETTINGS ═══ */}
      {nav==="Settings"&&<div style={{padding:"18px 24px 24px",maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{fontSize:26,fontWeight:700,marginBottom:22}}>Settings</div>
        <Card bg={T.card} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>👤 Profile</div><div><div style={{fontSize:12,opacity:0.4,marginBottom:5}}>Display Name</div><input value={userName} onChange={e=>setUserName(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,fontSize:13,background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",color:T.text,outline:"none"}}/></div></Card>
        <Card bg={T.card} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🔔 Notifications</div>{[{l:"Timer Sound",d:"เล่นเสียงเมื่อหมดเวลา",on:notifSound,t:()=>setNotifSound(!notifSound)},{l:"Auto Break",d:"เริ่มพักอัตโนมัติ",on:autoBreak,t:()=>setAutoBreak(!autoBreak)}].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i===0?"1px solid rgba(255,255,255,0.04)":"none"}}><div><div style={{fontSize:13,opacity:0.8}}>{it.l}</div><div style={{fontSize:11,opacity:0.35}}>{it.d}</div></div><Toggle on={it.on} onToggle={it.t} accent={A}/></div>)}</Card>
        <Card bg={T.card} style={{marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🎨 Appearance</div>
          <div style={{fontSize:12,opacity:0.4,marginBottom:8}}>Theme</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {[{id:"dark",l:"Dark"},{id:"midnight",l:"Midnight"},{id:"forest",l:"Forest"}].map(t=>
              <button key={t.id} onClick={()=>setSelTheme(t.id)} style={{flex:1,padding:"14px 0",borderRadius:12,fontSize:12,fontWeight:600,background:THEMES[t.id].card,border:selTheme===t.id?`2px solid ${A}`:"2px solid rgba(255,255,255,0.06)",color:THEMES[t.id].text,boxShadow:selTheme===t.id?`0 0 16px ${A}33`:"none",transition:"all 0.3s"}}>{t.l}{selTheme===t.id&&" ✓"}</button>
            )}
          </div>
          <div style={{fontSize:12,opacity:0.4,marginBottom:8}}>Accent Color</div>
          <div style={{display:"flex",gap:8}}>
            {["#c9463d","#6366f1","#f59e0b","#10b981","#ec4899","#8b5cf6"].map(c=>
              <div key={c} onClick={()=>setSelAccent(c)} style={{width:32,height:32,borderRadius:10,cursor:"pointer",background:c,border:selAccent===c?"3px solid #fff":"3px solid transparent",boxShadow:selAccent===c?`0 0 12px ${c}66`:"none",transition:"all 0.2s"}}/>
            )}
          </div>
        </Card>
      </div>}

      {/* Story overlay */}
      {storyOpen&&<div onClick={()=>setStoryOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:28,cursor:"pointer",animation:"fadeIn 0.3s ease"}}>
        <div style={{maxWidth:520,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:14}}><div style={{width:56,height:56,borderRadius:18,margin:"0 auto 10px",background:`linear-gradient(135deg,${A}50,${A}18)`,border:`2px solid ${A}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>📖</div><div style={{fontSize:13,fontWeight:600,color:A}}>{todayStory.titleEN}</div><div style={{fontSize:11,opacity:0.4}}>Section {lineIdx+1}/5</div></div>
          <div style={{background:T.card,borderRadius:18,padding:"24px 28px",border:`1.5px solid ${A}33`}}>
            <div style={{fontSize:15,lineHeight:2,opacity:0.85}}>{todayStory.sections[lineIdx]}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
              <button onClick={()=>lineIdx>0&&setLineIdx(lineIdx-1)} style={{padding:"6px 16px",borderRadius:8,background:lineIdx>0?"rgba(255,255,255,0.06)":"transparent",border:"none",color:lineIdx>0?"rgba(255,255,255,0.5)":"transparent",fontSize:12}}>← ก่อนหน้า</button>
              {lineIdx<sectionsUnlocked-1?<button onClick={()=>setLineIdx(lineIdx+1)} style={{padding:"6px 16px",borderRadius:8,background:`${A}20`,border:`1px solid ${A}40`,color:A,fontSize:12,fontWeight:600}}>ถัดไป →</button>
              :<button onClick={()=>setStoryOpen(false)} style={{padding:"6px 16px",borderRadius:8,background:`${A}20`,border:`1px solid ${A}40`,color:A,fontSize:12,fontWeight:600}}>ปิด ✓</button>}
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
