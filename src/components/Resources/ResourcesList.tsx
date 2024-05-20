import { useAssets } from "@/hooks/useAssets";
import type { Asset, AssetKind } from "@/stores/project/assets";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import Resource, { type ResourceProps } from "./Resource";

type Props = Omit<ResourceProps, "asset"> & {
    kind: AssetKind;
};

const ResourcesList: FC<Props> = ({ kind, onDragData, visibleIcon }) => {
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
            {draggableAssets.map((asset, i) => (
                <Resource
                    key={i}
                    asset={asset}
                    onDragData={onDragData}
                    visibleIcon={visibleIcon
                        ?? asset.url}
                />
            ))}
        </ul>
    );
};

export default ResourcesList;
