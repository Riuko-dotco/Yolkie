import {lightMode} from "../simulations/themeSystem.js";

interface points {
    value:  number
}

export class Points implements points {
    public value: number; 

    constructor() {
        this.value = 0;
    }

    draw(context: CanvasRenderingContext2D) {
        context.font = "30px Minecraft";
        context.fillStyle = lightMode ? "black" : "white";
        context.fillText(`Points: ${Math.floor(this.value)}`, 10, 50);
    }
}