import fs from "fs";
const css_root_path = "/settings/root.css";
const json_settings_path = "/settings/user_settings.json";

export function update_css_settings(path) {
    const user_settings = JSON.parse(fs.readFileSync(`${path}${json_settings_path}`));
    const css_usual_settings = user_settings.css_settings.usual_settings;
    const css_vars_settings = user_settings.css_settings.vars;
    const txt = [];
    
    for(let type in css_usual_settings) {
        txt.push(`${type}: ${css_usual_settings[type]};`);
    }
    for(let var_name in css_vars_settings) {
        txt.push(`--${var_name}: ${css_vars_settings[var_name]};`);
    }
    const css_txt = `:root { \n${txt.join('\n')} \n}`;
    fs.writeFileSync(`${path}${css_root_path}`, css_txt, "utf8");
}