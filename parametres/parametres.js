var defaultFontSize = 16; // en pixel
var pFontSize; // en pourcentage

function updateExemple() {
    document.getElementById("exemple").style.fontSize = 16*pFontSize/100 + "px"
}

function fontZoom() {
    pFontSize = (pFontSize >= 200 ? 200 : pFontSize + 10) 
    updateExemple()
    console.log("font size : " + pFontSize)
}

function fontDezoom() {
    pFontSize = (pFontSize <= 50 ? 50 : pFontSize - 10) 
    updateExemple()
    console.log("font size : " + pFontSize)
}

function loadParametres() {
    console.log("load paramètres")
    pFontSize = parseInt(localStorage.getItem("pFontSize"))
    if(Number.isNaN(pFontSize)){
        console.log("Paramètres par défaut.")
        pFontSize = 100;
    }
    document.body.style.fontSize = pFontSize + "%"
}

function storeParametres() {
    localStorage.setItem("pFontSize", pFontSize)
}