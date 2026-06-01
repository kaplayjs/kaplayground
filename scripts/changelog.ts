import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const srcPath = path.join(import.meta.dirname, "..", "kaplay", "CHANGELOG.md");
const distPath = path.join(
    import.meta.dirname,
    "..",
    "src",
    "data",
    "kaplayChangelog.html",
);

export const generateChangelog = async () => {
    const file = readFileSync(srcPath, "utf-8");
    const content = (await remark()
        .use(html)
        .process(file)).toString();

    let result = content.slice(content.indexOf("<h2"));
    result = result.replace(
        "[unreleased]",
        "[master] <span>- unreleased</span>",
    );
    result = transformVersionHeadings(result);
    result = transformPRUrls(result);

    writeFileSync(distPath, result);
    console.log("Generated kaplayChangelog.html");
};

function transformVersionHeadings(html: string) {
    const overrideIds: Record<string, string> = {};

    return html.replace(
        /<h2>\s*\[(.*?)\](.*?)<\/h2>/gis,
        (_, title, rest) => {
            const titleParsed = title.trim();
            const restParsed = rest.trim();
            let id = titleParsed;
            if (overrideIds[id]) id = overrideIds[id];
            id = id.replaceAll(".", "-");

            return `<h2 id="${id}" data-version="${titleParsed}">${titleParsed}${
                restParsed ? ` <span>${restParsed}</span>` : ""
            }</h2>`.trim();
        },
    );
}

function transformPRUrls(html: string) {
    return html.replace(
        /\(#(\d*)\)/gis,
        (txt, pr) => {
            return `<a href="https://github.com/kaplayjs/kaplay/pull/${pr.trim()}" target="_blank">${txt}</a>`
                .trim();
        },
    );
}

generateChangelog();
