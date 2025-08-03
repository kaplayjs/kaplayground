import * as esbuild from "esbuild-wasm";
import { useProject } from "../stores/useProject";
import { buildCodeLegacy } from "./buildCodeLegacy";

const virtualPlugin: esbuild.Plugin = {
    name: "virtual-fs",
    setup(build) {
        build.onResolve({ filter: /.*/ }, args => {
            const resolvedPath =
                new URL(args.path, "file://" + args.resolveDir + "/").pathname;

            return { path: resolvedPath, namespace: "virtual" };
        });

        build.onLoad({ filter: /.*/ }, async args => {
            const path = args.path.startsWith("/")
                ? args.path.slice(1)
                : args.path;

            const file = useProject.getState().getFile(path);

            if (!file) throw new Error(`File not found: ${path}`);

            const loader = path.endsWith(".ts") ? "ts" : "js";

            return { contents: file.value, loader };
        });
    },
};

/**
 * Build code using esbuild.
 *
 * @returns - The built code as a string.
 */
export async function buildCode() {
    if (useProject.getState().project.buildMode == "legacy") {
        return buildCodeLegacy();
    }

    const result = await esbuild.build({
        entryPoints: ["/main.js"],
        bundle: true,
        write: false,
        plugins: [virtualPlugin],
        format: "esm",
        target: "esnext",
    });

    const buildResult = result.outputFiles;
    const decoder = new TextDecoder("utf-8");
    const fileContentsAsString = decoder.decode(buildResult[0].contents);

    return fileContentsAsString;
}
