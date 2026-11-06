/* ############################################################
   GESTOR DE CAPÍTULOS — transiciones cinematográficas
   ############################################################ */
const Builders={}; // Builders[n]() construye el capítulo n
function goChapter(n){
  AudioSys.sfx('door'); fade(true);
  setTimeout(()=>{
    Area.clear(); FX.list.length=0;
    Game.chapter=n; Game.flags.chapter=n; Save.write();
    Builders[n](); fade(false);
  },950);
}


// extendBuilder: decora un capítulo con contenido adicional sin tocar su archivo original
function extendBuilder(n, fn){ const orig=Builders[n]; Builders[n]=function(){ orig(); try{ fn(); }catch(e){ console.warn('Enriquecimiento del capítulo '+n+':', e); } }; }
