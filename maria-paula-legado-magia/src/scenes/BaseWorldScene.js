import { MAPS } from '../data/maps.js'; // Definiciones de mapas
import { PLAYER } from '../core/Config.js'; // Alcance de interacción
import { GameState } from '../core/GameState.js'; // Estado único
import { SaveManager } from '../core/SaveManager.js'; // Guardado
import { makeArt, PROPS, FX, rng } from '../utils/ArtKit.js'; // Arte procedural, props y partículas
import { makeTextures } from '../utils/SpriteFactory.js'; // Texturas y animaciones
import { InputManager } from '../systems/InputManager.js'; // Entrada
import { Player } from '../characters/Player.js'; // Protagonista

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
    this.box = this.add.text(240, 250, '', { fontFamily: 'Georgia, serif', fontSize: '12px', color: '#fff', backgroundColor: '#000c', padding: { x: 8, y: 6 }, wordWrap: { width: 440 } }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(3001).setVisible(false); // Caja de diálogo provisional
    if (!GameState.data.discoveredZones.includes(key)) GameState.data.discoveredZones.push(key); // Marca zona descubierta
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
  nearby() { // Objeto interactuable cercano
    const m = PLAYER.INTERACT_RANGE; // Margen de alcance
    return MAPS[this.scene.key].interactables.find(o => this.player.x > o.x - m && this.player.x < o.x + o.w + m && this.player.y > o.y - m && this.player.y < o.y + o.h + m); // Primero dentro del alcance
  } // Fin nearby
  update() { // Cada fotograma
    if (this.busy) return; // Congelado durante transición
    if (this.dialog) { this.player.update(); if (this.input_.consumeAdvance()) this.advance(); return; } // En diálogo: solo avanzar
    this.player.update(); // Mueve al jugador
    const o = this.nearby(), pressed = this.input_.consumeInteract(); this.prompt.setVisible(!!o); // Lee E siempre (evita pulsaciones táctiles pendientes)
    if (o && pressed) this.say(o.lines); // E abre el diálogo
  } // Fin update
  say(lines) { this.dialog = { lines, i: 0 }; this.player.frozen = true; this.box.setText(lines[0]).setVisible(true); } // Inicia diálogo
  advance() { // Siguiente línea o cierre
    const d = this.dialog; d.i++; // Avanza índice
    if (d.i < d.lines.length) this.box.setText(d.lines[d.i]); // Muestra la siguiente
    else { this.dialog = null; this.player.frozen = false; this.box.setVisible(false); } // Cierra y libera al jugador
  } // Fin advance
  autosave() { if (this.busy) return; GameState.set('scene', this.scene.key); GameState.set('position', { x: Math.round(this.player.x), y: Math.round(this.player.y) }); SaveManager.save(); } // Persiste escena y posición
  go(p) { // Transición a otro mapa
    if (this.busy) return; this.busy = true; this.player.setVelocity(0, 0); // Bloquea y detiene
    this.cameras.main.fadeOut(300); // Desvanece
    this.cameras.main.once('camerafadeoutcomplete', () => { GameState.set('scene', p.to); GameState.set('position', { ...p.spawn }); SaveManager.save(); this.scene.start(p.to, { spawn: p.spawn }); }); // Cambia de escena al terminar
  } // Fin go
} // Fin BaseWorldScene
