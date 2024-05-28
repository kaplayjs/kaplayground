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
            background: #171212;
        }
        </style>
</head>
<body>
<script src="/kaboom.js"></script>
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
    const [files, getKaboomFile, getMainFile] = useProject((state) => [
        state.project.files,
        state.getKaboomFile,
        state.getMainFile,
    ]);

    useImperativeHandle(ref, () => ({
        run() {
            if (!iframeRef.current) return;
            const iframe = iframeRef.current;

            let kaboomFile = "";
            let mainFile = "";
            let sceneFiles = "";

            kaboomFile = getKaboomFile()?.value ?? "";
            mainFile = getMainFile()?.value ?? "";

            files.forEach((file) => {
                if (file.kind !== "scene") return;

                sceneFiles += `\n${file.value}\n`;
            });

            const finalFiles = kaboomFile
                ? kaboomFile + sceneFiles + mainFile
                : mainFile + sceneFiles;

            iframe.srcdoc = wrapGame(finalFiles);
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
