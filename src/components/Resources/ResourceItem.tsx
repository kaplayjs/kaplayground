import * as ContextMenu from "@radix-ui/react-context-menu";
import React, { type FC } from "react";
import { useAssets } from "../../hooks/useAssets";
import { useProject } from "../../hooks/useProject";
import type { Asset } from "../../stores/storage/assets";
import { removeExtension } from "../../util/removeExtensions";

export type ResourceProps = {
    asset: Asset;
    visibleIcon?: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const ResourceItem: FC<ResourceProps> = ({
    asset,
    visibleIcon,
    onDragData,
}) => {
    const { removeAsset } = useAssets({
        kind: asset.kind,
    });
    const { updateFile, getAssetsFile } = useProject();

    const handleResourceDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const assetName = removeExtension(e.currentTarget.dataset.label!);
        const assetUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `${onDragData(assetName, assetUrl!)}`,
        );
    };

    const handleResourceDelete = () => {
        removeAsset(asset.path);
    };

    const handleResourceLoad = () => {
        const assetsFile = getAssetsFile();
        if (!assetsFile) return;

        const newAssetsFile = assetsFile.value + `\n${asset.importFunction}`;

        updateFile("assets.js", newAssetsFile);
    };

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger
                draggable={false}
                id={asset.name}
                data-label={asset.name}
                data-url={asset.url}
                onDragStartCapture={handleResourceDrag}
            >
                <li>
                    <div className="p-2 hover:bg-base-300">
                        <img
                            draggable={false}
                            src={visibleIcon ?? asset.url}
                            alt={`Asset ${asset.name}`}
                            className="h-12 w-12 object-scale-down"
                        />
                        <p className="text-xs text-center text-gray-500">
                            {removeExtension(asset.name)
                                .slice(
                                    0,
                                    10,
                                )}
                        </p>
                    </div>
                </li>
            </ContextMenu.Trigger>

            <ContextMenu.Portal>
                <ContextMenu.Content className="rounded-btn | bg-base-300 | flex flex-col">
                    <ContextMenu.Item
                        className="btn btn-ghost justify-start"
                        onClick={handleResourceDelete}
                    >
                        Delete
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        className="btn btn-ghost justify-start"
                        onClick={handleResourceLoad}
                    >
                        Load Resource
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};

export default ResourceItem;
