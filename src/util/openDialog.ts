export const openDialog = (id: string): void => {
    document.querySelector<HTMLDialogElement>(`#${id}`)
        ?.showModal();
};
