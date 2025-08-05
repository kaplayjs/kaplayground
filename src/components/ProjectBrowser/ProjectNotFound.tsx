import { assets } from "@kaplayjs/crew";
import { FC } from "react";
import { cn } from "../../util/cn";

const notFoundAssets = ["ghosty", "ghostiny", "beant", "skuller"];
let curNotFoundAsset = 0;

export const ProjectNotFound: FC<{ className?: string }> = ({ className }) => {
    const asset = notFoundAssets[
        (++curNotFoundAsset + notFoundAssets.length)
        % notFoundAssets.length
    ] as keyof typeof assets;

    return (
        <article
            className={cn(
                "flex flex-row items-center gap-4 lg:gap-6 p-6 lg:p-8 bg-base-200 rounded-xl",
                className,
            )}
        >
            <img
                className="w-11 h-11 object-contain"
                src={assets[asset].outlined}
                alt={asset}
            />

            <div>
                <h2 className="font-semibold text-lg leading-none text-red-300 py-1">
                    No items found
                </h2>

                <p>Search again or try different filters</p>
            </div>
        </article>
    );
};
