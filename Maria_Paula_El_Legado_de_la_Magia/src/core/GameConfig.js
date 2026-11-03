import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { Chapter1Scene } from '../scenes/Chapter1Scene.js';
import { Chapter2Scene } from '../scenes/Chapter2Scene.js';
import { Chapter3Scene } from '../scenes/Chapter3Scene.js';
import { Chapter4Scene } from '../scenes/Chapter4Scene.js';
import { Chapter5Scene } from '../scenes/Chapter5Scene.js';
import { Chapter6Scene } from '../scenes/Chapter6Scene.js';
import { Chapter7Scene } from '../scenes/Chapter7Scene.js';
import { UIScene } from '../scenes/UIScene.js';

export const GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        Chapter1Scene,
        Chapter2Scene,
        Chapter3Scene,
        Chapter4Scene,
        Chapter5Scene,
        Chapter6Scene,
        Chapter7Scene,
        UIScene
    ]
};
