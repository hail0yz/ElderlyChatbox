function loadParametres() {
    console.log("load paramètres")
    pFontSize = parseInt(localStorage.getItem("pFontSize"))
    if(Number.isNaN(pFontSize)){
        console.log("Paramètres par défaut.")
        pFontSize = 100;
    }
    document.body.style.fontSize = pFontSize + "%"
}