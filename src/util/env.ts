export const isTauri = () => !!(window && "__TAURI_IPC__" in window);
