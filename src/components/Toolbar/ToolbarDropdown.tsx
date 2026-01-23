import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import { ToolbarButton } from "./ToolbarButton";

type ToolbarDropwdownProps =
    & PropsWithChildren<ComponentProps<typeof ToolbarButton>>
    & {
        open?: boolean;
        setOpen?: (v: boolean) => void;
    };

export const ToolbarDropdown: FC<ToolbarDropwdownProps> = (
    { children, open, setOpen, ...toolbarButtonProps },
) => {
    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
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
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
