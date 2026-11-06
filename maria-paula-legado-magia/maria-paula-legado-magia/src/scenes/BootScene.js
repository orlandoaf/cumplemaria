import { SCENE_KEYS } from '../core/Config.js'; // Claves de escena

export class BootScene extends Phaser.Scene { // Primera escena: verifica el motor y pasa al menú
  constructor() { super(SCENE_KEYS.BOOT); } // Registra la escena con su clave
  create() { // Se ejecuta al iniciar la escena
    console.info('[Boot] Phaser', Phaser.VERSION, '| render:', this.game.config.renderType === Phaser.WEBGL ? 'WebGL' : 'Canvas'); // Diagnóstico
    this.scene.start(SCENE_KEYS.MENU); // La carga de assets reales llega en Fase 3
  } // Fin create
} // Fin BootScene
