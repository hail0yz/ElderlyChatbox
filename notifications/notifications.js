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