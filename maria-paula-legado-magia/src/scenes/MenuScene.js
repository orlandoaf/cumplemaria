import { SCENE_KEYS } from '../core/Config.js'; // Claves de escena
import { GameState } from '../core/GameState.js'; // Estado único
import { SaveManager } from '../core/SaveManager.js'; // Persistencia

export class MenuScene extends Phaser.Scene { // Menú inicial (Nueva partida / Continuar)
  constructor() { super(SCENE_KEYS.MENU); } // Registra la escena
  create() { // Construye el menú
    const { width, height } = this.scale; // Dimensiones lógicas
    this.add.text(width / 2, 70, 'MARÍA PAULA', { fontFamily: 'Georgia, serif', fontSize: '34px', color: '#f1c40f' }).setOrigin(0.5); // Título
    this.add.text(width / 2, 105, 'El Legado de la Magia', { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#e8d8b0' }).setOrigin(0.5); // Subtítulo
    this.button(width / 2, 170, 'Nueva partida', true, () => this.start(false)); // Botón funcional
    this.button(width / 2, 205, 'Continuar', SaveManager.hasSave(), () => this.start(true)); // Solo activo con guardado
  } // Fin create
  button(x, y, label, enabled, onClick) { // Crea un botón de texto
    const t = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '16px', color: enabled ? '#ffffff' : '#6b5d4a' }).setOrigin(0.5); // Texto
    if (enabled) t.setInteractive({ useHandCursor: true }).on('pointerdown', onClick); // Solo responde si está habilitado
  } // Fin button
  start(isContinue) { // Inicia o continúa partida
    if (isContinue) { if (!SaveManager.load()) GameState.reset(); } else { SaveManager.clear(); GameState.reset(); } // Carga o reinicia
    this.scene.start(this.scene.manager.keys[GameState.data.scene] ? GameState.data.scene : 'Ch1_Station'); // Entra al último mapa guardado o al Capítulo 1
  } // Fin start
} // Fin MenuScene
