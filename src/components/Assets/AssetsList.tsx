import { type FC } from "react";
import type { AssetKind } from "../../features/Projects/models/AssetKind";
import { useProject } from "../../features/Projects/stores/useProject";
import { useAssets } from "../../hooks/useAssets";
import { AssetsEmpty } from "./AssetsEmpty";
import type { ResourceProps } from "./AssetsItem";
import AssetsItem from "./AssetsItem";

type Props = Omit<ResourceProps, "asset"> & {
    kind: AssetKind;
};

const AssetsList: FC<Props> = ({ kind, visibleIcon }) => {
    const { assets } = useAssets({ kind });
    useProject((s) => s.project);

    return (
        <ul className="inline-flex flex-wrap gap-6 content-start h-full pb-14 overflow-auto scrollbar-thin">
            {assets.length > 0 && assets.map((resource, i) => (
                <AssetsItem
                    key={i}
                    asset={resource}
                    visibleIcon={visibleIcon
                        ?? resource.url}
                />
            ))}

            {assets.length <= 0 && <AssetsEmpty kind={kind} />}
        </ul>
    );
};

export default AssetsList;
