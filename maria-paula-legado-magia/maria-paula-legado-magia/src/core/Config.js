export const GAME_CONFIG = { // Ajustes técnicos de Phaser (única fuente de verdad del motor)
  type: Phaser.AUTO, // Usa WebGL y cae a Canvas 2D si no está disponible
  parent: 'game-container', // Id del div de index.html que aloja el canvas
  width: 480, // Resolución lógica ancha (16:9 en baja resolución para pixel art)
  height: 270, // Resolución lógica alta
  pixelArt: true, // Desactiva el suavizado de texturas
  roundPixels: true, // Evita subpíxeles que desenfocan sprites
  backgroundColor: '#1b1410', // Color mientras carga una escena
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, // Escala al viewport manteniendo proporción
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }, // Física top-down sin gravedad (colisiones Fase 2)
  input: { activePointers: 3 } // Permite joystick + botones simultáneos en móvil
}; // Fin de GAME_CONFIG

export const SAVE_KEY = 'mp_legado_magia_save_v1'; // Clave de localStorage con versión para migraciones
export const SCENE_KEYS = { BOOT: 'Boot', MENU: 'Menu' }; // Claves de escena sin cadenas sueltas por el código
export const CHAPTERS = [ // Registro de los 7 capítulos (se conectan a escenas reales en Fase 2-3)
  { id: 1, key: 'Ch1_Station', name: 'La carta y el Expreso de Hogwarts' }, // Capítulo 1
  { id: 2, key: 'Ch2_Path', name: 'El camino hacia el castillo' }, // Capítulo 2
  { id: 3, key: 'Ch3_Castle', name: 'El castillo de Hogwarts' }, // Capítulo 3
  { id: 4, key: 'Ch4_Library', name: 'La biblioteca encantada' }, // Capítulo 4
  { id: 5, key: 'Ch5_Potions', name: 'El aula de pociones' }, // Capítulo 5
  { id: 6, key: 'Ch6_GreatHall', name: 'El Gran Comedor y el Sombrero Seleccionador' }, // Capítulo 6
  { id: 7, key: 'Ch7_Gryffindor', name: 'La gran sorpresa en Gryffindor' } // Capítulo 7
]; // Fin de CHAPTERS

export const PLAYER = { WALK: 70, RUN: 120, INTERACT_RANGE: 14 }; // Fase 2: velocidades (px/s) y alcance de interacción
