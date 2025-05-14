import * as monaco from "monaco-editor";
import { useConfig } from "../../../../hooks/useConfig";
import { useEditor } from "../../../../hooks/useEditor";

export const formatAction = (
    editor: monaco.editor.IStandaloneCodeEditor,
): monaco.editor.IActionDescriptor => ({
    id: "format-kaplay",
    label: "Format file using KAPLAYGROUND",
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1.5,
    run: () => {
        editor.getAction("editor.action.formatDocument")?.run();
        const canvas = useEditor.getState().runtime.confettiCanvas;

        if (!canvas) {
            throw new Error("Canvas not found");
        }

        if (!useConfig.getState().config.funFormat) return;

        var duration = 0.5 * 1000;
        var animationEnd = Date.now() + duration;

        (function frame() {
            var timeLeft = animationEnd - Date.now();

            canvas.confetti({
                particleCount: 3,
                spread: 1,
                origin: {
                    x: Math.random(),
                    y: -0.05,
                },
                angle: 270,
                startVelocity: 10,
                gravity: 0.5,
                ticks: 50,
                colors: ["#fcef8d", "#abdd64", "#d46eb3"],
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
    },
});
