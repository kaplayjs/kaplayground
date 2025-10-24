export function openDialog(id: string, params?: unknown) {
    if (params) {
        window.dispatchEvent(
            new CustomEvent("dialog-open", { detail: { id, params } }),
        );
    }

    document.querySelector<HTMLDialogElement>(`#${id}`)
        ?.showModal();
}
