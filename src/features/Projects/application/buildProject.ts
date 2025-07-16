import { getVersion, parseAssets } from "../../../util/compiler";
import { useProject } from "../stores/useProject";
import { buildCode } from "./buildCode";
import { defaultFavicon } from "./defaultFavicon";

const toDataUrl = (data: string) => {
    const base64 = btoa(data);
    return `data:text/javascript;base64,${base64}`;
};

export async function buildProject() {
    const code = await buildCode();
    const kaplayLib = await getVersion(true);
    const project = useProject.getState().project;

    if (!kaplayLib) {
        throw new Error("Failed to fetch the library");
    }

    const kaplayLibDataUrl = toDataUrl(kaplayLib);

    const projectCode = `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <link rel="icon" href="${project.favicon || defaultFavicon}">
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
