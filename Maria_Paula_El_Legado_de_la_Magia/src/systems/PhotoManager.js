export class PhotoManager {
    constructor(scene) {
        this.scene = scene;
    }

    takeGroupPhoto() {
        this.scene.game.events.once('postrender', () => {
            const canvas = this.scene.game.canvas;
            const imageData = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.href = imageData;
            downloadLink.download = `Fotografia_Grupo_Maria_Paula_Hogwarts.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
}
