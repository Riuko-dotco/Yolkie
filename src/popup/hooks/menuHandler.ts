const ToggleMenu = document.getElementById("optionsToggle");
const menu = document.getElementById("optionsMenu");

export function menuToogle() {
    if(!(ToggleMenu instanceof HTMLButtonElement)){ throw new Error("Toggle not found")};
    if(!menu) {throw new Error("Menu not found")};

    ToggleMenu.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
}