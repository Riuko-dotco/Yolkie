async function init() {
    const abrirBtn = document.getElementById("abrirBtn");

    if (!abrirBtn) {
        console.error("No se encontró abrirBtn");
        return;
    }

    abrirBtn.addEventListener("click", abrirVentana);

    const data = await chrome.storage.local.get(["suspiciousUrls"]);
    const list: string[] = Array.isArray(data.suspiciousUrls)
        ? data.suspiciousUrls
        : [];

  
    document.addEventListener("DOMContentLoaded", () => {
        const ul = document.getElementById("list");
        if(!ul) {return}

        list.forEach((domain) => {
            const li = document.createElement("li");
            li.textContent = domain;
            const blockBtn = document.createElement("button");
            blockBtn.textContent = "Bloquear";

            blockBtn.onclick = async () => {
                await addDynamicRule(domain);
            };

            li.appendChild(blockBtn);
            ul.appendChild(li);
        });

    });

    async function addDynamicRule(domain: string) {

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

        const updated = list.filter(d => d !== domain);
        await chrome.storage.local.set({ suspiciousUrls: updated });
        location.reload();
    }

    function abrirVentana() {
        const gameUrl = chrome.runtime.getURL(
            "src/games/dino-yolk/dino-yolk.html"
        );

        console.log(gameUrl);

        fetch(gameUrl)
            .then(r => console.log("Status:", r.status))
            .catch(console.error);

        void chrome.windows.create({
            url: gameUrl,
            type: "popup",
            width: 1200,
            height: 800,
        });
    }
}

void init()