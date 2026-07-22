# Yolkie — Audit & TODO

Codebase audit findings, organized by priority. Each section includes what is broken, why, and how to fix it.

---

## 1. Failing Code (Critical)

These issues cause runtime crashes or prevent core features from working.

### 1.1 `location.reload()` crashes the service worker

**File:** `src/background/index.ts:49`
**Problem:** `location` is not defined in a service worker context. Calling `location.reload()` throws `ReferenceError: location is not defined` at runtime.
**Fix:** Remove the call. In MV3 service workers, if you need to signal a UI refresh, send a message to the popup via `chrome.runtime.sendMessage`.

### 1.2 `adblock-engine.ts` is never loaded

**File:** `src/background/adblock-engine.ts`
**Problem:** The service worker entry point is `src/background/index.ts`, which does **not** import `adblock-engine.ts`. The `chrome.webRequest.onBeforeRequest` listener and the `chrome.runtime.onInstalled` listener in `adblock-engine.ts` never execute. The entire suspicious-URL detection system is dead code.
**Fix:** Add `import "./adblock-engine.js"` at the top of `index.ts`.

### 1.3 `games.html` crashes on load

**File:** `src/popup/games.html` loads `src/popup/popup.ts`
**Problem:** `popup.ts` calls `changeBackground()`, `interactiveArrows()`, `menuToogle()`, etc. at module scope. These functions look for DOM elements (`#leftMoveScreen`, `#rigthMoveScreen`, `#optionsToggle`, etc.) that do **not** exist in `games.html`. They throw errors, crashing the script before `showGames()` ever runs. No games render.
**Fix:** Either split `popup.ts` into page-specific modules, or guard every function so it returns early when its target elements are absent.

### 1.4 CSS variable typo — toggle slider invisible

**File:** `src/popup/popup.css` (~line 210)
**Problem:** `var(--bg-colorcolor)` should be `var(--bg-color)`. The custom property `--bg-colorcolor` is never defined, so the toggle switch slider has no background color.
**Fix:** Rename to `var(--bg-color)` and ensure `--bg-color` is defined in `:root`.

### 1.5 Theme toggle checkbox never activates

**File:** `src/popup/popup.ts` — `changeTheme()` function
**Problem:** The function sets `ligthToggle.value = "on"` / `"off"` but never toggles the checkbox's `.checked` property. The CSS rule `.toggle:checked + .slider` never triggers, so the slider animation is broken.
**Fix:** Use `ligthToggle.checked` instead of `.value`.

### 1.6 `Ground.loaded` defaults to `true`

**File:** `src/games/dino-yolk/models/Ground.ts:13`
**Problem:** `loaded` is initialized to `true` before `init()` finishes loading the image. `draw()` attempts to render an unloaded image, which silently fails (canvas draws nothing).
**Fix:** Initialize `loaded = false` and set it to `true` at the end of `init()`.

---

## 2. Duplicated or Useless Code

### 2.1 Compiled `.js` files in source tree

**Files:** `src/popup/popup.js`, `src/games/games.js`
**Problem:** These are `tsc` output committed alongside their `.ts` sources. They serve no purpose — Vite/CRXJS handles compilation during build. They also cause ESLint errors (19 lint errors in `popup.js` alone).
**Fix:** Add `src/**/*.js` to `.gitignore`. Remove the `npm run popuptsconfig.json` script if no longer needed.

### 2.2 Empty `mensaje-handler.ts`

**File:** `src/background/mensaje-handler.ts`
**Problem:** 0 lines. Was likely intended for `chrome.runtime.onMessage` handling but was never implemented.
**Fix:** Delete the file or implement it.

### 2.3 Abandoned `yolkie-OptionsMenu.html`

**File:** `src/background/yolkie-OptionsMenu.html`
**Problem:** Not referenced in `manifest.json`. Contains invalid HTML (`<li>` without `<ul>`). Loads `index.js` which only exports a function — no DOM logic to handle the "Abrir" button.
**Fix:** Delete the file. If an options page is needed later, build it properly.

### 2.4 Redundant `cvs` / `canvas` exports

**File:** `src/games/dino-yolk/core/config.ts:1-6`
**Problem:** `canvas` is just `cvs` assigned to a new `const`. Both are exported. Every consumer imports `canvas`, making `cvs` unused.
**Fix:** Keep only `canvas`.

### 2.5 Unused React dependencies

**Files:** `package.json`
**Problem:** `react`, `react-dom`, `@types/react`, `@types/react-dom` are listed as dependencies but React is never imported anywhere. `@vitejs/plugin-react-swc` is loaded in `vite.config.ts` but serves no purpose.
**Fix:** Remove all five packages until React migration begins.

### 2.6 Unused `resolve` import

**File:** `vite.config.ts:4`
**Problem:** `import { resolve } from "node:path"` — never used.
**Fix:** Remove the import.

### 2.7 Unused `windows` permission

**File:** `public/manifest.json`
**Problem:** `"windows"` permission is declared but never used in any source file.
**Fix:** Remove it from the permissions array.

### 2.8 Empty `<a>` tag in `games.html`

**File:** `src/popup/games.html:13`
**Problem:** `<a href="popup.html"></a>` — invisible, no content, serves no purpose.
**Fix:** Remove it. Replace with a visible "Back to Yolkie" link if navigation is desired.

### 2.9 Module-level `console.log` in production

**Files:** `src/popup/popup.ts:28`, `src/popup/popup.ts:140`, `src/games/dino-yolk/core/gameLoop.ts:40`
**Problem:** Debug `console.log` calls left in production code. The one in `gameLoop.ts` runs every frame (~60/sec), causing significant console spam and performance degradation.
**Fix:** Remove all debug `console.log` statements, or wrap them in a `debug` flag check.

---

## 3. Refactorable Code

### 3.1 `popup.ts` is a monolith shared across pages

**File:** `src/popup/popup.ts`
**Problem:** One file handles background switching, theme toggle, menu toggle, keyboard arrows, and game card rendering. It runs on both `popup.html` and `games.html`, causing crashes on the latter (see 1.3).
**Refactor:** Split into modules:

- `popup/background.ts` — background cycling
- `popup/theme.ts` — light/dark toggle
- `popup/menu.ts` — options menu
- `popup/games-grid.ts` — game card rendering
- `popup/main.ts` — entry point that imports and initializes only what the current page needs.

### 3.2 Adblock engine architecture

**Files:** `src/background/index.ts`, `src/background/adblock-engine.ts`
**Problem:** The two files have no import relationship. `adblock-engine.ts` detects suspicious URLs but never blocks them. `index.ts` has `addDynamicRule()` but nothing calls it. The intended flow (detect → store → display in popup → user blocks → addDynamicRule) is broken.
**Refactor:** Design a clear pipeline:

1. `adblock-engine.ts` records suspicious domains (current behavior, keep).
2. Add a `chrome.runtime.onMessage` handler in `index.ts` that receives a "block-domain" message from the popup and calls `addDynamicRule()`.
3. The popup fetches `suspiciousUrls` from storage and renders them as a list with Block/Whitelist buttons (the `yolkie-OptionsMenu.html` prototype was heading in this direction).

### 3.3 Magic numbers throughout the game

**Files:** `src/games/dino-yolk/**/*.ts`
**Problem:** Jump velocity `-15`, gravity `0.8`, obstacle speed `5`, ground scroll speed `-5`, background scroll speed `-1`, sprite scale `1.25`, draw offset `30`, obstacle gaps `250-450`, max obstacles `5`, grace period `30` points, invincibility frames `60`, blink rate `4`, frame delay `8` — all hardcoded inline.
**Refactor:** Extract into a single `GAME_CONFIG` constant or a config module:

```ts
export const GAME_CONFIG = {
  GRAVITY: 0.8,
  JUMP_VELOCITY: -15,
  OBSTACLE_SPEED: 5,
  GROUND_SPEED: -5,
  BACKGROUND_SPEED: -1,
  SPRITE_SCALE: 1.25,
  MAX_OBSTACLES: 5,
  // ...
} as const;
```

### 3.4 Duplicated SVG icons in HTML

**File:** `src/popup/popup.html`
**Problem:** SVG icons (cog, arrows, gamepad, store) are inlined as raw SVG directly in the HTML, some with duplicate `class` attributes.
**Refactor:** Create an `icons.ts` utility that returns SVG strings or DOM elements. Use `createElement` with `innerHTML` from a centralized icon map.

### 3.5 Hardcoded resource paths

**Files:** `src/games/dino-yolk/index.ts`, `obstacleSpawner.ts`
**Problem:** Paths like `"src/games/dino-yolk/resources/yolkie/Yolkie1.png"` are scattered across multiple files. If the directory structure changes, every path must be updated manually.
**Refactor:** Centralize all asset paths in a single `assets.ts` constants file:

```ts
export const ASSETS = {
  YOLKIE: {
    RUN1: "src/games/dino-yolk/resources/yolkie/Yolkie1.png",
    RUN2: "src/games/dino-yolk/resources/yolkie/Yolkie2.png",
  },
  // ...
} as const;
```

### 3.6 Variable shadowing in `adblock-engine.ts`

**File:** `src/background/adblock-engine.ts:5-6` and `:27,31`
**Problem:** Module-level `suspiciousUrls` and `whitelist` arrays are re-declared inside the `.then()` callback with the same names.
**Refactor:** Remove the module-level arrays (they are never used after initialization). Use only the storage-backed values inside the callback.

---

## 4. Styling Issues

### 4.1 Duplicate `min-width` declarations

**File:** `src/popup/popup.css`
**Problem:** Both `body` and `.app` have `min-width` declared twice. The second value always overrides the first.
**Fix:** Remove the duplicate declarations. Keep only the intended value.

### 4.2 Double semicolon

**File:** `src/popup/popup.css` (~line 265)
**Problem:** `transition: transform 0.1s ease-in-out;;`
**Fix:** Remove the extra semicolon.

### 4.3 Duplicate `class` attributes on SVGs

**File:** `src/popup/popup.html`
**Problem:** Several `<svg>` elements have `class` specified twice. The second attribute overrides the first, losing icon-specific classes.
**Fix:** Merge into a single `class` attribute.

### 4.4 Death text not centered

**File:** `src/games/dino-yolk/core/gameLoop.ts:47-48`
**Problem:** "YOU HAVE DIED" and "R to retry" are drawn at `gameScreen.width / 2` without `context.textAlign = "center"`, so text starts at center rather than being centered.
**Fix:** Add `context.textAlign = "center"` before drawing, reset after.

### 4.5 Inconsistent naming conventions

**Files:** `src/popup/popup.ts`, `src/popup/popup.html`
**Problem:**

- `ToggleMenu` (PascalCase) vs `leftButton` (camelCase) for DOM elements
- `rigthButton` / `rigthMoveScreen` (typo: should be `right`)
- `ligthToggle` (typo: should be `light`)
- `menuToogle` (typo: should be `menuToggle`)
  **Fix:** Rename all to consistent camelCase with correct spelling. Use find-and-replace across HTML `id` attributes and TS `getElementById` calls simultaneously.

### 4.6 CSS class naming: Spanish/English mix

**File:** `src/popup/popup.css`
**Problem:** Grid areas use Spanish names (`ladoIzquierdo`, `ladoDerecho`) while classes elsewhere use English (`moveScreen`, `game-card`).
**Fix:** Pick one language and be consistent. English is recommended for broader contributor accessibility.

---

## 5. Infrastructure & Folder Organization

### 5.1 `.gitignore` is misconfigured

**Problem:** `package.json`, `package-lock.json`, `tsconfig.json` (listed twice), and `types/` are all in `.gitignore`. This means collaborators cannot clone and run the project — core config files are not tracked.
**Fix:** Remove `package.json`, `package-lock.json`, `tsconfig.json`, and `types/` from `.gitignore`.

### 5.2 Compiled output in source tree

**Problem:** `popup.js` and `games.js` are `tsc`-compiled outputs sitting next to their `.ts` sources. This creates confusion about which file is the source of truth.
**Fix:** Add `src/**/*.js` to `.gitignore`. Let Vite handle all compilation.

### 5.3 `tsconfig.popup.json` is redundant

**Problem:** A separate minimal tsconfig exists only for the `npm run popup` watch script. This script compiles `popup.ts` into the source tree (see 5.2). It has no `strict` mode and lacks `types: ["chrome"]`.
**Fix:** Delete `tsconfig.popup.json` and the `popup` npm script. Let Vite handle popup compilation like it handles everything else.

### 5.4 No shared types directory

**Problem:** Game-related types (`LoadedImage`, interfaces for `Player`, `Obstacle`, etc.) are co-located with their implementations. There is no shared types module.
**Recommendation:** Create a `src/types/` directory for cross-cutting types (game config, ad-block types, storage schema). Keep domain-specific types with their modules.

### 5.5 Recommended folder structure

```
src/
├── background/
│   ├── index.ts              # Entry: imports engine + message handler
│   ├── engine.ts             # webRequest suspicious URL detection
│   ├── rules.ts              # Dynamic declarativeNetRequest rule management
│   └── messages.ts           # chrome.runtime.onMessage handler
├── popup/
│   ├── index.html            # Main popup
│   ├── main.ts               # Entry point (imports only what this page needs)
│   ├── components/
│   │   ├── background-switcher.ts
│   │   ├── theme-toggle.ts
│   │   ├── options-menu.ts
│   │   └── games-grid.ts
│   ├── pages/
│   │   └── games.html        # Games listing
│   ├── styles/
│   │   ├── popup.css
│   │   └── components/
│   └── assets/
│       ├── backgrounds/
│       └── yolk.png
├── games/
│   ├── registry.ts           # Game registry (was games.ts)
│   └── dino-yolk/
│       ├── index.ts
│       ├── core/
│       ├── models/
│       ├── simulations/
│       └── assets/            # Game-specific images (was "resources")
├── shared/
│   ├── types.ts              # Cross-cutting type definitions
│   └── constants.ts          # Shared constants
└── ...
```

---

## 6. Suggested Additions

Aligned with the project's stated objectives (ad blocker + virtual pet with exp/coins).

### 6.1 Popup — Suspicious URLs Manager

The most critical missing feature. The infrastructure (`adblock-engine.ts`) records suspicious URLs, and `addDynamicRule()` can block them, but there is no UI to bridge the two.

**Add:** A section in the popup that fetches `suspiciousUrls` from `chrome.storage.local` and renders each as a card with "Block" and "Whitelist" buttons. "Block" calls `addDynamicRule()` via `chrome.runtime.sendMessage`. "Whitelist" adds the domain to the whitelist and removes it from suspicious URLs.

### 6.2 Popup — Ad Block Stats

Show the user how many ads have been blocked. Store a counter in `chrome.storage.local` and increment it each time `addDynamicRule()` is called. Display in the popup header.

### 6.3 EXP & Coins System

Tie the virtual pet to ad-blocking activity:

- +10 EXP for every domain blocked
- +5 coins for every domain blocked
- Store `exp` and `coins` in `chrome.storage.local`
- Level-up thresholds (e.g., level N requires N\*100 EXP)
- Display Yolk's level, EXP bar, and coin count in the popup

### 6.4 Yolk Idle Animations

Animate the Yolk mascot in the popup based on state:

- Idle: Yolk pecks at the ground
- Block: Yolk eats an ad (satisfying animation)
- Level up: Yolk jumps and sparkles

This could be done with CSS animations or a small canvas in the popup.

### 6.5 Store / Upgrade System

Use coins to buy cosmetic or functional upgrades:

- Different Yolk skins
- Background themes
- Faster ad detection speed (gameplay buff)

### 6.6 Difficulty Progression in Dino Yolk

Currently difficulty is flat after the grace period. Add:

- Obstacle speed increases every 100 points
- Gap between obstacles shrinks over time
- New obstacle types unlock at score milestones
- High score persistence via `chrome.storage.local`

### 6.7 Health Display

The player has 3 HP but no visual indicator. Add a health bar or heart icons in the top-left corner of the canvas.

### 6.8 Cross-Browser Compatibility Layer

The project has `@types/firefox-webext-browser` but uses `chrome.*` APIs directly. For Firefox compatibility:

- Use the `browser.*` namespace (Firefox) with a `chrome` polyfill
- Or create a thin abstraction: `src/shared/browser.ts` that wraps `chrome`/`browser` calls
- Test with `web-ext` for Firefox

### 6.9 React Migration (when ready)

The project already has React in dependencies. When migrating:

- Use the [CRXJS React template](https://crxjs.dev/vite-plugin/concepts/frameworks) for popup
- Keep the game as vanilla canvas (React adds overhead to game loops)
- Consider Preact for the popup if bundle size matters

### 6.10 Content Script for Script Blocking Layer

The second onion layer (script blocking) needs a content script that:

- Observes DOM mutations for injected `<script>` tags
- Reports their `src` to the background via `chrome.runtime.sendMessage`
- The background evaluates whether the script is suspicious and adds it to the blocklist

### 6.11 E2E / Integration Testing

- Use `vitest` for unit tests (game logic, collision, config)
- Use `@crxjs/vitest-example` or `playwright` with Chrome extension loading for E2E tests
- Test ad-block rule effectiveness with mock requests
