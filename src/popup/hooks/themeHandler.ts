const ligthToggle = document.getElementById("ligthToggle");
const app = document.getElementById("appWrapper")
const emojiToggle = document.getElementById("iconSwitch")

export function changeTheme() {
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