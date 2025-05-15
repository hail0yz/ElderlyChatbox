import fs from "fs";
const css_root_path = "/settings/root.css";
//const json_settings_path = "/settings/user_settings.json";

export function update_css_settings(path, user_settings) {
    const css_usual_settings = user_settings.usual_settings;
    const css_vars_settings = user_settings.vars;
    const txt = [];
    
    for(let var_name in css_vars_settings) {
        txt.push(`--${var_name}: ${css_vars_settings[var_name]};`);
    }
    for(let type in css_usual_settings) {
        txt.push(`${type}: ${css_usual_settings[type]};`);
    }

    const root_txt = `:root { \n    ${txt.join('\n    ')}\n}`;
    fs.writeFileSync(`${path}${css_root_path}`, root_txt, "utf8");
}