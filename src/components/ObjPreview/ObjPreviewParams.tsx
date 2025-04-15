import { useObjPreview } from "./hooks/useObjPreview.ts";
import { ObjPreviewGenericParam } from "./params/ObjPreviewGenericParam.tsx";

export const ObjPreviewParams = () => {
    const { previewData } = useObjPreview();

    return (
        <div
            className="w-full bg-base-100"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            {Object.keys(previewData.objParamsData).map((data) => (
                <ObjPreviewGenericParam name={data} key={data} />
            ))}
        </div>
    );
};
