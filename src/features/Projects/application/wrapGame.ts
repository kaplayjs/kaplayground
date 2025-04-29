import { getVersion, parseAssets } from "../../../util/compiler";
import { wrapCode } from "./wrapCode";

export function wrapGame() {
    const code = wrapCode();

    return `
        import kaplay from "${getVersion()}";
        ${parseAssets(code)}
    `;
}
