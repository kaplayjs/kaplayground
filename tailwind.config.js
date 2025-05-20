import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    plugins: [
        require("daisyui"),
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["\"Outfit Variable\"", ...defaultTheme.fontFamily.sans],
                mono: ["\"DM Mono\"", ...defaultTheme.fontFamily.mono],
            },
            backgroundPosition: {
                "select-xs": "right 12px center, right 8px center",
            },
            animation: {
                "fade-in":
                    "fade-in 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { transform: "1" },
                },
            },
        },
    },
    daisyui: {
        themes: [
            {
                "Spiker": {
                    ...require("daisyui/src/theming/themes")["dim"],
                    primary: "#abdd64",
                    error: "#ea6262",
                    "--animation-btn": 0,
                },
                "Ghostiny": {
                    ...require("daisyui/src/theming/themes")["emerald"],
                },
            },
        ],
        darkTheme: "Spiker",
        logs: false,
    },
};
