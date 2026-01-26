import { getVersion, parseAssets } from "../../../util/compiler";
import { buildCode } from "./buildCode";

export async function wrapGame() {
    const code = await buildCode();

    return `
        import kaplay from "${getVersion()}";
        ${parseAssets(code)}
        ${registerGlobalsFromCtx(code)}
    `;
}

function registerGlobalsFromCtx(code: string) {
    const ctx = code.match(
        /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*kaplay\(/,
    )?.[1];

    return !ctx ? "" : `
        window._k_debug = ${ctx}.debug;
    `;
}
