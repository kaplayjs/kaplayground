import { useProject } from "../hooks/useProject";
import { debug } from "./logs";

// Wraps the game in an acceptable format for iFrame
export const wrapGame = (code: string) => `
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
    height: 100vh;
}

body {
            overflow: hidden;
            background: #171212;
        }
        </style>
</head>
<body>
<script src="https://unpkg.com/kaplay@${useProject.getState().project.kaplayVersion}/dist/kaboom.js"></script>
<script>
    ${parseAssets(code)}
</script>
</body>
`;

const transformAssetUrl = (regex: RegExp, code: string) => {
    const { project: { assets: resources } } = useProject.getState();

    const x = code.replace(regex, (match, asset: string) => {
        debug(0, "Transforming urls, asset matched", asset);

        // remove first / and last / from asset, also remove "assets" from asset
        const normalizeAsset = asset.replace(/^\/|\/$/g, "").replace(
            "assets/",
            "",
        ).replace(/"/g, "");

        debug(0, "Resource found:", resources.get(normalizeAsset)?.url);

        return match.replace(
            asset,
            resources.get(normalizeAsset)?.url ?? asset,
        );
    });

    return x;
};

export const parseAssets = (code: string) => {
    const regexLoad = /load\w+\(\s*"[^"]*",\s*"([^"]*)"\s*\)/g;
    const regexComment = /\/\/\s*kaplay-transformation-asset\s*(.*)/g;

    const codeTransformed = transformAssetUrl(
        regexLoad,
        transformAssetUrl(regexComment, code),
    );

    debug(2, "Code with assets", codeTransformed);

    return codeTransformed;
};
