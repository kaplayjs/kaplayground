import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { type FC, useEffect } from "react";
import type {
    Asset,
    AssetKind,
} from "../../features/Projects/stores/slices/assets";
import { useAssets } from "../../hooks/useAssets";
import type { ResourceProps } from "./AssetsItem";
import AssetsItem from "./AssetsItem";

type Props = Omit<ResourceProps, "asset"> & {
    kind: AssetKind;
};

const AssetsList: FC<Props> = ({ kind, visibleIcon }) => {
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
            className="inline-flex flex-wrap gap-6 content-start h-full pb-14 overflow-auto scrollbar-thin"
        >
            {draggableAssets.map((resource, i) => (
                <AssetsItem
                    key={i}
                    asset={resource}
                    visibleIcon={visibleIcon
                        ?? resource.url}
                />
            ))}
        </ul>
    );
};

export default AssetsList;
