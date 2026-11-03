import { Player } from '../characters/Player.js';
import { InputManager } from '../systems/InputManager.js';
import { LightManager } from '../systems/LightManager.js';
import { DialogueManager } from '../systems/DialogueManager.js';
import { MapBuilder } from '../data/MapBuilder.js';
import { stateManager } from '../core/StateManager.js';
import { DIALOGUES_DATABASE } from '../data/dialogues.js';

export class Chapter6Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Chapter6Scene' });
        this.ceremonyTriggered = false;
    }

    create() {
        const width = 1000;
        const height = 1000;

        this.obstacles = MapBuilder.buildChapterMap(this, width, height, 'great_hall');

        this.lightManager = new LightManager(this);
        this.lightManager.setAmbientColor(0x2a1c18);
        this.spotlight = this.lightManager.addFlickeringLight(500, 300, 300, 0xffd700, 1.6);

        this.add.text(50, 30, 'Capítulo 6: El Gran Comedor y el Sombrero Seleccionador', {
            font: '18px Georgia',
            fill: '#ffd700'
        });

        this.player = new Player(this, 500, 900);
        this.inputManager = new InputManager(this);
        this.dialogueManager = new DialogueManager(this);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, width, height);

        this.ceremonyZone = this.add.zone(500, 300, 150, 100);
        this.physics.add.existing(this.ceremonyZone, true);

        this.physics.add.overlap(this.player, this.ceremonyZone, () => {
            if (!this.ceremonyTriggered) {
                this.triggerSortingCeremony();
            }
        });
    }

    triggerSortingCeremony() {
        this.ceremonyTriggered = true;
        this.player.body.setVelocity(0, 0);

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 0.8,
            duration: 1000,
            yoyo: true,
            onYoyo: () => {
                this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
                this.dialogueManager.startDialogue(DIALOGUES_DATABASE.HAT_FULL_SPEECH, () => {
                    this.onHouseAssigned();
                });
            }
        });
    }

    onHouseAssigned() {
        this.lightManager.createAmbientParticles(500, 300, 'maria_paula', {
            speed: { min: 40, max: 100 },
            scale: { start: 0.6, end: 0 },
            lifespan: 3000,
            frequency: 50
        });

        const banner = this.add.text(500, 200, '¡GRYFFINDOR!', {
            font: 'bold 48px Georgia',
            fill: '#ff2233',
            stroke: '#ffd700',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0);

        this.tweens.add({
            targets: banner,
            y: 180,
            duration: 1000,
            yoyo: true,
            repeat: 2
        });

        this.time.delayedCall(4000, () => {
            stateManager.setChapter(7);
            this.scene.start('Chapter7Scene');
        });
    }

    update() {
        if (this.player && !this.dialogueManager.isActive && !this.ceremonyTriggered) {
            this.player.update(this.inputManager);
        }

        if (this.inputManager.keys.SPACE.isDown && this.dialogueManager.isActive) {
            this.dialogueManager.advance();
        }
    }
}
