import { Rectangle } from "./rectangle";
import { GameMap } from "./map";

export class GameCamera {
    AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    };
    camX: number;
    camY: number;
    xDeadZone: number;
    yDeadZone: number;
    wView: number;
    hView: number;
    axis: any;
    zoomVal: number;
    viewportRect: Rectangle;
    mapRect: Rectangle;
    followed: { position: [number, number] };

    constructor(xView: number, yView: number, canvasWidth: number, canvasHeight: number, map: GameMap) {
        // position of camera (left-top coordinate)
        this.camX = xView || 0;
        this.camY = yView || 0;
        this.zoomVal = 1.0;
        // distance from followed object to border before camera starts move
        this.xDeadZone = 0; // min distance to horizontal borders
        this.yDeadZone = 0; // min distance to vertical borders

        // viewport dimensions
        this.wView = canvasWidth;
        this.hView = canvasHeight;

        // allow camera to move in vertical and horizontal axis
        this.axis = this.AXIS.BOTH;
        // object that should be followed
        this.followed = undefined;
        // rectangle that represents the viewport
        this.viewportRect = new Rectangle(this.camX, this.camY, this.wView, this.hView);

        // rectangle that represents the world's boundary (room's boundary)
        this.mapRect = new Rectangle(0, 0, map.width, map.height);
    }

    resizeCanvas(canvasWidth: number, canvasHeight: number) {
        this.wView = canvasWidth;
        this.hView = canvasHeight;
        this.viewportRect = new Rectangle(this.camX, this.camY, this.wView, this.hView);
    }

    follow(gameObject: {position: [number, number]}, xDeadZone: number, yDeadZone: number) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    }

    zoom(zoom: number) {
        this.zoomVal *= zoom;
        this.wView = this.viewportRect.width / zoom;
        this.hView = this.viewportRect.height / zoom;
        this.camX = this.camX + (this.viewportRect.width - (this.viewportRect.width / zoom)) / 2;
        this.camY += (this.viewportRect.height - (this.viewportRect.height / zoom)) / 2;
        this.xDeadZone = this.xDeadZone / zoom;
        this.yDeadZone = this.yDeadZone / zoom;
        this.viewportRect = new Rectangle(this.camX, this.camY, this.viewportRect.width / zoom, this.viewportRect.height / zoom);
        this.ensureBoundaries();
    }

    update() {
        // keep following the player (or other desired object)
        if (this.followed != undefined) {
            if (this.axis == this.AXIS.HORIZONTAL || this.axis == this.AXIS.BOTH) {
                // moves camera on horizontal axis based on followed object position
                if (this.followed.position[0] - this.camX  + this.xDeadZone > this.wView)
                    this.camX = this.followed.position[0] - (this.wView - this.xDeadZone);
                else if (this.followed.position[0]  - this.xDeadZone < this.camX)
                    this.camX = this.followed.position[0]  - this.xDeadZone;
            }
            if (this.axis == this.AXIS.VERTICAL || this.axis == this.AXIS.BOTH) {
                // moves camera on vertical axis based on followed object position
                if (this.followed.position[1] - this.camY + this.yDeadZone > this.hView)
                    this.camY = this.followed.position[1] - (this.hView - this.yDeadZone);
                else if (this.followed.position[1] - this.yDeadZone < this.camY)
                    this.camY = this.followed.position[1] - this.yDeadZone;
            }
        }
        // update viewportRect
        this.viewportRect.set(this.camX, this.camY);
        this.ensureBoundaries();
    }

    ensureBoundaries() {
         // don't let camera leave the world's boundary
         if (!this.viewportRect.within(this.mapRect)) {
            if (this.viewportRect.left < this.mapRect.left)
                this.camX = this.mapRect.left;
            if (this.viewportRect.top < this.mapRect.top)
                this.camY = this.mapRect.top;
            if (this.viewportRect.right > this.mapRect.right)
                this.camX = this.mapRect.right - this.wView;
            if (this.viewportRect.bottom > this.mapRect.bottom)
                this.camY = this.mapRect.bottom - this.hView;
        }
    }

    findDrawX(x: number) {
        return (x - this.camX) / this.viewportRect.width;
    }

    findDrawY(y: number) {
        return (y - this.camY) / this.viewportRect.height;
    }
}