import { loadImage } from "../assets/assetLoader.js";
import { keys } from "../core/input.js";
import { debug} from "../core/config.js";
import {gameScreen} from "../core/config.js";
import {context} from "../core/config.js";

export class Player {
    constructor(x, y, width, height, ground) {
        this.images = [];

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ground = ground;

        this.dy = 0;
        this.gravity = 0.8;
        this.onGround = false;

        this.health = 3;
        this.dead = false;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.blinkCounter = 0

        this.speed = 1;
        this.loaded = false;
        this.dx = this.speed;
        this.gravity = 0.8;
        this.onGround = false;

        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameDelay = 8;
    }

    async init(imagePath, imagePath2) {
        const asset = await loadImage(imagePath);
        const asset2 = await loadImage(imagePath2);
        this.image1 = asset.image;
        this.image2 = asset2.image;

        this.images = [this.image1, this.image2];

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

        if ((keys["Space"] || keys["ArrowUp"]) && this.onGround) {
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

    draw() {
        if (!this.loaded) return;

        let scale = 1.25//sobre escalado del sprite de yolkie;
        let drawx = Math.floor(this.x * gameScreen.dpr) / gameScreen.dpr;
        let drawy = Math.floor((this.y * gameScreen.dpr) / gameScreen.dpr) - 30;
        let drawwidth = Math.floor(this.spriteWidth1 * scale);
        let drawheight = Math.floor(this.spriteHeight1 * scale);
        let image = this.images[this.currentFrame];

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