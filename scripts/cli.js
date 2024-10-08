import { createServer } from "vite";
import { VitePluginEnv } from "vite-plugin-custom-env";

// Get process and options
const args = process.argv.slice(2) ?? [];

const options = args.reduce((acc, arg) => {
    const [key, value] = arg.split("=");
    acc[key.replace(/^-{1,2}/, "")] = value;
    return acc;
}, {});

process.env.EXAMPLES_PATH = options.examples || "examples";

const server = await createServer({
    plugins: [
        VitePluginEnv({
            "VITE_USE_FILE": "true",
        }),
    ],
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
