import type { FC } from "react";
import { useObjPreview } from "../hooks/useObjPreview.ts";

export interface ObjPreviewGenericParamProps {
    name: string;
}

export const ObjPreviewGenericParam: FC<ObjPreviewGenericParamProps> = (
    props,
) => {
    const { setPreviewData, previewData } = useObjPreview();

    return (
        <label className="input input-sm flex items-center gap-2">
            {props.name}
            <input
                type="text"
                className="grow"
                placeholder="bean"
                onChange={(e) => {
                    let newValue = e.target.value;

                    setPreviewData({
                        objParams: {
                            ...previewData.objParams,
                            [props.name]: {
                                value: `"${newValue}"`,
                            },
                        },
                    });
                }}
            />
        </label>
    );
};
