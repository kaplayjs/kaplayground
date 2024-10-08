import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { generateExamples } from "./scripts/examples.js";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
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
            watchChange() {
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
