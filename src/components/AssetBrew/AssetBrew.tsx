import { assets, type CrewItem, type Tag } from "@kaplayjs/crew";
import { useMemo, useState } from "react";
import { AssetBrewItem } from "./AssetBrewItem";

const preferredOrder = [
    "bean",
    "bean_voice",
    "mark",
    "mark_voice",
    "ghosty",
    "ghostiny",
    "bobo",
    "bag",
    "kat",
    "tga",
    "burpman",
    "burp",
];
const preferredTagsOrder: Tag[] = [
    "crew",
    "animals",
    "food",
    "objects",
    "tiles",
    "icons",
    "ui",
    "emojis",
    "books",
    "brand",
];

const assetKeys = Object.keys(assets).sort((a, b) => {
    const assetA = assets[a as keyof typeof assets];
    const assetB = assets[b as keyof typeof assets];

    const prefA = preferredOrder.indexOf(a);
    const prefB = preferredOrder.indexOf(b);
    if (prefA != -1 || prefB != -1) {
        if (prefA == -1) return 1;
        if (prefB == -1) return -1;
        return prefA - prefB;
    }

    const tagRank = (asset: CrewItem) => {
        if (!asset?.tags) return Infinity;
        const ranks = asset.tags
            .map(tag => preferredTagsOrder.indexOf(tag))
            .filter(i => i != -1);
        return ranks.length ? Math.min(...ranks) : Infinity;
    };
    const rankA = tagRank(assetA);
    const rankB = tagRank(assetB);
    if (rankA != rankB) return rankA - rankB;

    return a.localeCompare(b);
});

export const AssetBrew = () => {
    const [search, setSearch] = useState("");

    const assetList = useMemo(() => {
        return assetKeys.filter((key) => {
            const k = key as keyof typeof assets;
            const asset = assets[k];
            const searchValue = search.toLowerCase();

            if (search) {
                return key.includes(searchValue)
                    || asset?.name.includes(searchValue)
                    || (asset?.searchTerms ?? []).some(term =>
                        term.includes(searchValue)
                    )
                    || (asset?.tags as string[])?.some(tag =>
                        tag.includes(searchValue)
                    );
            }

            return asset.kind != "Font";
        });
    }, [search]);

    return (
        <>
            <div className="relative bg-base-200 rounded-xl h-full w-full overflow-clip z-0">
                <div className="flex flex-row max-h-56 gap-1 items-center p-2 overflow-auto scrollbar-thin">
                    <div className="sticky -left-2 -m-2 -mr-1 p-2 pr-1 bg-base-200 rounded-r-3xl z-10">
                        <input
                            className={"flex items-center justify-center bg-base-300 rounded-lg min-h-14 w-40 input"}
                            defaultValue={""}
                            placeholder={"Search..."}
                            onInput={(e) => {
                                setSearch((e.target as any).value);
                            }}
                        >
                        </input>
                    </div>
                    {assetList.map(key => (
                        <AssetBrewItem
                            key={key}
                            asset={key as keyof typeof assets}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
