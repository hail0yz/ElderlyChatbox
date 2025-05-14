var fontSize; // en pourcentage
var fontColor;
var backgroundColor;
var borderColor;
var fontType;

function loadParametres() {
    console.log("load paramètres")
    fontSize = parseInt(localStorage.getItem("fontSize"))
    if(Number.isNaN(fontSize)){
        console.log("Paramètres par défaut.")
        fontSize = 100;
    }
    document.body.style.fontSize = fontSize + "%"

    fontColor = localStorage.getItem("fontColor")
    if(fontColor == null){
        console.log("Paramètres par défaut.")
        fontColor = "black";
    }
    document.body.style.color = fontColor

    backgroundColor = localStorage.getItem("backgroundColor")
    if(backgroundColor == null){
        console.log("Paramètres par défaut.")
        backgroundColor = "white";
    }
    document.body.style.backgroundColor = backgroundColor

    borderColor = localStorage.getItem("borderColor")
    if(borderColor == null){
        console.log("Paramètres par défaut.")
        borderColor = "black";
    }
    document.body.style.borderColor = borderColor

    fontType = localStorage.getItem("fontType")
    if(fontType == null){
        console.log("Paramètres par défaut.")
        fontType = "Arial";
    }
    document.body.style.fontFamily = fontType
}

function storeParametres() {
    localStorage.setItem("fontSize", fontSize)
    localStorage.setItem("fontColor", fontColor)
    localStorage.setItem("backgroundColor", backgroundColor)
    localStorage.setItem("borderColor", borderColor)
    localStorage.setItem("fontType", fontType)
}

function updateExemple() {
    document.getElementById("exemple").style.fontSize = 16*fontSize/100 + "px"
    document.getElementById("exemple").style.color = fontColor
    document.getElementById("exemple").style.backgroundColor = backgroundColor
    document.getElementById("exemple").style.borderColor = borderColor
    document.getElementById("exemple").style.fontFamily = fontType
}

/*
*   Taille de la police
*/

function fontZoom() {
    fontSize = (fontSize >= 200 ? 200 : fontSize + 10) 
    updateExemple()
    console.log("font size : " + fontSize)
}

function fontDezoom() {
    fontSize = (fontSize <= 50 ? 50 : fontSize - 10) 
    updateExemple()
    console.log("font size : " + fontSize)
}

/*
*   Couleur de la police
*/

function setFontColor() {
    console.log("sfc font size : " + fontSize)
    fontColor = document.getElementById("fontColors").selectedOptions[0].value
    updateExemple()
    console.log("font color : " + fontColor)
}

/*
*   Couleur de fond
*/

function setBackgroundColor() {
    backgroundColor = document.getElementById("backgroundColors").selectedOptions[0].value
    updateExemple()
    console.log("background color : " + backgroundColor)
}

/*
*   Couleur de la bordure
*/

function setBorderColor() {
    borderColor = document.getElementById("borderColors").selectedOptions[0].value
    updateExemple()
    console.log("border color : " + borderColor)
}

/*
 *   Type de police 
 */

function setFontType() {
    fontType = document.getElementById("fontTypes").selectedOptions[0].value
    updateExemple()
    console.log("font type : " + fontType)
}