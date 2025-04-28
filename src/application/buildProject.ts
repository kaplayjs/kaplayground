import { getVersion } from "../util/compiler";
import { wrapProject } from "./wrapProject";

const toDataUrl = (data: string) => {
    const base64 = btoa(unescape(encodeURIComponent(data)));
    return `data:text/javascript;base64,${base64}`;
};

export async function buildProject() {
    const code = wrapProject();
    const kaplayLib = await getVersion(true);
    if (!kaplayLib) {
        throw new Error("Failed to fetch the library");
    }

    const projectCode = `
        <html>
            <head>
                <script src="${kaplayLib}"></script>
            </head>
            <body>
                <script type="module">
                    import kaplay from "${toDataUrl(kaplayLib)}";
                    ${code}
                </script>
            </body>
        </html>
    `;

    return projectCode;
}
