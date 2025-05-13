import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { FC, PropsWithChildren } from "react";
import { ToolbarButton } from "./ToolbarButton";

interface ToolbarDropwdownProps extends PropsWithChildren {
    icon: string;
    tip: string;
    text: string;
}

export const ToolbarDropdown: FC<ToolbarDropwdownProps> = (
    { children, ...toolbarButtonProps },
) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <ToolbarButton
                    tabIndex={0}
                    {...toolbarButtonProps}
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="rounded-btn p-1 bg-base-100 flex flex-col shadow-xl mt-px"
                    align="end"
                >
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
