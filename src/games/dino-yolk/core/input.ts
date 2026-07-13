import { togglePause } from "./config.js";

export const keys: Record<string, boolean> = {};
let canBeToggled = true

export function setupInput() {
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
        }

        if (e.code === "Escape" && canBeToggled) {
            togglePause();
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
}