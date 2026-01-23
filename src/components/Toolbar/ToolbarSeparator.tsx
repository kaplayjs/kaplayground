import type { FC, HTMLAttributes } from "react";
import { cn } from "../../util/cn";

export const ToolbarSeparator: FC<HTMLAttributes<HTMLDivElement>> = (
    { className },
) => {
    return (
        <div
            className={cn(
                "divider divider-horizontal mx-0 px-0 before:w-px after:w-px",
                className,
            )}
        />
    );
};
