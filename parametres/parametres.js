var pFontSize;

function fontZoom() {
    pFontSize = (pFontSize >= 56 ? 56 : pFontSize + 5) 
    console.log("font size : " + pFontSize)
}

function fontDezoom() {
    pFontSize = (pFontSize <= 6 ? 6 : pFontSize - 5) 
    console.log("font size : " + pFontSize)
}

function loadParametres() {
    console.log("load paramètres")
    try{
        pFontSize = parseInt(localStorage.getItem("pFontSize"))
    }catch(error){
        console.log("Paramètres par défaut.")
        pFontSize = 16;
    }
}

function storeParametres() {
    localStorage.setItem("pFontSize", pFontSize)
}