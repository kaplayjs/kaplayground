import { assets } from "@kaplayjs/crew";
import { Console, Hook, Unhook } from "console-feed";
import { useEffect, useState } from "react";

export const ConsoleView = () => {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const hookedConsole = Hook(
            window.console,
            (log) => {
                if (log.data?.[0] !== "[game]") return;

                setLogs((currLogs) => [...currLogs, log]);
            },
            false,
        );

        return () => {
            Unhook(hookedConsole);
        };
    }, []);

    useEffect(() => {
        const consoleWrapper = document.getElementById("console-wrapper");
        consoleWrapper?.scroll({
            top: consoleWrapper.scrollHeight,
        });
    }, [logs]);

    return (
        <div
            id="console-wrapper"
            className="relative h-full w-full bg-base-300 rounded-xl overflow-hidden"
        >
            <div className="relative flex flex-col-reverse h-full w-full overflow-auto scrollbar-thin ">
                <Console
                    logs={logs}
                    variant="dark"
                    styles={{
                        PADDING: "0.4rem 0",

                        LOG_BORDER: "oklch(var(--b1))",

                        LOG_ERROR_COLOR: "oklch(var(--er))",
                        LOG_ERROR_BACKGROUND: "oklch(var(--er) / 0.1)",
                        LOG_ERROR_BORDER: "oklch(var(--er) / 0.1)",

                        LOG_WARN_COLOR: "oklch(var(--wa))",
                        LOG_WARN_BACKGROUND: "oklch(var(--wa) / 0.1)",
                        LOG_WARN_BORDER: "oklch(var(--wa) / 0.05)",

                        LOG_DEBUG_COLOR: "rgb(141 183 255)",

                        BASE_BACKGROUND_COLOR: "rgb(0 0 0 / 0)",

                        OBJECT_VALUE_STRING_COLOR: "rgb(233 150 122)",
                    }}
                />
            </div>
        </div>
    );
};
