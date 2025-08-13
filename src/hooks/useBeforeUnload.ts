import { useEffect } from "react";

export const useBeforeUnload = async (
    hasUnsavedChanges: boolean,
    focusQuerySelector: string = "#project-save-button",
) => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!hasUnsavedChanges) return;
        e.preventDefault();

        if (focusQuerySelector) {
            window.addEventListener("focus", () => {
                setTimeout(() =>
                    document.querySelector<HTMLElement>(focusQuerySelector)
                        ?.focus()
                );
            }, { once: true });
        }
    };

    useEffect(() => {
        if (hasUnsavedChanges) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
};
