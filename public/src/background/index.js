// @ts-nocheck
document.addEventListener("DOMcontentLoaded", async () => {

    const data = await chrome.storage.local.get(["suspiciousUrls"]);
    const list = data.suspiciousUrls || [];

    const ul = document.getElementById("list");
    // @ts-ignore
    list.forEach((domain, index) => {
        const li = document.createElement("li");
        li.textContent = domain;
        const blockBtn = document.createElement("button");
        blockBtn.textContent = "Bloquear";

        blockBtn.onclick = async () => {
            await addDynamicRule(domain, index);
        };

        li.appendChild(blockBtn);
        ul.appendChild(li);
    });

});

async function addDynamicRule(domain, index) {

    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const nextId = existing.length
        ? Math.max(...existing.map(r => r.id)) + 1
        : 1000;

    const rule = {
        id: nextId,
        priority: 1,
        action: { type: "block" },
        condition: {
            urlFilter: domain,
            resourceTypes: ["script", "image", "xmlhttprequest"]
        }
    };

    await chrome.declarativeNetRequest.updateDynamicRules({
        // @ts-ignore
        addRules: [rule]
    });

    const data = await chrome.storage.local.get(["suspiciousUrls"]);
    const updated = data.suspiciousUrls.filter(d => d !== domain);

    await chrome.storage.local.set({ suspiciousUrls: updated });

    location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("abrirBtn").addEventListener("click", abrirVentana);
});

function abrirVentana() {
    const gameUrl = chrome.runtime.getURL(
        "public/src/games/dino-yolk/dino-yolk.html"
    );

    console.log("Opening:", gameUrl);

    chrome.windows.create({
        url: gameUrl,
        type: "popup",
        width: 1200,
        height: 800,
        focused: true
    });
}
