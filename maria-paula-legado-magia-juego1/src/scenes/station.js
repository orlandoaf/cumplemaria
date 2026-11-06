/* ############################################################
   CAPÍTULO 1 — LA CARTA Y EL EXPRESO DE HOGWARTS
   Estación nocturna: andén, locomotora, farolas, vapor, NPCs
   ############################################################ */
Builders[1]=function(){
  scene.background=new THREE.Color(0x0b0e18); scene.fog=new THREE.Fog(0x0b0e18,22,70);
  Area.bounds={x:13,z:8}; Area.camOffset.set(0,12,9);
  Area.hemi(.55,0x5a6a9a,0x1a120a); Area.dir(.5,0xb0c0ff,-8,14,6); Area.point(0xffb45e,1.2,18,0,4,-2);
  // suelo del andén (losas oscuras)
  put(Area.group,box(30,.5,20,M(0x3a3a42)),0,-.25,0);
  // vías del tren
  put(Area.group,box(30,.12,.12,M(0x555560)),0,.06,-5.6);
  put(Area.group,box(30,.12,.12,M(0x555560)),0,.06,-6.4);
  // locomotora roja oscura con caldera y chimenea
  const train=new THREE.Group();
  put(train,box(5,1.6,1.8,M(0x5a1a12)),0,1.1,0);
  put(train,cyl(.7,.7,2.4,M(0x2a2a30)),0,1.2,0).rotation.z=Math.PI/2;
  put(train,cyl(.28,.34,1,M(0x1a1a20)),-1.6,2.4,0);
  put(train,box(1.4,1.2,1.8,M(0x3a3a44)),2.2,1.9,0);
  put(train,cyl(.5,.5,.3,M(0xffd97a)),2.2,2.1,.95).rotation.x=Math.PI/2; // faro
  train.position.set(-6,0,-6); Area.group.add(train);
  Area.colliders.push({x:-6,z:-6,hx:3.5,hz:1.2});
  // vagones
  for(let i=0;i<2;i++){ const v=put(Area.group,box(4,1.7,1.8,M(0x2e2e3a)),3+i*4.4,1.05,-6);
    Area.colliders.push({x:3+i*4.4,z:-6,hx:2.1,hz:1}); }
  // bancas, equipaje, farolas con luz cálida
  const props=[[-9,2,'bench'],[-4,3.4,'luggage'],[3,3.2,'bench'],[8,2.6,'luggage']];
  props.forEach(([x,z,k])=>{
    if(k==='bench'){ put(Area.group,box(2,.12,.6,M(0x4a3520)),x,.55,z); put(Area.group,box(.15,.55,.5,M(0x3a2a18)),x-.85,.28,z); put(Area.group,box(.15,.55,.5,M(0x3a2a18)),x+.85,.28,z); Area.colliders.push({x,z,hx:1.1,hz:.4}); }
    else { for(let j=0;j<3;j++)put(Area.group,box(.5,.4,.4,M([0x6b4a2a,0x4a3a5a,0x3a5a4a][j])),x+(j-1)*.55,.2+j*.12,z); Area.colliders.push({x,z,hx:1,hz:.5}); }
  });
  [[-10,-2],[0,-2],[10,-2],[-6,5],[6,5]].forEach(([x,z],i)=>{ // farolas
    put(Area.group,cyl(.07,.09,2.6,M(0x2a2a30)),x,1.3,z);
    put(Area.group,box(.4,.5,.4,M(0xffd97a,{emissive:0xffb45e,emissiveIntensity:.9})),x,2.75,z);
    if(i<3)Area.point(0xffb45e,.9,9,x,2.8,z);
    Area.colliders.push({x,z,hx:.2,hz:.2});
  });
  // vapor ambiental de la locomotora
  const steamG=new THREE.BufferGeometry(), sp=new Float32Array(30*3);
  for(let i=0;i<30;i++){sp[i*3]=-7.5+Math.random(); sp[i*3+1]=3+Math.random()*2; sp[i*3+2]=-6+Math.random()*.6;}
  steamG.setAttribute('position',new THREE.BufferAttribute(sp,3));
  const steam=new THREE.Points(steamG,new THREE.PointsMaterial({size:.5,color:0xbbbbcc,transparent:true,opacity:.4}));
  Area.group.add(steam);
  Area.anim.push((dt,t)=>{const p=steam.geometry.attributes.position; for(let i=0;i<30;i++){p.array[i*3+1]+=dt*.8; if(p.array[i*3+1]>7)p.array[i*3+1]=3;} p.needsUpdate=true;});
  // NPCs: dos estudiantes y la prefecta guía
  makeNPC(-3,1,{robe:0x2a3328,trim:0x2e5d3a,hair:0x2a1a0a},[{who:'Estudiante',text:'¿Primera vez en Hogwarts? No te preocupes, el castillo parece laberinto pero los retratos ayudan.'}],'Estudiante');
  makeNPC(-1.6,1.4,{robe:0x332a3a,trim:0x3a2a5a,hair:0x5a3a10},[{who:'Estudiante',text:'Dicen que el techo del Gran Comedor refleja el cielo de verdad. ¡Espero ver estrellas!'}],'Estudiante');
  const elia=makeNPC(10,-3,{robe:0x3a2430,trim:0xd4af37,hair:0x1a1a1a},[
    {who:'Elia (prefecta)',text:'¿María Paula? ¡Te estaba esperando! Llegas justo a tiempo.'},
    {who:'Elia (prefecta)',text:'Soy Elia, prefecta de Gryffindor. Te acompañaré hasta el castillo por el sendero del lago.'},
    {who:'Elia (prefecta)',text:'Antes de partir, mira el andén: a veces los viajeros olvidan cosas mágicas entre las bancas.'}],'Elia','#ffd97a');
  Area.interact.push({x:12,z:-3,r:1.6,off:false,label:'Seguir a Elia hacia el castillo',fn(){
    if(Game.flags.talked.includes('Elia')){questDone('guia'); goChapter(2);}
    else Dlg.say([{who:'María Paula',text:'(Debería hablar con la prefecta primero… está junto a las farolas del fondo.)'}]);
  }});
  quest('guia','Encuentra a tu guía','Habla con la prefecta Elia en el andén. Revisa también el equipaje y las bancas.');
  Area.interact.push({x:-4,z:3.4,r:1.3,label:'Revisar el equipaje',fn(){
    if(!Game.flags.inv.some(i=>i.name==='Medallón de luna')){invAdd('Medallón de luna','☾'); Dlg.say([{who:'María Paula',text:'¡Un medallón con una luna! Brilla suave… alguien lo habrá perdido. Me lo guardo por si acaso.'}]);}
    else toast('Solo maletas con ropa y un sapo que ronca.');
  }});
  Area.interact.push({x:3,z:3.2,r:1.3,label:'Buscar entre las bancas',fn(){
    if(!Game.flags.inv.some(i=>i.name==='Varita de abedul')){invAdd('Varita de abedul','🪄'); Dlg.say([{who:'María Paula',text:'¡Una varita! Madera de abedul, flexible… siente mi mano. Creo que… sí, es mía ahora.'}]);}
    else toast('Nada más por aquí.');
  }});
  Area.interact.push({x:-9,z:-4.5,r:1.5,label:'Leer la carta otra vez',fn(){showLetter(INTRO_LETTER.title,INTRO_LETTER.body);}});
  setLocation('Estación del Expreso'); setMission('Capítulo 1 · Encuentra a la prefecta guía');
  AudioSys.startMusic('station');
  Player.mesh.position.set(-10,0,4); Player.mesh.rotation.y=2.4;
};

