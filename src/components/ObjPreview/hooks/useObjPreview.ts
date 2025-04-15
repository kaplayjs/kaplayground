import { create } from "zustand";
import { useProject } from "../../../hooks/useProject.ts";
import { wrapObj } from "../../../util/compiler.ts";
import { debug } from "../../../util/logs.ts";
import { useEditor } from "../../Editor/hooks/useEditor.ts";

type ObjPreviewData = {
    /** The object to preview */
    object: string | null;
    /** The object params to run the preview */
    objParams: Record<string, { value: any }>;
    /** The object params to display in preview window */
    objParamsData: Record<string, {}>;
    /** If the preview is hidden */
    hidden: boolean;
};

type ObjPreviewStore = {
    previewData: ObjPreviewData;
    setPreviewData: (data: Partial<ObjPreviewData>) => void;
    /** Execute the preview obj in the current object file */
    runPreview(): void;
    /** Update the object of the preview */
    updateObj(): void;
    /** Update the object params associated to the preview window */
    updateObjParams(): void;
};

export const useObjPreview = create<ObjPreviewStore>((set, get) => ({
    previewData: {
        object: null,
        hidden: true,
        objParams: {},
        objParamsData: {},
    },
    setPreviewData: (data) => {
        set((state) => ({
            previewData: {
                ...state.previewData,
                ...data,
            },
        }));
    },
    runPreview: () => {
        const object = get().previewData.object;
        const previewIframe = document.querySelector<HTMLIFrameElement>(
            "#gameobj-preview",
        )!;
        const {
            getKAPLAYFile,
            getAssetsFile,
            getProject,
        } = useProject.getState();
        const objParams = get().previewData.objParams;

        if (!object || !previewIframe) {
            console.error("No object to preview or no preview iframe");
            return;
        }

        const fileName = object + ".js";
        const funcRegex = new RegExp(`\\badd[_]?${object}\\b`, "gi");

        let assetsFile = getAssetsFile()?.value ?? "";
        let KAPLAYFile = getKAPLAYFile()?.value ?? "";
        let otherObjectsFiles = "";
        let objFile = "";

        getProject().files.forEach((file) => {
            if (file.kind == "obj") {
                if (file.name == fileName) {
                    objFile = `\n${file.value}\n`;
                } else {
                    otherObjectsFiles += `\n${file.value}\n`;
                }
            }
        });

        const funcToRun = objFile.match(funcRegex)?.[0];

        if (!funcToRun) {
            debug(0, "[obj preview] can't run");
            return;
        }

        const objPreviewFile = `${objFile}\n${funcToRun}(${
            Object.keys(objParams).map((param) => {
                return objParams[param].value;
            })
        })`;

        const files = [
            KAPLAYFile,
            assetsFile,
            otherObjectsFiles,
            objPreviewFile,
        ];

        console.log(files.join("\n"));

        previewIframe.srcdoc = wrapObj(files.join("\n"));
    },
    updateObjParams() {
        const object = get().previewData.object;
        const fileName = object + ".js";
        const { getProject } = useProject.getState();
        let objParams: Record<string, any> = {};

        getProject().files.forEach((file) => {
            if (file.kind == "obj" && file.name == fileName) {
                const match = file.value.match(/function\s+\w+\s*\(([^)]*)\)/);
                if (!match) return;
                const params = match[1].split(", ");

                for (const param of params) {
                    objParams[param] = {};
                }
            }
        });

        set((state) => ({
            previewData: {
                ...state.previewData,
                objParamsData: objParams,
            },
        }));
    },
    updateObj() {
        const currentFile = useEditor.getState().runtime.currentFile;
        const object = currentFile.slice(8, -3); // Remove "objects/" and ".js"

        set((state) => ({
            previewData: {
                ...state.previewData,
                object,
            },
        }));

        get().updateObjParams();
    },
}));
