import { txt, panel } from './UiKit.js'; // Estilo común
const parse = l => { const m = /^([^:]{1,24}): (.*)$/.exec(l); return m ? { who: m[1], text: m[2] } : { who: '', text: l }; }; // "Nombre: texto" -> hablante y texto

export class DialogBox { // Ventana de diálogo con nombre, texto que se escribe y menú de opciones
  constructor(scene) { // Crea los elementos fijos a la pantalla
    this.s = scene; this.mode = null; this.sel = 0; this.opts = []; this.queue = []; this.typing = null; // Estado interno
    const c = this.c = scene.add.container(0, 0).setScrollFactor(0).setDepth(4000).setVisible(false); // Contenedor
    panel(scene, c, 10, 172, 460, 90).setInteractive().on('pointerdown', () => { if (this.mode === 'say') this.advance(); }); // Caja (tocar avanza)
    this.name = txt(scene, 18, 160, '', { color: '#fff', backgroundColor: '#7a1f2a', padding: { x: 6, y: 2 } }); // Placa de nombre
    this.body = txt(scene, 20, 182, '', { wordWrap: { width: 440 }, lineSpacing: 3 }); // Texto
    this.arrow = txt(scene, 452, 246, '▼', { color: '#8a5a24' }); // Indicador de continuar
    this.menu = scene.add.container(0, 0); c.add([this.name, this.body, this.arrow, this.menu]); // Menú de opciones
  } // Fin constructor
  get busy() { return this.mode !== null; } // ¿Hay diálogo abierto?
  say(lines) { return new Promise(res => { this.queue = lines.map(parse); this.done = res; this.mode = 'say'; this.c.setVisible(true); this.next(); }); } // Muestra líneas y resuelve al terminar
  next() { // Siguiente línea o cierre
    if (!this.queue.length) { const d = this.done; this.close(); d(); return; } // Fin del diálogo
    const l = this.queue.shift(); this.name.setText(l.who).setVisible(!!l.who); this.full = l.text; this.n = 0; this.body.setText(''); this.arrow.setVisible(false); // Prepara línea
    this.typing = this.s.time.addEvent({ delay: 22, loop: true, callback: () => this.tick() }); // Efecto de escritura
  } // Fin next
  tick() { this.n++; this.body.setText(this.full.slice(0, this.n)); if (this.n >= this.full.length) { this.typing.remove(); this.typing = null; this.arrow.setVisible(true); } } // Una letra más
  advance() { if (this.typing) { this.typing.remove(); this.typing = null; this.body.setText(this.full); this.arrow.setVisible(true); } else this.next(); } // Completa la línea o pasa a la siguiente
  ask(q, options, cancel = false) { // Pregunta con opciones; resuelve con el índice elegido
    return new Promise(res => { // Promesa que se resuelve con la opción elegida
      this.done = res; this.mode = 'ask'; this.cancel = cancel; this.sel = 0; this.opts = options; this.c.setVisible(true); this.name.setVisible(false); this.arrow.setVisible(false); this.body.setText(q); // Estado
      const h = options.length * 14 + 10, y = 168 - h; panel(this.s, this.menu, 250, y, 220, h); // Panel de opciones sobre la caja
      this.rows = options.map((o, i) => { const t = txt(this.s, 260, y + 5 + i * 14, (i + 1) + '. ' + o).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pick(i)); this.menu.add(t); return t; }); // Una fila por opción
      this.mark(); // Resalta la primera
    });
  } // Fin ask
  mark() { this.rows.forEach((t, i) => t.setColor(i === this.sel ? '#7a1f2a' : '#3b2a14').setFontStyle(i === this.sel ? 'bold' : 'normal')); } // Resalta la opción actual
  pick(i) { if (this.mode !== 'ask') return; const d = this.done; this.close(); d(i); } // Elige una opción
  close() { this.mode = null; this.c.setVisible(false); this.menu.removeAll(true); } // Cierra y limpia
  update(input) { // Lee la entrada cada fotograma
    if (this.mode === 'say') { if (input.consumeAdvance()) this.advance(); } // ESPACIO/E avanzan
    else if (this.mode === 'ask') { // Menú
      const st = input.consumeStep(); if (st) { this.sel = (this.sel + st + this.opts.length) % this.opts.length; this.mark(); } // W/S o flechas
      const n = input.consumeNumber(); if (n >= 0 && n < this.opts.length) { this.pick(n); return; } // Teclas 1-6
      if (input.consumeAdvance()) this.pick(this.sel); else if (this.cancel && input.consume('ESC')) this.pick(0); // Confirmar o cancelar
    } // Fin menú
  } // Fin update
} // Fin DialogBox
