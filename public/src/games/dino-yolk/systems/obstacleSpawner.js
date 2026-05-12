import { Obstacle } from "../entities/Obstacles.js";
import { gameScreen } from "../core/config.js";


/**
 * @type {any[]}
 */
export let allObstacles = [];

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
        if (o.x > max) max = o.x;
    });
    return max;
}

/**
 * @param {{ y: number; }} [ground]
 */
export async function spawnObstacle(ground) {
    const minGap = 250;
    const maxGap = 450;

    let index = Math.floor(Math.random() * obstacleShapes.length);
    let shape = obstacleShapes[index];

    let gap = Math.random() * (maxGap - minGap) + minGap;
    let lastX = getLastObstacleX();

    let x = lastX === -Infinity ? gameScreen.width : lastX + gap;
    let y = ground.y - shape.height;

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
