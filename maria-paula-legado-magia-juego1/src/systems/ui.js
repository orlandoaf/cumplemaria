/* ############################################################
   UTILIDADES DE INTERFAZ
   ############################################################ */
function el(id){return document.getElementById(id);} // atajo de getElementById

let toastTimer=null;
function toast(msg){ // mensaje flotante breve
  const t=el('toast'); t.textContent=msg; t.style.opacity=1;
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.style.opacity=0,2400);
}
function fade(on, soft){ // oscurece la pantalla para transiciones
  const f=el('fade'); f.classList.toggle('on',on&&!soft); f.classList.toggle('soft',!!soft&&on);
}
function showBanner(big, small, flags, ms){ // cartel grande de evento
  const b=el('banner'); el('bannerBig').textContent=big; el('bannerSmall').textContent=small||'';
  el('bannerFlags').textContent=flags||'';
  b.classList.remove('hidden'); void b.offsetWidth; b.classList.add('show');
  if(ms)setTimeout(()=>{b.classList.remove('show'); setTimeout(()=>b.classList.add('hidden'),650);},ms);
}
function showLetter(title, html){ // muestra una carta de pergamino
  el('letterTitle').textContent=title; el('letterBody').innerHTML=html;
  el('letter').classList.remove('hidden'); AudioSys.sfx('chime');
}
el('letterClose').onclick=()=>el('letter').classList.add('hidden');

function showModal(title,text,buttons,withInput){ // ventana genérica con botones
  el('modalTitle').textContent=title; el('modalText').textContent=text||'';
  const btns=el('modalBtns'); btns.innerHTML='';
  if(withInput){ // campo de texto para acertijos escritos
    const inp=document.createElement('input'); inp.id='modalField'; inp.placeholder=withInput;
    btns.appendChild(inp); inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault(); const b=buttons[0]; if(b)b.cb(inp.value);}};
  }
  (buttons||[{label:'Aceptar',cb:closeModal}]).forEach(b=>{
    const btn=document.createElement('button'); btn.className='mopt'; btn.textContent=b.label;
    btn.onclick=()=>{ if(withInput&&!b.keepOpen){const inp=el('modalField'); b.cb&&b.cb(inp?inp.value:undefined);} else { closeModal(); b.cb&&b.cb(); } };
    btns.appendChild(btn);
  });
  el('modal').classList.remove('hidden');
  if(withInput){const inp=el('modalField'); if(inp)setTimeout(()=>inp.focus(),50);}
}
function closeModal(){el('modal').classList.add('hidden');}

/* Sistema de diálogos por cola */
const Dlg={active:false,q:[],done:null,
  say(lines,cb){this.q=lines.slice(); this.done=cb||null; this.active=true; el('dialogue').classList.remove('hidden'); this.next();},
  next(){ if(!this.q.length){this.active=false; el('dialogue').classList.add('hidden'); const d=this.done; this.done=null; if(d)d(); return;}
    const l=this.q.shift(); el('dlgName').textContent=l.who||''; el('dlgText').textContent=l.text; }
};
el('dialogue').addEventListener('click',()=>{if(Dlg.active)Dlg.next();});

/* Paneles de sistema (inventario, misiones, mapa, pausa) */
const PANELS=['questScreen','invScreen','mapScreen','pauseScreen','infoScreen'];
function closePanels(){PANELS.forEach(p=>el(p).classList.add('hidden')); Game.paused=false;}
function anyPanelOpen(){ return !el('modal').classList.contains('hidden')||!el('letter').classList.contains('hidden')||PANELS.some(p=>!el(p).classList.contains('hidden'));}
function togglePanel(id){
  const wasOpen=!el(id).classList.contains('hidden'); closePanels();
  if(!wasOpen){ el(id).classList.remove('hidden'); if(id==='pauseScreen')Game.paused=true; if(id==='questScreen')renderQuests(); if(id==='invScreen')renderInventory(); if(id==='mapScreen')renderMap(); }
  AudioSys.sfx('chime');
}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closePanels());

function showInfo(title,html){ el('infoTitle').textContent=title; el('infoBody').innerHTML=html; closePanels(); el('infoScreen').classList.remove('hidden'); }

/* ############################################################
   AUDIO — WebAudio: efectos y música ambiental por escenario
   ############################################################ */
const AudioSys={
  ctx:null, master:null, muted:false, seq:null, step:0,
  init(){ if(this.ctx) return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
    this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.gain.value=.5; this.master.connect(this.ctx.destination); },
  tone(f,t0,dur,type,vol){ if(!this.ctx||this.muted) return; // nota simple con envolvente
    const o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type=type; o.frequency.value=f;
    o.connect(g); g.connect(this.master); const t=this.ctx.currentTime+t0;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.02); g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.start(t); o.stop(t+dur+.05); },
  noise(t0,dur,vol){ if(!this.ctx||this.muted) return; // ruido blanco (aplausos, flash)
    const len=this.ctx.sampleRate*dur, buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const s=this.ctx.createBufferSource(), g=this.ctx.createGain(); s.buffer=buf; s.connect(g); g.connect(this.master);
    const t=this.ctx.currentTime+t0; g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); s.start(t); },
  sfx(n){ if(this.muted||!this.ctx) return; switch(n){ // efectos por nombre
    case 'chime':  this.tone(880,0,.22,'sine',.22); this.tone(1320,.08,.28,'sine',.16); break;
    case 'pickup': this.tone(660,0,.12,'triangle',.28); this.tone(990,.07,.18,'triangle',.22); break;
    case 'magic':  [523,659,784,1046].forEach((f,i)=>this.tone(f,i*.07,.24,'sine',.2)); break;
    case 'door':   this.tone(160,0,.3,'sawtooth',.12); break;
    case 'applause': for(let i=0;i<16;i++)this.noise(i*.05+Math.random()*.03,.06,.1); break;
    case 'surprise': [523,659,784,1046].forEach(f=>this.tone(f,0,.5,'triangle',.26)); break;
    case 'fanfare':[392,523,659,784,1046,1318].forEach((f,i)=>this.tone(f,i*.13,.45,'triangle',.26)); break;
    case 'photo':  this.tone(1250,0,.06,'square',.18); this.noise(.05,.09,.22); break;
    case 'gift':   this.tone(700,0,.1,'triangle',.26); this.tone(1050,.1,.22,'triangle',.26); break;
    case 'error':  this.tone(220,0,.2,'sawtooth',.14); break;
  }},
  startMusic(mode){ // melodía ambiental por área (escalas pentatónicas suaves)
    this.stopMusic(); if(!this.ctx) return;
    const scales={ station:[262,294,330,392,440,523], path:[220,262,294,330,392,494],
      castle:[220,247,262,330,392,440], library:[196,220,262,330,392], potions:[233,277,311,370,466],
      hall:[262,330,392,494,523,659], party:[392,440,523,587,659,784], night:[196,220,262,294,330] };
    const scale=scales[mode]||scales.castle;
    const tempo=mode==='party'?200:mode==='hall'?300:mode==='night'?520:420;
    this.step=0;
    this.seq=setInterval(()=>{ if(this.muted||document.hidden) return;
      const n=scale[Math.floor(Math.random()*scale.length)];
      if(Math.random()<.8)this.tone(n,0,.42,'triangle',.065);
      if(this.step%4===0)this.tone(scale[0]/2,0,1,'sine',.05);
      this.step++;
    },tempo);
  },
  stopMusic(){ if(this.seq){clearInterval(this.seq); this.seq=null;} },
  toggleMute(){ this.muted=!this.muted; if(this.master)this.master.gain.value=this.muted?0:.5; return this.muted; }
};

/* ############################################################
   ENTRADA — teclado y controles táctiles
   ############################################################ */
const Keys={}; // estado de teclas por código
window.addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  if(e.repeat)return;
  Keys[e.code]=true; AudioSys.init();
  if(e.code==='KeyE'||e.code==='Space'){ // E/espacio: avanzar diálogo o interactuar
    if(Dlg.active){Dlg.next(); return;}
    if(currentInteract&&!anyPanelOpen())doInteract();
  }
  if(e.code==='KeyI')togglePanel('invScreen');
  if(e.code==='KeyJ')togglePanel('questScreen');
  if(e.code==='KeyM')togglePanel('mapScreen');
  if(e.code==='Escape'){ if(!el('letter').classList.contains('hidden')){el('letter').classList.add('hidden'); return;} togglePanel('pauseScreen'); }
});
window.addEventListener('keyup',e=>Keys[e.code]=false);

const Touch={dx:0,dy:0,run:false}; // joystick virtual para móviles
(function setupTouch(){
  if(!('ontouchstart' in window)) return;
  el('touchui').classList.remove('hidden'); el('keysbar').style.display='none';
  const joy=el('joy'), knob=el('joyknob'); let jid=null;
  const move=e=>{ const t=[...e.touches].find(t=>t.identifier===jid); if(!t)return;
    const r=joy.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
    let dx=(t.clientX-cx)/(r.width/2), dy=(t.clientY-cy)/(r.height/2);
    const m=Math.hypot(dx,dy); if(m>1){dx/=m;dy/=m;}
    Touch.dx=dx; Touch.dy=dy; knob.style.left=(38+dx*36)+'px'; knob.style.top=(38+dy*36)+'px'; };
  joy.addEventListener('touchstart',e=>{jid=e.changedTouches[0].identifier; AudioSys.init(); move(e); e.preventDefault();},{passive:false});
  joy.addEventListener('touchmove',e=>{move(e); e.preventDefault();},{passive:false});
  joy.addEventListener('touchend',()=>{jid=null; Touch.dx=Touch.dy=0; knob.style.left='38px'; knob.style.top='38px';});
  const press=(id,down,up)=>{ const b=el(id); b.addEventListener('touchstart',e=>{down(); e.preventDefault();},{passive:false}); if(up)b.addEventListener('touchend',up); };
  press('btnE',()=>{ if(Dlg.active)Dlg.next(); else if(currentInteract)doInteract(); });
  press('btnRun',()=>{Touch.run=!Touch.run; el('btnRun').style.borderColor=Touch.run?'#ffe9ad':'rgba(212,175,55,.6)';});
  press('btnI',()=>togglePanel('invScreen')); press('btnJ',()=>togglePanel('questScreen')); press('btnM',()=>togglePanel('mapScreen'));
})();

/* ############################################################
   SISTEMA DE GUARDADO (localStorage con manejo de errores)
   ############################################################ */
const SAVE_KEY='mp_legado_magia_v3';
const Save={
  write(){ try{localStorage.setItem(SAVE_KEY,JSON.stringify(Game.flags));}catch(e){console.warn('No se pudo guardar',e);} },
  read(){ try{const r=localStorage.getItem(SAVE_KEY); return r?JSON.parse(r):null;}catch(e){console.warn('Guardado corrupto',e); return null;} },
  clear(){ try{localStorage.removeItem(SAVE_KEY);}catch(e){} }
};

