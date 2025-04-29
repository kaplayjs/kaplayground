import { assets } from "@kaplayjs/crew";
import { useMemo, useState } from "react";
import { AssetBrewItem } from "./AssetBrewItem";

export const AssetBrew = () => {
    const [search, setSearch] = useState("");
    const assetList = useMemo(() => {
        return Object.keys(assets).filter((key) => {
            const k = key as keyof typeof assets;
            const asset = assets[k];

            if (search) {
                return key.includes(search.toLowerCase())
                    && asset.category != "fonts"
                    && key != "superburp";
            }

            return asset.category != "fonts" && key != "superburp";
        });
    }, [search]);

    return (
        <>
            <div className="bg-base-200 rounded-xl h-full w-full overflow-clip">
                <div className="flex flex-row max-h-56 gap-1 items-center p-2 overflow-auto scrollbar-thin">
                    <div className="sticky -left-2 -m-2 -mr-1 p-2 pr-1 bg-base-200 rounded-r-3xl">
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
