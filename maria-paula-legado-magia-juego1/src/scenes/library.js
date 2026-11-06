/* ############################################################
   CAPÍTULO 4 — LA BIBLIOTECA ENCANTADA
   Estanterías gigantes, libros flotantes, 3 libros antiguos + acertijo
   ############################################################ */
Builders[4]=function(){
  scene.background=new THREE.Color(0x140f08); scene.fog=new THREE.Fog(0x140f08,16,50);
  Area.bounds={x:10,z:7}; Area.camOffset.set(0,11,8);
  Area.hemi(.45,0xa08a5a,0x181008); Area.dir(.3,0xffe8c0,-6,14,4); Area.point(0xffd9a0,1,16,0,4,0);
  put(Area.group,box(24,.5,16,M(0x4a3a28)),0,-.25,0);
  put(Area.group,box(24,6,.8,M(0x3a2c1c)),0,3,-8); put(Area.group,box(24,6,.8,M(0x3a2c1c)),0,3,8);
  put(Area.group,box(.8,6,16,M(0x3a2c1c)),-12,3,0); put(Area.group,box(.8,6,16,M(0x3a2c1c)),12,3,0);
  // estanterías de varios niveles con lomos de colores
  const shelf=(x,z,ry)=>{ const g=new THREE.Group();
    put(g,box(4,4.6,.6,M(0x4a3018)),0,2.3,0);
    for(let r=0;r<4;r++){ put(g,box(3.8,.08,.5,M(0x2a1c0c)),0,.9+r*1.05,.06);
      for(let b=0;b<8;b++)put(g,box(.28,.7,.3,M([0x6b2a2a,0x2a4a6b,0x4a6b2a,0x8a6a2a,0x5a2a5a][(b+r)%5])),-1.6+b*.42,1.28+r*1.05,.06); }
    g.position.set(x,0,z); g.rotation.y=ry||0; Area.group.add(g);
    Area.colliders.push({x,z,hx:2.1,hz:.5}); return g; };
  shelf(-7,-5); shelf(-2,-5); shelf(3,-5); shelf(8,-5);
  shelf(-7,5,Math.PI); shelf(-2,5,Math.PI); shelf(3,5,Math.PI); shelf(8,5,Math.PI);
  shelf(-9,0,Math.PI/2); shelf(9,0,-Math.PI/2);
  // mesas de lectura con velas
  [[-3,0],[4,2]].forEach(([x,z])=>{ put(Area.group,box(2.6,.15,1.4,M(0x5a4026)),x,.8,z);
    put(Area.group,box(.15,.8,.15,M(0x3a2814)),x-1,.4,z-.5); put(Area.group,box(.15,.8,.15,M(0x3a2814)),x+1,.4,z+.5);
    Area.colliders.push({x,z,hx:1.4,hz:.8});
    const cd=put(Area.group,cyl(.05,.07,.5,M(0xe8dcc0)),x,1.15,z), fl=put(Area.group,cyl(.01,.04,.18,M(0xffb45e,{emissive:0xff9a2e,emissiveIntensity:1.2})),x,1.45,z);
    Area.anim.push((dt,t)=>fl.scale.y=1+Math.sin(t*10+x)*.3);
  });
  // libros flotantes animados
  for(let i=0;i<6;i++){ const bk=put(Area.group,box(.5,.12,.36,M([0x6b2a2a,0x2a4a6b,0x8a6a2a][i%3])),-5+i*2,2.4+Math.sin(i)*.6,-1+Math.cos(i)*1.5);
    const bx=bk.position.x, by=bk.position.y, bz=bk.position.z, ph=i*1.2;
    Area.anim.push((dt,t)=>{bk.position.y=by+Math.sin(t*1.4+ph)*.35; bk.rotation.y=t*.5+ph; bk.position.x=bx+Math.sin(t*.8+ph)*.3;});
  }
  // los 3 libros antiguos
  const bookNames=['Crónicas de las Estrellas','El Dragón y la Luna','Herbolario de medianoche'];
  [[-6.6,-3.9],[2.8,-3.9],[8.9,1.8]].forEach(([x,z],i)=>{
    const bk=put(Area.group,box(.6,.14,.44,M(0xd4af37,{emissive:0x8a6a1a,emissiveIntensity:.7})),x,1.05,z);
    Area.anim.push((dt,t)=>{bk.rotation.y=t; bk.position.y=1.05+Math.sin(t*2+i)*.08;});
    Area.interact.push({x,z,r:1.2,label:'Tomar “'+bookNames[i]+'”',fn(){
      if(!bk.visible)return; bk.visible=false; Game.flags.books++; AudioSys.sfx('pickup');
      FX.burst(x,1.4,z,[0xd4af37,0xfff2c0],20,1.5,2,1,.15);
      setMission(`Encuentra los 3 libros antiguos (${Math.min(3,Game.flags.books)}/3)`);
      if(Game.flags.books>=3){questDone('libros'); toast('¡Con los 3 libros podrás descifrar el mensaje del pedestal!');}
      Save.write();
    }});
  });
  quest('libros','Libros antiguos','Encuentra los 3 libros antiguos perdidos entre las estanterías.');
  // pedestal con acertijo de palabra
  put(Area.group,cyl(.5,.6,1.1,M(0x55483a)),0,.55,-6.5); Area.colliders.push({x:0,z:-6.5,hx:.6,hz:.6});
  Area.interact.push({x:0,z:-6.5,r:1.6,label:'Descifrar el mensaje mágico',fn(){
    if(Game.flags.books<3){Dlg.say([{who:'María Paula',text:'(El pedestal está vacío… Necesito los 3 libros antiguos para descifrar el mensaje.)'}]); return;}
    showModal('Mensaje mágico','Los tres libros susurran a la vez: “Soy alta cuando joven, corta cuando vieja. ¿Quién soy? Escribe mi nombre.”',[
      {label:'Descifrar',cb(v){ if((v||'').trim().toLowerCase()==='vela'||(v||'').trim().toLowerCase()==='una vela'){
          closeModal(); questDone('descifrar'); invAdd('Página del destino','✶'); AudioSys.sfx('magic'); FX.burst(0,2,-6.5,[0xd4af37,0xffe9ad],30,2,2.5,1.4,.18);
          toast('¡Mensaje descifrado! La puerta del Aula de Pociones se ha abierto.');
        } else { AudioSys.sfx('error'); toast('Las letras se reordenan… no es correcto.'); } }}
    ],'Escribe la palabra clave');
  }});
  quest('descifrar','El mensaje cifrado','Junta los 3 libros y escribe la palabra clave en el pedestal.');
  // puerta a pociones (activa tras descifrar)
  put(Area.group,box(2.6,3.6,.5,M(0x3a2410)),11.5,1.8,0);
  Area.interact.push({x:11.2,z:0,r:1.6,label:'Ir al Aula de Pociones',fn(){
    if(Game.flags.quests['descifrar']&&Game.flags.quests['descifrar'].done)goChapter(5);
    else Dlg.say([{who:'María Paula',text:'(La puerta está sellada con una cerradura de letras. Debo descifrar el mensaje del pedestal.)'}]);
  }});
  // estudiante en las mesas
  makeNPC(-3,1.2,{robe:0x2a3328,trim:0x2e5d3a,hair:0x5a3a10},[
    {who:'Estudiante',text:'Shhh… los libros duermen. Busca los que brillan dorado, esos son los antiguos.'}],'Estudiante');
  setLocation('La Biblioteca Encantada'); setMission(`Encuentra los 3 libros antiguos (${Math.min(3,Game.flags.books)}/3)`);
  AudioSys.startMusic('library');
  Player.mesh.position.set(-9,0,5); Player.mesh.rotation.y=2.6;
};

