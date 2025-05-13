import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { type ComponentProps, type FC, forwardRef } from "react";

type DropdownSeparatorProps = ComponentProps<typeof DropdownMenuSeparator>;

export const KDropdownMenuSeparator: FC<DropdownSeparatorProps> = forwardRef((
    { children, ...props },
    ref,
) => {
    return (
        <DropdownMenuSeparator
            className="flex items- py-1 after:w-full after:border-t after:border-base-content/10"
            ref={ref}
            {...props}
        />
    );
});
