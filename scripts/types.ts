// A script that gets all the examples on kaplay/examples folder and generates a
// list of examples with code and name.

import { readFile, writeFile } from "fs/promises";
import path from "path";

const docTsPath = path.join(
    import.meta.dirname,
    "..",
    "kaplay",
    "dist",
    "doc.d.ts",
);

const globalTsPath = path.join(
    import.meta.dirname,
    "..",
    "kaplay",
    "dist",
    "declaration",
    "global.d.ts",
);

const libTsPath = path.join(
    import.meta.dirname,
    "..",
    "lib.d.ts",
);

export const generateTypeLib = async () => {
    const docTs = (await readFile(docTsPath, "utf-8")).replace(
        // This replace is a workaround to a bug in monaco where it doesn't parse
        // code that is after a @example, but looks like @example <a></a> works

        /@example/gm,
        "@example <a></a>",
    ).replace(
        // We do this all replace because Monaco baby trim spaces in code blocks.
        // This replace spaces by a some magic character "⠀" that is also invisible,
        // Apparently all this works, while ``` ``` are all in their places

        /@example[^\n]*\n(?:\s*\*.*\n)*?\s*\* ```(?:\w+)?\n([\s\S]*?)\n\s*\* ```/gm,
        (match, code) => {
            const cleanedCode = code.replaceAll(" ", "⠀").replaceAll(
                "⠀*",
                " *",
            );
            return match.replace(code, cleanedCode);
        },
        // Monaco ts version doesn't support <const T> syntax, so we replace it
    ).replace("add<const T", "add<T");

    const globalTs = (await readFile(globalTsPath, "utf-8")).replaceAll(
        /import { .* } from ".*"/gm,
        "",
    ) + "declare const KAPLAY: typeof kaplay;";

    const libTs = `${docTs}\n${globalTs}`;

    writeFile(libTsPath, libTs);
};

generateTypeLib();
