//Get the canvas element, context and debug mode
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let toggle = document.getElementById("themeToggle")
let ligthMode = false
let pause = false


canvas.style.background = "rgb(20, 20, 20)"

toggle.addEventListener("click", () => {
    ligthMode = !ligthMode

    if (ligthMode) {
        canvas.style.background = "rgb(255, 255, 255)";
        toggle.textContent = "🌙";
        toggle.style.background = "white"
        toggle.style.color = "rgb(215, 196, 196)"
    }

    if(!ligthMode) {
        canvas.style.background = "rgb(20, 20, 20)"
        toggle.textContent = "☀️";
        toggle.style.background = "rgb(35, 34, 34)"
        toggle.style.color = "rgb(20, 20, 20)"
    }
})
context.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";
let debug = false; 

context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;

//const window area
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let dpr = window.devicePixelRatio || 1;
canvas.width = windowWidth * dpr;
canvas.height = windowHeight * dpr;

canvas.style.width = windowWidth + "px";
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

    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;

    if (e.code === "Escape") {
        canBeToggled = true;
    }
});

class Points {
    constructor() {
        this.value = 0;
    }

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
    constructor(sprite1, sprite2, y, x) {
        this.sprite1 = new Image();
        this.sprite1.src = sprite1;

        this.sprite2 = new Image();
        this.sprite2.src = sprite2;

        this.spriteWidth = this.sprite1.naturalWidth;
        this.spriteHeight = this.sprite1.naturalHeight; 

        this.loaded = false;

        this.sprite1.onload = () => {
            this.loaded = true;
        }

        this.sprite2.onload = () => {
            this.loaded = true;
        }

        this.x = x;
        this.y = y;
        this.speed = -1;
        this.dx = this.speed;
    }

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
    constructor(image, y) {
        this.image = new Image();
        this.image.src = image;

        this.spriteWidth = this.image.naturalWidth;
        this.spriteHeight = this.image.naturalHeight;   

        this.spritey = y - 80;
        this.y = y;
        this.x = 0;
        this.speed = -5;

        this.width = windowWidth;
        this.height = 50; // ajusta a tu gusto

        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        }
    }

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
    constructor(image1, image2, x, y, width, height) {
        //Image loading
        this.images = [
            new Image(),
            new Image()
        ];
        this.images[0].src = image1;
        this.images[1].src = image2;
        
        this.loaded = false;
        this.images[0].onload = () => {
            this.loaded = true;
        }
        this.images[1].onload = () => {
            this.loaded = true;
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
        this.frameDelay = 10; 
    }   
  
    draw(context) {
        let scale = 1;
        let drawx = Math.floor(this.x * dpr) / dpr; 
        let drawy = Math.floor(this.y * dpr) / dpr;
        let drawwidth = Math.floor(this.spriteWidth * scale);
        let drawheight = Math.floor(this.spriteHeight * scale);
        let image = this.images[this.currentFrame];

        if (this.loaded) {
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
        this.dy += this.gravity;
        this.y += this.dy;
    

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
    constructor(type, x, y, width, height, imagePath) { 
        this.image = new Image();
        this.image.src = imagePath;
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
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
        allObstacles = allObstacles.filter(o => o.x > -o.width);
    }
}

let allObstacles = [];
let minGap = 250;
let maxGap = 450;



function getLastObstacleX() {
    let max = -Infinity;
    allObstacles.forEach(o => {
        if (o.x > max) max = o.x;
    });
    return max;
}

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
    points.value = 0;
    allObstacles = [];
    spawnObstacles();
}

function pauseGame() {
    allObstacles = [];
}
let Background = new background("Cloud1.png", "Cloud2.png", 100, 100);

let ground = new Ground("Ground.gif", 0.75 * windowHeight);

let player = new Player("Yolkie1.png", "Yolkie2.png" , 100, 100, 30, 50);

let obstacleShapes = [
    {
        type : "singleCactus",
        width: 20,
        height: 40,
        skin: "singleCactusSkin.jpg",
    },
    {
        type : "twoCactus",
        width: 40,
        height: 40,
        skin: "doubleCactusSkin.png",
    },
    {
        type : "tripleCactus",
        width: 60,
        height: 40,
        skin: "tripleCactusSkin.webp",
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

canvas.addEventListener("click", () => {
    if (player.onGround && !pause) {
        player.dy = -15;
    }
});
function gameLoop() {
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

            allObstacles.forEach(obstacle => {
                obstacle.update();

                if (PlayerRectCollision(player, obstacle)) {
                    alert("Game Over! Your score was: " + Math.floor(points.value));
                    resetGame();
                }
            });
        }
    }

    // 🔹 SIEMPRE dibujar
    Background.draw(context);
    ground.draw(context);
    player.draw(context);
    allObstacles.forEach(o => o.draw(context));
    points.draw(context);

    // 🔹 overlay de pausa
    if (pause) {
        context.fillStyle = "rgba(0,0,0,0.4)";
        context.fillRect(0, 0, windowWidth, windowHeight);

        context.fillStyle = "white";
        context.font = "40px Minecraft";
        context.fillText("PAUSED", windowWidth / 2 - 80, windowHeight / 2);
    }
}

gameLoop();

