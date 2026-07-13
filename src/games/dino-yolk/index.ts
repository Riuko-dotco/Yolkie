import { gameScreen} from "./core/config.js";
import { setupInput } from "./core/input.js";
import { setupThemeToggle } from "./simulations/themeSystem.js";
import startGameLoop, {isSpawning, setIsSpawning} from "./core/gameLoop.js";

import {allObstacles, spawnObstacle} from "./simulations/obstacleSpawner.js";
import { Background } from "./models/background.js";
import { Ground } from "./models/Ground.js";
import { Player } from "./models/Player.js";
import { Points } from "./models/Points.js";
import { applyCanvasSize } from "./core/config.js";

setupInput();
setupThemeToggle();


const background = new Background(100, 0);
await background.init("src/games/dino-yolk/resources/background/Cloud1.png", "src/games/dino-yolk/resources/background/Cloud2.png")

const ground = new Ground(0.75 * gameScreen.height);
await ground.init("src/games/dino-yolk/resources/foreground/ground.gif",)

applyCanvasSize(); //aplicar al inicio


const player = new Player(
    100,
    100,
    30,
    50,
    ground
);

await player.init(
    "src/games/dino-yolk/resources/yolkie/Yolkie1.png", "src/games/dino-yolk/resources/yolkie/Yolkie2.png"
)

const points = new Points();

startGameLoop(player, ground, background, points, allObstacles)

let resizeTimeout: number;

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
            void spawnObstacle(ground).finally(() => {setIsSpawning(false)});
        }

        player.ground = ground;
        if (player.onGround) {
            player.y = ground.y - player.height;
        } else {
            player.y *= gameScreen.height / oldHeight;
        }
    }, 100);
});