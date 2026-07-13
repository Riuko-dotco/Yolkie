import { loadImage } from "../simulations/assetLoader.js";
import { gameScreen  } from "../core/config.js";
import {debug} from "../core/config.js";


interface ground {
    y:      number;
    x:      number;
    speed:  number;
    height: number;
    loaded: boolean;
}
export class Ground implements ground {
    public x = 0;
    public speed = -5;
    public height = 50;
    public loaded = true;
    public image!: HTMLImageElement;
    public spriteWidth =  0;
    public spriteHeight = 0;

    constructor(
        public y: number
    ) {}

    get spritey(){
        return this.y - 80
    }
    get width(){
        return gameScreen.width;
    }

    async init(imagePath: string){
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

    draw(context: CanvasRenderingContext2D) {
        if (!this.loaded) {return};
        const repetitions = Math.ceil(gameScreen.width / this.spriteWidth) + 2;
        for (let i = 0; i < repetitions; i++) {
            context.drawImage(
                this.image,
                this.x + i * this.spriteWidth,
                this.spritey,
                this.spriteWidth,
                this.spriteHeight
            );

            if (debug){
                context.beginPath();
                context.rect(this.x, this.y, this.width*3, this.height);
                context.fillStyle = "rgba(255, 0, 0, 0.12)";
                context.fill();
            }
        }

    }
}