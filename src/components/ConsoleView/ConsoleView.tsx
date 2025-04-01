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
            className="h-full w-full bg-base-300 rounded-xl overflow-hidden"
        >
            <div className="h-full w-full overflow-auto scrollbar-thin">
                <Console logs={logs} variant="dark" />
            </div>
        </div>
    );
};
