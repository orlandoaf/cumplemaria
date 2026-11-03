export class MapBuilder {
    static buildChapterMap(scene, width, height, theme) {
        const graphics = scene.add.graphics();
        const obstacleGroup = scene.physics.add.staticGroup();

        if (theme === 'station') {
            // Suelo de adoquines de granito con sombras profundas
            graphics.fillStyle(0x191724, 1);
            graphics.fillRect(0, 0, width, height);

            graphics.fillStyle(0x232033, 1);
            for (let x = 0; x < width; x += 32) {
                for (let y = 80; y < height - 60; y += 32) {
                    if ((x + y) % 64 === 0) {
                        graphics.fillRect(x + 2, y + 2, 28, 28);
                    }
                }
            }
            // Bordes y vía del tren con metal bruñido y madera
            graphics.fillStyle(0x0e0c14, 1);
            graphics.fillRect(0, 0, width, 80);
            graphics.fillStyle(0x5c4228, 1);
            graphics.fillRect(0, 76, width, 8);
            graphics.fillStyle(0x08070d, 1);
            graphics.fillRect(0, height - 60, width, 60);

        } else if (theme === 'forest') {
            // Hierba nocturna rica en degradados
            graphics.fillStyle(0x0f2414, 1);
            graphics.fillRect(0, 0, width, height);

            graphics.fillStyle(0x183820, 1);
            for (let x = 0; x < width; x += 32) {
                for (let y = 0; y < height; y += 32) {
                    if ((x * y) % 5 === 0) graphics.fillRect(x, y, 14, 14);
                }
            }

            // Sendero empedrado de tierra húmeda y grava
            graphics.fillStyle(0x2b1c12, 1);
            graphics.fillRect(0, height / 2 - 45, width, 90);
            graphics.fillStyle(0x382619, 1);
            graphics.fillRect(0, height / 2 - 35, width, 70);

        } else if (theme === 'castle') {
            // Paredes y baldosas góticas del castillo de Hogwarts
            graphics.fillStyle(0x1d1b26, 1);
            graphics.fillRect(0, 0, width, height);

            graphics.fillStyle(0x272433, 1);
            for (let x = 0; x < width; x += 64) {
                for (let y = 0; y < height; y += 64) {
                    graphics.fillRect(x + 4, y + 4, 56, 56);
                }
            }

            graphics.fillStyle(0x111017, 1);
            for (let x = 120; x < width; x += 280) {
                graphics.fillRect(x, 0, 45, height);
            }

        } else if (theme === 'library') {
            // Parquet de caoba pulida con patrón de espiga
            graphics.fillStyle(0x24130a, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x301b0f, 1);
            for (let x = 0; x < width; x += 32) {
                for (let y = 0; y < height; y += 16) {
                    if ((x + y) % 32 === 0) graphics.fillRect(x, y, 28, 12);
                }
            }

        } else if (theme === 'potions') {
            // Mazmorra de piedra oscura con musgo verde bioluminiscente
            graphics.fillStyle(0x0b120e, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x121e17, 1);
            for (let x = 0; x < width; x += 48) {
                for (let y = 0; y < height; y += 48) {
                    graphics.fillRect(x + 2, y + 2, 44, 44);
                }
            }

        } else if (theme === 'great_hall') {
            // Gran Comedor con alfombra ceremonial bordada de Gryffindor
            graphics.fillStyle(0x17110e, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x520811, 1);
            graphics.fillRect(120, 0, width - 240, height);
            graphics.fillStyle(0xbd8f28, 1);
            graphics.fillRect(116, 0, 4, height);
            graphics.fillRect(width - 120, 0, 4, height);

        } else if (theme === 'gryffindor') {
            // Sala Común acogedora con alfombra granate y bordes dorados
            graphics.fillStyle(0x2e0a0e, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x5e0f17, 1);
            graphics.fillRect(60, 60, width - 120, height - 120);
            graphics.fillStyle(0xc29329, 1);
            graphics.fillRect(56, 56, width - 112, 4);
            graphics.fillRect(56, height - 60, width - 112, 4);
        }

        scene.physics.world.setBounds(0, 0, width, height);
        return obstacleGroup;
    }
}
