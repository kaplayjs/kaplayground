import {
    type ComponentProps,
    type FC,
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";
import { Slide, ToastContainer } from "react-toastify";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "../../util/cn";

interface DialogProps extends ComponentProps<"dialog"> {
    onSave?: () => void;
    onCloseWithoutSave?: () => void;
    onConfirm?: () => void;
    onDismiss?: () => void;
    confirmText?: string;
    confirmType?: "danger" | "warning" | "neutral";
    dismissText?: string;
    saveDisabled?: boolean;
    cancelImmediate?: boolean;
    mainClass?: ClassNameValue;
    contentClass?: ClassNameValue;
}

export const Dialog: FC<DialogProps> = forwardRef<
    HTMLDialogElement,
    DialogProps
>((
    {
        onSave,
        onCloseWithoutSave,
        onConfirm,
        onDismiss,
        confirmText,
        confirmType,
        dismissText,
        saveDisabled,
        cancelImmediate,
        className,
        mainClass,
        contentClass,
        ...props
    },
    ref,
) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

    const confirmBtnClass = {
        "btn-error": confirmType == "danger",
        "btn-warning": confirmType == "warning",
        "btn-ghost bg-base-content/10": confirmType == "neutral",
    };

    const onCancel = () => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const cancel = () => {
            onCloseWithoutSave?.();
            onDismiss?.();
            if (!cancelImmediate) {
                dialog.removeEventListener("transitionend", cancel);
            }
        };

        if (cancelImmediate) {
            cancel();
            return;
        }

        dialog.addEventListener("transitionend", cancel, {
            once: true,
        });
    };

    return (
        <dialog
            ref={dialogRef}
            id={props.id}
            className={cn(
                "modal has-[[data-radix-menu-content][data-state='open']]:pointer-events-none",
                className,
            )}
            onCancel={onCancel}
        >
            <main
                className={cn(
                    "modal-box flex flex-col max-h-[calc(100vh-2rem)] min-h-0 overflow-visible px-0 py-0 rounded-box focus:outline-none",
                    { "max-w-[468px]": onConfirm },
                    mainClass,
                )}
                tabIndex={0}
            >
                <section
                    className={cn(
                        "p-6 max-h-full overflow-x-hidden overflow-y-auto [&:has(>p)]:space-y-3 rounded-[inherit]",
                        contentClass,
                    )}
                >
                    {props.children}
                </section>

                {(onSave || onConfirm || onDismiss) && (
                    <footer className="px-6 py-5 bg-base-200 rounded-b-box">
                        <div className="modal-action mt-0">
                            <form
                                method="dialog"
                                className="flex flex-wrap justify-between gap-2 w-full"
                                key={confirmType}
                            >
                                {onDismiss && confirmType != "neutral" && (
                                    <button
                                        className="btn bg-base-content/10 py-3 min-h-0 h-auto only:ml-auto"
                                        onClick={onDismiss}
                                    >
                                        {dismissText || "No"}
                                    </button>
                                )}

                                {onConfirm && (
                                    <button
                                        className={cn(
                                            "btn py-3 min-h-0 h-auto only:ml-auto",
                                            confirmBtnClass,
                                        )}
                                        onClick={onConfirm}
                                    >
                                        {confirmText
                                            || (confirmType == "neutral"
                                                ? "OK"
                                                : "Yes")}
                                    </button>
                                )}

                                {onSave && (
                                    <button
                                        className="btn btn-primary py-3 min-h-0 h-auto only:ml-auto disabled:bg-neutral disabled:text-base-content/50"
                                        onClick={onSave}
                                        disabled={saveDisabled}
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </form>
                        </div>
                    </footer>
                )}
            </main>
            <form
                method="dialog"
                className="modal-backdrop"
            >
                <button onClick={onCancel}>Close</button>
            </form>

            {props.id && (
                <div className="absolute bottom-0 right-0">
                    <ToastContainer
                        containerId={`${props.id}-toasts`}
                        position="bottom-right"
                        transition={Slide}
                    />
                </div>
            )}
        </dialog>
    );
});
