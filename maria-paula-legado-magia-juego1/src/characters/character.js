/* ---------- Fábrica de personajes chibi (estilo de la imagen de referencia) ---------- */
function makeCharacter(o){
  o=Object.assign({robe:0x26262e,trim:0x6b5426,skin:0xe8b98a,hair:0x3a2412,hat:null},o);
  const g=new THREE.Group();
  // sombra tipo "mancha" suave bajo el personaje (barato y acogedor)
  const blob=new THREE.Mesh(new THREE.CircleGeometry(.55,16),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3}));
  blob.rotation.x=-Math.PI/2; blob.position.y=.02; g.add(blob);
  // piernas
  const legL=put(g,box(.17,.34,.2,M(0x1a1a22)),-.12,.17,0), legR=put(g,box(.17,.34,.2,M(0x1a1a22)),.12,.17,0);
  legL.geometry=legR.geometry=legL.geometry;
  // túnica (cuerpo)
  const body=put(g,box(.62,.72,.42,M(o.robe)),0,.72,0);
  // fajín / detalles de casa
  const trim=put(g,box(.64,.12,.44,M(o.trim)),0,.52,0);
  // bufanda (señal de Gryffindor tras la ceremonia)
  const scarf=put(g,box(.5,.12,.3,M(0x7b1d12)),0,1.02,.08);
  // brazos
  const armL=put(g,box(.16,.5,.2,M(o.robe)),-.4,.78,0), armR=put(g,box(.16,.5,.2,M(o.robe)),.4,.78,0);
  armL.geometry=armR.geometry=armL.geometry;
  // cabeza
  const head=put(g,box(.5,.46,.46,M(o.skin)),0,1.3,0);
  put(g,box(.11,.11,.03,M(0x201510)),-.11,1.32,.24); // ojo izq
  put(g,box(.11,.11,.03,M(0x201510)),.11,1.32,.24);  // ojo der
  put(g,box(.16,.05,.03,M(0x7a3b2a)),0,1.2,.24);     // sonrisa
  // cabello
  put(g,box(.54,.18,.5,M(o.hair)),0,1.53,0);
  put(g,box(.54,.34,.14,M(o.hair)),0,1.36,-.19);
  // sombrero (puntiagudo o de fiesta)
  if(o.hat){
    put(g,cyl(.34,.34,.05,M(o.hat.c)),0,1.62,0);
    if(o.hat.tip){ const cone=put(g,cyl(.02,.3,.5,M(o.hat.c),8),0,1.9,0); cone.rotation.z=.12; }
    else put(g,cyl(.02,.26,.42,M(o.hat.c),8),0,1.85,0);
  }
  g.userData={legL,legR,armL,armR,scarf,trim,body,ph:Math.random()*6.28};
  return g;
}
function animChar(ch,t,moving){ // animación de caminar/respirar
  const u=ch.userData, s=moving?Math.sin(t*11+u.ph):0;
  u.legL.rotation.x=s*.75; u.legR.rotation.x=-s*.75;
  u.armL.rotation.x=-s*.6; u.armR.rotation.x=s*.6;
  ch.position.y=moving?Math.abs(Math.sin(t*11+u.ph))*.05:Math.abs(Math.sin(t*2+u.ph))*.03;
}

/* ---------- Jugadora: María Paula ---------- */
const Player={
  mesh:null, moving:false, celebrateT:0, surpriseT:0,
  init(){ this.mesh=makeCharacter({robe:0x2a2333,trim:0x5a4a2a,hair:0x4a2a12}); scene.add(this.mesh); },
  setGryffindor(){ // tras la ceremonia: rojo y dorado de Gryffindor
    const u=this.mesh.userData;
    u.trim.material.color.setHex(0xd4af37); u.scarf.material.color.setHex(0x8b1a1a);
    this.mesh.userData.body.material.color.setHex(0x2b2430);
  }
};

/* ---------- NPC ---------- */
function makeNPC(x,z,opts,dialogue,name,nameColor){
  const ch=makeCharacter(opts); ch.position.set(x,0,z); Area.group.add(ch);
  const spr=textSprite(name,nameColor); spr.position.set(0,2.4,0); ch.add(spr);
  const npc={mesh:ch,name,dialogue,extra:opts.extra||[],talked:false,
    update(dt,t){animChar(ch,t,false); if(npc.popT>0){npc.popT-=dt; ch.scale.setScalar(Math.min(1,ch.scale.x+dt*4));}}};
  npc.popT=0;
  Area.interact.push({x,z,r:1.5,label:'Hablar con '+name,fn(){talkNPC(npc);}});
  Area.npcs.push(npc); return npc;
}
function talkNPC(npc){
  markTalked(npc.name);
  const lines=npc.dialogue.slice();
  if(npc.talked&&npc.extra.length)lines.push(...npc.extra);
  npc.talked=true;
  AudioSys.sfx('chime');
  Dlg.say(lines);
}

/* ---------- Actualización de María Paula y cámara ---------- */
function updatePlayer(dt,t){
  let dx=0,dz=0; const locked=Dlg.active||anyPanelOpen()||Game.cine;
  if(!locked){
    if(Keys['KeyW']||Keys['ArrowUp'])dz-=1; if(Keys['KeyS']||Keys['ArrowDown'])dz+=1;
    if(Keys['KeyA']||Keys['ArrowLeft'])dx-=1; if(Keys['KeyD']||Keys['ArrowRight'])dx+=1;
    dx+=Touch.dx; dz+=Touch.dy;
  }
  const m=Math.hypot(dx,dz);
  Player.moving=m>.15;
  if(Player.moving){
    dx/=m; dz/=m;
    const run=Keys['ShiftLeft']||Keys['ShiftRight']||Touch.run;
    const sp=run?5.8:3.1;
    Player.mesh.position.x+=dx*sp*dt; Player.mesh.position.z+=dz*sp*dt;
    resolveColliders(Player.mesh.position);
    const target=Math.atan2(dx,dz);
    let cur=Player.mesh.rotation.y;
    let diff=((target-cur+Math.PI)%6.283)-Math.PI;
    Player.mesh.rotation.y=cur+diff*Math.min(1,dt*12);
    if(run&&Math.random()<.1)AudioSys.tone(180+Math.random()*40,0,.05,'sine',.02);
  }
  // animaciones especiales (celebración / sorpresa)
  if(Player.celebrateT>0){ Player.celebrateT-=dt; Player.mesh.position.y=Math.abs(Math.sin(t*8))*.35; Player.mesh.rotation.y+=dt*7; }
  else if(Player.surpriseT>0){ Player.surpriseT-=dt; Player.mesh.position.y=Math.abs(Math.sin(t*4))*.12; }
  else animChar(Player.mesh,t,Player.moving);
  // cámara sigue a María Paula con suavidad
  const p=Player.mesh.position;
  camera.position.lerp(new THREE.Vector3(p.x+Area.camOffset.x,p.y+Area.camOffset.y,p.z+Area.camOffset.z),Math.min(1,dt*4));
  camera.lookAt(p.x,1.2,p.z);
}

/* ---------- Interacción ---------- */
let currentInteract=null;
function scanInteract(){
  const p=Player.mesh.position; let best=null,bd=1e9;
  for(const it of Area.interact){ if(it.off)continue;
    const d=Math.hypot(p.x-it.x,p.z-it.z);
    if(d<it.r&&d<bd){bd=d; best=it;} }
  currentInteract=best;
  const pr=el('prompt');
  if(best&&!Dlg.active&&!anyPanelOpen()){pr.classList.remove('hidden'); pr.textContent='[E] '+best.label;}
  else pr.classList.add('hidden');
}
function doInteract(){ if(currentInteract)currentInteract.fn(); }

/* ---------- Colisiones (círculo vs rectángulos) y límites ---------- */
function resolveColliders(p){
  for(const c of Area.colliders){
    const dx=p.x-c.x, dz=p.z-c.z, hx=c.hx+.35, hz=c.hz+.35;
    if(Math.abs(dx)<hx&&Math.abs(dz)<hz){
      if(Math.abs(dx)/hx>Math.abs(dz)/hz)p.x=c.x+Math.sign(dx)*hx;
      else p.z=c.z+Math.sign(dz)*hz;
    }
  }
  p.x=Math.max(-Area.bounds.x,Math.min(Area.bounds.x,p.x));
  p.z=Math.max(-Area.bounds.z,Math.min(Area.bounds.z,p.z));
}

