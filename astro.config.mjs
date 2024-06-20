import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare({
        imageService: "passthrough",
    }),
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
        ssr: {
            external: [
                "node:buffer",
                "node:events",
                "cloudfare:sockets",
                "node:external",
                "node:stream",
            ],
        },
        build: {
            rollupOptions: {
                external: ["cloudflare:sockets"],
            },
        },
        plugins: [viteStaticCopy({
            targets: [{
                src: "kaplay/assets/sprites/**",
                dest: "sprites/",
            }, {
                src: "kaplay/examples/**",
                dest: "examples/",
            }],
        })],
    },
    output: "hybrid",
});
