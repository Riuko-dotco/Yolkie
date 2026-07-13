import {gameScreen} from "../core/config.js";
import {loadImage} from "../simulations/assetLoader.js";

interface background {
    y : number
    x : number
    speed: number
    dx: number
    loaded: boolean
    SCALE:  number
    GAP: number
}
export class Background implements background{
    public speed = -1;
    public dx = this.speed;
    public loaded = false;
    public SCALE = 1.25;
    public GAP = 700

    public image1!: HTMLImageElement;
    public image2!: HTMLImageElement;
    public spriteWidth1 = 0;
    public spriteHeight1 = 0;
    public spriteHeight2 = 0;
    public spriteWidth2 = 0;

    constructor(
        public y: number, 
        public x: number
    ) {
        this.x = x;
        this.y = y;

    }

    /**
     * @param {string} imagePath
     * @param {string} imagePath2
     */
    async init(imagePath: string, imagePath2: string) {
        const asset = await loadImage(imagePath);
        const asset2 = await loadImage(imagePath2);
        this.image1 = asset.image;
        this.image2 = asset2.image;
        this.spriteWidth1 = asset.width;
        this.spriteHeight1 = asset.height;
        this.spriteHeight2 = asset2.height;
        this.spriteWidth2 = asset2.width;
        this.loaded = true;
    }

    draw(context: CanvasRenderingContext2D){
        if (!this.loaded) {return};

        const totalWidth = (this.spriteWidth1 + this.spriteWidth2) * this.SCALE + this.GAP;
        const repetitions = Math.ceil(gameScreen.width / totalWidth) + 1;
        for(let i = 0; i < repetitions; i++){
            const baseX = this.x + i * totalWidth;
            context.drawImage(
                this.image1,
                baseX,
                this.y,
                this.spriteWidth1 * this.SCALE,
                this.spriteHeight1 * this.SCALE
            );
            context.drawImage(
                this.image2,
                baseX + this.spriteWidth1 * this.SCALE + this.GAP / 2,
                this.y,
                this.spriteWidth2 * this.SCALE,
                this.spriteHeight2 * this.SCALE
            );
        }
    }

    update() {
        // totalWidth debe cubrir ambas imágenes
        const totalWidth = (this.spriteWidth1 + this.spriteWidth2) * this.SCALE + this.GAP;

        this.x += this.dx;

        if (this.x <= -totalWidth) {
            this.x = 0;
        }
    }
}