import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import addSriteIcon from "../../assets/add_sprite_icon.png";
import { type Asset, useAssets } from "../../hooks/useAssets";

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
    kind: "sprite" | "sound";
    visibleIcon?: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const AssetsTab: FC<AssetsTabProps> = (props) => {
    const [assets, addAsset] = useAssets((state) => [
        state.assets,
        state.addAsset,
    ]);
    const [parent, visibles, setVisibles] = useDragAndDrop<
        HTMLUListElement,
        Asset
    >([
        ...Array.from(assets).filter(([, asset]) => asset.kind === props.kind),
    ].map(([_, asset]) => asset));

    useEffect(() => {
        setVisibles(
            Array.from(assets).filter(([, asset]) => asset.kind === props.kind)
                .map(([_, asset]) => asset),
        );
    }, [assets]);

    const handleAssetUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;

        if (!files) {
            return;
        }

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

    const handleDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const assetName = removeExtension(e.currentTarget.dataset.label!);
        const assetUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `${props.onDragData(assetName, assetUrl!)}`,
        );
    };

    return (
        <div className="flex justify-between items-center h-full px-8">
            <ul
                className="flex flex-row gap-6 overflow-x-auto max-w-[80%] h-full py-8"
                ref={parent}
            >
                {visibles.map((asset, i) => (
                    <li
                        key={asset.name}
                        data-label={asset.name}
                        data-url={asset.url}
                        onDragStartCapture={handleDrag}
                    >
                        <div>
                            <img
                                draggable={false}
                                src={props.visibleIcon ?? asset.url}
                                alt={`Asset ${i}`}
                                className="h-12 w-12 object-scale-down"
                                style={{
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    MozWindowDragging: "no-drag",
                                }}
                            />
                            <p className="text-sm text-center text-gray-500">
                                {removeExtension(asset.name)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
            <label className="">
                <p className="sr-only">Add sprite</p>
                <div className="btn btn-primary px-2">
                    <img
                        src={addSriteIcon.src}
                        alt="Add sprite"
                        className="w-8 h-8"
                    />
                </div>
                <input
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
    );
};

export default AssetsTab;
