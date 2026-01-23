import {
    DropdownMenuItem,
    DropdownMenuItemProps,
} from "@radix-ui/react-dropdown-menu";
import { forwardRef, Fragment, type PropsWithChildren } from "react";
import { cn } from "../../util/cn";
import normalizeKey from "../../util/normalizeKey";

type ToolbarDropdownButtonProps = PropsWithChildren<
    DropdownMenuItemProps & {
        type?: "neutral" | "danger";
        icon?: string;
        text?: string;
        keys?: string[];
    }
>;

export const ToolbarDropdownButton = forwardRef<
    HTMLDivElement,
    ToolbarDropdownButtonProps
>(({ children, type, icon, text, keys, ...props }, ref) => {
    return (
        <DropdownMenuItem
            ref={ref}
            className={cn(
                "btn btn-sm btn-ghost font-normal text-left justify-start rounded-md pl-1.5 hover:outline-none aria-disabled:btn-disabled aria-disabled:!bg-opacity-0",
                { "hover:bg-error hover:text-error-content": type == "danger" },
            )}
            {...props}
        >
            {icon && (
                <img
                    src={icon}
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                />
            )}

            {text && text}

            {children}

            <div className="flex flex-col justify-end ml-auto pl-1 min-w-10 text-right">
                {keys && (
                    <div className="inline-flex text-xs ml-auto opacity-60">
                        {keys.map((k, i) => (
                            <Fragment key={k}>
                                {i > 0 && <div>+</div>}
                                <div className="capitalize">
                                    {normalizeKey(k)}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
        </DropdownMenuItem>
    );
});
