import { GameConfig } from './src/core/GameConfig.js';

window.addEventListener('load', () => {
    // Inicialización del motor Phaser 3 con la configuración de la auditoría técnica
    const game = new Phaser.Game(GameConfig);
});
