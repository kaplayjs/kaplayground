import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import addSriteIcon from "../../assets/add_sprite_icon.png";
import { type Asset, useAssets } from "../../hooks/useAssets";
import AboutDialog from "../About/AboutDialog";

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
        ...assets.filter((asset) => asset.kind === props.kind),
    ]);

    useEffect(() => {
        setVisibles(assets.filter((asset) => asset.kind === props.kind));
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
        <div className="flex flex-col justify-between p-4 w-full h-full">
            <ul
                className="flex-1 | flex flex-row gap-6 overflow-y-auto flex-wrap h-[80%] content-start"
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
                                {removeExtension(asset.name).slice(0, 10)}
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
            <AboutDialog />
        </div>
    );
};

export default AssetsTab;
