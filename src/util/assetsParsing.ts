/*
KAPLAYGROUND do different transformations to asset urls

/crew - load from Crew package
/assets - load from assets

others are assumed as our hosted assets in public
*/

import { assets } from "@kaplayjs/crew";
import { useProject } from "../features/Projects/stores/useProject";

export const parseAssetPath = (path: string) => {
    let parsedPath = path;

    parsedPath = parsedPath.replace(/^\/|\/$/g, "").replace(
        "assets/",
        "",
    ).replace(/"/g, "");

    const projectAssets = useProject.getState().project.assets;
    const pathInAssets = projectAssets.get(parsedPath);

    if (pathInAssets) {
        path = pathInAssets.url;
        return path;
    }

    const crewPath = parsedPath.split("/").pop()?.split(".").slice(0, -1).join(
        ".",
    );
    const isOutlined = crewPath?.endsWith("-o");
    const pathInCrew = assets[crewPath as keyof typeof assets];

    if (pathInCrew) {
        if (isOutlined && pathInCrew.outlined) {
            parsedPath = pathInCrew.outlined;
        } else if (pathInCrew.sprite) {
            parsedPath = pathInCrew.sprite;
        }

        return parsedPath;
    }

    return path;
};
