// Consts
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const finishButton = document.getElementById("finishButton");
const okButton = document.getElementById("okButton");
const pageList = document.getElementById("pageList");
const lastPage = document.getElementById("lastPage");
const form = document.querySelector("form");
const form_data = await window.chatbot_app.get_form_data();
const questParPage = 5;

// Vars
var nbQuestPage = 0;
var nbPages = 0;
var currentPage = 1;

let datanotif= await window.chatbot_app.get_notif_data();

/**
 * 
 * @description Fonction d'initialisation du formulaire qui crée les pages et les questions
 * @returns {void}
 */
function initForm() {
    console.log("initForm");
    form.addEventListener("submit", submit, false);
    prevButton.addEventListener("click", prevPage, false);
    nextButton.addEventListener("click", nextPage, false);
    okButton.addEventListener("click", pressOkButton, false)

    let questions = form_data.questions;
    for (const q in questions) nbPages++;
    nbPages = Math.ceil(nbPages / questParPage);
    let newPage;
    let numPage = 0;

    for (const q in questions) {
        if (nbQuestPage == 0) {
            numPage++;
            newPage = document.createElement("div");
            newPage.setAttribute("id", "page" + numPage);
            newPage.setAttribute("class", "page");
            newPage.style.display = "none";

            let pageTitle = document.createElement("h3");
            pageTitle.textContent = "Page " + numPage + " / " + nbPages;
            newPage.appendChild(pageTitle);
        }
        
        let question = questions[q];
    
        let questionBox = document.createElement("div");
        questionBox.setAttribute("class", "question-box");
    
        let questionDiv = document.createElement("div");
        questionDiv.setAttribute("class", "question");
        questionDiv.textContent = question.question;
    
        let answerDiv = document.createElement("div");
        answerDiv.setAttribute("class", "answers");
    
        if (question.type == "text") {
            let input = document.createElement("input");
            input.type = "text";
            input.name = question.name;
            input.placeholder = question.placeholder || "";
            answerDiv.appendChild(input);
        } else if (question.type == "radio") {
            for (let i = 0; i < question.options.length; i++) {
                let answerSpan = document.createElement("span");
                answerSpan.setAttribute("class", "answerSpan");

                let label = document.createElement("label");
                label.textContent = question.options[i];
    
                let input = document.createElement("input");
                input.type = "radio";
                input.name = question.name;
                input.value = question.values[i];

                console.log("value : " + input.value);
    
                if(question.name === "notifications" && input.value === "false") {
                    input.checked = true;
                }

                answerSpan.appendChild(label);
                answerSpan.appendChild(input);
                answerDiv.appendChild(answerSpan);
            }
            if(question.name !== "notifications"){
                let answerSpan = document.createElement("span");
                answerSpan.setAttribute("class", "answerSpan");

                let label = document.createElement("label");
                label.textContent = "Non renseigné";

                let input = document.createElement("input");
                input.type = "radio";
                input.name = question.name;
                input.value = "";

                input.checked = true;
                answerSpan.appendChild(label);
                answerSpan.appendChild(input);
                answerDiv.appendChild(answerSpan);
            }
        }
    
        questionBox.appendChild(questionDiv);
        questionBox.appendChild(answerDiv);
        newPage.appendChild(questionBox);
        
        nbQuestPage++;
        if (nbQuestPage == questParPage) {
            nbQuestPage = 0;
            pageList.appendChild(newPage);
        }
    }

    pageList.appendChild(newPage);

    let page = document.getElementById("page1");
    if (page) {
        page.style.display = "block";
    }

    lastPage.style.display = "none";

    updateButtonDisplay();

}


/***********
 * Boutons *
 ***********/

/**
 * @description Fonction de redirection vers le menu
 * @param {*} event 
 * @returns {void}
 */
function pressOkButton(event) {
    console.log("ok");
    window.location = "../menu/menu.html";
}

/**
 * @description Fonction de soumission du formulaire
 * @param {Event} event
 * @returns {void}
 */
function submit(event) {
    event.preventDefault();
    console.log("submit");
    let data = new FormData(form);

    for(const entry of data) {
        form_data.answers[entry[0]] = entry[1];
        console.log(JSON.parse(JSON.stringify(form_data)));

    }
    form_data.done = true;
    window.chatbot_app.set_form_data(form_data);

    document.getElementById("form").style.display = "none";
    lastPage.style.display = "flex";
    notifFormulaire();
}

/**
 * @description Passage à la page suivante
 * @param {Event} event
 * @returns {void}
 */
function nextPage(event) {
    console.log("nextPage");
    if (currentPage < nbPages) {
        let page = document.getElementById("page" + currentPage);
        page.style.display = "none";
        currentPage++;
        page = document.getElementById("page" + currentPage);
        page.style.display = "block";
    }

    updateButtonDisplay();
}

/**
 * @description Passage à la page précédente
 * @param {Event} event
 * @returns {void}
 */
function prevPage(event) {
    console.log("prevPage");

    if (currentPage > 1) {
        let page = document.getElementById("page" + currentPage);
        page.style.display = "none";
        currentPage--;
        page = document.getElementById("page" + currentPage);
        page.style.display = "block";
    }

    updateButtonDisplay();
}

/**
 * @description Fonction d'affichage des boutons
 * @returns {void}
 */
function updateButtonDisplay() {
    if (currentPage == 1) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "block";
    }

    if (currentPage == nbPages) {
        nextButton.style.display = "none";
        finishButton.style.display = "block";
    } else {
        nextButton.style.display = "block";
        finishButton.style.display = "none";
    }
}

function notifFormulaire(){
    window.chatbot_app.get_form_data().then(formulaire => {
        console.log("form", formulaire);
        if(formulaire["answers"] == null || formulaire["answers"] == undefined) {
            console.log("formulaire vide");
            return;
        }
        else{
            const formData = formulaire["answers"];
            for (const key in formData) {
                if (formData["notifications"] ==="true") {
                    switch (key) {
                        case "risqueDenutrition":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueDenutrition"] = {
                                    message: "Pensez à manger.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueDeshydratation":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueDeshydratation"] = {
                                    message: "Pensez à boire.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueChute":
                        case "chutesFrequentes":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueChute"] = {
                                    message: "Faites attention aux tapis, escalier, sol glissante.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueIntoxInhalation":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueIntoxInhalation"] = {
                                    message: "Pensez à aérer les pièces.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueArmeFeu":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueArmeFeu"] = {
                                    message: "Attention aux armes à feu.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueEtouffement":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueEtouffement"] = {
                                    message: "Faites attentions à bien macher la nouriture.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: "12h00",
                                    id:key
                                };
                                datanotif["notif_def"]["risqueEtouffement2"] = {
                                    message: "Faites attentions à bien macher la nouriture.",
                                    intervalleTemp: null,
                                    targetTime: null,
                                    targetDate: "19h00",
                                    id:key+ "2"
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueIncendie":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueIncendie"] = {
                                    message: "Faites attention à bien fermer les plaques de cuisson.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                        case "risqueElectrocution":
                            if (formData[key] === "oui") {
                                datanotif["notif_def"]["risqueElectrocution"] = {
                                    message: "Faites attention à l'utilisation de vos prises.",
                                    intervalleTemp: 3600,
                                    targetTime: null,
                                    targetDate: null,
                                    id:key
                                };
                                window.chatbot_app.set_notif_data(datanotif);
                            }
                            break;
                    }
                }
            }
        }
    }).catch(error => {
        console.error("Error fetching form data:", error);
    });
}


initForm();