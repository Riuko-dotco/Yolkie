
//Get the canvas element, context and debug mode
let canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas no encontrado");
let context = canvas.getContext("2d");
 
let toggle = document.getElementById("themeToggle")
let ligthMode = false
let pause = false
// @ts-ignore
canvas.style.background = "rgb(20, 20, 20)"

if (toggle){
    toggle.addEventListener("click", () => {
        ligthMode = !ligthMode

        if (ligthMode) {
            // @ts-ignore
            canvas.style.background = "rgb(255, 255, 255)";
            // @ts-ignore
            toggle.textContent = "🌙";
            // @ts-ignore
            toggle.style.background = "white"
            // @ts-ignore
            toggle.style.color = "rgb(215, 196, 196)"
        }

        if(!ligthMode) {
            // @ts-ignore
            canvas.style.background = "rgb(20, 20, 20)"
            // @ts-ignore
            toggle.textContent = "☀️";
            // @ts-ignore
            toggle.style.background = "rgb(35, 34, 34)"
            // @ts-ignore
            toggle.style.color = "rgb(20, 20, 20)"
        }
    })
}
context.imageSmoothingEnabled = false;
// @ts-ignore
canvas.style.imageRendering = "pixelated";
let debug = false; 

// @ts-ignore
context.webkitImageSmoothingEnabled = false;
// @ts-ignore
context.mozImageSmoothingEnabled = false;

//const window area
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let dpr = window.devicePixelRatio || 1;
// @ts-ignore
canvas.width = windowWidth * dpr;
// @ts-ignore
canvas.height = windowHeight * dpr;

// @ts-ignore
canvas.style.width = windowWidth + "px";
// @ts-ignore
canvas.style.height = windowHeight + "px";
context.scale(dpr, dpr);


let canBeToggled = true;
//keyboard event listeners
let keys = {};
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
    }

    if (e.code === "Escape" && canBeToggled) {
        pause = !pause;
        canBeToggled = false;
    }   

    // @ts-ignore
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    // @ts-ignore
    keys[e.code] = false;

    if (e.code === "Escape") {
        canBeToggled = true;
    }
});

class Points {
    constructor() {
        this.value = 0;
    }

    // @ts-ignore
    draw(context) {
        context.font = "30px Minecraft";
        if (ligthMode){
            context.fillStyle = "black";
        } else {
            context.fillStyle = "white"
        }
        context.fillText("Points: " + Math.floor(this.value), 10, 50);
    }
}

let points = new Points();

class background {
    // @ts-ignore
    constructor(sprite1, sprite2, y, x) {
        this.sprite1 = new Image();
        this.sprite1.src = chrome.runtime.getURL(sprite1);

        this.sprite2 = new Image();
        this.sprite2.src = chrome.runtime.getURL(sprite2);

        this.loaded = false;

        this.sprite1.onload = () => {
            this.loaded = true;
            this.spriteWidth = this.sprite1.naturalWidth;
            this.spriteHeight = this.sprite1.naturalHeight; 
        }

        this.sprite2.onload = () => {
            this.loaded = true;
            this.spriteWidth = this.sprite2.naturalWidth;
            this.spriteHeight = this.sprite2.naturalHeight; 
        }

        this.x = x;
        this.y = y;
        this.speed = -1;
        this.dx = this.speed;
    }

    // @ts-ignore
    draw(context) {
        let scale = 1.25;

        let gap = 700;


        for(let i = 0; i < 3; i++){
            if (this.loaded) {
                context.drawImage(this.sprite1, 
                    this.x + i * (this.spriteWidth + gap), 
                    this.y, 
                    this.spriteWidth * scale, 
                    this.spriteHeight * scale
                );
                context.drawImage(this.sprite2, 
                    this.x + i * (this.spriteWidth + gap), 
                    this.y, 
                    this.spriteWidth * scale, 
                    this.spriteHeight * scale);
            }
        }
    }

    update() {
        this.x += this.dx;
        if (this.x <= -windowWidth) {
            this.x = 0;
        }
    }
}
//class ground
class Ground {
    // @ts-ignore
    constructor(image, y) {
        this.image = new Image();
        this.image.src = chrome.runtime.getURL(image);

        this.spritey = y - 80;
        this.y = y;
        this.x = 0;
        this.speed = -5;

        this.width = windowWidth;
        this.height = 50; // ajusta a tu gusto

        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
            this.spriteWidth = this.image.naturalWidth;
            this.spriteHeight = this.image.naturalHeight; 

        }
    }

    // @ts-ignore
    draw(context) {
        if (!this.loaded) return;

        // repetir el piso varias veces
        for (let i = 0; i < 8; i++) {
            context.drawImage(
                this.image,
                this.x + i * this.spriteWidth,
                this.spritey,
                this.spriteWidth,
                this.spriteHeight 
            );
        }

        if (debug) {
            context.beginPath();
            context.rect(this.x, this.y, this.width * 3, this.height);
            context.fillStyle = "rgba(255, 0, 0, 0.12)";
            context.fill();
        }
    }

    update() {
        this.x += this.speed;

        if (this.x <= -this.spriteWidth) {
            this.x += this.spriteWidth;
        }
    }
}

class Player {
    // @ts-ignore
    constructor(image1, image2, x, y, width, height) {
        //Image loading
        this.images = [
            new Image(),
            new Image()
        ];
        this.images[0].src = chrome.runtime.getURL(image1);
        this.images[1].src = chrome.runtime.getURL(image2);
        
        this.loaded = false;
        this.images[0].onload = () => {
            this.loaded = true;
            this.spriteWidth = this.images[0].naturalWidth;
            this.spriteHeight = this.images[0].naturalHeight; 

        }
        this.images[1].onload = () => {
            this.loaded = true;
            this.spriteWidth = this.images[1].naturalWidth;
            this.spriteHeight = this.images[1].naturalHeight; 

        }
        this.images[0].onerror = () => {
            console.error("Failed to load image: " + image1);
        }
        this.images[1].onerror = () => {
            console.error("Failed to load image: " + image2);
        }

        //Hitbox properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = 3;
        this.dead = false;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.blinkCounter = 0;

        //Sprite
        this.spriteWidth = this.images[0].naturalWidth;
        this.spriteHeight = this.images[0].naturalHeight;
        
        //Movement properties
        this.speed = 1;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
        this.gravity = 0.8;
        this.onGround = false;

        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameDelay = 6; 
    }   
  
    // @ts-ignore
    draw(context) {
        let scale = 1.25//sobre escalado del sprite de yolkie;
        let drawx = Math.floor(this.x * dpr) / dpr; 
        let drawy = Math.floor(this.y * dpr) / dpr;
        let drawwidth = Math.floor(this.spriteWidth * scale);
        let drawheight = Math.floor(this.spriteHeight * scale);
        let image = this.images[this.currentFrame];

        if (this.loaded) {
             if (this.isInvincible) {
                this.blinkCounter++;
                // Si el contador es par, no dibujamos (crea el efecto de parpadeo)
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
                drawy - 20, 
                drawwidth, 
                drawheight);
        }

      
        if (debug) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "rgba(255, 0, 0, 0.32)";
        context.fill();
        } 
    }

    update() {
        if (this.onGround) {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % this.images.length;
                this.frameCounter = 0;
            }
        }
        if (this.isInvincible) {
            this.invincibilityTimer--;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.blinkCounter = 0;
            }
        }

        this.dy += this.gravity;
        this.y += this.dy;
    

        // @ts-ignore
        if ((keys["Space"] || keys["ArrowUp"]) && this.onGround) {
            this.dy += -15;
            this.y += this.dy;
        }

        if (this.y + this.height >= ground.y) {
            this.y = ground.y - this.height ; 
            this.dy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }
}

class Obstacle {
    // @ts-ignore
    constructor(type, x, y, width, height, imagePath) { 
        this.image = new Image();
        this.image.src = chrome.runtime.getURL(imagePath);
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
            this.spriteWidth = this.image.naturalWidth;
            this.spriteHeight = this.image.naturalHeight; 

        }
        this.image.onerror = () => {
            console.error("Failed to load image: " + imagePath);
        }

        this.spriteWidth = this.image.naturalWidth;
        this.spriteHeight = this.image.naturalHeight;
        this.spritey = y - 50;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // @ts-ignore
    draw(context) {
        if (this.loaded) {
            context.drawImage(this.image, this.x - 10, this.spritey, this.spriteWidth, this.spriteHeight);
        } if (!this.loaded || debug) {
            context.fillStyle = "rgba(255, 0, 0, 0.12)";
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    update() {
        this.x -= 5;
        // @ts-ignore
        allObstacles = allObstacles.filter(o => o.x > -o.width);
    }
}

/** @type {Obstacle[]} */
let allObstacles = [];
let minGap = 250;
let maxGap = 450;



function getLastObstacleX() {
    let max = -Infinity;
    // @ts-ignore
    allObstacles.forEach(o => {
        if (o.x > max) max = o.x;
    });
    return max;
}

// @ts-ignore
function PlayerRectCollision(player, rect) {
    let pad = 2
    return (
        player.x < rect.x + rect.width - pad&&
        player.x + player.width > rect.x + pad &&
        player.y < rect.y + (rect.height - pad) &&
        player.y + player.height > rect.y + pad
    )
} 

function resetGame() {
    player.health = 3;
    player.dead = false;
    pause = false;
    points.value = 0;
    allObstacles = [];
    spawnObstacles();
}

function pauseGame() {
    allObstacles = [];
}
let Background = new background("canvas/resources/Cloud1.png", "canvas/resources/Cloud2.png", 100, 100);

let ground = new Ground("canvas/resources/Ground.gif", 0.75 * windowHeight);

let player = new Player("canvas/resources/Yolkie1.png", "canvas/resources/Yolkie2.png" , 100, 100, 30, 50);

let obstacleShapes = [
    {
        type : "singleCactus",
        width: 20,
        height: 40,
        skin: "canvas/resources/singleCactusSkin.jpg",
    },
    {
        type : "twoCactus",
        width: 40,
        height: 40,
        skin: "canvas/resources/doubleCactusSkin.png",
    },
    {
        type : "tripleCactus",
        width: 60,
        height: 40,
        skin: "canvas/resources/tripleCactusSkin.webp",
    }
];

function spawnObstacles() {
    let index = Math.floor(Math.random() * obstacleShapes.length);
    let shape = obstacleShapes[index];

    let gap = Math.random() * (maxGap - minGap) + minGap;
    let lastX = getLastObstacleX();

    let x = lastX === -Infinity ? windowWidth : lastX + gap;
    let y = ground.y - shape.height;

    allObstacles.push(
        new Obstacle(shape.type, x, y, shape.width, shape.height, shape.skin)
    );
}

// @ts-ignore
canvas.addEventListener("click", () => {
    if (player.onGround && !pause) {
        player.dy = -15;
    }
});


function gameLoop() {
    // @ts-ignore
    let coins = 0
    context.clearRect(0, 0, windowWidth, windowHeight);
    requestAnimationFrame(gameLoop);

// 🔹 SOLO lógica
    if (!pause){
        points.value += 0.1;

        player.update();
        ground.update();
        Background.update();   

        if (points.value >= 30) {    
            if (allObstacles.length < 5) {
                spawnObstacles();
            }
        
            // @ts-ignore
            allObstacles.forEach(obstacle => {
                obstacle.update();

                if (PlayerRectCollision(player, obstacle) && !player.isInvincible) {
                    player.health -= 1;
                    player.isInvincible = true;
                    player.invincibilityTimer = 60;
                        if (player.health <= 0) {
                            player.dead = true;
                            pause = true;
                    } 
                }
            });
        }
    }

    Background.draw(context);
    ground.draw(context);
    player.draw(context);
    // @ts-ignore
    allObstacles.forEach(o => o.draw(context));
    points.draw(context);

    if (pause && !player.dead) {
        // @ts-ignore
        context.fillStyle = "rgba(0,0,0,0.4)";
        // @ts-ignore
        context.fillRect(0, 0, windowWidth, windowHeight);

        // @ts-ignore
        context.fillStyle = "white";
        // @ts-ignore
        context.font = "40px Minecraft";
        // @ts-ignore
        context.fillText("PAUSED", windowWidth / 2 - 80, windowHeight / 2);
    }

    if (pause && player.dead){
          // @ts-ignore
        context.fillStyle = "rgba(0,0,0,0.4)";
        // @ts-ignore
        context.fillRect(0, 0, windowWidth, windowHeight);

        // @ts-ignore
        context.fillStyle = "white";
        // @ts-ignore
        context.font = "40px Minecraft";
        // @ts-ignore
        context.fillText("YOU HAVE DIED", windowWidth / 2 - 80, windowHeight / 2);
        context.fillText("R to retry", windowWidth / 2 - 60, ((windowHeight / 2)+100));

        if (player.dead && keys["KeyR"]) {
            resetGame();
        }
    }
}

gameLoop();
