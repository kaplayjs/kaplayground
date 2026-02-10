import { assets } from "@kaplayjs/crew";
import { Console, Hook, Unhook } from "console-feed";
import { useEffect, useState } from "react";
import { useProject } from "../../features/Projects/stores/useProject";

export const ConsoleView = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const projectKey = useProject((s) => s.projectKey || s.demoKey);

    const sanitize = (v: any): any => {
        if (Array.isArray(v)) {
            return Array.from(
                { length: v.length },
                (_, i) => i in v ? sanitize(v[i]) : "<empty>",
            );
        }

        if (v && typeof v === "object") {
            return Object.fromEntries(
                Object.entries(v).map(([k, v]) => [k, sanitize(v)]),
            );
        }

        return v;
    };

    useEffect(() => {
        const hookedConsole = Hook(
            window.console,
            (log) => {
                if (log.data?.[0] !== "[game]") return;

                setLogs(currLogs => [
                    ...currLogs,
                    { ...log, data: log.data?.map(sanitize) },
                ]);
            },
            false,
        );

        const messageHandler = (
            event: MessageEvent<
                {
                    type: string;
                    method: "log" | "error" | "warn" | "debug";
                    messages: any[];
                }
            >,
        ) => {
            if (
                event.data?.type?.startsWith("CONSOLE")
                && String(event.data?.messages?.[0])?.startsWith("[sandbox]")
            ) return;

            console?.[event.data?.method]?.("[game]", ...event.data?.messages);
        };

        window.addEventListener("message", messageHandler, { passive: true });

        return () => {
            Unhook(hookedConsole);
            window.removeEventListener("message", messageHandler);
        };
    }, []);

    useEffect(() => {
        setLogs([]);
    }, [projectKey]);

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
