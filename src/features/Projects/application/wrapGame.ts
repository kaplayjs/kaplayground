import { getVersion, parseAssets } from "../../../util/compiler";
import { buildCode } from "./buildCode";
import { wrapCode } from "./wrapCode";

export function wrapGame() {
    const code = wrapCode();

    buildCode();

    return `
        import kaplay from "${getVersion()}";
        ${parseAssets(code)}
    `;
}
