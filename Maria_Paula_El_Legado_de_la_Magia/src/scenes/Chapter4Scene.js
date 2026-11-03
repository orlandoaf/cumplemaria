import { Player } from '../characters/Player.js';
import { InputManager } from '../systems/InputManager.js';
import { LightManager } from '../systems/LightManager.js';
import { MapBuilder } from '../data/MapBuilder.js';
import { stateManager } from '../core/StateManager.js';

export class Chapter4Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Chapter4Scene' });
    }

    create() {
        const width = 1000;
        const height = 800;

        this.obstacles = MapBuilder.buildChapterMap(this, width, height, 'library');

        this.lightManager = new LightManager(this);
        this.lightManager.setAmbientColor(0x2a1e17);
        this.lightManager.addFlickeringLight(500, 400, 250, 0xffcc66, 1.3);

        this.add.text(50, 30, 'Capítulo 4: La Biblioteca Encantada', {
            font: '18px Georgia',
            fill: '#ffd700'
        });

        this.player = new Player(this, 500, 700);
        this.inputManager = new InputManager(this);
        this.physics.add.collider(this.player, this.obstacles);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, width, height);

        this.exitZone = this.add.zone(500, 50, 200, 50);
        this.physics.add.existing(this.exitZone, true);
        this.physics.add.overlap(this.player, this.exitZone, () => {
            stateManager.setChapter(5);
            this.scene.start('Chapter5Scene');
        });
    }

    update() {
        if (this.player) {
            this.player.update(this.inputManager);
        }
    }
}
