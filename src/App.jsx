import { useState, useEffect, useRef } from "react";

const TRACKS = [
  { id:1, name:"Cozy Afternoon", artist:"Lo-Fi Chill", dur:"3:42" },
  { id:2, name:"Midnight Study", artist:"Dreamy Beats", dur:"4:15" },
  { id:3, name:"Rainy Window", artist:"Ambient Wave", dur:"3:58" },
  { id:4, name:"Sunlit Pages", artist:"Warm Keys", dur:"4:01" },
  { id:5, name:"Stargazer", artist:"Night Owl", dur:"5:20" },
];

const AMBIENT = [
  { id:"rain", name:"Rain", icon:"🌧️" },{ id:"fire", name:"Fire", icon:"🔥" },
  { id:"birds", name:"Birds", icon:"🐦" },{ id:"wind", name:"Wind", icon:"🍃" },
  { id:"cricket", name:"Crickets", icon:"🦗" },{ id:"waves", name:"Ocean", icon:"🌊" },
];

const EPISODES = [
  { id:1,xp:0,title:"First Meeting",lines:[{s:"Satone",t:"Oh! Hi there... I didn't expect anyone else to be working this late."},{s:"You",t:"Hey! I just needed a quiet place to focus."},{s:"Satone",t:"Me too... Mind if we keep each other company?"},{s:"Satone",t:"It's nice not to be alone, you know? ✨"}]},
  { id:2,xp:100,title:"Writer's Block",lines:[{s:"Satone",t:"Ugh... I've been staring at this blank page for an hour..."},{s:"You",t:"Maybe take a short break?"},{s:"Satone",t:"You're right... Want some virtual coffee? ☕"},{s:"Satone",t:"Thanks for being here. It really helps."}]},
  { id:3,xp:300,title:"Breakthrough",lines:[{s:"Satone",t:"I DID IT! I finished chapter 3! 🎉"},{s:"You",t:"That's amazing!"},{s:"Satone",t:"I couldn't have done it without you..."},{s:"Satone",t:"Having someone here... it means everything."}]},
  { id:4,xp:600,title:"Late Night Talk",lines:[{s:"Satone",t:"Hey... can I ask you something personal?"},{s:"You",t:"Of course."},{s:"Satone",t:"Do you ever feel the world is too loud... but also too quiet?"},{s:"Satone",t:"That's why I write. And why I'm glad you're here. 💫"}]},
  { id:5,xp:1000,title:"Our Story",lines:[{s:"Satone",t:"I think I'm going to write about us."},{s:"You",t:"About us?"},{s:"Satone",t:"Two people who found each other in the quiet hours..."},{s:"Satone",t:"And how working together made everything possible. 💕"}]},
];

const ACHIEVEMENTS = [
  {id:1,name:"First Step",icon:"🌱",xpReq:50},{id:2,name:"On Fire",icon:"🔥",xpReq:150},
  {id:3,name:"Task Master",icon:"✅",xpReq:250},{id:4,name:"Habit Builder",icon:"💪",xpReq:400},
  {id:5,name:"Deep Focus",icon:"🧠",xpReq:600},{id:6,name:"Story Lover",icon:"📖",xpReq:300},
  {id:7,name:"Night Owl",icon:"🦉",xpReq:500},{id:8,name:"Zen Master",icon:"🧘",xpReq:1500},
];

const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const fmt=s=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

function Card({children,style}){return <div style={{background:"#1a1a1e",borderRadius:24,padding:"22px 24px",...style}}>{children}</div>;}

function Toggle({on,onToggle}){
  return <div onClick={onToggle} style={{width:44,height:24,borderRadius:12,cursor:"pointer",background:on?"#c9463d":"rgba(255,255,255,0.1)",padding:2,transition:"all 0.25s",display:"flex",alignItems:"center",justifyContent:on?"flex-end":"flex-start"}}>
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

  const [habits,setHabits]=useState([{id:1,name:"Drink water",icon:"💧",done:false},{id:2,name:"Stretch break",icon:"🧘",done:false},{id:3,name:"Read 10 pages",icon:"📖",done:false},{id:4,name:"Meditate",icon:"🧠",done:false}]);
  const [newHabit,setNewHabit]=useState("");
  const [showAddHabit,setShowAddHabit]=useState(false);

  const [track,setTrack]=useState(TRACKS[0]);
  const [playing,setPlaying]=useState(false);
  const [shuffleOn,setShuffleOn]=useState(false);
  const [repeatOn,setRepeatOn]=useState(false);
  const [ambients,setAmbients]=useState({});
  const [mProg,setMProg]=useState(35);
  const [showAmb,setShowAmb]=useState(false);

  const [xp,setXp]=useState(0);
  const level=Math.floor(xp/150)+1;
  const xpNext=level*150;

  const [storyOpen,setStoryOpen]=useState(false);
  const [epIdx,setEpIdx]=useState(0);
  const [lineIdx,setLineIdx]=useState(0);
  const [workLog,setWorkLog]=useState({});
  const [mood,setMood]=useState("idle");

  const [userName,setUserName]=useState("User");
  const [notifSound,setNotifSound]=useState(true);
  const [autoBreak,setAutoBreak]=useState(true);
  const [longBreak,setLongBreak]=useState(15);
  const [dailyGoal,setDailyGoal]=useState(8);
  const [selTheme,setSelTheme]=useState("dark");
  const [statsPeriod,setStatsPeriod]=useState("Week");

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
  const nextTrack=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);setTrack(TRACKS[(i+1)%TRACKS.length]);setMProg(0);};
  const prevTrack=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);setTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);setMProg(0);};
  const unlocked=EPISODES.filter(e=>xp>=e.xp).map(e=>e.id);
  const weeklyData=[{day:"Mon",focus:45},{day:"Tue",focus:90},{day:"Wed",focus:30},{day:"Thu",focus:120},{day:"Fri",focus:75},{day:"Sat",focus:50},{day:"Sun",focus:60}];
  const maxFocus=Math.max(...weeklyData.map(d=>d.focus),1);

  const navIcons={Home:"⌂",Statistics:"📊",Profile:"👤",Settings:"⚙"};

  return(
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",width:"100%",minHeight:"100vh",background:"#111113",color:"#e8e4e0",overflowX:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        input,button{font-family:inherit}button{cursor:pointer}
      `}</style>

      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",gap:4,padding:"14px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexWrap:"wrap"}}>
        {["Home","Statistics","Profile","Settings"].map(n=>
          <button key={n} onClick={()=>setNav(n)} style={{padding:"7px 16px",borderRadius:10,background:nav===n?"#c9463d":"transparent",color:nav===n?"#fff":"rgba(255,255,255,0.45)",border:"none",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
            <span>{navIcons[n]}</span>{n}
          </button>
        )}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"rgba(201,70,61,0.12)",border:"1px solid rgba(201,70,61,0.25)",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#e8a09c",display:"flex",alignItems:"center",gap:5}}>
            ⭐ Lv.{level}<span style={{opacity:0.5,fontWeight:400}}>{xp}XP</span>
          </div>
          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#c9463d,#e8705a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{userName[0].toUpperCase()}</div>
        </div>
      </nav>

      {/* ═══ HOME ═══ */}
      {nav==="Home"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        {/* Timer */}
        <Card style={{padding:"24px 28px",display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
          <div style={{position:"absolute",top:18,left:22,background:mode==="work"?"rgba(201,70,61,0.12)":"rgba(52,211,153,0.12)",border:mode==="work"?"1px solid rgba(201,70,61,0.25)":"1px solid rgba(52,211,153,0.25)",borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:600,color:mode==="work"?"#e8a09c":"#6ee8a0",textTransform:"uppercase"}}>{mode==="work"?"Focus":"Break"}</div>
          <div style={{position:"absolute",top:20,right:22,display:"flex",gap:4}}>{Array.from({length:rounds}).map((_,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<sessions?"#c9463d":"rgba(255,255,255,0.1)"}}/>)}</div>
          <div style={{position:"relative",width:220,height:220,margin:"18px 0 14px"}}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="104" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
              {Array.from({length:60}).map((_,i)=>{const a=(i/60)*360-90,r1=i%5===0?88:94,r2=100;return<line key={i} x1={110+r1*Math.cos(a*Math.PI/180)} y1={110+r1*Math.sin(a*Math.PI/180)} x2={110+r2*Math.cos(a*Math.PI/180)} y2={110+r2*Math.sin(a*Math.PI/180)} stroke={i%5===0?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.12)"} strokeWidth={i%5===0?2.5:1} strokeLinecap="round"/>})}
              <circle cx="110" cy="110" r="78" fill="none" stroke="rgba(201,70,61,0.12)" strokeWidth="28"/>
              {progress>0&&<circle cx="110" cy="110" r="78" fill="none" stroke="rgba(220,120,110,0.35)" strokeWidth="28" strokeDasharray={2*Math.PI*78} strokeDashoffset={2*Math.PI*78*(1-progress)} style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset 1s linear"}}/>}
              <circle cx="110" cy="110" r="64" fill="#1a1a1e"/>
              {(()=>{const a=(handAngle-90)*Math.PI/180;return<><line x1="110" y1="110" x2={110+72*Math.cos(a)} y2={110+72*Math.sin(a)} stroke="#c9463d" strokeWidth="2.5" strokeLinecap="round"/><circle cx="110" cy="110" r="4.5" fill="#fff"/></>})()}
            </svg>
          </div>
          <div style={{fontSize:44,fontWeight:300,letterSpacing:3,fontVariantNumeric:"tabular-nums",marginBottom:18}}>{fmt(time)}</div>
          <button onClick={()=>{if(!running)setMood("working");setRunning(!running);}} style={{width:"100%",maxWidth:260,padding:"12px 0",borderRadius:13,background:running?"rgba(201,70,61,0.15)":"#c9463d",border:running?"1.5px solid rgba(201,70,61,0.4)":"1.5px solid #c9463d",color:running?"#e8a09c":"#fff",fontSize:15,fontWeight:600,transition:"all 0.25s"}}>{running?"Pause session":"Start session"}</button>
          <div style={{display:"flex",gap:14,marginTop:14,opacity:0.5,fontSize:12}}>
            <span onClick={()=>{if(!running){const v=workMin===25?30:workMin===30?45:workMin===45?50:25;setWorkMin(v);if(mode==="work")setTime(v*60);}}} style={{cursor:"pointer",borderBottom:"1px dashed rgba(255,255,255,0.3)"}}>Work:{workMin}m</span>
            <span onClick={()=>{if(!running){const v=breakMin===5?10:breakMin===10?15:5;setBreakMin(v);if(mode==="break")setTime(v*60);}}} style={{cursor:"pointer",borderBottom:"1px dashed rgba(255,255,255,0.3)"}}>Break:{breakMin}m</span>
            <span onClick={()=>setRounds(r=>r>=8?2:r+1)} style={{cursor:"pointer",borderBottom:"1px dashed rgba(255,255,255,0.3)"}}>Rounds:{rounds}</span>
          </div>
        </Card>

        {/* Calendar + Story */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:18,fontWeight:700}}>Calendar</span><div style={{border:"1.5px solid #c9463d",borderRadius:20,padding:"4px 14px",color:"#c9463d",fontSize:12,fontWeight:600}}>Today ▾</div></div>
            <div style={{display:"flex",gap:6,marginBottom:16}}>{calDates.map((d,i)=>{const t=d.toDateString()===now.toDateString();return<div key={i} style={{flex:1,textAlign:"center",padding:"7px 0",borderRadius:10,background:t?"rgba(201,70,61,0.15)":"rgba(255,255,255,0.03)",border:t?"1.5px solid rgba(201,70,61,0.4)":"1.5px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:10,opacity:0.4}}>{DAYS[(d.getDay()+6)%7]}</div><div style={{fontSize:18,fontWeight:600}}>{d.getDate()}</div></div>})}</div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,fontSize:13,marginBottom:10}}>
              <span style={{color:"#c9463d",fontWeight:700}}>{sessions}</span><span style={{opacity:0.3}}>↑</span><span style={{opacity:0.5}}>{todos.filter(t=>t.done).length}</span><span style={{opacity:0.3}}>→</span><span style={{opacity:0.5}}>{habits.filter(h=>h.done).length}</span><span style={{opacity:0.3}}>↓</span><span style={{fontWeight:600,marginLeft:"auto"}}>{focusH}H {focusM}M Focus</span>
            </div>
            <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:`${Math.min((sessions/rounds)*100,100)}%`,background:"linear-gradient(90deg,#c9463d,#e87060)",transition:"width 0.5s"}}/></div>
          </Card>
          <Card style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>Satone's Story</span><span style={{fontSize:11,opacity:0.4}}>{unlocked.length}/{EPISODES.length}</span></div>
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:"linear-gradient(135deg,rgba(201,70,61,0.3),rgba(201,70,61,0.1))",border:"1.5px solid rgba(201,70,61,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{mood==="happy"?"😊":running?"✍️":"📝"}</div>
              <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:12,borderTopLeftRadius:3,padding:"8px 12px",fontSize:12,lineHeight:1.6,opacity:0.7}}>{running&&mode==="work"?"Let's focus together! ✨":running?"Take a breather ☕":mood==="happy"?"Great session!":"Start a session to unlock episodes~ 🌙"}</div>
            </div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
              {EPISODES.map((ep,idx)=>{const u=unlocked.includes(ep.id);return<button key={ep.id} onClick={()=>{if(u){setEpIdx(idx);setLineIdx(0);setStoryOpen(true);}}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,background:u?"rgba(201,70,61,0.06)":"rgba(255,255,255,0.02)",border:u?"1px solid rgba(201,70,61,0.12)":"1px solid rgba(255,255,255,0.04)",color:"#e8e4e0",fontSize:12,textAlign:"left",opacity:u?1:0.35}}><span>{u?"📜":"🔒"}</span><span style={{flex:1}}>Ep.{ep.id}: {ep.title}</span><span style={{fontSize:10,opacity:0.4}}>{ep.xp}xp</span></button>})}
            </div>
          </Card>
        </div>

        {/* Music + Tasks */}
        <div style={{display:"flex",gap:14}}>
          <Card style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Music</span><button onClick={()=>setShowAmb(!showAmb)} style={{width:26,height:26,borderRadius:7,background:"rgba(201,70,61,0.12)",border:"1px solid rgba(201,70,61,0.2)",color:"#c9463d",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>🌿</button></div>
            <div style={{fontSize:13,fontWeight:500}}>{track.name}</div>
            <div style={{fontSize:11,opacity:0.4,marginBottom:12}}>{track.artist}</div>
            <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.08)",marginBottom:14,overflow:"hidden",cursor:"pointer"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setMProg(((e.clientX-r.left)/r.width)*100);}}><div style={{height:"100%",width:`${mProg}%`,background:"linear-gradient(90deg,#c9463d,#e87060)",transition:"width 0.3s"}}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginTop:"auto"}}>
              <button onClick={()=>setShuffleOn(!shuffleOn)} style={{background:"none",border:"none",fontSize:14,color:shuffleOn?"#c9463d":"rgba(255,255,255,0.25)"}}>⇄</button>
              <button onClick={prevTrack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏮</button>
              <button onClick={()=>setPlaying(!playing)} style={{width:36,height:36,borderRadius:"50%",background:"#c9463d",border:"none",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?"⏸":"▶"}</button>
              <button onClick={nextTrack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14}}>⏭</button>
              <button onClick={()=>setRepeatOn(!repeatOn)} style={{background:"none",border:"none",fontSize:14,color:repeatOn?"#c9463d":"rgba(255,255,255,0.25)"}}>🔁</button>
            </div>
            {showAmb&&<div style={{marginTop:12}}><div style={{fontSize:11,opacity:0.4,marginBottom:6}}>Ambient</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>{AMBIENT.map(a=><button key={a.id} onClick={()=>setAmbients(p=>({...p,[a.id]:!p[a.id]}))} style={{padding:"6px 3px",borderRadius:8,fontSize:11,background:ambients[a.id]?"rgba(201,70,61,0.12)":"rgba(255,255,255,0.03)",border:ambients[a.id]?"1px solid rgba(201,70,61,0.25)":"1px solid rgba(255,255,255,0.06)",color:"#e8e4e0",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:14}}>{a.icon}</span>{a.name}</button>)}</div></div>}
          </Card>
          <Card style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Task</span><button onClick={()=>setShowAddTask(!showAddTask)} style={{width:26,height:26,borderRadius:7,background:"rgba(201,70,61,0.12)",border:"1px solid rgba(201,70,61,0.2)",color:"#c9463d",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddTask&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="New task..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#e8e4e0",outline:"none"}}/><button onClick={addTodo} style={{padding:"7px 10px",borderRadius:8,background:"#c9463d",border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
              {todos.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",cursor:"pointer"}} onClick={()=>setTodos(todos.map(x=>{if(x.id===t.id){if(!x.done){setXp(v=>v+10);setMood("happy");}return{...x,done:!x.done};}return x;}))}><div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:t.done?"2px solid #c9463d":"2px solid rgba(255,255,255,0.15)",background:t.done?"#c9463d":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10}}>{t.done&&"✓"}</div><span style={{fontSize:13,textDecoration:t.done?"line-through":"none",opacity:t.done?0.35:0.8}}>{t.text}</span><button onClick={e=>{e.stopPropagation();setTodos(todos.filter(x=>x.id!==t.id));}} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:11}}>✕</button></div>)}
            </div>
            <div style={{fontSize:10,opacity:0.3,marginTop:6}}>+10xp per task</div>
          </Card>
        </div>

        {/* Habits + Heatmap */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700}}>Daily Habits</span><button onClick={()=>setShowAddHabit(!showAddHabit)} style={{width:26,height:26,borderRadius:7,background:"rgba(201,70,61,0.12)",border:"1px solid rgba(201,70,61,0.2)",color:"#c9463d",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>
            {showAddHabit&&<div style={{display:"flex",gap:5,marginBottom:8}}><input value={newHabit} onChange={e=>setNewHabit(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} placeholder="New habit..." autoFocus style={{flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#e8e4e0",outline:"none"}}/><button onClick={addHabit} style={{padding:"7px 10px",borderRadius:8,background:"#c9463d",border:"none",color:"#fff",fontSize:12,fontWeight:600}}>Add</button></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {habits.map(h=><button key={h.id} onClick={()=>setHabits(habits.map(x=>{if(x.id===h.id){if(!x.done)setXp(v=>v+15);return{...x,done:!x.done};}return x;}))} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 10px",borderRadius:10,fontSize:12,textAlign:"left",background:h.done?"rgba(201,70,61,0.1)":"rgba(255,255,255,0.03)",border:h.done?"1.5px solid rgba(201,70,61,0.25)":"1.5px solid rgba(255,255,255,0.05)",color:"#e8e4e0"}}><span style={{fontSize:15}}>{h.icon}</span><span style={{flex:1,opacity:h.done?0.5:0.8}}>{h.name}</span>{h.done&&<span style={{color:"#c9463d",fontSize:11}}>✓</span>}</button>)}
            </div>
            <div style={{fontSize:10,opacity:0.3,marginTop:8,textAlign:"right"}}>{habits.filter(h=>h.done).length}/{habits.length} · +15xp</div>
          </Card>
          <Card style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:16,fontWeight:700}}>Progress</span><div style={{border:"1.5px solid #c9463d",borderRadius:20,padding:"4px 12px",color:"#c9463d",fontSize:11,fontWeight:600}}>Weekly ▾</div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:5}}>{DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,opacity:0.35}}>{d}</div>)}</div>
            {Array.from({length:4}).map((_,w)=><div key={w} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>{Array.from({length:7}).map((_,d)=><div key={d} style={{aspectRatio:"1",borderRadius:5,background:`rgba(201,70,61,${0.1+getHeat(w,d)*0.7})`}}/>)}</div>)}
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3,marginTop:6}}><span style={{fontSize:10,opacity:0.3}}>Less</span>{[0.15,0.3,0.5,0.7,0.9].map((v,i)=><div key={i} style={{width:10,height:10,borderRadius:2,background:`rgba(201,70,61,${v})`}}/>)}<span style={{fontSize:10,opacity:0.3}}>More</span></div>
          </Card>
        </div>
      </div>}

      {/* ═══ STATISTICS ═══ */}
      {nav==="Statistics"&&<div style={{padding:"18px 24px 24px",maxWidth:1200,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{display:"flex",gap:6,marginBottom:20}}>{["Day","Week","Month","All Time"].map(p=><button key={p} onClick={()=>setStatsPeriod(p)} style={{padding:"7px 18px",borderRadius:10,fontSize:12,fontWeight:600,background:statsPeriod===p?"#c9463d":"rgba(255,255,255,0.04)",border:statsPeriod===p?"1.5px solid #c9463d":"1.5px solid rgba(255,255,255,0.06)",color:statsPeriod===p?"#fff":"rgba(255,255,255,0.45)"}}>{p}</button>)}</div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
          {[{l:"Total Focus",v:`${focusH}h ${focusM}m`,i:"⏱",s:"+12%"},{l:"Sessions",v:sessions,i:"🔄",s:`${sessions} today`},{l:"Tasks Done",v:todos.filter(t=>t.done).length,i:"✅",s:`of ${todos.length}`},{l:"Streak",v:"3 days",i:"🔥",s:"Best: 7"}].map((s,i)=>
            <Card key={i} style={{textAlign:"center",padding:"18px 14px"}}><div style={{fontSize:26,marginBottom:6}}>{s.i}</div><div style={{fontSize:26,fontWeight:700,marginBottom:3}}>{s.v}</div><div style={{fontSize:12,opacity:0.4,marginBottom:3}}>{s.l}</div><div style={{fontSize:11,color:"#c9463d",fontWeight:500}}>{s.s}</div></Card>
          )}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><span style={{fontSize:16,fontWeight:700}}>Focus Time</span><span style={{fontSize:11,opacity:0.4}}>This week</span></div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160,paddingBottom:24,position:"relative"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:24,display:"flex",flexDirection:"column",justifyContent:"space-between",fontSize:10,opacity:0.3,width:28}}><span>{maxFocus}m</span><span>{Math.round(maxFocus/2)}m</span><span>0</span></div>
              <div style={{flex:1,display:"flex",alignItems:"flex-end",gap:8,marginLeft:34}}>
                {weeklyData.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{width:"100%",borderRadius:7,height:`${(d.focus/maxFocus)*130}px`,background:i===3?"linear-gradient(180deg,#c9463d,#8b2e28)":"linear-gradient(180deg,rgba(201,70,61,0.4),rgba(201,70,61,0.15))",position:"relative"}}><div style={{position:"absolute",top:-18,width:"100%",textAlign:"center",fontSize:10,opacity:0.5}}>{d.focus}m</div></div>
                  <span style={{fontSize:11,opacity:0.4}}>{d.day}</span>
                </div>)}
              </div>
            </div>
          </Card>
          <Card>
            <div style={{fontSize:16,fontWeight:700,marginBottom:18}}>Productivity</div>
            {[{l:"Deep Focus",p:68,c:"#c9463d"},{l:"Light Work",p:22,c:"rgba(201,70,61,0.5)"},{l:"Breaks",p:10,c:"rgba(201,70,61,0.2)"}].map((it,i)=><div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}><span style={{opacity:0.7}}>{it.l}</span><span style={{fontWeight:600}}>{it.p}%</span></div><div style={{height:7,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${it.p}%`,background:it.c}}/></div></div>)}
            <div style={{marginTop:16,padding:"12px 14px",background:"rgba(201,70,61,0.06)",borderRadius:10,border:"1px solid rgba(201,70,61,0.12)"}}><div style={{fontSize:12,opacity:0.6,marginBottom:3}}>Daily Goal</div><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{flex:1,height:7,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${Math.min((sessions/dailyGoal)*100,100)}%`,background:"linear-gradient(90deg,#c9463d,#e87060)"}}/></div><span style={{fontSize:12,fontWeight:600}}>{sessions}/{dailyGoal}</span></div></div>
          </Card>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
          <Card><div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Habit Consistency</div>{habits.map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:16}}>{h.icon}</span><span style={{flex:1,fontSize:13,opacity:0.7}}>{h.name}</span><div style={{display:"flex",gap:2}}>{Array.from({length:7}).map((_,d)=><div key={d} style={{width:12,height:12,borderRadius:3,background:(h.id+d)%3!==0?`rgba(201,70,61,${0.3+d*0.1})`:"rgba(255,255,255,0.06)"}}/>)}</div></div>)}</Card>
          <Card><div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Most Played</div>{TRACKS.slice(0,4).map((t,i)=><div key={t.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:26,height:26,borderRadius:7,background:"rgba(201,70,61,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#c9463d"}}>{i+1}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{t.name}</div><div style={{fontSize:11,opacity:0.4}}>{t.artist}</div></div><span style={{fontSize:11,opacity:0.3}}>{t.dur}</span></div>)}</Card>
        </div>
      </div>}

      {/* ═══ PROFILE ═══ */}
      {nav==="Profile"&&<div style={{padding:"18px 24px 24px",maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <Card style={{display:"flex",gap:24,alignItems:"center",marginBottom:18,padding:"28px 32px"}}>
          <div style={{width:88,height:88,borderRadius:26,flexShrink:0,background:"linear-gradient(135deg,#c9463d,#e8705a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,fontWeight:700,color:"#fff",boxShadow:"0 8px 32px rgba(201,70,61,0.3)"}}>{userName[0].toUpperCase()}</div>
          <div style={{flex:1}}><div style={{fontSize:26,fontWeight:700,marginBottom:3}}>{userName}</div><div style={{fontSize:13,opacity:0.4,marginBottom:10}}>Chilling since day one</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><div style={{background:"rgba(201,70,61,0.12)",border:"1.5px solid rgba(201,70,61,0.25)",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:600,color:"#c9463d"}}>⭐ Level {level}</div><div style={{background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.06)",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>🔥 3 day streak</div><div style={{background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.06)",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.5)"}}>📖 {unlocked.length} episodes</div></div></div>
        </Card>
        <Card style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:16,fontWeight:700}}>Level Progress</span><span style={{fontSize:13,color:"#c9463d",fontWeight:600}}>Lv.{level} → {level+1}</span></div><div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:5,width:`${Math.min((xp/xpNext)*100,100)}%`,background:"linear-gradient(90deg,#c9463d,#e87060,#f0a090)"}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.5}}><span>{xp} XP</span><span>{xpNext} XP</span></div></Card>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
          {[{l:"Sessions",v:sessions,i:"🎯"},{l:"Focus",v:`${focusH}h ${focusM}m`,i:"⏱"},{l:"Tasks",v:todos.filter(t=>t.done).length,i:"✅"},{l:"Habits",v:habits.length,i:"💪"},{l:"Story",v:`${unlocked.length}/${EPISODES.length}`,i:"📖"},{l:"Fav Track",v:track.name,i:"🎵"}].map((s,i)=>
            <Card key={i} style={{padding:"16px 18px"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:20}}>{s.i}</span><span style={{fontSize:12,opacity:0.4}}>{s.l}</span></div><div style={{fontSize:20,fontWeight:700}}>{s.v}</div></Card>
          )}
        </div>

        <Card style={{marginBottom:18}}><div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Achievements</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{ACHIEVEMENTS.map(a=>{const e=xp>=a.xpReq;return<div key={a.id} style={{textAlign:"center",padding:"14px 6px",borderRadius:14,background:e?"rgba(201,70,61,0.1)":"rgba(255,255,255,0.02)",border:e?"1.5px solid rgba(201,70,61,0.25)":"1.5px solid rgba(255,255,255,0.04)",opacity:e?1:0.35}}><div style={{fontSize:28,marginBottom:4}}>{a.icon}</div><div style={{fontSize:12,fontWeight:600}}>{a.name}</div><div style={{fontSize:10,opacity:0.4}}>{e?"Earned!":a.xpReq+"XP"}</div></div>})}</div></Card>

        <Card><div style={{fontSize:16,fontWeight:700,marginBottom:12}}>Bond with Satone</div><div style={{display:"flex",gap:18,alignItems:"center"}}><div style={{width:64,height:64,borderRadius:20,flexShrink:0,background:"linear-gradient(135deg,rgba(201,70,61,0.3),rgba(201,70,61,0.08))",border:"2px solid rgba(201,70,61,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>💕</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>Affection</span><span style={{fontSize:12,color:"#c9463d"}}>{Math.min(unlocked.length*20,100)}%</span></div><div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:4,width:`${Math.min(unlocked.length*20,100)}%`,background:"linear-gradient(90deg,#e87090,#c9463d)"}}/></div><div style={{fontSize:11,opacity:0.5}}>{unlocked.length<=1?"Just met. Keep working together!":unlocked.length<=3?"She's opening up to you.":"A deep connection."}</div></div></div></Card>
      </div>}

      {/* ═══ SETTINGS ═══ */}
      {nav==="Settings"&&<div style={{padding:"18px 24px 24px",maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{fontSize:26,fontWeight:700,marginBottom:22}}>Settings</div>
        <Card style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>👤 Profile</div><div style={{marginBottom:12}}><div style={{fontSize:12,opacity:0.4,marginBottom:5}}>Display Name</div><input value={userName} onChange={e=>setUserName(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,fontSize:13,background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#e8e4e0",outline:"none"}}/></div><div><div style={{fontSize:12,opacity:0.4,marginBottom:5}}>Avatar</div><div style={{display:"flex",gap:8}}>{["🧑‍💻","👩‍🎨","🧑‍🔬","👩‍💼","🐱","🌸"].map((a,i)=><div key={i} style={{width:40,height:40,borderRadius:12,cursor:"pointer",background:i===0?"rgba(201,70,61,0.15)":"rgba(255,255,255,0.04)",border:i===0?"1.5px solid rgba(201,70,61,0.3)":"1.5px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{a}</div>)}</div></div></Card>

        <Card style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>⏱ Timer</div>{[{l:"Work",v:`${workMin} min`,a:()=>{const v=workMin===25?30:workMin===30?45:workMin===45?50:25;setWorkMin(v);if(!running&&mode==="work")setTime(v*60);}},{l:"Break",v:`${breakMin} min`,a:()=>{const v=breakMin===5?10:breakMin===10?15:5;setBreakMin(v);if(!running&&mode==="break")setTime(v*60);}},{l:"Long Break",v:`${longBreak} min`,a:()=>setLongBreak(l=>l===15?20:l===20?30:15)},{l:"Rounds",v:rounds,a:()=>setRounds(r=>r>=8?2:r+1)},{l:"Daily Goal",v:`${dailyGoal} sessions`,a:()=>setDailyGoal(g=>g>=12?4:g+2)}].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{fontSize:13,opacity:0.7}}>{it.l}</span><button onClick={it.a} style={{padding:"5px 14px",borderRadius:8,fontSize:12,fontWeight:600,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#e8e4e0"}}>{it.v}</button></div>)}</Card>

        <Card style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🔔 Notifications</div>{[{l:"Timer Sound",d:"Play sound when done",on:notifSound,t:()=>setNotifSound(!notifSound)},{l:"Auto Break",d:"Auto-start break after work",on:autoBreak,t:()=>setAutoBreak(!autoBreak)}].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i===0?"1px solid rgba(255,255,255,0.04)":"none"}}><div><div style={{fontSize:13,opacity:0.8}}>{it.l}</div><div style={{fontSize:11,opacity:0.35}}>{it.d}</div></div><Toggle on={it.on} onToggle={it.t}/></div>)}</Card>

        <Card style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🎨 Appearance</div><div style={{fontSize:12,opacity:0.4,marginBottom:8}}>Theme</div><div style={{display:"flex",gap:8,marginBottom:14}}>{[{id:"dark",l:"Dark",c:"#1a1a1e"},{id:"midnight",l:"Midnight",c:"#0f0c29"},{id:"forest",l:"Forest",c:"#134e5e"}].map(t=><button key={t.id} onClick={()=>setSelTheme(t.id)} style={{flex:1,padding:"12px 0",borderRadius:12,fontSize:12,fontWeight:600,background:t.c,border:selTheme===t.id?"2px solid #c9463d":"2px solid rgba(255,255,255,0.06)",color:"#e8e4e0",boxShadow:selTheme===t.id?"0 0 16px rgba(201,70,61,0.2)":"none"}}>{t.l}</button>)}</div><div style={{fontSize:12,opacity:0.4,marginBottom:8}}>Accent Color</div><div style={{display:"flex",gap:8}}>{["#c9463d","#6366f1","#f59e0b","#10b981","#ec4899","#8b5cf6"].map(c=><div key={c} style={{width:28,height:28,borderRadius:8,cursor:"pointer",background:c,border:c==="#c9463d"?"3px solid #fff":"3px solid transparent"}}/>)}</div></Card>

        <Card><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>💾 Data</div><div style={{display:"flex",gap:8}}><button style={{flex:1,padding:"10px 0",borderRadius:10,fontSize:12,fontWeight:600,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#e8e4e0"}}>Export Data</button><button style={{flex:1,padding:"10px 0",borderRadius:10,fontSize:12,fontWeight:600,background:"rgba(201,70,61,0.08)",border:"1.5px solid rgba(201,70,61,0.2)",color:"#c9463d"}}>Reset All</button></div><div style={{fontSize:11,opacity:0.3,marginTop:8,textAlign:"center"}}>Chill with You v1.0 · Made with 💕</div></Card>
      </div>}

      {/* Story overlay */}
      {storyOpen&&<div onClick={()=>{const ep=EPISODES[epIdx];if(lineIdx<ep.lines.length-1)setLineIdx(l=>l+1);else{setStoryOpen(false);setLineIdx(0);}}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:28,cursor:"pointer",animation:"fadeIn 0.3s ease"}}>
        <div style={{maxWidth:520,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:14}}><div style={{width:56,height:56,borderRadius:18,margin:"0 auto 10px",background:"linear-gradient(135deg,rgba(201,70,61,0.3),rgba(201,70,61,0.1))",border:"2px solid rgba(201,70,61,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>📝</div><div style={{fontSize:11,opacity:0.4}}>Ep.{EPISODES[epIdx].id}: {EPISODES[epIdx].title}</div></div>
          <div style={{background:"#1a1a1e",borderRadius:18,padding:"22px 24px",border:"1.5px solid rgba(201,70,61,0.2)"}} onClick={()=>{const ep=EPISODES[epIdx];if(lineIdx<ep.lines.length-1)setLineIdx(l=>l+1);else{setStoryOpen(false);setLineIdx(0);}}}>
            <div style={{fontSize:12,fontWeight:600,marginBottom:7,color:EPISODES[epIdx].lines[lineIdx].s==="Satone"?"#e8a09c":"#9cc5e8"}}>{EPISODES[epIdx].lines[lineIdx].s}</div>
            <div style={{fontSize:15,lineHeight:1.7,opacity:0.85}}>{EPISODES[epIdx].lines[lineIdx].t}</div>
            <div style={{textAlign:"right",marginTop:14,fontSize:11,opacity:0.3}}>▼ Click · {lineIdx+1}/{EPISODES[epIdx].lines.length}</div>
          </div>
        </div>
      </div>}
    </div>
  );
}
