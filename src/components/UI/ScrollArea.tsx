import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { PropsWithChildren } from "react";
import { useIsScrolling } from "../../hooks/useIsScrolling";
import { cn } from "../../util/cn";

type ScrollAreaProps = PropsWithChildren<{
    className: string;
}>;

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ children, className, ...props }, ref) => {
        const scrollRef = useRef<HTMLDivElement>(null);
        useImperativeHandle(ref, () => scrollRef.current!);

        const isScrolling = useIsScrolling(scrollRef);

        const isAtTop = useMemo(() => {
            const el = scrollRef.current;
            if (!el) return true;

            return scrollRef.current.scrollTop === 0;
        }, [scrollRef, isScrolling]);

        const isAtBottom = useMemo(() => {
            const el = scrollRef.current;
            if (!el) return;

            return Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight)
                < 1;
        }, [scrollRef, isScrolling]);

        return (
            <div
                className={cn(
                    "overflow-hidden overflow-y-auto scrollbar-thin [scrollbar-gutter:stable] [mask-composite:exclude] [mask-size:cover] [mask-image:linear-gradient(180deg,rgba(0,0,0,var(--alpha-1)),#000_1.5rem,#000_calc(100%-1.5rem),rgba(0,0,0,var(--alpha-0)))] transition-all",
                    {
                        "[--alpha-1:0]": !isAtTop,
                        "[--alpha-0:1]": isAtBottom,
                    },
                    className,
                )}
                style={{
                    transition:
                        "--alpha-0 0.1s ease-out, --alpha-1 0.1s ease-out",
                }}
                {...props}
                ref={scrollRef}
            >
                {children}
            </div>
        );
    },
);
