import * as ContextMenu from "@radix-ui/react-context-menu";
import { type ComponentProps, type FC, forwardRef } from "react";

// infer original props from ContextMenu.Separator
type ContextMenuSeparatorProps = ComponentProps<typeof ContextMenu.Separator>;

export const KContextMenuSeparator: FC<ContextMenuSeparatorProps> = forwardRef((
    { children, ...props },
    ref,
) => {
    return (
        <ContextMenu.Separator
            className="flex items-center -mx-1 py-1 after:w-full after:border-t after:border-base-content/10"
            ref={ref}
            {...props}
        />
    );
});
