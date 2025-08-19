import { type FC } from "react";
import type { AssetKind } from "../../features/Projects/models/AssetKind";
import { useProject } from "../../features/Projects/stores/useProject";
import { useAssets } from "../../hooks/useAssets";
import { cn } from "../../util/cn";
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
        <ul
            className={cn(
                "inline-flex flex-wrap gap-6 content-start h-full overflow-auto scrollbar-thin",
                { "pb-14": assets.length > 0 },
            )}
        >
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
