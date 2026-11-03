export class BirthdayCardModal {
    constructor(scene) {
        this.scene = scene;
        this.createModal();
    }

    createModal() {
        this.container = this.scene.add.container(400, 300).setScrollFactor(0).setDepth(2000).setVisible(false);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0xd9c59c, 1);
        bg.fillRoundedRect(-300, -220, 600, 440, 15);
        bg.lineStyle(4, 0x6e4722, 1);
        bg.strokeRoundedRect(-300, -220, 600, 440, 15);
        this.container.add(bg);

        const titleText = this.scene.add.text(0, -190, 'UNA CARTA PARA MARÍA PAULA', {
            font: 'bold 22px Georgia',
            fill: '#4a2505'
        }).setOrigin(0.5);
        this.container.add(titleText);

        const message = 
`Querida María Paula:

Hoy Hogwarts tiene algo especial que celebrar, y no es precisamente la llegada de una nueva estudiante. Es el cumpleaños de una persona maravillosa.

Queremos recordarte lo mucho que vales y lo especial que eres para quienes tenemos la fortuna de compartir contigo. Que nunca pierdas esa sonrisa, tu dulzura, tu alegría y esa manera tan tuya de hacer que los momentos se conviertan en recuerdos inolvidables.

Recuerda que no necesitas magia para ser extraordinaria, porque hay algo en ti que ya hace que el mundo sea un poquito más bonito.

Con mucho cariño,
Orlando, Marce, María Angélica, Yus, Mauro, Jeisson y todos tus amigos.

¡FELIZ CUMPLEAÑOS!`;

        const bodyText = this.scene.add.text(0, -150, message, {
            font: '13px Georgia',
            fill: '#2b1502',
            align: 'center',
            wordWrap: { width: 540 }
        }).setOrigin(0.5, 0);
        this.container.add(bodyText);

        const closeBtn = this.scene.add.text(0, 190, '[ CERRAR CARTA ]', {
            font: 'bold 16px Georgia',
            fill: '#6e4722'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => this.hide());
        this.container.add(closeBtn);
    }

    show() {
        this.container.setVisible(true);
    }

    hide() {
        this.container.setVisible(false);
    }
}
