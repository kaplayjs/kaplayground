import { assets } from "@kaplayjs/crew";
import { Console, Decode } from "console-feed";
import { Message } from "console-feed/lib/definitions/Console";
import { type MouseEventHandler, useEffect, useRef, useState } from "react";
import { useProject } from "../../features/Projects/stores/useProject";

type LogMessageEvent = MessageEvent<{
    type: string;
    log: Message[];
}>;

export const ConsoleView = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const projectKey = useProject((s) => s.projectKey || s.demoKey);
    const scrollDivRef = useRef<HTMLDivElement>(null);
    const ignoredFilter = ["[sandbox]", "[vite]"];

    const handleClear = () => {
        setLogs([]);
    };

    const handleExpandLogs: MouseEventHandler = (e) => {
        const el = e.target as Element;
        if (!el) return;

        let toggle = el.closest("[aria-expanded]");
        if (!toggle) return;

        requestAnimationFrame(() => {
            const elRect = el.getBoundingClientRect();
            const scrollDivRect = scrollDivRef.current!.getBoundingClientRect();
            if (elRect.top > scrollDivRect.top - 5) return;

            const isNested = el.matches(
                `${"[aria-expanded] ".repeat(2)} ${el.tagName.toLowerCase()}`,
            );
            const expandedEl =
                (isNested ? toggle : toggle?.closest("[data-method]"))
                    ?? toggle;

            expandedEl.scrollIntoView({ block: "start", behavior: "instant" });
        });
    };

    const normalizeData: any = (value: Message["data"], c = new Set()) => {
        if (value && typeof value === "object") {
            if (c.has(value)) return value;
            c.add(value);

            if (Array.isArray(value)) {
                return value.map(v => normalizeData(v, c));
            }

            const obj: Record<string, Message["data"]> = {};
            for (const [k, v] of Object.entries(value)) {
                // Minified object constructor names are useless noise
                if (
                    k === "constructor" && ((v as any)?.name?.length ?? 0) < 3
                ) continue;

                obj[k] = normalizeData(v, c);
            }

            return obj;
        }

        return value;
    };

    useEffect(() => {
        const messageHandler = ({ data }: LogMessageEvent) => {
            if (
                !data?.type?.startsWith("CONSOLE")
                || !data?.log
                || ignoredFilter.some(
                    s => (String(data.log?.[0]?.data?.[0] ?? "").startsWith(s)),
                )
            ) return;

            const log = Decode(data.log);

            setLogs(currLogs => [
                ...currLogs,
                { ...log, data: log.data?.map(v => normalizeData(v)) },
            ]);
        };

        window.addEventListener("message", messageHandler, { passive: true });

        return () => {
            window.removeEventListener("message", messageHandler);
        };
    }, []);

    useEffect(handleClear, [projectKey]);

    return (
        <div
            id="console-wrapper"
            className="relative h-full w-full bg-base-300 rounded-xl overflow-hidden z-0"
        >
            <div
                ref={scrollDivRef}
                className="relative flex flex-col-reverse h-full w-full overflow-auto scrollbar-thin [&>*+*_:last-child]:border-b-transparent"
                onClick={handleExpandLogs}
            >
                {logs.length > 0 && (
                    <div className="sticky flex items-end self-end bottom-0.5 right-0.5 h-0 overflow-visible z-20">
                        <button
                            className="btn btn-ghost btn-xs p-1 h-auto rounded-lg"
                            onClick={handleClear}
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
