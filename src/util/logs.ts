// Debug levels represent how verbose the log is
// 0: Normal log
// 1: Internal and long log

import { useConfig } from "../hooks/useConfig";

// 2: Ultra internal and long log
export const debug = (level: number = 0, ...msg: any[]) => {
    const configDebugLevel = useConfig.getState().config.debugLevel;
    if (configDebugLevel === null || configDebugLevel < level) return;

    if (level === 0) {
        // For info acceptable to know for the user
        console.debug(`%c${msg.join(" ")}`, "color: #6694e3");
    } else if (level === 1) {
        // For info about internal loading process
        console.debug(`%c${msg.join(" ")}`, "color: #e8db2a");
    } else if (level === 2) {
        // For info on execution of internal functions
        console.trace(`%c${msg.join(" ")}`, "color: #cc3f7a");
    }
};
