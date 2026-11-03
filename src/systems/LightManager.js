export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.scene.lights.enable();
    }

    setAmbientColor(colorHex, vignetteAlpha = 0.5) {
        this.scene.lights.setAmbientColor(colorHex);

        if (!this.vignetteGraphics) {
            this.vignetteGraphics = this.scene.add.graphics().setScrollFactor(0).setDepth(999);
            const width = this.scene.cameras.main.width;
            const height = this.scene.cameras.main.height;

            // Degradado de viñeta suave para dar estética realista cinematográfica
            this.vignetteGraphics.fillStyle(0x000000, vignetteAlpha);
            this.vignetteGraphics.fillRect(0, 0, width, 20);
            this.vignetteGraphics.fillRect(0, height - 20, width, 20);
            this.vignetteGraphics.fillRect(0, 0, 20, height);
            this.vignetteGraphics.fillRect(width - 20, 0, 20, height);
        }
    }

    addFlickeringLight(x, y, radius, color, intensity) {
        const light = this.scene.lights.addLight(x, y, radius, color, intensity);

        this.scene.tweens.add({
            targets: light,
            intensity: { value: intensity * 0.7, duration: 120 + Math.random() * 180 },
            radius: { value: radius * 0.9, duration: 200 + Math.random() * 250 },
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return light;
    }

    createAmbientParticles(x, y, textureKey, config = {}) {
        const particles = this.scene.add.particles(x, y, textureKey, {
            speed: config.speed || { min: 10, max: 35 },
            scale: config.scale || { start: 0.4, end: 0 },
            alpha: config.alpha || { start: 0.8, end: 0 },
            lifespan: config.lifespan || 2500,
            blendMode: 'ADD',
            frequency: config.frequency || 100
        });

        return particles;
    }
}
