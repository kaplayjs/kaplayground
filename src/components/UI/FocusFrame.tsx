import {
    type ComponentPropsWithoutRef,
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";
import { cn } from "../../util/cn";

export type FocusFrameHandle = {
    blink: () => void;
};

type FocusFrameProps = ComponentPropsWithoutRef<"div">;

export function useFocusFrameRef() {
    return useRef<FocusFrameHandle | null>(null);
}

export const FocusFrame = forwardRef<
    FocusFrameHandle,
    FocusFrameProps
>((
    { className, ...props },
    ref,
) => {
    const elRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        blink() {
            elRef.current?.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                {
                    duration: 300,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "forwards",
                },
            );
        },
    }));

    return (
        <div
            ref={elRef}
            className={cn(
                "absolute inset-0 border-2 border-base-content/50 ring-2 ring-inset ring-base-200 rounded-[inherit] pointer-events-none opacity-0 z-10",
                className,
            )}
            {...props}
        />
    );
});
