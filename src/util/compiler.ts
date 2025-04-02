import { assets } from "@kaplayjs/crew";
import { useProject } from "../hooks/useProject";
import { debug } from "./logs";

export const getVersion = () => {
    const version = useProject.getState().project.kaplayVersion;

    if (version == "master") {
        return `https://kaplayjs.com/lib/kaplay.master.js`;
    } else {
        return `https://unpkg.com/kaplay@${version}/dist/kaboom.js`;
    }
};

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
<script>
    (function() {
        if (window.top && window.top.console) {
            const topConsole = window.top.console;

            window.console = {
                log: (...args) => topConsole.log("[game]", ...args),
                warn: (...args) => topConsole.warn("[game]", ...args),
                error: (...args) => topConsole.error("[game]", ...args),
                info: (...args) => topConsole.info("[game]", ...args),
                debug: (...args) => topConsole.debug("[game]", ...args),
                trace: (...args) => topConsole.trace("[game]", ...args),
                clear: () => topConsole.clear(),
            };
            
        }
    })();
</script>

<script src="${getVersion()}"></script>
<script type="module">
    ${parseAssets(code)}
</script>
</body>
`;

const transformAssetUrl = (regex: RegExp, code: string) => {
    const { project: { assets: resources } } = useProject.getState();

    const x = code.replace(regex, (match, asset: string) => {
        debug(
            0,
            "[compiler] Transforming urls, asset matched:",
            asset.slice(0, 25),
        );

        let transformedAsset = asset;

        // remove first / and last / from asset, also remove "assets" from asset
        const resource = asset.replace(/^\/|\/$/g, "").replace(
            "assets/",
            "",
        ).replace(/"/g, "");

        if (resources.has(resource)) {
            debug(
                0,
                "[compiler] Resource found:",
                resources.get(resource)?.url.slice(0, 25) + "...",
            );
            transformedAsset = resources.get(resource)?.url!;
        } else {
            debug(0, "No resource found for", resource.slice(0, 25) + "...");
        }

        const crewResource = asset.replace(/^\/|\/$/g, "").replace(
            "crew/",
            "",
        ).replace(/"/g, "").replace(".png", "");

        const crewResourceWithoutOutlineIndicator = crewResource.replace(
            "-o",
            "",
        );
        const prop = crewResource.endsWith("-o") ? "outlined" : "sprite";

        const assetResource =
            assets[crewResourceWithoutOutlineIndicator as keyof typeof assets];

        if (assetResource) {
            debug(0, "[assets] Crew found for", crewResource);
            transformedAsset = assetResource[prop]!;
        } else {
            debug(0, "[assets] Crew not found for", crewResource);
        }

        return match.replace(
            asset,
            transformedAsset,
        );
    });

    return x;
};

export const parseAssets = (code: string) => {
    const regexLoad = /load\w+\(\s*"[^"]*",\s*"([^"]*)"\s*/g;
    const regexComment = /\/\/\s*kaplay-transformation-asset\s*(.*)/g;

    const codeTransformed = transformAssetUrl(
        regexLoad,
        transformAssetUrl(regexComment, code),
    );

    // debug(2, "[compiler] Compiled, new code:", codeTransformed);

    return codeTransformed;
};
