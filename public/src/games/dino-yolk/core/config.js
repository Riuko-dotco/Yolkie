export const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas no encontrado");
export const context = canvas.getContext("2d");

// En vez de primitivos sueltos, un objeto mutable
export const debug = false;


export const gameScreen = {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
};

export function applyCanvasSize() {
    gameScreen.width = window.innerWidth;
    gameScreen.height = window.innerHeight;
    gameScreen.dpr = window.devicePixelRatio || 1;

    canvas.width = gameScreen.width * gameScreen.dpr;
    canvas.height = gameScreen.height * gameScreen.dpr;
    canvas.style.width = gameScreen.width + "px";
    canvas.style.height = gameScreen.height + "px";

    context.setTransform(1, 0, 0, 1, 0, 0); // resetear transform antes de re-escalar
    context.scale(gameScreen.dpr, gameScreen.dpr);
    context.imageSmoothingEnabled = false;
}


export let pause = false;
export function setPaused(value) { pause = value; }
export function togglePause() { pause = !pause; }