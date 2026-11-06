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
for (const [i, exp] of [[0, 'abre'], [1, 'avanza'], [2, 'cierra']]) { s1.input_.touchInteract = true; await sleep(150); if (i === 0) ok(!!s1.dialog && s1.player.frozen, 'diálogo se abre y congela'); if (i === 1) ok(s1.dialog && s1.dialog.i === 1, 'diálogo avanza'); if (i === 2) ok(!s1.dialog && !s1.player.frozen, 'diálogo cierra y libera'); } // Diálogo
s1.player.setPosition(60, 180); s1.input_.stick = { x: 1, y: 0 }; s1.input_.touchRun = true; // Corre hacia el portal
ok(await until(() => sm.isActive('Ch2_Path')), 'portal: Ch1 -> Ch2'); // Transición
await sleep(400); const s2 = sm.getScene('Ch2_Path'); // Escena 2
ok(s2.player.x > 20 && s2.player.x < 80 && GameState.data.scene === 'Ch2_Path', 'aparece en el spawn de Ch2 y el estado cambia'); // Spawn
const saved = JSON.parse(localStorage.getItem(SAVE_KEY)); ok(saved.scene === 'Ch2_Path' && saved.discoveredZones.length === 2, 'guardado persistido con zonas descubiertas'); // Guardado
sm.stop('Ch2_Path'); sm.start('Menu'); await sleep(300); sm.getScene('Menu').start(true); // Continuar
ok(await until(() => sm.isActive('Ch2_Path')), 'Continuar restaura el mapa guardado'); // Continuar
localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, scene: 'Inexistente' })); GameState.load(JSON.parse(localStorage.getItem(SAVE_KEY))); // Guardado con escena desconocida
sm.stop('Ch2_Path'); sm.start('Menu'); await sleep(300); sm.getScene('Menu').start(true); ok(await until(() => sm.isActive('Ch1_Station')), 'escena desconocida cae en Capítulo 1 sin romper'); // Robustez
for (const k of ['Ch1_Station', 'Ch2_Path', 'Ch3_Castle', 'Ch4_Library', 'Ch5_Potions', 'Ch6_GreatHall', 'Ch7_Gryffindor']) { sm.getScenes(true).forEach(s => sm.stop(s.scene.key)); sm.start(k); ok(await until(() => sm.isActive(k) && sm.getScene(k).player), 'capítulo explorable: ' + k); const sc = sm.getScene(k); ok(sc.children.length > 25, k + ' tiene escenario poblado (' + sc.children.length + ' objetos)'); } // Los 7 capítulos cargan con props, luces y partículas
ok(errors.length === 0, 'sin errores de consola/excepciones' + (errors.length ? ': ' + errors[0].slice(0, 200) : '')); // Consola limpia
console.log('Runtime OK:', n, 'comprobaciones'); game.destroy(true); process.exit(0); // Fin
