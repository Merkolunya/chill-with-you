import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══ MUSIC DATA — each track has unique musical DNA ═══ */
const TRACKS = [
  { id:1,name:"Cozy Afternoon",artist:"Lo-Fi Chill",dur:"3:42",bpm:72,baseNote:261.6,scale:[0,4,7,11],wave:"sine",filterFreq:600 },
  { id:2,name:"Midnight Study",artist:"Dreamy Beats",dur:"4:15",bpm:80,baseNote:220,scale:[0,3,7,10],wave:"triangle",filterFreq:500 },
  { id:3,name:"Rainy Window",artist:"Ambient Wave",dur:"3:58",bpm:62,baseNote:196,scale:[0,5,7,12],wave:"sine",filterFreq:400 },
  { id:4,name:"Sunlit Pages",artist:"Warm Keys",dur:"4:01",bpm:88,baseNote:293.7,scale:[0,4,7,9],wave:"sine",filterFreq:800 },
  { id:5,name:"Stargazer",artist:"Night Owl",dur:"5:20",bpm:58,baseNote:174.6,scale:[0,3,5,7,10],wave:"triangle",filterFreq:350 },
  { id:6,name:"Coffee & Pages",artist:"Cafe Noir",dur:"3:33",bpm:76,baseNote:246.9,scale:[0,2,4,7,9],wave:"sine",filterFreq:700 },
  { id:7,name:"Neon Dreams",artist:"City Pulse",dur:"4:48",bpm:92,baseNote:329.6,scale:[0,3,7,8],wave:"sawtooth",filterFreq:450 },
  { id:8,name:"Gentle Stream",artist:"Forest Bath",dur:"6:02",bpm:54,baseNote:164.8,scale:[0,2,5,7],wave:"sine",filterFreq:300 },
  { id:9,name:"Pixel Memories",artist:"Retro Chill",dur:"3:15",bpm:82,baseNote:277.2,scale:[0,4,5,7,11],wave:"square",filterFreq:380 },
  { id:10,name:"Twilight Walk",artist:"Dusk Beats",dur:"4:37",bpm:68,baseNote:207.7,scale:[0,3,7,10,14],wave:"triangle",filterFreq:420 },
  { id:11,name:"Paper Cranes",artist:"Origami Sound",dur:"3:50",bpm:74,baseNote:233.1,scale:[0,2,7,9],wave:"sine",filterFreq:550 },
  { id:12,name:"Warm Blanket",artist:"Sunday Mood",dur:"5:10",bpm:60,baseNote:185,scale:[0,4,7,12],wave:"triangle",filterFreq:480 },
  { id:13,name:"Lavender Haze",artist:"Dream Soft",dur:"4:22",bpm:56,baseNote:155.6,scale:[0,3,5,8,10],wave:"sine",filterFreq:320 },
  { id:14,name:"Rooftop View",artist:"Sky Lounge",dur:"3:44",bpm:84,baseNote:311.1,scale:[0,2,4,6,7,11],wave:"sine",filterFreq:650 },
  { id:15,name:"Last Train Home",artist:"Night Commute",dur:"4:55",bpm:70,baseNote:196,scale:[0,3,5,7,10,12],wave:"triangle",filterFreq:400 },
];

const AMBIENT_DEFS = [
  { id:"rain",name:"Rain",icon:"🌧️",type:"noise",filterFreq:1200,gain:0.08 },
  { id:"fire",name:"Fire",icon:"🔥",type:"crackle",filterFreq:2000,gain:0.06 },
  { id:"birds",name:"Birds",icon:"🐦",type:"chirp",filterFreq:3000,gain:0.05 },
  { id:"wind",name:"Wind",icon:"🍃",type:"noise",filterFreq:400,gain:0.07 },
  { id:"cricket",name:"Crickets",icon:"🦗",type:"chirp",filterFreq:4000,gain:0.04 },
  { id:"waves",name:"Ocean",icon:"🌊",type:"wave",filterFreq:600,gain:0.09 },
  { id:"cafe",name:"Café",icon:"☕",type:"noise",filterFreq:800,gain:0.03 },
  { id:"thunder",name:"Thunder",icon:"⛈️",type:"rumble",filterFreq:150,gain:0.1 },
  { id:"train",name:"Train",icon:"🚂",type:"noise",filterFreq:300,gain:0.05 },
];

const TIMER_SOUNDS = [
  { id:"bell",name:"Bell 🔔" },
  { id:"chime",name:"Chime ✨" },
  { id:"soft",name:"Soft Ping 🌙" },
  { id:"none",name:"None 🔇" },
];

/* ═══ STORY (365 days, 5 sections each) ═══ */
const STORY_THEMES = [
  {titleEN:"Gentle Courage",sections:["วันนี้ขอเล่าเรื่องความกล้าเล็กๆ ให้ฟังนะ... บางทีความกล้าไม่ใช่การทำสิ่งยิ่งใหญ่ แต่คือการลุกขึ้นมาทำสิ่งเล็กๆ ซ้ำแล้วซ้ำเล่า แม้จะเหนื่อย","เคยมีคนบอกว่า 'ความกล้าที่แท้จริงคือการร้องไห้แล้วลุกขึ้นทำต่อ' ไม่ต้องแข็งแกร่งตลอดเวลาก็ได้นะ แค่อย่าหยุดเดิน","ลองนึกถึงต้นไม้เล็กๆ ที่แทรกตัวขึ้นมาจากรอยแตกของคอนกรีต มันไม่ได้แข็งแกร่ง แต่มันไม่ยอมแพ้ เหมือนกับเราทุกคน","ถ้าวันนี้รู้สึกว่าทำได้แค่นิดเดียว... ก็ดีแล้วนะ บางวันแค่ผ่านไปได้ก็ถือว่าเก่งมากแล้ว ให้เครดิตตัวเองบ้าง 💪","คืนนี้ก่อนนอน ลองบอกตัวเองว่า 'วันนี้เราทำดีแล้ว' แล้วพรุ่งนี้ค่อยเริ่มใหม่ด้วยกันนะ ✨"]},
  {titleEN:"Rainy Afternoon",sections:["เสียงฝนตกบนหลังคา... เป็นเสียงที่ทำให้รู้สึกปลอดภัยจังเลย เหมือนโลกกำลังบอกว่า 'พักได้นะ ฉันจะดูแลเอง'","วันฝนตกแบบนี้ เหมาะกับการนั่งมองหยดน้ำไหลตามกระจก แต่ละหยดเหมือนความคิดที่ค่อยๆ ไหลผ่านไป ไม่ต้องไปยึดมันทุกหยด","กลิ่นดินหลังฝนตก เป็นกลิ่นที่ทำให้รู้สึกว่าทุกอย่างสดใหม่ เหมือนได้เริ่มต้นใหม่ 🌧️","ฝนจะหยุดตกเสมอ เหมือนกับช่วงเวลาที่ยากลำบาก มันจะผ่านไป แล้ววันหนึ่งเราจะมองย้อนกลับมาแล้วยิ้มได้","ก่อนจะนอน ฟังเสียงฝนตกอีกสักพัก แล้วปล่อยให้มันพาเราเข้าสู่ฝันที่ดี... ราตรีสวัสดิ์นะ 💤"]},
  {titleEN:"The Art of Doing Nothing",sections:["วันนี้มาพูดเรื่อง 'การไม่ทำอะไร' กันดีกว่า... ในโลกที่ทุกคนวิ่งแข่งกัน การหยุดพักจริงๆ กลับกลายเป็นเรื่องยากที่สุด","คนเนเธอร์แลนด์มีคำว่า 'Niksen' แปลว่าการนั่งเฉยๆ โดยไม่ต้องมีจุดมุ่งหมาย ไม่ใช่ความขี้เกียจ แต่เป็นศิลปะของการพักผ่อน","ลองวางมือถือ ปิดตาสัก 30 วินาที หายใจเข้าลึกๆ... รู้สึกไหมว่าโลกช้าลง? นั่นแหละคือสิ่งที่ร่างกายเราต้องการ","ไม่ต้องรู้สึกผิดที่พักนะ แบตเตอรี่ที่ไม่ได้ชาร์จก็ใช้งานไม่ได้ เราก็เหมือนกัน ☕","วันนี้ก่อนนอน ลองนั่งเฉยๆ สัก 5 นาที ไม่ต้องคิดอะไร แค่อยู่กับตัวเอง... แค่นี้ก็เพียงพอแล้ว 🌿"]},
  {titleEN:"Starlight Philosophy",sections:["คืนนี้ลองมองดาวกันไหม? แสงดาวที่เราเห็นเดินทางมาหลายล้านปี บางดวงอาจดับไปแล้ว แต่แสงของมันยังอยู่","เหมือนกับสิ่งดีๆ ที่เราทำ ผลของมันอาจจะไปถึงใครสักคนที่เราไม่รู้จัก ในเวลาที่เราไม่คาดคิด","ในจักรวาลที่กว้างใหญ่นี้ การที่เรามีชีวิตอยู่ ณ ตรงนี้ ในเวลานี้ มันเป็นเรื่องมหัศจรรย์มากเลยนะ ✨","ไม่ต้องเปรียบเทียบตัวเองกับใคร ดาวแต่ละดวงก็ส่องสว่างในแบบของมันเอง เราก็เหมือนกัน","คืนนี้ก่อนนอน ส่งพลังดีๆ ไปกับแสงดาว ให้มันพาความสุขไปถึงทุกคนที่เรารัก 🌟"]},
  {titleEN:"Small Joys",sections:["ความสุขเล็กๆ มักซ่อนอยู่ในสิ่งที่เรามองข้ามไป... เช่น กลิ่นกาแฟตอนเช้า ลมเย็นๆ ที่พัดผ่าน หรือรอยยิ้มของคนแปลกหน้า","ลองนับดูว่าวันนี้มีอะไรดีๆ เกิดขึ้นบ้าง แม้แค่เรื่องเล็กน้อย... ได้กินอาหารอร่อย? ได้ยินเพลงที่ชอบ? แค่นี้ก็มีค่าแล้ว","คนญี่ปุ่นมีคำว่า 'อิคิไก' หมายถึงเหตุผลที่ทำให้อยากตื่นขึ้นมาทุกเช้า ไม่จำเป็นต้องเป็นเรื่องยิ่งใหญ่ ☕","ลองถ่ายรูปสิ่งเล็กๆ ที่ทำให้ยิ้มได้วันละรูป แล้วสิ้นเดือนกลับมาดู จะเห็นว่าชีวิตเรามีความสุขมากกว่าที่คิด","วันนี้ขอบคุณตัวเองที่สังเกตเห็นสิ่งเล็กๆ ดีๆ ในชีวิตนะ 💛"]},
  {titleEN:"Ocean Wisdom",sections:["ทะเลสอนอะไรเราหลายอย่าง... คลื่นที่ซัดเข้าหาฝั่งไม่เคยหยุด เหมือนกับชีวิตที่เดินหน้าต่อไปเสมอ","บางวันทะเลสงบ บางวันทะเลปั่นป่วน เหมือนอารมณ์ของเรา ไม่มีใครสงบได้ตลอดเวลา แค่รู้ว่ามันจะผ่านไปก็พอ","ปลาในทะเลไม่เคยกังวลว่าน้ำจะหมด มันแค่ว่ายไปเรื่อยๆ บางทีเราก็ควรเป็นแบบนั้นบ้าง 🐟","เสียงคลื่นมีจังหวะที่สม่ำเสมอ เหมือนหัวใจเต้น ธรรมชาติกำลังบอกว่า 'ทุกอย่างมีจังหวะของมัน อย่ารีบ'","คืนนี้ลองจินตนาการว่านั่งอยู่ริมทะเล ฟังเสียงคลื่น แล้วปล่อยให้ทุกความกังวลไหลไปกับน้ำ 🌊"]},
  {titleEN:"Growing Season",sections:["ทุกอย่างมีฤดูกาลของมัน... ฤดูปลูก ฤดูรอ ฤดูเก็บเกี่ยว ตอนนี้เราอยู่ในฤดูไหนก็ไม่เป็นไร","ต้นไม้ไม่เคยรีบโต มันค่อยๆ หยั่งรากลึกลงก่อน แล้วค่อยแผ่กิ่งก้าน ความสำเร็จที่ยั่งยืนก็เหมือนกัน","บางทีเราไม่เห็นการเติบโตของตัวเอง แต่ถ้าย้อนกลับไปดูเมื่อปีที่แล้ว จะเห็นว่าเราโตมากเลย 🌱","อย่าเปรียบเทียบ บทที่ 1 ของเรากับ บทที่ 20 ของคนอื่น ทุกคนมีเส้นทางของตัวเอง","คืนนี้ให้รางวัลตัวเองบ้างนะ ที่ยังคงเติบโตอยู่ ถึงจะช้า แต่ไม่เคยหยุด 🌻"]},
  {titleEN:"Mountain Meditation",sections:["ลองจินตนาการว่ายืนอยู่บนยอดเขาสูง... มองลงมาเห็นเมฆลอยต่ำกว่า ปัญหาต่างๆ ดูเล็กลงทันที","ภูเขาสูงเกิดจากการยกตัวทีละน้อย เป็นล้านๆ ปี ความพยายามเล็กๆ ของเราวันนี้ก็กำลังสร้างภูเขาเช่นกัน","นักปีนเขาบอกว่า 'อย่ามองยอดเขา ให้มองแค่ก้าวต่อไป' ใช้ได้กับชีวิตเลย ⛰️","อากาศบนยอดเขาบางเบาแต่สดชื่น เหมือนความรู้สึกหลังจากทำอะไรยากๆ สำเร็จ","คืนนี้หลับตาแล้วจินตนาการว่าอยู่บนยอดเขา หายใจเข้าลึกๆ... เก็บความรู้สึกอิสระนี้ไว้นะ 🏔️"]},
  {titleEN:"Music of Life",sections:["ชีวิตเหมือนเพลง... มีจังหวะเร็ว จังหวะช้า มีท่อนที่สนุก และท่อนที่เศร้า แต่ทั้งหมดรวมกันถึงเป็นเพลงที่สมบูรณ์","ไม่มีเพลงไหนที่มีแต่โน้ตสูง การพักก็สำคัญเหมือนตัวโน้ต ความเงียบทำให้เสียงมีความหมาย 🎵","ทุกคนมีเพลงประจำตัว จังหวะของเราไม่จำเป็นต้องเหมือนใคร","เวลาฟังเพลง สมองจะหลั่งสารแห่งความสุข นี่คือเหตุผลว่าทำไมเพลงถึงเยียวยาได้","คืนนี้ให้เพลงโปรดเป็นเพื่อนก่อนนอนนะ พรุ่งนี้เรามาสร้างเพลงบทใหม่ด้วยกัน 🎶"]},
  {titleEN:"Moonlight Letters",sections:["ถ้าเขียนจดหมายถึงตัวเองในอนาคตได้ จะเขียนว่าอะไร? บางทีแค่บอกว่า 'ผ่านมาได้ดีมาก' ก็พอแล้ว","การเขียนเป็นวิธีเยียวยาที่ดีมาก ไม่ต้องเขียนสวย แค่เขียนออกมาจากใจ","จดหมายจากอดีตคือของขวัญล้ำค่า ลองเขียนบันทึกวันนี้สักหน้า 📝","แสงจันทร์คืนนี้ส่องสว่างพอดี เหมือนกำลังบอกว่า 'แม้ในความมืด ก็ยังมีแสงเสมอ'","คืนนี้ก่อนนอน ลองเขียนสิ่งดีๆ 3 อย่างที่เกิดขึ้นวันนี้ แล้วจะรู้สึกขอบคุณชีวิตมากขึ้น 🌙"]},
  {titleEN:"Dawn Runner",sections:["ตอนเช้าเป็นช่วงเวลาที่วิเศษ... โลกเงียบสงบ อากาศเย็นสดชื่น เหมือนได้หน้ากระดาษเปล่าใหม่ทุกวัน","ไม่ต้องตื่นตี 5 ก็ได้นะ แค่ตื่นขึ้นมาแล้วใช้ 5 นาทีแรกอยู่กับตัวเอง ก่อนจะเปิดมือถือ","แสงแดดยามเช้ามีพลังมากกว่าที่คิด ช่วยปรับนาฬิกาชีวิต ทำให้นอนหลับดีขึ้น ☀️","ลองตั้งเป้าเล็กๆ สำหรับพรุ่งนี้ แล้วเช้าขึ้นมาทำมันเป็นอย่างแรก","คืนนี้พักผ่อนให้เต็มที่นะ เพราะพรุ่งนี้เช้า โลกกำลังรอให้เราไปทักทาย 🌅"]},
  {titleEN:"Forest Whispers",sections:["ในป่าลึก ต้นไม้สื่อสารกันผ่านรากใต้ดิน แบ่งปันอาหารและน้ำให้กัน ธรรมชาติสอนเรื่องการช่วยเหลือกัน","เสียงลมพัดผ่านใบไม้ เสียงนกร้อง เสียงลำธาร... ธรรมชาติมี playlist ของตัวเอง และมันฟรี","ต้นไม้ใหญ่ทุกต้นเคยเป็นเมล็ดเล็กๆ มาก่อน ไม่มีใครเริ่มจากจุดสูงสุด 🌲","การเดินในป่าช่วยลดความเครียดได้จริงๆ แม้แค่จินตนาการก็ช่วยได้","คืนนี้ลองปิดไฟ ปิดจอ ฟังเสียงธรรมชาติสักพัก ให้ตัวเองกลับไปเป็นส่วนหนึ่งของโลกใบนี้ 🍃"]},
  {titleEN:"Kindness Ripple",sections:["ความเมตตาเป็นเหมือนก้อนหินที่โยนลงน้ำ... คลื่นแผ่กว้างออกไปไกลกว่าที่คิด","ลองยิ้มให้คนแปลกหน้า ขอบคุณพนักงานร้านสะดวกซื้อ ส่งข้อความหาเพื่อนเก่า... สิ่งเล็กๆ แต่มีพลังมหาศาล","ความเมตตาต่อตัวเองก็สำคัญนะ หยุดตำหนิตัวเอง ลองพูดกับตัวเองอย่างอ่อนโยนบ้าง 💝","คนที่ช่วยเหลือผู้อื่นมีความสุขมากกว่า สมองหลั่ง endorphin เหมือนตอนออกกำลังกาย","คืนนี้ลองทำสิ่งดีๆ ให้ตัวเอง อาจจะแค่ทำชาร้อนๆ สักแก้ว แล้วนั่งจิบช้าๆ ☕"]},
  {titleEN:"Dreamcatcher",sections:["ความฝันเป็นเรื่องน่าทึ่ง... ตอนที่เราหลับ สมองกำลังจัดเรียงความทรงจำ แก้ปัญหา และสร้างไอเดียใหม่ๆ","หลายสิ่งประดิษฐ์ที่ยิ่งใหญ่เกิดจากความฝัน ฝันไม่ใช่แค่ภาพลวง","ลองวาง notebook ไว้ข้างเตียง ตื่นมาจดสิ่งที่ฝันทันที 💭","การนอนหลับที่ดีเป็นพื้นฐานของทุกอย่าง สุขภาพ ความคิดสร้างสรรค์ อารมณ์ดี","คืนนี้ปล่อยให้ตัวเองฝันอย่างเต็มที่ มันคือของขวัญจากสมองที่รักเรา ฝันดีนะ 💤"]},
];

function getStoryForDay(d){return STORY_THEMES[d%STORY_THEMES.length];}
function getDayOfYear(){const n=new Date(),s=new Date(n.getFullYear(),0,0);return Math.floor((n-s)/(1e3*60*60*24));}

const ACHIEVEMENTS=[
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
  {id:15,name:"ปรมาจารย์",desc:"ปลดล็อก 12 อัน",icon:"⭐",xpReq:2500,tier:"platinum"},
  {id:16,name:"ไม่หยุดพัก",desc:"สะสม 100 sessions",icon:"🚀",xpReq:5000,tier:"diamond"},
];
const tierColors={bronze:"#cd7f32",silver:"#c0c0c0",gold:"#ffd700",platinum:"#e5e4e2",diamond:"#b9f2ff"};
const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const fmt=s=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
const THEMES={dark:{bg:"#111113",card:"#1a1a1e",text:"#e8e4e0"},midnight:{bg:"#0a0a1a",card:"#12122a",text:"#e0e0f0"},forest:{bg:"#0a1510",card:"#132218",text:"#d0e8d8"}};

function Card({children,style,bg}){return<div style={{background:bg||"#1a1a1e",borderRadius:24,padding:"22px 24px",...style}}>{children}</div>;}
function Toggle({on,onToggle,accent}){return<div onClick={onToggle} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?(accent||"#c9463d"):"rgba(255,255,255,0.1)",padding:2,transition:"all 0.25s",display:"flex",alignItems:"center",justifyContent:on?"flex-end":"flex-start"}}><div style={{width:20,height:20,borderRadius:10,background:"#fff",transition:"all 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/></div>;}

/* ═══ AUDIO ENGINE — truly unique per track + ambient ═══ */
function useAudioEngine(){
  const ctxRef=useRef(null);
  const musicRef=useRef(null);
  const ambientRef=useRef({});

  const getCtx=useCallback(()=>{
    if(!ctxRef.current) ctxRef.current=new(window.AudioContext||window.webkitAudioContext)();
    if(ctxRef.current.state==='suspended') ctxRef.current.resume();
    return ctxRef.current;
  },[]);

  const semitoneToFreq=(base,semi)=>base*Math.pow(2,semi/12);

  const startMusic=useCallback((trackData)=>{
    stopMusic();
    const ctx=getCtx();
    const master=ctx.createGain();master.gain.value=0.1;master.connect(ctx.destination);
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=trackData.filterFreq;filter.Q.value=1;filter.connect(master);

    // Pad: 3 oscillators from track's scale
    const padNotes=[trackData.scale[0],trackData.scale[1]||4,trackData.scale[2]||7];
    const oscs=padNotes.map(semi=>{
      const o=ctx.createOscillator();const g=ctx.createGain();
      o.type=trackData.wave;o.frequency.value=semitoneToFreq(trackData.baseNote,semi);
      g.gain.value=0.04;o.connect(g);g.connect(filter);o.start();
      // Slow LFO for movement
      const lfo=ctx.createOscillator();const lfoG=ctx.createGain();
      lfo.frequency.value=0.2+Math.random()*0.3;lfoG.gain.value=2;
      lfo.connect(lfoG);lfoG.connect(o.frequency);lfo.start();
      return{o,g,lfo,lfoG};
    });

    // Vinyl noise
    const bufSize=ctx.sampleRate*2;const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);
    const d=buf.getChannelData(0);for(let i=0;i<bufSize;i++)d[i]=(Math.random()*2-1)*0.012;
    const noise=ctx.createBufferSource();noise.buffer=buf;noise.loop=true;
    const nf=ctx.createBiquadFilter();nf.type='lowpass';nf.frequency.value=600;
    noise.connect(nf);nf.connect(master);noise.start();

    // Melodic arp — plays notes from the scale at bpm
    const arpInterval=60/trackData.bpm;
    let noteIdx=0;
    const arpTimer=setInterval(()=>{
      try{
        const ctx2=ctxRef.current;if(!ctx2)return;
        const semi=trackData.scale[noteIdx%trackData.scale.length];
        const freq=semitoneToFreq(trackData.baseNote*(noteIdx%2===0?1:2),semi);
        const o=ctx2.createOscillator();const g=ctx2.createGain();
        o.type=trackData.wave==='sawtooth'?'triangle':trackData.wave;
        o.frequency.value=freq;g.gain.setValueAtTime(0.05,ctx2.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,ctx2.currentTime+arpInterval*1.5);
        o.connect(g);g.connect(filter);o.start();o.stop(ctx2.currentTime+arpInterval*1.5);
        noteIdx++;
      }catch(e){}
    },arpInterval*1000);

    // Kick/hat pattern unique per bpm
    const beatInterval=60/trackData.bpm;
    const beatTimer=setInterval(()=>{
      try{
        const ctx2=ctxRef.current;if(!ctx2)return;
        const kick=ctx2.createOscillator();const kg=ctx2.createGain();
        kick.type='sine';kick.frequency.setValueAtTime(120+trackData.bpm*0.3,ctx2.currentTime);
        kick.frequency.exponentialRampToValueAtTime(40,ctx2.currentTime+0.08);
        kg.gain.setValueAtTime(0.06,ctx2.currentTime);
        kg.gain.exponentialRampToValueAtTime(0.001,ctx2.currentTime+0.15);
        kick.connect(kg);kg.connect(master);kick.start();kick.stop(ctx2.currentTime+0.15);
      }catch(e){}
    },beatInterval*2000);

    musicRef.current={oscs,noise,nf,master,filter,arpTimer,beatTimer};
  },[getCtx]);

  const stopMusic=useCallback(()=>{
    const n=musicRef.current;if(!n)return;
    if(n.arpTimer)clearInterval(n.arpTimer);
    if(n.beatTimer)clearInterval(n.beatTimer);
    if(n.oscs)n.oscs.forEach(({o,lfo})=>{try{o.stop();lfo.stop();}catch(e){}});
    if(n.noise)try{n.noise.stop();}catch(e){}
    musicRef.current=null;
  },[]);

  // Ambient sounds — each type generates differently
  const startAmbient=useCallback((ambDef)=>{
    if(ambientRef.current[ambDef.id])return;
    const ctx=getCtx();
    const master=ctx.createGain();master.gain.value=ambDef.gain;master.connect(ctx.destination);
    const bufSize=ctx.sampleRate*4;const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);
    const data=buf.getChannelData(0);
    // Generate different textures
    if(ambDef.type==='noise'||ambDef.type==='wave'||ambDef.type==='rumble'){
      for(let i=0;i<bufSize;i++){
        const t=i/ctx.sampleRate;
        let val=Math.random()*2-1;
        if(ambDef.type==='wave')val*=Math.sin(t*0.3)*0.7+0.3; // Ocean swell
        if(ambDef.type==='rumble')val*=Math.sin(t*0.15)*0.5+0.5; // Thunder rumble
        data[i]=val;
      }
    } else if(ambDef.type==='crackle'){
      for(let i=0;i<bufSize;i++) data[i]=Math.random()>0.97?(Math.random()*2-1)*0.8:Math.random()*0.02-0.01;
    } else if(ambDef.type==='chirp'){
      for(let i=0;i<bufSize;i++){
        const t=i/ctx.sampleRate;
        const chirpRate=ambDef.filterFreq>3500?6:3;
        data[i]=Math.sin(t*ambDef.filterFreq*Math.sin(t*chirpRate))*0.3*(Math.sin(t*chirpRate)>0.5?1:0.05);
      }
    }
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
    const flt=ctx.createBiquadFilter();flt.type='lowpass';flt.frequency.value=ambDef.filterFreq;
    src.connect(flt);flt.connect(master);src.start();
    ambientRef.current[ambDef.id]={src,flt,master};
  },[getCtx]);

  const stopAmbient=useCallback((id)=>{
    const n=ambientRef.current[id];if(!n)return;
    try{n.src.stop();}catch(e){}
    delete ambientRef.current[id];
  },[]);

  const playTimerSound=useCallback((type)=>{
    if(type==='none')return;
    const ctx=getCtx();const g=ctx.createGain();g.gain.value=0.15;g.connect(ctx.destination);
    if(type==='bell'){
      const o=ctx.createOscillator();o.type='sine';o.frequency.value=880;
      o.connect(g);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.5);
      o.start();o.stop(ctx.currentTime+1.5);
    } else if(type==='chime'){
      [880,1100,1320].forEach((f,i)=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;const og=ctx.createGain();og.gain.setValueAtTime(0.1,ctx.currentTime+i*0.2);og.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.2+0.8);o.connect(og);og.connect(ctx.destination);o.start(ctx.currentTime+i*0.2);o.stop(ctx.currentTime+i*0.2+0.8);});
    } else if(type==='soft'){
      const o=ctx.createOscillator();o.type='triangle';o.frequency.value=440;
      o.connect(g);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.6);
      o.start();o.stop(ctx.currentTime+0.6);
    }
  },[getCtx]);

  return{startMusic,stopMusic,startAmbient,stopAmbient,playTimerSound};
}

/* ═══ localStorage helper ═══ */
function useLocalState(key, initial) {
  const[val,setVal]=useState(()=>{
    try{const s=localStorage.getItem("chill_"+key);return s!==null?JSON.parse(s):initial;}
    catch{return initial;}
  });
  useEffect(()=>{try{localStorage.setItem("chill_"+key,JSON.stringify(val));}catch{}},[key,val]);
  return[val,setVal];
}

/* ═══ MAIN APP ═══ */
export default function App(){
  const[nav,setNav]=useState("Home");
  const[mode,setMode]=useState("work");
  const[workMin,setWorkMin]=useLocalState("workMin",25);
  const[breakMin,setBreakMin]=useLocalState("breakMin",5);
  const[time,setTime]=useState(()=>{try{const w=localStorage.getItem("chill_workMin");return w?JSON.parse(w)*60:25*60;}catch{return 25*60;}});
  const[running,setRunning]=useState(false);
  const[sessions,setSessions]=useLocalState("sessions_"+new Date().toISOString().split("T")[0],0);
  const[rounds,setRounds]=useLocalState("rounds",4);
  const timerRef=useRef(null);

  const[todos,setTodos]=useLocalState("todos",[{id:1,text:"Design",done:false},{id:2,text:"Web development",done:false},{id:3,text:"Social media content",done:false}]);
  const[newTodo,setNewTodo]=useState("");
  const[showAddTask,setShowAddTask]=useState(false);
  const[tasksDoneToday,setTasksDoneToday]=useLocalState("tasksDone_"+new Date().toISOString().split("T")[0],0);

  const[habits,setHabits]=useLocalState("habits",[{id:1,name:"ดื่มน้ำ",icon:"💧",done:false},{id:2,name:"ยืดเส้น",icon:"🧘",done:false},{id:3,name:"อ่านหนังสือ",icon:"📖",done:false},{id:4,name:"นั่งสมาธิ",icon:"🧠",done:false}]);
  const[newHabit,setNewHabit]=useState("");
  const[showAddHabit,setShowAddHabit]=useState(false);

  const[track,setTrack]=useState(TRACKS[0]);
  const[playing,setPlaying]=useState(false);
  const[ambients,setAmbients]=useState({});
  const[mProg,setMProg]=useState(0);
  const[showAmb,setShowAmb]=useState(false);
  const[showAllTracks,setShowAllTracks]=useState(false);

  const[xp,setXp]=useLocalState("xp",0);
  const level=Math.floor(xp/150)+1;const xpNext=level*150;

  const[storyOpen,setStoryOpen]=useState(false);
  const[lineIdx,setLineIdx]=useState(0);
  const[workLog,setWorkLog]=useLocalState("workLog",{});
  // dailyLog: { "2026-03-16": { sessions:2, tasksDone:3, habitsDone:2 }, ... }
  const[dailyLog,setDailyLog]=useLocalState("dailyLog",{});
  const[mood,setMood]=useState("idle");
  const saveDailyField=(field,value)=>{
    const dk=new Date().toISOString().split("T")[0];
    setDailyLog(l=>({...l,[dk]:{...(l[dk]||{sessions:0,tasksDone:0,habitsDone:0}),[field]:value}}));
  };

  const[userName,setUserName]=useLocalState("userName","User");
  const[notifSound,setNotifSound]=useLocalState("notifSound",true);
  const[autoBreak,setAutoBreak]=useLocalState("autoBreak",true);
  const[selTheme,setSelTheme]=useLocalState("selTheme","dark");
  const[selAccent,setSelAccent]=useLocalState("selAccent","#c9463d");
  const[statsPeriod,setStatsPeriod]=useState("Week");
  const[timerSound,setTimerSound]=useLocalState("timerSound","bell");
  const[dailyGoal,setDailyGoal]=useLocalState("dailyGoal",8);

  const T=THEMES[selTheme]||THEMES.dark;
  const A=selAccent;
  const{startMusic,stopMusic,startAmbient,stopAmbient,playTimerSound}=useAudioEngine();

  const dayOfYear=useMemo(()=>getDayOfYear(),[]);
  const todayStory=useMemo(()=>getStoryForDay(dayOfYear),[dayOfYear]);
  const sectionsUnlocked=Math.min(sessions+1,5);

  // Toggle music
  const togglePlay=useCallback(()=>{
    if(playing){stopMusic();setPlaying(false);}
    else{startMusic(track);setPlaying(true);}
  },[playing,track,startMusic,stopMusic]);

  // Change track
  const doChangeTrack=(newTrack)=>{setTrack(newTrack);setMProg(0);if(playing){stopMusic();startMusic(newTrack);}};
  const doNext=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);doChangeTrack(TRACKS[(i+1)%TRACKS.length]);};
  const doPrev=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);doChangeTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);};

  // Toggle ambient
  const toggleAmbient=(ambDef)=>{
    if(ambients[ambDef.id]){stopAmbient(ambDef.id);setAmbients(p=>{const n={...p};delete n[ambDef.id];return n;});}
    else{startAmbient(ambDef);setAmbients(p=>({...p,[ambDef.id]:true}));}
  };

  // Timer
  useEffect(()=>{
    if(running&&time>0){timerRef.current=setInterval(()=>setTime(t=>t-1),1000);}
    else if(time===0&&running){
      setRunning(false);
      if(notifSound)playTimerSound(timerSound);
      if(mode==="work"){setXp(x=>x+workMin*2);setSessions(s=>{const nv=s+1;saveDailyField("sessions",nv);return nv;});const d=new Date().toISOString().split("T")[0];setWorkLog(l=>({...l,[d]:(l[d]||0)+workMin}));setMood("happy");setMode("break");setTime(breakMin*60);}
      else{setMode("work");setTime(workMin*60);setMood("idle");}
    }
    return()=>clearInterval(timerRef.current);
  },[running,time,mode,workMin,breakMin,notifSound,timerSound,playTimerSound]);

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

  // Task toggle with XP bind/unbind + dailyLog
  const toggleTask=(id)=>{
    setTodos(prev=>{
      const next=prev.map(t=>{
        if(t.id===id){
          if(!t.done){setXp(x=>x+10);setTasksDoneToday(v=>{const nv=v+1;saveDailyField("tasksDone",nv);return nv;});setMood("happy");}
          else{setXp(x=>Math.max(0,x-10));setTasksDoneToday(v=>{const nv=Math.max(0,v-1);saveDailyField("tasksDone",nv);return nv;});}
          return{...t,done:!t.done};
        }return t;
      });
      return next;
    });
  };
  // Habit toggle with XP bind/unbind + dailyLog
  const toggleHabit=(id)=>{
    setHabits(prev=>{
      const next=prev.map(h=>{
        if(h.id===id){
          if(!h.done){setXp(x=>x+15);} else{setXp(x=>Math.max(0,x-15));}
          return{...h,done:!h.done};
        }return h;
      });
      const doneCount=next.filter(h=>h.done).length;
      saveDailyField("habitsDone",doneCount);
      return next;
    });
  };

  // Stats — compute from workLog + dailyLog per period
  const todayKey=now.toISOString().split("T")[0];
  const getDaysInPeriod=()=>{
    if(statsPeriod==="Day")return[todayKey];
    const days=[];
    const count=statsPeriod==="Week"?7:statsPeriod==="Month"?30:999;
    for(let i=0;i<count;i++){const d=new Date(now);d.setDate(d.getDate()-i);days.push(d.toISOString().split("T")[0]);}
    return days;
  };
  const periodDays=getDaysInPeriod();

  // Aggregated stats from dailyLog for chosen period
  const periodStats=useMemo(()=>{
    let totalFocus=0,totalSessions=0,totalTasks=0,totalHabits=0;
    periodDays.forEach(dk=>{
      totalFocus+=(workLog[dk]||0);
      const dl=dailyLog[dk]||{};
      totalSessions+=(dl.sessions||0);
      totalTasks+=(dl.tasksDone||0);
      totalHabits+=(dl.habitsDone||0);
    });
    return{totalFocus,totalSessions,totalTasks,totalHabits,
      focusH:Math.floor(totalFocus/60),focusM:totalFocus%60};
  },[periodDays,workLog,dailyLog]);

  // Per-day breakdown for charts (all days that have ANY data in period)
  const dailyChartData=useMemo(()=>{
    const sorted=[...periodDays].sort();
    return sorted.map(dk=>{
      const dl=dailyLog[dk]||{};
      return{
        day:statsPeriod==="Day"?"Today":statsPeriod==="Month"?dk.slice(8):dk.slice(5),
        focus:workLog[dk]||0,
        sessions:dl.sessions||0,
        tasks:dl.tasksDone||0,
        habits:dl.habitsDone||0,
      };
    }).filter(d=>d.focus>0||d.sessions>0||d.tasks>0||d.habits>0);
  },[periodDays,workLog,dailyLog,statsPeriod]);
  const hasAnyData=dailyChartData.length>0;

  const getHeatReal=(w,d)=>{const dt=new Date(now);dt.setDate(dt.getDate()-((3-w)*7+(6-d)));const dk=dt.toISOString().split("T")[0];return Math.min((workLog[dk]||0)/60,1);};

  const cycleWorkUp=()=>{if(running)return;const v=Math.min(90,workMin+5);setWorkMin(v);if(mode==="work")setTime(v*60);};
  const cycleWorkDown=()=>{if(running)return;const v=Math.max(3,workMin-5);setWorkMin(v);if(mode==="work")setTime(v*60);};
  const cycleBreakUp=()=>{if(running)return;const v=Math.min(30,breakMin+5);setBreakMin(v);if(mode==="break")setTime(v*60);};
  const cycleBreakDown=()=>{if(running)return;const v=Math.max(1,breakMin-1);setBreakMin(v);if(mode==="break")setTime(v*60);};

  const navIcons={Home:"⌂",Statistics:"📊",Profile:"👤",Settings:"⚙"};
  const completedTasks=todos.filter(t=>t.done).length;

  return(
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",width:"100%",minHeight:"100vh",background:T.bg,color:T.text,transition:"background 0.5s,color 0.5s"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}input,button,select{font-family:inherit}button{cursor:pointer}`}</style>

      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",gap:4,padding:"14px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexWrap:"wrap"}}>
        {["Home","Statistics","Profile","Settings"].map(n=><button key={n} onClick={()=>setNav(n)} style={{padding:"7px 16px",borderRadius:10,background:nav===n?A:"transparent",color:nav===n?"#fff":"rgba(255,255,255,0.45)",border:"none",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6}}><span>{navIcons[n]}</span>{n}</button>)}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:`${A}20`,border:`1px solid ${A}40`,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:A,display:"flex",alignItems:"center",gap:5}}>⭐Lv.{level}<span style={{opacity:0.5,fontWeight:400}}>{xp}XP</span></div>
          <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${A},${A}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{userName[0].toUpperCase()}</div>
        </div>
      </nav>

      {/* HOME */}
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
          <button onClick={()=>{if(!running)setMood("working");setRunning(!running);}} style={{width:"100%",maxWidth:260,padding:"12px 0",borderRadius:13,background:running?`${A}25`:A,border:`1.5px solid ${running?`${A}66`:A}`,color:running?A:"#fff",fontSize:15,fontWeight:600}}>{running?"Pause session":"Start session"}</button>
          <div style={{display:"flex",gap:12,marginTop:14,fontSize:12,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><button onClick={cycleWorkDown} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button><span style={{opacity:0.6,minWidth:56,textAlign:"center"}}>Work:{workMin}m</span><button onClick={cycleWorkUp} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><button onClick={cycleBreakDown} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button><span style={{opacity:0.6,minWidth:56,textAlign:"center"}}>Break:{breakMin}m</span><button onClick={cycleBreakUp} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            <span onClick={()=>!running&&setRounds(r=>r>=8?2:r+1)} style={{cursor:"pointer",opacity:0.5,borderBottom:"1px dashed rgba(255,255,255,0.3)"}}>×{rounds}</span>
          </div>
        </Card>

        {/* Calendar + Story */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card bg={T.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:18,fontWeight:700}}>Calendar</span><div style={{border:`1.5px solid ${A}`,borderRadius:20,padding:"4px 14px",color:A,fontSize:12,fontWeight:600}}>Today</div></div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>{calDates.map((d,i)=>{const isT=d.toDateString()===now.toDateString();return<div key={i} style={{flex:1,textAlign:"center",padding:"7px 0",borderRadius:10,background:isT?`${A}25`:"rgba(255,255,255,0.03)",border:isT?`1.5px solid ${A}66`:"1.5px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:10,opacity:0.4}}>{DAYS[(d.getDay()+6)%7]}</div><div style={{fontSize:18,fontWeight:600}}>{d.getDate()}</div></div>})}</div>
            {/* Stats row: sessions + tasks done + focus */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,fontSize:13}}>
              <span style={{color:A,fontWeight:700}}>{sessions}</span><span style={{opacity:0.3}}>sessions</span>
              <span style={{opacity:0.15}}>|</span>
              <span style={{color:A,fontWeight:700}}>{completedTasks}</span><span style={{opacity:0.3}}>tasks</span>
              <span style={{fontWeight:600,marginLeft:"auto"}}>{focusH}H {focusM}M</span>
            </div>
          </Card>
          <Card bg={T.card} style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>{todayStory.titleEN}</span><span style={{fontSize:11,opacity:0.4}}>{sectionsUnlocked}/5</span></div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
              {todayStory.sections.map((sec,idx)=>{const u=idx<sectionsUnlocked;return<button key={idx} onClick={()=>{if(u){setLineIdx(idx);setStoryOpen(true);}}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:10,background:u?`${A}10`:"rgba(255,255,255,0.02)",border:u?`1px solid ${A}20`:"1px solid rgba(255,255,255,0.04)",color:T.text,fontSize:12,textAlign:"left",opacity:u?1:0.3}}><span>{u?"📖":"🔒"}</span><span style={{flex:1}}>{u?sec.slice(0,40)+"...":`session ${idx} เพื่อปลดล็อก`}</span></button>})}
            </div>
            <div style={{fontSize:10,opacity:0.3,marginTop:6,textAlign:"center"}}>เรื่องเปลี่ยนทุกวัน · ปลดล็อกทุก session</div>
          </Card>
        </div>

        {/* Music + Tasks */}
        <div style={{display:"flex",gap:14}}>
          <Card bg={T.card} style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Music</span>
              <button onClick={()=>setShowAmb(!showAmb)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{showAmb?"✕":"🌿"}</button>
            </div>
            <div style={{fontSize:13,fontWeight:500}}>{track.name}</div>
            <div style={{fontSize:11,opacity:0.4,marginBottom:12}}>{track.artist} · {track.bpm}bpm · {track.wave}</div>
            <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.08)",marginBottom:14,overflow:"hidden"}}><div style={{height:"100%",width:`${mProg}%`,background:`linear-gradient(90deg,${A},${A}88)`,transition:"width 0.3s"}}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:10}}>
              <button onClick={doPrev} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏮</button>
              <button onClick={togglePlay} style={{width:36,height:36,borderRadius:"50%",background:A,border:"none",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?"⏸":"▶"}</button>
              <button onClick={doNext} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏭</button>
            </div>
            {playing&&<div style={{textAlign:"center",marginBottom:8,fontSize:10,color:A,opacity:0.7}}>♪ กำลังเล่น Lo-Fi...</div>}
            {/* Track list — always visible */}
            <div style={{maxHeight:200,overflowY:"auto",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:8}}>{TRACKS.map(t=><div key={t.id} onClick={()=>doChangeTrack(t)} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:6,cursor:"pointer",background:track.id===t.id?`${A}15`:"transparent",fontSize:12,marginBottom:2,transition:"background 0.15s"}}><span style={{opacity:track.id===t.id?1:0.4,fontSize:11}}>{track.id===t.id&&playing?"▶":"♪"}</span><span style={{flex:1,opacity:track.id===t.id?1:0.6}}>{t.name}</span><span style={{opacity:0.3,fontSize:10}}>{t.bpm}bpm</span></div>)}</div>
            {showAmb&&<div style={{marginTop:10}}><div style={{fontSize:11,opacity:0.4,marginBottom:6}}>Ambient Sounds</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>{AMBIENT_DEFS.map(a=><button key={a.id} onClick={()=>toggleAmbient(a)} style={{padding:"6px 3px",borderRadius:8,fontSize:11,background:ambients[a.id]?`${A}20`:"rgba(255,255,255,0.03)",border:ambients[a.id]?`1px solid ${A}40`:"1px solid rgba(255,255,255,0.06)",color:T.text,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:14}}>{a.icon}</span>{a.name}{ambients[a.id]&&<span style={{fontSize:8,color:A}}>ON</span>}</button>)}</div></div>}
          </Card>
          <Card bg={T.card} style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Task</span><button onClick={()=>setShowAddTask(!showAddTask)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddTask&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="New task..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:T.text,outline:"none"}}/><button onClick={addTodo} style={{padding:"7px 10px",borderRadius:8,background:A,border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
              {todos.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",cursor:"pointer"}} onClick={()=>toggleTask(t.id)}><div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:t.done?`2px solid ${A}`:"2px solid rgba(255,255,255,0.15)",background:t.done?A:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10}}>{t.done&&"✓"}</div><span style={{fontSize:13,textDecoration:t.done?"line-through":"none",opacity:t.done?0.35:0.8,flex:1}}>{t.text}</span><button onClick={e=>{e.stopPropagation();setTodos(todos.filter(x=>x.id!==t.id));}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:11}}>✕</button></div>)}
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
                <span style={{cursor:"pointer"}} onClick={()=>toggleHabit(h.id)}>{h.icon}</span>
                <span style={{flex:1,opacity:h.done?0.5:0.8,cursor:"pointer"}} onClick={()=>toggleHabit(h.id)}>{h.name}</span>
                {h.done&&<span style={{color:A,fontSize:11}}>✓</span>}
                <button onClick={()=>setHabits(habits.filter(x=>x.id!==h.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:10}}>✕</button>
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

      {/* STATISTICS */}
      {nav==="Statistics"&&<div style={{padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{display:"flex",gap:6,marginBottom:20}}>{["Day","Week","Month","All Time"].map(p=><button key={p} onClick={()=>setStatsPeriod(p)} style={{padding:"7px 18px",borderRadius:10,fontSize:12,fontWeight:600,background:statsPeriod===p?A:"rgba(255,255,255,0.04)",border:statsPeriod===p?`1.5px solid ${A}`:"1.5px solid rgba(255,255,255,0.06)",color:statsPeriod===p?"#fff":"rgba(255,255,255,0.45)"}}>{p}</button>)}</div>
        {/* Summary cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
          {[{l:"Focus",v:`${periodStats.focusH}h ${periodStats.focusM}m`,i:"⏱",color:A},{l:"Sessions",v:periodStats.totalSessions,i:"🔄",color:"#6366f1"},{l:"Tasks",v:periodStats.totalTasks,i:"✅",color:"#10b981"},{l:"Habits",v:periodStats.totalHabits,i:"🎯",color:"#f59e0b"}].map((s,i)=>
            <Card key={i} bg={T.card} style={{textAlign:"center",padding:"18px 14px"}}><div style={{fontSize:26,marginBottom:6}}>{s.i}</div><div style={{fontSize:26,fontWeight:700,marginBottom:3,color:s.color}}>{s.v}</div><div style={{fontSize:12,opacity:0.4}}>{s.l}</div></Card>
          )}
        </div>

        {hasAnyData?<>
          {/* 4 Charts in 2x2 grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {key:"focus",label:"Focus Time",unit:"m",color:A,getData:d=>d.focus},
              {key:"sessions",label:"Sessions",unit:"",color:"#6366f1",getData:d=>d.sessions},
              {key:"tasks",label:"Tasks Done",unit:"",color:"#10b981",getData:d=>d.tasks},
              {key:"habits",label:"Habits Done",unit:"",color:"#f59e0b",getData:d=>d.habits},
            ].map(chart=>{
              const vals=dailyChartData.map(chart.getData);
              const mx=Math.max(...vals,1);
              return <Card key={chart.key} bg={T.card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <span style={{fontSize:15,fontWeight:700}}>{chart.label}</span>
                  <span style={{fontSize:20,opacity:0.5,padding:"2px 8px",borderRadius:8,background:`${chart.color}15`,color:chart.color,fontWeight:700}}>{vals.reduce((a,b)=>a+b,0)}{chart.unit}</span>
                </div>
                <div style={{display:"flex",alignItems:"flex-end",gap:Math.max(3,Math.floor(30/dailyChartData.length)),height:120,paddingBottom:22}}>
                  {dailyChartData.map((d,i)=>{
                    const v=chart.getData(d);
                    return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:0}}>
                      <div style={{width:"100%",borderRadius:6,height:`${Math.max(3,(v/mx)*90)}px`,background:`linear-gradient(180deg,${chart.color},${chart.color}44)`,position:"relative",transition:"height 0.5s"}}>
                        {v>0&&<div style={{position:"absolute",top:-16,width:"100%",textAlign:"center",fontSize:9,opacity:0.6,color:chart.color}}>{v}{chart.unit}</div>}
                      </div>
                      <span style={{fontSize:8,opacity:0.35,overflow:"hidden",whiteSpace:"nowrap",maxWidth:"100%"}}>{d.day}</span>
                    </div>;
                  })}
                </div>
                {/* Mini trend line */}
                {dailyChartData.length>1&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                  <svg width="100%" height="30" viewBox={`0 0 ${dailyChartData.length*20} 30`} style={{opacity:0.4}}>
                    <polyline fill="none" stroke={chart.color} strokeWidth="1.5" strokeLinejoin="round"
                      points={dailyChartData.map((d,i)=>`${i*20+10},${28-(chart.getData(d)/mx)*26}`).join(" ")}/>
                    {dailyChartData.map((d,i)=><circle key={i} cx={i*20+10} cy={28-(chart.getData(d)/mx)*26} r="2" fill={chart.color}/>)}
                  </svg>
                </div>}
              </Card>;
            })}
          </div>

          {/* Daily breakdown table */}
          <Card bg={T.card} style={{marginTop:14}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>รายละเอียดรายวัน</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
              <span style={{fontSize:11,opacity:0.4}}>วัน</span>
              <span style={{fontSize:11,opacity:0.4,textAlign:"center"}}>⏱ Focus</span>
              <span style={{fontSize:11,opacity:0.4,textAlign:"center"}}>🔄 Sessions</span>
              <span style={{fontSize:11,opacity:0.4,textAlign:"center"}}>✅ Tasks</span>
              <span style={{fontSize:11,opacity:0.4,textAlign:"center"}}>🎯 Habits</span>
            </div>
            <div style={{maxHeight:180,overflowY:"auto"}}>
              {[...dailyChartData].reverse().map((d,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:12}}>
                  <span style={{opacity:0.7}}>{d.day}</span>
                  <span style={{textAlign:"center",color:A}}>{d.focus}m</span>
                  <span style={{textAlign:"center",color:"#6366f1"}}>{d.sessions}</span>
                  <span style={{textAlign:"center",color:"#10b981"}}>{d.tasks}</span>
                  <span style={{textAlign:"center",color:"#f59e0b"}}>{d.habits}</span>
                </div>
              ))}
            </div>
          </Card>
        </>:<Card bg={T.card} style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:32,marginBottom:12}}>📊</div><div style={{fontSize:14,opacity:0.4}}>ยังไม่มีข้อมูล — เริ่ม session แรกเลย!</div><div style={{fontSize:12,opacity:0.25,marginTop:8}}>ทำ Pomodoro, ติ๊ก Task, ติ๊ก Habit แล้วกลับมาดูกราฟได้เลย</div></Card>}
      </div>}

      {/* PROFILE */}
      {nav==="Profile"&&<div style={{padding:"18px 24px 24px",maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <Card bg={T.card} style={{display:"flex",gap:24,alignItems:"center",marginBottom:18,padding:"28px 32px"}}>
          <div style={{width:88,height:88,borderRadius:26,flexShrink:0,background:`linear-gradient(135deg,${A},${A}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,fontWeight:700,color:"#fff",boxShadow:`0 8px 32px ${A}50`}}>{userName[0].toUpperCase()}</div>
          <div style={{flex:1}}><div style={{fontSize:26,fontWeight:700}}>{userName}</div><div style={{fontSize:13,opacity:0.4}}>Level {level} · {xp} XP</div></div>
        </Card>
        <Card bg={T.card} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>Level</span><span style={{color:A,fontSize:13,fontWeight:600}}>Lv.{level}→{level+1}</span></div><div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:5,width:`${Math.min((xp/xpNext)*100,100)}%`,background:`linear-gradient(90deg,${A},${A}88)`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.5}}><span>{xp}XP</span><span>{xpNext}XP</span></div></Card>
        <Card bg={T.card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:16,fontWeight:700}}>Achievements</span><span style={{fontSize:12,opacity:0.4}}>{ACHIEVEMENTS.filter(a=>xp>=a.xpReq).length}/{ACHIEVEMENTS.length}</span></div>
          {["bronze","silver","gold","platinum","diamond"].map(tier=>{const items=ACHIEVEMENTS.filter(a=>a.tier===tier);if(!items.length)return null;return<div key={tier} style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:600,color:tierColors[tier],marginBottom:8,textTransform:"uppercase",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:tierColors[tier]}}/>{tier}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{items.map(a=>{const e=xp>=a.xpReq;return<div key={a.id} style={{textAlign:"center",padding:"14px 6px",borderRadius:14,background:e?`${A}18`:"rgba(255,255,255,0.02)",border:e?`1.5px solid ${tierColors[tier]}50`:"1.5px solid rgba(255,255,255,0.04)",opacity:e?1:0.3}}><div style={{fontSize:28,marginBottom:4}}>{a.icon}</div><div style={{fontSize:11,fontWeight:600}}>{a.name}</div><div style={{fontSize:10,opacity:0.5}}>{a.desc}</div><div style={{fontSize:9,marginTop:4,color:e?tierColors[tier]:"rgba(255,255,255,0.3)",fontWeight:600}}>{e?"✓ ได้รับแล้ว":a.xpReq+"XP"}</div></div>})}</div>
          </div>})}
        </Card>
      </div>}

      {/* SETTINGS */}
      {nav==="Settings"&&<div style={{padding:"18px 24px 24px",maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{fontSize:26,fontWeight:700,marginBottom:22}}>Settings</div>
        <Card bg={T.card} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>👤 Profile</div><div style={{fontSize:12,opacity:0.4,marginBottom:5}}>Display Name</div><input value={userName} onChange={e=>setUserName(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,fontSize:13,background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",color:T.text,outline:"none"}}/></Card>

        <Card bg={T.card} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🔔 Sound</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><div><div style={{fontSize:13,opacity:0.8}}>Timer Sound</div><div style={{fontSize:11,opacity:0.35}}>เสียงเมื่อหมดเวลา</div></div><Toggle on={notifSound} onToggle={()=>setNotifSound(!notifSound)} accent={A}/></div>
          {notifSound&&<div style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontSize:12,opacity:0.4,marginBottom:8}}>เลือกเสียง Timer</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{TIMER_SOUNDS.map(s=><button key={s.id} onClick={()=>{setTimerSound(s.id);playTimerSound(s.id);}} style={{padding:"6px 14px",borderRadius:8,fontSize:12,background:timerSound===s.id?`${A}20`:"rgba(255,255,255,0.04)",border:timerSound===s.id?`1.5px solid ${A}40`:"1.5px solid rgba(255,255,255,0.06)",color:timerSound===s.id?A:T.text}}>{s.name}</button>)}</div>
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0"}}><div><div style={{fontSize:13,opacity:0.8}}>Auto Break</div><div style={{fontSize:11,opacity:0.35}}>เริ่มพักอัตโนมัติ</div></div><Toggle on={autoBreak} onToggle={()=>setAutoBreak(!autoBreak)} accent={A}/></div>
        </Card>

        <Card bg={T.card} style={{marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🎨 Appearance</div>
          <div style={{fontSize:12,opacity:0.4,marginBottom:8}}>Theme</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>{[{id:"dark",l:"Dark"},{id:"midnight",l:"Midnight"},{id:"forest",l:"Forest"}].map(t=><button key={t.id} onClick={()=>setSelTheme(t.id)} style={{flex:1,padding:"14px 0",borderRadius:12,fontSize:12,fontWeight:600,background:THEMES[t.id].card,border:selTheme===t.id?`2px solid ${A}`:"2px solid rgba(255,255,255,0.06)",color:THEMES[t.id].text,boxShadow:selTheme===t.id?`0 0 16px ${A}33`:"none"}}>{t.l}{selTheme===t.id&&" ✓"}</button>)}</div>
          <div style={{fontSize:12,opacity:0.4,marginBottom:8}}>Accent Color</div>
          <div style={{display:"flex",gap:8}}>{["#c9463d","#6366f1","#f59e0b","#10b981","#ec4899","#8b5cf6"].map(c=><div key={c} onClick={()=>setSelAccent(c)} style={{width:32,height:32,borderRadius:10,cursor:"pointer",background:c,border:selAccent===c?"3px solid #fff":"3px solid transparent",boxShadow:selAccent===c?`0 0 12px ${c}66`:"none"}}/>)}</div>
        </Card>
      </div>}

      {/* Story overlay */}
      {storyOpen&&<div onClick={()=>setStoryOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:28,cursor:"pointer",animation:"fadeIn 0.3s ease"}}>
        <div style={{maxWidth:520,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:13,fontWeight:600,color:A}}>{todayStory.titleEN}</div><div style={{fontSize:11,opacity:0.4}}>Section {lineIdx+1}/5</div></div>
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
