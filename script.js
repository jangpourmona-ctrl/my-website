const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];


// Welcome screen: a lightweight local profile, not a real authentication system.
const savedName = localStorage.getItem("plannerUserName");
const welcomeScreen = $("#welcomeScreen");
const userGreeting = $("#userGreeting");

function applyUserName(name){
  const clean = name.trim().slice(0,30);
  if (!clean) return;
  localStorage.setItem("plannerUserName", clean);
  userGreeting.textContent = `${clean} 👋`;
  welcomeScreen.classList.add("hidden");
  $("#viewTitle").textContent = `Guten Morgen, ${clean} 👋`;
}

if (savedName) applyUserName(savedName);
$("#welcomeForm").onsubmit = (e) => {
  e.preventDefault();
  applyUserName($("#userName").value);
};


const todayISO = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0,10);
};

const seedTasks = [
  {id:1,title:"CS50 Lernmodul bearbeiten",date:todayISO(),priority:"high",category:"Study",done:false},
  {id:2,title:"Bewerbungsunterlagen aktualisieren",date:todayISO(),priority:"medium",category:"Work",done:false},
  {id:3,title:"30 Minuten Deutsch lernen",date:todayISO(),priority:"medium",category:"Study",done:true},
  {id:4,title:"GitHub README verbessern",date:todayISO(),priority:"low",category:"Work",done:false},
  {id:5,title:"Wochenplanung vorbereiten",date:new Date(Date.now()+86400000).toISOString().slice(0,10),priority:"low",category:"Personal",done:false}
];

let tasks = JSON.parse(localStorage.getItem("plannerTasks") || "null") || seedTasks;
let currentFilter = "all";
let calendarDate = new Date();
let timerSeconds = 25 * 60;
let timerInterval = null;

const save = () => localStorage.setItem("plannerTasks", JSON.stringify(tasks));
const dateLabel = new Intl.DateTimeFormat("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
$("#dateLabel").textContent = dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1);

function renderStats(){
  const done = tasks.filter(t=>t.done).length;
  const today = tasks.filter(t=>t.date===todayISO()&&!t.done).length;
  const rate = tasks.length ? Math.round(done/tasks.length*100) : 0;
  $("#doneCount").textContent = done;
  $("#todayCount").textContent = today;
  $("#productivity").textContent = rate+"%";
  const weekly = Math.min(done,8);
  $("#weeklyPercent").textContent = Math.round(weekly/8*100)+"%";
  $("#weeklyProgress").style.width = Math.round(weekly/8*100)+"%";
  $("#weeklyLabel").textContent = `${weekly} von 8 Aufgaben erledigt`;
}

const priorityName = {high:"Hoch",medium:"Mittel",low:"Niedrig"};

function taskHTML(t){
  return `<div class="task ${t.done?"done":""}" data-id="${t.id}">
    <button class="check" aria-label="Aufgabe abhaken">${t.done?"✓":""}</button>
    <div class="task-main"><div class="task-title">${escapeHTML(t.title)}</div><div class="task-meta">${t.category} · ${formatDate(t.date)}</div></div>
    <span class="badge ${t.priority}">${priorityName[t.priority]}</span>
    <button class="delete-btn" aria-label="Aufgabe löschen">×</button>
  </div>`;
}
function formatDate(date){return new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit"}).format(new Date(date+"T12:00:00"))}
function escapeHTML(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderTasks(){
  const today = tasks.filter(t=>t.date===todayISO()).sort((a,b)=>Number(a.done)-Number(b.done));
  $("#todayTasks").innerHTML = today.length ? today.map(taskHTML).join("") : `<div class="empty">🎉 Für heute ist alles erledigt.</div>`;
  let list = tasks;
  if(currentFilter==="open") list=tasks.filter(t=>!t.done);
  if(currentFilter==="done") list=tasks.filter(t=>t.done);
  $("#allTasks").innerHTML = list.length ? list.map(taskHTML).join("") : `<div class="empty">Keine Aufgaben in dieser Ansicht.</div>`;
  bindTaskActions();
  renderStats();
}
function bindTaskActions(){
  $$(".task .check").forEach(btn=>btn.onclick=()=>{const t=tasks.find(x=>x.id==btn.closest(".task").dataset.id);t.done=!t.done;save();renderAll()});
  $$(".delete-btn").forEach(btn=>btn.onclick=()=>{tasks=tasks.filter(x=>x.id!=btn.closest(".task").dataset.id);save();renderAll()});
}
function renderChart(){
  const names=["Mo","Di","Mi","Do","Fr","Sa","So"];
  const now=new Date(); const monday=new Date(now); monday.setDate(now.getDate()-((now.getDay()+6)%7));
  const vals=names.map((_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);const iso=d.toISOString().slice(0,10);return tasks.filter(t=>t.date===iso&&t.done).length});
  const max=Math.max(2,...vals);
  $("#weekChart").innerHTML=vals.map((v,i)=>`<div class="bar-wrap"><div class="bar ${i===((now.getDay()+6)%7)?"today":""}" style="height:${Math.max(7,v/max*100)}%"></div><small>${names[i]}</small></div>`).join("");
}
function renderCalendar(){
  const y=calendarDate.getFullYear(),m=calendarDate.getMonth();
  $("#monthTitle").textContent=new Intl.DateTimeFormat("de-DE",{month:"long",year:"numeric"}).format(calendarDate);
  const first=new Date(y,m,1), start=(first.getDay()+6)%7, days=new Date(y,m+1,0).getDate(), prevDays=new Date(y,m,0).getDate();
  let cells=[];
  for(let i=0;i<42;i++){
    const day=i-start+1;
    let d,other=false;
    if(day<1){d=new Date(y,m-1,prevDays+day);other=true}
    else if(day>days){d=new Date(y,m+1,day-days);other=true}
    else d=new Date(y,m,day);
    const iso=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);
    const dayTasks=tasks.filter(t=>t.date===iso).slice(0,2);
    cells.push(`<div class="day ${other?"other":""} ${iso===todayISO()?"today":""}"><div class="day-num">${d.getDate()}</div>${dayTasks.map(t=>`<span class="day-task">${escapeHTML(t.title)}</span>`).join("")}</div>`);
  }
  $("#calendarGrid").innerHTML=cells.join("");
}
function renderAll(){renderTasks();renderChart();renderCalendar()}

function showView(view){
  $$(".view").forEach(v=>v.classList.add("hidden"));
  $("#"+view+"View").classList.remove("hidden");
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
  const name = localStorage.getItem("plannerUserName");
  const titles={dashboard:name?`Guten Morgen, ${name} 👋`:"Guten Morgen 👋",tasks:"Deine Aufgaben",calendar:"Dein Kalender",focus:"Fokuszeit"};
  $("#viewTitle").textContent=titles[view];
}
$$(".nav-item").forEach(n=>n.onclick=()=>showView(n.dataset.view));
$$("[data-view-link]").forEach(n=>n.onclick=()=>showView(n.dataset.viewLink));
$$(".filter").forEach(b=>b.onclick=()=>{currentFilter=b.dataset.filter;$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderTasks()});

const dialog=$("#taskDialog");
$("#quickAdd").onclick=()=>{ $("#taskDate").value=todayISO(); dialog.showModal(); };
$("#closeDialog").onclick=$("#cancelDialog").onclick=()=>dialog.close();
$("#taskForm").onsubmit=(e)=>{
  e.preventDefault();
  tasks.unshift({id:Date.now(),title:$("#taskTitle").value.trim(),date:$("#taskDate").value,priority:$("#taskPriority").value,category:$("#taskCategory").value,done:false});
  save();renderAll();dialog.close();e.target.reset();
};

$("#themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("plannerTheme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("plannerTheme")==="dark")document.body.classList.add("dark");
$("#prevMonth").onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar()};
$("#nextMonth").onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar()};

const quotes=["Consistency beats intensity.","Small steps every day.","Plan less. Do more.","Progress, not perfection.","One focused hour can change a day."];
$("#quote").textContent=quotes[new Date().getDate()%quotes.length];

function updateTimer(){
  const m=String(Math.floor(timerSeconds/60)).padStart(2,"0"),s=String(timerSeconds%60).padStart(2,"0");
  $("#timer").textContent=`${m}:${s}`;
}
function startTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;$("#startTimer").textContent="Start";$("#timerStatus").textContent="Pause. Atme kurz durch.";return}
  $("#startTimer").textContent="Pause";
  $("#timerStatus").textContent="Fokus läuft…";
  timerInterval=setInterval(()=>{timerSeconds--;updateTimer();if(timerSeconds<=0){clearInterval(timerInterval);timerInterval=null;$("#startTimer").textContent="Start";$("#timerStatus").textContent="Session abgeschlossen 🎉";}},1000);
}
$("#startTimer").onclick=startTimer;
$("#resetTimer").onclick=()=>{clearInterval(timerInterval);timerInterval=null;timerSeconds=25*60;updateTimer();$("#startTimer").textContent="Start";$("#timerStatus").textContent="Bereit für eine fokussierte Session?"};
$$(".mode").forEach(m=>m.onclick=()=>{$$(".mode").forEach(x=>x.classList.remove("active"));m.classList.add("active");clearInterval(timerInterval);timerInterval=null;timerSeconds=Number(m.dataset.minutes)*60;updateTimer();$("#startTimer").textContent="Start"});

renderAll();
