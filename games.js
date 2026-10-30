const $=s=>document.querySelector(s);
const shell=el=>{el.innerHTML='<div class="bar"><span class="msg" id="msg" role="status"></span><button id="rs">New game</button></div><div id="g"></div><p class="score" id="sc"></p>'};
const rnd=a=>a[Math.floor(Math.random()*a.length)];

function ttt(el){
 shell(el);const g=$('#g'),msg=t=>$('#msg').textContent=t;g.className='ttt';
 const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 let b,over,s={w:0,l:0,d:0};
 const win=p=>L.find(l=>l.every(i=>b[i]===p));
 const score=()=>$('#sc').textContent=`You ${s.w} · Computer ${s.l} · Draws ${s.d}`;
 function reset(){b=Array(9).fill('');over=false;draw();msg('Your move. You’re ✕.');score()}
 function draw(w){g.innerHTML='';b.forEach((v,i)=>{const c=document.createElement('button');c.className='cell'+(v==='○'?' o':'')+(w&&w.includes(i)?' win':'');c.textContent=v;c.setAttribute('aria-label','Square '+(i+1)+(v?', '+v:', empty'));c.onclick=()=>play(i);g.append(c)})}
 function end(p){const w=win(p);draw(w);
  if(w){over=true;if(p==='✕'){s.w++;msg('You won! Nicely done.')}else{s.l++;msg('The computer got that one. Go again?')}score();return true}
  if(b.every(Boolean)){over=true;s.d++;msg('A draw. Well played.');score();return true}return false}
 function play(i){if(over||b[i])return;b[i]='✕';if(end('✕'))return;msg('Thinking…');setTimeout(ai,400)}
 function ai(){
  const free=b.map((v,i)=>v?-1:i).filter(i=>i>=0);
  const t=p=>free.find(i=>{b[i]=p;const w=!!win(p);b[i]='';return w});
  let m=t('○');if(m==null)m=t('✕');
  if(m==null||Math.random()<.25)m=Math.random()<.3?rnd(free):(free.includes(4)?4:rnd(free.filter(i=>[0,2,6,8].includes(i)).concat(free)));
  b[m]='○';if(!end('○'))msg('Your move.');
 }
 $('#rs').onclick=reset;reset();
}

function c4(el){
 shell(el);const g=$('#g'),msg=t=>$('#msg').textContent=t;g.className='c4';
 const R=6,C=7;let b,over,busy,s={w:0,l:0};
 const score=()=>$('#sc').textContent=`You ${s.w} · Computer ${s.l}`;
 const winCells=p=>{for(let r=0;r<R;r++)for(let c=0;c<C;c++)for(const[dr,dc]of[[0,1],[1,0],[1,1],[1,-1]]){
  const cells=[0,1,2,3].map(k=>[r+dr*k,c+dc*k]);
  if(cells.every(([y,x])=>y>=0&&y<R&&x>=0&&x<C&&b[y*C+x]===p))return cells.map(([y,x])=>y*C+x)}return null};
 const drop=(c,p)=>{for(let r=R-1;r>=0;r--)if(!b[r*C+c]){b[r*C+c]=p;return r*C+c}return -1};
 function draw(w){g.innerHTML='';b.forEach((v,i)=>{const x=document.createElement('button');x.className=(v?'p'+v:'')+(w&&w.includes(i)?' win':'');x.setAttribute('aria-label','Column '+(i%C+1));x.onclick=()=>play(i%C);g.append(x)})}
 function reset(){b=Array(R*C).fill(0);over=busy=false;draw();msg('Your turn. Tap a column to drop a yellow disc.');score()}
 function fin(p){const w=winCells(p);draw(w);
  if(w){over=true;if(p===1){s.w++;msg('Four in a row. You won!')}else{s.l++;msg('The computer connected four. Try again?')}score();return true}
  if(b.every(Boolean)){over=true;msg('The board is full. A draw.');return true}return false}
 function play(c){if(over||busy||b[c])return;drop(c,1);if(fin(1))return;busy=true;msg('Thinking…');setTimeout(ai,450)}
 function ai(){
  const cols=[...Array(C).keys()].filter(c=>!b[c]);
  const t=p=>cols.find(c=>{const i=drop(c,p),w=!!winCells(p);b[i]=0;return w});
  let m=t(2);if(m==null)m=t(1);
  if(m==null){
   const safe=cols.filter(c=>{const i=drop(c,2),j=drop(c,1);const bad=j>=0&&!!winCells(1);if(j>=0)b[j]=0;b[i]=0;return !bad});
   const pool=(safe.length?safe:cols).sort((x,y)=>Math.abs(x-3)-Math.abs(y-3));
   m=Math.random()<.5?pool[0]:rnd(pool);
  }
  drop(m,2);busy=false;if(!fin(2))msg('Your turn.');
 }
 $('#rs').onclick=reset;reset();
}

function mem(el){
 shell(el);const g=$('#g'),msg=t=>$('#msg').textContent=t;g.className='mem';
 const E=['🌸','🐢','🌊','🍵','🌙','🦋'];let first,lock,moves,found;
 function reset(){
  const d=[...E,...E].sort(()=>Math.random()-.5);first=null;lock=false;moves=0;found=0;g.innerHTML='';
  msg('Flip two cards to find a pair.');$('#sc').textContent='Moves: 0';
  d.forEach(e=>{const c=document.createElement('button');c.className='card';c.dataset.e=e;c.textContent=e;c.setAttribute('aria-label','Hidden card');c.onclick=()=>flip(c);g.append(c)});
 }
 function flip(c){
  if(lock||c.classList.contains('up')||c.classList.contains('done'))return;
  c.classList.add('up');c.setAttribute('aria-label',c.dataset.e);
  if(!first){first=c;return}
  moves++;$('#sc').textContent='Moves: '+moves;
  if(first.dataset.e===c.dataset.e){
   first.className=c.className='card done';first=null;found++;
   if(found===E.length)msg('All pairs found in '+moves+' moves. Lovely.');else msg('A match!');
  }else{
   lock=true;const a=first;first=null;
   setTimeout(()=>{[a,c].forEach(x=>{x.classList.remove('up');x.setAttribute('aria-label','Hidden card')});lock=false},800);
  }
 }
 $('#rs').onclick=reset;reset();
}
function sl(el){
 shell(el);const g=$('#g'),msg=t=>$('#msg').textContent=t;g.className='sl';
 const J={16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78,1:38,4:14,9:31,21:42,28:84,36:44,51:67,71:91,80:100};
 let pos,busy,over,s={w:0,l:0};
 g.insertAdjacentHTML('afterend','<p style="text-align:center;margin:14px 0 0"><button class="big" id="roll">Roll the dice 🎲</button></p>');
 function draw(){g.innerHTML='';
  for(let r=9;r>=0;r--)for(let c=0;c<10;c++){const n=r*10+(r%2?10-c:c+1),d=J[n],q=document.createElement('div');
   q.className='sq'+(d?(d<n?' s':' l'):'');
   q.innerHTML=n+(d?`<b>${d<n?'↓':'↑'}${d}</b>`:'')+pos.map((p,i)=>p===n?`<i class="pc p${i}"></i>`:'').join('');g.append(q)}
  $('#sc').textContent=`You: square ${pos[0]} · Computer: square ${pos[1]} · Wins ${s.w}–${s.l}`}
 function turn(p){
  const d=1+Math.floor(Math.random()*6),who=p?'Computer':'You';let n=pos[p]+d;if(n>100)n=pos[p];
  pos[p]=n;draw();msg(who+(p?' rolled a ':' rolled a ')+d+'.');
  setTimeout(()=>{const j=J[n];
   if(j){pos[p]=j;draw();msg(who+(j<n?' slid down a snake 🐍':' climbed a ladder 🪜'))}
   if(pos[p]===100){over=true;if(p){s.l++;msg('The computer reached 100. Go again?')}else{s.w++;msg('You reached 100. Well done!')}draw()}
   else if(p===0)setTimeout(()=>turn(1),1000);else{busy=false;msg('Your turn. Roll the dice.')}
  },800)}
 function reset(){pos=[0,0];busy=over=false;draw();msg('Roll the dice to begin. First to 100 wins.')}
 $('#roll').onclick=()=>{if(busy||over)return;busy=true;turn(0)};
 $('#rs').onclick=reset;reset();
}

function rev(el){
 shell(el);const g=$('#g'),msg=t=>$('#msg').textContent=t;g.className='rev';
 let b,turnOf;
 const ok=(y,x)=>y>=0&&y<8&&x>=0&&x<8;
 function flips(i,p){if(b[i])return[];const r=i>>3,c=i&7,out=[];
  for(const[dy,dx]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){
   let y=r+dy,x=c+dx;const t=[];
   while(ok(y,x)&&b[y*8+x]===3-p){t.push(y*8+x);y+=dy;x+=dx}
   if(t.length&&ok(y,x)&&b[y*8+x]===p)out.push(...t)}
  return out}
 const moves=p=>[...Array(64).keys()].filter(i=>flips(i,p).length);
 function draw(){g.innerHTML='';const mv=turnOf===1?moves(1):[];
  b.forEach((v,i)=>{const c=document.createElement('button');c.className=mv.includes(i)?'h':'';c.setAttribute('aria-label','Square '+(i+1));
   if(v)c.innerHTML=`<i class="d${v}"></i>`;c.onclick=()=>click(i);g.append(c)});
  $('#sc').textContent=`You (dark) ${b.filter(x=>x===1).length} · Computer (light) ${b.filter(x=>x===2).length}`}
 function put(i,p){flips(i,p).concat(i).forEach(k=>b[k]=p)}
 function next(p){turnOf=0;
  if(!moves(1).length&&!moves(2).length){draw();const a=b.filter(x=>x===1).length,c=b.filter(x=>x===2).length;
   return msg(a>c?'You won! Nicely played.':a<c?'The computer won this one.':'A draw. Well played.')}
  if(!moves(p).length){draw();msg((p===1?'You have no moves, passing.':'Computer has no moves, passing.'));return setTimeout(()=>next(3-p),1000)}
  if(p===1){turnOf=1;draw();msg('Your move. Tap a dotted square.')}
  else{draw();msg('Thinking…');setTimeout(ai,700)}}
 function ai(){
  const sc=i=>flips(i,2).length+([0,7,56,63].includes(i)?10:0)+Math.random()*2;
  const m=moves(2).sort((x,y)=>sc(y)-sc(x))[0];put(m,2);next(1)}
 function click(i){if(turnOf!==1||!flips(i,1).length)return;put(i,1);next(2)}
 function reset(){b=Array(64).fill(0);b[27]=b[36]=2;b[28]=b[35]=1;next(1)}
 $('#rs').onclick=reset;reset();
}

function lo(el){
 shell(el);const g=$('#g'),msg=t=>$('#msg').textContent=t;g.className='lo';
 let b,n,done;
 function tog(i){const r=i/5|0,c=i%5;
  for(const[dy,dx]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const y=r+dy,x=c+dx;if(y>=0&&y<5&&x>=0&&x<5)b[y*5+x]^=1}}
 function draw(){g.innerHTML='';b.forEach((v,i)=>{const c=document.createElement('button');c.className=v?'on':'';
  c.setAttribute('aria-label','Light '+(i+1)+(v?', on':', off'));c.onclick=()=>click(i);g.append(c)});
  $('#sc').textContent='Moves: '+n}
 function click(i){if(done)return;tog(i);n++;draw();
  if(b.every(x=>!x)){done=true;msg('All lights out in '+n+' moves. Peaceful.')}}
 function reset(){do{b=Array(25).fill(0);for(let k=0;k<12;k++)tog(Math.floor(Math.random()*25))}while(b.every(x=>!x));
  n=0;done=false;draw();msg('Tap a light to flip it and its neighbors.')}
 $('#rs').onclick=reset;reset();
}

