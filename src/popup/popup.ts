import {games} from "../games/games.js"

const leftButton = document.getElementById("leftMoveScreen")
const rigthButton = document.getElementById("rigthMoveScreen")
const ToggleMenu = document.getElementById("optionsToggle");
const menu = document.getElementById("optionsMenu");
const ligthToggle = document.getElementById("ligthToggle");
const app = document.getElementById("appWrapper")
const emojiToggle = document.getElementById("iconSwitch")
const grid = document.getElementById("gamesWrapper");



type Background = {
        id: number,
        name: string,
        url: string,
    }

const backgrounds : Background[] = [
    {
        id: 1,
        name: "Outside",
        url: "./background/insidehome.jpg",
    },
    {
        id: 2,
        name: "Inside",
        url: "./background/background.png"
    },
    {
        id: 3,
        name: "Playground",
        url: "./background/playground.jpg"
    }
]

let currentBackground = 0
console.log(currentBackground)
function updateBackground() {
    if (!(app instanceof HTMLDivElement)) {return};

    app.style.backgroundImage = `url(${backgrounds[currentBackground].url})`

}

function changeBackground() {
    if(!(leftButton)){throw new Error(`No se encontro el elemento ${leftButton}`)};
    if(!(rigthButton)){throw new Error(`No se encontro el elemento ${rigthButton}`)};
    if(!(app instanceof HTMLDivElement)){throw new Error("No se encontro el App")}


    leftButton.addEventListener("click", () => {
                currentBackground--;
        
                if(currentBackground < 0){
                    currentBackground = backgrounds.length - 1;
                }

                updateBackground();
        });
    
    rigthButton.addEventListener("click", () => {
                currentBackground++;

                if(currentBackground >= backgrounds.length){
                    currentBackground = 0;
                }

                updateBackground();
        })
}


function menuToogle() {
    if(!(ToggleMenu instanceof HTMLButtonElement)){ throw new Error("Toggle not found")};
    if(!menu) {throw new Error("Menu not found")};

    ToggleMenu.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
}

function changeTheme() {
    if(!(ligthToggle instanceof HTMLInputElement)){return}
    if(!app) { throw new Error("No App Wrapper found")}
    if(!emojiToggle) { throw new Error("No icon found")}
    ligthToggle.value = "on"
    
    ligthToggle.addEventListener("change", () => {
        if(ligthToggle.value === "on"){
            ligthToggle.value = "off";
            app.style.backgroundColor = "#00171A";
            emojiToggle.textContent = "☀️"
        } else {
            ligthToggle.value = "on"
            app.style.backgroundColor = "#0099AA"
            emojiToggle.textContent = "🌙"
        }
    })
}

function interactiveArrows() {
    if(!(leftButton)){throw new Error(`No se encontro el elemento ${leftButton}`)};
    if(!(rigthButton)){throw new Error(`No se encontro el elemento ${rigthButton}`)};
    document.addEventListener("keydown", (event) => {
            if (event.repeat) { return }; 

            if (event.key === "ArrowLeft"){
                leftButton.classList.add("pressed");
                leftButton.click()
            }

            if (event.key === "ArrowRight"){
                rigthButton.classList.add("pressed");
                rigthButton.click()
            }


        }
    )
    document.addEventListener("keyup", (event) => {
            if (event.repeat) { return }; 

            if (event.key === "ArrowLeft"){
                leftButton.classList.remove("pressed");
            }
            
            if (event.key === "ArrowRight"){
                rigthButton.classList.remove("pressed");
            }
        }
    )
}

function showGames () {
    if (!(grid instanceof HTMLElement)) {
        throw new Error("Grid no encontrado");
    }
        console.log(grid)
    for (const game of games) {
        const card = document.createElement("article");
        card.className = "game-card";

        card.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h2>${game.name}</h2>
            <p>${game.description}</p>
        `;

        card.addEventListener("click", () => {
            console.log(game.id);
        });

        grid.appendChild(card);
    }
}



changeBackground()
changeTheme()
interactiveArrows()
menuToogle()
showGames()