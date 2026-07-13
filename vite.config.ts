import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json" with { type: "json" };
import { resolve } from "node:path";

export default defineConfig({
    plugins: [
        crx({ manifest }),
    ],

    build: {
        rollupOptions: {
            input: {
                game: resolve(
                    __dirname,
                    "src/games/dino-yolk/dino-yolk.html"
                ),
            },
        },
    },
});