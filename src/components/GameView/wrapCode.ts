import { $version } from "../../stores";

const versions: Record<string, string> = {
    v4000: "https://unpkg.com/kaplay@next/dist/kaplay.js",
    v3001: "https://unpkg.com/kaplay@latest/dist/kaplay.js",
};

export const wrapCode = (code: any) => {
    const version = $version.get();

    return `
<!DOCTYPE html>
<head>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body,
html {
    width: 100%;
}

body {
            overflow: hidden;
            background: #171212;
        }
        </style>
</head>

<script src="${versions[version]}"></script>

<body>
<script type="module">
${code}
</script>
</body>
`;
};
