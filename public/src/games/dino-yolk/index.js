import { gameScreen} from "./core/config.js";
import { setupInput } from "./core/input.js";
import { setupThemeToggle } from "./systems/themeSystem.js";
import startGameLoop, {isSpawning, setIsSpawning} from "./core/gameLoop.js";

import {allObstacles, spawnObstacle} from "./systems/obstacleSpawner.js";
import { Background } from "./entities/background.js";
import { Ground } from "./entities/Ground.js";
import { Player } from "./entities/Player.js";
import { Points } from "./entities/Points.js";
import { applyCanvasSize } from "./core/config.js";

setupInput();
setupThemeToggle();


const background = new Background(100, 0);
await background.init("public/src/games/dino-yolk/resources/background/Cloud1.png", "public/src/games/dino-yolk/resources/background/Cloud2.png")

const ground = new Ground(0.75 * gameScreen.height);
await ground.init("public/src/games/dino-yolk/resources/foreground/ground.gif",)

applyCanvasSize(); //aplicar al inicio


const player = new Player(
    100,
    100,
    30,
    50,
    ground
);
await player.init(
    "public/src/games/dino-yolk/resources/yolkie/Yolkie1.png", "public/src/games/dino-yolk/resources/yolkie/Yolkie2.png"
)

const points = new Points();

startGameLoop({player,
    ground,
    background,
    points,
    obstacles: allObstacles})

let resizeTimeout;
window.addEventListener("resize", () => {
    const oldWidth = gameScreen.width;
    const oldHeight = gameScreen.height;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        applyCanvasSize();
        const scaleX = gameScreen.width / oldWidth;

        ground.y = 0.75 * gameScreen.height;

        // allObstacles directo — siempre tiene los obstáculos actuales
        allObstacles.forEach(o => {
            o.x *= scaleX;
            o.y = ground.y - o.height;
        });

        //si el resize deja el array vacío, respawnear
        if (allObstacles.length === 0 && !isSpawning){
            setIsSpawning(true);
            spawnObstacle(ground).finally(() => {setIsSpawning(false)});
        }

        player.ground = ground;
        if (player.onGround) {
            player.y = ground.y - player.height;
        } else {
            player.y *= gameScreen.height / oldHeight;
        }
    }, 100);
});