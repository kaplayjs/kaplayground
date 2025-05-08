import * as esbuild from "esbuild-wasm";
import { useProject } from "../stores/useProject";

await esbuild.initialize({
    wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
    worker: true,
});

// Plugin para resolver imports virtuales
const virtualPlugin: esbuild.Plugin = {
    name: "virtual-fs",
    setup(build) {
        // Resolver rutas
        build.onResolve({ filter: /.*/ }, args => {
            const resolvedPath =
                new URL(args.path, "file://" + args.resolveDir + "/").pathname;
            return { path: resolvedPath, namespace: "virtual" };
        });

        // Cargar archivos desde el Map
        build.onLoad({ filter: /.*/ }, async args => {
            console.log("Loading file:", args.path);

            const key = args.path.startsWith("/")
                ? args.path.slice(1)
                : args.path;

            const file = useProject.getState().getFile(key);
            if (!file) throw new Error(`File not found: ${key}`);
            const loader = key.endsWith(".ts") ? "ts" : "js";

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
