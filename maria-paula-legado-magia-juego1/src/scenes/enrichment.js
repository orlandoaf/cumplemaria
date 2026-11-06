/* ############################################################
   ENRIQUECIMIENTO — props adicionales, personajes y secretos
   Cada bloque extiende un capítulo sin modificar su archivo.
   ############################################################ */

// NPC que deambula de un lado a otro (vida ambiental)
function wanderNPC(x,z,opts,lines,name,color,range,speed){
  const n=makeNPC(x,z,opts,lines,name,color);
  const it=Area.interact.find(i=>i.label==='Hablar con '+name);
  Area.anim.push((dt,t)=>{ if(!n.mesh.visible)return;
    const s=Math.sin(t*speed+n.mesh.userData.ph);
    n.mesh.position.x=x+s*range; n.mesh.rotation.y=s>0?Math.PI/2:-Math.PI/2;
    if(it)it.x=n.mesh.position.x; animChar(n.mesh,t,true); });
  return n;
}

/* ---------- CAPÍTULO 1: estación ---------- */
extendBuilder(1,()=>{
  // lechuza posada en una farola
  const owl=new THREE.Group();
  put(owl,box(.3,.34,.28,M(0xd8d0c0)),0,0,0); put(owl,box(.2,.18,.2,M(0xc8c0b0)),0,.26,.02);
  put(owl,box(.06,.06,.03,M(0x201510)),-.07,.28,.13); put(owl,box(.06,.06,.03,M(0x201510)),.07,.28,.13);
  owl.position.set(0,3.15,-2); Area.group.add(owl);
  Area.anim.push((dt,t)=>owl.rotation.y=Math.sin(t*.7)*.5);
  Area.interact.push({x:0,z:-2,r:1.4,label:'Saludar a la lechuza',fn(){
    AudioSys.sfx('chime'); FX.burst(0,3.4,-2,[0xd8d0c0,0xffe9ad],10,1,1.4,.8,.12);
    Dlg.say([{who:'Lechuza',text:'¡Pío! (Te mira con ojos sabios. Parece aprobar tu llegada a Hogwarts.)'}]); }});
  // boletero con gorro y diálogo
  makeNPC(6,4.6,{robe:0x2a2a34,trim:0x8a6a2a,hair:0x6b6b76,hat:{c:0x8a6a2a}},[
    {who:'Boletero',text:'¡Último llamado! Once en punto, ni un minuto más. La magia respeta horarios, jovencita.'},
    {who:'Boletero',text:'Guarda bien tu billete… y si encuentras uno dorado, tráemelo. Prometo que no lo cambio por nada.'}],'Boletero');
  // SECRETO: billete dorado oculto junto a la locomotora
  Area.interact.push({x:-9.5,z:-5,r:1.2,label:'Hurgar entre la leña del tren',fn(){
    if(Game.flags.inv.some(i=>i.name==='Billete dorado del Expreso')){toast('Solo leña y vapor por aquí.'); return;}
    invAddOnce('Billete dorado del Expreso','❖'); AudioSys.sfx('magic');
    FX.burst(-9.5,1,-5,[0xd4af37,0xffe9ad],24,1.6,2,1.2,.16);
    Dlg.say([{who:'María Paula',text:'¡Un billete dorado! El boletero dijo que valía algo… lo guardaré como recuerdo del primer día.'}]); }});
  // vagonero que deambula
  wanderNPC(-2,5.4,{robe:0x33261a,trim:0x5a4a2a,hair:0x1a1a1a},[
    {who:'Vagonero',text:'¿El vagón de las brujas? Al fondo, donde huelen las galletas recién horneadas.'}],'Vagonero','#d8c8a0',3,.5);
});

/* ---------- CAPÍTULO 2: camino al castillo ---------- */
extendBuilder(2,()=>{
  // SECRETO 1: perla del lago en la orilla lejana
  Area.interact.push({x:12.5,z:-7.5,r:1.3,label:'Algo brilla en el lago',fn(){
    if(Game.flags.inv.some(i=>i.name==='Perla del lago')){toast('El lago vuelve a estar en calma.'); return;}
    invAddOnce('Perla del lago','◉'); AudioSys.sfx('magic');
    FX.burst(12.5,1,-7.5,[0x7ec8e3,0xffffff],22,1.5,2.2,1.2,.15);
    Dlg.say([{who:'María Paula',text:'¡Una perla que brilla como la luna sobre el agua! El lago me hizo un regalo.'}]); }});
  // SECRETO 2: luciérnagas atrapadas en un frasco olvidado
  Area.interact.push({x:-12.5,z:8,r:1.2,label:'Frasco entre las raíces',fn(){
    if(Game.flags.inv.some(i=>i.name==='Luz de luciérnagas')){toast('Las luciérnagas del bosque siguen bailando.'); return;}
    invAddOnce('Luz de luciérnagas','✧'); AudioSys.sfx('pickup');
    Dlg.say([{who:'María Paula',text:'Un frasco con luciérnagas mágicas… las liberaré en la sala común. ¡Va a quedar precioso!'}]); }});
  // estudiante perdido que deambula
  wanderNPC(-5,6,{robe:0x3a2a2a,trim:0x8a6a2a,hair:0x8a4a1a,hat:{c:0x2e7d4f,tip:true}},[
    {who:'Estudiante perdido',text:'¿El castillo? Por suerte te encontré… llevaba media hora dando vueltas a este mismo árbol.'},
    {who:'Estudiante perdido',text:'¿Ya encontraste los objetos brillantes? Aparecen donde la luz del cielo toca el suelo.'}],'Estudiante perdido','#c8e8c0',2.4,.6);
  // setas luminosas decorativas
  for(let i=0;i<7;i++){ const x=-13+i*4.2, z=8.5+Math.sin(i*2)*.8;
    put(Area.group,cyl(.12,.18,.24,M(0x9a5a3a,{emissive:0x5a2a1a,emissiveIntensity:.4})),x,.12,z);
    put(Area.group,cyl(.02,.22,.14,M(0xd8e87e,{emissive:0xa8c84e,emissiveIntensity:.7})),x,.3,z); }
});

/* ---------- CAPÍTULO 3: pasillos del castillo ---------- */
extendBuilder(3,()=>{
  // SECRETO: cosquillas a la armadura
  Area.interact.push({x:-4,z:6,r:1.4,label:'Hacer cosquillas a la armadura',fn(){
    if(Game.flags.inv.some(i=>i.name==='Guantelete sonriente')){Dlg.say([{who:'Armadura',text:'¡Jajaja! Ya basta, pequeña travesura.'}]); return;}
    invAddOnce('Guantelete sonriente','☺'); AudioSys.sfx('chime');
    Dlg.say([{who:'Armadura',text:'¡Jajajaja! Nadie me hacía cosquillas desde 1487… Toma, guarda mi guantelete. Brinda suerte en los exámenes.'}]); }});
  // retrato cotilla que deambula por su lienzo
  wanderNPC(9,-3,{robe:0x5a4a2a,trim:0xd4af37,hair:0xd8d0c0},[
    {who:'Retrato cotilla',text:'¿Buscas la biblioteca? Yo vi a un estudiante perderse justo ahí… hace cincuenta años. Sigue hacia la puerta del fondo.'},
    {who:'Retrato cotilla',text:'Pssst… la armadura de allá es sensible a las cosquillas. No me lo contaste a mí.'}],'Retrato','#e8d8a0',1.6,.4);
  // alfombras y plantas extra
  put(Area.group,box(6,.55,2,M(0x4a2030)),5,.01,0);
  put(Area.group,box(6,.55,2,M(0x20304a)),-6,.01,2);
  [[-11,-6],[11,6]].forEach(([x,z])=>{ put(Area.group,cyl(.3,.4,.5,M(0x8a5a3a)),x,.25,z);
    put(Area.group,cyl(.02,.5,1,M(0x2e6d3a),7),x,1.1,z); Area.colliders.push({x,z,hx:.45,hz:.45}); });
});

/* ---------- CAPÍTULO 4: biblioteca ---------- */
extendBuilder(4,()=>{
  // SECRETO: estantería secreta con el mapa
  Area.interact.push({x:9.2,z:0,r:1.4,label:'Estantería que cruje',fn(){
    if(Game.flags.inv.some(i=>i.name==='Mapa del Merodeador')){toast('La estantería ya entregó su secreto.'); return;}
    AudioSys.sfx('door');
    Dlg.say([{who:'María Paula',text:'¡Esta estantería se mueve! Detrás hay un hueco… y dentro, un pergamino que se dibuja solo.'}],
      ()=>{ invAddOnce('Mapa del Merodeador','◎'); AudioSys.sfx('magic');
            FX.burst(9.2,1.6,0,[0xd4af37,0xffe9ad],26,1.6,2.2,1.3,.16);
            toast('Secreto descubierto: el mapa muestra pasadizos ocultos del castillo.'); }); }});
  // estudiante dormido que ronca en una mesa
  const sleepy=makeNPC(4,3,{robe:0x2a2a34,trim:0x4a5a7b,hair:0x1a1a1a},[
    {who:'Estudiante dormido',text:'zzz… cinco minutos más… la historia de la magia… zzz…'}],'Estudiante dormido','#b0c8e8');
  Area.anim.push((dt,t)=>sleepy.mesh.rotation.z=Math.sin(t*.8)*.06);
  // escalera rodante mágica
  const lad=put(Area.group,box(.5,3.2,.2,M(0x5a4026)),-11.2,1.6,-2);
  Area.anim.push((dt,t)=>{ lad.position.z=-2+Math.sin(t*.3)*3; lad.rotation.x=Math.sin(t*.3)*.1; });
  // más libros flotantes
  for(let i=0;i<4;i++){ const bk=put(Area.group,box(.5,.12,.36,M([0x6b2a2a,0x2a4a6b][i%2])),6-i*1.6,3.2,3+Math.sin(i));
    Area.anim.push((dt,t)=>{bk.position.y=3.2+Math.sin(t*1.1+i*2)*.3; bk.rotation.y=t*.4+i;}); }
});

/* ---------- CAPÍTULO 5: aula de pociones ---------- */
extendBuilder(5,()=>{
  // SECRETO: experimento de risa (mezcla "incorrecta" deliberada)
  Area.interact.push({x:5,z:4,r:1.4,label:'Experimentar con el tercer caldero',fn(){
    if(Game.flags.inv.some(i=>i.name==='Poción de la risa')){toast('Este caldero solo produce buen humor.'); return;}
    showModal('Experimento arriesgado','La receta clásica está bien… ¿pero y si añadimos una pizca de Ojo de tritón, por curiosidad científica?',[
      {label:'Añadir Ojo de tritón',cb(){ invAddOnce('Poción de la risa','☺'); AudioSys.sfx('magic');
          FX.burst(5,2,4,[0xd8e87e,0xffe9ad],30,2,2.6,1.5,.18);
          Dlg.say([{who:'Profesora Beatriz',text:'¿Ojo de tritón? Descarada… y brillante. Eso no era la receta, pero creaste una Poción de la risa. Aprueba con honores.'}]); }},
      {label:'Mejor no arriesgar',cb(){ toast('La ciencia puede esperar a otro día.'); }}
    ]); }});
  // plantas mágicas decorativas
  [[-11,5],[-11,-5]].forEach(([x,z])=>{ put(Area.group,cyl(.35,.45,.6,M(0x7b4a2a)),x,.3,z);
    for(let i=0;i<5;i++){ const a=i/5*6.28; put(Area.group,box(.1,.7,.1,M(0x3a8a4a)),x+Math.cos(a)*.25,.8,z+Math.sin(a)*.25).rotation.z=Math.cos(a)*.5; }
    Area.colliders.push({x,z,hx:.5,hz:.5}); });
  // asistente que deambula con libros
  wanderNPC(-6,5,{robe:0x243024,trim:0x4a8a5a,hair:0x4a3010},[
    {who:'Asistente',text:'¿Oyes eso? Los frascos tararean cuando la poción va bien. Es como una orquesta pequeñita.'}],'Asistente','#a8e8b0',2,.55);
});

/* ---------- CAPÍTULO 6: Gran Comedor ---------- */
extendBuilder(6,()=>{
  // banderines de las casas en las paredes
  [[-6,-9.6,0x7b1d12],[0,-9.6,0x1a4723],[6,-9.6,0xb08d2a],[6,9.6,0x27408b],[-6,9.6,0x7b1d12],[0,9.6,0x1a4723]].forEach(([x,z,c])=>{
    put(Area.group,box(1.4,2,.08,M(c,{emissive:c,emissiveIntensity:.25})),x,4.4,z);
    put(Area.group,box(1.6,.2,.1,M(0xd4af37)),x,5.5,z); });
  // SECRETO: snitch dorada volando (hay que atraparla)
  const sn=put(Area.group,new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),M(0xd4af37,{emissive:0xffd97a,emissiveIntensity:1})),3,2.5,3);
  const wings=put(Area.group,box(.5,.02,.14,M(0xe8e0c0,{transparent:true,opacity:.7})),3,2.5,3);
  const snIt={x:3,z:3,r:1.1,label:'¡Atrapar la snitch dorada!',fn(){
    if(sn.visible===false)return;
    sn.visible=wings.visible=false; this.off=true;
    invAddOnce('Snitch dorada','✵'); AudioSys.sfx('magic'); FX.burst(3,2.5,3,[0xd4af37,0xffe9ad],28,2,2.4,1.3,.16);
    Dlg.say([{who:'Profesor Flitwick',text:'¡¿LA ATRAPASTE?! ¡Cien puntos de pura habilidad! Nadie la había visto desde la mañana.'}]); }};
  Area.interact.push(snIt);
  Area.anim.push((dt,t)=>{ if(!sn.visible)return;
    sn.position.set(Math.sin(t*.9)*6,2.4+Math.sin(t*2.1)*.8,Math.cos(t*.7)*4);
    wings.position.copy(sn.position); wings.rotation.y=t*30;
    snIt.x=sn.position.x; snIt.z=sn.position.z; });
  // velas extra y candelabros
  [[-4,-4],[4,-4],[0,-6]].forEach(([x,z])=>{ put(Area.group,cyl(.3,.05,.3,M(0x8a6a2a)),x,5.2,z);
    put(Area.group,cyl(.02,.05,.3,M(0xffb45e,{emissive:0xffc86e,emissiveIntensity:1.2})),x,5.5,z); });
  // estudiantes que pasean emocionados por la ceremonia
  wanderNPC(-3,5,{robe:0x26262e,trim:0x7b1d12,hair:0x5a3a10},[
    {who:'Estudiante',text:'¿Escuchaste? Hoy el Sombrero elegirá. Mi hermano juró que le susurró durante diez minutos.'}],'Estudiante','#e8c8a0',2.6,.5);
});

/* ---------- CAPÍTULO 7: sala común (secretos de exploración libre) ---------- */
extendBuilder(7,()=>{
  // SECRETO 1: chocolate eterno bajo la alfombra
  Area.interact.push({x:3.8,z:1.6,r:1.1,label:'Esquina de la alfombra que se levanta',fn(){
    if(Game.flags.inv.some(i=>i.name==='Chocolate caliente eterno')){toast('El escondite ya está vacío… pero huele a cacao.'); return;}
    invAddOnce('Chocolate caliente eterno','☕'); AudioSys.sfx('gift');
    FX.burst(3.8,.6,1.6,[0x8a5a2a,0xffe9ad],18,1.2,1.8,1,.15);
    Dlg.say([{who:'Mauro',text:'¡OYE! Ese era MI escondite de emergencia… bueno, compartir es de Gryffindors. ¡Feliz cumpleaños!'}]); }});
  // SECRETO 2: lechuza en el ventanal que regala una pluma
  Area.interact.push({x:0,z:-7,r:1.5,label:'Lechuza en el ventanal',fn(){
    if(Game.flags.inv.some(i=>i.name==='Pluma de lechuza')){Dlg.say([{who:'Lechuza',text:'¡Pío! (Ya te dio su mejor pluma.)'}]); return;}
    invAddOnce('Pluma de lechuza','❧'); AudioSys.sfx('chime');
    Dlg.say([{who:'Lechuza',text:'¡Pío! (Se acicala y te ofrece una pluma suave como nube. Recuerdo del primer día.)'}]); }});
  // espejo que da cumplidos
  put(Area.group,box(1.2,2,.14,M(0xd4af37)),-10.7,2.4,-2);
  put(Area.group,box(.95,1.7,.16,M(0x9ab8d0,{emissive:0x6a88a0,emissiveIntensity:.35})),-10.7,2.4,-2);
  Area.interact.push({x:-10.4,z:-2,r:1.2,label:'Mirarse en el espejo',fn(){
    AudioSys.sfx('chime');
    Dlg.say([{who:'Espejo encantado',text:'Muestra a la futura maga más valiente de su promoción. Sonríe: hoy brillas más que mis cristales.'}]); }});
  // guirnaldas de luces y más globos
  for(let i=0;i<9;i++){ const x=-8+i*2;
    const l=put(Area.group,box(.16,.16,.16,M([0xd43a3a,0xe3c53a,0x3a7bd4][i%3],{emissive:[0xd43a3a,0xe3c53a,0x3a7bd4][i%3],emissiveIntensity:.9})),x,4.6+Math.sin(i)*.3,-7.4);
    Area.anim.push((dt,t)=>l.material.emissiveIntensity=.6+Math.sin(t*3+i)*.4); }
  // invitada deambulante con sombrero de fiesta
  wanderNPC(-6,2,{robe:0x33202a,trim:0xd4af37,hair:0x8a4a1a,hat:{c:0xd43a3a,tip:false}},[
    {who:'Compañera de Gryffindor',text:'¡Esta sala común nunca había visto una fiesta así! El Sombrero eligió bien contigo.'},
    {who:'Compañera de Gryffindor',text:'Dicen que si miras la chimenea con calma, cuenta historias de antiguos alumnos.'}],'Compañera','#ffd0a0',2.2,.45);
  // la chimenea cuenta una historia (interacción ambiental)
  Area.interact.push({x:-6.5,z:-5.4,r:1.5,label:'Escuchar las llamas',fn(){
    AudioSys.sfx('magic');
    Dlg.say([{who:'Chimenea (voz crepitante)',text:'*Crujido* Hace muchos inviernos, cuatro amigos fundaron esta casa… *chisporroteo* …y juraron que nadie se iría sin celebración. *pop*'},
             {who:'Chimenea (voz crepitante)',text:'*Suave* Hoy el fuego está más contento que nunca. Le caes bien, María Paula.'}]); }});
});
