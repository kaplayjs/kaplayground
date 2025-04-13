import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { generateExamples } from "./scripts/examples.js";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
    clearScreen: false,
    // Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
    envPrefix: ["VITE_", "TAURI_ENV_*"],
    server: {
        // Tauri expects a fixed port, fail if that port is not available
        strictPort: true,
        // if the host Tauri is expecting is set, use it
        host: host || false,
        port: 5173,
    },
    build: {
        // Tauri uses Chromium on Windows and WebKit on macOS and Linux
        target: process.env.TAURI_ENV_PLATFORM == "windows"
            ? "chrome105"
            : "safari13",
        // don't minify for debug builds
        minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
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
        {
            name: "kaplay",
            buildStart() {
                const examplesPath = process.env.EXAMPLES_PATH;

                if (examplesPath) {
                    generateExamples(
                        path.join(import.meta.dirname, examplesPath),
                    );
                } else generateExamples();
            },
        },
    ],
});
