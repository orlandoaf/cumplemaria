import { Player } from '../characters/Player.js';
import { InputManager } from '../systems/InputManager.js';
import { DialogueManager } from '../systems/DialogueManager.js';
import { stateManager } from '../core/StateManager.js';
import { DIALOGUES_DATABASE } from '../data/dialogues.js';

export class Chapter1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Chapter1Scene' });
    }

    create() {
        const width = 1600;
        const height = 600;

        this.physics.world.setBounds(0, 0, width, height);

        const bg = this.add.graphics();
        bg.fillStyle(0x1e1b2e, 1);
        bg.fillRect(0, 0, width, height);

        this.add.text(50, 30, 'Capítulo 1: La Carta y el Expreso de Hogwarts', {
            font: '18px Georgia',
            fill: '#ffd700'
        });

        this.player = new Player(this, 100, 400);
        this.inputManager = new InputManager(this);
        this.dialogueManager = new DialogueManager(this);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, width, height);

        this.time.delayedCall(500, () => {
            this.dialogueManager.startDialogue(DIALOGUES_DATABASE.CARTA_BIENVENIDA, () => {
                stateManager.addItem('ACCEPTANCE_LETTER');
            });
        });

        this.exitZone = this.add.zone(1550, 300, 50, 600);
        this.physics.add.existing(this.exitZone, true);
        this.physics.add.overlap(this.player, this.exitZone, () => {
            if (!this.dialogueManager.isActive) {
                stateManager.setChapter(2);
                this.scene.start('Chapter2Scene');
            }
        });
    }

    update() {
        if (this.player && !this.dialogueManager.isActive) {
            this.player.update(this.inputManager);
        }

        if (this.inputManager.keys.SPACE.isDown && this.dialogueManager.isActive) {
            this.dialogueManager.advance();
        }
    }
}
