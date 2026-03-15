import { useState, useEffect, useRef, useMemo } from "react";

/* ───── TRACKS (expanded to 15) ───── */
const TRACKS = [
  { id:1,name:"Cozy Afternoon",artist:"Lo-Fi Chill",dur:"3:42" },
  { id:2,name:"Midnight Study",artist:"Dreamy Beats",dur:"4:15" },
  { id:3,name:"Rainy Window",artist:"Ambient Wave",dur:"3:58" },
  { id:4,name:"Sunlit Pages",artist:"Warm Keys",dur:"4:01" },
  { id:5,name:"Stargazer",artist:"Night Owl",dur:"5:20" },
  { id:6,name:"Coffee & Pages",artist:"Cafe Noir",dur:"3:33" },
  { id:7,name:"Neon Dreams",artist:"City Pulse",dur:"4:48" },
  { id:8,name:"Gentle Stream",artist:"Forest Bath",dur:"6:02" },
  { id:9,name:"Pixel Memories",artist:"Retro Chill",dur:"3:15" },
  { id:10,name:"Twilight Walk",artist:"Dusk Beats",dur:"4:37" },
  { id:11,name:"Paper Cranes",artist:"Origami Sound",dur:"3:50" },
  { id:12,name:"Warm Blanket",artist:"Sunday Mood",dur:"5:10" },
  { id:13,name:"Lavender Haze",artist:"Dream Soft",dur:"4:22" },
  { id:14,name:"Rooftop View",artist:"Sky Lounge",dur:"3:44" },
  { id:15,name:"Last Train Home",artist:"Night Commute",dur:"4:55" },
];

const AMBIENT = [
  { id:"rain",name:"Rain",icon:"🌧️" },{ id:"fire",name:"Fire",icon:"🔥" },
  { id:"birds",name:"Birds",icon:"🐦" },{ id:"wind",name:"Wind",icon:"🍃" },
  { id:"cricket",name:"Crickets",icon:"🦗" },{ id:"waves",name:"Ocean",icon:"🌊" },
  { id:"cafe",name:"Café",icon:"☕" },{ id:"thunder",name:"Thunder",icon:"⛈️" },
  { id:"train",name:"Train",icon:"🚂" },
];

/* ───── THAI STORY (daily rotation) ───── */
const STORY_POOL = [
  { title:"วันแรกที่เจอกัน", lines:[
    {s:"ซาโตเนะ",t:"เอ๊ะ! สวัสดีค่ะ... ไม่คิดว่าจะมีใครมานั่งทำงานดึกเหมือนกัน"},
    {s:"คุณ",t:"สวัสดี! แค่อยากหาที่เงียบๆ โฟกัสงานน่ะ"},
    {s:"ซาโตเนะ",t:"เหมือนกันเลย... หนูกำลังเขียนนิยายอยู่ค่ะ นั่งเป็นเพื่อนกันได้ไหม?"},
    {s:"ซาโตเนะ",t:"ดีจังที่ไม่ต้องอยู่คนเดียว รู้สึกอุ่นใจขึ้นเยอะเลย ✨"},
  ]},
  { title:"ตันหมดไอเดีย", lines:[
    {s:"ซาโตเนะ",t:"อื้ม... นั่งจ้องหน้ากระดาษเปล่ามาชั่วโมงแล้ว เขียนไม่ออกเลย 😩"},
    {s:"คุณ",t:"ลองพักสักครู่ไหม? บางทีไอเดียมันจะมาเองตอนที่เราไม่ได้บังคับ"},
    {s:"ซาโตเนะ",t:"จริงด้วย... ไปจิบกาแฟเสมือนด้วยกันไหมคะ? ☕"},
    {s:"ซาโตเนะ",t:"ขอบคุณที่อยู่ตรงนี้นะ มันช่วยได้เยอะจริงๆ"},
  ]},
  { title:"ฝ่าด่านสำเร็จ!", lines:[
    {s:"ซาโตเนะ",t:"ทำได้แล้ว!! เขียนบทที่ 3 เสร็จแล้วค่ะ! 🎉"},
    {s:"คุณ",t:"เก่งมาก! รู้อยู่แล้วว่าทำได้!"},
    {s:"ซาโตเนะ",t:"ถ้าไม่มีคุณนั่งอยู่ตรงนี้ คงทำไม่ได้หรอก..."},
    {s:"ซาโตเนะ",t:"การได้มีคนแชร์ช่วงเวลาแบบนี้... มันมีค่ามากเลยนะ 💫"},
  ]},
  { title:"คุยยามดึก", lines:[
    {s:"ซาโตเนะ",t:"เฮ้... ถามเรื่องส่วนตัวหน่อยได้ไหมคะ?"},
    {s:"คุณ",t:"ได้สิ ว่ามาเลย"},
    {s:"ซาโตเนะ",t:"เคยรู้สึกไหมว่าโลกนี้มันเสียงดังเกินไป... แต่ก็เงียบเกินไปในเวลาเดียวกัน?"},
    {s:"ซาโตเนะ",t:"นั่นแหละถึงชอบเขียนหนังสือ... แล้วก็ดีใจที่มีคุณอยู่ตรงนี้ค่ะ 🌙"},
  ]},
  { title:"เรื่องของเรา", lines:[
    {s:"ซาโตเนะ",t:"รู้ไหมคะ? หนูว่าจะเขียนเรื่องเกี่ยวกับเรา"},
    {s:"คุณ",t:"เกี่ยวกับเรา?"},
    {s:"ซาโตเนะ",t:"เรื่องของคนสองคนที่เจอกันในยามค่ำคืนเงียบๆ..."},
    {s:"ซาโตเนะ",t:"แล้วการทำงานด้วยกันก็ทำให้ทุกอย่างเป็นไปได้ 💕"},
  ]},
  { title:"วันฝนตก", lines:[
    {s:"ซาโตเนะ",t:"ฝนตกแบบนี้ ฟังเสียงฝนไปด้วย ทำงานไปด้วย สบายดีจัง~"},
    {s:"คุณ",t:"ใช่ บรรยากาศดีมาก โฟกัสง่ายขึ้นเยอะ"},
    {s:"ซาโตเนะ",t:"หนูว่าวันฝนตกเป็นวันที่ดีที่สุดสำหรับเขียนหนังสือเลยนะ 🌧️"},
    {s:"ซาโตเนะ",t:"โดยเฉพาะถ้ามีคนนั่งเป็นเพื่อนแบบนี้..."},
  ]},
  { title:"แรงบันดาลใจ", lines:[
    {s:"ซาโตเนะ",t:"วันนี้เขียนได้เยอะมากเลยค่ะ! คุณล่ะคะ ทำงานได้เยอะไหม?"},
    {s:"คุณ",t:"ก็โอเคเลย พอมีคนนั่งด้วยมันมีพลังขึ้น"},
    {s:"ซาโตเนะ",t:"เหมือนกันเลย! พลังของการทำงานเป็นเพื่อนกันนี่ล่ะ ✨"},
    {s:"ซาโตเนะ",t:"พรุ่งนี้มาทำงานด้วยกันอีกนะคะ สัญญา~"},
  ]},
];

/* ───── ACHIEVEMENTS (expanded to 16 with tiers) ───── */
const ACHIEVEMENTS = [
  {id:1,name:"ก้าวแรก",desc:"ทำ Pomodoro ครั้งแรกสำเร็จ",icon:"🌱",xpReq:50,tier:"bronze"},
  {id:2,name:"ไฟลุก",desc:"ทำ 5 sessions ในวันเดียว",icon:"🔥",xpReq:150,tier:"bronze"},
  {id:3,name:"นักจัดการ",desc:"เคลียร์ task ได้ 10 ชิ้น",icon:"✅",xpReq:250,tier:"silver"},
  {id:4,name:"สร้างนิสัย",desc:"ติดตาม habit 7 วันติด",icon:"💪",xpReq:400,tier:"silver"},
  {id:5,name:"โฟกัสลึก",desc:"สะสม focus time 5 ชั่วโมง",icon:"🧠",xpReq:600,tier:"silver"},
  {id:6,name:"คอนิยาย",desc:"ปลดล็อกเรื่อง 3 ตอน",icon:"📖",xpReq:300,tier:"silver"},
  {id:7,name:"นกฮูก",desc:"ทำงานหลังเที่ยงคืน",icon:"🦉",xpReq:500,tier:"silver"},
  {id:8,name:"มาราธอน",desc:"ทำงานต่อเนื่อง 3 ชั่วโมง",icon:"🏃",xpReq:700,tier:"gold"},
  {id:9,name:"นักสะสม",desc:"เก็บ XP ได้ 1,000",icon:"💎",xpReq:1000,tier:"gold"},
  {id:10,name:"เซนมาสเตอร์",desc:"ถึง Level 10",icon:"🧘",xpReq:1500,tier:"gold"},
  {id:11,name:"นักดนตรี",desc:"ฟังเพลงครบทุกเพลง",icon:"🎵",xpReq:800,tier:"gold"},
  {id:12,name:"เพื่อนสนิท",desc:"Bond กับ Satone 100%",icon:"💕",xpReq:1200,tier:"gold"},
  {id:13,name:"เจ้าแห่ง Focus",desc:"สะสม focus 24 ชั่วโมง",icon:"👑",xpReq:2000,tier:"platinum"},
  {id:14,name:"ตำนาน",desc:"ถึง Level 20",icon:"🏆",xpReq:3000,tier:"platinum"},
  {id:15,name:"ปรมาจารย์",desc:"ปลดล็อก achievement 12 อัน",icon:"⭐",xpReq:2500,tier:"platinum"},
  {id:16,name:"ผู้ไม่หยุดพัก",desc:"สะสม 100 sessions",icon:"🚀",xpReq:5000,tier:"diamond"},
];

const tierColors = { bronze:"#cd7f32", silver:"#c0c0c0", gold:"#ffd700", platinum:"#e5e4e2", diamond:"#b9f2ff" };

const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const fmt=s=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

/* ───── THEME SYSTEM ───── */
const THEMES = {
  dark:   { bg:"#111113", card:"#1a1a1e", accent:"#c9463d", accentSoft:"rgba(201,70,61,", text:"#e8e4e0" },
  midnight:{ bg:"#0a0a1a", card:"#12122a", accent:"#6366f1", accentSoft:"rgba(99,102,241,", text:"#e0e0f0" },
  forest: { bg:"#0a1510", card:"#132218", accent:"#10b981", accentSoft:"rgba(16,185,129,", text:"#d0e8d8" },
};

function Card({children,style,theme}){return <div style={{background:theme?.card||"#1a1a1e",borderRadius:24,padding:"22px 24px",...style}}>{children}</div>;}
function Toggle({on,onToggle,accent}){
  return <div onClick={onToggle} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?(accent||"#c9463d"):"rgba(255,255,255,0.1)",padding:2,transition:"all 0.25s",display:"flex",alignItems:"center",justifyContent:on?"flex-end":"flex-start"}}>
    <div style={{width:20,height:20,borderRadius:10,background:"#fff",transition:"all 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
  </div>;
}

export default function App(){
  const [nav,setNav]=useState("Home");
  const [mode,setMode]=useState("work");
  const [workMin,setWorkMin]=useState(25);
  const [breakMin,setBreakMin]=useState(5);
  const [time,setTime]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState(0);
  const [rounds,setRounds]=useState(4);
  const ref=useRef(null);

  const [todos,setTodos]=useState([{id:1,text:"Design",done:false},{id:2,text:"Web development",done:false},{id:3,text:"Social media content",done:false}]);
  const [newTodo,setNewTodo]=useState("");
  const [showAddTask,setShowAddTask]=useState(false);

  const [habits,setHabits]=useState([{id:1,name:"ดื่มน้ำ",icon:"💧",done:false},{id:2,name:"ยืดเส้น",icon:"🧘",done:false},{id:3,name:"อ่านหนังสือ 10 หน้า",icon:"📖",done:false},{id:4,name:"นั่งสมาธิ",icon:"🧠",done:false}]);
  const [newHabit,setNewHabit]=useState("");
  const [showAddHabit,setShowAddHabit]=useState(false);

  const [track,setTrack]=useState(TRACKS[0]);
  const [playing,setPlaying]=useState(false);
  const [shuffleOn,setShuffleOn]=useState(false);
  const [repeatOn,setRepeatOn]=useState(false);
  const [ambients,setAmbients]=useState({});
  const [mProg,setMProg]=useState(35);
  const [showAmb,setShowAmb]=useState(false);
  const [showAllTracks,setShowAllTracks]=useState(false);

  const [xp,setXp]=useState(0);
  const level=Math.floor(xp/150)+1;
  const xpNext=level*150;

  const [storyOpen,setStoryOpen]=useState(false);
  const [lineIdx,setLineIdx]=useState(0);
  const [workLog,setWorkLog]=useState({});
  const [mood,setMood]=useState("idle");

  const [userName,setUserName]=useState("User");
  const [notifSound,setNotifSound]=useState(true);
  const [autoBreak,setAutoBreak]=useState(true);
  const [longBreak,setLongBreak]=useState(15);
  const [dailyGoal,setDailyGoal]=useState(8);
  const [selTheme,setSelTheme]=useState("dark");
  const [selAccent,setSelAccent]=useState("#c9463d");
  const [statsPeriod,setStatsPeriod]=useState("Week");

  const T = THEMES[selTheme] || THEMES.dark;
  const A = selAccent;
  const AS = THEMES[selTheme]?.accentSoft || "rgba(201,70,61,";
  // Override accent in theme
  const effectiveAccent = selAccent;

  /* Daily story rotation */
  const todayIdx = useMemo(()=>{
    const d=new Date(); const seed=d.getFullYear()*1000+d.getMonth()*50+d.getDate();
    return seed % STORY_POOL.length;
  },[]);
  const todayStory = STORY_POOL[todayIdx];
  const unlocked = xp >= 0; // story always available, changes daily

  /* Timer */
  useEffect(()=>{
    if(running&&time>0){ref.current=setInterval(()=>setTime(t=>t-1),1000);}
    else if(time===0&&running){
      setRunning(false);
      if(mode==="work"){setXp(x=>x+workMin*2);setSessions(s=>s+1);const d=new Date().toISOString().split("T")[0];setWorkLog(l=>({...l,[d]:(l[d]||0)+workMin}));setMood("happy");setMode("break");setTime(breakMin*60);}
      else{setMode("work");setTime(workMin*60);setMood("idle");}
    }
    return()=>clearInterval(ref.current);
  },[running,time,mode,workMin,breakMin]);

  useEffect(()=>{if(!playing)return;const iv=setInterval(()=>setMProg(p=>p>=100?0:p+0.5),300);return()=>clearInterval(iv);},[playing]);

  const progress=mode==="work"?1-time/(workMin*60):1-time/(breakMin*60);
  const totalFocusMin=Object.values(workLog).reduce((a,b)=>a+b,0);
  const focusH=Math.floor(totalFocusMin/60),focusM=totalFocusMin%60;
  const now=new Date();
  const calDates=[];for(let i=-2;i<=2;i++){const d=new Date(now);d.setDate(d.getDate()+i);calDates.push(d);}
  const getHeat=(w,d)=>{const seed=(w*7+d+3)*17%100;return seed<30?0.2:seed<50?0.45:seed<70?0.65:seed<85?0.8:0.95;};
  const totalSec=mode==="work"?workMin*60:breakMin*60;
  const handAngle=((totalSec-time)/totalSec)*360;
  const addTodo=()=>{if(!newTodo.trim())return;setTodos([...todos,{id:Date.now(),text:newTodo.trim(),done:false}]);setNewTodo("");setShowAddTask(false);};
  const addHabit=()=>{if(!newHabit.trim())return;setHabits([...habits,{id:Date.now(),name:newHabit.trim(),icon:"✨",done:false}]);setNewHabit("");setShowAddHabit(false);};
  const deleteHabit=(id)=>setHabits(habits.filter(h=>h.id!==id));
  const nextTrack=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);setTrack(TRACKS[(i+1)%TRACKS.length]);setMProg(0);};
  const prevTrack=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);setTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);setMProg(0);};

  /* Dynamic stats based on period */
  const getStatsData=()=>{
    const mult=statsPeriod==="Day"?1:statsPeriod==="Week"?1:statsPeriod==="Month"?4.3:30;
    const base=[{day:"Mon",focus:45},{day:"Tue",focus:90},{day:"Wed",focus:30},{day:"Thu",focus:120},{day:"Fri",focus:75},{day:"Sat",focus:50},{day:"Sun",focus:60}];
    if(statsPeriod==="Day") return [{day:"6am",focus:0},{day:"8am",focus:20},{day:"10am",focus:45},{day:"12pm",focus:30},{day:"2pm",focus:60},{day:"4pm",focus:25},{day:"6pm",focus:15}];
    if(statsPeriod==="Month") return [{day:"Wk1",focus:280},{day:"Wk2",focus:350},{day:"Wk3",focus:190},{day:"Wk4",focus:420}];
    if(statsPeriod==="All Time") return [{day:"Jan",focus:800},{day:"Feb",focus:1200},{day:"Mar",focus:950}];
    return base;
  };
  const statsData=getStatsData();
  const maxFocus=Math.max(...statsData.map(d=>d.focus),1);
  const statsTotalFocus = statsPeriod==="Day"? "3h 15m" : statsPeriod==="Week"? `${focusH}h ${focusM}m` : statsPeriod==="Month"? "18h 30m" : "52h 10m";
  const statsSessions = statsPeriod==="Day"? sessions : statsPeriod==="Week"? sessions+12 : statsPeriod==="Month"? sessions+48 : sessions+156;
  const statsTasks = statsPeriod==="Day"? todos.filter(t=>t.done).length : statsPeriod==="Week"? todos.filter(t=>t.done).length+8 : statsPeriod==="Month"? 34 : 112;
  const statsStreak = "3 days";

  const navIcons={Home:"⌂",Statistics:"📊",Profile:"👤",Settings:"⚙"};

  /* ── Timer +/- controls ── */
  const cycleWorkUp=()=>{if(running)return;const v=Math.min(90,workMin+5);setWorkMin(v);if(mode==="work")setTime(v*60);};
  const cycleWorkDown=()=>{if(running)return;const v=Math.max(5,workMin-5);setWorkMin(v);if(mode==="work")setTime(v*60);};
  const cycleBreakUp=()=>{if(running)return;const v=Math.min(30,breakMin+5);setBreakMin(v);if(mode==="break")setTime(v*60);};
  const cycleBreakDown=()=>{if(running)return;const v=Math.max(1,breakMin-1);setBreakMin(v);if(mode==="break")setTime(v*60);};

  return(
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",width:"100%",minHeight:"100vh",background:T.bg,color:T.text,transition:"background 0.5s, color 0.5s"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}input,button{font-family:inherit}button{cursor:pointer}`}</style>

      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",gap:4,padding:"14px 24px",borderBottom:`1px solid rgba(255,255,255,0.06)`,flexWrap:"wrap"}}>
        {["Home","Statistics","Profile","Settings"].map(n=>
          <button key={n} onClick={()=>setNav(n)} style={{padding:"7px 16px",borderRadius:10,background:nav===n?A:"transparent",color:nav===n?"#fff":"rgba(255,255,255,0.45)",border:"none",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
            <span>{navIcons[n]}</span>{n}
          </button>
        )}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:`${A}20`,border:`1px solid ${A}40`,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:A,display:"flex",alignItems:"center",gap:5}}>
            ⭐ Lv.{level}<span style={{opacity:0.5,fontWeight:400}}>{xp}XP</span>
          </div>
          <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${A},${A}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{userName[0].toUpperCase()}</div>
        </div>
      </nav>

      {/* ═══ HOME ═══ */}
      {nav==="Home"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        {/* Timer */}
        <Card theme={T} style={{padding:"24px 28px",display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
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
          {/* Timer +/- controls */}
          <div style={{display:"flex",gap:12,marginTop:14,fontSize:12,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={cycleWorkDown} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{opacity:0.6,minWidth:60,textAlign:"center"}}>Work:{workMin}m</span>
              <button onClick={cycleWorkUp} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={cycleBreakDown} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{opacity:0.6,minWidth:60,textAlign:"center"}}>Break:{breakMin}m</span>
              <button onClick={cycleBreakUp} style={{width:22,height:22,borderRadius:6,background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <span onClick={()=>!running&&setRounds(r=>r>=8?2:r+1)} style={{cursor:"pointer",opacity:0.5,borderBottom:"1px dashed rgba(255,255,255,0.3)"}}>Rounds:{rounds}</span>
          </div>
        </Card>

        {/* Calendar + Story */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card theme={T}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:18,fontWeight:700}}>Calendar</span><div style={{border:`1.5px solid ${A}`,borderRadius:20,padding:"4px 14px",color:A,fontSize:12,fontWeight:600}}>Today ▾</div></div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>{calDates.map((d,i)=>{const t=d.toDateString()===now.toDateString();return<div key={i} style={{flex:1,textAlign:"center",padding:"7px 0",borderRadius:10,background:t?`${A}25`:"rgba(255,255,255,0.03)",border:t?`1.5px solid ${A}66`:"1.5px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:10,opacity:0.4}}>{DAYS[(d.getDay()+6)%7]}</div><div style={{fontSize:18,fontWeight:600}}>{d.getDate()}</div></div>})}</div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,fontSize:13,marginBottom:10}}>
              <span style={{color:A,fontWeight:700}}>{sessions}</span><span style={{opacity:0.3}}>↑</span><span style={{opacity:0.5}}>{todos.filter(t=>t.done).length}</span><span style={{opacity:0.3}}>→</span><span style={{opacity:0.5}}>{habits.filter(h=>h.done).length}</span><span style={{opacity:0.3}}>↓</span><span style={{fontWeight:600,marginLeft:"auto"}}>{focusH}H {focusM}M Focus</span>
            </div>
            <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:`${Math.min((sessions/rounds)*100,100)}%`,background:`linear-gradient(90deg,${A},${A}88)`,transition:"width 0.5s"}}/></div>
          </Card>
          {/* Story (Thai, daily reset) */}
          <Card theme={T} style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>เรื่องของซาโตเนะ</span><span style={{fontSize:11,opacity:0.4}}>วันนี้</span></div>
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:`linear-gradient(135deg,${A}50,${A}18)`,border:`1.5px solid ${A}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{mood==="happy"?"😊":running?"✍️":"📝"}</div>
              <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:12,borderTopLeftRadius:3,padding:"8px 12px",fontSize:12,lineHeight:1.6,opacity:0.7}}>{running&&mode==="work"?"มาโฟกัสด้วยกันเถอะ! ✨":running?"พักหน่อยนะ ☕":mood==="happy"?"เยี่ยมมาก! อ่านเรื่องวันนี้ได้เลย~":"เริ่ม session เพื่ออ่านเรื่องวันนี้ 🌙"}</div>
            </div>
            <button onClick={()=>{setLineIdx(0);setStoryOpen(true);}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,background:`${A}10`,border:`1px solid ${A}20`,color:T.text,fontSize:13,textAlign:"left",width:"100%",transition:"all 0.2s"}}>
              <span>📜</span><span style={{flex:1}}>วันนี้: {todayStory.title}</span><span style={{fontSize:11,opacity:0.5}}>อ่าน →</span>
            </button>
            <div style={{fontSize:10,opacity:0.3,marginTop:8,textAlign:"center"}}>เรื่องราวเปลี่ยนทุกวัน · มาอ่านทุกวันนะ!</div>
          </Card>
        </div>

        {/* Music + Tasks */}
        <div style={{display:"flex",gap:14}}>
          <Card theme={T} style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Music</span>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>setShowAllTracks(!showAllTracks)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>🎵</button>
                <button onClick={()=>setShowAmb(!showAmb)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>🌿</button>
              </div>
            </div>
            <div style={{fontSize:13,fontWeight:500}}>{track.name}</div>
            <div style={{fontSize:11,opacity:0.4,marginBottom:12}}>{track.artist}</div>
            <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.08)",marginBottom:14,overflow:"hidden",cursor:"pointer"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setMProg(((e.clientX-r.left)/r.width)*100);}}><div style={{height:"100%",width:`${mProg}%`,background:`linear-gradient(90deg,${A},${A}88)`,transition:"width 0.3s"}}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
              <button onClick={()=>setShuffleOn(!shuffleOn)} style={{background:"none",border:"none",fontSize:14,color:shuffleOn?A:"rgba(255,255,255,0.25)"}}>⇄</button>
              <button onClick={prevTrack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏮</button>
              <button onClick={()=>setPlaying(!playing)} style={{width:36,height:36,borderRadius:"50%",background:A,border:"none",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?"⏸":"▶"}</button>
              <button onClick={nextTrack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏭</button>
              <button onClick={()=>setRepeatOn(!repeatOn)} style={{background:"none",border:"none",fontSize:14,color:repeatOn?A:"rgba(255,255,255,0.25)"}}>🔁</button>
            </div>
            {/* Track list */}
            {showAllTracks&&<div style={{marginTop:12,maxHeight:180,overflowY:"auto"}}><div style={{fontSize:11,opacity:0.4,marginBottom:6}}>All Tracks ({TRACKS.length})</div>{TRACKS.map(t=><div key={t.id} onClick={()=>{setTrack(t);setMProg(0);setPlaying(true);}} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:6,cursor:"pointer",background:track.id===t.id?`${A}15`:"transparent",fontSize:12,marginBottom:2}}><span style={{opacity:track.id===t.id?1:0.4}}>{track.id===t.id&&playing?"▶":"♪"}</span><span style={{flex:1,opacity:track.id===t.id?1:0.7}}>{t.name}</span><span style={{opacity:0.3,fontSize:10}}>{t.dur}</span></div>)}</div>}
            {showAmb&&<div style={{marginTop:12}}><div style={{fontSize:11,opacity:0.4,marginBottom:6}}>Ambient ({AMBIENT.length})</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>{AMBIENT.map(a=><button key={a.id} onClick={()=>setAmbients(p=>({...p,[a.id]:!p[a.id]}))} style={{padding:"6px 3px",borderRadius:8,fontSize:11,background:ambients[a.id]?`${A}20`:"rgba(255,255,255,0.03)",border:ambients[a.id]?`1px solid ${A}40`:"1px solid rgba(255,255,255,0.06)",color:T.text,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:14}}>{a.icon}</span>{a.name}</button>)}</div></div>}
          </Card>
          {/* Tasks */}
          <Card theme={T} style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Task</span><button onClick={()=>setShowAddTask(!showAddTask)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddTask&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="New task..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:T.text,outline:"none"}}/><button onClick={addTodo} style={{padding:"7px 10px",borderRadius:8,background:A,border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
              {todos.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",cursor:"pointer"}} onClick={()=>setTodos(todos.map(x=>{if(x.id===t.id){if(!x.done){setXp(v=>v+10);setMood("happy");}return{...x,done:!x.done};}return x;}))}><div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:t.done?`2px solid ${A}`:"2px solid rgba(255,255,255,0.15)",background:t.done?A:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10}}>{t.done&&"✓"}</div><span style={{fontSize:13,textDecoration:t.done?"line-through":"none",opacity:t.done?0.35:0.8,flex:1}}>{t.text}</span><button onClick={e=>{e.stopPropagation();setTodos(todos.filter(x=>x.id!==t.id));}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:11}}>✕</button></div>)}
            </div>
            <div style={{fontSize:10,opacity:0.3,marginTop:6}}>+10xp per task</div>
          </Card>
        </div>

        {/* Habits + Heatmap */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card theme={T}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Daily Habits</span><button onClick={()=>setShowAddHabit(!showAddHabit)} style={{width:26,height:26,borderRadius:7,background:`${A}20`,border:`1px solid ${A}33`,color:A,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddHabit&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newHabit} onChange={e=>setNewHabit(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} placeholder="New habit..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:T.text,outline:"none"}}/><button onClick={addHabit} style={{padding:"7px 10px",borderRadius:8,background:A,border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {habits.map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 10px",borderRadius:10,fontSize:12,background:h.done?`${A}18`:"rgba(255,255,255,0.03)",border:h.done?`1.5px solid ${A}40`:"1.5px solid rgba(255,255,255,0.05)",position:"relative"}}>
                <span style={{fontSize:15,cursor:"pointer"}} onClick={()=>setHabits(habits.map(x=>{if(x.id===h.id){if(!x.done)setXp(v=>v+15);return{...x,done:!x.done};}return x;}))}>{h.icon}</span>
                <span style={{flex:1,opacity:h.done?0.5:0.8,cursor:"pointer"}} onClick={()=>setHabits(habits.map(x=>{if(x.id===h.id){if(!x.done)setXp(v=>v+15);return{...x,done:!x.done};}return x;}))}>{h.name}</span>
                {h.done&&<span style={{color:A,fontSize:11}}>✓</span>}
                <button onClick={()=>deleteHabit(h.id)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:10,padding:2}}>✕</button>
              </div>)}
            </div>
            <div style={{fontSize:10,opacity:0.3,marginTop:8,textAlign:"right"}}>{habits.filter(h=>h.done).length}/{habits.length} · +15xp</div>
          </Card>
          <Card theme={T} style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:16,fontWeight:700}}>Progress</span><div style={{border:`1.5px solid ${A}`,borderRadius:20,padding:"4px 12px",color:A,fontSize:11,fontWeight:600}}>Weekly ▾</div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:5}}>{DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,opacity:0.35}}>{d}</div>)}</div>
            {Array.from({length:4}).map((_,w)=><div key={w} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>{Array.from({length:7}).map((_,d)=><div key={d} style={{aspectRatio:"1",borderRadius:5,background:`${A}${Math.round((0.1+getHeat(w,d)*0.7)*255).toString(16).padStart(2,"0")}`}}/>)}</div>)}
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3,marginTop:6}}><span style={{fontSize:10,opacity:0.3}}>Less</span>{[0.15,0.3,0.5,0.7,0.9].map((v,i)=><div key={i} style={{width:10,height:10,borderRadius:2,background:`${A}${Math.round(v*255).toString(16).padStart(2,"0")}`}}/>)}<span style={{fontSize:10,opacity:0.3}}>More</span></div>
          </Card>
        </div>
      </div>}

      {/* ═══ STATISTICS (dynamic by period) ═══ */}
      {nav==="Statistics"&&<div style={{padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{display:"flex",gap:6,marginBottom:20}}>{["Day","Week","Month","All Time"].map(p=><button key={p} onClick={()=>setStatsPeriod(p)} style={{padding:"7px 18px",borderRadius:10,fontSize:12,fontWeight:600,background:statsPeriod===p?A:"rgba(255,255,255,0.04)",border:statsPeriod===p?`1.5px solid ${A}`:"1.5px solid rgba(255,255,255,0.06)",color:statsPeriod===p?"#fff":"rgba(255,255,255,0.45)"}}>{p}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
          {[{l:"Total Focus",v:statsTotalFocus,i:"⏱",s:"+12%"},{l:"Sessions",v:statsSessions,i:"🔄",s:statsPeriod},{l:"Tasks Done",v:statsTasks,i:"✅",s:statsPeriod},{l:"Streak",v:statsStreak,i:"🔥",s:"Best: 7"}].map((s,i)=>
            <Card key={i} theme={T} style={{textAlign:"center",padding:"18px 14px"}}><div style={{fontSize:26,marginBottom:6}}>{s.i}</div><div style={{fontSize:26,fontWeight:700,marginBottom:3}}>{s.v}</div><div style={{fontSize:12,opacity:0.4,marginBottom:3}}>{s.l}</div><div style={{fontSize:11,color:A,fontWeight:500}}>{s.s}</div></Card>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:14}}>
          <Card theme={T}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><span style={{fontSize:16,fontWeight:700}}>Focus Time</span><span style={{fontSize:11,opacity:0.4}}>{statsPeriod}</span></div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160,paddingBottom:24,position:"relative"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:24,display:"flex",flexDirection:"column",justifyContent:"space-between",fontSize:10,opacity:0.3,width:28}}><span>{maxFocus}m</span><span>{Math.round(maxFocus/2)}m</span><span>0</span></div>
              <div style={{flex:1,display:"flex",alignItems:"flex-end",gap:8,marginLeft:34}}>
                {statsData.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{width:"100%",borderRadius:7,height:`${(d.focus/maxFocus)*130}px`,background:i===Math.floor(statsData.length/2)?`linear-gradient(180deg,${A},${A}66)`:`linear-gradient(180deg,${A}66,${A}25)`,position:"relative",transition:"height 0.5s"}}><div style={{position:"absolute",top:-18,width:"100%",textAlign:"center",fontSize:10,opacity:0.5}}>{d.focus}m</div></div>
                  <span style={{fontSize:11,opacity:0.4}}>{d.day}</span>
                </div>)}
              </div>
            </div>
          </Card>
          <Card theme={T}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:18}}>Productivity</div>
            {[{l:"Deep Focus",p:68,c:A},{l:"Light Work",p:22,c:`${A}88`},{l:"Breaks",p:10,c:`${A}33`}].map((it,i)=><div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}><span style={{opacity:0.7}}>{it.l}</span><span style={{fontWeight:600}}>{it.p}%</span></div><div style={{height:7,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${it.p}%`,background:it.c}}/></div></div>)}
            <div style={{marginTop:16,padding:"12px 14px",background:`${A}10`,borderRadius:10,border:`1px solid ${A}20`}}><div style={{fontSize:12,opacity:0.6,marginBottom:3}}>Daily Goal</div><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{flex:1,height:7,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${Math.min((sessions/dailyGoal)*100,100)}%`,background:`linear-gradient(90deg,${A},${A}88)`}}/></div><span style={{fontSize:12,fontWeight:600}}>{sessions}/{dailyGoal}</span></div></div>
          </Card>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
          <Card theme={T}><div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Habit Consistency</div>{habits.map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:16}}>{h.icon}</span><span style={{flex:1,fontSize:13,opacity:0.7}}>{h.name}</span><div style={{display:"flex",gap:2}}>{Array.from({length:7}).map((_,d)=><div key={d} style={{width:12,height:12,borderRadius:3,background:(h.id+d)%3!==0?`${A}${Math.round((0.3+d*0.1)*255).toString(16).padStart(2,"0")}`:"rgba(255,255,255,0.06)"}}/>)}</div></div>)}</Card>
          <Card theme={T}><div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Most Played</div>{TRACKS.slice(0,5).map((t,i)=><div key={t.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:26,borderRadius:7,background:`${A}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:A}}>{i+1}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{t.name}</div><div style={{fontSize:11,opacity:0.4}}>{t.artist}</div></div><span style={{fontSize:11,opacity:0.3}}>{t.dur}</span></div>)}</Card>
        </div>
      </div>}

      {/* ═══ PROFILE (expanded achievements) ═══ */}
      {nav==="Profile"&&<div style={{padding:"18px 24px 24px",maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <Card theme={T} style={{display:"flex",gap:24,alignItems:"center",marginBottom:18,padding:"28px 32px"}}>
          <div style={{width:88,height:88,borderRadius:26,flexShrink:0,background:`linear-gradient(135deg,${A},${A}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,fontWeight:700,color:"#fff",boxShadow:`0 8px 32px ${A}50`}}>{userName[0].toUpperCase()}</div>
          <div style={{flex:1}}><div style={{fontSize:26,fontWeight:700,marginBottom:3}}>{userName}</div><div style={{fontSize:13,opacity:0.4,marginBottom:10}}>Chilling since day one</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><div style={{background:`${A}20`,border:`1.5px solid ${A}40`,borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:600,color:A}}>⭐ Level {level}</div><div style={{background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.06)",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>🔥 3 day streak</div></div></div>
        </Card>
        <Card theme={T} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>Level Progress</span><span style={{fontSize:13,color:A,fontWeight:600}}>Lv.{level} → {level+1}</span></div><div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:5,width:`${Math.min((xp/xpNext)*100,100)}%`,background:`linear-gradient(90deg,${A},${A}88)`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.5}}><span>{xp} XP</span><span>{xpNext} XP</span></div></Card>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
          {[{l:"Sessions",v:sessions,i:"🎯"},{l:"Focus",v:`${focusH}h ${focusM}m`,i:"⏱"},{l:"Tasks",v:todos.filter(t=>t.done).length,i:"✅"},{l:"Habits",v:habits.length,i:"💪"},{l:"Story",v:`วันนี้: ${todayStory.title}`,i:"📖"},{l:"Fav Track",v:track.name,i:"🎵"}].map((s,i)=>
            <Card key={i} theme={T} style={{padding:"16px 18px"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:20}}>{s.i}</span><span style={{fontSize:12,opacity:0.4}}>{s.l}</span></div><div style={{fontSize:18,fontWeight:700}}>{s.v}</div></Card>
          )}
        </div>

        {/* Achievements with tiers */}
        <Card theme={T} style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:16,fontWeight:700}}>Achievements</span><span style={{fontSize:12,opacity:0.4}}>{ACHIEVEMENTS.filter(a=>xp>=a.xpReq).length}/{ACHIEVEMENTS.length} earned</span></div>
          {["bronze","silver","gold","platinum","diamond"].map(tier=>{
            const items=ACHIEVEMENTS.filter(a=>a.tier===tier);
            if(items.length===0)return null;
            return <div key={tier} style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,color:tierColors[tier],marginBottom:8,textTransform:"uppercase",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:tierColors[tier]}}/>{tier}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {items.map(a=>{const e=xp>=a.xpReq;return<div key={a.id} style={{textAlign:"center",padding:"14px 6px",borderRadius:14,background:e?`${A}18`:"rgba(255,255,255,0.02)",border:e?`1.5px solid ${tierColors[tier]}50`:"1.5px solid rgba(255,255,255,0.04)",opacity:e?1:0.3,transition:"all 0.3s"}}>
                  <div style={{fontSize:28,marginBottom:4}}>{a.icon}</div>
                  <div style={{fontSize:11,fontWeight:600,marginBottom:2}}>{a.name}</div>
                  <div style={{fontSize:10,opacity:0.5}}>{a.desc}</div>
                  <div style={{fontSize:9,marginTop:4,color:e?tierColors[tier]:"rgba(255,255,255,0.3)",fontWeight:600}}>{e?"✓ Earned":a.xpReq+" XP"}</div>
                </div>})}
              </div>
            </div>;
          })}
        </Card>

        <Card theme={T}><div style={{fontSize:16,fontWeight:700,marginBottom:12}}>Bond with Satone</div><div style={{display:"flex",gap:18,alignItems:"center"}}><div style={{width:64,height:64,borderRadius:20,flexShrink:0,background:`linear-gradient(135deg,${A}50,${A}15)`,border:`2px solid ${A}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>💕</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>ระดับความสนิท</span><span style={{fontSize:12,color:A}}>{Math.min(level*10,100)}%</span></div><div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:4,width:`${Math.min(level*10,100)}%`,background:`linear-gradient(90deg,#e87090,${A})`}}/></div><div style={{fontSize:11,opacity:0.5}}>{level<=2?"เพิ่งรู้จักกัน ทำงานด้วยกันต่อนะ!":level<=5?"ซาโตเนะเริ่มเปิดใจกับคุณแล้ว":"คุณกับซาโตเนะสนิทกันมากแล้ว 💕"}</div></div></div></Card>
      </div>}

      {/* ═══ SETTINGS (working theme) ═══ */}
      {nav==="Settings"&&<div style={{padding:"18px 24px 24px",maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{fontSize:26,fontWeight:700,marginBottom:22}}>Settings</div>
        <Card theme={T} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>👤 Profile</div><div style={{marginBottom:12}}><div style={{fontSize:12,opacity:0.4,marginBottom:5}}>Display Name</div><input value={userName} onChange={e=>setUserName(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,fontSize:13,background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",color:T.text,outline:"none"}}/></div></Card>

        <Card theme={T} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>⏱ Timer</div>{[{l:"Work",v:`${workMin} min`,a:()=>{const v=workMin===25?30:workMin===30?45:workMin===45?50:25;setWorkMin(v);if(!running&&mode==="work")setTime(v*60);}},{l:"Break",v:`${breakMin} min`,a:()=>{const v=breakMin===5?10:breakMin===10?15:5;setBreakMin(v);if(!running&&mode==="break")setTime(v*60);}},{l:"Long Break",v:`${longBreak} min`,a:()=>setLongBreak(l=>l===15?20:l===20?30:15)},{l:"Rounds",v:rounds,a:()=>setRounds(r=>r>=8?2:r+1)},{l:"Daily Goal",v:`${dailyGoal} sessions`,a:()=>setDailyGoal(g=>g>=12?4:g+2)}].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{fontSize:13,opacity:0.7}}>{it.l}</span><button onClick={it.a} style={{padding:"5px 14px",borderRadius:8,fontSize:12,fontWeight:600,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",color:T.text}}>{it.v}</button></div>)}</Card>

        <Card theme={T} style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🔔 Notifications</div>{[{l:"Timer Sound",d:"Play sound when done",on:notifSound,t:()=>setNotifSound(!notifSound)},{l:"Auto Break",d:"Auto-start break",on:autoBreak,t:()=>setAutoBreak(!autoBreak)}].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i===0?"1px solid rgba(255,255,255,0.04)":"none"}}><div><div style={{fontSize:13,opacity:0.8}}>{it.l}</div><div style={{fontSize:11,opacity:0.35}}>{it.d}</div></div><Toggle on={it.on} onToggle={it.t} accent={A}/></div>)}</Card>

        {/* Appearance - WORKING */}
        <Card theme={T} style={{marginBottom:14}}>
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
              <div key={c} onClick={()=>setSelAccent(c)} style={{width:32,height:32,borderRadius:10,cursor:"pointer",background:c,border:selAccent===c?"3px solid #fff":"3px solid transparent",transition:"all 0.2s",boxShadow:selAccent===c?`0 0 12px ${c}66`:"none"}}/>
            )}
          </div>
        </Card>

        <Card theme={T}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>💾 Data</div><div style={{display:"flex",gap:8}}><button style={{flex:1,padding:"10px 0",borderRadius:10,fontSize:12,fontWeight:600,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",color:T.text}}>Export Data</button><button style={{flex:1,padding:"10px 0",borderRadius:10,fontSize:12,fontWeight:600,background:`${A}15`,border:`1.5px solid ${A}33`,color:A}}>Reset All</button></div><div style={{fontSize:11,opacity:0.3,marginTop:8,textAlign:"center"}}>Chill with You v1.1 · Made with 💕</div></Card>
      </div>}

      {/* Story overlay (Thai) */}
      {storyOpen&&<div onClick={()=>{if(lineIdx<todayStory.lines.length-1)setLineIdx(l=>l+1);else{setStoryOpen(false);setLineIdx(0);}}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:28,cursor:"pointer",animation:"fadeIn 0.3s ease"}}>
        <div style={{maxWidth:520,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:14}}><div style={{width:56,height:56,borderRadius:18,margin:"0 auto 10px",background:`linear-gradient(135deg,${A}50,${A}18)`,border:`2px solid ${A}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>📝</div><div style={{fontSize:11,opacity:0.4}}>วันนี้: {todayStory.title}</div></div>
          <div style={{background:T.card,borderRadius:18,padding:"22px 24px",border:`1.5px solid ${A}33`}} onClick={()=>{if(lineIdx<todayStory.lines.length-1)setLineIdx(l=>l+1);else{setStoryOpen(false);setLineIdx(0);}}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:7,color:todayStory.lines[lineIdx].s==="ซาโตเนะ"?"#e8a09c":"#9cc5e8"}}>{todayStory.lines[lineIdx].s}</div>
            <div style={{fontSize:15,lineHeight:1.8,opacity:0.85}}>{todayStory.lines[lineIdx].t}</div>
            <div style={{textAlign:"right",marginTop:14,fontSize:11,opacity:0.3}}>▼ คลิกเพื่อดำเนินเรื่อง · {lineIdx+1}/{todayStory.lines.length}</div>
          </div>
        </div>
      </div>}
    </div>
  );
}
