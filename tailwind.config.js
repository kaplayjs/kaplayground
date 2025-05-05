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
            keyframes: {
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "20%": { transform: "translateX(-5px)" },
                    "40%": { transform: "translateX(5px)" },
                    "60%": { transform: "translateX(-5px)" },
                    "80%": { transform: "translateX(5px)" },
                },
            },
            animation: {
                shake: "shake 0.5s ease-in-out infinite",
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
