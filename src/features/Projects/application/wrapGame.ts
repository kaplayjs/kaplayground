import { getVersion, parseAssets } from "../../../util/compiler";
import { buildCode } from "./buildCode";

export async function wrapGame() {
    const code = await buildCode();

    return `
        import kaplay from "${getVersion()}";
        ${parseAssets(code)}
    `;
}
