const leftButton = document.getElementById("leftMoveScreen")
const rigthButton = document.getElementById("rigthMoveScreen")
const ToggleMenu = document.getElementById("optionsToggle");
const menu = document.getElementById("optionsMenu");
const ligthToggle = document.getElementById("ligthToggle");
const app = document.getElementById("appWrapper")
const emojiToggle = document.getElementById("iconSwitch")
function menuToogle() {
    if(!(ToggleMenu instanceof HTMLButtonElement)){ throw new Error("Toggle not found")};
    if(!menu) {throw new Error("Menu not found")};

    ToggleMenu.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
}

function changeBackground() {
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
            }

            if (event.key === "ArrowRight"){
                rigthButton.classList.add("pressed");
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


changeBackground()
interactiveArrows()
menuToogle()
