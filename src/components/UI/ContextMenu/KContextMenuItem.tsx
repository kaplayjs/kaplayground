import * as ContextMenu from "@radix-ui/react-context-menu";
import { type ComponentProps, type FC, forwardRef } from "react";

// infer original props from ContextMenu.Content
type ContextMenuItemProps = ComponentProps<typeof ContextMenu.Item>;

export const KContextMenuItem: FC<ContextMenuItemProps> = forwardRef((
    { children, ...props },
    ref,
) => {
    return (
        <ContextMenu.Item
            className="btn btn-xs btn-ghost text-left justify-start pl-1 rounded-md px-10 hover:outline-none"
            ref={ref}
            {...props}
        >
            {children}
        </ContextMenu.Item>
    );
});
