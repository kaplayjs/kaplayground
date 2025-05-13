import { getVersion, parseAssets } from "../../../util/compiler";
import { wrapCode } from "./wrapCode";

export async function wrapGame() {
    const code = await wrapCode();

    return `
        import kaplay from "${getVersion()}";
        ${parseAssets(code)}
    `;
}
