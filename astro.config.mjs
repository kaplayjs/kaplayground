import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind()],
    vite: {
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: "kaplay/assets/sprites/**",
                        dest: "sprites/",
                    },
                    {
                        src: "kaplay/examples/**",
                        dest: "examples/",
                    },
                ],
            }),
        ],
    },
});
