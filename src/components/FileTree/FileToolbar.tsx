import { assets } from "@kaplayjs/crew";
import type { FC, PropsWithChildren } from "react";
import { useProject } from "../../hooks/useProject";
import { type FileKind, folderByKind } from "../../stores/storage/files";

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
    const { addFile, getFile } = useProject();

    const handleAddFile = () => {
        const fileName = prompt("File name");
        if (!fileName) return;
        if (getFile(`${folderByKind[props.kind]}/${fileName}.js`)) return;

        addFile({
            name: fileName + ".js",
            kind: props.kind,
            value: templateByKind(fileName)[props.kind],
            language: "javascript",
            path: `${folderByKind[props.kind]}/${fileName}.js`,
        });
    };

    return (
        <div className="flex" role="toolbar">
            <button
                className="btn btn-ghost btn-xs rounded-sm px-1"
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
