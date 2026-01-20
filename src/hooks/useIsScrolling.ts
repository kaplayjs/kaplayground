import { type RefObject, useEffect, useState } from "react";

export function useIsScrolling(
    node: HTMLElement | RefObject<HTMLElement>,
    timeout = 150,
) {
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const el = "current" in node ? node.current : node;
        if (!el) return;

        let timer: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            setIsScrolling(true);

            clearTimeout(timer);
            timer = setTimeout(() => {
                setIsScrolling(false);
            }, timeout);
        };

        el.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            el?.removeEventListener("scroll", handleScroll);
            clearTimeout(timer);
        };
    }, [node, timeout]);

    return isScrolling;
}
