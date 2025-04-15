import { useState } from "react";
import { Rnd } from "react-rnd";
import { useObjPreview } from "./hooks/useObjPreview.ts";
import { ObjPreviewParams } from "./ObjPreviewParams.tsx";

export const ObjPreview = () => {
    const [x, setX] = useState(100);
    const [y, setY] = useState(400);
    const [w, setW] = useState(200);
    const [h, setH] = useState(200);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const { previewData, runPreview: run } = useObjPreview();

    return (
        <>
            {!previewData.hidden && (
                <Rnd
                    className="bg-base-200"
                    default={{
                        x: x,
                        y: y,
                        width: w,
                        height: h,
                    }}
                    bounds={document.getElementById("monaco-editor-wrapper")!}
                    style={{
                        padding: "10px",
                        borderRadius: "0.75rem",
                        border: "1px solid #3A3F47",
                    }}
                    onDrag={(_, d) => {
                        setX(d.x);
                        setY(d.y);
                    }}
                    onDragStart={() => setDragging(true)}
                    onDragStop={() => {
                        setDragging(false);
                        run();
                    }}
                    onResize={(_e, _direction, ref, _delta, position) => {
                        setW(ref.offsetWidth);
                        setH(ref.offsetHeight);
                        setX(position.x);
                        setY(position.y);
                    }}
                    onResizeStart={() => setResizing(true)}
                    onResizeStop={() => {
                        setResizing(false);
                        run();
                    }}
                >
                    <div className="w-full h-full flex flex-col">
                        <div id="obj-preview-toolbar bg-base-300">
                            <button className="btn btn-ghost rounded-xl">
                                Run
                            </button>
                        </div>

                        <iframe
                            style={{
                                border: "none",
                            }}
                            width={"100%"}
                            height={"100%"}
                            id="gameobj-preview"
                            hidden={dragging || resizing}
                        >
                        </iframe>

                        <ObjPreviewParams />
                    </div>
                </Rnd>
            )}
        </>
    );
};
