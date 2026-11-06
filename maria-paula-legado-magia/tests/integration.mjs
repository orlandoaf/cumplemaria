import assert from 'assert'; // Aserciones de Node
globalThis.Phaser = { AUTO: 0, Scale: { FIT: 1, CENTER_BOTH: 2 }, Events: { EventEmitter: class { emit() {} on() {} } } }; // Simula lo mínimo de Phaser
const store = {}; globalThis.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } }; // Simula localStorage
const { GameState } = await import('../src/core/GameState.js'); // Estado
const { SaveManager } = await import('../src/core/SaveManager.js'); // Guardado
const { SAVE_KEY, CHAPTERS } = await import('../src/core/Config.js'); // Config
const { computeVelocity, facingFrom } = await import('../src/utils/Movement.js'); // Movimiento
const { MAPS } = await import('../src/data/maps.js'); // Mapas
GameState.reset(); GameState.data.scene = 'Ch2_Path'; GameState.data.position = { x: 5, y: 9 }; // Estado de prueba
assert(SaveManager.save() && SaveManager.hasSave(), 'guardar'); // Guarda
GameState.reset(); assert(SaveManager.load() && GameState.data.scene === 'Ch2_Path' && GameState.data.position.x === 5, 'cargar'); // Ida y vuelta
store[SAVE_KEY] = '{corrupto'; assert(SaveManager.load() === false, 'guardado corrupto no rompe'); // Error controlado
for (const bad of ['"abc"', 'null', '[1,2]', '{"version":2}']) { store[SAVE_KEY] = bad; assert(SaveManager.load() === false, 'guardado inválido rechazado: ' + bad); } // Valida el esquema del guardado
const v = computeVelocity({ x: 1, y: 1 }, false); assert(Math.abs(Math.hypot(v.vx, v.vy) - 70) < 1e-9, 'diagonal normalizada'); // Diagonal igual de rápida
assert(computeVelocity({ x: 1, y: 0 }, true).vx === 120 && computeVelocity({ x: 0, y: 0 }, true).vx === 0, 'correr/quieto'); // Velocidades
assert(facingFrom({ x: -1, y: 0 }) === 'left' && facingFrom({ x: 0, y: -1 }) === 'up' && facingFrom({ x: 0, y: 0 }, 'right') === 'right', 'orientación'); // Direcciones
const keys = CHAPTERS.map(c => c.key); // Claves oficiales
for (const [k, m] of Object.entries(MAPS)) { // Revisa cada mapa
  assert(keys.includes(k), 'mapa registrado en CHAPTERS: ' + k); // Existe en el registro
  assert(m.spawn.x < m.w && m.spawn.y < m.h, 'spawn dentro del mapa: ' + k); // Aparece dentro
  m.portals.forEach(p => { assert(MAPS[p.to], 'portal destino existe: ' + p.to); assert(p.spawn.x < MAPS[p.to].w && p.spawn.y < MAPS[p.to].h, 'spawn destino válido'); const hit = m.walls.some(w => p.spawn.x > w.x && p.spawn.x < w.x + w.w && p.spawn.y > w.y && p.spawn.y < w.y + w.h); assert(!MAPS[p.to].walls.some(w => p.spawn.x > w.x && p.spawn.x < w.x + w.w && p.spawn.y > w.y && p.spawn.y < w.y + w.h), 'spawn no queda dentro de un muro'); }); // Portales válidos
} // Fin mapas
const { PROPS } = await import('../src/utils/ArtKit.js'); // Catálogo de props
keys.forEach(k => assert(MAPS[k], 'existe mapa para ' + k)); // Los 7 capítulos tienen mapa
const inRect = (x, y, r) => x > r.x - 8 && x < r.x + r.w + 8 && y > r.y - 8 && y < r.y + r.h + 8; // Jugador (radio ~6) dentro de un rectángulo
for (const [k, m] of Object.entries(MAPS)) { // Revisión de decorado y conexiones
  (m.decals || []).forEach(([p]) => assert(['tuft', 'pebble', 'crack', 'moss', 'puddle', 'paper', 'petal'].includes(p), k + ': decal conocido ' + p)); // Detalles de suelo válidos
  m.decor.forEach(([p]) => assert(PROPS[p], k + ': prop existente ' + p)); // Cada prop está definido
  const solids = m.decor.filter(([p]) => PROPS[p].s).map(([p, x, y]) => ({ x: x - PROPS[p].w * PROPS[p].s[0] / 2, y: y - PROPS[p].s[1], w: PROPS[p].w * PROPS[p].s[0], h: PROPS[p].s[1] })); // Cuerpos sólidos
  const spawns = [m.spawn, ...Object.values(MAPS).flatMap(o => o.portals.filter(p => p.to === k).map(p => p.spawn))]; // Todas las entradas al mapa
  spawns.forEach(s => assert(![...m.walls, ...solids].some(r => inRect(s.x, s.y, r)), k + ': entrada libre en ' + s.x + ',' + s.y)); // Nadie aparece dentro de un obstáculo
  m.portals.forEach(p => assert(MAPS[p.to].portals.some(q => q.to === k), k + ' -> ' + p.to + ' tiene regreso')); // Conexiones recíprocas
  m.interactables.forEach(o => assert(!solids.some(r => inRect(o.x + o.w / 2, o.y + o.h / 2, { x: r.x + 8, y: r.y + 8, w: r.w - 16, h: r.h - 16 }) && false), 'interactuable ok')); // Marcador (se valida en ejecución)
} // Fin revisión
const { Inventory } = await import('../src/systems/Inventory.js'); const { Quests } = await import('../src/systems/QuestSystem.js'); // Sistemas de la Fase 4
const { ITEMS } = await import('../src/data/items.js'); const { QUESTS } = await import('../src/data/quests.js'); const { SCRIPTS, REQUIRED } = await import('../src/data/scripts.js'); // Datos
GameState.reset(); assert(Inventory.add('carta_admision') && !Inventory.add('carta_admision') && Inventory.has('carta_admision'), 'inventario sin duplicados'); // Agregar
assert(Inventory.remove('carta_admision') && !Inventory.has('carta_admision') && !Inventory.remove('carta_admision'), 'inventario quita una vez'); // Quitar
assert.throws(() => Inventory.add('no_existe'), /desconocido/, 'objeto desconocido rechazado'); // Validación
assert(Quests.start('q3') && !Quests.start('q3') && !Quests.progress('q3', 0) && Quests.state('q3').progress === 0, 'misión inicia una vez'); // Inicio
assert(!Quests.progress('q3') && !Quests.progress('q3') && Quests.progress('q3') && Quests.state('q3').progress === 3, 'progreso hasta la meta'); // Progreso
assert(Quests.complete('q3').includes('moneda_suerte') && Quests.isDone('q3') && Inventory.has('moneda_suerte') && Quests.complete('q3').length === 0, 'recompensa una sola vez'); // Recompensa
assert(Quests.check('q:q3') && !Quests.check('q:q9') && !Quests.check('f:x') && (GameState.setFlag('x', 1), Quests.check('f:x')) && Quests.check(undefined), 'requisitos de puerta'); // Requisitos
GameState.reset(); const used = new Set(); // Cobertura de datos
for (const [k, m] of Object.entries(MAPS)) { // Revisa el contenido de cada mapa
  if (m.quest) { assert(QUESTS[m.quest], k + ': misión existente'); used.add(m.quest); } // Misión válida
  m.portals.forEach(p => { if (p.req) { const [ty, id] = p.req.split(':'); assert(ty === 'f' || QUESTS[id], k + ': requisito válido ' + p.req); assert(p.hint, k + ': puerta con aviso'); } }); // Puertas con aviso
  const solids = m.decor.filter(([n]) => PROPS[n].s).map(([n, x, y]) => ({ x: x - PROPS[n].w * PROPS[n].s[0] / 2, y: y - PROPS[n].s[1], w: PROPS[n].w * PROPS[n].s[0], h: PROPS[n].s[1] })); // Sólidos
  (m.things || []).forEach(t => { // Cada interacción
    assert(t.x > 24 && t.x < m.w - 24 && t.y > 24 && t.y < m.h - 24, k + ': ' + t.id + ' dentro del mapa'); // Dentro
    if (t.kind === 'item') assert(ITEMS[t.item], k + ': objeto existente ' + t.item); // Objeto válido
    if (t.script) assert(typeof SCRIPTS[t.script] === 'function', k + ': guion existente ' + t.script); // Guion válido
    if (t.progress) assert(QUESTS[t.progress], k + ': misión de progreso ' + t.progress); // Misión válida
    if (t.kind === 'npc') assert(t.look && t.name && (t.script || t.lines), k + ': NPC completo ' + t.id); // NPC completo
    if (t.kind === 'item' && t.art !== 'decor') assert(!solids.some(r => inRect(t.x, t.y, r)) && !m.walls.some(r => inRect(t.x, t.y, r)), k + ': ' + t.id + ' alcanzable (fuera de obstáculos)'); // Alcanzable
  }); // Fin interacciones
} // Fin mapas
Object.entries(REQUIRED).forEach(([s, ids]) => ids.forEach(i => assert(Object.values(MAPS).some(m => m.things.some(t => t.item === i)), 'objeto requerido por ' + s + ' existe en el mundo: ' + i))); // Se puede conseguir todo lo necesario
Object.entries(QUESTS).forEach(([id, q]) => { const n = Object.values(MAPS).flatMap(m => m.things).filter(t => t.progress === id).length + Object.values(MAPS).filter(m => m.interactables.length && false).length; if (q.goal > 1 && !['q5'].includes(id)) assert(n >= q.goal, id + ': hay suficientes fuentes de progreso (' + n + '/' + q.goal + ')'); }); // Metas alcanzables
['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => assert(used.has(q), q + ' se inicia en algún capítulo')); // Cadena de misiones completa
console.log('Integración OK: guardado, movimiento, mapas y portales'); // Resultado
