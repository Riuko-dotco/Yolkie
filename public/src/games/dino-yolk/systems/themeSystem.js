import {canvas} from "../core/config.js";

export let lightMode = false;

export function setupThemeToggle() {
    const toggle = document.getElementById("themeToggle");

    if (!toggle) return;

    toggle.addEventListener("click", () => {
        lightMode = !lightMode;

        canvas.style.background = lightMode
            ? "rgb(255,255,255)"
            : "rgb(20,20,20)";

        toggle.textContent = lightMode
            ? "🌙"
            : "☀️";

        toggle.style.background = lightMode
            ? "white"
            : "rgb(35, 34, 34)";

        toggle.style.color = lightMode
            ? "rgb(215,196,196)"
            : "rgb(20,20,20)";
    });
}