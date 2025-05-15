import fs from "fs";
const cb_data_path = "/settings/chatbot_data.json";

export function getData(path) {
    return JSON.parse(fs.readFileSync(`${path}${cb_data_path}`));
}