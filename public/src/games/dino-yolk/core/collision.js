/**
 * @param {{ x: number; width: any; y: number; height: any; }} player
 * @param {{ x: number; width: any; y: number; height: any; }} rect
 */
export function playerRectCollision(player, rect) {
    const pad = 2;

    return (
        player.x < rect.x + rect.width - pad &&
        player.x + player.width > rect.x + pad &&
        player.y < rect.y + rect.height - pad &&
        player.y + player.height > rect.y + pad
    );
}