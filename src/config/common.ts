import packageJson from "../../package.json";

export const VERSION = packageJson.version;
export const CHANGELOG =
    "https://github.com/lajbel/kaplayground/blob/master/CHANGELOG.md";
export const REPO = "https://github.com/kaplayjs/kaplayground";

export const SANDBOX_URL = new URL(
    import.meta.env.VITE_SANDBOX_URL || "https://kaplaypreview.kaplayjs.com",
    window.location.origin,
).href;
export const SANDBOX_ORIGIN = new URL(SANDBOX_URL).origin;
