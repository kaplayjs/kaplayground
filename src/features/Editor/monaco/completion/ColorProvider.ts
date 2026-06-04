import { type editor, type IRange, languages, Range } from "monaco-editor";

export const HEX_REGEX = /"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"/g;
export const RGB_REGEX =
    /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g;
export const ARR_REGEX = /\[\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\]/g;

export class ColorProvider implements languages.DocumentColorProvider {
    provideDocumentColors(model: editor.ITextModel) {
        const text = model.getValue();
        const matches: languages.IColorInformation[] = [];

        const parse = (
            regex: RegExp,
            parser: (m: string[]) => languages.IColor,
        ) => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                const start = model.getPositionAt(match.index);
                const end = model.getPositionAt(match.index + match[0].length);

                const color = parser(match);
                if (!color) continue;

                const offset = model.getOffsetAt(start);
                const isForOpacities = /opacities:\s*$/.test(
                    text.slice(Math.max(0, offset - 20), offset),
                );
                if (isForOpacities) continue;

                matches.push({
                    range: new Range(
                        start.lineNumber,
                        start.column,
                        end.lineNumber,
                        end.column,
                    ),
                    color,
                });
            }
        };

        parse(HEX_REGEX, (m) => {
            let hex = m[1].replace(/^#/, "");

            if (hex.length === 3) {
                hex = hex
                    .split("")
                    .map(c => c + c)
                    .join("");
            }

            return {
                red: parseInt(hex.slice(0, 2), 16) / 255,
                green: parseInt(hex.slice(2, 4), 16) / 255,
                blue: parseInt(hex.slice(4, 6), 16) / 255,
                alpha: 1,
            };
        });

        parse(RGB_REGEX, (m) => {
            return {
                red: Number(m[1]) / 255,
                green: Number(m[2]) / 255,
                blue: Number(m[3]) / 255,
                alpha: 1,
            };
        });

        parse(ARR_REGEX, (m) => {
            return {
                red: Number(m[1]) / 255,
                green: Number(m[2]) / 255,
                blue: Number(m[3]) / 255,
                alpha: 1,
            };
        });

        return matches;
    }

    provideColorPresentations(
        model: editor.ITextModel,
        colorInfo: languages.IColorInformation,
    ) {
        const text = model.getValue();
        const color = colorInfo.color;
        const r = Math.round(color.red * 255);
        const g = Math.round(color.green * 255);
        const b = Math.round(color.blue * 255);

        const hex = `#${
            [r, g, b]
                .map(v => v.toString(16).padStart(2, "0"))
                .join("")
        }`;
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const arr = `[${r}, ${g}, ${b}]`;

        const range = expantToQuotedRange(model, colorInfo.range);
        const isQuoted = (() => {
            const line = model.getLineContent(range.startLineNumber);
            const start = range.startColumn - 2;
            return (
                line[start] === "\""
                || line[start] === "'"
                || line[start] === "`"
            );
        })();

        // rgb() option available only outside of kaplay()
        const offset = model.getOffsetAt(range.getStartPosition());
        const isInsideKaplayCall = /kaplay\s*\(\s*\{[^}]*$/.test(
            text.slice(Math.max(0, offset - 200), offset),
        );

        const options = [
            {
                label: hex,
                textEdit: {
                    range,
                    text: isQuoted ? hex : `"${hex}"`,
                },
            },
            {
                label: arr,
                textEdit: {
                    range,
                    text: arr,
                },
            },
        ];

        if (!isInsideKaplayCall) {
            options.splice(1, 0, {
                label: rgb,
                textEdit: {
                    range,
                    text: rgb,
                },
            });
        }

        return options;
    }
}

function expantToQuotedRange(model: editor.ITextModel, range: IRange) {
    const line = model.getLineContent(range.startLineNumber);

    let start = range.startColumn - 1;
    let end = range.endColumn - 1;

    if (line[start - 1] === "\"" || line[start - 1] === "'") {
        start -= 1;
    }

    if (line[end] === "\"" || line[end] === "'") {
        end += 1;
    }

    return new Range(
        range.startLineNumber,
        start + 1,
        range.endLineNumber,
        end + 1,
    );
}
