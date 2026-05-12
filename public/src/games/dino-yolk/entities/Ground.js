import { loadImage } from "../assets/assetLoader.js";
import {    gameScreen  } from "../core/config.js";
import {debug} from "../core/config.js";
import {context} from "../core/config.js";

export class Ground {
    constructor(y) {
        this.y = y;
        this.x = 0;
        this.speed = -5;
        this.height = 50;
        this.loaded = true;
    }
    get spritey(){
        return this.y - 80
    }
    get width(){
        return gameScreen.width;
    }
    async init(imagePath){
        const asset = await loadImage(imagePath);

        this.image = asset.image;
        this.spriteWidth = asset.width;
        this.spriteHeight = asset.height;
    }

    update() {
        this.x += this.speed;

        if (this.x <= -this.spriteWidth) {
            this.x += this.spriteWidth;
        }
    }

    draw() {
        if (!this.loaded) return;
        const repetitions = Math.ceil(gameScreen.width / this.spriteWidth) + 2;
        for (let i = 0; i < repetitions; i++) {
            context.drawImage(
                this.image,
                this.x + i * this.spriteWidth,
                this.spritey,
                this.spriteWidth,
                this.spriteHeight);
            if (debug){
                context.beginPath();
                context.rect(this.x, this.y, this.width*3, this.height);
                context.fillStyle = "rgba(255, 0, 0, 0.12)";
                context.fill();
            }
        }

    }
}