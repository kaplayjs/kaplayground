export const fileSize = (bytes: number) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const s = ["B", "KB", "MB", "GB", "TB", "PB"][i];
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${s}`;
};
