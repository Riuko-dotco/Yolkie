import type { Ground } from "./Ground.js";
import { loadImage } from "../simulations/assetLoader.js";
import { keys } from "../core/input.js";
import { debug } from "../core/config.js";
import { gameScreen} from "../core/config.js";


interface player {
    images:  HTMLImageElement[];
    x:                   number;
    y:                   number;
    width:               number;
    height:              number;
    ground:              Ground;
    dy:                  number;
    gravity:             number;
    onGround:           boolean;
    health:              number;
    dead:               boolean;
    isInvincible:       boolean;
    invincibilityTimer:  number;
    blinkCounter:        number;
    speed:               number;
    loaded:             boolean;
    currentFrame:        number;
    frameCounter:        number;
    frameDelay:          number;

}
export class Player implements player {

    public images: HTMLImageElement[] = [];
    public dy       = 0;
    public gravity  = 0.8;
    public onGround = false;
    public dead     = false;
    public isInvincible = false;
    public health   = 3; 
    
    public invincibilityTimer = 0;
    public blinkCounter = 0
    public speed = 1;
    public loaded = false;
    public currentFrame = 0;
    public frameCounter = 0;
    public frameDelay = 8;

    private spriteWidth1   = 0 
    private spriteHeight1  = 0 
    private spriteHeight2  = 0 
    private spriteWidth2  = 0 

    constructor(
        public x: number, 
        public y: number, 
        public width : number, 
        public height : number, 
        public ground : Ground
    ) {}

    async init(imagePath: string, imagePath2: string) {
        const asset = await loadImage(imagePath);
        const asset2 = await loadImage(imagePath2);

        const image1 = asset.image;
        const image2 = asset2.image;

        this.images = [image1, image2];

        this.spriteWidth1 = asset.width;
        this.spriteHeight1 = asset.height;

        this.spriteHeight2 = asset2.height;
        this.spriteWidth2 = asset2.width;

        this.loaded = true;
    }

    update() {
        if (this.onGround){
            this.frameCounter++;
            if (this.frameCounter > this.frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % this.images.length;
                this.frameCounter = 0;
            }
        }

        if(this.isInvincible) {
            this.invincibilityTimer--;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.blinkCounter = 0;
            }
        }

        if ((keys.Space || keys.ArrowUp) && this.onGround) {
            this.dy = -15;
        }

        this.dy += this.gravity;
        this.y += this.dy;

        if (this.y + this.height >= this.ground.y) {
            this.y = this.ground.y - this.height;
            this.dy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        if (!this.loaded) {return;}

        const scale = 1.25//sobre escalado del sprite de yolkie;
        const drawx = Math.floor(this.x * gameScreen.dpr) / gameScreen.dpr;
        const drawy = Math.floor((this.y * gameScreen.dpr) / gameScreen.dpr) - 30;
        const drawwidth = Math.floor(this.spriteWidth1 * scale);
        const drawheight = Math.floor(this.spriteHeight1 * scale);
        const image = this.images[this.currentFrame];

        if(this.isInvincible) {
            this.blinkCounter++;
            // Puedes cambiar el '4' por un número más alto para un parpadeo más lento
            if (Math.floor(this.blinkCounter / 4) % 2 === 0) {
                return;
            }
        } else {
            this.blinkCounter = 0; // Resetear cuando no es invencible
        }

        context.drawImage(
            image,
            drawx,
            drawy,
            drawwidth,
            drawheight);

        if(debug){
            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            context.fillStyle = "rgba(255, 0, 0, 0.32)";
            context.fill();
        }
    }
}