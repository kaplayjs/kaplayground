const isMac = navigator.userAgent.includes("Mac");

export default (key: string) => {
    const k = key.toLocaleLowerCase();
    return isMac && k.toLowerCase() == "ctrl"
        ? "cmd"
        : k.toLocaleLowerCase();
};
