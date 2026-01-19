export function openDialog(
    id: string,
    params?: Partial<Record<string, unknown> & { lazy?: boolean }>,
) {
    const open = () => {
        document.querySelector<HTMLDialogElement>(`#${id}`)
            ?.showModal();
    };

    if (params) {
        window.dispatchEvent(
            new CustomEvent("dialog-open", { detail: { id, params, open } }),
        );
    }

    if (!params?.lazy) open();
}
