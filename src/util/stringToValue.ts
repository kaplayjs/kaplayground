export const stringToValue = (value: string) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value)) && (parseFloat(value) % 0 == 0)) {
        return Number(value);
    }
    return value;
};
