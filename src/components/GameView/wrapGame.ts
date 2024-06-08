import type { File } from "@/stores/project/files";
import {} from "magic-string";

export const wrapGame = (files: File[]) => {
    const mainFile = files.find((file) => file.name === "main.js");
    const sceneFiles = files.filter((file) => file.kind === "scene");
    const kaboomFile = files.find((file) => file.name === "kaboom.js");
    const imports = {
        imports: {} as Record<string, string>,
        scopes: {} as Record<string, Record<string, string>>,
    };

    imports.scopes[`./scenes/`] = {};

    sceneFiles.forEach((file) => {
        imports.imports[`./scenes/${file.name}`] =
            `data:text/javascript,${file.value} //@ sourceURL=${`./scenes/${file.name}`}`;

        imports.scopes[`./scenes/`][file.name] =
            `data:text/javascript,${file.value} //@ sourceURL=${`./scenes/${file.name}`}`;
    });

    return `
<!DOCTYPE html>
<head>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body,
html {
    width: 100%;
    height: 100vh;
}

body {
            overflow: hidden;
            background: #171212;
        }
        </style>
</head>
<body>
<script src="/kaboom.js"></script>
<script type="importmap">
${JSON.stringify(imports)}
</script>

<script type="module">
${kaboomFile?.value ?? ""}
${mainFile?.value ?? ""}
</script>
</body>
`;
};
