export const cvs = document.getElementById("canvas");
if (!(cvs instanceof HTMLCanvasElement)) {throw new Error("Canvas no encontrado")};

export const canvas = cvs

export const ctx = canvas.getContext("2d");

if(!ctx){
    throw new Error("Contexto no inicializado correctamente")
}
export const context = ctx

export let debug = false;

export function setDebug(value: boolean) {
    debug = value;
}

export const gameScreen = {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
};

export function applyCanvasSize() {
    gameScreen.width = window.innerWidth;
    gameScreen.height = window.innerHeight;
    gameScreen.dpr = window.devicePixelRatio || 1;

    if(canvas instanceof HTMLCanvasElement ){
        canvas.width = gameScreen.width * gameScreen.dpr;
        canvas.height = gameScreen.height * gameScreen.dpr;
        canvas.style.width = gameScreen.width + "px";
        canvas.style.height = gameScreen.height + "px";
    }

    context.setTransform(1, 0, 0, 1, 0, 0); // resetear transform antes de re-escalar
    context.scale(gameScreen.dpr, gameScreen.dpr);
    context.imageSmoothingEnabled = false;
}


export let pause = false;
export function setPaused (value: boolean) { pause = value; }
export function togglePause() { pause = !pause; }