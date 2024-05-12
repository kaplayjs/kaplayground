import { useProject } from "@/hooks/useProject";
import { forwardRef, useImperativeHandle, useRef } from "react";

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
        }
        </style>
</head>
<body>
<script src="https://unpkg.com/kaboom/dist/kaboom.js"></script>
<script>
    ${code}
</script>
</body>
`;

type GameViewProps = {
    code: string;
    onLoad?: () => void;
};

export type GameViewRef = {
    run: () => void;
};

const GameView = forwardRef<GameViewRef, GameViewProps>(({
    code,
    onLoad,
}, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [files] = useProject((state) => [
        state.project.files,
    ]);

    useImperativeHandle(ref, () => ({
        run() {
            if (!iframeRef.current) return;
            const iframe = iframeRef.current;

            let kaboomFile = "";
            let sceneFiles = "";

            files.forEach((file) => {
                if (file.kind === "kaboom") {
                    kaboomFile = file.value;
                } else if (file.kind === "scene") {
                    sceneFiles += `\n${file.value}\n`;
                }
            });

            iframe.srcdoc = wrapGame(kaboomFile + sceneFiles);
            console.log(wrapGame(kaboomFile + sceneFiles));
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
            srcDoc={wrapGame(code ?? "")}
            sandbox="allow-scripts"
        />
    );
});

GameView.displayName = "GameView";

export default GameView;
