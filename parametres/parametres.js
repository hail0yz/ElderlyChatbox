// ========== DATA et SAVING ==========

const data = await window.chatbot_app.get_disponible_settings();

// ========== VARIABES ==========

const root_css_style = document.styleSheets[0].rules["0"].styleSheet.rules.item("../settings/root.css").styleSheet.cssRules.item(':root').style;

// Récupérer les anciens style du root.css
const new_style = { 
    "color": root_css_style["color"],
    "background-color": root_css_style["background-color"],
    "border-color": root_css_style["border-top-color"],
    "font-family": root_css_style["font-family"],
    "font-size": parseInt(root_css_style["font-size"].slice(0,-2)),
};
// Pour l'exemple et "se souvenir" de comment faire
const new_vars = {
    // var_name : var_value
    "red": "#ff0000",
    "col1": getValueOf('col1'),
    "col2": getValueOf('col2'),
    "col3": getValueOf('col3'),
    "col4": getValueOf('col4'),
    "col5": getValueOf('col5')
};
get_custom_vars();

const palette_button = document.getElementById('palette_button');
let palette_button_state = false;

const exemple_style = document.getElementById("exemple").style; 
set_color_options();
set_font_family_options(data.font_family);

// ========== EVENTS HANDLER ==========

// size +/-
document.getElementById("sizeUP").addEventListener("click", ()=>{updateFontSize(true)});
document.getElementById("sizeDOWN").addEventListener("click", ()=>{updateFontSize(false)});

// palette
document.querySelectorAll('.palette-option input').forEach(color_input=>{
    color_input.addEventListener("change",()=>updateColorPalette(color_input))
});
palette_button.addEventListener("click", paletteButtonFun)

// font family
document.querySelector('#font_family select').addEventListener("change", updateFontFamily)

document.getElementById("save").addEventListener("click", storeParametres)

// ========== INPUT FUNCTIONS ==========

function updateFontSize(isSizeUp) {
    const new_size = new_style["font-size"] + (isSizeUp?data.font_size.step:-data.font_size.step);
    if(new_size >= data.font_size.min && new_size <= data.font_size.max ) {
        exemple_style.fontSize = `${new_size}px`;
        new_style["font-size"] = new_size;
    }
}

function updateColorPalette(color_input) {
    document.querySelector(".selected").classList.add("notselected");
    document.querySelector(".selected").classList.remove("selected");
    
    color_input.classList.remove("notselected");
    color_input.classList.add("selected");
    
    const id = color_input.value;
    
    const palette = data.color_palette[id].palette;
    const spe = data.color_palette[id].spe;
    
    for(let i = 0; i < 5; i++) updateVar(`col${i+1}`, palette[i]);
    
    for(let s in spe) {
        if(s==="chatbox_header_bg_gradiant" && spe[s]==="auto") {
            const c = (`${spe["chatbox_header_bg"]}`.startsWith("#")?spe["chatbox_header_bg"]:palette[spe["chatbox_header_bg"]]).slice(1);
            updateVar(s, `#${c.split('').map(e=>(Math.floor(Math.min(15,parseInt(e,16)+4))).toString(16)).join('')}`);
            continue;
        }
        const v = spe[s];
        updateVar(s, `${v}`.startsWith("#")?v:palette[v]);
    }
}
function updateVar(name, value) {
    console.log('parametre', name, "go from", new_vars[name], "to", value);
    new_vars[name] = value;
    // Change la couleur de partout, pas que de l'exemple, pour tester quand on utilisera les --col
    document.documentElement.style.setProperty(`--${name}`, value);
}
function paletteButtonFun() {
    if(palette_button_state) { // affichait toutes les palette
        palette_button.textContent = "Afficher les palettes";
        document.querySelectorAll(".notselected").forEach(elem=>{
            elem.style.display = "none";
        })
        palette_button_state = false;
    } else { // affichait une seul palette
        palette_button.textContent = "Masquer les palettes";
        document.querySelectorAll(".notselected").forEach(elem=>{
            elem.style.display = "";
        })
        palette_button_state = true;
    }
}

function updateFontFamily() {
    exemple_style.fontFamily = data.font_family[document.querySelector('#font_family select').value];
}

function storeParametres() {
    new_style["font-size"] = `${new_style["font-size"]}px`;
    window.chatbot_app.update_css_settings({
        "usual_settings": new_style,
        "vars": new_vars
    });
    window.location.reload();
}

// ========== INIT FUNCTION ==========

function getValueOf(var_name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${var_name}`);
}

function set_color_options() {
    const options = document.getElementById("color_palette");
    for(let id in data.color_palette) {
        options.appendChild(createColorOption(data.color_palette[id].palette, id));
    }
}
function createColorOption(palette, id) {
    
    const input = document.createElement('input');
    input.type = "radio";
    input.name = "color_option";
    input.value = id;
    
    const label = document.createElement('label');
    label.appendChild(input);
    
    if(palette[0]===new_vars.col1) {
        label.classList.add("palette-option", "selected");
        input.checked = true;
    } else {
        label.classList.add("palette-option", "notselected");
        label.style.display = "none";
    }
    
    palette.forEach(color=>{
        const color_div = document.createElement("div");
        color_div.classList.add("single-palette-color");
        color_div.style.backgroundColor = color;
        label.appendChild(color_div);
    })
    
    return label;
}

function set_font_family_options(font_family_obj) {
    const select_part = document.querySelector('#font_family select');
    for(let ff in font_family_obj) {
        
        const option = document.createElement('option');
        option.style.fontFamily = font_family_obj[ff];
        option.textContent = ff;
        option.value = ff;
        
        select_part.appendChild(option);
    }
}

function get_custom_vars() {
    for(let v in data.color_palette[0].spe) {
        new_vars[v] = getValueOf(v)
    }
}