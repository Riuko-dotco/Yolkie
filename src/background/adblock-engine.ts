//-----------------------------------------------------------------------------------------------
// Yolkie Adblock - Free & Open code from dev: Juan Carlos Alejo
//-----------------------------------------------------------------------------------------------

const suspiciousUrls: string[] = []
const whitelist:      string[] = []

//Initializing local chrome storage
chrome.runtime.onInstalled.addListener(() => {
    void chrome.storage.local.set({
        suspiciousUrls,
        whitelist
    })
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.type !== "script" && details.type !== "xmlhttprequest") {
            return;
        }

        const url = new URL(details.url);
        const domain = url.hostname;

        void chrome.storage.local.get(["whitelist", "suspiciousUrls"])
            .then((data) => {
                const whitelist: string[] = Array.isArray(data.whitelist)
                    ? data.whitelist
                    : [];

                const suspiciousUrls: string[] = Array.isArray(data.suspiciousUrls)
                    ? data.suspiciousUrls
                    : [];

                if (whitelist.includes(domain)) {return};
                if (suspiciousUrls.includes(domain)) {return};

                suspiciousUrls.push(domain);

                return chrome.storage.local.set({ suspiciousUrls });
            });
    },
    { urls: ["<all_urls>"] }
);
