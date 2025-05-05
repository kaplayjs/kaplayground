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
            className="btn btn-xs btn-ghost font-normal text-left justify-start pl-1.5 rounded-md px-10 hover:outline-none aria-disabled:btn-disabled aria-disabled:!bg-opacity-0"
            ref={ref}
            {...props}
        >
            {children}
        </ContextMenu.Item>
    );
});
