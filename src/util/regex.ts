// Regex utilities

export const DATA_URL_REGEX = /data:[^;]+;base64,[A-Za-z0-9+\/]+={0,2}/g;
export const MATCH_ASSET_URL_REGEX =
    /load\w+\(\s*["'`][^"'`]*["'`]\s*,\s*["'`]([^"'`]*)["'`]/gs;
export const INSIDE_ADD_ARRAY_REGEX = /(?:\b(?:k\.)?add\s*\(\s*\[)[^\]]*$/;
