import { SCENE_KEYS } from '../core/Config.js'; // Claves de escena
import { GameState } from '../core/GameState.js'; // Estado único
import { SaveManager } from '../core/SaveManager.js'; // Persistencia

export class MenuScene extends Phaser.Scene { // Menú inicial (Nueva partida / Continuar)
  constructor() { super(SCENE_KEYS.MENU); } // Registra la escena
  create() { // Construye el menú
    const { width, height } = this.scale; // Dimensiones lógicas
    this.add.text(width / 2, 70, 'MARÍA PAULA', { fontFamily: 'Georgia, serif', fontSize: '34px', color: '#f1c40f' }).setOrigin(0.5); // Título
    this.add.text(width / 2, 105, 'El Legado de la Magia', { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#e8d8b0' }).setOrigin(0.5); // Subtítulo
    this.button(width / 2, 150, 'Nueva partida', true, () => this.start(false)); // Botón funcional
    this.button(width / 2, 176, 'Controles', true, () => this.info('Controles', ['W A S D / Flechas: mover', 'SHIFT: correr', 'E: interactuar', 'ESPACIO: avanzar diálogos', 'M: mapa  ·  I: inventario', 'J: misiones  ·  ESC: pausa', 'En móvil: joystick y botones en pantalla'])); // Controles
    this.button(width / 2, 202, 'Créditos', true, () => this.info('Créditos', ['María Paula: El Legado de la Magia', 'Un regalo de cumpleaños hecho con cariño.', 'Motor: Phaser 3 (MIT).', 'Arte, código y diseño: generados para este proyecto.'])); // Créditos
    this.button(width / 2, 228, 'Continuar', SaveManager.hasSave(), () => this.start(true)); // Solo activo con guardado
  } // Fin create
  button(x, y, label, enabled, onClick) { // Crea un botón de texto
    const t = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '16px', color: enabled ? '#ffffff' : '#6b5d4a' }).setOrigin(0.5); // Texto
    if (enabled) t.setInteractive({ useHandCursor: true }).on('pointerdown', onClick); // Solo responde si está habilitado
  } // Fin button
  info(title, lines) { // Ventana de texto sencilla que se cierra al tocar
    const w = this.scale.width, g = this.add.container(0, 0).setDepth(100), bg = this.add.rectangle(0, 0, w, 270, 0x1b1410, 0.88).setOrigin(0).setInteractive(); // Fondo oscuro que captura el toque
    g.add([bg, this.add.text(w / 2, 40, title, { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f1c40f', resolution: 2 }).setOrigin(0.5), this.add.text(w / 2, 135, lines.join('\n'), { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#f3e6c4', align: 'center', lineSpacing: 6, resolution: 2 }).setOrigin(0.5), this.add.text(w / 2, 250, 'Toca para volver', { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#c9bfa5', resolution: 2 }).setOrigin(0.5)]); // Contenido
    bg.once('pointerdown', () => g.destroy()); // Cierra al tocar
  } // Fin info
  start(isContinue) { // Inicia o continúa partida
    if (isContinue) { if (!SaveManager.load()) GameState.reset(); } else { SaveManager.clear(); GameState.reset(); } // Carga o reinicia
    this.scene.start(this.scene.manager.keys[GameState.data.scene] ? GameState.data.scene : 'Ch1_Station'); // Entra al último mapa guardado o al Capítulo 1
  } // Fin start
} // Fin MenuScene
