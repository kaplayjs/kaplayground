import type { ComponentProps, ElementType, FC, PropsWithChildren } from "react";
import { cn } from "../../util/cn";

export type ViewProps = PropsWithChildren<
    {
        direction?: "row" | "column";
        gap?: 2 | 4 | 8;
        padding?: 2 | 4 | 8;
        justify?: "center" | "start" | "end" | "between" | "around";
        height?: "full" | "screen";
        rounded?: "lg" | "md" | "sm";
        cursor?: "pointer" | "default";
        className?: string;
        id?: string;
        el: ElementType<
            {
                className?: string;
            } & ComponentProps<"div">
        >;
    } & ComponentProps<"div">
>;

export const View: FC<ViewProps> = (props) => {
    const {
        direction,
        gap,
        justify,
        children,
        el,
        className,
        cursor,
        height,
        padding,
        rounded,
        ...rest
    } = props;

    const needsFlex = direction || gap || justify;

    return (
        <props.el
            className={cn([{
                "flex": needsFlex,
                "flex-col": direction === "column",
                "flex-row": direction === "row",
                "gap-2": gap === 2,
                "gap-4": gap === 4,
                "gap-8": gap === 8,
                "p-2": padding === 2,
                "p-4": padding === 4,
                "p-8": padding === 8,
                "justify-center": justify === "center",
                "justify-start": justify === "start",
                "justify-end": justify === "end",
                "justify-between": justify === "between",
                "justify-around": justify === "around",
                "h-full": height === "full",
                "h-screen": height === "screen",
                "rounded-lg": rounded === "lg",
                "rounded-md": rounded === "md",
                "rounded-sm": rounded === "sm",
                "cursor-pointer": cursor === "pointer",
                "cursor-default": cursor === "default",
            }, className])}
            id={rest.id}
            {...rest}
        >
            {children}
        </props.el>
    );
};
