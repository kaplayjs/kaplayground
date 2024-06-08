import kaboomJsFile from "../../../kaplay/dist/kaboom.js?raw";

export const wrapCode = (code: any) => {
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
}

body {
            overflow: hidden;
            background: #171212;
        }
        </style>
</head>
<body>
<script>
${kaboomJsFile}
</script>

<script type="module">
${code}
</script>
</body>
`;
};
