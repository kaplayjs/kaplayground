// Debug levels represent how verbose the log is
// 0: Normal log
// 1: Internal and long log
// 2: Ultra internal and long log
// 3: Is traced

import { useConfig } from "../hooks/useConfig";

export const debug = (level: number = 0, ...msg: any[]) => {
    let debugLevel = useConfig.getState().config.debugLevel;

    if (import.meta.env.DEV) {
        debugLevel = 3;
    }

    // TODO: Remove null, debugLevel should be a number
    if (debugLevel === null || debugLevel < level) return;

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
