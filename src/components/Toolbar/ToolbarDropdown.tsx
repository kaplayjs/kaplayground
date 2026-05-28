import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ComponentProps, FC, LegacyRef, PropsWithChildren } from "react";
import { cn } from "../../util/cn";
import { ToolbarButton } from "./ToolbarButton";

type ToolbarDropwdownProps =
    & PropsWithChildren<ComponentProps<typeof ToolbarButton>>
    & {
        open?: boolean;
        setOpen?: (v: boolean) => void;
        loop?: boolean;
        portalContainer?: HTMLElement;
        align?: "center" | "end" | "start";
        contentClass?: string;
        alignOffset?: number;
        contentRef?: LegacyRef<HTMLDivElement> | undefined;
    };

export const ToolbarDropdown: FC<ToolbarDropwdownProps> = (
    {
        children,
        contentRef,
        open,
        setOpen,
        portalContainer,
        loop,
        align = "end",
        alignOffset,
        contentClass,
        ...toolbarButtonProps
    },
) => {
    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
                <ToolbarButton
                    tabIndex={0}
                    {...toolbarButtonProps}
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal container={portalContainer}>
                <DropdownMenu.Content
                    className={cn(
                        "rounded-btn p-1 bg-base-100 flex flex-col shadow-xl mt-px z-50",
                        contentClass,
                    )}
                    ref={contentRef}
                    align={align}
                    alignOffset={alignOffset}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    loop={loop}
                >
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
