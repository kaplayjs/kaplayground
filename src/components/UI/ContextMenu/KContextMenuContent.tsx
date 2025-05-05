import * as ContextMenu from "@radix-ui/react-context-menu";
import { type ComponentProps, type FC, forwardRef } from "react";

// infer original props from ContextMenu.Content
type ContextMenuContentProps = {
    title: string;
} & ComponentProps<typeof ContextMenu.Content>;

export const KContextMenuContent: FC<ContextMenuContentProps> = forwardRef((
    { title, ...props },
    ref,
) => {
    return (
        <ContextMenu.Content
            ref={ref}
            className="rounded-btn p-1 bg-base-200 flex flex-col shadow-xl"
            {...props}
        >
            <div className="font-bold px-10 text-left pl-1">
                {title}
            </div>

            {props.children}
        </ContextMenu.Content>
    );
});
