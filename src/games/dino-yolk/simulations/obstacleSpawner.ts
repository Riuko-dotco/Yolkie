import type{ Ground } from "../models/Ground.js";
import { Obstacle } from "../models/Obstacles.js";
import { gameScreen } from "../core/config.js";



export const allObstacles : Obstacle[] = [];

export function setObstaclesToEmpty(){
    allObstacles.length = 0;
}

export function allObstacleFilter(){
    const filtered = allObstacles.filter(o => o.x > -o.width);
    allObstacles.length = 0;
    allObstacles.push(...filtered);
}

export function getLastObstacleX() {
    let max = -Infinity;
    allObstacles.forEach(o => {
        if (o.x > max) {max = o.x};
    });
    return max;
}

export async function spawnObstacle(ground: Ground) {
    const minGap = 250;
    const maxGap = 450;

    const index = Math.floor(Math.random() * obstacleShapes.length);
    const shape = obstacleShapes[index];
    const gap = Math.random() * (maxGap - minGap) + minGap;
    const lastX = getLastObstacleX();
    const x = lastX === -Infinity ? gameScreen.width : lastX + gap;
    const y = ground.y - shape.height;

    const obstacle = new Obstacle(shape.type, x, y, shape.width, shape.height);
    await obstacle.init(shape.skin);

    allObstacles.push(obstacle);
}

const obstacleShapes = [
    {
        type : "singleCactus",
        width: 20,
        height: 40,
        skin: "public/src/games/dino-yolk/resources/enemies/singleCactusSkin.jpg",
    },
    {
        type : "twoCactus",
        width: 40,
        height: 40,
        skin: "public/src/games/dino-yolk/resources/enemies/doubleCactusSkin.png",
    },
    {
        type : "tripleCactus",
        width: 60,
        height: 40,
        skin: "public/src/games/dino-yolk/resources/enemies/tripleCactusSkin.webp",
    }
];
