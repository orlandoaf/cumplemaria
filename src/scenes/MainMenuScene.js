export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        this.add.text(400, 150, 'MARÍA PAULA', {
            font: 'bold 44px Georgia',
            fill: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(400, 215, 'El Legado de la Magia — Edición Auditada', {
            font: 'italic 22px Georgia',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const newGameBtn = this.add.text(400, 360, '[ INICIAR AVENTURA MÁGICA ]', {
            font: '22px Georgia',
            fill: '#f4e8c1'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        newGameBtn.on('pointerover', () => newGameBtn.setStyle({ fill: '#ffd700' }));
        newGameBtn.on('pointerout', () => newGameBtn.setStyle({ fill: '#f4e8c1' }));

        newGameBtn.on('pointerdown', () => {
            this.scene.start('Chapter1Scene');
        });
    }
}
