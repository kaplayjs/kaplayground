import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import { useAssets } from "../../hooks/useAssets";
import type { Asset, AssetKind } from "../../stores/storage/assets";
import type { ResourceProps } from "./ResourceItem";
import ResourceItem from "./ResourceItem";

type Props = Omit<ResourceProps, "asset"> & {
    kind: AssetKind;
};

const ResourcesList: FC<Props> = ({ kind, visibleIcon }) => {
    const { assets } = useAssets({ kind });
    const [
        parent,
        draggableAssets,
        setDraggableAssets,
    ] = useDragAndDrop<HTMLUListElement, Asset>(assets);

    useEffect(() => {
        setDraggableAssets(assets);
    }, [assets]);

    return (
        <ul
            ref={parent}
            className="inline-flex flex-wrap gap-6 content-start overflow-auto max-h-44"
        >
            {draggableAssets.map((resource, i) => (
                <ResourceItem
                    key={i}
                    asset={resource}
                    visibleIcon={visibleIcon
                        ?? resource.url}
                />
            ))}
        </ul>
    );
};

export default ResourcesList;
