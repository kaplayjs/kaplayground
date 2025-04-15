export type Allotments = "editor" | "brew" | "console";

const getAllotmentKey = (prefix: string, id: Allotments): string => {
    return `allotment-${prefix}-${id}`;
};

export const allotmentStorage = (prefix: string) => ({
    getAllotmentSize: (id: Allotments, initial: number[] = []): number[] =>
        JSON.parse(
            localStorage.getItem(getAllotmentKey(prefix, id))
                ?? JSON.stringify(initial),
        ),
    setAllotmentSize: (id: Allotments, size: number[]): void =>
        localStorage.setItem(getAllotmentKey(prefix, id), JSON.stringify(size)),
});
