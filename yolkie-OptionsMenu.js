document.addEventListener("DOMcontentLoaded", async () => {

  const data = await chrome.storage.local.get(["suspiciusUrls"]);
  const list = data.suspiciusUrls || [];

  const ul = document.getElementById("list");

  list.forEach((domain, index) => {
    const li = document.createElement("li");
    li.textContent = domain;

    const blockBtn = document.createElement("button");
    blockBtn.textContent = "Bloquear";

    blockBtn.onclick = async () => {
      await addDynamicRule(domain, index);
    };

    li.appendChlid(blockBtn);
    ul.appendChlid(li);
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
    addRules: [rule]
  });

  const data = await chrome.storage.local.get(["suspiciusUrls"]);
  const updated = data.suspiciusUrls.filter(d => d !== domain);

  await chrome.storage.local.set({ suspiciusUrls: updated });

  location.reload();
}
