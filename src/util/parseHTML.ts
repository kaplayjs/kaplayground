export const parseHTML = (html: string, keys: Record<string, string>) => {
    return html.replace(/{{(.*?)}}/g, (_, key) => keys[key]);
};
