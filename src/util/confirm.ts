import { type ReactNode } from "react";
import { PromptCallback } from "./prompt";

export type ConfirmContent = string | ReactNode;
export type ConfirmOptions = {
    confirmText?: string;
    dismissText?: string;
    type?: "danger" | "warning" | "neutral";
    cancelImmediate?: boolean;
};
export type ConfirmCallback = (
    title: string,
    resolve: (value: boolean) => void,
    content?: ConfirmContent,
    options?: ConfirmOptions,
) => void;

export let confirmCallback: ConfirmCallback | PromptCallback;

export function confirm(
    title: string,
    content?: ConfirmContent,
    options?: ConfirmOptions,
): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        (confirmCallback as ConfirmCallback)?.(
            title,
            resolve,
            content,
            options ?? {},
        );
    });
}

export function registerConfirm(cb: ConfirmCallback | PromptCallback): void {
    confirmCallback = cb;
}
