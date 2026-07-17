# Yolkie

**A Chrome extension that blocks ads with a virtual pet twist.**

Yolkie is an ad blocker with a mascot: a little chicken that eats your ads. Block unwanted content across the web while collecting experience and coins to level up your Yolk.

## Core Features

### Ad Blocking (onion-layer system)

1. **Direct Block** — Static declarative rules that block known ad/tracking domains (doubleclick.net, googleadservices.com, etc.) via `chrome.declarativeNetRequest`.
2. **Script Blocking** — Runtime monitoring via `chrome.webRequest` that detects suspicious script and XHR requests, adds domains to a blocklist stored in `chrome.storage.local`.
3. **Suspicious URL Management** — A popup UI where users can review flagged URLs and choose to block or whitelist them.
4. _(Planned)_ **Advanced Filtering** — Intercept-based blocking for difficult targets like in-stream ads (YouTube, etc.).

### Virtual Pet & Games

- **Dino Yolk** — A Chrome-Dino-style runner game where Yolk (the chicken) jumps over obstacles. Earn points, survive as long as you can.
- _(Planned)_ Experience and coins system tied to ad-blocking activity.
- _(Planned)_ Store to upgrade your Yolk.

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Build         | Vite + `@crxjs/vite-plugin`                     |
| Language      | TypeScript (strict)                             |
| Linting       | ESLint + typescript-eslint                      |
| Extension API | Chrome Manifest V3                              |
| UI            | Vanilla HTML/CSS/TS _(React migration planned)_ |
