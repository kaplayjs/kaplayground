import { useProject } from "../features/Projects/stores/useProject";
import { parseAssetPath } from "./assetsParsing";
import { debug } from "./logs";
import { MATCH_ASSET_URL_REGEX } from "./regex";

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
    const parsed = code.replace(regex, (match, asset: string) => {
        return match.replace(
            asset,
            parseAssetPath(asset, match),
        );
    });

    return parsed;
};

export const parseAssets = (code: string) => {
    const regexComment = /\/\/\s*kaplay-transformation-asset\s*(.*)/g;

    const codeTransformed = transformAssetUrl(
        MATCH_ASSET_URL_REGEX,
        transformAssetUrl(regexComment, code),
    );

    return codeTransformed;
};
