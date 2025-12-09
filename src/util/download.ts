export const downloadBlob = async (blob: Blob, filename: string) => {
    const reader = new FileReader();

    reader.onloadend = () => {
        const a = document.createElement("a");
        a.href = reader.result as string;
        a.download = filename;
        a.click();
    };

    reader.readAsDataURL(blob);
};
