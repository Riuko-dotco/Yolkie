import type { Obstacle } from "../models/Obstacles.js";
import type { Player } from "../models/Player.js";

/**
 * @param {{ x: number; width: any; y: number; height: any; }} player
 * @param {{ x: number; width: any; y: number; height: any; }} rect
 * @description La funcion retorna un valor booleano calculado por AABB
 * @returns boolean
 */
export function playerRectCollision(player: Player, rect: Obstacle) {
    const pad = 2;

    return (
        player.x < rect.x + rect.width - pad &&
        player.x + player.width > rect.x + pad &&
        player.y < rect.y + rect.height - pad &&
        player.y + player.height > rect.y + pad
    );
}