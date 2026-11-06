import { JSDOM } from 'jsdom'; // DOM simulado para ejecutar Phaser en Node
import { createRequire } from 'module'; // Para cargar el UMD de Phaser
import assert from 'assert'; // Aserciones
const dom = new JSDOM('<!DOCTYPE html><div id="game-container"></div>', { pretendToBeVisual: true, resources: 'usable', url: 'http://localhost/' }); // Página falsa con rAF
const w = dom.window; // Ventana simulada
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Image', 'localStorage', 'requestAnimationFrame', 'cancelAnimationFrame', 'Element', 'Node', 'Event', 'KeyboardEvent']) Object.defineProperty(globalThis, k, { value: k === 'window' ? w : w[k], configurable: true, writable: true }); // Expone globales del navegador
for (const k of Object.getOwnPropertyNames(w)) if (/^[A-Z]/.test(k) && !(k in globalThis)) Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true }); // Expone el resto de clases del DOM (HTMLVideoElement, MouseEvent...)
const errors = []; const ce = console.error; console.error = (...a) => { const m = a.join(' '); if (!/MODULE_TYPELESS|Reparsing|Not implemented: Window/.test(m)) errors.push(m); ce(...a); }; // Captura errores de consola
process.on('uncaughtException', e => { errors.push(String(e.stack || e)); process.stderr.write('EXC ' + (e.stack || e) + '\n'); }); // Captura excepciones
globalThis.Phaser = createRequire(import.meta.url)('../vendor/phaser.min.js'); // Carga Phaser local
const { GAME_CONFIG } = await import('../src/core/Config.js'); const CS = await import('../src/scenes/ChapterScenes.js'); const { Ch1_Station, Ch2_Path } = CS; // Config y mapas
const { BootScene } = await import('../src/scenes/BootScene.js'); const { MenuScene } = await import('../src/scenes/MenuScene.js'); // Escenas
const { GameState } = await import('../src/core/GameState.js'); const { SAVE_KEY } = await import('../src/core/Config.js'); // Estado y clave
const game = new Phaser.Game({ ...GAME_CONFIG, type: Phaser.HEADLESS, banner: false, audio: { noAudio: true }, scale: { mode: Phaser.Scale.NONE }, scene: [BootScene, MenuScene, ...Object.values(CS)] }); // Juego sin render
game.renderer = game.renderer || { type: Phaser.HEADLESS, gl: null, width: 480, height: 270, preRender() {}, render() {}, postRender() {}, resize() {}, destroy() {} }; // Renderer mínimo: en HEADLESS Phaser no crea uno y CanvasTexture lo consulta
const sleep = ms => new Promise(r => setTimeout(r, ms)); const sm = game.scene; // Utilidades
const until = async (f, ms = 9000) => { for (let t = 0; t < ms; t += 100) { if (f()) return true; await sleep(100); } return false; }; // Espera condición
let n = 0; const ok = (c, m) => { assert(c, m); n++; console.log('OK', m); }; // Registro de pruebas
await until(() => sm.isActive('Menu'), 3000); ok(sm.isActive('Menu'), 'Boot -> Menu'); // Arranque
sm.getScene('Menu').start(false); await until(() => sm.isActive('Ch1_Station')); ok(sm.isActive('Ch1_Station'), 'Nueva partida entra al Capítulo 1'); // Nueva partida
const s1 = sm.getScene('Ch1_Station'); await sleep(300); // Escena 1
s1.player.setPosition(380, 108); s1.input_.stick = { x: 1, y: 0 }; await sleep(1500); // Empuja contra la banca
ok(s1.player.x < 410 && s1.player.x > 380, 'colisión: el muro detiene al jugador (x=' + Math.round(s1.player.x) + ')'); // Colisión
s1.input_.stick = { x: 0, y: 0 }; s1.player.setPosition(242, 185); await sleep(300); ok(s1.player.anims.currentAnim && s1.player.anims.currentAnim.key.startsWith('idle-') && !!s1.player.shadow, 'animación de reposo y sombra del jugador'); // Cerca del objeto
s1.input_.touchInteract = true; await sleep(200); ok(s1.dialogBox.busy && s1.player.frozen, 'diálogo se abre y congela'); for (let g = 0; g < 100 && s1.dialogBox.busy; g++) { s1.input_.touchInteract = true; await sleep(70); } await sleep(150); ok(!s1.dialogBox.busy && !s1.player.frozen, 'diálogo se cierra y libera al jugador'); // Diálogo real de la Fase 4
{ const Q = (await import('../src/systems/QuestSystem.js')).Quests; Q.complete('q1'); } // La puerta este exige q1 completada (Fase 4)
s1.player.setPosition(60, 180); s1.input_.stick = { x: 1, y: 0 }; s1.input_.touchRun = true; // Corre hacia el portal
ok(await until(() => sm.isActive('Ch2_Path')), 'portal: Ch1 -> Ch2'); // Transición
await sleep(400); const s2 = sm.getScene('Ch2_Path'); // Escena 2
ok(s2.player.x > 20 && s2.player.x < 80 && GameState.data.scene === 'Ch2_Path', 'aparece en el spawn de Ch2 y el estado cambia'); // Spawn
const saved = JSON.parse(localStorage.getItem(SAVE_KEY)); ok(saved.scene === 'Ch2_Path' && saved.discoveredZones.length === 2, 'guardado persistido con zonas descubiertas'); // Guardado
sm.stop('Ch2_Path'); sm.start('Menu'); await sleep(300); sm.getScene('Menu').start(true); // Continuar
ok(await until(() => sm.isActive('Ch2_Path')), 'Continuar restaura el mapa guardado'); // Continuar
localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, scene: 'Inexistente' })); GameState.load(JSON.parse(localStorage.getItem(SAVE_KEY))); // Guardado con escena desconocida
sm.stop('Ch2_Path'); sm.start('Menu'); await sleep(300); sm.getScene('Menu').start(true); ok(await until(() => sm.isActive('Ch1_Station')), 'escena desconocida cae en Capítulo 1 sin romper'); // Robustez
const { MAPS } = await import('../src/data/maps.js'); const { Inventory } = await import('../src/systems/Inventory.js'); const { Quests } = await import('../src/systems/QuestSystem.js'); // Datos para la partida de prueba
const talk = async (sc, id, answers = []) => { const t = sc.things.find(o => o.id === id); assert(t, 'existe ' + id); sc.player.setPosition(t.x, t.y); await sleep(160); sc.input_.touchInteract = true; await sleep(160); const A = [...answers]; for (let g = 0; g < 250 && (sc.dialogBox.busy || sc.acting); g++) { if (sc.dialogBox.mode === 'ask') sc.dialogBox.pick(A.length ? A.shift() : 0); else sc.input_.touchInteract = true; await sleep(70); } }; // Interactúa con un elemento y responde las preguntas
const gate = async (sc, side) => { const p = MAPS[sc.scene.key].portals.find(q => q.side === side); sc.go(p); await sleep(300); return p; }; // Intenta cruzar una puerta
const stay = k => sm.isActive(k); // ¿Sigue activo este capítulo?
sm.getScenes(true).forEach(s => sm.stop(s.scene.key)); sm.start('Menu'); await sleep(300); sm.getScene('Menu').start(false); await until(() => stay('Ch1_Station')); // Nueva partida
let sc = sm.getScene('Ch1_Station'); await sleep(300); ok(Quests.state('q1') && Quests.state('q1').status === 'active', 'Cap.1: misión q1 se inicia sola'); // Misión
await gate(sc, 'e'); ok(stay('Ch1_Station'), 'puerta cerrada sin completar la misión'); // Puerta bloqueada
await talk(sc, 'guia'); ok(!Quests.isDone('q1'), 'el guía pide la carta antes de completar'); // Requiere objeto
await talk(sc, 'luggage'); ok(Inventory.has('carta_admision'), 'equipaje entrega la carta'); // Carta
await talk(sc, 'bufanda'); await talk(sc, 'est2'); ok(Inventory.has('cromo_mago') && !Inventory.has('objeto_perdido'), 'entregar el objeto perdido da recompensa'); // Objeto perdido
await talk(sc, 'guia'); ok(Quests.isDone('q1'), 'hablar con el guía completa q1'); // Misión 1
await gate(sc, 'e'); ok(await until(() => stay('Ch2_Path')), 'puerta abierta tras completar q1'); await sleep(400); sc = sm.getScene('Ch2_Path'); // Cap. 2
await talk(sc, 'guardabosques'); await talk(sc, 'amuleto'); await talk(sc, 'pluma'); await talk(sc, 'orbe'); ok(Quests.state('q2').progress === 3 && Inventory.has('flor_luminosa') === false, 'tres objetos recogidos (progreso 3/3)'); // Objetos
await talk(sc, 'flor'); ok(Inventory.has('flor_luminosa'), 'zona oculta da recompensa'); // Recompensa oculta
await talk(sc, 'guardabosques', [0]); ok(!Quests.isDone('q2'), 'acertijo: respuesta incorrecta no avanza'); // Acertijo mal
await talk(sc, 'guardabosques', [1]); ok(Quests.isDone('q2'), 'acertijo: respuesta correcta completa q2'); // Acertijo bien
await gate(sc, 'e'); ok(await until(() => stay('Ch3_Castle')), 'Cap.2 -> Cap.3'); await sleep(400); sc = sm.getScene('Ch3_Castle'); // Cap. 3
await gate(sc, 'e'); ok(stay('Ch3_Castle'), 'biblioteca cerrada hasta saber dónde está el comedor'); // Puerta cerrada
await talk(sc, 'prefecta'); await talk(sc, 'retrato1'); await talk(sc, 'retrato2'); ok(Quests.isDone('q3') && Inventory.has('moneda_suerte'), 'q3 se completa sola con 3 pistas y da recompensa'); // Misión 3
await talk(sc, 'retrato1'); ok(Quests.state('q3').progress === 3, 'repetir un retrato no suma de más'); // Sin doble conteo
await gate(sc, 'e'); ok(await until(() => stay('Ch4_Library')), 'Cap.3 -> Biblioteca'); await sleep(400); sc = sm.getScene('Ch4_Library'); // Cap. 4
await talk(sc, 'atril'); ok(!Quests.isDone('q4'), 'atril sin tomos no se resuelve'); // Faltan tomos
for (const id of ['tomo1', 'tomo2', 'tomo3', 'marca', 'tinta', 'grimorio']) await talk(sc, id); ok(Quests.state('q4').progress === 3 && Inventory.has('grimorio_olvidado'), 'tomos y coleccionables recogidos'); // Libros
await talk(sc, 'atril', [2]); ok(!Quests.isDone('q4'), 'cifrado incorrecto no avanza'); await talk(sc, 'atril', [0]); ok(Quests.isDone('q4') && Inventory.has('pergamino_descifrado'), 'cifrado correcto completa q4'); // Acertijo real
await gate(sc, 'w'); ok(await until(() => stay('Ch3_Castle')), 'volver al castillo'); await sleep(400); sc = sm.getScene('Ch3_Castle'); await gate(sc, 's'); ok(await until(() => stay('Ch5_Potions')), 'Castillo -> Pociones'); await sleep(400); sc = sm.getScene('Ch5_Potions'); // Cap. 5
await talk(sc, 'caldero'); ok(!Quests.isDone('q5'), 'caldero sin ingredientes no funciona'); // Faltan ingredientes
for (let i = 1; i <= 6; i++) await talk(sc, 'ing' + i); ok(['raiz_luna', 'hoja_plata', 'polvo_estrella', 'petalo_fuego', 'escama_lago', 'baya_sombra'].every(i => Inventory.has(i)), 'seis ingredientes recogidos'); // Ingredientes
await talk(sc, 'caldero', [3, 3, 3]); ok(!Quests.isDone('q5') && !Inventory.has('pocion_luz'), 'minijuego: mezcla equivocada falla y se puede repetir'); // Fracaso
await talk(sc, 'caldero', [1, 0, 0]); ok(Quests.isDone('q5') && Inventory.has('pocion_luz') && GameState.data.flags.potion === 'perfect', 'minijuego: orden correcto da poción perfecta'); // Éxito
await gate(sc, 'n'); ok(await until(() => stay('Ch3_Castle')), 'Pociones -> Castillo'); await sleep(400); sc = sm.getScene('Ch3_Castle'); await gate(sc, 'n'); ok(await until(() => stay('Ch6_GreatHall')), 'q5 abre el Gran Comedor'); await sleep(400); sc = sm.getScene('Ch6_GreatHall'); // Cap. 6
await gate(sc, 'e'); ok(stay('Ch6_GreatHall'), 'Gryffindor sigue cerrada hasta la ceremonia (Fase 5)'); // Pendiente de Fase 5
sc.input_.touchPanel = 'inv'; await sleep(200); ok(sc.panels.open === 'inv', 'tecla I abre el inventario'); sc.input_.touchPanel = 'inv'; await sleep(200); ok(!sc.panels.open, 'I de nuevo lo cierra'); // Inventario
sc.input_.touchPanel = 'quests'; await sleep(200); ok(sc.panels.open === 'quests', 'tecla J abre misiones'); sc.input_.touchPanel = 'map'; await sleep(200); ok(sc.panels.open === 'map', 'tecla M cambia al mapa'); sc.input_.touchPanel = 'map'; await sleep(200); // Misiones y mapa
sc.input_.touchPanel = 'pause'; await sleep(200); ok(sc.dialogBox.mode === 'ask', 'ESC abre la pausa'); sc.dialogBox.pick(1); await sleep(300); ok(!sc.dialogBox.busy && JSON.parse(localStorage.getItem(SAVE_KEY)).inventory.includes('pocion_luz'), 'pausa guarda la partida con el inventario'); // Pausa y guardado
sm.getScenes(true).forEach(s => sm.stop(s.scene.key)); sm.start('Menu'); await sleep(300); sm.getScene('Menu').start(true); ok(await until(() => stay('Ch6_GreatHall')) && Quests.isDone('q5') && Inventory.has('moneda_suerte'), 'Continuar restaura escena, misiones e inventario'); // Continuar
for (const k of ['Ch1_Station', 'Ch2_Path', 'Ch3_Castle', 'Ch4_Library', 'Ch5_Potions', 'Ch6_GreatHall', 'Ch7_Gryffindor']) { sm.getScenes(true).forEach(s => sm.stop(s.scene.key)); sm.start(k); ok(await until(() => sm.isActive(k) && sm.getScene(k).player), 'capítulo explorable: ' + k); const sc = sm.getScene(k); ok(sc.children.length > 25, k + ' tiene escenario poblado (' + sc.children.length + ' objetos)'); } // Los 7 capítulos cargan con props, luces y partículas
ok(errors.length === 0, 'sin errores de consola/excepciones' + (errors.length ? ': ' + errors[0].slice(0, 200) : '')); // Consola limpia
console.log('Runtime OK:', n, 'comprobaciones'); game.destroy(true); process.exit(0); // Fin
