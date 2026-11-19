// FRD Lab Hub application code (loaded by index.html).
{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>/^https?:\/\//i.test(u||'')?esc(u):'#';
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const monday=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());return addD(x,-((x.getDay()+6)%7))};
const DOW=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const TODAY=iso(new Date()),W0=monday(new Date()),WK0=iso(W0);
const sh=d=>d.getDate()+'/'+(d.getMonth()+1);
const fmtD=s=>{if(!s)return'';const d=parse(s);return DOW[(d.getDay()+6)%7]+' '+sh(d)};
const hm=t=>{const d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())};
const fmtTs=t=>t?hm(t)+', '+sh(new Date(t)):'';
const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
const gid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const KIND={bt:'Assignment',tl:'Discussion',tlieu:'Material'};
const TABS=[['overview','Dashboard','home'],['classroom','Classroom','book'],['projects','Projects','kanban'],['meetings','Meetings','cal'],['attendance','Attendance','check'],['discussion','Discussion','msg'],['library','Library','lib'],['papers','Publications','file'],['progress','Progress','trend']];
const IC={home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
check:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
play:'<polygon points="6 3 20 12 6 21 6 3"/>',
target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
lib:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
kanban:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/>'};
const ic=(n,z=20)=>`<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;
const MBASE=()=>({role:'Member',topic:'',sid:'',joined:Date.now(),att:{},rsvp:{}});
const PBASE={topics:{},cm:{}},RBASE={reps:{},subs:{},grades:{},fb:{},note:{}};
const S={db:null,user:null,me:null,owner:false,admin:false,asMember:false,ready:false,cfg:{},m:{},p:{},r:{},a:[],mt:[],names:{},loaded:{},tab:'overview',asg:null,thread:null,member:null,next:null,fk:'all',week:W0,month:new Date(new Date().getFullYear(),new Date().getMonth(),1)};
const T=()=>S.admin&&!S.asMember;
const joined=()=>!!(S.me&&S.m[S.me]);
const nm=u=>S.names[u]||(u&&u===S.me?'You':'Member');
const mems=()=>Object.keys(S.m).sort((a,b)=>nm(a).localeCompare(nm(b)));
const openDays=()=>Array.isArray(S.cfg.days)?S.cfg.days:[0,1,2,3,4,5];
const minDays=()=>S.cfg.minDays==null?1:Number(S.cfg.minDays);
const admins=()=>Object.values(S.prof||{}).filter(p=>p.role==='admin').map(p=>p.id);
const CFG=window.FRD_CONFIG||{};let SB=null;
const kindOf=a=>KIND[a.kind]?a.kind:'bt';
const dueTs=a=>a.due?new Date(a.due).getTime():Infinity;
const dueShort=a=>a.due?a.due.slice(8,10)+'/'+a.due.slice(5,7):'-';
const fmtDue=a=>a.due?fmtD(a.due.slice(0,10))+' at '+a.due.slice(11,16):'No deadline';
const wkCount=(u,ws)=>{const at=S.m[u]?.att||{};let n=0;for(let i=0;i<7;i++)if(at[iso(addD(ws,i))]?.in>0)n++;return n};
const isDay=k=>/^\d{4}-\d{2}-\d{2}$/.test(k);
const repsOf=u=>Object.entries(S.r[u]?.reps||{}).filter(([k,x])=>isDay(k)&&x&&typeof x==='object').sort((a,b)=>b[0].localeCompare(a[0]));
const lastPct=u=>{const e=repsOf(u)[0];return e?clamp(e[1].pct):null};
const byDT=(a,b)=>(a.date+(a.start||'')).localeCompare(b.date+(b.start||''));
const str=v=>typeof v==='string'?v:v==null?'':String(v);
const normA=(x,id)=>({...x,id,title:str(x.title),desc:str(x.desc),link:str(x.link),by:str(x.by),due:typeof x.due==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(x.due)?x.due.slice(0,16):'',pts:Number(x.pts)||10,at:Number(x.at)||0});
const normM=(x,id)=>({...x,id,title:str(x.title),place:str(x.place),link:str(x.link),agenda:str(x.agenda),date:typeof x.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)?x.date:'',start:/^\d{2}:\d{2}$/.test(str(x.start))?x.start:'',end:/^\d{2}:\d{2}$/.test(str(x.end))?x.end:''});
const mapDocs=q=>Object.fromEntries(q.docs.map(d=>[d.id,d.data()]));
const pl=(n,w)=>n+' '+(n===1?w:/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':w+'s');

let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3400)}
function fail(e){const c=e&&e.code,m=(e&&e.message)||'';
  if(c==='42501'||/row-level security|permission denied|not allowed/i.test(m))toast('Not saved: your account is not allowed to change this.');
  else if(/graded_locked/.test(m))toast('This work has been graded, so it cannot be changed. Ask the lab head to reopen it.');
  else if(c==='P0001')toast(m);
  else if(/JWT|session|refresh token/i.test(m))toast('Your session has expired. Please sign in again.');
  else if(/Failed to fetch|NetworkError|Load failed/i.test(m))toast('No connection to the lab server. Check your internet and try again.');
  else toast('Not saved: '+(m||'unknown error'))}
/* ---------- Supabase data layer ---------- */
const tsNow=()=>new Date().toISOString();
const normPhone=v=>{let d=String(v||'').replace(/[^\d+]/g,'');if(/^\d{9}$/.test(d))d='0'+d;if(/^84\d{9}$/.test(d))d='0'+d.slice(2);return d};
const memLine=u=>{const p=S.prof[u]||{};return [p.student_id,p.class_name].filter(Boolean).join(', ')};
async function q(p){const r=await p;if(r.error)throw r.error;return r.data}
async function upd(t,patch,match){const d=await q(SB.from(t).update(patch).match(match).select());if(!d||!d.length)throw{code:'42501',message:'not allowed'};return d}
const ups=(t,row,on)=>q(SB.from(t).upsert(row,{onConflict:on}).select());
const del=(t,match)=>q(SB.from(t).delete().match(match));
function W(path,patch){const p=wRoute(path,patch||{}).then(()=>reload());p.catch(fail);return p}
async function wRoute(path,patch){const[col,u]=path.split('/');
  if(col==='cfg'){const row={updated_at:tsNow()};if('minDays'in patch)row.min_days=patch.minDays;if('days'in patch)row.open_days=patch.days;if('direction'in patch)row.direction=patch.direction;if('goals'in patch)row.goals=patch.goals;if('campusOnly'in patch)row.campus_only=!!patch.campusOnly;if('nets'in patch)row.campus_nets=patch.nets;if('wifi'in patch)row.campus_wifi=patch.wifi;
    if(patch.notice){const t=patch.notice.text||'';row.notice=t;row.notice_at=t?tsNow():null;row.notice_by=t?S.me:null}return upd('settings',row,{id:1})}
  if(col==='m'){const pr={};if('role'in patch)pr.lab_role=patch.role;if('topic'in patch)pr.topic=patch.topic;if('sid'in patch)pr.student_id=String(patch.sid).trim().toUpperCase();if('cls'in patch)pr.class_name=String(patch.cls).trim().toUpperCase();if('full_name'in patch)pr.full_name=patch.full_name;
    if(Object.keys(pr).length)await upd('profiles',pr,{id:u});
    if('phone'in patch)await ups('contacts',{user_id:u,phone:normPhone(patch.phone)},'user_id');
    for(const d in patch.att||{}){const a=patch.att[d],row={user_id:u,day:d};if('reg'in a)row.booked=!!a.reg;if('in'in a)row.checked_in_at=a.in>0?tsNow():null;if('mk'in a)row.confirmed_by=a.mk?S.me:null;await ups('attendance',row,'user_id,day')}
    for(const mid in patch.rsvp||{})await ups('rsvps',{meeting_id:mid,user_id:u,status:patch.rsvp[mid]},'meeting_id,user_id');return}
  if(col==='p'){
    for(const id in patch.topics||{}){const x=patch.topics[id];if(x.del)await del('topics',{id});else await ups('topics',{id,title:x.title||'',body:x.body||''},'id')}
    for(const id in patch.cm||{}){const x=patch.cm[id];if(x.del)await del('comments',{id});else await ups('comments',{id,thread:x.th,body:x.text},'id')}
    for(const id in patch.lib||{}){const x=patch.lib[id];if(x.del)await del('library',{id});else await ups('library',{id,doi:x.doi||'',title:x.title||'',authors:x.authors||'',year:String(x.year||''),venue:x.venue||'',url:x.url||'',tags:x.tags||'',note:x.note||'',is_oa:!!x.oa},'id')}
    for(const id in patch.pubs||{}){const x=patch.pubs[id];if(x.del)await del('papers',{id});else if('title'in x)await ups('papers',{id,title:x.title,stage:x.stage||'Idea',venue:x.venue||'',coauthors:x.authors||'',deadline:x.deadline||null,link:x.link||'',note:x.note||''},'id');else await upd('papers',{stage:x.stage},{id})}
    return}
  if(col==='r'){
    for(const wk in patch.reps||{}){const x=patch.reps[wk];await ups('reports',{user_id:u,week_start:wk,done:x.done||'',next_steps:x.next||'',issues:x.issue||'',progress:clamp(x.pct),link:x.link||''},'user_id,week_start')}
    for(const aid in patch.subs||{}){const x=patch.subs[aid];await ups('submissions',{assignment_id:aid,user_id:u,body:x.text||'',link:x.link||''},'assignment_id,user_id')}
    for(const aid in patch.grades||{}){const x=patch.grades[aid];await ups('grades',{assignment_id:aid,user_id:u,score:x.score,feedback:x.fb||''},'assignment_id,user_id')}
    for(const wk in patch.fb||{})await ups('report_feedback',{user_id:u,week_start:wk,body:patch.fb[wk].text||''},'user_id,week_start');
    if(patch.note)await ups('directions',{user_id:u,body:patch.note.text||''},'user_id');return}
  throw{message:'Unknown data path '+path}}
const dbShim={doc:path=>{const[col,id]=path.split('/');return{
  set:async d=>{if(col==='a')await ups('assignments',{id,kind:KIND[d.kind]?d.kind:'bt',title:d.title||'',description:d.desc||'',link:d.link||'',due:d.due||'',points:Number(d.pts)||10},'id');
    else if(col==='mt')await ups('meetings',{id,title:d.title||'',day:d.date,start_time:d.start||'',end_time:d.end||'',place:d.place||'',link:d.link||'',agenda:d.agenda||''},'id');
    else await wRoute(path,d);await reload()},
  delete:async()=>{if(col==='a')await del('assignments',{id});else if(col==='mt')await del('meetings',{id});await reload()}}}};
async function D(fn){try{return await fn()}catch(e){fail(e);throw e}}
function busy(el,p){el.disabled=true;p.catch(()=>{}).finally(()=>{el.disabled=false})}

/* ---------- export ---------- */
// Cells that start with = + - @ tab or CR would run as formulas in Excel / Sheets: prefix them with an apostrophe.
const csvCell=v=>{const num=typeof v==='number';v=v==null?'':String(v);if(!num&&/^[=+\-@\t\r]/.test(v))v="'"+v;return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
const toCsv=rows=>'﻿'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
async function saveCsv(name,rows){
  try{const b=new Blob([toCsv(rows)],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast('Downloaded '+name)}catch(e){toast('Could not create the file.')}}
const expBtn=act=>`<button class="btn sm" data-act="${act}">Export CSV</button>`;
function expAttendance(){const ws=S.week,days=[...Array(7)].map((_,i)=>iso(addD(ws,i)));
  const rows=[['Member','Student ID','Class',...days.map((d,i)=>DOW[i]+' '+d),'Lab days','Required']];
  for(const u of mems()){const at=S.m[u].att||{};rows.push([nm(u),S.m[u].sid||'',S.m[u].cls||'',...days.map(d=>{const a=at[d]||{};return a.in>0?(a.mk?'Present (confirmed)':'Present '+hm(a.in)):a.reg?(d<TODAY?'Absent':'Booked'):''}),wkCount(u,ws),minDays()])}
  saveCsv('frd-attendance-'+iso(ws)+'.csv',rows)}
function expProgress(){const bt=S.a.filter(a=>kindOf(a)==='bt');const rows=[['Member','Student ID','Class','Email','Phone','Role','Research topic','Latest progress %','Latest report week','Reports sent','Lab days this week','Assignments submitted','Assignments total','Direction from supervisor']];
  for(const u of mems()){const m=S.m[u],r=S.r[u]||{},rs=repsOf(u);rows.push([nm(u),m.sid||'',m.cls||'',S.prof[u]?.email||'',S.contact?.[u]||'',m.role||'',m.topic||'',lastPct(u)??'',rs[0]?.[0]||'',rs.length,wkCount(u,W0),bt.filter(a=>r.subs?.[a.id]).length,bt.length,r.note?.text||''])}
  saveCsv('frd-progress-'+TODAY+'.csv',rows)}
function expLibrary(){const rows=[['Title','Authors','Year','Journal or conference','DOI','Link','Tags','Note','Added by','Added on','APA 7']];
  for(const x of libItems())rows.push([x.title,x.authors,x.year,x.venue,x.doi,x.url,x.tags,x.note,nm(x.u),x.at?iso(new Date(x.at)):'',apa(x)]);
  saveCsv('frd-library-'+TODAY+'.csv',rows)}

/* ---------- modal ---------- */
function closeM(){$('#mdl').innerHTML=''}
function modal(title,body,onOk,okLabel='Save',extra=''){
  $('#mdl').innerHTML=`<div class="ov" data-x="close"><form class="dlg" id="dlgf" novalidate><h3>${esc(title)}</h3>${body}<div class="acts">${extra}<button type="button" class="btn" data-x="close">Close</button>${onOk?`<button class="btn pri" type="submit">${esc(okLabel)}</button>`:''}</div></form></div>`;
  const f=$('#dlgf');
  f.onsubmit=async e=>{e.preventDefault();const req=[...f.querySelectorAll('[required]')].find(x=>!x.value.trim());if(req){req.focus();toast('Please fill in the required fields.');return}
    const fd={};new FormData(f).forEach((v,k)=>fd[k]=typeof v==='string'?v.trim():v);const b=f.querySelector('[type=submit]');if(b)b.disabled=true;
    try{await onOk(fd,f);if($('#dlgf')===f)closeM()}catch(err){if(b)b.disabled=false}};
  f.querySelector('input,textarea,select')?.focus()}
const ask=(title,text,fn,ok='Delete')=>modal(title,`<p>${esc(text)}</p>`,fn,ok);

/* ---------- render ---------- */
function render(){
  renderHead();
  const main=$('#main');
  if(!S.ready)return;
  const keep={};main.querySelectorAll('input[id],textarea[id],select[id]').forEach(el=>{keep[el.id]=el.value});
  const ae=document.activeElement,af=main.contains(ae)?ae.id:null;let ss=null;try{ss=ae.selectionStart}catch{}
  let html;try{html=view()}catch(err){console.error(err);html=`<section class="card"><h2>This section could not be shown</h2><p class="mute">Some saved data is in an unexpected format. Other sections still work. Detail: ${esc(err&&err.message||err)}</p></section>`}
  main.innerHTML=html;
  for(const id in keep){const el=document.getElementById(id);if(el&&main.contains(el))el.value=keep[id]}
  if(af){const el=document.getElementById(af);if(el){el.focus();try{if(ss!=null)el.setSelectionRange(ss,ss)}catch{}}}
  if(S.tab==='projects')try{pjAfter()}catch{}
}
document.addEventListener('click',e=>{const b=e.target.closest('#menu-btn');if(!b)return;const sd=document.querySelector('.side'),o=!sd.classList.contains('open');sd.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o))});
function renderHead(){
  {const cur=TABS.find(t=>t[0]===S.tab);const ml=document.getElementById('menu-cur');if(ml)ml.textContent=cur?cur[1]:''}
  $('#tabs').innerHTML=TABS.map(([k,l,i])=>`<a href="#${k}"${S.tab===k?' aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('');
  const pr=S.prof?.[S.me]||{};const role=S.admin?'Admin':(pr.lab_role||'Member');const nmMe=pr.full_name||pr.email||'';
  const ini=(nmMe.trim().split(/\s+/).map(w=>w[0]).filter(Boolean).slice(-2).join('')||'?').toUpperCase();
  $('#who').innerHTML=`<div class="u"><span class="avi" aria-hidden="true">${esc(ini)}</span><div><b>${esc(nmMe||'FRD Lab')}</b><small>${esc(role)}</small></div></div><div class="ub"><button class="btn sm" data-act="profile">Profile</button>${S.admin?'<button class="btn sm" data-act="settings">Settings</button>':''}<button class="btn sm" data-act="signout">Sign out</button></div>`}
const PH={projects:['Projects','Project boards for the lab: tasks, sub-tasks, who does what, and a timeline.'],classroom:['Classroom','Assignments, discussions and readings for the lab.'],meetings:['Meetings','The lab meeting calendar and who is coming.'],attendance:['Attendance','Book your lab days and check in when you arrive.'],discussion:['Discussion','Share ideas, ask about methods, recommend papers worth reading.'],progress:['Progress','Weekly reports, feedback and research direction.'],library:['Library','The lab\'s shared reading list. Add papers by DOI and keep notes together.'],papers:['Publications','Every lab paper from first idea to publication, in one pipeline.']};
function view(){
  const v={overview:vTong,projects:vProj,classroom:vLop,meetings:vLich,attendance:vDD,discussion:vTL,library:vLib,papers:vPubs,progress:()=>T()?vTDt():vTDm()}[S.tab];
  const ph=PH[S.tab];
  return (ph?`<header class="ph"><h1>${ph[0]}</h1><p>${ph[1]}</p></header>`:'')+(v||vTong)()}
function joinBanner(){
  if(!S.me||T()||!joined())return'';const m=S.m[S.me];if(m.topic||m.sid)return'';
  return `<div class="banner"><span>Welcome to FRD Lab. Add your student ID and research topic so the lab head can follow your work.</span><button class="btn pri" data-act="profile">Complete my profile</button></div>`}
const kpi=(v,l)=>`<div class="kpi"><b>${esc(v)}</b><span>${esc(l)}</span></div>`;

/* ---------- Dashboard ---------- */
function streak(u){const at=S.m[u]?.att||{},od=openDays();let d=new Date(),n=0;for(let i=0;i<400;i++){const ds=iso(d);if(od.includes((d.getDay()+6)%7)){if(at[ds]?.in>0)n++;else if(ds!==TODAY)break}d=addD(d,-1)}return n}
function stats(u){const m=S.m[u]||{},r=S.r[u]||{},p=S.p[u]||{};
  const days=Object.values(m.att||{}).filter(a=>a.in>0).length,subs=Object.keys(r.subs||{}).length,reps=Object.keys(r.reps||{}).length,cms=Object.values(p.cm||{}).filter(c=>!c.del).length,tps=Object.values(p.topics||{}).filter(t=>!t.del).length,st=streak(u);
  const xp=days*10+subs*20+reps*15+cms*5+tps*5;
  const all=[['First check-in',days>=1],['10 lab days',days>=10],['5-day streak',st>=5],['First report',reps>=1],['4 reports',reps>=4],['First submission',subs>=1],['Topic starter',tps>=1],['10 replies',cms>=10]];
  return{st,xp,lvl:Math.floor(xp/100)+1,all,got:all.filter(a=>a[1]).length}}
const ago=t=>{const s=(Date.now()-t)/1000;if(s>30*86400)return sh(new Date(t))+'/'+new Date(t).getFullYear();return s<60?'just now':s<3600?Math.floor(s/60)+' min ago':s<86400?pl(Math.floor(s/3600),'hour')+' ago':pl(Math.floor(s/86400),'day')+' ago'};
function feed(us){const ev=[];for(const u of us){const m=S.m[u]||{},r=S.r[u]||{},p=S.p[u]||{};
  for(const d in m.att||{}){const a=m.att[d];if(isDay(d)&&a&&a.in>0)ev.push({u,at:a.in,i:'check',c:'g',t:'Checked in',s:a.mk?'Confirmed by an admin':'Lab day '+sh(parse(d))})}
  for(const id in r.subs||{}){const x=r.subs[id],a=S.a.find(y=>y.id===id);ev.push({u,at:x.at,i:'book',c:'b',t:a?a.title:'Assignment',s:'Work submitted'})}
  for(const [k,x] of repsOf(u))ev.push({u,at:x.at,i:'trend',c:'p',t:'Weekly report',s:'Progress '+clamp(x.pct)+'%'});
  for(const id in p.cm||{}){const c=p.cm[id];if(c&&!c.del)ev.push({u,at:c.at,i:'msg',c:'y',t:'Joined a discussion',s:String(c.text||'').slice(0,60)})}}
  return ev.filter(e=>e.at).sort((a,b)=>b.at-a.at)}
function vPipe(){const ps=pubItems();const n=STAGES.map(st=>ps.filter(x=>(x.stage||'Idea')===st).length);
  return `<section class="card"><div class="bar-head"><h2>Publication pipeline</h2><a class="link" href="#papers">Open ${ic('arrow',16)}</a></div>${ps.length?STAGES.map((st,i)=>n[i]?`<div class="pct" style="margin:6px 0"><span style="width:8.5em;color:var(--text)">${esc(st)}</span><div class="bar"><i style="width:${Math.round(n[i]/ps.length*100)}%"></i></div><span>${n[i]}</span></div>`:'').join(''):'<p class="mute">No papers tracked yet.</p>'}</section>`}
function vFeed(us,many){const ev=feed(us).slice(0,6);
  return `<section class="card"><h2>Recent activity</h2>${ev.length?ev.map(e=>`<div class="actv"><span class="ic sm ${e.c}">${ic(e.i,16)}</span><div><b>${esc(e.t)}</b><small>${many?esc(nm(e.u))+': ':''}${esc(e.s)}</small><small>${ago(e.at)}</small></div></div>`).join(''):'<p class="mute">No activity yet.</p>'}</section>`}
const stat=(c,i,v,l)=>`<div class="stat"><span class="ic ${c}">${ic(i,22)}</span><div><b>${esc(v)}</b><span>${esc(l)}</span></div></div>`;
const first=n=>(n||'').trim().split(/\s+/).pop()||'';
function vNotice(){const n=S.cfg.notice;const has=n&&n.text;
  if(!has&&!T())return'';
  return `<section class="card" style="border-left:5px solid var(--b)"><div class="bar-head"><h2>${ic('msg',18)} Announcement</h2>${T()?`<button class="btn sm" data-act="notice">${has?'Edit':'Post announcement'}</button>`:''}</div>${has?`<p class="pre">${esc(n.text)}</p><small class="mute">${n.by?esc(nm(n.by))+', ':''}${fmtTs(n.at)}</small>`:'<p class="mute">No announcement. Post one to show it at the top of everyone\'s dashboard.</p>'}</section>`}
function heroAct(){const t=S.m[S.me]?.att?.[TODAY]||{},open=openDays().includes((new Date().getDay()+6)%7);
  if(!joined())return `<button class="hbtn" data-act="profile">${ic('users',18)}Complete my profile</button>`;
  if(t.in>0)return `<a class="hdone" href="#attendance">${ic('check',18)}Checked in at ${hm(t.in)}</a>`;
  if(!open)return `<span class="hdone">${ic('clock',18)}The lab is closed today</span>`;
  return `<button class="hbtn" data-act="in">${ic('check',18)}Check in now</button>`}
function quickActs(){  const today=S.m[S.me]?.att?.[TODAY]||{};
  const q=T()?[['pri','asg-new','plus','Post new work'],['','mt-new','cal','Schedule meeting'],['','#attendance','check','Mark attendance'],['','#progress','trend','Review progress']]
    :[['','#projects','kanban','My projects'],['','#progress','trend','Weekly report'],['','#discussion','msg','Join discussion'],['','#meetings','cal','Meetings']];
  return `<nav class="qas" aria-label="Quick actions">${q.map(([c,a,i,l])=>a[0]==='#'?`<a class="qa ${c}" href="${a}">${ic(i)}<span>${esc(l)}</span></a>`:`<button class="qa ${c}" data-act="${a}">${ic(i)}<span>${esc(l)}</span></button>`).join('')}</nav>`;
}
function vTong(){
  const up=S.mt.filter(x=>x.date>=TODAY).sort(byDT).slice(0,3),nmMe=S.names[S.me]||'';
  let h='';
  if(T()){const ms=mems();const pres=ms.filter(u=>S.m[u].att?.[TODAY]?.in>0).length,reg=ms.filter(u=>S.m[u].att?.[TODAY]?.reg||S.m[u].att?.[TODAY]?.in>0).length;
    let ung=0;for(const a of S.a)if(kindOf(a)==='bt')for(const u of ms){const r=S.r[u];if(r?.subs?.[a.id]&&!r?.grades?.[a.id])ung++}
    const rep=ms.filter(u=>S.r[u]?.reps?.[WK0]).length;
    h+=`<section class="hero"><div><h2>Welcome back${nmMe?', '+esc(nmMe):''}!</h2><p>Here is how FRD Lab is doing this week.</p><div class="hchips"><span class="hchip">${pl(ms.length,'member')}</span><span class="hchip">${ung} to grade</span><span class="hchip">${rep}/${ms.length} reports in</span></div></div><div class="strk">${ic('users',40)}<div><b>${pres}</b><span>in the lab today</span></div></div></section>
    ${vNotice()}<div class="stats">${stat('g','users',ms.length,'Members')}${stat('b','check',pres+'/'+reg,'In lab / booked today')}${stat('y','book',ung,'Submissions to grade')}${stat('p','trend',rep+'/'+ms.length,'Reports this week')}</div>${quickActs()}
    <div class="main2"><div>${vMyTasks(4)}<section class="card"><div class="bar-head"><h2>Member progress</h2><a class="link" href="#progress">View all ${ic('arrow',16)}</a></div>${ms.length?ms.map(u=>{const p=lastPct(u),n=wkCount(u,W0),ok=S.r[u]?.reps?.[WK0];return `<div class="prow"><span class="pi ${ok?'g':'m'}">${ic(ok?'check':'clock')}</span><div><b>${esc(nm(u))}</b><div class="pct"><div class="bar"><i style="width:${p||0}%"></i></div><span>${p==null?'no report':p+'%'}, ${n}/${minDays()} lab days</span></div></div><button class="btn sm" data-act="mem" data-u="${esc(u)}">Review</button></div>`}).join(''):'<p class="mute">No members yet. Share this page so members can join.</p>'}</section></div><div>${vFeed(ms,true)}${vPipe()}</div></div>`;
  }else{
    const g=stats(S.me),bt=S.a.filter(a=>kindOf(a)==='bt'),done=bt.filter(a=>S.r[S.me]?.subs?.[a.id]).length,lp=lastPct(S.me);
    h+=joinBanner();
    h+=`<section class="hero"><div><h2>Welcome back${nmMe?', '+esc(nmMe):''}!</h2><p>${g.st?`You're on a ${g.st}-day lab streak. Keep it going.`:'Check in when you reach the lab to start a streak.'}</p><div class="hchips"><span class="hchip">Level ${g.lvl}</span><span class="hchip">${g.xp} XP</span>${joined()?`<span class="hchip">${esc(S.m[S.me].role||'Member')}</span>`:''}</div>${heroAct()}</div><div class="strk">${ic('flame',40)}<div><b>${g.st}</b><span>Day streak</span></div></div></section>
    ${vNotice()}<div class="stats">${stat('g','check',wkCount(S.me,W0)+'/'+minDays(),'Lab days this week')}${stat('b','book',done+'/'+bt.length,'Assignments submitted')}${stat('y','trophy',g.got,'Achievements')}${stat('p','trend',(lp??0)+'%','Project progress')}</div>${quickActs()}`;
    const work=S.a.filter(a=>kindOf(a)!=='tlieu').sort((x,y)=>dueTs(x)-dueTs(y)||(y.at||0)-(x.at||0)).slice(0,4);
    h+=`<div class="main2"><div>${vMyTasks(4)}<section class="card"><div class="bar-head"><h2>Your learning</h2><a class="link" href="#classroom">View all ${ic('arrow',16)}</a></div><div class="bar-head" style="margin:0 0 4px"><b style="color:var(--ink)">Overall project progress</b><span class="mute">${lp??0}%</span></div><div class="bar"><i style="width:${lp??0}%"></i></div>
    ${work.length?work.map(a=>{const[l,c]=aStatus(a,S.me),done=c==='ok',late=c==='bad';return `<div class="prow"><span class="pi ${done?'g':late?'r':'b'}">${ic(done?'check':late?'clock':'play')}</span><div><b>${esc(a.title)}</b><small>${KIND[kindOf(a)]}, ${a.due?'due '+esc(fmtDue(a)):'no deadline'}</small></div>${done?`<span class="badge ok">${esc(l)}</span>`:`<button class="btn sm ${late?'':'dark'}" data-act="asg" data-id="${esc(a.id)}">${l==='Not submitted'||l==='Awaiting input'?'Start':'Open'}</button>`}</div>`}).join(''):'<p class="mute" style="margin-top:12px">Nothing assigned yet.</p>'}</section></div>
    <div>${vFeed(S.me?[S.me]:[],false)}<section class="card"><h2>Achievements</h2><div class="achs">${g.all.map(([n,o])=>`<span class="ach${o?'':' off'}">${ic('trophy',14)}${esc(n)}</span>`).join('')}</div><p class="mute" style="font-size:13px;margin-top:10px">XP: 10 per lab day, 20 per submission, 15 per report, 5 per reply or topic.</p></section></div></div>`;
  }
  h+=`<div class="grid2"><section class="card"><h2>Lab research direction</h2>${S.cfg.direction?`<p class="pre">${esc(S.cfg.direction)}</p>`:`<p class="mute">${T()?'No direction yet. Open Settings to write the lab\'s overall research direction.':'The lab head has not posted a research direction yet.'}</p>`}${S.cfg.goals?`<h3>Publication goals</h3><p class="pre">${esc(S.cfg.goals)}</p>`:''}</section>
  <section class="card"><div class="bar-head"><h2>Upcoming meetings</h2><a class="link" href="#meetings">Calendar ${ic('arrow',16)}</a></div>${up.length?up.map(mtRow).join(''):'<p class="mute">No upcoming meetings.</p>'}</section></div>`;
  return h}
/* ---------- Classroom ---------- */
function comments(key){const out=[];for(const u in S.p){const cm=S.p[u].cm||{};for(const id in cm){const c=cm[id];if(c&&c.th===key&&!c.del)out.push({...c,id,u})}}return out.sort((x,y)=>x.at-y.at)}
function aStatus(a,u){const k=kindOf(a);
  if(k==='tlieu')return['Material',''];
  if(k==='tl')return comments('a:'+a.id).some(c=>c.u===u)?['Joined','ok']:[Date.now()>dueTs(a)?'Not joined':'Awaiting input',Date.now()>dueTs(a)?'bad':''];
  const r=S.r[u]||{},s=r.subs?.[a.id],g=r.grades?.[a.id];
  if(g)return['Graded '+g.score+'/'+(a.pts||10),'ok'];
  if(s)return s.at>dueTs(a)?['Late','ac']:['Submitted','ok'];
  return Date.now()>dueTs(a)?['Overdue','bad']:['Not submitted','']}
function aRow(a){const k=kindOf(a);let st='';
  if(T()){if(k==='bt'){const ms=mems();st=`<span class="badge">${ms.filter(u=>S.r[u]?.subs?.[a.id]).length}/${ms.length} submitted</span>`}else if(k==='tl')st=`<span class="badge">${pl(comments('a:'+a.id).length,'reply')}</span>`}
  else if(k!=='tlieu'){const[l,c]=aStatus(a,S.me);st=`<span class="badge ${c}">${esc(l)}</span>`}
  return `<button class="row" data-act="asg" data-id="${esc(a.id)}"><span class="tm">${KIND[k]}<b>${esc(dueShort(a))}</b></span><span><b>${esc(a.title)}</b><small>${a.due?'Due '+esc(fmtDue(a)):'No deadline'}</small></span>${st}</button>`}
function vLop(){
  if(S.asg){const a=S.a.find(x=>x.id===S.asg);if(a)return vAsg(a);S.asg=null}
  const list=S.a.filter(a=>S.fk==='all'||kindOf(a)===S.fk).sort((x,y)=>(y.at||0)-(x.at||0));
  return `<div class="bar-head"><div class="filters">${[['all','All'],['bt','Assignments'],['tl','Discussions'],['tlieu','Materials']].map(([k,l])=>`<button class="f" data-act="fk" data-k="${k}" aria-pressed="${S.fk===k}">${l}</button>`).join('')}</div>${T()?'<button class="btn pri" data-act="asg-new">Post new work</button>':''}</div>
  <section class="card">${list.length?list.map(aRow).join(''):`<p class="mute">${T()?'Nothing posted yet. Use "Post new work" to set an assignment, open a discussion or share a reading.':'Nothing has been posted yet.'}</p>`}</section>`}
function vAsg(a){const k=kindOf(a);
  let h=`<button class="link" data-act="back">‹ Back to classroom</button><section class="card"><div class="bar-head"><div><span class="badge">${KIND[k]}</span><h2 style="margin-top:10px">${esc(a.title)}</h2><p class="mute">${a.due?'Due: '+esc(fmtDue(a)):'No deadline'}${k==='bt'?', marked out of '+esc(a.pts||10):''}. Posted ${fmtTs(a.at)}${a.by?' by '+esc(nm(a.by)):''}.</p></div>${T()?`<div class="filters"><button class="btn sm" data-act="asg-edit" data-id="${esc(a.id)}">Edit</button><button class="btn sm" data-act="asg-del" data-id="${esc(a.id)}">Delete</button></div>`:''}</div>${a.desc?`<p class="pre">${esc(a.desc)}</p>`:''}${a.link?`<p><a class="link" href="${safeUrl(a.link)}" target="_blank" rel="noopener">Open attached material</a></p>`:''}</section>`;
  const lp=Object.values(S.pj||{}).filter(p=>p.assignment_id===a.id);
  if(k==='bt'&&(T()||lp.length))h+=`<section class="card"><div class="bar-head"><h2>${T()?'Project boards':'Your project board'}</h2>${T()?`<button class="btn sm" data-act="pj-from-asg" data-id="${esc(a.id)}">${ic('kanban',16)}Create project</button>`:''}</div>${lp.length?lp.map(p=>`<div class="prow"><span class="pi b">${ic('kanban')}</span><div><b>${esc(p.title)}</b><small>${pl(mainT(p).length,'task')}, ${pProg(p)}% done, ${pl(Object.keys(p.members).length,'member')}</small></div><button class="btn sm" data-act="pj" data-id="${esc(p.id)}">Open board</button></div>`).join(''):'<p class="mute">Turn this assignment into a project board: pick the members, give each one a main task, then track sub-tasks and deadlines on a timeline.</p>'}</section>`;
  if(k==='bt')h+=T()?vGrade(a):vSubmit(a);
  if(k==='tl')h+=`<section class="card"><h2>Discussion</h2>${vThread('a:'+a.id)}</section>`;
  return h}
function vSubmit(a){
  if(!joined())return joinBanner()||'<section class="card"><p class="mute">Sign in and create a profile to submit work.</p></section>';
  const r=S.r[S.me]||{},s=r.subs?.[a.id],g=r.grades?.[a.id],[l,c]=aStatus(a,S.me);
  return `<section class="card"><div class="bar-head"><h2 style="margin:0">Your work</h2><span class="badge ${c}">${esc(l)}</span></div>
  ${g?`<div class="fb"><b>Grade: ${esc(g.score)}/${esc(a.pts||10)}</b>${g.fb?`<p class="pre">Feedback: ${esc(g.fb)}</p>`:''}</div>`:''}
  ${s?`<p class="mute">Last submitted ${fmtTs(s.at)}.</p>`:''}
  ${g?`${s?`<h3>Your answer</h3><p class="pre">${esc(s.text||'')}</p>`:''}<div class="acts">${s?.link?`<a class="link" href="${safeUrl(s.link)}" target="_blank" rel="noopener">Open submitted link</a>`:''}</div><p class="mute note">This work has been graded, so it is locked. Ask the lab head if it needs to be reopened.</p></section>`
  :`<label for="sb-t-${esc(a.id)}">Your answer</label><textarea id="sb-t-${esc(a.id)}" rows="6">${esc(s?.text||'')}</textarea>
  <label for="sb-l-${esc(a.id)}">Link to your work (Google Drive, GitHub, Overleaf)</label><input id="sb-l-${esc(a.id)}" value="${esc(s?.link||'')}" placeholder="https://">
  <div class="acts">${s?.link?`<a class="link" href="${safeUrl(s.link)}" target="_blank" rel="noopener">Open submitted link</a>`:''}<button class="btn pri" data-act="sub" data-id="${esc(a.id)}">${s?'Resubmit':'Submit'}</button></div></section>`}`}
function vGrade(a){const ms=mems();
  if(!ms.length)return '<section class="card"><p class="mute">No members have created a profile yet.</p></section>';
  return `<section class="card"><h2>Submissions and grading</h2><table class="stack"><thead><tr><th>Member</th><th>Status</th><th>Submission</th><th>Grade</th><th>Feedback</th><th></th></tr></thead><tbody>${ms.map(u=>{const r=S.r[u]||{},s=r.subs?.[a.id],g=r.grades?.[a.id],[l,c]=aStatus(a,u),key=esc(a.id+'-'+u);
  return `<tr><td><b>${esc(nm(u))}</b></td><td><span class="badge ${c}">${esc(l)}</span>${s?`<br><small class="mute">${fmtTs(s.at)}</small>`:''}</td><td>${s?`${s.text?`<div class="pre clip">${esc(s.text)}</div>`:''}${s.link?`<a class="link" href="${safeUrl(s.link)}" target="_blank" rel="noopener">Open link</a>`:''}`:'<span class="mute">None yet</span>'}</td><td><input id="sc-${key}" type="number" min="0" step="0.5" value="${esc(g?.score??'')}" style="width:6em" aria-label="Grade"></td><td><input id="gf-${key}" value="${esc(g?.fb||'')}" aria-label="Feedback"></td><td><button class="btn sm" data-act="grade" data-id="${esc(a.id)}" data-u="${esc(u)}">Save</button></td></tr>`}).join('')}</tbody></table></section>`}
function vThread(key){const cs=comments(key);
  return `${cs.length?cs.map(c=>`<div class="cm"><div><span class="who">${esc(nm(c.u))}</span>${c.t?' <span class="badge ac">Admin</span>':''} <span class="t">${fmtTs(c.at)}</span>${(c.u===S.me||T())?` <button class="link sm" data-act="cm-del" data-u="${esc(c.u)}" data-id="${esc(c.id)}">Delete</button>`:''}</div><div class="pre">${esc(c.text)}</div></div>`).join(''):'<p class="mute">No replies yet. Start the conversation.</p>'}
  ${S.me?`<label for="cm-${esc(key)}">Your reply</label><textarea id="cm-${esc(key)}" rows="3"></textarea><div class="acts"><button class="btn pri" data-act="cm" data-k="${esc(key)}">Post reply</button></div>`:''}`}

/* ---------- Discussion ---------- */
function topics(){const out=[];
  for(const u in S.p){const tp=S.p[u].topics||{};for(const id in tp){const t=tp[id];if(t&&!t.del)out.push({...t,key:'t:'+u+':'+id,u,id})}}
  for(const a of S.a)if(kindOf(a)==='tl')out.push({title:a.title,body:a.desc,at:a.at,key:'a:'+a.id,u:a.by,asg:a.id});
  return out.map(t=>{const cs=comments(t.key);return{...t,n:cs.length,last:cs.length?cs[cs.length-1].at:t.at}}).sort((x,y)=>(y.last||0)-(x.last||0))}
function vTL(){
  if(S.thread){const t=topics().find(x=>x.key===S.thread);
    if(t)return `<button class="link" data-act="back">‹ All topics</button><section class="card"><div class="bar-head"><div><h2>${esc(t.title)}</h2><p class="mute">${esc(nm(t.u))}, ${fmtTs(t.at)}${t.asg?'. Set by the lab head.':''}</p></div>${(!t.asg&&(t.u===S.me||T()))?`<button class="btn sm" data-act="tp-del" data-u="${esc(t.u)}" data-id="${esc(t.id)}">Delete topic</button>`:''}</div>${t.body?`<p class="pre">${esc(t.body)}</p>`:''}</section><section class="card">${vThread(t.key)}</section>`;
    S.thread=null}
  const ts=topics();
  return `<div class="bar-head"><span></span>${S.me?'<button class="btn pri" data-act="tp-new">New topic</button>':''}</div><section class="card">${ts.length?ts.map(t=>`<button class="row" data-act="th" data-k="${esc(t.key)}"><span class="tm">${t.asg?'Set by head':'Topic'}<b>${t.last?sh(new Date(t.last)):'-'}</b></span><span><b>${esc(t.title)}</b><small>${esc(nm(t.u))}${t.last?', last activity '+fmtTs(t.last):''}</small></span><span class="badge">${pl(t.n,'reply')}</span></button>`).join(''):'<p class="mute">No discussion topics yet.</p>'}</section>`}

/* ---------- Meetings ---------- */
function mtRow(x){const yes=Object.values(S.m).filter(m=>m.rsvp?.[x.id]==='yes').length,my=S.m[S.me]?.rsvp?.[x.id];
  const b=T()?`<span class="badge">${yes} attending</span>`:!joined()?'':my?`<span class="badge ${my==='yes'?'ok':'bad'}">${my==='yes'?'Attending':'Absent'}</span>`:'<span class="badge ac">No reply yet</span>';
  return `<button class="row" data-act="mt" data-id="${esc(x.id)}"><span class="tm">${fmtD(x.date)}<b>${esc(x.start||'--:--')}</b></span><span><b>${esc(x.title)}</b><small>${esc(x.place||'No location set')}${x.end?', until '+esc(x.end):''}</small></span>${b}</button>`}
function vLich(){
  const m0=S.month,st=monday(m0),off=(m0.getDay()+6)%7,dim=new Date(m0.getFullYear(),m0.getMonth()+1,0).getDate(),n=Math.ceil((off+dim)/7)*7;
  let cells='';for(let i=0;i<n;i++){const d=addD(st,i),ds=iso(d),ms=S.mt.filter(x=>x.date===ds).sort(byDT),rc=Object.values(S.m).filter(x=>x.att?.[ds]?.reg).length;
    cells+=`<div class="cell${d.getMonth()!==m0.getMonth()?' out':''}${ds===TODAY?' today':''}"${T()?` data-act="day" data-d="${ds}" title="Schedule a meeting on ${sh(d)}"`:''}><span class="dn">${d.getDate()}</span>${ms.map(x=>`<button class="chip" data-act="mt" data-id="${esc(x.id)}" title="${esc(x.title)}">${esc(x.start||'')} ${esc(x.title)}</button>`).join('')}${rc?`<span class="rc">${rc} in lab</span>`:''}</div>`}
  const up=S.mt.filter(x=>x.date>=TODAY).sort(byDT);
  return `<div class="bar-head"><div class="filters"><button class="btn sm" data-act="mon" data-n="-1" aria-label="Previous month">‹</button><h2 style="margin:0 6px">${MON[m0.getMonth()]} ${m0.getFullYear()}</h2><button class="btn sm" data-act="mon" data-n="1" aria-label="Next month">›</button><button class="btn sm" data-act="mon" data-n="0">This month</button></div>${T()?'<button class="btn pri" data-act="mt-new">Schedule meeting</button>':''}</div>
  <section class="card"><div class="cal">${DOW.map(d=>`<div class="h">${d}</div>`).join('')}${cells}</div><p class="mute" style="margin-top:10px">Blue tags are meetings. The turquoise count shows how many members booked the lab that day.${T()?' Click a day to schedule a meeting.':''}</p></section>
  <section class="card"><h2>Upcoming meetings</h2>${up.length?up.map(mtRow).join(''):'<p class="mute">No upcoming meetings.</p>'}</section>`}
function mtOpen(id){const x=S.mt.find(m=>m.id===id);if(!x)return;
  const ys=mems().filter(u=>S.m[u].rsvp?.[id]==='yes'),ns=mems().filter(u=>S.m[u].rsvp?.[id]==='no'),my=S.m[S.me]?.rsvp?.[id];
  modal(x.title,`<p><b>${fmtD(x.date)}</b>${x.start?', '+esc(x.start):''}${x.end?' to '+esc(x.end):''}</p>${x.place?`<p>Location: ${esc(x.place)}</p>`:''}${x.link?`<p><a class="link" href="${safeUrl(x.link)}" target="_blank" rel="noopener">Join online</a></p>`:''}${x.agenda?`<h3>Agenda</h3><p class="pre">${esc(x.agenda)}</p>`:''}<h3>Replies</h3><p>Attending (${ys.length}): ${ys.map(u=>esc(nm(u))).join(', ')||'none yet'}</p><p>Absent (${ns.length}): ${ns.map(u=>esc(nm(u))).join(', ')||'none yet'}</p>`,null,'',
  (joined()&&!T()?`<button type="button" class="btn${my==='yes'?' pri':''}" data-act="rsvp" data-id="${esc(id)}" data-v="yes">I'll attend</button><button type="button" class="btn${my==='no'?' pri':''}" data-act="rsvp" data-id="${esc(id)}" data-v="no">Can't attend</button>`:'')+(T()?`<button type="button" class="btn" data-act="mt-edit" data-id="${esc(id)}">Edit</button><button type="button" class="btn" data-act="mt-del" data-id="${esc(id)}">Delete</button>`:''))}
function mtForm(x,date){x=x||{};
  modal(x.id?'Edit meeting':'Schedule meeting',`<label for="f-t">Title</label><input id="f-t" name="title" required value="${esc(x.title||'Weekly lab meeting')}"><div class="two"><div><label for="f-d">Date</label><input id="f-d" type="date" name="date" required value="${esc(x.date||date||TODAY)}"></div><div><label for="f-p">Location</label><input id="f-p" name="place" value="${esc(x.place||'')}" placeholder="Lab room, floor..."></div><div><label for="f-s">Start</label><input id="f-s" type="time" name="start" value="${esc(x.start||'14:00')}"></div><div><label for="f-e">End</label><input id="f-e" type="time" name="end" value="${esc(x.end||'16:00')}"></div></div><label for="f-l">Online meeting link</label><input id="f-l" name="link" value="${esc(x.link||'')}" placeholder="https://"><label for="f-a">Agenda</label><textarea id="f-a" name="agenda" rows="4">${esc(x.agenda||'')}</textarea>`,
  async fd=>{const id=x.id||gid();await D(()=>S.db.doc('mt/'+id).set({...fd,by:x.by||S.me,at:x.at||Date.now()}));toast('Meeting saved.')})}

/* ---------- Attendance ---------- */
// School Wi-Fi rule: the server decides from the caller's public IP; the browser only shows the status.
const wifiName=()=>S.cfg.wifi||'school Wi-Fi';
const offMsg=()=>`Check-in works only on the school Wi-Fi (${wifiName()}). Connect to it, then press Check in again.`;
async function campusCheck(force){const c=S.campus;if(!force&&c&&Date.now()-c.t<60000)return c;
  try{const{data,error}=await SB.rpc('campus_status');if(error)throw error;S.campus={...data,t:Date.now()}}catch(e){S.campus={ok:!S.cfg.campusOnly,required:!!S.cfg.campusOnly,ip:'',err:true,t:Date.now()}}
  return S.campus}
function campusBar(){if(!S.cfg.campusOnly)return'';const c=S.campus;
  if(!c||Date.now()-c.t>60000){if(!S.campusP){S.campusP=1;campusCheck(true).finally(()=>{S.campusP=0;if(S.tab==='attendance'||S.tab==='overview')render()})}return `<p class="net">Checking your network…</p>`}
  return c.ok?`<p class="net ok">You are on the school network (${esc(wifiName())}), so you can check in.</p>`
    :`<p class="net bad">You are not on the school Wi-Fi. Connect to <b>${esc(wifiName())}</b> to check in. Booking days works from anywhere.${c.ip?` <span class="mute">Your network: ${esc(c.ip)}</span>`:''} <button type="button" class="link" data-act="net-re">Check again</button></p>`}
function vDD(){
  const ws=S.week,days=[...Array(7)].map((_,i)=>iso(addD(ws,i))),od=openDays(),need=minDays();
  const nav=`<div class="filters"><button class="btn sm" data-act="wk" data-n="-1" aria-label="Previous week">‹</button><h2 style="margin:0 6px">Week ${sh(ws)} to ${sh(addD(ws,6))}</h2><button class="btn sm" data-act="wk" data-n="1" aria-label="Next week">›</button>${iso(ws)!==WK0?'<button class="btn sm" data-act="wk" data-n="0">This week</button>':''}</div>`;
  if(T()){const ms=mems();
    if(!ms.length)return `<div class="bar-head">${nav}</div><section class="card"><p class="mute">No members have created a profile yet.</p></section>`;
    return `<div class="bar-head">${nav}<span class="filters"><span class="mute">Minimum ${pl(need,'lab day')} per week.</span>${expBtn('exp-att')}</span></div><section class="card"><div class="scroll"><table><thead><tr><th>Member</th>${days.map((d,i)=>`<th class="${d===TODAY?'tdy':''}">${DOW[i]} ${sh(parse(d))}</th>`).join('')}<th class="num">Total</th></tr></thead><tbody>${ms.map(u=>{const at=S.m[u].att||{},n=wkCount(u,ws);
      return `<tr><td><b>${esc(nm(u))}</b></td>${days.map((d,i)=>{const a=at[d]||{};let t='·',c='';if(a.in>0){t=a.mk?'Yes':hm(a.in);c='in'}else if(a.reg&&d<TODAY){t='Absent';c='ab'}else if(a.reg){t='Booked';c='rg'}
        return `<td><button class="mk ${c}" data-act="mark" data-u="${esc(u)}" data-d="${d}" aria-label="${esc(nm(u))}, ${DOW[i]} ${sh(parse(d))}: ${t}${od.includes(i)?'':' (lab closed)'}">${t}</button></td>`}).join('')}<td class="num"><span class="badge ${n>=need?'ok':'bad'}">${n}/${need}</span></td></tr>`}).join('')}</tbody></table></div><p class="mute">A time is when the member checked in themselves. "Yes" means an admin confirmed it. Click a cell to confirm or remove attendance.</p></section>`}
  if(!joined())return `<div class="bar-head">${nav}</div>${joinBanner()}`;
  const at=S.m[S.me].att||{},n=wkCount(S.me,ws);
  return `<div class="bar-head">${nav}<span class="badge ${n>=need?'ok':'ac'}">${n}/${need} required lab days</span></div>
  <p class="mute">Book the days you plan to come in, then press Check in when you arrive. You can only check in for today.</p>${campusBar()}
  <div class="week">${days.map((d,i)=>{const a=at[d]||{},cl=!od.includes(i),past=d<TODAY,today=d===TODAY;let st,c='';
    if(a.in>0){st='Present '+(a.mk?'(confirmed)':hm(a.in));c='ok'}else if(a.reg&&past){st='Absent';c='bad'}else if(a.reg){st='Booked';c='ac'}else st=cl?'Lab closed':past?'Not in lab':'Not booked';
    let b='';if(!cl&&!past&&!(a.in>0))b+=`<button class="btn sm" data-act="reg" data-d="${d}">${a.reg?'Cancel booking':'Book this day'}</button>`;
    if(today&&!cl)b+=a.in>0?(a.mk?'':`<button class="btn sm" data-act="unin" data-d="${d}">Undo check-in</button>`):'<button class="btn sm pri" data-act="in">Check in</button>';
    return `<div class="day${cl?' closed':''}${today?' today':''}"><div><b>${today?'Today':DOW[i]}</b> <span class="mute">${sh(parse(d))}</span></div><span class="badge ${c}">${st}</span>${b}</div>`}).join('')}</div>`}

/* ---------- Progress ---------- */
function repCard(u,k,x,tc){const fb=S.r[u]?.fb?.[k],ws=parse(k),id=esc(u+'-'+k);
  return `<div class="cm"><div class="bar-head" style="margin:0"><b>Week ${sh(ws)} to ${sh(addD(ws,6))}</b><span class="mute">${fmtTs(x.at)}</span></div><div class="pct"><div class="bar"><i style="width:${clamp(x.pct)}%"></i></div><span>Progress ${clamp(x.pct)}%</span></div>
  ${x.done?`<h3>Done this week</h3><p class="pre">${esc(x.done)}</p>`:''}${x.next?`<h3>Plan for next week</h3><p class="pre">${esc(x.next)}</p>`:''}${x.issue?`<h3>Blockers</h3><p class="pre">${esc(x.issue)}</p>`:''}${x.link?`<p><a class="link" href="${safeUrl(x.link)}" target="_blank" rel="noopener">Attached link</a></p>`:''}
  ${tc?`<label for="fb-${id}">Feedback and direction on this report</label><textarea id="fb-${id}" rows="2">${esc(fb?.text||'')}</textarea><div class="acts">${fb?.at?`<span class="mute">Sent ${fmtTs(fb.at)}</span>`:''}<button class="btn sm pri" data-act="fb" data-u="${esc(u)}" data-k="${k}">Send feedback</button></div>`:fb?.text?`<div class="fb"><b>Feedback:</b> <span class="pre">${esc(fb.text)}</span></div>`:''}</div>`}
function vTDm(){
  if(!joined())return joinBanner()||'<section class="card"><p class="mute">Sign in to send progress reports.</p></section>';
  const r=S.r[S.me]||{},cur=r.reps?.[WK0]||{},reps=repsOf(S.me),lp=lastPct(S.me);
  return `${r.note?.text?`<section class="card"><h2>Direction from your supervisor</h2><p class="pre">${esc(r.note.text)}</p><p class="mute">Updated ${fmtTs(r.note.at)}</p></section>`:''}
  <section class="card"><h2>Report for week ${sh(W0)} to ${sh(addD(W0,6))}</h2>${cur.at?`<p class="mute">Sent ${fmtTs(cur.at)}. You can update it until Sunday.</p>`:'<p class="mute">One report per week. Your supervisor reads it and replies on the report.</p>'}
  <label for="rp-d">What you did this week</label><textarea id="rp-d" rows="3">${esc(cur.done||'')}</textarea>
  <label for="rp-n">Plan for next week</label><textarea id="rp-n" rows="3">${esc(cur.next||'')}</textarea>
  <label for="rp-i">Blockers, help needed</label><textarea id="rp-i" rows="2">${esc(cur.issue||'')}</textarea>
  <div class="two"><div><label for="rp-p">Project progress (%)</label><input id="rp-p" type="number" min="0" max="100" value="${esc(cur.pct??lp??'')}"></div><div><label for="rp-l">Link to draft or data</label><input id="rp-l" value="${esc(cur.link||'')}" placeholder="https://"></div></div>
  <div class="acts"><button class="btn pri" data-act="rep">${cur.at?'Update report':'Send weekly report'}</button></div></section>
  <section class="card"><h2>Report history</h2>${reps.length?reps.map(([k,x])=>repCard(S.me,k,x,false)).join(''):'<p class="mute">No reports yet.</p>'}</section>`}
function vTDt(){
  if(S.member&&S.m[S.member])return vMem(S.member);
  const ms=mems(),bt=S.a.filter(a=>kindOf(a)==='bt');
  return `<section class="card"><div class="bar-head"><h2>Member progress</h2>${ms.length?expBtn('exp-prog'):''}</div>${ms.length?`<table class="stack"><thead><tr><th>Member</th><th>Research topic</th><th>Progress</th><th>Latest report</th><th class="num">Lab days this week</th><th class="num">Work submitted</th><th></th></tr></thead><tbody>${ms.map(u=>{const m=S.m[u],r=S.r[u]||{},lk=repsOf(u)[0]?.[0],p=lastPct(u),sub=bt.filter(a=>r.subs?.[a.id]).length,n=wkCount(u,W0);
  return `<tr><td><b>${esc(nm(u))}</b><br><small class="mute">${esc([m.role||'Member',m.sid,m.cls].filter(Boolean).join(', '))}</small></td><td>${esc(m.topic||'Not set')}</td><td><div class="pct"><div class="bar"><i style="width:${p||0}%"></i></div><span>${p==null?'-':p+'%'}</span></div></td><td>${lk?(lk===WK0?'<span class="badge ok">This week</span>':'Week of '+sh(parse(lk))):'<span class="badge bad">None</span>'}</td><td class="num">${n}/${minDays()}</td><td class="num">${sub}/${bt.length}</td><td><button class="btn sm" data-act="mem" data-u="${esc(u)}">Review</button></td></tr>`}).join('')}</tbody></table>`:'<p class="mute">No members have created a profile yet. Share this page with lab members so they can join.</p>'}</section>`}
function vMem(u){const m=S.m[u],r=S.r[u]||{},reps=repsOf(u),bt=S.a.filter(a=>kindOf(a)==='bt').sort((a,b)=>(b.at||0)-(a.at||0));
  return `<button class="link" data-act="back">‹ All members</button><section class="card"><h2>${esc(nm(u))}</h2><p class="mute">${esc(m.role||'Member')}${m.sid?', student ID '+esc(m.sid):''}${m.cls?', class '+esc(m.cls):''}${m.joined?', joined '+fmtTs(m.joined):''}</p><p class="mute">${esc(S.prof[u]?.email||'')}${S.contact?.[u]?' · '+esc(S.contact[u]):''}</p><p><b>Research topic:</b> ${esc(m.topic||'Not set')}</p>
  <label for="dh-${esc(u)}">Your direction for this member</label><textarea id="dh-${esc(u)}" rows="4">${esc(r.note?.text||'')}</textarea><div class="acts">${r.note?.at?`<span class="mute">Updated ${fmtTs(r.note.at)}</span>`:''}<button class="btn pri" data-act="dh" data-u="${esc(u)}">Save direction</button></div></section>
  <div class="grid2"><section class="card"><h2>Progress reports</h2>${reps.length?reps.map(([k,x])=>repCard(u,k,x,true)).join(''):'<p class="mute">No reports sent yet.</p>'}</section>
  <section class="card"><h2>Assignments</h2>${bt.length?bt.map(a=>{const[l,c]=aStatus(a,u);return `<button class="row" data-act="asg" data-id="${esc(a.id)}"><span class="tm">Due<b>${esc(dueShort(a))}</b></span><span><b>${esc(a.title)}</b></span><span class="badge ${c}">${esc(l)}</span></button>`}).join(''):'<p class="mute">No assignments posted yet.</p>'}
  <h3>Lab days, last 4 weeks</h3><div class="plist">${[0,1,2,3].map(i=>{const ws=addD(W0,-7*i),n=wkCount(u,ws);return `<p><span>Week of ${sh(ws)}</span><span class="badge ${n>=minDays()?'ok':'bad'}">${n}/${minDays()} days</span></p>`}).join('')}</div></section></div>`}

/* ---------- Library ---------- */
const normDoi=x=>{const m=String(x||'').match(/10\.\d{4,9}\/[^\s"<>]+/);return m?m[0].replace(/[.,;)\]]+$/,''):''};
function libItems(){const out=[];for(const u in S.p){const L=S.p[u].lib||{};for(const id in L){const x=L[id];if(x&&!x.del)out.push({...x,id,u})}}return out.sort((a,b)=>(b.at||0)-(a.at||0))}
function apaName(n){n=n.trim();if(!n||/et al\.?$/i.test(n))return n;let fam,giv;if(n.includes(',')){const k=n.indexOf(',');fam=n.slice(0,k).trim();giv=n.slice(k+1).trim()}else{const w=n.split(/\s+/);fam=w.pop();giv=w.join(' ')}
  const ini=(giv||'').split(/[\s.]+/).filter(Boolean).map(x=>x.split('-').map(y=>y[0].toUpperCase()+'.').join('-')).join(' ');return ini?fam+', '+ini:fam}
function apa(x){let as=String(x.authors||'').split(/;|\band\b|&/).map(apaName).filter(Boolean);if(as.length>20)as=[...as.slice(0,19),'. . . '+as[as.length-1]];let au=as.length>1?as.slice(0,-1).join(', ')+', & '+as[as.length-1]:as[0]||'';au=au.replace(/, & (et al\.?)$/i,', $1');
  return `${au?au+' ':''}(${x.year||'n.d.'}). ${x.title||'Untitled'}.${x.venue?' '+x.venue+'.':''}${x.doi?' https://doi.org/'+x.doi:x.url?' '+x.url:''}`}
const sciteOk=()=>true;
const MAILTO=CFG.contactEmail?'mailto='+encodeURIComponent(CFG.contactEmail):'';
const crName=a=>a.family?(a.given?a.family+', '+a.given:a.family):(a.name||'');
function crToItem(m){return{doi:String(m.DOI||'').toLowerCase(),title:(m.title||[''])[0]||'',authors:(m.author||[]).map(crName).filter(Boolean).join('; '),year:String(m.issued?.['date-parts']?.[0]?.[0]||m.published?.['date-parts']?.[0]?.[0]||''),venue:(m['container-title']||[''])[0]||'',url:m.URL||'',oa:false}}
function hitToItem(h){return{doi:(h.doi||'').toLowerCase(),title:h.title||'',authors:(h.authors||[]).map(a=>a.authorName).join('; ')+((h.authors||[]).length>=3?'; et al.':''),year:h.year?String(h.year):'',venue:h.journal||'',url:h.access?.url||'',oa:!!h.isOa,abstract:h.abstract||''}}
const libField=(id,l,v,ph='')=>`<div><label for="${id}">${l}</label><input id="${id}" value="${esc(v||'')}" placeholder="${esc(ph)}"></div>`;
function vLib(){const items=libItems(),q=(S.lq||'').toLowerCase(),list=q?items.filter(x=>[x.title,x.authors,x.venue,x.doi,x.tags,x.note].join(' ').toLowerCase().includes(q)):items;
  let h='';
  if(S.me)h+=`<section class="card"><h2>Add a paper</h2><label for="lb-doi">DOI</label><div class="filters" style="flex-wrap:nowrap"><input id="lb-doi" placeholder="10.xxxx/xxxxx or https://doi.org/..."><button class="btn" data-act="lib-fill" style="flex:none">${ic('search',16)}Fill from DOI</button></div><div class="two">${libField('lb-t','Title','')}${libField('lb-a','Authors (separate with ;)','')}${libField('lb-y','Year','')}${libField('lb-v','Journal or conference','')}${libField('lb-u','Link (PDF or page)','','https://')}${libField('lb-g','Tags','','fintech, survey, method')}</div><label for="lb-n">Why it matters for the lab</label><textarea id="lb-n" rows="2"></textarea><div class="acts"><span class="mute note">Details come from Crossref, the free DOI registry.</span><button class="btn pri" data-act="lib-save">Save to library</button></div></section>`;
  if(S.me&&sciteOk())h+=`<section class="card"><h2>Search the literature (Crossref)</h2><div class="filters" style="flex-wrap:nowrap"><input id="lb-q2" placeholder="e.g. blockchain credit scoring SMEs"><button class="btn dark" data-act="lib-search" style="flex:none">${ic('search',16)}Search</button></div>${S.sr?(S.sr.length?S.sr.map((x,i)=>`<div class="prow"><span class="pi b">${ic('file')}</span><div><b>${esc(x.title)}</b><small>${esc(x.authors)}${x.year?' ('+esc(x.year)+')':''}${x.venue?'. '+esc(x.venue):''}${x.doi?'. '+esc(x.doi):''}</small></div><button class="btn sm" data-act="lib-add" data-k="${i}">Add</button></div>`).join(''):'<p class="mute">No results. Try other keywords.</p>'):''}</section>`;
  h+=`<section class="card"><div class="bar-head"><h2>Reading list (${items.length})</h2><div class="filters"><input id="lb-filter" placeholder="Filter by title, author, tag" style="width:min(300px,100%)" value="${esc(S.lq||'')}">${items.length?expBtn('exp-lib'):''}</div></div>${list.length?list.map(x=>{const own=x.u===S.me||T();return `<div class="cm"><div class="bar-head" style="margin:0;align-items:flex-start"><div style="flex:1 1 320px"><b style="color:var(--ink)">${esc(x.title||'Untitled')}</b><div class="mute" style="font-size:14px">${esc(x.authors||'')}${x.year?' ('+esc(x.year)+')':''}${x.venue?'. '+esc(x.venue):''}</div></div><div class="filters"><button class="btn sm" data-act="lib-copy" data-u="${esc(x.u)}" data-id="${esc(x.id)}">Copy APA</button>${own?`<button class="btn sm" data-act="lib-del" data-u="${esc(x.u)}" data-id="${esc(x.id)}">Remove</button>`:''}</div></div>
    <div class="filters" style="margin-top:6px">${x.doi?`<a class="link sm" href="https://doi.org/${encodeURI(x.doi)}" target="_blank" rel="noopener">DOI ${esc(x.doi)}</a>`:''}${x.url?`<a class="link sm" href="${safeUrl(x.url)}" target="_blank" rel="noopener">${x.oa?'Open access copy':'Link'}</a>`:''}<a class="link sm" href="https://scholar.google.com/scholar?q=${encodeURIComponent(x.doi||x.title||'')}" target="_blank" rel="noopener">Google Scholar</a><a class="link sm" href="https://www.semanticscholar.org/search?q=${encodeURIComponent(x.title||x.doi||'')}" target="_blank" rel="noopener">Semantic Scholar</a></div>
    ${x.tags?`<div class="filters" style="margin-top:6px">${String(x.tags).split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<span class="badge ac">${esc(t)}</span>`).join('')}</div>`:''}${x.note?`<div class="fb pre">${esc(x.note)}</div>`:''}<small class="mute">Added by ${esc(nm(x.u))}, ${fmtTs(x.at)}</small></div>`}).join(''):`<p class="mute">${q?'No papers match that filter.':'The reading list is empty. Add the first paper above.'}</p>`}</section>`;
  return h}
async function libFill(btn){const doi=normDoi(val('lb-doi'));if(!doi){toast('Enter a valid DOI, for example 10.1038/nature12373.');return}
  btn.disabled=true;try{const r=await fetch('https://api.crossref.org/works/'+doi.split('/').map(encodeURIComponent).join('/')+(MAILTO?'?'+MAILTO:''));
    if(r.status===404){toast('No record for that DOI in Crossref. Check it or type the details in.');return}if(!r.ok)throw new Error('Crossref '+r.status);
    const x=crToItem((await r.json()).message||{});
    if(CFG.contactEmail){try{const u=await fetch('https://api.unpaywall.org/v2/'+encodeURIComponent(doi)+'?email='+encodeURIComponent(CFG.contactEmail));if(u.ok){const j=await u.json(),b=j.best_oa_location;if(b){x.url=b.url_for_pdf||b.url||x.url;x.oa=true}}}catch{}}
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v};set('lb-doi',x.doi||doi);set('lb-t',x.title);set('lb-a',x.authors);set('lb-y',x.year);set('lb-v',x.venue);set('lb-u',x.url);S.fillOa=x.oa;toast(x.oa?'Details filled from Crossref, with an open access link.':'Details filled from Crossref. Check them, then save.')}
  catch(e){toast('Crossref is not answering right now. Try again or type the details in.')}finally{btn.disabled=false}}
async function libSearch(btn){const qq=val('lb-q2');if(!qq)return;btn.disabled=true;
  try{const r=await fetch('https://api.crossref.org/works?rows=10&select=DOI,title,author,issued,container-title,URL&query.bibliographic='+encodeURIComponent(qq)+(MAILTO?'&'+MAILTO:''));if(!r.ok)throw new Error('Crossref '+r.status);
    S.sr=((await r.json()).message?.items||[]).map(crToItem).filter(x=>x.title);render()}catch(e){toast('Crossref search is not answering right now. Try again shortly.')}finally{btn.disabled=false}}
function libSave(x){const dup=x.doi&&libItems().find(y=>y.doi&&y.doi.toLowerCase()===x.doi.toLowerCase());if(dup){toast('That DOI is already in the library (added by '+nm(dup.u)+').');return Promise.reject()}
  return W('p/'+S.me,{lib:{[gid()]:{...x,at:Date.now()}}},PBASE)}

/* ---------- Publications ---------- */
const STAGES=['Idea','Literature review','Data collection','Analysis','Writing','Submitted','Under review','Revision','Accepted','Published'];
function pubItems(){const out=[];for(const u in S.p){const L=S.p[u].pubs||{};for(const id in L){const x=L[id];if(x&&!x.del)out.push({...x,id,u})}}return out}
const daysTo=d=>Math.round((parse(d)-parse(TODAY))/864e5);
function vPubs(){const ps=pubItems(),by=STAGES.map(st=>ps.filter(x=>(x.stage||'Idea')===st));
  let h=`<div class="bar-head"><div class="filters">${STAGES.map((st,i)=>`<span class="badge${by[i].length?' ac':''}">${esc(st)} ${by[i].length}</span>`).join('')}</div>${S.me?'<button class="btn pri" data-act="pub-new">New paper</button>':''}</div>`;
  if(!ps.length)return h+`<section class="card"><p class="mute">No papers tracked yet. Add each paper the lab is working on, from a first idea to accepted work, so everyone can see where it stands.</p></section>`;
  STAGES.forEach((st,i)=>{if(!by[i].length)return;h+=`<section class="card"><h2>${esc(st)} <span class="mute" style="font-weight:400">${by[i].length}</span></h2>${by[i].sort((a,b)=>(a.deadline||'9').localeCompare(b.deadline||'9')).map(x=>{const own=x.u===S.me||T(),dl=x.deadline?daysTo(x.deadline):null;
    return `<div class="prow"><span class="pi ${st==='Published'||st==='Accepted'?'g':'b'}">${ic('file')}</span><div><b>${esc(x.title)}</b><small>Lead: ${esc(nm(x.u))}${x.authors?', with '+esc(x.authors):''}${x.venue?'. Target: '+esc(x.venue):''}</small>${x.deadline?`<small><span class="badge ${dl<0?'bad':dl<=14?'ac':''}">${dl<0?pl(-dl,'day')+' overdue':dl===0?'Due today':pl(dl,'day')+' left'}</span> deadline ${fmtD(x.deadline)}</small>`:''}${x.link?`<small><a class="link sm" href="${safeUrl(x.link)}" target="_blank" rel="noopener">Open draft</a></small>`:''}</div>
    <div class="filters">${own?`<select data-stage="1" data-u="${esc(x.u)}" data-id="${esc(x.id)}" aria-label="Stage" style="width:auto;padding:6px 8px;font-size:14px">${STAGES.map(s2=>`<option${s2===st?' selected':''}>${s2}</option>`).join('')}</select><button class="btn sm" data-act="pub-edit" data-u="${esc(x.u)}" data-id="${esc(x.id)}">Edit</button>`:''}</div></div>`}).join('')}</section>`});
  return h}
function pubForm(x){x=x||{};const u=x.u||S.me;
  modal(x.id?'Edit paper':'New paper',`<label for="f-t">Working title</label><input id="f-t" name="title" required value="${esc(x.title||'')}"><div class="two"><div><label for="f-st">Stage</label><select id="f-st" name="stage">${STAGES.map(s2=>`<option${(x.stage||'Idea')===s2?' selected':''}>${s2}</option>`).join('')}</select></div><div><label for="f-dl">Next deadline</label><input id="f-dl" type="date" name="deadline" value="${esc(x.deadline||'')}"></div></div><label for="f-v">Target journal or conference</label><input id="f-v" name="venue" value="${esc(x.venue||'')}"><label for="f-co">Co-authors</label><input id="f-co" name="authors" value="${esc(x.authors||'')}" placeholder="Names, separated by commas"><label for="f-l">Draft link (Overleaf, Google Docs)</label><input id="f-l" name="link" value="${esc(x.link||'')}" placeholder="https://"><label for="f-n">Notes</label><textarea id="f-n" name="note" rows="3">${esc(x.note||'')}</textarea>`,
  async fd=>{await W('p/'+u,{pubs:{[x.id||gid()]:{...fd,at:x.at||Date.now(),upd:Date.now()}}},PBASE);toast('Paper saved.')},'Save',x.id?`<button type="button" class="btn" data-act="pub-del" data-u="${esc(u)}" data-id="${esc(x.id)}">Delete</button>`:'')}

/* ---------- forms ---------- */
function asgForm(a){a=a||{};
  modal(a.id?'Edit post':'Post new work',`<label for="f-k">Type</label><select id="f-k" name="kind">${Object.entries(KIND).map(([k,l])=>`<option value="${k}"${kindOf(a)===k&&a.id?' selected':''}>${l}</option>`).join('')}</select><label for="f-t">Title</label><input id="f-t" name="title" required value="${esc(a.title||'')}"><div class="two"><div><label for="f-due">Deadline</label><input id="f-due" type="datetime-local" name="due" value="${esc(a.due||'')}"></div><div><label for="f-pt">Marked out of (assignments)</label><input id="f-pt" type="number" min="1" name="pts" value="${esc(a.pts||10)}"></div></div><label for="f-l">Material link</label><input id="f-l" name="link" value="${esc(a.link||'')}" placeholder="https://"><label for="f-ds">Description and requirements</label><textarea id="f-ds" name="desc" rows="6">${esc(a.desc||'')}</textarea>`,
  async fd=>{const id=a.id||gid();await D(()=>S.db.doc('a/'+id).set({...fd,pts:Number(fd.pts)||10,by:a.by||S.me,at:a.at||Date.now()}));toast(a.id?'Post updated.':'Posted to the lab.')},a.id?'Save':'Post')}
function topicForm(){modal('New discussion topic',`<label for="f-t">Title</label><input id="f-t" name="title" required><label for="f-b">Details</label><textarea id="f-b" name="body" rows="5"></textarea>`,
  async fd=>{const id=gid();await W('p/'+S.me,{topics:{[id]:{title:fd.title,body:fd.body,at:Date.now()}}},PBASE);S.next=null;S.thread='t:'+S.me+':'+id;render()},'Post')}
function profForm(){const p=S.prof[S.me]||{},mem=!S.admin;
  modal('My profile',`<label for="f-fn">Full name</label><input id="f-fn" name="full_name" required value="${esc(p.full_name||'')}"><p class="mute" style="font-size:13px;margin:4px 0 0">Signed in as ${esc(p.email||S.email||'')}</p>${mem?`<div class="two"><div><label for="f-sid">Student ID</label><input id="f-sid" name="sid" value="${esc(p.student_id||'')}"></div><div><label for="f-cls">Class</label><input id="f-cls" name="cls" value="${esc(p.class_name||'')}" placeholder="e.g. CO1501"></div></div>`:''}<label for="f-ph">Phone</label><input id="f-ph" name="phone" type="tel" value="${esc(S.contact?.[S.me]||'')}"><p class="mute" style="font-size:13px;margin:4px 0 0">Only you and the lab admins can see your phone number.</p>${mem?`<label for="f-role">Role in the lab</label><select id="f-role" name="role">${['Member','Team lead','Lab secretary'].map(r=>`<option${p.lab_role===r?' selected':''}>${r}</option>`).join('')}</select><label for="f-top">Research topic</label><textarea id="f-top" name="topic" rows="3">${esc(p.topic||'')}</textarea>`:''}`,
  async fd=>{await W('m/'+S.me,fd);toast('Profile saved.')},'Save','<button type="button" class="btn" data-act="chpw">Change password</button>')}
const AUD={create_account:'Created account',reset_password:'New temporary password',role_change:'Changed access'};
function auditBlock(){const a=(S.audit||[]).slice(0,15);return `<h3>Account activity</h3><p class="mute note">Every account created, temporary password issued and access change, newest first. Only admins see this.</p>${a.length?`<div class="scroll"><table><thead><tr><th>When</th><th>By</th><th>What</th><th>Account</th><th>Detail</th></tr></thead><tbody>${a.map(x=>`<tr><td>${esc(fmtTs(ms(x.at)))}</td><td>${x.actor?esc(nm(x.actor)):'Server'}</td><td>${esc(AUD[x.action]||x.action)}</td><td>${x.target?esc(nm(x.target)):''}</td><td>${esc(x.detail||'')}</td></tr>`).join('')}</tbody></table></div>`:'<p class="mute">Nothing recorded yet.</p>'}`}
function setForm(){const c=S.cfg,od=openDays();
  const people=Object.values(S.prof).sort((a,b)=>(a.full_name||a.email).localeCompare(b.full_name||b.email));
  const adminBlock=S.admin?`<h3>Members and access</h3><p class="mute">Admins post work, schedule meetings, confirm attendance, read every report and manage accounts. Inactive accounts keep their history but cannot see any lab data.</p><div class="plist">${people.map(p=>`<p><span><b>${esc(p.full_name||'(no name yet)')}</b><br><small class="mute">${esc([p.email,p.student_id,p.class_name,S.contact?.[p.id]].filter(Boolean).join(' · '))}</small></span><span class="filters"><select data-role-u="${esc(p.id)}" aria-label="Access for ${esc(p.full_name||p.email)}" style="width:auto;padding:6px 8px;font-size:14px">${[['member','Member'],['admin','Admin'],['inactive','Inactive']].map(([v,l])=>`<option value="${v}"${p.role===v?' selected':''}>${l}</option>`).join('')}</select>${p.id!==S.me?`<button type="button" class="btn sm" data-act="pw-reset" data-u="${esc(p.id)}">New password</button>`:''}</span></p>`).join('')}</div>
  <h3>Add an account</h3><div class="two"><div><label for="n-email">Email</label><input id="n-email" type="email" autocomplete="off"></div><div><label for="n-name">Full name</label><input id="n-name" autocomplete="off"></div><div><label for="n-sid">Student ID</label><input id="n-sid" autocomplete="off"></div><div><label for="n-cls">Class</label><input id="n-cls" autocomplete="off"></div><div><label for="n-ph">Phone</label><input id="n-ph" type="tel" autocomplete="off"></div><div><label for="n-role">Access</label><select id="n-role"><option value="member">Member</option><option value="admin">Admin</option></select></div></div><div class="acts" style="justify-content:flex-start"><button type="button" class="btn dark" data-act="acc-create">Create with temporary password</button></div><p class="mute note">You get a temporary password to pass on yourself (no email is sent). The person must choose their own password at first sign-in.</p>
  <h3>Add many members at once</h3><p class="mute">Paste one person per line: full name, student ID, class, email, phone. Copying rows from Excel or Google Sheets works; the class can be left out.</p><textarea id="bulk-in" rows="6" placeholder="Phạm Minh Huy	GCH250338	CO1501	name@gmail.com	0382269479"></textarea><div class="acts" style="justify-content:flex-start"><button type="button" class="btn" data-act="bulk-check">Check the list</button></div><div id="bulk-out"></div>${auditBlock()}`:'';
  modal('Lab settings',`<label for="f-min">Minimum lab days per week</label><input id="f-min" type="number" min="0" max="7" name="minDays" value="${minDays()}"><label>Days the lab is open</label><div class="filters">${DOW.map((d,i)=>`<label class="ck"><input type="checkbox" name="d${i}"${od.includes(i)?' checked':''}> ${d}</label>`).join('')}</div><label for="f-dir">Overall research direction</label><textarea id="f-dir" name="direction" rows="5">${esc(c.direction||'')}</textarea><label for="f-goal">Publication goals (conferences, journals, milestones)</label><textarea id="f-goal" name="goals" rows="3">${esc(c.goals||'')}</textarea>${S.admin?`<h3>Check-in network</h3><label class="ck"><input type="checkbox" id="f-co" name="campusOnly"${c.campusOnly?' checked':''}> Members can check in only on the school Wi-Fi</label><p class="mute" style="font-size:13px;margin:4px 0 0">The lab server compares the member's internet address with the school network list below. Booking days still works from anywhere, and admins can always confirm attendance.</p><label for="f-wifi">Wi-Fi name shown to members</label><input id="f-wifi" name="wifi" value="${esc(c.wifi||'')}"><label for="f-nets">School network addresses (one per line)</label><textarea id="f-nets" name="nets" rows="3" placeholder="Press the button below while connected to the school Wi-Fi">${esc((c.nets||[]).join('\n'))}</textarea><div class="acts" style="justify-content:flex-start"><button type="button" class="btn" data-act="net-add">Add the network I am on now</button></div>`:''}${adminBlock}`,
  async(fd)=>{const days=[0,1,2,3,4,5,6].filter(i=>fd['d'+i]);const extra={};
    if(S.admin){const nets=[...new Set(String(fd.nets||'').split(/[\s,;]+/).filter(Boolean))],bad=nets.filter(x=>!isNet(x));if(bad.length){toast('Not a network address: '+bad.join(', '));throw 0}
      if(fd.campusOnly&&!nets.length){toast('Add at least one school network address, or untick the Wi-Fi rule.');throw 0}Object.assign(extra,{campusOnly:!!fd.campusOnly,nets,wifi:(fd.wifi||'').slice(0,60)});S.campus=null}
    await W('cfg/main',{minDays:Math.max(0,Math.min(7,Number(fd.minDays)||0)),days,direction:fd.direction||'',goals:fd.goals||'',...extra,at:Date.now()},{});toast('Lab settings saved.')})}
function isNet(x){const[a,m,...r]=x.split('/');if(r.length)return false;if(/^\d{1,3}(\.\d{1,3}){3}$/.test(a))return a.split('.').every(n=>+n<256)&&(m===undefined||(/^\d+$/.test(m)&&+m<=32));if(/^[0-9a-f:]+$/i.test(a)&&a.includes(':'))return m===undefined||(/^\d+$/.test(m)&&+m<=128);return false}

/* ---------- events ---------- */
/* ---------- Projects (Trello-style boards) ---------- */
const canEditP=p=>!!p&&(S.admin||!!p.members[S.me]);
const canManP=p=>!!p&&(S.admin||p.members[S.me]==='lead');
const mainT=p=>p.tasks.filter(t=>!t.parent_id);
const subsOf=(p,id)=>p.tasks.filter(t=>t.parent_id===id);
const tProg=(p,t)=>{if(t.done)return 1;const s=subsOf(p,t.id);return s.length?s.filter(x=>x.done).length/s.length*0.9:0};
const pProg=p=>{const m=mainT(p);return m.length?Math.round(m.reduce((a,t)=>a+tProg(p,t),0)/m.length*100):0};
const pMembers=p=>Object.keys(p.members).sort((a,b)=>nm(a).localeCompare(nm(b)));
const initials=u=>((S.names[u]||'?').trim().split(/\s+/).map(w=>w[0]).filter(Boolean).slice(-2).join('')||'?').toUpperCase();
const avCls=u=>' c'+([...String(u)].reduce((a,c)=>a+c.charCodeAt(0),0)%4);
const avs=us=>us&&us.length?`<span class="avs">${us.slice(0,5).map(u=>`<span class="av${avCls(u)}" title="${esc(nm(u))}">${esc(initials(u))}</span>`).join('')}${us.length>5?`<span class="av">+${us.length-5}</span>`:''}</span>`:'';
const late=t=>!t.done&&t.due_date&&t.due_date<TODAY;
function dueBadge(t){if(t.done)return '<span class="badge ok">Done</span>';if(!t.due_date)return '';const n=daysTo(t.due_date);
  return `<span class="badge ${n<0?'bad':n<=3?'ac':''}">${n<0?pl(-n,'day')+' late':n===0?'Due today':'Due '+sh(parse(t.due_date))}</span>`}
const pDates=p=>p.start_date||p.due_date?`${p.start_date?sh(parse(p.start_date)):'…'} to ${p.due_date?sh(parse(p.due_date))+'/'+p.due_date.slice(0,4):'…'}`:'No dates set';
const listOf=(p,t)=>p.lists.find(l=>l.id===t.list_id)||p.lists[0]||null;
const nextPos=(p,lid)=>Math.max(0,...mainT(p).filter(t=>(listOf(p,t)||{}).id===lid).map(t=>Number(t.position)||0))+1;
function myOpenTasks(){const out=[];for(const p of Object.values(S.pj||{}))if(!p.archived)for(const t of p.tasks)if(!t.done&&(t.assignees||[]).includes(S.me))out.push([p,t]);
  return out.sort((a,b)=>(a[1].due_date||'9999').localeCompare(b[1].due_date||'9999'))}
function taskRow([p,t]){const par=t.parent_id?p.tasks.find(x=>x.id===t.parent_id):null;
  return `<div class="prow"><span class="pi ${late(t)?'r':'b'}">${ic(late(t)?'clock':'kanban')}</span><div><b class="clamp2" title="${esc(t.title)}">${esc(t.title)}</b><small class="clamp1">${esc(p.title)}${par?', part of '+esc(par.title):''}</small></div><div class="filters">${dueBadge(t)}<button class="btn sm" data-act="tk" data-p="${esc(p.id)}" data-id="${esc(t.id)}">Open</button></div></div>`}
function vMyTasks(max){const ts=myOpenTasks();if(!ts.length)return'';
  return `<section class="card"><div class="bar-head"><h2>My project tasks <span class="mute" style="font-weight:400">${ts.length}</span></h2><a class="link" href="#projects">All projects ${ic('arrow',16)}</a></div>${ts.slice(0,max).map(taskRow).join('')}</section>`}

function vProj(){
  if(S.proj){const p=S.pj[S.proj];if(p)return vProjOne(p);S.proj=null}
  const f=S.pf||'act',all=Object.values(S.pj||{});
  const list=all.filter(p=>f==='arch'?p.archived:!p.archived&&(f!=='mine'||p.members[S.me])).sort((a,b)=>(a.due_date||'9999').localeCompare(b.due_date||'9999')||a.title.localeCompare(b.title));
  const fl=S.admin?[['act','All active'],['mine','My projects'],['arch','Archived']]:[['act','Active'],['arch','Archived']];
  let h=`<div class="bar-head"><div class="filters">${fl.map(([k,l])=>`<button class="f" data-act="pf" data-k="${k}" aria-pressed="${f===k}">${l}</button>`).join('')}</div><button class="btn pri" data-act="pj-new">${ic('plus',18)}New project</button></div>`;
  h+=f==='arch'?'':vMyTasks(6);
  if(!list.length)return h+`<section class="card"><p class="mute">${f==='arch'?'No archived projects.':S.admin?'No projects yet. Create one here, or open an assignment in Classroom and press "Create project" to give each member their own task.':'You are not in any project yet. Create your own, or wait for the lab head to add you to one.'}</p></section>`;
  return h+`<div class="pgrid">${list.map(p=>{const m=mainT(p),pr=pProg(p),lt=p.tasks.filter(late).length,a=p.assignment_id?S.a.find(x=>x.id===p.assignment_id):null;
    return `<button class="pcard" data-act="pj" data-id="${esc(p.id)}" title="${esc(p.title)}"><span class="filters">${a?`<span class="badge ac">From classroom</span>`:''}${p.archived?'<span class="badge">Archived</span>':''}${lt?`<span class="badge bad">${lt} late</span>`:''}</span><b>${esc(p.title)}</b>${p.description?`<span class="mute pdesc">${esc(p.description)}</span>`:''}<span class="mute note">${esc(pDates(p))}, ${pl(m.length,'task')}</span><span class="pct"><span class="bar"><i style="width:${pr}%"></i></span><span>${pr}%</span></span>${avs(pMembers(p))}</button>`}).join('')}</div>`}

function vProjOne(p){const ed=canEditP(p),man=canManP(p),v=S.pv||'board',pr=pProg(p),a=p.assignment_id?S.a.find(x=>x.id===p.assignment_id):null;
  let h=`<button class="link" data-act="pj-back">‹ All projects</button><section class="card"><div class="bar-head"><div><h2 style="margin:0">${esc(p.title)}</h2><p class="mute" style="margin:4px 0 0">${esc(pDates(p))}${a?`. From classroom: <button class="link sm" data-act="asg" data-id="${esc(a.id)}">${esc(a.title)}</button>`:''}${p.archived?'. Archived':''}</p></div>
    <div class="filters">${avs(pMembers(p))}<button class="btn sm" data-act="pj-mem" data-id="${esc(p.id)}">${ic('users',16)}Members ${Object.keys(p.members).length}</button>${man?`<button class="btn sm" data-act="pj-edit" data-id="${esc(p.id)}">Edit</button>`:''}</div></div>
    ${p.description?`<p class="pre">${esc(p.description)}</p>`:''}<div class="pct"><span class="bar"><i style="width:${pr}%"></i></span><span>${pr}% done</span></div></section>
    <div class="bar-head"><div class="filters" role="group" aria-label="View">${[['board','Board'],['timeline','Timeline'],['list','Task list']].map(([k,l])=>`<button class="f" data-act="pv" data-k="${k}" aria-pressed="${v===k}">${l}</button>`).join('')}</div>${ed?`<button class="btn pri" data-act="tk-new" data-p="${esc(p.id)}">${ic('plus',18)}New task</button>`:''}</div>`;
  if(!ed)h+=`<p class="mute">You can view this project. Only its members can change it.</p>`;
  return h+(v==='timeline'?vGantt(p):v==='list'?vTaskList(p):vBoard(p))}

function vBoard(p){const ed=canEditP(p),man=canManP(p),m=mainT(p);
  const cols=p.lists.map(l=>{const cs=m.filter(t=>(listOf(p,t)||{}).id===l.id).sort((a,b)=>a.position-b.position);
    return `<section class="kcol" aria-label="${esc(l.title)}"><header><b>${esc(l.title)}${l.is_done?' '+ic('check',14):''} <span class="mute" style="font-weight:400">${cs.length}</span></b>${ed?`<button class="link sm" data-act="ls-edit" data-p="${esc(p.id)}" data-id="${esc(l.id)}" aria-label="List options for ${esc(l.title)}">Edit</button>`:''}</header>
      <div class="kcards" data-drop="${esc(l.id)}">${cs.map(t=>kCard(p,t,ed)).join('')||'<p class="mute kempty">No tasks</p>'}</div>
      ${ed?`<div class="kadd"><input id="ka-${esc(l.id)}" data-kadd="${esc(l.id)}" data-p="${esc(p.id)}" placeholder="Add a task" aria-label="New task in ${esc(l.title)}"><button class="btn sm" data-act="tk-add" data-p="${esc(p.id)}" data-id="${esc(l.id)}">Add</button></div>`:''}</section>`}).join('');
  return `<div class="kb">${cols}${ed?`<section class="kcol kcol-add"><label for="nl-${esc(p.id)}">Add a list</label><div class="kadd"><input id="nl-${esc(p.id)}" data-nl="${esc(p.id)}" placeholder="List name, e.g. Blocked"><button class="btn sm" data-act="ls-add" data-p="${esc(p.id)}">Add</button></div></section>`:''}</div>
  ${ed?'<p class="mute note">Drag a card to another list, or open it and change the list. Cards in a list marked done count as finished.</p>':''}`}
function kCard(p,t,ed){const ss=subsOf(p,t.id),sd=ss.filter(x=>x.done).length;
  return `<article class="kc${t.done?' done':''}${t.priority==='high'?' hi':''}" ${ed?'data-drag="1"':''} role="button" tabindex="0" data-act="tk" data-p="${esc(p.id)}" data-id="${esc(t.id)}" aria-label="${esc(t.title)}" title="${esc(t.title)}"><b>${esc(t.title)}</b>
    <div class="kmeta"><span class="filters">${dueBadge(t)}${t.priority==='high'?'<span class="badge bad">High</span>':t.priority==='low'?'<span class="badge">Low</span>':''}${ss.length?`<span class="badge${sd===ss.length?' ok':''}">${ic('check',12)} ${sd}/${ss.length}</span>`:''}${t.description?`<span title="Has a description">${ic('file',14)}</span>`:''}</span>${avs(t.assignees)}</div></article>`}

function vTaskList(p){const mine=!!S.tmine,rows=[];
  for(const t of mainT(p).sort((a,b)=>(a.due_date||'9999').localeCompare(b.due_date||'9999'))){rows.push(t);for(const s of subsOf(p,t.id))rows.push(s)}
  const show=rows.filter(t=>!mine||(t.assignees||[]).includes(S.me));
  return `<section class="card"><div class="bar-head"><label class="ck"><input type="checkbox" data-tmine="1"${mine?' checked':''}> Only tasks assigned to me</label><button class="btn sm" data-act="exp-tasks" data-p="${esc(p.id)}">Export CSV</button></div>
  ${show.length?`<div class="scroll"><table><thead><tr><th>Task</th><th>List</th><th>Assigned to</th><th>Start</th><th>Due</th><th>Status</th></tr></thead><tbody>${show.map(t=>{const par=t.parent_id?p.tasks.find(x=>x.id===t.parent_id):null,l=par?listOf(p,par):listOf(p,t);
    return `<tr><td${par?' style="padding-left:28px"':''}><button class="link" style="padding:0;text-align:left" data-act="tk" data-p="${esc(p.id)}" data-id="${esc(t.id)}">${par?'↳ ':''}${esc(t.title)}</button></td><td>${esc(l?l.title:'')}</td><td>${(t.assignees||[]).map(u=>esc(nm(u))).join(', ')||'<span class="mute">Nobody</span>'}</td><td>${t.start_date?esc(sh(parse(t.start_date))):''}</td><td>${t.due_date?esc(sh(parse(t.due_date))):''}</td><td>${dueBadge(t)||'<span class="badge">Open</span>'}</td></tr>`}).join('')}</tbody></table></div>`:`<p class="mute">${mine?'No tasks assigned to you here.':'No tasks yet.'}</p>`}</section>`}

function vGantt(p){const rows=[];
  for(const t of mainT(p).sort((a,b)=>(a.start_date||a.due_date||'9999').localeCompare(b.start_date||b.due_date||'9999'))){rows.push([t,0]);for(const s of subsOf(p,t.id).sort((a,b)=>(a.start_date||a.due_date||'9999').localeCompare(b.start_date||b.due_date||'9999')))rows.push([s,1])}
  const ds=[p.start_date,p.due_date,...p.tasks.flatMap(t=>[t.start_date,t.due_date])].filter(Boolean).sort();
  if(!ds.length)return `<section class="card"><p class="mute">Add a start or due date to the project or its tasks to see them on the timeline.</p></section>`;
  const lo=ds[0]<TODAY?ds[0]:TODAY,hi=ds[ds.length-1]>TODAY?ds[ds.length-1]:TODAY;let rs=monday(parse(lo)),re=addD(monday(parse(hi)),13);
  let N=Math.round((re-rs)/864e5)+1,cut=false;
  if(N>1100){cut=true;const st=addD(parse(TODAY),-365);rs=monday(rs>st?rs:st);N=1100;re=addD(rs,N-1)}const wk=S.gz==='w'||N>120,dw=wk?12:34;
  const ix=d=>Math.round((parse(d)-rs)/864e5),ti=ix(TODAY);
  let head='';for(let i=0;i<N;i++){const d=addD(rs,i);if(i===0||d.getDate()===1)head+=`<span class="gm" style="left:${i*dw}px">${MON[d.getMonth()].slice(0,3)} ${d.getFullYear()}</span>`;
    if(wk?d.getDay()===1:true)head+=`<span class="gd${iso(d)===TODAY?' t':''}" style="left:${i*dw}px;width:${wk?dw*7:dw}px">${wk?sh(d):d.getDate()}</span>`}
  const today=ti>=0&&ti<N?`<i class="gtoday" style="left:${ti*dw+dw/2}px" aria-hidden="true"></i>`:'';
  const bar=(t,cls,label,act)=>{const s=t.start_date||t.due_date,e=t.due_date||t.start_date;if(!s)return `<span class="gnone">No dates</span>`;
    const l0=ix(s),r0=ix(e);if(r0<0||l0>N-1)return `<span class="gnone">Outside the dates shown</span>`;
    const l=Math.max(0,l0),w=Math.max(1,Math.min(N-1,r0)-l+1),pr=cls==='proj'?0:Math.round(tProg(p,t)*100);
    return `<button class="gb ${cls}" style="left:${l*dw+1}px;width:${w*dw-2}px" ${act} title="${esc(label)}: ${esc(s===e?fmtD(s):fmtD(s)+' to '+fmtD(e))}${pr?', '+pr+'% done':''}"><i style="width:${pr}%"></i><span>${esc(w*dw>70?label:'')}</span></button>`};
  const tw=N*dw;
  let body=`<div class="grw"><div class="gl" style="font-weight:700">${esc(p.title)}</div><div class="gtr" style="width:${tw}px">${today}${p.start_date||p.due_date?bar({start_date:p.start_date,due_date:p.due_date},'proj',p.title,''):''}</div></div>`;
  body+=rows.map(([t,lv])=>{const cls=t.done?'done':late(t)?'late':'';const act=`data-act="tk" data-p="${esc(p.id)}" data-id="${esc(t.id)}"`;
    return `<div class="grw${lv?' sub':''}"><button class="gl" ${act} title="${esc(t.title)}">${lv?'↳ ':''}${esc(t.title)}</button><div class="gtr" style="width:${tw}px">${today}${bar(t,cls,(t.assignees||[]).map(initials).join(', ')||t.title,act)}</div></div>`}).join('');
  return `<section class="card"><div class="bar-head"><div class="filters"><button class="f" data-act="gz" data-k="d" aria-pressed="${!wk}"${N>120?' disabled':''}>Days</button><button class="f" data-act="gz" data-k="w" aria-pressed="${wk}">Weeks</button></div>
    <div class="filters glegend"><span><i class="gb" style="position:static;display:inline-block;width:18px;height:10px"></i> Planned</span><span><i class="gb done" style="position:static;display:inline-block;width:18px;height:10px"></i> Done</span><span><i class="gb late" style="position:static;display:inline-block;width:18px;height:10px"></i> Late</span><span><i class="gtoday" style="position:static;display:inline-block;height:12px"></i> Today</span></div></div>
    <div class="gwrap" id="gwrap"><div class="gt" style="--dw:${dw}px;width:calc(var(--lw) + ${tw}px)"><div class="gh"><div class="gl">Task</div><div class="gtr gtr-h" style="width:${tw}px">${head}</div></div>${body}</div></div>
    ${cut?`<p class="mute note">This project spans more than three years, so the timeline shows ${esc(sh(rs))}/${rs.getFullYear()} to ${esc(sh(re))}/${re.getFullYear()}.</p>`:''}
    <p class="mute note">Bars run from each task's start date to its due date. The darker part shows how much is done (sub-tasks count toward their main task). Click a bar to open the task.</p></section>`}
function pjAfter(){const g=document.getElementById('gwrap');if(g&&S.gScroll!==S.proj+S.gz){S.gScroll=S.proj+S.gz;const t=g.querySelector('.gtoday');if(t)g.scrollLeft=Math.max(0,parseFloat(t.style.left)-200)}}

/* project forms */
function activePeople(){return Object.values(S.prof||{}).filter(x=>x.role!=='inactive').map(x=>x.id).sort((a,b)=>nm(a).localeCompare(nm(b)))}
function pjForm(p,asg){const isNew=!p;p=p||{};const people=activePeople().filter(u=>u!==S.me);
  const pre=asg?new Set(mems()):new Set();
  const body=`${asg?`<p class="amsg">From the classroom assignment <b>${esc(asg.title)}</b>. Each person you tick gets their own main task, and you can add sub-tasks later.</p>`:''}
    <label for="pj-t">Project name</label><input id="pj-t" name="title" required maxlength="200" value="${esc(p.title||(asg?asg.title:''))}">
    <label for="pj-d">Goal and notes</label><textarea id="pj-d" name="description" rows="3">${esc(p.description||(asg?asg.desc:''))}</textarea>
    <div class="two"><div><label for="pj-s">Start</label><input id="pj-s" type="date" name="start_date" value="${esc(p.start_date||(isNew?TODAY:''))}"></div><div><label for="pj-e">End</label><input id="pj-e" type="date" name="due_date" value="${esc(p.due_date||(asg&&asg.due?asg.due.slice(0,10):''))}"></div></div>
    ${isNew?`<label>Members ${people.length?`<button type="button" class="link sm" data-act="pj-all">Tick all</button>`:''}</label><div class="achk">${people.map(u=>`<label class="ck"><input type="checkbox" name="m_${esc(u)}"${pre.has(u)?' checked':''}> ${esc(nm(u))}</label>`).join('')||'<span class="mute">No one else in the lab yet.</span>'}</div>
      <p class="mute note">You lead this project. You can add or remove people later under Members.</p>
      ${asg?`<label class="ck" style="margin-top:8px"><input type="checkbox" name="per" checked> Give each ticked member their own main task</label>`:''}`
    :`<label class="ck" style="margin-top:12px"><input type="checkbox" name="archived"${p.archived?' checked':''}> Archived (hidden from the active list)</label>`}`;
  modal(isNew?(asg?'Create project from assignment':'New project'):'Edit project',body,async fd=>{
    if(fd.start_date&&fd.due_date&&fd.due_date<fd.start_date){toast('The end date cannot be before the start date.');throw 0}
    if(isNew){const members=people.filter(u=>fd['m_'+u]);
      const id=await q(SB.rpc('create_project',{p_title:fd.title,p_description:fd.description||'',p_start:fd.start_date||null,p_due:fd.due_date||null,p_assignment:asg?asg.id:null,p_members:members,p_task_per_member:!!(asg&&fd.per),p_task_title:asg?asg.title:null})).catch(e=>{fail(e);throw e});
      await reload();toast('Project created.');S.pv='board';go('projects','proj',id)}
    else{await upd('projects',{title:fd.title,description:fd.description||'',start_date:fd.start_date||null,due_date:fd.due_date||null,archived:!!fd.archived},{id:p.id}).catch(e=>{fail(e);throw e});await reload();toast('Project saved.')}},
    isNew?'Create project':'Save',!isNew&&canManP(p)?`<button type="button" class="btn" data-act="pj-del" data-id="${esc(p.id)}">Delete project</button>`:'')}
function pjMembers(pid){const p=S.pj[pid];if(!p)return;const man=canManP(p),ms=pMembers(p),others=activePeople().filter(u=>!p.members[u]);
  modal('Project members',`<div class="plist">${ms.map(u=>`<p><span><b>${esc(nm(u))}</b> <span class="mute">${esc(memLine(u))}</span></span><span class="filters">${man?`<select data-pmrole="${esc(u)}" data-p="${esc(pid)}" aria-label="Role of ${esc(nm(u))}" style="width:auto;padding:6px 8px;font-size:14px"><option value="lead"${p.members[u]==='lead'?' selected':''}>Lead</option><option value="member"${p.members[u]!=='lead'?' selected':''}>Member</option></select><button type="button" class="btn sm" data-act="pm-del" data-p="${esc(pid)}" data-u="${esc(u)}">Remove</button>`:`<span class="badge${p.members[u]==='lead'?' ac':''}">${p.members[u]==='lead'?'Lead':'Member'}</span>`}</span></p>`).join('')}</div>
    ${man&&others.length?`<label for="pm-u">Add someone</label><div class="kadd"><select id="pm-u">${others.map(u=>`<option value="${esc(u)}">${esc(nm(u))}</option>`).join('')}</select><button type="button" class="btn sm" data-act="pm-add" data-p="${esc(pid)}">Add</button></div>`:''}
    <p class="mute note">Leads and admins manage people and lists. Every member can add, edit and move tasks. Removing someone also takes them off their tasks.</p>`,null)}

/* tasks */
function formState(){const f=$('#dlgf');if(!f)return null;const s={};f.querySelectorAll('input,textarea,select').forEach(el=>{if(el.id)s[el.id]=el.type==='checkbox'?el.checked:el.value});return s}
function formRestore(s,skip){if(!s)return;for(const id in s){if(skip&&skip.includes(id))continue;const el=document.getElementById(id);if(!el)continue;if(el.type==='checkbox'){if(!el.dataset.sub)el.checked=s[id]}else el.value=s[id]}}
function tkFields(p,t,sub){const mem=pMembers(p);
  return `<label for="tk-t">Title</label><input id="tk-t" name="title" required maxlength="300" value="${esc(t.title||'')}">
  <label for="tk-d">Description</label><textarea id="tk-d" name="description" rows="3">${esc(t.description||'')}</textarea>
  <div class="two">${sub?'':`<div><label for="tk-l">List</label><select id="tk-l" name="list_id">${p.lists.map(l=>`<option value="${esc(l.id)}"${(listOf(p,t)||{}).id===l.id?' selected':''}>${esc(l.title)}</option>`).join('')}</select></div>`}
  <div><label for="tk-pr">Priority</label><select id="tk-pr" name="priority">${[['low','Low'],['normal','Normal'],['high','High']].map(([k,l])=>`<option value="${k}"${(t.priority||'normal')===k?' selected':''}>${l}</option>`).join('')}</select></div>
  <div><label for="tk-s">Start</label><input id="tk-s" type="date" name="start_date" value="${esc(t.start_date||'')}"></div><div><label for="tk-e">Due</label><input id="tk-e" type="date" name="due_date" value="${esc(t.due_date||'')}"></div></div>
  <label>Assigned to</label><div class="achk">${mem.map(u=>`<label class="ck"><input type="checkbox" id="tk-a-${esc(u)}" name="as_${esc(u)}"${(t.assignees||[]).includes(u)?' checked':''}> ${esc(nm(u))}</label>`).join('')}</div>`}
function tkRow(p,fd){const as=pMembers(p).filter(u=>fd['as_'+u]);
  if(fd.start_date&&fd.due_date&&fd.due_date<fd.start_date){toast('The due date cannot be before the start date.');throw 0}
  return {title:fd.title,description:fd.description||'',priority:fd.priority||'normal',start_date:fd.start_date||null,due_date:fd.due_date||null,assignees:as}}
function tkNew(pid,lid){const p=S.pj[pid];if(!p)return;
  modal('New task',tkFields(p,{list_id:lid||(p.lists[0]||{}).id},false),async fd=>{const row={...tkRow(p,fd),project_id:p.id,list_id:fd.list_id||null};row.position=nextPos(p,row.list_id);
    await q(SB.from('project_tasks').insert(row).select()).catch(e=>{fail(e);throw e});await reload();toast('Task added.')},'Add task')}
function tkOpen(pid,id){const p=S.pj[pid],t=p&&p.tasks.find(x=>x.id===id);if(!p||!t){toast('This task is no longer available.');return}
  const ed=canEditP(p),sub=!!t.parent_id,par=sub?p.tasks.find(x=>x.id===t.parent_id):null,ss=sub?[]:subsOf(p,t.id).sort((a,b)=>a.position-b.position),mem=pMembers(p);
  const canDel=canManP(p)||(ed&&t.created_by===S.me);
  let body=`${par?`<p class="mute" style="margin-top:0">Sub-task of <button type="button" class="link sm" data-act="tk" data-p="${esc(pid)}" data-id="${esc(par.id)}">${esc(par.title)}</button></p>`:`<p class="mute" style="margin-top:0">${esc(p.title)}</p>`}${tkFields(p,t,sub)}
    ${sub?`<label class="ck" style="margin-top:12px"><input type="checkbox" id="tk-done" name="done"${t.done?' checked':''}> Done</label>`:''}`;
  if(!sub){const sd=ss.filter(x=>x.done).length;
    body+=`<h3>Sub-tasks ${ss.length?`<span class="mute" style="font-weight:400">${sd}/${ss.length} done</span>`:''}</h3><div class="subs">${ss.map(s=>`<div class="srow"><input type="checkbox" data-sub="${esc(s.id)}" data-p="${esc(pid)}"${s.done?' checked':''}${ed?'':' disabled'} aria-label="Done: ${esc(s.title)}"><button type="button" class="link" data-act="tk" data-p="${esc(pid)}" data-id="${esc(s.id)}">${esc(s.title)}</button><span class="mute" style="font-size:12px">${s.due_date?esc(sh(parse(s.due_date))):''}</span>${avs(s.assignees)||'<span></span>'}</div>`).join('')||'<p class="mute" style="margin:0">Break this task into smaller steps.</p>'}</div>
    ${ed?`<div class="sadd"><input id="st-t" placeholder="New sub-task" aria-label="New sub-task"><select id="st-u" aria-label="Sub-task assigned to"><option value="">Nobody yet</option>${mem.map(u=>`<option value="${esc(u)}">${esc(nm(u))}</option>`).join('')}</select><input id="st-d" type="date" aria-label="Sub-task due date"><button type="button" class="btn sm" data-act="st-add" data-p="${esc(pid)}" data-id="${esc(t.id)}">Add</button></div>`:''}`}
  body+=`<p class="mute" style="font-size:12px;margin-top:14px">Added ${t.created_by?'by '+esc(nm(t.created_by))+', ':''}${esc(fmtTs(ms(t.created_at)))}.${t.done&&t.done_at?' Finished '+esc(fmtTs(ms(t.done_at)))+'.':''}</p>`;
  modal(sub?'Sub-task':'Task',body,ed?async fd=>{const row=tkRow(p,fd);
    if(sub)row.done=!!fd.done;else if(fd.list_id&&fd.list_id!==(listOf(p,t)||{}).id){row.list_id=fd.list_id;row.position=nextPos(p,fd.list_id)}
    await upd('project_tasks',row,{id:t.id}).catch(e=>{fail(e);throw e});await reload();toast('Task saved.')}:null,'Save',canDel?`<button type="button" class="btn" data-act="tk-del" data-p="${esc(pid)}" data-id="${esc(t.id)}">Delete</button>`:'');
  if(!ed)$('#dlgf').querySelectorAll('input,textarea,select').forEach(x=>x.disabled=true)}
async function moveCard(id,lid,beforeId){const p=S.pj[S.proj];if(!p)return;const t=p.tasks.find(x=>x.id===id);if(!t)return;
  const cs=mainT(p).filter(x=>x.id!==id&&(listOf(p,x)||{}).id===lid).sort((a,b)=>a.position-b.position);let pos;
  const bi=beforeId?cs.findIndex(x=>x.id===beforeId):-1;
  if(bi>=0){const nx=Number(cs[bi].position),pv=bi>0?Number(cs[bi-1].position):nx-1;pos=(pv+nx)/2}else pos=(cs.length?Number(cs[cs.length-1].position):0)+1;
  if(t.list_id===lid&&Number(t.position)===pos)return;
  const l=p.lists.find(x=>x.id===lid);Object.assign(t,{list_id:lid,position:pos,done:l?l.is_done:t.done});render();
  try{await upd('project_tasks',{list_id:lid,position:pos},{id});if(l&&l.is_done)toast('Moved to '+l.title+'. Marked done.')}catch(e){fail(e)}reloadSoon()}
function expTasks(pid){const p=S.pj[pid];if(!p)return;const rows=[['Project','Task','Main task','List','Assigned to','Priority','Start','Due','Done','Finished on']];
  for(const t of mainT(p))for(const x of [t,...subsOf(p,t.id)]){const par=x.parent_id?t:null,l=listOf(p,par||x);rows.push([p.title,x.title,par?par.title:'',l?l.title:'',(x.assignees||[]).map(nm).join('; '),x.priority,x.start_date||'',x.due_date||'',x.done?'yes':'no',x.done_at?String(x.done_at).slice(0,10):''])}
  saveCsv('frd-project-'+p.title.replace(/[^\w]+/g,'-').slice(0,40)+'-'+TODAY+'.csv',rows)}
function lsEdit(pid,lid){const p=S.pj[pid],l=p&&p.lists.find(x=>x.id===lid);if(!l)return;const man=canManP(p),n=mainT(p).filter(t=>(listOf(p,t)||{}).id===lid).length;
  modal('Edit list',`<label for="ls-t">List name</label><input id="ls-t" name="title" required maxlength="80" value="${esc(l.title)}"><label class="ck" style="margin-top:12px"><input type="checkbox" name="is_done"${l.is_done?' checked':''}> Cards in this list count as done</label>
    <label for="ls-pos">Position</label><select id="ls-pos" name="pos">${p.lists.map((x,i)=>`<option value="${i}"${x.id===lid?' selected':''}>${i+1}${x.id===lid?' (now)':''}</option>`).join('')}</select>`,
    async fd=>{const others=p.lists.filter(x=>x.id!==lid),i=Math.max(0,Math.min(others.length,Number(fd.pos)||0));
      const pos=others.length?(i===0?Number(others[0].position)-1:i>=others.length?Number(others[others.length-1].position)+1:(Number(others[i-1].position)+Number(others[i].position))/2):1;
      await upd('project_lists',{title:fd.title,is_done:!!fd.is_done,position:pos},{id:lid}).catch(e=>{fail(e);throw e});await reload();toast('List saved.')},'Save',
    man&&p.lists.length>1?`<button type="button" class="btn" data-act="ls-del" data-p="${esc(pid)}" data-id="${esc(lid)}" data-n="${n}">Delete list</button>`:'')}

function route(){document.querySelector('.side')?.classList.remove('open');const mb=document.getElementById('menu-btn');if(mb)mb.setAttribute('aria-expanded','false');const h=location.hash.slice(1);S.tab=TABS.some(t=>t[0]===h)?h:'overview';const nx=S.next||{};S.asg=nx.asg||null;S.thread=nx.thread||null;S.member=nx.member||null;S.proj=nx.proj||null;S.next=null;render();try{scrollTo(0,0)}catch{}}
addEventListener('hashchange',route);
addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#mdl').innerHTML)closeM()});
const go=(tab,key,val)=>{S.next={[key]:val};if(location.hash==='#'+tab)route();else location.hash=tab};
const val=id=>(document.getElementById(id)?.value||'').trim();
document.addEventListener('click',e=>{
  const cx=e.target.closest('[data-x=close]');if(cx&&(cx.tagName==='BUTTON'||e.target===cx)){closeM();return}
  const el=e.target.closest('[data-act]');if(!el||el.disabled)return;
  if(S.noClick&&Date.now()-S.noClick<400&&el.classList.contains('kc'))return;
  const{act,id,u,d,k,n,v}=el.dataset;
  if(!S.db&&act!=='back')return;
  switch(act){
  case'asg':closeM();go('classroom','asg',id);break;
  case'back':S.asg=S.thread=S.member=null;render();break;
  case'fk':S.fk=k;render();break;
  case'asg-new':asgForm();break;
  case'asg-edit':asgForm(S.a.find(a=>a.id===id));break;
  case'asg-del':ask('Delete this post?','It will be removed from the classroom, together with its submissions and grades.',async()=>{await D(()=>S.db.doc('a/'+id).delete());S.asg=null;render()});break;
  case'sub':{const t=val('sb-t-'+id),l=val('sb-l-'+id);if(!t&&!l){toast('Add your answer or a link first.');break}busy(el,W('r/'+S.me,{subs:{[id]:{text:t,link:l,at:Date.now()}}},RBASE).then(()=>toast('Work submitted.')));break}
  case'grade':{const sc=val('sc-'+id+'-'+u),fb=val('gf-'+id+'-'+u);if(sc===''){toast('Enter a grade before saving.');break}busy(el,W('r/'+u,{grades:{[id]:{score:Number(sc),fb,at:Date.now()}}},RBASE).then(()=>toast('Grade saved for '+nm(u)+'.')));break}
  case'cm':{const t=val('cm-'+k);if(!t)break;busy(el,W('p/'+S.me,{cm:{[gid()]:{th:k,text:t,at:Date.now(),t:T()?1:0}}},PBASE).then(()=>{const ta=document.getElementById('cm-'+k);if(ta)ta.value=''}));break}
  case'cm-del':ask('Delete this reply?','It will no longer show in the discussion.',()=>W('p/'+u,{cm:{[id]:{del:true}}}));break;
  case'tp-new':topicForm();break;
  case'tp-del':ask('Delete this topic?','The topic and its replies will no longer show.',async()=>{await W('p/'+u,{topics:{[id]:{del:true}}});S.thread=null;render()});break;
  case'th':go('discussion','thread',k);break;
  case'mon':S.month=n==='0'?new Date(new Date().getFullYear(),new Date().getMonth(),1):new Date(S.month.getFullYear(),S.month.getMonth()+Number(n),1);render();break;
  case'wk':S.week=n==='0'?W0:addD(S.week,7*Number(n));render();break;
  case'day':mtForm(null,d);break;
  case'mt':mtOpen(id);break;
  case'mt-new':mtForm();break;
  case'mt-edit':mtForm(S.mt.find(x=>x.id===id));break;
  case'mt-del':ask('Delete this meeting?','It will be removed from the lab calendar.',()=>D(()=>S.db.doc('mt/'+id).delete()));break;
  case'rsvp':busy(el,W('m/'+S.me,{rsvp:{[id]:v}}).then(()=>{closeM();toast(v==='yes'?'Marked as attending.':'Marked as absent.')}));break;
  case'reg':{const cur=!!S.m[S.me]?.att?.[d]?.reg;busy(el,W('m/'+S.me,{att:{[d]:{reg:!cur}}}).then(()=>toast(cur?'Booking cancelled.':'Lab day booked for '+sh(parse(d))+'.')));break}
  case'in':busy(el,(async()=>{if(S.cfg.campusOnly&&!S.admin){const c=await campusCheck(true);if(!c.ok){render();toast(offMsg());throw 0}}
    await wRoute('m/'+S.me,{att:{[TODAY]:{reg:true,in:Date.now(),mk:false}}}).catch(e=>{if(/off_campus/.test(e?.message||'')){S.campus={...(S.campus||{}),ok:false,t:Date.now()};render();toast(offMsg())}else fail(e);throw e});
    await reload();toast('Checked in at '+hm(Date.now())+'.')})());break;
  case'net-re':busy(el,campusCheck(true).then(c=>{render();toast(c.ok?'You are on the school network.':'Still not on the school Wi-Fi.')}));break;
  case'net-add':busy(el,campusCheck(true).then(c=>{const t=$('#f-nets');if(!c.ip){toast('Could not read your network address.');return}
    const cur=t.value.split(/[\s,]+/).filter(Boolean);if(!cur.includes(c.ip))cur.push(c.ip);t.value=cur.join('\n');$('#f-co').checked=true;toast('Added '+c.ip+'. Press Save to apply.')}));break;
  case'unin':busy(el,W('m/'+S.me,{att:{[d]:{in:0}}}));break;
  case'mark':{const a=S.m[u]?.att?.[d]||{};busy(el,W('m/'+u,{att:{[d]:a.in>0?{in:0,mk:false}:{in:Date.now(),mk:true}}}));break}
  case'rep':{const x={done:val('rp-d'),next:val('rp-n'),issue:val('rp-i'),pct:clamp(val('rp-p')),link:val('rp-l'),at:Date.now()};if(!x.done&&!x.next){toast('Fill in at least what you did or your plan.');break}busy(el,W('r/'+S.me,{reps:{[WK0]:x}},RBASE).then(()=>toast('Weekly report sent.')));break}
  case'mem':go('progress','member',u);break;
  case'dh':busy(el,W('r/'+u,{note:{text:val('dh-'+u),at:Date.now()}},RBASE).then(()=>toast('Direction saved for '+nm(u)+'.')));break;
  case'fb':{const t=val('fb-'+u+'-'+k);busy(el,W('r/'+u,{fb:{[k]:{text:t,at:Date.now()}}},RBASE).then(()=>toast('Feedback sent.')));break}
  case'profile':profForm();break;
  case'settings':setForm();break;
  case'bulk-check':{BULK=parseBulk(val('bulk-in'));const n=BULK.filter(r=>r.ok&&!r.exists).length;$('#bulk-out').innerHTML=BULK.length?bulkTable(BULK,false)+`<div class="acts" style="justify-content:flex-start"><button type="button" class="btn dark" data-act="bulk-run"${n?'':' disabled'}>Create ${n} member account${n===1?'':'s'}</button></div>`:'<p class="mute">Nothing to read. Paste one person per line.</p>';break}
  case'bulk-run':bulkRun(el);break;
  case'bulk-csv':{const url=location.origin+location.pathname;saveCsv('frd-new-accounts-'+TODAY+'.csv',[['Name','Student ID','Class','Email','Phone','Temporary password','Sign-in page'],...(S.bulkDone||[]).map(r=>[r.full_name,r.student_id,r.class_name,r.email,r.phone,r.password||('not created: '+(r.error||'')),url])]);break}
  case'bulk-copy':{const url=location.origin+location.pathname;const t=(S.bulkDone||[]).filter(r=>r.password).map(r=>`${r.full_name}: FRD Lab Hub ${url} , email ${r.email} , temporary password ${r.password}`).join('\n');try{navigator.clipboard.writeText(t).then(()=>toast('Copied.'),()=>toast('Copy failed. Use Download CSV.'))}catch{toast('Copy failed. Use Download CSV.')}break}
  case'acc-create':accAdd(el);break;
  case'pw-reset':ask('Create a new temporary password?',nm(u)+'\'s old password stops working now. No email is sent: the new temporary password appears here for you to pass on, and they choose their own at next sign-in.',async()=>{const r=await adminFn({action:'reset_password',user_id:u});showPw(nm(u),S.prof[u]?.email||'',r.password)},'Create password');break;
  case'chpw':closeM();S.needPw='change';vSetPw(false);break;
  case'signout':SB.auth.signOut();break;
  case'notice':{const n=S.cfg.notice||{};modal('Announcement',`<label for="f-nt">Message for all members</label><textarea id="f-nt" name="text" rows="5">${esc(n.text||'')}</textarea><p class="mute">Leave it empty and save to remove the announcement.</p>`,async fd=>{await W('cfg/main',{notice:{text:fd.text||'',at:Date.now(),by:S.me}},{});toast(fd.text?'Announcement posted.':'Announcement removed.')},'Save');break}
  case'exp-att':expAttendance();break;
  case'exp-prog':expProgress();break;
  case'exp-lib':expLibrary();break;
  case'lib-fill':libFill(el);break;
  case'lib-search':libSearch(el);break;
  case'lib-save':{const x={doi:normDoi(val('lb-doi')).toLowerCase(),title:val('lb-t'),authors:val('lb-a'),year:val('lb-y'),venue:val('lb-v'),url:val('lb-u'),tags:val('lb-g'),note:val('lb-n'),oa:!!S.fillOa};if(!x.title){toast('Add at least a title.');break}
    busy(el,libSave(x).then(()=>{['lb-doi','lb-t','lb-a','lb-y','lb-v','lb-u','lb-g','lb-n'].forEach(i=>{const e2=document.getElementById(i);if(e2)e2.value=''});S.fillOa=false;toast('Saved to the lab library.')}));break}
  case'lib-add':{const x=S.sr?.[Number(k)];if(x)busy(el,libSave({...x,abstract:undefined,tags:'',note:''}).then(()=>toast('Added to the library.')));break}
  case'lib-del':ask('Remove this paper?','It will be removed from the lab reading list.',()=>W('p/'+u,{lib:{[id]:{del:true}}}));break;
  case'lib-copy':{const x=libItems().find(y=>y.u===u&&y.id===id);if(!x)break;const t=apa(x);const show=()=>modal('APA 7 reference',`<p class="mute">Copy this text. Check the author list against the paper before you cite it.</p><textarea rows="4" readonly>${esc(t)}</textarea>`,null);
    try{navigator.clipboard.writeText(t).then(()=>toast('APA reference copied. Check the author list before citing.'),show)}catch{show()}break}
  case'pf':S.pf=k;render();break;
  case'pj':closeM();go('projects','proj',id);break;
  case'pj-back':S.proj=null;render();break;
  case'pv':S.pv=k;render();break;
  case'gz':S.gz=k;render();break;
  case'pj-new':pjForm();break;
  case'pj-edit':pjForm(S.pj[id]);break;
  case'pj-from-asg':pjForm(null,S.a.find(a=>a.id===id));break;
  case'pj-all':$('#dlgf')?.querySelectorAll('input[name^="m_"]').forEach(x=>x.checked=true);break;
  case'pj-del':ask('Delete this project?','Its lists, tasks and sub-tasks will be deleted for everyone. This cannot be undone.',async()=>{const r=await q(SB.from('projects').delete().match({id}).select()).catch(e=>{fail(e);throw e});if(!r||!r.length){fail({code:'42501'});throw 0}S.proj=null;await reload();toast('Project deleted.')});break;
  case'pj-mem':pjMembers(id);break;
  case'pm-add':{const pid=el.dataset.p,u2=val('pm-u');if(!u2)break;busy(el,ups('project_members',{project_id:pid,user_id:u2,role:'member'},'project_id,user_id').then(()=>reload()).then(()=>{pjMembers(pid);toast(nm(u2)+' added to the project.')}).catch(e=>{fail(e);throw e}));break}
  case'pm-del':{const pid=el.dataset.p;ask('Remove '+nm(u)+' from this project?','They will no longer see the board and will be taken off its tasks.',async()=>{const r=await q(SB.from('project_members').delete().match({project_id:pid,user_id:u}).select()).catch(e=>{fail(e);throw e});if(!r||!r.length){fail({code:'42501'});throw 0}await reload();pjMembers(pid)},'Remove');break}
  case'tk':tkOpen(el.dataset.p,id);break;
  case'tk-new':tkNew(el.dataset.p);break;
  case'tk-add':{const pid=el.dataset.p,t=val('ka-'+id);if(!t){toast('Type a task name first.');document.getElementById('ka-'+id)?.focus();break}
    busy(el,q(SB.from('project_tasks').insert({project_id:pid,list_id:id,title:t,position:nextPos(S.pj[pid],id)}).select()).then(()=>{const e2=document.getElementById('ka-'+id);if(e2)e2.value='';return reload()}).then(()=>document.getElementById('ka-'+id)?.focus()).catch(e=>{fail(e);throw e}));break}
  case'tk-del':{const pid=el.dataset.p,P=S.pj[pid],t=P&&P.tasks.find(x=>x.id===id),ns=P?subsOf(P,id).length:0;ask('Delete this task?',(t?'"'+t.title+'" ':'')+(ns?'and its '+pl(ns,'sub-task')+' ':'')+'will be deleted for everyone.',async()=>{const r=await q(SB.from('project_tasks').delete().match({id}).select()).catch(e=>{fail(e);throw e});if(!r||!r.length){fail({code:'42501'});throw 0}await reload();toast('Task deleted.')});break}
  case'st-add':{const pid=el.dataset.p,t=val('st-t');if(!t){toast('Type the sub-task first.');document.getElementById('st-t')?.focus();break}const u2=val('st-u'),d2=val('st-d'),st=formState();
    busy(el,q(SB.from('project_tasks').insert({project_id:pid,parent_id:id,title:t,assignees:u2?[u2]:[],due_date:d2||null,position:Date.now()/1e3}).select()).then(()=>reload()).then(()=>{tkOpen(pid,id);formRestore(st,['st-t','st-u','st-d']);document.getElementById('st-t')?.focus();toast('Sub-task added.')}).catch(e=>{fail(e);throw e}));break}
  case'ls-add':{const pid=el.dataset.p,t=val('nl-'+pid),P=S.pj[pid];if(!t){toast('Type a list name first.');break}
    busy(el,q(SB.from('project_lists').insert({project_id:pid,title:t,position:Math.max(0,...P.lists.map(l=>Number(l.position)||0))+1}).select()).then(()=>{const e2=document.getElementById('nl-'+pid);if(e2)e2.value='';return reload()}).catch(e=>{fail(e);throw e}));break}
  case'ls-edit':lsEdit(el.dataset.p,id);break;
  case'ls-del':{const pid=el.dataset.p,P=S.pj[pid],to=P&&P.lists.find(x=>x.id!==id);if(!to)break;const cnt=Number(n)||0;
    ask('Delete this list?',cnt?'Its '+pl(cnt,'task')+' will move to "'+to.title+'".':'The list is empty.',async()=>{try{let pos=nextPos(P,to.id);for(const t of mainT(P).filter(t=>(listOf(P,t)||{}).id===id))await upd('project_tasks',{list_id:to.id,position:pos++},{id:t.id});
      const r=await q(SB.from('project_lists').delete().match({id}).select());if(!r||!r.length)throw{code:'42501'}}catch(e){fail(e);await reload();throw e}await reload();toast('List deleted.')});break}
  case'exp-tasks':expTasks(el.dataset.p);break;
  case'pub-new':pubForm();break;
  case'pub-edit':pubForm(pubItems().find(x=>x.u===u&&x.id===id));break;
  case'pub-del':ask('Delete this paper?','It will be removed from the publication pipeline.',()=>W('p/'+u,{pubs:{[id]:{del:true}}}));break;
  }
});

document.addEventListener('change',e=>{const t=e.target;if(t.dataset?.stage){W('p/'+t.dataset.u,{pubs:{[t.dataset.id]:{stage:t.value,upd:Date.now()}}}).then(()=>toast('Moved to '+t.value+'.')).catch(()=>{})}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='lb-filter'){S.lq=t.value;render()}});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset?.sub){const pid=t.dataset.p,P=S.pj[pid],x=P&&P.tasks.find(y=>y.id===t.dataset.sub);if(x)x.done=t.checked;
    upd('project_tasks',{done:t.checked},{id:t.dataset.sub}).then(()=>reloadSoon()).catch(err=>{t.checked=!t.checked;if(x)x.done=t.checked;fail(err)});return}
  if(t.dataset?.tmine){S.tmine=t.checked;render();return}
  if(t.dataset?.pmrole){const pid=t.dataset.p,u=t.dataset.pmrole,prev=S.pj[pid]?.members[u];upd('project_members',{role:t.value},{project_id:pid,user_id:u}).then(()=>{toast(nm(u)+' is now '+(t.value==='lead'?'a lead':'a member')+'.');return reload()}).catch(err=>{t.value=prev;fail(err)})}});
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const t=e.target;
  if(e.key==='Enter'&&t.dataset?.kadd){e.preventDefault();t.parentElement.querySelector('[data-act=tk-add]')?.click();return}
  if(e.key==='Enter'&&t.dataset?.nl){e.preventDefault();t.parentElement.querySelector('[data-act=ls-add]')?.click();return}
  if(e.key==='Enter'&&t.id==='st-t'){e.preventDefault();$('[data-act=st-add]')?.click();return}
  if(t.classList?.contains('kc')){e.preventDefault();tkOpen(t.dataset.p,t.dataset.id)}});
/* Card drag: pointer events (mouse and pen). On touch screens, open the card and change its list. */
let PD=null;
document.addEventListener('pointerdown',e=>{if(e.button!==0||e.pointerType==='touch')return;const c=e.target.closest?.('.kc[data-drag]');if(!c||e.target.closest('button,a,input,select,textarea'))return;PD={id:c.dataset.id,c,x:e.clientX,y:e.clientY,on:false}});
document.addEventListener('pointermove',e=>{if(!PD)return;
  if(!PD.on){if(Math.hypot(e.clientX-PD.x,e.clientY-PD.y)<6)return;PD.on=true;const r=PD.c.getBoundingClientRect();PD.dx=PD.x-r.left;PD.dy=PD.y-r.top;
    const g=PD.c.cloneNode(true);g.classList.add('kghost');g.removeAttribute('data-act');g.removeAttribute('tabindex');g.removeAttribute('role');g.style.width=r.width+'px';document.body.appendChild(g);PD.g=g;PD.c.classList.add('drag');document.body.classList.add('dragging');
    try{PD.c.setPointerCapture(e.pointerId);PD.pid=e.pointerId}catch{}
    const tick=()=>{if(!PD||!PD.on)return;const kb=document.querySelector('.kb');if(kb&&PD.lx!=null){const rr=kb.getBoundingClientRect();if(PD.lx>rr.right-56)kb.scrollLeft+=12;else if(PD.lx<rr.left+56)kb.scrollLeft-=12}requestAnimationFrame(tick)};requestAnimationFrame(tick)}
  PD.lx=e.clientX;
  e.preventDefault();PD.g.style.transform=`translate(${e.clientX-PD.dx}px,${e.clientY-PD.dy}px) rotate(2deg)`;
  const el=document.elementFromPoint(e.clientX,e.clientY),z=el&&el.closest('.kcards');
  document.querySelectorAll('.kcards.over').forEach(x=>{if(x!==z)x.classList.remove('over')});
  let b=null;if(z){z.classList.add('over');for(const k of z.querySelectorAll('.kc')){if(k===PD.c)continue;const r=k.getBoundingClientRect();if(e.clientY<r.top+r.height/2){b=k;break}}}
  if(z!==PD.z||b!==PD.b){document.querySelectorAll('.kph').forEach(x=>x.remove());if(z){const ph=document.createElement('div');ph.className='kph';ph.setAttribute('aria-hidden','true');z.insertBefore(ph,b)}}
  PD.z=z;PD.b=b});
function pdEnd(drop){if(!PD)return;const d=PD;PD=null;document.querySelectorAll('.kph').forEach(x=>x.remove());document.querySelectorAll('.kcards.over').forEach(x=>x.classList.remove('over'));
  if(!d.on)return;document.body.classList.remove('dragging');d.g?.remove();d.c.classList.remove('drag');try{if(d.pid!=null)d.c.releasePointerCapture(d.pid)}catch{}S.noClick=Date.now();
  if(drop&&d.z)moveCard(d.id,d.z.dataset.drop,d.b?d.b.dataset.id:null)}
document.addEventListener('pointerup',()=>pdEnd(true));
document.addEventListener('pointercancel',()=>pdEnd(false));
addEventListener('blur',()=>pdEnd(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&PD)pdEnd(false)},true);
document.addEventListener('change',async e=>{const t=e.target;if(!t.dataset?.roleU)return;const u=t.dataset.roleU,prev=S.prof[u]?.role;
  try{await upd('profiles',{role:t.value},{id:u});toast(nm(u)+' is now '+(t.value==='admin'?'an admin':t.value==='member'?'a member':'inactive')+'.');reloadSoon()}catch(err){fail(err);t.value=prev}});
async function adminFn(body,quiet){const{data,error}=await SB.functions.invoke('admin-users',{body});
  if(error){let m='';try{m=(await error.context?.json())?.error||''}catch{}
    if(!m)m=/Failed to send|fetch|404|not found/i.test(error.message||'')?'The admin-users function is not set up yet (README, step 5). Until then, add people in Supabase: Authentication, Users, Add user.':(error.message||'Request failed');
    if(!quiet)toast(m);throw{message:m,handled:true}}
  if(data?.error){if(!quiet)toast(data.error);throw{message:data.error,handled:true}}return data}
function parseBulk(text){const out=[];for(const raw of String(text||'').split(/\r?\n/)){const line=raw.trim();if(!line)continue;
    const toks=line.split(/\t|\s{2,}|\s*[,;|]\s*|\s+/).filter(Boolean);let email='',sid='',cls='',phone='';const name=[];
    for(const t of toks){if(!email&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t))email=t.toLowerCase();else if(!sid&&/^[A-Za-z]{2,4}\d{5,7}$/.test(t))sid=t.toUpperCase();else if(!cls&&/^[A-Za-z]{1,4}\d{3,5}[A-Za-z]?$/.test(t))cls=t.toUpperCase();else if(!phone&&/^\+?\d[\d.\-]{7,13}$/.test(t))phone=normPhone(t);else if(!email&&!sid)name.push(t)}
    out.push({full_name:name.join(' '),student_id:sid,class_name:cls,email,phone,line,ok:!!email&&name.length>0,exists:!!email&&Object.values(S.prof).some(p=>(p.email||'').toLowerCase()===email)})}
  return out}
function bulkTable(rows,withPw){return `<div class="scroll"><table><thead><tr><th>Name</th><th>Student ID</th><th>Class</th><th>Email</th><th>Phone</th><th>${withPw?'Temporary password':'Status'}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.full_name||'?')}</td><td>${esc(r.student_id)}</td><td>${esc(r.class_name)}</td><td>${esc(r.email||'?')}</td><td>${esc(r.phone)}</td><td>${withPw?(r.password?`<code>${esc(r.password)}</code>`:`<span class="badge bad">${esc(r.error||'not created')}</span>`):(!r.ok?'<span class="badge bad">Needs a name and email</span>':r.exists?'<span class="badge">Already has an account</span>':'<span class="badge ok">Ready</span>')}</td></tr>`).join('')}</tbody></table></div>`}
let BULK=[];
async function bulkRun(btn){const todo=BULK.filter(r=>r.ok&&!r.exists);if(!todo.length){toast('Nothing new to create.');return}btn.disabled=true;
  for(let i=0;i<todo.length;i++){const r=todo[i];btn.textContent='Creating '+(i+1)+' of '+todo.length+'…';
    try{const d=await adminFn({action:'create',email:r.email,full_name:r.full_name,role:'member',student_id:r.student_id,class_name:r.class_name,phone:r.phone},true);r.password=d.password}catch(e){r.error=e.message}}
  reloadSoon();const made=todo.filter(r=>r.password);const url=location.origin+location.pathname;
  S.bulkDone=todo;
  modal('Accounts created',`<p>${made.length} of ${todo.length} accounts were created. Each person signs in at <b>${esc(url)}</b> with their email and the temporary password below, then chooses their own password. The passwords are shown only now, so copy or download them before closing.</p>${bulkTable(todo,true)}`,null,'','<button type="button" class="btn" data-act="bulk-csv">Download CSV</button><button type="button" class="btn pri" data-act="bulk-copy">Copy as text</button>')}
function showPw(name,email,pw){const msgTxt=`FRD Lab Hub: ${location.origin+location.pathname}\nEmail: ${email}\nTemporary password: ${pw}\nYou will be asked to choose your own password when you sign in.`;
  modal('Temporary password',`<p>Give these sign-in details to <b>${esc(name||email)}</b>. The password is shown only once.</p><div class="pw">${esc(pw)}</div><label for="pw-msg">Message to send</label><textarea id="pw-msg" rows="5" readonly>${esc(msgTxt)}</textarea>`,null,'','<button type="button" class="btn pri" data-act="copy-pw">Copy message</button>')}
async function accAdd(btn){const action='create';const email=val('n-email'),full_name=val('n-name'),role=$('#n-role')?.value||'member',student_id=val('n-sid'),class_name=val('n-cls'),phone=normPhone(val('n-ph'));
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){toast('Enter a valid email address.');return}btn.disabled=true;
  try{const r=await adminFn({action,email,full_name,role,student_id,class_name,phone});reloadSoon();showPw(full_name,email,r.password)}catch(e){}finally{btn.disabled=false}}
document.addEventListener('click',e=>{if(e.target.closest('[data-act=copy-pw]')){const t=$('#pw-msg');try{navigator.clipboard.writeText(t.value).then(()=>toast('Copied.'),()=>{t.select()})}catch{t.select()}}});

/* ---------- start ---------- */
function loadNames(){}
/* ---------- load & auth ---------- */
const AUTH_TYPE=(()=>{try{return new URLSearchParams(location.hash.slice(1)).get('type')}catch{return null}})();
let rlT,rlP=null,rlQ=null,chan=null;
function reloadSoon(){clearTimeout(rlT);rlT=setTimeout(reload,250)}
function reload(){if(!SB||!S.me)return Promise.resolve();
  if(rlP){if(!rlQ)rlQ=rlP.then(()=>{rlQ=null;return reload()});return rlQ}
  rlP=(async()=>{try{const D=await fetchAll();build(D);S.ready=true;render()}catch(e){fail(e)}})().finally(()=>{rlP=null});return rlP}
async function fetchAll(){const since=iso(addD(new Date(),-200));const T={profiles:SB.from('profiles').select('*'),settings:SB.from('settings').select('*'),assignments:SB.from('assignments').select('*'),meetings:SB.from('meetings').select('*'),rsvps:SB.from('rsvps').select('*'),attendance:SB.from('attendance').select('*').gte('day',since),topics:SB.from('topics').select('*'),comments:SB.from('comments').select('*'),library:SB.from('library').select('*'),papers:SB.from('papers').select('*'),reports:SB.from('reports').select('*'),report_feedback:SB.from('report_feedback').select('*'),submissions:SB.from('submissions').select('*'),projects:SB.from('projects').select('*'),project_members:SB.from('project_members').select('*'),project_lists:SB.from('project_lists').select('*'),project_tasks:SB.from('project_tasks').select('*'),grades:SB.from('grades').select('*'),directions:SB.from('directions').select('*'),contacts:SB.from('contacts').select('*')};
  T.admin_audit=SB.from('admin_audit').select('*');
  const k=Object.keys(T),r=await Promise.all(k.map(x=>pageAll(T[x]))),D={};k.forEach((x,i)=>{D[x]=r[i]});return D}
// Supabase returns at most 1000 rows per request; read every page so nothing is silently cut off.
async function pageAll(qb){const out=[];for(let a=0;a<200000;a+=1000){const r=await qb.range(a,a+999);if(r.error)throw r.error;const d=r.data||[];out.push(...d);if(d.length<1000)break}return out}
const ms=t=>t?Date.parse(t)||0:0;
function build(D){S.prof={};S.names={};for(const p of D.profiles){S.prof[p.id]=p;S.names[p.id]=p.full_name||p.email||'Member'}
  const me=S.prof[S.me]||{};S.admin=S.owner=me.role==='admin';
  const st=D.settings[0]||{};S.cfg={minDays:st.min_days??1,days:Array.isArray(st.open_days)?st.open_days:[0,1,2,3,4,5],direction:st.direction||'',goals:st.goals||'',campusOnly:!!st.campus_only,nets:Array.isArray(st.campus_nets)?st.campus_nets:[],wifi:st.campus_wifi||'Gre_Guest',notice:st.notice?{text:st.notice,at:ms(st.notice_at),by:st.notice_by}:null};
  S.audit=(D.admin_audit||[]).slice().sort((a,b)=>String(b.at).localeCompare(String(a.at)));
  S.contact={};for(const c of D.contacts||[])S.contact[c.user_id]=c.phone;
  S.m={};for(const p of D.profiles)if(p.role==='member')S.m[p.id]={role:p.lab_role,topic:p.topic,sid:p.student_id,cls:p.class_name||'',joined:ms(p.created_at),att:{},rsvp:{}};
  for(const a of D.attendance)if(S.m[a.user_id])S.m[a.user_id].att[a.day]={reg:!!a.booked,in:ms(a.checked_in_at),mk:!!a.confirmed_by};
  for(const r of D.rsvps)if(S.m[r.user_id])S.m[r.user_id].rsvp[r.meeting_id]=r.status;
  const P=u=>S.p[u]||(S.p[u]={topics:{},cm:{},lib:{},pubs:{}}),R=u=>S.r[u]||(S.r[u]={reps:{},subs:{},grades:{},fb:{},note:{}});S.p={};S.r={};
  for(const t of D.topics)P(t.created_by).topics[t.id]={title:t.title,body:t.body,at:ms(t.created_at)};
  for(const c of D.comments)P(c.created_by).cm[c.id]={th:c.thread,text:c.body,at:ms(c.created_at),t:c.by_manager?1:0};
  for(const l of D.library)P(l.created_by).lib[l.id]={doi:l.doi,title:l.title,authors:l.authors,year:l.year,venue:l.venue,url:l.url,tags:l.tags,note:l.note,oa:l.is_oa,at:ms(l.created_at)};
  for(const x of D.papers)P(x.created_by).pubs[x.id]={title:x.title,stage:x.stage,venue:x.venue,authors:x.coauthors,deadline:x.deadline||'',link:x.link,note:x.note,at:ms(x.created_at),upd:ms(x.updated_at)};
  for(const x of D.reports)R(x.user_id).reps[x.week_start]={done:x.done,next:x.next_steps,issue:x.issues,pct:x.progress,link:x.link,at:ms(x.updated_at)};
  for(const x of D.report_feedback)R(x.user_id).fb[x.week_start]={text:x.body,at:ms(x.updated_at)};
  for(const x of D.submissions)R(x.user_id).subs[x.assignment_id]={text:x.body,link:x.link,at:ms(x.submitted_at)};
  for(const x of D.grades)R(x.user_id).grades[x.assignment_id]={score:x.score==null?'':Number(x.score),fb:x.feedback,at:ms(x.graded_at)};
  for(const x of D.directions)R(x.user_id).note={text:x.body,at:ms(x.updated_at)};
  S.a=D.assignments.map(x=>normA({kind:x.kind,title:x.title,desc:x.description,link:x.link,due:x.due,pts:x.points,at:ms(x.created_at),by:x.created_by},x.id));
  S.pj={};for(const x of D.projects||[])S.pj[x.id]={...x,title:str(x.title),description:str(x.description),members:{},lists:[],tasks:[]};
  for(const x of D.project_members||[])if(S.pj[x.project_id])S.pj[x.project_id].members[x.user_id]=x.role;
  for(const x of D.project_lists||[])if(S.pj[x.project_id])S.pj[x.project_id].lists.push(x);
  for(const x of D.project_tasks||[])if(S.pj[x.project_id])S.pj[x.project_id].tasks.push({...x,title:str(x.title),assignees:Array.isArray(x.assignees)?x.assignees:[]});
  for(const x of Object.values(S.pj)){x.lists.sort((a,b)=>a.position-b.position);x.tasks.sort((a,b)=>a.position-b.position)}
  S.mt=D.meetings.map(x=>normM({title:x.title,date:x.day,start:x.start_time,end:x.end_time,place:x.place,link:x.link,agenda:x.agenda,at:ms(x.created_at),by:x.created_by},x.id)).filter(x=>x.date)}
function showApp(on){$('#app').hidden=!on;$('#auth').hidden=on}
function authCard(inner){$('#auth').innerHTML=`<div class="authcard"><div class="authtop"></div><div class="authbody"><div class="logo">${ic('book',26)}<span>FRD Lab</span></div>${inner}</div></div><p class="foot" style="text-align:center;margin:0">Fintech R&amp;D Lab, University of Greenwich Vietnam, Hanoi campus.</p>`;showApp(false);setTimeout(()=>$('#auth input')?.focus(),0)}
function vLogin(note=''){authCard(`<h1 class="at">Sign in</h1><p class="mute">Use the account your lab admin created for you.</p><form id="loginf" novalidate>${note?`<p class="amsg">${esc(note)}</p>`:''}<label for="l-e">Email</label><input id="l-e" type="email" autocomplete="username" required><label for="l-p">Password</label><input id="l-p" type="password" autocomplete="current-password" required><div class="acts" style="justify-content:space-between"><button type="button" class="link" data-auth="forgot">Forgot password?</button><button class="btn pri" type="submit">Sign in</button></div></form>`)}
function vForgot(){authCard(`<h1 class="at">Forgot your password?</h1><p>Ask a lab admin (Dr. Nguyễn Thế Lâm Tùng or Ben) for a new temporary password. No email is involved: the admin creates it in Settings and passes it to you.</p><p class="mute">Sign in with the temporary password and you will be asked to choose your own straight away.</p><div class="acts" style="justify-content:flex-start"><button type="button" class="btn pri" data-auth="login">Back to sign in</button></div>`)}
function vSetPw(first){authCard(`<h1 class="at">${first?'Choose your password':'Set a new password'}</h1><p class="mute">Use at least 8 characters. Only you will know it.</p><form id="setpwf" novalidate><label for="n-p">New password</label><input id="n-p" type="password" autocomplete="new-password" required><label for="n-p2">Repeat the password</label><input id="n-p2" type="password" autocomplete="new-password" required><div class="acts">${S.started?'<button type="button" class="btn" data-auth="back">Cancel</button>':''}<button class="btn pri" type="submit">Save password</button></div></form>`)}
function vNoConfig(){authCard(`<h1 class="at">Almost there</h1><p>This copy of FRD Lab Hub is not connected to its database yet. Add the Supabase Project URL and publishable key to <code>config.js</code>, as described in README.md.</p>`)}
function vInactive(){authCard(`<h1 class="at">No access yet</h1><p class="mute">Your account exists but is not active in FRD Lab. Ask a lab admin to activate it.</p><div class="acts"><button class="btn" data-auth="signout">Sign out</button></div>`)}
function authErr(f,err){let m=err?.message||'Something went wrong. Try again.';if(/invalid login/i.test(m))m='Email or password is not correct.';else if(/rate limit/i.test(m))m='Too many emails were sent. Try again in an hour, or ask an admin to reset your password.';else if(/Failed to fetch/i.test(m))m='No connection to the lab server. Check your internet.';else if(/should be different|pw_unchanged/i.test(m))m='Choose a password different from the temporary one.';else if(/temp_expired/.test(m))m='Your temporary password is older than 72 hours, so it no longer works. Ask a lab admin for a new one.';
  let p=f.querySelector('.amsg');if(!p){p=document.createElement('p');p.className='amsg';f.prepend(p)}p.textContent=m}
document.addEventListener('submit',async e=>{const f=e.target;if(!['loginf','setpwf'].includes(f.id))return;e.preventDefault();const b=f.querySelector('[type=submit]');b.disabled=true;
  try{if(f.id==='loginf'){const{error}=await SB.auth.signInWithPassword({email:val('l-e'),password:$('#l-p').value});if(error)throw error;await start()}
    if(f.id==='setpwf'){const p1=$('#n-p').value,p2=$('#n-p2').value;if(p1.length<8)throw{message:'Use at least 8 characters.'};if(p1!==p2)throw{message:'The two passwords do not match.'};
      const{error}=await SB.auth.updateUser({password:p1});if(error)throw error;const{error:e2}=await SB.from('profiles').update({must_change_password:false}).eq('id',S.me).select();if(e2)throw e2;S.needPw=false;S.started=null;toast('Password saved.');await start()}}
  catch(err){authErr(f,err)}finally{b.disabled=false}});
document.addEventListener('click',e=>{const a=e.target.closest('[data-auth]');if(!a)return;const k=a.dataset.auth;if(k==='forgot')vForgot();if(k==='login')vLogin();if(k==='signout')SB.auth.signOut();if(k==='back'){S.needPw=false;showApp(true);render()}});
async function start(){const{data:{session}}=await SB.auth.getSession();if(!session){vLogin();return}
  if(S.started===session.user.id&&!S.needPw)return;S.me=session.user.id;S.email=session.user.email;
  const{data:prof,error}=await SB.from('profiles').select('*').eq('id',S.me).maybeSingle();
  if(error){vLogin('Could not load your account: '+error.message);return}
  if(!prof||prof.role==='inactive'){vInactive();return}
  if(S.needPw||prof.must_change_password){S.me=session.user.id;vSetPw(S.needPw==='invite'||prof.must_change_password);return}
  S.started=S.me;showApp(true);route();await reload();
  if(!chan){chan=SB.channel('frd-lab').on('postgres_changes',{event:'*',schema:'public'},reloadSoon).subscribe()}}
function stop(){S.started=null;S.me=null;S.ready=false;S.prof={};S.m={};S.p={};S.r={};S.a=[];S.mt=[];S.pj={};S.proj=null;if(chan){SB.removeChannel(chan);chan=null}}
addEventListener('focus',()=>{if(S.started)reloadSoon()});
async function boot(){if(!CFG.supabaseUrl||!CFG.supabaseKey||!window.supabase){vNoConfig();return}
  SB=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey,{auth:{flowType:'implicit',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  if(AUTH_TYPE==='invite'||AUTH_TYPE==='recovery')S.needPw=AUTH_TYPE;
  SB.auth.onAuthStateChange((ev,session)=>{if(ev==='PASSWORD_RECOVERY'){S.needPw='recovery';setTimeout(start,0)}else if(ev==='SIGNED_OUT'){stop();vLogin()}});
  await SB.auth.getSession();
  if(/access_token|type=|error_description/.test(location.hash)){const err=new URLSearchParams(location.hash.slice(1)).get('error_description');history.replaceState(null,'',location.pathname+location.search+'#overview');if(err){vLogin(err.replace(/\+/g,' '));return}}
  S.db=dbShim;S.dl=true;start()}
boot();
}
