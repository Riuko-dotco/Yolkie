//Get the canvas element, context and debug mode
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

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

canvas.style.background = "rgb(255, 255, 255)";
//keyboard event listeners

let keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

class Points {
    constructor() {
        this.value = 0;
    }

    draw(context) {
        context.font = "30px Arial";
        context.fillStyle = "black";
        context.fillText("Points: " + Math.floor(this.value), 10, 50);
    }
}

let points = new Points();

//class ground
class Ground {
    constructor(y, x) {
        this.y = y;
        this.x = x;
        this.speed = -1;
        this.dx = this.speed;
    }

    draw(context) {
        context.beginPath();

        context.moveTo(this.x, this.y);
        context.lineTo(this.x + windowWidth, this.y);

        context.moveTo(this.x + windowWidth, this.y);
        context.lineTo(this.x + 2 * windowWidth, this.y);

        context.lineWidth = 5;
        context.strokeStyle = "black";
        context.stroke();
    }

    update() {
        this.x += this.dx;

        if (this.x <= -windowWidth) {
            this.x = 0;
        }

        this.draw(context);
    }
}

class Player {
    constructor(imagePath, x, y, width, height) {
        //Image loading
        this.image = new Image();
        this.image.src = imagePath;
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        }
        this.image.onerror = () => {
            console.error("Failed to load image: " + imagePath);
        }

        //Hitbox properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //Sprite
        this.spriteWidth = this.image.naturalWidth;
        this.spriteHeight = this.image.naturalHeight;
        
        //Movement properties
        this.speed = 1;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
        this.gravity = 0.8;
        this.onGround = false;
    }   
  
    draw(context) {
        let scale = 1.25;
        let drawx = Math.floor(this.x * dpr) / dpr; 
        let drawy = Math.floor(this.y * dpr) / dpr;
        let drawwidth = Math.floor(this.spriteWidth * scale);
        let drawheight = Math.floor(this.spriteHeight * scale);

        if (this.loaded) {
            context.drawImage(
                this.image, 
                drawx, 
                drawy - 30, 
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
        ground.update();
        this.draw(context);
        this.dy += this.gravity;
        this.y += this.dy;
    

        if ((keys[" "] || keys["ArrowUp"]) && this.onGround) {
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
            context.drawImage(this.image, this.x, this.spritey, this.spriteWidth, this.spriteHeight);
        } else {
            context.fillStyle = "black";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.x -= 5;
        this.draw(context);
        allObstacles = allObstacles.filter(o => o.x > -o.width);
    }
}

let allObstacles = [];
let minGap = 150;
let maxGap = 300;



function getLastObstacleX() {
    let max = -Infinity;
    allObstacles.forEach(o => {
        if (o.x > max) max = o.x;
    });
    return max;
}

function PlayerRectCollision(player, rect) {
    let pad = 5
    return (
        player.x < rect.x + rect.width - pad &&
        player.x + player.width > rect.x + pad &&
        player.y < rect.y + rect.height - pad &&
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

let ground = new Ground(600, 0);

let player = new Player("Yolkie.png" , 100, 100, 30, 50);

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
        skin: "twoCactusSkin.jpg",
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

function gameLoop() {
    context.clearRect(0, 0, windowWidth, windowHeight);
    requestAnimationFrame(gameLoop);
    points.value += 0.1;
    points.draw(context);
    player.update();


    if (points.value >= 30) {    
        if (allObstacles.length < 5) {
            spawnObstacles();
        }
        allObstacles.forEach(obstacle => {
            obstacle.update();
        });

    allObstacles.forEach(obstacle => {
        if (PlayerRectCollision(player, obstacle)) {
            alert("Game Over! Your score was: " + Math.floor(points.value));
            resetGame();
        }
    });
    
console.log(allObstacles);
    }
}

gameLoop();

