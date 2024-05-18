import addSriteIcon from "@/assets/add_sprite_icon.png";
import { type AssetKind, useProject } from "@/hooks/useProject";
import { type Asset } from "@/hooks/useProject";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import Dropzone from "react-dropzone";

const removeExtension = (filename: string) => {
    return filename.split(".").slice(0, -1).join(".");
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            resolve(e.target?.result as string);
        };

        reader.readAsDataURL(file);
    });
};

type AssetsTabProps = {
    kind: AssetKind;
    visibleIcon?: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const AssetsTab: FC<AssetsTabProps> = (props) => {
    const [assets, addAsset] = useProject((state) => [
        state.project.assets,
        state.addAsset,
    ]);

    const [parent, visibles, setVisibles] = useDragAndDrop<
        HTMLUListElement,
        Asset
    >([
        ...assets.filter((asset) => asset.kind === props.kind),
    ]);

    useEffect(() => {
        setVisibles(assets.filter((asset) => asset.kind === props.kind));
    }, [assets]);

    const handleAssetDrop = async (files: any[]) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const base64 = await fileToBase64(file);

            addAsset({
                name: file.name,
                url: base64,
                kind: props.kind,
            });
        }
    };

    const handleAssetUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;

        if (!files) {
            return;
        }

        await handleAssetDrop(Array.from(files));
    };

    const handleDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const assetName = removeExtension(e.currentTarget.dataset.label!);
        const assetUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `${props.onDragData(assetName, assetUrl!)}`,
        );
    };

    return (
        <Dropzone onDrop={handleAssetDrop}>
            {({ getRootProps, getInputProps }) => (
                <div
                    className="h-full p-2"
                    {...getRootProps()}
                >
                    <div className="max-h-full">
                        <ul
                            className="flex flex-row gap-6 flex-wrap content-start max-h-fi h-full overflow-auto"
                            ref={parent}
                        >
                            {visibles.map((asset, i) => (
                                <li
                                    key={asset.name}
                                    data-label={asset.name}
                                    data-url={asset.url}
                                    onDragStartCapture={handleDrag}
                                    className="h-12"
                                >
                                    <div className="h-12 w-12">
                                        <img
                                            draggable={false}
                                            src={props.visibleIcon ?? asset.url}
                                            alt={`Asset ${i}`}
                                            className="h-12 w-12 object-scale-down"
                                        />
                                        <p className="text-xs text-center text-gray-500">
                                            {removeExtension(asset.name).slice(
                                                0,
                                                10,
                                            )}
                                        </p>
                                    </div>
                                </li>
                            ))}
                            <li>
                                <div>
                                    <label>
                                        <div className="btn btn-primary px-2">
                                            <img
                                                src={addSriteIcon.src}
                                                alt="Add sprite"
                                                className="w-8 h-8"
                                            />
                                        </div>
                                        <input
                                            {...getInputProps()}
                                            className="hidden"
                                            type="file"
                                            accept={props.kind === "sprite"
                                                ? "image/*"
                                                : "audio/*"}
                                            onChange={handleAssetUpload}
                                            multiple
                                        />
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Dropzone>
    );
};

export default AssetsTab;
