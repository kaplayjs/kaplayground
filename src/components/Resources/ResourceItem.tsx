import * as ContextMenu from "@radix-ui/react-context-menu";
import React, { type FC } from "react";
import { useResources } from "../../hooks/useResources";
import type { Resource } from "../../stores/storage/resoures";
import { removeExtension } from "../../util/removeExtensions";

export type ResourceProps = {
    resource: Resource;
    visibleIcon?: string;
    onDragData: (assetName: string, assetUrl: string) => string;
};

const ResourceItem: FC<ResourceProps> = ({
    resource,
    visibleIcon,
    onDragData,
}) => {
    const { removeResource } = useResources({ kind: resource.kind });

    const handleResourceDrag = (e: React.DragEvent<HTMLLIElement>) => {
        const assetName = removeExtension(e.currentTarget.dataset.label!);
        const assetUrl = e.currentTarget.dataset.url;

        e.dataTransfer.setData(
            "text",
            `${onDragData(assetName, assetUrl!)}`,
        );
    };

    const handleResourceDelete = () => {
        removeResource(resource.id);
    };

    const handleResourceLoad = () => {
        console.log("Load Resource");
    };

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger
                draggable={false}
                id={resource.name}
                data-label={resource.name}
                data-url={resource.url}
                onDragStartCapture={handleResourceDrag}
            >
                <li>
                    <div className="p-2 hover:bg-base-300">
                        <img
                            draggable={false}
                            src={visibleIcon ?? resource.url}
                            alt={`Asset ${resource.name}`}
                            className="h-12 w-12 object-scale-down"
                        />
                        <p className="text-xs text-center text-gray-500">
                            {removeExtension(resource.name)
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
