/* ############################################################
   MOTOR 3D — escena, cámara y render
   ############################################################ */
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); // preserveDrawingBuffer permite capturar la foto grupal
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputEncoding=THREE.sRGBEncoding; // colores cálidos tipo la imagen de referencia
document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,.1,500);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

/* ---------- Helpers de construcción ---------- */
function M(c,e){return new THREE.MeshLambertMaterial(Object.assign({color:c},e||{}));} // material Lamberth cálido
function box(w,h,d,mat){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);}      // caja genérica
function cyl(rt,rb,h,mat,seg){return new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||10),mat);} // cilindro genérico
function put(parent,m,x,y,z){m.position.set(x,y,z); parent.add(m); return m;}          // coloca y agrega
function lerp(a,b,t){return a+(b-a)*t;}

function textSprite(txt,color){ // nombre flotante sobre los personajes
  const c=document.createElement('canvas'); c.width=256; c.height=64; const x=c.getContext('2d');
  x.font='bold 32px Georgia'; x.textAlign='center'; x.textBaseline='middle';
  x.lineWidth=6; x.strokeStyle='rgba(15,8,0,.95)'; x.strokeText(txt,128,32);
  x.fillStyle=color||'#ffd97a'; x.fillText(txt,128,32);
  const t=new THREE.CanvasTexture(c);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
  s.scale.set(3.4,.85,1); s.renderOrder=20; return s;
}

/* ---------- Área activa: colisiones, interacciones, animaciones ---------- */
const Area={group:null,colliders:[],interact:[],npcs:[],anim:[],bounds:{x:12,z:9},camOffset:new THREE.Vector3(0,13,9),name:'',lights:[],
  clear(){ if(this.group){ // libera memoria GPU al cambiar de escena
      scene.remove(this.group);
      this.group.traverse(o=>{ if(o.geometry)o.geometry.dispose();
        if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose(); m.dispose();});}});
    }
    this.lights.forEach(l=>scene.remove(l)); this.lights=[];
    this.group=new THREE.Group(); scene.add(this.group);
    this.colliders=[]; this.interact=[]; this.npcs=[]; this.anim=[];
  },
  hemi(inten,sky,gr){ const h=new THREE.HemisphereLight(sky||0x8a7a9a,gr||0x2a1a0a,inten); scene.add(h); this.lights.push(h); return h; },
  dir(inten,col,x,y,z){ const d=new THREE.DirectionalLight(col||0xffe0b0,inten); d.position.set(x||10,y||18,z||8); scene.add(d); this.lights.push(d); return d; },
  point(color,inten,dist,x,y,z){ const p=new THREE.PointLight(color,inten,dist,2); p.position.set(x,y,z); scene.add(p); this.lights.push(p); return p; }
};

/* ---------- Partículas (magia, confeti, vapor, velas) ---------- */
const FX={list:[],
  burst(x,y,z,colors,n,speed,up,life,size){ // explosión de partículas (selección, sorpresa, regalos)
    const geo=new THREE.BufferGeometry(), pos=new Float32Array(n*3), vel=[];
    for(let i=0;i<n;i++){ pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
      const a=Math.random()*6.28, r=Math.random();
      vel.push([Math.cos(a)*r*speed, up+Math.random()*speed, Math.sin(a)*r*speed]);
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array([...new THREE.Color(colors[i%colors.length]).toArray()]),3));
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:size||.22,vertexColors:true,transparent:true,opacity:.95}));
    Area.group.add(pts);
    this.list.push({pts,vel,life:life||1.6,t:0,grav:-3});
  },
  update(dt){ for(let i=this.list.length-1;i>=0;i--){ const f=this.list[i]; f.t+=dt;
    const p=f.pts.geometry.attributes.position;
    for(let j=0;j<f.vel.length;j++){ p.array[j*3]+=f.vel[j][0]*dt; p.array[j*3+1]+=(f.vel[j][1]+=f.grav*dt)*dt; p.array[j*3+2]+=f.vel[j][2]*dt; }
    p.needsUpdate=true; f.pts.material.opacity=Math.max(0,1-f.t/f.life);
    if(f.t>f.life){ Area.group.remove(f.pts); f.pts.geometry.dispose(); f.pts.material.dispose(); this.list.splice(i,1); }
  }}
};

function glowTexture(col){ // textura radial suave para brillos
  const c=document.createElement('canvas'); c.width=c.height=64; const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,2,32,32,30);
  g.addColorStop(0,'rgba(255,255,255,.9)'); g.addColorStop(.4,'rgba(255,255,255,.25)'); g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(c);
}

