export type Type = "string" | "number" | "boolean";

export function stringToType(
    value: string,
    type: Type,
): string | number | boolean {
    if (type === "number") return parseInt(value, 10);
    if (type === "boolean") return value === "true";
    return value;
}
