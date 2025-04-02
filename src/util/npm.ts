import type { Packument } from "query-registry";

export const getPackageInfo = async (name: string): Promise<Packument> => {
    const endpoint = `https://registry.npmjs.org/${name}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
};
