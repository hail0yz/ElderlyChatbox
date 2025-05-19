// ========== DATA et SAVING ==========

const data = await window.chatbot_app.get_disponible_settings();

// ========== VARIABES ==========

const root_css_style = document.styleSheets[0].rules.item("../settings/root.css").styleSheet.cssRules.item(":root").style;

console.log(root_css_style["font-size"]);
console.log(root_css_style["font-size"].slice(0,-2));
console.log(parseInt(root_css_style["font-size"].slice(0,-2)));
// Récupérer les anciens style du root.css
const new_style = { 
    "color": root_css_style["color"],
    "background-color": root_css_style["background-color"],
    "border-color": root_css_style["border-top-color"],
    "font-family": root_css_style["font-family"],
    "font-size": parseInt(root_css_style["font-size"].slice(0,-2)),
    "chatbot-background": "#fff",
    "header-background-start": "#0e86b5",
    "header-background-end": "#82dcff",
    "header-text-color": "#e0e0e0",
    "outgoing-background": "#48B1DA",
    "outgoing-text-color": "#fff",
    "incoming-background-start": "#d9d9d9",
    "incoming-background-end": "#b6b6b6",
    "incoming-text-color": "#000",
    "chat-icon-color": "#48B1DA"//,
    //"button-background": "#48B1DA",
    //"button-text-color": "#FAF9F6"
};
console.log(new_style["font-size"]);
// Pour l'exemple et "se souvenir" de comment faire
const new_vars = {
    // var_name : var_value
    "red": "#ff0000",
    "col1": getValueOf('col1'),
    "col2": getValueOf('col2'),
    "col3": getValueOf('col3'),
    "col4": getValueOf('col4'),
    "col5": getValueOf('col5'),
};

const exemple_style = document.getElementById("exemple").style; 
set_color_options();

// ========== EVENTS HANDLER ==========

// size +/-
document.getElementById("sizeUP").addEventListener("click", ()=>{updateFontSize(true)});
document.getElementById("sizeDOWN").addEventListener("click", ()=>{updateFontSize(false)});

// palette
document.querySelectorAll('.palette-option input').forEach(color_input=>{
    color_input.addEventListener("change",()=>updateColorPalette(color_input.value))
});

document.getElementById("save").addEventListener("click", storeParametres)

// ========== INPUT FUNCTIONS ==========

function updateFontSize(isSizeUp) {
    const new_size = new_style["font-size"] + (isSizeUp?data.font_size.step:-data.font_size.step);
    if(new_size >= data.font_size.min && new_size <= data.font_size.max ) {
        exemple_style.fontSize = `${new_size}px`;
        new_style["font-size"] = new_size;
    }
}

function updateColorPalette(id) {
    console.log("update of ",id);
    const palette = data.color_palette[id];
    
    for(let i = 0; i < 5; i++) {
        new_vars[`col${i+1}`] = palette[i];
        // Change la couleur de partout, pas que de l'exemple, pour tester quand on utilisera les --col
        document.documentElement.style.setProperty(
            `--col${i+1}`, 
            palette[i]
        );
    }
}

// ========== INIT FUNCTION ==========

function getValueOf(var_name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${var_name}`);
}

function set_color_options() {
    const options = document.getElementById("color_palette");
    for(let id in data.color_palette) {
        console.log(id);
        options.appendChild(createColorOption(data.color_palette[id], id));
    }
}
function createColorOption(palette, id) {
    
    const input = document.createElement('input');
    input.type = "radio";
    input.name = "color_option";
    input.value = id;
    
    const label = document.createElement('label');
    label.appendChild(input);
    label.classList.add("palette-option");
    
    palette.forEach(color=>{
        const color_div = document.createElement("div");
        color_div.classList.add("single-palette-color");
        color_div.style.backgroundColor = color;
        label.appendChild(color_div);
    })
    
    return label;
}

function storeParametres() {
    new_style["font-size"] = `${new_style["font-size"]}px`;
    window.chatbot_app.update_css_settings({
        "usual_settings": new_style,
        "vars": new_vars
    });
    window.location.reload();
}

// ========== OLD ==========

/*
*   Taille de la police
*/

// Helper function to adjust color brightness
function adjustColor(hex, percent) {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Adjust brightness
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
/*
*   Couleur de la police
*/
function setFontColor(hexcode) {
    new_style.color = hexcode;
    exemple_style.color = new_style.color;
}
function setFontColorOutgoing(hexcode) {
    new_style.fontoutgoing = hexcode;
    exemple_style.fontoutgoing = new_style.fontoutgoing;
    
}
function setIncomingColor(hexcode) {
    new_style.incoming = hexcode;
    exemple_style.incoming = new_style.incoming;
    
    // Update assistant incoming background
    new_style["incoming-background-start"] = hexcode;
    new_style["incoming-background-end"] = adjustColor(hexcode, -35); // Slightly darker for gradient
    updateAssistantStyles();
}

function setOutgoingColor(hex) {
    new_style.outgoing = hex;
    exemple_style.outgoing = new_style.outgoing;
    
    // Update assistant outgoing background
    new_style["outgoing-background"] = hex;
    new_style["chat-icon-color"] = hex;
    new_style["button-background"] = hex;
    updateAssistantStyles();
}

/*
*   Couleur de fond
*/
const bg_color_input = document.getElementById("backgroundColors");
function setBackgroundColor(hex) {
    new_style["background-color"] = hex;
    exemple_style.backgroundColor = new_style["background-color"];
    
    // Update assistant background
    new_style["chatbot-background"] = hex;
    updateAssistantStyles();
}

/*
*   Couleur de la bordure
*/
const boreder_color_input = document.getElementById("borderColors");
function setBorderColor(hex) {
    new_style["border-color"] = hex
    exemple_style.borderColor = new_style["border-color"];
}

/*
*   Type de police 
*/
const font_family_input = document.getElementById("fontTypes");
function setFontType() {
    new_style["font-family"] = font_family_input.selectedOptions[0].value
    exemple_style.fontFamily = new_style["font-family"];
}
/*
* Set theme
*/
function setTheme(hexcodeBack,hexcodeOutgoing,hexcodeIncoming,hexcodeFont,hexcodeFontOutgoing){
    setBackgroundColor(hexcodeBack);
    setFontColor(hexcodeFont);
    setFontColorOutgoing(hexcodeFontOutgoing);
    setIncomingColor(hexcodeIncoming);
    setOutgoingColor(hexcodeOutgoing);
}

function updateAssistantStyles(){
    const chatbot= document.querySelector('.chatbot');
    const chatbox= document.querySelector('.chatbox');
    const outgoingChats= document.querySelector('.chatbox .outgoing p');
    const incomingChats= document.querySelector('.chatbox .incoming p');
    //    const chatIcon= document.querySelector('.chatbox .incoming span');
    const buttons= document.querySelector('.btn-grp button');
    
    if (chatbot){
        chatbot.style.background=new_style["chatbot-background"];
    }
    if (outgoingChats && outgoingChats.length > 0) {
        outgoingChats.forEach(chat => {
            chat.style.backgroundColor = new_style["outgoing-background"];
            chat.style.color = new_style["outgoing-text-color"];
        });
    }
    
    if (incomingChats && incomingChats.length > 0) {
        incomingChats.forEach(chat => {
            chat.style.background = new_style["incoming-background-start"];
            chat.style.background = `linear-gradient(90deg, ${new_style["incoming-background-start"]} 0%, ${new_style["incoming-background-end"]} 100%)`;
            chat.style.color = new_style["incoming-text-color"];
        });
    }
    /*    if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
        button.style.backgroundColor = new_style["button-background"];
    button.style.color = new_style["button-text-color"];
    });
    }*/
}
window.addEventListener('DOMContentLoaded',()=>{
    updateAssistantStyles();
})
//background, incoming text, outgoing, nfont, font incoming
function updateUI(hex1,hex2,hex3,hex4,hex5){
    setTheme(hex1,hex2,hex3,hex4,hex5)
    updateAssistantStyles();
}