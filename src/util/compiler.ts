import { assets } from "@kaplayjs/crew";
import { useProject } from "../features/Projects/stores/useProject";
import { debug } from "./logs";

export const getVersion = (fetchIt = false) => {
    const version = useProject.getState().project.kaplayVersion;
    let libVersion;

    if (version == "master") {
        libVersion =
            "https://kaplay-cdn-worker.lajbel.workers.dev/versions/kaplay.master.mjs";
    } else {
        const versionSplit = version.split(".");
        const major = Number(versionSplit[0]);
        const patch = Number(versionSplit[2]);

        if (major == 3001 && patch > 12) {
            libVersion = `https://unpkg.com/kaplay@${version}/dist/kaplay.mjs`;
        } else if (major == 3001) {
            libVersion = `https://unpkg.com/kaplay@${version}/dist/kaboom.mjs`;
        } else if (major == 4000) {
            libVersion = `https://unpkg.com/kaplay@${version}/dist/kaplay.mjs`;
        } else {
            libVersion = `https://unpkg.com/kaplay@${version}/dist/kaplay.mjs`;
        }
    }

    if (fetchIt) {
        return fetch(libVersion, {
            method: "GET",
            headers: {
                "Content-Type": "application/javascript",
            },
            mode: "cors",
            credentials: "same-origin",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch the library");
                }
                return res.text();
            })
            .catch((err) => {
                debug(0, "[compiler] Error fetching library:", err);
            });
    } else {
        return libVersion;
    }
};

const transformAssetUrl = (regex: RegExp, code: string) => {
    const { project: { assets: resources } } = useProject.getState();

    const x = code.replace(regex, (match, asset: string) => {
        debug(
            0,
            "[compiler] Transforming urls, asset matched:",
            asset.slice(0, 25),
        );

        let transformedAsset = asset;

        // remove first / and last / from asset, also remove "assets" from asset
        const resource = asset.replace(/^\/|\/$/g, "").replace(
            "assets/",
            "",
        ).replace(/"/g, "");

        if (resources.has(resource)) {
            debug(
                0,
                "[compiler] Resource found:",
                resources.get(resource)?.url.slice(0, 25) + "...",
            );
            transformedAsset = resources.get(resource)?.url!;
        } else {
            debug(0, "No resource found for", resource.slice(0, 25) + "...");
        }

        const crewResource = asset.replace(/^\/|\/$/g, "").replace(
            "crew/",
            "",
        ).replace(/"/g, "").replace(".png", "");

        const crewResourceWithoutOutlineIndicator = crewResource.replace(
            "-o",
            "",
        );
        const prop = crewResource.endsWith("-o") ? "outlined" : "sprite";

        const assetResource =
            assets[crewResourceWithoutOutlineIndicator as keyof typeof assets];

        if (assetResource) {
            debug(0, "[assets] Crew found for", crewResource);
            transformedAsset = assetResource[prop]!;
        } else {
            debug(0, "[assets] Crew not found for", crewResource);
        }

        return match.replace(
            asset,
            transformedAsset,
        );
    });

    return x;
};

export const parseAssets = (code: string) => {
    const regexLoad = /load\w+\(\s*"[^"]*",\s*"([^"]*)"\s*/g;
    const regexComment = /\/\/\s*kaplay-transformation-asset\s*(.*)/g;

    const codeTransformed = transformAssetUrl(
        regexLoad,
        transformAssetUrl(regexComment, code),
    );

    // debug(2, "[compiler] Compiled, new code:", codeTransformed);

    return codeTransformed;
};
