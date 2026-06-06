import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { type ComponentProps, type FC, forwardRef } from "react";
import { cn } from "../../../util/cn";

type DropdownSeparatorProps = ComponentProps<typeof DropdownMenuSeparator>;

export const KDropdownMenuSeparator: FC<DropdownSeparatorProps> = forwardRef((
    { children, className, ...props },
    ref,
) => {
    return (
        <DropdownMenuSeparator
            className={cn(
                "flex items- py-1 after:w-full after:border-t after:border-base-content/10",
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
