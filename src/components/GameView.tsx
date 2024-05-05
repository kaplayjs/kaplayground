import * as React from "react";
import { useUpdateEffect } from "../hooks/useUpdateEffect";

export type GameViewRef = {
    run: (code: string) => void;
    send: (msg: any, origin?: string) => void;
};

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
			background: var(--color-bg2);
		}
	</style>
</head>
<body>
	<script src="https://unpkg.com/kaboom/dist/kaboom.js"></script>
	<script type="module">
		${code}
	</script>
</body>
`;

type GameViewProps = {
    code: string;
    onLoad?: () => void;
};

const GameView = React.forwardRef<GameViewRef, GameViewProps>(({
    code,
    onLoad,
    ...args
}, ref) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useImperativeHandle(ref, () => ({
        run(code: string, msg?: any) {
            if (!iframeRef.current) return;
            const iframe = iframeRef.current;
            iframe.srcdoc = wrapGame(code);
        },
        send(msg: any, origin: string = "*") {
            if (!iframeRef.current) return;
            const iframe = iframeRef.current;
            iframe.contentWindow?.postMessage(JSON.stringify(msg), origin);
        },
    }));

    useUpdateEffect(() => {
        if (!iframeRef.current) return;
        const iframe = iframeRef.current;
        iframe.srcdoc = wrapGame(code);
    }, [code]);

    return (
        <iframe
            ref={iframeRef}
            tabIndex={0}
            onLoad={onLoad}
            style={{
                border: "none",
                width: "100%",
            }}
            srcDoc={wrapGame(code ?? "")}
        />
    );
});

GameView.displayName = "GameView";

export default GameView;
