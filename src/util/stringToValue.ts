export const stringToValue = (value: string) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
};
