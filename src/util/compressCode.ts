import pako from "pako";

export function compressCode(str: string) {
    return btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(str))));
}

export function decompressCode(str: string) {
    try {
        return pako.inflate(
            new Uint8Array(atob(str).split("").map((c) => c.charCodeAt(0))),
            { to: "string" },
        );
    } catch {
        return str;
    }
}
