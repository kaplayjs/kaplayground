import { forwardRef, useImperativeHandle, useRef } from "react";
import { useProject } from "../../hooks/useProject";

const wrapGame = (code: string) => `
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
    ${code}
</script>
</body>
`;

type GameViewProps = {
    onLoad?: () => void;
};

export type GameViewRef = {
    run: () => void;
};

const GameView = forwardRef<GameViewRef, GameViewProps>(({
    onLoad,
}, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const {
        getMainFile,
        project: { files, resources },
        getKAPLAYFile,
        getProjectMode,
        getAssetsFile,
    } = useProject();

    const transformAssetUrl = (regex: RegExp, code: string) => {
        return code.replace(regex, (match, asset: string) => {
            // remove first / and last / from asset, also remove "assets" from asset
            const normalizeAsset = asset.replace(/^\/|\/$/g, "").replace(
                "assets/",
                "",
            ).replace(/"/g, "");
            console.log(normalizeAsset);

            return match.replace(
                asset,
                resources[normalizeAsset]?.url ?? asset,
            );
        });
    };

    const parseAssets = (code: string) => {
        const regexLoad = /load\w+\(\s*"[^"]*",\s*"([^"]*)"\s*\)/g;
        const regexComment = /\/\/\s*kaplay-transformation-asset\s*(.*)/g;

        console.log(
            transformAssetUrl(regexLoad, transformAssetUrl(regexComment, code)),
        );

        return code.replace(regexLoad, (match, asset: string) => {
            // remove first / and last / from asset, also remove "assets" from asset
            const normalizeAsset = asset.replace(/^\/|\/$/g, "").replace(
                "assets/",
                "",
            );

            return match.replace(
                asset,
                resources[normalizeAsset]?.url ?? asset,
            );
        });
    };

    useImperativeHandle(ref, () => ({
        run() {
            if (!iframeRef.current) return;
            const iframe = iframeRef.current;

            let KAPLAYFile = "";
            let mainFile = "";
            let assetsFile = "";
            let sceneFiles = "";
            let parsedFiles = "";

            KAPLAYFile = getKAPLAYFile()?.value ?? "";
            mainFile = getMainFile()?.value ?? "";
            assetsFile = getAssetsFile()?.value ?? "";

            files.forEach((file) => {
                if (file.kind !== "scene") return;

                sceneFiles += `\n${file.value}\n`;
            });

            if (getProjectMode() === "project") {
                parsedFiles = KAPLAYFile + assetsFile + sceneFiles + mainFile;
            } else {
                parsedFiles = mainFile;
            }

            const finalCode = parseAssets(parsedFiles);
            iframe.srcdoc = wrapGame(finalCode);
        },
    }));

    return (
        <iframe
            ref={iframeRef}
            tabIndex={0}
            onLoad={onLoad}
            style={{
                border: "none",
                width: "100%",
                height: "100%",
            }}
            sandbox="allow-scripts"
        />
    );
});

GameView.displayName = "GameView";

export default GameView;
