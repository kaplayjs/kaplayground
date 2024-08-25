import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import { useResources } from "../../hooks/useResources";
import type { Resource, ResourceKind } from "../../stores/storage/resoures";
import type { ResourceProps } from "./ResourceItem";
import ResourceItem from "./ResourceItem";

type Props = Omit<ResourceProps, "resource"> & {
    kind: ResourceKind;
};

const ResourcesList: FC<Props> = ({ kind, onDragData, visibleIcon }) => {
    const { resources } = useResources({ kind });
    const [
        parent,
        draggableAssets,
        setDraggableAssets,
    ] = useDragAndDrop<HTMLUListElement, Resource>(resources);

    useEffect(() => {
        setDraggableAssets(resources);
    }, [resources]);

    return (
        <ul
            ref={parent}
            className="inline-flex flex-wrap gap-6 content-start overflow-auto max-h-44"
        >
            {draggableAssets.map((resource, i) => (
                <ResourceItem
                    key={i}
                    resource={resource}
                    onDragData={onDragData}
                    visibleIcon={visibleIcon
                        ?? resource.url}
                />
            ))}
        </ul>
    );
};

export default ResourcesList;
