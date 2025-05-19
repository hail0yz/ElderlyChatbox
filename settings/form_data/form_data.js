import fs from "fs";
const cb_data_path = "/settings/form_data/form_data.json";

export function getFormData(path) {
    return JSON.parse(fs.readFileSync(`${path}${cb_data_path}`));
}
export function setFormData(path, obj) {
    fs.writeFileSync(`${path}${cb_data_path}`, JSON.stringify(obj, null, 2), "utf8");
}