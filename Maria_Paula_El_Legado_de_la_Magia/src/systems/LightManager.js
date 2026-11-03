export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.scene.lights.enable();
    }

    setAmbientColor(colorHex, vignetteAlpha = 0.4) {
        this.scene.lights.setAmbientColor(colorHex);

        if (!this.vignetteGraphics) {
            this.vignetteGraphics = this.scene.add.graphics().setScrollFactor(0).setDepth(999);
            const width = this.scene.cameras.main.width;
            const height = this.scene.cameras.main.height;

            this.vignetteGraphics.fillStyle(0x000000, vignetteAlpha);
            this.vignetteGraphics.fillRect(0, 0, width, 15);
            this.vignetteGraphics.fillRect(0, height - 15, width, 15);
            this.vignetteGraphics.fillRect(0, 0, 15, height);
            this.vignetteGraphics.fillRect(width - 15, 0, 15, height);
        }
    }

    addFlickeringLight(x, y, radius, color, intensity) {
        const light = this.scene.lights.addLight(x, y, radius, color, intensity);

        this.scene.tweens.add({
            targets: light,
            intensity: { value: intensity * 0.75, duration: 150 + Math.random() * 200 },
            radius: { value: radius * 0.92, duration: 250 + Math.random() * 300 },
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return light;
    }

    createAmbientParticles(x, y, textureKey, config = {}) {
        const particles = this.scene.add.particles(x, y, textureKey, {
            speed: config.speed || { min: 8, max: 25 },
            scale: config.scale || { start: 0.3, end: 0 },
            alpha: config.alpha || { start: 0.7, end: 0 },
            lifespan: config.lifespan || 2500,
            blendMode: 'ADD',
            frequency: config.frequency || 120
        });

        return particles;
    }
}
