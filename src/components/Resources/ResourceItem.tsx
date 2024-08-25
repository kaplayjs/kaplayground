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

    const handleResourceImport = () => {
        console.log("Import", resource.name);
    };

    const handleResourceDelete = () => {
        removeResource(resource.id);
    };

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger data-resource={resource.name}>
                <li
                    id={resource.name}
                    key={resource.name}
                    data-label={resource.name}
                    data-url={resource.url}
                    onDragStartCapture={handleResourceDrag}
                >
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

export default ResourceItem;
