import { StrictMode, useEffect } from "react";
import Playground from "./Playground";
import "react-toastify/dist/ReactToastify.css";
import "allotment/dist/style.css";
import "@/styles/toast.css";
import { WebContainer } from "@webcontainer/api";
import { files } from "./exampleFiles";

const PlaygroundApp = () => {
    useEffect(() => {
        let webcontainerInstance: WebContainer;

        const initWebContainer = async () => {
            webcontainerInstance = await WebContainer.boot();

            await webcontainerInstance.mount(files);

            const exitCode = await installDependencies();

            if (exitCode !== 0) {
                throw new Error("Installation failed");
            }

            console.log("all looking good");

            startDevServer();
        };

        const installDependencies = async () => {
            const installProcess = await webcontainerInstance.spawn("npm", [
                "install",
            ]);
            installProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        console.log(data);
                    },
                }),
            );

            // Wait for install command to exit
            return installProcess.exit;
        };

        const startDevServer = async () => {
            const startDevServerProcess = await webcontainerInstance.spawn(
                "npm",
                ["run", "dev"],
            );

            startDevServerProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        console.log(data);
                    },
                }),
            );

            const iframeEl = document.querySelector<HTMLIFrameElement>(
                "#game-view",
            );

            // Wait for `server-ready` event
            webcontainerInstance.on("server-ready", (port, url) => {
                if (iframeEl) {
                    iframeEl.src = url;
                }
            });
        };

        initWebContainer();
    }, []);

    return (
        <StrictMode>
            <Playground mode="editor" />
        </StrictMode>
    );
};

export default PlaygroundApp;
