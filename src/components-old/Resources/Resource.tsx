import type { Asset } from "@/stores/project/assets";
import { removeExtension } from "@/util/removeExtensions";
import React, { type FC } from "react";

export type ResourceProps = {
    asset: Asset;
    visibleIcon?: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const Resource: FC<ResourceProps> = ({ asset, visibleIcon, onDragData }) => {
    const handleAssetDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const assetName = removeExtension(e.currentTarget.dataset.label!);
        const assetUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `${onDragData(assetName, assetUrl!)}`,
        );
    };

    return (
        <li
            key={asset.name}
            data-label={asset.name}
            data-url={asset.url}
            onDragStartCapture={handleAssetDrag}
        >
            <div>
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
    );
};

export default Resource;
