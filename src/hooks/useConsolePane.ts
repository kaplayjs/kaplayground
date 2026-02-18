import { useEffect, useState } from "react";
import { useConfig } from "./useConfig";

export const useConsolePane = (consoleSize = 34) => {
    const consoleVisible = useConfig((s) => s.config.console);
    const [consoleMinSize, setConsoleMinSize] = useState(
        consoleVisible ? consoleSize : 0,
    );
    useEffect(() => {
        setConsoleMinSize(consoleSize);
    }, []);

    return {
        consoleVisible,
        consoleSize,
        consoleMinSize,
    };
};

export default useConsolePane;
