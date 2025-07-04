import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
import type { FileKind } from "../../features/Projects/models/FileKind";
import { folderByKind } from "../../features/Projects/stores/slices/files";
import { useProject } from "../../features/Projects/stores/useProject";
import { prompt } from "../../util/prompt";

type Props = PropsWithChildren<{
    kind: FileKind;
}>;

const templateByKind = (fileName: string): Record<FileKind, string> => ({
    assets: `// User can't create this`,
    kaplay: `// User can't create this`,
    main: `// User can't create this`,
    scene: `scene("${fileName}", () => {\n\n});\n`,
    obj: `function add${fileName}() {\n\n}\n`,
    util: `function ${fileName}() {\n\n}\n`,
});

export const FileToolbar: FC<Props> = (props) => {
    const addFile = useProject((s) => s.addFile);
    const getFile = useProject((s) => s.getFile);

    const handleAddFile = async () => {
        const fileName = await prompt(
            `New ${props.kind == "obj" ? "object" : props.kind} name`,
            null,
            null,
            {
                suffix: ".js",
                confirmText: "Create",
            },
        );
        if (!fileName) return;
        if (getFile(`${folderByKind[props.kind]}/${fileName}.js`)) return;

        addFile({
            kind: props.kind,
            value: templateByKind(fileName)[props.kind],
            language: "javascript",
            path: `${folderByKind[props.kind]}/${fileName}.js`,
        });
    };

    return (
        <div className="flex" role="toolbar">
            <button
                className="btn btn-ghost btn-xs rounded-md px-1"
                onClick={handleAddFile}
            >
                <img
                    src={assets.plus.outlined}
                    alt="Add Scene"
                    className="h-4"
                />
            </button>

            {props.children}
        </div>
    );
};
