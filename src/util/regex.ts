// Regex utilities
export const DATA_URL_REGEX = /data:[^;]+;base64,[A-Za-z0-9+\/]+={0,2}/g;
export const SCENE_NAME_REGEX = /(?:\b(?:k\.)?scene\s*\(\s*")([^"]*)"/g;
export const COLOR_HEX_STRING = /(['"])(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}))\1/g;
export const COLOR_RGB_FUNC =
    /(?:k\.)?rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g;
export const FUNCTION_PARAMS = /function\s+\w+\s*\(([^)]*)\)/g;
