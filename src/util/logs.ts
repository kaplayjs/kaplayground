// Debug levels represent how verbose the log is
// 0: Normal log
// 1: Internal and long log
// 2: Ultra internal and long log
export const debug = (level: number = 0, ...msg: any[]) => {
    if (level === 0) {
        console.debug(`%c${msg.join(" ")}`, "color: #6694e3");
    } else if (level === 1) {
        console.debug(`%c${msg.join(" ")}`, "color: #e8db2a");
    } else if (level === 2) {
        console.trace(`%c${msg.join(" ")}`, "color: #cc3f7a");
    }
};
