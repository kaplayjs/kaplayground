import { type ComponentProps, type FC, forwardRef } from "react";
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
        mainClass,
        contentClass,
        ...props
    },
    ref,
) => {
    const confirmBtnClass = {
        "btn-error": confirmType == "danger",
        "btn-warning": confirmType == "warning",
        "btn-ghost bg-base-content/10": confirmType == "neutral",
    };

    return (
        <dialog
            ref={ref}
            className="modal backdrop:opacity-0 bg-[#0a0c10]/50"
            id={props.id}
        >
            <main
                className={cn(
                    "modal-box flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden px-0 py-0 focus:outline-none",
                    { "max-w-[468px]": onConfirm },
                    mainClass,
                )}
                tabIndex={0}
            >
                <section
                    className={cn(
                        "p-6 max-h-full overflow-y-auto [&:has(>p)]:space-y-3",
                        contentClass,
                    )}
                >
                    {props.children}
                </section>

                {(onSave || onConfirm || onDismiss) && (
                    <footer className="px-6 py-5 bg-base-200">
                        <div className="modal-action mt-0">
                            <form
                                method="dialog"
                                className="flex flex-wrap justify-between gap-2 w-full"
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
                                            "btn btn-primary py-3 min-h-0 h-auto only:ml-auto",
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
                                        className="btn btn-primary py-3 min-h-0 h-auto only:ml-auto"
                                        onClick={onSave}
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
                <button
                    onClick={() => {
                        onCloseWithoutSave && onCloseWithoutSave();
                        onDismiss && onDismiss();
                    }}
                >
                    Close
                </button>
            </form>
        </dialog>
    );
});
