import { assets } from "@kaplayjs/crew";
import { useMemo, useState } from "react";

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

    const handleResourceDrag = (e: React.DragEvent, data: string) => {
        e.dataTransfer.setData("text", data);
    };

    return (
        <div className="bg-base-200 rounded-xl h-full w-full overflow-clip">
            <div className="flex flex-row overflow-auto max-h-56 gap-1 items-center p-2">
                <input
                    className={"flex items-center justify-center bg-base-300 rounded-xl min-h-14 input"}
                    defaultValue={""}
                    placeholder={"Search..."}
                    onInput={(e) => {
                        setSearch((e.target as any).value);
                    }}
                >
                </input>
                {assetList.map(key => (
                    <div
                        className="flex items-center justify-center bg-base-300 min-w-14 min-h-14 rounded-xl"
                        draggable
                        key={key}
                        onDragStartCapture={(e) => {
                            handleResourceDrag(
                                e,
                                `loadSprite("${key}", "/crew/${key}.png");`,
                            );
                        }}
                    >
                        <img
                            src={assets[key as keyof typeof assets].sprite}
                            className="h-10 w-10 object-scale-down"
                            draggable={false}
                        >
                        </img>
                    </div>
                ))}
            </div>
        </div>
    );
};
