import fs from "fs";

const cb_data_path = "/settings/notif_data.json";

export function getNotifData(path) {
    return JSON.parse(fs.readFileSync(`${path}${cb_data_path}`));
}
export function setNotifData(path, obj) {
    fs.writeFileSync(`${path}${cb_data_path}`, JSON.stringify(obj, null, 2), "utf8");
}