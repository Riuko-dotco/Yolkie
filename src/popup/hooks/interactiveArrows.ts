const leftButton = document.getElementById("leftMoveScreen")
const rigthButton = document.getElementById("rigthMoveScreen")

export function interactiveArrows() {
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