import { useProject } from "../hooks/useProject";

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
<script src="https://unpkg.com/kaplay@4000.0.0-alpha.2/dist/kaplay.js"></script>
<script>
    ${parseAssets(code)}
</script>
</body>
`;

const transformAssetUrl = (regex: RegExp, code: string) => {
    console.debug();
    const { project: { assets: resources } } = useProject.getState();

    return code.replace(regex, (match, asset: string) => {
        // remove first / and last / from asset, also remove "assets" from asset
        const normalizeAsset = asset.replace(/^\/|\/$/g, "").replace(
            "assets/",
            "",
        ).replace(/"/g, "");

        console.log(resources);

        return match.replace(
            asset,
            resources.get(normalizeAsset)?.url ?? asset,
        );
    });
};

export const parseAssets = (code: string) => {
    const regexLoad = /load\w+\(\s*"[^"]*",\s*"([^"]*)"\s*\)/g;
    const regexComment = /\/\/\s*kaplay-transformation-asset\s*(.*)/g;

    return transformAssetUrl(
        regexLoad,
        transformAssetUrl(regexComment, code),
    );
};
