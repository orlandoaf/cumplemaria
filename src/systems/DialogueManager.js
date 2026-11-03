export class DialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.currentDialogues = [];
        this.currentIndex = 0;
        this.isActive = false;
        this.createUI();
    }

    createUI() {
        this.container = this.scene.add.container(0, 410).setScrollFactor(0).setDepth(1000).setVisible(false);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0f0b14, 0.96);
        bg.fillRoundedRect(30, 0, 740, 160, 12);
        bg.lineStyle(3, 0xd4af37, 1);
        bg.strokeRoundedRect(30, 0, 740, 160, 12);
        this.container.add(bg);

        this.speakerText = this.scene.add.text(50, 15, '', {
            font: 'bold 20px Georgia',
            fill: '#ffd700'
        });
        this.container.add(this.speakerText);

        this.bodyText = this.scene.add.text(50, 50, '', {
            font: '16px Georgia',
            fill: '#f4e8c1',
            wordWrap: { width: 700 }
        });
        this.container.add(this.bodyText);

        const promptText = this.scene.add.text(750, 130, '[ESPACIO]', {
            font: '12px Georgia',
            fill: '#aaaaaa'
        }).setOrigin(1, 0);
        this.container.add(promptText);
    }

    startDialogue(dialogueArray, onComplete = null) {
        this.currentDialogues = dialogueArray;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.isActive = true;
        this.container.setVisible(true);
        this.showCurrentMessage();
    }

    showCurrentMessage() {
        const msg = this.currentDialogues[this.currentIndex];
        if (msg) {
            this.speakerText.setText(msg.speaker);
            this.bodyText.setText(msg.text);
        } else {
            this.closeDialogue();
        }
    }

    advance() {
        if (!this.isActive) return;
        this.currentIndex++;
        if (this.currentIndex < this.currentDialogues.length) {
            this.showCurrentMessage();
        } else {
            this.closeDialogue();
        }
    }

    closeDialogue() {
        this.isActive = false;
        this.container.setVisible(false);
        if (this.onComplete) this.onComplete();
    }
}
