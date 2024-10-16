import type { FC, PropsWithChildren } from "react";
import { cn } from "../../util/cn";

export type ViewProps = PropsWithChildren<{
    direction?: "row" | "column";
    gap?: 2 | 4 | 8;
    padding?: 2 | 4 | 8;
    justify?: "center" | "start" | "end" | "between" | "around";
    height?: "full" | "screen";
    className?: string;
}>;

export const View: FC<ViewProps> = (props) => {
    const needsFlex = props.direction || props.gap || props.justify;

    return (
        <div
            className={cn({
                "flex": needsFlex,
                "flex-col": props.direction === "column",
                "flex-row": props.direction === "row",
                "gap-2": props.gap === 2,
                "gap-4": props.gap === 4,
                "gap-8": props.gap === 8,
                "p-2": props.padding === 2,
                "p-4": props.padding === 4,
                "p-8": props.padding === 8,
                "justify-center": props.justify === "center",
                "justify-start": props.justify === "start",
                "justify-end": props.justify === "end",
                "justify-between": props.justify === "between",
                "justify-around": props.justify === "around",
                "h-full": props.height === "full",
                "h-screen": props.height === "screen",
            }, props.className)}
        >
            {props.children}
        </div>
    );
};
