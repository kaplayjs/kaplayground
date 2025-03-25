/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    plugins: [
        require("daisyui"),
    ],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                "Spiker": {
                    ...require("daisyui/src/theming/themes")["dim"],
                    primary: "#abdd64",
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
