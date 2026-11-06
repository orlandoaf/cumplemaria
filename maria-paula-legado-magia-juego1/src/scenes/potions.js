/* ############################################################
   CAPÍTULO 5 — EL AULA DE POCIONES
   Calderos humeantes, ingredientes, minijuego de receta
   ############################################################ */
Builders[5]=function(){
  scene.background=new THREE.Color(0x100c12); scene.fog=new THREE.Fog(0x100c12,16,50);
  Area.bounds={x:10,z:7}; Area.camOffset.set(0,11,8);
  Area.hemi(.5,0x7a6a8a,0x141008); Area.dir(.3,0xc0b0ff,-6,14,-4); Area.point(0x9a7ee3,.9,16,0,3.4,0);
  put(Area.group,box(24,.5,16,M(0x3a3440)),0,-.25,0);
  put(Area.group,box(24,6,.8,M(0x2c2834)),0,3,-8); put(Area.group,box(24,6,.8,M(0x2c2834)),0,3,8);
  put(Area.group,box(.8,6,16,M(0x2c2834)),-12,3,0); put(Area.group,box(.8,6,16,M(0x2c2834)),12,3,0);
  // mesas de trabajo
  [[-5,0],[3,-2],[5,4]].forEach(([x,z])=>{ put(Area.group,box(3.4,.16,1.6,M(0x4a3a50)),x,.85,z);
    put(Area.group,box(.16,.85,.16,M(0x2a2230)),x-1.5,.42,z-.6); put(Area.group,box(.16,.85,.16,M(0x2a2230)),x+1.5,.42,z+.6);
    Area.colliders.push({x,z,hx:1.8,hz:.9}); });
  // calderos con vapores de colores
  [[-5,0,0x9a7ee3],[3,-2,0x7ee3a0],[5,4,0xe3a07e]].forEach(([x,z,col],i)=>{
    put(Area.group,cyl(.55,.4,.8,M(0x1c1c22)),x,1.3,z);
    const liq=put(Area.group,cyl(.5,.5,.06,M(col,{emissive:col,emissiveIntensity:.9})),x,1.72,z);
    // vapor: partículas que ascienden en bucle
    const n=14, gp=new THREE.BufferGeometry(), pp=new Float32Array(n*3);
    for(let j=0;j<n;j++){pp[j*3]=x+(Math.random()-.5)*.5; pp[j*3+1]=1.8+Math.random()*1.6; pp[j*3+2]=z+(Math.random()-.5)*.5;}
    gp.setAttribute('position',new THREE.BufferAttribute(pp,3));
    const st=new THREE.Points(gp,new THREE.PointsMaterial({size:.2,color:col,transparent:true,opacity:.55}));
    Area.group.add(st);
    Area.anim.push((dt,t)=>{ const p=st.geometry.attributes.position;
      for(let j=0;j<n;j++){ p.array[j*3+1]+=dt*.7; p.array[j*3]+=Math.sin(t*3+j)*dt*.15;
        if(p.array[j*3+1]>3.6)p.array[j*3+1]=1.8; }
      p.needsUpdate=true; liq.material.emissiveIntensity=.7+Math.sin(t*3+i)*.3; });
    Area.colliders.push({x,z,hx:.7,hz:.7});
  });
  // estantería de ingredientes con frascos de colores
  put(Area.group,box(6,3.6,.5,M(0x3a2c1c)),-9,1.8,-7.4);
  for(let r=0;r<3;r++)for(let b=0;b<6;b++)
    put(Area.group,cyl(.12,.14,.4,M([0x7ee3a0,0xe3c87e,0xc37ee3,0xe37e7e,0x7ec8e3,0xd8e87e][b],{emissive:[0x7ee3a0,0xe3c87e,0xc37ee3,0xe37e7e,0x7ec8e3,0xd8e87e][b],emissiveIntensity:.5})),-11+b*.8,.8+r*1.05,-7.1);
  Area.colliders.push({x:-9,z:-7.4,hx:3.1,hz:.4});
  // profesora
  makeNPC(-2,-5,{robe:0x3a2438,trim:0x6a4a8a,hair:0xd8d0c0},[
    {who:'Profesora Beatriz',text:'María Paula, justo a tiempo. Hoy prepararemos la Poción del Corazón Valiente.'},
    {who:'Profesora Beatriz',text:'Receta: primero Escamas de dragón, luego Rocío lunar y por último una pizca de Raíz de mandrágora. En ese orden, ni uno distinto.'},
    {who:'Profesora Beatriz',text:'Los ingredientes están en la mesa del centro. Con calma y con gracia. ¡Manos a la poción!'}],'Profesora','#d8b0ff');
  quest('pocion','La Poción del Corazón Valiente','Prepara la poción siguiendo la receta exacta de la profesora.');
  // minijuego de la mesa central
  const ING=[['Escamas de dragón',0xe37e7e],['Rocío lunar',0x7ec8e3],['Raíz de mandrágora',0x7ee3a0],['Ojo de tritón',0xd8e87e],['Pluma de fénix',0xe3c87e],['Lágrima de troll',0xc37ee3]];
  Area.interact.push({x:3,z:-2,r:2,label:'Preparar la poción',fn(){
    let step=0; const recipe=[0,1,2]; // índices correctos en orden
    const tryStep=idx=>{
      if(idx===recipe[step]){ step++; AudioSys.sfx('pickup');
        if(step===3){ Game.flags.potion=true; questDone('pocion'); invAdd('Poción del Corazón Valiente','⚗'); closeModal();
          AudioSys.sfx('magic'); FX.burst(3,2,-2,[0xe3a07e,0xffe9ad],30,2,2.5,1.5,.18);
          Dlg.say([{who:'Profesora Beatriz',text:'¡Color ámbar perfecto! Nota máxima. El Gran Comedor te espera: la ceremonia está por comenzar.'}]);
          Save.write(); return; }
        showModal('Poción del Corazón Valiente','¡Bien! El caldero burbujea contento. Siguiente ingrediente ('+step+'/3):',mkBtns());
      } else { step=0; AudioSys.sfx('error'); showModal('¡Puf!','El caldero tose una nube violeta… la secuencia se reinició. Empieza de nuevo por Escamas de dragón.',mkBtns()); }
    };
    const mkBtns=()=>ING.map((it,i)=>({label:it[0],cb(){tryStep(i);}}));
    showModal('Poción del Corazón Valiente','Recuerda la receta de la profesora:\n1) Escamas de dragón → 2) Rocío lunar → 3) Raíz de mandrágora.\nElige el primer ingrediente:',mkBtns());
  }});
  // puerta al Gran Comedor
  put(Area.group,box(2.8,3.8,.5,M(0x4a2e10)),0,1.9,-7.5);
  put(Area.group,box(.3,.3,.6,M(0xd4af37)),1,1.7,-7.2);
  Area.interact.push({x:0,z:-7.1,r:1.7,label:'Ir al Gran Comedor',fn(){
    if(Game.flags.potion)goChapter(6);
    else Dlg.say([{who:'María Paula',text:'(Aún no he preparado la poción. La profesora me espera en su caldero.)'}]);
  }});
  setLocation('Aula de Pociones'); setMission('Prepara la Poción del Corazón Valiente (habla con la profesora)');
  AudioSys.startMusic('potions');
  Player.mesh.position.set(8,0,5); Player.mesh.rotation.y=-2.4;
};

