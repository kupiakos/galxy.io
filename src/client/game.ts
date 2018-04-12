import { GameMap } from "./map";
import { GameCamera } from "./camera";
import SocketService from "./socketService";
import { GameAPI } from "../shared/chatApi";
import { Planet } from "../shared/Planet";

export class Game {
    input: any;
    canvasElement: HTMLCanvasElement;
    canvas: CanvasRenderingContext2D;
    camera: GameCamera;
    map: GameMap;
    myPlanet: Planet;

    constructor(client: SocketService<GameAPI>) {
        const canvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        canvasElement.width = document.body.clientWidth;
        canvasElement.height = document.body.clientHeight;
        const canvas = canvasElement.getContext("2d");

        // user input and events
        this.input = { destSelected: false, destX: 0, destY: 0};

        // window.addEventListener("resize", resizeCanvas, false);

        canvasElement.addEventListener("mousedown", (event) => {
            this.input.destSelected = true;
            this.input.destX = event.offsetX;
            this.input.destY = event.offsetY;
        });

        canvasElement.addEventListener("mouseup", () => { this.input.destSelected = false; });

        canvasElement.addEventListener("mousemove", (event) => {
            if (this.input.destSelected) {
                this.input.destX = event.offsetX;
                this.input.destY = event.offsetY;
            }
        });

        const zoomFactor = 1.02;

        window.addEventListener("keydown", (event) => {
            if (event.key == "w") {
            // zoom in
            this.camera.zoom(zoomFactor);
            }
            if (event.key == "e") {
            // zoom out
            this.camera.zoom(1 / zoomFactor);
            }
        });

        // Initialize some dummy game models
        this.map = new GameMap(5000, 5000);
        this.map.generate();

        this.myPlanet = new Planet();

        // Set up the camera
        this.camera = new GameCamera(0, 0, canvasElement.width, canvasElement.height, this.map);
        this.camera.follow(this.myPlanet, canvasElement.width / 2, canvasElement.height / 2);
        this.camera.zoom(.5);
    }

    startGame() {
        const FPS = 30;
        setInterval(function() {
            this.update();
            this.draw();
        }, 1000 / FPS);
    }

    // Pretty sure we need two separate update loops, one for the physics/game and another for drawing/sending updates to the server.
    // The update rate of the game physics loop should match the rate on the server.
    update() {
        // Send updates to server

        // Update client models based on prediction
        this.camera.update();
    }

    draw() {
        this.canvas.clearRect(0, 0, this.canvasElement.clientWidth, this.canvasElement.clientHeight);
        this.canvas.fillStyle = "#fff";
        this.map.draw(this.canvas, this.camera);
        // Draw players and everything else
    }

    // This doesn't quite work yet.
    // function resizeCanvas() {
    //   canvasElement.width = window.innerWidth;
    //   canvasElement.height = window.innerHeight;
    //   camera.resizeCanvas(canvasElement.width, canvasElement.height);
    // }
}