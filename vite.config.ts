import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json" with { type: "json" };
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [
        crx({ manifest }),
        react()
    ]
});
