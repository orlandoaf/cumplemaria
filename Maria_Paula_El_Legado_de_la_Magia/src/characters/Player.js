export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'maria_paula');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(16, 12);
        this.body.setOffset(8, 20);
        this.setCollideWorldBounds(true);

        this.baseSpeed = 125;
        this.runMultiplier = 1.65;
        this.lastDirection = 'down';

        this.createAnimations();
    }

    createAnimations() {
        if (!this.scene.anims.exists('walk-down')) {
            this.scene.anims.create({
                key: 'walk-down',
                frames: this.scene.anims.generateFrameNumbers('maria_paula', { start: 0, end: 3 }),
                frameRate: 9,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'walk-left',
                frames: this.scene.anims.generateFrameNumbers('maria_paula', { start: 4, end: 7 }),
                frameRate: 9,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'walk-right',
                frames: this.scene.anims.generateFrameNumbers('maria_paula', { start: 8, end: 11 }),
                frameRate: 9,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'walk-up',
                frames: this.scene.anims.generateFrameNumbers('maria_paula', { start: 12, end: 15 }),
                frameRate: 9,
                repeat: -1
            });
        }
    }

    update(inputManager) {
        const { x, y, isSprinting } = inputManager.getMovementVector();
        const speed = isSprinting ? this.baseSpeed * this.runMultiplier : this.baseSpeed;

        this.body.setVelocityX(x * speed);
        this.body.setVelocityY(y * speed);
        this.body.velocity.normalize().scale(speed);

        if (x < 0) {
            this.anims.play('walk-left', true);
            this.lastDirection = 'left';
        } else if (x > 0) {
            this.anims.play('walk-right', true);
            this.lastDirection = 'right';
        } else if (y < 0) {
            this.anims.play('walk-up', true);
            this.lastDirection = 'up';
        } else if (y > 0) {
            this.anims.play('walk-down', true);
            this.lastDirection = 'down';
        } else {
            this.anims.stop();
            if (this.lastDirection === 'down') this.setFrame(0);
            if (this.lastDirection === 'left') this.setFrame(4);
            if (this.lastDirection === 'right') this.setFrame(8);
            if (this.lastDirection === 'up') this.setFrame(12);
        }
    }
}
