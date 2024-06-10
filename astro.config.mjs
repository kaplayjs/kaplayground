import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { VitePWA } from "vite-plugin-pwa";

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind()],
    devToolbar: {
        enabled: false,
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    vite: {
        plugins: [
            VitePWA(),
        ],
        cacheDir: ".vite",
        // prevent vite from obscuring rust errors
        clearScreen: false,
        // Tauri expects a fixed port, fail if that port is not available
        server: {
            strictPort: true,
        },
        // to access the Tauri environment variables set by the CLI with information about the current target
        envPrefix: [
            "VITE_",
            "TAURI_PLATFORM",
            "TAURI_ARCH",
            "TAURI_FAMILY",
            "TAURI_PLATFORM_VERSION",
            "TAURI_PLATFORM_TYPE",
            "TAURI_DEBUG",
        ],
        build: {
            // Tauri uses Chromium on Windows and WebKit on macOS and Linux
            target: "chrome105",
            // don't minify for debug builds
            minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
            // produce sourcemaps for debug builds
            sourcemap: !!process.env.TAURI_DEBUG,
        },
    },
});
