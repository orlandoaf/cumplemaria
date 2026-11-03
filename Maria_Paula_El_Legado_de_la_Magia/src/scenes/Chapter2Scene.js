import { Player } from '../characters/Player.js';
import { InputManager } from '../systems/InputManager.js';
import { LightManager } from '../systems/LightManager.js';
import { MapBuilder } from '../data/MapBuilder.js';
import { stateManager } from '../core/StateManager.js';

export class Chapter2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Chapter2Scene' });
    }

    create() {
        const width = 2000;
        const height = 600;

        this.obstacles = MapBuilder.buildChapterMap(this, width, height, 'forest');

        this.lightManager = new LightManager(this);
        this.lightManager.setAmbientColor(0x1a1a3a);

        this.lightManager.addFlickeringLight(300, 250, 150, 0xffaa44, 1.2);
        this.lightManager.addFlickeringLight(800, 250, 150, 0xffaa44, 1.2);
        this.lightManager.addFlickeringLight(1400, 250, 150, 0xffaa44, 1.2);

        this.add.text(50, 30, 'Capítulo 2: El Camino hacia el Castillo', {
            font: '18px Georgia',
            fill: '#ffd700'
        });

        this.player = new Player(this, 100, 300);
        this.inputManager = new InputManager(this);
        this.physics.add.collider(this.player, this.obstacles);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, width, height);

        this.exitZone = this.add.zone(1950, 300, 50, 600);
        this.physics.add.existing(this.exitZone, true);
        this.physics.add.overlap(this.player, this.exitZone, () => {
            stateManager.setChapter(3);
            this.scene.start('Chapter3Scene');
        });
    }

    update() {
        if (this.player) {
            this.player.update(this.inputManager);
        }
    }
}
