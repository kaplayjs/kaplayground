import {
    DropdownMenuItem,
    DropdownMenuItemProps,
} from "@radix-ui/react-dropdown-menu";
import type { FC, PropsWithChildren, RefObject } from "react";

interface ToolbarDropdownButtonProps extends
    PropsWithChildren<
        DropdownMenuItemProps
    >
{
    ref?: RefObject<HTMLDivElement>;
}

export const ToolbarDropdownButton: FC<ToolbarDropdownButtonProps> = ({
    children,
    ...props
}) => {
    return (
        <DropdownMenuItem
            className="btn btn-sm btn-ghost font-normal text-left justify-start pl-1.5 rounded-md px-10 hover:outline-none aria-disabled:btn-disabled aria-disabled:!bg-opacity-0"
            {...props}
        >
            {children}
        </DropdownMenuItem>
    );
};
