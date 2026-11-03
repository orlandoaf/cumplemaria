import { Player } from '../characters/Player.js';
import { InputManager } from '../systems/InputManager.js';
import { LightManager } from '../systems/LightManager.js';
import { DialogueManager } from '../systems/DialogueManager.js';
import { PhotoManager } from '../systems/PhotoManager.js';
import { BirthdayCardModal } from '../ui/BirthdayCardModal.js';
import { MapBuilder } from '../data/MapBuilder.js';
import { FRIENDS_DATABASE } from '../data/friendsData.js';
import { stateManager } from '../core/StateManager.js';

export class Chapter7Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Chapter7Scene' });
        this.surpriseTriggered = false;
        this.openedPresentsCount = 0;
    }

    create() {
        const width = 1000;
        const height = 800;

        this.obstacles = MapBuilder.buildChapterMap(this, width, height, 'gryffindor');

        this.lightManager = new LightManager(this);
        this.lightManager.setAmbientColor(0x110507);

        this.player = new Player(this, 500, 720);
        this.inputManager = new InputManager(this);
        this.dialogueManager = new DialogueManager(this);
        this.photoManager = new PhotoManager(this);
        this.birthdayCardModal = new BirthdayCardModal(this);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, width, height);

        this.cake = this.add.circle(500, 350, 20, 0xffd700).setInteractive();
        this.cakeText = this.add.text(500, 320, '🎂 Pastel de Cumpleaños', { font: '14px Georgia', fill: '#ffffff' }).setOrigin(0.5);
        this.physics.add.existing(this.cake, true);

        this.friendsGroup = this.physics.add.staticGroup();
        this.friendsMap = {};

        FRIENDS_DATABASE.forEach(friend => {
            const friendSprite = this.add.rectangle(friend.x, friend.y, 24, 32, 0x800020).setInteractive();
            this.add.text(friend.x, friend.y - 25, friend.name, { font: '12px Georgia', fill: '#ffd700' }).setOrigin(0.5);
            
            friendSprite.friendData = friend;
            friendSprite.setVisible(false);
            this.friendsMap[friend.id] = friendSprite;
        });

        this.presents = [
            { x: 300, y: 600, id: 1, text: '🎁 Carta de Felicitación de los Profesores' },
            { x: 700, y: 600, id: 2, text: '🎁 Esfera de Cristal con Recuerdos Mágicos' },
            { x: 250, y: 300, id: 3, text: '🎁 Bufanda Dorada Gryffindor Tejida a Mano' },
            { x: 750, y: 300, id: 4, text: '🎁 Fotografía Animada de la Llegada a Hogwarts' }
        ];

        this.presentSprites = this.physics.add.staticGroup();
        this.presents.forEach(p => {
            const pres = this.add.rectangle(p.x, p.y, 18, 18, 0xffd700).setInteractive();
            pres.presentData = p;
            pres.setVisible(false);
            this.presentSprites.add(pres);
        });

        this.surpriseZone = this.add.zone(500, 550, 400, 100);
        this.physics.add.existing(this.surpriseZone, true);

        this.physics.add.overlap(this.player, this.surpriseZone, () => {
            if (!this.surpriseTriggered) {
                this.triggerSurpriseEvent();
            }
        });

        this.photoBtn = this.add.text(780, 560, '📷 Tomar Foto Grupal', {
            font: 'bold 14px Georgia',
            fill: '#ffd700',
            backgroundColor: '#4a151b',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 1).setScrollFactor(0).setInteractive({ useHandCursor: true }).setVisible(false);

        this.photoBtn.on('pointerdown', () => {
            this.photoManager.takeGroupPhoto();
            stateManager.state.hasTakenGroupPhoto = true;
            stateManager.saveToLocalStorage();
        });

        this.cardBtn = this.add.text(780, 520, '📜 Carta de Cumpleaños', {
            font: 'bold 14px Georgia',
            fill: '#ffd700',
            backgroundColor: '#4a151b',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 1).setScrollFactor(0).setInteractive({ useHandCursor: true }).setVisible(false);

        this.cardBtn.on('pointerdown', () => {
            this.birthdayCardModal.show();
        });
    }

    triggerSurpriseEvent() {
        this.surpriseTriggered = true;
        this.player.body.setVelocity(0, 0);

        this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.lightManager.setAmbientColor(0x3a1015);
                this.lightManager.addFlickeringLight(500, 350, 350, 0xffaa44, 1.8);

                Object.values(this.friendsMap).forEach(f => f.setVisible(true));
                this.presentSprites.getChildren().forEach(p => p.setVisible(true));

                this.cameras.main.fadeIn(500);

                const banner = this.add.text(500, 150, '¡FELIZ CUMPLEAÑOS!\nMARÍA PAULA\n¡BIENVENIDA A GRYFFINDOR!', {
                    font: 'bold 28px Georgia',
                    fill: '#ffd700',
                    stroke: '#800020',
                    strokeThickness: 5,
                    align: 'center'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: banner,
                    scaleX: { from: 0, to: 1 },
                    scaleY: { from: 0, to: 1 },
                    duration: 1000,
                    ease: 'Back.easeOut'
                });

                this.lightManager.createAmbientParticles(500, 200, 'maria_paula', {
                    speed: { min: 30, max: 80 },
                    scale: { start: 0.5, end: 0 },
                    lifespan: 2500,
                    frequency: 60
                });

                this.dialogueManager.startDialogue([
                    { speaker: '¡TODOS JUNTOS!', text: '¡¡¡SORPRESAAAAA!!! ¡¡FELIZ CUMPLEAÑOS MARÍA PAULA!!' }
                ], () => {
                    this.photoBtn.setVisible(true);
                    this.cardBtn.setVisible(true);
                    this.enableFreeExploration();
                });
            }
        });
    }

    enableFreeExploration() {
        this.physics.add.overlap(this.player, this.friendsGroup, (player, friendSprite) => {
            if (this.inputManager.isJustInteracted() && !this.dialogueManager.isActive) {
                this.dialogueManager.startDialogue(friendSprite.friendData.dialogue);
            }
        });

        this.physics.add.overlap(this.player, this.presentSprites, (player, presSprite) => {
            if (this.inputManager.isJustInteracted() && !this.dialogueManager.isActive) {
                const data = presSprite.presentData;
                this.dialogueManager.startDialogue([
                    { speaker: 'Regalo Sorpresa', text: `¡Has abierto un regalo!\n\n${data.text}` }
                ]);
            }
        });

        this.physics.add.overlap(this.player, this.cake, () => {
            if (this.inputManager.isJustInteracted() && !this.dialogueManager.isActive) {
                this.dialogueManager.startDialogue([
                    { speaker: 'Amigos', text: '¡Pide un deseo María Paula! ¡Sopla las velas!' },
                    { speaker: 'María Paula', text: '*(María Paula cierra los ojos, pide un deseo con todo su corazón y sopla las velas)* 🎂✨' }
                ], () => {
                    stateManager.state.birthdayWishMade = true;
                    stateManager.saveToLocalStorage();
                });
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
