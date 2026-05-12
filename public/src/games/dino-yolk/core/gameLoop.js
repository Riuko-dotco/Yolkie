import { context, gameScreen } from "./config.js";
import { pause, setPaused } from "./config.js";
import { setObstaclesToEmpty } from "../systems/obstacleSpawner.js";
import {allObstacles, spawnObstacle} from "../systems/obstacleSpawner.js";
import {playerRectCollision} from "./collision.js";
import { keys } from "./input.js";

export let isSpawning = false;
export function setIsSpawning(value) {
    isSpawning = value;
}
export function startGameLoop({ player, ground, background, points, obstacles }) {

    function resetGame() {
        player.health = 3;
        player.dead = false;
        setPaused(false);
        points.value = 0
        setObstaclesToEmpty();
        spawnObstacle(ground).finally(() => {isSpawning = false });
    }

    async function gameLoop() {
        context.clearRect(0, 0, gameScreen.width, gameScreen.height);
        requestAnimationFrame(gameLoop);

        if (!pause) {
            points.value += 0.1

            player.update();
            ground.update();
            background.update();

            console.log(allObstacles);
            if (points.value >= 30) {
                if (allObstacles.length < 5 && !isSpawning) {
                    isSpawning = true;
                    spawnObstacle(ground).finally(() => { isSpawning = false});
                }

                allObstacles.forEach((obstacle) => {
                    obstacle.update();

                    if (playerRectCollision(player, obstacle) && !player.isInvincible) {
                        player.health -= 1
                        player.isInvincible = true;
                        player.invincibilityTimer = 60;
                        if (player.health <= 0) {
                            player.dead = true;
                            setPaused(true);
                        }
                    }
                });
            }
        }


        background.draw(context);
        ground.draw(context);
        player.draw(context);
        obstacles.forEach((/** @type {{ draw: (arg0: CanvasRenderingContext2D) => any; }} */ o) => o.draw(context));
        points.draw(context);


        if (pause && !player.dead) {
            context.fillStyle = "rgba(0,0,0,0.4)";
            context.fillRect(0, 0, gameScreen.width, gameScreen.height);
            context.fillStyle = "white";
            context.font = "40px Minecraft";
            context.fillText("PAUSED", gameScreen.width / 2 - 80, gameScreen.height / 2);
        }

        if (pause && player.dead){
            context.fillStyle = "rgba(0,0,0,0.4)";
            context.fillRect(0, 0, gameScreen.width, gameScreen.height);

            context.fillStyle = "white";
            context.font = "40px Minecraft";
            context.fillText("YOU HAVE DIED", gameScreen.width / 2 - 80, gameScreen.height / 2);
            context.fillText("R to retry", gameScreen.width / 2 - 60, ((gameScreen.height / 2)+100));

            if (player.dead && keys["KeyR"]) {
                resetGame();
            }
        }
    }



     gameLoop()
}

export default startGameLoop