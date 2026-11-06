/* ############################################################
   CAPÍTULO 7 — LA GRAN SORPRESA EN GRYFFINDOR
   Sala común acogedora: chimenea, globos, regalos, pastel,
   amigos con diálogos, foto grupal y carta final.
   ############################################################ */
const partyNPCs={}; // referencias a los amigos para la foto y la sorpresa
let hemiRef=null, fireRef=null;

Builders[7]=function(){
  scene.background=new THREE.Color(0x140c06); scene.fog=new THREE.Fog(0x140c06,18,55);
  Area.bounds={x:9,z:6.5}; Area.camOffset.set(0,10.5,8);
  hemiRef=Area.hemi(.45,0xa0805a,0x1a0e06); Area.dir(.35,0xffd0a0,6,14,5);
  fireRef=Area.point(0xff9a2e,1.4,12,-6.5,1.6,-4);
  // suelo de madera y alfombra roja
  put(Area.group,box(22,.5,16,M(0x5a4026)),0,-.25,0);
  put(Area.group,box(9,.54,5,M(0x6b1420)),0,0,0);
  // paredes rojo ladrillo y madera
  put(Area.group,box(22,6,.8,M(0x4a1e14)),0,3,-8); put(Area.group,box(22,6,.8,M(0x4a1e14)),0,3,8);
  put(Area.group,box(.8,6,16,M(0x3a1a10)),-11,3,0); put(Area.group,box(.8,6,16,M(0x3a1a10)),11,3,0);
  // ventanales góticos con cielo nocturno (como en la imagen de referencia)
  [[-5,-7.55],[0,-7.55],[5,-7.55]].forEach(([x,z])=>{
    put(Area.group,box(2.6,3.6,.15,M(0x101a30,{emissive:0x18283e,emissiveIntensity:.7})),x,2.6,z);
    put(Area.group,box(.14,3.6,.2,M(0x2a1a10)),x,2.6,z+.02);
    put(Area.group,box(2.6,.14,.2,M(0x2a1a10)),x,2.6,z+.02);
    put(Area.group,box(2.9,3.9,.1,M(0x5a4026)),x,2.6,z-.08);
  });
  // chimenea con fuego animado
  put(Area.group,box(3,3.4,1,M(0x3a322c)),-6.5,1.7,-6.9);
  put(Area.group,box(1.8,1.6,.6,M(0x120a04)),-6.5,1.1,-6.4);
  const fire=put(Area.group,cyl(.05,.5,.9,M(0xff9a2e,{emissive:0xff7a1e,emissiveIntensity:1.4})),-6.5,.7,-6.3);
  Area.anim.push((dt,t)=>{ fire.scale.y=1+Math.sin(t*12)*.3; fire.material.emissiveIntensity=1.1+Math.sin(t*15)*.4;
    fireRef.intensity=1.1+Math.sin(t*13)*.35+Math.sin(t*7)*.2; });
  Area.colliders.push({x:-6.5,z:-6.6,hx:1.6,hz:.8});
  // leños
  put(Area.group,cyl(.09,.09,1,M(0x3a2410)),-6.2,.25,-5.6).rotation.z=1.2;
  put(Area.group,cyl(.09,.09,1,M(0x2a1a08)),-6.9,.25,-5.5).rotation.z=1.4;
  // sofás y mesitas (zona de estar)
  [[-4,4,0],[4,4.4,0]].forEach(([x,z])=>{
    put(Area.group,box(2.6,.6,1.1,M(0x6b1a1a)),x,.3,z); put(Area.group,box(2.6,.5,.3,M(0x7b2222)),x,.75,z-.4);
    put(Area.group,box(.3,.5,1.1,M(0x7b2222)),x-1.15,.55,z); put(Area.group,box(.3,.5,1.1,M(0x7b2222)),x+1.15,.55,z);
    Area.colliders.push({x,z,hx:1.5,hz:.8}); });
  put(Area.group,box(1.2,.5,.8,M(0x4a3520)),0,.25,4.6); Area.colliders.push({x:0,z:4.6,hx:.7,hz:.5});
  // estantería y cuadros
  put(Area.group,box(4,3.4,.5,M(0x4a3018)),8.5,1.7,-7.4);
  for(let r=0;r<3;r++)for(let b=0;b<6;b++)put(Area.group,box(.3,.7,.3,M([0x6b2a2a,0x8a6a2a,0x2a4a6b][(b+r)%3])),7.2+b*.5,.9+r*1.05,-7.1);
  Area.colliders.push({x:8.5,z:-7.4,hx:2.1,hz:.4});
  [[-9,-4,'El Primer Gryffindor','Una pintura de un león dorado que parpadea cuando lo miras de reojo.'],
   [9.6,2,'El Mapa del Castillo','Los pasillos del cuadro se dibujan solos… y una flecha marca: “Estás aquí”.']].forEach(([x,z,n,txt])=>{
    put(Area.group,box(1.8,2.2,.12,M(0xd4af37)),x,2.6,z); put(Area.group,box(1.5,1.9,.14,M(0x2a3a2a)),x,2.6,z);
    Area.interact.push({x,z,r:1.3,label:n,fn(){Dlg.say([{who:n,text:txt}]);}});
  });
  // MESA CENTRAL CON EL PASTEL (protagonista de la fiesta)
  put(Area.group,box(4.6,.5,1.8,M(0x4a3520)),0,.85,-3);
  put(Area.group,box(.2,.85,.2,M(0x3a2814)),-1.8,.42,-3.6); put(Area.group,box(.2,.85,.2,M(0x3a2814)),1.8,.42,-2.4);
  Area.colliders.push({x:0,z:-3,hx:2.4,hz:1});
  // pastel de tres pisos con velas encendidas
  const cake=new THREE.Group();
  put(cake,cyl(.85,.9,.4,M(0xf0e0d0)),0,.2,0); put(cake,cyl(.6,.65,.4,M(0xe89aae)),0,.6,0); put(cake,cyl(.4,.45,.4,M(0xf0e0d0)),0,1,0);
  put(cake,cyl(.86,.9,.06,M(0x8b1a1a)),0,.42,0); put(cake,cyl(.61,.66,.06,M(0x8b1a1a)),0,.82,0);
  const flames=[];
  for(let i=0;i<5;i++){ const a=i/5*6.28;
    const c=put(cake,cyl(.02,.02,.4,M(0xe8dcc0)),Math.cos(a)*.28,1.4,Math.sin(a)*.28);
    const f=put(cake,cyl(.01,.035,.12,M(0xffb45e,{emissive:0xffc86e,emissiveIntensity:1.5})),Math.cos(a)*.28,1.65,Math.sin(a)*.28);
    flames.push(f); }
  cake.position.set(0,1.1,-3); Area.group.add(cake);
  Area.anim.push((dt,t)=>{ if(!Game.flags.wish)flames.forEach((f,i)=>{f.scale.y=1+Math.sin(t*9+i)* .3; f.material.emissiveIntensity=1.2+Math.sin(t*11+i)*.4;}); });
  Area.point(0xffc86e,.9,7,0,2.4,-3);
  // globos flotando (ramilletes como en la imagen)
  const balloonCols=[0xd43a3a,0x3a7bd4,0x3ad47e,0xe3c53a,0xc43ad4,0xe37e3a];
  [[-8.6,3],[8.6,3.6],[-2.5,-6.8],[6.8,-6.6]].forEach(([x,z],bi)=>{
    for(let i=0;i<5;i++){ const b=put(Area.group,new THREE.Mesh(new THREE.SphereGeometry(.32,10,8),M(balloonCols[(bi+i)%6])),x+(i%2)*.5-.25,2.6+i*.55,z+(i%3)*.3-.3);
      const by=b.position.y, ph=i+bi; Area.anim.push((dt,t)=>b.position.y=by+Math.sin(t*1.3+ph)*.18); }
  });
  // REGALOS interactivos sobre la mesa y cerca
  const giftDefs=[[-1.6,-2.4],[1.6,-2.5],[8,5.6],[-8,5.4],[3.2,-5.4]];
  giftDefs.forEach(([x,z],i)=>{
    const g=new THREE.Group();
    put(g,box(.7,.5,.7,M([0x8b1a1a,0x27408b,0x2e7d4f][i%3])),0,.25,0);
    const lid=put(g,box(.8,.14,.8,M([0xd4af37,0xe3c53a,0xe8e0c0][i%3])),0,.56,0);
    put(g,box(.12,.64,.12,M(0xd4af37)),0,.3,0);
    g.position.set(x,0,z); Area.group.add(g);
    // brillo mágico sobre cada regalo
    const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(0xffe9ad),transparent:true,depthWrite:false}));
    gl.scale.set(1.4,1.4,1); gl.position.set(x,1.1,z); Area.group.add(gl);
    Area.anim.push((dt,t)=>gl.material.opacity=.4+Math.sin(t*3+i)*.25);
    Area.interact.push({x,z,r:1.3,label:'Abrir regalo',fn(){
      if(Game.flags.gifts.includes(i)){toast('Este regalo ya está abierto… pero sigue brillando para ti.'); return;}
      Game.flags.gifts.push(i); Save.write(); AudioSys.sfx('gift'); FX.burst(x,1.2,z,[0xd4af37,0xffe9ad,0x8b1a1a],26,2,2.4,1.3,.16);
      lid.position.y=.75; lid.rotation.z=.5; // tapa se abre
      const gift=GIFTS[i];
      showModal('Un regalo para María Paula',gift.msg,[{label:'Guardar con cariño',cb(){invAdd(gift.name,gift.ico);}}]);
      checkPartyProgress();
    }});
  });
  // mesita con la CARTA final
  put(Area.group,box(.9,.5,.7,M(0x6b1a1a)),-3.2,.25,4.4); Area.colliders.push({x:-3.2,z:4.4,hx:.55,hz:.45});
  const le=put(Area.group,box(.5,.04,.36,M(0xe9d9ae,{emissive:0x8a7a4a,emissiveIntensity:.5})),-3.2,.52,4.4);
  Area.anim.push((dt,t)=>le.material.emissiveIntensity=.4+Math.sin(t*2.5)*.25);
  Area.interact.push({x:-3.2,z:4.4,r:1.2,label:'Leer la carta sobre la mesita',fn(){
    Game.flags.letter=true; invAddOnce('Carta de cumpleaños','✉'); showLetter(FINAL_LETTER.title,FINAL_LETTER.body); Save.write(); checkPartyProgress();
  }});
  // PASTEL: pedir un deseo
  Area.interact.push({x:0,z:-3,r:1.8,label:'Pedir un deseo y soplar las velas',fn(){
    if(Game.flags.wish){toast('Las velas ya fueron apagadas. El deseo viaja en camino.'); return;}
    showModal('Haz un deseo','Tus amigos empiezan a cantar:\n“Cumpleaños feliz, que los cumplas feliz…”\nCierra los ojos, pide tu deseo… ¡y sopla!',[
      {label:'Soplar las velas',cb(){ Game.flags.wish=true; Save.write(); AudioSys.sfx('applause');
        flames.forEach(f=>f.visible=false);
        FX.burst(0,2.2,-3,[0xd4af37,0xffe9ad,0xffffff],50,2.6,3,2,.2);
        invAddOnce('Deseo concedido','★'); Dlg.say([
          {who:'Todos',text:'¡QUE LO CUMPLAS FELIIIZ!'},
          {who:'Mauro',text:'¡SIEEENTE el deseo! Y ahora… ¿quién quiere la primera porción?'},
        ]); checkPartyProgress(); }}
    ]);
  }});
  // CÁMARA MÁGICA para la foto grupal
  put(Area.group,cyl(.06,.1,1.4,M(0x2a2a30)),6.6,.7,5.8);
  put(Area.group,box(.6,.4,.5,M(0x3a3226)),6.6,1.55,5.8);
  Area.anim.push((dt,t)=>{ });
  Area.interact.push({x:6.6,z:5.8,r:1.4,label:'Usar la cámara mágica',fn(){
    if(!Game.flags.surprise){toast('La cámara espera el momento perfecto…'); return;}
    takePhoto();
  }});
  // LOS SEIS AMIGOS (ocultos hasta la sorpresa)
  const spots=[[-3.4,-5.4],[3.4,-5.4],[-5.6,-1.4],[5.6,-1.4],[-2.2,1.6],[2.2,1.6]];
  Object.keys(FRIENDS).forEach((k,i)=>{
    const f=FRIENDS[k], [x,z]=spots[i];
    const npc=makeNPC(x,z,{robe:f.robe,trim:f.trim,hair:f.hair,hat:f.hat},f.lines,f.name);
    npc.extra=f.extra; npc.home=[x,z];
    npc.mesh.visible=false; npc.hidden=true;
    partyNPCs[k]=npc;
    const it=Area.interact.find(ii=>ii.x===x&&ii.z===z&&ii.label==='Hablar con '+f.name);
    if(it)it.fn=()=>{ if(!Game.flags.surprise)return; talkNPC(npc); };
  });
  // compañeros adicionales (decorativos pero vivos)
  for(let i=0;i<4;i++){ const s=makeCharacter({robe:0x26262e,trim:[0x7b1d12,0x1a4723,0xb08d2a,0x27408b][i],hair:[0x2a1a0a,0x5a3a10,0x1a1a1a,0x8a4a1a][i]});
    s.position.set(-7+i*1.4,0,6-i*.8); s.rotation.y=Math.PI+ i*.3; Area.group.add(s);
    s.visible=false; Area.anim.push((dt,t)=>{ if(s.visible)animChar(s,t,false); });
    extraGuests.push(s);
  }
  // ZONA DE DISPARO DE LA SORPRESA (centro de la alfombra)
  Area.anim.push((dt,t)=>{
    if(Game.chapter===7&&!Game.flags.surprise&&!Game.cine){
      const p=Player.mesh.position;
      if(Math.abs(p.x)<2&&Math.abs(p.z)<2)runSurprise();
    }
  });
  // diálogos ambientales para la exploración libre
  quest('fiesta','La Gran Sorpresa','Explora la sala… algo está a punto de pasar.');
  setLocation('Sala Común de Gryffindor');
  setMission(Game.flags.surprise?'Disfruta tu fiesta: amigos, regalos, pastel, foto y carta.':'Cruza la sala común…');
  AudioSys.startMusic('night');
  Player.mesh.position.set(0,0,6); Player.mesh.rotation.y=Math.PI;
  // restaurar estado si se vuelve a cargar el capítulo
  if(Game.flags.surprise)restoreParty();
  if(Game.flags.wish)flames.forEach(f=>f.visible=false);
  if(Game.flags.gifts.length)Game.flags.gifts.forEach(i=>{});
  if(Game.flags.surprise){ el('ribbon').classList.remove('hidden'); questDone('fiesta'); }
};
const extraGuests=[]; // compañeros extra de la fiesta

/* ---------- LA SORPRESA: secuencia cinematográfica ---------- */
function runSurprise(){
  Game.flags.surprise=true; Save.write();
  Game.cine=true; AudioSys.sfx('surprise');
  fade(true); // 1) la habitación se queda en silencio y oscuridad
  setTimeout(()=>{
    fade(false); el('bannerFlags').textContent='✦ ✦ ✦';
    // 2) ¡SORPRESA! luces, amigos, confeti
    showBanner('¡SORPRESA!','','✦ ✦ ✦',2600);
    AudioSys.startMusic('party');
    hemiRef.intensity=.8;
    Object.values(partyNPCs).forEach(n=>{ n.mesh.visible=true; n.popT=.3; n.mesh.scale.setScalar(.01); });
    extraGuests.forEach((s,i)=>setTimeout(()=>s.visible=true,i*150));
    FX.burst(0,3,0,[0xd43a3a,0x3a7bd4,0x3ad47e,0xe3c53a,0xc43ad4],120,4,3,2.6,.2);
    setTimeout(()=>AudioSys.sfx('applause'),800);
    el('ribbon').classList.remove('hidden');
    Player.surpriseT=1.6;
    setTimeout(()=>{ Game.cine=false; questDone('fiesta');
      setMission('Habla con tus amigos ('+Game.flags.talked.filter(n=>Object.values(FRIENDS).some(f=>f.name===n)).length+'/6) · Abre los regalos ('+Game.flags.gifts.length+'/5) · Pide un deseo · Tómate la foto · Lee la carta');
      Dlg.say([{who:'Todos',text:'¡FELIZ CUMPLEAÑOS, MARÍA PAULA! ¡BIENVENIDA A GRYFFINDOR!'}]);
    },2800);
  },1600);
}
function restoreParty(){ // vuelve a mostrar la fiesta si el jugador regresa
  hemiRef.intensity=.8;
  Object.values(partyNPCs).forEach(n=>{n.mesh.visible=true; n.mesh.scale.setScalar(1);});
  extraGuests.forEach(s=>s.visible=true);
  AudioSys.startMusic('party');
  el('ribbon').classList.remove('hidden');
}
function checkPartyProgress(){ // actualiza la misión de la fiesta según progreso
  if(!Game.flags.surprise)return;
  const friendsTalked=Game.flags.talked.filter(n=>Object.values(FRIENDS).some(f=>f.name===n)).length;
  let txt='Fiesta: amigos '+friendsTalked+'/6 · regalos '+Game.flags.gifts.length+'/5 · ';
  txt+=Game.flags.wish?'deseo ✓ · ':'deseo… · ';
  txt+=Game.flags.photo?'foto ✓ · ':'foto… · ';
  txt+=Game.flags.letter?'carta ✓':'carta…';
  if(friendsTalked>=6&&Game.flags.gifts.length>=5&&Game.flags.wish&&Game.flags.photo&&Game.flags.letter){
    txt='¡TODO LISTO! Explora libremente: la sala común es tuya. Gracias por jugar ♥';
    Game.flags.free=true;
    Dlg.say([{who:'Elia (prefecta)',text:'Has vivido tu primer día mágico, María Paula. Este castillo, esta casa… y esta fiesta, son solo el comienzo.'},
             {who:'Sombrero Seleccionador',text:'La aventura continúa después de los créditos. Explora, conversa y celebra todo lo que quieras.'}]);
  }
  setMission(txt); Save.write();
}
function invAddOnce(name,ico){ if(!Game.flags.inv.some(i=>i.name===name))invAdd(name,ico); }

/* ---------- FOTOGRUPAL: se captura de la escena 3D real ---------- */
function takePhoto(){
  Game.cine=true; closePanels();
  const p0=Player.mesh.position.clone(); const r0=Player.mesh.rotation.y;
  // María Paula al centro y amigos en arco (composición de la imagen de referencia)
  Player.mesh.position.set(0,0,1.2); Player.mesh.rotation.y=Math.PI;
  const order=Object.keys(partyNPCs);
  order.forEach((k,i)=>{ const n=partyNPCs[k]; const a=Math.PI+(i-2.5)*.5;
    n.mesh.position.set(Math.sin(a)*3.4,0,Math.cos(a)*3.4+1.2); n.mesh.rotation.y=Math.atan2(-n.mesh.position.x,1.2-n.mesh.position.z); });
  extraGuests.forEach((s,i)=>{ s.position.set(-6+i*1.1,0,3.4); s.rotation.y=Math.PI; });
  // cámara frontal de la composición
  const camPos=camera.position.clone(), camQuat=camera.quaternion.clone();
  camera.position.set(0,3.1,9.6); camera.lookAt(0,1.3,0);
  el('hud').classList.add('hidden');
  renderer.render(scene,camera);
  const cd=el('countdown'); cd.classList.remove('hidden');
  let n=3; cd.textContent=n; AudioSys.sfx('chime');
  const iv=setInterval(()=>{
    n--; if(n>0){cd.textContent=n; AudioSys.sfx('chime'); return;}
    clearInterval(iv); cd.classList.add('hidden');
    AudioSys.sfx('photo'); el('flash').style.opacity=.95; setTimeout(()=>el('flash').style.opacity=0,120);
    renderer.render(scene,camera);
    try{ // descarga la fotografía como PNG real de la escena
      const url=renderer.domElement.toDataURL('image/png');
      const a=document.createElement('a'); a.href=url; a.download='foto-grupal-maria-paula.png'; a.click();
      Game.flags.photo=true; invAddOnce('Fotografía grupal','▣'); toast('¡Fotografía grupal guardada y descargada!');
    }catch(e){toast('No se pudo descargar la foto en este navegador.');}
    // restaurar escena y cámara
    Player.mesh.position.copy(p0); Player.mesh.rotation.y=r0;
    order.forEach(k=>{const n2=partyNPCs[k]; n2.mesh.position.set(n2.home[0],0,n2.home[1]); n2.mesh.rotation.y=0;});
    camera.position.copy(camPos); camera.quaternion.copy(camQuat);
    el('hud').classList.remove('hidden'); Game.cine=false; checkPartyProgress();
  },900);
}

