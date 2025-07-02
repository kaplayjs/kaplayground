import { useEffect, useRef, useState } from "react";
import {
    type ConfirmContent,
    type ConfirmOptions,
    registerConfirm,
} from "../../util/confirm";
import { Dialog } from "./Dialog";

export const ConfirmDialog = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<ConfirmContent>(null);
    const [resolve, setResolve] = useState<(value: boolean) => void>(
        () => () => {},
    );
    const [options, setOptions] = useState<ConfirmOptions>({});
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        registerConfirm((title, resolver, content, options) => {
            setTitle(title);
            setContent(() => content);
            setResolve(() => resolver);
            setOptions(options ?? {});
            dialogRef.current?.showModal();
        });
    }, []);

    const handleConfirm = () => {
        resolve(true);
    };

    const handleDismiss = () => {
        resolve(false);
    };

    return (
        <Dialog
            ref={dialogRef}
            onConfirm={handleConfirm}
            onDismiss={handleDismiss}
            confirmText={options?.confirmText}
            confirmType={options?.type}
            dismissText={options?.dismissText}
        >
            {title && (
                <h2 className="text-xl text-white font-bold mb-3 only:mb-0">
                    {title}
                </h2>
            )}

            {typeof content === "string" ? <p>{content}</p> : content}
        </Dialog>
    );
};
