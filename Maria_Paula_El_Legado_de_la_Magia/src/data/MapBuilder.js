export class MapBuilder {
    static buildChapterMap(scene, width, height, theme) {
        const graphics = scene.add.graphics();
        const obstacleGroup = scene.physics.add.staticGroup();

        if (theme === 'station') {
            graphics.fillStyle(0x1d1a29, 1);
            graphics.fillRect(0, 0, width, height);

            graphics.fillStyle(0x282438, 1);
            for (let x = 0; x < width; x += 32) {
                for (let y = 80; y < height - 60; y += 32) {
                    if ((x + y) % 64 === 0) {
                        graphics.fillRect(x, y, 30, 30);
                    }
                }
            }
            graphics.fillStyle(0x110f1a, 1);
            graphics.fillRect(0, 0, width, 80);
            graphics.fillStyle(0x715a3e, 1);
            graphics.fillRect(0, 76, width, 8);
            graphics.fillStyle(0x0a0910, 1);
            graphics.fillRect(0, height - 60, width, 60);

        } else if (theme === 'forest') {
            graphics.fillStyle(0x142b1a, 1);
            graphics.fillRect(0, 0, width, height);

            graphics.fillStyle(0x1e3e26, 1);
            for (let x = 0; x < width; x += 40) {
                for (let y = 0; y < height; y += 40) {
                    if ((x * y) % 3 === 0) graphics.fillRect(x, y, 16, 16);
                }
            }

            graphics.fillStyle(0x2e1f14, 1);
            graphics.fillRect(0, height / 2 - 45, width, 90);
            graphics.fillStyle(0x3d2b1d, 1);
            graphics.fillRect(0, height / 2 - 35, width, 70);

        } else if (theme === 'castle') {
            graphics.fillStyle(0x242230, 1);
            graphics.fillRect(0, 0, width, height);

            graphics.fillStyle(0x2f2c3d, 1);
            for (let x = 0; x < width; x += 64) {
                for (let y = 0; y < height; y += 64) {
                    graphics.fillRect(x + 4, y + 4, 56, 56);
                }
            }

            graphics.fillStyle(0x15141e, 1);
            for (let x = 100; x < width; x += 300) {
                graphics.fillRect(x, 0, 40, height);
            }

        } else if (theme === 'library') {
            graphics.fillStyle(0x2b180d, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x382012, 1);
            for (let x = 0; x < width; x += 32) {
                for (let y = 0; y < height; y += 16) {
                    if ((x + y) % 32 === 0) graphics.fillRect(x, y, 28, 12);
                }
            }

        } else if (theme === 'potions') {
            graphics.fillStyle(0x0f1712, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x16241c, 1);
            for (let x = 0; x < width; x += 48) {
                for (let y = 0; y < height; y += 48) {
                    graphics.fillRect(x + 2, y + 2, 44, 44);
                }
            }

        } else if (theme === 'great_hall') {
            graphics.fillStyle(0x1c1512, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x5e0a14, 1);
            graphics.fillRect(120, 0, width - 240, height);
            graphics.fillStyle(0xc99a2e, 1);
            graphics.fillRect(116, 0, 4, height);
            graphics.fillRect(width - 120, 0, 4, height);

        } else if (theme === 'gryffindor') {
            graphics.fillStyle(0x3b0d13, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.fillStyle(0x6e121c, 1);
            graphics.fillRect(60, 60, width - 120, height - 120);
            graphics.fillStyle(0xd4a331, 1);
            graphics.fillRect(56, 56, width - 112, 4);
            graphics.fillRect(56, height - 60, width - 112, 4);
        }

        scene.physics.world.setBounds(0, 0, width, height);

        return obstacleGroup;
    }
}
