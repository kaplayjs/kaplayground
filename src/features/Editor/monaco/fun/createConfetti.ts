import confetti from "canvas-confetti";

export const createConfetti = () => {
    // Create canvas
    const canvas = document.createElement("canvas") as HTMLCanvasElement & {
        confetti: confetti.CreateTypes;
    };

    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none"; // Prevent interactions
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    document.getElementById("monaco-editor-wrapper")!.appendChild(canvas);

    // Confetti thing setup
    canvas.confetti = confetti.create(canvas, { resize: true });

    return canvas;
};
