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
    "font-size": parseInt(root_css_style["font-size"].slice(0,-2))
};
console.log(new_style["font-size"]);
// Pour l'exemple et "se souvenir" de comment faire
const new_vars = {
    // var_name : var_value
    "red": "#ff0000"
};

const exemple_style = document.getElementById("exemple").style; 

function storeParametres() {
    new_style["font-size"] = `${new_style["font-size"]}px`;
    window.chatbot_app.update_css_settings({
        "usual_settings": new_style,
        "vars": {
            "red": "#ff0000"
        }
    });
    window.location.reload();
}


/*
*   Taille de la police
*/

function fontZoom() {
    console.log(new_style["font-size"]);
    if(new_style["font-size"] < 30) new_style["font-size"]+=2;
    exemple_style.fontSize = `${new_style["font-size"]}px`;
}

function fontDezoom() {
    if(new_style["font-size"] > 14) new_style["font-size"]-=2;
    exemple_style.fontSize = `${new_style["font-size"]}px`;
    console.log(new_style["font-size"]," - ",exemple_style.fontSize);
}

/*
*   Couleur de la police
*/
const font_color_input = document.getElementById("fontColors");
function setFontColor() {
    new_style.color = font_color_input.selectedOptions[0].value
    exemple_style.color = new_style.color;
}

/*
*   Couleur de fond
*/
const bg_color_input = document.getElementById("backgroundColors");
function setBackgroundColor() {
    new_style["background-color"] = bg_color_input.selectedOptions[0].value
    exemple_style.backgroundColor = new_style["background-color"];
}

/*
*   Couleur de la bordure
*/
const boreder_color_input = document.getElementById("borderColors");
function setBorderColor() {
    new_style["border-color"] = boreder_color_input.selectedOptions[0].value
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