import { useProject } from "../stores/useProject";

/**
 * Normalize a path removing "." and ".." segments.
 *
 * @param path Path to normalize
 * @returns Normalized path
 */
export function normalize(path: string): string {
    const parts: string[] = [];

    for (const part of path.split("/")) {
        if (part === "." || part === "") continue;
        if (part === "..") parts.pop();
        else parts.push(part);
    }

    return parts.join("/");
}

/**
 * Get the parent directory of a path.
 *
 * @param path Path to get the parent directory from
 * @returns Parent directory of the path
 */
export function dirname(path: string): string {
    const parts = path.split("/");
    parts.pop();
    return parts.join("/") || ".";
}

/**
 * Get the base name of a path.
 *
 * @param path Path to get the base name from
 * @returns Base name of the path
 */
export function basename(path: string): string {
    const parts = path.split("/");
    return parts[parts.length - 1];
}

/**
 * Calculate the relative path from 'from' to 'to'.
 */
export function relative(from: string, to: string): string {
    const fromParts = normalize(from).split("/");
    const toParts = normalize(to).split("/");

    fromParts.pop();

    let i = 0;
    while (
        i < fromParts.length && i < toParts.length
        && fromParts[i] === toParts[i]
    ) {
        i++;
    }

    const up = fromParts.length - i;
    const down = toParts.slice(i);

    return `${"../".repeat(up)}${down.join("/")}`;
}

/**
 * Get the matching relative imports for a given typed partial import path.
 *
 * @param currentFilePath The current file path
 * @param typedPartialImport The typed partial import path
 * @returns
 */
export function getMatchingRelativeImports(
    currentFilePath: string,
    typedPartialImport: string,
): string[] {
    const currentDir = dirname(currentFilePath);
    const resolvedTypedPath = normalize(`${currentDir}/${typedPartialImport}`);
    const suggestions: string[] = [];

    for (const filePath of useProject.getState().project.files.keys()) {
        const abs = normalize(filePath);

        if (abs.startsWith(resolvedTypedPath)) {
            const rel = relative(currentFilePath, abs);
            if (!rel.startsWith(".")) {
                suggestions.push("./" + rel);
            } else {
                suggestions.push(rel);
            }
        }
    }

    return suggestions.sort();
}
