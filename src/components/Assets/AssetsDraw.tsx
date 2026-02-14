import kaplay, { type KAPLAYCtx, type Vec2 } from "kaplay";
import { useEffect, useRef, useState } from "react";
import type { AssetKind } from "../../features/Projects/models/AssetKind";
import { useAssets } from "../../hooks/useAssets";

interface AssetsDrawProps {
    onClose: () => void;
    kind: AssetKind;
}

// Minimal Draw Action: Only supports freehand lines
type DrawLine = {
    points: Vec2[];
    color: string;
    width: number;
};

export const AssetsDraw = ({ onClose, kind }: AssetsDrawProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const kRef = useRef<KAPLAYCtx | null>(null);
    const { uploadAsset } = useAssets({ kind });

    // --- State ---
    const [fileName, setFileName] = useState(`drawing-${Date.now()}`);
    const [activeColor, setActiveColor] = useState("#ffffff");
    
    // --- Refs for syncing state to Kaplay loop ---
    // We use refs so `onDraw` and input handlers always see the latest state 
    // without needing to re-bind events or restart Kaplay.
    const colorRef = useRef(activeColor);
    const linesRef = useRef<DrawLine[]>([]);
    
    const isDrawingRef = useRef(false);
    const currentLineRef = useRef<Vec2[]>([]);

    const [canvasWidth, setCanvasWidth] = useState(512);
    const [canvasHeight, setCanvasHeight] = useState(512);

    // Debounce dimensions to prevent rapid re-initialization
    const [debouncedWidth, setDebouncedWidth] = useState(canvasWidth);
    const [debouncedHeight, setDebouncedHeight] = useState(canvasHeight);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedWidth(canvasWidth);
            setDebouncedHeight(canvasHeight);
        }, 500);
        return () => clearTimeout(timer);
    }, [canvasWidth, canvasHeight]);



    // Sync active color to ref
    useEffect(() => {
        colorRef.current = activeColor;
    }, [activeColor]);

    // --- Initialize Kaplay ---
    useEffect(() => {
        if (!containerRef.current) return;

        // Cleanup previous instance if exists
        if (kRef.current) {
            try { kRef.current.quit(); } catch (e) { console.error(e); }
        }

        const k = kaplay({
            root: containerRef.current,
            // Use container dimensions
            width: debouncedWidth,
            height: debouncedHeight,
            background: [0, 0, 0, 0], // Transparent for saved image
            global: false,            // Scoped instance
            preserveDrawingBuffer: true, // Required for toDataURL()
            debug: false,
        } as any);

        // Set visual background for the editor (does not affect saved image)
        k.canvas.style.backgroundColor = "rgb(50, 50, 50)";
        
        kRef.current = k;

        // --- Input Handling ---
        
        // Start Drawing
        k.onMousePress(() => {
            isDrawingRef.current = true;
            // Start a new line with the current mouse position
            currentLineRef.current = [k.mousePos()];
        });

        // Continue Drawing
        k.onUpdate(() => {
            if (!isDrawingRef.current) return;
            
            const mousePos = k.mousePos();
            const currentLine = currentLineRef.current;
            
            // Add point if moved far enough (simple optimization)
            if (currentLine.length === 0 || mousePos.dist(currentLine[currentLine.length - 1]) > 2) {
                currentLine.push(mousePos);
            }
        });

        // Stop Drawing
        k.onMouseRelease(() => {
            if (!isDrawingRef.current) return;
            isDrawingRef.current = false;

            // Commit the finished line
            if (currentLineRef.current.length > 0) {
                linesRef.current.push({
                    points: [...currentLineRef.current],
                    color: colorRef.current,
                    width: 4, // Fixed width for simplicity, as requested
                });
            }
            currentLineRef.current = [];
        });

        // --- Render Loop ---
        k.onDraw(() => {
            // 1. Draw all committed lines
            linesRef.current.forEach(line => {
                drawStroke(k, line.points, line.color, line.width);
            });

            // 2. Draw current active line (preview)
            if (isDrawingRef.current && currentLineRef.current.length > 0) {
                drawStroke(k, currentLineRef.current, colorRef.current, 4);
            }
            
            // 3. Draw clean cursor
            k.drawCircle({
                pos: k.mousePos(),
                radius: 2, // Half of width 4
                color: k.Color.fromHex(colorRef.current),
                opacity: 0.5
            });
        });

        // Helper to draw a set of points as a continuous line
        function drawStroke(ctx: KAPLAYCtx, points: Vec2[], colorHex: string, width: number) {
            if (points.length < 2) {
                // Draw a dot if it's just a single point
                if (points.length === 1) {
                    ctx.drawCircle({
                        pos: points[0],
                        radius: width / 2,
                        color: ctx.Color.fromHex(colorHex),
                    });
                }
                return;
            }

            ctx.drawLines({
                pts: points,
                width: width,
                color: ctx.Color.fromHex(colorHex),
                join: "round",
                cap: "round",
            });
        }

        return () => {
             // Cleanup on unmount
            try { k.quit(); } catch (e) { console.error(e); }
            kRef.current = null;
        };
    }, [debouncedWidth, debouncedHeight]); // Re-run when dimensions change

    // --- Save Functionality ---
    // --- Save Functionality ---
    const handleSave = async () => {
        if (!kRef.current) return;

        try {
            // Capture canvas state
            const dataUrl = kRef.current.canvas.toDataURL("image/png");
            
            // Upload
            await uploadAsset({ 
                name: fileName, 
                kind, 
                path: `assets/${kind}s/${fileName}.png`, 
                url: dataUrl 
            });
            
            onClose();
        } catch (e) {
            console.error("Save failed:", e);
            alert("Failed to save drawing.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-base-100 w-[95vw] h-[90vh] flex flex-col rounded-lg overflow-hidden shadow-2xl">
                
                {/* Header / Toolbar */}
                <div className="h-14 bg-base-200 border-b border-base-300 flex items-center px-4 gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-base-content">Drawing Tool</span>
                        
                        {/* Tool: Color Picker */}
                        <div className="flex items-center gap-2 bg-base-100 px-3 py-1.5 rounded-full border border-base-300">
                            <span className="text-xs uppercase font-bold text-base-content/70">Color</span>
                            <input 
                                type="color" 
                                value={activeColor} 
                                onChange={(e) => setActiveColor(e.target.value)}
                                className="w-6 h-6 rounded-full overflow-hidden cursor-pointer border-0 p-0"
                            />
                        </div>
                        
                        

                        <div className="flex items-center gap-2 bg-base-100 px-3 py-1.5 rounded-full border border-base-300">
                            <div className="flex items-center gap-2 bg-base-100 px-3 py-1.5 rounded-full border border-base-300">
                                <span className="text-xs uppercase font-bold text-base-content/70">Width</span>
                                <input 
                                    type="number" 
                                    value={canvasWidth} 
                                    onChange={(e) => setCanvasWidth(Number(e.target.value))} 
                                    className="input input-sm input-bordered w-48 text-right"
                                    placeholder="Width"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-base-100 px-3 py-1.5 rounded-full border border-base-300">
                                <span className="text-xs uppercase font-bold text-base-content/70">Height</span>
                                <input 
                                    type="number" 
                                    value={canvasHeight} 
                                    onChange={(e) => setCanvasHeight(Number(e.target.value))} 
                                    className="input input-sm input-bordered w-48 text-right"
                                    placeholder="Height"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={fileName} 
                            onChange={(e) => setFileName(e.target.value)} 
                            className="input input-sm input-bordered w-48 text-right"
                            placeholder="Filename"
                        />
                        <button onClick={handleSave} className="btn btn-sm btn-primary">Save</button>
                        <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle">✕</button>
                    </div>
                </div>

                {/* Canvas Container */}
                <div className="flex-1 relative bg-base-300 overflow-hidden cursor-crosshair">
                   <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
                </div>
            </div>
        </div>
    );
};