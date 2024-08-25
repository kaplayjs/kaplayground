import { useAssets } from "@/hooks/useAssets";
import type { ProjectAsset } from "@/stores/assets";
import { removeExtension } from "@/util/removeExtensions";
import * as ContextMenu from "@radix-ui/react-context-menu";
import React, { type FC } from "react";

export type ResourceProps = {
    asset: ProjectAsset;
    visibleIcon?: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const Resource: FC<ResourceProps> = ({ asset, visibleIcon, onDragData }) => {
    const { removeAsset } = useAssets({ kind: asset.kind });

    const handleAssetDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const assetName = removeExtension(e.currentTarget.dataset.label!);
        const assetUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `${onDragData(assetName, assetUrl!)}`,
        );
    };

    const handleResourceImport = () => {
        console.log("Import", asset.name);
    };

    const handleResourceDelete = () => {
        removeAsset(asset.id);
    };

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger data-resource={asset.name}>
                <li
                    id={asset.name}
                    key={asset.name}
                    data-label={asset.name}
                    data-url={asset.url}
                    onDragStartCapture={handleAssetDrag}
                >
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
                        onClick={handleResourceImport}
                    >
                        Import in code
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        className="btn btn-ghost justify-start"
                        onClick={handleResourceDelete}
                    >
                        Delete
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};

export default Resource;
