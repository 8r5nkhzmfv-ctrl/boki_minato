(()=>{'use strict';
const NV=window.NV,$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const H=h=>{const d=document.createElement('div');d.innerHTML=h;return d};
const K='tx45v1';
const S={ep:null,items:[],i:0,cur:0,seen:{},log:[],auto:false,typing:false,full:'',n:0,tm:null,at:null,stage:[],sp:null,mod:false,card:false,ban:false,
  set:{spd:30,vol:.5,bgm:true,vert:false,fs:1}};
const save=()=>{try{localStorage.setItem(K,JSON.stringify({ep:S.ep&&S.ep.id,i:S.cur,seen:S.seen,set:S.set}))}catch(e){}};
const load=()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}};

/* ---------- キャラ ---------- */
const hc=n=>{let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%360;return `hsl(${h} 35% 45%)`};
const ch=n=>NV.chars[n]||{c:hc(n),h:'#333',a:''};
function sprite(n){const c=ch(n);return `<svg viewBox="0 0 120 220"><ellipse cx="60" cy="214" rx="40" ry="5" fill="#0003"/><path d="M16 214Q16 124 60 114Q104 124 104 214Z" fill="${c.c}"/>${c.a=='apron'?'<path d="M40 214L44 132Q60 140 76 132L80 214Z" fill="#fffa"/>':''}<rect x="50" y="92" width="20" height="26" rx="6" fill="#f2d3b5"/><circle cx="60" cy="70" r="30" fill="#f6dcc0"/><path d="M29 68Q30 33 60 33Q91 33 91 68Q80 50 60 50Q42 50 29 68Z" fill="${c.h}"/><circle cx="49" cy="74" r="3" fill="#333"/><circle cx="71" cy="74" r="3" fill="#333"/><path d="M53 86Q60 91 67 86" stroke="#a55" stroke-width="2" fill="none"/>${c.a=='glasses'?'<g fill="none" stroke="#333" stroke-width="2"><circle cx="49" cy="74" r="8"/><circle cx="71" cy="74" r="8"/><path d="M57 74h6"/></g>':''}</svg>`}
function drawStage(){$('#stage').innerHTML=S.stage.map((n,i)=>`<div class="sp${n==S.sp?' on':''}" style="left:${S.stage.length==1?50:(i?78:22)}%">${sprite(n)}</div>`).join('')}
function spk(n){if(n&&!S.stage.includes(n)){S.stage.push(n);if(S.stage.length>2)S.stage.shift()}S.sp=n;drawStage()}

/* ---------- 背景（SVG） ---------- */
const bk=(x,y,n)=>Array.from({length:n},(_,i)=>{const h=8+i%3*2;return `<rect x="${x+i*5}" y="${y-h}" width="4" height="${h}" fill="${['#c0504d','#4f81bd','#9bbb59','#f79646','#8064a2'][i%5]}"/>`}).join('');
const G=(id,a,b)=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="160" height="90" fill="url(#${id})"/>`;
const BG={
shop_morning:()=>G('s1','#fff0d2','#f0c48a')+`<rect y="64" width="160" height="26" fill="#a9763f"/><rect x="104" y="10" width="42" height="36" fill="#cfeaf7" stroke="#8a5a2b" stroke-width="2"/><path d="M125 10v36M104 28h42" stroke="#8a5a2b" stroke-width="1.5"/><path d="M104 10L84 64H118L146 10Z" fill="#fff" opacity=".35"/><rect x="8" y="26" width="74" height="2.5" fill="#7a4e24"/><rect x="8" y="46" width="74" height="2.5" fill="#7a4e24"/>${bk(12,26,13)}${bk(12,46,11)}<rect x="0" y="60" width="160" height="6" fill="#7a4e24"/>`,
shop_night:()=>G('s2','#14213d','#2a3a5c')+`<radialGradient id="l2"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient><circle cx="80" cy="28" r="48" fill="url(#l2)"/><rect y="64" width="160" height="26" fill="#3a2a1c"/><rect x="8" y="26" width="60" height="2.5" fill="#241a10"/>${bk(12,26,10)}<rect x="74" y="8" width="12" height="6" fill="#f3d27a"/>`,
wholesale:()=>G('s3','#e8d7b8','#c9a877')+`<rect y="66" width="160" height="24" fill="#8a6a3f"/>${[0,1,2].map(r=>[0,1,2,3,4,5].map(c=>`<rect x="${8+c*25}" y="${10+r*17}" width="22" height="14" fill="#d9b779" stroke="#8a6a3f"/>`).join('')).join('')}<rect x="0" y="58" width="160" height="6" fill="#6b4e2a"/>`,
street:()=>G('s4','#bfe0f5','#fbe9c8')+`<rect y="70" width="160" height="20" fill="#8c8c8c"/>${[0,1,2,3].map(i=>`<rect x="${4+i*40}" y="${24+(i%2)*6}" width="34" height="46" fill="${['#e0b98a','#d98f7a','#9bbf9b','#c9b6dd'][i]}"/><rect x="${4+i*40}" y="${24+(i%2)*6}" width="34" height="8" fill="#b8453a"/><rect x="${10+i*40}" y="${44+(i%2)*6}" width="22" height="26" fill="#fff" opacity=".6"/>`).join('')}`,
desk:()=>G('s5','#1b1410','#3a2a1c')+`<radialGradient id="l5"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".85"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient><ellipse cx="80" cy="64" rx="70" ry="34" fill="url(#l5)"/><rect y="62" width="160" height="28" fill="#4a3320"/><rect x="42" y="52" width="76" height="30" fill="#f1e6c8"/><path d="M80 52v30" stroke="#8a7a58"/>${[0,1,2,3].map(i=>`<path d="M48 ${58+i*5}h26M86 ${58+i*5}h26" stroke="#8a7a58" stroke-width=".6"/>`).join('')}`,
plain:()=>G('s0','#2a2118','#14100c')
};
let bgi=0;
function setBg(id){const ls=document.querySelectorAll('.bl'),a=ls[bgi],b=ls[bgi^1];b.innerHTML=`<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">${(BG[id]||BG.plain)()}</svg>`;b.classList.add('on');a.classList.remove('on');bgi^=1;S.stage=[];S.sp=null;drawStage()}

/* ---------- 音（WebAudio合成） ---------- */
const A={ctx:null,master:null,on:true,mood:null,timer:null};
function ac(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!A.ctx){A.ctx=new C();A.master=A.ctx.createGain();A.master.gain.value=S.set.vol;A.master.connect(A.ctx.destination)}if(A.ctx.state=='suspended')A.ctx.resume();return A.ctx}
function tone(f,t,d,ty,g){const c=A.ctx,o=c.createOscillator(),e=c.createGain();o.type=ty;o.frequency.value=f;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+.03);e.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(e);e.connect(A.master);o.start(t);o.stop(t+d+.05)}
function noise(t,d,f,g){const c=A.ctx,b=c.createBuffer(1,Math.max(1,c.sampleRate*d|0),c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource(),fl=c.createBiquadFilter(),e=c.createGain();fl.type='bandpass';fl.frequency.value=f;e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);s.buffer=b;s.connect(fl);fl.connect(e);e.connect(A.master);s.start(t)}
function se(n){if(!A.on||!ac())return;const t=A.ctx.currentTime;
  if(n=='coin'){tone(1320,t,.25,'square',.03);tone(1760,t+.08,.4,'square',.03)}
  else if(n=='bell'){tone(1568,t,1.1,'sine',.08);tone(2093,t,.8,'sine',.05)}
  else if(n=='stamp'){tone(90,t,.25,'sine',.28);noise(t,.08,800,.12)}
  else if(n=='paper'){noise(t,.25,3000,.07)}
  else if(n=='pop'){tone(660,t,.12,'sine',.07)}}
const MOODS={
 calm:{r:261.63,sc:[0,2,4,7,9,12],bpm:58,ch:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]]},
 night:{r:220,sc:[0,3,5,7,10,12],bpm:50,ch:[[0,3,7],[-4,0,3],[-2,2,5],[0,3,7]]},
 tense:{r:196,sc:[0,1,5,7,8,12],bpm:72,ch:[[0,3,6],[1,5,8],[0,3,6],[-1,2,6]]},
 warm:{r:293.66,sc:[0,2,4,7,9,12],bpm:66,ch:[[0,4,7],[7,11,14],[9,12,16],[5,9,12]]}};
function startBgm(){clearInterval(A.timer);const M=MOODS[A.mood];if(!A.on||!M||!ac())return;let nt=A.ctx.currentTime+.15,b=0,ci=0,mi=2;const sp=60/M.bpm;
  A.timer=setInterval(()=>{while(nt<A.ctx.currentTime+.6){if(b%4==0){M.ch[ci++%M.ch.length].forEach(n=>tone(M.r/2*2**(n/12),nt,sp*4.2,'triangle',.045))}
    if(Math.random()<.6){mi=Math.max(0,Math.min(M.sc.length-1,mi+Math.floor(Math.random()*3)-1));tone(M.r*2**(M.sc[mi]/12),nt,sp*1.8,'sine',.055)}
    nt+=sp;b++}},200)}
const bgm=m=>{A.mood=m;startBgm()};

/* ---------- 取引ボード ---------- */
const KD={g:['物','#b07a3c'],m:['金','#b8921f'],n:['手形','#3f78a6'],s:['役務','#7a5ba8'],k:['債権','#b8453a']};
const B={pcs:[],run:0,tm:null};
const pc=(k,tag,l)=>{const e=document.createElement('div');e.className='pc '+k;e.style.setProperty('--c',(KD[k]||['','#b8453a'])[1]);e.innerHTML=`<b>${tag||'約束'}</b><span>${esc(l)}</span>`;return e};
function lay(){const X={L:30,R:70,M:50};['L','R','M'].forEach(s=>{B.pcs.filter(p=>p.side==s&&!p.gone).forEach((p,i)=>{p.el.style.left=(X[s]+((i/3)|0)*(s=='R'?9:-9))+'%';p.el.style.top=(62+(i%3)*40)+'px'})})}
function mv(k,d,l){let p=B.pcs.find(p=>p.k==k&&p.label==l&&!p.gone&&p.side!=d);
  if(!p){const el=pc(k,KD[k][0],l);$('#bst').appendChild(el);p={k,label:l,side:d=='L'?'R':'L',el};B.pcs.push(p);el.classList.add('nt');lay();el.getBoundingClientRect();el.classList.remove('nt')}
  p.side=d;B.pcs=B.pcs.filter(x=>x!==p).concat(p);lay();se(k=='m'?'coin':'paper')}
function bdRun(b){const st=$('#bst');B.run++;const me=B.run;clearTimeout(B.tm);B.pcs=[];
  st.innerHTML=`<div class="actor L">${sprite(b.L)}<i>${esc(b.L)}</i></div><div class="actor R">${sprite(b.R)}<i>${esc(b.R)}</i></div>${b.M?`<div class="actor M">${sprite(b.M)}<i>${esc(b.M)}</i></div>`:''}<div class="tm"></div>`;
  $('#bcap').textContent='';$('#brep').hidden=true;let i=0;
  const ap=raw=>{const[k,l='',c='']=raw.replace(/^&/,'').split('|');
    if(k.length==3&&'gmnsk'.includes(k[0])&&k[1]=='>')mv(k[0],k[2],l);
    else if(k=='p+'){const el=pc('p','',l);el.classList.add('p');st.appendChild(el);B.pcs.push({k:'p',label:l,side:'C',el});se('stamp')}
    else if(k=='p-'){const p=B.pcs.filter(p=>p.k=='p'&&!p.gone).pop();if(p){p.gone=true;p.el.classList.add('gone')}se('pop')}
    else if(k=='~'){const t=st.querySelector('.tm');t.textContent=l;t.classList.add('on')}
    if(c)$('#bcap').textContent=c};
  const nx=()=>{if(me!=B.run)return;if(i>=b.s.length){$('#brep').hidden=false;return}
    ap(b.s[i++]);while(i<b.s.length&&b.s[i][0]=='&')ap(b.s[i++]);B.tm=setTimeout(nx,1900)};
  B.tm=setTimeout(nx,500)}

/* ---------- 型カード（振り返り・まとめ・仕訳） ---------- */
function card(n){const t=S.ep.types[n],m=NV.types[n-1],c=NV.groups[m[0]],AX=['何が動く','いつ決済','何で決済','債権債務'];S.card=true;S.seen[n]=1;save();
  const el=$('#card');
  el.innerHTML=`<div class="cd" style="--c:${c[1]}"><div class="tag">取引の型 #${n} ／ ${c[0]}</div><h2>${esc(m[1])}</h2><div id="bst"></div><div id="bcap"></div><button id="brep" hidden>↻ 図をもう一度</button>
<section class="fi" style="animation-delay:.3s"><h3>振り返り</h3><ol>${t.rev.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>
<section class="fi" style="animation-delay:.8s"><h3>まとめ</h3><p class="ess">${esc(t.ess)}</p><div class="ax">${t.ax.map((x,i)=>`<div><small>${AX[i]}</small>${esc(x)}</div>`).join('')}</div><p class="df">${esc(t.diff)}</p></section>
<details class="fi" style="animation-delay:1.3s"><summary>仕訳を見る</summary><table>${t.je.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</table></details>
<button id="cnext">つぎへ ▸</button></div>`;
  el.hidden=false;el.scrollTop=0;
  $('#cnext').onclick=()=>{B.run++;clearTimeout(B.tm);el.hidden=true;S.card=false;play()};
  $('#brep').onclick=()=>bdRun(t.bd);bdRun(t.bd)}
function banner(n){const m=NV.types[n-1],c=NV.groups[m[0]],b=$('#banner');b.innerHTML=`<small>取引の型 #${n}</small><h1>${esc(m[1])}</h1><small style="color:${c[1]}">${c[0]}</small>`;b.classList.add('on');S.ban=true;se('stamp');
  const done=()=>{if(!S.ban)return;S.ban=false;b.classList.remove('on');setTimeout(play,400)};b.onclick=done;setTimeout(done,2200)}

/* ---------- 台本 ---------- */
function parse(src){return src.split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('//')).map(l=>{
  if(l[0]=='@'){const m=l.slice(1).split(/\s+/);return{k:'@',c:m[0],a:m.slice(1).join(' ')}}
  const m=l.match(/^([^\s「」（）@。、！？…]{1,8})([「（].*[」）])$/);
  return m?{k:'d',n:m[1],t:m[2]}:{k:'n',t:l}})}
function dir(it){const a=it.a;switch(it.c){case'bg':setBg(a);break;case'bgm':bgm(a=='off'?null:a);break;case'se':se(a);break;case'clear':S.stage=[];S.sp=null;drawStage();break;case'type':banner(+a);return 1;case'end':card(+a);return 1}return 0}
function play(){clearTimeout(S.at);for(;;){const it=S.items[S.i];if(!it){endEp();return}S.cur=S.i++;if(it.k=='@'){if(dir(it))return;continue}show(it);return}}
function show(it){const pl=$('#plate');if(it.k=='d'){pl.textContent=it.n;pl.style.setProperty('--c',ch(it.n).c);spk(it.n)}else{pl.textContent='';spk(null)}
  S.log.push([it.k=='d'?it.n:'',it.t]);if(S.log.length>300)S.log.shift();typeText(it.t);save()}
function typeText(t){const el=$('#txt');clearInterval(S.tm);S.full=t;S.n=0;S.typing=true;$('#cur').hidden=true;el.scrollLeft=0;
  if(!S.set.spd){fin();return}el.textContent='';S.tm=setInterval(()=>{S.n++;el.textContent=t.slice(0,S.n);if(S.n>=t.length)fin()},S.set.spd)}
function fin(){clearInterval(S.tm);S.typing=false;$('#txt').textContent=S.full;$('#cur').hidden=false;if(S.auto)S.at=setTimeout(adv,900+S.full.length*55)}
const busy=()=>S.mod||S.card||S.ban||!$('#title').hidden;
function adv(){if(busy()||!S.ep)return;if(S.typing){fin();return}play()}
function endEp(){const idx=NV.eps.findIndex(e=>e.id==S.ep.id),nx=NV.eps[idx+1],el=$('#card');S.card=true;
  el.innerHTML=`<div class="cd end" style="--c:#c9822b"><div class="tag">第${idx+1}話</div><h2>${esc(S.ep.title)}</h2><p>おわり</p>${nx?`<button id="e-next">次の話へ ▸ 第${idx+2}話『${esc(nx.t)}』</button>`:'<p>つづきは準備中です。</p>'}<button id="e-map">型マップを見る</button><button id="e-top">タイトルへ</button></div>`;el.hidden=false;
  const cl=()=>{el.hidden=true;S.card=false};
  if(nx)$('#e-next').onclick=()=>{cl();startEp(nx.id,0)};
  $('#e-map').onclick=()=>{cl();mapView()};$('#e-top').onclick=()=>{cl();showTitle()}}
function loadEp(id,cb){NV.E=NV.E||{};if(NV.E[id])return cb(NV.E[id]);const P=['episodes/'+id+'.js',id+'.js'];let k=0;const next=()=>++k<P.length?go():cb(null);
  const go=()=>{const s=document.createElement('script');s.src=P[k]+'?v='+(NV.v||1);s.onload=()=>NV.E[id]?cb(NV.E[id]):next();s.onerror=()=>{s.remove();next()};document.head.appendChild(s)};go()}
function startEp(id,i){i=i||0;loadEp(id,e=>{if(!e){const m='話を読み込めません：episodes/'+id+'.js が見つかりません。フォルダ配置を確認してください。';$('#plate').textContent='';$('#txt').textContent=m;return toast(m)}e.id=id;S.ep=e;S.items=parse(e.script);S.i=i;S.cur=i;S.log=[];S.stage=[];S.sp=null;$('#txt').textContent='';$('#plate').textContent='';
  let bg=null,bm=null;for(let j=0;j<i&&j<S.items.length;j++){const t=S.items[j];if(t.k=='@'){if(t.c=='bg')bg=t.a;if(t.c=='bgm')bm=t.a}}
  setBg(bg||'plain');bgm(bm&&bm!='off'?bm:null);play()})}

/* ---------- メニュー ---------- */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}
function modal(t,node){$('#mt').textContent=t;const b=$('#mb');b.innerHTML='';b.appendChild(node);$('#mod').hidden=false;S.mod=true}
function closeMod(){$('#mod').hidden=true;S.mod=false}
function logView(){modal('ログ（新しい順）',H(S.log.slice().reverse().map(l=>`<p>${l[0]?`<b>${esc(l[0])}</b>`:''}${esc(l[1])}</p>`).join('')||'まだありません'))}
function mapView(){let h=`<p>点灯＝見終えた型（${Object.keys(S.seen).length}/45）</p>`;
  Object.keys(NV.groups).forEach(k=>{const g=NV.groups[k];h+=`<h4 style="color:${g[1]}">${g[0]}</h4><div class="grid">`;
    NV.types.forEach((t,i)=>{if(t[0]==k){const n=i+1,ep=NV.eps.find(e=>e.ty.includes(n));h+=`<button class="cell${S.seen[n]?' on':''}${ep?'':' no'}" data-n="${n}" style="--c:${g[1]}"><b>#${n}</b><span>${esc(t[1])}</span></button>`}});h+='</div>'});
  const w=H(h);w.querySelectorAll('.cell').forEach(b=>b.onclick=()=>{const n=+b.dataset.n,ep=NV.eps.find(e=>e.ty.includes(n));if(!ep)return toast('この型は未作成です');ac();closeMod();$('#title').hidden=true;startEp(ep.id,0)});modal('型マップ',w)}
function epsView(){const w=H(NV.eps.map((e,i)=>`<button class="row" data-id="${e.id}">第${i+1}話『${esc(e.t)}』<br><small>型 ${e.ty.map(n=>'#'+n+' '+NV.types[n-1][1]).join(' ／ ')}</small></button>`).join('')+'<p><small>未作成の話は、作成後にここへ追加されます。</small></p>');
  w.querySelectorAll('.row').forEach(b=>b.onclick=()=>{ac();closeMod();$('#title').hidden=true;startEp(b.dataset.id,0)});modal('話の一覧',w)}
function setView(){const w=H(`<label>文字送り<select id="s-spd"><option value="55">ゆっくり</option><option value="30">ふつう</option><option value="12">はやい</option><option value="0">一括</option></select></label>
<label>文字サイズ<select id="s-fs"><option value="0.9">小</option><option value="1">中</option><option value="1.2">大</option></select></label>
<label>音量<input id="s-vol" type="range" min="0" max="1" step=".05"></label>
<label>BGM・効果音<input id="s-bgm" type="checkbox"></label>
<label>縦書き（試験機能）<input id="s-v" type="checkbox"></label>
<button class="row dg" id="s-reset">記録（しおり・既読）を消す</button>`);
  const q=s=>w.querySelector(s);q('#s-spd').value=S.set.spd;q('#s-fs').value=S.set.fs;q('#s-vol').value=S.set.vol;q('#s-bgm').checked=S.set.bgm;q('#s-v').checked=S.set.vert;
  q('#s-spd').onchange=e=>{S.set.spd=+e.target.value;apply()};q('#s-fs').onchange=e=>{S.set.fs=+e.target.value;apply()};q('#s-vol').oninput=e=>{S.set.vol=+e.target.value;apply()};
  q('#s-bgm').onchange=e=>{S.set.bgm=e.target.checked;apply()};q('#s-v').onchange=e=>{S.set.vert=e.target.checked;apply()};
  q('#s-reset').onclick=()=>{if(confirm('しおりと既読を消します。よろしいですか。')){S.seen={};try{localStorage.removeItem(K)}catch(e){}closeMod();toast('消しました')}};
  modal('設定',w)}
function apply(){const a=$('#app');a.classList.toggle('v',S.set.vert);$('#win').classList.toggle('v',S.set.vert);a.style.setProperty('--fs',S.set.fs);
  A.on=S.set.bgm;if(A.master)A.master.gain.value=S.set.vol;if(A.on)startBgm();else clearInterval(A.timer);save()}
function showTitle(){const sv=load();$('#t-cont').hidden=!(sv.ep&&NV.eps.some(e=>e.id==sv.ep));$('#title').hidden=false;setBg('shop_morning');clearInterval(A.timer)}
function begin(fn){ac();closeMod();$('#title').hidden=true;apply();fn()}

/* ---------- 初期化 ---------- */
const sv=load();Object.assign(S.set,sv.set||{});S.seen=sv.seen||{};
$('#t-new').onclick=()=>begin(()=>startEp(NV.eps[0].id,0));
$('#t-cont').onclick=()=>begin(()=>startEp(sv.ep,sv.i||0));
$('#t-map').onclick=mapView;
$('#b-log').onclick=logView;$('#b-map').onclick=mapView;$('#b-eps').onclick=epsView;$('#b-set').onclick=setView;
$('#b-auto').onclick=()=>{S.auto=!S.auto;$('#b-auto').classList.toggle('on',S.auto);if(S.auto&&!S.typing&&!busy())S.at=setTimeout(adv,800);if(!S.auto)clearTimeout(S.at)};
$('.mx').onclick=closeMod;
$('#mod').addEventListener('click',e=>{if(e.target.id=='mod')closeMod()});
$('#app').addEventListener('click',e=>{if(e.target.closest('#bar,#card,#mod,#title,#banner'))return;adv()});
addEventListener('keydown',e=>{if(e.key=='Escape'){closeMod();return}if(busy())return;
  if(['Enter',' ','ArrowRight'].includes(e.key)){e.preventDefault();adv()}else if(e.key=='a')$('#b-auto').click();else if(e.key=='l')logView();else if(e.key=='m')mapView()});
apply();showTitle();
})();
