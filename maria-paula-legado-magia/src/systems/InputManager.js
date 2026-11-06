export class InputManager { // Unifica teclado y controles táctiles
  constructor(scene) { // Recibe la escena dueña
    this.scene = scene; // Guarda la escena
    const kb = scene.input.keyboard; // Plugin de teclado
    this.keys = kb.addKeys('W,A,S,D,E,SPACE,SHIFT'); // Teclas del prompt usadas en esta fase
    this.cursors = kb.createCursorKeys(); // Flechas
    this.stick = { x: 0, y: 0 }; this.touchRun = false; this.touchInteract = false; // Estado táctil
    if (scene.sys.game.device.input.touch) this.buildTouch(); // Solo en dispositivos táctiles
  } // Fin constructor
  buildTouch() { // Crea joystick virtual y botones
    const s = this.scene, C = { x: 70, y: 200, r: 34 }; // Centro y radio del joystick
    s.add.circle(C.x, C.y, C.r, 0xffffff, 0.15).setScrollFactor(0).setDepth(2000); // Base
    const knob = s.add.circle(C.x, C.y, 14, 0xffffff, 0.4).setScrollFactor(0).setDepth(2001); // Perilla
    s.input.on('pointerdown', p => { if (p.x < 240 && this.stickId == null) { this.stickId = p.id; this.moveStick(p, C, knob); } }); // Toma el puntero izquierdo
    s.input.on('pointermove', p => { if (p.id === this.stickId) this.moveStick(p, C, knob); }); // Arrastra
    s.input.on('pointerup', p => { if (p.id === this.stickId) { this.stickId = null; this.stick = { x: 0, y: 0 }; knob.setPosition(C.x, C.y); } }); // Suelta
    const btn = (x, y, label, down, up) => { // Botón circular
      s.add.circle(x, y, 22, 0xffffff, 0.2).setScrollFactor(0).setDepth(2000).setInteractive().on('pointerdown', down).on('pointerup', up).on('pointerout', up); // Círculo táctil
      s.add.text(x, y, label, { fontSize: '14px', color: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(2001); // Etiqueta
    }; // Fin btn
    btn(430, 215, 'E', () => { this.touchInteract = true; }, () => {}); // Botón interactuar
    btn(385, 235, 'RUN', () => { this.touchRun = true; }, () => { this.touchRun = false; }); // Botón correr (mantener)
  } // Fin buildTouch
  moveStick(p, C, knob) { // Calcula el vector del joystick
    const dx = p.x - C.x, dy = p.y - C.y, d = Math.min(Math.hypot(dx, dy), C.r), a = Math.atan2(dy, dx); // Desplazamiento limitado
    knob.setPosition(C.x + Math.cos(a) * d, C.y + Math.sin(a) * d); // Mueve la perilla
    this.stick = d < 6 ? { x: 0, y: 0 } : { x: Math.cos(a) * d / C.r, y: Math.sin(a) * d / C.r }; // Zona muerta de 6 px
  } // Fin moveStick
  get vector() { // Dirección combinada (-1..1)
    const k = this.keys, c = this.cursors; // Atajos
    let x = (k.D.isDown || c.right.isDown ? 1 : 0) - (k.A.isDown || c.left.isDown ? 1 : 0); // Eje X de teclado
    let y = (k.S.isDown || c.down.isDown ? 1 : 0) - (k.W.isDown || c.up.isDown ? 1 : 0); // Eje Y de teclado
    if (x === 0 && y === 0) { x = this.stick.x; y = this.stick.y; } // Si no hay teclado usa el joystick
    return { x, y }; // Devuelve el vector
  } // Fin vector
  get running() { return this.keys.SHIFT.isDown || this.touchRun; } // Correr con SHIFT o botón
  consumeInteract() { const v = Phaser.Input.Keyboard.JustDown(this.keys.E) || this.touchInteract; this.touchInteract = false; return v; } // E o botón, una sola vez
  consumeAdvance() { return Phaser.Input.Keyboard.JustDown(this.keys.SPACE) || this.consumeInteract(); } // ESPACIO (o E) avanza diálogo
} // Fin InputManager
