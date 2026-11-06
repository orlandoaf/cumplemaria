/* ############################################################
   CAPÍTULO 2 — EL CAMINO HACIA EL CASTILLO
   Bosque nocturno, puente de piedra, lago y el castillo a lo lejos
   ############################################################ */
Builders[2]=function(){
  scene.background=new THREE.Color(0x0a1020); scene.fog=new THREE.Fog(0x0a1020,20,80);
  Area.bounds={x:14,z:10}; Area.camOffset.set(0,13,9);
  const hemi=Area.hemi(.4,0x4a5a8a,0x14200f); Area.dir(.35,0x8aa0d0,6,16,4);
  // césped y sendero
  put(Area.group,box(34,.5,26,M(0x1e2e1a)),0,-.25,0);
  put(Area.group,box(3,.52,26,M(0x5a4a32)),0,0,0);
  // lago con puente
  put(Area.group,box(34,.3,7,M(0x14283e,{emissive:0x0a1a2e,emissiveIntensity:.4})),0,-.1,-6);
  put(Area.group,box(4,.6,7.4,M(0x4a4550)),0,.3,-6); // puente de piedra
  Area.colliders.push({x:0,z:-6,hx:2,hz:3.7}); // barandillas laterales
  Area.colliders.push({x:-2.1,z:-6,hx:.25,hz:3.7}); Area.colliders.push({x:2.1,z:-6,hx:.25,hz:3.7});
  // árboles con colisión
  const trees=[[-6,3],[-9,-1],[6,4],[9,0],[-4,7],[5,8],[-11,6],[11,5],[7,-3],[-7,-3],[12,-6],[-12,-6]];
  trees.forEach(([x,z])=>{ const s=.8+Math.random()*.5;
    put(Area.group,cyl(.14*s,.2*s,1.6*s,M(0x3a2a1a)),x,.8*s,z);
    put(Area.group,cyl(.02,1.1*s,2.4*s,M(0x1e3a1e,{}),7),x,2.6*s,z);
    put(Area.group,cyl(.02,.8*s,1.8*s,M(0x2a4a24),7),x,3.6*s,z);
    Area.colliders.push({x,z,hx:.4,hz:.4});
    Area.anim.push((dt,t)=>{}); // reservado para animación de vegetación
  });
  // luciérnagas
  const fg=new THREE.BufferGeometry(), fp=new Float32Array(24*3);
  for(let i=0;i<24;i++){fp[i*3]=Math.random()*26-13; fp[i*3+1]=1+Math.random()*3; fp[i*3+2]=Math.random()*18-9;}
  fg.setAttribute('position',new THREE.BufferAttribute(fp,3));
  const flies=new THREE.Points(fg,new THREE.PointsMaterial({size:.16,color:0xd8e88a,transparent:true,opacity:.9}));
  Area.group.add(flies);
  Area.anim.push((dt,t)=>{const p=flies.geometry.attributes.position; for(let i=0;i<24;i++){p.array[i*3]+=Math.sin(t+i)*dt*.5; p.array[i*3+2]+=Math.cos(t*.7+i)*dt*.5;} p.needsUpdate=true;});
  // silueta del castillo a lo lejos (torres con ventanas iluminadas)
  const castle=new THREE.Group();
  for(let i=0;i<5;i++){ const w=i%2?2.4:3, h=6+i*1.4;
    put(castle,box(w,h,w,M(0x1a1626)),(i-2)*3.4,h/2,-24);
    put(castle,cyl(.02,w*.75,2.4,M(0x241e38),4),(i-2)*3.4,h+1.2,-24);
    for(let j=0;j<3;j++)put(castle,box(.4,.6,.1,M(0xffd97a,{emissive:0xffb45e,emissiveIntensity:.9})),(i-2)*3.4+(Math.random()-.5)*w*.5,2+j*1.8,-24+w/2+.01);
  }
  Area.group.add(castle);
  // 3 objetos mágicos extraviados
  const orbCols=[0x7ec8e3,0xe3c87e,0xc37ee3], orbNames=['Lagrima de estrella','Escama de dragón','Flor de luna'];
  [[-8,-4],[10,2],[2,-8]].forEach(([x,z],i)=>{
    const orb=put(Area.group,cyl(.22,.22,.55,M(orbCols[i],{emissive:orbCols[i],emissiveIntensity:.8}),10),x,.6,z);
    const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(orbCols[i]),transparent:true,depthWrite:false}));
    gl.scale.set(1.6,1.6,1); gl.position.set(x,1,z); Area.group.add(gl);
    Area.anim.push((dt,t)=>{orb.position.y=.6+Math.sin(t*2+i)*.15; orb.rotation.y+=dt;});
    Area.interact.push({x,z,r:1.2,label:'Recoger '+orbNames[i],fn(){
      if(orb.visible===false)return;
      orb.visible=false; gl.visible=false; AudioSys.sfx('pickup'); FX.burst(x,1,z,[orbCols[i],0xffffff],24,2,2,1.2,.16);
      Game.flags.orbs++; invAdd(orbNames[i],'✦');
      setMission(`Recupera los 3 objetos mágicos (${Math.min(3,Game.flags.orbs)}/3)`);
      if(Game.flags.orbs>=3){questDone('objetos'); toast('¡Objetos mágicos completos! Ve al puente.');}
      Save.write();
    }});
  });
  quest('objetos','Objetos extraviados','Recupera los 3 objetos mágicos perdidos en el bosque.');
  // estatua con acertijo
  const statue=put(Area.group,box(.9,1.8,.9,M(0x5a5560)),-3,1.2,-3);
  put(Area.group,box(1.2,.3,1.2,M(0x4a4550)),-3,.15,-3);
  Area.colliders.push({x:-3,z:-3,hx:.6,hz:.6});
  Area.interact.push({x:-3,z:-3,r:1.5,label:'Acertijo de la estatua',fn(){
    showModal('La estatua despierta','"Soy alta cuando soy joven y corta cuando soy vieja. ¿Qué soy?"',[
      {label:'Una vela',cb(){ if(!Game.flags.runa){Game.flags.runa=true; invAdd('Runa de luz','◈'); questDone('acertijo'); AudioSys.sfx('magic'); toast('La estatua asiente y entrega una Runa de luz.');} else toast('La estatua vuelve a su letargo.'); }},
      {label:'Un río',cb(){AudioSys.sfx('error'); toast('La estatua niega con la cabeza. Inténtalo de nuevo.');}},
      {label:'El tiempo',cb(){AudioSys.sfx('error'); toast('La estatua niega con la cabeza. Inténtalo de nuevo.');}}
    ]);
  }});
  quest('acertijo','La estatua del sendero','Resuelve el acertijo de la estatua de piedra.');
  // recompensa oculta tras un árbol
  Area.interact.push({x:-11.5,z:7,r:1.2,label:'Algo brilla tras el árbol',fn(){
    invAdd('Cáliz de plata','♕'); AudioSys.sfx('magic'); FX.burst(-11.5,1,7,[0xc0c8d8,0xffffff],20,1.5,2,1,.15);
    Area.interact=Area.interact.filter(i=>i.label!=='Algo brilla tras el árbol');
  }});
  // Elia espera tras el puente
  makeNPC(0,-8.8,{robe:0x3a2430,trim:0xd4af37,hair:0x1a1a1a},[
    {who:'Elia (prefecta)',text:'¡Buen trabajo con los objetos! Esa varita nueva… te conviene.'},
    {who:'Elia (prefecta)',text:'El castillo te espera. ¡Bienvenida a Hogwarts, María Paula!'}],'Elia','#ffd97a');
  Area.interact.push({x:0,z:-9.6,r:1.6,label:'Entrar al castillo',fn(){
    if(Game.flags.orbs>=3&&Game.flags.runa){questDone('camino'); goChapter(3);}
    else Dlg.say([{who:'Elia (prefecta)',text:'Aún no puedes entrar: recupera los 3 objetos mágicos y resuelve el acertijo de la estatua.'}]);
  }});
  setLocation('El Camino al Castillo'); setMission(`Recupera los 3 objetos mágicos (${Math.min(3,Game.flags.orbs)}/3)`);
  AudioSys.startMusic('path');
  Player.mesh.position.set(0,0,8); Player.mesh.rotation.y=Math.PI;
};
