/* ############################################################
   CAPÍTULO 3 — EL CASTILLO DE HOGWARTS
   Pasillo medieval: antorchas, cuadros, armaduras, fantasmas
   ############################################################ */
Builders[3]=function(){
  scene.background=new THREE.Color(0x120c06); scene.fog=new THREE.Fog(0x120c06,18,55);
  Area.bounds={x:11,z:7}; Area.camOffset.set(0,11,8);
  Area.hemi(.5,0x9a7a5a,0x1a1208); Area.dir(.35,0xffd9a0,6,14,4);
  // suelo de piedra y alfombra
  put(Area.group,box(26,.5,18,M(0x4a4038)),0,-.25,0);
  put(Area.group,box(2.4,.54,18,M(0x5a1420)),0,0,0);
  // paredes
  put(Area.group,box(26,6,.8,M(0x3a3128)),0,3,-9); put(Area.group,box(26,6,.8,M(0x3a3128)),0,3,9);
  put(Area.group,box(.8,6,18,M(0x3a3128)),-13,3,0); put(Area.group,box(.8,6,18,M(0x3a3128)),13,3,0);
  // columnas
  for(let i=-2;i<=2;i++){ put(Area.group,cyl(.5,.6,5,M(0x55483a)),i*5,2.5,-6.5); put(Area.group,cyl(.5,.6,5,M(0x55483a)),i*5,2.5,6.5);
    Area.colliders.push({x:i*5,z:-6.5,hx:.6,hz:.6},{x:i*5,z:6.5,hx:.6,hz:.6}); }
  // antorchas con llamas animadas
  [[-8,-8.4],[-2,-8.4],[4,-8.4],[10,-8.4],[-8,8.4],[-2,8.4],[4,8.4],[10,8.4]].forEach(([x,z],i)=>{
    put(Area.group,cyl(.06,.06,.7,M(0x2a2018)),x,2.6,z);
    const fl=put(Area.group,cyl(.02,.14,.4,M(0xffb45e,{emissive:0xff9a2e,emissiveIntensity:1})),x,3.1,z);
    Area.anim.push((dt,t)=>{fl.scale.y=1+Math.sin(t*9+i)*.25; fl.material.emissiveIntensity=.8+Math.sin(t*11+i)*.3;});
    if(i%3===0)Area.point(0xff9a2e,.8,8,x,3.2,z*1.01);
  });
  // cuadros interactivos
  const lore=[
    ['Retrato del Fundador','“Si buscas la sala del Gran Comedor, sigue el olor a festín… o pregunta a un fantasma amable.”'],
    ['Paisaje del Lago','Un cuadro donde el agua se mueve. Una voz susurra: “La biblioteca guarda las respuestas antiguas.”'],
    ['Batalla de las Casas','Pinceladas épicas de rojo y dorado. El oro de Gryffindor brilla un poco más que el resto.']];
  [[-6,-8.55,0],[2,-8.55,1],[8,8.55,2]].forEach(([x,z,i])=>{
    put(Area.group,box(2.2,1.6,.1,M(0xd4af37)),x,2.6,z);
    put(Area.group,box(1.9,1.3,.12,M([0x5a3a2a,0x2a4a5a,0x6b2a2a][i])),x,2.6,z);
    Area.interact.push({x,z:z*0.94,r:1.4,label:lore[i][0],fn(){Dlg.say([{who:lore[i][0],text:lore[i][1]}]); AudioSys.sfx('chime');}});
  });
  // armaduras decorativas
  [[-4,6],[6,-6]].forEach(([x,z])=>{
    put(Area.group,box(.7,1.2,.5,M(0x8a8a96,{emissive:0x222228,emissiveIntensity:.3})),x,1,z);
    put(Area.group,box(.5,.4,.4,M(0x9a9aa6)),x,1.85,z);
    Area.colliders.push({x,z,hx:.45,hz:.4});
  });
  // fantasma guía
  const ghost=makeNPC(-9,-4,{robe:0xbcd8e8,trim:0xdff,skin:0xe8f4ff,hair:0xdff},[
    {who:'Fantasma amable',text:'¡Ah, una carita nueva! Busca la puerta al fondo: Biblioteca a la izquierda del pasillo, Pociones a la derecha…'},
    {who:'Fantasma amable',text:'¿El Gran Comedor? Sigue recto y sigue tu hambre, joven.'}],'Fantasma','#cfe8ff');
  ghost.mesh.traverse(o=>{if(o.material&&o.material.color)o.material.transparent=true, o.material.opacity=.75;});
  // mesas y barriles
  put(Area.group,box(2,.8,1,M(0x4a3520)),-9,0.4,3); Area.colliders.push({x:-9,z:3,hx:1.1,hz:.6});
  put(Area.group,box(2,.8,1,M(0x4a3520)),7,0.4,5); Area.colliders.push({x:7,z:5,hx:1.1,hz:.6});
  // puerta a la biblioteca
  put(Area.group,box(2.6,3.6,.5,M(0x5a3a1a)),-11,1.8,-6.5);
  put(Area.group,box(.3,.3,.6,M(0xd4af37)),-10.2,1.6,-6.2);
  Area.interact.push({x:-11,z:-6.2,r:1.6,label:'Entrar a la Biblioteca',fn(){questDone('castillo'); goChapter(4);}});
  quest('castillo','Explora el castillo','Recorre los pasillos, mira los cuadros y encuentra la Biblioteca.');
  setLocation('Pasillos de Hogwarts'); setMission('Encuentra la puerta de la Biblioteca (mira los cuadros y habla con el fantasma)');
  AudioSys.startMusic('castle');
  Player.mesh.position.set(10,0,5); Player.mesh.rotation.y=-2.2;
};

