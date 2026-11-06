/* ############################################################
   ESTADO GLOBAL, MISIONES, INVENTARIO Y MAPA
   ############################################################ */
const Game={chapter:0,paused:false,cine:false,
  flags:{intro:false,gryffindor:false,surprise:false,photo:false,letter:false,
    gifts:[],inv:[],talked:[],quests:{},orbs:0,books:0,potion:false,runa:false,free:false}
};
function setMission(html){ const m=el('mission'); if(!html){m.classList.add('hidden'); return;} m.innerHTML='<b>Misión</b> · '+html; m.classList.remove('hidden'); }
function setLocation(txt){ const l=el('location'); if(!txt){l.classList.add('hidden'); return;} l.textContent=txt; l.classList.remove('hidden'); }
function markTalked(name){ if(!Game.flags.talked.includes(name)){Game.flags.talked.push(name); Save.write(); checkPartyProgress();} }
function invAdd(name,ico){ Game.flags.inv.push({name,ico:ico||'✦'}); toast('Objeto añadido al inventario: '+name); AudioSys.sfx('pickup'); renderInventory(); Save.write(); }
function quest(id,name,desc){ if(!Game.flags.quests[id]){Game.flags.quests[id]={name,desc,done:false}; renderQuests();} }
function questDone(id){ const q=Game.flags.quests[id]; if(q){q.done=true; AudioSys.sfx('magic'); renderQuests();} }
function renderQuests(){ const ul=el('questList'); ul.innerHTML=''; const qs=Object.values(Game.flags.quests);
  if(!qs.length){ul.innerHTML='<li class="empty">Aún no hay misiones registradas.</li>'; return;}
  qs.forEach(q=>{const li=document.createElement('li'); if(q.done)li.className='done'; li.innerHTML=`<b>${q.name}</b><br>${q.desc}${q.done?' ✓':''}`; ul.appendChild(li);});
}
function renderInventory(){ const g=el('invGrid'); g.innerHTML='';
  if(!Game.flags.inv.length){g.innerHTML='<div class="empty">Tu inventario está vacío. Explora y descubre objetos mágicos.</div>'; return;}
  Game.flags.inv.forEach(it=>{const c=document.createElement('div'); c.className='card'; c.innerHTML=`<span class="ico">${it.ico}</span><b>${it.name}</b>`;
    if(it.name==='Carta de cumpleaños'){const b=document.createElement('button'); b.className='mopt'; b.style.marginTop='6px'; b.textContent='Leer'; b.onclick=()=>{closePanels(); showLetter(FINAL_LETTER.title,FINAL_LETTER.body);}; c.appendChild(b);}
    g.appendChild(c);});
}
const CHAPTER_NAMES={1:'La Carta y el Expreso de Hogwarts',2:'El Camino hacia el Castillo',3:'El Castillo de Hogwarts',4:'La Biblioteca Encantada',5:'El Aula de Pociones',6:'El Gran Comedor y el Sombrero',7:'La Gran Sorpresa en Gryffindor'};
function renderMap(){ const ul=el('mapList'); ul.innerHTML='';
  for(let i=1;i<=Math.max(1,Game.chapter);i++){const li=document.createElement('li'); li.innerHTML=`<b>Capítulo ${i} · ${CHAPTER_NAMES[i]}</b><br>${i===Game.chapter?'Ubicación actual':'Zona descubierta ✓'}`; ul.appendChild(li);} }

