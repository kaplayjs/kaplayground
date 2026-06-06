import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import "./scripts/examples";
import "./scripts/versions";
import "./scripts/changelog";

// https://vitejs.dev/config/
export default defineConfig({
    clearScreen: false,
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: "kaplay/examples/**",
                    dest: "",
                },
            ],
        }),
    ],
});
