import { ReactNode } from "react";

export type ConfirmContent = string | ReactNode;
export type ConfirmOptions = {
    confirmText?: string;
    dismissText?: string;
    type?: "danger" | "warning" | "neutral";
    cancelImmediate?: boolean;
};
export type ConfrimCallback = (
    title: string,
    resolve: (value: boolean) => void,
    content?: ConfirmContent,
    options?: ConfirmOptions,
) => void;

let confirmCallback: ConfrimCallback;

export function confirm(
    title: string,
    content?: ConfirmContent,
    options?: ConfirmOptions,
): Promise<boolean> {
    return new Promise(resolve => {
        confirmCallback?.(title, resolve, content, options ?? {});
    });
}

export function registerConfirm(cb: ConfrimCallback): void {
    confirmCallback = cb;
}
