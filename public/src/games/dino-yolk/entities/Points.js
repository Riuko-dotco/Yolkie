import {context} from "../core/config.js";
import {lightMode} from "../systems/themeSystem.js";

export class Points {
    constructor() {
        this.value = 0;
    }

    draw() {
        context.font = "30px Minecraft";
        context.fillStyle = lightMode ? "black" : "white";
        context.fillText(`Points: ${Math.floor(this.value)}`, 10, 50);
    }
}