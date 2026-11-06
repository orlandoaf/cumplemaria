import { GAME_CONFIG } from './src/core/Config.js'; // Importa la configuración central de Phaser
import { BootScene } from './src/scenes/BootScene.js'; // Escena de arranque (carga y validación)
import { MenuScene } from './src/scenes/MenuScene.js'; // Escena del menú inicial
import { Ch1_Station, Ch2_Path, Ch3_Castle, Ch4_Library, Ch5_Potions, Ch6_GreatHall, Ch7_Gryffindor } from './src/scenes/ChapterScenes.js'; // Mapas explorables (Fase 2)

const config = { // Objeto de configuración final que recibe Phaser.Game
  ...GAME_CONFIG, // Copia ajustes de render, escala y física definidos en Config.js
  scene: [BootScene, MenuScene, Ch1_Station, Ch2_Path, Ch3_Castle, Ch4_Library, Ch5_Potions, Ch6_GreatHall, Ch7_Gryffindor] // Lista ordenada de escenas; la primera arranca sola (las de capítulos se añaden en Fase 2-3)
}; // Cierra el objeto de configuración

window.__GAME__ = new Phaser.Game(config); // Crea el juego y lo expone en consola para depuración
