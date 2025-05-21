import fs from "fs";
const json_path = "/settings/disponible_settings.json";

export function getDS(path) {
    return JSON.parse(fs.readFileSync(`${path}${json_path}`));
}