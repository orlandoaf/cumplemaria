/* ############################################################
   MENÚS, ARRANQUE Y BUCLE PRINCIPAL
   ############################################################ */
el('btnNew').onclick=()=>{ AudioSys.init(); Save.clear(); resetFlags(); el('menu').classList.add('hidden'); el('hud').classList.remove('hidden');
  showLetter(INTRO_LETTER.title,INTRO_LETTER.body);
  const old=el('letterClose').onclick; el('letterClose').onclick=()=>{ el('letter').classList.add('hidden'); el('letterClose').onclick=old; Game.flags.intro=true; goChapter(1); };
};
el('btnContinue').onclick=()=>{ AudioSys.init(); const d=Save.read(); if(!d)return;
  resetFlags(d); el('menu').classList.add('hidden'); el('hud').classList.remove('hidden');
  if(Game.flags.gryffindor)Player.setGryffindor();
  goChapter(d.chapter||1);
};
el('btnControls').onclick=()=>showInfo('Controles',
  '<b>WASD / Flechas</b> — moverse<br><b>Shift</b> — correr<br><b>E</b> — interactuar / avanzar diálogo<br><b>Espacio</b> — avanzar diálogo<br><b>I</b> — inventario · <b>J</b> — misiones · <b>M</b> — mapa<br><b>ESC</b> — menú de pausa<br><br>En móviles: joystick virtual y botones en pantalla.');
el('btnCredits').onclick=()=>showInfo('Créditos',
  '<b>MARÍA PAULA: EL LEGADO DE LA MAGIA</b><br><br>Una aventura creada especialmente para María Paula.<br><br>Dirección de arte inspirada en RPG pixel-art premium cálido: piedra, velas, ventanales góticos y luz dorada.<br><br>Personajes: María Paula, Orlando, Marce, María Angélica, Yus, Mauro, Jeisson y amigos.<br><br>Motor: Three.js · Música generada en vivo con WebAudio.');
el('btnResume').onclick=()=>closePanels();
el('btnMute').onclick=()=>{ const m=AudioSys.toggleMute(); el('btnMute').textContent='Sonido: '+(m?'Silenciado':'Activado'); };
el('btnHow').onclick=()=>el('btnControls').onclick();
el('btnSaveQuit').onclick=()=>{ Save.write(); closePanels(); AudioSys.stopMusic(); el('hud').classList.add('hidden'); el('menu').classList.remove('hidden'); refreshMenu(); };

function resetFlags(saved){ // reinicia o aplica un guardado previo
  Game.chapter=0; sortingDone=false;
  Game.flags={intro:false,gryffindor:false,surprise:false,photo:false,letter:false,wish:false,free:false,
    gifts:[],inv:[],talked:[],quests:{},orbs:0,books:0,potion:false,runa:false,chapter:1};
  if(saved)Object.assign(Game.flags,saved);
  renderQuests(); renderInventory();
}
function refreshMenu(){ el('btnContinue').disabled=!Save.has(); }

/* Bucle principal de renderizado */
const clock=new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.05), t=clock.elapsedTime;
  if(!Game.paused){
    if(Player.mesh){
      if(!Game.cine||true)updatePlayer(dt,t); // la cámara sigue incluso en cinemáticas
      Area.npcs.forEach(n=>n.update&&n.update(dt,t));
      Area.anim.forEach(a=>a(dt,t));
      FX.update(dt);
      scanInteract();
    }
  }
  renderer.render(scene,camera);
}

/* Arranque */
Player.init();
refreshMenu();
el('menu').classList.remove('hidden');
loop();
