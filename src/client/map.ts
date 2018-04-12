import { GameCamera } from "./camera";

export class GameMap {
    height: number;
    width: number;
    image: HTMLImageElement;

    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;
        this.image = undefined;
    }

    generate() {
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        const squareSize = 140;
        const rows = ~~(this.width / squareSize) + 1;
        const columns = ~~(this.height / squareSize) + 1;

        let color = "white";
        ctx.save();
        ctx.fillStyle = "white";
        for (let x = 0, i = 0; i < rows; x += squareSize, i++) {
            ctx.beginPath();
            for (let y = 0, j = 0; j < columns; y += squareSize, j++) {
                const thatVar = squareSize - (squareSize / 36);
                ctx.rect (x, y, thatVar, thatVar);
            }
            color = "black";
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
        this.image = new Image();
        this.image.src = ctx.canvas.toDataURL("image/png");
    }

    draw(context: CanvasRenderingContext2D, camera: GameCamera) {

        let sourceWidth = context.canvas.width;
        let sourceHeight = context.canvas.height;
        const xView = camera.camX;
        const yView = camera.camY;
        if (this.image.width - xView < sourceWidth) {
            sourceWidth = this.image.width - xView;
        }
        if (this.image.height - yView < sourceHeight) {
            sourceHeight = this.image.height - yView;
        }

        context.drawImage(this.image, xView, yView, sourceWidth / camera.zoomVal, sourceHeight / camera.zoomVal, 0, 0, sourceWidth, sourceHeight);
    }
}