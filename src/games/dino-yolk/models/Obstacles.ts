import { loadImage } from "../simulations/assetLoader.js";

interface obstacle {
    type: string
    x: number
    y: number
    width: number
    height: number
}

export class Obstacle implements obstacle{
    
    public loaded = false

    public image!: HTMLImageElement;
    public spriteWidth = 0;
    public spriteHeight = 0;

    constructor(
        public type : string, 
        public x : number, 
        public y : number, 
        public width : number, 
        public height : number
    )  {}

    get spritey(){
        return this.y - 50;
    }

    async init(imagePath: string) {
        const asset = await loadImage(imagePath);

        this.image = asset.image;
        this.spriteWidth = asset.width;
        this.spriteHeight = asset.height;

        this.loaded = true;
    }

    update() {
        this.x -= 5;
    }

    draw(context: CanvasRenderingContext2D) {
        if (!this.loaded) {return}

        context.drawImage(this.image, this.x-10, this.spritey, this.spriteWidth, this.spriteHeight);
    }
}
