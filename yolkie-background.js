//-----------------------------------------------------------------------------------------------
// Yolkie Adblock - Free & Open code from devs: Juan Carlos Alejo, Juan felipe Bernal, Juan Pablo Bernal
//-----------------------------------------------------------------------------------------------


//Inialazing local chrome storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    suspiciousUrls: [],
    whitelist: []
  });
});

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {

    if (details.type !== "script" && details.type !== "xmlhttprequest") {
      return;
    }

    const url = new URL(details.url);
    const domain = url.hostname;

    const data = await chrome.storage.local.get(["whitelist", "suspiciousUrls"]);

    const whitelist = data.whitelist || [];
    const suspiciousUrls = data.suspiciousUrls || [];

    if (whitelist.includes(domain)) return;
    if (suspiciousUrls.includes(domain)) return;

    suspiciousUrls.push(domain);

    await chrome.storage.local.set({ suspiciousUrls });

  },
  { urls: ["<all_urls>"] }
);
