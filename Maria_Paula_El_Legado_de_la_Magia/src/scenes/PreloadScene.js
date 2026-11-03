export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const loadingText = this.add.text(400, 300, 'Cargando Arte Pixel Art Realista... 0%', {
            font: '20px Georgia',
            fill: '#ffd700'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            loadingText.setText(`Cargando Arte Pixel Art Realista... ${Math.floor(value * 100)}%`);
        });

        // Spritesheet de alta densidad cromática para María Paula
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const x = col * 32;
                const y = row * 32;

                // Túnica negra con pliegues en sombras
                ctx.fillStyle = '#14121a';
                ctx.fillRect(x + 10, y + 12, 12, 16);

                // Tono de piel cálido
                ctx.fillStyle = '#ffdbac';
                ctx.fillRect(x + 11, y + 4, 10, 9);

                // Cabello Castaño con luces
                ctx.fillStyle = '#3a2012';
                ctx.fillRect(x + 10, y + 2, 12, 5);
                ctx.fillRect(x + 8, y + 5, 3, 10);
                ctx.fillRect(x + 21, y + 5, 3, 10);

                // Bufanda Gryffindor
                ctx.fillStyle = '#800020';
                ctx.fillRect(x + 11, y + 12, 10, 3);
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(x + 13, y + 12, 3, 3);

                // Calzado
                ctx.fillStyle = '#08070a';
                ctx.fillRect(x + 10, y + 27, 4, 4);
                ctx.fillRect(x + 18, y + 27, 4, 4);
            }
        }

        this.textures.addSpriteSheet('maria_paula', canvas, { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.scene.start('MainMenuScene');
    }
}
