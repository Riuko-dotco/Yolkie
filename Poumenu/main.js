const backgroundPou  = document.querySelector(".background");
const toggle1 = document.querySelector(".toggle")
const gamesButton = document.querySelector(".games")
const yolkiePou = document.querySelector(".yolkie")
let xpPoints = 10 //cambiar a chrome.storage
let traje 
let blue = 1

function abrirVentana() {
    window.open(
        "http://127.0.0.1:5500/yolkie/Yolkie/canvas/canvas.html",
        "popup",
        "width=1200,height=800"
    );
}

class trajes {
    constructor(nombre, xpRequerida, imagen, selected = false) {
        this.nombre = nombre;
        this.xpRequerida = xpRequerida;
        this.imagen = imagen;
        this.selected = selected;
    }

    setter(){
        if (xpPoints >= this.xpRequerida && this.selected) {
            yolkiePou.src = this.imagen;
            traje = this.nombre
        } 
    }
}

let trajes = [{
    nombre: "Deku",
    xpRequerida: 50,
    imagen: "yolkieAdolecente.png",
    selected: false
}, {
    nombre: "All Might",
    xpRequerida: 100,
    imagen: "yolkieAdulto.png",
    selected: false
}, {
    nombre: "Chica",
    xpRequerida: 150,
    imagen: "yolkieChica.png",
    selected: false
}, {
    nombre: "Freddy",
    xpRequerida: 100,
    imagen: "yolkieFreddy.png",
    selected: false
}, {
    nombre: "Goku",
    xpRequerida: 200,
    imagen: "yolkieGoku.png",
    selected: false
}, {
    nombre: "Saitama",
    xpRequerida: 300,
    imagen: "yolkieSaitama.png",
    selected: false
}, {
    nombre: "Naruto",
    xpRequerida: 400,
    imagen: "yolkieNaruto.png",
    selected: false
}]

//seleccionar traje Yolie 
switch(true) {
    case (xpPoints === 100 && !traje):
        yolkiePou.src = "yolkieAdulto.png";
        break;
    case (xpPoints === 50 && !traje):
        yolkiePou.src = "yolkieAdolecente.png"
        break;
    default:
        yolkiePou.src = "Yolk.png"
}


gamesButton.addEventListener("click", abrirVentana);

toggle1.addEventListener("click", () => {
    blue = !blue 
    if (blue){
        backgroundPou.style.background = "rgb(0, 0, 255)";
    }
    if (!blue) {
        backgroundPou.style.background = "rgb(255, 0, 0)";
    }
})



