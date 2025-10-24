import {
    DropdownMenuItem,
    DropdownMenuItemProps,
} from "@radix-ui/react-dropdown-menu";
import { forwardRef, type PropsWithChildren } from "react";
import { cn } from "../../util/cn";

type ToolbarDropdownButtonProps = PropsWithChildren<
    DropdownMenuItemProps & {
        type?: "neutral" | "danger";
    }
>;

export const ToolbarDropdownButton = forwardRef<
    HTMLDivElement,
    ToolbarDropdownButtonProps
>(({ children, type, ...props }, ref) => {
    return (
        <DropdownMenuItem
            ref={ref}
            className={cn(
                "btn btn-sm btn-ghost font-normal text-left justify-start rounded-md px-10 pl-1.5 hover:outline-none aria-disabled:btn-disabled aria-disabled:!bg-opacity-0",
                { "hover:bg-error hover:text-error-content": type == "danger" },
            )}
            {...props}
        >
            {children}
        </DropdownMenuItem>
    );
});
