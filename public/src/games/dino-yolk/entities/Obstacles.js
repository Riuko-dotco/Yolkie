import { loadImage } from "../assets/assetLoader.js";
import {allObstacleFilter} from "../systems/obstacleSpawner.js";
import {context} from "../core/config.js";

export class Obstacle {
    /**
     * @param {string} type
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(type, x, y, width, height) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.loaded = false;
        this.height = height;
    }
    get spritey(){
        return this.y - 50;
    }

    /**
     * @param {string} imagePath
     */
    async init(imagePath) {
        const asset = await loadImage(imagePath);

        this.image = asset.image;
        this.spriteWidth = asset.width;
        this.spriteHeight = asset.height;

        this.loaded = true;
    }

    update() {
        this.x -= 5;
    }
    /** */
    draw() {
        if (!this.loaded) return

        context.drawImage(this.image, this.x-10, this.spritey, this.spriteWidth, this.spriteHeight);
    }
}
