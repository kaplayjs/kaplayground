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
                "kaplay": {
                    ...require("daisyui/src/theming/themes")["dim"],
                    primary: "#6ba672",
                },
            },
            "emerald",
        ],
        darkTheme: "kaplay",
        logs: false,
    },
};
