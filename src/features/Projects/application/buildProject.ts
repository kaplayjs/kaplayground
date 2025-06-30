import { getVersion, parseAssets } from "../../../util/compiler";
import { buildCode } from "./buildCode";

const toDataUrl = (data: string) => {
    const base64 = btoa(data);
    return `data:text/javascript;base64,${base64}`;
};

export async function buildProject() {
    const code = await buildCode();
    const kaplayLib = await getVersion(true);

    if (!kaplayLib) {
        throw new Error("Failed to fetch the library");
    }

    const kaplayLibDataUrl = toDataUrl(kaplayLib);

    const projectCode = `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body,
        html {
            width: 100%;
            height: 100vh;
        }

        body {
            overflow: hidden;
            background: #171212;
        }
    </style>
</head>
</head>
<body>
    <script type="module">
        import kaplay from "${kaplayLibDataUrl}";
        ${parseAssets(code)}
    </script>
</body>
</html>`;

    return projectCode;
}
