import { MAPS } from '../data/maps.js'; // Definiciones de mapas
import { PLAYER } from '../core/Config.js'; // Alcance de interacción
import { GameState } from '../core/GameState.js'; // Estado único
import { SaveManager } from '../core/SaveManager.js'; // Guardado
import { makeArt, makeNpc, PROPS, FX, rng } from '../utils/ArtKit.js'; // Arte procedural, props y partículas
import { makeTextures } from '../utils/SpriteFactory.js'; // Texturas y animaciones
import { InputManager } from '../systems/InputManager.js'; // Entrada
import { Player } from '../characters/Player.js'; // Protagonista
import { EventBus, EVENTS } from '../core/EventBus.js'; // Avisos para guardar
import { Inventory } from '../systems/Inventory.js'; // Inventario (Fase 4)
import { Quests } from '../systems/QuestSystem.js'; // Misiones (Fase 4)
import { QUESTS } from '../data/quests.js'; // Registro de misiones
import { ITEMS } from '../data/items.js'; // Catálogo de objetos
import { SCRIPTS } from '../data/scripts.js'; // Guiones de interacciones
import { DialogBox } from '../ui/DialogBox.js'; // Diálogos
import { Panels } from '../ui/Panels.js'; // Inventario, misiones y mapa
import { txt } from '../ui/UiKit.js'; // Estilo de texto

export class BaseWorldScene extends Phaser.Scene { // Escena explorable genérica; cada capítulo hereda de ella
  init(data) { this.spawn = data && data.spawn ? data.spawn : null; this.busy = false; this.dialog = null; } // Punto de entrada y banderas
  create() { // Construye el mapa
    const key = this.scene.key, map = MAPS[key]; // Clave y datos del mapa
    makeTextures(this); makeArt(this); // Garantiza texturas, animaciones y arte
    this.physics.world.setBounds(0, 0, map.w, map.h); // Límites del mundo
    this.add.tileSprite(map.w / 2, map.h / 2, map.w, map.h, map.ground).setDepth(-1); // Suelo
    this.walls = this.physics.add.staticGroup(); // Grupo de colisiones
    map.walls.forEach(r => { const t = this.add.tileSprite(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h, map.wall || 'stone'); this.physics.add.existing(t, true); this.walls.add(t); t.setDepth(r.y + r.h); if (r.hide) t.setVisible(false); }); // Muros con cuerpo estático
    const saved = GameState.data.scene === key && !this.spawn ? GameState.data.position : null; // Posición guardada si se continúa aquí
    const p0 = this.spawn || (saved && saved.x ? saved : map.spawn); // Elige dónde aparecer
    this.input_ = new InputManager(this); // Entrada
    this.player = new Player(this, p0.x, p0.y, this.input_); // Protagonista
    this.physics.add.collider(this.player, this.walls); // Choque con muros
    this.buildDecor(map); // Props, luces, partículas y ambiente (Fase 3)
    map.portals.forEach(p => { const z = this.add.zone(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h); this.physics.add.existing(z, true); this.physics.add.overlap(this.player, z, () => this.go(p)); }); // Portales entre mapas
    this.cameras.main.setBounds(0, 0, map.w, map.h).startFollow(this.player, true, 0.12, 0.12); // Cámara que sigue al personaje
    this.cameras.main.fadeIn(300); // Transición de entrada
    this.add.text(8, 6, map.name, { fontFamily: 'Georgia, serif', fontSize: '12px', color: '#f1c40f', backgroundColor: '#00000066' }).setScrollFactor(0).setDepth(3000); // Nombre de ubicación
    this.prompt = this.add.text(240, 20, 'E', { fontSize: '12px', color: '#fff', backgroundColor: '#000a' }).setOrigin(0.5).setScrollFactor(0).setDepth(3000).setVisible(false); // Indicador de interacción
    if (!GameState.data.discoveredZones.includes(key)) GameState.data.discoveredZones.push(key); // Marca zona descubierta
    this.dialogBox = new DialogBox(this); this.panels = new Panels(this); this.acting = false; this.live = 0; this.decorSprites = this.decorSprites || {}; // Interfaz de la Fase 4
    this.hud = txt(this, 8, 22, '', { fontSize: '10px', backgroundColor: '#f3e6cacc', padding: { x: 4, y: 2 } }).setScrollFactor(0).setDepth(3000); // Indicador de misión
    this.buildThings(map); if (map.quest && Quests.start(map.quest)) this.toast('Nueva misión: ' + QUESTS[map.quest].name); this.refreshHud(); // NPC, objetos y misión del capítulo
    const onChange = () => { this.refreshHud(); SaveManager.save(); }; EventBus.on(EVENTS.QUEST_UPDATED, onChange); EventBus.on(EVENTS.ITEM_ADDED, onChange); this.events.once('shutdown', () => { EventBus.off(EVENTS.QUEST_UPDATED, onChange); EventBus.off(EVENTS.ITEM_ADDED, onChange); }); // Guarda y refresca ante cambios
    this.autosave(); this.time.addEvent({ delay: 4000, loop: true, callback: () => this.autosave() }); // Guardado automático
  } // Fin create
  buildDecor(map) { // Arte de escenario: props con colisión, luces, flotación, partículas y atmósfera
    if (map.sky) this.add.image(0, 0, 'castle_far').setOrigin(0).setDepth(-0.5); // Cielo y castillo lejano
    (map.decals || []).forEach(([k, n], j) => { const r = rng(j * 7 + 3); for (let i = 0; i < n; i++) this.add.image(30 + r() * (map.w - 60), 34 + r() * (map.h - 68), 'd_' + k).setDepth(-0.9); }); // Detalles de suelo repartidos
    (map.decor || []).forEach(([k, x, y, tint]) => { // Cada prop del mapa
      const d = PROPS[k], im = this.add.image(x, y, 'p_' + k).setOrigin(0.5, 1).setDepth(d.fl ? -0.8 : d.air ? 2200 : d.bg ? 26 : y), tg = [im]; // Sprite con base en (x,y)
      if (tint) im.setTint(tint); if (d.a) im.setAlpha(d.a); // Tinte y transparencia opcionales
      if (!d.bg && !d.fl && !d.air && !d.f) this.add.image(x, y - 1, 'sh').setDisplaySize(d.w * 0.9, 8).setAlpha(0.35).setDepth(y - 0.5); // Sombra de contacto
      if (d.sw) this.tweens.add({ targets: im, angle: { from: -1.2, to: 1.2 }, duration: 1800 + Math.random() * 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); // Mece árboles y arbustos
      if (d.s) { const z = this.add.zone(x, y - d.s[1] / 2, d.w * d.s[0], d.s[1]); this.physics.add.existing(z, true); this.physics.add.collider(this.player, z); } // Colisión en la base
      if (d.g) { const gl = this.add.image(x, y - d.h * 0.6, 'glow').setTint(Phaser.Display.Color.HexStringToColor(d.g[0]).color).setBlendMode(Phaser.BlendModes.ADD).setDepth(2400).setScale(d.g[1] / 32).setAlpha(0.5); tg.push(gl); this.tweens.add({ targets: gl, alpha: { from: 0.32, to: 0.68 }, scale: { from: d.g[1] / 32 * 0.9, to: d.g[1] / 32 * 1.1 }, duration: 260 + Math.random() * 220, yoyo: true, repeat: -1 }); } // Luz que parpadea
      if (d.f) this.tweens.add({ targets: tg, y: '-=4', duration: 1400 + Math.random() * 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); // Flotación suave
    }); // Fin props
    (map.fx || []).forEach(f => this.add.particles(0, 0, 'dot', FX[f.t](f)).setDepth(2300)); // Partículas ambientales
    if (map.ambient) this.add.rectangle(240, 135, 480, 270, Phaser.Display.Color.HexStringToColor(map.ambient[0]).color, map.ambient[1]).setScrollFactor(0).setDepth(2500); // Atmósfera de color
    this.add.image(240, 135, 'vig').setScrollFactor(0).setDepth(2501); // Viñeta de cámara
  } // Fin buildDecor
  buildThings(map) { // Crea NPC, objetos recogibles e interacciones del mapa
    this.things = []; const k = this.scene.key; // Lista y clave
    const legacy = (map.interactables || []).map((o, i) => ({ kind: 'talk', id: k + '_i' + i, x: o.x + o.w / 2, y: o.y + o.h / 2, w: o.w, h: o.h, lines: o.lines })); // Interactuables simples
    [...legacy, ...(map.things || [])].forEach(t => { // Procesa cada elemento
      t.w = t.w || 20; t.h = t.h || 20; // Tamaño por defecto
      if (t.kind === 'item' && GameState.hasFlag('taken_' + t.id)) { this.hideDecor(t); return; } // Ya recogido: no aparece
      if (t.kind === 'item' && t.art !== 'decor') { // Objeto brillante
        const col = t.tint || 0xffd27a, o = this.add.image(t.x, t.y, 'orb').setTint(col).setDepth(t.y), gl = this.add.image(t.x, t.y, 'glow').setTint(col).setBlendMode(Phaser.BlendModes.ADD).setScale(0.7).setAlpha(0.6).setDepth(2400); // Orbe y brillo
        this.tweens.add({ targets: [o, gl], y: '-=3', duration: 900 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); this.decorSprites[t.x + ',' + t.y] = [o, gl]; // Flota
      } // Fin objeto
      if (t.kind === 'npc') { // Personaje secundario
        makeNpc(this, 'npc_' + t.id, t.look); const n = this.add.image(t.x, t.y + 12, 'npc_' + t.id).setOrigin(0.5, 1).setDepth(t.y + 12); // Sprite recoloreado
        this.add.image(t.x, t.y + 11, 'sh').setAlpha(0.4).setDepth(t.y + 10); txt(this, t.x, t.y - 16, t.name, { fontSize: '9px', color: '#fff', backgroundColor: '#000a', padding: { x: 2, y: 1 } }).setOrigin(0.5).setDepth(3000); // Sombra y nombre
        this.tweens.add({ targets: n, scaleY: 1.025, duration: 1300 + Math.random() * 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }); // Respiración
        const z = this.add.zone(t.x, t.y + 8, 10, 8); this.physics.add.existing(z, true); this.physics.add.collider(this.player, z); // Colisión del NPC
      } // Fin NPC
      this.things.push(t); // Registra para interactuar
    }); // Fin elementos
  } // Fin buildThings
  hideDecor(t) { const d = this.decorSprites[t.x + ',' + t.y]; if (d) { this.tweens.killTweensOf(d); d.forEach(o => o.destroy()); delete this.decorSprites[t.x + ',' + t.y]; } } // Oculta el objeto recogido
  nearThing() { const m = PLAYER.INTERACT_RANGE, p = this.player; return this.things.find(t => Math.abs(p.x - t.x) < t.w / 2 + m && Math.abs(p.y - t.y) < t.h / 2 + m); } // Elemento al alcance
  toast(msg) { const y = 44 + (this.live++ % 3) * 18, t = txt(this, 240, y, msg, { backgroundColor: '#f3e6c4', padding: { x: 8, y: 3 } }).setOrigin(0.5).setScrollFactor(0).setDepth(4200); this.tweens.add({ targets: t, alpha: 0, delay: 1700, duration: 500, onComplete: () => { t.destroy(); this.live--; } }); } // Aviso temporal
  refreshHud() { const q = Quests.current(); this.hud.setText(q ? 'Misión: ' + QUESTS[q].objective + ' (' + Quests.state(q).progress + '/' + QUESTS[q].goal + ')' : '').setVisible(!!q); } // Indicador de misión activa
  advanceQuest(id) { const done = Quests.progress(id), st = Quests.state(id); if (!st) return; this.toast('Misión: ' + QUESTS[id].name + ' (' + st.progress + '/' + QUESTS[id].goal + ')'); if (done && QUESTS[id].auto) this.finishQuest(id); } // Avanza y cierra si es automática
  finishQuest(id) { const got = Quests.complete(id); this.toast('✔ Misión completada: ' + QUESTS[id].name); got.forEach(i => this.toast('✦ Recompensa: ' + ITEMS[i].name)); } // Completa y premia
  ctx(t) { // Herramientas que reciben los guiones
    return { say: l => this.dialogBox.say(l), ask: (q, o) => this.dialogBox.ask(q, o), give: id => { if (Inventory.add(id)) this.toast('✦ Obtienes: ' + ITEMS[id].name); }, take: id => Inventory.remove(id), has: id => Inventory.has(id), flag: n => GameState.data.flags[n], setFlag: (n, v) => GameState.setFlag(n, v === undefined ? true : v), done: q => Quests.isDone(q), complete: q => this.finishQuest(q), id: t.id }; // API de guion
  } // Fin ctx
  async run(t) { // Ejecuta una interacción
    this.acting = true; const c = this.ctx(t); // Bloquea reentrada
    try { // Protege el juego de errores en guiones
      if (t.script) await SCRIPTS[t.script](c); // Guion propio
      else if (t.kind === 'item') { await c.say(t.lines || ['Encuentras: ' + ITEMS[t.item].name + '.']); c.give(t.item); GameState.setFlag('taken_' + t.id); this.hideDecor(t); this.things.splice(this.things.indexOf(t), 1); if (t.progress) this.advanceQuest(t.progress); } // Recoger objeto
      else { await c.say(t.lines); if (t.progress && !GameState.hasFlag('seen_' + t.id)) { GameState.setFlag('seen_' + t.id); this.advanceQuest(t.progress); } } // Hablar
    } catch (e) { console.error('[Interacción] fallo en ' + t.id + ':', e); } // Registro de error
    this.acting = false; // Libera
  } // Fin run
  async pause() { // Menú de pausa
    const k = await this.dialogBox.ask('Juego en pausa', ['Continuar', 'Guardar partida', 'Controles', 'Menú principal'], true); // Opciones
    if (k === 1) { this.autosave(); this.toast('Partida guardada'); } // Guardar
    else if (k === 2) await this.dialogBox.say(['Mover: W A S D o flechas  ·  Correr: SHIFT  ·  Interactuar: E', 'Avanzar diálogo: ESPACIO  ·  Mapa: M  ·  Inventario: I  ·  Misiones: J  ·  Pausa: ESC']); // Controles
    else if (k === 3) { this.autosave(); this.scene.start('Menu'); } // Volver al menú
  } // Fin pause
  update() { // Cada fotograma
    if (this.busy) return; // Congelado durante transición
    this.player.frozen = this.dialogBox.busy || !!this.panels.open; // Quieto en diálogos y paneles
    if (this.dialogBox.busy) { this.player.update(); this.dialogBox.update(this.input_); return; } // Diálogo abierto
    const key = this.input_.consumePanel(); // Panel pedido
    if (this.panels.open) { this.player.update(); if (key) { if (key === this.panels.open || key === 'pause') this.panels.close(); else this.panels.show(key); } return; } // Panel abierto
    if (this.acting) { this.player.update(); return; } // Guion en curso
    if (key === 'pause') { this.pause(); return; } if (key) { this.panels.show(key); return; } // Abre pausa o panel
    this.player.update(); // Mueve al jugador
    const t = this.nearThing(), pressed = this.input_.consumeInteract(); this.prompt.setVisible(!!t); // Lee E siempre (evita pulsaciones táctiles pendientes)
    if (t && pressed) this.run(t); // E interactúa
  } // Fin update
  autosave() { if (this.busy) return; GameState.set('scene', this.scene.key); GameState.set('position', { x: Math.round(this.player.x), y: Math.round(this.player.y) }); SaveManager.save(); } // Persiste escena y posición
  go(p) { // Transición a otro mapa
    if (p.req && !Quests.check(p.req)) { if (!this.gateCd) { this.gateCd = true; this.toast(p.hint || 'Aún no puedes pasar.'); this.time.delayedCall(1800, () => { this.gateCd = false; }); } const v = { e: [-1, 0], w: [1, 0], n: [0, 1], s: [0, -1] }[p.side]; this.player.setPosition(this.player.x + v[0] * 20, this.player.y + v[1] * 20); this.player.setVelocity(0, 0); return; } // Puerta cerrada: aviso y retroceso
    if (this.busy) return; this.busy = true; this.player.setVelocity(0, 0); // Bloquea y detiene
    this.cameras.main.fadeOut(300); // Desvanece
    this.cameras.main.once('camerafadeoutcomplete', () => { GameState.set('scene', p.to); GameState.set('position', { ...p.spawn }); SaveManager.save(); this.scene.start(p.to, { spawn: p.spawn }); }); // Cambia de escena al terminar
  } // Fin go
} // Fin BaseWorldScene
