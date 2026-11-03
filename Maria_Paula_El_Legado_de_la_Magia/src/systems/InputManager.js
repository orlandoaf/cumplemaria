export class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            E: Phaser.Input.Keyboard.KeyCodes.E,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
            M: Phaser.Input.Keyboard.KeyCodes.M,
            I: Phaser.Input.Keyboard.KeyCodes.I,
            J: Phaser.Input.Keyboard.KeyCodes.J,
            ESC: Phaser.Input.Keyboard.KeyCodes.ESC
        });
    }

    getMovementVector() {
        let x = 0;
        let y = 0;

        if (this.keys.A.isDown || this.cursors.left.isDown) x -= 1;
        if (this.keys.D.isDown || this.cursors.right.isDown) x += 1;
        if (this.keys.W.isDown || this.cursors.up.isDown) y -= 1;
        if (this.keys.S.isDown || this.cursors.down.isDown) y += 1;

        const isSprinting = this.cursors.shift.isDown;

        return { x, y, isSprinting };
    }

    isJustInteracted() {
        return Phaser.Input.Keyboard.JustDown(this.keys.E);
    }
}
