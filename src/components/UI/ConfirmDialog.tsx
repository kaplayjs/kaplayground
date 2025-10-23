import { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
    type ConfirmContent,
    type ConfirmOptions,
    registerConfirm,
} from "../../util/confirm";
import { PromptOptions } from "../../util/prompt";
import { Dialog } from "./Dialog";

const JoinItem = ({ children }: PropsWithChildren) => (
    <div className="join-item input input-bordered input-sm h-auto min-h-0 py-1 bg-base-200/80 bg-clip-padding [&~&]:border-l-transparent">
        {children}
    </div>
);

export const ConfirmDialog = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<ConfirmContent>(null);
    const [resolve, setResolve] = useState<
        (value: boolean | string | null) => void
    >(
        () => () => {},
    );
    const [options, setOptions] = useState<
        (ConfirmOptions | PromptOptions) & { isPrompt?: true }
    >({});
    const [inputValue, setInputValue] = useState<string>("");
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        registerConfirm((title, resolver, content, options, defaultValue) => {
            setTitle(title);
            setContent(() => content);
            setResolve(() => resolver);
            setOptions(options ?? {});
            dialogRef.current?.showModal();
            setInputValue(defaultValue ?? "");
            inputRef.current?.focus();
        });
    }, []);

    const handleConfirm = () => {
        resolve(options?.isPrompt ? inputValue.trim() : true);
    };

    const handleDismiss = () => {
        resolve(options?.isPrompt ? null : false);
    };

    return (
        <Dialog
            id="confirm-dialog"
            ref={dialogRef}
            onConfirm={handleConfirm}
            onDismiss={handleDismiss}
            confirmText={options?.confirmText}
            confirmType={options?.type}
            dismissText={options?.dismissText}
            cancelImmediate={options?.cancelImmediate}
        >
            {title && (
                <h2 className="text-xl text-white font-bold mb-3 only:mb-0">
                    {title}
                </h2>
            )}

            {options?.isPrompt && (
                <form
                    method="dialog"
                    className="join w-full"
                    onSubmit={handleConfirm}
                >
                    {"prefix" in options && (
                        <JoinItem>{options.prefix}</JoinItem>
                    )}

                    <input
                        ref={inputRef}
                        type="text"
                        className="join-item input input-bordered input-sm w-full h-auto min-h-0 py-1"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        required
                        autoFocus
                    />

                    {"suffix" in options && (
                        <JoinItem>{options.suffix}</JoinItem>
                    )}
                </form>
            )}

            {typeof content === "string" ? <p>{content}</p> : content}
        </Dialog>
    );
};
