import type { FC, PropsWithChildren } from "react";
import { cn } from "../../util/cn";

export type ViewProps = PropsWithChildren<{
    direction?: "row" | "column";
    gap?: 2 | 4 | 8;
    padding?: 2 | 4 | 8;
}>;

export const View: FC<ViewProps> = (props) => {
    const needsFlex = props.direction || props.gap;

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
            })}
        >
            {props.children}
        </div>
    );
};
