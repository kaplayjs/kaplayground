/*
KAPLAYGROUND do different transformations to asset urls

/crew - load from Crew package
/assets - load from assets

others are assumed as our hosted assets in public
*/

import { assets } from "@kaplayjs/crew";
import publicAssets from "../data/publicAssets.json";
import { useProject } from "../features/Projects/stores/useProject";

export const parseAssetPath = (path: string) => {
    let normalPath = normalize(path);

    const projectAssets = useProject.getState().project.assets;
    const pathInAssets = projectAssets.get(normalPath);

    if (pathInAssets) {
        path = pathInAssets.url;
        return path;
    }

    const pathInPublic = publicAssets.assets.filter((asset) => {
        if (asset.filename == normalPath) return asset;
    })[0];

    if (pathInPublic) {
        path = pathInPublic.base64;
        return path;
    }

    const isCrew = normalPath.startsWith("crew/");

    if (isCrew) {
        const crewName = normalPath.split("/").pop()?.split(".").slice(0, -1)
            .join(
                ".",
            );
        const isOutlined = crewName?.endsWith("-o");
        const crewEntry = assets[crewName as keyof typeof assets];

        if (isOutlined && crewEntry.outlined) {
            normalPath = crewEntry.outlined;
        } else if (crewEntry.sprite) {
            normalPath = crewEntry.sprite;
        }

        return normalPath;
    }

    return path;
};

// TODO: Remplaze with normalize() from path.ts
const normalize = (path: string) => {
    const normalizedPath = path.replace(/^\/|\/$/g, "").replace(/"/g, "");

    if (normalizedPath.startsWith("assets/")) {
        return normalizedPath.replace("assets/", "");
    }

    return normalizedPath;
};
