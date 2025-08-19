import * as ContextMenu from "@radix-ui/react-context-menu";
import React, { type FC } from "react";
import type { Asset } from "../../features/Projects/models/Asset";
import { useProject } from "../../features/Projects/stores/useProject";
import { useEditor } from "../../hooks/useEditor";

export type ResourceProps = {
    asset: Asset;
    visibleIcon?: string;
};

const AssetsItem: FC<ResourceProps> = ({ asset, visibleIcon }) => {
    const removeAsset = useProject((s) => s.removeAsset);
    const updateFile = useProject((s) => s.updateFile);
    const getAssetsFile = useProject((s) => s.getAssetsFile);
    const update = useEditor((s) => s.update);

    const handleResourceDrag = (e: React.DragEvent<HTMLLIElement>) => {
        e.dataTransfer.setData("text", asset.importFunction);
    };

    const handleResourceDelete = () => {
        removeAsset(asset.path);
    };

    const handleResourceLoad = () => {
        const assetsFile = getAssetsFile();
        if (!assetsFile) return;

        const newAssetsFile = assetsFile.value + `\n${asset.importFunction}`;

        updateFile("assets.js", newAssetsFile);
        update();
    };

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger
                draggable={false}
                id={asset.name}
                data-label={asset.name}
                data-url={asset.url}
                data-tooltip-id="global"
                data-tooltip-content={asset.name}
                data-tooltip-place="top"
                data-tooltip-delay-show={300}
                onDragStartCapture={handleResourceDrag}
            >
                <li draggable>
                    <div className="p-2 rounded-lg hover:bg-base-300 cursor-grab h-20 w-20">
                        <img
                            draggable={false}
                            src={visibleIcon ?? asset.url}
                            alt={`Asset ${asset.name}`}
                            className="h-12 w-12 object-scale-down mx-auto"
                        />
                        <p className="text-xs text-center text-gray-500 truncate">
                            {asset.name}
                        </p>
                    </div>
                </li>
            </ContextMenu.Trigger>

            <ContextMenu.Portal>
                <ContextMenu.Content className="rounded-btn p-1 bg-base-300 flex flex-col">
                    <ContextMenu.Item
                        className="btn btn-sm btn-ghost justify-start rounded-md"
                        onClick={handleResourceDelete}
                    >
                        Delete
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        className="btn btn-sm btn-ghost justify-start rounded-md"
                        onClick={handleResourceLoad}
                    >
                        Load in assets.js
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
};

export default AssetsItem;
