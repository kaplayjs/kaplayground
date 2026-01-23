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

        window.addEventListener("message", (event) => {
            if (
                event.data?.type?.startsWith("CONSOLE_")
                && String(event.data?.data?.[0])?.startsWith("[sandbox]")
            ) return;

            if (event.data?.type === "CONSOLE_LOG") {
                const log: string[] = event.data?.data;

                console.log(
                    "[game]",
                    ...log,
                );
            } else if (event.data?.type === "CONSOLE_ERROR") {
                const log: string[] = event.data?.data;

                console.error(
                    "[game]",
                    ...log,
                );
            } else if (event.data?.type === "CONSOLE_WARN") {
                const log: string[] = event.data?.data;

                console.warn(
                    "[game]",
                    ...log,
                );
            } else if (event.data?.type === "CONSOLE_DEBUG") {
                const log: string[] = event.data?.data;

                console.debug(
                    "[game]",
                    ...log,
                );
            } else if (event.data?.type === "CONSOLE_INFO") {
                const log: string[] = event.data?.data;

                console.info(
                    "[game]",
                    ...log,
                );
            }
        });

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
            className="relative h-full w-full bg-base-300 rounded-xl overflow-hidden z-0"
        >
            <div className="relative flex flex-col-reverse h-full w-full overflow-auto scrollbar-thin [&>*+*_:last-child]:border-b-transparent">
                {logs.length > 0 && (
                    <div className="sticky flex items-end self-end bottom-0.5 right-0.5 h-0 overflow-visible z-20">
                        <button
                            className="btn btn-ghost btn-xs p-1 h-auto rounded-lg"
                            onClick={() => setLogs([])}
                            data-tooltip-id="global"
                            data-tooltip-html={"Clear console"}
                            data-tooltip-place="top-end"
                        >
                            <img
                                src={assets.trash.outlined}
                                alt={"Clear console"}
                                className="h-5 p-px"
                            />
                        </button>
                    </div>
                )}

                <Console
                    logs={logs}
                    variant="dark"
                    styles={{
                        BASE_FONT_FAMILY: "'DM Mono', monospace",

                        PADDING: "0.425rem 0",

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

                {logs.length == 0 && (
                    <div className="px-4 py-2 text-xs font-mono opacity-70">
                        <span className="mr-3">&gt;</span>
                        Console is empty
                    </div>
                )}
            </div>
        </div>
    );
};
