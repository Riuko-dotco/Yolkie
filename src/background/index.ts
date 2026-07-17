export async function addDynamicRule(domain: string) {
    const data = await chrome.storage.local.get(["suspiciousUrls"]);
    const list: string[] = Array.isArray(data.suspiciousUrls) ? data.suspiciousUrls : [];

    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const nextId = existing.length
        ? Math.max(...existing.map(r => r.id)) + 1
        : 1000;

    const rule: chrome.declarativeNetRequest.Rule = {
        id: nextId,
        priority: 1,
        action: { type: "block" },
        condition: {
                urlFilter: domain,
                resourceTypes: ["script", "image", "xmlhttprequest"]
            }
        }

    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule], 
    });

    const updated = list.filter(d => d !== domain);
    await chrome.storage.local.set({ suspiciousUrls: updated });
}
