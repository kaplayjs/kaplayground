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
                    primary: "#6ba672",
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
