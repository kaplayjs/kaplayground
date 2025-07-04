import {
    confirmCallback,
    type ConfirmContent,
    type ConfirmOptions,
} from "./confirm";

export type DefaultValue = string | null;

export type PromptOptions = ConfirmOptions & {
    prefix?: string;
    suffix?: string;
};

export type PromptCallback = (
    title: string,
    resolve: (value: string | null) => void,
    content?: ConfirmContent,
    options?: PromptOptions,
    defaultValue?: DefaultValue,
) => void;

export function prompt(
    title: string,
    defaultValue?: DefaultValue,
    content?: ConfirmContent,
    options?: PromptOptions,
): Promise<string | null> {
    return new Promise(resolve => {
        (confirmCallback as PromptCallback)?.(
            title,
            resolve,
            content,
            {
                confirmText: "Submit",
                dismissText: "Cancel",
                isPrompt: true,
                ...options,
            } as PromptOptions & { isPrompt: true },
            defaultValue,
        );
    });
}
