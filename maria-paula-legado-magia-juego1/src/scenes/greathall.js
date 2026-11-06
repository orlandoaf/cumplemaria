/* ############################################################
   CAPÍTULO 6 — EL GRAN COMEDOR Y EL SOMBRERO SELECCIONADOR
   Velas flotantes, techo estrellado, mesas de las casas, ceremonia
   ############################################################ */
let sortingDone=false;
Builders[6]=function(){
  scene.background=new THREE.Color(0x0c0a14); scene.fog=new THREE.Fog(0x0c0a14,20,60);
  Area.bounds={x:11,z:8}; Area.camOffset.set(0,12,9);
  Area.hemi(.5,0x8a7aa0,0x1a1408); Area.dir(.4,0xc0b0e0,0,18,6); Area.point(0xffc86e,1.1,20,0,5,0);
  put(Area.group,box(28,.5,20,M(0x4a4436)),0,-.25,0);
  put(Area.group,box(28,8,.8,M(0x322a3a)),0,4,-10); put(Area.group,box(28,8,.8,M(0x322a3a)),0,4,10);
  put(Area.group,box(.8,8,20,M(0x322a3a)),-14,4,0); put(Area.group,box(.8,8,20,M(0x322a3a)),14,4,0);
  // techo estrellado nocturno
  const sg=new THREE.BufferGeometry(), sp2=new Float32Array(220*3);
  for(let i=0;i<220;i++){sp2[i*3]=Math.random()*26-13; sp2[i*3+1]=7.4+Math.random()*.8; sp2[i*3+2]=Math.random()*18-9;}
  sg.setAttribute('position',new THREE.BufferAttribute(sp2,3));
  Area.group.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.09,color:0xfff2c0,transparent:true,opacity:.95})));
  // velas flotantes que oscilan
  for(let i=0;i<12;i++){ const x=(i%2? -1:1)*(3+ (i%3)*2.6), z=-6+i*1.1;
    put(Area.group,cyl(.05,.05,.5,M(0xe8dcc0)),x,4.6,z);
    const fl=put(Area.group,cyl(.01,.05,.16,M(0xffb45e,{emissive:0xffc86e,emissiveIntensity:1.3})),x,4.95,z);
    Area.anim.push((dt,t)=>{fl.position.y=4.95+Math.sin(t*1.2+i)*.2; fl.material.emissiveIntensity=1+Math.sin(t*7+i)*.4;});
  }
  // mesas de las casas con estudiantes y platos
  const table=(x,z,col)=>{ put(Area.group,box(1.6,.5,9,M(0x4a3520)),x,.55,z);
    put(Area.group,box(2.2,.1,9.4,M(col)),x,.85,z);
    Area.colliders.push({x,z,hx:1.2,hz:4.7});
    for(let i=0;i<5;i++){ const s=makeCharacter({robe:0x22222a,trim:col,hair:[0x2a1a0a,0x5a3a10,0x1a1a1a][i%3]});
      s.position.set(x+(i%2? -1.3:1.3)*.9,0,z-3.4+i*1.7); s.rotation.y=i%2?Math.PI/2:-Math.PI/2; Area.group.add(s);
      Area.anim.push((dt,t)=>animChar(s,t,false)); }
    for(let i=0;i<6;i++)put(Area.group,cyl(.14,.14,.06,M(0xc0c8d8)),x+.6*Math.sin(i*2),1,z-3+i*1.2);
  };
  table(-6,0,0x7b1d12); table(6,0,0x1a4723); table(-9.5,0,0xb08d2a); table(9.5,0,0x27408b);
  // mesa de profesores al fondo
  put(Area.group,box(8,.7,1.4,M(0x3a2a40)),0,.9,-8.4); Area.colliders.push({x:0,z:-8.4,hx:4.2,hz:.9});
  for(let i=0;i<4;i++){ const p=makeCharacter({robe:0x1c1c24,trim:0xd4af37,hair:[0xd8d0c0,0x3a2a1a,0x1a1a1a,0x6b6b76][i]});
    p.position.set(-3+i*2,0,-8.6); p.rotation.y=0; Area.group.add(p); Area.anim.push((dt,t)=>animChar(p,t,false)); }
  // el Sombrero sobre su taburete
  put(Area.group,cyl(.5,.5,.6,M(0x4a3520)),0,.3,-6.8);
  const hat=put(Area.group,cyl(.28,.55,.7,M(0x6b4a2a)),0,1,-6.8);
  put(Area.group,box(.2,.1,.05,M(0x201510)),-.12,1.05,-6.5); put(Area.group,box(.2,.1,.05,M(0x201510)),.12,1.05,-6.5); // ojos del sombrero
  Area.colliders.push({x:0,z:-6.8,hx:.6,hz:.6});
  Area.interact.push({x:0,z:-6.6,r:1.8,label:'Acercarse al Sombrero Seleccionador',fn(){ if(!sortingDone)runSorting(hat); else toast('El Sombrero duerme… ya decidió.'); }});
  quest('sombrero','La Ceremonia de Selección','Atraviesa el comedor y colócate frente al Sombrero Seleccionador.');
  setLocation('El Gran Comedor'); setMission('Acércate al Sombrero Seleccionador al fondo del salón');
  AudioSys.startMusic('hall');
  Player.mesh.position.set(0,0,7); Player.mesh.rotation.y=Math.PI;
};
function runSorting(hat){ // secuencia cinematográfica de la selección
  sortingDone=true; Game.cine=true;
  AudioSys.sfx('magic'); fade(true,true); // ambiente se oscurece
  setTimeout(()=>{
    Dlg.say(SORTING_SPEECH,()=>{ // al terminar el discurso: ¡GRYFFINDOR!
      Game.flags.gryffindor=true; Player.setGryffindor(); Player.celebrateT=2.6;
      AudioSys.sfx('fanfare'); setTimeout(()=>AudioSys.sfx('applause'),600);
      showBanner('¡GRYFFINDOR!','MARÍA PAULA','✦ ✦ ✦',3200);
      const p=Player.mesh.position;
      FX.burst(p.x,2,p.z,[0x8b1a1a,0xd4af37,0xffe9ad],60,3,3,2,.22);
      FX.burst(p.x-2,3,p.z,[0xd4af37,0x8b1a1a],40,2.5,3,1.8,.2);
      questDone('sombrero'); Save.write();
      setTimeout(()=>{ fade(true,true); setTimeout(()=>{ fade(false); Game.cine=false; Dlg.say([
        {who:'Elia (prefecta)',text:'¡LO SABÍA! Ven, te mostraré la sala común de Gryffindor. Hay alguien que quiere verte…'},
      ],()=>goChapter(7)); },700); },3200);
    });
  },900);
}

